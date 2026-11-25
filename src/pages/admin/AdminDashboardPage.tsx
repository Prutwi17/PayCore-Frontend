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
import { ApiError } from '@/types/api';
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
  Shield,
  Play,
  X,
} from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  const navigate = useNavigate();

  const [dateRange, setDateRange] = useState<'24h' | '7d' | '30d' | 'all'>('7d');
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [summary, setSummary] = useState<AdminDashboardSummary | null>(null);
  const [paymentTrends, setPaymentTrends] = useState<PaymentTrendPoint[]>([]);
  const [statusDistributions, setStatusDistributions] = useState<StatusDistribution[]>([]);
  const [recSummary, setRecSummary] = useState<ReconciliationSummary | null>(null);
  const [recentAudits, setRecentAudits] = useState<AuditLog[]>([]);
  const [recentDiscrepancies, setRecentDiscrepancies] = useState<ReconciliationRecord[]>([]);

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
      const apiErr = err as ApiError;
      const msg = apiErr?.message || (err instanceof Error ? err.message : 'Failed to load dashboard metrics');
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
      const apiErr = err as ApiError;
      const msg = apiErr?.message || (err instanceof Error ? err.message : 'Failed to start reconciliation');
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
    return <PageLoading message="Loading dashboard..." />;
  }

  const maxVolume = Math.max(...paymentTrends.map((t) => t.amount || 0), 100);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-1">
        <div>
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-200/60 dark:border-blue-800/60">
              <LayoutDashboard className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Admin Dashboard</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Payments, refunds, reconciliation, and recent activity
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="inline-flex rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-1 text-xs font-medium shadow-2xs">
            {(['24h', '7d', '30d', 'all'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setDateRange(range)}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  dateRange === range
                    ? 'bg-blue-600 text-white font-semibold'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                {range === '24h' ? '24h' : range === '7d' ? '7d' : range === '30d' ? '30d' : 'All'}
              </button>
            ))}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            isLoading={isRefreshing}
          >
            <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
            Refresh
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsRunModalOpen(true)}
          >
            <Play className="w-3.5 h-3.5 mr-1.5" />
            Run Reconciliation
          </Button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-2xl text-sm text-red-700 dark:text-red-300 flex items-center justify-between">
          <span>{error}</span>
          <Button variant="ghost" size="sm" onClick={fetchDashboardData}>
            Retry
          </Button>
        </div>
      )}

      {/* Row 1: 4 Uniform KPI Boxes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <Card className="p-5 flex flex-col justify-between border-t-4 border-t-blue-600">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Payment Volume
            </span>
            <div className="w-9 h-9 bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
              {formatCurrency(summary?.totalPaymentVolume)}
            </div>
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mt-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <span>{summary?.totalPayments || 0} Payments</span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                {summary?.paymentSuccessRate || 0}% Success
              </span>
            </div>
          </div>
        </Card>

        <Card className="p-5 flex flex-col justify-between border-t-4 border-t-purple-600">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Refunds
            </span>
            <div className="w-9 h-9 bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400 rounded-xl flex items-center justify-center">
              <RotateCcw className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
              {formatCurrency(summary?.successfulRefundVolume)}
            </div>
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mt-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <span>{summary?.successfulRefunds || 0} Completed</span>
              <span className="font-semibold text-amber-600 dark:text-amber-400">
                {summary?.pendingRefunds || 0} Pending
              </span>
            </div>
          </div>
        </Card>

        <Card className="p-5 flex flex-col justify-between border-t-4 border-t-emerald-600">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Reconciliation
            </span>
            <div className="w-9 h-9 bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 rounded-xl flex items-center justify-center">
              <Scale className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <Badge variant={getStatusBadgeVariant(summary?.latestReconciliationStatus || 'NEVER_RUN')}>
                {summary?.latestReconciliationStatus || 'NEVER_RUN'}
              </Badge>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mt-3 pt-2 border-t border-slate-100 dark:border-slate-800">
              <span>{recSummary?.totalRuns || 0} Runs</span>
              <span className={`font-bold ${summary?.unresolvedDiscrepanciesCount ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                {summary?.unresolvedDiscrepanciesCount || 0} Unresolved
              </span>
            </div>
          </div>
        </Card>

        <Card className="p-5 flex flex-col justify-between border-t-4 border-t-amber-500">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Webhooks
            </span>
            <div className="w-9 h-9 bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 rounded-xl flex items-center justify-center">
              <Shield className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
              {summary?.webhookDeliveryFailures || 0}
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400 ml-1.5">Failures</span>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mt-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <span>Retries</span>
              <span className="font-semibold text-blue-600 dark:text-blue-400">
                {summary?.pendingWebhookRetries || 0} Active
              </span>
            </div>
          </div>
        </Card>
      </div>

      {/* Row 2: 12-Column Grid (Payment Trends + Status Distribution) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <Card className="lg:col-span-8 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Payment Volume Trend</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Daily payment totals</p>
            </div>
            <div className="flex items-center space-x-2 text-xs">
              <span className="inline-block w-2.5 h-2.5 bg-blue-600 rounded-sm"></span>
              <span className="text-slate-600 dark:text-slate-300">Volume ($)</span>
            </div>
          </div>

          {paymentTrends.length === 0 ? (
            <div className="h-52 flex items-center justify-center text-sm text-slate-400 dark:text-slate-500 bg-slate-50/70 dark:bg-slate-800/40 rounded-xl border border-dashed border-slate-200 dark:border-slate-700">
              No payment transactions for this date range
            </div>
          ) : (
            <div className="space-y-3">
              <div className="h-52 flex items-end justify-between gap-2 pt-6 pb-2 border-b border-slate-100 dark:border-slate-800">
                {paymentTrends.map((point) => {
                  const heightPercent = Math.max(10, Math.round((point.amount / maxVolume) * 100));
                  return (
                    <div
                      key={point.date}
                      className="flex-1 flex flex-col items-center group relative h-full justify-end"
                    >
                      <div className="absolute -top-12 bg-slate-900 text-white text-[11px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10 shadow-lg">
                        <div className="font-semibold">{point.date}</div>
                        <div>{formatCurrency(point.amount)} ({point.successful}/{point.total})</div>
                      </div>
                      <div
                        style={{ height: `${heightPercent}%` }}
                        className="w-full max-w-[36px] bg-blue-600 group-hover:bg-blue-500 rounded-t transition-all"
                      />
                    </div>
                  );
                })}
              </div>
              <div className="flex justify-between text-[11px] text-slate-400 dark:text-slate-500">
                {paymentTrends.map((point, idx) => (
                  <span key={point.date} className={idx % 2 === 0 ? 'block' : 'hidden sm:block'}>
                    {point.date.slice(5)}
                  </span>
                ))}
              </div>
            </div>
          )}
        </Card>

        <Card className="lg:col-span-4 flex flex-col">
          <div className="mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Payment Status</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Breakdown by status</p>
          </div>

          {statusDistributions.length === 0 ? (
            <div className="flex-1 min-h-[208px] flex items-center justify-center text-sm text-slate-400 dark:text-slate-500 bg-slate-50/70 dark:bg-slate-800/40 rounded-xl border border-dashed border-slate-200 dark:border-slate-700">
              No transactions recorded
            </div>
          ) : (
            <div className="space-y-4">
              {statusDistributions.map((dist) => (
                <div key={dist.status} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700 dark:text-slate-200">{dist.status}</span>
                    <span className="text-slate-500 dark:text-slate-400">
                      {dist.count} ({dist.percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
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

      {/* Row 3: 12-Column Grid (Discrepancies + Recent Activity) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <Card className="lg:col-span-6 flex flex-col">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Discrepancies</h2>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/admin/reconciliation')}
            >
              View All <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </div>

          {recentDiscrepancies.length === 0 ? (
            <div className="flex-1 p-8 text-center bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-dashed border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center">
              <Scale className="w-7 h-7 text-emerald-500 mb-2" />
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">No Open Discrepancies</p>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">All checked records match</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {recentDiscrepancies.map((record) => (
                <div key={record.id} className="py-3 flex items-center justify-between gap-3">
                  <div className="space-y-0.5 min-w-0">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-mono font-bold text-slate-900 dark:text-white truncate">
                        {record.internalReference || record.providerReference}
                      </span>
                      <Badge variant={getStatusBadgeVariant(record.discrepancyType)}>
                        {record.discrepancyType}
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
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

        <Card className="lg:col-span-6 flex flex-col">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center space-x-2">
              <ScrollText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Recent Audit Logs</h2>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/admin/audit-logs')}
            >
              View All <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </div>

          {recentAudits.length === 0 ? (
            <div className="flex-1 p-8 text-center bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-dashed border-slate-200 dark:border-slate-700 flex items-center justify-center">
              <p className="text-sm text-slate-400 dark:text-slate-500">No recent audit logs</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {recentAudits.slice(0, 5).map((log) => (
                <div key={log.id} className="py-3 flex items-start justify-between gap-3">
                  <div className="space-y-0.5 min-w-0">
                    <div className="flex items-center space-x-2 flex-wrap">
                      <span className="text-xs font-semibold text-slate-800 dark:text-slate-100">{log.action}</span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                        {log.resourceType}:{log.resourceId}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-xs sm:max-w-md">
                      {log.description || 'Event recorded'}
                    </p>
                  </div>
                  <div className="text-right text-[11px] text-slate-400 dark:text-slate-500 whitespace-nowrap">
                    <div>{log.actorRole === 'ROLE_ADMIN' ? 'Admin' : log.actorId}</div>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Scale className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h3 className="font-semibold text-slate-900 dark:text-white">Run Reconciliation</h3>
              </div>
              <button
                onClick={() => setIsRunModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {runModalError && (
                <div className="p-3 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 rounded-lg text-xs text-red-700 dark:text-red-300">
                  {runModalError}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                  Scope
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['FULL', 'PAYMENTS', 'REFUNDS'] as const).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setRunType(type)}
                      className={`py-2 px-3 text-xs font-semibold rounded-lg border text-center transition-all ${
                        runType === type
                          ? 'border-blue-600 bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 shadow-sm'
                          : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:border-slate-300'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-xl text-xs text-amber-800 dark:text-amber-300 space-y-1">
                <div className="font-semibold flex items-center">
                  <AlertTriangle className="w-3.5 h-3.5 mr-1" />
                  Ledger Check
                </div>
                <p>
                  Compares internal transactions with settlement records for the selected date range.
                </p>
              </div>
            </div>

            <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex justify-end space-x-3">
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
                Start
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
