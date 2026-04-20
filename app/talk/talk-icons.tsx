type IconProps = {
  className?: string;
};

export function SettingsIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M12 4.8v1.9M12 17.3v1.9M5.8 12H3.9M20.1 12h-1.9M17.1 6.9l-1.4 1.4M8.3 15.7l-1.4 1.4M17.1 17.1l-1.4-1.4M8.3 8.3 6.9 6.9"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
      />
      <circle cx="12" cy="12" r="3.35" stroke="currentColor" strokeWidth="1.9" />
    </svg>
  );
}

export function TalkIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M8.3 18.2 6.4 20v-3.2a6.4 6.4 0 1 1 2 .3Z"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="9.5" cy="12" r="1" fill="currentColor" />
      <circle cx="12" cy="12" r="1" fill="currentColor" />
      <circle cx="14.5" cy="12" r="1" fill="currentColor" />
    </svg>
  );
}

export function MemoryIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M9.1 6.1a3.6 3.6 0 0 0-3.6 3.6c0 1 .4 1.9 1 2.5-.6.6-1 1.5-1 2.5a3.6 3.6 0 0 0 3.6 3.6c1 0 1.9-.4 2.5-1 .6.6 1.5 1 2.5 1a3.6 3.6 0 0 0 3.6-3.6c0-1-.4-1.9-1-2.5.6-.6 1-1.5 1-2.5a3.6 3.6 0 0 0-3.6-3.6c-1 0-1.9.4-2.5 1-.6-.6-1.5-1-2.5-1Z"
        stroke="currentColor"
        strokeWidth="1.85"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 7.4v9.2M9.7 10.2c.7.3 1.4.3 2.3 0M12 13.8c.8.3 1.6.3 2.3 0"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function SleepIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M15.9 5.5a7.1 7.1 0 1 0 2.6 13.7 6.4 6.4 0 1 1-2.6-13.7Z"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10.7 15.2h1.7l1.2-2.7 1.6 3.5 1.1-2.2h1.9"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function RoomIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M7.3 10.2V8.6A2.6 2.6 0 0 1 9.9 6h4.2a2.6 2.6 0 0 1 2.6 2.6v1.6"
        stroke="currentColor"
        strokeWidth="1.85"
        strokeLinecap="round"
      />
      <path
        d="M5.4 10.2h13.2v4.2a2.3 2.3 0 0 1-2.3 2.3H7.7a2.3 2.3 0 0 1-2.3-2.3v-4.2Z"
        stroke="currentColor"
        strokeWidth="1.85"
        strokeLinejoin="round"
      />
      <path
        d="M7.6 16.7v1.6M16.4 16.7v1.6"
        stroke="currentColor"
        strokeWidth="1.85"
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
