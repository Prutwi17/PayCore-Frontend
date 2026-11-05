import React, { useState, useEffect, useCallback } from 'react';
import { paymentService } from '@/services/api/paymentService';
import { refundService } from '@/services/api/refundService';
import {
  PaymentItem,
  PaymentStatus,
  PaymentMethodType,
  PaymentAttemptItem,
} from '@/types/payment';
import { RefundItem, RefundableAmountResponse } from '@/types/refund';
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

  // Refund Modal State
  const [isRefundModalOpen, setIsRefundModalOpen] = useState(false);
  const [refundPayment, setRefundPayment] = useState<PaymentItem | null>(null);
  const [refundableInfo, setRefundableInfo] = useState<RefundableAmountResponse | null>(null);
  const [isLoadingRefundable, setIsLoadingRefundable] = useState(false);
  const [refundAmount, setRefundAmount] = useState('');
  const [refundReason, setRefundReason] = useState('Customer requested return');
  const [refundIdempotencyKey, setRefundIdempotencyKey] = useState('');
  const [copiedRefundKey, setCopiedRefundKey] = useState(false);
  const [isSubmittingRefund, setIsSubmittingRefund] = useState(false);
  const [refundError, setRefundError] = useState<string | null>(null);

  // Payment Refunds List in Details Modal
  const [paymentRefunds, setPaymentRefunds] = useState<RefundItem[]>([]);
  const [isLoadingPaymentRefunds, setIsLoadingPaymentRefunds] = useState(false);

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

  const generateNewRefundIdempotencyKey = useCallback(() => {
    const newKey =
      typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : 'idemp_ref_' + Math.random().toString(36).substring(2, 11) + '_' + Date.now();
    setRefundIdempotencyKey(newKey);
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

  const handleCopyRefundKey = () => {
    if (refundIdempotencyKey) {
      navigator.clipboard.writeText(refundIdempotencyKey);
      setCopiedRefundKey(true);
      setTimeout(() => setCopiedRefundKey(false), 2000);
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
    setIsLoadingPaymentRefunds(true);

    try {
      const attemptList = await paymentService.getPaymentAttempts(payment.paymentReference);
      setAttempts(attemptList);
    } catch {
      setAttempts([]);
    } finally {
      setIsLoadingAttempts(false);
    }

    try {
      const [refundList, refundableData] = await Promise.all([
        refundService.getPaymentRefunds(payment.paymentReference),
        refundService.getRefundableAmount(payment.paymentReference),
      ]);
      setPaymentRefunds(refundList);
      setRefundableInfo(refundableData);
    } catch {
      setPaymentRefunds([]);
      setRefundableInfo(null);
    } finally {
      setIsLoadingPaymentRefunds(false);
    }
  };

  const handleOpenRefundModal = async (payment: PaymentItem) => {
    setRefundPayment(payment);
    setRefundError(null);
    generateNewRefundIdempotencyKey();
    setIsRefundModalOpen(true);
    setIsLoadingRefundable(true);
    try {
      const info = await refundService.getRefundableAmount(payment.paymentReference);
      setRefundableInfo(info);
      setRefundAmount(info.remainingRefundableAmount.toString());
    } catch (err: unknown) {
      const apiErr = err as ApiError;
      setRefundError(apiErr.message || 'Failed to fetch refundable balance');
    } finally {
      setIsLoadingRefundable(false);
    }
  };

  const handleSubmitRefund = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!refundPayment) return;
    setRefundError(null);

    const parsedAmount = parseFloat(refundAmount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setRefundError('Refund amount must be greater than zero.');
      return;
    }

    if (refundableInfo && parsedAmount > refundableInfo.remainingRefundableAmount) {
      setRefundError(
        `Refund amount cannot exceed remaining refundable amount of ${formatCurrency(
          refundableInfo.remainingRefundableAmount,
          refundableInfo.currency
        )}.`
      );
      return;
    }

    setIsSubmittingRefund(true);
    try {
      const result = await refundService.createRefund(
        refundPayment.paymentReference,
        {
          amount: parsedAmount,
          currency: refundPayment.currency,
          reason: refundReason.trim() || undefined,
        },
        refundIdempotencyKey.trim() || undefined
      );

      setIsRefundModalOpen(false);
      await loadPayments();

      if (result.isReplay) {
        setReplayNotification(
          `⚡ Idempotent Refund Replay (HTTP 200 OK): Returned existing refund [${result.refund.refundReference}].`
        );
      } else {
        setReplayNotification(
          `✅ Refund [${result.refund.refundReference}] of ${formatCurrency(
            result.refund.amount,
            result.refund.currency
          )} settled successfully (Status: ${result.refund.status}).`
        );
      }

      if (selectedPayment && selectedPayment.paymentReference === refundPayment.paymentReference) {
        const updated = await paymentService.getPayment(refundPayment.paymentReference);
        handleOpenDetails(updated);
      }
    } catch (err: unknown) {
      const apiErr = err as ApiError;
      setRefundError(apiErr.message || 'Failed to initiate refund');
    } finally {
      setIsSubmittingRefund(false);
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

  const handleVerifyStatus = async (paymentReference: string) => {
    setIsVerifying(true);
    setErrorMessage(null);
    try {
      const statusRes = await paymentService.getPaymentStatus(paymentReference, true);
      await loadPayments();

      if (selectedPayment && selectedPayment.paymentReference === paymentReference) {
        const updated = await paymentService.getPayment(paymentReference);
        setSelectedPayment(updated);
      }

      setReplayNotification(
        `Authoritative provider reconciliation complete. Payment [${paymentReference}] status is now confirmed as ${statusRes.status}.`
      );
    } catch (err: unknown) {
      const apiErr = err as ApiError;
      setErrorMessage(apiErr.message || 'Verification failed');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleCancelPayment = async (paymentReference: string) => {
    if (!window.confirm(`Are you sure you want to cancel payment ${paymentReference}?`)) {
      return;
    }

    setIsCancelling(true);
    setErrorMessage(null);
    try {
      const cancelled = await paymentService.cancelPayment(paymentReference, 'Merchant initiated cancellation');
      await loadPayments();
      setSelectedPayment(cancelled);
    } catch (err: unknown) {
      const apiErr = err as ApiError;
      setErrorMessage(apiErr.message || 'Failed to cancel payment');
    } finally {
      setIsCancelling(false);
    }
  };

  const formatCurrency = (amt: number, curr = 'INR') => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: curr,
      minimumFractionDigits: 2,
    }).format(amt);
  };

  const getStatusBadge = (status: PaymentStatus) => {
    switch (status) {
      case 'SUCCESS':
        return (
          <Badge variant="success" className="gap-1 flex items-center">
            <Check className="w-3 h-3" />
            SUCCESS
          </Badge>
        );
      case 'PARTIALLY_REFUNDED':
        return (
          <Badge variant="processing" className="gap-1 flex items-center bg-purple-50 text-purple-700 border-purple-200">
            <RotateCcw className="w-3 h-3" />
            PARTIALLY_REFUNDED
          </Badge>
        );
      case 'REFUNDED':
        return (
          <Badge variant="neutral" className="gap-1 flex items-center bg-slate-100 text-slate-700 border-slate-300">
            <RotateCcw className="w-3 h-3" />
            REFUNDED
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
      case 'PROCESSING':
        return (
          <Badge variant="processing" className="gap-1 flex items-center">
            <RefreshCw className="w-3 h-3 animate-spin" />
            PROCESSING
          </Badge>
        );
      case 'REQUIRES_ACTION':
        return (
          <Badge variant="warning" className="gap-1 flex items-center">
            <AlertTriangle className="w-3 h-3" />
            REQUIRES_ACTION
          </Badge>
        );
      case 'CANCELLED':
        return <Badge variant="neutral">CANCELLED</Badge>;
      case 'AUTHORIZED':
        return <Badge variant="processing">AUTHORIZED</Badge>;
      default:
        return <Badge variant="neutral">{status}</Badge>;
    }
  };

  // Metrics
  const totalVolume = payments.reduce((acc, p) => acc + (p.status === 'SUCCESS' || p.status === 'PARTIALLY_REFUNDED' || p.status === 'REFUNDED' ? Number(p.amount) : 0), 0);
  const successCount = payments.filter((p) => p.status === 'SUCCESS' || p.status === 'PARTIALLY_REFUNDED' || p.status === 'REFUNDED').length;
  const unknownCount = payments.filter((p) => p.status === 'UNKNOWN').length;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/10 text-blue-600 flex items-center justify-center font-bold">
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Payments Engine</h1>
              <p className="text-sm text-slate-500">
                Process reliable transactions, manage full & partial refunds, and inspect attempt telemetry.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            size="sm"
            onClick={loadPayments}
            disabled={isLoading}
            className="flex items-center gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={handleOpenCreateModal}
            className="flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            New Payment
          </Button>
        </div>
      </div>

      {/* Idempotent Notification Banner */}
      {replayNotification && (
        <div className="p-4 bg-amber-50 border border-amber-300 rounded-xl text-amber-900 text-sm flex items-center justify-between shadow-sm animate-in fade-in duration-200">
          <div className="flex items-center space-x-3">
            <ShieldCheck className="w-5 h-5 text-amber-700 flex-shrink-0" />
            <span>{replayNotification}</span>
          </div>
          <button
            type="button"
            onClick={() => setReplayNotification(null)}
            className="text-amber-700 hover:text-amber-900 font-bold ml-4"
          >
            ✕
          </button>
        </div>
      )}

      {/* Overview Analytics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Settled Volume (Page)
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">
            {formatCurrency(totalVolume, 'INR')}
          </p>
          <span className="text-xs text-slate-400 mt-1 block">Completed & refunded payments</span>
        </Card>

        <Card className="p-4 border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Transactions
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">{totalElements}</p>
          <span className="text-xs text-slate-400 mt-1 block">Active across all states</span>
        </Card>

        <Card className="p-4 border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Success Ratio
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Check className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-emerald-600 mt-2">
            {payments.length ? `${Math.round((successCount / payments.length) * 100)}%` : '0%'}
          </p>
          <span className="text-xs text-slate-400 mt-1 block">{successCount} successful on page</span>
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
          <span className="text-xs text-slate-400 mt-1 block">Timeout recovery required</span>
        </Card>
      </div>

      {/* Filter and Search Bar */}
      <Card className="p-4 border-slate-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by Payment Reference (pay_...) or Customer ID"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            />
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">Status:</span>
            <select
              value={statusFilter || ''}
              onChange={(e) => {
                setStatusFilter(e.target.value ? (e.target.value as PaymentStatus) : undefined);
                setCurrentPage(0);
              }}
              className="px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Statuses</option>
              <option value="SUCCESS">SUCCESS</option>
              <option value="PARTIALLY_REFUNDED">PARTIALLY_REFUNDED</option>
              <option value="REFUNDED">REFUNDED</option>
              <option value="PROCESSING">PROCESSING</option>
              <option value="REQUIRES_ACTION">REQUIRES_ACTION</option>
              <option value="AUTHORIZED">AUTHORIZED</option>
              <option value="FAILED">FAILED</option>
              <option value="UNKNOWN">UNKNOWN</option>
              <option value="CANCELLED">CANCELLED</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Error Notification */}
      {errorMessage && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-sm flex items-center space-x-3">
          <AlertTriangle className="w-5 h-5 flex-shrink-0 text-rose-600" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Main Payments Data Table */}
      <Card className="border-slate-200 overflow-hidden">
        {isLoading && payments.length === 0 ? (
          <PageLoading message="Loading payment transactions..." />
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
                        {/* Refund Shortcut */}
                        {(p.status === 'SUCCESS' || p.status === 'PARTIALLY_REFUNDED') && (
                          <button
                            type="button"
                            onClick={() => handleOpenRefundModal(p)}
                            className="inline-flex items-center space-x-1 px-2.5 py-1 rounded text-xs font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 transition-colors"
                            title="Initiate Full or Partial Refund"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>Refund</span>
                          </button>
                        )}

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

        {/* Pagination Bar */}
        {totalPages > 1 && (
          <div className="px-6 py-3.5 bg-slate-50/50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
            <span>
              Showing page <strong className="text-slate-700">{currentPage + 1}</strong> of{' '}
              <strong className="text-slate-700">{totalPages}</strong> ({totalElements} total items)
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

      {/* Create Payment Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <Card className="w-full max-w-xl p-6 bg-white shadow-2xl space-y-5 rounded-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Initiate Protected Payment</h3>
                  <p className="text-xs text-slate-500">
                    Scoped to authenticated merchant with strict client-driven idempotency protection.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreatePayment} className="space-y-4">
              {/* Idempotency Key Section */}
              <div className="p-3.5 bg-slate-50/80 border border-slate-200 rounded-xl space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <label className="font-bold text-slate-700 flex items-center space-x-1.5">
                    <Key className="w-3.5 h-3.5 text-blue-600" />
                    <span>Idempotency-Key (UUID / Unique string)</span>
                  </label>
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={handleCopyKey}
                      className="text-[11px] font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                    >
                      {copiedKey ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedKey ? 'Copied' : 'Copy'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={generateNewIdempotencyKey}
                      className="text-[11px] font-semibold text-slate-500 hover:text-slate-700 ml-1"
                    >
                      Refresh
                    </button>
                  </div>
                </div>

                <input
                  type="text"
                  value={idempotencyKey}
                  onChange={(e) => setIdempotencyKey(e.target.value)}
                  required
                  maxLength={128}
                  className="w-full px-3 py-1.5 text-xs font-mono border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. 9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d"
                />
              </div>

              {/* Amount and Currency */}
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Payment Amount</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                    placeholder="1000.00"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Currency</label>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="INR">INR (₹)</option>
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                  </select>
                </div>
              </div>

              {/* Payment Method */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Payment Method</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['CARD', 'UPI', 'NET_BANKING'] as PaymentMethodType[]).map((method) => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => setPaymentMethod(method)}
                      className={`px-3 py-2 text-xs font-bold rounded-lg border text-center transition-all ${
                        paymentMethod === method
                          ? 'border-blue-600 bg-blue-50/70 text-blue-700 shadow-sm'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {method}
                    </button>
                  ))}
                </div>
              </div>

              {/* Customer Reference */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Customer Identifier / Reference</label>
                <input
                  type="text"
                  value={customerReference}
                  onChange={(e) => setCustomerReference(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. cust_user_102@example.com"
                />
              </div>

              {/* Simulation Scenario Hook */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Provider Simulation Scenario (Sandbox Engine)
                </label>
                <select
                  value={simulationScenario}
                  onChange={(e) =>
                    setSimulationScenario(e.target.value as 'SUCCESS' | 'FAIL' | 'TIMEOUT' | 'REQUIRES_ACTION')
                  }
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="SUCCESS">SUCCESS — 200 Settled</option>
                  <option value="FAIL">FAIL — Simulated Card Issuer Decline</option>
                  <option value="TIMEOUT">TIMEOUT — Network Socket Drop (Transitions to UNKNOWN)</option>
                  <option value="REQUIRES_ACTION">REQUIRES_ACTION — Customer 3DS Trigger</option>
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Order Description</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Payment for invoice #4421"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-100">
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
          <Card className="w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6 bg-white shadow-2xl space-y-6 rounded-2xl">
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

            {/* Refundable Balance Summary */}
            {refundableInfo && (
              <div className="p-4 bg-purple-50/70 border border-purple-200 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <RotateCcw className="w-4 h-4 text-purple-700" />
                    <span className="text-xs font-bold uppercase tracking-wider text-purple-900">
                      Refundable Balance Overview
                    </span>
                  </div>
                  {refundableInfo.refundable && (
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => handleOpenRefundModal(selectedPayment)}
                      className="text-xs bg-purple-600 hover:bg-purple-700 text-white"
                    >
                      <RotateCcw className="w-3.5 h-3.5 mr-1" />
                      Initiate Refund
                    </Button>
                  )}
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <span className="text-slate-400 font-semibold block text-[10px] uppercase">Original Amount</span>
                    <span className="font-bold text-slate-800">
                      {formatCurrency(refundableInfo.originalAmount, refundableInfo.currency)}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-semibold block text-[10px] uppercase">Refunded Total</span>
                    <span className="font-bold text-purple-700">
                      {formatCurrency(refundableInfo.totalRefundedAmount, refundableInfo.currency)}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-semibold block text-[10px] uppercase">Pending Reserved</span>
                    <span className="font-bold text-amber-700">
                      {formatCurrency(refundableInfo.pendingRefundAmount, refundableInfo.currency)}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-semibold block text-[10px] uppercase">Available to Refund</span>
                    <span className="font-bold text-emerald-700 text-sm">
                      {formatCurrency(refundableInfo.remainingRefundableAmount, refundableInfo.currency)}
                    </span>
                  </div>
                </div>
              </div>
            )}

                        {/* Cancel Action if pending/processing */}
            {['PENDING', 'PROCESSING', 'REQUIRES_ACTION'].includes(selectedPayment.status) && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg flex items-center justify-between">
                <div>
                  <span className="font-bold text-xs text-rose-900 block">Cancel Unsettled Payment</span>
                  <p className="text-[11px] text-rose-700">Abort this transaction before final authorization completes.</p>
                </div>
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => handleCancelPayment(selectedPayment.paymentReference)}
                  isLoading={isCancelling}
                  className="text-xs flex-shrink-0"
                >
                  Cancel Payment
                </Button>
              </div>
            )}

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
                      The downstream provider network timed out before confirming settlement. Verify status with provider.
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

            {/* Payment Refunds History */}
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-1 border-b border-slate-100">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <RotateCcw className="w-4 h-4 text-purple-600" />
                  Issued Refunds for this Payment
                </h4>
                <span className="text-xs text-slate-400 font-mono">
                  {paymentRefunds.length} record{paymentRefunds.length === 1 ? '' : 's'}
                </span>
              </div>

              {isLoadingPaymentRefunds ? (
                <div className="py-4 text-center text-xs text-slate-500">Loading payment refunds...</div>
              ) : paymentRefunds.length === 0 ? (
                <div className="py-3 text-center text-xs text-slate-400">No refunds have been issued for this payment yet.</div>
              ) : (
                <div className="border border-slate-200 rounded-lg overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-[10px] font-bold uppercase text-slate-500 border-b border-slate-200">
                      <tr>
                        <th className="px-3 py-2">Refund Ref</th>
                        <th className="px-3 py-2">Amount</th>
                        <th className="px-3 py-2">Status</th>
                        <th className="px-3 py-2">Reason</th>
                        <th className="px-3 py-2">Requested</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {paymentRefunds.map((ref) => (
                        <tr key={ref.id} className="hover:bg-slate-50/50">
                          <td className="px-3 py-2 font-mono font-bold text-slate-800">{ref.refundReference}</td>
                          <td className="px-3 py-2 font-bold text-purple-700">
                            {formatCurrency(ref.amount, ref.currency)}
                          </td>
                          <td className="px-3 py-2">
                            <span className="font-semibold text-slate-700">{ref.status}</span>
                          </td>
                          <td className="px-3 py-2 text-slate-600 truncate max-w-xs">{ref.reason || '—'}</td>
                          <td className="px-3 py-2 text-slate-500">{new Date(ref.requestedAt).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

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

      {/* Initiate Refund Modal */}
      {isRefundModalOpen && refundPayment && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-lg bg-white border-slate-200 shadow-2xl rounded-2xl p-6 space-y-5 animate-in fade-in-50 zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                  <RotateCcw className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Initiate Payment Refund</h3>
                  <p className="text-xs text-slate-500 font-mono">Payment: {refundPayment.paymentReference}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsRefundModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            {/* Balance Summary Box */}
            {isLoadingRefundable ? (
              <div className="py-4 text-center text-xs text-slate-500">Checking refundable balance...</div>
            ) : refundableInfo ? (
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-3 gap-2 text-center text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Original</span>
                  <span className="font-semibold text-slate-800">
                    {formatCurrency(refundableInfo.originalAmount, refundableInfo.currency)}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Already Refunded</span>
                  <span className="font-semibold text-purple-700">
                    {formatCurrency(refundableInfo.totalRefundedAmount, refundableInfo.currency)}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Available</span>
                  <span className="font-bold text-emerald-700">
                    {formatCurrency(refundableInfo.remainingRefundableAmount, refundableInfo.currency)}
                  </span>
                </div>
              </div>
            ) : null}

            <form onSubmit={handleSubmitRefund} className="space-y-4">
              {/* Amount Input */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-700">
                    Refund Amount ({refundPayment.currency})
                  </label>
                  {refundableInfo && refundableInfo.remainingRefundableAmount > 0 && (
                    <div className="flex gap-1.5">
                      <button
                        type="button"
                        onClick={() =>
                          setRefundAmount(
                            (refundableInfo.remainingRefundableAmount / 2).toFixed(2)
                          )
                        }
                        className="text-[10px] font-bold text-purple-600 hover:text-purple-800 px-1.5 py-0.5 rounded bg-purple-50 border border-purple-200"
                      >
                        50% Partial
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setRefundAmount(refundableInfo.remainingRefundableAmount.toString())
                        }
                        className="text-[10px] font-bold text-purple-600 hover:text-purple-800 px-1.5 py-0.5 rounded bg-purple-50 border border-purple-200"
                      >
                        100% Full
                      </button>
                    </div>
                  )}
                </div>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  max={refundableInfo?.remainingRefundableAmount || undefined}
                  value={refundAmount}
                  onChange={(e) => setRefundAmount(e.target.value)}
                  required
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono"
                  placeholder="0.00"
                />
              </div>

              {/* Warning Banners */}
              {refundableInfo && parseFloat(refundAmount) === refundableInfo.remainingRefundableAmount && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0 text-amber-600" />
                  <span>
                    <strong>Full Refund Warning:</strong> Refunding the entire remaining balance ({formatCurrency(refundableInfo.remainingRefundableAmount, refundableInfo.currency)}) will transition this payment to REFUNDED status.
                  </span>
                </div>
              )}

              {refundableInfo &&
                parseFloat(refundAmount) > 0 &&
                parseFloat(refundAmount) < refundableInfo.remainingRefundableAmount && (
                  <div className="p-2.5 bg-blue-50 border border-blue-200 rounded-lg text-blue-800 text-xs flex items-center gap-2">
                    <RotateCcw className="w-4 h-4 flex-shrink-0 text-blue-600" />
                    <span>
                      <strong>Partial Refund:</strong> A remaining balance of{' '}
                      {formatCurrency(
                        refundableInfo.remainingRefundableAmount - parseFloat(refundAmount),
                        refundableInfo.currency
                      )}{' '}
                      will remain eligible for subsequent refunds.
                    </span>
                  </div>
                )}

              {/* Reason Field */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Refund Reason / Note
                </label>
                <input
                  type="text"
                  value={refundReason}
                  onChange={(e) => setRefundReason(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Reason for refund"
                />
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {['Customer return', 'Defective product', 'Duplicate charge', 'Order cancelled'].map(
                    (tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => setRefundReason(tag)}
                        className="text-[10px] text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 px-2 py-0.5 rounded-full"
                      >
                        {tag}
                      </button>
                    )
                  )}
                </div>
              </div>

              {/* Idempotency Key Section */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-700 flex items-center gap-1">
                    <Key className="w-3.5 h-3.5 text-purple-600" />
                    Idempotency-Key
                  </span>
                  <div className="flex items-center space-x-1.5">
                    <button
                      type="button"
                      onClick={handleCopyRefundKey}
                      className="text-[11px] text-purple-600 hover:text-purple-800 font-semibold"
                    >
                      {copiedRefundKey ? 'Copied!' : 'Copy'}
                    </button>
                    <button
                      type="button"
                      onClick={generateNewRefundIdempotencyKey}
                      className="text-[11px] text-slate-500 hover:text-slate-800 ml-2"
                      title="Generate fresh idempotency key"
                    >
                      Refresh
                    </button>
                  </div>
                </div>
                <span className="font-mono text-[11px] text-slate-600 block truncate">
                  {refundIdempotencyKey}
                </span>
                <span className="text-[10px] text-slate-400 block">
                  Guarantees zero duplicate refunds under concurrent or retried network requests.
                </span>
              </div>

              {refundError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-800 text-xs flex items-center space-x-2">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0 text-rose-600" />
                  <span>{refundError}</span>
                </div>
              )}

              <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-100">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsRefundModalOpen(false)}
                  disabled={isSubmittingRefund}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  isLoading={isSubmittingRefund}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  Process Refund
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
};
