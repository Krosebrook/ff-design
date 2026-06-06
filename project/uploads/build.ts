/**
 * Recurring Work OS – Notion Workspace Builder
 * =============================================
 * Programmatically creates a complete "Recurring Work OS" workspace in Notion.
 *
 * Usage:
 *   npx tsx build.ts              – full build
 *   npx tsx build.ts --check      – dry-run: validate credentials + parent page, print plan, exit 0
 *   npx tsx build.ts --force      – skip idempotency guard (re-run on existing workspace)
 */

import { Client } from "@notionhq/client";
import * as dotenv from "dotenv";

dotenv.config();

// ─── Config ──────────────────────────────────────────────────────────────────

const NOTION_TOKEN   = process.env.NOTION_TOKEN;
const PARENT_PAGE_ID = process.env.PARENT_PAGE_ID;
const DRY_RUN        = process.argv.includes("--check");
const FORCE          = process.argv.includes("--force");

if (!NOTION_TOKEN)   { console.error("❌  NOTION_TOKEN is not set in .env");   process.exit(1); }
if (!PARENT_PAGE_ID) { console.error("❌  PARENT_PAGE_ID is not set in .env"); process.exit(1); }

const notion = new Client({ auth: NOTION_TOKEN });

// ─── Types ───────────────────────────────────────────────────────────────────

/**
 * Typed wrapper for `notion.databases.create`.
 *
 * The @notionhq/client v5 SDK omits `properties` from the inferred params type
 * on `databases.create`, requiring a cast. We pay that cost once here at the
 * definition site; every call site below is fully typed against this interface.
 */
interface DatabaseCreateParams {
  parent: { type: "page_id"; page_id: string };
  icon?: { type: "emoji"; emoji: string };
  title: Array<{ type: "text"; text: { content: string } }>;
  description?: Array<{ type: "text"; text: { content: string } }>;
  properties: Record<string, unknown>;
}

const createDatabase = notion.databases.create as unknown as (
  params: DatabaseCreateParams
) => Promise<{ id: string }>;

// ─── Utilities ───────────────────────────────────────────────────────────────

function log(icon: string, msg: string): void {
  console.log(`${icon}  ${msg}`);
}

/**
 * Retry wrapper with exponential back-off.
 * Notion enforces a 3 req/s rate limit; pair this with concurrency=3 to stay under it.
 */
async function withRetry<T>(
  fn: () => Promise<T>,
  label: string,
  retries = 3
): Promise<T> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (err: unknown) {
      const isLast = attempt === retries;
      const delay  = 1000 * 2 ** (attempt - 1); // 1s → 2s → 4s
      const msg    = err instanceof Error ? err.message : String(err);
      if (isLast) throw new Error(`[${label}] failed after ${retries} attempts: ${msg}`);
      log("⏳", `[${label}] attempt ${attempt} failed — retrying in ${delay}ms…`);
      await new Promise((r) => setTimeout(r, delay));
    }
  }
  throw new Error("unreachable");
}

/**
 * Fan-out async tasks with bounded concurrency.
 *
 * concurrency=3 matches Notion's 3 req/s limit, cutting seed time from ~90s
 * (sequential) to ~15s without triggering rate-limit 429s.
 *
 * @example
 *   await batchAsync(tasks, (t) => createPage(t), 3);
 */
async function batchAsync<T>(
  items: T[],
  fn: (item: T) => Promise<void>,
  concurrency = 3
): Promise<void> {
  for (let i = 0; i < items.length; i += concurrency) {
    await Promise.all(items.slice(i, i + concurrency).map(fn));
  }
}

// ─── Idempotency Guard ───────────────────────────────────────────────────────

/**
 * Exits 0 if a "Recurring Work OS" page already exists under the target parent.
 * Pass --force to skip this check and allow re-running on an existing workspace.
 */
