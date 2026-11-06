import React from 'react';
import { Building2, KeyRound, Globe } from 'lucide-react';

export const MerchantManagementVisual: React.FC = () => {
  return (
    <div className="w-full bg-white border border-slate-200 rounded-2xl shadow-sm p-5 text-slate-800">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h4 className="text-sm font-bold text-slate-900">Acme Payments Global Inc.</h4>
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                ACTIVE
              </span>
            </div>
            <p className="text-xs text-slate-500 font-mono mt-0.5">mer_acme_8912 · admin@acmepayments.com</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        {/* API Credentials */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-2">
            <span className="flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-blue-600" /> Live Secret Key
            </span>
            <span className="text-[10px] text-slate-400">SHA-256 Hashed at Rest</span>
          </div>
          <div className="bg-white border border-slate-200 rounded-lg p-2 flex items-center justify-between font-mono text-xs text-slate-700">
            <span>sk_live_948a7b1c••••••••••••</span>
            <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-500">256-bit</span>
          </div>
        </div>

        {/* Webhook Configuration */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-2">
            <span className="flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-emerald-600" /> Active Webhook Endpoint
            </span>
            <span className="text-[10px] text-emerald-600 font-medium">Auto-Retries Enabled</span>
          </div>
          <div className="bg-white border border-slate-200 rounded-lg p-2 flex items-center justify-between font-mono text-xs text-slate-700 truncate">
            <span className="truncate">https://api.acme.com/v1/paycore</span>
            <span className="text-[10px] text-emerald-600 font-bold ml-2">200 OK</span>
          </div>
        </div>
      </div>
    </div>
  );
};
