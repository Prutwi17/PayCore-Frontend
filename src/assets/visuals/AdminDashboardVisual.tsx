import React from 'react';
import { LayoutDashboard } from 'lucide-react';

export const AdminDashboardVisual: React.FC = () => {
  return (
    <div className="w-full bg-white border border-slate-200 rounded-2xl shadow-sm p-6 text-slate-800">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
        <div className="flex items-center space-x-2">
          <LayoutDashboard className="w-4 h-4 text-blue-600" />
          <h4 className="text-sm font-bold text-slate-900">Platform Command Center</h4>
        </div>
        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
          Real DB Metrics Aggregated
        </span>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
          <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold block">Total Volume</span>
          <span className="text-base font-bold text-slate-900 block mt-1">$482,900.00</span>
          <span className="text-[10px] text-emerald-600 font-medium block mt-0.5">99.1% Settled</span>
        </div>
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
          <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold block">Active Merchants</span>
          <span className="text-base font-bold text-slate-900 block mt-1">48 Onboarded</span>
          <span className="text-[10px] text-blue-600 font-medium block mt-0.5">All Keyed</span>
        </div>
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
          <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold block">Discrepancies</span>
          <span className="text-base font-bold text-amber-700 block mt-1">2 Pending Review</span>
          <span className="text-[10px] text-amber-600 font-medium block mt-0.5">Manual Review Required</span>
        </div>
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
          <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold block">Webhook Health</span>
          <span className="text-base font-bold text-emerald-700 block mt-1">99.8%</span>
          <span className="text-[10px] text-emerald-600 font-medium block mt-0.5">Delivery Success Rate</span>
        </div>
      </div>

      {/* Volume Visual Trend */}
      <div className="p-3.5 rounded-xl bg-slate-900 text-white font-mono text-xs">
        <div className="flex items-center justify-between text-[11px] text-slate-400 pb-2 border-b border-slate-800">
          <span>7-DAY TRANSACTION & REFUND TELEMETRY</span>
          <span className="text-emerald-400 font-sans font-semibold">ALL SYSTEMS NOMINAL</span>
        </div>
        <div className="grid grid-cols-7 gap-2 pt-3 items-end h-20 text-center">
          <div className="flex flex-col items-center gap-1">
            <div className="w-full bg-blue-600 rounded-t h-10" />
            <span className="text-[9px] text-slate-500">Mon</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <div className="w-full bg-blue-600 rounded-t h-14" />
            <span className="text-[9px] text-slate-500">Tue</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <div className="w-full bg-blue-600 rounded-t h-12" />
            <span className="text-[9px] text-slate-500">Wed</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <div className="w-full bg-blue-600 rounded-t h-16" />
            <span className="text-[9px] text-slate-500">Thu</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <div className="w-full bg-blue-600 rounded-t h-11" />
            <span className="text-[9px] text-slate-500">Fri</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <div className="w-full bg-blue-600 rounded-t h-8" />
            <span className="text-[9px] text-slate-500">Sat</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <div className="w-full bg-blue-500 rounded-t h-16 shadow-lg shadow-blue-500/20" />
            <span className="text-[9px] text-slate-300 font-bold">Sun</span>
          </div>
        </div>
      </div>
    </div>
  );
};
