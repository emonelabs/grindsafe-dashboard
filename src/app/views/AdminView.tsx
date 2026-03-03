import { useState, useEffect } from 'react';
import { PlayerCard } from '../components/PlayerCard';
import { PLGraph } from '../components/PLGraph';
import { FilterPanel, FilterState } from '../components/FilterPanel';
import { PlayerSessionModal } from '../components/PlayerSessionModal';
import { HandHistory } from '../components/HandHistory';
import { MetricsMarquee } from '../components/MetricsMarquee';
import { LiveVideoGrid } from '../components/LiveVideoGrid';
import { RecentSplits } from '../components/RecentSplits';
import { WalletPerformance } from '../components/WalletPerformance';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/tabs';
import { Users, User, LayoutGrid, TrendingUp, TrendingDown, DollarSign, Activity, Clock, Play, Calendar, Network, Split, Wallet } from 'lucide-react';
import { TeamsView } from './TeamsView';
import { OrganizationView } from './OrganizationView';
import { SplitsView } from './SplitsView';
import { WalletsView } from './WalletsView';

interface Player {
  id: string;
  name: string;
  avatar: string;
  profitLoss: number;
  sessionTime: number;
  isRecording: boolean;
  color: string;
  teamId: string;
}

interface Team {
  id: string;
  name: string;
  memberCount: number;
  totalProfitLoss: number;
  activePlayers: number;
  color: string;
  gameType: 'Cash' | 'MTT';
  tableStructure: '6-max' | '9-max';
}

