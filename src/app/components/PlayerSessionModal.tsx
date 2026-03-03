import { useEffect, useRef, useState } from 'react';
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

export function PlayerSessionModal({ player, onClose }: PlayerSessionModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [sessionData, setSessionData] = useState<any[]>([]);

  // Initialize video stream
  useEffect(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 1280;
    canvas.height = 720;
    const ctx = canvas.getContext('2d');
    
    const draw = () => {
      if (ctx) {
        const time = Date.now() / 1000;
        const gradient = ctx.createLinearGradient(0, 0, 1280, 720);
        gradient.addColorStop(0, `hsl(${(time * 20) % 360}, 25%, 15%)`);
        gradient.addColorStop(1, `hsl(${(time * 20 + 60) % 360}, 25%, 20%)`);
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 1280, 720);
        
        ctx.fillStyle = 'rgba(255, 255, 255, 0.02)';
        for (let i = 0; i < 100; i++) {
          ctx.fillRect(
            Math.random() * 1280,
            Math.random() * 720,
            3,
            3
          );
        }
      }
    };

    const interval = setInterval(draw, 100);
    
    // @ts-ignore
    const canvasStream = canvas.captureStream(30);
    setStream(canvasStream);

    return () => {
      clearInterval(interval);
      canvasStream.getTracks().forEach(track => track.stop());
    };
  }, []);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

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
  const handsPlayed = Math.floor(player.sessionTime / 2);
  const buyIn = 500;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-2xl border border-slate-700/50 max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-slate-800/95 backdrop-blur-sm border-b border-slate-700/50 p-6 flex items-center justify-between z-10">
          <div className="flex items-center gap-4">
            <img
              src={player.avatar}
              alt={player.name}
              className="w-16 h-16 rounded-full object-cover border-2 border-slate-600 shadow-lg"
            />
            <div>
              <h2 className="text-2xl font-bold text-white">{player.name}'s Session</h2>
              <div className="flex items-center gap-2 text-slate-400 text-sm mt-1">
                <Clock className="w-4 h-4" />
                <span>Duration: {formatTime(player.sessionTime)}</span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors p-2 hover:bg-slate-700/50 rounded-lg"
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
                ? 'bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-green-500/30' 
                : 'bg-gradient-to-br from-red-500/20 to-rose-500/20 border-red-500/30'
            }`}>
              <div className="text-slate-300 text-sm mb-1">Current P/L</div>
              <div className="flex items-center gap-2">
                {isProfit ? (
                  <TrendingUp className="w-6 h-6 text-green-400" />
                ) : (
                  <TrendingDown className="w-6 h-6 text-red-400" />
                )}
                <span className={`text-3xl font-bold ${
                  isProfit ? 'text-green-400' : 'text-red-400'
                }`}>
                  {formatPL(player.profitLoss)}
                </span>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/30">
              <div className="text-slate-300 text-sm mb-1">Hands Played</div>
              <div className="text-3xl font-bold text-blue-400">
                {handsPlayed}
              </div>
            </div>

            <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/30">
              <div className="text-slate-300 text-sm mb-1">Win Rate</div>
              <div className="text-3xl font-bold text-purple-400">
                {((player.profitLoss / handsPlayed * 100) || 0).toFixed(1)}%
              </div>
            </div>
          </div>

          {/* Video and Graph */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Video Feed */}
            <div className="bg-slate-900/50 rounded-xl overflow-hidden border border-slate-700/50">
              <div className="p-4 border-b border-slate-700/50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Video className="w-5 h-5 text-blue-400" />
                  <h3 className="font-semibold text-white">Live Feed</h3>
                </div>
                {player.isRecording && (
                  <div className="flex items-center gap-2 bg-red-500/20 text-red-400 px-3 py-1.5 rounded-full border border-red-500/30">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                    <span className="text-sm font-semibold">REC</span>
                  </div>
                )}
              </div>

              <div className="relative bg-black aspect-video">
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Performance Graph */}
            <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-700/50">
              <h3 className="font-semibold text-white mb-4">Session Performance</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={sessionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis 
                    dataKey="time" 
                    stroke="#94a3b8"
                    style={{ fontSize: '12px' }}
                  />
                  <YAxis 
                    stroke="#94a3b8"
                    style={{ fontSize: '12px' }}
                    tickFormatter={(value) => `$${value.toLocaleString()}`}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1e293b',
                      border: '1px solid #334155',
                      borderRadius: '8px',
                      padding: '12px',
                      color: '#fff'
                    }}
                    formatter={(value: number) => [`$${value.toLocaleString()}`, 'P/L']}
                  />
                  <Line
                    type="monotone"
                    dataKey="pl"
                    name="P/L"
                    stroke={player.color}
                    strokeWidth={3}
                    dot={{ r: 4, fill: player.color }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Session Details */}
          <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-700/50">
            <h3 className="font-semibold text-white mb-4">Session Details</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700/50">
                <div className="text-slate-400 text-xs mb-1">Buy-in</div>
                <div className="text-white font-semibold">${buyIn}</div>
              </div>
              <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700/50">
                <div className="text-slate-400 text-xs mb-1">Current Stack</div>
                <div className="text-white font-semibold">${(buyIn + player.profitLoss).toLocaleString()}</div>
              </div>
              <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700/50">
                <div className="text-slate-400 text-xs mb-1">Biggest Win</div>
                <div className="text-green-400 font-semibold">$850</div>
              </div>
              <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700/50">
                <div className="text-slate-400 text-xs mb-1">Biggest Loss</div>
                <div className="text-red-400 font-semibold">-$320</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
