import { useEffect, useRef, useState } from 'react';
import { Clock, TrendingUp, TrendingDown, Eye } from 'lucide-react';

interface PlayerCardProps {
  player: {
    id: string;
    name: string;
    avatar: string;
    profitLoss: number;
    sessionTime: number; // in minutes
    isRecording: boolean;
  };
  onViewSession: () => void;
}

export function PlayerCard({ player, onViewSession }: PlayerCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    // Simulated video feed - in production, this would connect to actual camera/screen share
    const canvas = document.createElement('canvas');
    canvas.width = 320;
    canvas.height = 240;
    const ctx = canvas.getContext('2d');
    
    const draw = () => {
      if (ctx) {
        // Create a subtle animated background to simulate video feed
        const time = Date.now() / 1000;
        const gradient = ctx.createLinearGradient(0, 0, 320, 240);
        gradient.addColorStop(0, `hsl(${(time * 20) % 360}, 20%, 15%)`);
        gradient.addColorStop(1, `hsl(${(time * 20 + 60) % 360}, 20%, 20%)`);
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 320, 240);
        
        // Add some "noise" for video effect
        ctx.fillStyle = 'rgba(255, 255, 255, 0.02)';
        for (let i = 0; i < 50; i++) {
          ctx.fillRect(
            Math.random() * 320,
            Math.random() * 240,
            2,
            2
          );
        }
      }
    };

    const interval = setInterval(draw, 100);
    
    // @ts-ignore - Canvas captureStream is supported in modern browsers
    const canvasStream = canvas.captureStream(10);
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

  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-2xl overflow-hidden border border-slate-700/50 hover:border-slate-600/50 transition-all duration-300 hover:shadow-blue-500/10">
      {/* Video Feed Section */}
      <div className="relative bg-black aspect-video">
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className="w-full h-full object-cover"
        />
        
        {/* Recording Indicator */}
        {player.isRecording && (
          <div className="absolute top-3 right-3 flex items-center gap-2 bg-red-500/90 backdrop-blur-sm text-white px-3 py-1.5 rounded-full shadow-lg animate-pulse">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
            <span className="text-sm font-semibold">REC</span>
          </div>
        )}
      </div>

      {/* Player Info Section */}
      <div className="p-5">
        <div className="flex items-center gap-3 mb-4">
          <img
            src={player.avatar}
            alt={player.name}
            className="w-12 h-12 rounded-full object-cover border-2 border-slate-600 shadow-lg"
          />
          <div className="flex-1">
            <h3 className="font-semibold text-lg text-white">{player.name}</h3>
            <div className="flex items-center gap-1.5 text-sm text-slate-400">
              <Clock className="w-4 h-4" />
              <span>{formatTime(player.sessionTime)}</span>
            </div>
          </div>
        </div>

        {/* P/L Display */}
        <div className={`flex items-center justify-between p-4 rounded-lg backdrop-blur-sm mb-3 ${
          isProfit 
            ? 'bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30' 
            : 'bg-gradient-to-r from-red-500/10 to-rose-500/10 border border-red-500/30'
        }`}>
          <span className="text-sm font-medium text-slate-300">Session P/L</span>
          <div className="flex items-center gap-2">
            {isProfit ? (
              <TrendingUp className="w-5 h-5 text-green-400" />
            ) : (
              <TrendingDown className="w-5 h-5 text-red-400" />
            )}
            <span className={`text-xl font-bold ${
              isProfit ? 'text-green-400' : 'text-red-400'
            }`}>
              {formatPL(player.profitLoss)}
            </span>
          </div>
        </div>

        {/* View Session Button */}
        <button
          onClick={onViewSession}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-2.5 px-4 rounded-lg transition-all flex items-center justify-center gap-2"
        >
          <Eye className="w-4 h-4" />
          View Session
        </button>
      </div>
    </div>
  );
}