import React, { useState, useEffect, useCallback } from 'react';
import { paymentService } from '@/services/api/paymentService';
import { PaymentItem, PaymentStatus, PaymentAttemptItem } from '@/types/payment';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { PageLoading } from '@/components/common/PageLoading';
import {
  CreditCard,
  Search,
  RefreshCw,
  Eye,
  AlertTriangle,
  Calendar,
  Layers,
} from 'lucide-react';
import { ApiError } from '@/types/api';

export const AdminPaymentsPage: React.FC = () => {
  const [payments, setPayments] = useState<PaymentItem[]>([]);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [statusFilter, setStatusFilter] = useState<PaymentStatus | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Details Modal
  const [selectedPayment, setSelectedPayment] = useState<PaymentItem | null>(null);
  const [attempts, setAttempts] = useState<PaymentAttemptItem[]>([]);
  const [isLoadingAttempts, setIsLoadingAttempts] = useState(false);

  const loadPayments = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const data = await paymentService.listAdminPayments({
        status: statusFilter,
        search: searchQuery.trim() || undefined,
        page: currentPage,
        size: 10,
        sortBy: 'createdAt',
        sortDirection: 'desc',
      });
      setPayments(data.content);
      setTotalElements(data.totalElements);
      setTotalPages(data.totalPages);
    } catch (err: unknown) {
      const apiErr = err as ApiError;
      setErrorMessage(apiErr.message || 'Failed to fetch platform payments');
    } finally {
      setIsLoading(false);
    }
  }, [statusFilter, searchQuery, currentPage]);

  useEffect(() => {
    loadPayments();
  }, [loadPayments]);

  const handleOpenDetails = async (payment: PaymentItem) => {
    setSelectedPayment(payment);
    setIsLoadingAttempts(true);
    try {
      const list = await paymentService.getAdminPaymentAttempts(payment.paymentReference);
      setAttempts(list);
    } catch {
      setAttempts([]);
    } finally {
      setIsLoadingAttempts(false);
    }
  };

  const getStatusBadge = (status: PaymentStatus) => {
    switch (status) {
      case 'SUCCESS':
        return <Badge variant="success">SUCCESS</Badge>;
      case 'PROCESSING':
        return <Badge variant="processing">PROCESSING</Badge>;
      case 'FAILED':
        return <Badge variant="failed">FAILED</Badge>;
      case 'UNKNOWN':
        return <Badge variant="warning">UNKNOWN</Badge>;
      case 'REQUIRES_ACTION':
        return <Badge variant="processing">REQUIRES ACTION</Badge>;
      case 'AUTHORIZED':
        return <Badge variant="processing">AUTHORIZED</Badge>;
      case 'CANCELLED':
        return <Badge variant="neutral">CANCELLED</Badge>;
      case 'CREATED':
      default:
        return <Badge variant="neutral">{status}</Badge>;
    }
  };

  const formatCurrency = (val: number, cur: string) => {
    try {
      return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: cur,
        maximumFractionDigits: 2,
      }).format(val);
    } catch {
      return `${cur} ${val.toFixed(2)}`;
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            <CreditCard className="w-6 h-6 text-blue-600" />
            Global Payments Ledger
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            System-wide payment transaction monitoring and downstream provider auditing
          </p>
        </div>
        <Button
          variant="outline"
          onClick={loadPayments}
          className="flex items-center space-x-1.5 text-xs"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh</span>
        </Button>
      </div>

      {/* Error Message */}
      {errorMessage && (
        <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-lg flex items-center space-x-3 text-rose-700 text-sm">
          <AlertTriangle className="w-5 h-5 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Filter Tabs & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Status Filters */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 rounded-lg text-xs font-medium">
          <button
            type="button"
            onClick={() => {
              setStatusFilter(undefined);
              setCurrentPage(0);
            }}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              statusFilter === undefined
                ? 'bg-white text-slate-900 font-semibold shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All System Transactions
          </button>
          <button
            type="button"
            onClick={() => {
              setStatusFilter('SUCCESS');
              setCurrentPage(0);
            }}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              statusFilter === 'SUCCESS'
                ? 'bg-white text-emerald-800 font-semibold shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Success
          </button>
          <button
            type="button"
            onClick={() => {
              setStatusFilter('FAILED');
              setCurrentPage(0);
            }}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              statusFilter === 'FAILED'
                ? 'bg-white text-rose-800 font-semibold shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Failed
          </button>
          <button
            type="button"
            onClick={() => {
              setStatusFilter('UNKNOWN');
              setCurrentPage(0);
            }}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              statusFilter === 'UNKNOWN'
                ? 'bg-white text-amber-800 font-semibold shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Unknown
          </button>
          <button
            type="button"
            onClick={() => {
              setStatusFilter('CANCELLED');
              setCurrentPage(0);
            }}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              statusFilter === 'CANCELLED'
                ? 'bg-white text-slate-800 font-semibold shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Cancelled
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search reference or merchant code..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Table Card */}
      <Card className="overflow-hidden border-slate-200 bg-white">
        {isLoading ? (
          <div className="py-16">
            <PageLoading message="Loading global payments..." />
          </div>
        ) : payments.length === 0 ? (
          <div className="py-16 text-center">
            <CreditCard className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-slate-700">No transactions recorded</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
              {searchQuery
                ? `No transactions matching query "${searchQuery}".`
                : 'No payment records exist across merchants under this filter.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <th className="px-6 py-3.5">Payment Reference</th>
                  <th className="px-4 py-3.5">Merchant Code</th>
                  <th className="px-4 py-3.5">Amount</th>
                  <th className="px-4 py-3.5">Status</th>
                  <th className="px-4 py-3.5">Provider TX ID</th>
                  <th className="px-4 py-3.5">Created</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {payments.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-mono font-medium text-slate-900">
                      <span className="font-bold">{p.paymentReference}</span>
                    </td>
                    <td className="px-4 py-4 font-mono text-slate-600">
                      <span className="bg-slate-100 px-2 py-0.5 rounded text-[11px] border border-slate-200">
                        {p.merchantCode}
                      </span>
                    </td>
                    <td className="px-4 py-4 font-semibold text-slate-900">
                      {formatCurrency(p.amount, p.currency)}
                    </td>
                    <td className="px-4 py-4">
                      {getStatusBadge(p.status)}
                    </td>
                    <td className="px-4 py-4 font-mono text-[11px] text-slate-500">
                      {p.providerTransactionId || '—'}
                    </td>
                    <td className="px-4 py-4 text-slate-500">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{p.createdAt ? new Date(p.createdAt).toLocaleDateString() : 'N/A'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        type="button"
                        onClick={() => handleOpenDetails(p)}
                        className="inline-flex items-center space-x-1 px-2.5 py-1 rounded text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-200 transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Audit</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div className="px-6 py-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>
              Showing {payments.length} of {totalElements} transactions
            </span>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
                disabled={currentPage === 0}
              >
                Previous
              </Button>
              <span className="font-semibold text-slate-700">
                Page {currentPage + 1} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.min(totalPages - 1, p + 1))}
                disabled={currentPage >= totalPages - 1}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Admin Details Modal */}
      {selectedPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <Card className="w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6 bg-white shadow-2xl space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">{selectedPayment.paymentReference}</h3>
                  <p className="text-xs text-slate-500">Merchant: {selectedPayment.merchantCode} (ID: {selectedPayment.merchantId})</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedPayment(null)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs">
              <div>
                <span className="text-slate-400 font-semibold block uppercase text-[10px]">Amount</span>
                <span className="text-base font-bold text-slate-900">
                  {formatCurrency(selectedPayment.amount, selectedPayment.currency)}
                </span>
              </div>
              <div>
                <span className="text-slate-400 font-semibold block uppercase text-[10px]">Status</span>
                <div className="mt-1">{getStatusBadge(selectedPayment.status)}</div>
              </div>
              <div>
                <span className="text-slate-400 font-semibold block uppercase text-[10px]">Provider</span>
                <span className="font-semibold text-slate-800">{selectedPayment.provider}</span>
              </div>
              <div>
                <span className="text-slate-400 font-semibold block uppercase text-[10px]">Method</span>
                <span className="font-semibold text-slate-800">{selectedPayment.paymentMethod}</span>
              </div>
            </div>

            {/* Provider Attempt Telemetry */}
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-1 border-b border-slate-100">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-blue-600" />
                  Provider Dispatch Attempt Telemetry
                </h4>
                <span className="text-xs text-slate-400 font-mono">
                  {attempts.length} recorded attempt{attempts.length === 1 ? '' : 's'}
                </span>
              </div>

              {isLoadingAttempts ? (
                <div className="py-6 text-center text-xs text-slate-500">Loading attempt history...</div>
              ) : attempts.length === 0 ? (
                <div className="py-4 text-center text-xs text-slate-400">No attempt records found.</div>
              ) : (
                <div className="border border-slate-200 rounded-lg overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold uppercase text-slate-500">
                      <tr>
                        <th className="px-3 py-2">Attempt #</th>
                        <th className="px-3 py-2">Status</th>
                        <th className="px-3 py-2">Request Ref</th>
                        <th className="px-3 py-2">Response Code</th>
                        <th className="px-3 py-2">Completed</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {attempts.map((att) => (
                        <tr key={att.id} className="hover:bg-slate-50/50">
                          <td className="px-3 py-2 font-bold font-mono text-slate-800">
                            #{att.attemptNumber}
                          </td>
                          <td className="px-3 py-2 font-semibold text-slate-700">
                            {att.status}
                          </td>
                          <td className="px-3 py-2 font-mono text-[11px] text-slate-500">
                            {att.requestReference}
                          </td>
                          <td className="px-3 py-2 font-mono text-[11px] text-slate-700">
                            {att.responseCode || '—'}
                          </td>
                          <td className="px-3 py-2 text-slate-500">
                            {att.completedAt ? new Date(att.completedAt).toLocaleTimeString() : 'In-flight'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="pt-2 flex justify-end">
              <Button variant="outline" onClick={() => setSelectedPayment(null)}>
                Close
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
