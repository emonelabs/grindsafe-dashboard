import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
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
  ArrowLeft,
  ChevronRight,
  Copy,
  Brain,
  Rocket,
  Download,
  CheckCircle2,
  XCircle,
  BarChart3,
  Database,
  Clock,
  Activity,
  Target,
  Layers3
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
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

type Resource = 'player' | 'session' | 'wallet' | 'operation' | 'entry';
type LogicOperator = 'AND' | 'OR';
type FieldType = 'number' | 'text' | 'date' | 'enum';

interface ResourceField {
  field: string;
  label: string;
  type: FieldType;
  options?: { value: string; label: string }[];
}

const resourceFields: Record<Resource, ResourceField[]> = {
  player: [
    { field: 'bb_100', label: 'bb/100', type: 'number' },
    { field: 'roi', label: 'ROI (%)', type: 'number' },
    { field: 'sessions', label: 'Sessions', type: 'number' },
    { field: 'profit_loss', label: 'Profit/Loss ($)', type: 'number' },
    { field: 'win_rate', label: 'Win Rate (%)', type: 'number' },
    { field: 'hands_played', label: 'Hands Played', type: 'number' },
    { field: 'avg_buy_in', label: 'Avg Buy-in ($)', type: 'number' },
    { field: 'game_type', label: 'Game Type', type: 'enum', options: [
      { value: 'cash', label: 'Cash' },
      { value: 'mtt', label: 'MTT' },
      { value: 'sng', label: 'SNG' },
    ]},
    { field: 'stakes', label: 'Stakes', type: 'text' },
    { field: 'table_size', label: 'Table Size', type: 'enum', options: [
      { value: '6max', label: '6-Max' },
      { value: '9max', label: '9-Max' },
      { value: 'heads_up', label: 'Heads-Up' },
    ]},
  ],
  session: [
    { field: 'duration', label: 'Duration (hrs)', type: 'number' },
    { field: 'hands', label: 'Hands Played', type: 'number' },
    { field: 'buy_in', label: 'Buy-in ($)', type: 'number' },
    { field: 'cash_out', label: 'Cash-out ($)', type: 'number' },
    { field: 'net_result', label: 'Net Result ($)', type: 'number' },
    { field: 'start_time', label: 'Start Time', type: 'date' },
    { field: 'end_time', label: 'End Time', type: 'date' },
    { field: 'date', label: 'Date', type: 'date' },
    { field: 'day_of_week', label: 'Day of Week', type: 'enum', options: [
      { value: 'monday', label: 'Monday' },
      { value: 'tuesday', label: 'Tuesday' },
      { value: 'wednesday', label: 'Wednesday' },
      { value: 'thursday', label: 'Thursday' },
      { value: 'friday', label: 'Friday' },
      { value: 'saturday', label: 'Saturday' },
      { value: 'sunday', label: 'Sunday' },
    ]},
  ],
  entry: [
    { field: 'buy_in', label: 'Buy-in ($)', type: 'number' },
    { field: 'cash_out', label: 'Cash-out ($)', type: 'number' },
    { field: 'net_result', label: 'Net Result ($)', type: 'number' },
    { field: 'rake', label: 'Rake ($)', type: 'number' },
  ],
  wallet: [
    { field: 'balance', label: 'Balance ($)', type: 'number' },
    { field: 'pending', label: 'Pending Amount ($)', type: 'number' },
    { field: 'tx_count', label: 'Transaction Count', type: 'number' },
    { field: 'last_activity', label: 'Last Activity', type: 'date' },
    { field: 'provider', label: 'Provider', type: 'enum', options: [
      { value: 'skrill', label: 'Skrill' },
      { value: 'neteller', label: 'Neteller' },
      { value: 'pix', label: 'Pix' },
      { value: 'luxonpay', label: 'LuxonPay' },
    ]},
    { field: 'status', label: 'Status', type: 'enum', options: [
      { value: 'active', label: 'Active' },
      { value: 'inactive', label: 'Inactive' },
      { value: 'suspended', label: 'Suspended' },
    ]},
  ],
  operation: [
    { field: 'amount', label: 'Amount ($)', type: 'number' },
    { field: 'type', label: 'Type', type: 'enum', options: [
      { value: 'deposit', label: 'Deposit' },
      { value: 'withdrawal', label: 'Withdrawal' },
      { value: 'split', label: 'Split' },
      { value: 'swap', label: 'Swap' },
    ]},
    { field: 'status', label: 'Status', type: 'enum', options: [
      { value: 'pending', label: 'Pending' },
      { value: 'completed', label: 'Completed' },
      { value: 'failed', label: 'Failed' },
      { value: 'confirmed', label: 'Confirmed' },
    ]},
    { field: 'date', label: 'Date', type: 'date' },
    { field: 'poker_site', label: 'Poker Site', type: 'enum', options: [
      { value: 'pokerstars', label: 'PokerStars' },
      { value: 'ggpoker', label: 'GGPoker' },
      { value: '888poker', label: '888Poker' },
      { value: 'partypoker', label: 'PartyPoker' },
    ]},
  ],
};

const operatorsByType: Record<FieldType, { value: string; label: string }[]> = {
  number: [
    { value: '=', label: '=' },
    { value: '!=', label: '≠' },
    { value: '>', label: '>' },
    { value: '<', label: '<' },
    { value: '>=', label: '≥' },
    { value: '<=', label: '≤' },
  ],
  text: [
    { value: 'contains', label: 'contains' },
    { value: 'not_contains', label: 'does not contain' },
    { value: 'starts_with', label: 'starts with' },
    { value: 'ends_with', label: 'ends with' },
    { value: 'is_empty', label: 'is empty' },
    { value: 'is_not_empty', label: 'is not empty' },
  ],
  date: [
    { value: 'is', label: 'is' },
    { value: 'is_before', label: 'is before' },
    { value: 'is_after', label: 'is after' },
    { value: 'is_empty', label: 'is empty' },
  ],
  enum: [
    { value: 'is', label: 'is' },
    { value: 'is_not', label: 'is not' },
  ],
};

const actions = ['up', 'down', 'stay'] as const;

type Action = typeof actions[number];

interface SingleCondition {
  id: string;
  field: string;
  operator: string;
  value: string;
  valueEnd?: string;
}

interface ConditionGroup {
  id: string;
  logic: LogicOperator;
  items: (SingleCondition | ConditionGroup)[];
}

interface ConditionNodeData {
  name: string;
  resource: Resource;
  rootGroup: ConditionGroup;
}

interface ActionNodeData {
  action: Action;
}

interface LevelNodeData {
  name: string;
}

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

