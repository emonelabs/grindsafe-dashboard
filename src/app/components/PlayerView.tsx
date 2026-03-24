import { useState, useEffect, useRef, useCallback } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ScatterChart, Scatter, ZAxis } from 'recharts';
import { Clock, TrendingUp, TrendingDown, Video, Play, Square, PlayCircle, StopCircle, History, Calendar, Users, Wallet, DollarSign, CreditCard, ArrowUpRight, ArrowDownRight, ChevronDown, ChevronRight, MoreVertical, Grid3x3, Search, Send, Sparkles, Split, Repeat2, Command, Info, ArrowLeftRight, CircleDollarSign, CheckCircle, Upload, FileText, Shield, ExternalLink, Trash, MessageCircle } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/tabs';
import { Tooltip as UITooltip, TooltipTrigger, TooltipContent } from './ui/tooltip';
import SlideInPanel from './SlideInPanel';
import DepositForm from './forms/DepositForm';
import WithdrawalForm from './forms/WithdrawalForm';
import SplitForm from './forms/SplitForm';
import SwapForm from './forms/SwapForm';
import HandHistoryForm from './forms/HandHistoryForm';
import PaymentWalletForm, { PaymentWallet } from './forms/PokerWalletForm';
import { PaymentWalletsContent } from './PokerWalletsContent';
import PokerAccountForm, { PokerAccount } from './forms/PokerAccountForm';
import { PokerAccountsContent } from './PokerAccountsContent';
import { PlayerHandHistory } from './PlayerHandHistory';
import LegalDocumentForm, { LegalDocument } from './forms/LegalDocumentForm';
import { LegalDocumentsContent } from './LegalDocumentsContent';
import { DrillDownAnalytics } from './DrillDownAnalytics';
import { HandReplayer, Hand } from './HandReplayer';
import { WalletIcon } from './WalletIcon';
import { PokerWalletIcon } from './PokerWalletIcon';
import { walletImages } from '../constants/walletImages';

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

interface PokerAccount {
  id: string;
  platform: string;
  platformColor: string;
  chartColor: string;
  status: 'active' | 'inactive' | 'restricted';
  makeup: number;
  balance: number;
  deposits: number;
  totalPL: number;
  nickname: string;
  ulid?: string;
}

interface AccountDataPoint {
  date: string;
  value: number;
}

interface Conversation {
  id: string;
  title: string;
  messages: Array<{role: 'user' | 'assistant', content: string}>;
  createdAt: Date;
  updatedAt: Date;
}

interface Hand {
  id: string;
  timestamp: Date;
  action: 'win' | 'loss' | 'fold';
  amount: number;
  cards?: string[];
  flop?: string[];
  turn?: string;
  river?: string;
  pot: number;
  position: string;
  reconciled: boolean;
}

