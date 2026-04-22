type IconProps = {
  className?: string;
};

export function SettingsIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="3.25" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M12 4.8v2M12 17.2v2M4.8 12h2M17.2 12h2M6.9 6.9l1.4 1.4M15.7 15.7l1.4 1.4M17.1 6.9l-1.4 1.4M8.3 15.7l-1.4 1.4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function MicIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M12 4.9a3.15 3.15 0 0 1 3.15 3.15v4.55a3.15 3.15 0 1 1-6.3 0V8.05A3.15 3.15 0 0 1 12 4.9Z"
        stroke="currentColor"
        strokeWidth="2.1"
      />
      <path
        d="M7.7 12.4a4.3 4.3 0 0 0 8.6 0M12 16.9v2.2M9.2 19.1h5.6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function ImageIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <rect
        x="4.2"
        y="4.5"
        width="15.6"
        height="15"
        rx="3.1"
        stroke="currentColor"
        strokeWidth="1.85"
      />
      <path
        d="m7.7 15.1 2.7-2.9 2.2 2.2 2.7-3 2 2.2"
        stroke="currentColor"
        strokeWidth="1.85"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="9.2" cy="9.2" r="1.35" fill="currentColor" />
    </svg>
  );
}
