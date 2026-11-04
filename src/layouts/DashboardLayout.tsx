import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from '@/components/layout/Sidebar';

export const DashboardLayout: React.FC = () => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen flex bg-slate-50">
      <Sidebar portalType={isAdmin ? 'admin' : 'merchant'} />
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 z-10">
          <div className="flex items-center space-x-2 text-sm text-slate-500">
            <span className="font-medium text-slate-900">
              {isAdmin ? 'System Administration' : 'Merchant Workspace'}
            </span>
            <span>/</span>
            <span className="capitalize">{location.pathname.split('/').pop() || 'Overview'}</span>
          </div>

          <div className="flex items-center space-x-4">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
              TEST MODE
            </span>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
