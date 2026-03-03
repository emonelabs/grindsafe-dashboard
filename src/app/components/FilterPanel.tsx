import { useState } from 'react';
import { Search, Filter, Calendar, Users, DollarSign, TrendingUp } from 'lucide-react';

interface FilterPanelProps {
  onFilterChange: (filters: FilterState) => void;
}

export interface FilterState {
  searchQuery: string;
  timeRange: string;
  minPL: string;
  maxPL: string;
  playerStatus: string;
}

export function FilterPanel({ onFilterChange }: FilterPanelProps) {
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    timeRange: 'all',
    minPL: '',
    maxPL: '',
    playerStatus: 'all'
  });

  const [isExpanded, setIsExpanded] = useState(false);

  const updateFilter = (key: keyof FilterState, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-2xl border border-slate-700/50 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-slate-700/50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-blue-400" />
          <h3 className="font-semibold text-white">Filters & Data Explorer</h3>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="px-4 py-2 text-sm font-medium text-slate-300 hover:bg-slate-700/50 rounded-lg transition-colors"
        >
          {isExpanded ? 'Hide' : 'Show'} Filters
        </button>
      </div>

      {/* Search Bar - Always Visible */}
      <div className="p-4 border-b border-slate-700/50">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search players..."
            value={filters.searchQuery}
            onChange={(e) => updateFilter('searchQuery', e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Expanded Filters */}
      {isExpanded && (
        <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Time Range Filter */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
              <Calendar className="w-4 h-4" />
              Time Range
            </label>
            <select
              value={filters.timeRange}
              onChange={(e) => updateFilter('timeRange', e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-900/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="custom">Custom Range</option>
            </select>
          </div>

          {/* Player Status Filter */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
              <Users className="w-4 h-4" />
              Status
            </label>
            <select
              value={filters.playerStatus}
              onChange={(e) => updateFilter('playerStatus', e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-900/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Players</option>
              <option value="recording">Recording</option>
              <option value="paused">Paused</option>
              <option value="profitable">Profitable</option>
              <option value="losing">Losing</option>
            </select>
          </div>

          {/* Min P/L Filter */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
              <DollarSign className="w-4 h-4" />
              Min P/L
            </label>
            <input
              type="number"
              placeholder="Min P/L"
              value={filters.minPL}
              onChange={(e) => updateFilter('minPL', e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Max P/L Filter */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
              <TrendingUp className="w-4 h-4" />
              Max P/L
            </label>
            <input
              type="number"
              placeholder="Max P/L"
              value={filters.maxPL}
              onChange={(e) => updateFilter('maxPL', e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      )}

      {/* Quick Stats */}
      <div className="p-4 bg-slate-900/50 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center p-3 bg-slate-800/50 rounded-lg border border-slate-700/50">
          <div className="text-2xl font-bold text-white">6</div>
          <div className="text-xs text-slate-400">Active Players</div>
        </div>
        <div className="text-center p-3 bg-slate-800/50 rounded-lg border border-slate-700/50">
          <div className="text-2xl font-bold text-green-400">+$12,450</div>
          <div className="text-xs text-slate-400">Total P/L</div>
        </div>
        <div className="text-center p-3 bg-slate-800/50 rounded-lg border border-slate-700/50">
          <div className="text-2xl font-bold text-blue-400">4.5h</div>
          <div className="text-xs text-slate-400">Avg Session</div>
        </div>
        <div className="text-center p-3 bg-slate-800/50 rounded-lg border border-slate-700/50">
          <div className="text-2xl font-bold text-purple-400">4</div>
          <div className="text-xs text-slate-400">Recording</div>
        </div>
      </div>
    </div>
  );
}