import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router';
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
import { Tooltip, TooltipTrigger, TooltipContent } from '../components/ui/tooltip';
import { Users, User, LayoutGrid, TrendingUp, TrendingDown, DollarSign, Activity, Clock, Play, Network, Split, Wallet, ArrowLeftRight, ArrowUpRight, ArrowDownRight, Repeat2, CreditCard, CheckCircle, ChevronRight, Shield, ExternalLink, Grid3x3, Sparkles, MessageCircle, Trash, Send, History, Search, Command } from 'lucide-react';
import { TeamsView } from './TeamsView';
import { PaymentWalletsContent } from '../components/PokerWalletsContent';
import PaymentWalletForm, { PaymentWallet } from '../components/forms/PokerWalletForm';
import SlideInPanel from '../components/SlideInPanel';
import { RiskManagement } from '../components/RiskManagement';
import PlayerEditForm, { PlayerData, PlayerFormData } from '../components/forms/PlayerEditForm';
import MemberEditForm, { MemberData, MemberFormData } from '../components/forms/MemberEditForm';
import { DrillDownAnalytics } from '../components/DrillDownAnalytics';
import { HandReplayer, Hand } from '../components/HandReplayer';
import { WalletIcon } from '../components/WalletIcon';
import { PokerWalletIcon } from '../components/PokerWalletIcon';
import { walletImages } from '../constants/walletImages';
import { Pencil } from 'lucide-react';

interface Player {
  id: string;
  name: string;
  avatar: string;
  profitLoss: number;
  sessionTime: number;
  status: 'LIVE' | 'IN GAME' | 'Offline';
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

interface Conversation {
  id: string;
  title: string;
  messages: Array<{role: 'user' | 'assistant', content: string}>;
  createdAt: Date;
  updatedAt: Date;
}

export function AdminView() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  
  const [teams, setTeams] = useState<Team[]>([
    { id: 'team1', name: 'High Rollers', memberCount: 8, totalProfitLoss: 15420, activePlayers: 5, color: '#3b82f6', gameType: 'Cash', tableStructure: '6-max' },
    { id: 'team2', name: 'Weekend Warriors', memberCount: 12, totalProfitLoss: -3200, activePlayers: 3, color: '#10b981', gameType: 'MTT', tableStructure: '9-max' },
    { id: 'team3', name: 'Professional Squad', memberCount: 6, totalProfitLoss: 28750, activePlayers: 4, color: '#f59e0b', gameType: 'Cash', tableStructure: '9-max' },
    { id: 'team4', name: 'Grinders', memberCount: 15, totalProfitLoss: 8900, activePlayers: 7, color: '#8b5cf6', gameType: 'Cash', tableStructure: '6-max' },
  ]);

  const getRandomStatus = () => {
    const statuses: ('LIVE' | 'IN GAME' | 'Offline')[] = ['LIVE', 'IN GAME', 'Offline'];
    return statuses[Math.floor(Math.random() * statuses.length)];
  };

  const [players, setPlayers] = useState<Player[]>([
    {
      id: 'player1',
      name: 'Marcus Chen',
      avatar: 'https://images.unsplash.com/photo-1674644674031-b49db824edbc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
      profitLoss: 2450,
      sessionTime: 186,
      status: 'LIVE',
      color: '#3b82f6',
      teamId: 'team1'
    },
    {
      id: 'player2',
      name: 'Sarah Mitchell',
      avatar: 'https://images.unsplash.com/photo-1761243892035-c3e13829115a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
      profitLoss: 3200,
      sessionTime: 245,
      status: 'IN GAME',
      color: '#10b981',
      teamId: 'team1'
    },
    {
      id: 'player3',
      name: 'David Rodriguez',
      avatar: 'https://images.unsplash.com/photo-1762810211495-d79a02ba7d0d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
      profitLoss: -850,
      sessionTime: 142,
      status: 'Offline',
      color: '#f59e0b',
      teamId: 'team2'
    },
    {
      id: 'player4',
      name: 'Alex Thompson',
      avatar: 'https://images.unsplash.com/photo-1532272278764-53cd1fe53f72?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
      profitLoss: 4850,
      sessionTime: 298,
      status: 'LIVE',
      color: '#8b5cf6',
      teamId: 'team3'
    },
    {
      id: 'player5',
      name: 'Emma Wilson',
      avatar: 'https://images.unsplash.com/photo-1758518732130-4b51da74b0b6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
      profitLoss: 1800,
      sessionTime: 167,
      status: 'IN GAME',
      color: '#ec4899',
      teamId: 'team4'
    },
    {
      id: 'player6',
      name: 'James Parker',
      avatar: 'https://images.unsplash.com/photo-1769071166530-11f7857f4c59?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
      profitLoss: -1200,
      sessionTime: 203,
      status: 'IN GAME',
      color: '#06b6d4',
      teamId: 'team2'
    },
    {
      id: 'player7',
      name: 'Michael Chen',
      avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
      profitLoss: 3750,
      sessionTime: 225,
      status: 'Offline',
      color: '#f97316',
      teamId: 'team1'
    },
    {
      id: 'player8',
      name: 'Lisa Anderson',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
      profitLoss: 2100,
      sessionTime: 198,
      status: 'LIVE',
      color: '#14b8a6',
      teamId: 'team3'
    },
    {
      id: 'player9',
      name: 'Robert Kim',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
      profitLoss: -950,
      sessionTime: 178,
      status: 'IN GAME',
      color: '#a855f7',
      teamId: 'team2'
    },
    {
      id: 'player10',
      name: 'Jennifer Lee',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
      profitLoss: 5200,
      sessionTime: 312,
      status: 'LIVE',
      color: '#06b6d4',
      teamId: 'team4'
    },
    {
      id: 'player11',
      name: 'Tom Bradley',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
      profitLoss: 1650,
      sessionTime: 189,
      status: 'Offline',
      color: '#eab308',
      teamId: 'team3'
    },
    {
      id: 'player12',
      name: 'Nina Patel',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
      profitLoss: -420,
      sessionTime: 156,
      status: 'IN GAME',
      color: '#ec4899',
      teamId: 'team1'
    },
    {
      id: 'player13',
      name: 'Carlos Rivera',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
      profitLoss: 2890,
      sessionTime: 267,
      status: 'LIVE',
      color: '#22c55e',
      teamId: 'team4'
    },
    {
      id: 'player14',
      name: 'Sophia Martinez',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
      profitLoss: 3340,
      sessionTime: 234,
      status: 'IN GAME',
      color: '#3b82f6',
      teamId: 'team2'
    },
    {
      id: 'player15',
      name: 'Ryan O\'Connor',
      avatar: 'https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
      profitLoss: 1120,
      sessionTime: 145,
      status: 'Offline',
      color: '#f59e0b',
      teamId: 'team3'
    }
  ]);

  const [graphData, setGraphData] = useState<any[]>([]);
  
