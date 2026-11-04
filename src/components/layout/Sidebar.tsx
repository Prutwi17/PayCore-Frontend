import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  CreditCard,
  RotateCcw,
  Webhook,
  Scale,
  KeyRound,
  Settings,
  Shield,
  Users,
  ScrollText,
} from 'lucide-react';
import logoSvg from '@/assets/logo.svg';
import { cn } from '@/utils/cn';

interface SidebarProps {
  portalType: 'merchant' | 'admin';
}

export const Sidebar: React.FC<SidebarProps> = ({ portalType }) => {
  const merchantNavItems = [
    { label: 'Dashboard', to: '/merchant/dashboard', icon: LayoutDashboard },
    { label: 'Payments', to: '/merchant/payments', icon: CreditCard },
    { label: 'Refunds', to: '/merchant/refunds', icon: RotateCcw },
    { label: 'Webhooks', to: '/merchant/webhooks', icon: Webhook },
    { label: 'Reconciliation', to: '/merchant/reconciliation', icon: Scale },
    { label: 'API Keys', to: '/merchant/api-keys', icon: KeyRound },
    { label: 'Settings', to: '/merchant/settings', icon: Settings },
  ];

  const adminNavItems = [
    { label: 'Dashboard', to: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Merchants', to: '/admin/merchants', icon: Users },
    { label: 'Payments', to: '/admin/payments', icon: CreditCard },
    { label: 'Refunds', to: '/admin/refunds', icon: RotateCcw },
    { label: 'Reconciliation', to: '/admin/reconciliation', icon: Scale },
    { label: 'Webhook Events', to: '/admin/webhooks', icon: Webhook },
    { label: 'Audit Logs', to: '/admin/audit-logs', icon: ScrollText },
    { label: 'Settings', to: '/admin/settings', icon: Settings },
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
      <nav className="flex-1 px-3 py-6 space-y-1">
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

      {/* Footer Info */}
      <div className="p-4 border-t border-slate-800 text-xs text-slate-500 flex items-center justify-between">
        <span className="flex items-center space-x-1.5">
          <Shield className="w-3.5 h-3.5 text-blue-500" />
          <span>Stage 1 Foundation</span>
        </span>
        <span className="bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded text-[10px]">v0.1</span>
      </div>
    </aside>
  );
};
