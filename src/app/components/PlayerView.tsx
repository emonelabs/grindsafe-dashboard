import { useState, useEffect, useRef, useCallback } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ScatterChart, Scatter, ZAxis } from 'recharts';
import { Clock, TrendingUp, TrendingDown, Video, Play, Square, PlayCircle, StopCircle, History, Calendar, Users, Wallet, DollarSign, CreditCard, ArrowUpRight, ArrowDownRight, ChevronDown, ChevronRight, MoreVertical, Grid3x3, Search, Send, Sparkles, Split, Repeat2, Command, Info, ArrowLeftRight, CircleDollarSign, CheckCircle } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/tabs';
import { Tooltip as UITooltip, TooltipTrigger, TooltipContent } from './ui/tooltip';

interface SessionData {
  time: string;
  pl: number;
  ev: number;
}

interface SavedSession {
  id: string;
  date: Date;
  duration: number;
  profitLoss: number;
  ev: number;
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

  const [activeTab, setActiveTab] = useState('overview');
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [aiQuery, setAiQuery] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [showAiModal, setShowAiModal] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{role: 'user' | 'assistant', content: string}>>([]);
  const aiInputRef = useRef<HTMLInputElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [sessionActive, setSessionActive] = useState(false);
  const [sessionTime, setSessionTime] = useState(0);
  const [currentPL, setCurrentPL] = useState(0);
  const [currentEV, setCurrentEV] = useState(0);
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
      ev: 1180, // EV slightly below actual (ran above EV)
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
      ev: -120, // EV better than actual (ran below EV)
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
      ev: 2280, // EV slightly above actual (ran below EV)
      buyIn: 1000,
      handsPlayed: 533, // ~100 hands/hour: (320/60)*100
      biggestWin: 850,
      biggestLoss: -220
    }
  ]);

  // Operations state for infinite scroll
  const [operations, setOperations] = useState<any[]>([]);
  const [operationsPage, setOperationsPage] = useState(1);
  const [isLoadingOperations, setIsLoadingOperations] = useState(false);
  const [hasMoreOperations, setHasMoreOperations] = useState(true);
  const [expandedOperations, setExpandedOperations] = useState<Set<string>>(new Set());
  const operationsScrollRef = useRef<HTMLDivElement>(null);

  // Generate mock operations
  const generateOperations = (page: number, count: number = 10) => {
    const types = ['Deposit', 'Withdrawal', 'Split', 'Swap'];
    const wallets = ['Main Wallet', 'PokerStars', 'GGPoker', 'Bank Account', 'Credit Card'];
    const operations = [];
    
    for (let i = 0; i < count; i++) {
      const type = types[Math.floor(Math.random() * types.length)];
      const daysAgo = (page - 1) * count + i;
      const date = new Date();
      date.setDate(date.getDate() - daysAgo);
      date.setHours(Math.floor(Math.random() * 12) + 8);
      date.setMinutes(Math.floor(Math.random() * 60));
      
      const opNumber = 1234 - ((page - 1) * count + i);
      let transactions: any[] = [];
      let amount = 0;
      
      if (type === 'Deposit') {
        const txCount = Math.floor(Math.random() * 2) + 1;
        for (let j = 0; j < txCount; j++) {
          const txAmount = Math.floor(Math.random() * 2000) + 500;
          amount += txAmount;
          const sources = ['Bank Transfer', 'Credit Card', 'Wire Transfer'];
          transactions.push({
            from: sources[Math.floor(Math.random() * sources.length)],
            fromType: 'external',
            to: 'Main Wallet',
            toType: 'wallet',
            amount: txAmount
          });
        }
      } else if (type === 'Withdrawal') {
        const txAmount = Math.floor(Math.random() * 3000) + 500;
        amount = txAmount;
        transactions.push({
          from: 'Main Wallet',
          fromType: 'wallet',
          to: 'Bank Account',
          toType: 'external',
          amount: txAmount
        });
      } else if (type === 'Split') {
        const profit = Math.floor(Math.random() * 4000) + 1000;
        amount = profit;
        const playerShare = Math.floor(profit * 0.5);
        const houseShare = profit - playerShare;
        transactions.push({
          from: 'Session Profit',
          fromType: 'profit',
          to: 'Player Share (50%)',
          toType: 'player',
          amount: playerShare
        });
        transactions.push({
          from: 'Session Profit',
          fromType: 'profit',
          to: 'House Share (50%)',
          toType: 'house',
          amount: houseShare
        });
      } else if (type === 'Swap') {
        const txCount = Math.floor(Math.random() * 2) + 1;
        for (let j = 0; j < txCount; j++) {
          const txAmount = Math.floor(Math.random() * 1000) + 100;
          amount += txAmount;
          const platforms = ['PokerStars', 'GGPoker', '888Poker', 'PartyPoker'];
          transactions.push({
            from: 'Main Wallet',
            fromType: 'wallet',
            to: platforms[Math.floor(Math.random() * platforms.length)],
            toType: 'platform',
            amount: txAmount
          });
        }
      }
      
      operations.push({
        id: `OP-${opNumber.toString().padStart(6, '0')}`,
        type,
        date,
        amount,
        transactions,
        status: 'Completed'
      });
    }
    
    return operations;
  };

  // Initialize operations
  useEffect(() => {
    if (activeTab === 'operations' && operations.length === 0) {
      const initialOps = generateOperations(1, 15);
      setOperations(initialOps);
      // Expand only the first (latest) operation
      if (initialOps.length > 0) {
        setExpandedOperations(new Set([initialOps[0].id]));
      }
    }
  }, [activeTab]);

  // Toggle operation expansion
  const toggleOperation = (operationId: string) => {
    setExpandedOperations(prev => {
      const newSet = new Set(prev);
      if (newSet.has(operationId)) {
        newSet.delete(operationId);
      } else {
        newSet.add(operationId);
      }
      return newSet;
    });
  };

  // Infinite scroll handler
  const handleOperationsScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    if (isLoadingOperations || !hasMoreOperations) {
      return;
    }
    
    const target = e.currentTarget;
    const { scrollTop, scrollHeight, clientHeight } = target;
    
    // Calculate how close we are to the bottom
    const scrollPercentage = (scrollTop + clientHeight) / scrollHeight;
    
    // Load more when scrolled 90% down
    if (scrollPercentage > 0.9) {
      setIsLoadingOperations(true);
      
      // Simulate loading delay
      setTimeout(() => {
        const nextPage = operationsPage + 1;
        const newOperations = generateOperations(nextPage, 10);
        
        setOperations(prev => {
          const updatedOps = [...prev, ...newOperations];
          
          // Stop loading more after 50 operations
          if (updatedOps.length >= 50) {
            setHasMoreOperations(false);
          }
          
          return updatedOps;
        });
        
        setOperationsPage(nextPage);
        setIsLoadingOperations(false);
      }, 500);
    }
  }, [isLoadingOperations, hasMoreOperations, operationsPage]);

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
      pl: 0,
      ev: 0
    }]);

    // Update data every 10 seconds
    const interval = setInterval(() => {
      setSessionData(prevData => {
        const newData = [...prevData];
        if (newData.length >= 25) {
          newData.shift();
        }

        const currentTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        const lastPL = newData[newData.length - 1]?.pl || 0;
        const lastEV = newData[newData.length - 1]?.ev || 0;
        const plChange = Math.random() * 300 - 150;
        const evChange = plChange + (Math.random() - 0.5) * 50; // EV varies slightly from actual
        const newPL = Math.round(lastPL + plChange);
        const newEV = Math.round(lastEV + evChange);
        
        newData.push({
          time: currentTime,
          pl: newPL,
          ev: newEV
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

      setCurrentEV(prev => {
        const evVariance = (Math.random() - 0.5) * 30;
        return Math.round(prev + (Math.random() * 100 - 50) + evVariance);
      });
      
      setSessionTime(prev => prev + 1);
    }, 10000);

    return () => clearInterval(interval);
  }, [sessionActive]);

  // Command palette keyboard shortcut (Cmd+O)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      console.log('Key pressed:', e.key, 'Meta:', e.metaKey, 'Ctrl:', e.ctrlKey, 'Shift:', e.shiftKey);
      
      // Cmd+O or Ctrl+O to toggle
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'o') {
        console.log('✅ Command palette shortcut detected!');
        e.preventDefault();
        e.stopPropagation();
        setShowCommandPalette(prev => {
          console.log('Toggling command palette from', prev, 'to', !prev);
          return !prev;
        });
        return;
      }
      
      // ESC to close
      if (e.key === 'Escape') {
        if (showCommandPalette) {
          console.log('Closing command palette with ESC');
          e.preventDefault();
          setShowCommandPalette(false);
        }
      }
    };

    console.log('📋 Command palette listener attached');
    window.addEventListener('keydown', handleKeyDown, true);
    return () => {
      console.log('📋 Command palette listener removed');
      window.removeEventListener('keydown', handleKeyDown, true);
    };
  }, [showCommandPalette]);

  const startSession = () => {
    setSessionActive(true);
    setSessionTime(0);
    setCurrentPL(0);
    setCurrentEV(0);
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
      ev: currentEV,
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

  const handleAiQuery = async () => {
    if (!aiQuery.trim()) return;
    
    const userMessage = aiQuery.trim();
    
    // Add user message to chat
    setChatMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setAiQuery('');
    setIsAiLoading(true);
    
    // Simulate AI response with a delay
    setTimeout(() => {
      // Mock AI response based on query
      const query = userMessage.toLowerCase();
      let response = '';
      
      if (query.includes('ajo') || query.includes('a-j')) {
        response = "Based on your session history, you're losing the most money with AJo (Ace-Jack offsuit) in late position against aggressive 3-bets. Your win rate with AJo is -$130 over 47 hands. Consider:\n\n1. **Fold more often** to 3-bets when out of position\n2. **Reduce opening range** from early positions\n3. **Only continue** when you have strong reads or position advantage\n\nYour AJo performance:\n• Early Position: -$180 (fold more)\n• Middle Position: -$50 (marginal)\n• Late Position: +$100 (profitable)";
      } else if (query.includes('profitable') || query.includes('profit')) {
        response = "Your most profitable hands are pocket pairs AA-JJ, showing consistent wins. AA leads at +$450 average. Focus on:\n\n• Maximizing value with premium pairs\n• Playing more hands in position\n• Your suited connectors (87s, 76s) are also performing well at +$60 average";
      } else if (query.includes('improve') || query.includes('better')) {
        response = "Key areas for improvement:\n\n1. **Reduce losses** with weak offsuit hands (K7o-K2o)\n2. **Improve position awareness** - you're -15% ROI from early position\n3. **Session length** - Your win rate increases significantly after 3+ hours\n4. **Manage tilt** - You have 3 sessions with -$300+ swings";
      } else {
        response = `I analyzed your query about "${userMessage}".\n\nBased on your ${sessionHistory.length} sessions and ${sessionHistory.reduce((sum, s) => sum + s.handsPlayed, 0)} hands played, here's what I found:\n\n• Total P/L: ${formatPL(sessionHistory.reduce((sum, s) => sum + s.profitLoss, 0))}\n• Win Rate: ${((sessionHistory.filter(s => s.profitLoss > 0).length / sessionHistory.length) * 100).toFixed(1)}%\n• Best session: ${formatPL(Math.max(...sessionHistory.map(s => s.profitLoss)))}\n\nWhat else would you like to know?`;
      }
      
      // Add AI response to chat
      setChatMessages(prev => [...prev, { role: 'assistant', content: response }]);
      setIsAiLoading(false);
      
      // Scroll to bottom
      setTimeout(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }, 1500);
  };

  // Focus input when modal opens
  useEffect(() => {
    if (showAiModal && aiInputRef.current) {
      aiInputRef.current.focus();
    }
  }, [showAiModal]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd+K or Ctrl+K to open
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowAiModal(true);
      }
      // ESC to close
      if (e.key === 'Escape' && showAiModal) {
        setShowAiModal(false);
        setChatMessages([]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showAiModal]);

  const isProfit = currentPL >= 0;

  const renderAiModal = () => (
    <>
      {/* Fixed Search Bar Trigger - Always visible at top */}
      {!showAiModal && (
        <div className="sticky top-0 z-30 bg-white border-b border-gray-200">
          <div className="px-6 py-3">
            <button
              onClick={() => setShowAiModal(true)}
              className="w-full flex items-center gap-3 px-4 py-2.5 bg-transparent hover:bg-gray-50 transition-all text-left group rounded-lg"
            >
              <Search className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
              <span className="text-sm text-gray-400 group-hover:text-gray-600">Ask AI anything about your poker performance...</span>
              <div className="ml-auto flex items-center gap-1 text-xs text-gray-300 group-hover:text-gray-400">
                <kbd className="px-2 py-0.5 bg-transparent border border-gray-200 rounded text-xs font-mono">⌘</kbd>
                <kbd className="px-2 py-0.5 bg-transparent border border-gray-200 rounded text-xs font-mono">K</kbd>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* Slide Down Chat Panel - Full conversation screen */}
      {showAiModal && (
        <div 
          className="fixed top-0 left-0 right-0 bottom-0 z-40 bg-white animate-slideDown"
        >
          <div className="h-full flex flex-col">
              {/* Header with Close Button */}
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-purple-50 to-blue-50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">AI Poker Assistant</h3>
                    <p className="text-xs text-gray-500">Ask me anything about your performance</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowAiModal(false);
                    setChatMessages([]);
                    setAiQuery('');
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <span className="text-2xl leading-none">×</span>
                </button>
              </div>

              {/* Chat Messages Area */}
              <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                {/* Welcome Message */}
                {chatMessages.length === 0 && !isAiLoading && (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center mb-4">
                      <Sparkles className="w-8 h-8 text-white" />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">How can I help you today?</h4>
                    <p className="text-sm text-gray-500 mb-6 max-w-md">
                      I can analyze your poker performance, identify leaks, and suggest improvements based on your session history.
                    </p>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {[
                        "Where am I losing money with AJo?",
                        "What are my most profitable hands?",
                        "How can I improve my game?"
                      ].map((suggestion, i) => (
                        <button
                          key={i}
                          onClick={() => {
                            setAiQuery(suggestion);
                            setTimeout(() => handleAiQuery(), 100);
                          }}
                          className="px-4 py-2 text-sm bg-white hover:bg-gray-50 border border-gray-200 rounded-lg transition-colors"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Chat Messages */}
                {chatMessages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {message.role === 'assistant' && (
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center flex-shrink-0">
                        <Sparkles className="w-4 h-4 text-white" />
                      </div>
                    )}
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                        message.role === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <div className="text-sm leading-relaxed whitespace-pre-line">
                        {message.content}
                      </div>
                    </div>
                    {message.role === 'user' && (
                      <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0 text-white font-semibold text-sm">
                        {currentPlayer.name.split(' ').map(n => n[0]).join('')}
                      </div>
                    )}
                  </div>
                ))}

                {/* Loading Indicator */}
                {isAiLoading && (
                  <div className="flex gap-3 justify-start">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <div className="bg-gray-100 rounded-2xl px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                        </div>
                        <span className="text-xs text-gray-500">Analyzing...</span>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={chatEndRef} />
              </div>

              {/* Input Area at Bottom */}
              <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                <div className="flex items-center gap-3">
                  <input
                    ref={aiInputRef}
                    type="text"
                    value={aiQuery}
                    onChange={(e) => setAiQuery(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !isAiLoading && aiQuery.trim()) {
                        handleAiQuery();
                      }
                    }}
                    placeholder="Ask anything about your poker game..."
                    disabled={isAiLoading}
                    className="flex-1 px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed text-sm"
                    autoFocus
                  />
                  <button
                    onClick={handleAiQuery}
                    disabled={!aiQuery.trim() || isAiLoading}
                    className="px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all flex items-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                  <span>Press <kbd className="px-1.5 py-0.5 bg-white border border-gray-300 rounded font-mono text-[10px]">Enter</kbd> to send</span>
                  <span>Press <kbd className="px-1.5 py-0.5 bg-white border border-gray-300 rounded font-mono text-[10px]">Esc</kbd> to close</span>
                </div>
              </div>
          </div>
        </div>
      )}
    </>
  );

  // Show start session screen if no active session
  if (!sessionActive) {
    return (
      <div className="space-y-0 relative">
        {renderAiModal()}
        
        {/* Command Palette */}
        {showCommandPalette && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 bg-black/50 z-50 animate-fadeIn"
              onClick={() => setShowCommandPalette(false)}
            />
            
            {/* Command Palette Modal */}
            <div className="fixed top-[20%] left-1/2 -translate-x-1/2 w-full max-w-xl z-50 animate-fadeIn">
              <div className="bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden">
                {/* Header */}
                <div className="px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
                  <div className="flex items-center gap-2">
                    <Command className="w-4 h-4 text-gray-600" />
                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Quick Actions</h3>
                    <div className="ml-auto flex items-center gap-2">
                      <kbd className="px-2 py-0.5 text-xs font-semibold text-gray-600 bg-gray-100 border border-gray-300 rounded">ESC</kbd>
                      <span className="text-xs text-gray-500">to close</span>
                    </div>
                  </div>
                </div>

                {/* Actions List */}
                <div className="p-2">
                  <button
                    onClick={() => {
                      setShowCommandPalette(false);
                      setActiveTab('balance');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="w-full px-4 py-3 text-left rounded-lg hover:bg-gray-50 flex items-center gap-3 transition-colors group"
                  >
                    <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center group-hover:bg-green-100 transition-colors">
                      <ArrowDownRight className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-gray-900">Request Deposit</div>
                      <div className="text-xs text-gray-500">Add funds to your balance</div>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      setShowCommandPalette(false);
                      setActiveTab('balance');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="w-full px-4 py-3 text-left rounded-lg hover:bg-gray-50 flex items-center gap-3 transition-colors group"
                  >
                    <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                      <ArrowUpRight className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-gray-900">Request Withdraw</div>
                      <div className="text-xs text-gray-500">Withdraw funds from your balance</div>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      setShowCommandPalette(false);
                      setActiveTab('balance');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="w-full px-4 py-3 text-left rounded-lg hover:bg-gray-50 flex items-center gap-3 transition-colors group"
                  >
                    <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center group-hover:bg-purple-100 transition-colors">
                      <Split className="w-5 h-5 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-gray-900">Request Split</div>
                      <div className="text-xs text-gray-500">Split balance with another player</div>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      setShowCommandPalette(false);
                      setActiveTab('balance');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="w-full px-4 py-3 text-left rounded-lg hover:bg-gray-50 flex items-center gap-3 transition-colors group"
                  >
                    <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center group-hover:bg-orange-100 transition-colors">
                      <Repeat2 className="w-5 h-5 text-orange-600" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-gray-900">Request Swap</div>
                      <div className="text-xs text-gray-500">Swap stakes with another player</div>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
        
        <div className={`space-y-6 p-6 transition-all duration-300 ${showAiModal ? 'opacity-50' : 'opacity-100'}`}>
        {/* Player Header */}
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img 
                src={currentPlayer.avatar} 
                alt={currentPlayer.name}
                className="w-14 h-14 rounded-full object-cover border border-gray-200 shadow-sm"
              />
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Hi, {currentPlayer.name.split(' ')[0]}</h2>
                <div className="flex items-center gap-2 text-gray-600">
                  <Users className="w-4 h-4" />
                  <span className="text-sm">{currentPlayer.team}</span>
                </div>
              </div>
            </div>
            
            {/* Cmd+O hint - clickable to open */}
            <button
              onClick={() => {
                console.log('Manual trigger - opening command palette');
                setShowCommandPalette(true);
              }}
              className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <span className="text-xs text-gray-500">Press</span>
              <kbd className="px-2 py-0.5 text-xs font-semibold text-gray-800 bg-white border border-gray-300 rounded">⌘O</kbd>
              <span className="text-xs text-gray-500">for actions</span>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="overview">
              <History className="w-4 h-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="operations">
              <ArrowLeftRight className="w-4 h-4 mr-2" />
              Operations
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-3 mt-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
              <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-3 rounded shadow-sm border border-blue-500">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold text-blue-100 uppercase tracking-wide">Current Balance</span>
                  <div className="w-8 h-8 bg-blue-500/30 rounded-lg flex items-center justify-center">
                    <Wallet className="w-4 h-4 text-blue-100" />
                  </div>
                </div>
                <div className="flex items-end justify-between">
                  <span className="text-2xl font-bold text-white">
                    ${(buyIn + sessionHistory.reduce((sum, s) => sum + s.profitLoss, 0)).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="bg-white border border-gray-200 p-3 rounded">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-medium text-gray-500 uppercase tracking-wide">Total Deposits</span>
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <ArrowDownRight className="w-4 h-4 text-green-600" />
                  </div>
                </div>
                <div className="flex items-end justify-between">
                  <span className="text-2xl font-bold text-gray-900">
                    ${(sessionHistory.reduce((sum, s) => sum + s.buyIn, 0) + buyIn).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="bg-white border border-gray-200 p-3 rounded">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-medium text-gray-500 uppercase tracking-wide">Total Winnings</span>
                  <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                    {sessionHistory.reduce((sum, s) => sum + s.profitLoss, 0) >= 0 ? (
                      <TrendingUp className="w-4 h-4 text-green-600" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-600" />
                    )}
                  </div>
                </div>
                <div className="flex items-end justify-between">
                  <span className={`text-2xl font-bold ${sessionHistory.reduce((sum, s) => sum + s.profitLoss, 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatPL(sessionHistory.reduce((sum, s) => sum + s.profitLoss, 0))}
                  </span>
                </div>
              </div>

              <div className="bg-white border border-gray-200 p-3 rounded">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-medium text-gray-500 uppercase tracking-wide">Total Sessions</span>
                  <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                    <History className="w-4 h-4 text-gray-600" />
                  </div>
                </div>
                <div className="flex items-end justify-between">
                  <span className="text-2xl font-bold text-gray-900">{sessionHistory.length}</span>
                </div>
              </div>

              <div className="bg-white border border-gray-200 p-3 rounded">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-medium text-gray-500 uppercase tracking-wide">Total P/L</span>
                  <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                    {sessionHistory.reduce((sum, s) => sum + s.profitLoss, 0) >= 0 ? (
                      <TrendingUp className="w-4 h-4 text-green-600" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-600" />
                    )}
                  </div>
                </div>
                <div className="flex items-end justify-between">
                  <span className={`text-2xl font-bold ${sessionHistory.reduce((sum, s) => sum + s.profitLoss, 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatPL(sessionHistory.reduce((sum, s) => sum + s.profitLoss, 0))}
                  </span>
                </div>
              </div>

              <div className="bg-white border border-gray-200 p-3 rounded">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-medium text-gray-500 uppercase tracking-wide">Total Hands</span>
                  <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                    <PlayCircle className="w-4 h-4 text-blue-600" />
                  </div>
                </div>
                <div className="flex items-end justify-between">
                  <span className="text-2xl font-bold text-gray-900">
                    {sessionHistory.reduce((sum, s) => sum + s.handsPlayed, 0).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="bg-white border border-gray-200 p-3 rounded">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-medium text-gray-500 uppercase tracking-wide">Avg Session</span>
                  <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Clock className="w-4 h-4 text-purple-600" />
                  </div>
                </div>
                <div className="flex items-end justify-between">
                  <span className="text-2xl font-bold text-gray-900">
                    {sessionHistory.length > 0 ? formatTime(Math.round(sessionHistory.reduce((sum, s) => sum + s.duration, 0) / sessionHistory.length)) : '0h 0m'}
                  </span>
                </div>
              </div>
            </div>

            {/* 70/30 Split Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-10 gap-3">
              {/* Left Column (70%) - Chart and Sessions */}
              <div className="lg:col-span-7 space-y-3">
                {/* P/L & EV Chart */}
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></div>
                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Performance Chart</h3>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                      <span className="text-xs text-gray-600">Actual P/L</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                      <span className="text-xs text-gray-600">EV</span>
                    </div>
                    <span className={`text-xl font-bold ${sessionHistory.reduce((sum, s) => sum + s.profitLoss, 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatPL(sessionHistory.reduce((sum, s) => sum + s.profitLoss, 0))}
                    </span>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <ResponsiveContainer width="100%" height={280}>
                  <LineChart data={sessionHistory.slice().reverse().map((s, i) => ({
                    session: `S${i + 1}`,
                    pl: s.profitLoss,
                    ev: s.ev,
                    date: s.date
                  }))}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis 
                      dataKey="session" 
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
                      formatter={(value: number, name: string) => [`$${value.toLocaleString()}`, name === 'pl' ? 'Actual P/L' : 'EV']}
                    />
                    <Line
                      type="monotone"
                      dataKey="pl"
                      name="pl"
                      stroke="#10b981"
                      strokeWidth={2}
                      dot={{ r: 4, fill: '#10b981' }}
                      activeDot={{ r: 6 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="ev"
                      name="ev"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      dot={{ r: 4, fill: '#3b82f6' }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* 50/50 Split: Winrate by Position & Hero/Villain Winrate */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              {/* Winrate by Position - Left Half */}
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-gray-600" />
                        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Winrate by Position</h3>
                      </div>
                      <p className="text-[10px] text-gray-500 mt-0.5">Performance across board textures</p>
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      <ChevronRight className="w-3 h-3 animate-pulse" />
                      <span>Scroll</span>
                    </div>
                  </div>
                </div>
              
                <div className="p-4 overflow-x-auto scrollbar-thin relative">
                  {/* Scroll indicator at left */}
                  <div className="absolute top-0 left-0 bottom-0 w-4 bg-gradient-to-r from-white to-transparent pointer-events-none z-10"></div>
                  
                  {/* Legend */}
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-4 min-w-max">
                    <div className="text-[10px] font-bold text-gray-700 mb-2">Board Textures & Streets</div>
                    <div className="grid grid-cols-4 gap-2 text-[9px] text-gray-600">
                      <div><span className="font-semibold">Rainbow:</span> No flush draw</div>
                      <div><span className="font-semibold">Monotone:</span> All same suit</div>
                      <div><span className="font-semibold">Middle Pair:</span> Connected board</div>
                      <div><span className="font-semibold">Paired:</span> Board has pair</div>
                      <div className="col-span-4 text-gray-500 mt-1">
                        Each dot represents performance on specific texture at Flop, Turn, or River
                      </div>
                    </div>
                  </div>
                  
                  {/* Position Grid */}
                  <div className="flex gap-2 pb-4 min-w-max">
                  {['BB (IP)', 'BB (OOP)', 'BTN (IP)', 'CO (IP)', 'CO (OOP)', 'EP (IP)', 'EP (OOP)', 'MP (IP)', 'MP (OOP)', 'SB (OOP)'].map((position) => (
                    <div key={position} className="bg-gray-50 border border-gray-200 rounded-lg p-3 flex-shrink-0 w-48">
                      <div className="text-[10px] font-bold text-gray-700 mb-2 text-center">{position}</div>
                      <div className="h-32 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <ScatterChart
                            margin={{ top: 5, right: 5, bottom: 5, left: 5 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                            <XAxis 
                              type="number" 
                              dataKey="x"
                              domain={[0, 1]}
                              tick={false}
                              stroke="#9ca3af"
                              hide={true}
                            />
                            <YAxis 
                              type="number" 
                              dataKey="winrate"
                              domain={[-50, 50]}
                              ticks={[-50, -25, 0, 25, 50]}
                              tick={{ fontSize: 9 }}
                              stroke="#9ca3af"
                              width={30}
                            />
                            <Tooltip 
                              contentStyle={{ 
                                backgroundColor: '#ffffff',
                                border: '1px solid #e5e7eb',
                                borderRadius: '6px',
                                padding: '6px',
                                fontSize: '11px'
                              }}
                              formatter={(value: number, name: string, props: any) => [
                                `${value > 0 ? '+' : ''}${value.toFixed(1)} bb/100`,
                                `${props.payload.texture} - ${props.payload.street}`
                              ]}
                            />
                            <ZAxis range={[50, 50]} />
                            <Scatter 
                              data={(() => {
                                // Generate mock data for each position with more sparse distribution
                                const textures = ['Rainbow', 'Monotone', 'Middle Pair', 'Paired'];
                                const streets = ['Flop', 'Turn', 'River'];
                                const baseWinrate = position.includes('IP') ? 8 : -3;
                                const variance = position.includes('BB') ? 15 : 8;
                                
                                return textures.flatMap((texture, i) => 
                                  streets.map((street, j) => {
                                    const winrate = baseWinrate + (Math.random() * variance * 2 - variance) + (i * 3) - (j * 2);
                                    
                                    // Calculate color based on winrate (gradient from red to green)
                                    const getColor = (wr: number) => {
                                      if (wr >= 20) return '#10b981'; // green-500
                                      if (wr >= 10) return '#22c55e'; // green-400
                                      if (wr >= 5) return '#84cc16'; // lime-500
                                      if (wr >= 0) return '#eab308'; // yellow-500
                                      if (wr >= -5) return '#f97316'; // orange-500
                                      if (wr >= -10) return '#f87171'; // red-400
                                      return '#ef4444'; // red-500
                                    };
                                    
                                    return {
                                      texture,
                                      street,
                                      x: 0.5 + (Math.random() * 0.1 - 0.05), // Slight horizontal jitter
                                      winrate,
                                      fill: getColor(winrate),
                                      label: `${texture.substring(0, 3)}-${street.substring(0, 1)}`
                                    };
                                  })
                                );
                              })()}
                              shape={(props: any) => {
                                const { cx, cy, fill } = props;
                                return (
                                  <circle
                                    cx={cx}
                                    cy={cy}
                                    r={4}
                                    fill={fill}
                                    opacity={0.8}
                                  />
                                );
                              }}
                            />
                          </ScatterChart>
                        </ResponsiveContainer>
                      </div>
                      {/* Average winrate for this position */}
                      <div className="text-center mt-2 pt-2 border-t border-gray-200">
                        <div className="text-[9px] text-gray-500">Avg</div>
                        <div className="text-xs font-bold text-gray-900">
                          {position.includes('IP') ? '+8.3' : '-2.1'} bb/100
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                  {/* Scroll indicator at right */}
                  <div className="absolute top-0 right-0 bottom-0 w-4 bg-gradient-to-l from-white to-transparent pointer-events-none"></div>
                </div>
              </div>

              {/* Hero/Villain Winrate - Right Half */}
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-gray-600" />
                        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Hero/Villain Winrate</h3>
                      </div>
                      <p className="text-[10px] text-gray-500 mt-0.5">Performance vs positions</p>
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      <ChevronRight className="w-3 h-3 animate-pulse" />
                      <span>Scroll</span>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 overflow-x-auto scrollbar-thin relative">
                  {/* Scroll indicator at left */}
                  <div className="absolute top-0 left-0 bottom-0 w-4 bg-gradient-to-r from-white to-transparent pointer-events-none z-10"></div>
                  
                  {/* Legend */}
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-4 min-w-max">
                    <div className="text-[10px] font-bold text-gray-700 mb-2">Positions</div>
                    <div className="grid grid-cols-4 gap-1 text-[9px] text-gray-600">
                      <div><span className="font-semibold">BTN:</span> Button</div>
                      <div><span className="font-semibold">CO:</span> Cutoff</div>
                      <div><span className="font-semibold">HJ:</span> Hijack</div>
                      <div><span className="font-semibold">MP:</span> Mid Pos</div>
                      <div><span className="font-semibold">EP:</span> Early Pos</div>
                      <div><span className="font-semibold">UTG:</span> Under Gun</div>
                      <div><span className="font-semibold">SB:</span> Small Blind</div>
                      <div><span className="font-semibold">BB:</span> Big Blind</div>
                    </div>
                  </div>
                  
                  {/* Position vs Position Grid */}
                  <div className="flex gap-2 pb-4 min-w-max">
                  {['BB', 'SB', 'BTN', 'CO', 'HJ', 'MP', 'EP', 'UTG'].map((heroPosition) => (
                    <div key={heroPosition} className="bg-gray-50 border border-gray-200 rounded-lg p-3 flex-shrink-0 w-48">
                      <div className="text-[10px] font-bold text-gray-700 mb-2 text-center">{heroPosition} vs All</div>
                      <div className="h-32 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <ScatterChart
                            margin={{ top: 5, right: 5, bottom: 5, left: 5 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                            <XAxis 
                              type="number" 
                              dataKey="x"
                              domain={[0, 1]}
                              tick={false}
                              stroke="#9ca3af"
                              hide={true}
                            />
                            <YAxis 
                              type="number" 
                              dataKey="winrate"
                              domain={[-50, 50]}
                              ticks={[-50, -25, 0, 25, 50]}
                              tick={{ fontSize: 9 }}
                              stroke="#9ca3af"
                              width={30}
                            />
                            <Tooltip 
                              contentStyle={{ 
                                backgroundColor: '#ffffff',
                                border: '1px solid #e5e7eb',
                                borderRadius: '6px',
                                padding: '6px',
                                fontSize: '11px'
                              }}
                              formatter={(value: number, name: string, props: any) => [
                                `${value > 0 ? '+' : ''}${value.toFixed(1)} bb/100`,
                                `vs ${props.payload.villain}`
                              ]}
                            />
                            <ZAxis range={[50, 50]} />
                            <Scatter 
                              data={(() => {
                                // All possible villain positions
                                const allPositions = ['BB', 'SB', 'BTN', 'CO', 'HJ', 'MP', 'EP', 'UTG'];
                                const villainPositions = allPositions.filter(p => p !== heroPosition);
                                
                                // Position strength for realistic data
                                const positionStrength: Record<string, number> = {
                                  'BTN': 20, 'CO': 15, 'HJ': 10, 'MP': 5, 
                                  'EP': 0, 'UTG': -5, 'SB': -8, 'BB': -10
                                };
                                
                                const heroStrength = positionStrength[heroPosition] || 0;
                                
                                return villainPositions.map((villain) => {
                                  const villainStrength = positionStrength[villain] || 0;
                                  // Hero vs Villain advantage
                                  const baseWinrate = heroStrength - villainStrength;
                                  const variance = 8;
                                  const winrate = baseWinrate + (Math.random() * variance * 2 - variance);
                                  
                                  // Calculate color based on winrate (gradient from red to green)
                                  const getColor = (wr: number) => {
                                    if (wr >= 20) return '#10b981'; // green-500
                                    if (wr >= 10) return '#22c55e'; // green-400
                                    if (wr >= 5) return '#84cc16'; // lime-500
                                    if (wr >= 0) return '#eab308'; // yellow-500
                                    if (wr >= -5) return '#f97316'; // orange-500
                                    if (wr >= -10) return '#f87171'; // red-400
                                    return '#ef4444'; // red-500
                                  };
                                  
                                  return {
                                    villain,
                                    x: 0.5 + (Math.random() * 0.1 - 0.05), // Slight horizontal jitter
                                    winrate,
                                    fill: getColor(winrate)
                                  };
                                });
                              })()}
                              shape={(props: any) => {
                                const { cx, cy, fill } = props;
                                return (
                                  <circle
                                    cx={cx}
                                    cy={cy}
                                    r={4}
                                    fill={fill}
                                    opacity={0.8}
                                  />
                                );
                              }}
                            />
                          </ScatterChart>
                        </ResponsiveContainer>
                      </div>
                      {/* Average winrate vs all positions */}
                      <div className="text-center mt-2 pt-2 border-t border-gray-200">
                        <div className="text-[9px] text-gray-500">Avg vs All</div>
                        <div className="text-xs font-bold text-gray-900">
                          {(() => {
                            const posStrength: Record<string, number> = {
                              'BTN': 12, 'CO': 8, 'HJ': 5, 'MP': 2, 
                              'EP': -1, 'UTG': -3, 'SB': -6, 'BB': -8
                            };
                            const avg = posStrength[heroPosition] || 0;
                            return `${avg > 0 ? '+' : ''}${avg.toFixed(1)} bb/100`;
                          })()}
                        </div>
                      </div>
                    </div>
                  ))}
                  </div>
                  
                  {/* Scroll indicator at right */}
                  <div className="absolute top-0 right-0 bottom-0 w-4 bg-gradient-to-l from-white to-transparent pointer-events-none"></div>
                </div>
              </div>
            </div>

            {/* Start Session CTA */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-4 border-2 border-blue-500">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white text-base font-bold mb-1">Ready to Play?</h3>
                  <p className="text-blue-100 text-xs">Start a new session to track your performance</p>
                </div>
                <button
                  onClick={startSession}
                  className="bg-white hover:bg-gray-50 text-blue-600 font-bold px-5 py-2.5 rounded-lg transition-all flex items-center gap-2 text-sm"
                >
                  <PlayCircle className="w-4 h-4" />
                  Start Session
                </button>
              </div>
            </div>

            {/* Sessions Table */}
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Session History</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-3 py-2.5 text-left text-[10px] font-bold text-gray-600 uppercase tracking-wide">Date</th>
                      <th className="px-3 py-2.5 text-left text-[10px] font-bold text-gray-600 uppercase tracking-wide">Duration</th>
                      <th className="px-3 py-2.5 text-left text-[10px] font-bold text-gray-600 uppercase tracking-wide">Hands</th>
                      <th className="px-3 py-2.5 text-left text-[10px] font-bold text-gray-600 uppercase tracking-wide">P/L</th>
                      <th className="px-3 py-2.5 text-left text-[10px] font-bold text-gray-600 uppercase tracking-wide">Balance</th>
                      <th className="px-3 py-2.5 text-left text-[10px] font-bold text-gray-600 uppercase tracking-wide">ROI</th>
                      <th className="px-3 py-2.5 text-left text-[10px] font-bold text-gray-600 uppercase tracking-wide">Win/Loss</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {sessionHistory.map((session) => {
                      const sessionProfit = session.profitLoss >= 0;
                      const roi = ((session.profitLoss / session.buyIn) * 100).toFixed(1);
                      
                      return (
                        <tr key={session.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-3 py-2.5">
                            <div className="flex items-center gap-1.5 text-gray-500 text-xs">
                              <Calendar className="w-3.5 h-3.5" />
                              {formatDate(session.date)}
                            </div>
                          </td>
                          <td className="px-3 py-2.5">
                            <div className="text-xs font-semibold text-gray-900">{formatTime(session.duration)}</div>
                          </td>
                          <td className="px-3 py-2.5">
                            <div className="text-xs font-semibold text-gray-900">{session.handsPlayed}</div>
                          </td>
                          <td className="px-3 py-2.5">
                            <div className={`text-sm font-bold ${sessionProfit ? 'text-green-600' : 'text-red-600'}`}>
                              {formatPL(session.profitLoss)}
                            </div>
                          </td>
                          <td className="px-3 py-2.5">
                            <div className="text-xs font-semibold text-gray-900">${session.buyIn}</div>
                          </td>
                          <td className="px-3 py-2.5">
                            <div className={`text-xs font-bold ${parseFloat(roi) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {roi}%
                            </div>
                          </td>
                          <td className="px-3 py-2.5">
                            <div className="space-y-0.5">
                              <div className="flex items-center gap-1 text-[10px]">
                                <span className="text-gray-500">W:</span>
                                <span className="text-green-600 font-bold">${session.biggestWin}</span>
                              </div>
                              <div className="flex items-center gap-1 text-[10px]">
                                <span className="text-gray-500">L:</span>
                                <span className="text-red-600 font-bold">${Math.abs(session.biggestLoss)}</span>
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
                <div className="text-center py-8 text-gray-400">
                  <History className="w-10 h-10 mx-auto mb-2 text-gray-300" />
                  <p className="text-xs">No sessions yet. Start your first session above!</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column (30%) - Stakes Roadmap & Hand Range Heatmap */}
          <div className="lg:col-span-3 space-y-3">
            {/* Stakes Progression Timeline */}
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-gray-600" />
                  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Stakes Roadmap</h3>
                  <UITooltip>
                    <TooltipTrigger asChild>
                      <button className="inline-flex items-center justify-center">
                        <Info className="w-3.5 h-3.5 text-gray-400 hover:text-gray-600 transition-colors" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="max-w-xs">
                      <p className="text-xs">Projections are based on the player's historical data and AI predictions</p>
                    </TooltipContent>
                  </UITooltip>
                </div>
              </div>
              
              <div className="p-3">
                {/* Current Stakes Info */}
                <div className="text-center mb-3 pb-3 border-b border-gray-200">
                  <div className="text-[9px] text-gray-400 mb-0.5">Current Stakes</div>
                  <div className="text-lg font-bold text-gray-900">NL50</div>
                  <div className="text-[9px] text-gray-500">$3,050 bankroll</div>
                </div>

                {/* Timeline */}
                <div className="relative">
                  {/* Timeline Line */}
                  <div className="absolute left-[11px] top-0 bottom-0 w-px bg-gray-200"></div>
                  
                  {/* Timeline Items */}
                  <div className="space-y-2.5">
                    {/* Move Down Threshold */}
                    <div className="relative flex items-start gap-2.5">
                      <div className="w-6 h-6 rounded-full bg-gray-100 border border-gray-300 flex items-center justify-center flex-shrink-0 z-10">
                        <TrendingDown className="w-3 h-3 text-gray-500" />
                      </div>
                      <div className="flex-1 bg-gray-50 border border-gray-200 rounded p-2">
                        <div className="mb-0.5">
                          <div className="font-semibold text-[10px] text-gray-700">NL25</div>
                          <div className="text-[9px] text-gray-500">$2,000 bankroll</div>
                        </div>
                        <div className="text-[8px] text-gray-500">
                          $1,050 above threshold
                        </div>
                      </div>
                    </div>

                    {/* Current Position */}
                    <div className="relative flex items-start gap-2.5">
                      <div className="w-6 h-6 rounded-full bg-gray-700 border border-gray-800 flex items-center justify-center flex-shrink-0 z-10">
                        <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                      </div>
                      <div className="flex-1 bg-gray-700 border border-gray-800 rounded p-2">
                        <div className="mb-0.5">
                          <div className="font-semibold text-[10px] text-white">NL50 • Current</div>
                          <div className="text-[9px] text-gray-300">$3,050 bankroll</div>
                        </div>
                        <div className="flex items-center gap-1.5 text-[8px] text-gray-400">
                          <span>61 buy-ins</span>
                          <span>•</span>
                          <span>5.2 bb/100</span>
                        </div>
                      </div>
                    </div>

                    {/* Move Up Target */}
                    <div className="relative flex items-start gap-2.5">
                      <div className="w-6 h-6 rounded-full bg-gray-100 border border-gray-300 flex items-center justify-center flex-shrink-0 z-10">
                        <TrendingUp className="w-3 h-3 text-gray-500" />
                      </div>
                      <div className="flex-1 bg-gray-50 border border-gray-200 rounded p-2">
                        <div className="mb-0.5">
                          <div className="font-semibold text-[10px] text-gray-700">NL100 • Target</div>
                          <div className="text-[9px] text-gray-500">$5,000 bankroll</div>
                        </div>
                        <div className="text-[8px] text-gray-500">
                          $1,950 needed • 2-3 weeks
                        </div>
                      </div>
                    </div>

                    {/* Future Milestone */}
                    <div className="relative flex items-start gap-2.5">
                      <div className="w-6 h-6 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center flex-shrink-0 z-10">
                        <TrendingUp className="w-3 h-3 text-gray-400" />
                      </div>
                      <div className="flex-1 bg-gray-50 border border-gray-200 rounded p-2 opacity-50">
                        <div className="mb-0.5">
                          <div className="font-semibold text-[10px] text-gray-600">NL200</div>
                          <div className="text-[9px] text-gray-500">$10,000 bankroll</div>
                        </div>
                        <div className="text-[8px] text-gray-500">
                          2-3 months
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[8px] font-medium text-gray-500">Progress to NL100</span>
                    <span className="text-[8px] font-semibold text-gray-700">61%</span>
                  </div>
                  <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gray-600 rounded-full transition-all duration-500"
                      style={{ width: '61%' }}
                    ></div>
                  </div>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-1 gap-1.5 mt-3 pt-3 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="text-[8px] text-gray-500">Est. Sessions</span>
                    <span className="text-[10px] font-semibold text-gray-700">12-15</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[8px] text-gray-500">Safety Buffer</span>
                    <span className="text-[10px] font-semibold text-gray-700">21 BI</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[8px] text-gray-500">Win Rate</span>
                    <span className="text-[10px] font-semibold text-gray-700">5.2 bb/100</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Hand Range Heatmap Section */}
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Hand Performance</h3>
                    <p className="text-[10px] text-gray-500 mt-0.5">Color-coded by P/L</p>
                  </div>
                </div>
              </div>
              <div className="p-3">
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-gray-800 rounded"></div>
                    <span className="text-[9px] text-gray-600">High</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded"></div>
                    <span className="text-[9px] text-gray-600">Medium</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-gray-200 rounded"></div>
                    <span className="text-[9px] text-gray-600">Low</span>
                  </div>
                </div>

              {/* Poker Hand Grid (13x13) */}
              <div className="grid gap-1" style={{ gridTemplateColumns: 'repeat(13, minmax(0, 1fr))' }}>
                {(() => {
                  const ranks = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2'];
                  const handData: Record<string, number> = {
                    'AA': 450, 'KK': 380, 'QQ': 320, 'JJ': 280, 'TT': 210, '99': 180, '88': 150, '77': 120, '66': 90, '55': 60, '44': 30, '33': -10, '22': -20,
                    'AKs': 250, 'AQs': 200, 'AJs': 180, 'ATs': 150, 'A9s': 80, 'A8s': 50, 'A7s': 20, 'A6s': 10, 'A5s': 40, 'A4s': 30, 'A3s': 10, 'A2s': 0,
                    'AKo': 180, 'KQs': 170, 'KJs': 140, 'KTs': 110, 'K9s': 50, 'K8s': 20, 'K7s': -10, 'K6s': -20, 'K5s': -30, 'K4s': -40, 'K3s': -50, 'K2s': -60,
                    'AQo': 150, 'KQo': 120, 'QJs': 130, 'QTs': 100, 'Q9s': 40, 'Q8s': 10, 'Q7s': -20, 'Q6s': -30, 'Q5s': -40, 'Q4s': -50, 'Q3s': -60, 'Q2s': -70,
                    'AJo': 130, 'KJo': 90, 'QJo': 80, 'JTs': 110, 'J9s': 50, 'J8s': 20, 'J7s': -10, 'J6s': -30, 'J5s': -40, 'J4s': -50, 'J3s': -60, 'J2s': -70,
                    'ATo': 100, 'KTo': 70, 'QTo': 60, 'JTo': 80, 'T9s': 80, 'T8s': 50, 'T7s': 20, 'T6s': -10, 'T5s': -20, 'T4s': -40, 'T3s': -50, 'T2s': -60,
                    'A9o': 50, 'K9o': 30, 'Q9o': 20, 'J9o': 30, 'T9o': 50, '98s': 70, '97s': 40, '96s': 10, '95s': -10, '94s': -30, '93s': -40, '92s': -50,
                    'A8o': 30, 'K8o': 10, 'Q8o': 0, 'J8o': 10, 'T8o': 30, '98o': 40, '87s': 60, '86s': 30, '85s': 10, '84s': -20, '83s': -30, '82s': -40,
                    'A7o': 10, 'K7o': -10, 'Q7o': -20, 'J7o': -10, 'T7o': 10, '97o': 20, '87o': 30, '76s': 50, '75s': 30, '74s': 0, '73s': -20, '72s': -50,
                    'A6o': 0, 'K6o': -20, 'Q6o': -30, 'J6o': -20, 'T6o': -10, '96o': 0, '86o': 10, '76o': 20, '65s': 40, '64s': 20, '63s': -10, '62s': -40,
                    'A5o': 20, 'K5o': -30, 'Q5o': -40, 'J5o': -30, 'T5o': -20, '95o': -10, '85o': 0, '75o': 10, '65o': 20, '54s': 40, '53s': 10, '52s': -30,
                    'A4o': 10, 'K4o': -40, 'Q4o': -50, 'J4o': -40, 'T4o': -30, '94o': -20, '84o': -10, '74o': 0, '64o': 10, '54o': 20, '43s': 20, '42s': -20,
                    'A3o': 0, 'K3o': -50, 'Q3o': -60, 'J3o': -50, 'T3o': -40, '93o': -30, '83o': -20, '73o': -10, '63o': 0, '53o': 10, '43o': 10, '32s': 0
                  };

                  return ranks.map((rank1, i) => 
                    ranks.map((rank2, j) => {
                      let handLabel = '';
                      let handKey = '';
                      
                      if (i === j) {
                        // Pocket pairs (diagonal)
                        handLabel = `${rank1}${rank2}`;
                        handKey = handLabel;
                      } else if (i < j) {
                        // Suited hands (above diagonal)
                        handLabel = `${rank1}${rank2}s`;
                        handKey = handLabel;
                      } else {
                        // Offsuit hands (below diagonal)
                        handLabel = `${rank2}${rank1}o`;
                        handKey = handLabel;
                      }

                      const plValue = handData[handKey] || 0;
                      
                      // Determine background color based on P/L - Neutral grayscale
                      let bgColor = '';
                      let textColor = 'text-white';
                      
                      if (plValue > 150) {
                        bgColor = 'bg-gray-900';
                      } else if (plValue > 50) {
                        bgColor = 'bg-gray-800';
                      } else if (plValue > 0) {
                        bgColor = 'bg-gray-700';
                      } else if (plValue === 0) {
                        bgColor = 'bg-gray-400';
                      } else if (plValue > -50) {
                        bgColor = 'bg-gray-300';
                        textColor = 'text-gray-700';
                      } else if (plValue > -100) {
                        bgColor = 'bg-gray-200';
                        textColor = 'text-gray-700';
                      } else {
                        bgColor = 'bg-gray-100';
                        textColor = 'text-gray-700';
                      }

                      return (
                        <div
                          key={`${i}-${j}`}
                          className={`${bgColor} ${textColor} aspect-square flex flex-col items-center justify-center rounded text-[10px] font-bold hover:scale-110 transition-transform cursor-pointer relative group`}
                        >
                          <span>{handLabel}</span>
                          {/* Tooltip */}
                          <div className="absolute bottom-full mb-2 hidden group-hover:block bg-gray-900 text-white text-xs rounded py-1 px-2 whitespace-nowrap z-10">
                            {handLabel}: {plValue >= 0 ? '+' : ''}{plValue > 0 ? `$${plValue}` : plValue === 0 ? '$0' : `-$${Math.abs(plValue)}`}
                          </div>
                        </div>
                      );
                    })
                  );
                })()}
              </div>

              <div className="mt-3 text-[10px] text-gray-500 text-center">
                <p>Hover for P/L • s=suited, o=offsuit</p>
              </div>

              {/* Hand Range Stats Summary - Inside Hand Performance Section */}
              <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-gray-200">
                <div className="text-center">
                  <div className="text-[9px] font-medium text-gray-500 uppercase tracking-wide mb-1">Best</div>
                  <div className="text-base font-bold text-gray-900">AA</div>
                  <div className="text-[9px] text-gray-500">+$450</div>
                </div>
                
                <div className="text-center">
                  <div className="text-[9px] font-medium text-gray-500 uppercase tracking-wide mb-1">Worst</div>
                  <div className="text-base font-bold text-gray-900">72o</div>
                  <div className="text-[9px] text-gray-500">-$50</div>
                </div>
                
                <div className="text-center">
                  <div className="text-[9px] font-medium text-gray-500 uppercase tracking-wide mb-1">Hands</div>
                  <div className="text-base font-bold text-gray-900">169</div>
                  <div className="text-[9px] text-gray-500">combos</div>
                </div>
              </div>
            </div>
            </div>
            </div>
            </div>
          </TabsContent>

          <TabsContent value="operations" className="mt-6 flex flex-col h-[calc(100vh-280px)]">
            {/* Operations Table */}
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden flex flex-col flex-1">
              <div className="px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100 flex-shrink-0">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Operations History</h3>
              </div>
              <div 
                ref={operationsScrollRef}
                onScroll={handleOperationsScroll}
                className="overflow-x-auto overflow-y-auto flex-1"
              >
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide bg-gray-50">Type</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide bg-gray-50">Date</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide bg-gray-50">Amount</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide bg-gray-50">Transactions</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide bg-gray-50">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {operations.map((operation) => {
                      const getOperationIcon = (type: string) => {
                        switch (type) {
                          case 'Deposit': return <ArrowDownRight className="w-4 h-4 text-gray-700" />;
                          case 'Withdrawal': return <ArrowUpRight className="w-4 h-4 text-gray-700" />;
                          case 'Split': return <Split className="w-4 h-4 text-gray-700" />;
                          case 'Swap': return <Repeat2 className="w-4 h-4 text-gray-700" />;
                          default: return <ArrowLeftRight className="w-4 h-4 text-gray-700" />;
                        }
                      };

                      const getWalletIcon = (type: string, name: string) => {
                        if (type === 'external') {
                          if (name.includes('Bank') || name.includes('Wire')) {
                            return (
                              <div className="w-5 h-5 bg-gray-100 rounded flex items-center justify-center">
                                <DollarSign className="w-3 h-3 text-gray-600" />
                              </div>
                            );
                          }
                          if (name.includes('Card')) {
                            return (
                              <div className="w-5 h-5 bg-gray-100 rounded flex items-center justify-center">
                                <CreditCard className="w-3 h-3 text-gray-600" />
                              </div>
                            );
                          }
                        }
                        if (type === 'wallet') {
                          return (
                            <div className="w-5 h-5 bg-blue-100 rounded flex items-center justify-center">
                              <Wallet className="w-3 h-3 text-blue-600" />
                            </div>
                          );
                        }
                        if (type === 'profit') {
                          return (
                            <div className="w-5 h-5 bg-purple-100 rounded flex items-center justify-center">
                              <DollarSign className="w-3 h-3 text-purple-600" />
                            </div>
                          );
                        }
                        if (type === 'player') {
                          return (
                            <div className="w-5 h-5 bg-blue-100 rounded flex items-center justify-center">
                              <Users className="w-3 h-3 text-blue-600" />
                            </div>
                          );
                        }
                        if (type === 'house') {
                          return (
                            <div className="w-5 h-5 bg-gray-100 rounded flex items-center justify-center">
                              <DollarSign className="w-3 h-3 text-gray-600" />
                            </div>
                          );
                        }
                        if (type === 'platform') {
                          if (name === 'PokerStars') {
                            return (
                              <div className="w-5 h-5 bg-red-100 rounded flex items-center justify-center">
                                <span className="text-[8px] font-bold text-red-600">PS</span>
                              </div>
                            );
                          }
                          if (name === 'GGPoker') {
                            return (
                              <div className="w-5 h-5 bg-orange-100 rounded flex items-center justify-center">
                                <span className="text-[8px] font-bold text-orange-600">GG</span>
                              </div>
                            );
                          }
                          if (name === '888Poker') {
                            return (
                              <div className="w-5 h-5 bg-green-100 rounded flex items-center justify-center">
                                <span className="text-[8px] font-bold text-green-600">888</span>
                              </div>
                            );
                          }
                          if (name === 'PartyPoker') {
                            return (
                              <div className="w-5 h-5 bg-purple-100 rounded flex items-center justify-center">
                                <span className="text-[8px] font-bold text-purple-600">PP</span>
                              </div>
                            );
                          }
                        }
                        return (
                          <div className="w-5 h-5 bg-gray-100 rounded flex items-center justify-center">
                            <Wallet className="w-3 h-3 text-gray-600" />
                          </div>
                        );
                      };

                      const formatDate = (date: Date) => {
                        return date.toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric',
                          year: 'numeric'
                        });
                      };

                      const formatTime = (date: Date) => {
                        return date.toLocaleTimeString('en-US', { 
                          hour: '2-digit',
                          minute: '2-digit'
                        });
                      };

                      const isExpanded = expandedOperations.has(operation.id);
                      
                      return (
                        <>
                          <tr 
                            key={operation.id} 
                            onClick={() => toggleOperation(operation.id)}
                            className="hover:bg-gray-50 transition-colors cursor-pointer"
                          >
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <div className="flex-shrink-0">
                                  <ChevronRight 
                                    className={`w-4 h-4 text-gray-400 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                                  />
                                </div>
                                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                                  {getOperationIcon(operation.type)}
                                </div>
                                <div>
                                  <div className="text-sm font-semibold text-gray-900">{operation.type}</div>
                                  <div className="text-xs text-gray-500">{operation.id}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <div className="text-sm text-gray-900">{formatDate(operation.date)}</div>
                              <div className="text-xs text-gray-500">{formatTime(operation.date)}</div>
                            </td>
                            <td className="px-4 py-3">
                              <div className="text-sm font-bold text-gray-900">
                                {operation.type === 'Withdrawal' ? '-' : operation.type === 'Deposit' ? '+' : ''}${operation.amount.toLocaleString()}
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <div className="text-sm text-gray-900">{operation.transactions.length} transaction{operation.transactions.length !== 1 ? 's' : ''}</div>
                            </td>
                            <td className="px-4 py-3">
                              <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-700 bg-gray-50 px-2 py-1 rounded border border-gray-200">
                                <CheckCircle className="w-3 h-3" />
                                {operation.status}
                              </span>
                            </td>
                          </tr>
                          
                          {/* Sub-transactions - Only show when expanded */}
                          {isExpanded && (
                            <tr className="bg-gray-50">
                              <td colSpan={5} className="px-4 py-0">
                                <div className="pl-12 py-2 space-y-1">
                                  {operation.transactions.map((tx: any, txIndex: number) => (
                                    <div key={txIndex} className="flex items-center justify-between py-1.5 px-3 bg-white rounded border border-gray-200">
                                      <div className="flex items-center gap-2">
                                        {getWalletIcon(tx.fromType, tx.from)}
                                        <span className="text-xs text-gray-600">{tx.from}</span>
                                        <span className="text-xs text-gray-400">→</span>
                                        {getWalletIcon(tx.toType, tx.to)}
                                        <span className="text-xs text-gray-600">{tx.to}</span>
                                      </div>
                                      <span className="text-xs font-semibold text-gray-900">${tx.amount.toLocaleString()}</span>
                                    </div>
                                  ))}
                                </div>
                              </td>
                            </tr>
                          )}
                        </>
                      );
                    })}
                    
                    {/* Loading indicator */}
                    {isLoadingOperations && (
                      <tr>
                        <td colSpan={5} className="px-4 py-8 text-center">
                          <div className="flex items-center justify-center gap-2 text-gray-500">
                            <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
                            <span className="text-sm">Loading more operations...</span>
                          </div>
                        </td>
                      </tr>
                    )}
                    
                    {/* End of list indicator */}
                    {!hasMoreOperations && operations.length > 0 && (
                      <tr>
                        <td colSpan={5} className="px-4 py-6 text-center">
                          <span className="text-xs text-gray-400">No more operations to load</span>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-0 relative">
      {renderAiModal()}
      
      <div className={`space-y-6 p-6 transition-all duration-300 ${showAiModal ? 'opacity-50' : 'opacity-100'}`}>
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

        {/* P/L & EV Graph */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Session Performance</h3>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                <span className="text-xs text-gray-600">Actual P/L</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                <span className="text-xs text-gray-600">EV</span>
              </div>
            </div>
          </div>
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
                formatter={(value: number, name: string) => [`$${value.toLocaleString()}`, name === 'pl' ? 'Actual P/L' : 'EV']}
              />
              <Line
                type="monotone"
                dataKey="pl"
                name="pl"
                stroke="#10b981"
                strokeWidth={2}
                dot={{ r: 3, fill: '#10b981' }}
                activeDot={{ r: 5 }}
              />
              <Line
                type="monotone"
                dataKey="ev"
                name="ev"
                stroke="#3b82f6"
                strokeWidth={2}
                strokeDasharray="5 5"
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
    </div>
  );
}
