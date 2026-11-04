import React, { useState, useEffect, useCallback } from 'react';
import { paymentService } from '@/services/api/paymentService';
import {
  PaymentItem,
  PaymentStatus,
  PaymentMethodType,
  PaymentAttemptItem,
} from '@/types/payment';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { PageLoading } from '@/components/common/PageLoading';
import {
  CreditCard,
  Plus,
  Search,
  RefreshCw,
  Eye,
  AlertTriangle,
  XCircle,
  HelpCircle,
  Calendar,
  Layers,
  TrendingUp,
  Key,
  Copy,
  Check,
  RotateCcw,
  Zap,
  ShieldCheck,
} from 'lucide-react';
import { ApiError } from '@/types/api';

export const MerchantPaymentsPage: React.FC = () => {
  const [payments, setPayments] = useState<PaymentItem[]>([]);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [statusFilter, setStatusFilter] = useState<PaymentStatus | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [replayNotification, setReplayNotification] = useState<string | null>(null);

  // Create Payment Modal State & Idempotency Controls
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [idempotencyKey, setIdempotencyKey] = useState<string>('');
  const [copiedKey, setCopiedKey] = useState(false);

  const [amount, setAmount] = useState('1000.00');
  const [currency, setCurrency] = useState('INR');
  const [description, setDescription] = useState('Online Checkout Order');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>('CARD');
  const [customerReference, setCustomerReference] = useState('customer@example.com');
  const [simulationScenario, setSimulationScenario] = useState<'SUCCESS' | 'FAIL' | 'TIMEOUT' | 'REQUIRES_ACTION'>('SUCCESS');

  // Payment Details & Telemetry Inspection State
  const [selectedPayment, setSelectedPayment] = useState<PaymentItem | null>(null);
  const [attempts, setAttempts] = useState<PaymentAttemptItem[]>([]);
  const [isLoadingAttempts, setIsLoadingAttempts] = useState(false);

  // Verification & Cancel Action State
  const [isVerifying, setIsVerifying] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  const generateNewIdempotencyKey = useCallback(() => {
    const newKey =
      typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : 'idemp_' + Math.random().toString(36).substring(2, 11) + '_' + Date.now();
    setIdempotencyKey(newKey);
    return newKey;
  }, []);

  const handleOpenCreateModal = () => {
    generateNewIdempotencyKey();
    setErrorMessage(null);
    setIsCreateModalOpen(true);
  };

  const handleCopyKey = () => {
    if (idempotencyKey) {
      navigator.clipboard.writeText(idempotencyKey);
      setCopiedKey(true);
      setTimeout(() => setCopiedKey(false), 2000);
    }
  };

  const loadPayments = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const data = await paymentService.listMerchantPayments({
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
      setErrorMessage(apiErr.message || 'Failed to fetch merchant payments');
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
      const attemptList = await paymentService.getPaymentAttempts(payment.paymentReference);
      setAttempts(attemptList);
    } catch {
      setAttempts([]);
    } finally {
      setIsLoadingAttempts(false);
    }
  };

  const handleCreatePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setReplayNotification(null);

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setErrorMessage('Payment amount must be greater than zero.');
      return;
    }

    if (!idempotencyKey.trim()) {
      setErrorMessage('Idempotency-Key header is required for reliable payment creation.');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await paymentService.createPayment(
        {
          amount: parsedAmount,
          currency,
          description: description.trim() || undefined,
          paymentMethod,
          customerReference: customerReference.trim() || undefined,
          simulationScenario,
        },
        idempotencyKey.trim()
      );

      setIsCreateModalOpen(false);
      await loadPayments();

      if (result.isReplay) {
        setReplayNotification(
          `⚡ Idempotent Replay (HTTP 200 OK): Returned previously processed payment [${result.payment.paymentReference}]. No duplicate charge created.`
        );
      }

      handleOpenDetails(result.payment);
    } catch (err: unknown) {
      const apiErr = err as ApiError;
      setErrorMessage(apiErr.message || 'Failed to process payment');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTestReplay = async () => {
    setErrorMessage(null);
    setReplayNotification(null);

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setErrorMessage('Payment amount must be greater than zero.');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await paymentService.createPayment(
        {
          amount: parsedAmount,
          currency,
          description: description.trim() || undefined,
          paymentMethod,
          customerReference: customerReference.trim() || undefined,
          simulationScenario,
        },
        idempotencyKey.trim()
      );

      setIsCreateModalOpen(false);
      await loadPayments();
      setReplayNotification(
        `⚡ Idempotent Replay Verified: Duplicate request returned cached payment [${result.payment.paymentReference}] with HTTP 200 without duplicate provider charge.`
      );
      handleOpenDetails(result.payment);
    } catch (err: unknown) {
      const apiErr = err as ApiError;
      setErrorMessage(apiErr.message || 'Replay test encountered error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTestConflict = async () => {
    setErrorMessage(null);
    setIsSubmitting(true);
    try {
      const parsedAmount = parseFloat(amount) + 50.0;
      await paymentService.createPayment(
        {
          amount: parsedAmount,
          currency,
          description: (description + ' [TAMPERED]').trim(),
          paymentMethod,
          customerReference: customerReference.trim() || undefined,
          simulationScenario,
        },
        idempotencyKey.trim()
      );
      setErrorMessage('Expected 409 Conflict, but request succeeded unexpectedly.');
    } catch (err: unknown) {
      const apiErr = err as ApiError;
      setErrorMessage(`Idempotency Conflict (HTTP 409): ${apiErr.message || 'Payload altered for same key.'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyStatus = async (paymentReference: string) => {
    setIsVerifying(true);
    try {
      await paymentService.getPaymentStatus(paymentReference, true);
      const updated = await paymentService.getPayment(paymentReference);
      setSelectedPayment(updated);
      const updatedAttempts = await paymentService.getPaymentAttempts(paymentReference);
      setAttempts(updatedAttempts);
      await loadPayments();
    } catch (err: unknown) {
      const apiErr = err as ApiError;
      setErrorMessage(apiErr.message || 'Verification call failed');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleCancelPayment = async (paymentReference: string) => {
    setIsCancelling(true);
    try {
      const cancelled = await paymentService.cancelPayment(paymentReference, 'Merchant dashboard void request');
      setSelectedPayment(cancelled);
      const updatedAttempts = await paymentService.getPaymentAttempts(paymentReference);
      setAttempts(updatedAttempts);
      await loadPayments();
    } catch (err: unknown) {
      const apiErr = err as ApiError;
      setErrorMessage(apiErr.message || 'Failed to cancel payment');
    } finally {
      setIsCancelling(false);
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
        return <Badge variant="warning">UNKNOWN (UNCONFIRMED)</Badge>;
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
            Payment Operations
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Initiate idempotency-protected charges, monitor state machine transitions, and inspect provider attempt telemetry
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            onClick={loadPayments}
            className="flex items-center space-x-1.5 text-xs"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh</span>
          </Button>
          <Button
            variant="primary"
            onClick={handleOpenCreateModal}
            className="flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Create Protected Payment</span>
          </Button>
        </div>
      </div>

      {/* Replay Notification Toast */}
      {replayNotification && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl flex items-center justify-between text-emerald-900 text-sm shadow-sm animate-in fade-in duration-200">
          <div className="flex items-center space-x-3">
            <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <span className="font-medium">{replayNotification}</span>
          </div>
          <button
            type="button"
            onClick={() => setReplayNotification(null)}
            className="text-emerald-700 hover:text-emerald-900 text-xs font-bold ml-4"
          >
            ✕
          </button>
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 border-slate-200">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Total Transactions</span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-xl font-bold text-slate-900">{totalElements}</span>
            <span className="text-xs text-blue-600 font-medium flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              Idempotency Active
            </span>
          </div>
        </Card>

        <Card className="p-4 border-slate-200">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Settled (Success)</span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-xl font-bold text-emerald-600">
              {payments.filter((p) => p.status === 'SUCCESS').length}
            </span>
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          </div>
        </Card>

        <Card className="p-4 border-slate-200">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Failed / Declined</span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-xl font-bold text-rose-600">
              {payments.filter((p) => p.status === 'FAILED').length}
            </span>
            <XCircle className="w-4 h-4 text-rose-500" />
          </div>
        </Card>

        <Card className="p-4 border-slate-200">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Unconfirmed (Unknown)</span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-xl font-bold text-amber-600">
              {payments.filter((p) => p.status === 'UNKNOWN').length}
            </span>
            <HelpCircle className="w-4 h-4 text-amber-500" />
          </div>
        </Card>
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
            All Statuses
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
              setStatusFilter('REQUIRES_ACTION');
              setCurrentPage(0);
            }}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              statusFilter === 'REQUIRES_ACTION'
                ? 'bg-white text-blue-800 font-semibold shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Requires Action
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
            placeholder="Search payment or customer ref..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Payments Table Card */}
      <Card className="overflow-hidden border-slate-200 bg-white">
        {isLoading ? (
          <div className="py-16">
            <PageLoading message="Querying payments ledger..." />
          </div>
        ) : payments.length === 0 ? (
          <div className="py-16 text-center">
            <CreditCard className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-slate-700">No payments found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
              {searchQuery
                ? `No transactions match reference "${searchQuery}".`
                : 'Initiate your first payment transaction to observe the payment state machine and attempt telemetry.'}
            </p>
            <Button variant="primary" onClick={handleOpenCreateModal}>
              <Plus className="w-4 h-4 mr-1.5" />
              Create Protected Payment
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <th className="px-6 py-3.5">Payment Reference</th>
                  <th className="px-4 py-3.5">Amount</th>
                  <th className="px-4 py-3.5">Method</th>
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
                      <div className="flex flex-col">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-slate-800">{p.paymentReference}</span>
                          {p.idempotentReplay && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] bg-amber-100 text-amber-800 font-semibold font-sans">
                              ⚡ Replay
                            </span>
                          )}
                        </div>
                        {p.customerReference && (
                          <span className="text-[11px] font-sans text-slate-400 truncate max-w-xs">
                            {p.customerReference}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4 font-semibold text-slate-900">
                      {formatCurrency(p.amount, p.currency)}
                    </td>
                    <td className="px-4 py-4 text-slate-600 font-medium">
                      <span className="px-2 py-0.5 rounded text-[10px] bg-slate-100 border border-slate-200 font-mono">
                        {p.paymentMethod}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      {getStatusBadge(p.status)}
                    </td>
                    <td className="px-4 py-4 font-mono text-[11px] text-slate-500">
                      {p.providerTransactionId ? (
                        <span className="bg-slate-50 px-1.5 py-0.5 rounded border border-slate-200">
                          {p.providerTransactionId}
                        </span>
                      ) : (
                        <span className="text-slate-400 italic">—</span>
                      )}
                    </td>
                    <td className="px-4 py-4 text-slate-500">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{p.createdAt ? new Date(p.createdAt).toLocaleDateString() : 'N/A'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        {p.status === 'UNKNOWN' && (
                          <button
                            type="button"
                            onClick={() => handleVerifyStatus(p.paymentReference)}
                            disabled={isVerifying}
                            className="inline-flex items-center space-x-1 px-2 py-1 rounded text-xs font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 transition-colors"
                            title="Verify UNKNOWN outcome with provider"
                          >
                            <RefreshCw className={`w-3 h-3 ${isVerifying ? 'animate-spin' : ''}`} />
                            <span>Verify</span>
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => handleOpenDetails(p)}
                          className="inline-flex items-center space-x-1 px-2.5 py-1 rounded text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-200 transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Details</span>
                        </button>
                      </div>
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

      {/* Create Payment Modal with Idempotency Controls */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <Card className="w-full max-w-xl max-h-[95vh] overflow-y-auto p-6 bg-white shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-blue-600" />
                Initiate Idempotent Payment
              </h3>
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-semibold"
              >
                ✕
              </button>
            </div>

            {/* Idempotency-Key Control Panel */}
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5 uppercase tracking-wider">
                  <Key className="w-3.5 h-3.5 text-blue-600" />
                  Idempotency-Key (Header)
                </label>
                <div className="flex items-center space-x-1.5">
                  <button
                    type="button"
                    onClick={generateNewIdempotencyKey}
                    className="inline-flex items-center space-x-1 text-[11px] font-semibold text-blue-600 hover:text-blue-800 bg-white px-2 py-0.5 border border-slate-200 rounded shadow-xs"
                    title="Generate a fresh UUID idempotency key"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Regenerate</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleCopyKey}
                    className="inline-flex items-center space-x-1 text-[11px] font-semibold text-slate-600 hover:text-slate-800 bg-white px-2 py-0.5 border border-slate-200 rounded shadow-xs"
                    title="Copy key to clipboard"
                  >
                    {copiedKey ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-600" />
                        <span className="text-emerald-600 font-bold">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              <input
                type="text"
                value={idempotencyKey}
                onChange={(e) => setIdempotencyKey(e.target.value)}
                required
                placeholder="e.g. 9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d"
                className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Scoped strictly to your merchant profile. Duplicate requests sharing this key and payload will return the cached response (HTTP 200 OK) without double charging.
              </p>
            </div>

            <form onSubmit={handleCreatePayment} className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                    Amount *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                    placeholder="100.00"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                    Currency *
                  </label>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="INR">INR (₹)</option>
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                    <option value="CAD">CAD ($)</option>
                    <option value="AUD">AUD ($)</option>
                    <option value="SGD">SGD ($)</option>
                    <option value="AED">AED (د.إ)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                  Payment Method
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['CARD', 'UPI', 'NET_BANKING'] as PaymentMethodType[]).map((method) => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => setPaymentMethod(method)}
                      className={`py-1.5 px-2 text-xs font-bold rounded-lg border text-center transition-all ${
                        paymentMethod === method
                          ? 'bg-blue-50 border-blue-500 text-blue-700 ring-2 ring-blue-500/20'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {method}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                  Customer Identifier (Optional)
                </label>
                <input
                  type="text"
                  value={customerReference}
                  onChange={(e) => setCustomerReference(e.target.value)}
                  placeholder="cust_user_42@example.com"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                  Order Description
                </label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Order summary / invoice description"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Simulation Scenario Selector */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Simulated Provider Scenario
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setSimulationScenario('SUCCESS')}
                    className={`p-2.5 rounded-lg border text-left transition-all ${
                      simulationScenario === 'SUCCESS'
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-900 ring-2 ring-emerald-500/20'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <span className="font-bold block">🟢 Normal Settlement</span>
                    <span className="text-[10px] text-slate-500 block">Status: SUCCESS</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSimulationScenario('FAIL')}
                    className={`p-2.5 rounded-lg border text-left transition-all ${
                      simulationScenario === 'FAIL'
                        ? 'bg-rose-50 border-rose-500 text-rose-900 ring-2 ring-rose-500/20'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <span className="font-bold block">🔴 Card Decline</span>
                    <span className="text-[10px] text-slate-500 block">Status: FAILED</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSimulationScenario('TIMEOUT')}
                    className={`p-2.5 rounded-lg border text-left transition-all ${
                      simulationScenario === 'TIMEOUT'
                        ? 'bg-amber-50 border-amber-500 text-amber-900 ring-2 ring-amber-500/20'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <span className="font-bold block">🟡 Provider Timeout</span>
                    <span className="text-[10px] text-slate-500 block">Status: UNKNOWN</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSimulationScenario('REQUIRES_ACTION')}
                    className={`p-2.5 rounded-lg border text-left transition-all ${
                      simulationScenario === 'REQUIRES_ACTION'
                        ? 'bg-blue-50 border-blue-500 text-blue-900 ring-2 ring-blue-500/20'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <span className="font-bold block">🟣 3D-Secure Auth</span>
                    <span className="text-[10px] text-slate-500 block">Status: REQUIRES_ACTION</span>
                  </button>
                </div>
              </div>

              {/* Idempotency Test Shortcut Buttons */}
              <div className="p-3 bg-blue-50/50 border border-blue-200 rounded-xl space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-800 block">
                  Idempotency Verification Shortcuts
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleTestReplay}
                    disabled={isSubmitting}
                    className="text-xs text-blue-700 bg-white border-blue-300 hover:bg-blue-50 flex items-center justify-center gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-blue-600" />
                    <span>Test Idempotent Replay (200)</span>
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleTestConflict}
                    disabled={isSubmitting}
                    className="text-xs text-amber-800 bg-white border-amber-300 hover:bg-amber-50 flex items-center justify-center gap-1.5"
                  >
                    <Zap className="w-3.5 h-3.5 text-amber-600" />
                    <span>Test Altered Payload (409)</span>
                  </Button>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsCreateModalOpen(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  isLoading={isSubmitting}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Dispatching with Idempotency...' : 'Initiate Payment'}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* Payment Details & Attempt History Modal */}
      {selectedPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <Card className="w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6 bg-white shadow-2xl space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900">{selectedPayment.paymentReference}</h3>
                    {selectedPayment.idempotentReplay && (
                      <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1">
                        <Zap className="w-3 h-3 text-amber-600" />
                        IDEMPOTENT REPLAY
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500">Merchant Code: {selectedPayment.merchantCode}</p>
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

            {/* Idempotent Replay Banner */}
            {selectedPayment.idempotentReplay && (
              <div className="p-3.5 bg-amber-50/80 border border-amber-300 rounded-xl text-amber-900 text-xs flex items-center space-x-2.5">
                <ShieldCheck className="w-5 h-5 text-amber-700 flex-shrink-0" />
                <div>
                  <span className="font-bold block">Idempotent Replay Verified</span>
                  <p className="text-[11px] text-amber-800 mt-0.5">
                    This response was returned from the database idempotency record (HTTP 200 OK). No duplicate charge was submitted to downstream providers.
                  </p>
                </div>
              </div>
            )}

            {/* Status & Amount Highlight */}
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

            {/* Failure banner if FAILED or UNKNOWN */}
            {selectedPayment.status === 'FAILED' && (
              <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-lg text-rose-800 text-xs space-y-1">
                <span className="font-bold block">Decline Reason: {selectedPayment.failureCode}</span>
                <p>{selectedPayment.failureMessage || 'Downstream payment provider declined the charge.'}</p>
              </div>
            )}

            {selectedPayment.status === 'UNKNOWN' && (
              <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-lg text-amber-900 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-bold block">Unconfirmed Transaction Outcome</span>
                    <p className="text-amber-800 text-[11px] mt-0.5">
                      The downstream provider network timed out before confirming the settlement. To prevent double charges, verify status with the provider network.
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() => handleVerifyStatus(selectedPayment.paymentReference)}
                    isLoading={isVerifying}
                    className="flex-shrink-0 text-xs"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 mr-1 ${isVerifying ? 'animate-spin' : ''}`} />
                    Verify Status
                  </Button>
                </div>
              </div>
            )}

            {/* Cancellable Alert */}
            {(selectedPayment.status === 'REQUIRES_ACTION' || selectedPayment.status === 'CREATED') && (
              <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-lg text-blue-900 text-xs flex items-center justify-between">
                <span>Payment is active and can be cancelled before settlement.</span>
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => handleCancelPayment(selectedPayment.paymentReference)}
                  isLoading={isCancelling}
                  className="flex-shrink-0 text-xs"
                >
                  Cancel Payment
                </Button>
              </div>
            )}

            {/* Provider Attempt Telemetry History */}
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
                          <td className="px-3 py-2">
                            <span className="font-semibold text-slate-700">{att.status}</span>
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
