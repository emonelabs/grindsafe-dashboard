import { walletImages } from '../constants/walletImages';

interface PokerWalletIconProps {
  platform: 'PokerStars' | 'GGPoker' | '888Poker' | 'PartyPoker';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function PokerWalletIcon({ platform, size = 'md', className = '' }: PokerWalletIconProps) {
  const sizeMap = {
    sm: 'w-6 h-6',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };
  
  const imageSrc = walletImages[platform];
  
  if (imageSrc) {
    return (
      <div className={`${sizeMap[size]} ${className} flex items-center justify-center bg-gray-100 rounded overflow-hidden`}>
        <img
          src={imageSrc}
          alt={platform}
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  return null;
}