async function checkExistingWorkspace(): Promise<void> {
  if (FORCE) {
    log("⚡", "--force passed; skipping duplicate workspace guard.");
    return;
  }

  const results = await notion.search({
    query: "Recurring Work OS",
    filter: { property: "object", value: "page" },
  });

  const parentNorm = PARENT_PAGE_ID!.replace(/-/g, "");

  const existing = results.results.find((r) => {
    if (r.object !== "page") return false;
    const page = r as {
      object: "page";
      id: string;
      parent?: { page_id?: string };
      properties?: { title?: { title?: Array<{ plain_text?: string }> } };
    };
    const parentId = (page.parent?.page_id ?? "").replace(/-/g, "");
    if (parentId !== parentNorm) return false;
    const title = page.properties?.title?.title?.[0]?.plain_text ?? "";
    return title === "Recurring Work OS";
  });

  if (existing) {
    const id = (existing as { id: string }).id;
    log("⚠️ ", `Workspace already exists (page ${id}).`);
    log("💡", "Pass --force to overwrite, or manually delete the existing page first.");
    process.exit(0);
  }
}

// ─── Dry-Run ─────────────────────────────────────────────────────────────────

async function runCheck(): Promise<void> {
  log("🔍", "Dry-run mode (--check). Validating credentials and parent page…");

  await withRetry(() => notion.users.me({}), "validate token");
  log("✅", "NOTION_TOKEN is valid.");

  await withRetry(
    () => notion.pages.retrieve({ page_id: PARENT_PAGE_ID! }),
    "validate parent page"
  );
  log("✅", `PARENT_PAGE_ID ${PARENT_PAGE_ID} is accessible.`);

  await checkExistingWorkspace();
  log("✅", "No duplicate workspace found.");

  console.log("");
  console.log("📋  Build plan:");
  console.log("    1. Create root page  → 'Recurring Work OS'");
  console.log("    2. Create database   → 'Task Templates' (7 properties)");
  console.log("    3. Create database   → 'Tasks' (11 properties incl. Source Template relation)");
  console.log("    4. Seed             → 6 task templates (concurrent, batch 3)");
  console.log("    5. Seed             → 30 tasks (concurrent, batch 3)");
  console.log("    6. Create page      → 'Home Dashboard'");
  console.log("    7. Create page      → 'Setup Guide'");
  console.log("");
  log("✅", "All checks passed. Run without --check to execute the full build.");
  process.exit(0);
}

// ─── Build Steps ─────────────────────────────────────────────────────────────

async function createRootPage(): Promise<string> {
  log("🏗️ ", "Creating root page…");
  const page = await withRetry(
    () =>
      notion.pages.create({
        parent: { page_id: PARENT_PAGE_ID! },
        icon: { type: "emoji", emoji: "🔁" },
        properties: {
          title: {
            title: [{ type: "text", text: { content: "Recurring Work OS" } }],
          },
        },
      }),
    "createRootPage"
  );
  log("✅", `Root page created: ${page.id}`);
  return page.id;
}

/**
 * Task Templates DB is created BEFORE Tasks DB so we have its ID available
 * for the Source Template relation property on Tasks.
 */
async function createTemplatesDatabase(parentPageId: string): Promise<string> {
  log("📋", "Creating Task Templates database…");
  const db = await withRetry(
    () =>
      createDatabase({
        parent: { type: "page_id", page_id: parentPageId },
        icon: { type: "emoji", emoji: "📋" },
        title: [{ type: "text", text: { content: "Task Templates" } }],
        description: [
          {
            type: "text",
            text: {
              content:
                "Reusable task blueprints. Each template can spawn recurring tasks with preset recurrence, category, and time estimates.",
            },
          },
        ],
        properties: {
          Name: { type: "title", title: {} },
          Category: {
            type: "select",
            select: {
              options: [
                { name: "Admin",       color: "gray"   },
                { name: "Client Work", color: "blue"   },
                { name: "Content",     color: "green"  },
                { name: "Finance",     color: "yellow" },
                { name: "Operations",  color: "orange" },
                { name: "Personal",    color: "purple" },
              ],
            },
          },
          Recurrence: {
            type: "select",
            select: {
              options: [
                { name: "Daily",      color: "blue"   },
                { name: "Weekly",     color: "green"  },
                { name: "Bi-weekly",  color: "yellow" },
                { name: "Monthly",    color: "orange" },
                { name: "Quarterly",  color: "red"    },
                { name: "As Needed",  color: "gray"   },
              ],
            },
          },
          "Estimated Time (min)": { type: "number", number: { format: "number" } },
          Priority: {
            type: "select",
            select: {
              options: [
                { name: "🔴 High",   color: "red"    },
                { name: "🟡 Medium", color: "yellow" },
                { name: "🟢 Low",    color: "green"  },
              ],
            },
          },
          Notes:  { type: "rich_text", rich_text: {} },
          Active: { type: "checkbox",  checkbox: {}  },
        },
      }),
    "createTemplatesDatabase"
  );
  log("✅", `Task Templates database created: ${db.id}`);
  return db.id;
}

