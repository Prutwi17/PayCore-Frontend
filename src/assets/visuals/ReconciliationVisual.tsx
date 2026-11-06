import React from 'react';
import { Scale, CheckCircle2, AlertTriangle, Database, Cloud } from 'lucide-react';

export const ReconciliationVisual: React.FC = () => {
  return (
    <div className="w-full bg-white border border-slate-200 rounded-2xl shadow-sm p-6 text-slate-800">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-4 border-b border-slate-100 mb-5">
        <div>
          <div className="flex items-center space-x-2">
            <h4 className="text-sm font-bold text-slate-900">Automated Provider Reconciliation Engine</h4>
            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
              Multi-Source Verification
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Compares internal payments against independent provider settlement statement feeds
          </p>
        </div>
      </div>

      {/* Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
        {/* Left: PayCore Internal Database */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono space-y-2">
          <div className="flex items-center space-x-2 font-sans font-bold text-slate-900 mb-1">
            <Database className="w-4 h-4 text-blue-600" />
            <span>PayCore Internal Ledger</span>
          </div>
          <div className="p-2 bg-white rounded border border-slate-200 text-slate-700">
            <div>pay_8901: <span className="font-semibold text-emerald-600">$1,500.00 [SUCCESS]</span></div>
            <div>pay_8902: <span className="font-semibold text-emerald-600">$450.00 [SUCCESS]</span></div>
            <div>pay_8903: <span className="font-semibold text-rose-600">$89.00 [FAILED]</span></div>
          </div>
        </div>

        {/* Center: Matcher Action */}
        <div className="text-center p-3 rounded-xl bg-blue-50/60 border border-blue-200 text-xs">
          <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center mx-auto mb-2 shadow">
            <Scale className="w-4 h-4" />
          </div>
          <span className="font-bold text-blue-900 block">Reconciliation Run</span>
          <span className="text-[11px] text-blue-700 block mt-0.5 font-medium">99.4% Match Rate</span>
          <span className="text-[10px] text-slate-500 block mt-1 font-mono">Run #rec_run_9918</span>
        </div>

        {/* Right: Simulated Provider Records */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono space-y-2">
          <div className="flex items-center space-x-2 font-sans font-bold text-slate-900 mb-1">
            <Cloud className="w-4 h-4 text-indigo-600" />
            <span>Simulated Provider Store</span>
          </div>
          <div className="p-2 bg-white rounded border border-slate-200 text-slate-700">
            <div>tx_ext_8901: <span className="font-semibold text-emerald-600">$1,500.00 [SETTLED]</span> <CheckCircle2 className="w-3 h-3 text-emerald-600 inline ml-1" /></div>
            <div>tx_ext_8902: <span className="font-semibold text-amber-600">$400.00 [MISMATCH]</span> <AlertTriangle className="w-3 h-3 text-amber-600 inline ml-1" /></div>
            <div>tx_ext_8903: <span className="font-semibold text-rose-600">$89.00 [DECLINED]</span> <CheckCircle2 className="w-3 h-3 text-emerald-600 inline ml-1" /></div>
          </div>
        </div>
      </div>

      {/* Clarification banner */}
      <div className="mt-4 p-3 bg-amber-50/70 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-2.5">
        <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
        <span className="leading-relaxed">
          <strong>Architecture Transparency:</strong> Current provider integration utilizes an isolated simulated transaction statement store. PayCore executes genuine cross-store comparisons, discrepancy classifications, and manual operator overrides without simulating mock success.
        </span>
      </div>
    </div>
  );
};
