import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import {
  LayoutDashboard,
  CreditCard,
  RotateCcw,
  Webhook,
  Scale,
  KeyRound,
  Settings,
  Users,
  ScrollText,
  LogOut,
  UserCheck,
} from 'lucide-react';
import logoSvg from '@/assets/logo.svg';
import { cn } from '@/utils/cn';

interface SidebarProps {
  portalType: 'merchant' | 'admin';
}

export const Sidebar: React.FC<SidebarProps> = ({ portalType }) => {
  const { user, logout } = useAuth();

  const merchantNavItems = [
    { label: 'Dashboard', to: '/merchant/dashboard', icon: LayoutDashboard },
    { label: 'API Keys', to: '/merchant/api-keys', icon: KeyRound },
    { label: 'Settings', to: '/merchant/settings', icon: Settings },
    { label: 'Payments', to: '/merchant/payments', icon: CreditCard },
    { label: 'Refunds', to: '/merchant/refunds', icon: RotateCcw },
    { label: 'Webhooks', to: '/merchant/webhooks', icon: Webhook },
    { label: 'Reconciliation', to: '/merchant/reconciliation', icon: Scale },
  ];

  const adminNavItems = [
    { label: 'Dashboard', to: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Merchants', to: '/admin/merchants', icon: Users },
    { label: 'Settings', to: '/admin/settings', icon: Settings },
    { label: 'Payments', to: '/admin/payments', icon: CreditCard },
    { label: 'Refunds', to: '/admin/refunds', icon: RotateCcw },
    { label: 'Reconciliation', to: '/admin/reconciliation', icon: Scale },
    { label: 'Webhook Events', to: '/admin/webhooks', icon: Webhook },
    { label: 'Audit Logs', to: '/admin/audit-logs', icon: ScrollText },
  ];

  const items = portalType === 'merchant' ? merchantNavItems : adminNavItems;

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 min-h-screen flex flex-col border-r border-slate-800">
      {/* Brand Header */}
      <div className="h-16 flex items-center px-6 border-b border-slate-800 space-x-3">
        <img src={logoSvg} alt="PayCore" className="h-8 w-8" />
        <div>
          <span className="text-lg font-bold text-white tracking-tight">PayCore</span>
          <span className="block text-[10px] font-semibold tracking-wider uppercase text-blue-400">
            {portalType === 'merchant' ? 'Merchant Portal' : 'Admin Portal'}
          </span>
        </div>
      </div>

      {/* Nav List */}
      <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  'flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                )
              }
            >
              <Icon className="w-4 h-4" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* User Session Footer */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/40">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2 min-w-0">
            <div className="w-7 h-7 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
              {user?.fullName?.charAt(0) || 'U'}
            </div>
            <div className="truncate">
              <span className="block text-xs font-semibold text-white truncate">
                {user?.fullName || 'User'}
              </span>
              <span className="block text-[10px] text-slate-400 truncate">
                {user?.email}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={logout}
            className="p-1.5 hover:bg-slate-800 rounded-md text-slate-400 hover:text-rose-400 transition-colors"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
        <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-800/60">
          <span className="flex items-center gap-1 text-blue-400 font-medium">
            <UserCheck className="w-3 h-3" />
            Stage 2 Authenticated
          </span>
          <span className="bg-slate-800 text-slate-300 px-1 py-0.5 rounded text-[9px] font-mono">
            {portalType === 'merchant' ? 'MERCHANT' : 'ADMIN'}
          </span>
        </div>
      </div>
    </aside>
  );
};