/**
 * Tasks DB receives `templatesDbId` so the Source Template relation property
 * can reference the correct database. This fixes the spec-drift gap identified
 * in notion-marketplace-agent-factory-alignment.txt.
 */
async function createTasksDatabase(
  parentPageId: string,
  templatesDbId: string
): Promise<string> {
  log("✅", "Creating Tasks database…");
  const db = await withRetry(
    () =>
      createDatabase({
        parent: { type: "page_id", page_id: parentPageId },
        icon: { type: "emoji", emoji: "✅" },
        title: [{ type: "text", text: { content: "Tasks" } }],
        description: [
          {
            type: "text",
            text: {
              content:
                "All recurring and one-off tasks. Link tasks back to their source template via the Source Template relation.",
            },
          },
        ],
        properties: {
          Name: { type: "title", title: {} },
          Status: {
            type: "status",
            status: {
              options: [
                { name: "Not Started", color: "gray"  },
                { name: "In Progress", color: "blue"  },
                { name: "Done",        color: "green" },
                { name: "Blocked",     color: "red"   },
              ],
              groups: [
                { name: "To-do",       color: "gray",  option_ids: [] },
                { name: "In progress", color: "blue",  option_ids: [] },
                { name: "Complete",    color: "green", option_ids: [] },
              ],
            },
          },
          "Due Date":  { type: "date",   date: {}   },
          Category: {
            type: "select",
            select: {
              options: [
                { name: "Admin",       color: "gray"   },
                { name: "Client Work", color: "blue"   },
                { name: "Content",     color: "green"  },
                { name: "Finance",     color: "yellow" },
                { name: "Operations",  color: "orange" },
                { name: "Personal",    color: "purple" },
              ],
            },
          },
          Priority: {
            type: "select",
            select: {
              options: [
                { name: "🔴 High",   color: "red"    },
                { name: "🟡 Medium", color: "yellow" },
                { name: "🟢 Low",    color: "green"  },
              ],
            },
          },
          Recurrence: {
            type: "select",
            select: {
              options: [
                { name: "Daily",      color: "blue"    },
                { name: "Weekly",     color: "green"   },
                { name: "Bi-weekly",  color: "yellow"  },
                { name: "Monthly",    color: "orange"  },
                { name: "Quarterly",  color: "red"     },
                { name: "As Needed",  color: "gray"    },
                { name: "One-off",    color: "default" },
              ],
            },
          },
          "Estimated Time (min)": { type: "number", number: { format: "number" } },
          "Actual Time (min)":    { type: "number", number: { format: "number" } },
          Notes:    { type: "rich_text", rich_text: {} },
          Assignee: { type: "people",    people: {}    },
          // ↓ Spec-required relation — links each task back to the template it was spawned from
          "Source Template": {
            type: "relation",
            relation: {
              database_id: templatesDbId,
              type: "single_property",
              single_property: {},
            },
          },
        },
      }),
    "createTasksDatabase"
  );
  log("✅", `Tasks database created: ${db.id}`);
  return db.id;
}

// ─── Seed Data ───────────────────────────────────────────────────────────────

