import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { merchantDashboardService } from '@/services/api/merchantDashboardService';
import { MerchantDashboardSummary } from '@/types/merchantDashboard';
import { PageContainer } from '@/components/common/PageContainer';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import {
  CreditCard,
  RotateCcw,
  Globe,
  KeyRound,
  ArrowRight,
  RefreshCw,
  ArrowDownLeft,
  ArrowUpRight,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

export const MerchantDashboardPage: React.FC = () => {
  const { user } = useAuth();

  const [summary, setSummary] = useState<MerchantDashboardSummary | null>(null);
  const [, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
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
      setError('Could not refresh live statistics. Real-time metrics will update on next telemetry sync.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount || 0);
  };

  return (
    <PageContainer
      title={`Welcome, ${user?.fullName || 'Merchant'}`}
      description="Production payment processing platform. Monitor charges, track refund balances, and inspect webhook deliveries."
    >
      {/* Top Banner */}
      <div className="mb-6 p-5 bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 text-white rounded-2xl shadow-lg border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center space-x-3.5 relative z-10">
          <div className="w-12 h-12 bg-blue-600/30 border border-blue-400/30 rounded-xl flex items-center justify-center text-blue-300 shadow-inner">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-bold text-base tracking-wide text-white font-sans">Payment Engine: Operational</h3>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5 animate-pulse" /> Live Telemetry
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1 font-mono">
              Merchant: <span className="font-semibold text-white">{user?.merchantCode || 'mer_active'}</span> | Email: <span className="text-blue-200">{user?.email}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2.5 relative z-10 w-full md:w-auto justify-end">
          <Button
            size="sm"
            variant="outline"
            onClick={() => fetchSummary(true)}
            isLoading={isRefreshing}
            className="bg-white/10 hover:bg-white/20 text-white border-white/20 text-xs font-semibold"
          >
            <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
            Sync Metrics
          </Button>
          <Link to="/merchant/payments">
            <Button size="sm" variant="primary" className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow">
              <CreditCard className="w-3.5 h-3.5 mr-1.5" />
              New Payment
            </Button>
          </Link>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-xs">
          {error}
        </div>
      )}

      {/* KPI Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Gross Volume</span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <CreditCard className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-slate-900 tracking-tight">
              {formatCurrency(summary?.totalPaymentVolume || 0)}
            </span>
            <span className="block text-xs text-slate-500 font-medium mt-1">
              {summary?.totalPayments || 0} total charges initiated
            </span>
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Successful Settled</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-emerald-700 tracking-tight">
              {summary?.successfulPayments || 0}
            </span>
            <span className="block text-xs text-emerald-600 font-medium mt-1">
              Terminal state SUCCESS confirmed
            </span>
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Refund Volume</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <RotateCcw className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-amber-800 tracking-tight">
              {formatCurrency(summary?.totalRefundVolume || 0)}
            </span>
            <span className="block text-xs text-amber-700 font-medium mt-1">
              {summary?.successfulRefunds || 0} partial/full refunds settled
            </span>
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Webhook Deliveries</span>
            <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
              <Globe className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-purple-900 tracking-tight">
              {summary?.totalWebhooks || 0}
            </span>
            <span className="block text-xs text-purple-700 font-medium mt-1">
              HMAC-SHA256 signed events
            </span>
          </div>
        </Card>
      </div>

      {/* Two Column Section: Quick Actions & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
        {/* Left Column: Quick Actions & Credentials */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="p-6">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Merchant Operations</h3>
            <div className="space-y-3">
              <Link to="/merchant/payments" className="block p-3 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/30 transition-all">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                      <CreditCard className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">Initiate Charges</h4>
                      <p className="text-[11px] text-slate-500">Create new payments with idempotency keys</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                </div>
              </Link>

              <Link to="/merchant/refunds" className="block p-3 rounded-xl border border-slate-200 hover:border-amber-400 hover:bg-amber-50/30 transition-all">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
                      <RotateCcw className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">Issue Refunds</h4>
                      <p className="text-[11px] text-slate-500">Two-phase balance verified partial & full refunds</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                </div>
              </Link>

              <Link to="/merchant/api-keys" className="block p-3 rounded-xl border border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/30 transition-all">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                      <KeyRound className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">Manage API Keys</h4>
                      <p className="text-[11px] text-slate-500">Generate and rotate 256-bit API keys</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                </div>
              </Link>

              <Link to="/merchant/webhooks" className="block p-3 rounded-xl border border-slate-200 hover:border-purple-400 hover:bg-purple-50/30 transition-all">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center">
                      <Globe className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">Webhook Endpoints</h4>
                      <p className="text-[11px] text-slate-500">Configure event subscribers and view delivery logs</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                </div>
              </Link>
            </div>
          </Card>
        </div>

        {/* Right Column: Recent Transactions from Database */}
        <div className="lg:col-span-7">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Recent Activity</h3>
              <Link to="/merchant/transactions" className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1">
                View All <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {summary?.recentTransactions && summary.recentTransactions.length > 0 ? (
              <div className="divide-y divide-slate-100">
                {summary.recentTransactions.map((tx) => (
                  <div key={tx.transactionReference} className="py-3 flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                        tx.transactionType === 'REFUND' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-600'
                      }`}>
                        {tx.transactionType === 'REFUND' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownLeft className="w-4 h-4" />}
                      </div>
                      <div>
                        <div className="font-mono font-semibold text-slate-800">{tx.transactionReference}</div>
                        <div className="text-[11px] text-slate-500">{new Date(tx.createdAt).toLocaleString()}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`font-mono font-bold ${tx.transactionType === 'REFUND' ? 'text-rose-600' : 'text-slate-900'}`}>
                        {tx.transactionType === 'REFUND' ? '-' : ''}{formatCurrency(tx.amount)}
                      </div>
                      <Badge variant={tx.status === 'SUCCESS' ? 'success' : tx.status === 'FAILED' ? 'failed' : 'warning'}>
                        {tx.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center text-slate-400">
                <CreditCard className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-xs">No transactions recorded yet.</p>
                <Link to="/merchant/payments" className="inline-block mt-3">
                  <Button size="sm" variant="primary" className="text-xs">
                    Initiate Your First Payment
                  </Button>
                </Link>
              </div>
            )}
          </Card>
        </div>
      </div>
    </PageContainer>
  );
};
