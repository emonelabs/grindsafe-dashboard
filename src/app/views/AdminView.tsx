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
import { Users, User, LayoutGrid, TrendingUp, TrendingDown, DollarSign, Activity, Clock, Play, Calendar, Network, Split, Wallet, ArrowLeftRight, ArrowUpRight, ArrowDownRight, Repeat2, CreditCard, CheckCircle, ChevronRight, Shield, ExternalLink } from 'lucide-react';
import { TeamsView } from './TeamsView';
import { PaymentWalletsContent } from '../components/PokerWalletsContent';
import PaymentWalletForm, { PaymentWallet } from '../components/forms/PokerWalletForm';
import SlideInPanel from '../components/SlideInPanel';
import { RiskManagement } from '../components/RiskManagement';

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
  const navigate = useNavigate();
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
  const [activeSlideIn, setActiveSlideIn] = useState<'paymentwallet' | null>(null);

  // Members state - Backoffice/Management personnel (max 15)
  const [members] = useState([
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
      if (name === 'Skrill') {
        return (
          <div className="w-6 h-6 bg-green-100 rounded flex items-center justify-center">
            <span className="text-[10px] font-bold text-green-600">SK</span>
          </div>
        );
      }
      if (name === 'Neteller') {
        return (
          <div className="w-6 h-6 bg-teal-100 rounded flex items-center justify-center">
            <span className="text-[10px] font-bold text-teal-600">NL</span>
          </div>
        );
      }
      if (name === 'Pix') {
        return (
          <div className="w-6 h-6 bg-yellow-100 rounded flex items-center justify-center">
            <span className="text-[10px] font-bold text-yellow-600">PX</span>
          </div>
        );
      }
      if (name === 'LuxonPay') {
        return (
          <div className="w-6 h-6 bg-purple-100 rounded flex items-center justify-center">
            <span className="text-[10px] font-bold text-purple-600">LP</span>
          </div>
        );
      }
      return (
        <div className="w-6 h-6 bg-blue-100 rounded flex items-center justify-center">
          <Wallet className="w-4 h-4 text-blue-600" />
        </div>
      );
    }
    if (type === 'poker_site') {
      if (name === 'PokerStars') {
        return (
          <div className="w-6 h-6 bg-red-100 rounded flex items-center justify-center">
            <span className="text-[10px] font-bold text-red-600">PS</span>
          </div>
        );
      }
      if (name === 'GGPoker') {
        return (
          <div className="w-6 h-6 bg-orange-100 rounded flex items-center justify-center">
            <span className="text-[10px] font-bold text-orange-600">GG</span>
          </div>
        );
      }
      if (name === '888Poker') {
        return (
          <div className="w-6 h-6 bg-green-100 rounded flex items-center justify-center">
            <span className="text-[10px] font-bold text-green-600">888</span>
          </div>
        );
      }
      if (name === 'PartyPoker') {
        return (
          <div className="w-6 h-6 bg-purple-100 rounded flex items-center justify-center">
            <span className="text-[10px] font-bold text-purple-600">PP</span>
          </div>
        );
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
      if (name === 'PokerStars') {
        return (
          <div className="w-6 h-6 bg-red-100 rounded flex items-center justify-center">
            <span className="text-[10px] font-bold text-red-600">PS</span>
          </div>
        );
      }
      if (name === 'GGPoker') {
        return (
          <div className="w-6 h-6 bg-orange-100 rounded flex items-center justify-center">
            <span className="text-[10px] font-bold text-orange-600">GG</span>
          </div>
        );
      }
      if (name === '888Poker') {
        return (
          <div className="w-6 h-6 bg-green-100 rounded flex items-center justify-center">
            <span className="text-[10px] font-bold text-green-600">888</span>
          </div>
        );
      }
      if (name === 'PartyPoker') {
        return (
          <div className="w-6 h-6 bg-purple-100 rounded flex items-center justify-center">
            <span className="text-[10px] font-bold text-purple-600">PP</span>
          </div>
        );
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

  const getWalletWithLink = (walletName: string, walletType: string, nickname?: string) => {
    const isPokerSite = ['PokerStars', 'GGPoker', '888Poker', 'PartyPoker'].includes(walletName);
    const isPlayerFinancial = ['Skrill', 'Neteller', 'Pix', 'LuxonPay'].includes(walletName);
    
    const getPokerSiteIcon = (site: string) => {
      if (site === 'PokerStars') {
        return <span className="text-[10px] font-bold text-red-600">PS</span>;
      }
      if (site === 'GGPoker') {
        return <span className="text-[10px] font-bold text-orange-600">GG</span>;
      }
      if (site === '888Poker') {
        return <span className="text-[10px] font-bold text-green-600">888</span>;
      }
      if (site === 'PartyPoker') {
        return <span className="text-[10px] font-bold text-purple-600">PP</span>;
      }
      return null;
    };

    if (isPokerSite && nickname) {
      return (
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-5 bg-gray-100 rounded flex items-center justify-center">
            {getPokerSiteIcon(walletName)}
          </div>
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
              Live
            </TabsTrigger>
            <TabsTrigger value="teams" className="flex items-center gap-2 px-4 py-3 data-[state=active]:bg-gray-900 data-[state=active]:text-white">
              <Users className="w-4 h-4" />
              Teams
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
            <TabsTrigger value="sessions" className="flex items-center gap-2 px-4 py-3 data-[state=active]:bg-gray-900 data-[state=active]:text-white">
              <Play className="w-4 h-4" />
              Sessions
            </TabsTrigger>
            <TabsTrigger value="risk" className="flex items-center gap-2 px-4 py-3 data-[state=active]:bg-gray-900 data-[state=active]:text-white">
              <Shield className="w-4 h-4" />
              Risk Management
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
                                      {getWalletWithLink(tx.from, tx.fromType, tx.nickname)}
                                      <span className="text-sm text-gray-400 mx-1">→</span>
                                      {getWalletIcon(tx.toType, tx.to)}
                                      {getWalletWithLink(tx.to, tx.toType, tx.nickname)}
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
                          {getWalletWithLink(item.from, item.fromType, item.nickname)}
                          <span>→</span>
                          {getWalletIcon(item.toType, item.to)}
                          {getWalletWithLink(item.to, item.toType, item.nickname)}
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
            onAdd={handleAddWallet}
            onEdit={handleEditWallet}
            onDelete={handleDeleteWallet}
          />
        </TabsContent>

        <TabsContent value="players">
          {/* Players Table - Simple version without filters */}
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
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide bg-gray-50">Session Time</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wide bg-gray-50">P/L</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {adjustedPlayers.map(player => {
                    const team = teams.find(t => t.id === player.teamId);
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
                          {player.isRecording ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-red-50 text-red-700 text-xs font-medium">
                              <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></div>
                              LIVE
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-1 rounded bg-gray-100 text-gray-600 text-xs font-medium">
                              Offline
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-sm text-gray-900">
                            {Math.floor(player.sessionTime / 60)}h {player.sessionTime % 60}m
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className={`text-sm font-bold ${player.profitLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {player.profitLoss >= 0 ? '+' : ''}${player.profitLoss.toLocaleString()}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
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
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {members.map(member => (
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
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="sessions" className="space-y-3">
          <FilterPanel onFilterChange={setFilters} />

          {/* Sessions Table - With filters and View Session */}
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Player Sessions</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide bg-gray-50">Player</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide bg-gray-50">Team</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide bg-gray-50">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide bg-gray-50">Session Time</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wide bg-gray-50">P/L</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wide bg-gray-50">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredPlayers.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-12 text-center">
                        <p className="text-gray-500">No players match your current filters</p>
                      </td>
                    </tr>
                  ) : (
                    filteredPlayers.map(player => {
                      const team = teams.find(t => t.id === player.teamId);
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
                            {player.isRecording ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-red-50 text-red-700 text-xs font-medium">
                                <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></div>
                                LIVE
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2.5 py-1 rounded bg-gray-100 text-gray-600 text-xs font-medium">
                                Offline
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <div className="text-sm text-gray-900">
                              {Math.floor(player.sessionTime / 60)}h {player.sessionTime % 60}m
                            </div>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <div className={`text-sm font-bold ${player.profitLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {player.profitLoss >= 0 ? '+' : ''}${player.profitLoss.toLocaleString()}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <button
                              onClick={() => setSelectedPlayer(player)}
                              className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-900 hover:bg-gray-800 text-white text-xs font-medium rounded transition-colors"
                            >
                              <Play className="w-3 h-3" />
                              View Session
                            </button>
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

        <TabsContent value="risk">
          <RiskManagement />
        </TabsContent>
      </Tabs>

        {selectedPlayer && (
          <PlayerSessionModal
            player={selectedPlayer}
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
      </div>
    </div>
  );
}
