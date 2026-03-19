import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Clock, TrendingUp, TrendingDown, Video, CheckCircle2, AlertCircle } from 'lucide-react';
import SlideInPanel from './SlideInPanel';
import { Spade, Heart, Diamond, Club } from 'lucide-react';

interface Player {
  id: string;
  name: string;
  avatar: string;
  profitLoss: number;
  sessionTime: number;
  status: 'LIVE' | 'IN GAME' | 'Offline';
  color: string;
}

interface PlayerSessionModalProps {
  player: Player;
  isOpen: boolean;
  onClose: () => void;
}

interface Hand {
  id: string;
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

const pokerImages = [
  'https://pokerindustrypro.com/site_media/media/uploads/news/winamax-multiple-playgrounds-tables-playing-wm.png',
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR96OzUaaR68qHFBKnFGT3NIKRGQO8B-hMOqA&s',
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSRlJS6AIRfSSEe3JD3XviG5w1dp3koCzHuGg&s',
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRjn_kPDtL-vZhpVcmD1tPkOXB0Z64kSJEtaw&s',
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQACjBfVJywXemsMrjqeMk9066Ogmu_Wevv4A&s',
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRzg39aGmduS7jxmsSlGTWR_pUTq8YmnyudWg&s',
];

export function PlayerSessionModal({ player, isOpen, onClose }: PlayerSessionModalProps) {
  const [sessionData, setSessionData] = useState<any[]>([]);
  const [hands, setHands] = useState<Hand[]>([]);
  
  const imageIndex = parseInt(player.id.replace(/\D/g, '')) % pokerImages.length;
  const pokerImage = pokerImages[imageIndex];

  useEffect(() => {
    const initialData: any[] = [];
    const startTime = new Date();
    startTime.setMinutes(startTime.getMinutes() - player.sessionTime);

    for (let i = 0; i <= 24; i++) {
      const time = new Date(startTime.getTime() + (player.sessionTime / 24) * i * 60000);
      const trend = (player.profitLoss / 24) * i;
      const volatility = Math.random() * 400 - 200;
      initialData.push({
        time: time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        pl: Math.round(trend + volatility)
      });
    }

    setSessionData(initialData);
  }, [player]);

  useEffect(() => {
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
      const action = actions[Math.floor(Math.random() * actions.length)];
      const amount = action === 'fold' ? 0 : Math.floor(Math.random() * 500) + 50;
      
      const usedCards: string[] = [];
      
      const cards = action !== 'fold' ? [
        generateCard(usedCards),
        generateCard([...usedCards])
      ] : undefined;
      
      if (cards) {
        usedCards.push(...cards);
      }

      let flop: string[] | undefined;
      let turn: string | undefined;
      let river: string | undefined;

      if (action === 'fold') {
        if (Math.random() > 0.4) {
          flop = [generateCard(usedCards), generateCard(usedCards), generateCard(usedCards)];
          usedCards.push(...flop);
        }
      } else {
        flop = [generateCard(usedCards), generateCard(usedCards), generateCard(usedCards)];
        usedCards.push(...flop);
        
        if (Math.random() > 0.3) {
          turn = generateCard(usedCards);
          usedCards.push(turn);
          
          if (Math.random() > 0.4) {
            river = generateCard(usedCards);
          }
        }
      }

      return {
        id: `${Date.now()}-${Math.random()}`,
        timestamp: new Date(Date.now() - Math.random() * 3600000),
        action,
        amount,
        cards,
        flop,
        turn,
        river,
        pot: Math.floor(Math.random() * 1000) + 100,
        position: positions[Math.floor(Math.random() * positions.length)],
        reconciled: Math.random() > 0.2
      };
    };

    const initialHands = Array.from({ length: 10 }, generateHand).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    setHands(initialHands);

    const interval = setInterval(() => {
      const newHand = generateHand();
      setHands(prev => [newHand, ...prev].slice(0, 20));
    }, Math.random() * 5000 + 5000);

    return () => clearInterval(interval);
  }, [player]);

  const formatTime = (dateOrMinutes: Date | number) => {
    if (typeof dateOrMinutes === 'number') {
      const hours = Math.floor(dateOrMinutes / 60);
      const mins = dateOrMinutes % 60;
      return `${hours}h ${mins}m`;
    } else {
      const now = new Date();
      const diff = Math.floor((now.getTime() - dateOrMinutes.getTime()) / 1000);
      
      if (diff < 60) return `${diff}s ago`;
      if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
      return dateOrMinutes.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    }
  };

  const formatPL = (amount: number) => {
    const sign = amount >= 0 ? '+' : '';
    return `${sign}$${amount.toLocaleString()}`;
  };

  const isProfit = player.profitLoss >= 0;
  const handsPlayed = Math.floor((player.sessionTime / 60) * 100);
  const buyIn = 500;
  const normalizedBB100 = handsPlayed > 0
    ? Math.max(2, Math.min(10, 5 + (player.profitLoss / 1000)))
    : 5;

