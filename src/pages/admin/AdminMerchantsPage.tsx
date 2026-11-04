import React, { useState, useEffect, useCallback } from 'react';
import { merchantService } from '@/services/api/merchantService';
import { MerchantProfile, MerchantStatus } from '@/types/auth';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { PageLoading } from '@/components/common/PageLoading';
import {
  Users,
  Search,
  CheckCircle,
  AlertTriangle,
  XCircle,
  ShieldAlert,
  Building,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Eye,
  RefreshCw,
  AlertCircle,
} from 'lucide-react';
import { ApiError } from '@/types/api';

export const AdminMerchantsPage: React.FC = () => {
  const [merchants, setMerchants] = useState<MerchantProfile[]>([]);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [statusFilter, setStatusFilter] = useState<MerchantStatus | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Merchant Details Inspection Modal
  const [selectedMerchant, setSelectedMerchant] = useState<MerchantProfile | null>(null);

  // Status Action Confirmation State
  const [actionTarget, setActionTarget] = useState<{
    merchant: MerchantProfile;
    action: 'APPROVE' | 'SUSPEND' | 'REJECT';
  } | null>(null);
  const [isProcessingAction, setIsProcessingAction] = useState(false);

  const loadMerchants = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const data = await merchantService.listMerchants({
        status: statusFilter,
        page: currentPage,
        size: 10,
        sortBy: 'createdAt',
        sortDirection: 'desc',
      });
      setMerchants(data.content);
      setTotalElements(data.totalElements);
      setTotalPages(data.totalPages);
    } catch (err: unknown) {
      const apiErr = err as ApiError;
      setErrorMessage(apiErr.message || 'Failed to fetch merchants list');
    } finally {
      setIsLoading(false);
    }
  }, [statusFilter, currentPage]);

  useEffect(() => {
    loadMerchants();
  }, [loadMerchants]);

  const handleConfirmAction = async () => {
    if (!actionTarget) return;

    setIsProcessingAction(true);
    try {
      if (actionTarget.action === 'APPROVE') {
        await merchantService.approveMerchant(actionTarget.merchant.id);
      } else if (actionTarget.action === 'SUSPEND') {
        await merchantService.suspendMerchant(actionTarget.merchant.id);
      } else if (actionTarget.action === 'REJECT') {
        await merchantService.rejectMerchant(actionTarget.merchant.id);
      }
      setActionTarget(null);
      await loadMerchants();
    } catch (err: unknown) {
      const apiErr = err as ApiError;
      setErrorMessage(apiErr.message || `Failed to ${actionTarget.action.toLowerCase()} merchant`);
    } finally {
      setIsProcessingAction(false);
    }
  };

  const filteredMerchants = merchants.filter((m) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      m.businessName.toLowerCase().includes(q) ||
      m.businessEmail.toLowerCase().includes(q) ||
      m.merchantCode.toLowerCase().includes(q)
    );
  });

  const getStatusBadge = (status: MerchantStatus) => {
    switch (status) {
      case 'ACTIVE':
        return <Badge variant="success">ACTIVE</Badge>;
      case 'PENDING':
        return <Badge variant="warning">PENDING APPROVAL</Badge>;
      case 'SUSPENDED':
        return <Badge variant="failed">SUSPENDED</Badge>;
      case 'REJECTED':
        return <Badge variant="failed">REJECTED</Badge>;
      default:
        return <Badge variant="neutral">{status}</Badge>;
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Users className="w-6 h-6 text-blue-600" />
            Merchant Directory & Governance
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Review registration compliance, grant processing status, and monitor onboarded merchant entities
          </p>
        </div>
        <Button
          variant="outline"
          onClick={loadMerchants}
          className="flex items-center space-x-2 text-xs"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh</span>
        </Button>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Status Filter Tabs */}
        <div className="flex items-center space-x-1.5 p-1 bg-slate-100 rounded-lg text-xs font-medium">
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
            All Merchants
          </button>
          <button
            type="button"
            onClick={() => {
              setStatusFilter('PENDING');
              setCurrentPage(0);
            }}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              statusFilter === 'PENDING'
                ? 'bg-white text-amber-800 font-semibold shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Pending Review
          </button>
          <button
            type="button"
            onClick={() => {
              setStatusFilter('ACTIVE');
              setCurrentPage(0);
            }}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              statusFilter === 'ACTIVE'
                ? 'bg-white text-emerald-800 font-semibold shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Active
          </button>
          <button
            type="button"
            onClick={() => {
              setStatusFilter('SUSPENDED');
              setCurrentPage(0);
            }}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              statusFilter === 'SUSPENDED'
                ? 'bg-white text-rose-800 font-semibold shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Suspended
          </button>
          <button
            type="button"
            onClick={() => {
              setStatusFilter('REJECTED');
              setCurrentPage(0);
            }}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              statusFilter === 'REJECTED'
                ? 'bg-white text-slate-800 font-semibold shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Rejected
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search business, code, email..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Error Message */}
      {errorMessage && (
        <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-lg flex items-center space-x-3 text-rose-700 text-sm">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Table Card */}
      <Card className="overflow-hidden border-slate-200 bg-white">
        {isLoading ? (
          <div className="py-16">
            <PageLoading message="Loading merchants registry..." />
          </div>
        ) : filteredMerchants.length === 0 ? (
          <div className="py-16 text-center">
            <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-slate-700">No merchants found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
              {searchQuery
                ? `No merchants matching query "${searchQuery}".`
                : 'No merchants currently exist under this filter.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <th className="px-6 py-3.5">Merchant Code</th>
                  <th className="px-6 py-3.5">Business Entity</th>
                  <th className="px-6 py-3.5">Contact Email</th>
                  <th className="px-4 py-3.5">Status</th>
                  <th className="px-4 py-3.5">Registered</th>
                  <th className="px-6 py-3.5 text-right">Administrative Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredMerchants.map((merchant) => (
                  <tr key={merchant.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-mono font-medium text-slate-900">
                      <span className="bg-slate-100 px-2 py-1 rounded text-slate-800 border border-slate-200">
                        {merchant.merchantCode}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-900">{merchant.businessName}</div>
                      {merchant.businessAddress && (
                        <div className="text-[11px] text-slate-400 truncate max-w-xs">
                          {merchant.businessAddress}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {merchant.businessEmail}
                    </td>
                    <td className="px-4 py-4">
                      {getStatusBadge(merchant.status)}
                    </td>
                    <td className="px-4 py-4 text-slate-500">
                      {merchant.createdAt ? new Date(merchant.createdAt).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          type="button"
                          onClick={() => setSelectedMerchant(merchant)}
                          className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {merchant.status !== 'ACTIVE' && (
                          <button
                            type="button"
                            onClick={() => setActionTarget({ merchant, action: 'APPROVE' })}
                            className="inline-flex items-center space-x-1 px-2.5 py-1 rounded text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors"
                          >
                            <CheckCircle className="w-3.5 h-3.5" />
                            <span>Approve</span>
                          </button>
                        )}

                        {merchant.status === 'ACTIVE' && (
                          <button
                            type="button"
                            onClick={() => setActionTarget({ merchant, action: 'SUSPEND' })}
                            className="inline-flex items-center space-x-1 px-2.5 py-1 rounded text-xs font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 transition-colors"
                          >
                            <AlertTriangle className="w-3.5 h-3.5" />
                            <span>Suspend</span>
                          </button>
                        )}

                        {merchant.status !== 'REJECTED' && (
                          <button
                            type="button"
                            onClick={() => setActionTarget({ merchant, action: 'REJECT' })}
                            className="inline-flex items-center space-x-1 px-2.5 py-1 rounded text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Reject</span>
                          </button>
                        )}
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
              Showing {filteredMerchants.length} of {totalElements} merchants
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

      {/* Merchant Details Modal */}
      {selectedMerchant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <Card className="w-full max-w-lg p-6 bg-white shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                  <Building className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">{selectedMerchant.businessName}</h3>
                  <p className="text-xs font-mono text-slate-500">{selectedMerchant.merchantCode}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedMerchant(null)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg">
                <span className="font-semibold text-slate-500">Status</span>
                {getStatusBadge(selectedMerchant.status)}
              </div>

              <div className="p-2.5 bg-slate-50 rounded-lg flex items-center space-x-2.5">
                <Mail className="w-4 h-4 text-slate-400 flex-shrink-0" />
                <span className="font-medium text-slate-700">{selectedMerchant.businessEmail}</span>
              </div>

              <div className="p-2.5 bg-slate-50 rounded-lg flex items-center space-x-2.5">
                <Phone className="w-4 h-4 text-slate-400 flex-shrink-0" />
                <span className="font-medium text-slate-700">
                  {selectedMerchant.contactNumber || 'No phone number on file'}
                </span>
              </div>

              <div className="p-2.5 bg-slate-50 rounded-lg flex items-start space-x-2.5">
                <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
                <span className="font-medium text-slate-700">
                  {selectedMerchant.businessAddress || 'No address specified'}
                </span>
              </div>

              <div className="p-2.5 bg-slate-50 rounded-lg flex items-center space-x-2.5">
                <Calendar className="w-4 h-4 text-slate-400 flex-shrink-0" />
                <span className="font-medium text-slate-700">
                  Registered: {selectedMerchant.createdAt ? new Date(selectedMerchant.createdAt).toLocaleString() : 'N/A'}
                </span>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <Button variant="outline" onClick={() => setSelectedMerchant(null)}>
                Close
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Confirmation Modal */}
      {actionTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <Card className="w-full max-w-md p-6 bg-white shadow-2xl space-y-5">
            <div className="flex items-start space-x-3 text-slate-900 pb-2 border-b border-slate-100">
              <div className="w-10 h-10 bg-amber-50 rounded-full flex items-center justify-center flex-shrink-0">
                <ShieldAlert className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {actionTarget.action === 'APPROVE' && 'Approve Merchant Account'}
                  {actionTarget.action === 'SUSPEND' && 'Suspend Merchant Processing'}
                  {actionTarget.action === 'REJECT' && 'Reject Merchant Registration'}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">{actionTarget.merchant.businessName}</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to transition merchant{' '}
              <strong className="text-slate-900">{actionTarget.merchant.merchantCode}</strong> to{' '}
              <strong className="text-slate-900">
                {actionTarget.action === 'APPROVE' && 'ACTIVE'}
                {actionTarget.action === 'SUSPEND' && 'SUSPENDED'}
                {actionTarget.action === 'REJECT' && 'REJECTED'}
              </strong>
              ?
              {actionTarget.action === 'APPROVE' &&
                ' This will enable payment processing and live API access for this organization.'}
              {actionTarget.action === 'SUSPEND' &&
                ' This will temporarily block new payment initiation and API calls for this merchant.'}
              {actionTarget.action === 'REJECT' &&
                ' This will mark the registration as denied.'}
            </p>

            <div className="pt-2 flex items-center justify-end space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setActionTarget(null)}
                disabled={isProcessingAction}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant={actionTarget.action === 'APPROVE' ? 'primary' : 'danger'}
                onClick={handleConfirmAction}
                isLoading={isProcessingAction}
              >
                {isProcessingAction
                  ? 'Updating...'
                  : actionTarget.action === 'APPROVE'
                  ? 'Confirm Approval'
                  : actionTarget.action === 'SUSPEND'
                  ? 'Confirm Suspension'
                  : 'Confirm Rejection'}
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
