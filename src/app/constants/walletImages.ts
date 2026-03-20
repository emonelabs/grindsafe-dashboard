export const walletImages: Record<string, string> = {
  'Skrill': `${import.meta.env.BASE_URL}imgs/skrill.png`,
  'Neteller': `${import.meta.env.BASE_URL}imgs/neteller.png`,
  'LuxonPay': `${import.meta.env.BASE_URL}imgs/luxon-pay.png`,
  'PokerStars': `${import.meta.env.BASE_URL}imgs/pokerstars.jpg`,
  'GGPoker': `${import.meta.env.BASE_URL}imgs/ggpoker.png`,
  '888Poker': `${import.meta.env.BASE_URL}imgs/888poker.jpg`,
  'PartyPoker': `${import.meta.env.BASE_URL}imgs/partypoker.png`,
};

export const walletColors: Record<string, string> = {
  'Skrill': 'from-purple-500 to-purple-600',
  'Neteller': 'from-green-500 to-green-600',
  'Pix': 'from-teal-400 to-teal-600',
  'LuxonPay': 'from-amber-400 to-orange-600',
  'PokerStars': 'from-red-500 to-red-600',
  'GGPoker': 'from-blue-500 to-blue-600',
  '888Poker': 'from-green-500 to-green-600',
  'PartyPoker': 'from-purple-500 to-purple-600',
};

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
  '888Poker': {
    primary: '#22C55E',
    bg: 'bg-green-500',
    text: 'text-green-600',
    light: 'bg-green-50',
    border: 'border-green-200',
    badgeBg: 'bg-green-100',
    badgeText: 'text-green-700'
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
