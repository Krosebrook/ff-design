import { useCallback, useEffect, useMemo, useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom';

import { Sidebar } from './components/layout/Sidebar';
import { Topbar } from './components/layout/Topbar';
import { CommandPalette } from './components/layout/CommandPalette';
import { NotificationsDrawer } from './components/layout/NotificationsDrawer';
import { ToastProvider } from './components/ui/ToastSystem';

import { HomeRoute }           from './routes/HomeRoute';
import { ConsoleRoute }        from './routes/ConsoleRoute';
import { AgentsRoute }         from './routes/AgentsRoute';
import { AgentDetailRoute }    from './routes/AgentDetailRoute';
import { SkillsRoute }         from './routes/SkillsRoute';
import { SkillDetailRoute }    from './routes/SkillDetailRoute';
import { PipelinesRoute }      from './routes/PipelinesRoute';
import { PipelineDetailRoute } from './routes/PipelineDetailRoute';
import { AuditRoute }          from './routes/AuditRoute';
import { SettingsRoute }       from './routes/SettingsRoute';
import { DebugRoute }          from './routes/DebugRoute';

/* ── Breadcrumb helper ─────────────────────────────────────────────────── */
function useBreadcrumbs() {
  const location = useLocation();
  const parts = location.pathname.replace(/^\//, '').split('/').filter(Boolean);
  const [top, sub] = parts;

  const LABELS: Record<string, string> = {
    console: 'Console', agents: 'Agents', skills: 'Skills',
    pipelines: 'Pipelines', audit: 'Audit log', settings: 'Settings',
  };

  const crumbs: { label: string; to?: string }[] = [{ label: 'FlashFusion', to: '/' }];

  if (!top || top === 'console') {
    crumbs.push({ label: 'Console' });
  } else if (LABELS[top]) {
    crumbs.push({ label: LABELS[top], to: sub ? `/${top}` : undefined });
    if (sub) crumbs.push({ label: sub.charAt(0).toUpperCase() + sub.slice(1).replace(/-/g, ' ') });
  } else {
    crumbs.push({ label: 'Not found' });
  }

  return crumbs;
}

/* ── Shell (needs to be inside BrowserRouter for useLocation) ──────────── */
function Shell() {
  const location = useLocation();
  const [paletteOpen, setPaletteOpen]   = useState(false);
  const [drawerOpen, setDrawerOpen]     = useState(false);
  const [mobileOpen, setMobileOpen]     = useState(false);
  const [collapsed, setCollapsed]       = useState(() => {
    try { return localStorage.getItem('ff-sidebar-collapsed') === '1'; } catch { return false; }
  });

  const crumbs = useBreadcrumbs();
  const topSection = location.pathname.replace(/^\//, '').split('/')[0];
  const runtimeLive = topSection !== 'settings';

  /* Close mobile nav on route change */
  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  /* ⌘K + "/" shortcut */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const mod = e.metaKey || e.ctrlKey;
      if (mod && (e.key === 'k' || e.key === 'K')) { e.preventDefault(); setPaletteOpen((v) => !v); }
      if (e.key === '/' && !['INPUT', 'TEXTAREA'].includes((document.activeElement as HTMLElement)?.tagName ?? '')) {
        e.preventDefault(); setPaletteOpen(true);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const toggleCollapse = useCallback(() => {
    setCollapsed((v) => {
      const next = !v;
      try { localStorage.setItem('ff-sidebar-collapsed', next ? '1' : '0'); } catch {}
      return next;
    });
  }, []);

  return (
    <>
      {/* Background effects */}
      <div className="ff-aurora" aria-hidden />
      <div className="ff-grid"   aria-hidden />

      <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:left-2 focus:top-2 focus:z-[100] focus:rounded focus:bg-white focus:px-3 focus:py-2 focus:text-black">
        Skip to content
      </a>

      <div className="relative z-10 flex min-h-screen">
        <Sidebar
          onCmdK={() => setPaletteOpen(true)}
          collapsed={collapsed}
          onToggleCollapse={toggleCollapse}
          mobileOpen={mobileOpen}
          onCloseMobile={() => setMobileOpen(false)}
        />

        <div className="flex min-w-0 flex-1 flex-col">
          <Topbar
            crumbs={crumbs}
            onCmdK={() => setPaletteOpen(true)}
            onOpenDrawer={() => setDrawerOpen(true)}
            onOpenMobile={() => setMobileOpen(true)}
            running={runtimeLive}
          />
          <div id="main-content" className="relative flex-1">
            <Routes>
              <Route path="/"              element={<HomeRoute />} />
              <Route path="/console"       element={<ConsoleRoute />} />
              <Route path="/agents"        element={<AgentsRoute />} />
              <Route path="/agents/:id"    element={<AgentDetailRoute />} />
              <Route path="/skills"        element={<SkillsRoute />} />
              <Route path="/skills/:id"    element={<SkillDetailRoute />} />
              <Route path="/pipelines"     element={<PipelinesRoute />} />
              <Route path="/pipelines/:id" element={<PipelineDetailRoute />} />
              <Route path="/audit"         element={<AuditRoute />} />
              <Route path="/settings"      element={<SettingsRoute />} />
              <Route path="/_debug"        element={<DebugRoute />} />
              <Route path="*"              element={<HomeRoute />} />
            </Routes>
          </div>
        </div>
      </div>

      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
      <NotificationsDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <Shell />
      </ToastProvider>
    </BrowserRouter>
  );
}
