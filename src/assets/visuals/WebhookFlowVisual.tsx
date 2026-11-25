import React from 'react';
import { Database, Cpu, ShieldCheck, CheckCircle2, RotateCw } from 'lucide-react';

export const WebhookFlowVisual: React.FC = () => {
  return (
    <div className="w-full bg-slate-900 border border-slate-800 rounded-2xl shadow-xl p-6 text-white overflow-hidden">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
        <div>
          <h4 className="text-sm font-bold text-slate-100">Transactional Outbox & Kafka Webhook Pipeline</h4>
          <p className="text-xs text-slate-400">Guaranteed at-least-once delivery with cryptographic HMAC-SHA256 payload signing</p>
        </div>
        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/30">
          Zero Event Loss
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 relative">
        {/* Step 1 */}
        <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700">
          <div className="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center mb-2">
            <Database className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-bold text-slate-200 block">Outbox Row</span>
          <span className="text-[10px] text-slate-400 block mt-1">Saved in same DB transaction as payment</span>
        </div>

        {/* Step 2 */}
        <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700">
          <div className="w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-2">
            <Cpu className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-bold text-slate-200 block">Kafka Broker</span>
          <span className="text-[10px] text-slate-400 block mt-1">Published to payment.events partition</span>
        </div>

        {/* Step 3 */}
        <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700">
          <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-bold text-slate-200 block">HMAC Signer</span>
          <span className="text-[10px] text-slate-400 block mt-1">Header: X-PayCore-Signature with timestamp</span>
        </div>

        {/* Step 4 */}
        <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700">
          <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center mb-2">
            <RotateCw className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-bold text-slate-200 block">HTTP Dispatch</span>
          <span className="text-[10px] text-slate-400 block mt-1">5 retries with exponential backoff & jitter</span>
        </div>

        {/* Step 5 */}
        <div className="p-3.5 rounded-xl bg-slate-800/80 border border-emerald-500/40">
          <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center mb-2">
            <CheckCircle2 className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-bold text-white block">Merchant Ack</span>
          <span className="text-[10px] text-emerald-300 block mt-1">HTTP 200 acknowledged & marked delivered</span>
        </div>
      </div>
    </div>
  );
};
