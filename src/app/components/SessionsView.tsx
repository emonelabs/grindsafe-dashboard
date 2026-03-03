import { useState } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { History, TrendingUp, TrendingDown, Calendar, DollarSign, Target, Award } from 'lucide-react';

interface SavedSession {
  id: string;
  date: Date;
  duration: number;
  profitLoss: number;
  buyIn: number;
  handsPlayed: number;
  biggestWin: number;
  biggestLoss: number;
}

// Mock session data - in real app, this would come from a database
const mockSessions: SavedSession[] = [
  {
    id: '1',
    date: new Date('2026-03-02T14:30:00'),
    duration: 245, // 4h 5min
    profitLoss: 1250,
    buyIn: 500,
    handsPlayed: 408, // (245/60)*100
    biggestWin: 420,
    biggestLoss: -180
  },
  {
    id: '2',
    date: new Date('2026-03-01T18:00:00'),
    duration: 180, // 3h
    profitLoss: -350,
    buyIn: 500,
    handsPlayed: 300, // (180/60)*100
    biggestWin: 280,
    biggestLoss: -310
  },
  {
    id: '3',
    date: new Date('2026-02-28T16:45:00'),
    duration: 320, // 5h 20min
    profitLoss: 2150,
    buyIn: 1000,
    handsPlayed: 533, // (320/60)*100
    biggestWin: 850,
    biggestLoss: -220
  },
  {
    id: '4',
    date: new Date('2026-02-27T20:15:00'),
    duration: 195, // 3h 15min
    profitLoss: -580,
    buyIn: 500,
    handsPlayed: 325, // (195/60)*100
    biggestWin: 310,
    biggestLoss: -420
  },
  {
    id: '5',
    date: new Date('2026-02-26T15:30:00'),
    duration: 280, // 4h 40min
    profitLoss: 890,
    buyIn: 500,
    handsPlayed: 467, // (280/60)*100
    biggestWin: 520,
    biggestLoss: -180
  },
  {
    id: '6',
    date: new Date('2026-02-25T19:00:00'),
    duration: 210, // 3h 30min
    profitLoss: 1650,
    buyIn: 1000,
    handsPlayed: 350, // (210/60)*100
    biggestWin: 920,
    biggestLoss: -240
  },
  {
    id: '7',
    date: new Date('2026-02-24T17:45:00'),
    duration: 155, // 2h 35min
    profitLoss: -420,
    buyIn: 500,
    handsPlayed: 258, // (155/60)*100
    biggestWin: 180,
    biggestLoss: -380
  },
  {
    id: '8',
    date: new Date('2026-02-23T16:30:00'),
    duration: 340, // 5h 40min
    profitLoss: 2340,
    buyIn: 1000,
    handsPlayed: 567, // (340/60)*100
    biggestWin: 1120,
    biggestLoss: -310
  }
];

