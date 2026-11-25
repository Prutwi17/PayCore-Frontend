import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { merchantDashboardService } from '@/services/api/merchantDashboardService';
import { MerchantDashboardSummary } from '@/types/merchantDashboard';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { PageLoading } from '@/components/common/PageLoading';
import {
  RotateCcw,
  CheckCircle2,
  XCircle,
  CreditCard,
  RefreshCw,
  Plus,
  ArrowRight,
  KeyRound,
  Webhook,
  History,
  LayoutDashboard,
  Wallet,
} from 'lucide-react';

export const MerchantDashboardPage: React.FC = () => {
  const { user } = useAuth();

  const [summary, setSummary] = useState<MerchantDashboardSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSummary = useCallback(async (isRefresh = false) => {
    if (isRefresh) setIsRefreshing(true);
    else setIsLoading(true);
    setError(null);

    try {
      const data = await merchantDashboardService.getSummary();
      setSummary(data);
    } catch {
      setError('Could not load dashboard metrics.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  const formatCurrency = (amount: number | undefined | null, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
    }).format(amount || 0);
  };

  const getStatusVariant = (status: string): 'success' | 'processing' | 'failed' | 'warning' | 'neutral' => {
    switch (status?.toUpperCase()) {
      case 'SUCCESS':
      case 'COMPLETED':
        return 'success';
      case 'PROCESSING':
      case 'CREATED':
        return 'processing';
      case 'FAILED':
        return 'failed';
      case 'PENDING':
      case 'REQUESTED':
      case 'REQUIRES_ACTION':
        return 'warning';
      default:
        return 'neutral';
    }
  };

  if (isLoading) {
    return <PageLoading message="Loading dashboard..." />;
  }

  const totalPayments = summary?.totalPayments ?? 0;
  const successfulPayments = summary?.successfulPayments ?? 0;
  const failedPayments = summary?.failedPayments ?? 0;
  const pendingPayments = summary?.pendingPayments ?? 0;
  const recentTransactions = summary?.recentTransactions ?? [];

  const successPct = totalPayments > 0 ? Math.round((successfulPayments / totalPayments) * 100) : 0;
  const pendingPct = totalPayments > 0 ? Math.round((pendingPayments / totalPayments) * 100) : 0;
  const failedPct = totalPayments > 0 ? Math.round((failedPayments / totalPayments) * 100) : 0;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
        <div className="flex items-center space-x-2.5">
          <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-200/60 dark:border-blue-800/60">
            <LayoutDashboard className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Merchant Dashboard</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Welcome back, <span className="font-semibold text-slate-700 dark:text-slate-200">{user?.fullName || 'Merchant'}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2.5">
          <Button
            size="sm"
            variant="outline"
            onClick={() => fetchSummary(true)}
            isLoading={isRefreshing}
          >
            <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
            Refresh
          </Button>

          <Link to="/merchant/payments">
            <Button size="sm" variant="primary">
              <Plus className="w-3.5 h-3.5 mr-1.5" />
              Create Payment
            </Button>
          </Link>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-2xl text-amber-800 dark:text-amber-300 text-xs flex items-center justify-between">
          <span>{error}</span>
          <Button variant="ghost" size="sm" onClick={() => fetchSummary(true)}>
            Retry
          </Button>
        </div>
      )}

      {/* Row 1: 4 Uniform KPI Boxes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <Card className="p-5 flex flex-col justify-between border-t-4 border-t-blue-600">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Total Volume
            </span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {formatCurrency(summary?.totalPaymentVolume)}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-2 pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between">
              <span>Total Payments</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{totalPayments}</span>
            </div>
          </div>
        </Card>

        <Card className="p-5 flex flex-col justify-between border-t-4 border-t-emerald-600">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Successful
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {successfulPayments}
            </div>
            <div className="text-xs text-emerald-600 dark:text-emerald-400 mt-2 pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between">
              <span>Completed</span>
              <span className="font-semibold">{successPct}%</span>
            </div>
          </div>
        </Card>

        <Card className="p-5 flex flex-col justify-between border-t-4 border-t-rose-600">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Failed
            </span>
            <div className="w-9 h-9 rounded-xl bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <XCircle className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {failedPayments}
            </div>
            <div className="text-xs text-rose-600 dark:text-rose-400 mt-2 pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between">
              <span>Pending</span>
              <span className="font-semibold text-amber-600 dark:text-amber-400">{pendingPayments}</span>
            </div>
          </div>
        </Card>

        <Card className="p-5 flex flex-col justify-between border-t-4 border-t-amber-500">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Refunded
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <RotateCcw className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {formatCurrency(summary?.totalRefundVolume)}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-2 pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between">
              <span>Completed Refunds</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{summary?.successfulRefunds ?? 0}</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Row 2: 12-Column Boxed Grid (Account Summary + Payment Status & Quick Links) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Box: Account Totals */}
        <Card className="lg:col-span-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">Account Summary</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">Net volume and payment breakdown</p>
              </div>
              <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center">
                <Wallet className="w-4 h-4" />
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/70 mb-5">
              <div className="text-xs font-medium text-slate-500 dark:text-slate-400">Net Volume</div>
              <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
                {formatCurrency(summary?.netVolume)}
              </div>
            </div>

            <div className="space-y-3.5">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-medium text-slate-700 dark:text-slate-300">Successful</span>
                  <span className="text-slate-500 dark:text-slate-400">{successfulPayments} ({successPct}%)</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${successPct}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-medium text-slate-700 dark:text-slate-300">Pending</span>
                  <span className="text-slate-500 dark:text-slate-400">{pendingPayments} ({pendingPct}%)</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: `${pendingPct}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-medium text-slate-700 dark:text-slate-300">Failed</span>
                  <span className="text-slate-500 dark:text-slate-400">{failedPayments} ({failedPct}%)</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div className="h-full bg-rose-500 rounded-full" style={{ width: `${failedPct}%` }} />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Webhooks Sent: <strong className="text-slate-800 dark:text-slate-200">{summary?.totalWebhooks ?? 0}</strong></span>
            <span>Failed: <strong className="text-rose-600 dark:text-rose-400">{summary?.failedWebhooks ?? 0}</strong></span>
          </div>
        </Card>

        {/* Right Box: Quick Actions 2x2 Box Grid */}
        <Card className="lg:col-span-7 flex flex-col justify-between">
          <div className="mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Quick Actions</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Manage payments, refunds, webhooks, and API keys</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
            <Link
              to="/merchant/payments"
              className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 hover:bg-blue-50/60 dark:hover:bg-slate-800 hover:border-blue-300 dark:hover:border-blue-700 transition-all flex flex-col justify-between group"
            >
              <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-3">
                <CreditCard className="w-4 h-4" />
              </div>
              <div>
                <div className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 flex items-center justify-between">
                  <span>Payments</span>
                  <ArrowRight className="w-3.5 h-3.5 opacity-60 group-hover:translate-x-0.5 transition-transform" />
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Create and inspect payments</p>
              </div>
            </Link>

            <Link
              to="/merchant/refunds"
              className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 hover:bg-emerald-50/60 dark:hover:bg-slate-800 hover:border-emerald-300 dark:hover:border-emerald-700 transition-all flex flex-col justify-between group"
            >
              <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3">
                <RotateCcw className="w-4 h-4" />
              </div>
              <div>
                <div className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 flex items-center justify-between">
                  <span>Refunds</span>
                  <ArrowRight className="w-3.5 h-3.5 opacity-60 group-hover:translate-x-0.5 transition-transform" />
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Issue and track customer refunds</p>
              </div>
            </Link>

            <Link
              to="/merchant/transactions"
              className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 hover:bg-sky-50/60 dark:hover:bg-slate-800 hover:border-sky-300 dark:hover:border-sky-700 transition-all flex flex-col justify-between group"
            >
              <div className="w-9 h-9 rounded-xl bg-sky-100 dark:bg-sky-950 text-sky-600 dark:text-sky-400 flex items-center justify-center mb-3">
                <History className="w-4 h-4" />
              </div>
              <div>
                <div className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 flex items-center justify-between">
                  <span>Transactions</span>
                  <ArrowRight className="w-3.5 h-3.5 opacity-60 group-hover:translate-x-0.5 transition-transform" />
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Search transaction history</p>
              </div>
            </Link>

            <Link
              to="/merchant/api-keys"
              className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 hover:bg-violet-50/60 dark:hover:bg-slate-800 hover:border-violet-300 dark:hover:border-violet-700 transition-all flex flex-col justify-between group"
            >
              <div className="w-9 h-9 rounded-xl bg-violet-100 dark:bg-violet-950 text-violet-600 dark:text-violet-400 flex items-center justify-center mb-3">
                <KeyRound className="w-4 h-4" />
              </div>
              <div>
                <div className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-violet-600 dark:group-hover:text-violet-400 flex items-center justify-between">
                  <span>API Keys</span>
                  <ArrowRight className="w-3.5 h-3.5 opacity-60 group-hover:translate-x-0.5 transition-transform" />
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Manage API keys & webhooks</p>
              </div>
            </Link>
          </div>
        </Card>
      </div>

      {/* Row 3: Recent Transactions Box */}
      <Card>
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Recent Transactions</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Latest transactions on your account</p>
          </div>
          <div className="flex items-center space-x-3">
            <Link to="/merchant/webhooks" className="text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-blue-600 flex items-center gap-1">
              <Webhook className="w-3.5 h-3.5" />
              <span>Webhooks</span>
            </Link>
            <Link to="/merchant/transactions" className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 flex items-center gap-1">
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {recentTransactions.length === 0 ? (
          <div className="p-10 text-center bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-dashed border-slate-200 dark:border-slate-700">
            <CreditCard className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">No transactions yet</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-4">
              Create your first payment to see activity here.
            </p>
            <Link to="/merchant/payments">
              <Button size="sm" variant="primary">
                <Plus className="w-3.5 h-3.5 mr-1.5" />
                Create Payment
              </Button>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/70 text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-700 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Reference</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-sans">
                {recentTransactions.map((row) => (
                  <tr key={row.transactionReference} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="py-3 px-4 font-mono font-semibold text-blue-600 dark:text-blue-400">
                      <Link to="/merchant/payments" className="hover:underline">
                        {row.transactionReference}
                      </Link>
                    </td>
                    <td className="py-3 px-4 text-slate-700 dark:text-slate-300 font-medium">{row.transactionType}</td>
                    <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                      {formatCurrency(row.amount, row.currency)}
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant={getStatusVariant(row.status)}>
                        {row.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-slate-500 dark:text-slate-400 text-right">
                      {new Date(row.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};
