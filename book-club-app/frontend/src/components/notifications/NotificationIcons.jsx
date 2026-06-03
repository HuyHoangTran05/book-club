// Lightweight inline SVG icons (no external icon dependency).

const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
};

export function BellIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </svg>
  );
}

export function BellOffIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M8.7 3A6 6 0 0 1 18 8c0 3 .6 5 1.4 6.4" />
      <path d="M17 17H3s3-2 3-9a6 6 0 0 1 .3-1.9" />
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
      <line x1="2" y1="2" x2="22" y2="22" />
    </svg>
  );
}

function TransactionIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="m17 2 4 4-4 4" />
      <path d="M3 11V9a4 4 0 0 1 4-4h14" />
      <path d="m7 22-4-4 4-4" />
      <path d="M21 13v2a4 4 0 0 1-4 4H3" />
    </svg>
  );
}

function PointIcon(props) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7.5l1.3 2.8 3 .3-2.3 2 .7 3-2.7-1.6L9 17.6l.7-3-2.3-2 3-.3z" />
    </svg>
  );
}

function MessageIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M21 11.5a8.38 8.38 0 0 1-9 8.4 8.5 8.5 0 0 1-3.8-.9L3 20l1-4.2A8.38 8.38 0 0 1 3 11.5a8.5 8.5 0 0 1 9-8.4 8.38 8.38 0 0 1 9 8.4Z" />
    </svg>
  );
}

function BookIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-17A2.5 2.5 0 0 1 6.5 2Z" />
      <path d="M8 7h8" />
      <path d="M8 11h6" />
    </svg>
  );
}

function RatingIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M12 2.5l2.9 5.9 6.6.9-4.8 4.6 1.1 6.6L12 18.4 6.2 21l1.1-6.6L2.5 9.8l6.6-.9z" />
    </svg>
  );
}

function SystemIcon(props) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="9" />
      <line x1="12" y1="11" x2="12" y2="16" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  );
}

const ICONS = {
  transaction: TransactionIcon,
  point: PointIcon,
  message: MessageIcon,
  book: BookIcon,
  rating: RatingIcon,
  system: SystemIcon,
};

export function NotificationTypeIcon({ type, ...props }) {
  const Icon = ICONS[type] || SystemIcon;
  return <Icon {...props} />;
}
