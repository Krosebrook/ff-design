---
title: "Claude Catalyst by INT — Copilot Studio Knowledge Base"
purpose: "Content feed for the Microsoft Copilot Studio agent deployed to INT SharePoint (INT-Teaching-With-Claude project)"
format: "Structured knowledge articles for Copilot Studio ingestion"
date: "2026-03-14"
version: "2.0"
---

# Claude Catalyst by INT — Knowledge Base Content

This document contains structured content optimized for Microsoft Copilot Studio agent ingestion. Each section maps to a topic the Claude Catalyst teaching agent can answer. Content follows INT's pedagogical progression: TL;DR → Analogy → Concrete Example → Technical Detail.

All information verified against docs.claude.com, support.claude.com, and claude.com/pricing as of March 2026.

---

## TOPIC 01: What Is Claude?

**TL;DR:** Claude is an AI assistant made by Anthropic that helps you write, analyze, research, code, and create documents through natural conversation. It's the most capable AI for long-form writing, complex coding, and precise instruction following.

**Analogy:** Think of Claude as a brilliant team member who can read thousands of pages in seconds, write in any style, build software, automate browser tasks, and produce polished deliverables — but always checks with you before making important decisions.

**Concrete Example:** You paste a 50-page contract into Claude and ask "Summarize the key obligations and flag any unusual clauses." Claude reads the entire document and returns a structured summary with specific clause references in under a minute. Then you say "Now create a Word doc with a risk assessment table for my team" — and Claude generates a formatted .docx file you can download and share.

**Key Facts:**
- Available at claude.ai (web), mobile apps (iOS/Android), and a full-featured desktop app (Mac, Windows, Linux)
- Made by Anthropic, a safety-focused AI company founded in 2021
- Current model family: Claude 4.6 (released Feb 2026)
  - Opus 4.6: Most intelligent model, 1M token context window (beta), agent teams capability, 128K output tokens
  - Sonnet 4.6: Balanced speed and intelligence, 1M token context window (beta), best value for daily work
  - Haiku 4.5: Fastest and most affordable, 200K context, ideal for quick tasks
- Plans: Free (limited), Pro ($20/mo), Max ($100-200/mo), Team ($25-150/seat), Enterprise (custom), Education (university-wide)
- SOC 2 Type II certified; HIPAA-eligible on Enterprise; data never used for training on API/Enterprise plans

**INT Context:** INT uses Claude as our primary AI platform across all departments for documentation, code review, client deliverables, internal training, and workflow automation. Every INT employee should have at minimum a Pro account. Engineering and AI team members should be on Max.

---

## TOPIC 02: How to Use Claude.ai

**TL;DR:** Go to claude.ai, type what you need in the chat box, and Claude responds. You can upload files, search the web, ask follow-up questions, create documents, and connect Claude to your tools — all in one conversation.

**Analogy:** Using Claude is like texting with a colleague who happens to be an expert in everything, has access to your files, can search the internet, and can produce finished deliverables on the spot.

**Concrete Example:** "Help me draft an email to a client about the project delay. Keep it professional but empathetic. The delay is 2 weeks due to infrastructure issues." Claude writes the email. You say "Make it shorter and add a proposed new timeline." Claude revises. You say "Now search the web for best practices on communicating project delays to enterprise clients." Claude searches and incorporates research.

**Key Features for INT Staff:**
- **Web Search:** Claude searches the internet for current information and cites its sources with inline references. Works automatically when it detects you need current data.
- **File Upload:** Drag and drop PDFs, images, spreadsheets, code files, Word docs, and presentations for analysis. Claude can read and reason about the content.
- **File Creation:** Claude creates Word docs (.docx), PowerPoints (.pptx), Excel spreadsheets (.xlsx), PDFs, and code files you can download directly.
- **Memory:** Claude remembers your role, preferences, and ongoing work across conversations. It builds a personal profile of how you work over time. You can add explicit memory edits via Settings > Memory.
- **Styles:** Customize Claude's writing voice for INT brand communications. Set a default style or switch per conversation.
- **Extended Thinking:** On Pro and above, Claude can think through complex problems step-by-step before responding, improving accuracy on hard tasks.
- **Deep Research:** Hand Claude a research question and it conducts multi-step investigation across dozens of sources, producing a comprehensive report.

