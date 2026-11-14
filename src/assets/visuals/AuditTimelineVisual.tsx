import React from 'react';
import { UserCheck, Key, RefreshCw } from 'lucide-react';

export const AuditTimelineVisual: React.FC = () => {
  return (
    <div className="w-full bg-slate-900 border border-slate-800 rounded-2xl shadow-xl p-6 text-white overflow-hidden">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
        <div>
          <h4 className="text-sm font-bold text-slate-100">Immutable Audit Trail & Forensics</h4>
          <p className="text-xs text-slate-400">Append-only operational logs with actor identity, before/after diffs, and IP addresses</p>
        </div>
        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
          Append-Only Log
        </span>
      </div>

      <div className="space-y-3 font-mono text-xs">
        {/* Event 1 */}
        <div className="p-3 rounded-xl bg-slate-800/70 border border-slate-700/80 flex items-start justify-between">
          <div className="flex items-start space-x-3">
            <div className="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center flex-shrink-0 mt-0.5">
              <UserCheck className="w-3.5 h-3.5" />
            </div>
            <div>
              <div className="text-slate-200 font-semibold font-sans">
                DISCREPANCY_MANUALLY_RESOLVED
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                Actor: <span className="text-blue-300 font-mono">omp27614@gmail.com (ROLE_ADMIN)</span>
              </div>
              <div className="text-[10px] text-slate-500 mt-1">
                Resource: <span className="text-slate-300">RecRecord:rec_rec_9104</span> · Justification: "Provider confirmed settlement delay"
              </div>
            </div>
          </div>
          <span className="text-[10px] text-slate-500">Just now</span>
        </div>

        {/* Event 2 */}
        <div className="p-3 rounded-xl bg-slate-800/70 border border-slate-700/80 flex items-start justify-between">
          <div className="flex items-start space-x-3">
            <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Key className="w-3.5 h-3.5" />
            </div>
            <div>
              <div className="text-slate-200 font-semibold font-sans">
                API_KEY_ROTATED
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                Actor: <span className="text-amber-300 font-mono">mer_orbit_01</span>
              </div>
              <div className="text-[10px] text-slate-500 mt-1">
                Action: Key revoked and replacement 256-bit credential issued
              </div>
            </div>
          </div>
          <span className="text-[10px] text-slate-500">14m ago</span>
        </div>

        {/* Event 3 */}
        <div className="p-3 rounded-xl bg-slate-800/70 border border-slate-700/80 flex items-start justify-between">
          <div className="flex items-start space-x-3">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center flex-shrink-0 mt-0.5">
              <RefreshCw className="w-3.5 h-3.5" />
            </div>
            <div>
              <div className="text-slate-200 font-semibold font-sans">
                TWO_PHASE_REFUND_EXECUTED
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                Actor: <span className="text-emerald-300 font-mono">SYSTEM_WORKER</span>
              </div>
              <div className="text-[10px] text-slate-500 mt-1">
                Resource: <span className="text-slate-300">Refund:ref_482a10</span> · Balance: $1,000.00 ➔ $750.00
              </div>
            </div>
          </div>
          <span className="text-[10px] text-slate-500">1h ago</span>
        </div>
      </div>
    </div>
  );
};
