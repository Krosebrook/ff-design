import type { IconName } from '../../lib/types';

interface IconProps {
  name: IconName;
  className?: string;
  /** When true, the icon is announced to AT with `title`. Default false (decorative). */
  labelled?: boolean;
  title?: string;
}

const PATHS: Record<IconName, JSX.Element> = {
  activity: <path d="M22 12h-4l-3 8L9 4l-3 8H2" />,
  alert: (
    <>
      <path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </>
  ),
  arrowRight: (
    <>
      <path d="M5 12h14" />
      <path d="m13 5 7 7-7 7" />
    </>
  ),
  brain: (
    <>
      <path d="M9.5 2a3.5 3.5 0 0 0-3.3 4.7A3.8 3.8 0 0 0 4 10a4 4 0 0 0 2 3.5V16a4 4 0 0 0 4 4h1V2H9.5Z" />
      <path d="M14.5 2a3.5 3.5 0 0 1 3.3 4.7A3.8 3.8 0 0 1 20 10a4 4 0 0 1-2 3.5V16a4 4 0 0 1-4 4h-1V2h1.5Z" />
      <path d="M8 7h3" />
      <path d="M13 7h3" />
      <path d="M7 13h4" />
      <path d="M13 13h4" />
    </>
  ),
  check: (
    <>
      <path d="M21 12a9 9 0 1 1-5.2-8.2" />
      <path d="m9 12 2 2 7-7" />
    </>
  ),
  code: (
    <>
      <path d="m16 18 6-6-6-6" />
      <path d="m8 6-6 6 6 6" />
      <path d="m14 4-4 16" />
    </>
  ),
  database: (
    <>
      <ellipse cx="12" cy="5" rx="8" ry="3" />
      <path d="M4 5v6c0 1.7 3.6 3 8 3s8-1.3 8-3V5" />
      <path d="M4 11v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6" />
    </>
  ),
  lock: (
    <>
      <rect x="4" y="11" width="16" height="10" rx="2" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </>
  ),
  pause: (
    <>
      <rect x="6" y="5" width="4" height="14" rx="1" />
      <rect x="14" y="5" width="4" height="14" rx="1" />
    </>
  ),
  play: <path d="m8 5 12 7-12 7V5Z" />,
  reset: (
    <>
      <path d="M3 12a9 9 0 1 0 3-6.7" />
      <path d="M3 4v5h5" />
    </>
  ),
  rocket: (
    <>
      <path d="M4.5 16.5c-1.2 1.2-1.6 3.8-1.6 3.8s2.6-.4 3.8-1.6c.7-.7.7-1.8 0-2.5s-1.8-.7-2.5 0Z" />
      <path d="M9 15 5 11l4-1 6-6c2-2 5-2 7-2 0 2 0 5-2 7l-6 6-1 4-4-4Z" />
      <path d="M15 9h.01" />
    </>
  ),
  shield: (
    <>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
      <path d="m9 12 2 2 4-5" />
    </>
  ),
  sparkles: (
    <>
      <path d="m12 3 1.8 4.2L18 9l-4.2 1.8L12 15l-1.8-4.2L6 9l4.2-1.8L12 3Z" />
      <path d="m5 15 .9 2.1L8 18l-2.1.9L5 21l-.9-2.1L2 18l2.1-.9L5 15Z" />
      <path d="m19 14 .7 1.6L21 16l-1.3.4L19 18l-.7-1.6L17 16l1.3-.4L19 14Z" />
    </>
  ),
  terminal: (
    <>
      <path d="m4 17 5-5-5-5" />
      <path d="M12 19h8" />
    </>
  ),
  zap: <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8Z" />,
};

export function Icon({ name, className = 'h-5 w-5', labelled = false, title }: IconProps) {
  const a11y = labelled
    ? { role: 'img', 'aria-label': title ?? name }
    : { 'aria-hidden': true, focusable: false };

  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...a11y}
    >
      {PATHS[name]}
    </svg>
  );
}
