import React from 'react';
import { ShieldCheck } from 'lucide-react';

export const PaymentWorkflowVisual: React.FC = () => {
  return (
    <div className="w-full bg-white border border-slate-200 rounded-2xl shadow-sm p-6 overflow-hidden">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
        <div>
          <h4 className="text-sm font-bold text-slate-900">Deterministic Payment State Machine</h4>
          <p className="text-xs text-slate-500">Atomic stage transitions with two-phase provider communication</p>
        </div>
        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
          State Enforced
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-3 relative">
        {/* Step 1 */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
          <div className="w-7 h-7 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center mx-auto mb-2">
            1
          </div>
          <span className="text-xs font-bold text-slate-800 block">CREATED</span>
          <span className="text-[10px] text-slate-500 block mt-1">Payload validated & idempotency key cached</span>
        </div>

        {/* Step 2 */}
        <div className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-200 text-center">
          <div className="w-7 h-7 rounded-full bg-amber-600 text-white text-xs font-bold flex items-center justify-center mx-auto mb-2">
            2
          </div>
          <span className="text-xs font-bold text-amber-900 block">PROCESSING</span>
          <span className="text-[10px] text-amber-700 block mt-1">Provider dispatch without DB transaction locks</span>
        </div>

        {/* Step 3 */}
        <div className="p-3.5 rounded-xl bg-indigo-50/60 border border-indigo-200 text-center">
          <div className="w-7 h-7 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center mx-auto mb-2">
            3
          </div>
          <span className="text-xs font-bold text-indigo-900 block">ATTEMPT LOG</span>
          <span className="text-[10px] text-indigo-700 block mt-1">Provider reference, latency, & response codes</span>
        </div>

        {/* Step 4 */}
        <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-200 text-center">
          <div className="w-7 h-7 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center justify-center mx-auto mb-2">
            4
          </div>
          <span className="text-xs font-bold text-emerald-900 block">SUCCESS</span>
          <span className="text-[10px] text-emerald-700 block mt-1">Final terminal state persisted in ACID transaction</span>
        </div>

        {/* Step 5 */}
        <div className="p-3.5 rounded-xl bg-purple-50/60 border border-purple-200 text-center">
          <div className="w-7 h-7 rounded-full bg-purple-600 text-white text-xs font-bold flex items-center justify-center mx-auto mb-2">
            5
          </div>
          <span className="text-xs font-bold text-purple-900 block">OUTBOX EVENT</span>
          <span className="text-[10px] text-purple-700 block mt-1">Kafka event produced & webhook scheduled</span>
        </div>
      </div>

      <div className="mt-4 p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs text-slate-600">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Invalid transitions (e.g. SUCCESS ➔ FAILED) are rejected by state engine guardrails</span>
        </div>
        <span className="font-mono text-[11px] text-slate-500">IllegalStateTransitionException</span>
      </div>
    </div>
  );
};