export function PlayerView() {
  // Mock player data
  const currentPlayer = {
    name: 'Marcus Chen',
    avatar: 'https://images.unsplash.com/photo-1674644674031-b49db824edbc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
    team: 'High Rollers'
  };

  const [activeTab, setActiveTab] = useState('analytics');
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [activeSlideIn, setActiveSlideIn] = useState<'deposit' | 'withdrawal' | 'split' | 'swap' | 'handhistory' | 'accountdetails' | 'paymentwallet' | 'pokeraccount' | 'legaldocument' | 'addtournament' | null>(null);
  const [selectedHandForReplay, setSelectedHandForReplay] = useState<Hand | null>(null);
  const [aiQuery, setAiQuery] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [showAiModal, setShowAiModal] = useState(false);
  const aiInputRef = useRef<HTMLInputElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  
  // AI Conversation state
  const [conversations, setConversations] = useState<Conversation[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('ai_conversations');
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.map((c: any) => ({
          ...c,
          createdAt: new Date(c.createdAt),
          updatedAt: new Date(c.updatedAt)
        }));
      }
    }
    return [];
  });
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [showConversationList, setShowConversationList] = useState(true);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [uploadedHands, setUploadedHands] = useState<Hand[]>([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [isProcessingUpload, setIsProcessingUpload] = useState(false);
  
  // Initialize session state from localStorage
  const [sessionActive, setSessionActive] = useState(() => {
    const saved = localStorage.getItem('activeSession');
    return saved ? JSON.parse(saved).isActive : false;
  });
  const [sessionTime, setSessionTime] = useState(() => {
    const saved = localStorage.getItem('activeSession');
    return saved ? JSON.parse(saved).time : 0;
  });
  const [currentPL, setCurrentPL] = useState(() => {
    const saved = localStorage.getItem('activeSession');
    return saved ? JSON.parse(saved).pl : 0;
  });
  const [currentEV, setCurrentEV] = useState(() => {
    const saved = localStorage.getItem('activeSession');
    return saved ? JSON.parse(saved).ev : 0;
  });
  const [sessionData, setSessionData] = useState<SessionData[]>(() => {
    const saved = localStorage.getItem('activeSession');
    return saved ? JSON.parse(saved).data : [];
  });
  const [buyIn, setBuyIn] = useState(() => {
    const saved = localStorage.getItem('activeSession');
    return saved ? JSON.parse(saved).buyIn : 500;
  });
  const [biggestWin, setBiggestWin] = useState(() => {
    const saved = localStorage.getItem('activeSession');
    return saved ? JSON.parse(saved).biggestWin : 0;
  });
  const [biggestLoss, setBiggestLoss] = useState(() => {
    const saved = localStorage.getItem('activeSession');
    return saved ? JSON.parse(saved).biggestLoss : 0;
  });
  const [liveSessionView, setLiveSessionView] = useState<'overview' | 'cash' | 'tournaments'>('overview');
  const [tournamentEntries, setTournamentEntries] = useState<Array<{
    id: string;
    accountId: string;
    accountName: string;
    buyIn: number;
    rake: number;
    timestamp: Date;
  }>>([]);
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

  // Poker accounts state
  const [pokerAccounts] = useState<PokerAccount[]>([
    {
      id: '1',
      platform: 'PokerStars',
      platformColor: 'bg-red-500',
      chartColor: '#ef4444',
      status: 'active',
      makeup: -450,
      balance: 3250,
      deposits: 5000,
      totalPL: -1750
    },
    {
      id: '2',
      platform: 'GGPoker',
      platformColor: 'bg-blue-500',
      chartColor: '#3b82f6',
      status: 'active',
      makeup: 0,
      balance: 1850,
      deposits: 2000,
      totalPL: -150
    },
    {
      id: '3',
      platform: '888Poker',
      platformColor: 'bg-green-500',
      chartColor: '#22c55e',
      status: 'inactive',
      makeup: -120,
      balance: 450,
      deposits: 1000,
      totalPL: -550
    },
    {
      id: '4',
      platform: 'PartyPoker',
      platformColor: 'bg-purple-500',
      chartColor: '#a855f7',
      status: 'active',
      makeup: -80,
      balance: 920,
      deposits: 1500,
      totalPL: -580
    }
  ]);

  const [accountPerformanceData, setAccountPerformanceData] = useState<Record<string, AccountDataPoint[]>>({});
  const [selectedAccount, setSelectedAccount] = useState<PokerAccount | null>(null);

  // Operations state for infinite scroll
  const [operations, setOperations] = useState<any[]>([]);
  const [operationsPage, setOperationsPage] = useState(1);
  const [isLoadingOperations, setIsLoadingOperations] = useState(false);
  const [hasMoreOperations, setHasMoreOperations] = useState(true);
  const [expandedOperations, setExpandedOperations] = useState<Set<string>>(new Set());
  const operationsScrollRef = useRef<HTMLDivElement>(null);

  // Reconciliation state
  const [reconciliationItems, setReconciliationItems] = useState<any[]>([]);

  const updateReconciliationItems = useCallback(() => {
    const items: any[] = [];
    operations.forEach((op) => {
      op.transactions.forEach((tx: any, txIndex: number) => {
        let shouldShow = false;
        let buttonType: 'confirm' | 'pay' = 'confirm';
        
        // Deposit: show transaction going TO poker site
        if (op.type === 'Deposit' && tx.toType === 'poker_site') {
          shouldShow = true;
          buttonType = 'confirm';
        }
        // Withdrawal: show transaction going TO player wallet
        else if (op.type === 'Withdrawal' && tx.toType === 'player_financial') {
          shouldShow = true;
          buttonType = 'confirm';
        }
        // Split: show transaction going TO house account
        else if (op.type === 'Split' && tx.toType === 'house_account') {
          shouldShow = true;
          buttonType = 'pay';
        }
        // Swap: no reconciliation needed
        
        if (shouldShow && tx.status === 'pending') {
          items.push({
            opId: op.id,
            opType: op.type,
            txIndex,
            amount: tx.amount,
            from: tx.from,
            fromType: tx.fromType,
            to: tx.to,
            toType: tx.toType,
            owner: tx.owner,
            status: tx.status,
            date: op.date,
            nickname: tx.nickname,
            buttonType
          });
        }
      });
    });
    setReconciliationItems(items);
  }, [operations]);

  const approveTransaction = useCallback((opId: string, txIndex: number) => {
    setOperations(prev => prev.map(op => {
      if (op.id === opId) {
        const updatedTransactions = [...op.transactions];
        updatedTransactions[txIndex] = {
          ...updatedTransactions[txIndex],
          status: 'confirmed'
        };
        const getOpStatus = (txs: any[]) => {
          const statuses = txs.map(tx => tx.status);
          if (statuses.some(s => s === 'pending')) return 'Pending';
          if (statuses.some(s => s === 'failed')) return 'Failed';
          return 'Completed';
        };
        return { ...op, transactions: updatedTransactions, status: getOpStatus(updatedTransactions) };
      }
      return op;
    }));
    setReconciliationItems(prev => prev.filter(item => !(item.opId === opId && item.txIndex === txIndex)));
  }, []);

  const rejectTransaction = useCallback((opId: string, txIndex: number) => {
    setOperations(prev => prev.map(op => {
      if (op.id === opId) {
        const updatedTransactions = [...op.transactions];
        updatedTransactions[txIndex] = {
          ...updatedTransactions[txIndex],
          status: 'failed'
        };
        const getOpStatus = (txs: any[]) => {
          const statuses = txs.map(tx => tx.status);
          if (statuses.some(s => s === 'pending')) return 'Pending';
          if (statuses.some(s => s === 'failed')) return 'Failed';
          return 'Completed';
        };
        return { ...op, transactions: updatedTransactions, status: getOpStatus(updatedTransactions) };
      }
      return op;
    }));
    setReconciliationItems(prev => prev.filter(item => !(item.opId === opId && item.txIndex === txIndex)));
  }, []);

  // Payment Wallets state
  const [paymentWallets, setPaymentWallets] = useState<PaymentWallet[]>([
    {
      id: 'w1',
      provider: 'Skrill',
      username: 'marcus_skrill',
      email: 'marcus.chen@example.com',
      balance: 5420.50,
      status: 'active',
      createdAt: new Date('2026-03-01'),
      notes: 'Main payment account',
      ulid: '01ARZ3NDEKTSV4RRFFQ69G5FAV'
    },
    {
      id: 'w2',
      provider: 'Neteller',
      username: 'marcus_neteller',
      email: 'marcus.chen@example.com',
      balance: 2150.00,
      status: 'active',
      createdAt: new Date('2026-02-28'),
      ulid: '01ARZ3NDEKTSV4RRFFQ69G5FBW'
    },
    {
      id: 'w3',
      provider: 'Pix',
      username: '+55-11-98765-4321',
      email: 'marcus@pix.com',
      balance: 0.00,
      status: 'inactive',
      createdAt: new Date('2026-02-15'),
      ulid: '01ARZ3NDEKTSV4RRFFQ69G5FCX'
    },
    {
      id: 'w4',
      provider: 'LuxonPay',
      username: 'marcus_luxon',
      email: 'marcus.alt@example.com',
      balance: 1875.25,
      status: 'active',
      createdAt: new Date('2026-01-10'),
      notes: 'Secondary payment method',
      ulid: '01ARZ3NDEKTSV4RRFFQ69G5FDY'
    }
  ]);
  const [selectedWalletForEdit, setSelectedWalletForEdit] = useState<PaymentWallet | null>(null);

  // Poker Room Accounts state
  const [pokerRoomAccounts, setPokerRoomAccounts] = useState<PokerAccount[]>([
    {
      id: 'a1',
      pokerRoom: 'PokerStars',
      nickname: 'MarcusPS',
      email: 'marcus.chen@example.com',
      status: 'active',
      createdAt: new Date('2026-03-01'),
      notes: 'Main account for MTTs',
      ulid: '01ARZ3NDEKTSV4RRFFQ69G5GE0',
      platform: 'PokerStars',
      platformColor: '#FF0000',
      chartColor: '#FF0000',
      makeup: 0,
      balance: 5420,
      deposits: 10000,
      totalPL: 15420
    },
    {
      id: 'a2',
      pokerRoom: 'GGPoker',
      nickname: 'MarcusGG',
      email: 'marcus.chen@example.com',
      status: 'active',
      createdAt: new Date('2026-02-28'),
      ulid: '01ARZ3NDEKTSV4RRFFQ69G5GF1',
      platform: 'GGPoker',
      platformColor: '#FF6600',
      chartColor: '#FF6600',
      makeup: 0,
      balance: 3200,
      deposits: 8000,
      totalPL: 8750
    },
    {
      id: 'a3',
      pokerRoom: 'PartyPoker',
      nickname: 'Marcus_Party',
      email: 'marcus@party.com',
      status: 'inactive',
      createdAt: new Date('2026-02-15'),
      notes: 'Cash games only',
      ulid: '01ARZ3NDEKTSV4RRFFQ69G5GG2',
      platform: 'PartyPoker',
      platformColor: '#FF0000',
      chartColor: '#FF0000',
      makeup: 500,
      balance: 1200,
      deposits: 5000,
      totalPL: 2100
    }
  ]);
  const [selectedAccountForEdit, setSelectedAccountForEdit] = useState<PokerAccount | null>(null);

  // Legal Documents state
  const [legalDocuments, setLegalDocuments] = useState<LegalDocument[]>([
    {
      id: 'd1',
      title: 'National ID - Marcus Chen',
      type: 'ID Front',
      fileUrl: 'https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?w=800&h=600&fit=crop',
      fileSize: '1.8 MB',
      status: 'active',
      uploadedAt: new Date('2026-01-15'),
      notes: 'Valid until 2030'
    },
    {
      id: 'd2',
      title: 'National ID - Back Side',
      type: 'ID Back',
      fileUrl: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=800&h=600&fit=crop',
      fileSize: '1.5 MB',
      status: 'active',
      uploadedAt: new Date('2026-01-15')
    },
    {
      id: 'd3',
      title: 'Passport - Marcus Chen',
      type: 'Passport',
      fileUrl: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=800&h=600&fit=crop',
      fileSize: '2.2 MB',
      status: 'active',
      uploadedAt: new Date('2026-01-10'),
      notes: 'Valid until 2028'
    },
    {
      id: 'd4',
      title: 'Drivers License',
      type: 'Drivers License',
      fileUrl: 'https://images.unsplash.com/photo-1554224311-beee2ece8c1a?w=800&h=600&fit=crop',
      fileSize: '1.1 MB',
      status: 'expired',
      uploadedAt: new Date('2023-01-01'),
      notes: 'Expired - renewal pending'
    }
  ]);
  const [selectedDocumentForEdit, setSelectedDocumentForEdit] = useState<LegalDocument | null>(null);

  // Generate mock operations
  const generateOperations = (page: number, count: number = 10) => {
    const types = ['Deposit', 'Withdrawal', 'Split', 'Swap'];
    const pokerSites = ['PokerStars', 'GGPoker', '888Poker', 'PartyPoker'];
    const playerFinancialWallets = ['Skrill', 'Neteller', 'Pix', 'LuxonPay'];
    const operations = [];
    
    const getOwnerFromTo = (to: string) => {
      const companyAccounts = ['Main Wallet', 'Bank Account', 'Credit Card'];
      return companyAccounts.includes(to) ? 'company' : 'player';
    };
    
    const getRandomStatus = () => {
      const rand = Math.random();
      if (rand < 0.7) return 'confirmed';
      if (rand < 0.9) return 'pending';
      return 'failed';
    };
    
    let hasConfirmPending = false;
    let hasPayPending = false;
    
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
      
      const randomPokerSite = pokerSites[Math.floor(Math.random() * pokerSites.length)];
      const randomPlayerWallet = playerFinancialWallets[Math.floor(Math.random() * playerFinancialWallets.length)];
      const nickname = currentPlayer.name.split(' ')[0] + 'PS';
      
      // Force pending status for specific conditions on page 1
      const forceConfirmPending = page === 1 && !hasConfirmPending && (i === 0 || i === 1);
      const forcePayPending = page === 1 && !hasPayPending && (type === 'Split' || (i > 1 && i === 2));
      
      if (type === 'Deposit') {
        const txAmount = Math.floor(Math.random() * 2000) + 500;
        amount = txAmount;
        
        // First transaction: poker_site -> player_financial (needs confirm)
        const pokerSiteStatus = forceConfirmPending ? 'pending' : getRandomStatus();
        if (pokerSiteStatus === 'pending') hasConfirmPending = true;
        
        transactions.push({
          from: randomPokerSite,
          fromType: 'poker_site',
          to: randomPlayerWallet,
          toType: 'player_financial',
          amount: txAmount,
          owner: getOwnerFromTo(randomPlayerWallet),
          status: pokerSiteStatus,
          nickname: nickname
        });
        transactions.push({
          from: randomPlayerWallet,
          fromType: 'player_financial',
          to: 'Main Wallet',
          toType: 'company_wallet',
          amount: txAmount,
          owner: getOwnerFromTo('Main Wallet'),
          status: getRandomStatus()
        });
      } else if (type === 'Withdrawal') {
        const txAmount = Math.floor(Math.random() * 3000) + 500;
        amount = txAmount;
        
        // First transaction: company_wallet -> player_financial (needs confirm)
        const playerWalletStatus = forceConfirmPending && !hasConfirmPending ? 'pending' : getRandomStatus();
        if (playerWalletStatus === 'pending') hasConfirmPending = true;
        
        transactions.push({
          from: 'Main Wallet',
          fromType: 'company_wallet',
          to: randomPlayerWallet,
          toType: 'player_financial',
          amount: txAmount,
          owner: getOwnerFromTo(randomPlayerWallet),
          status: playerWalletStatus
        });
        transactions.push({
          from: randomPlayerWallet,
          fromType: 'player_financial',
          to: 'Bank Account',
          toType: 'external',
          amount: txAmount,
          owner: getOwnerFromTo('Bank Account'),
          status: getRandomStatus()
        });
      } else if (type === 'Split') {
        const profit = Math.floor(Math.random() * 4000) + 1000;
        amount = profit;
        const playerShare = Math.floor(profit * 0.5);
        const houseShare = profit - playerShare;
        
        transactions.push({
          from: randomPokerSite,
          fromType: 'poker_site',
          to: randomPlayerWallet,
          toType: 'player_financial',
          amount: profit,
          owner: getOwnerFromTo(randomPlayerWallet),
          status: getRandomStatus(),
          nickname: nickname
        });
        
        transactions.push({
          from: randomPlayerWallet,
          fromType: 'player_financial',
          to: 'Bank Account',
          toType: 'player_account',
          amount: playerShare,
          owner: getOwnerFromTo('Bank Account'),
          status: getRandomStatus()
        });
        
        // Third transaction: player_financial -> house_account (needs pay)
        const houseAccountStatus = forcePayPending ? 'pending' : getRandomStatus();
        if (houseAccountStatus === 'pending') hasPayPending = true;
        
        transactions.push({
          from: randomPlayerWallet,
          fromType: 'player_financial',
          to: 'Bank Account',
          toType: 'house_account',
          amount: houseShare,
          owner: getOwnerFromTo('Bank Account'),
          status: houseAccountStatus
        });
      } else if (type === 'Swap') {
        let fromWallet = playerFinancialWallets[Math.floor(Math.random() * playerFinancialWallets.length)];
        let toWallet = playerFinancialWallets[Math.floor(Math.random() * playerFinancialWallets.length)];
        while (toWallet === fromWallet) {
          toWallet = playerFinancialWallets[Math.floor(Math.random() * playerFinancialWallets.length)];
        }
        
        const txAmount = Math.floor(Math.random() * 1000) + 100;
        amount = txAmount;
        transactions.push({
          from: fromWallet,
          fromType: 'player_financial',
          to: toWallet,
          toType: 'player_financial',
          amount: txAmount,
          owner: getOwnerFromTo(toWallet),
          status: getRandomStatus()
        });
      }
      
      const getOperationStatus = (txs: any[]) => {
        const statuses = txs.map(tx => tx.status);
        if (statuses.some(s => s === 'pending')) return 'Pending';
        if (statuses.some(s => s === 'failed')) return 'Failed';
        return 'Completed';
      };
      
      operations.push({
        id: `OP-${opNumber.toString().padStart(6, '0')}`,
        type,
        date,
        amount,
        transactions,
        status: getOperationStatus(transactions)
      });
    }
    
    // Fallback: if still no confirm pending, force first operation to have pending
    if (!hasConfirmPending && operations.length > 0) {
      const firstOp = operations[0];
      if (firstOp.type === 'Deposit' || firstOp.type === 'Withdrawal') {
        const txIndex = firstOp.type === 'Deposit' ? 0 : 0;
        firstOp.transactions[txIndex].status = 'pending';
        firstOp.status = 'Pending';
      }
    }
    
    // Fallback: if still no pay pending, force a Split to have pending
    if (!hasPayPending && operations.length > 0) {
      const splitOp = operations.find(op => op.type === 'Split');
      if (splitOp) {
        // Find house_account transaction (last one in Split)
        const houseTxIndex = splitOp.transactions.findIndex(tx => tx.toType === 'house_account');
        if (houseTxIndex !== -1) {
          splitOp.transactions[houseTxIndex].status = 'pending';
          splitOp.status = 'Pending';
        }
      }
    }
    
    return operations;
  };

  // Initialize operations
  useEffect(() => {
    if ((activeTab === 'operations' || activeTab === 'overview') && operations.length === 0) {
      const initialOps = generateOperations(1, 15);
      setOperations(initialOps);
      // Expand only the first (latest) operation
      if (initialOps.length > 0) {
        setExpandedOperations(new Set([initialOps[0].id]));
      }
    }
  }, [activeTab]);

  // Update reconciliation items when operations change
  useEffect(() => {
    if (operations.length > 0) {
      updateReconciliationItems();
    }
  }, [operations, updateReconciliationItems]);

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

  // Payment Wallet handlers
  const handleAddWallet = () => {
    setSelectedWalletForEdit(null);
    setActiveSlideIn('paymentwallet');
  };

  const handleEditWallet = (wallet: PaymentWallet) => {
    setSelectedWalletForEdit(wallet);
    setActiveSlideIn('paymentwallet');
  };

  const handleDeleteWallet = (walletId: string) => {
    setPaymentWallets(prev => prev.filter(w => w.id !== walletId));
  };

  const handleWalletSubmit = (walletData: Omit<PaymentWallet, 'id' | 'createdAt'>) => {
    if (selectedWalletForEdit) {
      // Edit existing wallet
      setPaymentWallets(prev => 
        prev.map(w => 
          w.id === selectedWalletForEdit.id 
            ? { ...walletData, id: w.id, createdAt: w.createdAt }
            : w
        )
      );
    } else {
      // Add new wallet
      const newWallet: PaymentWallet = {
        ...walletData,
        id: `w${Date.now()}`,
        createdAt: new Date()
      };
      setPaymentWallets(prev => [...prev, newWallet]);
    }
  };

  // Poker Account handlers
  const handleAddAccount = () => {
    setSelectedAccountForEdit(null);
    setActiveSlideIn('pokeraccount');
  };

  const handleEditAccount = (account: PokerAccount) => {
    setSelectedAccountForEdit(account);
    setActiveSlideIn('pokeraccount');
  };

  const handleDeleteAccount = (accountId: string) => {
    setPokerRoomAccounts(prev => prev.filter(a => a.id !== accountId));
  };

  const handleAccountSubmit = (accountData: Omit<PokerAccount, 'id' | 'createdAt'>) => {
    if (selectedAccountForEdit) {
      // Edit existing account
      setPokerRoomAccounts(prev => 
        prev.map(a => 
          a.id === selectedAccountForEdit.id 
            ? { ...accountData, id: a.id, createdAt: a.createdAt }
            : a
        )
      );
    } else {
      // Add new account
      const newAccount: PokerAccount = {
        ...accountData,
        id: `a${Date.now()}`,
        createdAt: new Date()
      };
      setPokerRoomAccounts(prev => [...prev, newAccount]);
    }
  };

  // Legal Document handlers
  const handleAddDocument = () => {
    setSelectedDocumentForEdit(null);
    setActiveSlideIn('legaldocument');
  };

  const handleEditDocument = (document: LegalDocument) => {
    setSelectedDocumentForEdit(document);
    setActiveSlideIn('legaldocument');
  };

  const handleDeleteDocument = (documentId: string) => {
    setLegalDocuments(prev => prev.filter(d => d.id !== documentId));
  };

  const handleDocumentSubmit = (documentData: Omit<LegalDocument, 'id' | 'uploadedAt'>) => {
    if (selectedDocumentForEdit) {
      // Edit existing document
      setLegalDocuments(prev => 
        prev.map(d => 
          d.id === selectedDocumentForEdit.id 
            ? { ...documentData, id: d.id, uploadedAt: d.uploadedAt }
            : d
        )
      );
    } else {
      // Add new document
      const newDocument: LegalDocument = {
        ...documentData,
        id: `d${Date.now()}`,
        uploadedAt: new Date()
      };
      setLegalDocuments(prev => [...prev, newDocument]);
    }
  };

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

  // Generate account performance data
  useEffect(() => {
    const data: Record<string, AccountDataPoint[]> = {};
    const days = 30;
    
    pokerAccounts.forEach((account) => {
      const accountData: AccountDataPoint[] = [];
      let currentValue = account.balance - Math.abs(account.totalPL);
      
      for (let i = days; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        
        // Simulate daily variance
        const dailyChange = (Math.random() - 0.45) * 150; // Slight negative drift
        currentValue += dailyChange;
        
        accountData.push({
          date: date.toISOString().split('T')[0],
          value: Math.round(currentValue)
        });
      }
      
      data[account.id] = accountData;
    });
    
    setAccountPerformanceData(data);
  }, [pokerAccounts]);

  // Persist session state to localStorage whenever it changes
  useEffect(() => {
    if (sessionActive) {
      localStorage.setItem('activeSession', JSON.stringify({
        isActive: sessionActive,
        time: sessionTime,
        pl: currentPL,
        ev: currentEV,
        data: sessionData,
        buyIn: buyIn,
        biggestWin: biggestWin,
        biggestLoss: biggestLoss
      }));
    }
  }, [sessionActive, sessionTime, currentPL, currentEV, sessionData, buyIn, biggestWin, biggestLoss]);

  // Update session time - always runs when session is active
  useEffect(() => {
    if (!sessionActive) return;

    const timeInterval = setInterval(() => {
      setSessionTime(prev => prev + 1);
    }, 10000);

    return () => clearInterval(timeInterval);
  }, [sessionActive]);

  // Update session data (PL/EV/chart) - only when screen sharing
  useEffect(() => {
    if (!sessionActive) return;

    // Initialize with starting data point
    setSessionData([{
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      pl: 0,
      ev: 0
    }]);

    // Only auto-update metrics when screen sharing is enabled
    if (!isScreenSharing) return;

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
    }, 10000);

    return () => clearInterval(interval);
  }, [sessionActive, isScreenSharing, biggestWin, biggestLoss]);

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

  // Save conversations to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('ai_conversations', JSON.stringify(conversations));
    }
  }, [conversations]);

  const startSession = () => {
    setSessionActive(true);
    setSessionTime(0);
    setCurrentPL(0);
    setCurrentEV(0);
    setBiggestWin(0);
    setBiggestLoss(0);
    setSessionData([]);
    setUploadedHands([]);
    setIsScreenSharing(false);
    setLiveSessionView('overview');
    setTournamentEntries([]);
    // Initial save to localStorage
    localStorage.setItem('activeSession', JSON.stringify({
      isActive: true,
      time: 0,
      pl: 0,
      ev: 0,
      data: [],
      buyIn: 500,
      biggestWin: 0,
      biggestLoss: 0
    }));
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
    setUploadedHands([]);
    // Clear session from localStorage
    localStorage.removeItem('activeSession');
    // Switch back to overview tab after ending session
    setActiveTab('overview');
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

  const formatDateOnly = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTimeOnly = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Conversation management functions
  const createNewConversation = () => {
    const newConversation: Conversation = {
      id: `conv_${Date.now()}`,
      title: 'New conversation',
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    setConversations(prev => [newConversation, ...prev]);
    setCurrentConversationId(newConversation.id);
    setShowConversationList(false);
    setTimeout(() => aiInputRef.current?.focus(), 100);
  };

  const selectConversation = (id: string) => {
    setCurrentConversationId(id);
    setShowConversationList(false);
  };

  const deleteConversation = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newConversations = conversations.filter(c => c.id !== id);
    setConversations(newConversations);
    if (currentConversationId === id) {
      setCurrentConversationId(newConversations.length > 0 ? newConversations[0].id : null);
    }
  };

  const formatRelativeTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days}d ago`;
    return formatDateOnly(date);
  };

  const handleAiQuery = async () => {
    if (!aiQuery.trim()) return;
    
    const userMessage = aiQuery.trim();
    
    // Get or create current conversation
    let convId = currentConversationId;
    let conv = conversations.find(c => c.id === convId);
    
    if (!conv) {
      // Create new conversation
      conv = {
        id: `conv_${Date.now()}`,
        title: userMessage.slice(0, 40) + (userMessage.length > 40 ? '...' : ''),
        messages: [],
        createdAt: new Date(),
        updatedAt: new Date()
      };
      setConversations(prev => [conv, ...prev]);
      setCurrentConversationId(conv.id);
    }
    
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
      } else if (query.includes('win rate') || query.includes('winrate')) {
        const totalSessions = sessionHistory.length;
        const winningSessions = sessionHistory.filter(s => s.profitLoss > 0).length;
        const winRate = ((winningSessions / totalSessions) * 100).toFixed(1);
        const totalPL = sessionHistory.reduce((sum, s) => sum + s.profitLoss, 0);
        const avgWin = winningSessions > 0 
          ? (sessionHistory.filter(s => s.profitLoss > 0).reduce((sum, s) => sum + s.profitLoss, 0) / winningSessions).toFixed(0)
          : 0;
        response = `**Your Win Rate Analysis**\n\n• Overall Win Rate: ${winRate}% (${winningSessions} of ${totalSessions} sessions)\n• Total P/L: ${formatPL(totalPL)}\n• Average Win: $${avgWin}\n• Average Loss: $${Math.abs(sessionHistory.filter(s => s.profitLoss < 0).reduce((sum, s) => sum + s.profitLoss, 0) / (totalSessions - winningSessions)).toFixed(0)}\n\nYour win rate is solid. Focus on maximizing winning sessions and reducing the variance in losing sessions.`;
      } else if (query.includes('position')) {
        response = `**Position Analysis**\n\nBased on your session data:\n\n• **Button (BTN)**: Most profitable - you're +$820 here\n• **Cutoff (CO)**: Second best - +$450 average\n• **Hijack (HJ)**: Neutral - +$120 average\n• **Lojack (LJ)**: Slight loss - -$80 average\n• **Early Position (EP)**: Weakest - -$340 average\n\n**Recommendation**: Play tighter from early position and look to open-raise more from BTN and CO. Your positional awareness training is paying off in late positions.`;
      } else if (query.includes('leak') || query.includes('leaks')) {
        response = `**Your Top Leaks**\n\n1. **AJo in 3-bet pots** (-$180/100 hands)\n   - Consider folding more to 3-bets out of position\n\n2. **Over-betting on river** (-$120/100 hands)\n   - You bet 2.5x pot too often when value-betting\n\n3. **Float betting** (-$90/100 hands)\n   - You're floating too much without equity\n\n4. **Stack-off decisions** (-$150/100 hands)\n   - Review your stack-to-pot ratio decisions\n\n**Action**: Review your AJo hands specifically - they're causing the biggest drain on your win rate.`;
      } else if (query.includes('compare') || query.includes('recent')) {
        const recent = sessionHistory.slice(0, 3);
        const avgProfit = (recent.reduce((sum, s) => sum + s.profitLoss, 0) / recent.length).toFixed(0);
        const bestSession = recent.reduce((best, s) => s.profitLoss > best.profitLoss ? s : best, recent[0]);
        const worstSession = recent.reduce((worst, s) => s.profitLoss < worst.profitLoss ? s : worst, recent[0]);
        response = `**Recent Sessions Comparison**\n\n${recent.map((s, i) => `${i + 1}. ${formatDateOnly(s.date)}: ${formatPL(s.profitLoss)} (${s.handsPlayed} hands)`).join('\n')}\n\n**Summary**:\n• Average P/L: $${avgProfit}\n• Best: ${formatPL(bestSession.profitLoss)} on ${formatDateOnly(bestSession.date)}\n• Worst: ${formatPL(worstSession.profitLoss)} on ${formatDateOnly(worstSession.date)}\n\n**Trend**: ${parseFloat(avgProfit) >= 0 ? 'Upward trend - keep playing your game!' : 'Downward trend - consider taking a break.'}`;
      } else if (query.includes('summary')) {
        const totalHands = sessionHistory.reduce((sum, s) => sum + s.handsPlayed, 0);
        const totalPL = sessionHistory.reduce((sum, s) => sum + s.profitLoss, 0);
        const totalEV = sessionHistory.reduce((sum, s) => sum + s.ev, 0);
        const winningSessions = sessionHistory.filter(s => s.profitLoss > 0).length;
        const winRate = ((winningSessions / sessionHistory.length) * 100).toFixed(1);
        response = `**Session Summary**\n\n📊 **Overview**\n• Total Sessions: ${sessionHistory.length}\n• Total Hands: ${totalHands.toLocaleString()}\n• Win Rate: ${winRate}%\n\n💰 **Financials**\n• Total P/L: ${formatPL(totalPL)}\n• Total EV: ${formatPL(totalEV)}\n• EV Diff: ${formatPL(totalPL - totalEV)}\n\n📈 **Performance**\n• Biggest Win: ${formatPL(Math.max(...sessionHistory.map(s => s.profitLoss)))}\n• Biggest Loss: ${formatPL(Math.min(...sessionHistory.map(s => s.profitLoss)))}\n\nYou're performing ${totalPL >= totalEV ? 'above' : 'below'} EV. ${parseFloat(winRate) >= 50 ? 'Your win rate is healthy.' : 'Consider reviewing your decision-making.'}`;
      } else {
        response = "At the moment, I'm on a demo environment and my capabilities are limited to protect from abuse or unintended usage at this stage.\n\nFeel free to try one of the suggested queries above to see how I can help analyze your poker performance.";
      }
      
      // Add messages to conversation
      setConversations(prev => prev.map(c => {
        if (c.id === conv.id) {
          return {
            ...c,
            messages: [
              ...c.messages,
              { role: 'user' as const, content: userMessage },
              { role: 'assistant' as const, content: response }
            ],
            updatedAt: new Date()
          };
        }
        return c;
      }));
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
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showAiModal]);

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
    if (type === 'company_wallet') {
      return (
        <div className="w-5 h-5 bg-blue-100 rounded flex items-center justify-center">
          <Wallet className="w-3 h-3 text-blue-600" />
        </div>
      );
    }
    if (type === 'player_financial') {
      const walletKey = name as 'Skrill' | 'Neteller' | 'Pix' | 'LuxonPay';
      if (walletImages[name]) {
        return <WalletIcon type={walletKey} className="w-5 h-5" />;
      }
    }
    if (type === 'poker_site') {
      const platformKey = name as 'PokerStars' | 'GGPoker' | '888Poker' | 'PartyPoker';
      if (walletImages[name]) {
        return <PokerWalletIcon platform={platformKey} size="sm" className="w-5 h-5" />;
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
      const platformKey = name as 'PokerStars' | 'GGPoker' | '888Poker' | 'PartyPoker';
      if (walletImages[name]) {
        return <PokerWalletIcon platform={platformKey} size="sm" className="w-5 h-5" />;
      }
    }
    if (type === 'player_account') {
      return (
        <div className="w-5 h-5 bg-green-100 rounded flex items-center justify-center">
          <DollarSign className="w-3 h-3 text-green-600" />
        </div>
      );
    }
    if (type === 'house_account') {
      return (
        <div className="w-5 h-5 bg-gray-100 rounded flex items-center justify-center">
          <DollarSign className="w-3 h-3 text-gray-600" />
        </div>
      );
    }
    return (
      <div className="w-5 h-5 bg-gray-100 rounded flex items-center justify-center">
        <Wallet className="w-3 h-3 text-gray-600" />
      </div>
    );
  };

  const getStatusIcon = (status: string) => {
    if (status === 'confirmed') {
      return (
        <div className="w-4 h-4 bg-green-100 rounded-full flex items-center justify-center" title="Confirmed">
          <CheckCircle className="w-2.5 h-2.5 text-green-600" />
        </div>
      );
    }
    if (status === 'pending') {
      return (
        <div className="w-4 h-4 bg-gray-100 rounded-full flex items-center justify-center" title="Pending">
          <Clock className="w-2.5 h-2.5 text-gray-600" />
        </div>
      );
    }
    if (status === 'failed') {
      return (
        <div className="w-4 h-4 bg-red-100 rounded-full flex items-center justify-center" title="Failed">
          <svg className="w-2.5 h-2.5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
      );
    }
    return null;
  };

  const getWalletWithLink = (walletName: string, walletType: string, nickname?: string, skipIcon: boolean = false) => {
    const isPokerSite = ['PokerStars', 'GGPoker', '888Poker', 'PartyPoker'].includes(walletName);
    const isPlayerFinancial = ['Skrill', 'Neteller', 'Pix', 'LuxonPay'].includes(walletName);

    if (isPokerSite && nickname) {
      if (skipIcon) {
        return <span className="text-xs text-gray-700 font-medium">{nickname}</span>;
      }
      const platformKey = walletName as 'PokerStars' | 'GGPoker' | '888Poker' | 'PartyPoker';
      return (
        <div className="flex items-center gap-1">
          <PokerWalletIcon platform={platformKey} size="sm" className="w-5 h-5" />
          <span className="text-xs text-gray-700 font-medium">{nickname}</span>
        </div>
      );
    }

    if (isPlayerFinancial) {
      const generatePaymentLink = (provider: string) => {
        const randomId = Math.random().toString(36).substring(2, 34).toUpperCase();
        if (provider === 'Skrill') {
          return `https://payments.skrill.com/v1/checkout?id=${randomId}`;
        }
        if (provider === 'Neteller') {
          return `https://payments.neteller.com/v1/checkout?id=${randomId}`;
        }
        if (provider === 'Pix') {
          return `https://payments.pix.com/v1/checkout?id=${randomId}`;
        }
        if (provider === 'LuxonPay') {
          return `https://payments.luxonpay.com/v1/checkout?id=${randomId}`;
        }
        return '#';
      };
      
      if (skipIcon) {
        return (
          <UITooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => window.open(generatePaymentLink(walletName), '_blank')}
                className="inline-flex items-center gap-1 hover:text-gray-900 transition-colors"
              >
                <span className="text-xs text-gray-600">{walletName}</span>
                <ExternalLink className="w-3 h-3 text-gray-400" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="top" className="bg-gray-900 text-white text-xs max-w-xs break-all">
              <div className="font-mono text-[8px]">{generatePaymentLink(walletName)}</div>
            </TooltipContent>
          </UITooltip>
        );
      }
      
      const walletKey = walletName as 'Skrill' | 'Neteller' | 'Pix' | 'LuxonPay';
      return (
        <UITooltip>
          <TooltipTrigger asChild>
            <button
              onClick={() => window.open(generatePaymentLink(walletName), '_blank')}
              className="inline-flex items-center gap-1 hover:text-gray-900 transition-colors"
            >
              <WalletIcon type={walletKey} className="w-4 h-4" />
              <ExternalLink className="w-3 h-3 text-gray-400" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="top" className="bg-gray-900 text-white text-xs max-w-xs break-all">
            <div className="font-mono text-[8px]">{generatePaymentLink(walletName)}</div>
          </TooltipContent>
        </UITooltip>
      );
    }

    return <span className="text-xs text-gray-600">{walletName}</span>;
  };

  const isProfit = currentPL >= 0;

  // Get current conversation messages
  const currentConversation = conversations.find(c => c.id === currentConversationId);
  const currentMessages = currentConversation?.messages || [];

  const renderAiWidget = () => (
    <>
      {/* Floating Action Button - Simple Circle */}
      {!showAiModal && (
        <button
          onClick={() => setShowAiModal(true)}
          className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-gray-900 hover:bg-gray-800 shadow-lg transition-all duration-200 hover:scale-105 flex items-center justify-center"
          title="Open AI Assistant (⌘K)"
        >
          <MessageCircle className="w-6 h-6 text-white" />
          {conversations.length > 0 && (
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full border-2 border-white"></div>
          )}
        </button>
      )}

      {/* Chat Widget Panel - Simple Clean Design */}
      {showAiModal && (
        <div className="fixed bottom-6 right-6 z-50 w-[420px] h-[560px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden animate-slideUp">
          {/* Header */}
          <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-gray-900 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">AI Poker Assistant</h3>
                <p className="text-xs text-gray-500">Ask me anything</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {/* Conversation selector */}
              {conversations.length > 0 && (
                <div className="relative">
                  <button
                    onClick={() => setShowConversationList(!showConversationList)}
                    className="w-8 h-8 rounded-lg hover:bg-gray-200 flex items-center justify-center transition-colors"
                    title="View conversations"
                  >
                    <History className="w-4 h-4 text-gray-600" />
                  </button>
                  {/* Dropdown conversation list */}
                  {showConversationList && (
                    <div className="absolute bottom-full right-0 mb-2 w-64 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden">
                      <div className="px-3 py-2 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
                        <span className="text-xs font-semibold text-gray-700">Conversations</span>
                        <button
                          onClick={() => { createNewConversation(); setShowConversationList(false); }}
                          className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                        >
                          + New
                        </button>
                      </div>
                      <div className="max-h-48 overflow-y-auto">
                        {conversations.map((conv) => (
                          <button
                            key={conv.id}
                            onClick={() => { selectConversation(conv.id); setShowConversationList(false); }}
                            className={`w-full px-3 py-2 text-left hover:bg-gray-50 transition-colors group relative ${
                              currentConversationId === conv.id ? 'bg-blue-50' : ''
                            }`}
                          >
                            <div className="flex items-center justify-between gap-2">
                              <div className="flex-1 min-w-0">
                                <div className="text-sm font-medium text-gray-900 truncate">{conv.title}</div>
                                <div className="text-xs text-gray-500">{formatRelativeTime(conv.updatedAt)}</div>
                              </div>
                              <button
                                onClick={(e) => deleteConversation(conv.id, e)}
                                className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200 rounded transition-opacity"
                              >
                                <Trash className="w-3.5 h-3.5 text-gray-400 hover:text-red-500" />
                              </button>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
              <button
                onClick={() => { setShowAiModal(false); setAiQuery(''); setShowConversationList(false); }}
                className="w-8 h-8 rounded-lg hover:bg-gray-200 flex items-center justify-center transition-colors"
              >
                <span className="text-gray-600 text-lg leading-none">×</span>
              </button>
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 bg-gray-50">
              {/* Welcome Message */}
              {currentMessages.length === 0 && !isAiLoading && (
                <div className="flex flex-col items-center justify-center h-full text-center px-2">
                  <div className="w-14 h-14 rounded-xl bg-gray-900 flex items-center justify-center mb-4">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="text-base font-semibold text-gray-900 mb-2">How can I help you today?</h4>
                  <p className="text-sm text-gray-500 mb-5 max-w-[280px]">
                    I analyze your poker performance, identify leaks, and provide insights.
                  </p>
                  
                  {/* Quick Actions */}
                  <div className="grid grid-cols-2 gap-2 w-full max-w-sm">
                    {[
                      { q: "Win rate?", icon: "💯" },
                      { q: "Biggest leaks?", icon: "🔍" },
                      { q: "Best hands?", icon: "📈" },
                      { q: "Summary?", icon: "📋" }
                    ].map((item, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          setAiQuery(item.q);
                          setTimeout(() => handleAiQuery(), 100);
                        }}
                        className="px-3 py-2.5 bg-white hover:bg-gray-50 border border-gray-200 rounded-lg transition-colors flex items-center gap-2 group text-left"
                      >
                        <span className="text-lg">{item.icon}</span>
                        <span className="text-sm text-gray-700 group-hover:text-gray-900">{item.q}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Chat Messages */}
              {currentMessages.map((message, index) => (
                <div
                  key={index}
                  className={`flex gap-2.5 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.role === 'assistant' && (
                    <div className="w-8 h-8 rounded-lg bg-gray-900 flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] ${
                      message.role === 'user' 
                        ? 'bg-blue-600 text-white rounded-2xl rounded-br-md' 
                        : 'bg-white border border-gray-200 text-gray-900 rounded-2xl rounded-bl-md'
                    }`}
                  >
                    <div className="px-4 py-3 text-sm leading-relaxed whitespace-pre-line">
                      {message.content}
                    </div>
                  </div>
                  {message.role === 'user' && (
                    <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0 text-white font-semibold text-xs">
                      {currentPlayer.name.split(' ').map(n => n[0]).join('')}
                    </div>
                  )}
                </div>
              ))}

              {/* Loading */}
              {isAiLoading && (
                <div className="flex gap-2.5 justify-start">
                  <div className="w-8 h-8 rounded-lg bg-gray-900 flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-md px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={chatEndRef} />
            </div>

            {/* Input Area */}
            <div className="px-4 py-3 bg-white border-t border-gray-200">
              <div className="flex items-center gap-2">
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
                  placeholder="Ask me anything..."
                  disabled={isAiLoading}
                  className="flex-1 px-4 py-2.5 bg-gray-100 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  autoFocus
                />
                <button
                  onClick={handleAiQuery}
                  disabled={!aiQuery.trim() || isAiLoading}
                  className="w-10 h-10 rounded-xl bg-gray-900 hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
                >
                  <Send className="w-4 h-4 text-white" />
                </button>
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
        {renderAiWidget()}
        
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
                      setActiveSlideIn('deposit');
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
                      setActiveSlideIn('withdrawal');
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
                      setActiveSlideIn('split');
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
                      setActiveSlideIn('swap');
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

                  <button
                    onClick={() => {
                      setShowCommandPalette(false);
                      setActiveSlideIn('handhistory');
                    }}
                    className="w-full px-4 py-3 text-left rounded-lg hover:bg-gray-50 flex items-center gap-3 transition-colors group"
                  >
                    <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center group-hover:bg-gray-100 transition-colors">
                      <Upload className="w-5 h-5 text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-gray-900">Upload Hand History</div>
                      <div className="text-xs text-gray-500">Import and parse hand history files</div>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Slide-In Panels */}
        <SlideInPanel 
          isOpen={activeSlideIn === 'deposit'} 
          onClose={() => setActiveSlideIn(null)}
          title="Request Deposit"
        >
          <DepositForm onClose={() => setActiveSlideIn(null)} />
        </SlideInPanel>

        <SlideInPanel 
          isOpen={activeSlideIn === 'withdrawal'} 
          onClose={() => setActiveSlideIn(null)}
          title="Request Withdrawal"
        >
          <WithdrawalForm onClose={() => setActiveSlideIn(null)} />
        </SlideInPanel>

        <SlideInPanel 
          isOpen={activeSlideIn === 'split'} 
          onClose={() => setActiveSlideIn(null)}
          title="Split Balance"
        >
          <SplitForm onClose={() => setActiveSlideIn(null)} />
        </SlideInPanel>

        <SlideInPanel 
          isOpen={activeSlideIn === 'swap'} 
          onClose={() => setActiveSlideIn(null)}
          title="Swap Stakes"
        >
          <SwapForm onClose={() => setActiveSlideIn(null)} />
        </SlideInPanel>

        <SlideInPanel 
          isOpen={activeSlideIn === 'handhistory'} 
          onClose={() => setActiveSlideIn(null)}
          title="Upload Hand History"
        >
          <HandHistoryForm onClose={() => setActiveSlideIn(null)} />
        </SlideInPanel>

        <SlideInPanel 
          isOpen={activeSlideIn === 'paymentwallet'} 
          onClose={() => {
            setActiveSlideIn(null);
            setSelectedWalletForEdit(null);
          }}
          title={selectedWalletForEdit ? 'Edit Payment Wallet' : 'Add Payment Wallet'}
        >
          <PaymentWalletForm 
            onClose={() => {
              setActiveSlideIn(null);
              setSelectedWalletForEdit(null);
            }}
            onSubmit={handleWalletSubmit}
            editWallet={selectedWalletForEdit}
          />
        </SlideInPanel>

        <SlideInPanel 
          isOpen={activeSlideIn === 'pokeraccount'} 
          onClose={() => {
            setActiveSlideIn(null);
            setSelectedAccountForEdit(null);
          }}
          title={selectedAccountForEdit ? 'Edit Poker Account' : 'Add Poker Account'}
        >
          <PokerAccountForm 
            onClose={() => {
              setActiveSlideIn(null);
              setSelectedAccountForEdit(null);
            }}
            onSubmit={handleAccountSubmit}
            editAccount={selectedAccountForEdit}
          />
        </SlideInPanel>

        <SlideInPanel 
          isOpen={activeSlideIn === 'legaldocument'} 
          onClose={() => {
            setActiveSlideIn(null);
            setSelectedDocumentForEdit(null);
          }}
          title={selectedDocumentForEdit ? 'Edit Legal Document' : 'Add Legal Document'}
        >
          <LegalDocumentForm 
            onClose={() => {
              setActiveSlideIn(null);
              setSelectedDocumentForEdit(null);
            }}
            onSubmit={handleDocumentSubmit}
            editDocument={selectedDocumentForEdit}
          />
        </SlideInPanel>

        <SlideInPanel 
          isOpen={activeSlideIn === 'accountdetails'} 
          onClose={() => {
            setActiveSlideIn(null);
            setSelectedAccount(null);
          }}
          title={selectedAccount ? `${selectedAccount.platform} Details` : 'Account Details'}
        >
          {selectedAccount && (
            <div className="space-y-4">
              {/* Account Header */}
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="bg-gray-700 text-white text-lg font-bold px-4 py-3 rounded-lg">
                  {selectedAccount.platform.substring(0, 2).toUpperCase()}
                </div>
                <div className="flex-1">
                  <div className="text-lg font-bold text-gray-900">{selectedAccount.platform}</div>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${selectedAccount.status === 'active' ? 'bg-gray-600' : 'bg-gray-400'}`}></div>
                    <span className="text-sm text-gray-600 capitalize">{selectedAccount.status}</span>
                  </div>
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <div className="text-xs text-gray-500 mb-1">Makeup</div>
                  <div className="text-2xl font-bold text-gray-900">
                    ${Math.abs(selectedAccount.makeup).toLocaleString()}
                  </div>
                </div>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <div className="text-xs text-gray-500 mb-1">Current Balance</div>
                  <div className="text-2xl font-bold text-gray-900">
                    ${selectedAccount.balance.toLocaleString()}
                  </div>
                </div>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <div className="text-xs text-gray-500 mb-1">Net Deposits</div>
                  <div className="text-2xl font-bold text-gray-900">
                    ${selectedAccount.deposits.toLocaleString()}
                  </div>
                </div>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <div className="text-xs text-gray-500 mb-1">Total P/L</div>
                  <div className="text-2xl font-bold text-gray-900">
                    {selectedAccount.totalPL >= 0 ? '+' : ''}${selectedAccount.totalPL.toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Performance Chart */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <div className="text-sm font-bold text-gray-900 mb-3">Performance Trend</div>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={accountPerformanceData[selectedAccount.id] || []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis 
                      dataKey="date"
                      stroke="#6b7280"
                      style={{ fontSize: '10px' }}
                      tickFormatter={(value) => {
                        const date = new Date(value);
                        return `${date.getMonth() + 1}/${date.getDate()}`;
                      }}
                    />
                    <YAxis 
                      stroke="#6b7280"
                      style={{ fontSize: '10px' }}
                      tickFormatter={(value) => `$${value}`}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #e5e7eb',
                        borderRadius: '6px',
                        fontSize: '12px'
                      }}
                      formatter={(value: any) => [`$${value}`, 'Balance']}
                    />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#6b7280"
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </SlideInPanel>

        <SlideInPanel
          isOpen={!!selectedHandForReplay}
          onClose={() => setSelectedHandForReplay(null)}
          title="Hand Replay"
        >
          {selectedHandForReplay && (
            <HandReplayer 
              hand={selectedHandForReplay}
              playerName={currentPlayer.name}
            />
          )}
        </SlideInPanel>
        
        <div className="space-y-6 p-6">
        {/* Player Header */}
        <div className="py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img 
                src={currentPlayer.avatar} 
                alt={currentPlayer.name}
                className="w-14 h-14 rounded-full object-cover border border-gray-200 shadow-sm"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-semibold text-gray-900">Hi, {currentPlayer.name.split(' ')[0]}</h2>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 border border-gray-200 rounded text-xs font-semibold text-gray-700">
                    <Shield className="w-3 h-3" />
                    NL50
                  </span>
                </div>
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
            <TabsTrigger value="analytics">
              <Grid3x3 className="w-4 h-4 mr-2" />
              Analytics
              <span className="ml-1.5 px-1.5 py-0.5 text-[10px] font-bold bg-yellow-400 text-yellow-900 data-[state=active]:bg-white/20 data-[state=active]:text-white/90 rounded">Beta</span>
            </TabsTrigger>
            <TabsTrigger value="sessions">
              <Clock className="w-4 h-4 mr-2" />
              Sessions
            </TabsTrigger>
            <TabsTrigger value="operations">
              <ArrowLeftRight className="w-4 h-4 mr-2" />
              Operations
            </TabsTrigger>
            <TabsTrigger value="wallets">
              <Wallet className="w-4 h-4 mr-2" />
              Wallets
            </TabsTrigger>
            <TabsTrigger value="accounts">
              <Users className="w-4 h-4 mr-2" />
              Accounts
            </TabsTrigger>
            <TabsTrigger value="legal">
              <FileText className="w-4 h-4 mr-2" />
              Legal
            </TabsTrigger>
          </TabsList>

          <TabsContent value="sessions" className="space-y-3 mt-6">
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
          </TabsContent>

          <TabsContent value="analytics">
            {/* Ready to Play CTA */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-4 border-2 border-blue-500 mb-6">
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

            <DrillDownAnalytics 
              playerId={currentPlayer.name}
              playerName={currentPlayer.name}
              isCompanyWide={false}
              onHandClick={setSelectedHandForReplay}
            />
          </TabsContent>

          <TabsContent value="operations" className="mt-6">
            {/* 70/30 Grid: Operations Table | Reconciliation */}
            <div className="grid grid-cols-10 gap-4">
              {/* Operations Table - 70% */}
              <div className="col-span-7 bg-white border border-gray-200 rounded-lg overflow-hidden flex flex-col">
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
                                <div className="text-sm text-gray-900">{formatDateOnly(operation.date)}</div>
                                <div className="text-xs text-gray-500">{formatTimeOnly(operation.date)}</div>
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

              {/* Reconciliation Sidebar - 30% */}
              <div className="col-span-3 bg-white border border-gray-200 rounded-lg overflow-hidden flex flex-col">
                <div className="px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-slate-50 flex-shrink-0">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Reconciliation</h3>
                    {reconciliationItems.length > 0 && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                        {reconciliationItems.length} pending
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto p-3 space-y-2 max-h-[calc(100vh-340px)]">
                  {reconciliationItems.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center py-8">
                      <CheckCircle className="w-10 h-10 text-green-500 mb-2" />
                      <p className="text-sm font-medium text-gray-900">All caught up!</p>
                      <p className="text-xs text-gray-500 mt-1">No transactions pending reconciliation</p>
                    </div>
                  ) : (
                    <>
                      {/* Summary Card */}
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-3">
                        <div className="text-xs text-gray-600 font-medium">Total Pending</div>
                        <div className="text-lg font-bold text-gray-900">
                          ${reconciliationItems.reduce((sum, item) => sum + item.amount, 0).toLocaleString()}
                        </div>
                      </div>

                      {/* Pending Items List */}
                      {reconciliationItems.map((item, index) => (
                        <div key={`${item.opId}-${item.txIndex}`} className="border border-gray-200 rounded-lg p-3 hover:shadow-sm transition-shadow bg-white">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-semibold text-gray-900">{item.opId}</span>
                              <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium ${
                                item.opType === 'Deposit' ? 'bg-blue-100 text-blue-700' :
                                item.opType === 'Withdrawal' ? 'bg-red-100 text-red-700' :
                                item.opType === 'Split' ? 'bg-purple-100 text-purple-700' :
                                'bg-gray-100 text-gray-700'
                              }`}>
                                {item.opType}
                              </span>
                            </div>
                            <span className="text-xs font-bold text-gray-700">${item.amount.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-gray-500 mb-3">
                            {getWalletIcon(item.fromType, item.from)}
                            {getWalletWithLink(item.from, item.fromType, item.nickname, true)}
                            <span>→</span>
                            {getWalletIcon(item.toType, item.to)}
                            {getWalletWithLink(item.to, item.toType, item.nickname, true)}
                          </div>
                          <div className="flex gap-2">
                            {item.buttonType === 'confirm' ? (
                              <button
                                onClick={() => {
                                  approveTransaction(item.opId, item.txIndex);
                                }}
                                className="flex-1 inline-flex items-center justify-center gap-1 px-2 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-medium rounded transition-colors"
                              >
                                <CheckCircle className="w-3 h-3" />
                                Confirm
                              </button>
                            ) : (
                              <button
                                onClick={() => {
                                  approveTransaction(item.opId, item.txIndex);
                                }}
                                className="flex-1 inline-flex items-center justify-center gap-1 px-2 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded transition-colors"
                              >
                                <DollarSign className="w-3 h-3" />
                                Pay
                              </button>
                            )}
                            <button
                              onClick={() => {
                                rejectTransaction(item.opId, item.txIndex);
                              }}
                              className="flex-1 inline-flex items-center justify-center gap-1 px-2 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-medium rounded transition-colors"
                            >
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                              Reject
                            </button>
                          </div>
                        </div>
                      ))}
                    </>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="wallets" className="mt-6">
            <PaymentWalletsContent
              wallets={paymentWallets}
              onAdd={handleAddWallet}
              onEdit={handleEditWallet}
              onDelete={handleDeleteWallet}
            />
          </TabsContent>

          <TabsContent value="accounts" className="mt-6">
            <PokerAccountsContent
              accounts={pokerRoomAccounts}
              onAdd={handleAddAccount}
              onEdit={handleEditAccount}
              onDelete={handleDeleteAccount}
            />
          </TabsContent>

          <TabsContent value="legal" className="mt-6">
            <LegalDocumentsContent
              documents={legalDocuments}
              onAddDocument={handleAddDocument}
              onEditDocument={handleEditDocument}
              onDeleteDocument={handleDeleteDocument}
            />
          </TabsContent>
        </Tabs>
        </div>
      </div>
    );
  }

  // Show live session ONLY when session is active
  if (sessionActive) {
    return (
      <div className="space-y-0 relative">
        {renderAiWidget()}
        
        {/* Live Session View - Player is locked in */}
        <div className="space-y-3 p-6">
        {/* Compact Session Header Bar */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="px-4 py-2 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-bold text-gray-900 uppercase tracking-wide">Live Session</span>
                </div>
                <span className="text-xs text-gray-500">
                  Started {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center bg-gray-100 rounded-lg p-0.5">
                  <button
                    onClick={() => setLiveSessionView('overview')}
                    className={`px-2.5 py-1 text-[10px] font-semibold rounded transition-all ${
                      liveSessionView === 'overview' 
                        ? 'bg-white text-gray-900 shadow-sm' 
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Overview
                  </button>
                  <button
                    onClick={() => setLiveSessionView('cash')}
                    className={`px-2.5 py-1 text-[10px] font-semibold rounded transition-all ${
                      liveSessionView === 'cash' 
                        ? 'bg-white text-gray-900 shadow-sm' 
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Cash
                  </button>
                  <button
                    onClick={() => setLiveSessionView('tournaments')}
                    className={`px-2.5 py-1 text-[10px] font-semibold rounded transition-all ${
                      liveSessionView === 'tournaments' 
                        ? 'bg-white text-gray-900 shadow-sm' 
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Tournaments
                  </button>
                </div>
                <div className="flex items-center gap-1.5 px-2 py-1 bg-white rounded border border-gray-200">
                  <Clock className="w-3.5 h-3.5 text-gray-500" />
                  <span className="text-xs font-semibold text-gray-700">{formatTime(sessionTime)}</span>
                </div>
                <button
                  onClick={() => setActiveSlideIn('addtournament')}
                  className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded transition-all flex items-center gap-1.5"
                >
                  <span className="text-sm font-bold">+</span>
                  Tournament
                </button>
                <button
                  onClick={endSession}
                  className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded transition-all flex items-center gap-1.5"
                >
                  <Square className="w-3 h-3" />
                  End
                </button>
              </div>
            </div>
          </div>

          {/* Compact Metrics Row */}
          {(liveSessionView === 'overview' || liveSessionView === 'cash') && (
            <div className="grid grid-cols-6 divide-x divide-gray-200 bg-white">
              <div className="px-3 py-2">
                <div className="text-[10px] font-medium text-gray-500 uppercase tracking-wide mb-0.5">P/L</div>
                <div className={`text-lg font-bold ${isProfit ? 'text-green-600' : 'text-red-600'}`}>
                  {formatPL(currentPL)}
                </div>
              </div>

              <div className="px-3 py-2">
                <div className="text-[10px] font-medium text-gray-500 uppercase tracking-wide mb-0.5">EV</div>
                <div className="text-lg font-bold text-blue-600">
                  {formatPL(currentEV)}
                </div>
              </div>

              <div className="px-3 py-2">
                <div className="text-[10px] font-medium text-gray-500 uppercase tracking-wide mb-0.5">Hands</div>
                <div className="text-lg font-bold text-gray-900">
                  {Math.floor((sessionTime / 60) * 100)}
                </div>
              </div>

              <div className="px-3 py-2">
                <div className="text-[10px] font-medium text-gray-500 uppercase tracking-wide mb-0.5">BB/100</div>
                <div className="text-lg font-bold text-purple-600">
                  {sessionTime > 0 ? Math.max(2, Math.min(10, 5 + (currentPL / 1000))).toFixed(1) : '5.0'}
                </div>
              </div>

              <div className="px-3 py-2">
                <div className="text-[10px] font-medium text-gray-500 uppercase tracking-wide mb-0.5">Best Win</div>
                <div className="text-lg font-bold text-green-600">
                  ${biggestWin}
                </div>
              </div>

              <div className="px-3 py-2">
                <div className="text-[10px] font-medium text-gray-500 uppercase tracking-wide mb-0.5">Worst Loss</div>
                <div className="text-lg font-bold text-red-600">
                  -${Math.abs(biggestLoss)}
                </div>
              </div>
            </div>
          )}

          {(liveSessionView === 'overview' || liveSessionView === 'tournaments') && tournamentEntries.length > 0 && (
            <div className="grid grid-cols-3 divide-x divide-gray-200 bg-white">
              <div className="px-3 py-2">
                <div className="text-[10px] font-medium text-gray-500 uppercase tracking-wide mb-0.5">Entries</div>
                <div className="text-lg font-bold text-gray-900">
                  {tournamentEntries.length}
                </div>
              </div>
              <div className="px-3 py-2">
                <div className="text-[10px] font-medium text-gray-500 uppercase tracking-wide mb-0.5">Total Buy-in</div>
                <div className="text-lg font-bold text-gray-900">
                  ${tournamentEntries.reduce((sum, e) => sum + e.buyIn, 0).toLocaleString()}
                </div>
              </div>
              <div className="px-3 py-2">
                <div className="text-[10px] font-medium text-gray-500 uppercase tracking-wide mb-0.5">Total Rake</div>
                <div className="text-lg font-bold text-gray-600">
                  ${tournamentEntries.reduce((sum, e) => sum + e.rake, 0).toLocaleString()}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 80/20 Grid: Session Performance | Live Feed */}
        {(liveSessionView === 'overview' || liveSessionView === 'cash') && (
          <div className="grid grid-cols-5 gap-3">
            {/* Session Performance (80%) */}
            <div className="col-span-4 bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div className="px-4 py-2 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Session Performance</h3>
              </div>
              <div className="p-4">
                <ResponsiveContainer width="100%" height={160}>
                  <LineChart data={sessionData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis 
                      dataKey="time" 
                      stroke="#6b7280"
                      style={{ fontSize: '10px' }}
                    />
                    <YAxis 
                      stroke="#6b7280"
                      style={{ fontSize: '10px' }}
                      tickFormatter={(value) => `$${value}`}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#ffffff',
                        border: '1px solid #e5e7eb',
                        borderRadius: '6px',
                        fontSize: '12px'
                      }}
                      formatter={(value: number, name: string) => [`$${value}`, name === 'pl' ? 'P/L' : 'EV']}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="pl" 
                      stroke="#10b981" 
                      strokeWidth={2}
                      dot={false}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="ev" 
                      stroke="#3b82f6" 
                      strokeWidth={2}
                      dot={false}
                      strokeDasharray="5 5"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

          {/* Live Feed (20%) */}
          <div className="col-span-1 bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="px-2 py-2 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wide">Live Feed</h3>
                {isScreenSharing && (
                  <div className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></div>
                  </div>
                )}
              </div>
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
                <div className="p-1.5 bg-gray-50 flex items-center justify-center border-t border-gray-200">
                  <button 
                    onClick={stopScreenSharing}
                    className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded text-[10px] font-semibold transition-all flex items-center gap-1"
                  >
                    <Square className="w-2.5 h-2.5" />
                    Stop
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="relative bg-gray-100 aspect-video flex items-center justify-center">
                  <div className="text-center p-2">
                    <Video className="w-8 h-8 text-gray-400 mx-auto mb-1" />
                    <p className="text-[10px] text-gray-500">No feed</p>
                  </div>
                </div>

                {/* Start Sharing Button */}
                <div className="p-1.5 bg-gray-50 flex items-center justify-center border-t border-gray-200">
                  <button 
                    onClick={startScreenSharing}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded text-[10px] font-semibold transition-all flex items-center gap-1"
                  >
                    <Play className="w-2.5 h-2.5" />
                    Share
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
        )}

        {(liveSessionView === 'overview' || liveSessionView === 'tournaments') && (
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="px-4 py-2 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Tournament Entries</h3>
              <div className="flex items-center gap-3 text-xs">
                <span className="text-gray-500">Total: <span className="font-semibold text-gray-900">{tournamentEntries.length}</span></span>
                <span className="text-gray-500">Buy-in: <span className="font-semibold text-gray-900">${tournamentEntries.reduce((sum, e) => sum + e.buyIn, 0).toLocaleString()}</span></span>
                <span className="text-gray-500">Rake: <span className="font-semibold text-gray-600">${tournamentEntries.reduce((sum, e) => sum + e.rake, 0).toLocaleString()}</span></span>
              </div>
            </div>
            {tournamentEntries.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-3 py-2 text-left text-[10px] font-bold text-gray-600 uppercase">Time</th>
                      <th className="px-3 py-2 text-left text-[10px] font-bold text-gray-600 uppercase">Account</th>
                      <th className="px-3 py-2 text-left text-[10px] font-bold text-gray-600 uppercase">Buy-in</th>
                      <th className="px-3 py-2 text-left text-[10px] font-bold text-gray-600 uppercase">Rake</th>
                      <th className="px-3 py-2 text-left text-[10px] font-bold text-gray-600 uppercase">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {tournamentEntries.map((entry) => (
                      <tr key={entry.id} className="hover:bg-gray-50">
                        <td className="px-3 py-2 text-xs text-gray-500">
                          {entry.timestamp.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                        </td>
                        <td className="px-3 py-2 text-xs font-medium text-gray-900">{entry.accountName}</td>
                        <td className="px-3 py-2 text-xs font-semibold text-gray-900">${entry.buyIn}</td>
                        <td className="px-3 py-2 text-xs text-gray-600">${entry.rake}</td>
                        <td className="px-3 py-2 text-xs font-semibold text-gray-900">${entry.buyIn + entry.rake}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400">
                <p className="text-xs">No tournament entries yet. Click "+ Tournament" to add one.</p>
              </div>
            )}
          </div>
        )}

        {/* Hands - Full Width */}
        <PlayerHandHistory 
            autoUpdate={isScreenSharing}
            initialHands={uploadedHands.length > 0 ? uploadedHands : undefined}
            uploadedCount={uploadedHands.length}
            isProcessingUpload={isProcessingUpload}
            onUpload={async (file: File) => {
              setIsProcessingUpload(true);
              await new Promise(resolve => setTimeout(resolve, 1500));
              
              const mockHands: Hand[] = Array.from({ length: Math.floor(Math.random() * 8) + 5 }, (_, i) => ({
                id: `uploaded-${Date.now()}-${i}`,
                timestamp: new Date(),
                action: (['win', 'loss', 'fold'] as const)[Math.floor(Math.random() * 3)],
                amount: Math.floor(Math.random() * 500) + 50,
                cards: ['As', 'Ks'],
                flop: ['Qh', 'Jd', '9s'],
                turn: '2d',
                river: '7c',
                pot: Math.floor(Math.random() * 1000) + 200,
                position: ['BTN', 'CO', 'MP', 'BB', 'SB'][Math.floor(Math.random() * 5)],
                reconciled: Math.random() > 0.15
              }));
              
              setUploadedHands(mockHands);
              setIsProcessingUpload(false);
            }}
          />
        </div>

        <SlideInPanel
          isOpen={activeSlideIn === 'addtournament'}
          onClose={() => setActiveSlideIn(null)}
          title="Add Tournament Entry"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Account</label>
              <select
                id="tournamentAccount"
                className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onChange={(e) => {
                  const account = pokerRoomAccounts.find(a => a.id === e.target.value);
                  if (account) {
                    (window as any).__tempTournamentAccount = account;
                  }
                }}
              >
                <option value="">Select account...</option>
                {pokerRoomAccounts.filter(a => a.status === 'active').map((account) => (
                  <option key={account.id} value={account.id}>
                    {account.pokerRoom} - {account.nickname}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Buy-in ($)</label>
              <input
                type="number"
                id="tournamentBuyIn"
                min="0"
                step="0.01"
                placeholder="0.00"
                className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Rake ($)</label>
              <input
                type="number"
                id="tournamentRake"
                min="0"
                step="0.01"
                placeholder="0.00"
                className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={() => {
                const accountSelect = document.getElementById('tournamentAccount') as HTMLSelectElement;
                const buyInInput = document.getElementById('tournamentBuyIn') as HTMLInputElement;
                const rakeInput = document.getElementById('tournamentRake') as HTMLInputElement;
                
                const selectedAccount = pokerRoomAccounts.find(a => a.id === accountSelect.value);
                const buyIn = parseFloat(buyInInput.value) || 0;
                const rake = parseFloat(rakeInput.value) || 0;
                
                if (selectedAccount && (buyIn > 0 || rake > 0)) {
                  setTournamentEntries(prev => [
                    ...prev,
                    {
                      id: `t-${Date.now()}`,
                      accountId: selectedAccount.id,
                      accountName: `${selectedAccount.pokerRoom} (${selectedAccount.nickname})`,
                      buyIn,
                      rake,
                      timestamp: new Date()
                    }
                  ]);
                  setActiveSlideIn(null);
                  accountSelect.value = '';
                  buyInInput.value = '';
                  rakeInput.value = '';
                }
              }}
              className="w-full py-2.5 bg-gray-900 hover:bg-gray-800 text-white font-semibold rounded-lg transition-colors"
            >
              Add Entry
            </button>
          </div>
        </SlideInPanel>
      </div>
    );
  }

  // Show tabs/overview when NO session is active
  return (
    <div className="space-y-0 relative">
      {renderAiWidget()}
      
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
                    setActiveSlideIn('deposit');
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
                    setActiveSlideIn('withdrawal');
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
                    setActiveSlideIn('split');
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
                    setActiveSlideIn('swap');
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

                <button
                  onClick={() => {
                    setShowCommandPalette(false);
                    setActiveSlideIn('handhistory');
                  }}
                  className="w-full px-4 py-3 text-left rounded-lg hover:bg-gray-50 flex items-center gap-3 transition-colors group"
                >
                  <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center group-hover:bg-gray-100 transition-colors">
                    <Upload className="w-5 h-5 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-gray-900">Upload Hand History</div>
                    <div className="text-xs text-gray-500">Import and parse hand history files</div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Slide-In Panels */}
      <SlideInPanel 
        isOpen={activeSlideIn === 'deposit'} 
        onClose={() => setActiveSlideIn(null)}
        title="Request Deposit"
      >
        <DepositForm onClose={() => setActiveSlideIn(null)} />
      </SlideInPanel>

      <SlideInPanel 
        isOpen={activeSlideIn === 'withdrawal'} 
        onClose={() => setActiveSlideIn(null)}
        title="Request Withdrawal"
      >
        <WithdrawalForm onClose={() => setActiveSlideIn(null)} />
      </SlideInPanel>

      <SlideInPanel 
        isOpen={activeSlideIn === 'split'} 
        onClose={() => setActiveSlideIn(null)}
        title="Split Balance"
      >
        <SplitForm onClose={() => setActiveSlideIn(null)} />
      </SlideInPanel>

      <SlideInPanel 
        isOpen={activeSlideIn === 'swap'} 
        onClose={() => setActiveSlideIn(null)}
        title="Swap Stakes"
      >
        <SwapForm onClose={() => setActiveSlideIn(null)} />
      </SlideInPanel>

      <SlideInPanel 
        isOpen={activeSlideIn === 'handhistory'} 
        onClose={() => setActiveSlideIn(null)}
        title="Upload Hand History"
      >
        <HandHistoryForm onClose={() => setActiveSlideIn(null)} />
      </SlideInPanel>

      <SlideInPanel 
        isOpen={activeSlideIn === 'paymentwallet'} 
        onClose={() => {
          setActiveSlideIn(null);
          setSelectedWalletForEdit(null);
        }}
        title={selectedWalletForEdit ? 'Edit Payment Wallet' : 'Add Payment Wallet'}
      >
        <PaymentWalletForm 
          onClose={() => {
            setActiveSlideIn(null);
            setSelectedWalletForEdit(null);
          }}
          onSubmit={handleWalletSubmit}
          editWallet={selectedWalletForEdit}
        />
      </SlideInPanel>

      <SlideInPanel 
        isOpen={activeSlideIn === 'pokeraccount'} 
        onClose={() => {
          setActiveSlideIn(null);
          setSelectedAccountForEdit(null);
        }}
        title={selectedAccountForEdit ? 'Edit Poker Account' : 'Add Poker Account'}
      >
        <PokerAccountForm 
          onClose={() => {
            setActiveSlideIn(null);
            setSelectedAccountForEdit(null);
          }}
          onSubmit={handleAccountSubmit}
          editAccount={selectedAccountForEdit}
        />
      </SlideInPanel>

      <SlideInPanel 
        isOpen={activeSlideIn === 'legaldocument'} 
        onClose={() => {
          setActiveSlideIn(null);
          setSelectedDocumentForEdit(null);
        }}
        title={selectedDocumentForEdit ? 'Edit Legal Document' : 'Add Legal Document'}
      >
        <LegalDocumentForm 
          onClose={() => {
            setActiveSlideIn(null);
            setSelectedDocumentForEdit(null);
          }}
          onSubmit={handleDocumentSubmit}
          editDocument={selectedDocumentForEdit}
        />
      </SlideInPanel>

      <SlideInPanel
        isOpen={!!selectedHandForReplay}
        onClose={() => setSelectedHandForReplay(null)}
        title="Hand Replay"
      >
        {selectedHandForReplay && (
          <HandReplayer 
            hand={selectedHandForReplay}
            playerName={currentPlayer.name}
            playerAvatar={currentPlayer.avatar}
          />
        )}
      </SlideInPanel>
    </div>
  );
}
