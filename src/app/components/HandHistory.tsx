import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Spade, Heart, Diamond, Club, CheckCircle2, AlertCircle } from 'lucide-react';

interface Hand {
  id: string;
  playerName: string;
  playerAvatar: string;
  timestamp: Date;
  action: 'win' | 'loss' | 'fold';
  amount: number;
  cards?: string[];
  flop?: string[];
  turn?: string;
  river?: string;
  pot: number;
  position: string;
  reconciled: boolean;
}

const suits = {
  's': Spade,
  'h': Heart,
  'd': Diamond,
  'c': Club
};

const suitColors = {
  's': 'text-gray-900',
  'h': 'text-red-600',
  'd': 'text-red-600',
  'c': 'text-gray-900'
};

const Card = ({ card }: { card: string }) => {
  const rank = card.slice(0, -1);
  const suit = card.slice(-1) as 's' | 'h' | 'd' | 'c';
  const SuitIcon = suits[suit];
  
  return (
    <div className="inline-flex items-center gap-0.5 bg-white border border-gray-300 rounded px-1.5 py-0.5 text-xs font-bold shadow-sm">
      <span className={suitColors[suit]}>{rank}</span>
      <SuitIcon className={`w-3 h-3 ${suitColors[suit]}`} />
    </div>
  );
};

