import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { dashboardService } from '@/services/api/dashboardService';
import { auditService } from '@/services/api/auditService';
import { reconciliationService } from '@/services/api/reconciliationService';
import {
  AdminDashboardSummary,
  PaymentTrendPoint,
  StatusDistribution,
  ReconciliationSummary,
} from '@/types/dashboard';
import { AuditLog } from '@/types/audit';
import { ReconciliationRecord, RunType } from '@/types/reconciliation';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { PageLoading } from '@/components/common/PageLoading';
import {
  LayoutDashboard,
  CreditCard,
  RotateCcw,
  Scale,
  ScrollText,
  AlertTriangle,
  RefreshCw,
  ArrowRight,
  ShieldAlert,
  Play,
  X,
} from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  const navigate = useNavigate();

  const [dateRange, setDateRange] = useState<'24h' | '7d' | '30d' | 'all'>('7d');
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Metrics Data
  const [summary, setSummary] = useState<AdminDashboardSummary | null>(null);
  const [paymentTrends, setPaymentTrends] = useState<PaymentTrendPoint[]>([]);
  const [statusDistributions, setStatusDistributions] = useState<StatusDistribution[]>([]);
  const [recSummary, setRecSummary] = useState<ReconciliationSummary | null>(null);
  const [recentAudits, setRecentAudits] = useState<AuditLog[]>([]);
  const [recentDiscrepancies, setRecentDiscrepancies] = useState<ReconciliationRecord[]>([]);

  // Trigger Run Modal State
  const [isRunModalOpen, setIsRunModalOpen] = useState(false);
  const [runType, setRunType] = useState<RunType>('FULL');
  const [isTriggeringRun, setIsTriggeringRun] = useState(false);
  const [runModalError, setRunModalError] = useState<string | null>(null);

  const getDateParams = useCallback(() => {
    const now = new Date();
    let startDate: string | undefined;
    const endDate = now.toISOString();

    if (dateRange === '24h') {
      startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();
    } else if (dateRange === '7d') {
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
    } else if (dateRange === '30d') {
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();
    }

    return { startDate, endDate };
  }, [dateRange]);

  const fetchDashboardData = useCallback(async () => {
    setError(null);
    try {
      const { startDate, endDate } = getDateParams();
      const [
        summaryRes,
        trendsRes,
        distRes,
        recRes,
        auditsRes,
        discrepanciesRes,
      ] = await Promise.all([
        dashboardService.getSummary(startDate, endDate),
        dashboardService.getPaymentTrends(startDate, endDate),
        dashboardService.getStatusDistribution(startDate, endDate),
        dashboardService.getReconciliationSummary(),
        auditService.getRecentAuditLogs(),
        reconciliationService.getDiscrepancies({ size: 5 }),
      ]);

      setSummary(summaryRes);
      setPaymentTrends(trendsRes);
      setStatusDistributions(distRes);
      setRecSummary(recRes);
      setRecentAudits(auditsRes);
      setRecentDiscrepancies(discrepanciesRes.content);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to load dashboard metrics';
      setError(msg);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [getDateParams]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchDashboardData();
  };

  const handleTriggerRun = async () => {
    setIsTriggeringRun(true);
    setRunModalError(null);
    try {
      const { startDate, endDate } = getDateParams();
      const run = await reconciliationService.triggerRun({
        runType,
        startDate,
        endDate,
      });
      setIsRunModalOpen(false);
      navigate(`/admin/reconciliation/${run.runReference}`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to initiate reconciliation run';
      setRunModalError(msg);
    } finally {
      setIsTriggeringRun(false);
    }
  };

  const formatCurrency = (amount: number | null | undefined, currency = 'USD') => {
    const val = amount || 0;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
    }).format(val);
  };

  const getStatusBadgeVariant = (status: string): 'success' | 'processing' | 'failed' | 'warning' | 'neutral' => {
    switch (status.toUpperCase()) {
      case 'SUCCESS':
      case 'COMPLETED':
      case 'MATCHED':
      case 'RESOLVED':
        return 'success';
      case 'PROCESSING':
      case 'RUNNING':
        return 'processing';
      case 'FAILED':
      case 'UNMATCHED':
        return 'failed';
      case 'REVIEW_REQUIRED':
      case 'COMPLETED_WITH_ERRORS':
      case 'UNKNOWN':
      case 'REQUIRES_ACTION':
        return 'warning';
      default:
        return 'neutral';
    }
  };

  if (isLoading) {
    return <PageLoading message="Aggregating platform metrics..." />;
  }

  // Max volume for trend bars
  const maxVolume = Math.max(...paymentTrends.map((t) => t.amount), 100);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <LayoutDashboard className="w-7 h-7 text-blue-600" />
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">System Admin Dashboard</h1>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Real-time multi-merchant payment analytics, reconciliation health, and audit trail
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {/* Date Range Selector */}
          <div className="inline-flex rounded-lg border border-slate-200 bg-white p-1 text-xs font-medium shadow-sm">
            {(['24h', '7d', '30d', 'all'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setDateRange(range)}
                className={`px-3 py-1.5 rounded-md transition-colors ${
                  dateRange === range
                    ? 'bg-blue-600 text-white font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                {range === '24h' ? '24 Hours' : range === '7d' ? '7 Days' : range === '30d' ? '30 Days' : 'All Time'}
              </button>
            ))}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            isLoading={isRefreshing}
          >
            <RefreshCw className="w-4 h-4 mr-1.5" />
            Refresh
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsRunModalOpen(true)}
          >
            <Play className="w-4 h-4 mr-1.5" />
            Run Reconciliation
          </Button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700 flex items-center justify-between">
          <span>{error}</span>
          <Button variant="ghost" size="sm" onClick={fetchDashboardData}>
            Retry
          </Button>
        </div>
      )}

      {/* Primary KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Payments KPI */}
        <Card className="border-l-4 border-l-blue-600">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Payment Processing
            </span>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <CreditCard className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-slate-900">
              {formatCurrency(summary?.totalPaymentVolume)}
            </span>
            <div className="flex items-center justify-between text-xs text-slate-500 mt-2">
              <span>{summary?.totalPayments || 0} Total Transactions</span>
              <span className="font-semibold text-emerald-600">
                {summary?.paymentSuccessRate || 0}% Success
              </span>
            </div>
          </div>
        </Card>

        {/* Refunds KPI */}
        <Card className="border-l-4 border-l-purple-600">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Refunds & Disputes
            </span>
            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
              <RotateCcw className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-slate-900">
              {formatCurrency(summary?.successfulRefundVolume)}
            </span>
            <div className="flex items-center justify-between text-xs text-slate-500 mt-2">
              <span>{summary?.successfulRefunds || 0} Settled Refunds</span>
              <span className="font-semibold text-amber-600">
                {summary?.pendingRefunds || 0} Pending
              </span>
            </div>
          </div>
        </Card>

        {/* Reconciliation Health KPI */}
        <Card className="border-l-4 border-l-emerald-600">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Reconciliation Health
            </span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <Scale className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-center space-x-2">
              <Badge variant={getStatusBadgeVariant(summary?.latestReconciliationStatus || 'NEVER_RUN')}>
                {summary?.latestReconciliationStatus || 'NEVER_RUN'}
              </Badge>
              <span className="text-xs text-slate-400">Latest</span>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-500 mt-3">
              <span>{recSummary?.totalRuns || 0} Runs Completed</span>
              <span className={`font-bold ${summary?.unresolvedDiscrepanciesCount ? 'text-amber-600' : 'text-emerald-600'}`}>
                {summary?.unresolvedDiscrepanciesCount || 0} Unresolved
              </span>
            </div>
          </div>
        </Card>

        {/* Webhooks / Operations KPI */}
        <Card className="border-l-4 border-l-amber-500">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Async Reliability
            </span>
            <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
              <ShieldAlert className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-slate-900">
              {summary?.webhookDeliveryFailures || 0}
            </span>
            <span className="text-xs text-slate-500 ml-1">Delivery Failures</span>
            <div className="flex items-center justify-between text-xs text-slate-500 mt-2">
              <span>Pending Retries</span>
              <span className="font-semibold text-blue-600">
                {summary?.pendingWebhookRetries || 0} Active
              </span>
            </div>
          </div>
        </Card>
      </div>

      {/* Trend Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Payment Volume Trend (Responsive SVG Bars) */}
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-semibold text-slate-900">Payment Volume Trend</h2>
              <p className="text-xs text-slate-500">Daily transaction volume and success patterns</p>
            </div>
            <div className="flex items-center space-x-2 text-xs">
              <span className="inline-block w-3 h-3 bg-blue-600 rounded-sm"></span>
              <span className="text-slate-600">Settled Volume ($)</span>
            </div>
          </div>

          {paymentTrends.length === 0 ? (
            <div className="h-48 flex items-center justify-center text-sm text-slate-400">
              No payment transactions recorded for selected date range
            </div>
          ) : (
            <div className="space-y-3">
              <div className="h-48 flex items-end justify-between gap-2 pt-6 pb-2 border-b border-slate-100">
                {paymentTrends.map((point) => {
                  const heightPercent = Math.max(10, Math.round((point.amount / maxVolume) * 100));
                  return (
                    <div
                      key={point.date}
                      className="flex-1 flex flex-col items-center group relative h-full justify-end"
                    >
                      {/* Tooltip */}
                      <div className="absolute -top-12 bg-slate-900 text-white text-[11px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10 shadow-lg">
                        <div className="font-semibold">{point.date}</div>
                        <div>{formatCurrency(point.amount)} ({point.successful}/{point.total} tx)</div>
                      </div>
                      {/* Bar */}
                      <div
                        style={{ height: `${heightPercent}%` }}
                        className="w-full max-w-[36px] bg-blue-600 group-hover:bg-blue-500 rounded-t transition-all"
                      />
                    </div>
                  );
                })}
              </div>
              {/* Dates X-Axis */}
              <div className="flex justify-between text-[11px] text-slate-400">
                {paymentTrends.map((point, idx) => (
                  <span
                    key={point.date}
                    className={idx % 2 === 0 ? 'block' : 'hidden sm:block'}
                  >
                    {point.date.slice(5)}
                  </span>
                ))}
              </div>
            </div>
          )}
        </Card>

        {/* Status Distribution */}
        <Card>
          <div className="mb-4">
            <h2 className="text-base font-semibold text-slate-900">Payment Status Distribution</h2>
            <p className="text-xs text-slate-500">Breakdown by lifecycle status</p>
          </div>

          {statusDistributions.length === 0 ? (
            <div className="h-48 flex items-center justify-center text-sm text-slate-400">
              No transactions recorded
            </div>
          ) : (
            <div className="space-y-3.5">
              {statusDistributions.map((dist) => (
                <div key={dist.status} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-700">{dist.status}</span>
                    <span className="text-slate-500">
                      {dist.count} ({dist.percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        dist.status === 'SUCCESS'
                          ? 'bg-emerald-500'
                          : dist.status === 'FAILED'
                          ? 'bg-red-500'
                          : dist.status === 'PROCESSING' || dist.status === 'CREATED'
                          ? 'bg-blue-500'
                          : 'bg-amber-500'
                      }`}
                      style={{ width: `${dist.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Two Column Layout: Recent Discrepancies & Recent Audit Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Unresolved Discrepancies Widget */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              <h2 className="text-base font-semibold text-slate-900">Discrepancies Requiring Review</h2>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/admin/reconciliation')}
            >
              View All <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>

          {recentDiscrepancies.length === 0 ? (
            <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
              <Scale className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
              <p className="text-sm font-medium text-slate-700">All Accounts Reconciled</p>
              <p className="text-xs text-slate-400 mt-1">Zero unresolved discrepancy records found</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {recentDiscrepancies.map((record) => (
                <div key={record.id} className="py-3 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-mono font-bold text-slate-900">
                        {record.internalReference || record.providerReference}
                      </span>
                      <Badge variant={getStatusBadgeVariant(record.discrepancyType)}>
                        {record.discrepancyType}
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-500">
                      Internal: {record.internalAmount ? formatCurrency(record.internalAmount, record.currency) : 'None'} | Provider: {record.providerAmount ? formatCurrency(record.providerAmount, record.currency) : 'None'}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/admin/reconciliation/${record.runReference}`)}
                  >
                    Inspect
                  </Button>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Recent Audit Logs Widget */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <ScrollText className="w-5 h-5 text-blue-600" />
              <h2 className="text-base font-semibold text-slate-900">Recent Immutable Audit Trail</h2>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/admin/audit-logs')}
            >
              View All <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>

          {recentAudits.length === 0 ? (
            <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
              <p className="text-sm text-slate-400">No recent audit log entries</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {recentAudits.slice(0, 5).map((log) => (
                <div key={log.id} className="py-3 flex items-start justify-between">
                  <div className="space-y-0.5">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-semibold text-slate-800">{log.action}</span>
                      <span className="text-[10px] text-slate-400 font-mono bg-slate-100 px-1.5 py-0.5 rounded">
                        {log.resourceType}:{log.resourceId}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 truncate max-w-xs sm:max-w-md">
                      {log.description || 'System event recorded'}
                    </p>
                  </div>
                  <div className="text-right text-[11px] text-slate-400 whitespace-nowrap ml-2">
                    <div>{log.actorId}</div>
                    <div className="text-[10px]">{new Date(log.createdAt).toLocaleTimeString()}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Trigger Reconciliation Run Modal */}
      {isRunModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Scale className="w-5 h-5 text-blue-600" />
                <h3 className="font-semibold text-slate-900">Trigger Reconciliation Run</h3>
              </div>
              <button
                onClick={() => setIsRunModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {runModalError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700">
                  {runModalError}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  Reconciliation Scope
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['FULL', 'PAYMENTS', 'REFUNDS'] as const).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setRunType(type)}
                      className={`py-2 px-3 text-xs font-semibold rounded-lg border text-center transition-all ${
                        runType === type
                          ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-sm'
                          : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 space-y-1">
                <div className="font-semibold flex items-center">
                  <AlertTriangle className="w-3.5 h-3.5 mr-1" />
                  Independent Provider Comparison
                </div>
                <p>
                  Compares internal database transactions against the simulated provider settlement ledger.
                  Existing payments and refunds are never silently altered.
                </p>
              </div>
            </div>

            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end space-x-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsRunModalOpen(false)}
                disabled={isTriggeringRun}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleTriggerRun}
                isLoading={isTriggeringRun}
              >
                Start Reconciliation
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