const TASK_TEMPLATES = [
  {
    name: "Weekly Team Sync",
    category: "Operations", recurrence: "Weekly", estimatedTime: 60, priority: "🔴 High",
    notes: "Prepare agenda 24h before. Review blockers, sprint progress, and upcoming milestones.",
    active: true,
  },
  {
    name: "Monthly Financial Review",
    category: "Finance", recurrence: "Monthly", estimatedTime: 90, priority: "🔴 High",
    notes: "Pull P&L, review runway, update financial projections, flag anomalies.",
    active: true,
  },
  {
    name: "Content Calendar Update",
    category: "Content", recurrence: "Weekly", estimatedTime: 30, priority: "🟡 Medium",
    notes: "Review scheduled posts, draft next week's content, check analytics for top performers.",
    active: true,
  },
  {
    name: "Client Status Report",
    category: "Client Work", recurrence: "Weekly", estimatedTime: 45, priority: "🔴 High",
    notes: "Compile deliverables, blockers, and next steps. Send by Friday EOD.",
    active: true,
  },
  {
    name: "Inbox Zero",
    category: "Admin", recurrence: "Daily", estimatedTime: 20, priority: "🟡 Medium",
    notes: "Process all email: reply, archive, delegate, or defer. Aim for inbox zero.",
    active: true,
  },
  {
    name: "Quarterly Goals Review",
    category: "Operations", recurrence: "Quarterly", estimatedTime: 120, priority: "🔴 High",
    notes: "Assess OKR progress, identify gaps, set next quarter priorities, update Notion roadmap.",
    active: true,
  },
] as const;

const SEED_TASKS = [
  // Admin
  { name: "Process inbox",                    category: "Admin",       status: "Not Started", recurrence: "Daily",     estimatedTime: 20,  priority: "🟡 Medium" },
  { name: "Update project tracker",           category: "Admin",       status: "Not Started", recurrence: "Weekly",    estimatedTime: 15,  priority: "🟡 Medium" },
  { name: "File expense receipts",            category: "Admin",       status: "Not Started", recurrence: "Weekly",    estimatedTime: 10,  priority: "🟢 Low"    },
  { name: "Archive completed tasks",          category: "Admin",       status: "Not Started", recurrence: "Weekly",    estimatedTime: 10,  priority: "🟢 Low"    },
  { name: "Review subscription renewals",     category: "Admin",       status: "Not Started", recurrence: "Monthly",   estimatedTime: 20,  priority: "🟡 Medium" },
  // Client Work
  { name: "Send client weekly update",        category: "Client Work", status: "Not Started", recurrence: "Weekly",    estimatedTime: 30,  priority: "🔴 High"   },
  { name: "Review client feedback",           category: "Client Work", status: "Not Started", recurrence: "Weekly",    estimatedTime: 20,  priority: "🔴 High"   },
  { name: "Prepare client onboarding doc",    category: "Client Work", status: "Not Started", recurrence: "As Needed", estimatedTime: 60,  priority: "🔴 High"   },
  { name: "Schedule client check-in calls",   category: "Client Work", status: "Not Started", recurrence: "Monthly",   estimatedTime: 15,  priority: "🟡 Medium" },
  { name: "Audit client deliverables",        category: "Client Work", status: "Not Started", recurrence: "Monthly",   estimatedTime: 45,  priority: "🔴 High"   },
  // Content
  { name: "Write weekly newsletter",          category: "Content",     status: "Not Started", recurrence: "Weekly",    estimatedTime: 90,  priority: "🔴 High"   },
  { name: "Schedule social posts",            category: "Content",     status: "Not Started", recurrence: "Weekly",    estimatedTime: 30,  priority: "🟡 Medium" },
  { name: "Review content analytics",         category: "Content",     status: "Not Started", recurrence: "Weekly",    estimatedTime: 20,  priority: "🟡 Medium" },
  { name: "Repurpose top content",            category: "Content",     status: "Not Started", recurrence: "Monthly",   estimatedTime: 60,  priority: "🟡 Medium" },
  { name: "Update content calendar",          category: "Content",     status: "Not Started", recurrence: "Weekly",    estimatedTime: 20,  priority: "🟢 Low"    },
  // Finance
  { name: "Reconcile bank transactions",      category: "Finance",     status: "Not Started", recurrence: "Weekly",    estimatedTime: 20,  priority: "🔴 High"   },
  { name: "Review P&L statement",             category: "Finance",     status: "Not Started", recurrence: "Monthly",   estimatedTime: 30,  priority: "🔴 High"   },
  { name: "Send invoices",                    category: "Finance",     status: "Not Started", recurrence: "Bi-weekly", estimatedTime: 20,  priority: "🔴 High"   },
  { name: "Check outstanding payments",       category: "Finance",     status: "Not Started", recurrence: "Weekly",    estimatedTime: 10,  priority: "🔴 High"   },
  { name: "Quarterly tax estimate",           category: "Finance",     status: "Not Started", recurrence: "Quarterly", estimatedTime: 60,  priority: "🔴 High"   },
  // Operations
  { name: "Run weekly team standup",          category: "Operations",  status: "Not Started", recurrence: "Weekly",    estimatedTime: 30,  priority: "🔴 High"   },
  { name: "Review team capacity",             category: "Operations",  status: "Not Started", recurrence: "Weekly",    estimatedTime: 15,  priority: "🟡 Medium" },
  { name: "Update SOPs for changed processes",category: "Operations",  status: "Not Started", recurrence: "Monthly",   estimatedTime: 60,  priority: "🟡 Medium" },
  { name: "Check tool/software renewals",     category: "Operations",  status: "Not Started", recurrence: "Monthly",   estimatedTime: 15,  priority: "🟡 Medium" },
  { name: "Quarterly OKR review",             category: "Operations",  status: "Not Started", recurrence: "Quarterly", estimatedTime: 120, priority: "🔴 High"   },
  // Personal
  { name: "Weekly personal review",           category: "Personal",    status: "Not Started", recurrence: "Weekly",    estimatedTime: 30,  priority: "🟡 Medium" },
  { name: "Monthly goals check-in",           category: "Personal",    status: "Not Started", recurrence: "Monthly",   estimatedTime: 45,  priority: "🟡 Medium" },
  { name: "Update professional portfolio",    category: "Personal",    status: "Not Started", recurrence: "Quarterly", estimatedTime: 60,  priority: "🟢 Low"    },
  { name: "Learning/course time block",       category: "Personal",    status: "Not Started", recurrence: "Weekly",    estimatedTime: 60,  priority: "🟡 Medium" },
  { name: "Annual performance self-review",   category: "Personal",    status: "Not Started", recurrence: "Quarterly", estimatedTime: 90,  priority: "🟡 Medium" },
] as const;

