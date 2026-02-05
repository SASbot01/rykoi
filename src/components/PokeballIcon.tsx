'use client';

interface PokeballIconProps {
  className?: string;
  size?: number;
}

export function PokeballIcon({ className = '', size = 20 }: PokeballIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Top half - Red */}
      <path
        d="M50 5C25.1 5 5 25.1 5 50h90C95 25.1 74.9 5 50 5z"
        fill="#FF0000"
      />
      {/* Bottom half - White */}
      <path
        d="M5 50c0 24.9 20.1 45 45 45s45-20.1 45-45H5z"
        fill="#FFFFFF"
      />
      {/* Middle line - Black */}
      <rect x="5" y="46" width="90" height="8" fill="#1a1a1a" />
      {/* Center circle - Outer */}
      <circle cx="50" cy="50" r="18" fill="#1a1a1a" />
      {/* Center circle - White ring */}
      <circle cx="50" cy="50" r="14" fill="#FFFFFF" />
      {/* Center circle - Inner button */}
      <circle cx="50" cy="50" r="8" fill="#1a1a1a" />
      {/* Highlight */}
      <ellipse cx="30" cy="25" rx="10" ry="6" fill="rgba(255,255,255,0.3)" transform="rotate(-30 30 25)" />
    </svg>
  );
}
