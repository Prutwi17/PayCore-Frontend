import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { reconciliationService } from '@/services/api/reconciliationService';
import {
  ReconciliationRun,
  ReconciliationRecord,
  RecordStatus,
} from '@/types/reconciliation';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { PageLoading } from '@/components/common/PageLoading';
import {
  Scale,
  ArrowLeft,
  RefreshCw,
  CheckCircle2,
  X,
  FileCheck2,
  Eye,
} from 'lucide-react';

export const AdminReconciliationDetailPage: React.FC = () => {
  const { reference } = useParams<{ reference: string }>();
  const navigate = useNavigate();

  const [run, setRun] = useState<ReconciliationRun | null>(null);
  const [records, setRecords] = useState<ReconciliationRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'DISCREPANCIES' | 'MATCHED' | 'REVIEW_REQUIRED'>('ALL');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  // Side-by-side drawer
  const [inspectRecord, setInspectRecord] = useState<ReconciliationRecord | null>(null);

  // Resolve Discrepancy Modal
  const [selectedRecord, setSelectedRecord] = useState<ReconciliationRecord | null>(null);
  const [resolutionReason, setResolutionReason] = useState('FEE_ADJUSTMENT');
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [isResolving, setIsResolving] = useState(false);
  const [resolveError, setResolveError] = useState<string | null>(null);

  const fetchRunDetails = useCallback(async () => {
    if (!reference) return;
    setIsLoading(true);
    setError(null);
    try {
      const runData = await reconciliationService.getRunByReference(reference);
      setRun(runData);

      let statusFilter: RecordStatus | undefined = undefined;

      if (activeFilter === 'MATCHED') {
        statusFilter = 'MATCHED';
      } else if (activeFilter === 'REVIEW_REQUIRED') {
        statusFilter = 'REVIEW_REQUIRED';
      }

      const recordsData = await reconciliationService.getRunRecords(reference, {
        status: statusFilter,
        page,
        size: 15,
      });

      // Filter locally if activeFilter is DISCREPANCIES (excludes MATCHED)
      if (activeFilter === 'DISCREPANCIES') {
        setRecords(recordsData.content.filter((r) => r.discrepancyType !== 'MATCHED'));
      } else {
        setRecords(recordsData.content);
      }

      setTotalPages(recordsData.totalPages);
      setTotalElements(recordsData.totalElements);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to load reconciliation run details';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }, [reference, activeFilter, page]);

  useEffect(() => {
    fetchRunDetails();
  }, [fetchRunDetails]);

  const handleResolve = async (e: React.FormEvent) => {
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
      fetchRunDetails();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to resolve discrepancy';
      setResolveError(msg);
    } finally {
      setIsResolving(false);
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

  if (isLoading && !run) {
    return <PageLoading message="Loading reconciliation run breakdown..." />;
  }

  return (
    <div className="space-y-6">
      {/* Back button and Header */}
      <div>
        <button
          onClick={() => navigate('/admin/reconciliation')}
          className="inline-flex items-center text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors mb-2"
        >
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Reconciliation Center
        </button>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
              <Scale className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight font-mono">
                  {run?.runReference}
                </h1>
                {run && (
                  <Badge variant={getStatusBadgeVariant(run.status)}>
                    {run.status}
                  </Badge>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Scope: {run?.runType} | Initiated by {run?.initiatedBy || 'system'} on {run && new Date(run.createdAt).toLocaleString()}
              </p>
            </div>
          </div>

          <Button variant="outline" size="sm" onClick={fetchRunDetails}>
            <RefreshCw className="w-4 h-4 mr-1.5" />
            Refresh
          </Button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
          {error}
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="p-4">
          <span className="text-xs font-semibold text-slate-500 uppercase">Total Records</span>
          <div className="text-2xl font-bold text-slate-900 mt-1">{run?.totalRecords || 0}</div>
        </Card>
        <Card className="p-4 border-l-4 border-l-emerald-500">
          <span className="text-xs font-semibold text-slate-500 uppercase">Matched Records</span>
          <div className="text-2xl font-bold text-emerald-600 mt-1">{run?.matchedRecords || 0}</div>
        </Card>
        <Card className="p-4 border-l-4 border-l-amber-500">
          <span className="text-xs font-semibold text-slate-500 uppercase">Discrepancy Records</span>
          <div className="text-2xl font-bold text-amber-600 mt-1">{run?.discrepancyRecords || 0}</div>
        </Card>
        <Card className="p-4 border-l-4 border-l-red-500">
          <span className="text-xs font-semibold text-slate-500 uppercase">Failed Records</span>
          <div className="text-2xl font-bold text-red-600 mt-1">{run?.failedRecords || 0}</div>
        </Card>
      </div>

      {/* Records Table Card */}
      <Card className="p-0 overflow-hidden">
        {/* Filter Navigation */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex space-x-2">
            {(['ALL', 'DISCREPANCIES', 'MATCHED', 'REVIEW_REQUIRED'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setActiveFilter(tab);
                  setPage(0);
                }}
                className={`py-1.5 px-3 rounded-lg text-xs font-semibold transition-colors ${
                  activeFilter === tab
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {tab.replace('_', ' ')}
              </button>
            ))}
          </div>

          <div className="text-xs text-slate-500">
            Showing {records.length} of {totalElements} records
          </div>
        </div>

        {records.length === 0 ? (
          <div className="p-12 text-center text-sm text-slate-500">
            No records found matching current filter.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/75 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Entity</th>
                  <th className="py-3 px-4">Internal Reference</th>
                  <th className="py-3 px-4">Provider Reference</th>
                  <th className="py-3 px-4">Internal (DB)</th>
                  <th className="py-3 px-4">Provider (Ledger)</th>
                  <th className="py-3 px-4">Discrepancy Type</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                {records.map((rec) => (
                  <tr
                    key={rec.id}
                    className="hover:bg-slate-50/60 transition-colors"
                  >
                    <td className="py-3 px-4 font-semibold text-slate-600">
                      {rec.recordType}
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-slate-800">
                      {rec.internalReference || <span className="text-slate-400 italic">Missing</span>}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-600">
                      {rec.providerReference || <span className="text-slate-400 italic">Missing</span>}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-medium text-slate-900">
                        {formatCurrency(rec.internalAmount, rec.currency)}
                      </div>
                      <span className="text-[10px] text-slate-400">
                        {rec.internalStatus || 'None'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-medium text-slate-900">
                        {formatCurrency(rec.providerAmount, rec.currency)}
                      </div>
                      <span className="text-[10px] text-slate-400">
                        {rec.providerStatus || 'None'}
                      </span>
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
                      <div className="inline-flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setInspectRecord(rec)}
                          title="Side-by-side inspect"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </Button>

                        {rec.status !== 'RESOLVED' && rec.discrepancyType !== 'MATCHED' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedRecord(rec)}
                          >
                            Resolve
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
            <span>Page {page + 1} of {totalPages}</span>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page === 0}
                onClick={() => setPage((p) => p - 1)}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= totalPages - 1}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Side-by-side Comparison Drawer / Modal */}
      {inspectRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Scale className="w-5 h-5 text-blue-600" />
                <h3 className="font-semibold text-slate-900">Side-by-Side Transaction Comparison</h3>
              </div>
              <button onClick={() => setInspectRecord(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Verdict Banner */}
              <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-semibold text-slate-600">Reconciliation Verdict:</span>
                  <Badge variant={getStatusBadgeVariant(inspectRecord.discrepancyType)}>
                    {inspectRecord.discrepancyType}
                  </Badge>
                </div>
                <Badge variant={getStatusBadgeVariant(inspectRecord.status)}>
                  {inspectRecord.status}
                </Badge>
              </div>

              {/* Side by side columns */}
              <div className="grid grid-cols-2 gap-4">
                {/* Internal PayCore Database Record */}
                <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <span className="text-xs font-bold text-slate-900">Internal PayCore Record</span>
                    <span className="text-[10px] font-mono text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                      MySQL DB
                    </span>
                  </div>
                  <div className="text-xs space-y-2">
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-semibold">Reference</span>
                      <span className="font-mono font-medium text-slate-800">
                        {inspectRecord.internalReference || '—'}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-semibold">Amount & Currency</span>
                      <span className="font-semibold text-slate-900">
                        {formatCurrency(inspectRecord.internalAmount, inspectRecord.currency)} {inspectRecord.currency}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-semibold">Status</span>
                      <span className="font-medium text-slate-800">
                        {inspectRecord.internalStatus || '—'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Independent Provider Statement Record */}
                <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <span className="text-xs font-bold text-slate-900">Provider Statement Record</span>
                    <span className="text-[10px] font-mono text-purple-600 bg-purple-50 px-2 py-0.5 rounded">
                      External Ledger
                    </span>
                  </div>
                  <div className="text-xs space-y-2">
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-semibold">Provider Transaction ID</span>
                      <span className="font-mono font-medium text-slate-800">
                        {inspectRecord.providerReference || '—'}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-semibold">Amount & Currency</span>
                      <span className="font-semibold text-slate-900">
                        {formatCurrency(inspectRecord.providerAmount, inspectRecord.currency)} {inspectRecord.currency}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-semibold">Status</span>
                      <span className="font-medium text-slate-800">
                        {inspectRecord.providerStatus || '—'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Resolution Info if already resolved */}
              {inspectRecord.status === 'RESOLVED' && (
                <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-xs space-y-1">
                  <div className="font-semibold text-emerald-800 flex items-center">
                    <CheckCircle2 className="w-4 h-4 mr-1.5" />
                    Manually Resolved by {inspectRecord.resolvedBy} on {inspectRecord.resolvedAt && new Date(inspectRecord.resolvedAt).toLocaleString()}
                  </div>
                  <p className="text-emerald-700">{inspectRecord.resolutionNotes}</p>
                </div>
              )}
            </div>

            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
              <div>
                {inspectRecord.status !== 'RESOLVED' && inspectRecord.discrepancyType !== 'MATCHED' && (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => {
                      setSelectedRecord(inspectRecord);
                      setInspectRecord(null);
                    }}
                  >
                    Resolve Discrepancy
                  </Button>
                )}
              </div>
              <Button variant="outline" size="sm" onClick={() => setInspectRecord(null)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Discrepancy Resolution Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <form
            onSubmit={handleResolve}
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

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-500">Record:</span>
                  <span className="font-mono font-bold text-slate-800">
                    {selectedRecord.internalReference || selectedRecord.providerReference}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Discrepancy:</span>
                  <Badge variant={getStatusBadgeVariant(selectedRecord.discrepancyType)}>
                    {selectedRecord.discrepancyType}
                  </Badge>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Resolution Reason
                </label>
                <select
                  value={resolutionReason}
                  onChange={(e) => setResolutionReason(e.target.value)}
                  className="w-full text-xs border border-slate-300 rounded-lg py-2 px-3 bg-white text-slate-800"
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
                  className="w-full text-xs border border-slate-300 rounded-lg p-3 bg-white text-slate-800"
                />
              </div>

              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-800">
                Resolution creates an immutable audit record and marks the discrepancy as RESOLVED.
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
