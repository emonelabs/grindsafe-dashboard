import { useEffect, useRef, useState } from 'react';
import { Clock, TrendingUp, TrendingDown, Eye } from 'lucide-react';

interface PlayerCardProps {
  player: {
    id: string;
    name: string;
    avatar: string;
    profitLoss: number;
    sessionTime: number;
    isRecording: boolean;
    color?: string;
  };
  onViewSession: () => void;
  compact?: boolean;
}

export function PlayerCard({ player, onViewSession, compact = false }: PlayerCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 320;
    canvas.height = 240;
    const ctx = canvas.getContext('2d');
    
    const draw = () => {
      if (ctx) {
        const time = Date.now() / 1000;
        const gradient = ctx.createLinearGradient(0, 0, 320, 240);
        gradient.addColorStop(0, `hsl(${(time * 20) % 360}, 20%, 90%)`);
        gradient.addColorStop(1, `hsl(${(time * 20 + 60) % 360}, 20%, 85%)`);
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 320, 240);
        
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

  if (compact) {
    return (
      <div 
        onClick={onViewSession}
        className="bg-white rounded-lg border border-gray-200 p-3 hover:shadow-md hover:border-gray-300 transition-all cursor-pointer"
      >
        <div className="flex items-center gap-2 mb-2">
          <img
            src={player.avatar}
            alt={player.name}
            className="w-8 h-8 rounded-full object-cover border border-gray-200"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{player.name}</p>
            <p className="text-xs text-gray-500">{formatTime(player.sessionTime)}</p>
          </div>
          {player.isRecording && (
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          )}
        </div>
        <div className={`text-sm font-semibold ${isProfit ? 'text-green-600' : 'text-red-600'}`}>
          {formatPL(player.profitLoss)}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200 hover:shadow-md hover:border-gray-300 transition-all duration-200">
      <div className="relative bg-gray-100 aspect-video">
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className="w-full h-full object-cover"
        />
        
        {player.isRecording && (
          <div className="absolute top-2 right-2 flex items-center gap-1.5 bg-red-500 text-white px-2 py-1 rounded-full">
            <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
            <span className="text-xs font-semibold">REC</span>
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-center gap-3 mb-3">
          <img
            src={player.avatar}
            alt={player.name}
            className="w-10 h-10 rounded-full object-cover border border-gray-200"
          />
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900">{player.name}</h3>
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Clock className="w-3 h-3" />
              <span>{formatTime(player.sessionTime)}</span>
            </div>
          </div>
        </div>

        <div className={`flex items-center justify-between p-3 rounded-lg border ${
          isProfit 
            ? 'bg-green-50 border-green-200' 
            : 'bg-red-50 border-red-200'
        }`}>
          <span className="text-xs font-medium text-gray-600">Session P/L</span>
          <div className="flex items-center gap-1">
            {isProfit ? (
              <TrendingUp className="w-4 h-4 text-green-600" />
            ) : (
              <TrendingDown className="w-4 h-4 text-red-600" />
            )}
            <span className={`text-sm font-bold ${
              isProfit ? 'text-green-600' : 'text-red-600'
            }`}>
              {formatPL(player.profitLoss)}
            </span>
          </div>
        </div>

        <button
          onClick={onViewSession}
          className="w-full mt-3 bg-gray-900 hover:bg-gray-800 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <Eye className="w-4 h-4" />
          View Session
        </button>
      </div>
    </div>
  );
}
