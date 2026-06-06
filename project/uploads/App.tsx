import { BrowserRouter, Routes, Route, Link, NavLink } from 'react-router-dom';
import { HomeRoute } from './routes/HomeRoute';
import { ConsoleRoute } from './routes/ConsoleRoute';
import { DebugRoute } from './routes/DebugRoute';

function TopNav() {
  const baseLinkClass =
    'rounded-md px-3 py-1.5 text-sm font-medium transition hover:text-[var(--text-primary)]';
  return (
    <nav
      className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5"
      aria-label="Primary"
    >
      <Link
        to="/"
        className="font-[var(--font-heading)] text-lg font-bold tracking-tight text-[var(--text-primary)]"
      >
        Flash<span className="gradient-text">Fusion</span>
      </Link>
      <ul className="flex items-center gap-1">
        <li>
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `${baseLinkClass} ${
                isActive ? 'text-[var(--text-primary)]' : 'text-[var(--text-tertiary)]'
              }`
            }
          >
            Home
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/console"
            className={({ isActive }) =>
              `${baseLinkClass} ${
                isActive ? 'text-[var(--text-primary)]' : 'text-[var(--text-tertiary)]'
              }`
            }
          >
            Console
          </NavLink>
        </li>
        {import.meta.env.DEV ? (
          <li>
            <NavLink
              to="/_debug"
              className={({ isActive }) =>
                `${baseLinkClass} ${
                  isActive ? 'text-[var(--color-warning)]' : 'text-[var(--text-tertiary)]'
                }`
              }
            >
              Debug
            </NavLink>
          </li>
        ) : null}
      </ul>
    </nav>
  );
}

function AtmosphericBackground() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10"
      style={{
        background:
          'radial-gradient(circle at 50% 0%, rgba(168,85,247,0.18), transparent 36%), linear-gradient(180deg, rgba(15,6,24,0.82), #000 72%)',
      }}
    />
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AtmosphericBackground />
      <TopNav />
      <Routes>
        <Route path="/" element={<HomeRoute />} />
        <Route path="/console" element={<ConsoleRoute />} />
        <Route path="/_debug" element={<DebugRoute />} />
        <Route path="*" element={<HomeRoute />} />
      </Routes>
    </BrowserRouter>
  );
}
