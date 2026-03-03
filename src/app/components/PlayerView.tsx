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
      duration: 245, // 4h 5min
      profitLoss: 1250,
      buyIn: 500,
      handsPlayed: 408, // ~100 hands/hour: (245/60)*100
      biggestWin: 420,
      biggestLoss: -180
    },
    {
      id: '2',
      date: new Date('2026-03-01T18:00:00'),
      duration: 180, // 3h
      profitLoss: -350,
      buyIn: 500,
      handsPlayed: 300, // 3h * 100 hands/hour
      biggestWin: 280,
      biggestLoss: -310
    },
    {
      id: '3',
      date: new Date('2026-02-28T16:45:00'),
      duration: 320, // 5h 20min
      profitLoss: 2150,
      buyIn: 1000,
      handsPlayed: 533, // ~100 hands/hour: (320/60)*100
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
      handsPlayed: Math.floor((sessionTime / 60) * 100), // 100 hands per hour
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
      <div className="space-y-6 p-6">
        {/* Start Session Card */}
        <div className="bg-white rounded-xl shadow-sm p-12 border border-gray-200 text-center">
          <PlayCircle className="w-20 h-20 text-blue-600 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Ready to Play?</h2>
          <p className="text-gray-500 mb-8 max-w-md mx-auto">
            Start a new session to track your performance, manage your bankroll, and record your gameplay.
          </p>
          
          {/* Buy-in Input */}
          <div className="max-w-sm mx-auto mb-8">
            <label className="block text-gray-700 text-sm font-medium mb-2 text-left">
              Buy-in Amount
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg">$</span>
              <input
                type="number"
                value={buyIn}
                onChange={(e) => setBuyIn(Number(e.target.value))}
                className="w-full pl-8 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 text-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                placeholder="500"
              />
            </div>
          </div>

          <button
            onClick={startSession}
            className="bg-gray-900 hover:bg-gray-800 text-white font-semibold px-8 py-4 rounded-lg transition-all shadow-sm"
          >
            Start Session
          </button>
        </div>

        {/* Session History */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <History className="w-6 h-6 text-gray-700" />
              <h3 className="text-xl font-semibold text-gray-900">Session History</h3>
            </div>
            <span className="text-gray-500 text-sm">{sessionHistory.length} sessions</span>
          </div>

          <div className="divide-y divide-gray-200">
            {sessionHistory.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                No previous sessions yet. Start your first session above!
              </div>
            ) : (
              sessionHistory.map((session) => {
                const sessionProfit = session.profitLoss >= 0;
                return (
                  <div key={session.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                          <Calendar className="w-4 h-4" />
                          {formatDate(session.date)}
                        </div>
                        <div className="text-gray-700">
                          Duration: <span className="font-medium">{formatTime(session.duration)}</span>
                        </div>
                      </div>
                      <div className={`text-right ${sessionProfit ? 'text-green-600' : 'text-red-600'}`}>
                        <div className="text-2xl font-bold">
                          {formatPL(session.profitLoss)}
                        </div>
                        <div className="text-xs text-gray-500">
                          {((session.profitLoss / session.buyIn) * 100).toFixed(1)}% ROI
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-4 gap-4">
                      <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                        <div className="text-gray-500 text-xs mb-1">Buy-in</div>
                        <div className="text-gray-900 font-medium">${session.buyIn}</div>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                        <div className="text-gray-500 text-xs mb-1">Hands</div>
                        <div className="text-gray-900 font-medium">{session.handsPlayed}</div>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                        <div className="text-gray-500 text-xs mb-1">Biggest Win</div>
                        <div className="text-green-600 font-medium">${session.biggestWin}</div>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                        <div className="text-gray-500 text-xs mb-1">Biggest Loss</div>
                        <div className="text-red-600 font-medium">${session.biggestLoss}</div>
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
    <div className="space-y-6 p-6">
      {/* Session Header */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">Live Session</h2>
            <p className="text-gray-500 text-sm">Session started at {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-gray-700">
              <Clock className="w-5 h-5" />
              <span className="font-medium">{formatTime(sessionTime)}</span>
            </div>
            <button
              onClick={endSession}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-2 rounded-lg transition-all flex items-center gap-2"
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
              ? 'bg-green-50 border-green-200' 
              : 'bg-red-50 border-red-200'
          }`}>
            <div className="text-gray-600 text-sm mb-1">Current P/L</div>
            <div className="flex items-center gap-2">
              {isProfit ? (
                <TrendingUp className="w-6 h-6 text-green-600" />
              ) : (
                <TrendingDown className="w-6 h-6 text-red-600" />
              )}
              <span className={`text-3xl font-bold ${
                isProfit ? 'text-green-600' : 'text-red-600'
              }`}>
                {formatPL(currentPL)}
              </span>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
            <div className="text-gray-600 text-sm mb-1">Hands Played</div>
            <div className="text-3xl font-bold text-blue-600">
              {Math.floor((sessionTime / 60) * 100)}
            </div>
          </div>

          <div className="p-4 rounded-lg bg-purple-50 border border-purple-200">
            <div className="text-gray-600 text-sm mb-1">Win Rate</div>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold text-purple-600">
                {sessionTime > 0 ? Math.max(2, Math.min(10, 5 + (currentPL / 1000))).toFixed(1) : '5.0'}
              </span>
              <span className="text-sm font-semibold text-purple-500">bb/100</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Video Feed */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Video className="w-5 h-5 text-gray-700" />
              <h3 className="font-semibold text-gray-900">Live Feed</h3>
            </div>
            {isRecording && (
              <div className="flex items-center gap-2 bg-red-50 text-red-600 px-3 py-1.5 rounded-full border border-red-200">
                <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse" />
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
          <div className="p-4 bg-gray-50 flex items-center justify-center gap-4">
            <button 
              onClick={() => setIsRecording(!isRecording)}
              className={`p-3 rounded-lg transition-all ${
                isRecording 
                  ? 'bg-red-600 hover:bg-red-700 text-white' 
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
              }`}
            >
              {isRecording ? <Square className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            </button>
            <span className="text-gray-600 text-sm">
              {isRecording ? 'Stop Recording' : 'Start Recording'}
            </span>
          </div>
        </div>

        {/* P/L Graph */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-4">Session Performance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={sessionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="time" 
                stroke="#6b7280"
                style={{ fontSize: '12px' }}
              />
              <YAxis 
                stroke="#6b7280"
                style={{ fontSize: '12px' }}
                tickFormatter={(value) => `$${value.toLocaleString()}`}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#ffffff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  padding: '12px',
                  color: '#111827'
                }}
                formatter={(value: number) => [`$${value.toLocaleString()}`, 'P/L']}
              />
              <Line
                type="monotone"
                dataKey="pl"
                name="P/L"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ r: 3, fill: '#3b82f6' }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Additional Session Info */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <h3 className="font-semibold text-gray-900 mb-4">Session Details</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="text-gray-500 text-xs mb-1">Buy-in</div>
            <div className="text-gray-900 font-semibold">${buyIn}</div>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="text-gray-500 text-xs mb-1">Current Stack</div>
            <div className="text-gray-900 font-semibold">${(buyIn + currentPL).toLocaleString()}</div>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="text-gray-500 text-xs mb-1">Biggest Win</div>
            <div className="text-green-600 font-semibold">${biggestWin}</div>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="text-gray-500 text-xs mb-1">Biggest Loss</div>
            <div className="text-red-600 font-semibold">${biggestLoss}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
