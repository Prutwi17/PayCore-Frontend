import React, { useState, useEffect, useCallback } from 'react';
import { refundService } from '@/services/api/refundService';
import { RefundItem, RefundStatus } from '@/types/refund';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { PageLoading } from '@/components/common/PageLoading';
import {
  RotateCcw,
  Search,
  RefreshCw,
  Eye,
  Check,
  Copy,
  AlertTriangle,
  XCircle,
  HelpCircle,
  ShieldCheck,
  Zap,
  TrendingDown,
  Clock,
  Layers,
} from 'lucide-react';
import { ApiError } from '@/types/api';

export const MerchantRefundsPage: React.FC = () => {
  const [refunds, setRefunds] = useState<RefundItem[]>([]);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [statusFilter, setStatusFilter] = useState<RefundStatus | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Details Modal State
  const [selectedRefund, setSelectedRefund] = useState<RefundItem | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const fetchRefunds = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const data = await refundService.listMerchantRefunds({
        status: statusFilter,
        search: searchQuery.trim() || undefined,
        page: currentPage,
        size: 10,
        sortBy: 'createdAt',
        sortDirection: 'desc',
      });
      setRefunds(data.content);
      setTotalElements(data.totalElements);
      setTotalPages(data.totalPages);
    } catch (err: unknown) {
      const error = err as ApiError;
      setErrorMessage(error.message || 'Failed to load merchant refunds.');
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, statusFilter, searchQuery]);

  useEffect(() => {
    fetchRefunds();
  }, [fetchRefunds]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(text);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleVerifyStatus = async (refundReference: string) => {
    setIsVerifying(true);
    try {
      const verified = await refundService.verifyRefund(refundReference);
      setSelectedRefund(verified);
      fetchRefunds();
    } catch (err: unknown) {
      const error = err as ApiError;
      alert(error.message || 'Verification failed. Please retry.');
    } finally {
      setIsVerifying(false);
    }
  };

  const formatCurrency = (amt: number, curr = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: curr,
      minimumFractionDigits: 2,
    }).format(amt);
  };

  const getStatusBadge = (status: RefundStatus) => {
    switch (status) {
      case 'SUCCESS':
        return (
          <Badge variant="success" className="gap-1 flex items-center">
            <Check className="w-3 h-3" />
            SUCCESS
          </Badge>
        );
      case 'PROCESSING':
      case 'REQUESTED':
        return (
          <Badge variant="processing" className="gap-1 flex items-center">
            <Clock className="w-3 h-3 animate-spin" />
            {status}
          </Badge>
        );
      case 'FAILED':
        return (
          <Badge variant="failed" className="gap-1 flex items-center">
            <XCircle className="w-3 h-3" />
            FAILED
          </Badge>
        );
      case 'UNKNOWN':
        return (
          <Badge variant="warning" className="gap-1 flex items-center">
            <HelpCircle className="w-3 h-3" />
            UNKNOWN
          </Badge>
        );
      default:
        return <Badge variant="neutral">{status}</Badge>;
    }
  };

  const successfulTotal = refunds
    .filter((r) => r.status === 'SUCCESS')
    .reduce((sum, r) => sum + Number(r.amount), 0);

  const unknownCount = refunds.filter((r) => r.status === 'UNKNOWN').length;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600/10 text-purple-600 flex items-center justify-center font-bold">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Refund Management</h1>
              <p className="text-sm text-slate-500">
                Track full and partial refunds, inspect settlements, and reconcile unknown provider outcomes.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchRefunds}
            disabled={isLoading}
            className="flex items-center gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Analytics Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Refunds
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">{totalElements}</p>
          <span className="text-xs text-slate-400 mt-1 block">Full & partial operations</span>
        </Card>

        <Card className="p-4 border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Settled Volume (Page)
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingDown className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-emerald-600 mt-2">
            {formatCurrency(successfulTotal)}
          </p>
          <span className="text-xs text-slate-400 mt-1 block">Successfully settled</span>
        </Card>

        <Card className="p-4 border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Unconfirmed / Unknown
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <HelpCircle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-amber-600 mt-2">{unknownCount}</p>
          <span className="text-xs text-slate-400 mt-1 block">Requires status check</span>
        </Card>

        <Card className="p-4 border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Idempotency Safe
            </span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-purple-600 mt-2">100%</p>
          <span className="text-xs text-slate-400 mt-1 block">Pessimistic lock protected</span>
        </Card>
      </div>

      {/* Filter and Search Bar */}
      <Card className="p-4 border-slate-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by Refund Reference (ref_...) or Payment Reference (pay_...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white"
            />
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">Filter Status:</span>
            <select
              value={statusFilter || ''}
              onChange={(e) => {
                setStatusFilter(e.target.value ? (e.target.value as RefundStatus) : undefined);
                setCurrentPage(0);
              }}
              className="px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">All Statuses</option>
              <option value="SUCCESS">SUCCESS</option>
              <option value="PROCESSING">PROCESSING</option>
              <option value="REQUESTED">REQUESTED</option>
              <option value="UNKNOWN">UNKNOWN</option>
              <option value="FAILED">FAILED</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Error Message */}
      {errorMessage && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-sm flex items-center space-x-3">
          <AlertTriangle className="w-5 h-5 flex-shrink-0 text-rose-600" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Refunds Table */}
      <Card className="border-slate-200 overflow-hidden">
        {isLoading && refunds.length === 0 ? (
          <PageLoading message="Loading refund transactions..." />
        ) : refunds.length === 0 ? (
          <div className="text-center py-16 px-4">
            <RotateCcw className="w-12 h-12 mx-auto text-slate-300 mb-3" />
            <h3 className="text-base font-semibold text-slate-900">No refunds found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
              No refund requests match your current filters. Refunds initiated from payments will appear here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="px-4 py-3">Refund Reference</th>
                  <th className="px-4 py-3">Payment Reference</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Reason</th>
                  <th className="px-4 py-3">Requested At</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {refunds.map((refund) => (
                  <tr key={refund.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-4 py-3.5 font-mono text-slate-800">
                      <div className="flex items-center space-x-1.5">
                        <span className="font-semibold">{refund.refundReference}</span>
                        <button
                          type="button"
                          onClick={() => handleCopy(refund.refundReference)}
                          className="text-slate-400 hover:text-slate-600"
                          title="Copy Refund Reference"
                        >
                          {copiedKey === refund.refundReference ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 font-mono text-slate-600">
                      <div className="flex items-center space-x-1.5">
                        <span>{refund.paymentReference}</span>
                        <button
                          type="button"
                          onClick={() => handleCopy(refund.paymentReference)}
                          className="text-slate-400 hover:text-slate-600"
                          title="Copy Payment Reference"
                        >
                          {copiedKey === refund.paymentReference ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="font-bold text-slate-900 text-sm">
                        {formatCurrency(refund.amount, refund.currency)}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">{getStatusBadge(refund.status)}</td>
                    <td className="px-4 py-3.5 text-slate-600 max-w-xs truncate">
                      {refund.reason || '—'}
                    </td>
                    <td className="px-4 py-3.5 text-slate-500 whitespace-nowrap">
                      {new Date(refund.requestedAt).toLocaleString()}
                    </td>
                    <td className="px-4 py-3.5 text-right whitespace-nowrap">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedRefund(refund)}
                        className="text-xs h-7 px-2.5"
                      >
                        <Eye className="w-3.5 h-3.5 mr-1" />
                        Details
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Bar */}
        {totalPages > 1 && (
          <div className="px-4 py-3 bg-slate-50/50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
            <span>
              Showing page <strong className="text-slate-700">{currentPage + 1}</strong> of{' '}
              <strong className="text-slate-700">{totalPages}</strong> ({totalElements} total)
            </span>
            <div className="flex space-x-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
                disabled={currentPage === 0}
                className="text-xs h-7 px-3"
              >
                Previous
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setCurrentPage((p) => Math.min(totalPages - 1, p + 1))}
                disabled={currentPage >= totalPages - 1}
                className="text-xs h-7 px-3"
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Refund Details Modal */}
      {selectedRefund && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl bg-white border-slate-200 shadow-2xl rounded-2xl p-6 space-y-5 animate-in fade-in-50 zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center">
                  <RotateCcw className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900 font-mono">
                      {selectedRefund.refundReference}
                    </h3>
                    {selectedRefund.idempotentReplay && (
                      <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1">
                        <Zap className="w-3 h-3 text-amber-600" />
                        IDEMPOTENT REPLAY
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500">Related Payment: {selectedRefund.paymentReference}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedRefund(null)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            {/* Highlight Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs">
              <div>
                <span className="text-slate-400 font-semibold block uppercase text-[10px]">Refund Amount</span>
                <span className="text-base font-bold text-purple-700">
                  {formatCurrency(selectedRefund.amount, selectedRefund.currency)}
                </span>
              </div>
              <div>
                <span className="text-slate-400 font-semibold block uppercase text-[10px]">Status</span>
                <div className="mt-1">{getStatusBadge(selectedRefund.status)}</div>
              </div>
              <div>
                <span className="text-slate-400 font-semibold block uppercase text-[10px]">Provider Refund ID</span>
                <span className="font-mono text-slate-700 truncate block">
                  {selectedRefund.providerRefundId || '—'}
                </span>
              </div>
              <div>
                <span className="text-slate-400 font-semibold block uppercase text-[10px]">Merchant</span>
                <span className="font-semibold text-slate-800">{selectedRefund.merchantCode}</span>
              </div>
            </div>

            {/* Reason */}
            <div className="p-3 bg-slate-50/70 border border-slate-200 rounded-lg text-xs">
              <span className="font-semibold text-slate-500 uppercase text-[10px] block">Reason / Description</span>
              <p className="text-slate-800 mt-1">{selectedRefund.reason || 'No specific reason provided.'}</p>
            </div>

            {/* Failure banner if FAILED */}
            {selectedRefund.status === 'FAILED' && (
              <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-lg text-rose-800 text-xs space-y-1">
                <span className="font-bold block">Decline Code: {selectedRefund.failureCode || 'REFUND_DECLINED'}</span>
                <p>{selectedRefund.failureMessage || 'The simulated provider declined the refund.'}</p>
              </div>
            )}

            {/* Unknown status reconciliation banner */}
            {selectedRefund.status === 'UNKNOWN' && (
              <div className="p-4 bg-amber-50 border border-amber-300 rounded-xl text-amber-900 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-bold block text-sm">Unconfirmed Refund Outcome</span>
                    <p className="text-amber-800 text-xs mt-1">
                      Downstream network timed out before confirming settlement. The refundable amount is safely reserved to prevent double refunding.
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() => handleVerifyStatus(selectedRefund.refundReference)}
                    isLoading={isVerifying}
                    className="flex-shrink-0 text-xs"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 mr-1 ${isVerifying ? 'animate-spin' : ''}`} />
                    Verify with Provider
                  </Button>
                </div>
              </div>
            )}

            {/* Timestamps */}
            <div className="grid grid-cols-2 gap-3 text-xs text-slate-500 pt-2 border-t border-slate-100">
              <div>
                <span className="block font-semibold text-slate-400 text-[10px] uppercase">Requested At</span>
                <span>{new Date(selectedRefund.requestedAt).toLocaleString()}</span>
              </div>
              <div>
                <span className="block font-semibold text-slate-400 text-[10px] uppercase">Processed At</span>
                <span>
                  {selectedRefund.processedAt
                    ? new Date(selectedRefund.processedAt).toLocaleString()
                    : 'Pending final settlement'}
                </span>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <Button variant="outline" onClick={() => setSelectedRefund(null)}>
                Close
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
