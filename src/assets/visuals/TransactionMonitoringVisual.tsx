import React from 'react';
import { ArrowDownLeft, ArrowUpRight, Search, SlidersHorizontal } from 'lucide-react';

export const TransactionMonitoringVisual: React.FC = () => {
  return (
    <div className="w-full bg-white border border-slate-200 rounded-2xl shadow-sm p-5 text-slate-800">
      {/* Control bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-60">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              readOnly
              value="Filter by reference, customer..."
              className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-600 font-sans focus:outline-none"
            />
          </div>
          <button className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-600 font-medium">
            <SlidersHorizontal className="w-3 h-3 text-slate-500" /> Filter
          </button>
        </div>
        <div className="flex items-center space-x-2 text-xs">
          <span className="text-slate-400 text-[11px]">Type:</span>
          <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-semibold text-[11px]">All</span>
          <span className="px-2 py-0.5 rounded text-slate-500 text-[11px]">Payments</span>
          <span className="px-2 py-0.5 rounded text-slate-500 text-[11px]">Refunds</span>
        </div>
      </div>

      {/* Unified Table Preview */}
      <div className="overflow-x-auto mt-2">
        <table className="w-full text-left text-xs font-mono">
          <thead>
            <tr className="text-[10px] text-slate-400 uppercase tracking-wider border-b border-slate-100">
              <th className="py-2.5 font-semibold">Type</th>
              <th className="py-2.5 font-semibold">Reference</th>
              <th className="py-2.5 font-semibold">Merchant</th>
              <th className="py-2.5 font-semibold text-right">Amount</th>
              <th className="py-2.5 font-semibold text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            <tr>
              <td className="py-2.5">
                <span className="inline-flex items-center gap-1 text-[11px] font-sans font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                  <ArrowDownLeft className="w-3 h-3" /> PAYMENT
                </span>
              </td>
              <td className="py-2.5 font-semibold text-slate-800">pay_f48a1c90</td>
              <td className="py-2.5 text-slate-500">mer_orbit_01</td>
              <td className="py-2.5 text-right font-semibold text-slate-900">$2,450.00 USD</td>
              <td className="py-2.5 text-right">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-sans font-semibold bg-emerald-100 text-emerald-800">
                  SUCCESS
                </span>
              </td>
            </tr>
            <tr>
              <td className="py-2.5">
                <span className="inline-flex items-center gap-1 text-[11px] font-sans font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                  <ArrowUpRight className="w-3 h-3" /> REFUND
                </span>
              </td>
              <td className="py-2.5 font-semibold text-slate-800">ref_18b284e3</td>
              <td className="py-2.5 text-slate-500">mer_orbit_01</td>
              <td className="py-2.5 text-right font-semibold text-rose-600">-$350.00 USD</td>
              <td className="py-2.5 text-right">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-sans font-semibold bg-emerald-100 text-emerald-800">
                  SUCCESS
                </span>
              </td>
            </tr>
            <tr>
              <td className="py-2.5">
                <span className="inline-flex items-center gap-1 text-[11px] font-sans font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                  <ArrowDownLeft className="w-3 h-3" /> PAYMENT
                </span>
              </td>
              <td className="py-2.5 font-semibold text-slate-800">pay_6d203e81</td>
              <td className="py-2.5 text-slate-500">mer_orbit_01</td>
              <td className="py-2.5 text-right font-semibold text-slate-900">$89.00 USD</td>
              <td className="py-2.5 text-right">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-sans font-semibold bg-rose-100 text-rose-800">
                  FAILED
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