  const content = (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-3 gap-3">
        <div className="p-4 rounded-lg border bg-gray-50 border-gray-200">
          <div className="text-gray-500 text-xs mb-1 font-medium">Current P/L</div>
          <div className="flex items-center gap-2">
            {isProfit ? (
              <TrendingUp className="w-5 h-5 text-gray-400" />
            ) : (
              <TrendingDown className="w-5 h-5 text-gray-400" />
            )}
            <span className={`text-2xl font-bold ${
              isProfit ? 'text-green-600' : 'text-red-600'
            }`}>
              {formatPL(player.profitLoss)}
            </span>
          </div>
        </div>

        <div className="p-4 rounded-lg bg-gray-50 border border-gray-200">
          <div className="text-gray-500 text-xs mb-1 font-medium">Hands Played</div>
          <div className="text-2xl font-bold text-gray-900">
            {handsPlayed}
          </div>
        </div>

        <div className="p-4 rounded-lg bg-gray-50 border border-gray-200">
          <div className="text-gray-500 text-xs mb-1 font-medium">Win Rate</div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-gray-900">
              {normalizedBB100.toFixed(1)}
            </span>
            <span className="text-sm font-semibold text-gray-500">bb/100</span>
          </div>
        </div>
      </div>

      {/* Video Feed - Only for LIVE players */}
      {player.status === 'LIVE' && (
        <div className="bg-white rounded-xl overflow-hidden border border-gray-200">
          <div className="px-4 py-2.5 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Video className="w-4 h-4 text-gray-600" />
              <h3 className="text-xs font-semibold text-gray-900 uppercase tracking-wide">Live Feed</h3>
            </div>
            <div className="flex items-center gap-1.5 bg-red-600 text-white px-2 py-1 rounded-full text-[10px] font-semibold">
              <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
              REC
            </div>
          </div>

          <div className="relative bg-gray-100 aspect-video">
            <img
              src={pokerImage}
              alt={`${player.name} playing poker`}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}

      {/* Performance Graph */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-4 py-2.5 border-b border-gray-200 bg-gray-50">
          <h3 className="text-xs font-semibold text-gray-900 uppercase tracking-wide">Session Performance</h3>
        </div>
        <div className="p-4">
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={sessionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="time" 
                stroke="#6b7280"
                style={{ fontSize: '11px' }}
              />
              <YAxis 
                stroke="#6b7280"
                style={{ fontSize: '11px' }}
                tickFormatter={(value) => `$${value.toLocaleString()}`}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#ffffff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  padding: '8px 12px',
                  color: '#111827',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                }}
                formatter={(value: number) => [`$${value.toLocaleString()}`, 'P/L']}
              />
              <Line
                type="monotone"
                dataKey="pl"
                name="P/L"
                stroke={player.color}
                strokeWidth={2}
                dot={{ r: 3, fill: player.color }}
                activeDot={{ r: 5 }}
              />
             </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Session Details */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-4 py-2.5 border-b border-gray-200 bg-gray-50">
          <h3 className="text-xs font-semibold text-gray-900 uppercase tracking-wide">Session Details</h3>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
              <div className="text-gray-500 text-xs mb-1 font-medium">Buy-in</div>
              <div className="text-gray-900 font-bold">${buyIn}</div>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
              <div className="text-gray-500 text-xs mb-1 font-medium">Current Stack</div>
              <div className="text-gray-900 font-bold">${(buyIn + player.profitLoss).toLocaleString()}</div>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
              <div className="text-gray-500 text-xs mb-1 font-medium">Biggest Win</div>
              <div className="text-green-600 font-bold">$850</div>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
              <div className="text-gray-500 text-xs mb-1 font-medium">Biggest Loss</div>
              <div className="text-red-600 font-bold">-$320</div>
            </div>
          </div>
        </div>
      </div>

      {/* Hand History */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-4 py-2.5 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <h3 className="text-xs font-semibold text-gray-900 uppercase tracking-wide">Live Hand History</h3>
          </div>
          <span className="text-[10px] text-gray-500">{hands.length} hands</span>
        </div>
        
        <div className="divide-y divide-gray-100 overflow-y-auto" style={{ maxHeight: '400px' }}>
          {hands.map((hand) => (
            <div 
              key={hand.id} 
              className="p-2 hover:bg-gray-50 transition-colors animate-fadeIn border-l-2"
              style={{ 
                borderLeftColor: hand.action === 'win' ? '#10b981' : hand.action === 'loss' ? '#ef4444' : '#e5e7eb'
              }}
            >
              <div className="flex items-start gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[9px] font-medium text-gray-600 bg-gray-100 px-1 py-0.5 rounded">
                        {hand.position}
                      </span>
                      <div className="group relative">
                        {hand.reconciled ? (
                          <CheckCircle2 className="w-3 h-3 text-green-600" />
                        ) : (
                          <AlertCircle className="w-3 h-3 text-amber-500" />
                        )}
                        <div className="absolute left-0 top-4 hidden group-hover:block z-10 w-32 p-2 bg-gray-900 text-white text-[10px] rounded shadow-lg">
                          {hand.reconciled ? 'Reconciled' : 'Not Reconciled'}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-bold ${
                        hand.action === 'win' ? 'text-green-600' : hand.action === 'loss' ? 'text-red-600' : 'text-gray-500'
                      }`}>
                        {hand.action === 'win' ? '+' : hand.action === 'loss' ? '-' : ''}${hand.amount.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="mb-1.5 flex items-center gap-2 flex-wrap">
                    {hand.cards && (
                      <div className="flex items-center gap-1">
                        <span className="text-[8px] font-semibold text-gray-500 uppercase tracking-wide">H:</span>
                        {hand.cards.map((card, idx) => (
                          <Card key={idx} card={card} />
                        ))}
                      </div>
                    )}

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

                    {hand.turn && (
                      <>
                        <div className="w-px h-4 bg-gray-300"></div>
                        <div className="flex items-center gap-1">
                          <span className="text-[8px] font-semibold text-gray-500 uppercase tracking-wide">T:</span>
                          <Card card={hand.turn} />
                        </div>
                      </>
                    )}

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

                  <div className="flex items-center justify-between text-[10px] text-gray-500">
                    <span>Pot: ${hand.pot.toLocaleString()}</span>
                    <span>{formatTime(hand.timestamp)}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <SlideInPanel
      isOpen={isOpen}
      onClose={onClose}
      title={`${player.name}'s Session`}
    >
      {content}
    </SlideInPanel>
  );
}