interface ModelMetrics {
  epoch: number;
  precision: number;
  recall: number;
  mAP: number;
  boxLoss: number;
  classLoss: number;
  objectLoss: number;
}

interface Checkpoint {
  id: string;
  name: string;
  createdAt: Date;
  epochs: number;
  precision: number;
  recall: number;
  mAP: number;
  boxLoss: number;
  classLoss: number;
  objectLoss: number;
  fileSize: string;
  isActive: boolean;
}

function generateTrainingCurve(totalEpochs: number): ModelMetrics[] {
  const data: ModelMetrics[] = [];
  for (let i = 1; i <= totalEpochs; i++) {
    const t = i / totalEpochs;
    const decay = 1 - Math.exp(-4 * t);
    const noise = () => (Math.random() - 0.5) * 0.04;
    data.push({
      epoch: i,
      precision: Math.min(0.96, 0.72 + 0.22 * decay + noise()),
      recall: Math.min(0.94, 0.68 + 0.24 * decay + noise()),
      mAP: Math.min(0.91, 0.65 + 0.24 * decay + noise()),
      boxLoss: Math.max(0.008, 0.42 * Math.exp(-3.5 * t) + 0.008 + (Math.random() - 0.5) * 0.005),
      classLoss: Math.max(0.012, 0.28 * Math.exp(-4 * t) + 0.012 + (Math.random() - 0.5) * 0.004),
      objectLoss: Math.max(0.018, 0.38 * Math.exp(-3 * t) + 0.018 + (Math.random() - 0.5) * 0.006),
    });
  }
  return data;
}

const TOTAL_EPOCHS = 50;
const initialMetricsHistory = generateTrainingCurve(TOTAL_EPOCHS);

const initialCheckpoints: Checkpoint[] = [
  {
    id: 'ckpt-1',
    name: 'v2.1.0_baseline',
    createdAt: new Date('2026-02-10T10:30:00'),
    epochs: 50,
    precision: 0.9412,
    recall: 0.9234,
    mAP: 0.8915,
    boxLoss: 0.0102,
    classLoss: 0.0151,
    objectLoss: 0.0213,
    fileSize: '142 MB',
    isActive: false,
  },
  {
    id: 'ckpt-2',
    name: 'v2.2.0_augmented',
    createdAt: new Date('2026-02-18T14:15:00'),
    epochs: 50,
    precision: 0.9534,
    recall: 0.9312,
    mAP: 0.9048,
    boxLoss: 0.0091,
    classLoss: 0.0132,
    objectLoss: 0.0195,
    fileSize: '142 MB',
    isActive: false,
  },
  {
    id: 'ckpt-3',
    name: 'v2.3.0_resume',
    createdAt: new Date('2026-03-01T09:00:00'),
    epochs: 50,
    precision: 0.9589,
    recall: 0.9376,
    mAP: 0.9103,
    boxLoss: 0.0087,
    classLoss: 0.0124,
    objectLoss: 0.0188,
    fileSize: '142 MB',
    isActive: true,
  },
  {
    id: 'ckpt-4',
    name: 'v2.4.0_tuned',
    createdAt: new Date('2026-03-08T16:45:00'),
    epochs: 50,
    precision: 0.9641,
    recall: 0.9401,
    mAP: 0.9156,
    boxLoss: 0.0083,
    classLoss: 0.0118,
    objectLoss: 0.0182,
    fileSize: '142 MB',
    isActive: false,
  },
  {
    id: 'ckpt-5',
    name: 'v2.5.0_final',
    createdAt: new Date('2026-03-15T11:20:00'),
    epochs: 50,
    precision: 0.9687,
    recall: 0.9458,
    mAP: 0.9212,
    boxLoss: 0.0080,
    classLoss: 0.0112,
    objectLoss: 0.0179,
    fileSize: '142 MB',
    isActive: false,
  },
];

const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

const createEmptyCondition = (): SingleCondition => ({
  id: generateId(),
  field: 'bb_100',
  operator: '>',
  value: '',
});

const createEmptyGroup = (): ConditionGroup => ({
  id: generateId(),
  logic: 'AND',
  items: [createEmptyCondition()],
});

const createEmptyRootGroup = (): ConditionGroup => ({
  id: generateId(),
  logic: 'AND',
  items: [createEmptyCondition()],
});

function isConditionGroup(item: SingleCondition | ConditionGroup): item is ConditionGroup {
  return 'items' in item && 'logic' in item;
}

