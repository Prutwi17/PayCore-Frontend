import React from 'react';
import { RotateCcw, CheckCircle2, DollarSign, Calculator } from 'lucide-react';

export const RefundWorkflowVisual: React.FC = () => {
  return (
    <div className="w-full bg-white border border-slate-200 rounded-2xl shadow-sm p-6 overflow-hidden">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
        <div>
          <h4 className="text-sm font-bold text-slate-900">Two-Phase Balance Refund Protocol</h4>
          <p className="text-xs text-slate-500">Atomic refundable balance validation preventing double refund exploits</p>
        </div>
        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
          Over-Refund Protection Active
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
        {/* Step 1 */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
            <DollarSign className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold text-slate-900 block">Original Charge</span>
          <span className="font-mono text-xs font-semibold text-blue-600 block mt-1">$1,000.00 USD</span>
          <span className="text-[11px] text-slate-500 block mt-1">Status: SUCCESS</span>
        </div>

        {/* Step 2 */}
        <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200">
          <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center mb-3">
            <Calculator className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold text-amber-900 block">Balance Verification</span>
          <span className="font-mono text-xs font-semibold text-amber-700 block mt-1">Remaining: $600.00</span>
          <span className="text-[11px] text-amber-700/80 block mt-1">Previous refund: $400.00</span>
        </div>

        {/* Step 3 */}
        <div className="p-4 rounded-xl bg-indigo-50/60 border border-indigo-200">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3">
            <RotateCcw className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold text-indigo-900 block">Partial Settlement</span>
          <span className="font-mono text-xs font-semibold text-indigo-600 block mt-1">Requested: $250.00</span>
          <span className="text-[11px] text-indigo-700/80 block mt-1">Simulated provider reverse</span>
        </div>

        {/* Step 4 */}
        <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold text-emerald-900 block">Settled & Locked</span>
          <span className="font-mono text-xs font-semibold text-emerald-600 block mt-1">New Balance: $350.00</span>
          <span className="text-[11px] text-emerald-700/80 block mt-1">REFUND_SUCCESS event</span>
        </div>
      </div>
    </div>
  );
};
