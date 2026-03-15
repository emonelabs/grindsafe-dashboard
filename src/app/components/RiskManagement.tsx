import { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  Shield, 
  Cpu, 
  GitBranch, 
  TrendingUp, 
  TrendingDown, 
  Minus,
  Calendar,
  Search,
  ChevronDown,
  Loader2,
  ArrowUpRight,
  ArrowDownRight,
  Minus as MinusIcon,
  X,
  AlertTriangle,
  Layers,
  Zap,
  Plus,
  Trash2,
  ArrowLeft
} from 'lucide-react';
import SlideInPanel from './SlideInPanel';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Handle,
  Position,
  NodeProps,
  useReactFlow,
  Node,
  Edge,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

type RiskOption = 'ai' | 'rule';

interface RiskLevel {
  id: string;
  name: string;
  nodes: Node[];
  edges: Edge[];
  createdAt: Date;
}

interface AIDecision {
  id: string;
  playerId: string;
  playerName: string;
  playerAvatar: string;
  decision: 'up' | 'down' | 'stay';
  timestamp: Date;
  reason?: string;
}

const conditionFields = ['bb/100', 'ROI', 'Sessions'] as const;
const operators = ['=', '>', '<', '>=', '<='] as const;
const actions = ['up', 'down', 'stay'] as const;

type ConditionField = typeof conditionFields[number];
type Operator = typeof operators[number];
type Action = typeof actions[number];

interface ConditionNodeData {
  name: string;
  field: ConditionField;
  operator: Operator;
  value: string;
}

interface ActionNodeData {
  action: Action;
}

interface LevelNodeData {
  name: string;
}

