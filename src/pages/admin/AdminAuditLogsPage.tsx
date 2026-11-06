import React, { useState, useEffect, useCallback } from 'react';
import { auditService } from '@/services/api/auditService';
import { AuditLog } from '@/types/audit';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import {
  ScrollText,
  RefreshCw,
  Search,
  Eye,
  X,
  ShieldCheck,
} from 'lucide-react';

export const AdminAuditLogsPage: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters State
  const [actorId, setActorId] = useState('');
  const [action, setAction] = useState('');
  const [resourceType, setResourceType] = useState('');
  const [resourceId, setResourceId] = useState('');
  const [merchantId, setMerchantId] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  // Drawer / Inspection
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

  const fetchAuditLogs = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await auditService.getAuditLogs({
        actorId: actorId.trim() || undefined,
        action: action.trim() || undefined,
        resourceType: resourceType.trim() || undefined,
        resourceId: resourceId.trim() || undefined,
        merchantId: merchantId ? Number(merchantId) : undefined,
        page,
        size: 15,
      });

      setLogs(data.content);
      setTotalPages(data.totalPages);
      setTotalElements(data.totalElements);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to retrieve audit log entries';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }, [actorId, action, resourceType, resourceId, merchantId, page]);

  useEffect(() => {
    fetchAuditLogs();
  }, [fetchAuditLogs]);

  const handleFilterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(0);
    fetchAuditLogs();
  };

  const handleResetFilters = () => {
    setActorId('');
    setAction('');
    setResourceType('');
    setResourceId('');
    setMerchantId('');
    setPage(0);
  };

  const formatJson = (data: string | null) => {
    if (!data) return null;
    try {
      const parsed = JSON.parse(data);
      return JSON.stringify(parsed, null, 2);
    } catch {
      return data;
    }
  };

  const getActionBadgeVariant = (actionName: string): 'success' | 'processing' | 'failed' | 'warning' | 'neutral' => {
    if (actionName.includes('RESOLVED') || actionName.includes('SUCCESS') || actionName.includes('COMPLETED')) {
      return 'success';
    }
    if (actionName.includes('FAILED') || actionName.includes('DELETED')) {
      return 'failed';
    }
    if (actionName.includes('INITIATED') || actionName.includes('PROCESSING')) {
      return 'processing';
    }
    if (actionName.includes('WARN') || actionName.includes('DISCREPANCY')) {
      return 'warning';
    }
    return 'neutral';
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <ScrollText className="w-7 h-7 text-blue-600" />
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Immutable System Audit Logs</h1>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Tamper-proof, append-only record of administrative actions, compliance events, and state mutations
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm" onClick={fetchAuditLogs}>
            <RefreshCw className="w-4 h-4 mr-1.5" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Filter Card */}
      <Card className="p-4">
        <form onSubmit={handleFilterSubmit} className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                Actor / User
              </label>
              <input
                type="text"
                placeholder="e.g. admin@paycore.com"
                value={actorId}
                onChange={(e) => setActorId(e.target.value)}
                className="w-full text-xs border border-slate-300 rounded-lg p-2 bg-white text-slate-800"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                Action Name
              </label>
              <input
                type="text"
                placeholder="e.g. DISCREPANCY_RESOLVED"
                value={action}
                onChange={(e) => setAction(e.target.value)}
                className="w-full text-xs border border-slate-300 rounded-lg p-2 bg-white text-slate-800"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                Resource Type
              </label>
              <input
                type="text"
                placeholder="e.g. RECONCILIATION_RECORD"
                value={resourceType}
                onChange={(e) => setResourceType(e.target.value)}
                className="w-full text-xs border border-slate-300 rounded-lg p-2 bg-white text-slate-800"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                Resource ID
              </label>
              <input
                type="text"
                placeholder="e.g. 55"
                value={resourceId}
                onChange={(e) => setResourceId(e.target.value)}
                className="w-full text-xs border border-slate-300 rounded-lg p-2 bg-white text-slate-800"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                Merchant ID
              </label>
              <input
                type="number"
                placeholder="e.g. 1"
                value={merchantId}
                onChange={(e) => setMerchantId(e.target.value)}
                className="w-full text-xs border border-slate-300 rounded-lg p-2 bg-white text-slate-800"
              />
            </div>
          </div>

          <div className="flex items-center justify-end space-x-2 pt-1 border-t border-slate-100">
            <Button type="button" variant="ghost" size="sm" onClick={handleResetFilters}>
              Reset Filters
            </Button>
            <Button type="submit" variant="primary" size="sm">
              <Search className="w-3.5 h-3.5 mr-1.5" />
              Filter Logs
            </Button>
          </div>
        </form>
      </Card>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Audit Logs Table */}
      <Card className="p-0 overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span className="text-xs font-semibold text-slate-700">
              Immutable Records ({totalElements} total entries)
            </span>
          </div>
          <span className="text-xs text-slate-400">
            Automated credential & card number sanitization active
          </span>
        </div>

        {isLoading ? (
          <div className="p-12 text-center text-sm text-slate-500">
            Querying immutable audit store...
          </div>
        ) : logs.length === 0 ? (
          <div className="p-12 text-center text-sm text-slate-500">
            No audit log entries matching criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/75 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">Actor</th>
                  <th className="py-3 px-4">Action</th>
                  <th className="py-3 px-4">Target Resource</th>
                  <th className="py-3 px-4">Merchant ID</th>
                  <th className="py-3 px-4">Description</th>
                  <th className="py-3 px-4 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                {logs.map((log) => (
                  <tr
                    key={log.id}
                    className="hover:bg-slate-50/60 transition-colors cursor-pointer"
                    onClick={() => setSelectedLog(log)}
                  >
                    <td className="py-3 px-4 font-mono text-slate-500 whitespace-nowrap">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-800">{log.actorId}</div>
                      <span className="text-[10px] text-slate-400">{log.actorRole || 'SYSTEM'}</span>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant={getActionBadgeVariant(log.action)}>
                        {log.action}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-600">
                      {log.resourceType}:{log.resourceId}
                    </td>
                    <td className="py-3 px-4 text-slate-500">
                      {log.merchantId ?? '—'}
                    </td>
                    <td className="py-3 px-4 text-slate-600 max-w-xs truncate">
                      {log.description || '—'}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedLog(log);
                        }}
                      >
                        <Eye className="w-3.5 h-3.5 mr-1" /> Inspect
                      </Button>
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

      {/* Detailed JSON Inspector Drawer / Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <ScrollText className="w-5 h-5 text-blue-600" />
                <h3 className="font-semibold text-slate-900">
                  Audit Log Details #{selectedLog.id}
                </h3>
              </div>
              <button
                onClick={() => setSelectedLog(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 flex-1">
              {/* Event Metadata Banner */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Action</span>
                  <Badge variant={getActionBadgeVariant(selectedLog.action)}>
                    {selectedLog.action}
                  </Badge>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Actor</span>
                  <span className="font-semibold text-slate-800">{selectedLog.actorId}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Resource</span>
                  <span className="font-mono text-slate-700">{selectedLog.resourceType}:{selectedLog.resourceId}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Recorded At</span>
                  <span className="text-slate-600">{new Date(selectedLog.createdAt).toLocaleString()}</span>
                </div>
              </div>

              {selectedLog.description && (
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">
                    Description
                  </label>
                  <p className="text-xs text-slate-800 bg-slate-50 p-3 rounded-lg border border-slate-200">
                    {selectedLog.description}
                  </p>
                </div>
              )}

              {selectedLog.reason && (
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">
                    Justification / Reason
                  </label>
                  <p className="text-xs text-slate-800 bg-amber-50/50 p-3 rounded-lg border border-amber-200">
                    {selectedLog.reason}
                  </p>
                </div>
              )}

              {/* Before and After State Diff */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">
                    Pre-Action State (Sanitized)
                  </label>
                  <pre className="text-[11px] font-mono bg-slate-900 text-slate-200 p-3 rounded-lg overflow-x-auto max-h-48">
                    {formatJson(selectedLog.beforeData) || 'None recorded'}
                  </pre>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">
                    Post-Action State (Sanitized)
                  </label>
                  <pre className="text-[11px] font-mono bg-slate-900 text-slate-200 p-3 rounded-lg overflow-x-auto max-h-48">
                    {formatJson(selectedLog.afterData) || 'None recorded'}
                  </pre>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end">
              <Button variant="outline" size="sm" onClick={() => setSelectedLog(null)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