  // Static data for Financials section (never updates)
  const [staticGraphData, setStaticGraphData] = useState<any[]>([]);
  const [staticAdjustedPlayers, setStaticAdjustedPlayers] = useState<any[]>([]);
  const [staticTeams, setStaticTeams] = useState<any[]>([]);
  
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    timeRange: 'all',
    minPL: '',
    maxPL: '',
    playerStatus: 'all'
  });
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [analyticsSelectedPlayer, setAnalyticsSelectedPlayer] = useState<Player | null>(null);
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const [timePeriod, setTimePeriod] = useState<string>('today');
  
  // Payment Wallets state
  const [paymentWallets, setPaymentWallets] = useState<PaymentWallet[]>([
    {
      id: 'w1',
      provider: 'Skrill',
      username: 'company_skrill',
      email: 'finance@company.com',
      balance: 15420.50,
      status: 'active',
      createdAt: new Date('2026-03-01'),
      notes: 'Main company wallet'
    },
    {
      id: 'w2',
      provider: 'Neteller',
      username: 'company_neteller',
      email: 'finance@company.com',
      balance: 8250.00,
      status: 'active',
      createdAt: new Date('2026-02-28')
    },
    {
      id: 'w3',
      provider: 'Pix',
      username: '+55-11-98765-4321',
      email: 'brazil@company.com',
      balance: 0.00,
      status: 'inactive',
      createdAt: new Date('2026-02-15')
    },
    {
      id: 'w4',
      provider: 'LuxonPay',
      username: 'company_luxon',
      email: 'finance@company.com',
      balance: 12875.25,
      status: 'active',
      createdAt: new Date('2026-01-10'),
      notes: 'Secondary payment method'
    }
  ]);
  const [selectedWalletForEdit, setSelectedWalletForEdit] = useState<PaymentWallet | null>(null);
  const [activeSlideIn, setActiveSlideIn] = useState<'paymentwallet' | 'player' | 'member' | null>(null);
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [commandSearchQuery, setCommandSearchQuery] = useState('');

  // Hand replayer state
  const [selectedHandForReplay, setSelectedHandForReplay] = useState<Hand | null>(null);

  // Player/Member edit state
  const [selectedPlayerForEdit, setSelectedPlayerForEdit] = useState<PlayerData | null>(null);
  const [selectedMemberForEdit, setSelectedMemberForEdit] = useState<MemberData | null>(null);

  // AI Chat state
  const [aiQuery, setAiQuery] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [showAiModal, setShowAiModal] = useState(false);
  const aiInputRef = useRef<HTMLInputElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [conversations, setConversations] = useState<Conversation[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('admin_ai_conversations');
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

  // Members state - convert to useState for editability
  const [members, setMembers] = useState([
    {
      id: 'member1',
      name: 'John Anderson',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
      role: 'CEO',
      department: 'Executive',
      email: 'john.anderson@company.com',
      phone: '+1 (555) 123-4567',
      joinDate: new Date('2022-01-15')
    },
    {
      id: 'member2',
      name: 'Sarah Williams',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
      role: 'CFO',
      department: 'Finance',
      email: 'sarah.williams@company.com',
      phone: '+1 (555) 234-5678',
      joinDate: new Date('2022-02-20')
    },
    {
      id: 'member3',
      name: 'Michael Brown',
      avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
      role: 'Operations Manager',
      department: 'Operations',
      email: 'michael.brown@company.com',
      phone: '+1 (555) 345-6789',
      joinDate: new Date('2022-03-10')
    },
    {
      id: 'member4',
      name: 'Emily Davis',
      avatar: 'https://images.unsplash.com/photo-1607746882042-944635dfe10e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
      role: 'Finance Director',
      department: 'Finance',
      email: 'emily.davis@company.com',
      phone: '+1 (555) 456-7890',
      joinDate: new Date('2022-04-05')
    },
    {
      id: 'member5',
      name: 'David Martinez',
      avatar: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
      role: 'Compliance Officer',
      department: 'Legal',
      email: 'david.martinez@company.com',
      phone: '+1 (555) 567-8901',
      joinDate: new Date('2022-05-12')
    },
    {
      id: 'member6',
      name: 'Jessica Taylor',
      avatar: 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
      role: 'HR Manager',
      department: 'Human Resources',
      email: 'jessica.taylor@company.com',
      phone: '+1 (555) 678-9012',
      joinDate: new Date('2022-06-18')
    },
    {
      id: 'member7',
      name: 'Robert Johnson',
      avatar: 'https://images.unsplash.com/photo-1556157382-97eda2d62296?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
      role: 'IT Director',
      department: 'Technology',
      email: 'robert.johnson@company.com',
      phone: '+1 (555) 789-0123',
      joinDate: new Date('2022-07-22')
    },
    {
      id: 'member8',
      name: 'Amanda White',
      avatar: 'https://images.unsplash.com/photo-1598550874175-4d0ef436c909?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
      role: 'Marketing Director',
      department: 'Marketing',
      email: 'amanda.white@company.com',
      phone: '+1 (555) 890-1234',
      joinDate: new Date('2022-08-30')
    },
    {
      id: 'member9',
      name: 'Christopher Lee',
      avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
      role: 'Customer Support Lead',
      department: 'Support',
      email: 'christopher.lee@company.com',
      phone: '+1 (555) 901-2345',
      joinDate: new Date('2022-09-14')
    },
    {
      id: 'member10',
      name: 'Michelle Garcia',
      avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
      role: 'Accountant',
      department: 'Finance',
      email: 'michelle.garcia@company.com',
      phone: '+1 (555) 012-3456',
      joinDate: new Date('2022-10-08')
    },
    {
      id: 'member11',
      name: 'Kevin Rodriguez',
      avatar: 'https://images.unsplash.com/photo-1621784563330-caee0b138a00?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
      role: 'Legal Advisor',
      department: 'Legal',
      email: 'kevin.rodriguez@company.com',
      phone: '+1 (555) 123-4568',
      joinDate: new Date('2022-11-20')
    },
    {
      id: 'member12',
      name: 'Laura Martinez',
      avatar: 'https://images.unsplash.com/photo-1609505848912-b7c3b8b4beda?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
      role: 'Team Coordinator',
      department: 'Operations',
      email: 'laura.martinez@company.com',
      phone: '+1 (555) 234-5679',
      joinDate: new Date('2023-01-11')
    },
    {
      id: 'member13',
      name: 'Daniel Kim',
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
      role: 'Data Analyst',
      department: 'Analytics',
      email: 'daniel.kim@company.com',
      phone: '+1 (555) 345-6780',
      joinDate: new Date('2023-02-25')
    },
    {
      id: 'member14',
      name: 'Rachel Green',
      avatar: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
      role: 'Office Manager',
      department: 'Administration',
      email: 'rachel.green@company.com',
      phone: '+1 (555) 456-7891',
      joinDate: new Date('2023-03-17')
    },
    {
      id: 'member15',
      name: 'Thomas Wright',
      avatar: 'https://images.unsplash.com/photo-1552058544-f2b08422138a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
      role: 'Security Officer',
      department: 'Security',
      email: 'thomas.wright@company.com',
      phone: '+1 (555) 567-8902',
      joinDate: new Date('2023-04-29')
    }
  ]);

  // Operations state for infinite scroll
  const [operations, setOperations] = useState<any[]>([]);
  const [operationsPage, setOperationsPage] = useState(1);
  const [isLoadingOperations, setIsLoadingOperations] = useState(false);
  const [hasMoreOperations, setHasMoreOperations] = useState(true);
  const [expandedOperations, setExpandedOperations] = useState<Set<string>>(new Set());
  const operationsScrollRef = useRef<HTMLDivElement>(null);

  // Reconciliation state
  const [reconciliationItems, setReconciliationItems] = useState<any[]>([]);
  const companyWallets = ['Main Wallet', 'Bank Account', 'Credit Card'];

  const updateReconciliationItems = useCallback(() => {
    const items: any[] = [];
    operations.forEach((op) => {
      op.transactions.forEach((tx: any, txIndex: number) => {
        const toIsCompanyWallet = companyWallets.includes(tx.to);
        if (toIsCompanyWallet && tx.status === 'pending') {
          items.push({
            opId: op.id,
            opType: op.type,
            txIndex,
            player: op.player,
            amount: tx.amount,
            from: tx.from,
            fromType: tx.fromType,
            to: tx.to,
            toType: tx.toType,
            owner: tx.owner,
            status: tx.status,
            date: op.date,
            nickname: tx.nickname
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
        return { ...op, transactions: updatedTransactions, status: getOperationStatus(updatedTransactions) };
      }
      return op;
    }));
    // Remove from reconciliation list
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
        return { ...op, transactions: updatedTransactions, status: getOperationStatus(updatedTransactions) };
      }
      return op;
    }));
    // Remove from reconciliation list
    setReconciliationItems(prev => prev.filter(item => !(item.opId === opId && item.txIndex === txIndex)));
  }, []);

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
  const activePlayers = adjustedPlayers.filter(p => p.status !== 'Offline').length;
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

    // Capture static snapshot for Financials section (only once when empty)
    if (staticGraphData.length === 0) {
      setStaticGraphData(initialData);
      setStaticAdjustedPlayers(adjustedPlayers.map(p => ({
        ...p,
        profitLoss: Math.round(p.profitLoss * multiplier),
        sessionTime: Math.round(p.sessionTime * multiplier)
      })));
      setStaticTeams(teams.map(team => {
        const teamPlayers = adjustedPlayers.filter(p => p.teamId === team.id);
        const totalProfitLoss = teamPlayers.reduce((sum, p) => sum + p.profitLoss, 0);
        const activePlayers = teamPlayers.filter(p => p.status !== 'Offline').length;
        return {
          ...team,
          totalProfitLoss,
          activePlayers
        };
      }));
    }

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
        const activePlayers = teamPlayers.filter(p => p.status !== 'Offline').length;
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

    if (filters.playerStatus === 'recording' && player.status === 'Offline') return false;
    if (filters.playerStatus === 'paused' && player.status !== 'Offline') return false;
    if (filters.playerStatus === 'profitable' && player.profitLoss <= 0) return false;
    if (filters.playerStatus === 'losing' && player.profitLoss >= 0) return false;

    if (filters.minPL && player.profitLoss < parseFloat(filters.minPL)) return false;
    if (filters.maxPL && player.profitLoss > parseFloat(filters.maxPL)) return false;

    return true;
  });

  // Filtered lists for command palette
  const filteredPlayersForCommand = commandSearchQuery
    ? adjustedPlayers.filter(p => 
        p.name.toLowerCase().includes(commandSearchQuery.toLowerCase())
      )
    : [];

  const filteredOperationsForCommand = commandSearchQuery
    ? operations.filter(op => 
        op.type.toLowerCase().includes(commandSearchQuery.toLowerCase()) ||
        op.id.toLowerCase().includes(commandSearchQuery.toLowerCase()) ||
        (op.player?.name && op.player.name.toLowerCase().includes(commandSearchQuery.toLowerCase()))
      )
    : [];

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
    setActiveSlideIn(null);
  };

  // Player edit handlers
  const handleEditPlayer = (player: PlayerData) => {
    setSelectedPlayerForEdit(player);
    setActiveSlideIn('player');
  };

  const handlePlayerSubmit = (playerData: PlayerFormData) => {
    if (selectedPlayerForEdit) {
      setPlayers(prev => 
        prev.map(p => 
          p.id === selectedPlayerForEdit.id 
            ? { 
                ...p, 
                name: playerData.name,
                avatar: playerData.avatar
              }
            : p
        )
      );
    }
    setSelectedPlayerForEdit(null);
  };

  // Member edit handlers
  const handleEditMember = (member: MemberData) => {
    setSelectedMemberForEdit(member);
    setActiveSlideIn('member');
  };

  const handleMemberSubmit = (memberData: MemberFormData) => {
    if (selectedMemberForEdit) {
      setMembers(prev => 
        prev.map(m => 
          m.id === selectedMemberForEdit.id 
            ? { ...m, ...memberData }
            : m
        )
      );
    }
    setSelectedMemberForEdit(null);
  };

  // Helper function to calculate operation status from transactions
  const getOperationStatus = (transactions: any[]) => {
    const statuses = transactions.map(tx => tx.status);
    if (statuses.some(s => s === 'pending')) return 'Pending';
    if (statuses.some(s => s === 'failed')) return 'Failed';
    return 'Completed';
  };

  // Helper function to determine owner based on "To" field
  const getOwnerFromTo = (to: string) => {
    const companyAccounts = ['Main Wallet', 'Bank Account', 'Credit Card'];
    return companyAccounts.includes(to) ? 'company' : 'player';
  };

  // Generate mock operations
  const generateOperations = (page: number, count: number = 10) => {
    const types = ['Deposit', 'Withdrawal', 'Split', 'Swap'];
    const operations = [];
    
    const companyWallets = ['Main Wallet', 'Bank Account', 'Credit Card'];
    const pokerSites = ['PokerStars', 'GGPoker', '888Poker', 'PartyPoker'];
    const playerFinancialWallets = ['Skrill', 'Neteller', 'Pix', 'LuxonPay'];
    
    const getRandomStatus = (forcePending: boolean = false) => {
      if (forcePending) return 'pending';
      const rand = Math.random();
      if (rand < 0.75) return 'confirmed';
      if (rand < 0.95) return 'pending';
      return 'failed';
    };
    
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
      
      const randomPlayer = players[Math.floor(Math.random() * players.length)];
      const randomPokerSite = pokerSites[Math.floor(Math.random() * pokerSites.length)];
      const randomPlayerWallet = playerFinancialWallets[Math.floor(Math.random() * playerFinancialWallets.length)];
      const nickname = randomPlayer.name.split(' ')[0] + 'PS';
      
      // First pass: generate transactions without statuses
      let companyTxIndices: number[] = [];
      
      if (type === 'Deposit') {
        const txAmount = Math.floor(Math.random() * 2000) + 500;
        amount = txAmount;
        transactions.push({
          from: 'Main Wallet',
          fromType: 'company_wallet',
          to: randomPlayerWallet,
          toType: 'player_financial',
          amount: txAmount,
          owner: getOwnerFromTo(randomPlayerWallet)
        });
        companyTxIndices.push(0);
        transactions.push({
          from: randomPlayerWallet,
          fromType: 'player_financial',
          to: randomPokerSite,
          toType: 'poker_site',
          amount: txAmount,
          owner: getOwnerFromTo(randomPokerSite),
          nickname: nickname
        });
      } else if (type === 'Withdrawal') {
        const txAmount = Math.floor(Math.random() * 3000) + 500;
        amount = txAmount;
        transactions.push({
          from: randomPokerSite,
          fromType: 'poker_site',
          to: randomPlayerWallet,
          toType: 'player_financial',
          amount: txAmount,
          owner: getOwnerFromTo(randomPlayerWallet),
          nickname: nickname
        });
        transactions.push({
          from: randomPlayerWallet,
          fromType: 'player_financial',
          to: 'Bank Account',
          toType: 'external',
          amount: txAmount,
          owner: getOwnerFromTo('Bank Account')
        });
        companyTxIndices.push(1);
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
          nickname: nickname
        });
        
        transactions.push({
          from: randomPlayerWallet,
          fromType: 'player_financial',
          to: 'Bank Account',
          toType: 'player_account',
          amount: playerShare,
          owner: getOwnerFromTo('Bank Account')
        });
        companyTxIndices.push(1);
        
        transactions.push({
          from: randomPlayerWallet,
          fromType: 'player_financial',
          to: 'Bank Account',
          toType: 'house_account',
          amount: houseShare,
          owner: getOwnerFromTo('Bank Account')
        });
        companyTxIndices.push(2);
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
          owner: getOwnerFromTo(toWallet)
        });
      }
      
      // Second pass: assign statuses with 1-3 pending for company transactions
      const numPending = Math.min(companyTxIndices.length, Math.floor(Math.random() * 3) + 1);
      const pendingIndices = companyTxIndices.sort(() => Math.random() - 0.5).slice(0, numPending);
      
      transactions.forEach((tx, index) => {
        tx.status = pendingIndices.includes(index) ? 'pending' : getRandomStatus();
      });
      
      operations.push({
        id: `OP-${opNumber.toString().padStart(6, '0')}`,
        type,
        date,
        amount,
        transactions,
        status: getOperationStatus(transactions),
        player: randomPlayer
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

  const getWalletIcon = (type: string, name: string) => {
    if (type === 'external') {
      if (name.includes('Bank') || name.includes('Wire')) {
        return (
          <div className="w-6 h-6 bg-gray-100 rounded flex items-center justify-center">
            <DollarSign className="w-4 h-4 text-gray-600" />
          </div>
        );
      }
      if (name.includes('Card')) {
        return (
          <div className="w-6 h-6 bg-gray-100 rounded flex items-center justify-center">
            <CreditCard className="w-4 h-4 text-gray-600" />
          </div>
        );
      }
    }
    if (type === 'company_wallet') {
      return (
        <div className="w-6 h-6 bg-blue-100 rounded flex items-center justify-center">
          <Wallet className="w-4 h-4 text-blue-600" />
        </div>
      );
    }
    if (type === 'player_financial') {
      const walletKey = name as 'Skrill' | 'Neteller' | 'Pix' | 'LuxonPay';
      if (walletImages[name]) {
        return <WalletIcon type={walletKey} className="w-6 h-6" />;
      }
      return (
        <div className="w-6 h-6 bg-blue-100 rounded flex items-center justify-center">
          <Wallet className="w-4 h-4 text-blue-600" />
        </div>
      );
    }
    if (type === 'poker_site') {
      const platformKey = name as 'PokerStars' | 'GGPoker' | '888Poker' | 'PartyPoker';
      if (walletImages[name]) {
        return <PokerWalletIcon platform={platformKey} size="sm" className="w-6 h-6" />;
      }
    }
    if (type === 'player_account') {
      return (
        <div className="w-6 h-6 bg-green-100 rounded flex items-center justify-center">
          <DollarSign className="w-4 h-4 text-green-600" />
        </div>
      );
    }
    if (type === 'house_account') {
      return (
        <div className="w-6 h-6 bg-gray-100 rounded flex items-center justify-center">
          <DollarSign className="w-4 h-4 text-gray-600" />
        </div>
      );
    }
    if (type === 'wallet') {
      return (
        <div className="w-6 h-6 bg-blue-100 rounded flex items-center justify-center">
          <Wallet className="w-4 h-4 text-blue-600" />
        </div>
      );
    }
    if (type === 'profit') {
      return (
        <div className="w-6 h-6 bg-purple-100 rounded flex items-center justify-center">
          <DollarSign className="w-4 h-4 text-purple-600" />
        </div>
      );
    }
    if (type === 'player') {
      return (
        <div className="w-6 h-6 bg-blue-100 rounded flex items-center justify-center">
          <Users className="w-4 h-4 text-blue-600" />
        </div>
      );
    }
    if (type === 'house') {
      return (
        <div className="w-6 h-6 bg-gray-100 rounded flex items-center justify-center">
          <DollarSign className="w-4 h-4 text-gray-600" />
        </div>
      );
    }
    if (type === 'platform') {
      const platformKey = name as 'PokerStars' | 'GGPoker' | '888Poker' | 'PartyPoker';
      if (walletImages[name]) {
        return <PokerWalletIcon platform={platformKey} size="sm" className="w-6 h-6" />;
      }
    }
    return (
      <div className="w-6 h-6 bg-gray-100 rounded flex items-center justify-center">
        <Wallet className="w-4 h-4 text-gray-600" />
      </div>
    );
  };

  const getStatusIcon = (status: string) => {
    if (status === 'confirmed') {
      return (
        <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center" title="Confirmed">
          <CheckCircle className="w-3 h-3 text-green-600" />
        </div>
      );
    }
    if (status === 'pending') {
      return (
        <div className="w-5 h-5 bg-yellow-100 rounded-full flex items-center justify-center" title="Pending">
          <Clock className="w-3 h-3 text-yellow-600" />
        </div>
      );
    }
    if (status === 'failed') {
      return (
        <div className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center" title="Failed">
          <svg className="w-3 h-3 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
      );
    }
    return null;
  };

  const getOwnerBadge = (owner: string) => {
    if (owner === 'player') {
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-700 bg-blue-50 px-2 py-1 rounded border border-blue-200">
          <User className="w-3 h-3" />
          Player
        </span>
      );
    }
    if (owner === 'company') {
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-700 bg-gray-100 px-2 py-1 rounded border border-gray-200">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          Company
        </span>
      );
    }
    return null;
  };

  const getWalletWithLink = (walletName: string, walletType: string, nickname?: string, skipIcon: boolean = false) => {
    const isPokerSite = ['PokerStars', 'GGPoker', '888Poker', 'PartyPoker'].includes(walletName);
    const isPlayerFinancial = ['Skrill', 'Neteller', 'Pix', 'LuxonPay'].includes(walletName);

    if (isPokerSite && nickname) {
      if (skipIcon) {
        return <span className="text-sm text-gray-700 font-medium">{nickname}</span>;
      }
      const platformKey = walletName as 'PokerStars' | 'GGPoker' | '888Poker' | 'PartyPoker';
      return (
        <div className="flex items-center gap-1.5">
          <PokerWalletIcon platform={platformKey} size="sm" className="w-6 h-6" />
          <span className="text-sm text-gray-700 font-medium">{nickname}</span>
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
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => window.open(generatePaymentLink(walletName), '_blank')}
                className="inline-flex items-center gap-1 hover:text-gray-900 transition-colors"
              >
                <span className="text-sm text-gray-600">{walletName}</span>
                <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="top" className="bg-gray-900 text-white text-xs max-w-xs break-all">
              <div className="font-mono text-[10px]">{generatePaymentLink(walletName)}</div>
            </TooltipContent>
          </Tooltip>
        );
      }
      
      const walletKey = walletName as 'Skrill' | 'Neteller' | 'Pix' | 'LuxonPay';
      return (
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={() => window.open(generatePaymentLink(walletName), '_blank')}
              className="inline-flex items-center gap-1 hover:text-gray-900 transition-colors"
            >
              <WalletIcon type={walletKey} className="w-5 h-5" />
              <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="top" className="bg-gray-900 text-white text-xs max-w-xs break-all">
            <div className="font-mono text-[10px]">{generatePaymentLink(walletName)}</div>
          </TooltipContent>
        </Tooltip>
      );
    }

    return <span className="text-sm text-gray-600">{walletName}</span>;
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

  // Save conversations to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('admin_ai_conversations', JSON.stringify(conversations));
    }
  }, [conversations]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (showAiModal) {
          setShowAiModal(false);
        } else {
          setShowCommandPalette(prev => !prev);
        }
      }
      if (e.key === 'Escape') {
        if (showAiModal) {
          setShowAiModal(false);
        }
        if (showCommandPalette) {
          setShowCommandPalette(false);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showAiModal, showCommandPalette]);

  // Focus input when modal opens
  useEffect(() => {
    if (showAiModal && aiInputRef.current) {
      aiInputRef.current.focus();
    }
  }, [showAiModal]);

  // Conversation management
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
    return formatDate(date);
  };

  const handleAiQuery = async () => {
    if (!aiQuery.trim()) return;
    
    const userMessage = aiQuery.trim();
    let convId = currentConversationId;
    let conv = conversations.find(c => c.id === convId);
    
    if (!conv) {
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
    
    setTimeout(() => {
      const query = userMessage.toLowerCase();
      let response = '';
      
      if (query.includes('total') || query.includes('pl') || query.includes('profit')) {
        const topPlayer = [...adjustedPlayers].sort((a, b) => b.profitLoss - a.profitLoss)[0];
        const winningPlayers = adjustedPlayers.filter(p => p.profitLoss > 0).length;
        const losingPlayers = adjustedPlayers.filter(p => p.profitLoss < 0).length;
        response = `**Company P/L Overview**\n\n• Total P/L: ${totalProfitLoss >= 0 ? '+' : ''}$${totalProfitLoss.toLocaleString()}\n• Active Players: ${activePlayers}\n• Total Sessions: ${totalSessions}\n• Average P/L: ${avgProfit >= 0 ? '+' : ''}$${avgProfit.toFixed(0)}\n\n**Performance**\n• Winning Players: ${winningPlayers}\n• Losing Players: ${losingPlayers}\n\n**Top Performer**\n• ${topPlayer.name}: ${topPlayer.profitLoss >= 0 ? '+' : ''}$${topPlayer.profitLoss.toLocaleString()}`;
      } else if (query.includes('top') || query.includes('best') || query.includes('player')) {
        const sortedPlayers = [...adjustedPlayers].sort((a, b) => b.profitLoss - a.profitLoss);
        const top3 = sortedPlayers.slice(0, 3);
        const bottom3 = sortedPlayers.slice(-3).reverse();
        response = `**Top & Bottom Players**\n\n**Top 3 Performers**\n${top3.map((p, i) => `${i + 1}. ${p.name}: ${p.profitLoss >= 0 ? '+' : ''}$${p.profitLoss.toLocaleString()}`).join('\n')}\n\n**Bottom 3**\n${bottom3.map((p, i) => `${sortedPlayers.length - 2 + i}. ${p.name}: ${p.profitLoss >= 0 ? '+' : ''}$${p.profitLoss.toLocaleString()}`).join('\n')}`;
      } else if (query.includes('team')) {
        const sortedTeams = [...teams].sort((a, b) => b.totalProfitLoss - a.totalProfitLoss);
        response = `**Team Performance**\n\n${sortedTeams.map((t, i) => `${i + 1}. ${t.name}\n   P/L: ${t.totalProfitLoss >= 0 ? '+' : ''}$${t.totalProfitLoss.toLocaleString()}\n   Active: ${t.activePlayers}/${t.memberCount} players`).join('\n\n')}`;
      } else if (query.includes('risk')) {
        const riskyPlayers = adjustedPlayers.filter(p => p.profitLoss < -1000);
        const atRiskAmount = riskyPlayers.reduce((sum, p) => sum + Math.abs(p.profitLoss), 0);
        response = `**Risk Overview**\n\n• Players at Risk: ${riskyPlayers.length}\n• Total Negative P/L: -$${atRiskAmount.toLocaleString()}\n\n${riskyPlayers.length > 0 ? `**Players Needing Attention**\n${riskyPlayers.slice(0, 5).map(p => `• ${p.name}: ${p.profitLoss >= 0 ? '+' : ''}$${p.profitLoss.toLocaleString()}`).join('\n')}` : 'No critical risk indicators.'}`;
      } else if (query.includes('operation') || query.includes('recent')) {
        const pendingOps = operations.filter(op => op.status === 'Pending').length;
        const recentOps = operations.slice(0, 5);
        response = `**Operations Summary**\n\n• Total Operations: ${operations.length}\n• Pending: ${pendingOps}\n\n**Recent Operations**\n${recentOps.map(op => `• ${op.type}: $${op.amount.toLocaleString()} (${op.status})`).join('\n')}`;
      } else if (query.includes('wallet')) {
        const totalWalletBalance = paymentWallets.reduce((sum, w) => sum + (w.balance || 0), 0);
        const activeWallets = paymentWallets.filter(w => w.status === 'active').length;
        response = `**Wallet Status**\n\n• Active Wallets: ${activeWallets}\n• Total Balance: $${totalWalletBalance.toLocaleString()}\n\n${paymentWallets.map(w => `• ${w.provider}: ${w.status === 'active' ? '$' + (w.balance || 0).toLocaleString() : 'Inactive'}`).join('\n')}`;
      } else if (query.includes('summary')) {
        response = `**Executive Summary**\n\n• Company P/L: ${totalProfitLoss >= 0 ? '+' : ''}$${totalProfitLoss.toLocaleString()}\n• Active Players: ${activePlayers}\n• Teams: ${teams.length}\n• Total Members: ${members.length}\n\n**Quick Stats**\n• Winning Sessions: ${adjustedPlayers.filter(p => p.profitLoss > 0).length} players\n• Pending Operations: ${operations.filter(op => op.status === 'Pending').length}`;
      } else {
        response = "I'm your admin assistant. Ask me about:\n\n• **Total P/L?** - Company profit/loss overview\n• **Top player?** - Best performing players\n• **Team stats?** - Team performance breakdown\n• **Risk?** - Risk management overview\n• **Operations?** - Recent operations summary\n• **Wallets?** - Payment wallet status\n• **Summary?** - Executive summary";
      }
      
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
      
      setTimeout(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }, 1500);
  };

  // Get current conversation
  const currentConversation = conversations.find(c => c.id === currentConversationId);
  const currentMessages = currentConversation?.messages || [];

  const renderAiWidget = () => (
    <>
      {/* Floating Action Button */}
      {!showAiModal && (
        <button
          onClick={() => setShowAiModal(true)}
          className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-gray-900 hover:bg-gray-800 shadow-lg transition-all duration-200 hover:scale-105 flex items-center justify-center"
          title="Open AI Assistant (Ctrl+K)"
        >
          <MessageCircle className="w-6 h-6 text-white" />
          {conversations.length > 0 && (
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full border-2 border-white"></div>
          )}
        </button>
      )}

      {/* Chat Widget Panel */}
      {showAiModal && (
        <div className="fixed bottom-6 right-6 z-50 w-[420px] h-[560px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden animate-slideUp">
          {/* Header */}
          <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-gray-900 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Admin Assistant</h3>
                <p className="text-xs text-gray-500">Company insights</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {conversations.length > 0 && (
                <div className="relative">
                  <button
                    onClick={() => setShowConversationList(!showConversationList)}
                    className="w-8 h-8 rounded-lg hover:bg-gray-200 flex items-center justify-center transition-colors"
                    title="View conversations"
                  >
                    <History className="w-4 h-4 text-gray-600" />
                  </button>
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
              {currentMessages.length === 0 && !isAiLoading && (
                <div className="flex flex-col items-center justify-center h-full text-center px-2">
                  <div className="w-14 h-14 rounded-xl bg-gray-900 flex items-center justify-center mb-4">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="text-base font-semibold text-gray-900 mb-2">Admin Assistant</h4>
                  <p className="text-sm text-gray-500 mb-5 max-w-[280px]">
                    Get insights on company performance, players, teams, and more.
                  </p>
                  
                  {/* Quick Actions */}
                  <div className="grid grid-cols-2 gap-2 w-full max-w-sm">
                    {[
                      { q: "Total P/L?", icon: "💰" },
                      { q: "Top player?", icon: "🏆" },
                      { q: "Team stats?", icon: "👥" },
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
                      A
                    </div>
                  )}
                </div>
              ))}

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
                  placeholder="Ask about performance, teams..."
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

  return (
    <div className="space-y-0 relative">
      {renderAiWidget()}
      
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
        <Tabs defaultValue="financials" className="w-full" onValueChange={setActiveTab}>
        <div className="flex items-center justify-between mb-6">
          <TabsList className="bg-white border border-gray-200 p-1 gap-1">
            <TabsTrigger value="financials" className="flex items-center gap-2 px-4 py-3 data-[state=active]:bg-gray-900 data-[state=active]:text-white">
              <DollarSign className="w-4 h-4" />
              Financials
            </TabsTrigger>
            <TabsTrigger value="overview" className="flex items-center gap-2 px-4 py-3 data-[state=active]:bg-gray-900 data-[state=active]:text-white">
              <Activity className="w-4 h-4" />
              Live
              <span className="ml-1.5 px-1.5 py-0.5 text-[10px] font-bold bg-yellow-400 text-yellow-900 data-[state=active]:bg-white/20 data-[state=active]:text-white/90 rounded">Beta</span>
            </TabsTrigger>
            <TabsTrigger value="teams" className="flex items-center gap-2 px-4 py-3 data-[state=active]:bg-gray-900 data-[state=active]:text-white">
              <Users className="w-4 h-4" />
              Teams
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2 px-4 py-3 data-[state=active]:bg-gray-900 data-[state=active]:text-white">
              <Grid3x3 className="w-4 h-4" />
              Analytics
              <span className="ml-1.5 px-1.5 py-0.5 text-[10px] font-bold bg-yellow-400 text-yellow-900 data-[state=active]:bg-white/20 data-[state=active]:text-white/90 rounded">Beta</span>
            </TabsTrigger>
            <TabsTrigger value="operations" className="flex items-center gap-2 px-4 py-3 data-[state=active]:bg-gray-900 data-[state=active]:text-white">
              <ArrowLeftRight className="w-4 h-4" />
              Operations
            </TabsTrigger>
            <TabsTrigger value="wallets" className="flex items-center gap-2 px-4 py-3 data-[state=active]:bg-gray-900 data-[state=active]:text-white">
              <Wallet className="w-4 h-4" />
              Wallets
            </TabsTrigger>
            <TabsTrigger value="players" className="flex items-center gap-2 px-4 py-3 data-[state=active]:bg-gray-900 data-[state=active]:text-white">
              <User className="w-4 h-4" />
              Players
            </TabsTrigger>
            <TabsTrigger value="members" className="flex items-center gap-2 px-4 py-3 data-[state=active]:bg-gray-900 data-[state=active]:text-white">
              <Users className="w-4 h-4" />
              Members
            </TabsTrigger>
            <TabsTrigger value="risk" className="flex items-center gap-2 px-4 py-3 data-[state=active]:bg-gray-900 data-[state=active]:text-white">
              <Shield className="w-4 h-4" />
              Risk Management
            </TabsTrigger>
          </TabsList>
          
          {/* Quick Actions Button */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowCommandPalette(true)}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-md hover:bg-gray-50 hover:border-gray-300 transition-colors"
            >
              <Command className="w-4 h-4" />
              <span>Quick Actions</span>
              <kbd className="ml-1 px-1.5 py-0.5 text-[10px] font-semibold text-gray-500 bg-gray-100 border border-gray-200 rounded">K</kbd>
            </button>
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
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
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
                                    {player.status === 'LIVE' && (
                                      <div className="flex items-center gap-0.5">
                                        <div className="w-1 h-1 bg-red-500 rounded-full animate-pulse"></div>
                                        <span className="text-[8px] text-red-600 font-medium">LIVE</span>
                                      </div>
                                    )}
                                    {player.status === 'IN GAME' && (
                                      <div className="flex items-center gap-0.5">
                                        <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
                                        <span className="text-[8px] text-blue-600 font-medium">IN GAME</span>
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
        </TabsContent>

        <TabsContent value="financials" className="space-y-3">
          {/* 70/30 Split: P/L Performance & Financial Summary */}
          <div className="grid grid-cols-1 lg:grid-cols-10 gap-3">
            {/* LEFT SIDE - P/L Performance (70%) */}
            <div className="lg:col-span-7 space-y-3">
              {/* Company-Wide Consolidated P/L Chart - Static */}
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-gray-50 to-gray-100">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 bg-green-500 rounded-full"></div>
                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Company-Wide P/L Performance</h3>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`text-xl font-bold ${staticTeams.reduce((sum, t) => sum + t.totalProfitLoss, 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {staticTeams.reduce((sum, t) => sum + t.totalProfitLoss, 0) >= 0 ? '+' : ''}${staticTeams.reduce((sum, t) => sum + t.totalProfitLoss, 0).toLocaleString()}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <PLGraph data={staticGraphData} players={staticAdjustedPlayers} showLegend={false} height={280} />
                </div>
              </div>

              {/* Hierarchical Team & Player P/L Charts - Static */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {staticTeams.map(team => {
                  const teamPlayers = staticAdjustedPlayers.filter(p => p.teamId === team.id);
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
                            data={staticGraphData} 
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
                                    {player.status === 'LIVE' && (
                                      <div className="flex items-center gap-0.5">
                                        <div className="w-1 h-1 bg-red-500 rounded-full"></div>
                                        <span className="text-[8px] text-red-600 font-medium">LIVE</span>
                                      </div>
                                    )}
                                    {player.status === 'IN GAME' && (
                                      <div className="flex items-center gap-0.5">
                                        <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
                                        <span className="text-[8px] text-blue-600 font-medium">IN GAME</span>
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
                                  data={staticGraphData} 
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

            {/* RIGHT SIDE - Financial Summary (30%) */}
            <div className="lg:col-span-3 lg:sticky lg:top-6 space-y-3">
              {/* Financial Summary Cards */}
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
                  <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wide">Financial Summary</h4>
                </div>
                <div className="p-4 space-y-4">
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Total Deposits</div>
                    <div className="text-lg font-bold text-blue-600">$125,450</div>
                    <div className="text-[10px] text-gray-400 mt-0.5">Last 30 days</div>
                  </div>
                  <div className="border-t border-gray-100 pt-4">
                    <div className="text-xs text-gray-500 mb-1">Total Withdrawals</div>
                    <div className="text-lg font-bold text-red-600">$89,320</div>
                    <div className="text-[10px] text-gray-400 mt-0.5">Last 30 days</div>
                  </div>
                  <div className="border-t border-gray-100 pt-4">
                    <div className="text-xs text-gray-500 mb-1">Net Cash Flow</div>
                    <div className="text-lg font-bold text-green-600">+$36,130</div>
                    <div className="text-[10px] text-gray-400 mt-0.5">Last 30 days</div>
                  </div>
                  <div className="border-t border-gray-100 pt-4">
                    <div className="text-xs text-gray-500 mb-1">Avg P/L per Player</div>
                    <div className="text-lg font-bold text-gray-900">${Math.round(staticTeams.reduce((sum, t) => sum + t.totalProfitLoss, 0) / staticAdjustedPlayers.length).toLocaleString()}</div>
                    <div className="text-[10px] text-gray-400 mt-0.5">All time</div>
                  </div>
                </div>
              </div>

              {/* Frozen Wallet Performance Summary */}
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wide">Wallet Performance</h4>
                    <span className="text-[10px] text-gray-400">Static view</span>
                  </div>
                </div>
                <div className="p-3 space-y-2">
                  {paymentWallets.slice(0, 4).map((wallet) => (
                    <div key={wallet.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div className="flex items-center gap-2">
                        <WalletIcon type={wallet.provider as 'Skrill' | 'Neteller' | 'Pix' | 'LuxonPay'} className="w-8 h-8" />
                        <div>
                          <div className="text-xs font-semibold text-gray-900">{wallet.provider}</div>
                          <div className="text-[10px] text-gray-500">{wallet.username}</div>
                        </div>
                      </div>
                      <div className="text-sm font-bold text-gray-900">
                        ${wallet.balance.toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Frozen Recent Splits Summary */}
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wide">Recent Splits</h4>
                    <span className="text-[10px] text-gray-400">Static view</span>
                  </div>
                </div>
                <div className="p-3 space-y-2">
                  {players.slice(0, 4).map((player) => {
                    const splitAmount = Math.abs(Math.round(player.profitLoss * 0.5));
                    return (
                      <div key={player.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <div className="flex items-center gap-2">
                          <img src={player.avatar} alt={player.name} className="w-6 h-6 rounded-full border border-gray-200" />
                          <div>
                            <div className="text-xs font-semibold text-gray-900">{player.name}</div>
                            <div className="text-[10px] text-gray-500">Split</div>
                          </div>
                        </div>
                        <div className="text-sm font-bold text-green-600">
                          +${splitAmount.toLocaleString()}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="teams">
          {/* Teams Table */}
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Teams</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide bg-gray-50">Team</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide bg-gray-50">Game Type</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide bg-gray-50">Table</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide bg-gray-50">Members</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide bg-gray-50">Active</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wide bg-gray-50">Total P/L</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {teams.map(team => (
                    <tr key={team.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-10 h-10 rounded-lg flex items-center justify-center"
                            style={{ backgroundColor: team.color + '20' }}
                          >
                            <Users className="w-5 h-5" style={{ color: team.color }} />
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-gray-900">{team.name}</div>
                            <div className="flex items-center gap-1 mt-0.5">
                              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: team.color }}></div>
                              <span className="text-xs text-gray-500">Team Color</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded text-xs font-bold ${
                          team.gameType === 'Cash' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                        }`}>
                          {team.gameType}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center px-2.5 py-1 rounded bg-gray-200 text-gray-700 text-xs font-semibold">
                          {team.tableStructure}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm font-medium text-gray-900">{team.memberCount}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm font-medium text-gray-900">{team.activePlayers}</div>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className={`text-sm font-bold ${team.totalProfitLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {team.totalProfitLoss >= 0 ? '+' : ''}${team.totalProfitLoss.toLocaleString()}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <select
                  value={analyticsSelectedPlayer?.id || 'company'}
                  onChange={(e) => {
                    if (e.target.value === 'company') {
                      setAnalyticsSelectedPlayer(null);
                    } else {
                      const player = players.find(p => p.id === e.target.value);
                      setAnalyticsSelectedPlayer(player || null);
                    }
                  }}
                  className="px-4 py-2 text-sm border border-gray-200 rounded-lg bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-colors cursor-pointer"
                >
                  <option value="company">Company-Wide Analytics</option>
                  {players.map(player => (
                    <option key={player.id} value={player.id}>{player.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <DrillDownAnalytics 
              playerId={analyticsSelectedPlayer?.id}
              playerName={analyticsSelectedPlayer?.name}
              isCompanyWide={!analyticsSelectedPlayer}
              onHandClick={setSelectedHandForReplay}
            />
          </div>
        </TabsContent>

        <TabsContent value="operations" className="h-[calc(100vh-280px)]">
          <div className="grid grid-cols-10 gap-4 h-full">
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
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide bg-gray-50">Player</th>
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
                            <div className="flex items-center gap-2">
                              <img 
                                src={operation.player.avatar} 
                                alt={operation.player.name}
                                className="w-8 h-8 rounded-full border border-gray-200 object-cover"
                              />
                              <div>
                                <div className="text-sm font-medium text-gray-900">{operation.player.name}</div>
                                <div className="text-xs text-gray-500">{teams.find(t => t.id === operation.player.teamId)?.name || 'No Team'}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="text-sm text-gray-900">{formatDate(operation.date)}</div>
                            <div className="text-xs text-gray-500">{formatTime(operation.date)}</div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="text-sm font-bold text-gray-900">
                              ${operation.amount.toLocaleString()}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="text-sm text-gray-900">{operation.transactions.length} transaction{operation.transactions.length !== 1 ? 's' : ''}</div>
                          </td>
                          <td className="px-4 py-3">
                            {operation.status === 'Completed' && (
                              <span className="inline-flex items-center gap-1 text-xs font-medium text-green-700 bg-green-50 px-2 py-1 rounded border border-green-200">
                                <CheckCircle className="w-3 h-3" />
                                Completed
                              </span>
                            )}
                            {operation.status === 'Pending' && (
                              <span className="inline-flex items-center gap-1 text-xs font-medium text-yellow-700 bg-yellow-50 px-2 py-1 rounded border border-yellow-200">
                                <Clock className="w-3 h-3" />
                                Pending
                              </span>
                            )}
                            {operation.status === 'Failed' && (
                              <span className="inline-flex items-center gap-1 text-xs font-medium text-red-700 bg-red-50 px-2 py-1 rounded border border-red-200">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                                Failed
                              </span>
                            )}
                          </td>
                        </tr>
                        
                        {/* Sub-transactions - Only show when expanded */}
                        {isExpanded && (
                          <tr className="bg-gray-50">
                            <td colSpan={6} className="px-4 py-0">
                              <div className="pl-12 py-2 space-y-1">
                                {operation.transactions.map((tx: any, txIndex: number) => (
                                  <div key={txIndex} className="flex items-center justify-between py-2.5 px-4 bg-white rounded border border-gray-200">
                                    <div className="flex items-center gap-3">
                                      {getWalletIcon(tx.fromType, tx.from)}
                                      {getWalletWithLink(tx.from, tx.fromType, tx.nickname, true)}
                                      <span className="text-sm text-gray-400 mx-1">→</span>
                                      {getWalletIcon(tx.toType, tx.to)}
                                      {getWalletWithLink(tx.to, tx.toType, tx.nickname, true)}
                                    </div>
                                    <div className="flex items-center gap-3">
                                      {getOwnerBadge(tx.owner)}
                                      {getStatusIcon(tx.status)}
                                      <span className="text-sm font-semibold text-gray-900">${tx.amount.toLocaleString()}</span>
                                    </div>
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
                      <td colSpan={6} className="px-4 py-8 text-center">
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
                      <td colSpan={6} className="px-4 py-6 text-center">
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
              <div className="flex-1 overflow-y-auto p-3 space-y-2">
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
                        <div className="flex items-center gap-2 mb-2">
                          <img 
                            src={item.player.avatar} 
                            alt={item.player.name}
                            className="w-5 h-5 rounded-full border border-gray-200"
                          />
                          <span className="text-xs text-gray-700 truncate">{item.player.name}</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-500 mb-3">
                          {getWalletIcon(item.fromType, item.from)}
                          {getWalletWithLink(item.from, item.fromType, item.nickname, true)}
                          <span>→</span>
                          {getWalletIcon(item.toType, item.to)}
                          {getWalletWithLink(item.to, item.toType, item.nickname, true)}
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              approveTransaction(item.opId, item.txIndex);
                            }}
                            className="flex-1 inline-flex items-center justify-center gap-1 px-2 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-medium rounded transition-colors"
                          >
                            <CheckCircle className="w-3 h-3" />
                            Approve
                          </button>
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

        <TabsContent value="wallets">
          <PaymentWalletsContent
            wallets={paymentWallets}
            onEdit={handleEditWallet}
            onDelete={handleDeleteWallet}
          />
        </TabsContent>

        <TabsContent value="players" className="space-y-3">
          {/* Players Table - With filters and View Session */}
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Players</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide bg-gray-50">Player</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide bg-gray-50">Team</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide bg-gray-50">Status</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wide bg-gray-50">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredPlayers.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-4 py-12 text-center">
                        <p className="text-gray-500">No players match your current filters</p>
                      </td>
                    </tr>
                  ) : (
                    filteredPlayers.map(player => {
                      const team = teams.find(t => t.id === player.teamId);
                      const playerData: PlayerData = {
                        id: player.id,
                        name: player.name,
                        avatar: player.avatar
                      };
                      return (
                        <tr key={player.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <img 
                                src={player.avatar} 
                                alt={player.name}
                                className="w-10 h-10 rounded-full border border-gray-200 object-cover"
                              />
                              <div>
                                <div className="text-sm font-semibold text-gray-900">{player.name}</div>
                                <div className="text-xs text-gray-500">ID: {player.id}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            {team && (
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: team.color }}></div>
                                <span className="text-sm text-gray-900">{team.name}</span>
                              </div>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            {player.status === 'LIVE' && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-red-50 text-red-700 text-xs font-medium">
                                <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></div>
                                LIVE
                              </span>
                            )}
                            {player.status === 'IN GAME' && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-blue-50 text-blue-700 text-xs font-medium">
                                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                                IN GAME
                              </span>
                            )}
                            {player.status === 'Offline' && (
                              <span className="inline-flex items-center px-2.5 py-1 rounded bg-gray-100 text-gray-600 text-xs font-medium">
                              Offline
                            </span>
                          )}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center justify-center gap-2">
                              {player.status !== 'Offline' && (
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <button
                                      onClick={() => setSelectedPlayer(player)}
                                      className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
                                    >
                                      <Play className="w-4 h-4" />
                                    </button>
                                  </TooltipTrigger>
                                  <TooltipContent side="left">
                                    <span>View Session</span>
                                  </TooltipContent>
                                </Tooltip>
                              )}
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <button
                                    onClick={() => handleEditPlayer(playerData)}
                                    className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
                                  >
                                    <Pencil className="w-4 h-4" />
                                  </button>
                                </TooltipTrigger>
                                <TooltipContent side="left">
                                  <span>Edit</span>
                                </TooltipContent>
                              </Tooltip>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="members">
          {/* Members Table - For backoffice/management */}
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Team Members</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide bg-gray-50">Name</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide bg-gray-50">Role</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide bg-gray-50">Department</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide bg-gray-50">Email</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide bg-gray-50">Phone</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide bg-gray-50">Join Date</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wide bg-gray-50">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {members.map(member => {
                    const memberData: MemberData = {
                      id: member.id,
                      name: member.name,
                      avatar: member.avatar,
                      role: member.role,
                      department: member.department,
                      email: member.email,
                      phone: member.phone,
                      joinDate: member.joinDate
                    };
                    return (
                      <tr key={member.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <img 
                              src={member.avatar} 
                              alt={member.name}
                              className="w-10 h-10 rounded-full border border-gray-200 object-cover"
                            />
                            <div>
                              <div className="text-sm font-semibold text-gray-900">{member.name}</div>
                              <div className="text-xs text-gray-500">ID: {member.id}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="inline-flex items-center px-2.5 py-1 rounded bg-blue-50 text-blue-700 text-xs font-medium">
                            {member.role}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-sm text-gray-900">{member.department}</div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-sm text-gray-700">{member.email}</div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-sm text-gray-700">{member.phone}</div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-sm text-gray-900">
                            {member.joinDate.toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric', 
                              year: 'numeric' 
                            })}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button
                                onClick={() => handleEditMember(memberData)}
                                className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
                              >
                                <Pencil className="w-4 h-4" />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent side="left">
                              <span>Edit</span>
                            </TooltipContent>
                          </Tooltip>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="risk">
          <RiskManagement />
        </TabsContent>
      </Tabs>

        {selectedPlayer && (
          <PlayerSessionModal
            player={selectedPlayer}
            isOpen={!!selectedPlayer}
            onClose={() => setSelectedPlayer(null)}
          />
        )}

        {/* Slide-In Panel for Wallet Form */}
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

        {/* Slide-In Panel for Player Edit */}
        <SlideInPanel
          isOpen={activeSlideIn === 'player'}
          onClose={() => {
            setActiveSlideIn(null);
            setSelectedPlayerForEdit(null);
          }}
          title={selectedPlayerForEdit ? 'Edit Player' : 'Add Player'}
        >
          <PlayerEditForm
            onClose={() => {
              setActiveSlideIn(null);
              setSelectedPlayerForEdit(null);
            }}
            onSubmit={handlePlayerSubmit}
            editPlayer={selectedPlayerForEdit}
          />
        </SlideInPanel>

        {/* Slide-In Panel for Member Edit */}
        <SlideInPanel
          isOpen={activeSlideIn === 'member'}
          onClose={() => {
            setActiveSlideIn(null);
            setSelectedMemberForEdit(null);
          }}
          title={selectedMemberForEdit ? 'Edit Member' : 'Add Member'}
        >
          <MemberEditForm
            onClose={() => {
              setActiveSlideIn(null);
              setSelectedMemberForEdit(null);
            }}
            onSubmit={handleMemberSubmit}
            editMember={selectedMemberForEdit}
          />
        </SlideInPanel>

        {/* Slide-In Panel for Hand Replayer */}
        <SlideInPanel
          isOpen={!!selectedHandForReplay}
          onClose={() => setSelectedHandForReplay(null)}
          title="Hand Replay"
        >
          {selectedHandForReplay && (
            <HandReplayer 
              hand={selectedHandForReplay}
              playerName={analyticsSelectedPlayer?.name}
            />
          )}
        </SlideInPanel>

        {/* Command Palette */}
        {showCommandPalette && (
          <>
            <div 
              className="fixed inset-0 bg-black/50 z-50 animate-fadeIn"
              onClick={() => setShowCommandPalette(false)}
            />
            <div className="fixed top-[15%] left-1/2 -translate-x-1/2 w-full max-w-2xl z-50 animate-fadeIn">
              <div className="bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden">
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

                <div className="p-2 border-b border-gray-100">
                  <button
                    onClick={() => {
                      setShowCommandPalette(false);
                      setSelectedPlayerForEdit(null);
                      setActiveSlideIn('player');
                    }}
                    className="w-full px-4 py-3 text-left rounded-lg hover:bg-gray-50 flex items-center gap-3 transition-colors group"
                  >
                    <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                      <Users className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-gray-900">Onboard Player</div>
                      <div className="text-xs text-gray-500">Add a new player to the system</div>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      setShowCommandPalette(false);
                      setSelectedMemberForEdit(null);
                      setActiveSlideIn('member');
                    }}
                    className="w-full px-4 py-3 text-left rounded-lg hover:bg-gray-50 flex items-center gap-3 transition-colors group"
                  >
                    <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center group-hover:bg-green-100 transition-colors">
                      <User className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-gray-900">Onboard Member</div>
                      <div className="text-xs text-gray-500">Add a new team member</div>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      setShowCommandPalette(false);
                      setSelectedWalletForEdit(null);
                      setActiveSlideIn('paymentwallet');
                    }}
                    className="w-full px-4 py-3 text-left rounded-lg hover:bg-gray-50 flex items-center gap-3 transition-colors group"
                  >
                    <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center group-hover:bg-purple-100 transition-colors">
                      <Wallet className="w-5 h-5 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-gray-900">Add Wallet</div>
                      <div className="text-xs text-gray-500">Add a new payment wallet</div>
                    </div>
                  </button>
                </div>

                <div className="p-3 border-b border-gray-100">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search players or operations..."
                      value={commandSearchQuery}
                      onChange={(e) => setCommandSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                      autoFocus
                    />
                  </div>
                </div>

                <div className="max-h-80 overflow-y-auto">
                  {commandSearchQuery && (
                    <div className="p-2">
                      <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        Players
                      </div>
                      {filteredPlayersForCommand.length === 0 ? (
                        <div className="px-3 py-4 text-sm text-gray-500 text-center">No players found</div>
                      ) : (
                        filteredPlayersForCommand.slice(0, 5).map(player => (
                          <button
                            key={player.id}
                            onClick={() => {
                              setSelectedPlayerForEdit({
                                id: player.id,
                                name: player.name,
                                avatar: player.avatar
                              });
                              setActiveSlideIn('player');
                              setShowCommandPalette(false);
                              setCommandSearchQuery('');
                            }}
                            className="w-full px-3 py-2 text-left rounded-lg hover:bg-gray-50 flex items-center gap-3 transition-colors"
                          >
                            <img 
                              src={player.avatar} 
                              alt={player.name}
                              className="w-8 h-8 rounded-full object-cover"
                            />
                            <div className="flex-1">
                              <div className="text-sm font-medium text-gray-900">{player.name}</div>
                              <div className="text-xs text-gray-500">{teams.find(t => t.id === player.teamId)?.name || 'No Team'}</div>
                            </div>
                            <span className={`text-xs font-medium px-2 py-1 rounded ${player.profitLoss >= 0 ? 'text-green-700 bg-green-50' : 'text-red-700 bg-red-50'}`}>
                              {player.profitLoss >= 0 ? '+' : ''}${player.profitLoss.toLocaleString()}
                            </span>
                          </button>
                        ))
                      )}
                    </div>
                  )}

                  {commandSearchQuery && (
                    <div className="p-2 border-t border-gray-100">
                      <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        Operations
                      </div>
                      {filteredOperationsForCommand.length === 0 ? (
                        <div className="px-3 py-4 text-sm text-gray-500 text-center">No operations found</div>
                      ) : (
                        filteredOperationsForCommand.slice(0, 5).map(op => (
                          <button
                            key={op.id}
                            onClick={() => {
                              toggleOperation(op.id);
                              setShowCommandPalette(false);
                              setCommandSearchQuery('');
                            }}
                            className="w-full px-3 py-2 text-left rounded-lg hover:bg-gray-50 flex items-center gap-3 transition-colors"
                          >
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                              op.type === 'Deposit' ? 'bg-green-50' :
                              op.type === 'Withdrawal' ? 'bg-blue-50' :
                              op.type === 'Split' ? 'bg-purple-50' : 'bg-orange-50'
                            }`}>
                              {op.type === 'Deposit' && <ArrowDownRight className="w-4 h-4 text-green-600" />}
                              {op.type === 'Withdrawal' && <ArrowUpRight className="w-4 h-4 text-blue-600" />}
                              {op.type === 'Split' && <Split className="w-4 h-4 text-purple-600" />}
                              {op.type === 'Swap' && <Repeat2 className="w-4 h-4 text-orange-600" />}
                            </div>
                            <div className="flex-1">
                              <div className="text-sm font-medium text-gray-900">{op.type}</div>
                              <div className="text-xs text-gray-500">{op.id} • {op.player?.name || 'Unknown'}</div>
                            </div>
                            <span className="text-sm font-semibold text-gray-900">
                              ${op.amount.toLocaleString()}
                            </span>
                          </button>
                        ))
                      )}
                    </div>
                  )}

                  {!commandSearchQuery && (
                    <div className="p-4 text-sm text-gray-500 text-center">
                      Start typing to search players or operations...
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
