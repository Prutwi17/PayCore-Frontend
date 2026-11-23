import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { merchantDashboardService } from '@/services/api/merchantDashboardService';
import { MerchantDashboardSummary } from '@/types/merchantDashboard';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import {
  RotateCcw,
  CheckCircle2,
  XCircle,
  FileText,
  Calendar,
  RefreshCw,
  Plus,
  ArrowRight,
} from 'lucide-react';

export const MerchantDashboardPage: React.FC = () => {
  const { user } = useAuth();

  const [summary, setSummary] = useState<MerchantDashboardSummary | null>(null);
  const [, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [timeframe, setTimeframe] = useState('Last 30 Days');
  const [error, setError] = useState<string | null>(null);

  const fetchSummary = useCallback(async (isRefresh = false) => {
    if (isRefresh) setIsRefreshing(true);
    else setIsLoading(true);
    setError(null);

    try {
      const data = await merchantDashboardService.getSummary();
      setSummary(data);
    } catch (err: unknown) {
      console.warn('Could not fetch merchant dashboard summary:', err);
      setError('Could not refresh live statistics. Real-time metrics will update on next sync.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  // 6-month chart points matching UI reference (Jan, Feb, Mar, Apr, May, Jun)
  const chartPoints = [
    { month: 'Jan', val: 32 },
    { month: 'Feb', val: 58 },
    { month: 'Mar', val: 45 },
    { month: 'Apr', val: 82 },
    { month: 'May', val: 68 },
    { month: 'Jun', val: 95 },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header matching UI Reference */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Dashboard</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Welcome back, <span className="font-semibold text-slate-700">{user?.fullName || 'Merchant'}</span>
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 shadow-2xs">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value)}
              className="bg-transparent focus:outline-none cursor-pointer"
            >
              <option>Last 30 Days</option>
              <option>Last 7 Days</option>
              <option>This Quarter</option>
              <option>Year to Date</option>
            </select>
          </div>

          <Button
            size="sm"
            variant="outline"
            onClick={() => fetchSummary(true)}
            isLoading={isRefreshing}
            className="text-xs font-semibold"
          >
            <RefreshCw className="w-3.5 h-3.5 mr-1" />
            Refresh
          </Button>

          <Link to="/merchant/payments">
            <Button size="sm" variant="primary" className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm">
              <Plus className="w-3.5 h-3.5 mr-1" />
              Create Payment
            </Button>
          </Link>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-xs">
          {error}
        </div>
      )}

      {/* 4 KPI Cards matching UI Reference */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Total Payments */}
        <Card className="p-5 border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Volume</span>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 tracking-tight">
            {summary?.totalPaymentVolume ? formatCurrency(summary.totalPaymentVolume) : '₹0'}
          </div>
          <div className="text-xs text-slate-500 font-medium mt-1">
            Total Payments: <span className="font-semibold text-slate-700">{summary?.totalPayments ?? 0}</span>
          </div>
        </Card>

        {/* Card 2: Successful */}
        <Card className="p-5 border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">Successful</span>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 tracking-tight">
            {summary?.successfulPayments ?? 0}
          </div>
          <div className="text-xs text-emerald-600 font-medium mt-1">
            Completed transactions
          </div>
        </Card>

        {/* Card 3: Failed */}
        <Card className="p-5 border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <XCircle className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-rose-600 uppercase tracking-wider">Failed</span>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 tracking-tight">
            {summary?.failedPayments ?? 0}
          </div>
          <div className="text-xs text-rose-600 font-medium mt-1">
            Unsuccessful authorizations
          </div>
        </Card>

        {/* Card 4: Refunded */}
        <Card className="p-5 border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <RotateCcw className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-amber-600 uppercase tracking-wider">Refunded</span>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 tracking-tight">
            {summary?.totalRefundVolume ? formatCurrency(summary.totalRefundVolume) : '₹0'}
          </div>
          <div className="text-xs text-slate-500 font-medium mt-1">
            Settled Refunds: <span className="font-semibold text-slate-700">{summary?.successfulRefunds ?? 0}</span>
          </div>
        </Card>
      </div>

      {/* Payment Volume Area Chart Section matching UI Reference */}
      <Card className="p-6 border-slate-200/90 shadow-2xs">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-base font-bold text-slate-900">Payment Volume</h3>
            <p className="text-xs text-slate-500">Gross authorization trends over the active cycle</p>
          </div>
          <div className="flex items-center space-x-2 text-xs">
            <span className="w-3 h-3 rounded-full bg-blue-600 inline-block" />
            <span className="font-medium text-slate-600">Settled Volume (₹ Lakhs)</span>
          </div>
        </div>

        {/* Area Chart SVG */}
        <div className="relative w-full h-64 select-none">
          <svg className="w-full h-full" viewBox="0 0 600 220" preserveAspectRatio="none">
            <defs>
              <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#2563EB" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#2563EB" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Horizontal Grid lines */}
            <line x1="40" y1="20" x2="580" y2="20" stroke="#E2E8F0" strokeDasharray="3 3" />
            <line x1="40" y1="70" x2="580" y2="70" stroke="#E2E8F0" strokeDasharray="3 3" />
            <line x1="40" y1="120" x2="580" y2="120" stroke="#E2E8F0" strokeDasharray="3 3" />
            <line x1="40" y1="170" x2="580" y2="170" stroke="#E2E8F0" strokeDasharray="3 3" />

            {/* Y Axis text */}
            <text x="10" y="24" fill="#94A3B8" fontSize="10">100</text>
            <text x="10" y="74" fill="#94A3B8" fontSize="10">60</text>
            <text x="10" y="124" fill="#94A3B8" fontSize="10">30</text>
            <text x="18" y="174" fill="#94A3B8" fontSize="10">0</text>

            {/* Area Path */}
            <path
              d="M 50 150 Q 150 90, 250 110 T 350 40 T 450 65 T 560 25 L 560 170 L 50 170 Z"
              fill="url(#areaGradient)"
            />

            {/* Smooth Line Path */}
            <path
              d="M 50 150 Q 150 90, 250 110 T 350 40 T 450 65 T 560 25"
              fill="none"
              stroke="#2563EB"
              strokeWidth="3"
              strokeLinecap="round"
            />

            {/* Data Dots */}
            {[
              { cx: 50, cy: 150 },
              { cx: 150, cy: 95 },
              { cx: 250, cy: 110 },
              { cx: 350, cy: 40 },
              { cx: 450, cy: 65 },
              { cx: 560, cy: 25 },
            ].map((dot, i) => (
              <circle key={i} cx={dot.cx} cy={dot.cy} r="4" fill="#FFFFFF" stroke="#2563EB" strokeWidth="2.5" />
            ))}
          </svg>

          {/* X Axis Labels */}
          <div className="flex justify-between px-8 text-xs font-medium text-slate-500 pt-2">
            {chartPoints.map((p) => (
              <span key={p.month}>{p.month}</span>
            ))}
          </div>
        </div>
      </Card>

      {/* Recent Activity Table matching UI Reference */}
      <Card className="p-6 border-slate-200/90 shadow-2xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">Recent Transactions</h3>
            <p className="text-xs text-slate-500">Latest payment activities processed through your merchant account</p>
          </div>
          <Link to="/merchant/transactions" className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1">
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Payment ID</th>
                <th className="py-3 px-4">Order ID</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Created At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans">
              {[
                { paymentId: 'PAY_8F2301', orderId: 'ORD-1001', amount: '₹1,990.00', status: 'Success', date: 'Jun 26, 10:24' },
                { paymentId: 'PAY_9A7652', orderId: 'ORD-1002', amount: '₹1,490.00', status: 'Processing', date: 'Jun 26, 10:20' },
                { paymentId: 'PAY_C1309', orderId: 'ORD-1003', amount: '₹299.00', status: 'Failed', date: 'Jun 26, 10:10' },
                { paymentId: 'PAY_7D441A', orderId: 'ORD-1004', amount: '₹1,990.00', status: 'Success', date: 'Jun 25, 18:32' },
              ].map((row) => (
                <tr key={row.paymentId} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3 px-4 font-mono font-semibold text-blue-600">
                    <Link to={`/merchant/payments`} className="hover:underline">
                      {row.paymentId}
                    </Link>
                  </td>
                  <td className="py-3 px-4 text-slate-700 font-medium">{row.orderId}</td>
                  <td className="py-3 px-4 font-bold text-slate-900">{row.amount}</td>
                  <td className="py-3 px-4">
                    <Badge
                      variant={
                        row.status === 'Success'
                          ? 'success'
                          : row.status === 'Processing'
                          ? 'warning'
                          : 'failed'
                      }
                    >
                      {row.status}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-slate-500 text-right">{row.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
