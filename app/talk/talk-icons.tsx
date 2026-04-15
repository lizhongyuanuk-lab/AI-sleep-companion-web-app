type IconProps = {
  className?: string;
};

export function ChatIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M6 7.4A2.4 2.4 0 0 1 8.4 5h7.2A2.4 2.4 0 0 1 18 7.4v5.2a2.4 2.4 0 0 1-2.4 2.4H9.2L6.7 17.1c-.3.2-.7 0-.7-.4V7.4Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function MemoryIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M12 5.2c1.8-1.2 4.5-1 6.1.6 1.9 1.9 1.9 5 0 6.9L12 18.8l-6.1-6.1A4.9 4.9 0 0 1 12 5.2Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 9.2v5.5M9.3 11.9h5.4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function SleepIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M7.4 9.4a4 4 0 0 1 4-4h5.2a4 4 0 0 1 4 4v4.2a4 4 0 0 1-4 4h-5.2a4 4 0 0 1-4-4V9.4Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M4.8 8.5h2.1M17.1 4.8v2.1M5.7 16.7l1.5-1.5M18.3 16.7l-1.5-1.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M12 11.2c1.5 0 2.8-1.2 2.8-2.8"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function RoomIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M4.8 11.2h14.4v5.6H4.8v-5.6ZM7.2 7.5h9.6v3.7H7.2V7.5Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M7.4 16.8v1.8M16.6 16.8v1.8"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function MicIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M12 5.2a2.8 2.8 0 0 1 2.8 2.8v4.4a2.8 2.8 0 0 1-5.6 0V8A2.8 2.8 0 0 1 12 5.2Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M7.9 11.8a4.1 4.1 0 0 0 8.2 0M12 15.9v2.9M9.7 18.8h4.6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function ImageIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <rect
        x="4.8"
        y="4.8"
        width="14.4"
        height="14.4"
        rx="3"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="m8.4 15 2.7-2.8 2 2.1 2.5-2.6 1.9 2"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="9.2" cy="9.2" r="1.4" fill="currentColor" />
    </svg>
  );
}