**How to Access:**
- Web: claude.ai (any browser)
- Desktop App: claude.com/download (Mac, Windows, Linux)
- Mobile: iOS App Store / Google Play Store
- All surfaces sync — start on desktop, continue on mobile

---

## TOPIC 03: Projects

**TL;DR:** Projects are organized workspaces where you set persistent instructions and pin reference documents, so Claude always has the right context for a specific topic or client.

**Analogy:** A Project is like having a dedicated desk in a shared office. Your reference materials are always there, your preferences are set, and anyone who sits at that desk knows the rules. Different projects = different desks with different contexts.

**Concrete Example:** Create a Project called "Client ABC Onboarding" with instructions: "You are helping onboard Client ABC to Claude. They are a healthcare company with HIPAA requirements. Always mention compliance considerations. Use formal tone." Pin their SOW, org chart, and technical requirements doc. Every conversation in this Project automatically has this context loaded.

**Setup Steps:**
1. Click "Projects" in the sidebar (claude.ai or Desktop app)
2. Click "New Project"
3. Write custom instructions (Claude's role, rules, output format, compliance requirements)
4. Upload knowledge files — SOPs, specs, templates, org charts, process docs (these stay pinned)
5. Start conversations within the project — all context is pre-loaded every time

**INT Use Cases:**
- One Project per client engagement (client context, SOW, requirements always loaded)
- One Project per internal department (Service Desk, OD, Engineering, Sales)
- One Project per recurring deliverable type (proposals, assessments, reports)
- One Project per training program (Claude Catalyst, AI enablement)

**Tips:**
- Keep instructions specific — vague instructions produce vague outputs
- Pin the most critical 3-5 documents rather than everything
- Memory within Projects is separate from your global Claude memory
- Available on Pro, Max, Team, and Enterprise plans (not Free)

---

## TOPIC 04: Memory

**TL;DR:** Claude remembers details about you across conversations — your role, preferences, ongoing work, communication style — so you don't repeat yourself every time.

**Analogy:** Memory is like Claude keeping a personal notebook about you. After a few conversations, it knows your job title, your preferred output format, which projects you're tracking, and how you like things structured. It's not perfect recall — more like a colleague who gradually learns your working style.

**How It Works:**
- Memory builds automatically from your conversations (background process, updated periodically)
- Each Project has its own separate memory space
- You can add explicit memory edits: "Always remember I prefer bullet points" or "I'm a PM at INT Inc."
- You can view and delete specific memories via Settings > Memory
- Incognito conversations don't generate memories
- Recent conversations may not be reflected yet — there's a processing delay
- Deleting conversations eventually removes derived memories (nightly process)

**What to Tell Claude to Remember:**
- Your role at INT and your department
- Your preferred communication style (direct, formal, casual)
- Your preferred document format and structure
- Recurring tools, clients, or workflows you work with
- Compliance requirements for your department
- Key acronyms or terminology your team uses

**Pro Tips:**
- If Claude seems to have forgotten something, explicitly remind it — memory isn't comprehensive
- Use "Remember that..." or "Please remember..." to trigger an explicit memory save
- Review your memories periodically to clean up outdated info
- Memory is available on Pro, Max, Team, and Enterprise plans

---

## TOPIC 05: Connectors (MCP Integrations)

**TL;DR:** Connectors let Claude directly access your tools — Notion, Google Drive, Gmail, Slack, Jira, GitHub, and 50+ others — so it can search, read, create, and update without you copy-pasting anything.

**Analogy:** Connectors are like giving Claude keys to your office filing cabinets, your email, and your project management board. Instead of you fetching documents and pasting them in, Claude goes and gets what it needs directly.

**Concrete Example:** "Search my Google Drive for the Q3 client report and summarize the key metrics. Then check my Gmail for any recent messages from the client about next quarter." Claude connects to Drive, finds the file, reads it, searches Gmail, and gives you a unified summary — all in one conversation.

**How Connectors Work:**
- Connectors use the Model Context Protocol (MCP) — an open standard by Anthropic
- Each connector is an MCP server that bridges Claude to a specific service
- You authenticate once, then Claude can access that service in any conversation
- Connectors can be enabled/disabled per conversation using the Connectors dropdown
- Team and Enterprise admins can manage which connectors are allowed org-wide

**Available Connectors at INT (partial list):**
- Google Drive — search and read files (Docs, Sheets, Slides, PDFs)
- Gmail — search and read emails, draft responses
- Google Calendar — view events, find free time, create events
- Notion — search pages, databases, create and update content
- Jira / Atlassian — search issues, sprints, Confluence wiki
- GitHub — repo access, issue tracking, PR lifecycle
- Slack — via Zapier connector for status updates, channel queries
- Zapier — connects to 6000+ apps for custom automations
- n8n — INT automation workflows via custom MCP endpoint
- Sentry — error tracking, issue resolution, performance monitoring
- Linear — issue tracking and project management
- Figma — design file access and diagram generation
- DocuSign — document signing workflows
- Salesforce / HubSpot — CRM data access

**How to Enable:**
1. Click your initials (bottom left) > Settings > Connectors in Claude Desktop (or claude.ai settings)
2. Browse available connectors
3. Click the connector you want and authenticate with your credentials
4. Claude can now access that service in any conversation where the connector is toggled on

**Desktop Extensions (.mcpb):**
- One-click MCP installation packages for the Desktop app
- Admin-controlled on Team and Enterprise plans
- Available via the plugin marketplace (Customize > Plugins in Desktop)

---

## TOPIC 06: Artifacts

**TL;DR:** Artifacts are interactive creations that appear in a side panel — code, documents, charts, diagrams, dashboards, even full applications. You can edit, iterate, publish, and share them.

**Analogy:** If a regular chat message is Claude writing on a whiteboard, an Artifact is Claude building something on a workbench next to you. You can inspect it, ask for changes, test it, and when it's ready, share it with others via a link.

**Concrete Example:** "Create an interactive dashboard that shows our monthly ticket counts by category with a date filter." Claude builds a React-based chart in the Artifact panel. You say "Add a bar chart view and change the color scheme to match INT branding." Claude updates it live. You click Publish and share the link with your team — they can use it without a Claude account.

**What Can Be an Artifact?**
- Interactive charts and dashboards (Recharts, D3, Plotly, Chart.js)
- React applications and components with full interactivity
- HTML/CSS/JS web pages and tools
- Markdown documents and reports
- Mermaid diagrams (flowcharts, org charts, sequence diagrams, Gantt charts)
- SVG graphics and illustrations
- Code in any language
- Calculators, forms, and interactive tools
- Games and simulations

**Key Capabilities:**
- Artifacts can use persistent storage to save data across sessions
- Published artifacts get a shareable link anyone can access
- Pro, Max, Team, and Enterprise users can generate embed codes
- Artifacts render in real-time as Claude streams the code
- You can iterate with natural language: "make the header bigger" or "add a dark mode toggle"

**INT Use Cases:**
- Assessment tools for HumanX conference and client discovery
- Interactive training materials for client onboarding programs
- Data visualizations for reporting and executive briefings
- Prototype tools and calculators before committing to full development
- ROI calculators for sales conversations
- Process flow diagrams for SOPs and client deliverables

---

## TOPIC 07: Claude Desktop App

**TL;DR:** The Claude Desktop app is a native application for Mac, Windows, and Linux that gives you three modes: Chat (conversation), Cowork (autonomous agent for knowledge work), and Code (AI-powered software development). It's the most powerful way to use Claude.

**Analogy:** The Desktop app is like having three specialists in one app. Chat mode is your quick-answer colleague. Cowork mode is your autonomous assistant who can organize files, research topics, and produce deliverables while you do other work. Code mode is your pair programmer who reads your entire codebase and ships features.

**Three Modes:**

### Chat Mode
- Same as claude.ai but in a native app
- Faster, stays in your dock/taskbar, keyboard shortcuts
- Quick access from any app without switching windows (hotkey)
- Snap screenshots, share windows, drag files directly into chat
- Voice input for hands-free brainstorming

### Cowork Mode (Research Preview)
- **Autonomous agent** for non-coding tasks — describe an outcome, step away, come back to finished work
- Direct local file access — reads and writes files on your computer
- Sub-agent coordination — breaks complex work into parallel tasks
- Professional outputs — Word docs, Excel spreadsheets, PowerPoints, PDFs with real formatting
- **Scheduled tasks** — set up recurring tasks (daily briefings, weekly reports, file cleanup) via /schedule command
- **Plugins** — bundles of skills, connectors, and commands for specific roles (PM, legal, finance, marketing, data, etc.)
- Runs in a sandboxed Linux VM on your machine for safety
- Available on all paid plans (Pro, Max, Team, Enterprise)

### Code Mode (Claude Code)
- Full AI coding assistant that reads your entire codebase
- Writes code, runs tests, creates pull requests, monitors CI
- Multiple parallel sessions via git worktrees
- Visual diff review, app previews, PR monitoring with auto-fix
- Environments: Local (your machine), Remote (Anthropic cloud), SSH (your server)
- Pro ($20/mo) minimum for access; Team Premium ($150/seat) for team deployment

**Claude in Chrome:**
- Browser extension that lets Claude navigate, click, fill forms, and read web pages
- Works standalone in the Chrome side panel or controlled from Desktop/Cowork
- Record workflows — teach Claude a sequence of browser actions to repeat
- Schedule browser tasks for recurring automation
- Multi-tab management — drag tabs into Claude's tab group for batch processing
- Beta feature, available on all paid plans (Pro users limited to Haiku 4.5 model)

**Getting Started:**
1. Download at claude.com/download
2. Log in with your Claude account
3. Choose your mode: Chat, Cowork, or Code
4. For Cowork: grant file access to a specific folder, describe your task
5. For Code: select a repository and environment, describe what you want to build

---

## TOPIC 08: Claude Code

**TL;DR:** Claude Code is an AI coding assistant that understands your entire codebase, writes and edits code across multiple files, runs tests, and creates pull requests. It works in the terminal (CLI), the Claude Desktop app (GUI), or VS Code.

**Analogy:** Claude Code is like having a senior developer pair-programming with you, except they can read your entire codebase in seconds, make changes across 50 files without losing track, run tests, fix failures, and ship a PR — all while you grab coffee.

**Who Should Use It:**
- Developers — coding, debugging, testing, refactoring, PR lifecycle
- Technical staff — scripts, automation, data processing, infrastructure
- Non-developers via Cowork — file management, research, document generation

**Key Capabilities:**
- Read and reason about entire codebases (up to 1M tokens of context in beta with Opus 4.6)
- Write code, fix bugs, refactor across multiple files simultaneously
- Create and manage pull requests with generated descriptions
- PR monitoring with CI status bar, auto-fix on failure, auto-merge when all checks pass
- Run tests and iterate on failures automatically
- Visual diff review with inline commenting (Desktop)
- App preview — embedded browser for testing web apps, Claude takes screenshots and verifies its own changes
- Session portability — start in CLI, continue in Desktop, monitor from mobile
- Connect to your tools via MCP connectors (Jira, GitHub, Slack, Notion, Sentry)
- Skills and slash commands for team-standardized workflows (/fix, /test, /review, /doc)
- Hooks for event-driven automation (PreToolUse, PostToolUse, Stop, SessionStart)
- Agent teams (Opus 4.6) — parallel multi-agent workflows for complex tasks
- /loop command — session-level scheduler for repeating prompts at intervals
- Auto-memory — Claude automatically saves useful context across sessions
- /rewind — undo code changes by rewinding conversation

**Configuration:**
- CLAUDE.md at repo root — project-level instructions (conventions, testing, security, PR format)
- Global CLAUDE.md at ~/.claude/CLAUDE.md — personal defaults across all projects
- Skills — reusable knowledge packages, auto-loaded when relevant. Marketplace available.
- Hooks — event-driven automation scripts
- Slash commands — built-in (/fix, /test, /compact, /model) + custom per-project

**Plans Required:** Pro ($20/mo) minimum. Team Premium ($150/seat) for team access.

---

## TOPIC 09: Prompt Engineering Basics

**TL;DR:** Better prompts get better results. Be specific, give context, show examples, and tell Claude what format you want. The quality of your output is directly proportional to the quality of your input.

**The CRAFT Framework (INT Standard):**
- **C**ontext: Background information Claude needs to understand your situation
- **R**ole: Who Claude should be (expert, editor, analyst, advisor, critic)
- **A**ction: What specifically to do (step-by-step if complex)
- **F**ormat: How the output should look (bullets, table, email, report, code)
- **T**arget Audience: Who will read the output (executive, technical team, client, public)

**Example — Bad Prompt:**
"Write a report about AI."

**Example — Good Prompt:**
"You are a technology advisor writing for a non-technical executive audience at a managed services company. Write a 2-page briefing on how AI is being adopted by MSPs in 2026. Include 3 specific use cases with estimated ROI ranges. Format with an executive summary, body with subheadings, and recommendation section. Cite sources where possible. Avoid jargon — explain technical terms when used."

**Advanced Techniques:**
- **XML tags for structure:** Wrap different parts of complex prompts in tags like `<instructions>`, `<context>`, `<examples>`, `<constraints>` for clarity
- **Few-shot examples:** Show Claude 2-3 examples of the output format you want (both good and bad examples)
- **Chain of thought:** For complex reasoning, ask Claude to "think step by step" or use Extended Thinking mode
- **Negative constraints:** Tell Claude what NOT to do ("Don't use jargon", "Don't exceed 500 words", "Don't include generic advice")
- **Iterative refinement:** Start broad, then refine — "Make it shorter", "Add more data", "Rewrite the intro to be more compelling"

**Quick Tips:**
- Upload reference documents for Claude to follow as examples
- Use Projects to pre-load context so you don't repeat yourself
- For recurring tasks, save good prompts as Skills or slash commands
- When in doubt, ask Claude to ask YOU clarifying questions first: "Before you start, ask me 3-5 questions to make sure you get this right"

**INT Prompt Library:** Available in the shared Notion workspace. Ask the AI Team for access.

---

## TOPIC 10: Plans & Pricing

**TL;DR:** Free gets you started, Pro ($20/mo) unlocks the real power, Max ($100-200/mo) removes limits, Team and Enterprise add admin controls and collaboration. All paid plans include access to the latest models.

**Individual Plans:**

| Feature | Free | Pro ($20/mo) | Max 5x ($100/mo) | Max 20x ($200/mo) |
|---------|------|------|------|------|
| Chat & Web Search | Yes | Yes | Yes | Yes |
| Artifacts | Yes | Yes | Yes | Yes |
| Models | Sonnet 4.6 + Haiku 4.5 | All models incl. Opus 4.6 | All models | All models |
| Usage | ~9 msgs/5hr | ~45 msgs/5hr (~5x Free) | 5x Pro | 20x Pro |
| Projects | No | Yes | Yes | Yes |
| Memory | No | Yes | Yes | Yes |
| Claude Code | No | Yes | Yes | Yes |
| Cowork | No | Yes (macOS + Windows) | Yes | Yes |
| Claude in Chrome | No | Yes (Haiku only) | Yes (all models) | Yes (all models) |
| Connectors (MCP) | No | Yes | Yes | Yes |
| Extended Thinking | No | Yes | Yes | Yes |
| File Creation | No | Yes | Yes | Yes |
| Priority Access | No | Yes | Maximum | Maximum |

**Business Plans:**

| Feature | Team Standard ($25/seat) | Team Premium ($150/seat) | Enterprise (Custom) |
|---------|------|------|------|
| All Pro features | Yes | Yes | Yes |
| Claude Code | No | Yes | Yes |
| Min. Seats | 5 | 5 | Negotiable |
| Admin Controls | Basic (SSO, billing) | Full (extensions, analytics) | Advanced |
| SSO/SAML | Yes | Yes | Yes |
| SCIM | No | No | Yes |
| Audit Logs | No | No | Yes |
| Data Retention Controls | No | No | Yes |
| Usage Analytics | Basic | Full | Enterprise Analytics API |
| Self-Serve Purchase | Yes | Yes | Yes (no sales call required) |

**Pricing Notes (Annual Billing Discounts):**
- Pro: ~$17/mo when billed annually ($204/year)
- Team Standard: $20/seat/mo annual ($25 monthly)
- Team Premium: $100/seat/mo annual ($125 monthly)
- Enterprise: Self-serve now available — no sales conversation required. Single seat type includes Claude, Claude Code, and Cowork.
- Education: University-wide plans available — contact Anthropic

**INT Standard:** All INT staff should be on Pro minimum. Engineering and AI team on Max. Client-facing teams on Team plan for shared workspace. Recommend Team Premium for any team needing Claude Code access.

---

## TOPIC 11: Claude vs. ChatGPT vs. Gemini

**TL;DR:** Claude excels at writing quality, instruction following, coding, and long document analysis. ChatGPT has broader tool integrations and image generation. Gemini integrates deeply with Google Workspace. Each has distinct strengths.

**When to Use Claude (Our Primary Platform):**
- Complex writing — reports, proposals, technical docs, creative content. Claude writes more naturally and follows complex instructions more reliably.
- Coding and code review — consistently top SWE-bench scores (77.2% verified). Full agentic coding with Claude Code.
- Long document analysis — 1M token context window (beta) vs. 128K for ChatGPT. Analyze entire codebases or document sets.
- Precise instruction following — Claude handles multi-step, multi-constraint prompts with high fidelity.
- Agentic workflows — Cowork (non-dev), Claude Code (dev), Claude in Chrome (browser) — three agent surfaces in one platform.
- Enterprise deployment — Bedrock (AWS), Vertex (GCP), and direct API. Data never used for training.
- MCP ecosystem — open protocol for tool integration, 50+ first-party connectors, plugin marketplace.

**When ChatGPT Might Be Better:**
- Image generation — DALL-E / GPT Image is native. Claude does not generate raster images.
- Video generation — Sora integration for video creation
- Existing ChatGPT deployment — switching cost may outweigh benefits if deeply embedded
- Real-time voice conversations — ChatGPT Advanced Voice Mode is more mature for multi-modal voice interaction

**When Gemini Might Be Better:**
- Deep Google Workspace integration — native Docs, Sheets, Gmail, Slides editing
- Video understanding — YouTube video analysis is a core Gemini capability
- Google Cloud-first organizations — native Vertex AI integration
- Multimodal input — Gemini handles audio, video, and document inputs natively

**INT Position:** Claude is our primary AI platform. We use ChatGPT and Gemini for specific use cases where they have unique capabilities (image/video generation, Google Workspace integration), but Claude is the default recommendation for all text, code, analysis, and workflow automation tasks. All client recommendations should lead with Claude unless a specific capability gap applies.

---

## TOPIC 12: Security & Data Privacy

**TL;DR:** Claude is designed with privacy first. API and Enterprise data is never used for training. SOC 2 Type II certified. Multiple deployment options for sensitive workloads.

**Key Facts:**
- **API and Enterprise:** Your data is never used to train Claude's models. Period.
- **Free and Pro:** Conversations may be used for safety research. Opt out available in Settings.
- **SOC 2 Type II certified** — annual audits by independent third parties
- **HIPAA-eligible** deployment available via Enterprise plan
- **Data retention:** Configurable on Enterprise; standard plans follow Anthropic's published retention policy
- **Incognito mode:** Conversations aren't stored and don't generate memories
- **Deployment options:**
  - Direct API — standard Anthropic endpoints
  - AWS Bedrock — runs in your VPC, data never leaves your AWS account
  - Google Cloud Vertex AI — GCP-native deployment
  - Self-hosted options for highest-security environments

**For INT Clients:**
- Always recommend Enterprise for regulated industries (healthcare, finance, legal, government)
- API deployment for custom applications — data stays in customer control
- Bedrock/Vertex for clients who need data residency guarantees
- Point to SOC 2 Type II certification when clients ask about security posture
- Emphasize: Claude never trains on API/Enterprise data — this is a key differentiator

**Cowork Security Notes:**
- Cowork runs in a sandboxed Linux VM on the user's local machine
- File access requires explicit permission — you choose which folders Claude can see
- File deletion always requires authorization
- Code execution is isolated from the host operating system
- Cowork stores conversation history locally (not subject to Anthropic's server-side retention)
- Network egress follows your configured permissions

---

## TOPIC 13: Cowork — Autonomous Desktop Agent

**TL;DR:** Cowork turns Claude from a chatbot into an autonomous teammate. Describe a task, step away, and come back to finished work — organized files, polished documents, researched reports, formatted spreadsheets. Available in the Claude Desktop app.

**Analogy:** Cowork is like hiring a capable assistant who works at your desk while you're in meetings. They can organize your files, research topics, create presentations, compile reports, and even run tasks on a schedule — all without needing your constant direction.

**What Cowork Can Do:**
- Organize and clean up files and folders on your computer
- Research topics across the web and compile findings into formatted reports
- Create professional deliverables — Word docs, Excel spreadsheets, PowerPoint presentations, PDFs
- Analyze data and create visualizations
- Draft and manage emails via Gmail connector
- Coordinate with sub-agents for parallel workstreams
- Run long-running complex tasks without conversation timeouts

**Scheduled Tasks:**
- Set up tasks that run automatically: hourly, daily, weekdays, weekly, or on demand
- Use /schedule command in any Cowork task, or click "Scheduled" in the sidebar
- Common uses: morning email briefings, weekly report compilation, file cleanup, data monitoring
- Tasks have access to all your connected tools, skills, and installed plugins
- Tasks only run while your computer is awake and the Desktop app is open

**Plugins:**
- Pre-built plugin packages for specific roles and workflows
- 15+ plugins available including: productivity, product management, legal, finance, marketing, data analysis, design, operations, HR
- Install from Customize > Plugins in Desktop
- Create custom plugins for your team's specific workflows
- Admin-controlled on Team and Enterprise plans

**Cowork vs. Chat vs. Code:**
- **Chat** = questions and quick tasks (conversational)
- **Cowork** = multi-step knowledge work with file access (autonomous agent)
- **Code** = software development with git integration (developer agent)
- Same underlying model, different capabilities and interfaces

**Requirements:** Claude Desktop app + any paid plan (Pro, Max, Team, Enterprise). Available on macOS and Windows (Cowork not yet supported on Windows arm64).

---

## TOPIC 14: Claude in Chrome — Browser Agent

**TL;DR:** Claude in Chrome is a browser extension that lets Claude read, click, navigate, and fill forms on websites alongside you. Pair it with Cowork or Claude Code for end-to-end workflows that span your desktop and browser.

**What It Can Do:**
- Read the current page and extract structured information
- Navigate between pages, follow links, fill forms
- Clean up inboxes — identify newsletters, promotional emails, and bulk archive
- Research across multiple tabs simultaneously
- Record workflows — teach Claude a sequence of steps to repeat
- Schedule recurring browser tasks (check dashboards, monitor sites)
- Multi-tab management — drag tabs into Claude's tab group for batch processing

**Integration with Other Modes:**
- **With Cowork:** Chrome gathers info from the web → Cowork produces finished deliverables (Excel, PowerPoint, reports)
- **With Claude Code:** Build code → test in browser → debug with console logs → iterate. Full build-test-verify loop.
- **From Desktop:** Start a browser task in Desktop without switching windows — Claude controls Chrome in the background

**Important Notes:**
- Beta feature — works on Google Chrome and Microsoft Edge only (not Brave, Arc, Firefox)
- Pro plan users are limited to Haiku 4.5 model for browser tasks
- Max, Team, and Enterprise users can choose any model including Opus 4.6
- Browser automation consumes more usage than standard chat — heavy users should consider Max
- Always be careful with sensitive data — avoid financial transactions or password management via Claude
- Requires explicit per-site permissions for security

---

## TOPIC 15: Getting Help

**INT Internal Resources:**
- INT Claude Project: INT-Teaching-With-Claude (SharePoint)
- Claude Catalyst Agent: Ask via Copilot Studio in Teams/SharePoint
- INT AI Team: Contact Kyle R. for advanced questions, custom skills, or architecture guidance
- INT Prompt Library: Available in the shared Notion workspace
- INT Training Decks: Three tiers available — End User, Tech Department, AI Team/Architect

**Anthropic Resources:**
- Documentation: docs.claude.com (API + Claude Code)
- Help Center: support.claude.com (claude.ai features)
- Pricing: claude.com/pricing
- Status: status.anthropic.com
- Product News & Changelog: anthropic.com/news + support.claude.com release notes
- Claude Code Docs: code.claude.com/docs
- Download Desktop App: claude.com/download
- Plugin Marketplace: claude.com/plugins
- Chrome Extension: Chrome Web Store (search "Claude in Chrome")
- Prompting Guide: docs.claude.com/en/docs/build-with-claude/prompt-engineering/overview

---

*End of Claude Catalyst Knowledge Base v2.0. 15 topics covering the full Claude ecosystem for INT internal staff onboarding. Updated March 14, 2026.*
