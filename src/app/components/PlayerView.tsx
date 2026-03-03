import { useState, useEffect, useRef } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Clock, TrendingUp, TrendingDown, Video, Play, Square, PlayCircle, StopCircle, History, Calendar, Users } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/tabs';

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
  // Mock player data
  const currentPlayer = {
    name: 'Marcus Chen',
    avatar: 'https://images.unsplash.com/photo-1674644674031-b49db824edbc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
    team: 'High Rollers'
  };

  const [activeTab, setActiveTab] = useState('sessions');
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
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

  // Initialize video stream only when screen sharing is enabled
  useEffect(() => {
    if (!isScreenSharing) {
      // Stop any existing stream
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
        setStream(null);
      }
      return;
    }

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
  }, [isScreenSharing]);

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
    setSessionTime(0);
    setCurrentPL(0);
    setBiggestWin(0);
    setBiggestLoss(0);
    setSessionData([]);
  };

  const startScreenSharing = async () => {
    try {
      setIsScreenSharing(true);
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting screen sharing:', error);
      setIsScreenSharing(false);
      setIsRecording(false);
    }
  };

  const stopScreenSharing = () => {
    setIsScreenSharing(false);
    setIsRecording(false);
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const endSession = () => {
    // Stop screen sharing when ending session
    stopScreenSharing();
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
        {/* Player Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 px-6 py-4">
          <div className="flex items-center gap-4">
            <img 
              src={currentPlayer.avatar} 
              alt={currentPlayer.name}
              className="w-14 h-14 rounded-full object-cover border-2 border-gray-200"
            />
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Hi, {currentPlayer.name.split(' ')[0]}</h2>
              <div className="flex items-center gap-2 text-gray-500">
                <Users className="w-4 h-4" />
                <span className="text-sm">{currentPlayer.team}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="sessions">
              <History className="w-4 h-4 mr-2" />
              Sessions
            </TabsTrigger>
          </TabsList>

          <TabsContent value="sessions" className="space-y-6 mt-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white border border-gray-200 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Total Sessions</span>
                  <History className="w-4 h-4 text-gray-400" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{sessionHistory.length}</div>
                <div className="text-xs text-gray-500 mt-1">All time</div>
              </div>

              <div className="bg-white border border-gray-200 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Total P/L</span>
                  <TrendingUp className="w-4 h-4 text-green-600" />
                </div>
                <div className={`text-2xl font-bold ${sessionHistory.reduce((sum, s) => sum + s.profitLoss, 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatPL(sessionHistory.reduce((sum, s) => sum + s.profitLoss, 0))}
                </div>
                <div className="text-xs text-gray-500 mt-1">Across all sessions</div>
              </div>

              <div className="bg-white border border-gray-200 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Total Hands</span>
                  <PlayCircle className="w-4 h-4 text-blue-600" />
                </div>
                <div className="text-2xl font-bold text-blue-600">
                  {sessionHistory.reduce((sum, s) => sum + s.handsPlayed, 0).toLocaleString()}
                </div>
                <div className="text-xs text-gray-500 mt-1">Total hands played</div>
              </div>

              <div className="bg-white border border-gray-200 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Avg Session</span>
                  <Clock className="w-4 h-4 text-purple-600" />
                </div>
                <div className="text-2xl font-bold text-purple-600">
                  {sessionHistory.length > 0 ? formatTime(Math.round(sessionHistory.reduce((sum, s) => sum + s.duration, 0) / sessionHistory.length)) : '0h 0m'}
                </div>
                <div className="text-xs text-gray-500 mt-1">Average duration</div>
              </div>
            </div>

            {/* Start Session CTA */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl shadow-sm p-6 border border-blue-500">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white text-lg font-semibold mb-1">Ready to Play?</h3>
                  <p className="text-blue-100 text-sm">Start a new session to track your performance</p>
                </div>
                <button
                  onClick={startSession}
                  className="bg-white hover:bg-gray-50 text-blue-600 font-semibold px-6 py-3 rounded-lg transition-all shadow-sm flex items-center gap-2"
                >
                  <PlayCircle className="w-5 h-5" />
                  Start Session
                </button>
              </div>
            </div>

            {/* Sessions Table */}
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                <h3 className="text-lg font-semibold text-gray-900">Session History</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">Date</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">Duration</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">Hands</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">P/L</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">Buy-in</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">ROI</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">Win/Loss</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {sessionHistory.map((session) => {
                      const sessionProfit = session.profitLoss >= 0;
                      const roi = ((session.profitLoss / session.buyIn) * 100).toFixed(1);
                      
                      return (
                        <tr key={session.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2 text-gray-500 text-sm">
                              <Calendar className="w-4 h-4" />
                              {formatDate(session.date)}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="text-sm font-medium text-gray-900">{formatTime(session.duration)}</div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="text-sm font-medium text-gray-900">{session.handsPlayed}</div>
                          </td>
                          <td className="px-4 py-3">
                            <div className={`text-sm font-bold ${sessionProfit ? 'text-green-600' : 'text-red-600'}`}>
                              {formatPL(session.profitLoss)}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="text-sm text-gray-900">${session.buyIn}</div>
                          </td>
                          <td className="px-4 py-3">
                            <div className={`text-sm font-semibold ${parseFloat(roi) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {roi}%
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="space-y-1">
                              <div className="flex items-center gap-1 text-xs">
                                <span className="text-gray-500">Win:</span>
                                <span className="text-green-600 font-medium">${session.biggestWin}</span>
                              </div>
                              <div className="flex items-center gap-1 text-xs">
                                <span className="text-gray-500">Loss:</span>
                                <span className="text-red-600 font-medium">${Math.abs(session.biggestLoss)}</span>
                              </div>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {sessionHistory.length === 0 && (
                <div className="text-center py-12 text-gray-400">
                  <History className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>No sessions yet. Start your first session above!</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
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

          {isScreenSharing ? (
            <>
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
                  onClick={stopScreenSharing}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-all flex items-center gap-2"
                >
                  <Square className="w-4 h-4" />
                  Stop Sharing
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="relative bg-gray-100 aspect-video flex items-center justify-center">
                <div className="text-center p-8">
                  <Video className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h4 className="text-lg font-semibold text-gray-700 mb-2">Screen Sharing Disabled</h4>
                  <p className="text-sm text-gray-500 mb-4">Share your screen to record your gameplay</p>
                </div>
              </div>

              {/* Start Sharing Button */}
              <div className="p-4 bg-gray-50 flex items-center justify-center gap-4">
                <button 
                  onClick={startScreenSharing}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-all flex items-center gap-2"
                >
                  <Play className="w-4 h-4" />
                  Start Screen Sharing
                </button>
              </div>
            </>
          )}
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
