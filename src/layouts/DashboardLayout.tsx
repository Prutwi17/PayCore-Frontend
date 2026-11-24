import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from '@/components/layout/Sidebar';
import { ThemeToggle } from '@/components/common/ThemeToggle';
import { useAuth } from '@/context/AuthContext';
import { LogOut } from 'lucide-react';

export const DashboardLayout: React.FC = () => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-black text-slate-900 dark:text-white transition-colors">
      <Sidebar portalType={isAdmin ? 'admin' : 'merchant'} />
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white dark:bg-black border-b border-slate-200 dark:border-zinc-800 flex items-center justify-between px-6 z-10 transition-colors">
          <div className="flex items-center space-x-2 text-sm text-slate-500 dark:text-slate-400">
            <span className="font-semibold text-slate-900 dark:text-white">
              {isAdmin ? 'Admin' : 'Merchant'}
            </span>
            <span>/</span>
            <span className="capitalize">{location.pathname.split('/').pop() || 'Overview'}</span>
          </div>

          <div className="flex items-center space-x-3">
            <ThemeToggle />

            <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
              {isAdmin ? 'Admin' : user?.fullName || 'Merchant'}
            </span>

            <button
              type="button"
              onClick={logout}
              className="text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 flex items-center gap-1.5 transition-colors pl-2"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
