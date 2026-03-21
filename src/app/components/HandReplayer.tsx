import { useState } from 'react';
import { RotateCcw } from 'lucide-react';

export interface Card {
  rank: string;
  suit: 'hearts' | 'diamonds' | 'clubs' | 'spades';
}

export interface Hand {
  id: string;
  preflop: Card[];
  flop: Card[];
  turn: Card | null;
  river: Card | null;
  position: string;
  result: 'win' | 'lose' | 'split';
  profit: number;
  tableSize?: 6 | 9;
  blinds?: string;
  pot?: number;
}

interface HandReplayerProps {
  hand: Hand;
  playerName?: string;
  playerAvatar?: string;
  onClose?: () => void;
}

const SUITS: Record<string, { symbol: string; color: string }> = {
  hearts: { symbol: '♥', color: 'text-red-500' },
  diamonds: { symbol: '♦', color: 'text-blue-500' },
  clubs: { symbol: '♣', color: 'text-green-600' },
  spades: { symbol: '♠', color: 'text-gray-800' },
};

const CardComponent = ({ card, size = 'md' }: { card: Card; size?: 'sm' | 'md' | 'lg' }) => {
  const suit = SUITS[card.suit];
  const sizeClasses = {
    sm: 'w-[32px] h-[44px] text-sm',
    md: 'w-[40px] h-[56px] text-base',
    lg: 'w-[48px] h-[68px] text-lg',
  };

  return (
    <div className={`bg-white ${sizeClasses[size]} rounded-lg shadow-md flex items-center justify-center font-bold ${suit.color} ${size === 'lg' ? 'border border-gray-300' : ''}`}>
      <span>{card.rank}</span>
      <span className="ml-1">{suit.symbol}</span>
    </div>
  );
};

const StreetIndicator = ({ active }: { active: boolean }) => (
  <div className={`w-2 h-2 rounded-full ${active ? 'bg-blue-500' : 'border border-gray-300'}`} />
);

