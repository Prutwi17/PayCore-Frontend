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
  Users,
  ScrollText,
  LogOut,
  UserCheck,
  History,
} from 'lucide-react';
import logoSvg from '@/assets/logo.svg';
import { cn } from '@/utils/cn';

interface SidebarProps {
  portalType: 'merchant' | 'admin';
}

export const Sidebar: React.FC<SidebarProps> = ({ portalType }) => {
  const { user, logout } = useAuth();

  const merchantNavItems = [
    { label: 'Overview', to: '/merchant/dashboard', icon: LayoutDashboard },
    { label: 'Payments', to: '/merchant/payments', icon: CreditCard },
    { label: 'Refunds', to: '/merchant/refunds', icon: RotateCcw },
    { label: 'Transactions', to: '/merchant/transactions', icon: History },
    { label: 'Webhooks', to: '/merchant/webhooks', icon: Webhook },
    { label: 'API Keys', to: '/merchant/api-keys', icon: KeyRound },
    { label: 'Profile', to: '/merchant/profile', icon: UserCheck },
  ];

  const adminNavItems = [
    { label: 'Overview', to: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Merchants', to: '/admin/merchants', icon: Users },
    { label: 'Payments', to: '/admin/payments', icon: CreditCard },
    { label: 'Refunds', to: '/admin/refunds', icon: RotateCcw },
    { label: 'Transactions', to: '/admin/transactions', icon: History },
    { label: 'Webhooks', to: '/admin/webhooks', icon: Webhook },
    { label: 'Reconciliation', to: '/admin/reconciliation', icon: Scale },
    { label: 'Audit Logs', to: '/admin/audit-logs', icon: ScrollText },
  ];

  const items = portalType === 'merchant' ? merchantNavItems : adminNavItems;

  return (
    <aside className="w-64 bg-white dark:bg-black text-slate-700 dark:text-zinc-300 min-h-screen flex flex-col border-r border-slate-200 dark:border-zinc-800 transition-colors">
      {/* Brand Header */}
      <div className="h-16 flex items-center px-6 border-b border-slate-200 dark:border-zinc-800 space-x-3">
        <img src={logoSvg} alt="PayCore" className="h-8 w-8" />
        <div>
          <span className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">PayCore</span>
          <span className="block text-[10px] font-semibold tracking-wider uppercase text-blue-600 dark:text-blue-400">
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
                  'flex items-center space-x-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-colors',
                  isActive
                    ? 'bg-blue-600 text-white font-semibold'
                    : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-900'
                )
              }
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* User profile footer */}
      <div className="p-4 border-t border-slate-200 dark:border-zinc-800">
        <div className="flex items-center space-x-3 mb-3">
          <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-zinc-900 flex items-center justify-center font-bold text-xs text-blue-600 dark:text-blue-400 border border-slate-200 dark:border-zinc-700">
            {portalType === 'admin' ? 'A' : user?.fullName?.charAt(0) || 'M'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">
              {portalType === 'admin' ? 'Admin' : user?.fullName || 'Merchant'}
            </p>
            <p className="text-[11px] text-slate-500 dark:text-zinc-400 truncate">
              {portalType === 'admin' ? 'Administrator' : 'Merchant Account'}
            </p>
          </div>
        </div>

        <button
          onClick={() => logout()}
          className="w-full flex items-center justify-center space-x-2 py-2 px-3 rounded-lg text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 border border-transparent hover:border-rose-200 dark:hover:border-rose-800 transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};
