import { useState, useEffect, useRef } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Clock, TrendingUp, TrendingDown, Video, Play, Square, PlayCircle, StopCircle, History, Calendar } from 'lucide-react';

interface SessionData {
  time: string;
  pl: number;
}

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

export function PlayerView() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [sessionActive, setSessionActive] = useState(false);
  const [sessionTime, setSessionTime] = useState(0);
  const [currentPL, setCurrentPL] = useState(0);
  const [sessionData, setSessionData] = useState<SessionData[]>([]);
  const [buyIn, setBuyIn] = useState(500);
  const [biggestWin, setBiggestWin] = useState(0);
  const [biggestLoss, setBiggestLoss] = useState(0);
  const [showHistory, setShowHistory] = useState(false);
  const [sessionHistory, setSessionHistory] = useState<SavedSession[]>([
    {
      id: '1',
      date: new Date('2026-03-02T14:30:00'),
      duration: 245,
      profitLoss: 1250,
      buyIn: 500,
      handsPlayed: 156,
      biggestWin: 420,
      biggestLoss: -180
    },
    {
      id: '2',
      date: new Date('2026-03-01T18:00:00'),
      duration: 180,
      profitLoss: -350,
      buyIn: 500,
      handsPlayed: 98,
      biggestWin: 280,
      biggestLoss: -310
    },
    {
      id: '3',
      date: new Date('2026-02-28T16:45:00'),
      duration: 320,
      profitLoss: 2150,
      buyIn: 1000,
      handsPlayed: 187,
      biggestWin: 850,
      biggestLoss: -220
    }
  ]);

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
        
        // Add video noise effect
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

  // Update session data when active
  useEffect(() => {
    if (!sessionActive) return;

    // Initialize with starting data point
    setSessionData([{
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      pl: 0
    }]);

    // Update data every 10 seconds
    const interval = setInterval(() => {
      setSessionData(prevData => {
        const newData = [...prevData];
        if (newData.length >= 25) {
          newData.shift();
        }

        const currentTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        const lastValue = newData[newData.length - 1]?.pl || 0;
        const change = Math.random() * 300 - 150;
        const newPL = Math.round(lastValue + change);
        
        newData.push({
          time: currentTime,
          pl: newPL
        });

        return newData;
      });

      setCurrentPL(prev => {
        const change = Math.round(Math.random() * 100 - 50);
        const newPL = prev + change;
        
        // Track biggest win/loss
        if (change > biggestWin) setBiggestWin(change);
        if (change < biggestLoss) setBiggestLoss(change);
        
        return newPL;
      });
      
      setSessionTime(prev => prev + 1);
    }, 10000);

    return () => clearInterval(interval);
  }, [sessionActive]);

  const startSession = () => {
    setSessionActive(true);
    setIsRecording(true);
    setSessionTime(0);
    setCurrentPL(0);
    setBiggestWin(0);
    setBiggestLoss(0);
    setSessionData([]);
  };

  const endSession = () => {
    // Save session to history
    const newSession: SavedSession = {
      id: Date.now().toString(),
      date: new Date(),
      duration: sessionTime,
      profitLoss: currentPL,
      buyIn: buyIn,
      handsPlayed: Math.floor(sessionTime / 2),
      biggestWin: biggestWin,
      biggestLoss: biggestLoss
    };

    setSessionHistory([newSession, ...sessionHistory]);
    setSessionActive(false);
    setIsRecording(false);
  };

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

  const isProfit = currentPL >= 0;

  // Show start session screen if no active session
  if (!sessionActive) {
    return (
      <div className="space-y-6">
        {/* Start Session Card */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-2xl p-12 border border-slate-700/50 text-center">
          <PlayCircle className="w-20 h-20 text-blue-400 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-white mb-3">Ready to Play?</h2>
          <p className="text-slate-400 mb-8 max-w-md mx-auto">
            Start a new session to track your performance, manage your bankroll, and record your gameplay.
          </p>
          
          {/* Buy-in Input */}
          <div className="max-w-sm mx-auto mb-8">
            <label className="block text-slate-300 text-sm font-medium mb-2 text-left">
              Buy-in Amount
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 text-lg">$</span>
              <input
                type="number"
                value={buyIn}
                onChange={(e) => setBuyIn(Number(e.target.value))}
                className="w-full pl-8 pr-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="500"
              />
            </div>
          </div>

          <button
            onClick={startSession}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold px-8 py-4 rounded-lg transition-all transform hover:scale-105 shadow-lg"
          >
            Start Session
          </button>
        </div>

        {/* Session History */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-2xl border border-slate-700/50 overflow-hidden">
          <div className="p-6 border-b border-slate-700/50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <History className="w-6 h-6 text-purple-400" />
              <h3 className="text-xl font-semibold text-white">Session History</h3>
            </div>
            <span className="text-slate-400 text-sm">{sessionHistory.length} sessions</span>
          </div>

          <div className="divide-y divide-slate-700/50">
            {sessionHistory.length === 0 ? (
              <div className="p-8 text-center text-slate-400">
                No previous sessions yet. Start your first session above!
              </div>
            ) : (
              sessionHistory.map((session) => {
                const sessionProfit = session.profitLoss >= 0;
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
                          {((session.profitLoss / session.buyIn) * 100).toFixed(1)}% ROI
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
              })
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Session Header */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-2xl p-6 border border-slate-700/50">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">Live Session</h2>
            <p className="text-slate-400 text-sm">Session started at {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-slate-300">
              <Clock className="w-5 h-5" />
              <span className="font-medium">{formatTime(sessionTime)}</span>
            </div>
            <button
              onClick={endSession}
              className="bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-2 rounded-lg transition-all flex items-center gap-2"
            >
              <StopCircle className="w-5 h-5" />
              End Session
            </button>
          </div>
        </div>

        {/* Session Stats */}
        <div className="grid grid-cols-3 gap-4">
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
                {formatPL(currentPL)}
              </span>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/30">
            <div className="text-slate-300 text-sm mb-1">Hands Played</div>
            <div className="text-3xl font-bold text-blue-400">
              {Math.floor(sessionTime / 2)}
            </div>
          </div>

          <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/30">
            <div className="text-slate-300 text-sm mb-1">Win Rate</div>
            <div className="text-3xl font-bold text-purple-400">
              {sessionTime > 0 ? ((currentPL / (sessionTime / 2) * 100) || 0).toFixed(1) : '0.0'}%
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Video Feed */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-2xl overflow-hidden border border-slate-700/50">
          <div className="p-4 border-b border-slate-700/50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Video className="w-5 h-5 text-blue-400" />
              <h3 className="font-semibold text-white">Live Feed</h3>
            </div>
            {isRecording && (
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

          {/* Video Controls */}
          <div className="p-4 bg-slate-900/50 flex items-center justify-center gap-4">
            <button 
              onClick={() => setIsRecording(!isRecording)}
              className={`p-3 rounded-lg transition-all ${
                isRecording 
                  ? 'bg-red-500 hover:bg-red-600 text-white' 
                  : 'bg-slate-700 hover:bg-slate-600 text-slate-300'
              }`}
            >
              {isRecording ? <Square className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            </button>
            <span className="text-slate-400 text-sm">
              {isRecording ? 'Stop Recording' : 'Start Recording'}
            </span>
          </div>
        </div>

        {/* P/L Graph */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-2xl p-6 border border-slate-700/50">
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
                stroke="#3b82f6"
                strokeWidth={3}
                dot={{ r: 4, fill: '#3b82f6' }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Additional Session Info */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-2xl p-6 border border-slate-700/50">
        <h3 className="font-semibold text-white mb-4">Session Details</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-slate-900/50 rounded-lg border border-slate-700/50">
            <div className="text-slate-400 text-xs mb-1">Buy-in</div>
            <div className="text-white font-semibold">${buyIn}</div>
          </div>
          <div className="p-4 bg-slate-900/50 rounded-lg border border-slate-700/50">
            <div className="text-slate-400 text-xs mb-1">Current Stack</div>
            <div className="text-white font-semibold">${(buyIn + currentPL).toLocaleString()}</div>
          </div>
          <div className="p-4 bg-slate-900/50 rounded-lg border border-slate-700/50">
            <div className="text-slate-400 text-xs mb-1">Biggest Win</div>
            <div className="text-green-400 font-semibold">${biggestWin}</div>
          </div>
          <div className="p-4 bg-slate-900/50 rounded-lg border border-slate-700/50">
            <div className="text-slate-400 text-xs mb-1">Biggest Loss</div>
            <div className="text-red-400 font-semibold">${biggestLoss}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
