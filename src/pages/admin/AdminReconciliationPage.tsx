import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { reconciliationService } from '@/services/api/reconciliationService';
import {
  ReconciliationRun,
  ReconciliationRecord,
  RunType,
  RunStatus,
  DiscrepancyType,
  RecordType,
  RecordStatus,
} from '@/types/reconciliation';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import {
  Scale,
  RefreshCw,
  Play,
  AlertTriangle,
  CheckCircle2,
  Filter,
  ArrowRight,
  Check,
  X,
  FileCheck2,
} from 'lucide-react';

export const AdminReconciliationPage: React.FC = () => {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'runs' | 'discrepancies'>('runs');

  // Runs State
  const [runs, setRuns] = useState<ReconciliationRun[]>([]);
  const [runsStatusFilter, setRunsStatusFilter] = useState<RunStatus | ''>('');
  const [runsPage, setRunsPage] = useState(0);
  const [totalRunsPages, setTotalRunsPages] = useState(0);
  const [totalRuns, setTotalRuns] = useState(0);
  const [isLoadingRuns, setIsLoadingRuns] = useState(true);

  // Discrepancies State
  const [discrepancies, setDiscrepancies] = useState<ReconciliationRecord[]>([]);
  const [discStatusFilter, setDiscStatusFilter] = useState<RecordStatus | ''>('');
  const [discTypeFilter, setDiscTypeFilter] = useState<DiscrepancyType | ''>('');
  const [discRecordTypeFilter, setDiscRecordTypeFilter] = useState<RecordType | ''>('');
  const [discPage, setDiscPage] = useState(0);
  const [totalDiscPages, setTotalDiscPages] = useState(0);
  const [totalDiscrepancies, setTotalDiscrepancies] = useState(0);
  const [isLoadingDisc, setIsLoadingDisc] = useState(false);

  // Trigger Run Modal State
  const [isRunModalOpen, setIsRunModalOpen] = useState(false);
  const [runType, setRunType] = useState<RunType>('FULL');
  const [isTriggering, setIsTriggering] = useState(false);
  const [triggerError, setTriggerError] = useState<string | null>(null);

  // Resolve Discrepancy Modal State
  const [selectedRecord, setSelectedRecord] = useState<ReconciliationRecord | null>(null);
  const [resolutionReason, setResolutionReason] = useState('FEE_ADJUSTMENT');
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [isResolving, setIsResolving] = useState(false);
  const [resolveError, setResolveError] = useState<string | null>(null);

  const fetchRuns = useCallback(async () => {
    setIsLoadingRuns(true);
    try {
      const data = await reconciliationService.getRuns({
        status: runsStatusFilter || undefined,
        page: runsPage,
        size: 10,
      });
      setRuns(data.content);
      setTotalRunsPages(data.totalPages);
      setTotalRuns(data.totalElements);
    } catch (err) {
      console.error('Failed to load runs:', err);
    } finally {
      setIsLoadingRuns(false);
    }
  }, [runsStatusFilter, runsPage]);

  const fetchDiscrepancies = useCallback(async () => {
    setIsLoadingDisc(true);
    try {
      const data = await reconciliationService.getDiscrepancies({
        status: discStatusFilter || undefined,
        discrepancyType: discTypeFilter || undefined,
        recordType: discRecordTypeFilter || undefined,
        page: discPage,
        size: 10,
      });
      setDiscrepancies(data.content);
      setTotalDiscPages(data.totalPages);
      setTotalDiscrepancies(data.totalElements);
    } catch (err) {
      console.error('Failed to load discrepancies:', err);
    } finally {
      setIsLoadingDisc(false);
    }
  }, [discStatusFilter, discTypeFilter, discRecordTypeFilter, discPage]);

  useEffect(() => {
    if (activeTab === 'runs') {
      fetchRuns();
    } else {
      fetchDiscrepancies();
    }
  }, [activeTab, fetchRuns, fetchDiscrepancies]);

  const handleTriggerRun = async () => {
    setIsTriggering(true);
    setTriggerError(null);
    try {
      const run = await reconciliationService.triggerRun({ runType });
      setIsRunModalOpen(false);
      navigate(`/admin/reconciliation/${run.runReference}`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to trigger reconciliation';
      setTriggerError(msg);
    } finally {
      setIsTriggering(false);
    }
  };

  const handleResolveDiscrepancy = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRecord) return;
    setIsResolving(true);
    setResolveError(null);
    try {
      await reconciliationService.resolveDiscrepancy(selectedRecord.id, {
        reason: resolutionReason,
        notes: resolutionNotes,
      });
      setSelectedRecord(null);
      setResolutionNotes('');
      fetchDiscrepancies();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to resolve discrepancy';
      setResolveError(msg);
    } finally {
      setIsResolving(false);
    }
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
        return 'warning';
      default:
        return 'neutral';
    }
  };

  const formatCurrency = (amount: number | null | undefined, currency = 'USD') => {
    if (amount === null || amount === undefined) return '—';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Scale className="w-7 h-7 text-blue-600" />
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Reconciliation Center</h1>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Independent settlement verification, discrepancy discovery, and audited manual resolutions
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => (activeTab === 'runs' ? fetchRuns() : fetchDiscrepancies())}
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
            Trigger New Run
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('runs')}
            className={`py-3 px-1 border-b-2 text-sm font-semibold transition-colors flex items-center space-x-2 ${
              activeTab === 'runs'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            }`}
          >
            <span>Reconciliation Runs</span>
            <span className="text-xs bg-slate-100 text-slate-600 py-0.5 px-2 rounded-full font-mono">
              {totalRuns}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('discrepancies')}
            className={`py-3 px-1 border-b-2 text-sm font-semibold transition-colors flex items-center space-x-2 ${
              activeTab === 'discrepancies'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            }`}
          >
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <span>Active Discrepancies</span>
            <span className="text-xs bg-amber-50 text-amber-700 py-0.5 px-2 rounded-full font-mono font-bold">
              {totalDiscrepancies}
            </span>
          </button>
        </nav>
      </div>

      {/* TAB 1: Reconciliation Runs */}
      {activeTab === 'runs' && (
        <Card className="p-0 overflow-hidden">
          {/* Filter Bar */}
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-slate-400" />
              <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Status:</span>
              <select
                value={runsStatusFilter}
                onChange={(e) => {
                  setRunsStatusFilter(e.target.value as RunStatus);
                  setRunsPage(0);
                }}
                className="text-xs border border-slate-300 rounded-md py-1.5 px-2 bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="">All Statuses</option>
                <option value="RUNNING">RUNNING</option>
                <option value="COMPLETED">COMPLETED</option>
                <option value="COMPLETED_WITH_ERRORS">COMPLETED WITH ERRORS</option>
                <option value="FAILED">FAILED</option>
              </select>
            </div>
            <div className="text-xs text-slate-500">
              Showing {runs.length} of {totalRuns} runs
            </div>
          </div>

          {isLoadingRuns ? (
            <div className="p-12 text-center text-sm text-slate-500">
              Loading reconciliation history...
            </div>
          ) : runs.length === 0 ? (
            <div className="p-12 text-center">
              <Scale className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <p className="text-base font-semibold text-slate-800">No Reconciliation Runs Found</p>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Trigger a new run to compare internal transaction ledgers with provider settlement statements.
              </p>
              <Button
                variant="primary"
                size="sm"
                className="mt-4"
                onClick={() => setIsRunModalOpen(true)}
              >
                <Play className="w-4 h-4 mr-1.5" /> Start First Run
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/75 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                    <th className="py-3 px-4">Run Reference</th>
                    <th className="py-3 px-4">Type</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-center">Total</th>
                    <th className="py-3 px-4 text-center text-emerald-700">Matched</th>
                    <th className="py-3 px-4 text-center text-amber-700">Discrepancies</th>
                    <th className="py-3 px-4">Initiated By</th>
                    <th className="py-3 px-4">Started At</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                  {runs.map((run) => (
                    <tr
                      key={run.id}
                      className="hover:bg-slate-50/60 transition-colors cursor-pointer"
                      onClick={() => navigate(`/admin/reconciliation/${run.runReference}`)}
                    >
                      <td className="py-3 px-4 font-mono font-bold text-blue-600">
                        {run.runReference}
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-medium">{run.runType}</span>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant={getStatusBadgeVariant(run.status)}>
                          {run.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-center font-bold">
                        {run.totalRecords}
                      </td>
                      <td className="py-3 px-4 text-center font-bold text-emerald-600">
                        {run.matchedRecords}
                      </td>
                      <td className="py-3 px-4 text-center font-bold">
                        <span className={run.discrepancyRecords > 0 ? 'text-amber-600' : 'text-slate-400'}>
                          {run.discrepancyRecords}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-500">
                        {run.initiatedBy || 'system'}
                      </td>
                      <td className="py-3 px-4 text-slate-500 whitespace-nowrap">
                        {new Date(run.createdAt).toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/admin/reconciliation/${run.runReference}`);
                          }}
                        >
                          View Details <ArrowRight className="w-3.5 h-3.5 ml-1" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {totalRunsPages > 1 && (
            <div className="p-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
              <span>Page {runsPage + 1} of {totalRunsPages}</span>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={runsPage === 0}
                  onClick={() => setRunsPage((p) => p - 1)}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={runsPage >= totalRunsPages - 1}
                  onClick={() => setRunsPage((p) => p + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </Card>
      )}

      {/* TAB 2: Global Active Discrepancies */}
      {activeTab === 'discrepancies' && (
        <Card className="p-0 overflow-hidden">
          {/* Discrepancies Filter Bar */}
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Type:</span>
                <select
                  value={discTypeFilter}
                  onChange={(e) => {
                    setDiscTypeFilter(e.target.value as DiscrepancyType);
                    setDiscPage(0);
                  }}
                  className="text-xs border border-slate-300 rounded-md py-1.5 px-2 bg-white text-slate-700"
                >
                  <option value="">All Discrepancy Types</option>
                  <option value="MISSING_PROVIDER">MISSING_PROVIDER</option>
                  <option value="MISSING_INTERNAL">MISSING_INTERNAL</option>
                  <option value="AMOUNT_MISMATCH">AMOUNT_MISMATCH</option>
                  <option value="CURRENCY_MISMATCH">CURRENCY_MISMATCH</option>
                  <option value="STATUS_MISMATCH">STATUS_MISMATCH</option>
                  <option value="DUPLICATE_PROVIDER_RECORD">DUPLICATE_PROVIDER_RECORD</option>
                  <option value="UNKNOWN_OUTCOME">UNKNOWN_OUTCOME</option>
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Status:</span>
                <select
                  value={discStatusFilter}
                  onChange={(e) => {
                    setDiscStatusFilter(e.target.value as RecordStatus);
                    setDiscPage(0);
                  }}
                  className="text-xs border border-slate-300 rounded-md py-1.5 px-2 bg-white text-slate-700"
                >
                  <option value="">All Statuses</option>
                  <option value="REVIEW_REQUIRED">REVIEW_REQUIRED</option>
                  <option value="UNMATCHED">UNMATCHED</option>
                  <option value="RESOLVED">RESOLVED</option>
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Entity:</span>
                <select
                  value={discRecordTypeFilter}
                  onChange={(e) => {
                    setDiscRecordTypeFilter(e.target.value as RecordType);
                    setDiscPage(0);
                  }}
                  className="text-xs border border-slate-300 rounded-md py-1.5 px-2 bg-white text-slate-700"
                >
                  <option value="">All Entities</option>
                  <option value="PAYMENT">PAYMENT</option>
                  <option value="REFUND">REFUND</option>
                </select>
              </div>
            </div>

            <div className="text-xs text-slate-500">
              Showing {discrepancies.length} of {totalDiscrepancies} records
            </div>
          </div>

          {isLoadingDisc ? (
            <div className="p-12 text-center text-sm text-slate-500">
              Loading discrepancies...
            </div>
          ) : discrepancies.length === 0 ? (
            <div className="p-12 text-center">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-3" />
              <p className="text-base font-semibold text-slate-800">No Discrepancies Found</p>
              <p className="text-xs text-slate-500 mt-1">
                All records match or have been successfully resolved by administrators.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/75 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                    <th className="py-3 px-4">Entity</th>
                    <th className="py-3 px-4">Internal Ref</th>
                    <th className="py-3 px-4">Provider Ref</th>
                    <th className="py-3 px-4">Internal Amount</th>
                    <th className="py-3 px-4">Provider Amount</th>
                    <th className="py-3 px-4">Discrepancy</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                  {discrepancies.map((rec) => (
                    <tr key={rec.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3 px-4 font-semibold text-slate-600">
                        {rec.recordType}
                      </td>
                      <td className="py-3 px-4 font-mono">
                        {rec.internalReference || <span className="text-slate-400 italic">None</span>}
                      </td>
                      <td className="py-3 px-4 font-mono">
                        {rec.providerReference || <span className="text-slate-400 italic">None</span>}
                      </td>
                      <td className="py-3 px-4 font-medium">
                        {formatCurrency(rec.internalAmount, rec.currency)}
                        {rec.internalStatus && (
                          <span className="block text-[10px] text-slate-400">{rec.internalStatus}</span>
                        )}
                      </td>
                      <td className="py-3 px-4 font-medium">
                        {formatCurrency(rec.providerAmount, rec.currency)}
                        {rec.providerStatus && (
                          <span className="block text-[10px] text-slate-400">{rec.providerStatus}</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant={getStatusBadgeVariant(rec.discrepancyType)}>
                          {rec.discrepancyType}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant={getStatusBadgeVariant(rec.status)}>
                          {rec.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-right">
                        {rec.status !== 'RESOLVED' ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedRecord(rec)}
                          >
                            Resolve Discrepancy
                          </Button>
                        ) : (
                          <span className="text-xs text-emerald-600 font-semibold flex items-center justify-end">
                            <Check className="w-3.5 h-3.5 mr-1" /> Resolved
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {totalDiscPages > 1 && (
            <div className="p-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
              <span>Page {discPage + 1} of {totalDiscPages}</span>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={discPage === 0}
                  onClick={() => setDiscPage((p) => p - 1)}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={discPage >= totalDiscPages - 1}
                  onClick={() => setDiscPage((p) => p + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </Card>
      )}

      {/* Trigger Run Modal */}
      {isRunModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Scale className="w-5 h-5 text-blue-600" />
                <h3 className="font-semibold text-slate-900">Trigger Reconciliation Run</h3>
              </div>
              <button onClick={() => setIsRunModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {triggerError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700">
                  {triggerError}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  Scope
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['FULL', 'PAYMENTS', 'REFUNDS'] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setRunType(t)}
                      className={`py-2 px-3 text-xs font-semibold rounded-lg border text-center transition-all ${
                        runType === t
                          ? 'border-blue-600 bg-blue-50 text-blue-700'
                          : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600">
                Reconciliation adheres to the Zero-DB Network I/O Principle. Provider transactions are fetched independently before matching against PayCore records.
              </div>
            </div>

            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end space-x-3">
              <Button variant="outline" size="sm" onClick={() => setIsRunModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={handleTriggerRun} isLoading={isTriggering}>
                Run Now
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Resolve Discrepancy Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <form
            onSubmit={handleResolveDiscrepancy}
            className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150"
          >
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <FileCheck2 className="w-5 h-5 text-emerald-600" />
                <h3 className="font-semibold text-slate-900">Resolve Discrepancy</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedRecord(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {resolveError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700">
                  {resolveError}
                </div>
              )}

              {/* Record Summary */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-500">Record:</span>
                  <span className="font-mono font-bold text-slate-800">
                    {selectedRecord.internalReference || selectedRecord.providerReference}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Discrepancy Type:</span>
                  <Badge variant={getStatusBadgeVariant(selectedRecord.discrepancyType)}>
                    {selectedRecord.discrepancyType}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Internal vs Provider:</span>
                  <span className="font-medium text-slate-700">
                    {formatCurrency(selectedRecord.internalAmount, selectedRecord.currency)} vs{' '}
                    {formatCurrency(selectedRecord.providerAmount, selectedRecord.currency)}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Resolution Reason
                </label>
                <select
                  value={resolutionReason}
                  onChange={(e) => setResolutionReason(e.target.value)}
                  className="w-full text-xs border border-slate-300 rounded-lg py-2 px-3 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="FEE_ADJUSTMENT">Fee Adjustment / Gateway Surcharge</option>
                  <option value="REFUND_TIMING_DELAY">Settlement Timing Delay</option>
                  <option value="DUPLICATE_SETTLED">Duplicate Settlement Voided</option>
                  <option value="MANUAL_CORRECTION">Manual Statement Adjustment</option>
                  <option value="PROVIDER_UNAVAILABLE">Provider Outage Confirmed</option>
                  <option value="OTHER">Other Administrator Justification</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Resolution Notes & Audit Justification
                </label>
                <textarea
                  required
                  rows={3}
                  value={resolutionNotes}
                  onChange={(e) => setResolutionNotes(e.target.value)}
                  placeholder="Provide detailed justification explaining why this discrepancy is resolved..."
                  className="w-full text-xs border border-slate-300 rounded-lg p-3 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-800">
                Resolution creates an immutable audit record and marks the discrepancy as RESOLVED. Historical payment tables are preserved without mutation.
              </div>
            </div>

            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end space-x-3">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setSelectedRecord(null)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="sm"
                isLoading={isResolving}
              >
                Confirm Resolution
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
