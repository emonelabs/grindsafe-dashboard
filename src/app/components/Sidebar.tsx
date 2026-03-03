import { Link, useLocation } from 'react-router';
import { LayoutDashboard, User, Settings, Activity, History, PlayCircle, Users, Network, Split, Wallet, ChevronRight, ChevronLeft } from 'lucide-react';
import { useState } from 'react';

export function Sidebar() {
  const location = useLocation();
  const [isExpanded, setIsExpanded] = useState(false);

  const isPlayerSection = location.pathname.startsWith('/player');
  const isAdminSection = location.pathname === '/' || location.pathname.startsWith('/admin');

  return (
    <div className={`${isExpanded ? 'w-64' : 'w-16'} h-screen bg-white border-r border-gray-200 flex flex-col sticky top-0 transition-all duration-300`}>
      {/* Logo/Header */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 bg-gray-900 rounded-md flex items-center justify-center flex-shrink-0">
            <Activity className="w-5 h-5 text-white" />
          </div>
          {isExpanded && (
            <div className="min-w-0">
              <h2 className="text-gray-900 font-semibold text-base truncate">PokerTrack</h2>
              <p className="text-gray-500 text-xs truncate">Pro Monitor</p>
            </div>
          )}
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-1.5 hover:bg-gray-100 rounded-md transition-colors flex-shrink-0"
        >
          {isExpanded ? (
            <ChevronLeft className="w-4 h-4 text-gray-500" />
          ) : (
            <ChevronRight className="w-4 h-4 text-gray-500" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
        {/* Admin View - Parent */}
        <div className="space-y-1">
          <Link
            to="/"
            title={!isExpanded ? 'Admin View' : ''}
            className={`
              flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors
              ${location.pathname === '/'
                ? 'bg-gray-100 text-gray-900' 
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }
            `}
          >
            <LayoutDashboard className="w-5 h-5 flex-shrink-0" />
            {isExpanded && <span>Admin View</span>}
          </Link>


        </div>

        {/* Player View - Parent */}
        <div className="space-y-1">
          <Link
            to="/player"
            title={!isExpanded ? 'Player View' : ''}
            className={`
              flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors
              ${isPlayerSection
                ? 'bg-gray-100 text-gray-900' 
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }
            `}>
            <User className="w-5 h-5 flex-shrink-0" />
            {isExpanded && <span>Player View</span>}
          </Link>


        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        {isExpanded ? (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs font-semibold">JD</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-gray-900 truncate">John Doe</div>
              <div className="text-xs text-gray-500">Admin</div>
            </div>
            <button 
              title="Settings"
              className="p-1.5 hover:bg-gray-100 rounded-md transition-colors flex-shrink-0"
            >
              <Settings className="w-4 h-4 text-gray-500" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <div className="w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-semibold">JD</span>
            </div>
            <button 
              title="Settings"
              className="p-1.5 hover:bg-gray-100 rounded-md transition-colors"
            >
              <Settings className="w-4 h-4 text-gray-500" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
