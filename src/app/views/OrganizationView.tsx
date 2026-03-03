import { useState } from 'react';
import { Network, Plus, GripVertical, ChevronDown, ChevronRight, Building2 } from 'lucide-react';

interface OrgNode {
  id: string;
  name: string;
  type: 'organization' | 'team' | 'player';
  children?: OrgNode[];
}

export function OrganizationView() {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(['org1', 'team1']));
  const [orgData] = useState<OrgNode>({
    id: 'org1',
    name: 'PokerTrack Organization',
    type: 'organization',
    children: [
      {
        id: 'team1',
        name: 'High Rollers',
        type: 'team',
        children: [
          { id: 'player1', name: 'Marcus Chen', type: 'player' },
          { id: 'player2', name: 'Sarah Mitchell', type: 'player' },
          { id: 'player3', name: 'David Rodriguez', type: 'player' },
        ]
      },
      {
        id: 'team2',
        name: 'Weekend Warriors',
        type: 'team',
        children: [
          { id: 'player4', name: 'Alex Thompson', type: 'player' },
          { id: 'player5', name: 'Emma Wilson', type: 'player' },
        ]
      },
      {
        id: 'team3',
        name: 'Professional Squad',
        type: 'team',
        children: [
          { id: 'player6', name: 'James Parker', type: 'player' },
          { id: 'player7', name: 'Lisa Anderson', type: 'player' },
          { id: 'player8', name: 'Mike Johnson', type: 'player' },
        ]
      }
    ]
  });

  const toggleNode = (nodeId: string) => {
    setExpandedNodes(prev => {
      const next = new Set(prev);
      if (next.has(nodeId)) {
        next.delete(nodeId);
      } else {
        next.add(nodeId);
      }
      return next;
    });
  };

  const renderNode = (node: OrgNode, level: number = 0) => {
    const isExpanded = expandedNodes.has(node.id);
    const hasChildren = node.children && node.children.length > 0;

    return (
      <div key={node.id} style={{ marginLeft: `${level * 24}px` }}>
        <div className={`
          flex items-center gap-2 p-3 rounded-lg hover:bg-gray-50 cursor-pointer group
          ${level === 0 ? 'bg-gray-50' : ''}
        `}>
          {hasChildren && (
            <button
              onClick={() => toggleNode(node.id)}
              className="text-gray-400 hover:text-gray-700 transition-colors"
            >
              {isExpanded ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </button>
          )}
          {!hasChildren && <div className="w-4" />}

          <div className={`
            w-8 h-8 rounded-lg flex items-center justify-center
            ${node.type === 'organization' ? 'bg-gradient-to-br from-blue-500 to-purple-600' : ''}
            ${node.type === 'team' ? 'bg-gradient-to-br from-green-500 to-emerald-600' : ''}
            ${node.type === 'player' ? 'bg-gray-200' : ''}
          `}>
            {node.type === 'organization' && <Network className="w-4 h-4 text-white" />}
            {node.type === 'team' && <Building2 className="w-4 h-4 text-white" />}
            {node.type === 'player' && <div className="w-2 h-2 bg-gray-600 rounded-full" />}
          </div>

          <span className="text-gray-900 font-medium flex-1">{node.name}</span>

          <span className={`
            text-xs px-2 py-1 rounded-full
            ${node.type === 'organization' ? 'bg-blue-100 text-blue-600' : ''}
            ${node.type === 'team' ? 'bg-green-100 text-green-600' : ''}
            ${node.type === 'player' ? 'bg-gray-100 text-gray-600' : ''}
          `}>
            {node.type}
          </span>

          <button className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-gray-700 transition-all cursor-grab">
            <GripVertical className="w-4 h-4" />
          </button>
        </div>

        {hasChildren && isExpanded && (
          <div className="border-l border-gray-200 ml-4">
            {node.children!.map(child => renderNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            Organization Structure
          </h1>
          <p className="text-gray-500 text-sm">
            Manage your organization's hierarchy and team assignments
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-lg transition-colors">
          <Plus className="w-4 h-4" />
          Add Node
        </button>
      </div>

      {/* Organization Tree */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Structure Tree</h2>
          <button className="text-sm text-blue-600 hover:text-blue-700 transition-colors">
            Expand All
          </button>
        </div>

        <div className="space-y-1">
          {renderNode(orgData)}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Reassign Players</h3>
          <p className="text-gray-500 text-sm mb-4">
            Move players between teams or create new assignments
          </p>
          <button className="w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors">
            Open Reassignment
          </button>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Bulk Operations</h3>
          <p className="text-gray-500 text-sm mb-4">
            Apply changes to multiple teams or players at once
          </p>
          <button className="w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors">
            View Options
          </button>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Export Structure</h3>
          <p className="text-gray-500 text-sm mb-4">
            Export your organization hierarchy as CSV or JSON
          </p>
          <button className="w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors">
            Export Data
          </button>
        </div>
      </div>
    </div>
  );
}
