import { useState, useMemo } from 'react';
import { RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react';

export interface Card {
  rank: string;
  suit: 'hearts' | 'diamonds' | 'clubs' | 'spades';
}

export interface HandAction {
  id: string;
  player: string;
  position: string;
  action: 'fold' | 'check' | 'call' | 'bet' | 'raise' | 'allin';
  amount?: number;
  street: 'preflop' | 'flop' | 'turn' | 'river';
  isHero?: boolean;
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
  actions?: HandAction[];
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

const POSITION_STYLES = [
  { position: 'CO', left: 160, top: 10 },
  { position: 'BTN', left: 420, top: 10 },
  { position: 'SB', left: 572, top: 168 },
  { position: 'BB', left: 420, top: 315 },
  { position: 'UTG', left: 160, top: 315 },
  { position: 'HJ', left: 0, top: 160 },
];

const ACTION_COLORS: Record<string, string> = {
  fold: 'text-gray-400',
  check: 'text-white',
  call: 'text-yellow-400',
  bet: 'text-green-400',
  raise: 'text-blue-400',
  allin: 'text-red-400',
};

const PREFLOP_ORDER = ['UTG', 'HJ', 'CO', 'BTN', 'SB', 'BB'];
const POSTFLOP_ORDER = ['SB', 'BB', 'UTG', 'HJ', 'CO', 'BTN'];

const generateMockActions = (heroPosition: string, heroName: string): HandAction[] => {
  const actions: HandAction[] = [];
  let actionId = 0;
  let currentBet = 0;

  const addAction = (position: string, action: HandAction['action'], amount?: number, street: HandAction['street']) => {
    actions.push({
      id: `action-${actionId++}`,
      player: position === heroPosition ? heroName : `${position}`,
      position,
      action,
      amount,
      street,
      isHero: position === heroPosition,
    });
    if (action === 'bet' || action === 'raise') {
      currentBet = amount || 0;
    } else if (action === 'fold' || action === 'check') {
      currentBet = 0;
    }
  };

  const getNextActivePosition = (pos: string, activePlayers: Set<string>, order: string[]): string | null => {
    let attempts = 0;
    let currentIndex = order.indexOf(pos);
    while (attempts < order.length) {
      currentIndex = (currentIndex + 1) % order.length;
      if (activePlayers.has(order[currentIndex])) {
        return order[currentIndex];
      }
      attempts++;
    }
    return null;
  };

  const getFirstActivePosition = (activePlayers: Set<string>, order: string[]): string | null => {
    for (const pos of order) {
      if (activePlayers.has(pos)) {
        return pos;
      }
    }
    return null;
  };

  let activePlayers = new Set(PREFLOP_ORDER);

  // Preflop: UTG, HJ, CO, BTN, SB, BB
  let currentPos = getFirstActivePosition(activePlayers, PREFLOP_ORDER) || 'UTG';
  while (currentPos && actions.filter(a => a.street === 'preflop').length < 8) {
    const isHero = currentPos === heroPosition;
    
    if (isHero) {
      if (currentBet === 0) {
        if (Math.random() > 0.3) {
          addAction(currentPos, 'bet', Math.floor(Math.random() * 3 + 2) * 2, 'preflop');
        } else {
          addAction(currentPos, 'check', undefined, 'preflop');
        }
      } else {
        if (Math.random() > 0.4) {
          addAction(currentPos, 'call', currentBet, 'preflop');
        } else if (Math.random() > 0.2) {
          addAction(currentPos, 'raise', currentBet + Math.floor(Math.random() * 2 + 1) * 2, 'preflop');
        } else {
          addAction(currentPos, 'fold', undefined, 'preflop');
          activePlayers.delete(currentPos);
        }
      }
    } else {
      const rand = Math.random();
      if (currentBet === 0) {
        if (rand > 0.6) {
          addAction(currentPos, 'bet', Math.floor(Math.random() * 3 + 2) * 2, 'preflop');
        } else {
          addAction(currentPos, 'check', undefined, 'preflop');
        }
      } else {
        if (rand > 0.5) {
          addAction(currentPos, 'call', currentBet, 'preflop');
        } else if (rand > 0.25) {
          addAction(currentPos, 'raise', currentBet + Math.floor(Math.random() * 3 + 1) * 2, 'preflop');
        } else {
          addAction(currentPos, 'fold', undefined, 'preflop');
          activePlayers.delete(currentPos);
        }
      }
    }

    const nextPos = getNextActivePosition(currentPos, activePlayers, PREFLOP_ORDER);
    if (!nextPos) break;
    currentPos = nextPos;
  }

  currentBet = 0;
  
  // Postflop: SB, BB, UTG, HJ, CO, BTN
  const streets: HandAction['street'][] = ['flop', 'turn', 'river'];
  for (const street of streets) {
    if (activePlayers.size <= 1) break;
    
    // Start from first active position after SB
    let startPos = 'SB';
    if (!activePlayers.has('SB')) {
      startPos = getNextActivePosition('SB', activePlayers, POSTFLOP_ORDER) || 'BB';
    }
    currentPos = startPos;
    
    let streetComplete = false;
    
    while (!streetComplete && activePlayers.size > 1) {
      const rand = Math.random();
      
      if (currentBet === 0) {
        // No bet yet - can check or bet
        if (rand > 0.5) {
          addAction(currentPos, 'check', undefined, street);
        } else {
          addAction(currentPos, 'bet', Math.floor(Math.random() * 5 + 3) * 2, street);
        }
      } else {
        // There is a bet - can call, raise, or fold
        if (rand > 0.5) {
          addAction(currentPos, 'call', currentBet, street);
          streetComplete = true;
        } else if (rand > 0.25) {
          addAction(currentPos, 'raise', currentBet + Math.floor(Math.random() * 5 + 2) * 2, street);
        } else {
          addAction(currentPos, 'fold', undefined, street);
          activePlayers.delete(currentPos);
          streetComplete = true;
        }
      }

      const nextPos = getNextActivePosition(currentPos, activePlayers, POSTFLOP_ORDER);
      if (!nextPos || streetComplete) break;
      currentPos = nextPos;
    }
    currentBet = 0;
  }

  return actions;
};

const CardComponent = ({ card, size = 'md' }: { card: Card; size?: 'sm' | 'md' | 'lg' }) => {
  const suit = SUITS[card.suit];
  const sizeClasses = {
    sm: 'w-[32px] h-[44px] text-sm',
    md: 'w-[40px] h-[56px] text-base',
    lg: 'w-[48px] h-[68px] text-lg',
  };

  return (
    <div className={`bg-white ${sizeClasses[size]} rounded-lg shadow-md flex items-center justify-center font-bold ${suit.color}`}>
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

const ActionBadge = ({ action, amount }: { action: HandAction['action']; amount?: number }) => {
  const label = action.charAt(0).toUpperCase() + action.slice(1);
  return (
    <span className={`font-semibold ${ACTION_COLORS[action]}`}>
      {label}{amount ? ` $${amount}` : ''}
    </span>
  );
};

export function HandReplayer({ hand, playerName = 'Hero', playerAvatar }: HandReplayerProps) {
  const [currentActionIndex, setCurrentActionIndex] = useState(-1);
  
  const actions = useMemo(() => {
    return hand.actions || generateMockActions(hand.position, playerName);
  }, [hand.actions, hand.position, playerName]);
  
  const heroPosition = hand.position;
  
  const currentAction = currentActionIndex >= 0 ? actions[currentActionIndex] : null;
  const currentStreet = currentAction?.street || (currentActionIndex === -1 ? 'preflop' : currentAction?.street);
  
  const playersInHand = new Set(actions.slice(0, currentActionIndex >= 0 ? currentActionIndex + 1 : 0).map(a => a.position));
  const currentPlayerTurn = currentActionIndex >= 0 ? actions[currentActionIndex + 1]?.position : actions[0]?.position;

  const handleReset = () => {
    setCurrentActionIndex(-1);
  };

  const handlePrevAction = () => {
    if (currentActionIndex > 0) {
      setCurrentActionIndex(currentActionIndex - 1);
    }
  };

  const handleNextAction = () => {
    if (currentActionIndex < actions.length - 1) {
      setCurrentActionIndex(currentActionIndex + 1);
    }
  };

  const showFlop = currentStreet === 'flop' || currentStreet === 'turn' || currentStreet === 'river';
  const showTurn = currentStreet === 'turn' || currentStreet === 'river';
  const showRiver = currentStreet === 'river';
  const showResult = currentActionIndex === actions.length - 1;

  const calculatePot = () => {
    let pot = 0;
    for (let i = 0; i <= currentActionIndex && i < actions.length; i++) {
      if (actions[i].action === 'bet' || actions[i].action === 'call' || actions[i].action === 'raise' || actions[i].action === 'allin') {
        pot += actions[i].amount || 0;
      }
    }
    return pot || hand.profit;
  };

  const formatProfit = (profit: number) => {
    const prefix = profit >= 0 ? '+' : '';
    return `${prefix}$${Math.abs(profit).toFixed(0)}`;
  };

  const getResultColor = () => {
    if (hand.result === 'win') return 'text-green-400';
    if (hand.result === 'lose') return 'text-red-400';
    return 'text-gray-400';
  };

  const getSeatStyle = (seat: { position: string; left: number; top: number }): React.CSSProperties => ({
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
          <div className="pot absolute text-center z-10" style={{ left: 250, top: 190 }}>
            <div className="px-3 py-1 bg-black/50 rounded">
              <div className="text-white text-[14px] opacity-80">
                <div>{formatProfit(calculatePot())} BB</div>
                <div className="text-[10px] opacity-60">Pot</div>
              </div>
            </div>
          </div>

          {POSITION_STYLES.map((seat) => {
            const isHero = seat.position === heroPosition;
            const isInHand = playersInHand.has(seat.position);
            const isCurrentTurn = seat.position === currentPlayerTurn;
            const seatAction = actions.find(a => a.position === seat.position && a.street === currentStreet);

            return (
              <div
                key={seat.position}
                style={getSeatStyle(seat)}
              >
                <div className={`w-[80px] h-[80px] rounded-full flex flex-col justify-center items-center transition-all bg-[#2b2b30] ${
                  isCurrentTurn ? 'ring-2 ring-yellow-400 ring-offset-2 ring-offset-[#0e0e12]' : ''
                }`}>
                  <span className={`text-[11px] font-bold ${isHero ? 'text-white' : isInHand ? 'text-gray-300' : 'text-gray-500'}`}>
                    {seat.position}
                  </span>
                  {isHero && isInHand && (
                    <div className="flex gap-1 mt-1">
                      {hand.preflop.map((card, i) => (
                        <CardComponent key={i} card={card} size="sm" />
                      ))}
                    </div>
                  )}
                  {!isHero && isInHand && (
                    <span className="text-[10px] text-gray-500 mt-1">10</span>
                  )}
                  {isCurrentTurn && currentAction && (
                    <div className="absolute -top-6 px-1.5 py-0.5 bg-yellow-500 rounded text-[9px] font-bold text-black whitespace-nowrap">
                      {currentAction.action.toUpperCase()}{currentAction.amount ? ` $${currentAction.amount}` : ''}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          <div className="absolute text-center z-30" style={{ left: 226, top: 100 }}>
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
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1">
            <span className="text-[10px] text-gray-400 mr-2">Street:</span>
            <StreetTab 
              label="Preflop" 
              active={currentStreet === 'preflop'} 
              onClick={() => {}} 
            />
            <StreetTab 
              label="Flop" 
              active={currentStreet === 'flop'} 
              onClick={() => {}} 
            />
            <StreetTab 
              label="Turn" 
              active={currentStreet === 'turn'} 
              onClick={() => {}} 
            />
            <StreetTab 
              label="River" 
              active={currentStreet === 'river'} 
              onClick={() => {}} 
            />
          </div>
          <div className="text-[10px] text-gray-500">
            {currentActionIndex + 1} / {actions.length}
          </div>
        </div>

        <div className="flex items-center justify-between bg-gray-100 rounded-lg px-3 py-2">
          <button
            onClick={handlePrevAction}
            disabled={currentActionIndex <= 0}
            className={`p-1.5 rounded transition-colors ${
              currentActionIndex <= 0 
                ? 'text-gray-300 cursor-not-allowed' 
                : 'text-gray-600 hover:bg-gray-200'
            }`}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <div className="text-center flex-1">
            {currentAction ? (
              <div className="text-[13px]">
                <span className="font-semibold text-gray-700">{currentAction.position}</span>
                <span className="mx-2">-</span>
                <ActionBadge action={currentAction.action} amount={currentAction.amount} />
              </div>
            ) : (
              <span className="text-[12px] text-gray-400">Press Next to start</span>
            )}
          </div>
          
          <button
            onClick={handleNextAction}
            disabled={currentActionIndex >= actions.length - 1}
            className={`p-1.5 rounded transition-colors ${
              currentActionIndex >= actions.length - 1 
                ? 'text-gray-300 cursor-not-allowed' 
                : 'text-gray-600 hover:bg-gray-200'
            }`}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <div className={`transition-opacity duration-300 mt-2 ${showResult ? 'opacity-100' : 'opacity-0'}`}>
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
    </div>
  );
}
