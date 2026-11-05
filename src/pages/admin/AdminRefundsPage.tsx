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
  Clock,
} from 'lucide-react';
import { ApiError } from '@/types/api';

export const AdminRefundsPage: React.FC = () => {
  const [refunds, setRefunds] = useState<RefundItem[]>([]);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);

  // Filters
  const [statusFilter, setStatusFilter] = useState<RefundStatus | undefined>(undefined);
  const [merchantIdFilter, setMerchantIdFilter] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');

  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Details Modal
  const [selectedRefund, setSelectedRefund] = useState<RefundItem | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const fetchRefunds = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const parsedMerchantId = merchantIdFilter ? parseInt(merchantIdFilter, 10) : undefined;
      const data = await refundService.listAdminRefunds({
        status: statusFilter,
        merchantId: !isNaN(parsedMerchantId as number) ? parsedMerchantId : undefined,
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
      setErrorMessage(error.message || 'Failed to load system refunds.');
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, statusFilter, merchantIdFilter, searchQuery]);

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
      const verified = await refundService.verifyAdminRefund(refundReference);
      setSelectedRefund(verified);
      fetchRefunds();
    } catch (err: unknown) {
      const error = err as ApiError;
      alert(error.message || 'Verification failed.');
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

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600/10 text-purple-600 flex items-center justify-center font-bold">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">System Refund Oversight</h1>
              <p className="text-sm text-slate-500">
                Administrative monitoring and reconciliation across all merchant refund operations.
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

      {/* Filter Bar */}
      <Card className="p-4 border-slate-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="relative md:col-span-2">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by Refund Reference, Payment Reference, or Merchant Code"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
            />
          </div>

          <div>
            <select
              value={statusFilter || ''}
              onChange={(e) => {
                setStatusFilter(e.target.value ? (e.target.value as RefundStatus) : undefined);
                setCurrentPage(0);
              }}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">All Statuses</option>
              <option value="SUCCESS">SUCCESS</option>
              <option value="PROCESSING">PROCESSING</option>
              <option value="REQUESTED">REQUESTED</option>
              <option value="UNKNOWN">UNKNOWN</option>
              <option value="FAILED">FAILED</option>
            </select>
          </div>

          <div>
            <input
              type="number"
              placeholder="Filter Merchant ID"
              value={merchantIdFilter}
              onChange={(e) => {
                setMerchantIdFilter(e.target.value);
                setCurrentPage(0);
              }}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>
      </Card>

      {/* Error Banner */}
      {errorMessage && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-sm flex items-center space-x-3">
          <AlertTriangle className="w-5 h-5 flex-shrink-0 text-rose-600" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Refunds Table */}
      <Card className="border-slate-200 overflow-hidden">
        {isLoading && refunds.length === 0 ? (
          <PageLoading message="Loading system refunds..." />
        ) : refunds.length === 0 ? (
          <div className="text-center py-16 px-4">
            <RotateCcw className="w-12 h-12 mx-auto text-slate-300 mb-3" />
            <h3 className="text-base font-semibold text-slate-900">No refunds found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
              No refund records match the specified query filters across any merchant.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="px-4 py-3">Refund Ref</th>
                  <th className="px-4 py-3">Payment Ref</th>
                  <th className="px-4 py-3">Merchant</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Requested At</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {refunds.map((refund) => (
                  <tr key={refund.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-4 py-3.5 font-mono text-slate-800 font-semibold">
                      <div className="flex items-center space-x-1.5">
                        <span>{refund.refundReference}</span>
                        <button
                          type="button"
                          onClick={() => handleCopy(refund.refundReference)}
                          className="text-slate-400 hover:text-slate-600"
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
                      <span>{refund.paymentReference}</span>
                    </td>
                    <td className="px-4 py-3.5 font-semibold text-slate-700">
                      <span className="px-2 py-0.5 rounded text-[10px] bg-slate-100 border border-slate-200">
                        {refund.merchantCode}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 font-bold text-slate-900 text-sm">
                      {formatCurrency(refund.amount, refund.currency)}
                    </td>
                    <td className="px-4 py-3.5">{getStatusBadge(refund.status)}</td>
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

      {/* Admin Details Modal */}
      {selectedRefund && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl bg-white border-slate-200 shadow-2xl rounded-2xl p-6 space-y-5 animate-in fade-in-50 zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center">
                  <RotateCcw className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 font-mono">
                    {selectedRefund.refundReference}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Payment: {selectedRefund.paymentReference} | Merchant: {selectedRefund.merchantCode} (ID: {selectedRefund.merchantId})
                  </p>
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

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs">
              <div>
                <span className="text-slate-400 font-semibold block uppercase text-[10px]">Amount</span>
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
                <span className="text-slate-400 font-semibold block uppercase text-[10px]">Currency</span>
                <span className="font-semibold text-slate-800">{selectedRefund.currency}</span>
              </div>
            </div>

            {selectedRefund.status === 'UNKNOWN' && (
              <div className="p-4 bg-amber-50 border border-amber-300 rounded-xl text-amber-900 text-xs flex items-center justify-between">
                <div>
                  <span className="font-bold block">Action Required: UNKNOWN Outcome</span>
                  <p className="text-amber-800 text-xs mt-0.5">
                    Query downstream simulated provider to reconcile final settlement.
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
                  Reconcile Now
                </Button>
              </div>
            )}

            <div className="p-3 bg-slate-50/70 border border-slate-200 rounded-lg text-xs">
              <span className="font-semibold text-slate-500 uppercase text-[10px] block">Reason</span>
              <p className="text-slate-800 mt-1">{selectedRefund.reason || 'No description entered.'}</p>
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
