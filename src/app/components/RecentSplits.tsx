import { useState, useEffect } from 'react';
import { Split, TrendingUp, CheckCircle, Clock } from 'lucide-react';

interface RecentSplit {
  id: string;
  playerName: string;
  playerAvatar: string;
  totalProfit: number;
  playerShare: number;
  houseShare: number;
  status: 'pending' | 'processing' | 'completed';
  timestamp: Date;
}

export function RecentSplits() {
  const [splits, setSplits] = useState<RecentSplit[]>([]);

  useEffect(() => {
    const players = [
      { name: 'Marcus Chen', avatar: 'https://images.unsplash.com/photo-1674644674031-b49db824edbc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400' },
      { name: 'Sarah Mitchell', avatar: 'https://images.unsplash.com/photo-1761243892035-c3e13829115a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400' },
      { name: 'Alex Thompson', avatar: 'https://images.unsplash.com/photo-1532272278764-53cd1fe53f72?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400' },
      { name: 'Emma Wilson', avatar: 'https://images.unsplash.com/photo-1758518732130-4b51da74b0b6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400' },
      { name: 'David Rodriguez', avatar: 'https://images.unsplash.com/photo-1762810211495-d79a02ba7d0d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400' },
    ];

    const generateSplit = (): RecentSplit => {
      const player = players[Math.floor(Math.random() * players.length)];
      const totalProfit = Math.floor(Math.random() * 2000) + 500;
      const playerShare = Math.round(totalProfit * 0.5);
      const houseShare = totalProfit - playerShare;
      const statuses: Array<'pending' | 'processing' | 'completed'> = ['pending', 'processing', 'completed'];

      return {
        id: `split-${Date.now()}-${Math.random()}`,
        playerName: player.name,
        playerAvatar: player.avatar,
        totalProfit,
        playerShare,
        houseShare,
        status: statuses[Math.floor(Math.random() * statuses.length)],
        timestamp: new Date()
      };
    };

    // Initialize with some splits
    const initialSplits = Array.from({ length: 8 }, generateSplit);
    setSplits(initialSplits);

    // Add new split every 20 seconds
    const interval = setInterval(() => {
      const newSplit = generateSplit();
      setSplits(prev => [newSplit, ...prev].slice(0, 15));
    }, 20000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-3 h-3 text-amber-500" />;
      case 'processing':
        return <div className="w-3 h-3 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />;
      case 'completed':
        return <CheckCircle className="w-3 h-3 text-green-600" />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded overflow-hidden">
      <div className="px-4 py-2.5 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Split className="w-4 h-4 text-gray-600" />
          <h3 className="text-xs font-semibold text-gray-900 uppercase tracking-wide">Recent Splits</h3>
        </div>
        <span className="text-[10px] text-gray-500">{splits.length} recent</span>
      </div>
      
      <div className="divide-y divide-gray-100 overflow-y-auto" style={{ maxHeight: '350px' }}>
        {splits.map((split) => (
          <div 
            key={split.id} 
            className="p-3 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <img 
                src={split.playerAvatar} 
                alt={split.playerName} 
                className="w-8 h-8 rounded-full border border-gray-200" 
              />
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-gray-900 truncate">{split.playerName}</span>
                    {getStatusIcon(split.status)}
                  </div>
                  <span className="text-xs text-gray-500">{formatTime(split.timestamp)}</span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500">Total:</span>
                    <span className="font-bold text-green-600">+${split.totalProfit.toLocaleString()}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 mt-1 text-xs">
                  <div className="flex items-center gap-1">
                    <span className="text-gray-500">Player:</span>
                    <span className="font-semibold text-blue-600">${split.playerShare.toLocaleString()}</span>
                  </div>
                  <div className="w-px h-3 bg-gray-300"></div>
                  <div className="flex items-center gap-1">
                    <span className="text-gray-500">House:</span>
                    <span className="font-semibold text-gray-900">${split.houseShare.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {splits.length === 0 && (
          <div className="p-8 text-center text-gray-400 text-sm">
            No recent splits
          </div>
        )}
      </div>
    </div>
  );
}
