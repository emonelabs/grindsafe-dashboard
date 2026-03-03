import { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, Users, Calendar, Split, CheckCircle, Clock } from 'lucide-react';

interface Split {
  id: string;
  playerName: string;
  playerAvatar: string;
  sessionId: string;
  sessionDate: Date;
  totalProfit: number;
  splitPercentage: number;
  playerShare: number;
  houseShare: number;
  status: 'pending' | 'processing' | 'completed';
  sessionDuration: number;
  handsPlayed: number;
}

export function SplitsView() {
  const [splits, setSplits] = useState<Split[]>([]);
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');

  // Generate mock splits data
  useEffect(() => {
    const players = [
      { name: 'Marcus Chen', avatar: 'https://images.unsplash.com/photo-1674644674031-b49db824edbc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400' },
      { name: 'Sarah Mitchell', avatar: 'https://images.unsplash.com/photo-1761243892035-c3e13829115a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400' },
      { name: 'Alex Thompson', avatar: 'https://images.unsplash.com/photo-1532272278764-53cd1fe53f72?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400' },
      { name: 'Emma Wilson', avatar: 'https://images.unsplash.com/photo-1758518732130-4b51da74b0b6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400' },
      { name: 'David Rodriguez', avatar: 'https://images.unsplash.com/photo-1762810211495-d79a02ba7d0d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400' },
    ];

    const statuses: Array<'pending' | 'processing' | 'completed'> = ['pending', 'processing', 'completed'];

    const generateSplit = (daysAgo: number): Split => {
      const player = players[Math.floor(Math.random() * players.length)];
      const totalProfit = Math.floor(Math.random() * 3000) + 500;
      const splitPercentage = 50; // Default 50/50
      const playerShare = Math.round(totalProfit * (splitPercentage / 100));
      const houseShare = totalProfit - playerShare;
      const sessionDuration = Math.floor(Math.random() * 300) + 120; // 2-7 hours in minutes

      return {
        id: `split-${Date.now()}-${Math.random()}`,
        playerName: player.name,
        playerAvatar: player.avatar,
        sessionId: `session-${Math.floor(Math.random() * 10000)}`,
        sessionDate,
        totalProfit,
        splitPercentage,
        playerShare,
        houseShare,
        status: statuses[Math.floor(Math.random() * statuses.length)],
        sessionDuration,
        handsPlayed: Math.floor((sessionDuration / 60) * 100) // 100 hands per hour
      };
    };

    // Generate initial splits
    const initialSplits = Array.from({ length: 15 }, (_, i) => generateSplit(Math.floor(i / 3)));
    setSplits(initialSplits.sort((a, b) => b.sessionDate.getTime() - a.sessionDate.getTime()));

    // Simulate new splits every 30 seconds
    const interval = setInterval(() => {
      const newSplit = generateSplit(0);
      setSplits(prev => [newSplit, ...prev].slice(0, 50));
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const filteredSplits = splits.filter(split => {
    if (filter === 'all') return true;
    return split.status === filter;
  });

  const totalSplits = splits.length;
  const pendingSplits = splits.filter(s => s.status === 'pending').length;
  const completedSplits = splits.filter(s => s.status === 'completed').length;
  const totalPlayerShare = splits.reduce((sum, s) => sum + (s.status === 'completed' ? s.playerShare : 0), 0);
  const totalHouseShare = splits.reduce((sum, s) => sum + (s.status === 'completed' ? s.houseShare : 0), 0);

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-700 bg-amber-50 px-2 py-1 rounded border border-amber-200">
          <Clock className="w-3 h-3" />
          Pending
        </span>;
      case 'processing':
        return <span className="inline-flex items-center gap-1 text-xs font-medium text-blue-700 bg-blue-50 px-2 py-1 rounded border border-blue-200">
          <div className="w-3 h-3 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          Processing
        </span>;
      case 'completed':
        return <span className="inline-flex items-center gap-1 text-xs font-medium text-green-700 bg-green-50 px-2 py-1 rounded border border-green-200">
          <CheckCircle className="w-3 h-3" />
          Completed
        </span>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Profit Splits</h1>
          <p className="text-gray-500 text-sm">Track and manage session profit distributions</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white border border-gray-200 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Total Splits</span>
            <Split className="w-4 h-4 text-gray-400" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{totalSplits}</div>
          <div className="text-xs text-gray-500 mt-1">All time</div>
        </div>

        <div className="bg-white border border-gray-200 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Pending</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-amber-600">{pendingSplits}</div>
          <div className="text-xs text-gray-500 mt-1">Awaiting processing</div>
        </div>

        <div className="bg-white border border-gray-200 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Completed</span>
            <CheckCircle className="w-4 h-4 text-green-600" />
          </div>
          <div className="text-2xl font-bold text-green-600">{completedSplits}</div>
          <div className="text-xs text-gray-500 mt-1">Successfully split</div>
        </div>

        <div className="bg-white border border-gray-200 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Player Share</span>
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-blue-600">${totalPlayerShare.toLocaleString()}</div>
          <div className="text-xs text-gray-500 mt-1">Total distributed</div>
        </div>

        <div className="bg-white border border-gray-200 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">House Share</span>
            <DollarSign className="w-4 h-4 text-gray-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">${totalHouseShare.toLocaleString()}</div>
          <div className="text-xs text-gray-500 mt-1">Total house revenue</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filter === 'all'
              ? 'bg-gray-900 text-white'
              : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
          }`}
        >
          All Splits
        </button>
        <button
          onClick={() => setFilter('pending')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filter === 'pending'
              ? 'bg-gray-900 text-white'
              : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
          }`}
        >
          Pending
        </button>
        <button
          onClick={() => setFilter('completed')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filter === 'completed'
              ? 'bg-gray-900 text-white'
              : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
          }`}
        >
          Completed
        </button>
      </div>

      {/* Splits Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">Player</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">Session</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">Total Profit</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">Split</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">Player Share</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">House Share</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredSplits.map((split) => (
                <tr key={split.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img src={split.playerAvatar} alt={split.playerName} className="w-8 h-8 rounded-full border border-gray-200" />
                      <div>
                        <div className="text-sm font-semibold text-gray-900">{split.playerName}</div>
                        <div className="text-xs text-gray-500">{formatDate(split.sessionDate)}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      <div className="text-sm text-gray-900 font-mono">#{split.sessionId.slice(-6)}</div>
                      <div className="text-xs text-gray-500">{formatTime(split.sessionDuration)} • {split.handsPlayed} hands</div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm font-bold text-green-600">+${split.totalProfit.toLocaleString()}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm font-medium text-gray-900">{split.splitPercentage}% / {100 - split.splitPercentage}%</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm font-semibold text-blue-600">${split.playerShare.toLocaleString()}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm font-semibold text-gray-900">${split.houseShare.toLocaleString()}</div>
                  </td>
                  <td className="px-4 py-3">
                    {getStatusBadge(split.status)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredSplits.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <Split className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>No splits found</p>
          </div>
        )}
      </div>
    </div>
  );
}