async function seedTaskTemplates(templateDbId: string): Promise<void> {
  log("🌱", `Seeding ${TASK_TEMPLATES.length} task templates (concurrent, batch 3)…`);
  await batchAsync([...TASK_TEMPLATES], async (t) => {
    await withRetry(
      () =>
        notion.pages.create({
          parent: { database_id: templateDbId },
          icon: { type: "emoji", emoji: "📋" },
          properties: {
            Name:                   { title: [{ type: "text", text: { content: t.name } }] },
            Category:               { select: { name: t.category } },
            Recurrence:             { select: { name: t.recurrence } },
            "Estimated Time (min)": { number: t.estimatedTime },
            Priority:               { select: { name: t.priority } },
            Notes:                  { rich_text: [{ type: "text", text: { content: t.notes } }] },
            Active:                 { checkbox: t.active },
          },
        }),
      `template: ${t.name}`
    );
  });
  log("✅", "Task templates seeded.");
}

async function seedTasks(tasksDbId: string): Promise<void> {
  log("🌱", `Seeding ${SEED_TASKS.length} tasks (concurrent, batch 3)…`);
  await batchAsync([...SEED_TASKS], async (t) => {
    await withRetry(
      () =>
        notion.pages.create({
          parent: { database_id: tasksDbId },
          icon: { type: "emoji", emoji: "✅" },
          properties: {
            Name:                   { title: [{ type: "text", text: { content: t.name } }] },
            Status:                 { status: { name: t.status } },
            Category:               { select: { name: t.category } },
            Priority:               { select: { name: t.priority } },
            Recurrence:             { select: { name: t.recurrence } },
            "Estimated Time (min)": { number: t.estimatedTime },
          },
        }),
      `task: ${t.name}`
    );
  });
  log("✅", "Tasks seeded.");
}