function ConditionCard({ 
  condition, 
  resource, 
  onUpdate, 
  onRemove,
  depth = 0 
}: { 
  condition: SingleCondition; 
  resource: Resource;
  onUpdate: (updated: SingleCondition) => void;
  onRemove: () => void;
  depth?: number;
}) {
  const fields = resourceFields[resource];
  const currentField = fields.find(f => f.field === condition.field);
  const fieldType = currentField?.type || 'text';
  const operators = operatorsByType[fieldType];
  const needsValueEnd = condition.operator === 'between';

  const handleFieldChange = (field: string) => {
    const newField = fields.find(f => f.field === field);
    const newFieldType = newField?.type || 'text';
    const newOperators = operatorsByType[newFieldType];
    onUpdate({
      ...condition,
      field,
      operator: newOperators[0].value,
      value: '',
      valueEnd: undefined,
    });
  };

  return (
    <div className={`flex items-center gap-1.5 ${depth > 0 ? 'pl-4 border-l-2 border-gray-200' : ''}`} onClick={(e) => e.stopPropagation()} onWheel={(e) => e.stopPropagation()}>
      <select
        value={condition.field}
        onChange={(e) => { e.stopPropagation(); handleFieldChange(e.target.value); }}
        onClick={(e) => e.stopPropagation()}
        onWheel={(e) => e.stopPropagation()}
        className="flex-1 min-w-[80px] px-2 py-1.5 text-xs bg-white border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500/30 focus:border-indigo-300 text-gray-700"
      >
        {fields.map(f => (
          <option key={f.field} value={f.field}>{f.label}</option>
        ))}
      </select>
      
      <select
        value={condition.operator}
        onChange={(e) => { e.stopPropagation(); onUpdate({ ...condition, operator: e.target.value }); }}
        onClick={(e) => e.stopPropagation()}
        onWheel={(e) => e.stopPropagation()}
        className="w-20 px-2 py-1.5 text-xs bg-white border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500/30 focus:border-indigo-300 text-gray-700"
      >
        {operators.map(op => (
          <option key={op.value} value={op.value}>{op.label}</option>
        ))}
      </select>

      {!['is_empty', 'is_not_empty'].includes(condition.operator) && (
        <>
          {fieldType === 'enum' && currentField?.options ? (
            <select
              value={condition.value}
              onChange={(e) => { e.stopPropagation(); onUpdate({ ...condition, value: e.target.value }); }}
              onClick={(e) => e.stopPropagation()}
              onWheel={(e) => e.stopPropagation()}
              className="flex-1 min-w-[60px] px-2 py-1.5 text-xs bg-white border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500/30 focus:border-indigo-300 text-gray-700"
            >
              <option value="">Select...</option>
              {currentField.options.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          ) : fieldType === 'date' ? (
            <input
              type="date"
              value={condition.value}
              onChange={(e) => { e.stopPropagation(); onUpdate({ ...condition, value: e.target.value }); }}
              onClick={(e) => e.stopPropagation()}
              onWheel={(e) => e.stopPropagation()}
              className="flex-1 min-w-[80px] px-2 py-1.5 text-xs bg-white border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500/30 focus:border-indigo-300 text-gray-700"
            />
          ) : (
            <>
              <input
                type="number"
                value={condition.value}
                onChange={(e) => { e.stopPropagation(); onUpdate({ ...condition, value: e.target.value }); }}
                onClick={(e) => e.stopPropagation()}
                onWheel={(e) => e.stopPropagation()}
                placeholder="Value"
                className="flex-1 min-w-[50px] px-2 py-1.5 text-xs bg-white border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500/30 focus:border-indigo-300 text-gray-700 placeholder-gray-400"
              />
              {needsValueEnd && (
                <>
                  <span className="text-xs text-gray-400">and</span>
                  <input
                    type="number"
                    value={condition.valueEnd || ''}
                    onChange={(e) => { e.stopPropagation(); onUpdate({ ...condition, valueEnd: e.target.value }); }}
                    onClick={(e) => e.stopPropagation()}
                    onWheel={(e) => e.stopPropagation()}
                    placeholder="End"
                    className="flex-1 min-w-[50px] px-2 py-1.5 text-xs bg-white border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500/30 focus:border-indigo-300 text-gray-700 placeholder-gray-400"
                  />
                </>
              )}
            </>
          )}
        </>
      )}

      <button
        onClick={(e) => { e.stopPropagation(); onRemove(); }}
        className="w-5 h-5 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
      >
        <X className="w-3 h-3" />
      </button>
    </div>
  );
}

function GroupCard({
  group,
  resource,
  onUpdate,
  onRemove,
  depth = 0,
  isRoot = false
}: {
  group: ConditionGroup;
  resource: Resource;
  onUpdate: (updated: ConditionGroup) => void;
  onRemove?: () => void;
  depth?: number;
  isRoot?: boolean;
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleAddCondition = () => {
    onUpdate({
      ...group,
      items: [...group.items, createEmptyCondition()],
    });
  };

  const handleAddGroup = () => {
    onUpdate({
      ...group,
      items: [...group.items, createEmptyGroup()],
    });
  };

  const handleUpdateItem = (index: number, updated: SingleCondition | ConditionGroup) => {
    const newItems = [...group.items];
    newItems[index] = updated;
    onUpdate({ ...group, items: newItems });
  };

  const handleRemoveItem = (index: number) => {
    const newItems = group.items.filter((_, i) => i !== index);
    onUpdate({ ...group, items: newItems });
  };

  const handleLogicChange = (logic: LogicOperator) => {
    onUpdate({ ...group, logic });
  };

  return (
    <div className={`rounded-lg border ${depth > 0 ? 'border-gray-200 bg-gray-50/50' : 'border-gray-200 bg-white'} ${isRoot ? '' : 'p-2'}`} onClick={(e) => e.stopPropagation()} onWheel={(e) => e.stopPropagation()}>
      <div className="flex items-center justify-between px-2 py-1.5 border-b border-gray-100">
        <div className="flex items-center gap-2">
          {!isRoot && (
            <select
              value={group.logic}
              onChange={(e) => handleLogicChange(e.target.value as LogicOperator)}
              onClick={(e) => e.stopPropagation()}
              onWheel={(e) => e.stopPropagation()}
              className="px-2 py-0.5 text-xs font-medium bg-indigo-50 border border-indigo-200 rounded text-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-500/30"
            >
              <option value="AND">AND</option>
              <option value="OR">OR</option>
            </select>
          )}
          {isRoot && (
            <span className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">
              {group.items.length} condition{group.items.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          {!isRoot && onRemove && (
            <button
              onClick={(e) => { e.stopPropagation(); onRemove(); }}
              className="w-5 h-5 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          )}
          <button
            onClick={(e) => { e.stopPropagation(); setIsCollapsed(!isCollapsed); }}
            className="w-5 h-5 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
          >
            <ChevronRight className={`w-3 h-3 transition-transform ${isCollapsed ? '' : 'rotate-90'}`} />
          </button>
        </div>
      </div>

      {!isCollapsed && (
        <div className="p-2 space-y-1.5">
          {group.items.map((item, index) => (
            <div key={isConditionGroup(item) ? item.id : item.id}>
              {index > 0 && (
                <div className="flex items-center justify-center py-1">
                  <span className="text-[10px] font-medium text-gray-400 bg-white px-2 py-0.5 rounded border border-gray-200">
                    {group.logic}
                  </span>
                </div>
              )}
              {isConditionGroup(item) ? (
                <GroupCard
                  group={item}
                  resource={resource}
                  onUpdate={(updated) => handleUpdateItem(index, updated)}
                  onRemove={() => handleRemoveItem(index)}
                  depth={depth + 1}
                />
              ) : (
                <ConditionCard
                  condition={item}
                  resource={resource}
                  onUpdate={(updated) => handleUpdateItem(index, updated)}
                  onRemove={() => handleRemoveItem(index)}
                  depth={depth}
                />
              )}
            </div>
          ))}

          <div className="flex items-center gap-2 pt-1.5 border-t border-gray-100 mt-2">
            <button
              onClick={(e) => { e.stopPropagation(); handleAddCondition(); }}
              className="flex items-center gap-1 px-2 py-1 text-xs text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors"
            >
              <Plus className="w-3 h-3" />
              Add condition
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); handleAddGroup(); }}
              className="flex items-center gap-1 px-2 py-1 text-xs text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors"
            >
              <Plus className="w-3 h-3" />
              Add group
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function ConditionNode({ data, selected, id }: NodeProps<{ data: ConditionNodeData }> & { id: string }) {
  const { setNodes, setEdges } = useReactFlow();
  
  const handleDelete = () => {
    setNodes((nds) => nds.filter((n) => n.id !== id));
    setEdges((eds) => eds.filter((e) => e.source !== id && e.target !== id));
  };

  const handleUpdateRootGroup = (updated: ConditionGroup) => {
    setNodes(nds => nds.map(node => {
      if (node.id === id && node.type === 'condition') {
        return {
          ...node,
          data: {
            ...node.data,
            rootGroup: updated
          }
        };
      }
      return node;
    }));
  };

  const handleNameChange = (name: string) => {
    setNodes(nds => nds.map(node => {
      if (node.id === id && node.type === 'condition') {
        return {
          ...node,
          data: {
            ...node.data,
            name
          }
        };
      }
      return node;
    }));
  };

  const handleResourceChange = (resource: Resource) => {
    const firstField = resourceFields[resource][0].field;
    const newRootGroup: ConditionGroup = {
      id: generateId(),
      logic: 'AND',
      items: [{
        id: generateId(),
        field: firstField,
        operator: '>',
        value: ''
      }]
    };
    setNodes(nds => nds.map(node => {
      if (node.id === id && node.type === 'condition') {
        return {
          ...node,
          data: {
            ...node.data,
            resource,
            rootGroup: newRootGroup
          }
        };
      }
      return node;
    }));
  };

  return (
    <div className={`bg-white rounded-xl border shadow-sm transition-all duration-200 ${selected ? 'border-indigo-400 shadow-md shadow-indigo-100' : 'border-gray-200 hover:border-gray-300'}`}>
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleDelete();
        }}
        className="absolute -top-2 -right-2 w-5 h-5 bg-white border border-gray-200 rounded-full flex items-center justify-center hover:bg-red-50 hover:border-red-200 hover:text-red-500 transition-colors z-10"
      >
        <X className="w-3 h-3" />
      </button>
      <div className="flex items-center justify-between">
        <div className={`px-3 py-2.5 rounded-t-xl border-b border-r flex-1 ${selected ? 'bg-indigo-50 border-indigo-100' : 'bg-gray-50 border-gray-100'}`}>
          <div className="flex items-center gap-2">
            <AlertTriangle className={`w-4 h-4 ${selected ? 'text-indigo-500' : 'text-gray-400'}`} />
            <span className={`font-medium text-sm ${selected ? 'text-indigo-700' : 'text-gray-600'}`}>Condition</span>
          </div>
        </div>
      </div>
      <Handle type="target" position={Position.Left} className="!bg-gray-400 !w-2 !h-2 hover:!bg-indigo-500 transition-colors" />
      <Handle type="source" position={Position.Right} className="!bg-gray-400 !w-2 !h-2 hover:!bg-indigo-500 transition-colors" />
      <div className="p-3 space-y-3" onWheel={(e) => e.stopPropagation()} onTouchMove={(e) => e.stopPropagation()} onClick={(e) => e.stopPropagation()}>
        <div>
          <label className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">Name</label>
          <input
            type="text"
            value={data.name}
            onChange={(e) => handleNameChange(e.target.value)}
            onClick={(e) => e.stopPropagation()}
            onWheel={(e) => e.stopPropagation()}
            className="w-full mt-1 px-2 py-1.5 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-300 text-gray-700 placeholder-gray-400"
            placeholder="e.g., High Roller Check"
          />
        </div>
        <div>
          <label className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">Resource</label>
          <select
            value={data.resource}
            onChange={(e) => handleResourceChange(e.target.value as Resource)}
            onClick={(e) => e.stopPropagation()}
            onWheel={(e) => e.stopPropagation()}
            className="w-full mt-1 px-2 py-1.5 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-300 text-gray-700"
          >
            <option value="player">Player</option>
            <option value="session">Session</option>
            <option value="wallet">Wallet</option>
            <option value="operation">Operation</option>
          </select>
        </div>
        <div className="pt-1">
          <GroupCard
            group={data.rootGroup}
            resource={data.resource}
            onUpdate={handleUpdateRootGroup}
            isRoot={true}
          />
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

  const getActionStyles = (action: Action) => {
    switch (action) {
      case 'up': return {
        active: 'bg-indigo-500 border-indigo-600 text-white',
        hover: 'hover:bg-indigo-50 hover:border-indigo-300',
        text: 'text-indigo-500'
      };
      case 'down': return {
        active: 'bg-rose-500 border-rose-600 text-white',
        hover: 'hover:bg-rose-50 hover:border-rose-300',
        text: 'text-rose-500'
      };
      case 'stay': return {
        active: 'bg-gray-500 border-gray-600 text-white',
        hover: 'hover:bg-gray-100 hover:border-gray-400',
        text: 'text-gray-500'
      };
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
      case 'up': return 'Up';
      case 'down': return 'Down';
      case 'stay': return 'Stay';
    }
  };

  const handleActionChange = (action: Action) => {
    setNodes(nds => nds.map(node => {
      if (node.id === id && node.type === 'action') {
        return {
          ...node,
          data: {
            ...node.data,
            action
          }
        };
      }
      return node;
    }));
  };

  const currentStyle = getActionStyles(data.action);

  return (
    <div className={`bg-white rounded-xl border shadow-sm transition-all duration-200 min-w-[180px] ${selected ? 'border-indigo-400 shadow-md shadow-indigo-100' : 'border-gray-200 hover:border-gray-300'}`} onClick={(e) => e.stopPropagation()}>
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleDelete();
        }}
        className="absolute -top-2 -right-2 w-5 h-5 bg-white border border-gray-200 rounded-full flex items-center justify-center hover:bg-red-50 hover:border-red-200 hover:text-red-500 transition-colors z-10"
      >
        <X className="w-3 h-3" />
      </button>
      <Handle type="target" position={Position.Left} className="!bg-gray-400 !w-2 !h-2 hover:!bg-indigo-500 transition-colors" />
      <div className={`px-3 py-2.5 rounded-t-xl border-b ${selected ? 'bg-indigo-50 border-indigo-100' : 'bg-gray-50 border-gray-100'}`}>
        <div className="flex items-center gap-2">
          <TrendingUp className={`w-4 h-4 ${selected ? 'text-indigo-500' : 'text-gray-400'}`} />
          <span className={`font-medium text-sm ${selected ? 'text-indigo-700' : 'text-gray-600'}`}>Action</span>
        </div>
      </div>
      <div className="p-4" onClick={(e) => e.stopPropagation()}>
        <div className="flex gap-1.5">
          {actions.map(action => {
            const style = getActionStyles(action);
            return (
              <button
                key={action}
                onClick={(e) => {
                  e.stopPropagation();
                  handleActionChange(action);
                }}
                className={`flex-1 flex items-center justify-center gap-1 px-2 py-2.5 rounded-lg text-xs font-medium transition-all border ${data.action === action ? style.active : `bg-white border-gray-200 ${style.hover}`}`}
              >
                {getActionIcon(action)}
                <span className="hidden lg:inline">{getActionLabel(action)}</span>
              </button>
            );
          })}
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
    <div className={`bg-white/50 backdrop-blur-sm rounded-xl border-2 border-dashed min-w-[280px] min-h-[240px] transition-all duration-200 ${selected ? 'border-indigo-400 shadow-md shadow-indigo-100' : 'border-gray-300 hover:border-gray-400'}`}>
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleDelete();
        }}
        className="absolute -top-2 -right-2 w-5 h-5 bg-white border border-gray-200 rounded-full flex items-center justify-center hover:bg-red-50 hover:border-red-200 hover:text-red-500 transition-colors z-10"
      >
        <X className="w-3 h-3" />
      </button>
      <Handle type="target" position={Position.Left} className="!bg-gray-400 !w-2 !h-2 hover:!bg-indigo-500 transition-colors" />
      <div className={`px-4 py-3 rounded-t-xl border-b ${selected ? 'bg-indigo-50 border-indigo-100' : 'bg-gray-100 border-gray-200'}`}>
        <div className="flex items-center gap-2">
          <Layers className={`w-4 h-4 ${selected ? 'text-indigo-500' : 'text-gray-400'}`} />
          <span className={`font-medium text-sm ${selected ? 'text-indigo-700' : 'text-gray-600'}`}>{data.name || 'Level'}</span>
        </div>
      </div>
      <div className="p-4 pt-6 min-h-[180px]">
        <div className={`text-xs ${selected ? 'text-indigo-400' : 'text-gray-400'}`}>Drop conditions here</div>
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

  const [aiSubTab, setAiSubTab] = useState<'decisions' | 'metrics' | 'checkpoints'>('decisions');
  const [metricsHistory] = useState<ModelMetrics[]>(initialMetricsHistory);
  const [epochRange, setEpochRange] = useState<string>('all');
  const [isTraining, setIsTraining] = useState(false);
  const [trainingProgress, setTrainingProgress] = useState(0);
  const [currentEpoch, setCurrentEpoch] = useState(0);
  const [checkpoints, setCheckpoints] = useState<Checkpoint[]>(initialCheckpoints);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [checkpointToDelete, setCheckpointToDelete] = useState<string | null>(null);
  const trainingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Levels state
  const [levels, setLevels] = useState<RiskLevel[]>([
    {
      id: 'level-1',
      name: 'Level 1',
      nodes: [
        {
          id: 'cond-1',
          type: 'condition',
          position: { x: 100, y: 80 },
          data: { 
            name: 'Check Profit', 
            resource: 'player',
            rootGroup: {
              id: 'rg-1',
              logic: 'AND',
              items: [
                { id: 'c-1', field: 'bb_100', operator: '>', value: '50' }
              ]
            }
          },
        },
        {
          id: 'action-1',
          type: 'action',
          position: { x: 400, y: 80 },
          data: { action: 'up' },
        },
      ],
      edges: [
        { id: 'e1', source: 'cond-1', target: 'action-1' },
      ],
      createdAt: new Date('2026-03-01'),
    },
    {
      id: 'level-2',
      name: 'Level 2',
      nodes: [
        {
          id: 'cond-2',
          type: 'condition',
          position: { x: 100, y: 80 },
          data: { 
            name: 'Check Loss', 
            resource: 'player',
            rootGroup: {
              id: 'rg-2',
              logic: 'AND',
              items: [
                { id: 'c-2', field: 'bb_100', operator: '<', value: '-30' }
              ]
            }
          },
        },
        {
          id: 'action-2',
          type: 'action',
          position: { x: 400, y: 80 },
          data: { action: 'down' },
        },
      ],
      edges: [
        { id: 'e2', source: 'cond-2', target: 'action-2' },
      ],
      createdAt: new Date('2026-03-05'),
    },
  ]);
  const [editingLevelId, setEditingLevelId] = useState<string | null>(null);
  const [editingLevelName, setEditingLevelName] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newLevelName, setNewLevelName] = useState('');

  useEffect(() => {
    const initialDecisions = generateMockAIDecisions(20);
    setAiDecisions(initialDecisions);
  }, []);

  useEffect(() => {
    return () => {
      if (trainingIntervalRef.current) {
        clearInterval(trainingIntervalRef.current);
      }
    };
  }, []);

  const startTraining = () => {
    setIsTraining(true);
    setTrainingProgress(0);
    setCurrentEpoch(0);
    let epoch = 0;
    trainingIntervalRef.current = setInterval(() => {
      epoch += 1;
      setCurrentEpoch(epoch);
      setTrainingProgress(Math.round((epoch / TOTAL_EPOCHS) * 100));
      if (epoch >= TOTAL_EPOCHS) {
        clearInterval(trainingIntervalRef.current!);
        trainingIntervalRef.current = null;
        setIsTraining(false);
        const lastMetrics = metricsHistory[metricsHistory.length - 1];
        const newCheckpoint: Checkpoint = {
          id: generateId(),
          name: `v${(checkpoints.length + 1).toFixed(1).replace('.', '.')}_manual`,
          createdAt: new Date(),
          epochs: TOTAL_EPOCHS,
          precision: lastMetrics.precision,
          recall: lastMetrics.recall,
          mAP: lastMetrics.mAP,
          boxLoss: lastMetrics.boxLoss,
          classLoss: lastMetrics.classLoss,
          objectLoss: lastMetrics.objectLoss,
          fileSize: '142 MB',
          isActive: false,
        };
        setCheckpoints(prev => [newCheckpoint, ...prev]);
      }
    }, 200);
  };

  const cancelTraining = () => {
    if (trainingIntervalRef.current) {
      clearInterval(trainingIntervalRef.current);
      trainingIntervalRef.current = null;
    }
    setIsTraining(false);
    setTrainingProgress(0);
    setCurrentEpoch(0);
  };

  const handleSetActive = (id: string) => {
    setCheckpoints(prev => prev.map(cp => ({ ...cp, isActive: cp.id === id })));
  };

  const handleDeleteCheckpoint = () => {
    if (!checkpointToDelete) return;
    setCheckpoints(prev => prev.filter(cp => cp.id !== checkpointToDelete));
    setCheckpointToDelete(null);
    setDeleteDialogOpen(false);
  };

  const handleDownloadCheckpoint = (checkpoint: Checkpoint) => {
    const blob = new Blob([`# Checkpoint: ${checkpoint.name}\nEpochs: ${checkpoint.epochs}\nPrecision: ${checkpoint.precision}\nRecall: ${checkpoint.recall}\nmAP: ${checkpoint.mAP}`], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${checkpoint.name}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const latestMetrics = metricsHistory[metricsHistory.length - 1];

  const filteredMetricsHistory = useMemo(() => {
    if (epochRange === 'all') return metricsHistory;
    const limit = parseInt(epochRange);
    return metricsHistory.filter(m => m.epoch <= limit);
  }, [metricsHistory, epochRange]);



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
    (params: Connection) => setEdges((eds) => addEdge({ ...params, animated: true }, eds)),
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

      const position = { x: dropPosition.x - 100, y: dropPosition.y - 50 };

      let newNode;
      if (nodeType === 'condition') {
        newNode = {
          id: `cond-${Date.now()}`,
          type: 'condition',
          position,
          data: { 
            name: '', 
            resource: 'player' as Resource,
            rootGroup: {
              id: generateId(),
              logic: 'AND' as LogicOperator,
              items: [{
                id: generateId(),
                field: 'bb_100',
                operator: '>',
                value: ''
              }]
            }
          },
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
      setEditingLevelName(level.name);
    }
  };

  const handleSaveLevel = () => {
    if (!editingLevelId) return;

    setLevels(levels.map(level => 
      level.id === editingLevelId
        ? { ...level, nodes, edges, name: editingLevelName.trim() || level.name }
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
            <span className="text-sm font-medium">Training</span>
            <span className="ml-1.5 px-1.5 py-0.5 text-[10px] font-bold bg-yellow-400 text-yellow-900 rounded">Beta</span>
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
            <span className="text-sm font-medium">Levels</span>
          </button>
        </div>
      </div>

      {/* Right Panel - Content */}
      <div className="flex-1 overflow-hidden">
        {selectedOption === 'ai' ? (
          <div className="h-full flex flex-col bg-white border border-slate-200 rounded-xl overflow-hidden">
            {/* Sub-tab Navigation */}
            <div className="flex items-center gap-1 px-4 pt-3 border-b border-slate-200 bg-slate-50">
              <button
                onClick={() => setAiSubTab('decisions')}
                className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-t-lg border-b-2 transition-colors ${
                  aiSubTab === 'decisions'
                    ? 'border-slate-800 text-slate-800 bg-white'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Database className="w-4 h-4" />
                Decisions
              </button>
              <button
                onClick={() => setAiSubTab('metrics')}
                className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-t-lg border-b-2 transition-colors ${
                  aiSubTab === 'metrics'
                    ? 'border-slate-800 text-slate-800 bg-white'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-100'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                Model Metrics
              </button>
              <button
                onClick={() => setAiSubTab('checkpoints')}
                className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-t-lg border-b-2 transition-colors ${
                  aiSubTab === 'checkpoints'
                    ? 'border-slate-800 text-slate-800 bg-white'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Layers3 className="w-4 h-4" />
                Checkpoints
              </button>
            </div>

            {/* Sub-tab Content */}
            {aiSubTab === 'decisions' ? (
              <>
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
              </>
            ) : aiSubTab === 'metrics' ? (
              <div className="flex-1 overflow-y-auto p-5">
                {/* Metric Summary Cards */}
                <div className="grid grid-cols-4 gap-4 mb-6">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-slate-500 uppercase">Precision</span>
                        <Target className="w-4 h-4 text-slate-400" />
                      </div>
                      <div className="text-2xl font-bold text-slate-800">{latestMetrics.precision.toFixed(4)}</div>
                      <div className="flex items-center gap-1 mt-1 text-xs text-emerald-600">
                        <TrendingUp className="w-3 h-3" />
                        +2.4% from baseline
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-slate-500 uppercase">Recall</span>
                        <Activity className="w-4 h-4 text-slate-400" />
                      </div>
                      <div className="text-2xl font-bold text-slate-800">{latestMetrics.recall.toFixed(4)}</div>
                      <div className="flex items-center gap-1 mt-1 text-xs text-emerald-600">
                        <TrendingUp className="w-3 h-3" />
                        +3.1% from baseline
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-slate-500 uppercase">mAP</span>
                        <Layers className="w-4 h-4 text-slate-400" />
                      </div>
                      <div className="text-2xl font-bold text-slate-800">{latestMetrics.mAP.toFixed(4)}</div>
                      <div className="flex items-center gap-1 mt-1 text-xs text-emerald-600">
                        <TrendingUp className="w-3 h-3" />
                        +4.2% from baseline
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-slate-500 uppercase">Total Epochs</span>
                        <Clock className="w-4 h-4 text-slate-400" />
                      </div>
                      <div className="text-2xl font-bold text-slate-800">{TOTAL_EPOCHS}</div>
                      <div className="flex items-center gap-1 mt-1 text-xs text-slate-400">
                        {filteredMetricsHistory.length} epochs shown
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Epoch Range Filter */}
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xs font-medium text-slate-500 uppercase">Epoch Range:</span>
                  {['10', '25', 'all'].map((range) => (
                    <button
                      key={range}
                      onClick={() => setEpochRange(range)}
                      className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                        epochRange === range
                          ? 'bg-slate-800 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {range === 'all' ? 'All' : `First ${range}`}
                    </button>
                  ))}
                </div>

                {/* mAP Chart */}
                <Card className="mb-4">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base font-semibold">Mean Average Precision (mAP) per Epoch</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={240}>
                      <LineChart data={filteredMetricsHistory}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200" />
                        <XAxis
                          dataKey="epoch"
                          tick={{ fontSize: 11, fill: '#64748b' }}
                          tickLine={false}
                          axisLine={false}
                          label={{ value: 'Epoch', position: 'insideBottom', offset: -4, style: { fontSize: 11, fill: '#64748b' } }}
                        />
                        <YAxis
                          domain={[0.5, 1]}
                          tick={{ fontSize: 11, fill: '#64748b' }}
                          tickLine={false}
                          axisLine={false}
                          tickFormatter={(v) => v.toFixed(2)}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#fff',
                            border: '1px solid #e2e8f0',
                            borderRadius: '8px',
                            fontSize: '12px',
                            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                          }}
                          formatter={(value: number) => [value.toFixed(4), 'mAP']}
                          labelFormatter={(label) => `Epoch ${label}`}
                        />
                        <Line type="monotone" dataKey="mAP" stroke="#a855f7" strokeWidth={2.5} dot={false} activeDot={{ r: 4 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Precision & Recall / Loss Metrics / Confusion Matrix — 3-column */}
                <div className="grid grid-cols-3 gap-4 mb-4">
                  {/* Precision & Recall Chart */}
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base font-semibold">Precision & Recall</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={220}>
                        <LineChart data={filteredMetricsHistory}>
                          <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200" />
                          <XAxis
                            dataKey="epoch"
                            tick={{ fontSize: 11, fill: '#64748b' }}
                            tickLine={false}
                            axisLine={false}
                          />
                          <YAxis
                            domain={[0.5, 1]}
                            tick={{ fontSize: 11, fill: '#64748b' }}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(v) => v.toFixed(1)}
                          />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: '#fff',
                              border: '1px solid #e2e8f0',
                              borderRadius: '8px',
                              fontSize: '12px',
                              boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                            }}
                          />
                          <Legend wrapperStyle={{ fontSize: 12 }} />
                          <Line type="monotone" dataKey="precision" stroke="#3b82f6" strokeWidth={2} dot={false} />
                          <Line type="monotone" dataKey="recall" stroke="#22c55e" strokeWidth={2} dot={false} />
                        </LineChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  {/* Loss Metrics Chart */}
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base font-semibold">Loss Metrics</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={220}>
                        <LineChart data={filteredMetricsHistory}>
                          <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200" />
                          <XAxis
                            dataKey="epoch"
                            tick={{ fontSize: 11, fill: '#64748b' }}
                            tickLine={false}
                            axisLine={false}
                          />
                          <YAxis
                            tick={{ fontSize: 11, fill: '#64748b' }}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(v) => v.toFixed(2)}
                          />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: '#fff',
                              border: '1px solid #e2e8f0',
                              borderRadius: '8px',
                              fontSize: '12px',
                              boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                            }}
                          />
                          <Legend wrapperStyle={{ fontSize: 12 }} />
                          <Line type="monotone" dataKey="boxLoss" stroke="#f97316" strokeWidth={2} dot={false} />
                          <Line type="monotone" dataKey="classLoss" stroke="#ef4444" strokeWidth={2} dot={false} />
                          <Line type="monotone" dataKey="objectLoss" stroke="#06b6d4" strokeWidth={2} dot={false} />
                        </LineChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  {/* Confusion Matrix */}
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base font-semibold">Confusion Matrix</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col gap-1">
                        <div className="grid grid-cols-[1fr_repeat(3,1fr)] gap-1 mb-1">
                          <div />
                          <div className="text-center text-xs font-semibold text-slate-600 py-1">Go Up</div>
                          <div className="text-center text-xs font-semibold text-slate-600 py-1">Go Down</div>
                          <div className="text-center text-xs font-semibold text-slate-600 py-1">Stay</div>
                        </div>
                        {[
                          { label: 'Go Up', values: [0.92, 0.04, 0.04] },
                          { label: 'Go Down', values: [0.03, 0.90, 0.07] },
                          { label: 'Stay', values: [0.05, 0.08, 0.87] },
                        ].map((row) => {
                          const maxVal = Math.max(...row.values);
                          return (
                            <div key={row.label} className="grid grid-cols-[1fr_repeat(3,1fr)] gap-1 items-center">
                              <div className="text-xs font-semibold text-slate-600 py-2 pl-1">{row.label}</div>
                              {row.values.map((val, i) => {
                                const intensity = val / maxVal;
                                return (
                                  <div
                                    key={i}
                                    className="relative rounded flex items-center justify-center py-2"
                                    style={{ backgroundColor: `rgba(99, 102, 241, ${intensity * 0.85 + 0.05})` }}
                                  >
                                    <span className={`text-xs font-bold ${intensity > 0.5 ? 'text-white' : 'text-slate-800'}`}>
                                      {(val * 100).toFixed(0)}%
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                          );
                        })}
                        <div className="grid grid-cols-3 gap-1 mt-3 pt-3 border-t border-slate-100">
                          {[
                            { label: 'Precision', value: latestMetrics.precision },
                            { label: 'Recall', value: latestMetrics.recall },
                            { label: 'F1-Score', value: (2 * latestMetrics.precision * latestMetrics.recall) / (latestMetrics.precision + latestMetrics.recall) },
                          ].map((metric) => (
                            <div key={metric.label} className="text-center">
                              <div className="text-xs text-slate-500 mb-0.5">{metric.label}</div>
                              <div className="text-sm font-bold text-slate-800">{metric.value.toFixed(4)}</div>
                            </div>
                          ))}
                        </div>
                        <div className="grid grid-cols-3 gap-1 mt-1">
                          {[
                            { label: 'Go Up Prec', value: 0.9234 },
                            { label: 'Go Up Rec', value: 0.9156 },
                            { label: 'Go Up F1', value: 0.9195 },
                          ].map((metric) => (
                            <div key={metric.label} className="text-center">
                              <div className="text-xs text-slate-400 mb-0.5">{metric.label}</div>
                              <div className="text-xs font-medium text-slate-700">{metric.value.toFixed(4)}</div>
                            </div>
                          ))}
                        </div>
                        <div className="grid grid-cols-3 gap-1 mt-1">
                          {[
                            { label: 'Go Down Prec', value: 0.9102 },
                            { label: 'Go Down Rec', value: 0.9078 },
                            { label: 'Go Down F1', value: 0.9090 },
                          ].map((metric) => (
                            <div key={metric.label} className="text-center">
                              <div className="text-xs text-slate-400 mb-0.5">{metric.label}</div>
                              <div className="text-xs font-medium text-slate-700">{metric.value.toFixed(4)}</div>
                            </div>
                          ))}
                        </div>
                        <div className="grid grid-cols-3 gap-1 mt-1">
                          {[
                            { label: 'Stay Prec', value: 0.8931 },
                            { label: 'Stay Rec', value: 0.8842 },
                            { label: 'Stay F1', value: 0.8886 },
                          ].map((metric) => (
                            <div key={metric.label} className="text-center">
                              <div className="text-xs text-slate-400 mb-0.5">{metric.label}</div>
                              <div className="text-xs font-medium text-slate-700">{metric.value.toFixed(4)}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto p-5">
                {/* Training Panel */}
                <Card className="mb-6">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base font-semibold flex items-center gap-2">
                      <Brain className="w-5 h-5 text-slate-600" />
                      Manual Training
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {!isTraining ? (
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-slate-600 mb-1">
                            Run a manual training iteration on the current dataset
                          </p>
                          <p className="text-xs text-slate-400">
                            This will train the model for {TOTAL_EPOCHS} epochs and create a new checkpoint upon completion.
                          </p>
                        </div>
                        <Button
                          onClick={startTraining}
                          className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700"
                        >
                          <Rocket className="w-4 h-4" />
                          Start Training
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center animate-pulse">
                              <Brain className="w-4 h-4 text-slate-600" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-slate-800">Training in progress...</p>
                              <p className="text-xs text-slate-500">Epoch {currentEpoch} / {TOTAL_EPOCHS}</p>
                            </div>
                          </div>
                          <Button
                            onClick={cancelTraining}
                            variant="outline"
                            className="text-slate-600 border-slate-300 hover:bg-slate-100"
                          >
                            Cancel
                          </Button>
                        </div>
                        <Progress value={trainingProgress} className="h-2" />
                        <div className="flex justify-between text-xs text-slate-500">
                          <span>{trainingProgress}% complete</span>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Checkpoints Table */}
                {checkpoints.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <Layers3 className="w-12 h-12 text-slate-300 mb-3" />
                    <p className="text-sm font-medium text-slate-600 mb-1">No checkpoints saved yet</p>
                    <p className="text-xs text-slate-400">Trigger a training run to create your first checkpoint.</p>
                  </div>
                ) : (
                  <div className="border border-slate-200 rounded-lg overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-slate-50 hover:bg-slate-50">
                          <TableHead className="text-xs font-semibold text-slate-500 uppercase">Name</TableHead>
                          <TableHead className="text-xs font-semibold text-slate-500 uppercase">Date</TableHead>
                          <TableHead className="text-xs font-semibold text-slate-500 uppercase">Epochs</TableHead>
                          <TableHead className="text-xs font-semibold text-slate-500 uppercase">Precision</TableHead>
                          <TableHead className="text-xs font-semibold text-slate-500 uppercase">Recall</TableHead>
                          <TableHead className="text-xs font-semibold text-slate-500 uppercase">mAP</TableHead>
                          <TableHead className="text-xs font-semibold text-slate-500 uppercase">Size</TableHead>
                          <TableHead className="text-xs font-semibold text-slate-500 uppercase">Status</TableHead>
                          <TableHead className="text-xs font-semibold text-slate-500 uppercase">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {checkpoints.map((checkpoint) => (
                          <TableRow key={checkpoint.id} className="hover:bg-slate-50">
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Database className="w-4 h-4 text-slate-400" />
                                <span className="text-sm font-medium text-slate-800">{checkpoint.name}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <span className="text-sm text-slate-600">{checkpoint.createdAt.toLocaleDateString()}</span>
                            </TableCell>
                            <TableCell>
                              <span className="text-sm text-slate-600">{checkpoint.epochs}</span>
                            </TableCell>
                            <TableCell>
                              <span className="text-sm text-slate-800 font-medium">{checkpoint.precision.toFixed(4)}</span>
                            </TableCell>
                            <TableCell>
                              <span className="text-sm text-slate-800 font-medium">{checkpoint.recall.toFixed(4)}</span>
                            </TableCell>
                            <TableCell>
                              <span className="text-sm text-slate-800 font-medium">{checkpoint.mAP.toFixed(4)}</span>
                            </TableCell>
                            <TableCell>
                              <span className="text-sm text-slate-500">{checkpoint.fileSize}</span>
                            </TableCell>
                            <TableCell>
                              {checkpoint.isActive ? (
                                <Badge variant="default" className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
                                  Active
                                </Badge>
                              ) : (
                                <Badge variant="secondary" className="bg-slate-100 text-slate-500 hover:bg-slate-100">
                                  Inactive
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                {!checkpoint.isActive && (
                                  <button
                                    onClick={() => handleSetActive(checkpoint.id)}
                                    className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded transition-colors"
                                    title="Set as active"
                                  >
                                    <CheckCircle2 className="w-4 h-4" />
                                  </button>
                                )}
                                <button
                                  onClick={() => handleDownloadCheckpoint(checkpoint)}
                                  className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded transition-colors"
                                  title="Download weights"
                                >
                                  <Download className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => {
                                    setCheckpointToDelete(checkpoint.id);
                                    setDeleteDialogOpen(true);
                                  }}
                                  className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                                  title="Delete checkpoint"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : editingLevelId ? (
          <div className="h-full flex flex-col bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm relative">
            {/* Toolbar with Back Button */}
            <div className="flex items-center justify-between p-3 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
              <button
                onClick={handleBackToLevels}
                className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm font-medium">Back to Levels</span>
              </button>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={editingLevelName}
                  onChange={(e) => setEditingLevelName(e.target.value)}
                  className="text-sm font-medium text-gray-900 bg-transparent border-b-2 border-gray-300 focus:border-indigo-500 focus:outline-none px-1 py-0.5 min-w-[150px]"
                  placeholder="Level name"
                />
              </div>
              <button
                onClick={handleSaveLevel}
                className="flex items-center gap-1.5 px-3 py-2 bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
              >
                Save Level
              </button>
            </div>

            {/* Floating Drag-Drop Sidebar */}
            <div className="absolute left-3 top-16 z-20 flex flex-col gap-2">
              <div
                draggable
                onDragStart={(e) => onDragStart(e, 'condition')}
                className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-lg shadow-sm cursor-grab hover:bg-gray-50 hover:border-indigo-300 hover:shadow-md transition-all"
              >
                <AlertTriangle className="w-5 h-5 text-indigo-500" />
                <span className="text-sm font-medium text-gray-700">Condition</span>
              </div>
              <div
                draggable
                onDragStart={(e) => onDragStart(e, 'action')}
                className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-lg shadow-sm cursor-grab hover:bg-gray-50 hover:border-indigo-300 hover:shadow-md transition-all"
              >
                <Zap className="w-5 h-5 text-indigo-500" />
                <span className="text-sm font-medium text-gray-700">Action</span>
              </div>
            </div>

            {/* React Flow Canvas */}
            <div className="flex-1 bg-gray-50 border border-gray-200 rounded-lg overflow-hidden">
              <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onDragOver={onDragOver}
                onDrop={onDrop}
                nodeTypes={nodeTypes}
                defaultEdgeOptions={{
                  type: 'smoothstep',
                  animated: true,
                  style: {
                    strokeWidth: 2,
                    stroke: '#94a3b8',
                    strokeDasharray: '5,5',
                  },
                }}
                connectionLineStyle={{
                  stroke: '#94a3b8',
                  strokeWidth: 2,
                  strokeDasharray: '5,5',
                }}
                snapToGrid={true}
                snapGrid={[15, 15]}
                fitView
                className="bg-gray-50"
              >
                <Controls className="!bg-white !border-gray-200 !shadow-lg [&>button]:!bg-white [&>button]:!border-gray-200 [&>button:hover]:!bg-gray-50 [&>svg]:!fill-gray-500" />
                <MiniMap
                  className="!bg-white !border-gray-200 !shadow-lg"
                  nodeColor={(node) => {
                    if (node.type === 'level') return '#94a3b8';
                    if (node.type === 'condition') return '#6366f1';
                    return '#22c55e';
                  }}
                  maskColor="rgba(248, 250, 252, 0.8)"
                />
                <Background color="#e2e8f0" gap={20} style={{ background: '#f8fafc' }} />
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

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete Checkpoint</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-slate-600">
            Are you sure you want to delete this checkpoint? This action cannot be undone.
          </p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              className="border-slate-300 text-slate-600"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeleteCheckpoint}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