export function AdminView() {
  const [activeTab, setActiveTab] = useState('overview');
  
  const [teams, setTeams] = useState<Team[]>([
    { id: 'team1', name: 'High Rollers', memberCount: 8, totalProfitLoss: 15420, activePlayers: 5, color: '#3b82f6', gameType: 'Cash', tableStructure: '6-max' },
    { id: 'team2', name: 'Weekend Warriors', memberCount: 12, totalProfitLoss: -3200, activePlayers: 3, color: '#10b981', gameType: 'MTT', tableStructure: '9-max' },
    { id: 'team3', name: 'Professional Squad', memberCount: 6, totalProfitLoss: 28750, activePlayers: 4, color: '#f59e0b', gameType: 'Cash', tableStructure: '9-max' },
    { id: 'team4', name: 'Grinders', memberCount: 15, totalProfitLoss: 8900, activePlayers: 7, color: '#8b5cf6', gameType: 'Cash', tableStructure: '6-max' },
  ]);

  const [players, setPlayers] = useState<Player[]>([
    {
      id: 'player1',
      name: 'Marcus Chen',
      avatar: 'https://images.unsplash.com/photo-1674644674031-b49db824edbc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
      profitLoss: 2450,
      sessionTime: 186,
      isRecording: true,
      color: '#3b82f6',
      teamId: 'team1'
    },
    {
      id: 'player2',
      name: 'Sarah Mitchell',
      avatar: 'https://images.unsplash.com/photo-1761243892035-c3e13829115a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
      profitLoss: 3200,
      sessionTime: 245,
      isRecording: true,
      color: '#10b981',
      teamId: 'team1'
    },
    {
      id: 'player3',
      name: 'David Rodriguez',
      avatar: 'https://images.unsplash.com/photo-1762810211495-d79a02ba7d0d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
      profitLoss: -850,
      sessionTime: 142,
      isRecording: false,
      color: '#f59e0b',
      teamId: 'team2'
    },
    {
      id: 'player4',
      name: 'Alex Thompson',
      avatar: 'https://images.unsplash.com/photo-1532272278764-53cd1fe53f72?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
      profitLoss: 4850,
      sessionTime: 298,
      isRecording: true,
      color: '#8b5cf6',
      teamId: 'team3'
    },
    {
      id: 'player5',
      name: 'Emma Wilson',
      avatar: 'https://images.unsplash.com/photo-1758518732130-4b51da74b0b6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
      profitLoss: 1800,
      sessionTime: 167,
      isRecording: true,
      color: '#ec4899',
      teamId: 'team4'
    },
    {
      id: 'player6',
      name: 'James Parker',
      avatar: 'https://images.unsplash.com/photo-1769071166530-11f7857f4c59?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
      profitLoss: -1200,
      sessionTime: 203,
      isRecording: true,
      color: '#06b6d4',
      teamId: 'team2'
    },
    {
      id: 'player7',
      name: 'Michael Chen',
      avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
      profitLoss: 3750,
      sessionTime: 225,
      isRecording: true,
      color: '#f97316',
      teamId: 'team1'
    },
    {
      id: 'player8',
      name: 'Lisa Anderson',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
      profitLoss: 2100,
      sessionTime: 198,
      isRecording: true,
      color: '#14b8a6',
      teamId: 'team3'
    },
    {
      id: 'player9',
      name: 'Robert Kim',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
      profitLoss: -950,
      sessionTime: 178,
      isRecording: true,
      color: '#a855f7',
      teamId: 'team2'
    },
    {
      id: 'player10',
      name: 'Jennifer Lee',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
      profitLoss: 5200,
      sessionTime: 312,
      isRecording: true,
      color: '#06b6d4',
      teamId: 'team4'
    },
    {
      id: 'player11',
      name: 'Tom Bradley',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
      profitLoss: 1650,
      sessionTime: 189,
      isRecording: true,
      color: '#eab308',
      teamId: 'team3'
    },
    {
      id: 'player12',
      name: 'Nina Patel',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
      profitLoss: -420,
      sessionTime: 156,
      isRecording: true,
      color: '#ec4899',
      teamId: 'team1'
    },
    {
      id: 'player13',
      name: 'Carlos Rivera',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
      profitLoss: 2890,
      sessionTime: 267,
      isRecording: true,
      color: '#22c55e',
      teamId: 'team4'
    },
    {
      id: 'player14',
      name: 'Sophia Martinez',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
      profitLoss: 3340,
      sessionTime: 234,
      isRecording: true,
      color: '#3b82f6',
      teamId: 'team2'
    },
    {
      id: 'player15',
      name: 'Ryan O\'Connor',
      avatar: 'https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
      profitLoss: 1120,
      sessionTime: 145,
      isRecording: true,
      color: '#f59e0b',
      teamId: 'team3'
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
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const [timePeriod, setTimePeriod] = useState<string>('today');

  // Calculate time range based on selected period
  const getTimeRange = () => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    switch (timePeriod) {
      case 'today':
        return { start: today, end: now };
      case 'yesterday':
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        return { start: yesterday, end: today };
      case 'week':
        const weekStart = new Date(today);
        weekStart.setDate(weekStart.getDate() - weekStart.getDay());
        return { start: weekStart, end: now };
      case 'month':
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        return { start: monthStart, end: now };
      case 'last-month':
        const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);
        return { start: lastMonthStart, end: lastMonthEnd };
      case 'quarter':
        const quarterMonth = Math.floor(now.getMonth() / 3) * 3;
        const quarterStart = new Date(now.getFullYear(), quarterMonth, 1);
        return { start: quarterStart, end: now };
      case 'year':
        const yearStart = new Date(now.getFullYear(), 0, 1);
        return { start: yearStart, end: now };
      case 'all':
      default:
        return { start: new Date(2020, 0, 1), end: now };
    }
  };

  // Apply time-based multiplier to simulate different periods
  const getTimePeriodMultiplier = () => {
    switch (timePeriod) {
      case 'today': return 0.1;
      case 'yesterday': return 0.12;
      case 'week': return 0.4;
      case 'month': return 1.0;
      case 'last-month': return 0.95;
      case 'quarter': return 2.5;
      case 'year': return 8.0;
      case 'all': return 12.0;
      default: return 1.0;
    }
  };

  const multiplier = getTimePeriodMultiplier();
  const adjustedPlayers = players.map(p => ({
    ...p,
    profitLoss: Math.round(p.profitLoss * multiplier),
    sessionTime: Math.round(p.sessionTime * multiplier)
  }));

  const totalProfitLoss = adjustedPlayers.reduce((sum, p) => sum + p.profitLoss, 0);
  const activePlayers = adjustedPlayers.filter(p => p.isRecording).length;
  const totalSessions = adjustedPlayers.length;
  const avgProfit = totalProfitLoss / adjustedPlayers.length;

  useEffect(() => {
    const initialData = [];
    const startTime = new Date();
    startTime.setHours(startTime.getHours() - 4);

    for (let i = 0; i <= 24; i++) {
      const time = new Date(startTime.getTime() + i * 10 * 60000);
      const dataPoint: any = {
        time: time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
      };

      adjustedPlayers.forEach(player => {
        const volatility = Math.random() * 400 - 200;
        const trend = player.profitLoss / 24 * i;
        dataPoint[player.id] = Math.round(trend + volatility);
      });

      initialData.push(dataPoint);
    }

    setGraphData(initialData);

    const interval = setInterval(() => {
      setGraphData(prevData => {
        const newData = [...prevData];
        const currentTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        
        if (newData.length >= 25) {
          newData.shift();
        }

        const newPoint: any = { time: currentTime };
        adjustedPlayers.forEach(player => {
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
  }, [timePeriod, multiplier]);

  // Update team totals when players change
  useEffect(() => {
    setTeams(prevTeams =>
      prevTeams.map(team => {
        const teamPlayers = adjustedPlayers.filter(p => p.teamId === team.id);
        const totalProfitLoss = teamPlayers.reduce((sum, p) => sum + p.profitLoss, 0);
        const activePlayers = teamPlayers.filter(p => p.isRecording).length;
        return {
          ...team,
          totalProfitLoss,
          activePlayers
        };
      })
    );
  }, [players, timePeriod, multiplier]);

  const filteredPlayers = adjustedPlayers.filter(player => {
    if (activeTab === 'teams' && selectedTeam && player.teamId !== selectedTeam) {
      return false;
    }

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

  const MetricCard = ({ title, value, change, icon: Icon, positive }: { title: string; value: string; change?: string; icon: any; positive?: boolean }) => (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">{title}</span>
        <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
          <Icon className="w-4 h-4 text-gray-600" />
        </div>
      </div>
      <div className="flex items-end justify-between">
        <span className="text-2xl font-bold text-gray-900">{value}</span>
        {change && (
          <span className={`text-sm font-medium ${positive ? 'text-green-600' : 'text-red-600'}`}>
            {change}
          </span>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-0">
      {/* Metrics Marquee */}
      <MetricsMarquee 
        totalProfitLoss={totalProfitLoss}
        activePlayers={activePlayers}
        totalSessions={totalSessions}
        avgProfit={avgProfit}
        teams={teams.length}
      />

      <div className="space-y-6 p-6">
        {/* Tabs */}
        <Tabs defaultValue="overview" className="w-full" onValueChange={setActiveTab}>
        <div className="flex items-center justify-between mb-6">
          <TabsList className="bg-white border border-gray-200 p-1 gap-1">
            <TabsTrigger value="overview" className="flex items-center gap-2 px-4 py-3 data-[state=active]:bg-gray-900 data-[state=active]:text-white">
              <Activity className="w-4 h-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="teams" className="flex items-center gap-2 px-4 py-3 data-[state=active]:bg-gray-900 data-[state=active]:text-white">
              <Users className="w-4 h-4" />
              Teams
            </TabsTrigger>
            <TabsTrigger value="organization" className="flex items-center gap-2 px-4 py-3 data-[state=active]:bg-gray-900 data-[state=active]:text-white">
              <Network className="w-4 h-4" />
              Organization
            </TabsTrigger>
            <TabsTrigger value="splits" className="flex items-center gap-2 px-4 py-3 data-[state=active]:bg-gray-900 data-[state=active]:text-white">
              <Split className="w-4 h-4" />
              Splits
            </TabsTrigger>
            <TabsTrigger value="wallets" className="flex items-center gap-2 px-4 py-3 data-[state=active]:bg-gray-900 data-[state=active]:text-white">
              <Wallet className="w-4 h-4" />
              Wallets
            </TabsTrigger>
            <TabsTrigger value="players" className="flex items-center gap-2 px-4 py-3 data-[state=active]:bg-gray-900 data-[state=active]:text-white">
              <User className="w-4 h-4" />
              Players
            </TabsTrigger>
          </TabsList>
          
          {/* Time Period Filter */}
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            <select
              value={timePeriod}
              onChange={(e) => setTimePeriod(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-200 rounded-md bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-colors cursor-pointer"
            >
              <option value="today">Today</option>
              <option value="yesterday">Yesterday</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="last-month">Last Month</option>
              <option value="quarter">This Quarter</option>
              <option value="year">This Year</option>
              <option value="all">All Time</option>
            </select>
          </div>
        </div>

        <TabsContent value="overview" className="space-y-3">
          {/* Live Video Grid - Full Width */}
          <LiveVideoGrid players={players} onPlayerClick={setSelectedPlayer} />

          {/* 70/30 Split: P/L Performance & Hand History */}
          <div className="grid grid-cols-1 lg:grid-cols-10 gap-3">
            {/* LEFT SIDE - P/L Performance (70%) */}
            <div className="lg:col-span-7 space-y-3">
              {/* Company-Wide Consolidated P/L Chart */}
              <div className="bg-white border-2 border-gray-300 rounded-lg overflow-hidden shadow-sm">
                <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-gray-50 to-gray-100">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></div>
                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Company-Wide P/L Performance</h3>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-gray-500">Updated 2s ago</span>
                    <span className={`text-xl font-bold ${totalProfitLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {totalProfitLoss >= 0 ? '+' : ''}${totalProfitLoss.toLocaleString()}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <PLGraph data={graphData} players={adjustedPlayers} showLegend={false} height={280} />
                </div>
              </div>

              {/* Hierarchical Team & Player P/L Charts */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {teams.map(team => {
                  const teamPlayers = players.filter(p => p.teamId === team.id);
                  return (
                    <div key={team.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                      {/* Team Header & Chart */}
                      <div className="border-b border-gray-200">
                        <div className="px-3 py-2.5 border-b border-gray-200 bg-gray-50">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: team.color }}></div>
                              <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wide">{team.name}</h4>
                              <div className="flex items-center gap-1">
                                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                                  team.gameType === 'Cash' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                                }`}>
                                  {team.gameType}
                                </span>
                                <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-gray-200 text-gray-700">
                                  {team.tableStructure}
                                </span>
                              </div>
                            </div>
                            <div className={`text-base font-bold ${team.totalProfitLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {team.totalProfitLoss >= 0 ? '+' : ''}${team.totalProfitLoss.toLocaleString()}
                            </div>
                          </div>
                          <div className="text-[10px] text-gray-500 mt-1">
                            {team.activePlayers} active • {team.memberCount} total
                          </div>
                        </div>
                        <div className="p-3">
                          <PLGraph 
                            data={graphData} 
                            players={teamPlayers} 
                            showLegend={false} 
                            height={140}
                            compact={false}
                          />
                        </div>
                      </div>

                      {/* Individual Players Under This Team */}
                      <div className="p-2 bg-gray-50">
                        <div className="grid grid-cols-2 gap-2">
                          {teamPlayers.map(player => (
                            <div 
                              key={player.id}
                              onClick={() => setSelectedPlayer(player)}
                              className="bg-white border border-gray-200 rounded overflow-hidden hover:border-gray-400 hover:shadow-sm transition-all cursor-pointer"
                            >
                              <div className="px-2 py-1.5 border-b border-gray-100 bg-white">
                                <div className="flex items-center gap-1.5">
                                  <img src={player.avatar} alt={player.name} className="w-5 h-5 rounded-full border border-gray-200" />
                                  <div className="flex-1 min-w-0">
                                    <div className="text-[10px] font-semibold text-gray-900 truncate">{player.name}</div>
                                    {player.isRecording && (
                                      <div className="flex items-center gap-0.5">
                                        <div className="w-1 h-1 bg-red-500 rounded-full animate-pulse"></div>
                                        <span className="text-[8px] text-red-600 font-medium">LIVE</span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <div className="p-2">
                                <div className="mb-1">
                                  <div className={`text-sm font-bold ${player.profitLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    {player.profitLoss >= 0 ? '+' : ''}${player.profitLoss.toLocaleString()}
                                  </div>
                                  <div className="text-[8px] text-gray-500">
                                    {Math.floor(player.sessionTime / 60)}h {player.sessionTime % 60}m
                                  </div>
                                </div>
                                <PLGraph 
                                  data={graphData} 
                                  players={[player]} 
                                  showLegend={false} 
                                  height={60}
                                  compact={true}
                                  showAxes={false}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>

            {/* RIGHT SIDE - Live Activity Feed (30%) */}
            <div className="lg:col-span-3 lg:sticky lg:top-6 space-y-3">
              <HandHistory />
              <RecentSplits />
              <WalletPerformance />
            </div>
          </div>

          {/* Bottom Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            {teams.slice(0, 4).map(team => (
              <div key={team.id} className="bg-white border border-gray-200 p-3 rounded">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded flex items-center justify-center" style={{ backgroundColor: team.color + '20' }}>
                      <Users className="w-3 h-3" style={{ color: team.color }} />
                    </div>
                    <span className="text-xs font-semibold text-gray-900">{team.name}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 mb-2">
                  <span className={`text-[8px] font-bold px-1 py-0.5 rounded ${
                    team.gameType === 'Cash' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                  }`}>
                    {team.gameType}
                  </span>
                  <span className="text-[8px] font-semibold px-1 py-0.5 rounded bg-gray-200 text-gray-700">
                    {team.tableStructure}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div>
                    <div className="text-[10px] text-gray-500">Members</div>
                    <div className="text-sm font-bold text-gray-900">{team.memberCount}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-gray-500">Active</div>
                    <div className="text-sm font-bold text-gray-900">{team.activePlayers}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-gray-500">P/L</div>
                    <div className={`text-sm font-bold ${team.totalProfitLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {team.totalProfitLoss >= 0 ? '+' : ''}${(team.totalProfitLoss / 1000).toFixed(1)}K
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="teams" className="space-y-6 mt-6">
          <div className="flex gap-3 flex-wrap">
            <button
              onClick={() => setSelectedTeam(null)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedTeam === null 
                  ? 'bg-gray-900 text-white' 
                  : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              All Teams
            </button>
            {teams.map(team => (
              <button
                key={team.id}
                onClick={() => setSelectedTeam(team.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                  selectedTeam === team.id 
                    ? 'bg-gray-900 text-white' 
                    : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                }`}
              >
                <div 
                  className="w-2 h-2 rounded-full" 
                  style={{ backgroundColor: team.color }}
                />
                {team.name}
              </button>
            ))}
          </div>

          {selectedTeam === null ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {teams.map(team => (
                <div
                  key={team.id}
                  className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div 
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: team.color + '20' }}
                    >
                      <Users className="w-4 h-4" style={{ color: team.color }} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 text-sm">{team.name}</h4>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                          team.gameType === 'Cash' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                        }`}>
                          {team.gameType}
                        </span>
                        <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-gray-200 text-gray-700">
                          {team.tableStructure}
                        </span>
                        <span className="text-xs text-gray-500">• {team.memberCount} members</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">Active</span>
                      <span className="font-medium text-gray-900">{team.activePlayers}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">P/L</span>
                      <span className={`font-medium ${team.totalProfitLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {team.totalProfitLoss >= 0 ? '+' : ''}${team.totalProfitLoss.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {(() => {
                const team = teams.find(t => t.id === selectedTeam);
                if (!team) return null;
                const teamPlayers = players.filter(p => p.teamId === selectedTeam);
                
                return (
                  <>
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h2 className="text-lg font-bold text-gray-900">{team.name}</h2>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={`text-xs font-bold px-2 py-1 rounded ${
                              team.gameType === 'Cash' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                            }`}>
                              {team.gameType}
                            </span>
                            <span className="text-xs font-semibold px-2 py-1 rounded bg-gray-200 text-gray-700">
                              {team.tableStructure}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-6">
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wide">Members</p>
                          <p className="text-2xl font-bold text-gray-900">{team.memberCount}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wide">Active</p>
                          <p className="text-2xl font-bold text-gray-900">{team.activePlayers}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wide">Total P/L</p>
                          <p className={`text-2xl font-bold ${team.totalProfitLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {team.totalProfitLoss >= 0 ? '+' : ''}${team.totalProfitLoss.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {teamPlayers.map(player => (
                        <PlayerCard 
                          key={player.id} 
                          player={player}
                          onViewSession={() => setSelectedPlayer(player)}
                        />
                      ))}
                    </div>
                  </>
                );
              })()}
            </div>
          )}
        </TabsContent>

        <TabsContent value="organization" className="space-y-6 mt-6">
          <OrganizationView />
        </TabsContent>

        <TabsContent value="splits" className="space-y-6 mt-6">
          <SplitsView />
        </TabsContent>

        <TabsContent value="wallets" className="space-y-6 mt-6">
          <WalletsView />
        </TabsContent>

        <TabsContent value="players" className="space-y-6 mt-6">
          <FilterPanel onFilterChange={setFilters} />

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredPlayers.map(player => {
              const team = teams.find(t => t.id === player.teamId);
              return (
                <div key={player.id} className="relative">
                  {team && (
                    <div className="absolute top-2 right-2 z-10 flex items-center gap-1 text-xs text-gray-500 bg-white/90 px-2 py-0.5 rounded-full border border-gray-200">
                      <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: team.color }} />
                      {team.name}
                    </div>
                  )}
                  <PlayerCard 
                    player={player}
                    onViewSession={() => setSelectedPlayer(player)}
                  />
                </div>
              );
            })}
          </div>

          {filteredPlayers.length === 0 && (
            <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
              <p className="text-gray-500">No players match your current filters</p>
            </div>
          )}
        </TabsContent>
      </Tabs>

        {selectedPlayer && (
          <PlayerSessionModal
            player={selectedPlayer}
            onClose={() => setSelectedPlayer(null)}
          />
        )}
      </div>
    </div>
  );
}
