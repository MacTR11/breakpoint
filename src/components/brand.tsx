// The brand mark and the hint token.

/** A rounded tile in the brand gradient holding four bits, two of them lit. */
export function Logo({ size = 28 }: { size?: number }) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} aria-hidden="true" className="shrink-0">
      <defs>
        <linearGradient id="logo-fill" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#0a84ff" />
          <stop offset="0.55" stopColor="#bf5af2" />
          <stop offset="1" stopColor="#ff375f" />
        </linearGradient>
      </defs>
      <rect x="1" y="1" width="30" height="30" rx="9" fill="url(#logo-fill)" />
      <rect x="8" y="8" width="7" height="7" rx="2.4" fill="#fff" />
      <rect x="17" y="8" width="7" height="7" rx="2.4" fill="#fff" opacity="0.5" />
      <rect x="8" y="17" width="7" height="7" rx="2.4" fill="#fff" opacity="0.5" />
      <rect x="17" y="17" width="7" height="7" rx="2.4" fill="#fff" />
    </svg>
  );
}

/** A hint token: a light bulb on a yellow disc. */
export function HintCoin({ size = 20 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" className="shrink-0">
      <circle cx="12" cy="12" r="11" fill="#ffd60a" />
      <path d="M12 6.4a4.1 4.1 0 0 0-2.3 7.5c.4.3.6.7.6 1.1v.2h3.4V15c0-.4.2-.8.6-1.1A4.1 4.1 0 0 0 12 6.4Z" fill="#4a3500" />
      <rect x="10.4" y="16.1" width="3.2" height="1.4" rx="0.7" fill="#4a3500" />
    </svg>
  );
}