export function SessionsView() {
  const [sessions] = useState<SavedSession[]>(mockSessions);
  const [timeRange, setTimeRange] = useState('all');

  // Calculate overall statistics
  const totalSessions = sessions.length;
  const totalPL = sessions.reduce((sum, s) => sum + s.profitLoss, 0);
  const totalHands = sessions.reduce((sum, s) => sum + s.handsPlayed, 0);
  const winningSessions = sessions.filter(s => s.profitLoss > 0).length;
  const winRate = (winningSessions / totalSessions * 100).toFixed(1);
  const avgPL = (totalPL / totalSessions).toFixed(0);
  const totalPlayTime = sessions.reduce((sum, s) => sum + s.duration, 0);

  // Prepare data for cumulative P/L chart
  const cumulativePLData = sessions
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .reduce((acc: any[], session, index) => {
      const cumPL = index === 0 ? session.profitLoss : acc[index - 1].cumulative + session.profitLoss;
      acc.push({
        date: session.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        cumulative: cumPL,
        sessionPL: session.profitLoss
      });
      return acc;
    }, []);

  // Prepare data for session P/L bar chart
  const sessionPLData = sessions
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, 10)
    .reverse()
    .map(session => ({
      date: session.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      pl: session.profitLoss,
      hands: session.handsPlayed
    }));

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const formatPL = (amount: number) => {
    const sign = amount >= 0 ? '+' : '';
    return `${sign}$${amount.toLocaleString()}`;
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Session Analytics</h1>
        <p className="text-gray-500 text-sm">Track your performance across all poker sessions</p>
      </div>

      {/* Overall Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-2xl p-6 border border-slate-700/50">
          <div className="flex items-center justify-between mb-2">
            <DollarSign className="w-8 h-8 text-green-400" />
            <span className={`text-xs font-medium px-2 py-1 rounded-full ${
              totalPL >= 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
            }`}>
              {totalPL >= 0 ? '↑' : '↓'} {((totalPL / sessions.reduce((s, sess) => s + sess.buyIn, 0)) * 100).toFixed(1)}%
            </span>
          </div>
          <div className={`text-3xl font-bold mb-1 ${totalPL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {formatPL(totalPL)}
          </div>
          <div className="text-slate-400 text-sm">Total Profit/Loss</div>
        </div>

        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-2xl p-6 border border-slate-700/50">
          <div className="flex items-center justify-between mb-2">
            <Target className="w-8 h-8 text-blue-400" />
            <span className="text-xs font-medium px-2 py-1 rounded-full bg-blue-500/20 text-blue-400">
              {winRate}%
            </span>
          </div>
          <div className="text-3xl font-bold text-blue-400 mb-1">
            {winningSessions}/{totalSessions}
          </div>
          <div className="text-slate-400 text-sm">Winning Sessions</div>
        </div>

        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-2xl p-6 border border-slate-700/50">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-8 h-8 text-purple-400" />
          </div>
          <div className="text-3xl font-bold text-purple-400 mb-1">
            ${avgPL}
          </div>
          <div className="text-slate-400 text-sm">Avg. per Session</div>
        </div>

        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-2xl p-6 border border-slate-700/50">
          <div className="flex items-center justify-between mb-2">
            <Award className="w-8 h-8 text-amber-400" />
          </div>
          <div className="text-3xl font-bold text-amber-400 mb-1">
            {totalHands}
          </div>
          <div className="text-slate-400 text-sm">Total Hands Played</div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cumulative P/L Chart */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-2xl p-6 border border-slate-700/50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-white text-lg">Cumulative P/L</h3>
            <TrendingUp className="w-5 h-5 text-blue-400" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={cumulativePLData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis 
                dataKey="date" 
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
                formatter={(value: number) => [`$${value.toLocaleString()}`, 'Cumulative P/L']}
              />
              <Line
                type="monotone"
                dataKey="cumulative"
                name="Cumulative P/L"
                stroke="#3b82f6"
                strokeWidth={3}
                dot={{ r: 4, fill: '#3b82f6' }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Session P/L Bar Chart */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-2xl p-6 border border-slate-700/50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-white text-lg">Recent Sessions P/L</h3>
            <History className="w-5 h-5 text-purple-400" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={sessionPLData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis 
                dataKey="date" 
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
              <Bar 
                dataKey="pl" 
                fill="#8b5cf6"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Win Rate Over Time */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-2xl p-6 border border-slate-700/50">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-semibold text-white text-lg">Performance Metrics</h3>
            <p className="text-slate-400 text-sm">Key statistics across all sessions</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-slate-900/50 rounded-lg border border-slate-700/50">
            <div className="text-slate-400 text-xs mb-1">Total Buy-ins</div>
            <div className="text-white text-xl font-semibold">
              ${sessions.reduce((sum, s) => sum + s.buyIn, 0).toLocaleString()}
            </div>
          </div>
          <div className="p-4 bg-slate-900/50 rounded-lg border border-slate-700/50">
            <div className="text-slate-400 text-xs mb-1">Total Play Time</div>
            <div className="text-white text-xl font-semibold">{formatTime(totalPlayTime)}</div>
          </div>
          <div className="p-4 bg-slate-900/50 rounded-lg border border-slate-700/50">
            <div className="text-slate-400 text-xs mb-1">Best Session</div>
            <div className="text-green-400 text-xl font-semibold">
              ${Math.max(...sessions.map(s => s.profitLoss)).toLocaleString()}
            </div>
          </div>
          <div className="p-4 bg-slate-900/50 rounded-lg border border-slate-700/50">
            <div className="text-slate-400 text-xs mb-1">Worst Session</div>
            <div className="text-red-400 text-xl font-semibold">
              ${Math.min(...sessions.map(s => s.profitLoss)).toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* Session History Table */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-2xl border border-slate-700/50 overflow-hidden">
        <div className="p-6 border-b border-slate-700/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <History className="w-6 h-6 text-purple-400" />
            <h3 className="text-xl font-semibold text-white">Session History</h3>
          </div>
          <span className="text-slate-400 text-sm">{sessions.length} sessions</span>
        </div>

        <div className="divide-y divide-slate-700/50">
          {sessions
            .sort((a, b) => b.date.getTime() - a.date.getTime())
            .map((session) => {
              const sessionProfit = session.profitLoss >= 0;
              const roi = ((session.profitLoss / session.buyIn) * 100).toFixed(1);
              
              return (
                <div key={session.id} className="p-6 hover:bg-slate-800/50 transition-colors">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
                        <Calendar className="w-4 h-4" />
                        {formatDate(session.date)}
                      </div>
                      <div className="text-slate-300">
                        Duration: <span className="font-medium">{formatTime(session.duration)}</span>
                      </div>
                    </div>
                    <div className={`text-right ${sessionProfit ? 'text-green-400' : 'text-red-400'}`}>
                      <div className="text-2xl font-bold">
                        {formatPL(session.profitLoss)}
                      </div>
                      <div className="text-xs text-slate-400">
                        {roi}% ROI
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-4">
                    <div className="bg-slate-900/50 p-3 rounded-lg">
                      <div className="text-slate-400 text-xs mb-1">Buy-in</div>
                      <div className="text-white font-medium">${session.buyIn}</div>
                    </div>
                    <div className="bg-slate-900/50 p-3 rounded-lg">
                      <div className="text-slate-400 text-xs mb-1">Hands</div>
                      <div className="text-white font-medium">{session.handsPlayed}</div>
                    </div>
                    <div className="bg-slate-900/50 p-3 rounded-lg">
                      <div className="text-slate-400 text-xs mb-1">Biggest Win</div>
                      <div className="text-green-400 font-medium">${session.biggestWin}</div>
                    </div>
                    <div className="bg-slate-900/50 p-3 rounded-lg">
                      <div className="text-slate-400 text-xs mb-1">Biggest Loss</div>
                      <div className="text-red-400 font-medium">${session.biggestLoss}</div>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}
