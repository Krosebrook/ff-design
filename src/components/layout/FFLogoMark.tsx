export function FFLogoMark() {
  return (
    <span className="relative grid h-8 w-8 place-items-center overflow-hidden rounded-lg border border-violet-400/40 bg-gradient-to-br from-violet-700/40 to-black">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
        <defs>
          <linearGradient id="ff-mini-bolt" x1="6" y1="2" x2="18" y2="22" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#A855F7" />
            <stop offset="0.5" stopColor="#F472B6" />
            <stop offset="1" stopColor="#22D3EE" />
          </linearGradient>
        </defs>
        <path d="M13 2 L4 14 L11 14 L9 22 L20 9 L13 9 L15 2 Z" fill="url(#ff-mini-bolt)" />
      </svg>
    </span>
  );
}