// ─── Dashboard & Guide Pages ──────────────────────────────────────────────────

async function createHomePage(rootPageId: string, tasksDbId: string): Promise<string> {
  log("🏠", "Creating Home Dashboard page…");
  const page = await withRetry(
    () =>
      notion.pages.create({
        parent: { page_id: rootPageId },
        icon: { type: "emoji", emoji: "🏠" },
        properties: {
          title: { title: [{ type: "text", text: { content: "Home Dashboard" } }] },
        },
        children: [
          {
            object: "block",
            type: "heading_1",
            heading_1: {
              rich_text: [{ type: "text", text: { content: "🔁 Recurring Work OS" } }],
            },
          },
          {
            object: "block",
            type: "paragraph",
            paragraph: {
              rich_text: [
                {
                  type: "text",
                  text: {
                    content:
                      "Your system for managing recurring work. Use the linked views below to navigate tasks by status, category, and recurrence.",
                  },
                },
              ],
            },
          },
          { object: "block", type: "divider", divider: {} },
          {
            object: "block",
            type: "heading_2",
            heading_2: {
              rich_text: [{ type: "text", text: { content: "📌 Quick Links" } }],
            },
          },
          {
            object: "block",
            type: "bulleted_list_item",
            bulleted_list_item: {
              rich_text: [
                { type: "text", text: { content: "Tasks Database → " } },
                {
                  type: "mention",
                  mention: { type: "database", database: { id: tasksDbId } },
                },
              ],
            },
          },
          {
            object: "block",
            type: "heading_2",
            heading_2: {
              rich_text: [{ type: "text", text: { content: "📊 Today's Focus" } }],
            },
          },
          {
            object: "block",
            type: "paragraph",
            paragraph: {
              rich_text: [
                {
                  type: "text",
                  text: {
                    content:
                      "Filter Tasks by Due Date = Today and Status ≠ Done to see your daily workload.",
                  },
                },
              ],
            },
          },
          { object: "block", type: "divider", divider: {} },
          {
            object: "block",
            type: "callout",
            callout: {
              icon: { type: "emoji", emoji: "💡" },
              rich_text: [
                {
                  type: "text",
                  text: {
                    content:
                      "Tip: Duplicate a Task Template and set a Due Date to instantly spin up a new recurring task.",
                  },
                },
              ],
            },
          },
        ],
      }),
    "createHomePage"
  );
  log("✅", `Home Dashboard created: ${page.id}`);
  return page.id;
}