function ConditionNode({ data, selected, id }: NodeProps<{ data: ConditionNodeData }> & { id: string }) {
  const { setNodes, setEdges } = useReactFlow();
  
  const handleDelete = () => {
    setNodes((nds) => nds.filter((n) => n.id !== id));
    setEdges((eds) => eds.filter((e) => e.source !== id && e.target !== id));
  };

  return (
    <div className={`bg-white rounded-xl border-2 shadow-xl min-w-[240px] transition-all duration-200 ${selected ? 'border-slate-600 shadow-2xl' : 'border-slate-300'}`}>
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleDelete();
        }}
        className="absolute -top-2 -right-2 w-6 h-6 bg-white border-2 border-slate-300 rounded-full flex items-center justify-center hover:bg-red-50 hover:border-red-400 hover:text-red-500 transition-colors z-10"
      >
        <X className="w-3 h-3" />
      </button>
      <Handle type="source" position={Position.Right} className="!bg-slate-600 !w-3 !h-3" />
      <div className="bg-gradient-to-r from-slate-700 to-slate-800 text-white px-3 py-2.5 rounded-t-xl">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4" />
          <span className="font-semibold text-sm">Condition</span>
        </div>
      </div>
      <div className="p-4 space-y-3">
        <div>
          <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Name</label>
          <input
            type="text"
            value={data.name}
            className="w-full mt-1.5 px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent bg-slate-50"
            placeholder="e.g., Low Profit"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Field</label>
          <select
            value={data.field}
            className="w-full mt-1.5 px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent bg-slate-50"
          >
            {conditionFields.map(field => (
              <option key={field} value={field}>{field}</option>
            ))}
          </select>
        </div>
        <div className="flex gap-2">
          <div className="flex-1">
            <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Operator</label>
            <select
              value={data.operator}
              className="w-full mt-1.5 px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent bg-slate-50"
            >
              {operators.map(op => (
                <option key={op} value={op}>{op}</option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Value</label>
            <input
              type="number"
              value={data.value}
              className="w-full mt-1.5 px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent bg-slate-50"
              placeholder="0"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function ActionNode({ data, selected, id }: NodeProps<{ data: ActionNodeData }> & { id: string }) {
  const { setNodes, setEdges } = useReactFlow();

  const handleDelete = () => {
    setNodes((nds) => nds.filter((n) => n.id !== id));
    setEdges((eds) => eds.filter((e) => e.source !== id && e.target !== id));
  };

  const getActionColor = (action: Action) => {
    switch (action) {
      case 'up': return 'bg-emerald-500 border-emerald-600';
      case 'down': return 'bg-rose-500 border-rose-600';
      case 'stay': return 'bg-slate-400 border-slate-500';
    }
  };

  const getActionHoverColor = (action: Action) => {
    switch (action) {
      case 'up': return 'hover:bg-emerald-100';
      case 'down': return 'hover:bg-rose-100';
      case 'stay': return 'hover:bg-slate-100';
    }
  };

  const getActionIcon = (action: Action) => {
    switch (action) {
      case 'up': return <ArrowUpRight className="w-4 h-4" />;
      case 'down': return <ArrowDownRight className="w-4 h-4" />;
      case 'stay': return <MinusIcon className="w-4 h-4" />;
    }
  };

  const getActionLabel = (action: Action) => {
    switch (action) {
      case 'up': return 'Go Up';
      case 'down': return 'Go Down';
      case 'stay': return 'Stay';
    }
  };

  return (
    <div className={`bg-white rounded-xl border-2 shadow-xl min-w-[200px] transition-all duration-200 ${selected ? 'border-slate-600 shadow-2xl' : 'border-slate-300'}`}>
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleDelete();
        }}
        className="absolute -top-2 -right-2 w-6 h-6 bg-white border-2 border-slate-300 rounded-full flex items-center justify-center hover:bg-red-50 hover:border-red-400 hover:text-red-500 transition-colors z-10"
      >
        <X className="w-3 h-3" />
      </button>
      <Handle type="target" position={Position.Left} className="!bg-slate-600 !w-3 !h-3" />
      <Handle type="source" position={Position.Right} className="!bg-slate-600 !w-3 !h-3" />
      <div className="bg-gradient-to-r from-slate-700 to-slate-800 text-white px-3 py-2.5 rounded-t-xl">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4" />
          <span className="font-semibold text-sm">Action</span>
        </div>
      </div>
      <div className="p-4">
        <div className="flex gap-1.5">
          {actions.map(action => (
            <button
              key={action}
              className={`flex-1 flex items-center justify-center gap-1 px-2 py-2.5 rounded-lg text-xs font-semibold transition-all border-2 ${
                data.action === action
                  ? `${getActionColor(action)} text-white border-transparent shadow-md`
                  : `bg-white text-slate-600 border-slate-200 ${getActionHoverColor(action)}`
              }`}
            >
              {getActionIcon(action)}
              <span className="hidden lg:inline">{getActionLabel(action).split(' ')[0]}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function LevelNode({ data, selected, id }: NodeProps<{ data: LevelNodeData }> & { id: string }) {
  const { setNodes, setEdges } = useReactFlow();

  const handleDelete = () => {
    setNodes((nds) => nds.filter((n) => n.id !== id));
    setEdges((eds) => eds.filter((e) => e.source !== id && e.target !== id));
  };

  return (
    <div className={`bg-slate-50 rounded-xl border-2 border-dashed shadow-xl min-w-[320px] min-h-[280px] transition-all duration-200 ${selected ? 'border-slate-600' : 'border-slate-300'}`}>
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleDelete();
        }}
        className="absolute -top-2 -right-2 w-6 h-6 bg-white border-2 border-slate-300 rounded-full flex items-center justify-center hover:bg-red-50 hover:border-red-400 hover:text-red-500 transition-colors z-10"
      >
        <X className="w-3 h-3" />
      </button>
      <Handle type="target" position={Position.Left} className="!bg-slate-600 !w-3 !h-3" />
      <div className="bg-gradient-to-r from-slate-600 to-slate-700 text-white px-4 py-3 rounded-t-xl">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4" />
          <span className="font-semibold text-sm">{data.name || 'Level'}</span>
        </div>
      </div>
      <div className="p-4 pt-8 min-h-[200px]">
        <div className="text-xs text-slate-400">Drop conditions here</div>
      </div>
    </div>
  );
}

const nodeTypes = {
  condition: ConditionNode,
  action: ActionNode,
  level: LevelNode,
};

const initialNodes = [];

const initialEdges = [];

function generateMockAIDecisions(count: number): AIDecision[] {
  const decisions: AIDecision[] = [];
  const playerNames = [
    'Marcus Chen', 'Sarah Mitchell', 'David Rodriguez', 'Alex Thompson', 'Emma Wilson',
    'James Parker', 'Michael Chen', 'Lisa Anderson', 'Robert Kim', 'Jennifer Lee',
    'Tom Bradley', 'Nina Patel', 'Carlos Rivera', 'Sophia Martinez', "Ryan O'Connor"
  ];
  const playerAvatars = [
    'https://images.unsplash.com/photo-1674644674031-b49db824edbc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
    'https://images.unsplash.com/photo-1761243892035-c3e13829115a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
    'https://images.unsplash.com/photo-1769071166530-11f7857f4c59?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
    'https://images.unsplash.com/photo-1532272278764-53cd1fe53f72?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
    'https://images.unsplash.com/photo-1758518732130-4b51da74b0b6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
  ];

  const now = new Date();
  
  for (let i = 0; i < count; i++) {
    const playerIndex = Math.floor(Math.random() * playerNames.length);
    const decisionTypes: AIDecision['decision'][] = ['up', 'down', 'stay'];
    const decision = decisionTypes[Math.floor(Math.random() * decisionTypes.length)];
    
    const daysAgo = Math.floor(Math.random() * 30);
    const hoursAgo = Math.floor(Math.random() * 24);
    const timestamp = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000 - hoursAgo * 60 * 60 * 1000);

    decisions.push({
      id: `decision-${i + 1}`,
      playerId: `player-${playerIndex + 1}`,
      playerName: playerNames[playerIndex],
      playerAvatar: playerAvatars[playerIndex % playerAvatars.length],
      decision,
      timestamp,
      reason: decision === 'up' ? 'Positive trend detected' : decision === 'down' ? 'Risk threshold exceeded' : 'Metrics within normal range',
    });
  }

  return decisions.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
}

export function RiskManagement() {
  const [activeRiskMode, setActiveRiskMode] = useState<'ai' | 'rule'>('ai');
  const [selectedOption, setSelectedOption] = useState<RiskOption>('ai');
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [aiDecisions, setAiDecisions] = useState<AIDecision[]>([]);
  const [isLoadingDecisions, setIsLoadingDecisions] = useState(false);
  const [hasMoreDecisions, setHasMoreDecisions] = useState(true);
  const [decisionsPage, setDecisionsPage] = useState(1);
  const [dateFilter, setDateFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const decisionsScrollRef = useCallback((el: HTMLDivElement | null) => {
    if (!el) return;
  }, []);

  // Levels state
  const [levels, setLevels] = useState<RiskLevel[]>([
    {
      id: 'level-1',
      name: 'Low Risk',
      nodes: [
        {
          id: 'level-1-node',
          type: 'level',
          position: { x: 100, y: 100 },
          data: { name: 'Low Risk Level' },
        },
        {
          id: 'cond-1',
          type: 'condition',
          position: { x: 450, y: 80 },
          data: { name: 'Check Profit', field: 'bb/100', operator: '>', value: '50' },
        },
        {
          id: 'action-1',
          type: 'action',
          position: { x: 750, y: 80 },
          data: { action: 'up' },
        },
      ],
      edges: [
        { id: 'e1', source: 'level-1-node', target: 'cond-1' },
        { id: 'e2', source: 'cond-1', target: 'action-1' },
      ],
      createdAt: new Date('2026-03-01'),
    },
    {
      id: 'level-2',
      name: 'Medium Risk',
      nodes: [
        {
          id: 'level-2-node',
          type: 'level',
          position: { x: 100, y: 100 },
          data: { name: 'Medium Risk Level' },
        },
        {
          id: 'cond-2',
          type: 'condition',
          position: { x: 450, y: 80 },
          data: { name: 'Check Loss', field: 'bb/100', operator: '<', value: '-30' },
        },
        {
          id: 'action-2',
          type: 'action',
          position: { x: 750, y: 80 },
          data: { action: 'down' },
        },
      ],
      edges: [
        { id: 'e3', source: 'level-2-node', target: 'cond-2' },
        { id: 'e4', source: 'cond-2', target: 'action-2' },
      ],
      createdAt: new Date('2026-03-05'),
    },
    {
      id: 'level-3',
      name: 'High Risk',
      nodes: [
        {
          id: 'level-3-node',
          type: 'level',
          position: { x: 100, y: 100 },
          data: { name: 'High Risk Level' },
        },
      ],
      edges: [],
      createdAt: new Date('2026-03-10'),
    },
  ]);
  const [editingLevelId, setEditingLevelId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newLevelName, setNewLevelName] = useState('');

  useEffect(() => {
    const initialDecisions = generateMockAIDecisions(20);
    setAiDecisions(initialDecisions);
  }, []);



  const filteredDecisions = useMemo(() => {
    let filtered = aiDecisions;

    if (searchQuery) {
      filtered = filtered.filter(d => 
        d.playerName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    switch (dateFilter) {
      case 'today':
        filtered = filtered.filter(d => d.timestamp >= today);
        break;
      case 'yesterday':
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        filtered = filtered.filter(d => d.timestamp >= yesterday && d.timestamp < today);
        break;
      case 'week':
        const weekAgo = new Date(today);
        weekAgo.setDate(weekAgo.getDate() - 7);
        filtered = filtered.filter(d => d.timestamp >= weekAgo);
        break;
      case 'month':
        const monthAgo = new Date(today);
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        filtered = filtered.filter(d => d.timestamp >= monthAgo);
        break;
      case 'last-month':
        const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);
        filtered = filtered.filter(d => d.timestamp >= lastMonthStart && d.timestamp <= lastMonthEnd);
        break;
      case 'quarter':
        const quarterAgo = new Date(today);
        quarterAgo.setMonth(quarterAgo.getMonth() - 3);
        filtered = filtered.filter(d => d.timestamp >= quarterAgo);
        break;
      case 'year':
        const yearAgo = new Date(today);
        yearAgo.setFullYear(yearAgo.getFullYear() - 1);
        filtered = filtered.filter(d => d.timestamp >= yearAgo);
        break;
    }

    return filtered;
  }, [aiDecisions, dateFilter, searchQuery]);

  const stats = useMemo(() => {
    const total = filteredDecisions.length;
    const up = filteredDecisions.filter(d => d.decision === 'up').length;
    const down = filteredDecisions.filter(d => d.decision === 'down').length;
    const playersImpacted = new Set(filteredDecisions.map(d => d.playerId)).size;
    return { total, up, down, playersImpacted };
  }, [filteredDecisions]);

  const loadMoreDecisions = useCallback(() => {
    if (isLoadingDecisions || !hasMoreDecisions) return;
    
    setIsLoadingDecisions(true);
    setTimeout(() => {
      const moreDecisions = generateMockAIDecisions(15);
      setAiDecisions(prev => {
        const updated = [...prev, ...moreDecisions];
        if (updated.length >= 100) {
          setHasMoreDecisions(false);
        }
        return updated;
      });
      setDecisionsPage(prev => prev + 1);
      setIsLoadingDecisions(false);
    }, 500);
  }, [isLoadingDecisions, hasMoreDecisions]);

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const { scrollTop, scrollHeight, clientHeight } = target;
    const scrollPercentage = (scrollTop + clientHeight) / scrollHeight;
    
    if (scrollPercentage > 0.9) {
      loadMoreDecisions();
    }
  }, [loadMoreDecisions]);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const nodeType = event.dataTransfer.getData('application/reactflow');

      const reactFlowBounds = event.currentTarget.getBoundingClientRect();
      const dropPosition = {
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      };

      if (nodeType === 'level') {
        const newNode = {
          id: `level-${Date.now()}`,
          type: 'level',
          position: { x: dropPosition.x - 150, y: dropPosition.y - 100 },
          data: { name: 'New Level' },
        };
        setNodes((nds) => [...nds, newNode]);
        return;
      }

      if (nodeType !== 'condition' && nodeType !== 'action') return;

      let parentLevelId: string | null = null;
      
      for (const node of nodes) {
        if (node.type === 'level') {
          const nodeWidth = 320;
          const nodeHeight = 280;
          if (
            dropPosition.x >= node.position.x &&
            dropPosition.x <= node.position.x + nodeWidth &&
            dropPosition.y >= node.position.y + 50 &&
            dropPosition.y <= node.position.y + nodeHeight
          ) {
            parentLevelId = node.id;
            break;
          }
        }
      }

      const position = parentLevelId
        ? { x: dropPosition.x - 100, y: dropPosition.y - 80 }
        : { x: dropPosition.x - 100, y: dropPosition.y - 50 };

      let newNode;
      if (nodeType === 'condition') {
        newNode = {
          id: `cond-${Date.now()}`,
          type: 'condition',
          position,
          data: { name: '', field: 'bb/100' as ConditionField, operator: '=' as Operator, value: '0' },
        };
      } else if (nodeType === 'action') {
        newNode = {
          id: `action-${Date.now()}`,
          type: 'action',
          position,
          data: { action: 'stay' as Action },
        };
      }

      if (newNode) {
        setNodes((nds) => [...nds, newNode]);
      }
    },
    [setNodes, nodes]
  );

  // Level management functions
  const handleCreateLevel = () => {
    if (!newLevelName.trim()) {
      alert('Please enter a level name');
      return;
    }

    const newLevel: RiskLevel = {
      id: `level-${Date.now()}`,
      name: newLevelName.trim(),
      nodes: [],
      edges: [],
      createdAt: new Date(),
    };

    setLevels([...levels, newLevel]);
    setIsModalOpen(false);
    setNewLevelName('');
  };

  const handleDeleteLevel = (levelId: string) => {
    if (confirm('Are you sure you want to delete this level?')) {
      setLevels(levels.filter(l => l.id !== levelId));
      if (editingLevelId === levelId) {
        setEditingLevelId(null);
      }
    }
  };

  const handleEditLevel = (levelId: string) => {
    const level = levels.find(l => l.id === levelId);
    if (level) {
      setNodes(level.nodes);
      setEdges(level.edges);
      setEditingLevelId(levelId);
    }
  };

  const handleSaveLevel = () => {
    if (!editingLevelId) return;

    setLevels(levels.map(level => 
      level.id === editingLevelId
        ? { ...level, nodes, edges }
        : level
    ));
    alert('Level saved successfully!');
  };

  const handleBackToLevels = () => {
    setEditingLevelId(null);
    setNodes([]);
    setEdges([]);
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

  const getDecisionBadge = (decision: AIDecision['decision']) => {
    switch (decision) {
      case 'up':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200">
            <ArrowUpRight className="w-3 h-3" />
            Go Up
          </span>
        );
      case 'down':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-rose-50 text-rose-700 text-xs font-semibold border border-rose-200">
            <ArrowDownRight className="w-3 h-3" />
            Go Down
          </span>
        );
      case 'stay':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-50 text-slate-700 text-xs font-semibold border border-slate-200">
            <MinusIcon className="w-3 h-3" />
            Stay
          </span>
        );
    }
  };

  return (
    <div className="h-[calc(100vh-200px)] flex gap-4">
      {/* Left Panel - Discrete Sidebar */}
      <div className="w-[200px] flex-shrink-0">
        <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 px-2">Settings</h3>
          
          {/* AI-Powered Option */}
          <button
            onClick={() => { setSelectedOption('ai'); setActiveRiskMode('ai'); }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 mb-1 ${
              selectedOption === 'ai'
                ? 'bg-slate-800 text-white'
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
            }`}
          >
            <Cpu className="w-4 h-4 flex-shrink-0" />
            <span className="text-sm font-medium">AI Powered</span>
          </button>

          {/* Rule-based Option */}
          <button
            onClick={() => { setSelectedOption('rule'); setActiveRiskMode('rule'); }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
              selectedOption === 'rule'
                ? 'bg-slate-800 text-white'
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
            }`}
          >
            <GitBranch className="w-4 h-4 flex-shrink-0" />
            <span className="text-sm font-medium">Rule-based</span>
          </button>
        </div>
      </div>

      {/* Right Panel - Content */}
      <div className="flex-1 overflow-hidden">
        {selectedOption === 'ai' ? (
          <div className="h-full flex flex-col bg-white border border-slate-200 rounded-xl overflow-hidden">
            {/* Stats Row */}
            <div className="grid grid-cols-4 gap-px bg-slate-200 border-b border-slate-200">
              <div className="bg-slate-50 p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total Decisions</span>
                  <Shield className="w-4 h-4 text-slate-400" />
                </div>
                <div className="text-2xl font-bold text-slate-800">{stats.total}</div>
              </div>
              <div className="bg-slate-50 p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Players Impacted</span>
                  <TrendingUp className="w-4 h-4 text-slate-400" />
                </div>
                <div className="text-2xl font-bold text-slate-800">{stats.playersImpacted}</div>
              </div>
              <div className="bg-emerald-50 p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-emerald-600 uppercase tracking-wider">Go Up</span>
                  <ArrowUpRight className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-2xl font-bold text-emerald-600">{stats.up}</div>
              </div>
              <div className="bg-rose-50 p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-rose-600 uppercase tracking-wider">Go Down</span>
                  <ArrowDownRight className="w-4 h-4 text-rose-400" />
                </div>
                <div className="text-2xl font-bold text-rose-600">{stats.down}</div>
              </div>
            </div>

            {/* Filter Bar */}
            <div className="flex items-center gap-3 p-4 border-b border-slate-200 bg-slate-50">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search player..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent bg-white shadow-sm"
                />
              </div>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <select
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="pl-9 pr-8 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent appearance-none bg-white shadow-sm"
                >
                  <option value="all">All Time</option>
                  <option value="today">Today</option>
                  <option value="yesterday">Yesterday</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                  <option value="last-month">Last Month</option>
                  <option value="quarter">This Quarter</option>
                  <option value="year">This Year</option>
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
            </div>

            {/* Table with Infinite Scroll */}
            <div 
              ref={decisionsScrollRef}
              onScroll={handleScroll}
              className="flex-1 overflow-y-auto"
            >
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200 sticky top-0 z-10">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide bg-slate-50">Player</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide bg-slate-50">Decision</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide bg-slate-50">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredDecisions.map((decision) => (
                    <tr key={decision.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={decision.playerAvatar}
                            alt={decision.playerName}
                            className="w-9 h-9 rounded-full border-2 border-slate-100 object-cover shadow-sm"
                          />
                          <span className="text-sm font-medium text-slate-800">{decision.playerName}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        {getDecisionBadge(decision.decision)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm text-slate-800">{formatDate(decision.timestamp)}</div>
                        <div className="text-xs text-slate-400">{formatTime(decision.timestamp)}</div>
                      </td>
                    </tr>
                  ))}
                  
                  {isLoadingDecisions && (
                    <tr>
                      <td colSpan={3} className="px-4 py-8 text-center">
                        <div className="flex items-center justify-center gap-2 text-slate-500">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span className="text-sm">Loading more...</span>
                        </div>
                      </td>
                    </tr>
                  )}
                  
                  {!hasMoreDecisions && filteredDecisions.length > 0 && (
                    <tr>
                      <td colSpan={3} className="px-4 py-6 text-center">
                        <span className="text-xs text-slate-400">No more decisions to load</span>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : editingLevelId ? (
          <div className="h-full flex flex-col bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm relative">
            {/* Toolbar with Back Button */}
            <div className="flex items-center justify-between p-3 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100">
              <button
                onClick={handleBackToLevels}
                className="flex items-center gap-2 px-3 py-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm font-medium">Back to Levels</span>
              </button>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-slate-800">
                  {levels.find(l => l.id === editingLevelId)?.name}
                </span>
              </div>
              <button
                onClick={handleSaveLevel}
                className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
              >
                Save Level
              </button>
            </div>

            {/* Floating Drag-Drop Sidebar */}
            <div className="absolute left-3 top-16 z-20 flex flex-col gap-2">
              <div
                draggable
                onDragStart={(e) => onDragStart(e, 'condition')}
                className="flex items-center gap-2 px-4 py-3 bg-white border border-slate-200 rounded-lg shadow-md cursor-grab hover:bg-slate-50 hover:border-slate-300 transition-all"
              >
                <AlertTriangle className="w-5 h-5 text-slate-600" />
                <span className="text-sm font-medium text-slate-700">Condition</span>
              </div>
              <div
                draggable
                onDragStart={(e) => onDragStart(e, 'action')}
                className="flex items-center gap-2 px-4 py-3 bg-white border border-slate-200 rounded-lg shadow-md cursor-grab hover:bg-slate-50 hover:border-slate-300 transition-all"
              >
                <Zap className="w-5 h-5 text-slate-600" />
                <span className="text-sm font-medium text-slate-700">Action</span>
              </div>
            </div>

            {/* React Flow Canvas */}
            <div className="flex-1 bg-slate-50">
              <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onDragOver={onDragOver}
                onDrop={onDrop}
                nodeTypes={nodeTypes}
                fitView
                className="bg-slate-50"
              >
                <Controls className="!bg-white !border-slate-200 !shadow-xl !rounded-lg" />
                <MiniMap 
                  className="!bg-white !border-slate-200 !shadow-xl !rounded-lg"
                  nodeColor={(node) => {
                    if (node.type === 'level') return '#64748b';
                    if (node.type === 'condition') return '#475569';
                    return '#22c55e';
                  }}
                  maskColor="rgba(241, 245, 249, 0.8)"
                />
                <Background color="#cbd5e1" gap={20} />
              </ReactFlow>
            </div>
          </div>
        ) : (
          /* Levels List View */
          <div className="space-y-6 p-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 mb-1">Risk Levels</h1>
                <p className="text-slate-500 text-sm">Create and manage risk rule levels</p>
              </div>
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Level
              </button>
            </div>

            {/* Levels Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {levels.map(level => (
                <div
                  key={level.id}
                  className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
                >
                  {/* Card Header */}
                  <div className="bg-gradient-to-r from-slate-700 to-slate-800 p-6 text-white">
                    <div className="flex items-start justify-between mb-4">
                      <Layers className="w-10 h-10" />
                      <button
                        onClick={() => handleDeleteLevel(level.id)}
                        className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold mb-1">{level.name}</h3>
                      <p className="text-sm text-white/80">
                        {level.nodes.length} nodes • {level.edges.length} connections
                      </p>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-6 space-y-3">
                    <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                      <div>
                        <span className="text-xs text-slate-500">Created</span>
                        <p className="text-xs font-medium text-slate-900">{formatDate(level.createdAt)}</p>
                      </div>
                      <button
                        onClick={() => handleEditLevel(level.id)}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium rounded-lg transition-colors"
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Add New Card */}
              <button
                onClick={() => setIsModalOpen(true)}
                className="border-2 border-dashed border-slate-300 rounded-xl p-8 flex flex-col items-center justify-center text-slate-500 hover:border-slate-400 hover:text-slate-700 transition-all min-h-[220px]"
              >
                <Plus className="w-12 h-12 mb-3" />
                <p className="font-semibold">Add New Level</p>
              </button>
            </div>

            {/* Empty State */}
            {levels.length === 0 && (
              <div className="text-center py-12 bg-white rounded-lg border border-slate-200">
                <Layers className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-900 mb-2">No Levels Yet</h3>
                <p className="text-slate-500 mb-4">Create your first risk level to get started</p>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add Level
                </button>
              </div>
            )}

            {/* Create Level SlideInPanel */}
            <SlideInPanel
              isOpen={isModalOpen}
              onClose={() => { setIsModalOpen(false); setNewLevelName(''); }}
              title="Add New Level"
            >
              <div className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Level Name
                  </label>
                  <input
                    type="text"
                    value={newLevelName}
                    onChange={(e) => setNewLevelName(e.target.value)}
                    placeholder="e.g., Low Risk, High Risk, Conservative"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                    autoFocus
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
                  <button
                    onClick={() => { setIsModalOpen(false); setNewLevelName(''); }}
                    className="px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreateLevel}
                    className="px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors"
                  >
                    Create Level
                  </button>
                </div>
              </div>
            </SlideInPanel>
          </div>
        )}
      </div>
    </div>
  );
}
