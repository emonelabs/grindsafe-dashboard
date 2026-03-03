import { Wallet } from 'lucide-react';

interface WalletIconProps {
  type: 'Skrill' | 'Neteller' | 'Pix' | 'LuxonPay';
  className?: string;
}

export function WalletIcon({ type, className = "w-8 h-8" }: WalletIconProps) {
  switch (type) {
    case 'Skrill':
      return (
        <div className={`${className} flex items-center justify-center bg-purple-600 rounded overflow-hidden`}>
          <svg viewBox="0 0 40 40" fill="none" className="w-full h-full">
            <rect width="40" height="40" fill="#6C2EB9"/>
            <text x="20" y="27" fontFamily="Arial, sans-serif" fontSize="24" fontWeight="bold" fill="white" textAnchor="middle">S</text>
          </svg>
        </div>
      );
    case 'Neteller':
      return (
        <div className={`${className} flex items-center justify-center bg-green-600 rounded overflow-hidden`}>
          <svg viewBox="0 0 40 40" fill="none" className="w-full h-full">
            <rect width="40" height="40" fill="#86BC25"/>
            <text x="20" y="27" fontFamily="Arial, sans-serif" fontSize="24" fontWeight="bold" fill="white" textAnchor="middle">N</text>
          </svg>
        </div>
      );
    case 'Pix':
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
    case 'LuxonPay':
      return (
        <div className={`${className} flex items-center justify-center rounded overflow-hidden`}>
          <svg viewBox="0 0 40 40" fill="none" className="w-full h-full">
            <defs>
              <linearGradient id="luxonGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FCD34D" />
                <stop offset="100%" stopColor="#F59E0B" />
              </linearGradient>
            </defs>
            <rect width="40" height="40" fill="url(#luxonGradient)"/>
            <path d="M20 8L12 14M20 8L28 14M12 14V26M28 14V26M12 26L20 32M28 26L20 32" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="20" cy="14" r="2" fill="white"/>
            <circle cx="20" cy="26" r="2" fill="white"/>
            <circle cx="12" cy="14" r="2" fill="white"/>
            <circle cx="28" cy="14" r="2" fill="white"/>
            <circle cx="12" cy="26" r="2" fill="white"/>
            <circle cx="28" cy="26" r="2" fill="white"/>
          </svg>
        </div>
      );
    default:
      return (
        <div className={`${className} flex items-center justify-center bg-gray-400 rounded`}>
          <Wallet className="w-5 h-5 text-white" />
        </div>
      );
  }
}

export const walletColors: Record<string, string> = {
  'Skrill': 'from-purple-500 to-purple-600',
  'Neteller': 'from-green-500 to-green-600',
  'Pix': 'from-teal-400 to-teal-600',
  'LuxonPay': 'from-amber-400 to-orange-600'
};