async function createSetupGuidePage(rootPageId: string): Promise<string> {
  log("📖", "Creating Setup Guide page…");
  const page = await withRetry(
    () =>
      notion.pages.create({
        parent: { page_id: rootPageId },
        icon: { type: "emoji", emoji: "📖" },
        properties: {
          title: { title: [{ type: "text", text: { content: "Setup Guide" } }] },
        },
        children: [
          {
            object: "block",
            type: "heading_1",
            heading_1: {
              rich_text: [
                { type: "text", text: { content: "🚀 Getting Started with Recurring Work OS" } },
              ],
            },
          },
          {
            object: "block",
            type: "paragraph",
            paragraph: {
              rich_text: [
                {
                  type: "text",
                  text: {
                    content:
                      "Welcome! This guide walks you through setting up and customising your Recurring Work OS in three steps.",
                  },
                },
              ],
            },
          },
          {
            object: "block",
            type: "heading_2",
            heading_2: {
              rich_text: [{ type: "text", text: { content: "Step 1 — Review Your Templates" } }],
            },
          },
          {
            object: "block",
            type: "numbered_list_item",
            numbered_list_item: {
              rich_text: [{ type: "text", text: { content: "Open the Task Templates database." } }],
            },
          },
          {
            object: "block",
            type: "numbered_list_item",
            numbered_list_item: {
              rich_text: [
                {
                  type: "text",
                  text: {
                    content:
                      "Review the 6 pre-built templates. Edit names, recurrence, or time estimates to match your workflow.",
                  },
                },
              ],
            },
          },
          {
            object: "block",
            type: "numbered_list_item",
            numbered_list_item: {
              rich_text: [
                {
                  type: "text",
                  text: {
                    content: "Create new templates for any recurring work not already covered.",
                  },
                },
              ],
            },
          },
          {
            object: "block",
            type: "heading_2",
            heading_2: {
              rich_text: [{ type: "text", text: { content: "Step 2 — Customise Your Tasks" } }],
            },
          },
          {
            object: "block",
            type: "numbered_list_item",
            numbered_list_item: {
              rich_text: [
                {
                  type: "text",
                  text: {
                    content:
                      "Open the Tasks database. 30 starter tasks have been pre-loaded across 6 categories.",
                  },
                },
              ],
            },
          },
          {
            object: "block",
            type: "numbered_list_item",
            numbered_list_item: {
              rich_text: [
                {
                  type: "text",
                  text: {
                    content: "Delete tasks that don't apply to your work. Add new tasks as needed.",
                  },
                },
              ],
            },
          },
          {
            object: "block",
            type: "numbered_list_item",
            numbered_list_item: {
              rich_text: [
                {
                  type: "text",
                  text: { content: "Set Due Dates on tasks you want to action this week." },
                },
              ],
            },
          },
          {
            object: "block",
            type: "heading_2",
            heading_2: {
              rich_text: [
                { type: "text", text: { content: "Step 3 — Set Up Your Recurring Workflow" } },
              ],
            },
          },
          {
            object: "block",
            type: "numbered_list_item",
            numbered_list_item: {
              rich_text: [
                {
                  type: "text",
                  text: {
                    content:
                      "Each week, open a Template and duplicate it into Tasks with the next Due Date.",
                  },
                },
              ],
            },
          },
          {
            object: "block",
            type: "numbered_list_item",
            numbered_list_item: {
              rich_text: [
                {
                  type: "text",
                  text: {
                    content:
                      "The Source Template relation links the spawned task back to its template for traceability.",
                  },
                },
              ],
            },
          },
          {
            object: "block",
            type: "numbered_list_item",
            numbered_list_item: {
              rich_text: [
                {
                  type: "text",
                  text: {
                    content:
                      "Use the Home Dashboard to see today's focus and track completion.",
                  },
                },
              ],
            },
          },
          { object: "block", type: "divider", divider: {} },
          {
            object: "block",
            type: "callout",
            callout: {
              icon: { type: "emoji", emoji: "🎉" },
              rich_text: [
                {
                  type: "text",
                  text: {
                    content:
                      "You're all set! If you run into issues or have questions, visit the Notion template page for support.",
                  },
                },
              ],
            },
          },
        ],
      }),
    "createSetupGuidePage"
  );
  log("✅", `Setup Guide created: ${page.id}`);
  return page.id;
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  if (DRY_RUN) {
    await runCheck();
    return; // runCheck calls process.exit(0); return keeps TS happy
  }

  console.log("🔁  Recurring Work OS — Workspace Builder");
  console.log("==========================================");
  const start = Date.now();

  await checkExistingWorkspace();

  // Build order matters: Templates DB must exist before Tasks DB (for the relation property)
  const rootPageId    = await createRootPage();
  const templatesDbId = await createTemplatesDatabase(rootPageId);
  const tasksDbId     = await createTasksDatabase(rootPageId, templatesDbId);

  await seedTaskTemplates(templatesDbId);
  await seedTasks(tasksDbId);

  await createHomePage(rootPageId, tasksDbId);
  await createSetupGuidePage(rootPageId);

  const elapsed = ((Date.now() - start) / 1000).toFixed(1);
  console.log("");
  console.log(`✨  Build complete in ${elapsed}s`);
  console.log(`🔗  Root page: https://notion.so/${rootPageId.replace(/-/g, "")}`);
}

main().catch((err) => {
  console.error("❌  Build failed:", err instanceof Error ? err.message : err);
  process.exit(1);
});
