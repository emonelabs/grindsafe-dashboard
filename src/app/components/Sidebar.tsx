import { Link, useLocation } from 'react-router';
import { LayoutDashboard, User, Settings, Activity, History, PlayCircle, Users, Network, Split, Wallet } from 'lucide-react';

export function Sidebar() {
  const location = useLocation();

  const isPlayerSection = location.pathname.startsWith('/player');
  const isAdminSection = location.pathname === '/' || location.pathname.startsWith('/admin');

  return (
    <div className="w-64 h-screen bg-white border-r border-gray-200 flex flex-col sticky top-0 shadow-sm">
      {/* Logo/Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Activity className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-gray-900 font-bold text-lg">PokerTrack</h2>
            <p className="text-gray-500 text-xs">Pro Monitor</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {/* Admin View - Parent */}
        <div className="space-y-1">
          <Link
            to="/"
            className={`
              flex items-start gap-3 p-3 rounded-lg transition-all duration-200
              ${location.pathname === '/'
                ? 'bg-blue-50 border border-blue-200' 
                : 'hover:bg-gray-100 border border-transparent'
              }
            `}
          >
            <LayoutDashboard className={`w-5 h-5 mt-0.5 ${location.pathname === '/' ? 'text-blue-600' : 'text-gray-500'}`} />
            <div className="flex-1">
              <div className={`font-medium ${location.pathname === '/' ? 'text-gray-900' : 'text-gray-700'}`}>
                Admin View
              </div>
              <div className="text-xs text-gray-500 mt-0.5">
                Monitor all players
              </div>
            </div>
          </Link>

          {/* Admin View Subsections */}
          {isAdminSection && (
            <div className="ml-8 space-y-1 border-l-2 border-gray-200 pl-2">
              <Link
                to="/"
                className={`
                  flex items-center gap-2 p-2 rounded-lg transition-all duration-200 text-sm
                  ${location.pathname === '/'
                    ? 'bg-gray-100 text-gray-900' 
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }
                `}
              >
                <Activity className="w-4 h-4" />
                <span>Overview</span>
              </Link>
              <Link
                to="/admin/teams"
                className={`
                  flex items-center gap-2 p-2 rounded-lg transition-all duration-200 text-sm
                  ${location.pathname === '/admin/teams'
                    ? 'bg-gray-100 text-gray-900' 
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }
                `}
              >
                <Users className="w-4 h-4" />
                <span>Teams</span>
              </Link>
              <Link
                to="/admin/organization"
                className={`
                  flex items-center gap-2 p-2 rounded-lg transition-all duration-200 text-sm
                  ${location.pathname === '/admin/organization'
                    ? 'bg-gray-100 text-gray-900' 
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }
                `}
              >
                <Network className="w-4 h-4" />
                <span>Organization</span>
              </Link>
              <Link
                to="/admin/splits"
                className={`
                  flex items-center gap-2 p-2 rounded-lg transition-all duration-200 text-sm
                  ${location.pathname === '/admin/splits'
                    ? 'bg-gray-100 text-gray-900' 
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }
                `}
              >
                <Split className="w-4 h-4" />
                <span>Splits</span>
              </Link>
              <Link
                to="/admin/wallets"
                className={`
                  flex items-center gap-2 p-2 rounded-lg transition-all duration-200 text-sm
                  ${location.pathname === '/admin/wallets'
                    ? 'bg-gray-100 text-gray-900' 
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }
                `}
              >
                <Wallet className="w-4 h-4" />
                <span>Wallets</span>
              </Link>
            </div>
          )}
        </div>

        {/* Player View - Parent */}
        <div className="space-y-1">
          <Link
            to="/player"
            className={`
              flex items-start gap-3 p-3 rounded-lg transition-all duration-200
              ${isPlayerSection
                ? 'bg-purple-50 border border-purple-200' 
                : 'hover:bg-gray-100 border border-transparent'
              }
            `}>
            <User className={`w-5 h-5 mt-0.5 ${isPlayerSection ? 'text-purple-600' : 'text-gray-500'}`} />
            <div className="flex-1">
              <div className={`font-medium ${isPlayerSection ? 'text-gray-900' : 'text-gray-700'}`}>
                Player View
              </div>
              <div className="text-xs text-gray-500 mt-0.5">
                Your sessions
              </div>
            </div>
          </Link>

          {/* Player View Subsections */}
          {isPlayerSection && (
            <div className="ml-8 space-y-1 border-l-2 border-gray-200 pl-2">
              <Link
                to="/player"
                className={`
                  flex items-center gap-2 p-2 rounded-lg transition-all duration-200 text-sm
                  ${location.pathname === '/player'
                    ? 'bg-gray-100 text-gray-900' 
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }
                `}
              >
                <PlayCircle className="w-4 h-4" />
                <span>Live Session</span>
              </Link>
              <Link
                to="/player/sessions"
                className={`
                  flex items-center gap-2 p-2 rounded-lg transition-all duration-200 text-sm
                  ${location.pathname === '/player/sessions'
                    ? 'bg-gray-100 text-gray-900' 
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }
                `}
              >
                <History className="w-4 h-4" />
                <span>Sessions</span>
              </Link>
            </div>
          )}
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
          <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-bold">JD</span>
          </div>
          <div className="flex-1">
            <div className="text-gray-900 text-sm font-medium">John Doe</div>
            <div className="text-xs text-gray-500">Online</div>
          </div>
          <Settings className="w-4 h-4 text-gray-400 cursor-pointer hover:text-gray-700 transition-colors" />
        </div>
      </div>
    </div>
  );
}
