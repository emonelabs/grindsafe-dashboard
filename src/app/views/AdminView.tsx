import { useState, useEffect } from 'react';
import { PlayerCard } from '../components/PlayerCard';
import { PLGraph } from '../components/PLGraph';
import { FilterPanel, FilterState } from '../components/FilterPanel';
import { PlayerSessionModal } from '../components/PlayerSessionModal';

interface Player {
  id: string;
  name: string;
  avatar: string;
  profitLoss: number;
  sessionTime: number;
  isRecording: boolean;
  color: string;
}

export function AdminView() {
  const [players, setPlayers] = useState<Player[]>([
    {
      id: 'player1',
      name: 'Marcus Chen',
      avatar: 'https://images.unsplash.com/photo-1674644674031-b49db824edbc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
      profitLoss: 2450,
      sessionTime: 186,
      isRecording: true,
      color: '#3b82f6'
    },
    {
      id: 'player2',
      name: 'Sarah Mitchell',
      avatar: 'https://images.unsplash.com/photo-1761243892035-c3e13829115a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
      profitLoss: 3200,
      sessionTime: 245,
      isRecording: true,
      color: '#10b981'
    },
    {
      id: 'player3',
      name: 'David Rodriguez',
      avatar: 'https://images.unsplash.com/photo-1762810211495-d79a02ba7d0d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
      profitLoss: -850,
      sessionTime: 142,
      isRecording: false,
      color: '#f59e0b'
    },
    {
      id: 'player4',
      name: 'Alex Thompson',
      avatar: 'https://images.unsplash.com/photo-1532272278764-53cd1fe53f72?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
      profitLoss: 4850,
      sessionTime: 298,
      isRecording: true,
      color: '#8b5cf6'
    },
    {
      id: 'player5',
      name: 'Emma Wilson',
      avatar: 'https://images.unsplash.com/photo-1758518732130-4b51da74b0b6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
      profitLoss: 1800,
      sessionTime: 167,
      isRecording: true,
      color: '#ec4899'
    },
    {
      id: 'player6',
      name: 'James Parker',
      avatar: 'https://images.unsplash.com/photo-1769071166530-11f7857f4c59?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
      profitLoss: -1200,
      sessionTime: 203,
      isRecording: false,
      color: '#06b6d4'
    }
  ]);

  const [graphData, setGraphData] = useState<any[]>([]);
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    timeRange: 'all',
    minPL: '',
    maxPL: '',
    playerStatus: 'all'
  });
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);

  // Simulate real-time data updates
  useEffect(() => {
    // Initialize graph data
    const initialData = [];
    const startTime = new Date();
    startTime.setHours(startTime.getHours() - 4);

    for (let i = 0; i <= 24; i++) {
      const time = new Date(startTime.getTime() + i * 10 * 60000);
      const dataPoint: any = {
        time: time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
      };

      players.forEach(player => {
        const volatility = Math.random() * 400 - 200;
        const trend = player.profitLoss / 24 * i;
        dataPoint[player.id] = Math.round(trend + volatility);
      });

      initialData.push(dataPoint);
    }

    setGraphData(initialData);

    // Update data every 10 seconds
    const interval = setInterval(() => {
      setGraphData(prevData => {
        const newData = [...prevData];
        const currentTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        
        if (newData.length >= 25) {
          newData.shift();
        }

        const newPoint: any = { time: currentTime };
        players.forEach(player => {
          const lastValue = newData[newData.length - 1]?.[player.id] || 0;
          const change = Math.random() * 300 - 150;
          newPoint[player.id] = Math.round(lastValue + change);
        });

        newData.push(newPoint);
        return newData;
      });

      setPlayers(prevPlayers => 
        prevPlayers.map(player => ({
          ...player,
          profitLoss: player.profitLoss + Math.round(Math.random() * 100 - 50),
          sessionTime: player.sessionTime + Math.floor(Math.random() * 2)
        }))
      );
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  // Filter players
  const filteredPlayers = players.filter(player => {
    if (filters.searchQuery && !player.name.toLowerCase().includes(filters.searchQuery.toLowerCase())) {
      return false;
    }

    if (filters.playerStatus === 'recording' && !player.isRecording) return false;
    if (filters.playerStatus === 'paused' && player.isRecording) return false;
    if (filters.playerStatus === 'profitable' && player.profitLoss <= 0) return false;
    if (filters.playerStatus === 'losing' && player.profitLoss >= 0) return false;

    if (filters.minPL && player.profitLoss < parseFloat(filters.minPL)) return false;
    if (filters.maxPL && player.profitLoss > parseFloat(filters.maxPL)) return false;

    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">
          Admin Dashboard
        </h1>
        <p className="text-slate-400">
          Real-time monitoring of all active poker sessions
        </p>
      </div>

      {/* Filter Panel */}
      <FilterPanel onFilterChange={setFilters} />

      {/* P/L Graph */}
      <PLGraph data={graphData} players={players} />

      {/* Player Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPlayers.map(player => (
          <PlayerCard 
            key={player.id} 
            player={player}
            onViewSession={() => setSelectedPlayer(player)}
          />
        ))}
      </div>

      {/* Empty State */}
      {filteredPlayers.length === 0 && (
        <div className="text-center py-12 bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl border border-slate-700/50">
          <p className="text-slate-400 text-lg">No players match your current filters</p>
        </div>
      )}

      {/* Player Session Modal */}
      {selectedPlayer && (
        <PlayerSessionModal
          player={selectedPlayer}
          onClose={() => setSelectedPlayer(null)}
        />
      )}
    </div>
  );
}