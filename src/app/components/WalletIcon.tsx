import { walletImages } from '../constants/walletImages';
import { Wallet } from 'lucide-react';

interface WalletIconProps {
  type: 'Skrill' | 'Neteller' | 'Pix' | 'LuxonPay';
  className?: string;
}

export function WalletIcon({ type, className = "w-8 h-8" }: WalletIconProps) {
  if (type === 'Pix') {
    return (
      <div className={`${className} flex items-center justify-center bg-teal-500 rounded overflow-hidden`}>
        <svg viewBox="0 0 40 40" fill="none" className="w-full h-full">
          <rect width="40" height="40" fill="#00B8A9"/>
          <path d="M20 8L28 14L28 26L20 32L12 26L12 14L20 8Z" stroke="white" strokeWidth="2.5" fill="none"/>
          <circle cx="20" cy="20" r="3.5" fill="white"/>
          <path d="M16 16L24 24M24 16L16 24" stroke="white" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </div>
    );
  }

  const imageSrc = walletImages[type];
  
  if (imageSrc) {
    return (
      <div className={`${className} flex items-center justify-center bg-gray-100 rounded overflow-hidden`}>
        <img
          src={imageSrc}
          alt={type}
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  return (
    <div className={`${className} flex items-center justify-center bg-gray-400 rounded`}>
      <Wallet className="w-5 h-5 text-white" />
    </div>
  );
}