export function HandHistory() {
  const [hands, setHands] = useState<Hand[]>([]);

  // Mock data generation
  useEffect(() => {
    const players = [
      { name: 'Marcus Chen', avatar: 'https://images.unsplash.com/photo-1674644674031-b49db824edbc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400' },
      { name: 'Sarah Mitchell', avatar: 'https://images.unsplash.com/photo-1761243892035-c3e13829115a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400' },
      { name: 'Alex Thompson', avatar: 'https://images.unsplash.com/photo-1532272278764-53cd1fe53f72?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400' },
      { name: 'Emma Wilson', avatar: 'https://images.unsplash.com/photo-1758518732130-4b51da74b0b6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400' },
      { name: 'David Rodriguez', avatar: 'https://images.unsplash.com/photo-1762810211495-d79a02ba7d0d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400' },
      { name: 'James Parker', avatar: 'https://images.unsplash.com/photo-1769071166530-11f7857f4c59?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400' }
    ];

    const cardRanks = ['A', 'K', 'Q', 'J', '10', '9', '8', '7', '6', '5', '4', '3', '2'];
    const cardSuits = ['s', 'h', 'd', 'c'];
    const positions = ['BTN', 'SB', 'BB', 'UTG', 'MP', 'CO'];
    const actions: Array<'win' | 'loss' | 'fold'> = ['win', 'loss', 'fold'];

    const generateCard = (exclude: string[] = []): string => {
      let card: string;
      do {
        const rank = cardRanks[Math.floor(Math.random() * cardRanks.length)];
        const suit = cardSuits[Math.floor(Math.random() * cardSuits.length)];
        card = `${rank}${suit}`;
      } while (exclude.includes(card));
      return card;
    };

    const generateHand = (): Hand => {
      const player = players[Math.floor(Math.random() * players.length)];
      const action = actions[Math.floor(Math.random() * actions.length)];
      const amount = action === 'fold' ? 0 : Math.floor(Math.random() * 500) + 50;
      
      const usedCards: string[] = [];
      
      // Generate hole cards if not folding
      const cards = action !== 'fold' ? [
        generateCard(usedCards),
        generateCard([...usedCards])
      ] : undefined;
      
      if (cards) {
        usedCards.push(...cards);
      }

      // Generate community cards based on action
      // Must follow logical progression: Hole -> Flop -> Turn -> River
      let flop: string[] | undefined;
      let turn: string | undefined;
      let river: string | undefined;

      if (action === 'fold') {
        // 60% chance fold happened preflop (no community cards)
        // 30% chance fold on flop (must have hole + flop)
        // 10% chance fold on turn (must have hole + flop + turn)
        const foldStage = Math.random();
        
        if (foldStage > 0.6) {
          // Fold on flop or later - generate flop
          flop = [generateCard(usedCards), generateCard(usedCards), generateCard(usedCards)];
          usedCards.push(...flop);
          
          if (foldStage > 0.9) {
            // Fold on turn - must have flop + turn
            turn = generateCard(usedCards);
          }
        }
      } else {
        // Win/Loss: show full progression with hole cards
        flop = [generateCard(usedCards), generateCard(usedCards), generateCard(usedCards)];
        usedCards.push(...flop);
        
        // 80% chance to see turn (requires flop)
        if (Math.random() > 0.2) {
          turn = generateCard(usedCards);
          usedCards.push(turn);
          
          // 90% chance to see river (requires turn, which requires flop)
          if (Math.random() > 0.1) {
            river = generateCard(usedCards);
          }
        }
      }

      // 85% chance hand is reconciled
      const reconciled = Math.random() > 0.15;

      return {
        id: Date.now().toString() + Math.random(),
        playerName: player.name,
        playerAvatar: player.avatar,
        timestamp: new Date(),
        action,
        amount,
        cards,
        flop,
        turn,
        river,
        pot: Math.floor(Math.random() * 1000) + 200,
        position: positions[Math.floor(Math.random() * positions.length)],
        reconciled
      };
    };

    // Initialize with some hands
    const initialHands = Array.from({ length: 8 }, generateHand).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    setHands(initialHands);

    // Add new hands every 5-10 seconds
    const interval = setInterval(() => {
      const newHand = generateHand();
      setHands(prev => [newHand, ...prev].slice(0, 20)); // Keep only last 20 hands
    }, Math.random() * 5000 + 5000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="bg-white border border-gray-200 rounded overflow-hidden">
      <div className="px-4 py-2.5 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
          <h3 className="text-xs font-semibold text-gray-900 uppercase tracking-wide">Live Hand History</h3>
        </div>
        <span className="text-[10px] text-gray-500">{hands.length} recent hands</span>
      </div>
      
      <div className="divide-y divide-gray-100 overflow-y-auto" style={{ maxHeight: '450px' }}>
        {hands.map((hand) => (
          <div 
            key={hand.id} 
            className="p-2 hover:bg-gray-50 transition-colors animate-fadeIn border-l-2"
            style={{ 
              borderLeftColor: hand.action === 'win' ? '#10b981' : hand.action === 'loss' ? '#ef4444' : '#e5e7eb'
            }}
          >
            <div className="flex items-start gap-2">
              <img 
                src={hand.playerAvatar} 
                alt={hand.playerName} 
                className="w-6 h-6 rounded-full border border-gray-200" 
              />
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-gray-900">{hand.playerName}</span>
                    <span className="text-[9px] font-medium text-gray-600 bg-gray-100 px-1 py-0.5 rounded">
                      {hand.position}
                    </span>
                    {/* Reconciliation Status */}
                    <div className="group relative">
                      {hand.reconciled ? (
                        <CheckCircle2 className="w-3 h-3 text-green-600" />
                      ) : (
                        <AlertCircle className="w-3 h-3 text-amber-500" />
                      )}
                      <div className="absolute left-0 top-4 hidden group-hover:block z-10 w-48 p-2 bg-gray-900 text-white text-[10px] rounded shadow-lg">
                        <div className="font-semibold mb-0.5">
                          {hand.reconciled ? 'Reconciled' : 'Not Reconciled'}
                        </div>
                        <div className="text-gray-300">
                          Synced with hand history
                        </div>
                      </div>
                    </div>
                  </div>
                  <span className="text-[9px] text-gray-500">{formatTime(hand.timestamp)}</span>
                </div>

                {/* All Cards - Horizontal Layout */}
                <div className="mb-1.5 flex items-center gap-2 flex-wrap">
                  {/* Hole Cards */}
                  {hand.cards && (
                    <div className="flex items-center gap-1">
                      <span className="text-[8px] font-semibold text-gray-500 uppercase tracking-wide">H:</span>
                      {hand.cards.map((card, idx) => (
                        <Card key={idx} card={card} />
                      ))}
                    </div>
                  )}

                  {/* Flop */}
                  {hand.flop && (
                    <>
                      <div className="w-px h-4 bg-gray-300"></div>
                      <div className="flex items-center gap-1">
                        <span className="text-[8px] font-semibold text-gray-500 uppercase tracking-wide">F:</span>
                        {hand.flop.map((card, idx) => (
                          <Card key={idx} card={card} />
                        ))}
                      </div>
                    </>
                  )}

                  {/* Turn */}
                  {hand.turn && (
                    <>
                      <div className="w-px h-4 bg-gray-300"></div>
                      <div className="flex items-center gap-1">
                        <span className="text-[8px] font-semibold text-gray-500 uppercase tracking-wide">T:</span>
                        <Card card={hand.turn} />
                      </div>
                    </>
                  )}

                  {/* River */}
                  {hand.river && (
                    <>
                      <div className="w-px h-4 bg-gray-300"></div>
                      <div className="flex items-center gap-1">
                        <span className="text-[8px] font-semibold text-gray-500 uppercase tracking-wide">R:</span>
                        <Card card={hand.river} />
                      </div>
                    </>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    {hand.action === 'win' && (
                      <div className="flex items-center gap-1 bg-green-50 text-green-700 px-1.5 py-0.5 rounded border border-green-200">
                        <TrendingUp className="w-3 h-3" />
                        <span className="font-bold text-[10px]">+${hand.amount}</span>
                      </div>
                    )}
                    {hand.action === 'loss' && (
                      <div className="flex items-center gap-1 bg-red-50 text-red-700 px-1.5 py-0.5 rounded border border-red-200">
                        <TrendingDown className="w-3 h-3" />
                        <span className="font-bold text-[10px]">-${hand.amount}</span>
                      </div>
                    )}
                    {hand.action === 'fold' && (
                      <div className="flex items-center gap-1 bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">
                        <span className="font-semibold text-[10px]">Fold</span>
                      </div>
                    )}
                  </div>
                  <div className="text-[10px] font-medium text-gray-600">
                    Pot: <span className="font-bold text-gray-900">${hand.pot}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {hands.length === 0 && (
          <div className="p-8 text-center text-gray-400 text-sm">
            No hands played yet. Waiting for activity...
          </div>
        )}
      </div>
    </div>
  );
}
