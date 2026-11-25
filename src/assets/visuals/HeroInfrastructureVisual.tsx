import React from 'react';
import { CheckCircle2, Shield, Smartphone, Cpu, Bell } from 'lucide-react';

export const HeroInfrastructureVisual: React.FC = () => {
  return (
    <div className="w-full max-w-xl mx-auto bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 text-white relative overflow-hidden backdrop-blur-xl">
      {/* Ambient background glow */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />

      {/* Header bar */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800/80 mb-6">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-rose-500/80" />
          <div className="w-3 h-3 rounded-full bg-amber-500/80" />
          <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
          <span className="text-xs font-mono text-slate-400 ml-2">paycore-network.telemetry</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5 animate-pulse" />
            Engine Online
          </span>
        </div>
      </div>

      {/* 4-Stage Architecture Flow */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 relative z-10 mb-6">
        {/* Stage 1: Merchant App */}
        <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 flex flex-col justify-between">
          <div>
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-2">
              <Smartphone className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-semibold text-slate-200">Merchant App</h4>
            <p className="text-[10px] text-slate-400 mt-0.5 font-mono">POST /payments</p>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-700/40 text-[10px] text-blue-400 font-mono">
            Idemp-Key
          </div>
        </div>

        {/* Stage 2: PayCore Gateway */}
        <div className="p-3.5 rounded-xl bg-slate-800/80 border border-blue-500/40 shadow-lg shadow-blue-500/10 flex flex-col justify-between relative">
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 px-1.5 py-0.2 rounded bg-blue-600 text-[9px] font-semibold text-white uppercase tracking-wider">
            Core
          </div>
          <div>
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white mb-2 shadow">
              <Shield className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-semibold text-white">PayCore Engine</h4>
            <p className="text-[10px] text-blue-200 mt-0.5">State Machine</p>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-700/40 text-[10px] text-emerald-400 font-mono flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Validated
          </div>
        </div>

        {/* Stage 3: Provider Processing */}
        <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 flex flex-col justify-between">
          <div>
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-2">
              <Cpu className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-semibold text-slate-200">Processing</h4>
            <p className="text-[10px] text-slate-400 mt-0.5">Simulated Gateway</p>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-700/40 text-[10px] text-indigo-300 font-mono">
            Settled 240ms
          </div>
        </div>

        {/* Stage 4: Result & Webhooks */}
        <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 flex flex-col justify-between">
          <div>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-2">
              <Bell className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-semibold text-slate-200">Outcome</h4>
            <p className="text-[10px] text-slate-400 mt-0.5">Signed Webhook</p>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-700/40 text-[10px] text-emerald-400 font-mono">
            200 SUCCESS
          </div>
        </div>
      </div>

      {/* Code integration peek */}
      <div className="rounded-xl bg-slate-950/80 border border-slate-800 p-3.5 font-mono text-[11px] text-slate-300">
        <div className="flex items-center justify-between text-slate-500 text-[10px] mb-2 pb-1.5 border-b border-slate-800/60">
          <span>EVENT: payment.succeeded</span>
          <span className="text-emerald-400 font-semibold">HMAC-SHA256 SIGNED</span>
        </div>
        <div className="space-y-1 text-slate-400">
          <div><span className="text-blue-400">reference:</span> <span className="text-slate-200">"pay_8f29d10a4e"</span>,</div>
          <div><span className="text-blue-400">amount:</span> <span className="text-emerald-300">125000</span> <span className="text-slate-500">(USD $1,250.00)</span>,</div>
          <div><span className="text-blue-400">status:</span> <span className="text-emerald-400 font-semibold">"SUCCESS"</span>,</div>
          <div><span className="text-blue-400">idempotency_matched:</span> <span className="text-slate-300">true</span></div>
        </div>
      </div>
    </div>
  );
};
