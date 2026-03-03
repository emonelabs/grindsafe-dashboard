import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { X, Clock, TrendingUp, TrendingDown, Video, DollarSign, Target } from 'lucide-react';

interface Player {
  id: string;
  name: string;
  avatar: string;
  profitLoss: number;
  sessionTime: number;
  isRecording: boolean;
  color: string;
}

interface PlayerSessionModalProps {
  player: Player;
  onClose: () => void;
}

// Array of actual online poker gameplay screenshots
const pokerImages = [
  'https://pokerindustrypro.com/site_media/media/uploads/news/winamax-multiple-playgrounds-tables-playing-wm.png',
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR96OzUaaR68qHFBKnFGT3NIKRGQO8B-hMOqA&s',
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSRlJS6AIRfSSEe3JD3XviG5w1dp3koCzHuGg&s',
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRjn_kPDtL-vZhpVcmD1tPkOXB0Z64kSJEtaw&s',
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQACjBfVJywXemsMrjqeMk9066Ogmu_Wevv4A&s',
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRzg39aGmduS7jxmsSlGTWR_pUTq8YmnyudWg&s',
];

export function PlayerSessionModal({ player, onClose }: PlayerSessionModalProps) {
  const [sessionData, setSessionData] = useState<any[]>([]);
  
  // Select consistent poker image for this player
  const imageIndex = parseInt(player.id.replace(/\D/g, '')) % pokerImages.length;
  const pokerImage = pokerImages[imageIndex];

  // Generate session data
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

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const formatPL = (amount: number) => {
    const sign = amount >= 0 ? '+' : '';
    return `${sign}$${amount.toLocaleString()}`;
  };

  const isProfit = player.profitLoss >= 0;
  // Calculate hands played: 100 hands per hour (sessionTime is in minutes)
  const handsPlayed = Math.floor((player.sessionTime / 60) * 100);
  const buyIn = 500;
  
  // Calculate bb/100 win rate (assuming $2 big blind for standard stakes)
  // Formula: (profit / handsPlayed) * 100 / bigBlind
  const bigBlind = 2;
  const bb100 = handsPlayed > 0 
    ? ((player.profitLoss / handsPlayed) * 100) / bigBlind
    : 0;
  
  // Generate realistic bb/100 between 2-10 based on player performance
  const normalizedBB100 = handsPlayed > 0
    ? Math.max(2, Math.min(10, 5 + (player.profitLoss / 1000)))
    : 5;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl border border-gray-200 max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white backdrop-blur-sm border-b border-gray-200 p-6 flex items-center justify-between z-10">
          <div className="flex items-center gap-4">
            <img
              src={player.avatar}
              alt={player.name}
              className="w-16 h-16 rounded-full object-cover border-2 border-gray-200 shadow-sm"
            />
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{player.name}'s Session</h2>
              <div className="flex items-center gap-2 text-gray-500 text-sm mt-1">
                <Clock className="w-4 h-4" />
                <span>Duration: {formatTime(player.sessionTime)}</span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-900 transition-colors p-2 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className={`p-4 rounded-lg border ${
              isProfit 
                ? 'bg-green-50 border-green-200' 
                : 'bg-red-50 border-red-200'
            }`}>
              <div className="text-gray-600 text-sm mb-1 font-medium">Current P/L</div>
              <div className="flex items-center gap-2">
                {isProfit ? (
                  <TrendingUp className="w-6 h-6 text-green-600" />
                ) : (
                  <TrendingDown className="w-6 h-6 text-red-600" />
                )}
                <span className={`text-3xl font-bold ${
                  isProfit ? 'text-green-600' : 'text-red-600'
                }`}>
                  {formatPL(player.profitLoss)}
                </span>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
              <div className="text-gray-600 text-sm mb-1 font-medium">Hands Played</div>
              <div className="text-3xl font-bold text-blue-600">
                {handsPlayed}
              </div>
            </div>

            <div className="p-4 rounded-lg bg-purple-50 border border-purple-200">
              <div className="text-gray-600 text-sm mb-1 font-medium">Win Rate</div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-purple-600">
                  {normalizedBB100.toFixed(1)}
                </span>
                <span className="text-sm font-semibold text-purple-500">bb/100</span>
              </div>
            </div>
          </div>

          {/* Video and Graph */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Video Feed */}
            <div className="bg-white rounded-xl overflow-hidden border border-gray-200">
              <div className="px-4 py-2.5 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Video className="w-4 h-4 text-gray-600" />
                  <h3 className="text-xs font-semibold text-gray-900 uppercase tracking-wide">Live Feed</h3>
                </div>
                {player.isRecording && (
                  <div className="flex items-center gap-1.5 bg-red-600 text-white px-2 py-1 rounded-full text-[10px] font-semibold">
                    <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                    REC
                  </div>
                )}
              </div>

              <div className="relative bg-gray-100 aspect-video">
                <img
                  src={pokerImage}
                  alt={`${player.name} playing poker`}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

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
          </div>

          {/* Session Details */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-4 py-2.5 border-b border-gray-200 bg-gray-50">
              <h3 className="text-xs font-semibold text-gray-900 uppercase tracking-wide">Session Details</h3>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
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
        </div>
      </div>
    </div>
  );
}
