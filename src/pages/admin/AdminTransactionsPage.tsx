import React, { useState, useEffect, useCallback } from 'react';
import { transactionService } from '@/services/api/transactionService';
import { TransactionItem, TransactionType } from '@/types/transaction';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { PageLoading } from '@/components/common/PageLoading';
import {
  History,
  Search,
  RefreshCw,
  Copy,
  Check,
  Calendar,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownLeft,
} from 'lucide-react';
import { ApiError } from '@/types/api';

export const AdminTransactionsPage: React.FC = () => {
  const [transactions, setTransactions] = useState<TransactionItem[]>([]);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);

  // Filters
  const [typeFilter, setTypeFilter] = useState<TransactionType | ''>('');
  const [statusFilter, setStatusFilter] = useState('');
  const [merchantIdFilter, setMerchantIdFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const fetchTransactions = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const parsedMerchantId = merchantIdFilter ? parseInt(merchantIdFilter, 10) : undefined;
      const data = await transactionService.listAdminTransactions({
        merchantId: !isNaN(parsedMerchantId as number) ? parsedMerchantId : undefined,
        type: typeFilter || undefined,
        status: statusFilter.trim() || undefined,
        search: searchQuery.trim() || undefined,
        startDate: startDate ? new Date(startDate).toISOString() : undefined,
        endDate: endDate ? new Date(endDate).toISOString() : undefined,
        page: currentPage,
        size: 15,
        sortBy: 'createdAt',
        sortDirection: 'desc',
      });
      setTransactions(data.content);
      setTotalElements(data.totalElements);
      setTotalPages(data.totalPages);
    } catch (err: unknown) {
      const error = err as ApiError;
      setErrorMessage(error.message || 'Failed to load system transactions.');
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, merchantIdFilter, typeFilter, statusFilter, searchQuery, startDate, endDate]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(text);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const formatCurrency = (amt: number, curr = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: curr,
      minimumFractionDigits: 2,
    }).format(amt);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/10 text-blue-600 flex items-center justify-center font-bold">
              <History className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">System Transaction Ledger</h1>
              <p className="text-sm text-slate-500">
                Global unified audit ledger of all debits and credits across all merchants.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchTransactions}
            disabled={isLoading}
            className="flex items-center gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Filter and Query Panel */}
      <Card className="p-4 border-slate-200 space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="relative md:col-span-2">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by Transaction Reference or Payment Reference"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            />
          </div>

          <div>
            <select
              value={typeFilter}
              onChange={(e) => {
                setTypeFilter(e.target.value as TransactionType | '');
                setCurrentPage(0);
              }}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Types</option>
              <option value="PAYMENT">Payments</option>
              <option value="REFUND">Refunds</option>
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
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-100 text-xs">
          <span className="font-semibold text-slate-500 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" /> Date Range:
          </span>
          <input
            type="date"
            value={startDate}
            onChange={(e) => {
              setStartDate(e.target.value);
              setCurrentPage(0);
            }}
            className="px-2.5 py-1.5 border border-slate-200 rounded-md text-xs bg-white"
          />
          <span className="text-slate-400">to</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => {
              setEndDate(e.target.value);
              setCurrentPage(0);
            }}
            className="px-2.5 py-1.5 border border-slate-200 rounded-md text-xs bg-white"
          />
          {(startDate || endDate || searchQuery || typeFilter || statusFilter || merchantIdFilter) && (
            <button
              type="button"
              onClick={() => {
                setStartDate('');
                setEndDate('');
                setSearchQuery('');
                setTypeFilter('');
                setStatusFilter('');
                setMerchantIdFilter('');
                setCurrentPage(0);
              }}
              className="text-blue-600 hover:text-blue-800 font-semibold ml-auto"
            >
              Reset Filters
            </button>
          )}
        </div>
      </Card>

      {/* Error Message */}
      {errorMessage && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-sm flex items-center space-x-3">
          <AlertTriangle className="w-5 h-5 flex-shrink-0 text-rose-600" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Transactions Table */}
      <Card className="border-slate-200 overflow-hidden">
        {isLoading && transactions.length === 0 ? (
          <PageLoading message="Loading system transactions..." />
        ) : transactions.length === 0 ? (
          <div className="text-center py-16 px-4">
            <History className="w-12 h-12 mx-auto text-slate-300 mb-3" />
            <h3 className="text-base font-semibold text-slate-900">No transactions found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
              No ledger entries match the selected filters across all merchants.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Transaction Reference</th>
                  <th className="px-4 py-3">Merchant</th>
                  <th className="px-4 py-3">Related Payment</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Created At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {transactions.map((tx) => {
                  const isPayment = tx.transactionType === 'PAYMENT';
                  return (
                    <tr key={tx.transactionReference} className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-4 py-3.5">
                        {isPayment ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <ArrowDownLeft className="w-3 h-3 text-emerald-600" />
                            PAYMENT
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
                            <ArrowUpRight className="w-3 h-3 text-purple-600" />
                            REFUND
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3.5 font-mono text-slate-800 font-semibold">
                        <div className="flex items-center space-x-1.5">
                          <span>{tx.transactionReference}</span>
                          <button
                            type="button"
                            onClick={() => handleCopy(tx.transactionReference)}
                            className="text-slate-400 hover:text-slate-600"
                          >
                            {copiedKey === tx.transactionReference ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 font-semibold text-slate-700">
                        <span className="px-2 py-0.5 rounded text-[10px] bg-slate-100 border border-slate-200">
                          {tx.merchantCode}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 font-mono text-slate-600">
                        <span>{tx.paymentReference}</span>
                      </td>
                      <td className="px-4 py-3.5">
                        <span
                          className={`font-bold text-sm ${
                            isPayment ? 'text-emerald-700' : 'text-purple-700'
                          }`}
                        >
                          {isPayment ? '+' : '-'}
                          {formatCurrency(tx.amount, tx.currency)}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <Badge
                          variant={
                            tx.status === 'SUCCESS'
                              ? 'success'
                              : tx.status === 'REFUNDED'
                              ? 'neutral'
                              : tx.status === 'PARTIALLY_REFUNDED'
                              ? 'processing'
                              : tx.status === 'FAILED'
                              ? 'failed'
                              : 'warning'
                          }
                        >
                          {tx.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3.5 text-right text-slate-500 whitespace-nowrap">
                        {new Date(tx.createdAt).toLocaleString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
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
    </div>
  );
};
