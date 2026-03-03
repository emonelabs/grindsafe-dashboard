import { Link, useLocation } from 'react-router';
import { LayoutDashboard, User, Settings, Activity, History, PlayCircle } from 'lucide-react';

export function Sidebar() {
  const location = useLocation();

  const isPlayerSection = location.pathname.startsWith('/player');

  return (
    <div className="w-64 h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 border-r border-slate-700/50 flex flex-col sticky top-0">
      {/* Logo/Header */}
      <div className="p-6 border-b border-slate-700/50">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Activity className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-white font-bold text-lg">PokerTrack</h2>
            <p className="text-slate-400 text-xs">Pro Monitor</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {/* Admin View */}
        <Link
          to="/"
          className={`
            flex items-start gap-3 p-3 rounded-lg transition-all duration-200
            ${location.pathname === '/'
              ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/50' 
              : 'hover:bg-slate-800/50 border border-transparent'
            }
          `}
        >
          <LayoutDashboard className={`w-5 h-5 mt-0.5 ${location.pathname === '/' ? 'text-blue-400' : 'text-slate-400'}`} />
          <div className="flex-1">
            <div className={`font-medium ${location.pathname === '/' ? 'text-white' : 'text-slate-300'}`}>
              Admin View
            </div>
            <div className="text-xs text-slate-500 mt-0.5">
              Monitor all players
            </div>
          </div>
        </Link>

        {/* Player View - Parent */}
        <div className="space-y-1">
          <div className={`
            flex items-start gap-3 p-3 rounded-lg transition-all duration-200
            ${isPlayerSection
              ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/50' 
              : 'hover:bg-slate-800/50 border border-transparent'
            }
          `}>
            <User className={`w-5 h-5 mt-0.5 ${isPlayerSection ? 'text-purple-400' : 'text-slate-400'}`} />
            <div className="flex-1">
              <div className={`font-medium ${isPlayerSection ? 'text-white' : 'text-slate-300'}`}>
                Player View
              </div>
              <div className="text-xs text-slate-500 mt-0.5">
                Your sessions
              </div>
            </div>
          </div>

          {/* Player View Subsections */}
          {isPlayerSection && (
            <div className="ml-8 space-y-1 border-l-2 border-slate-700/50 pl-2">
              <Link
                to="/player"
                className={`
                  flex items-center gap-2 p-2 rounded-lg transition-all duration-200 text-sm
                  ${location.pathname === '/player'
                    ? 'bg-slate-700/50 text-white' 
                    : 'text-slate-400 hover:text-slate-300 hover:bg-slate-800/30'
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
                    ? 'bg-slate-700/50 text-white' 
                    : 'text-slate-400 hover:text-slate-300 hover:bg-slate-800/30'
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
      <div className="p-4 border-t border-slate-700/50">
        <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/50">
          <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-bold">JD</span>
          </div>
          <div className="flex-1">
            <div className="text-white text-sm font-medium">John Doe</div>
            <div className="text-xs text-slate-400">Online</div>
          </div>
          <Settings className="w-4 h-4 text-slate-400 cursor-pointer hover:text-white transition-colors" />
        </div>
      </div>
    </div>
  );
}
