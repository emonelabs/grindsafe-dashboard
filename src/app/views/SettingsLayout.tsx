import { Outlet, Link, useLocation } from 'react-router';
import { CreditCard, User, Shield, Settings } from 'lucide-react';
import { cn } from '../components/ui/utils';

const settingsNavItems = [
  { id: 'usage', label: 'Usage', icon: CreditCard, href: '/settings/usage' },
  { id: 'profile', label: 'Profile', icon: User, href: '/settings/profile', disabled: true },
  { id: 'security', label: 'Security', icon: Shield, href: '/settings/security', disabled: true },
];

export function SettingsLayout() {
  const location = useLocation();

  return (
    <div className="flex h-[calc(100vh-1px)]">
      {/* Settings Sidebar */}
      <div className="w-64 bg-white border-r border-slate-200 flex-shrink-0 fixed top-0 left-16 bottom-0 overflow-y-auto z-10">
        <div className="p-6 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-slate-600" />
            <h2 className="text-lg font-semibold text-slate-800">Settings</h2>
          </div>
        </div>
        
        <nav className="p-4 space-y-1">
          {settingsNavItems.map((item) => {
            const isActive = location.pathname === item.href || location.pathname.startsWith(item.href + '/');
            
            return (
              <Link
                key={item.id}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-colors",
                  item.disabled
                    ? "text-slate-400 cursor-not-allowed"
                    : isActive
                    ? "bg-slate-100 text-slate-900"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                <span>{item.label}</span>
                {item.disabled && (
                  <span className="ml-auto text-xs text-slate-400">Coming soon</span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Settings Content */}
      <div className="flex-1 ml-64 overflow-auto bg-slate-50">
        <Outlet />
      </div>
    </div>
  );
}