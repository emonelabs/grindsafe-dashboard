interface PokerWalletIconProps {
  platform: 'PokerStars' | 'GGPoker' | 'PartyPoker';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function PokerWalletIcon({ platform, size = 'md', className = '' }: PokerWalletIconProps) {
  const sizeMap = {
    sm: 32,
    md: 48,
    lg: 64
  };
  
  const dimension = sizeMap[size];

  if (platform === 'PokerStars') {
    return (
      <svg
        width={dimension}
        height={dimension}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        <defs>
          <linearGradient id="psGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#EF4444" />
            <stop offset="100%" stopColor="#DC2626" />
          </linearGradient>
        </defs>
        {/* Background circle */}
        <circle cx="32" cy="32" r="30" fill="url(#psGradient)" />
        {/* Spade shape */}
        <path
          d="M32 16C28 16 24 20 24 24C24 28 28 30 28 30C26 30 24 32 24 35C24 37.5 26 39 28.5 39H35.5C38 39 40 37.5 40 35C40 32 38 30 36 30C36 30 40 28 40 24C40 20 36 16 32 16Z"
          fill="white"
        />
        {/* Star in center */}
        <path
          d="M32 22L33.5 26.5L38 26.5L34.5 29.5L36 34L32 31L28 34L29.5 29.5L26 26.5L30.5 26.5L32 22Z"
          fill="#EF4444"
        />
      </svg>
    );
  }

  if (platform === 'GGPoker') {
    return (
      <svg
        width={dimension}
        height={dimension}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        <defs>
          <linearGradient id="ggGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#2563EB" />
          </linearGradient>
        </defs>
        {/* Background circle */}
        <circle cx="32" cy="32" r="30" fill="url(#ggGradient)" />
        {/* First G */}
        <path
          d="M19 32C19 25.5 23.5 20 30 20C33 20 35.5 21 37.5 23L34 26.5C32.8 25.5 31.5 25 30 25C26.5 25 23.5 28 23.5 32C23.5 36 26.5 39 30 39C31.5 39 32.8 38.5 34 37.5V34H30V30H38V39.5C35.5 42 33 43 30 43C23.5 43 19 38.5 19 32Z"
          fill="white"
        />
        {/* Second G */}
        <path
          d="M38 32C38 25.5 42.5 20 49 20C52 20 54.5 21 56.5 23L53 26.5C51.8 25.5 50.5 25 49 25C45.5 25 42.5 28 42.5 32C42.5 36 45.5 39 49 39C50.5 39 51.8 38.5 53 37.5V34H49V30H57V39.5C54.5 42 52 43 49 43C42.5 43 38 38.5 38 32Z"
          fill="white"
          opacity="0.9"
        />
      </svg>
    );
  }

  if (platform === 'PartyPoker') {
    return (
      <svg
        width={dimension}
        height={dimension}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        <defs>
          <linearGradient id="ppGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#A855F7" />
            <stop offset="100%" stopColor="#9333EA" />
          </linearGradient>
        </defs>
        {/* Background circle */}
        <circle cx="32" cy="32" r="30" fill="url(#ppGradient)" />
        {/* Poker chip outer ring */}
        <circle cx="32" cy="32" r="18" fill="white" />
        <circle cx="32" cy="32" r="15" fill="url(#ppGradient)" />
        {/* Chip segments */}
        <rect x="30.5" y="14" width="3" height="6" fill="white" rx="1.5" />
        <rect x="30.5" y="44" width="3" height="6" fill="white" rx="1.5" />
        <rect x="14" y="30.5" width="6" height="3" fill="white" rx="1.5" />
        <rect x="44" y="30.5" width="6" height="3" fill="white" rx="1.5" />
        {/* Diagonal segments */}
        <rect
          x="20"
          y="20"
          width="3"
          height="5"
          fill="white"
          rx="1.5"
          transform="rotate(-45 21.5 22.5)"
        />
        <rect
          x="41"
          y="20"
          width="3"
          height="5"
          fill="white"
          rx="1.5"
          transform="rotate(45 42.5 22.5)"
        />
        <rect
          x="20"
          y="39"
          width="3"
          height="5"
          fill="white"
          rx="1.5"
          transform="rotate(45 21.5 41.5)"
        />
        <rect
          x="41"
          y="39"
          width="3"
          height="5"
          fill="white"
          rx="1.5"
          transform="rotate(-45 42.5 41.5)"
        />
        {/* Center circle */}
        <circle cx="32" cy="32" r="8" fill="white" />
        {/* P letter */}
        <text
          x="32"
          y="37"
          fontSize="12"
          fontWeight="bold"
          fill="#A855F7"
          textAnchor="middle"
          fontFamily="system-ui, -apple-system, sans-serif"
        >
          P
        </text>
      </svg>
    );
  }

  return null;
}

// Export platform colors for use in cards and UI
export const platformColors = {
  'PokerStars': {
    primary: '#EF4444',
    bg: 'bg-red-500',
    text: 'text-red-600',
    light: 'bg-red-50',
    border: 'border-red-200',
    badgeBg: 'bg-red-100',
    badgeText: 'text-red-700'
  },
  'GGPoker': {
    primary: '#3B82F6',
    bg: 'bg-blue-500',
    text: 'text-blue-600',
    light: 'bg-blue-50',
    border: 'border-blue-200',
    badgeBg: 'bg-blue-100',
    badgeText: 'text-blue-700'
  },
  'PartyPoker': {
    primary: '#A855F7',
    bg: 'bg-purple-500',
    text: 'text-purple-600',
    light: 'bg-purple-50',
    border: 'border-purple-200',
    badgeBg: 'bg-purple-100',
    badgeText: 'text-purple-700'
  }
};
