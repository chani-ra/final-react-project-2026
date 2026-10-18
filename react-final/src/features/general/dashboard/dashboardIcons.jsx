import React from "react";

export function getStationIcon(iconKey) {
  const icons = {
    compass: <CompassIcon />,
    brain: <BrainIcon />,
    bot: <BotIcon />,
    music: <MusicIcon />,
    book: <BookIcon />,
    pen: <PenIcon />,
  };

  return icons[iconKey] || <BookIcon />;
}

function BaseIcon({ children, large = false }) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={large ? "h-10 w-10" : "h-8 w-8"}
      fill="none"
    >
      <g
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {children}
      </g>
    </svg>
  );
}

export function UserIcon() {
  return (
    <svg className="h-7 w-7 text-white" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM4 21c1-4.5 3.7-7 8-7s7 2.5 8 7"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  );
}

export function CompassIcon() {
  return (
    <BaseIcon>
      <circle cx="32" cy="32" r="23" />
      <path d="M39 21L34 36L20 43L26 28L39 21Z" />
      <circle cx="32" cy="32" r="2" fill="currentColor" />
    </BaseIcon>
  );
}

export function BrainIcon() {
  return (
    <BaseIcon>
      <path d="M22 18C16 18 12 23 12 29C8 32 8 40 14 43C15 50 23 52 28 48" />
      <path d="M42 18C48 18 52 23 52 29C56 32 56 40 50 43C49 50 41 52 36 48" />
      <path d="M28 16C25 20 25 26 30 30" />
      <path d="M36 16C39 20 39 26 34 30" />
      <path d="M28 48V36" />
      <path d="M36 48V36" />
      <path d="M24 34H40" />
    </BaseIcon>
  );
}

export function BotIcon() {
  return (
    <BaseIcon>
      <rect x="14" y="22" width="36" height="28" rx="8" />
      <path d="M32 22V12" />
      <circle cx="24" cy="35" r="2" fill="currentColor" />
      <circle cx="40" cy="35" r="2" fill="currentColor" />
      <path d="M25 43H39" />
      <path d="M8 34H14" />
      <path d="M50 34H56" />
    </BaseIcon>
  );
}

export function MusicIcon({ large = false }) {
  return (
    <BaseIcon large={large}>
      <path d="M24 44V18L48 14V38" />
      <circle cx="18" cy="46" r="6" />
      <circle cx="42" cy="40" r="6" />
      <path d="M24 24L48 20" />
    </BaseIcon>
  );
}

export function BookIcon() {
  return (
    <BaseIcon>
      <path d="M12 16C18 13 24 13 30 16V48C24 45 18 45 12 48V16Z" />
      <path d="M34 16C40 13 46 13 52 16V48C46 45 40 45 34 48V16Z" />
    </BaseIcon>
  );
}

export function PenIcon() {
  return (
    <BaseIcon>
      <path d="M14 48L18 36L42 12L52 22L28 46L14 48Z" />
      <path d="M36 18L46 28" />
      <path d="M18 36L28 46" />
    </BaseIcon>
  );
}