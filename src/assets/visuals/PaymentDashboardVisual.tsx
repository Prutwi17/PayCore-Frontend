import React from 'react';
import { CheckCircle2, Clock, XCircle, Search, Filter } from 'lucide-react';

export const PaymentDashboardVisual: React.FC = () => {
  return (
    <div className="w-full bg-slate-900 border border-slate-800 rounded-2xl shadow-xl p-5 text-white">
      {/* Top filter simulation */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-800 text-xs">
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-500" />
            <div className="bg-slate-800/80 border border-slate-700/80 rounded-lg pl-8 pr-3 py-1.5 text-slate-300 text-xs font-mono">
              pay_ref: 92839...
            </div>
          </div>
          <button className="p-1.5 bg-slate-800 border border-slate-700 rounded-lg text-slate-400">
            <Filter className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="flex items-center space-x-1.5 text-[11px] font-medium">
          <span className="px-2.5 py-1 rounded-md bg-blue-600 text-white">All</span>
          <span className="px-2.5 py-1 rounded-md bg-slate-800 text-slate-300">Success (1,248)</span>
          <span className="px-2.5 py-1 rounded-md bg-slate-800 text-slate-300">Processing (3)</span>
        </div>
      </div>

      {/* Transaction rows */}
      <div className="divide-y divide-slate-800/60 font-mono text-xs mt-2">
        {/* Row 1 */}
        <div className="py-2.5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-xs">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <div className="text-slate-200 font-semibold">pay_9a7b21e0</div>
              <div className="text-[10px] text-slate-400">Visa ending in 4242 · acct_merchant_01</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-emerald-400 font-bold">$499.00 USD</div>
            <div className="text-[10px] text-emerald-500/80 font-sans font-medium">SUCCESS · 182ms</div>
          </div>
        </div>

        {/* Row 2 */}
        <div className="py-2.5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold text-xs">
              <Clock className="w-4 h-4 animate-spin" />
            </div>
            <div>
              <div className="text-slate-200 font-semibold">pay_3f88c012</div>
              <div className="text-[10px] text-slate-400">Mastercard ending in 5555 · acct_merchant_01</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-amber-300 font-bold">$1,250.00 USD</div>
            <div className="text-[10px] text-amber-400 font-sans font-medium">PROCESSING · 2/3 Attempts</div>
          </div>
        </div>

        {/* Row 3 */}
        <div className="py-2.5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-400 flex items-center justify-center font-bold text-xs">
              <XCircle className="w-4 h-4" />
            </div>
            <div>
              <div className="text-slate-200 font-semibold">pay_7c41d99a</div>
              <div className="text-[10px] text-slate-400">Amex ending in 1004 · acct_merchant_01</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-rose-400 font-bold">$84.50 USD</div>
            <div className="text-[10px] text-rose-500/80 font-sans font-medium">DECLINED · Insufficient Funds</div>
          </div>
        </div>
      </div>
    </div>
  );
};
