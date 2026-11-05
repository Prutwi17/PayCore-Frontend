import React, { useState, useEffect, useCallback } from 'react';
import { webhookService } from '@/services/api/webhookService';
import {
  WebhookEndpointItem,
  WebhookEndpointCreatePayload,
  WebhookEndpointUpdatePayload,
  WebhookDeliveryItem,
  WebhookDeliveryStatus,
  EndpointStatus,
} from '@/types/webhook';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { PageLoading } from '@/components/common/PageLoading';
import {
  Webhook,
  Plus,
  RefreshCw,
  Copy,
  Check,
  ShieldCheck,
  AlertTriangle,
  RotateCcw,
  Trash2,
  Edit2,
  ExternalLink,
  Clock,
  Activity,
  Radio,
  FileCode,
  XCircle,
} from 'lucide-react';
import { ApiError } from '@/types/api';

const AVAILABLE_EVENTS = [
  'PAYMENT_CREATED',
  'PAYMENT_PROCESSING',
  'PAYMENT_SUCCESS',
  'PAYMENT_FAILED',
  'PAYMENT_CANCELLED',
  'REFUND_CREATED',
  'REFUND_PROCESSING',
  'REFUND_SUCCESS',
  'REFUND_FAILED',
];

export const MerchantWebhooksPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'endpoints' | 'deliveries'>('endpoints');

  // Endpoints State
  const [endpoints, setEndpoints] = useState<WebhookEndpointItem[]>([]);
  const [isLoadingEndpoints, setIsLoadingEndpoints] = useState(true);
  const [endpointError, setEndpointError] = useState<string | null>(null);

  // Deliveries State
  const [deliveries, setDeliveries] = useState<WebhookDeliveryItem[]>([]);
  const [deliveryStatusFilter, setDeliveryStatusFilter] = useState<WebhookDeliveryStatus | undefined>(undefined);
  const [deliveryPage, setDeliveryPage] = useState(0);
  const [totalDeliveryPages, setTotalDeliveryPages] = useState(0);
  const [totalDeliveries, setTotalDeliveries] = useState(0);
  const [isLoadingDeliveries, setIsLoadingDeliveries] = useState(false);
  const [deliveryError, setDeliveryError] = useState<string | null>(null);

  // Modals & Action States
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newUrl, setNewUrl] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [selectedEvents, setSelectedEvents] = useState<string[]>(['*']);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Secret Reveal Modal (one-time exposure)
  const [revealedSecret, setRevealedSecret] = useState<string | null>(null);
  const [revealedEndpointRef, setRevealedEndpointRef] = useState<string>('');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Edit Modal State
  const [editingEndpoint, setEditingEndpoint] = useState<WebhookEndpointItem | null>(null);
  const [editUrl, setEditUrl] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editEvents, setEditEvents] = useState<string[]>([]);

  // Delivery Detail Drawer State
  const [selectedDelivery, setSelectedDelivery] = useState<WebhookDeliveryItem | null>(null);
  const [isRetryingDelivery, setIsRetryingDelivery] = useState(false);

  // Fetch Endpoints
  const fetchEndpoints = useCallback(async () => {
    setIsLoadingEndpoints(true);
    setEndpointError(null);
    try {
      const data = await webhookService.listEndpoints();
      setEndpoints(data);
    } catch (err: unknown) {
      const error = err as ApiError;
      setEndpointError(error.message || 'Failed to load webhook endpoints.');
    } finally {
      setIsLoadingEndpoints(false);
    }
  }, []);

  // Fetch Deliveries
  const fetchDeliveries = useCallback(async () => {
    setIsLoadingDeliveries(true);
    setDeliveryError(null);
    try {
      const data = await webhookService.listDeliveries({
        status: deliveryStatusFilter,
        page: deliveryPage,
        size: 10,
      });
      setDeliveries(data.content);
      setTotalDeliveryPages(data.totalPages);
      setTotalDeliveries(data.totalElements);
    } catch (err: unknown) {
      const error = err as ApiError;
      setDeliveryError(error.message || 'Failed to load webhook delivery history.');
    } finally {
      setIsLoadingDeliveries(false);
    }
  }, [deliveryStatusFilter, deliveryPage]);

  useEffect(() => {
    fetchEndpoints();
  }, [fetchEndpoints]);

  useEffect(() => {
    if (activeTab === 'deliveries') {
      fetchDeliveries();
    }
  }, [activeTab, fetchDeliveries]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(text);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const handleToggleSelectAll = (isEdit = false) => {
    if (isEdit) {
      if (editEvents.includes('*')) {
        setEditEvents([]);
      } else {
        setEditEvents(['*']);
      }
    } else {
      if (selectedEvents.includes('*')) {
        setSelectedEvents([]);
      } else {
        setSelectedEvents(['*']);
      }
    }
  };

  const handleToggleEvent = (eventName: string, isEdit = false) => {
    if (isEdit) {
      if (editEvents.includes('*')) {
        setEditEvents([eventName]);
      } else if (editEvents.includes(eventName)) {
        setEditEvents(editEvents.filter((e) => e !== eventName));
      } else {
        setEditEvents([...editEvents, eventName]);
      }
    } else {
      if (selectedEvents.includes('*')) {
        setSelectedEvents([eventName]);
      } else if (selectedEvents.includes(eventName)) {
        setSelectedEvents(selectedEvents.filter((e) => e !== eventName));
      } else {
        setSelectedEvents([...selectedEvents, eventName]);
      }
    }
  };

  // Create Endpoint
  const handleCreateEndpoint = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUrl.trim()) return;

    setIsSubmitting(true);
    try {
      const payload: WebhookEndpointCreatePayload = {
        url: newUrl.trim(),
        description: newDescription.trim() || undefined,
        subscribedEvents: selectedEvents.length === 0 ? '*' : selectedEvents.join(','),
      };
      const created = await webhookService.createEndpoint(payload);
      setShowCreateModal(false);
      setNewUrl('');
      setNewDescription('');
      setSelectedEvents(['*']);
      fetchEndpoints();

      // Show secret reveal modal
      if (created.secret) {
        setRevealedSecret(created.secret);
        setRevealedEndpointRef(created.endpointReference);
      }
    } catch (err: unknown) {
      const error = err as ApiError;
      alert(error.message || 'Failed to register webhook endpoint.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Open Edit Modal
  const handleOpenEdit = (ep: WebhookEndpointItem) => {
    setEditingEndpoint(ep);
    setEditUrl(ep.url);
    setEditDescription(ep.description || '');
    setEditEvents(ep.subscribedEvents.split(',').map((s) => s.trim()));
  };

  // Save Edit
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEndpoint || !editUrl.trim()) return;

    setIsSubmitting(true);
    try {
      const payload: WebhookEndpointUpdatePayload = {
        url: editUrl.trim(),
        description: editDescription.trim() || undefined,
        subscribedEvents: editEvents.length === 0 ? '*' : editEvents.join(','),
      };
      await webhookService.updateEndpoint(editingEndpoint.endpointReference, payload);
      setEditingEndpoint(null);
      fetchEndpoints();
    } catch (err: unknown) {
      const error = err as ApiError;
      alert(error.message || 'Failed to update webhook endpoint.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Toggle Active/Inactive
  const handleToggleStatus = async (ep: WebhookEndpointItem) => {
    const nextStatus: EndpointStatus = ep.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    try {
      await webhookService.updateEndpointStatus(ep.endpointReference, nextStatus);
      fetchEndpoints();
    } catch (err: unknown) {
      const error = err as ApiError;
      alert(error.message || 'Failed to update status.');
    }
  };

  // Rotate Secret
  const handleRotateSecret = async (ep: WebhookEndpointItem) => {
    if (!window.confirm(`Are you sure you want to rotate the signing secret for ${ep.endpointReference}? Previous signatures will immediately fail verification.`)) {
      return;
    }

    try {
      const rotated = await webhookService.rotateSecret(ep.endpointReference);
      fetchEndpoints();
      if (rotated.secret) {
        setRevealedSecret(rotated.secret);
        setRevealedEndpointRef(rotated.endpointReference);
      }
    } catch (err: unknown) {
      const error = err as ApiError;
      alert(error.message || 'Failed to rotate signing secret.');
    }
  };

  // Delete Endpoint
  const handleDeleteEndpoint = async (ep: WebhookEndpointItem) => {
    if (!window.confirm(`Are you sure you want to delete endpoint ${ep.endpointReference}? This cannot be undone.`)) {
      return;
    }

    try {
      await webhookService.deleteEndpoint(ep.endpointReference);
      fetchEndpoints();
    } catch (err: unknown) {
      const error = err as ApiError;
      alert(error.message || 'Failed to delete endpoint.');
    }
  };

  // Manual Retry Delivery
  const handleRetryDelivery = async (attemptReference: string) => {
    setIsRetryingDelivery(true);
    try {
      const redelivered = await webhookService.retryDelivery(attemptReference);
      setSelectedDelivery(redelivered);
      fetchDeliveries();
    } catch (err: unknown) {
      const error = err as ApiError;
      alert(error.message || 'Failed to re-trigger delivery.');
    } finally {
      setIsRetryingDelivery(false);
    }
  };

  const getStatusBadge = (status: EndpointStatus) => {
    switch (status) {
      case 'ACTIVE':
        return <Badge variant="success">Active</Badge>;
      case 'INACTIVE':
        return <Badge variant="neutral">Inactive</Badge>;
      case 'DISABLED':
        return <Badge variant="failed">Disabled</Badge>;
    }
  };

  const getDeliveryStatusBadge = (status: WebhookDeliveryStatus) => {
    switch (status) {
      case 'SUCCESS':
        return <Badge variant="success">Success</Badge>;
      case 'RETRYING':
        return <Badge variant="warning">Retrying</Badge>;
      case 'DEAD_LETTER':
        return <Badge variant="failed">Dead Letter</Badge>;
      case 'FAILED':
        return <Badge variant="failed">Failed</Badge>;
      case 'PENDING':
        return <Badge variant="neutral">Pending</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Webhook className="w-6 h-6 text-blue-600" />
            Webhooks & Event Delivery
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Receive automated real-time notifications for payment and refund status events signed with HMAC-SHA256.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              if (activeTab === 'endpoints') fetchEndpoints();
              else fetchDeliveries();
            }}
            className="flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>
          <Button
            size="sm"
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus className="w-4 h-4" />
            Register Webhook
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('endpoints')}
            className={`py-3 px-1 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors ${
              activeTab === 'endpoints'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            }`}
          >
            <Radio className="w-4 h-4" />
            Webhook Endpoints ({endpoints.length})
          </button>
          <button
            onClick={() => setActiveTab('deliveries')}
            className={`py-3 px-1 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors ${
              activeTab === 'deliveries'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            }`}
          >
            <Activity className="w-4 h-4" />
            Delivery History {totalDeliveries > 0 ? `(${totalDeliveries})` : ''}
          </button>
        </nav>
      </div>

      {/* ================= TAB 1: ENDPOINTS ================= */}
      {activeTab === 'endpoints' && (
        <div className="space-y-4">
          {endpointError && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 flex-shrink-0 text-red-500" />
              <span>{endpointError}</span>
            </div>
          )}

          {isLoadingEndpoints ? (
            <PageLoading message="Loading webhook endpoints..." />
          ) : endpoints.length === 0 ? (
            <Card className="text-center py-12 px-4">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Webhook className="w-6 h-6" />
              </div>
              <h3 className="text-base font-semibold text-slate-900 mb-1">No Webhook Endpoints Configured</h3>
              <p className="text-sm text-slate-500 max-w-md mx-auto mb-6">
                Register an HTTPS destination endpoint to start receiving real-time event notifications for payment completions, failures, and refunds.
              </p>
              <Button onClick={() => setShowCreateModal(true)} className="bg-blue-600 hover:bg-blue-700 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Register First Webhook
              </Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {endpoints.map((ep) => {
                const isAllEvents = ep.subscribedEvents === '*' || ep.subscribedEvents === '';
                const eventBadges = isAllEvents
                  ? ['* (All Events)']
                  : ep.subscribedEvents.split(',').map((s) => s.trim());

                return (
                  <Card key={ep.endpointReference} className="p-5 hover:border-slate-300 transition-all">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      {/* Left: Endpoint details */}
                      <div className="space-y-2 min-w-0 flex-1">
                        <div className="flex items-center gap-3 flex-wrap">
                          <span className="font-mono text-sm font-semibold text-slate-900">
                            {ep.endpointReference}
                          </span>
                          {getStatusBadge(ep.status)}
                          {ep.failureCount > 0 && (
                            <Badge variant="warning">
                              {ep.failureCount} Consecutive Failures
                            </Badge>
                          )}
                        </div>

                        <div className="flex items-center gap-2 text-slate-700 text-sm font-mono bg-slate-50 px-3 py-1.5 rounded-md border border-slate-200 overflow-x-auto">
                          <ExternalLink className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                          <span className="truncate">{ep.url}</span>
                        </div>

                        {ep.description && (
                          <p className="text-xs text-slate-500">{ep.description}</p>
                        )}

                        {/* Event tags */}
                        <div className="flex items-center gap-1.5 flex-wrap pt-1">
                          <span className="text-xs text-slate-400 font-medium">Subscribed:</span>
                          {eventBadges.map((ev) => (
                            <span
                              key={ev}
                              className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-blue-50 text-blue-700 border border-blue-100"
                            >
                              {ev}
                            </span>
                          ))}
                        </div>

                        {/* Secret Mask */}
                        <div className="flex items-center gap-2 text-xs text-slate-500 pt-1">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Signing Secret:</span>
                          <span className="font-mono text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                            {ep.maskedSecret}
                          </span>
                        </div>
                      </div>

                      {/* Right: Actions */}
                      <div className="flex flex-wrap items-center gap-2 pt-2 lg:pt-0">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleToggleStatus(ep)}
                          className={ep.status === 'ACTIVE' ? 'text-amber-600' : 'text-emerald-600'}
                        >
                          {ep.status === 'ACTIVE' ? 'Pause' : 'Activate'}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenEdit(ep)}
                          className="flex items-center gap-1"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRotateSecret(ep)}
                          className="flex items-center gap-1 text-slate-700 hover:text-amber-700"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          Rotate Secret
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteEndpoint(ep)}
                          className="flex items-center gap-1 text-red-600 hover:bg-red-50 hover:border-red-200"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ================= TAB 2: DELIVERIES ================= */}
      {activeTab === 'deliveries' && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <Card className="p-4">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-slate-700">Filter Status:</span>
                <select
                  value={deliveryStatusFilter || ''}
                  onChange={(e) => {
                    setDeliveryStatusFilter(
                      (e.target.value as WebhookDeliveryStatus) || undefined
                    );
                    setDeliveryPage(0);
                  }}
                  className="text-sm rounded-md border border-slate-300 px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Statuses</option>
                  <option value="SUCCESS">Success</option>
                  <option value="RETRYING">Retrying</option>
                  <option value="DEAD_LETTER">Dead Letter</option>
                  <option value="FAILED">Failed</option>
                  <option value="PENDING">Pending</option>
                </select>
              </div>
              <span className="text-xs text-slate-500 self-center">
                Showing page {deliveryPage + 1} of {Math.max(1, totalDeliveryPages)} ({totalDeliveries} total records)
              </span>
            </div>
          </Card>

          {deliveryError && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 flex-shrink-0 text-red-500" />
              <span>{deliveryError}</span>
            </div>
          )}

          {isLoadingDeliveries ? (
            <PageLoading message="Loading delivery logs..." />
          ) : deliveries.length === 0 ? (
            <Card className="text-center py-12 px-4">
              <Clock className="w-10 h-10 text-slate-400 mx-auto mb-3" />
              <h3 className="text-base font-semibold text-slate-900 mb-1">No Delivery Attempts Found</h3>
              <p className="text-sm text-slate-500 max-w-sm mx-auto">
                {deliveryStatusFilter
                  ? `No delivery attempts match the filter '${deliveryStatusFilter}'.`
                  : 'Delivery attempts will appear here when domain events trigger webhook notifications.'}
              </p>
            </Card>
          ) : (
            <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-600">
                  <thead className="bg-slate-50 border-b border-slate-200 text-xs font-semibold uppercase text-slate-500">
                    <tr>
                      <th className="px-4 py-3">Event Type</th>
                      <th className="px-4 py-3">Destination URL</th>
                      <th className="px-4 py-3">Attempt</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">HTTP Code</th>
                      <th className="px-4 py-3">Latency</th>
                      <th className="px-4 py-3">Attempted At</th>
                      <th className="px-4 py-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {deliveries.map((d) => (
                      <tr key={d.attemptReference} className="hover:bg-slate-50/70 transition-colors">
                        <td className="px-4 py-3 font-mono font-medium text-xs text-blue-600">
                          {d.eventType}
                        </td>
                        <td className="px-4 py-3 font-mono text-xs text-slate-700 max-w-[240px] truncate" title={d.requestUrl}>
                          {d.requestUrl}
                        </td>
                        <td className="px-4 py-3 font-medium text-xs text-slate-700">
                          #{d.attemptNumber}/5
                        </td>
                        <td className="px-4 py-3">
                          {getDeliveryStatusBadge(d.deliveryStatus)}
                        </td>
                        <td className="px-4 py-3 font-mono text-xs">
                          {d.httpStatusCode ? (
                            <span
                              className={`font-semibold ${
                                d.httpStatusCode >= 200 && d.httpStatusCode < 300
                                  ? 'text-emerald-600'
                                  : 'text-red-600'
                              }`}
                            >
                              {d.httpStatusCode}
                            </span>
                          ) : (
                            <span className="text-slate-400">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-xs text-slate-500">
                          {d.executionDurationMs != null ? `${d.executionDurationMs} ms` : '—'}
                        </td>
                        <td className="px-4 py-3 text-xs text-slate-500 whitespace-nowrap">
                          {new Date(d.attemptedAt).toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedDelivery(d)}
                            className="text-xs px-2.5 py-1"
                          >
                            Inspect
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination controls */}
              {totalDeliveryPages > 1 && (
                <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-t border-slate-200">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={deliveryPage === 0}
                    onClick={() => setDeliveryPage((p) => Math.max(0, p - 1))}
                  >
                    Previous
                  </Button>
                  <span className="text-xs text-slate-600">
                    Page {deliveryPage + 1} of {totalDeliveryPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={deliveryPage >= totalDeliveryPages - 1}
                    onClick={() => setDeliveryPage((p) => p + 1)}
                  >
                    Next
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ================= MODAL: REGISTER WEBHOOK ================= */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Webhook className="w-5 h-5 text-blue-600" />
                Register Webhook Endpoint
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateEndpoint} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                  Destination URL *
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://example.com/api/webhooks"
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  className="w-full text-sm border border-slate-300 rounded-md px-3 py-2 font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Must be an active HTTPS server. SSRF security blocks localhost, private IPs (10.*, 192.168.*), and cloud metadata.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                  Description (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Production Order Fulfillment Server"
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full text-sm border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                    Subscribed Events
                  </label>
                  <button
                    type="button"
                    onClick={() => handleToggleSelectAll(false)}
                    className="text-xs text-blue-600 hover:underline font-medium"
                  >
                    {selectedEvents.includes('*') ? 'Deselect All' : 'Select All (*)'}
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2 border border-slate-200 rounded-md p-3 max-h-48 overflow-y-auto">
                  {AVAILABLE_EVENTS.map((ev) => (
                    <label key={ev} className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedEvents.includes('*') || selectedEvents.includes(ev)}
                        onChange={() => handleToggleEvent(ev, false)}
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="font-mono truncate">{ev}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowCreateModal(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting || !newUrl.trim()}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {isSubmitting ? 'Registering...' : 'Register Endpoint'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: EDIT WEBHOOK ================= */}
      {editingEndpoint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Edit2 className="w-5 h-5 text-blue-600" />
                Edit Webhook Endpoint
              </h3>
              <button
                onClick={() => setEditingEndpoint(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                  Destination URL *
                </label>
                <input
                  type="url"
                  required
                  value={editUrl}
                  onChange={(e) => setEditUrl(e.target.value)}
                  className="w-full text-sm border border-slate-300 rounded-md px-3 py-2 font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                  Description
                </label>
                <input
                  type="text"
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full text-sm border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                    Subscribed Events
                  </label>
                  <button
                    type="button"
                    onClick={() => handleToggleSelectAll(true)}
                    className="text-xs text-blue-600 hover:underline font-medium"
                  >
                    {editEvents.includes('*') ? 'Deselect All' : 'Select All (*)'}
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2 border border-slate-200 rounded-md p-3 max-h-48 overflow-y-auto">
                  {AVAILABLE_EVENTS.map((ev) => (
                    <label key={ev} className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editEvents.includes('*') || editEvents.includes(ev)}
                        onChange={() => handleToggleEvent(ev, true)}
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="font-mono truncate">{ev}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditingEndpoint(null)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting || !editUrl.trim()}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {isSubmitting ? 'Saving Changes...' : 'Save Changes'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: SECRET REVEAL (ONE-TIME ONLY) ================= */}
      {revealedSecret && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6 space-y-4 border-2 border-emerald-500 animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-3 text-emerald-600">
              <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Webhook Signing Secret</h3>
                <p className="text-xs text-slate-500 font-mono">{revealedEndpointRef}</p>
              </div>
            </div>

            <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800 space-y-1">
              <p className="font-semibold flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                This signing secret will NEVER be displayed again!
              </p>
              <p>
                Store this secret securely in your application's environment configuration. PayCore signs all outgoing HTTP requests using this HMAC-SHA256 secret.
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Signing Secret (HMAC-SHA256)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={revealedSecret}
                  className="w-full text-xs font-mono font-semibold bg-slate-100 border border-slate-300 rounded px-3 py-2 text-slate-800 select-all"
                />
                <Button
                  size="sm"
                  onClick={() => handleCopy(revealedSecret)}
                  className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-900 text-white flex-shrink-0"
                >
                  {copiedKey === revealedSecret ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copy
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Signature Verification Quick Guide */}
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs text-slate-600 space-y-1.5">
              <span className="font-semibold text-slate-800 flex items-center gap-1">
                <FileCode className="w-3.5 h-3.5 text-blue-600" />
                Header Verification Standard:
              </span>
              <p className="font-mono text-[11px] text-slate-700 bg-white p-2 rounded border border-slate-200">
                X-PayCore-Signature: t=1730000000,v1=abcdef...<br />
                X-PayCore-Event: PAYMENT_SUCCESS
              </p>
              <p className="text-[11px] text-slate-500">
                Compute HMAC-SHA256 on <code>timestamp + "." + rawBody</code> using your secret key and perform a constant-time comparison.
              </p>
            </div>

            <div className="pt-2">
              <Button
                onClick={() => setRevealedSecret(null)}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium"
              >
                I Have Safely Copied This Secret
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ================= DRAWER / MODAL: INSPECT DELIVERY ATTEMPT ================= */}
      {selectedDelivery && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-blue-600" />
                  Delivery Attempt Details
                </h3>
                <span className="text-xs font-mono text-slate-500">
                  {selectedDelivery.attemptReference}
                </span>
              </div>
              <button
                onClick={() => setSelectedDelivery(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            {/* Quick status grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs">
              <div>
                <span className="text-slate-500 block">Status:</span>
                <span className="font-semibold">{getDeliveryStatusBadge(selectedDelivery.deliveryStatus)}</span>
              </div>
              <div>
                <span className="text-slate-500 block">HTTP Code:</span>
                <span className="font-semibold font-mono">{selectedDelivery.httpStatusCode || 'None'}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Attempt:</span>
                <span className="font-semibold">#{selectedDelivery.attemptNumber} of 5</span>
              </div>
              <div>
                <span className="text-slate-500 block">Latency:</span>
                <span className="font-semibold">{selectedDelivery.executionDurationMs != null ? `${selectedDelivery.executionDurationMs} ms` : '—'}</span>
              </div>
            </div>

            {/* Destination URL */}
            <div className="space-y-1">
              <span className="text-xs font-semibold uppercase text-slate-500">Request URL:</span>
              <p className="font-mono text-xs bg-slate-100 p-2 rounded border border-slate-200 break-all text-slate-800">
                {selectedDelivery.requestUrl}
              </p>
            </div>

            {/* Failure Reason if present */}
            {selectedDelivery.failureReason && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 space-y-1">
                <span className="font-semibold flex items-center gap-1">
                  <XCircle className="w-4 h-4 text-red-500" />
                  Delivery Failure Reason:
                </span>
                <p className="font-mono break-all">{selectedDelivery.failureReason}</p>
              </div>
            )}

            {/* Next retry time if retrying */}
            {selectedDelivery.nextRetryAt && selectedDelivery.deliveryStatus === 'RETRYING' && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800 flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-600 flex-shrink-0" />
                <span>Next automated retry scheduled at: <strong>{new Date(selectedDelivery.nextRetryAt).toLocaleString()}</strong></span>
              </div>
            )}

            {/* Response Body if available */}
            {selectedDelivery.responseBody && (
              <div className="space-y-1">
                <span className="text-xs font-semibold uppercase text-slate-500">Response Body:</span>
                <pre className="font-mono text-[11px] bg-slate-900 text-slate-200 p-3 rounded-lg overflow-x-auto max-h-40">
                  {selectedDelivery.responseBody}
                </pre>
              </div>
            )}

            {/* Action Bar */}
            <div className="flex items-center justify-between pt-3 border-t">
              <span className="text-xs text-slate-500">
                Attempted: {new Date(selectedDelivery.attemptedAt).toLocaleString()}
              </span>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  onClick={() => setSelectedDelivery(null)}
                >
                  Close
                </Button>
                <Button
                  disabled={isRetryingDelivery}
                  onClick={() => handleRetryDelivery(selectedDelivery.attemptReference)}
                  className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <RotateCcw className={`w-3.5 h-3.5 ${isRetryingDelivery ? 'animate-spin' : ''}`} />
                  {isRetryingDelivery ? 'Retrying...' : 'Retry Now'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