const StreetTab = ({ 
  label, 
  active, 
  onClick 
}: { 
  label: string; 
  active: boolean; 
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-1.5 px-2 py-1 rounded text-[11px] transition-colors ${
      active 
        ? 'text-blue-600 font-semibold' 
        : 'text-gray-400 hover:text-gray-600'
    }`}
  >
    <StreetIndicator active={active} />
    <span>{label}</span>
  </button>
);

interface SeatPosition {
  position: string;
  left: number;
  top: number;
}

const SEAT_POSITIONS_6: SeatPosition[] = [
  { position: 'CO', left: 160, top: 10 },
  { position: 'BTN', left: 420, top: 10 },
  { position: 'SB', left: 572, top: 168 },
  { position: 'BB', left: 420, top: 315 },
  { position: 'UTG', left: 160, top: 315 },
  { position: 'HJ', left: 0, top: 160 },
];

export function HandReplayer({ hand, playerName = 'Hero', playerAvatar }: HandReplayerProps) {
  const [currentStreet, setCurrentStreet] = useState<'preflop' | 'flop' | 'turn' | 'river'>('preflop');

  const positions = SEAT_POSITIONS_6;
  const heroPosition = hand.position;

  const handleReset = () => {
    setCurrentStreet('preflop');
  };

  const handleStreetClick = (street: 'preflop' | 'flop' | 'turn' | 'river') => {
    setCurrentStreet(street);
  };

  const showFlop = currentStreet === 'flop' || currentStreet === 'turn' || currentStreet === 'river';
  const showTurn = currentStreet === 'turn' || currentStreet === 'river';
  const showRiver = currentStreet === 'river';
  const showResult = currentStreet === 'river';

  const getResultColor = () => {
    if (hand.result === 'win') return 'text-green-500';
    if (hand.result === 'lose') return 'text-red-500';
    return 'text-gray-500';
  };

  const formatProfit = (profit: number) => {
    const prefix = profit >= 0 ? '+' : '';
    return `${prefix}$${Math.abs(profit).toFixed(2)}`;
  };

  const getSeatStyle = (seat: SeatPosition): React.CSSProperties => ({
    position: 'absolute',
    left: seat.left,
    top: seat.top,
    transform: 'translate(-50%, -50%)',
    zIndex: 20,
  });

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-3 pb-3 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <span className="text-[11px] text-gray-500">Position:</span>
          <span className="px-2 py-1 bg-gray-100 rounded text-[11px] font-medium text-gray-700">{hand.position}</span>
          {hand.blinds && (
            <>
              <span className="text-gray-300">|</span>
              <span className="text-[11px] text-gray-500">Blinds:</span>
              <span className="px-2 py-1 bg-gray-100 rounded text-[11px] font-medium text-gray-700">{hand.blinds}</span>
            </>
          )}
        </div>
        <button
          onClick={handleReset}
          className="flex items-center gap-1 px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded text-[11px] transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
          Reset
        </button>
      </div>

      <div className="flex justify-center" style={{ height: 340 }}>
        <div 
          className="relative"
          style={{
            width: 580,
            height: 340,
            borderRadius: '50% / 40%',
            background: 'radial-gradient(circle at center, #1a1a1f, #0e0e12)',
            border: '2px solid #2a2a30',
          }}
        >
          <div className="pot absolute text-center z-10" style={{ left: 286, top: 160 }}>
            <div className="px-3 py-1 bg-black/50 rounded">
              <div className="text-white text-[14px] opacity-80">
                <div>{formatProfit(hand.pot || hand.profit)} BB</div>
                <div className="text-[10px] opacity-60">{formatProfit(hand.pot || hand.profit)} BB</div>
              </div>
            </div>
          </div>

          {positions.map((seat) => {
            const isHero = seat.position === heroPosition;

            return (
              <div
                key={seat.position}
                style={getSeatStyle(seat)}
              >
                <div className={`w-[80px] h-[80px] rounded-full flex flex-col justify-center items-center ${
                  isHero ? 'bg-blue-500/80' : 'bg-[#2b2b30]'
                }`}>
                  <span className={`text-[11px] font-bold ${isHero ? 'text-white' : 'text-gray-300'}`}>
                    {seat.position}
                  </span>
                  {isHero && (
                    <div className="flex gap-1 mt-1">
                      {hand.preflop.map((card, i) => (
                        <CardComponent key={i} card={card} size="sm" />
                      ))}
                    </div>
                  )}
                  {!isHero && (
                    <span className="text-[10px] text-gray-500 mt-1">10</span>
                  )}
                </div>
              </div>
            );
          })}

          <div className="absolute text-center z-30" style={{ left: 286, top: 175 }}>
            <div className="text-gray-500 text-[10px] mb-1">Board</div>
            <div className="flex gap-1 items-center bg-black/30 rounded-lg px-3 py-1.5">
              {showFlop && hand.flop.map((card, i) => (
                <CardComponent key={`flop-${i}`} card={card} size="sm" />
              ))}
              {showTurn && hand.turn && (
                <CardComponent card={hand.turn} size="sm" />
              )}
              {showRiver && hand.river && (
                <CardComponent card={hand.river} size="sm" />
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-gray-200">
        <div className="flex items-center gap-1 mb-2">
          <span className="text-[10px] text-gray-400 mr-2">Street:</span>
          <StreetTab 
            label="Preflop" 
            active={currentStreet === 'preflop'} 
            onClick={() => handleStreetClick('preflop')} 
          />
          <StreetTab 
            label="Flop" 
            active={currentStreet === 'flop'} 
            onClick={() => handleStreetClick('flop')} 
          />
          <StreetTab 
            label="Turn" 
            active={currentStreet === 'turn'} 
            onClick={() => handleStreetClick('turn')} 
          />
          <StreetTab 
            label="River" 
            active={currentStreet === 'river'} 
            onClick={() => handleStreetClick('river')} 
          />
        </div>

        <div className={`transition-opacity duration-300 ${showResult ? 'opacity-100' : 'opacity-0'}`}>
          <div className="flex gap-3">
            <div className={`px-3 py-2 rounded border ${
              hand.result === 'win' ? 'border-green-300 bg-green-50' : 
              hand.result === 'lose' ? 'border-red-300 bg-red-50' : 
              'border-gray-300 bg-gray-50'
            }`}>
              <div className="text-[9px] text-gray-500 mb-0.5">Result</div>
              <div className={`text-sm font-semibold ${getResultColor()}`}>
                {hand.result.charAt(0).toUpperCase() + hand.result.slice(1)}
              </div>
            </div>
            <div className="px-3 py-2 rounded border border-gray-300 bg-gray-50">
              <div className="text-[9px] text-gray-500 mb-0.5">Profit</div>
              <div className={`text-sm font-semibold ${hand.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatProfit(hand.profit)}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 flex justify-center">
        <div className="flex flex-col items-center">
          <div className="text-[10px] text-gray-400 mb-2">Your Hand</div>
          <div className="flex gap-1">
            {hand.preflop.map((card, i) => (
              <CardComponent key={i} card={card} size="lg" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
