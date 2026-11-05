import React, { useState, useEffect, useCallback } from 'react';
import { webhookService } from '@/services/api/webhookService';
import {
  WebhookDeliveryItem,
  OutboxEventItem,
  InboxEventItem,
  WebhookMetricsResponse,
  WebhookDeliveryStatus,
  OutboxStatus,
  InboxStatus,
} from '@/types/webhook';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { PageLoading } from '@/components/common/PageLoading';
import {
  Webhook,
  RefreshCw,
  AlertTriangle,
  RotateCcw,
  Activity,
  Layers,
  Inbox,
  Send,
  Skull,
  TrendingUp,
  XCircle,
} from 'lucide-react';
import { ApiError } from '@/types/api';

export const AdminWebhooksPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'deliveries' | 'dlq' | 'outbox' | 'inbox'>('deliveries');

  // Metrics State
  const [metrics, setMetrics] = useState<WebhookMetricsResponse | null>(null);
  const [isLoadingMetrics, setIsLoadingMetrics] = useState(true);

  // Deliveries Tab State
  const [deliveries, setDeliveries] = useState<WebhookDeliveryItem[]>([]);
  const [deliveryStatusFilter, setDeliveryStatusFilter] = useState<WebhookDeliveryStatus | undefined>(undefined);
  const [deliveryPage, setDeliveryPage] = useState(0);
  const [totalDeliveryPages, setTotalDeliveryPages] = useState(0);
  const [totalDeliveries, setTotalDeliveries] = useState(0);
  const [isLoadingDeliveries, setIsLoadingDeliveries] = useState(false);

  // DLQ Tab State
  const [dlqDeliveries, setDlqDeliveries] = useState<WebhookDeliveryItem[]>([]);
  const [dlqPage, setDlqPage] = useState(0);
  const [totalDlqPages, setTotalDlqPages] = useState(0);
  const [totalDlqElements, setTotalDlqElements] = useState(0);
  const [isLoadingDlq, setIsLoadingDlq] = useState(false);

  // Outbox Tab State
  const [outboxEvents, setOutboxEvents] = useState<OutboxEventItem[]>([]);
  const [outboxStatusFilter, setOutboxStatusFilter] = useState<OutboxStatus | undefined>(undefined);
  const [outboxPage, setOutboxPage] = useState(0);
  const [totalOutboxPages, setTotalOutboxPages] = useState(0);
  const [totalOutboxElements, setTotalOutboxElements] = useState(0);
  const [isLoadingOutbox, setIsLoadingOutbox] = useState(false);

  // Inbox Tab State
  const [inboxEvents, setInboxEvents] = useState<InboxEventItem[]>([]);
  const [inboxStatusFilter, setInboxStatusFilter] = useState<InboxStatus | undefined>(undefined);
  const [inboxPage, setInboxPage] = useState(0);
  const [totalInboxPages, setTotalInboxPages] = useState(0);
  const [totalInboxElements, setTotalInboxElements] = useState(0);
  const [isLoadingInbox, setIsLoadingInbox] = useState(false);

  // Modal / Detail State
  const [inspectDelivery, setInspectDelivery] = useState<WebhookDeliveryItem | null>(null);
  const [inspectOutbox, setInspectOutbox] = useState<OutboxEventItem | null>(null);
  const [isReplaying, setIsReplaying] = useState(false);
  const [isRepublishing, setIsRepublishing] = useState(false);

  // Load Metrics
  const fetchMetrics = useCallback(async () => {
    setIsLoadingMetrics(true);
    try {
      const data = await webhookService.getMetrics();
      setMetrics(data);
    } catch {
      // Non-blocking
    } finally {
      setIsLoadingMetrics(false);
    }
  }, []);

  // Load Deliveries
  const fetchDeliveries = useCallback(async () => {
    setIsLoadingDeliveries(true);
    try {
      const data = await webhookService.listAdminDeliveries({
        status: deliveryStatusFilter,
        page: deliveryPage,
        size: 10,
      });
      setDeliveries(data.content);
      setTotalDeliveryPages(data.totalPages);
      setTotalDeliveries(data.totalElements);
    } catch {
      // Non-blocking
    } finally {
      setIsLoadingDeliveries(false);
    }
  }, [deliveryStatusFilter, deliveryPage]);

  // Load DLQ
  const fetchDlq = useCallback(async () => {
    setIsLoadingDlq(true);
    try {
      const data = await webhookService.listDeadLetterDeliveries({
        page: dlqPage,
        size: 10,
      });
      setDlqDeliveries(data.content);
      setTotalDlqPages(data.totalPages);
      setTotalDlqElements(data.totalElements);
    } catch {
      // Non-blocking
    } finally {
      setIsLoadingDlq(false);
    }
  }, [dlqPage]);

  // Load Outbox
  const fetchOutbox = useCallback(async () => {
    setIsLoadingOutbox(true);
    try {
      const data = await webhookService.listOutboxEvents({
        status: outboxStatusFilter,
        page: outboxPage,
        size: 10,
      });
      setOutboxEvents(data.content);
      setTotalOutboxPages(data.totalPages);
      setTotalOutboxElements(data.totalElements);
    } catch {
      // Non-blocking
    } finally {
      setIsLoadingOutbox(false);
    }
  }, [outboxStatusFilter, outboxPage]);

  // Load Inbox
  const fetchInbox = useCallback(async () => {
    setIsLoadingInbox(true);
    try {
      const data = await webhookService.listInboxEvents({
        status: inboxStatusFilter,
        page: inboxPage,
        size: 10,
      });
      setInboxEvents(data.content);
      setTotalInboxPages(data.totalPages);
      setTotalInboxElements(data.totalElements);
    } catch {
      // Non-blocking
    } finally {
      setIsLoadingInbox(false);
    }
  }, [inboxStatusFilter, inboxPage]);

  useEffect(() => {
    fetchMetrics();
  }, [fetchMetrics]);

  useEffect(() => {
    if (activeTab === 'deliveries') fetchDeliveries();
    if (activeTab === 'dlq') fetchDlq();
    if (activeTab === 'outbox') fetchOutbox();
    if (activeTab === 'inbox') fetchInbox();
  }, [activeTab, fetchDeliveries, fetchDlq, fetchOutbox, fetchInbox]);

  const handleRefreshAll = () => {
    fetchMetrics();
    if (activeTab === 'deliveries') fetchDeliveries();
    if (activeTab === 'dlq') fetchDlq();
    if (activeTab === 'outbox') fetchOutbox();
    if (activeTab === 'inbox') fetchInbox();
  };

  // Admin Force Replay
  const handleReplayDelivery = async (attemptReference: string) => {
    setIsReplaying(true);
    try {
      const replayed = await webhookService.replayDelivery(attemptReference);
      setInspectDelivery(replayed);
      fetchMetrics();
      if (activeTab === 'deliveries') fetchDeliveries();
      if (activeTab === 'dlq') fetchDlq();
    } catch (err: unknown) {
      const error = err as ApiError;
      alert(error.message || 'Failed to replay delivery.');
    } finally {
      setIsReplaying(false);
    }
  };

  // Admin Force Republish Outbox Event
  const handleRepublishOutbox = async (eventId: string) => {
    setIsRepublishing(true);
    try {
      const repub = await webhookService.republishOutboxEvent(eventId);
      setInspectOutbox(repub);
      fetchMetrics();
      fetchOutbox();
    } catch (err: unknown) {
      const error = err as ApiError;
      alert(error.message || 'Failed to republish outbox event.');
    } finally {
      setIsRepublishing(false);
    }
  };

  const getDeliveryBadge = (st: WebhookDeliveryStatus) => {
    switch (st) {
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

  const getOutboxBadge = (st: OutboxStatus) => {
    switch (st) {
      case 'PUBLISHED':
        return <Badge variant="success">Published</Badge>;
      case 'PENDING':
        return <Badge variant="warning">Pending</Badge>;
      case 'FAILED':
        return <Badge variant="failed">Failed</Badge>;
    }
  };

  const getInboxBadge = (st: InboxStatus) => {
    switch (st) {
      case 'PROCESSED':
        return <Badge variant="success">Processed</Badge>;
      case 'PROCESSING':
        return <Badge variant="warning">Processing</Badge>;
      case 'RECEIVED':
        return <Badge variant="neutral">Received</Badge>;
      case 'FAILED':
        return <Badge variant="failed">Failed</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Webhook className="w-6 h-6 text-blue-600" />
            Webhook & Async Event Pipeline
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Global monitoring for Transactional Outbox, Kafka event consumers, webhook delivery retries, and dead-letter queues.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefreshAll}
          className="flex items-center gap-2 self-start sm:self-auto"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh Pipeline
        </Button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="p-4 border-l-4 border-l-blue-500">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Total Deliveries</span>
            <Activity className="w-4 h-4 text-blue-500" />
          </div>
          <span className="text-2xl font-bold text-slate-900">
            {isLoadingMetrics ? '—' : metrics?.totalDeliveries ?? 0}
          </span>
        </Card>

        <Card className="p-4 border-l-4 border-l-emerald-500">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Success Rate</span>
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          </div>
          <span className="text-2xl font-bold text-emerald-600">
            {isLoadingMetrics
              ? '—'
              : `${(metrics?.deliverySuccessRate ?? 100).toFixed(1)}%`}
          </span>
        </Card>

        <Card className="p-4 border-l-4 border-l-amber-500">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Outbox Pending</span>
            <Send className="w-4 h-4 text-amber-500" />
          </div>
          <span className="text-2xl font-bold text-amber-600">
            {isLoadingMetrics ? '—' : metrics?.pendingOutboxCount ?? 0}
          </span>
        </Card>

        <Card className="p-4 border-l-4 border-l-red-500">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Outbox Failed</span>
            <AlertTriangle className="w-4 h-4 text-red-500" />
          </div>
          <span className="text-2xl font-bold text-red-600">
            {isLoadingMetrics ? '—' : metrics?.failedOutboxCount ?? 0}
          </span>
        </Card>

        <Card className="p-4 border-l-4 border-l-purple-500">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Dead-Letter Queue</span>
            <Skull className="w-4 h-4 text-purple-500" />
          </div>
          <span className="text-2xl font-bold text-purple-600">
            {isLoadingMetrics ? '—' : metrics?.deadLetterDeliveries ?? 0}
          </span>
        </Card>
      </div>

      {/* Pipeline Navigation Tabs */}
      <div className="border-b border-slate-200">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('deliveries')}
            className={`py-3 px-1 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors ${
              activeTab === 'deliveries'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            }`}
          >
            <Activity className="w-4 h-4" />
            All Deliveries
          </button>
          <button
            onClick={() => setActiveTab('dlq')}
            className={`py-3 px-1 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors ${
              activeTab === 'dlq'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            }`}
          >
            <Skull className="w-4 h-4" />
            Dead-Letter Queue {totalDlqElements > 0 ? `(${totalDlqElements})` : ''}
          </button>
          <button
            onClick={() => setActiveTab('outbox')}
            className={`py-3 px-1 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors ${
              activeTab === 'outbox'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            }`}
          >
            <Layers className="w-4 h-4" />
            Transactional Outbox
          </button>
          <button
            onClick={() => setActiveTab('inbox')}
            className={`py-3 px-1 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors ${
              activeTab === 'inbox'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            }`}
          >
            <Inbox className="w-4 h-4" />
            Idempotent Inbox Consumers
          </button>
        </nav>
      </div>

      {/* ================= TAB 1: ALL DELIVERIES ================= */}
      {activeTab === 'deliveries' && (
        <div className="space-y-4">
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
                Page {deliveryPage + 1} of {Math.max(1, totalDeliveryPages)} ({totalDeliveries} total records)
              </span>
            </div>
          </Card>

          {isLoadingDeliveries ? (
            <PageLoading message="Loading global deliveries..." />
          ) : deliveries.length === 0 ? (
            <Card className="text-center py-12 px-4 text-slate-500 text-sm">
              No delivery records found matching filter.
            </Card>
          ) : (
            <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-600">
                  <thead className="bg-slate-50 border-b border-slate-200 text-xs font-semibold uppercase text-slate-500">
                    <tr>
                      <th className="px-4 py-3">Merchant ID</th>
                      <th className="px-4 py-3">Event Type</th>
                      <th className="px-4 py-3">Destination URL</th>
                      <th className="px-4 py-3">Attempt</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">HTTP</th>
                      <th className="px-4 py-3">Latency</th>
                      <th className="px-4 py-3">Timestamp</th>
                      <th className="px-4 py-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {deliveries.map((d) => (
                      <tr key={d.attemptReference} className="hover:bg-slate-50/70 transition-colors">
                        <td className="px-4 py-3 font-mono text-xs font-semibold text-slate-700">
                          M-{d.merchantId}
                        </td>
                        <td className="px-4 py-3 font-mono text-xs text-blue-600 font-medium">
                          {d.eventType}
                        </td>
                        <td className="px-4 py-3 font-mono text-xs text-slate-700 max-w-[200px] truncate" title={d.requestUrl}>
                          {d.requestUrl}
                        </td>
                        <td className="px-4 py-3 text-xs font-medium">
                          #{d.attemptNumber}/5
                        </td>
                        <td className="px-4 py-3">
                          {getDeliveryBadge(d.deliveryStatus)}
                        </td>
                        <td className="px-4 py-3 font-mono text-xs">
                          {d.httpStatusCode || '—'}
                        </td>
                        <td className="px-4 py-3 text-xs text-slate-500">
                          {d.executionDurationMs != null ? `${d.executionDurationMs} ms` : '—'}
                        </td>
                        <td className="px-4 py-3 text-xs text-slate-500 whitespace-nowrap">
                          {new Date(d.attemptedAt).toLocaleTimeString()}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setInspectDelivery(d)}
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

      {/* ================= TAB 2: DEAD-LETTER QUEUE ================= */}
      {activeTab === 'dlq' && (
        <div className="space-y-4">
          <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg text-xs text-purple-900 flex items-start gap-2.5">
            <Skull className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold block text-sm">Dead-Letter Delivery Quarantine</span>
              Deliveries routed here have exhausted all 5 exponential backoff retry attempts, or encountered permanent SSRF safety rejection. As an administrator, you may inspect failure traces and force replay.
            </div>
          </div>

          {isLoadingDlq ? (
            <PageLoading message="Loading dead-letter items..." />
          ) : dlqDeliveries.length === 0 ? (
            <Card className="text-center py-12 px-4 text-emerald-600 text-sm font-medium">
              ✓ Dead-Letter Queue is empty. All deliveries have succeeded or are in active retry cycles.
            </Card>
          ) : (
            <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-600">
                  <thead className="bg-purple-50 border-b border-purple-200 text-xs font-semibold uppercase text-purple-900">
                    <tr>
                      <th className="px-4 py-3">Attempt Ref</th>
                      <th className="px-4 py-3">Merchant</th>
                      <th className="px-4 py-3">Event Type</th>
                      <th className="px-4 py-3">URL</th>
                      <th className="px-4 py-3">Final Error</th>
                      <th className="px-4 py-3">Attempted At</th>
                      <th className="px-4 py-3 text-right">Recovery</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {dlqDeliveries.map((d) => (
                      <tr key={d.attemptReference} className="hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-3 font-mono text-xs font-semibold text-slate-800">
                          {d.attemptReference}
                        </td>
                        <td className="px-4 py-3 font-mono text-xs">
                          M-{d.merchantId}
                        </td>
                        <td className="px-4 py-3 font-mono text-xs text-purple-700 font-medium">
                          {d.eventType}
                        </td>
                        <td className="px-4 py-3 font-mono text-xs text-slate-700 max-w-[200px] truncate" title={d.requestUrl}>
                          {d.requestUrl}
                        </td>
                        <td className="px-4 py-3 text-xs text-red-600 max-w-[220px] truncate" title={d.failureReason || ''}>
                          {d.failureReason || 'Exhausted 5 attempts'}
                        </td>
                        <td className="px-4 py-3 text-xs text-slate-500 whitespace-nowrap">
                          {new Date(d.attemptedAt).toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <Button
                            size="sm"
                            onClick={() => handleReplayDelivery(d.attemptReference)}
                            disabled={isReplaying}
                            className="text-xs bg-purple-600 hover:bg-purple-700 text-white"
                          >
                            <RotateCcw className="w-3 h-3 mr-1" />
                            Replay
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {totalDlqPages > 1 && (
                <div className="flex items-center justify-between px-4 py-3 bg-purple-50/50 border-t border-slate-200">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={dlqPage === 0}
                    onClick={() => setDlqPage((p) => Math.max(0, p - 1))}
                  >
                    Previous
                  </Button>
                  <span className="text-xs text-slate-600">
                    Page {dlqPage + 1} of {totalDlqPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={dlqPage >= totalDlqPages - 1}
                    onClick={() => setDlqPage((p) => p + 1)}
                  >
                    Next
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ================= TAB 3: TRANSACTIONAL OUTBOX ================= */}
      {activeTab === 'outbox' && (
        <div className="space-y-4">
          <Card className="p-4">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-slate-700">Filter Status:</span>
                <select
                  value={outboxStatusFilter || ''}
                  onChange={(e) => {
                    setOutboxStatusFilter((e.target.value as OutboxStatus) || undefined);
                    setOutboxPage(0);
                  }}
                  className="text-sm rounded-md border border-slate-300 px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Statuses</option>
                  <option value="PUBLISHED">Published</option>
                  <option value="PENDING">Pending</option>
                  <option value="FAILED">Failed</option>
                </select>
              </div>
              <span className="text-xs text-slate-500 self-center">
                Page {outboxPage + 1} of {Math.max(1, totalOutboxPages)} ({totalOutboxElements} total records)
              </span>
            </div>
          </Card>

          {isLoadingOutbox ? (
            <PageLoading message="Loading outbox records..." />
          ) : outboxEvents.length === 0 ? (
            <Card className="text-center py-12 px-4 text-slate-500 text-sm">
              No outbox events match the criteria.
            </Card>
          ) : (
            <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-600">
                  <thead className="bg-slate-50 border-b border-slate-200 text-xs font-semibold uppercase text-slate-500">
                    <tr>
                      <th className="px-4 py-3">Event ID</th>
                      <th className="px-4 py-3">Aggregate Type & ID</th>
                      <th className="px-4 py-3">Event Type</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Retries</th>
                      <th className="px-4 py-3">Created At</th>
                      <th className="px-4 py-3">Published At</th>
                      <th className="px-4 py-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {outboxEvents.map((ev) => (
                      <tr key={ev.eventId} className="hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-3 font-mono text-xs font-semibold text-slate-800">
                          {ev.eventId.substring(0, 8)}...
                        </td>
                        <td className="px-4 py-3 font-mono text-xs text-slate-700">
                          {ev.aggregateType}: {ev.aggregateId}
                        </td>
                        <td className="px-4 py-3 font-mono text-xs text-blue-600 font-medium">
                          {ev.eventType}
                        </td>
                        <td className="px-4 py-3">
                          {getOutboxBadge(ev.status)}
                        </td>
                        <td className="px-4 py-3 text-xs font-mono">
                          {ev.retryCount}
                        </td>
                        <td className="px-4 py-3 text-xs text-slate-500 whitespace-nowrap">
                          {new Date(ev.createdAt).toLocaleTimeString()}
                        </td>
                        <td className="px-4 py-3 text-xs text-slate-500 whitespace-nowrap">
                          {ev.publishedAt ? new Date(ev.publishedAt).toLocaleTimeString() : '—'}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setInspectOutbox(ev)}
                              className="text-xs px-2.5 py-1"
                            >
                              Inspect
                            </Button>
                            {ev.status !== 'PUBLISHED' && (
                              <Button
                                size="sm"
                                onClick={() => handleRepublishOutbox(ev.eventId)}
                                disabled={isRepublishing}
                                className="text-xs bg-amber-600 hover:bg-amber-700 text-white px-2.5 py-1"
                              >
                                Republish
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {totalOutboxPages > 1 && (
                <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-t border-slate-200">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={outboxPage === 0}
                    onClick={() => setOutboxPage((p) => Math.max(0, p - 1))}
                  >
                    Previous
                  </Button>
                  <span className="text-xs text-slate-600">
                    Page {outboxPage + 1} of {totalOutboxPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={outboxPage >= totalOutboxPages - 1}
                    onClick={() => setOutboxPage((p) => p + 1)}
                  >
                    Next
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ================= TAB 4: INBOX CONSUMERS ================= */}
      {activeTab === 'inbox' && (
        <div className="space-y-4">
          <Card className="p-4">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-slate-700">Filter Status:</span>
                <select
                  value={inboxStatusFilter || ''}
                  onChange={(e) => {
                    setInboxStatusFilter((e.target.value as InboxStatus) || undefined);
                    setInboxPage(0);
                  }}
                  className="text-sm rounded-md border border-slate-300 px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Statuses</option>
                  <option value="PROCESSED">Processed</option>
                  <option value="PROCESSING">Processing</option>
                  <option value="RECEIVED">Received</option>
                  <option value="FAILED">Failed</option>
                </select>
              </div>
              <span className="text-xs text-slate-500 self-center">
                Page {inboxPage + 1} of {Math.max(1, totalInboxPages)} ({totalInboxElements} total records)
              </span>
            </div>
          </Card>

          {isLoadingInbox ? (
            <PageLoading message="Loading consumer inbox records..." />
          ) : inboxEvents.length === 0 ? (
            <Card className="text-center py-12 px-4 text-slate-500 text-sm">
              No inbox records recorded.
            </Card>
          ) : (
            <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-600">
                  <thead className="bg-slate-50 border-b border-slate-200 text-xs font-semibold uppercase text-slate-500">
                    <tr>
                      <th className="px-4 py-3">Event ID</th>
                      <th className="px-4 py-3">Consumer Component</th>
                      <th className="px-4 py-3">Event Type</th>
                      <th className="px-4 py-3">Processing Status</th>
                      <th className="px-4 py-3">Received At</th>
                      <th className="px-4 py-3">Processed At</th>
                      <th className="px-4 py-3">Error</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {inboxEvents.map((inb) => (
                      <tr key={`${inb.eventId}-${inb.consumerName}`} className="hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-3 font-mono text-xs font-semibold text-slate-800">
                          {inb.eventId.substring(0, 8)}...
                        </td>
                        <td className="px-4 py-3 font-mono text-xs text-indigo-600 font-semibold">
                          {inb.consumerName}
                        </td>
                        <td className="px-4 py-3 font-mono text-xs text-blue-600">
                          {inb.eventType}
                        </td>
                        <td className="px-4 py-3">
                          {getInboxBadge(inb.processingStatus)}
                        </td>
                        <td className="px-4 py-3 text-xs text-slate-500 whitespace-nowrap">
                          {new Date(inb.receivedAt).toLocaleTimeString()}
                        </td>
                        <td className="px-4 py-3 text-xs text-slate-500 whitespace-nowrap">
                          {inb.processedAt ? new Date(inb.processedAt).toLocaleTimeString() : '—'}
                        </td>
                        <td className="px-4 py-3 text-xs text-red-600 font-mono max-w-[200px] truncate" title={inb.errorMessage || ''}>
                          {inb.errorMessage || '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {totalInboxPages > 1 && (
                <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-t border-slate-200">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={inboxPage === 0}
                    onClick={() => setInboxPage((p) => Math.max(0, p - 1))}
                  >
                    Previous
                  </Button>
                  <span className="text-xs text-slate-600">
                    Page {inboxPage + 1} of {totalInboxPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={inboxPage >= totalInboxPages - 1}
                    onClick={() => setInboxPage((p) => p + 1)}
                  >
                    Next
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ================= MODAL: INSPECT DELIVERY ================= */}
      {inspectDelivery && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-blue-600" />
                  Admin Delivery Inspector
                </h3>
                <span className="text-xs font-mono text-slate-500">
                  {inspectDelivery.attemptReference} (Merchant M-{inspectDelivery.merchantId})
                </span>
              </div>
              <button
                onClick={() => setInspectDelivery(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <div className="space-y-1">
              <span className="text-xs font-semibold uppercase text-slate-500">Destination URL:</span>
              <p className="font-mono text-xs bg-slate-100 p-2 rounded border border-slate-200 break-all text-slate-800">
                {inspectDelivery.requestUrl}
              </p>
            </div>

            {inspectDelivery.failureReason && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 space-y-1">
                <span className="font-semibold flex items-center gap-1">
                  <XCircle className="w-4 h-4 text-red-500" />
                  Failure Reason:
                </span>
                <p className="font-mono break-all">{inspectDelivery.failureReason}</p>
              </div>
            )}

            {inspectDelivery.responseBody && (
              <div className="space-y-1">
                <span className="text-xs font-semibold uppercase text-slate-500">Response Body:</span>
                <pre className="font-mono text-[11px] bg-slate-900 text-slate-200 p-3 rounded-lg overflow-x-auto max-h-40">
                  {inspectDelivery.responseBody}
                </pre>
              </div>
            )}

            <div className="flex items-center justify-between pt-3 border-t">
              <span className="text-xs text-slate-500">
                Attempt #{inspectDelivery.attemptNumber} at {new Date(inspectDelivery.attemptedAt).toLocaleString()}
              </span>
              <div className="flex items-center gap-3">
                <Button variant="outline" onClick={() => setInspectDelivery(null)}>
                  Close
                </Button>
                <Button
                  disabled={isReplaying}
                  onClick={() => handleReplayDelivery(inspectDelivery.attemptReference)}
                  className="bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-1.5"
                >
                  <RotateCcw className={`w-3.5 h-3.5 ${isReplaying ? 'animate-spin' : ''}`} />
                  {isReplaying ? 'Replaying...' : 'Force Replay Delivery'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: INSPECT OUTBOX ================= */}
      {inspectOutbox && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Layers className="w-5 h-5 text-blue-600" />
                  Outbox Event Inspector
                </h3>
                <span className="text-xs font-mono text-slate-500">{inspectOutbox.eventId}</span>
              </div>
              <button
                onClick={() => setInspectOutbox(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-3 rounded-lg border border-slate-200">
              <div>
                <span className="text-slate-500 block">Aggregate:</span>
                <span className="font-semibold font-mono">{inspectOutbox.aggregateType} ({inspectOutbox.aggregateId})</span>
              </div>
              <div>
                <span className="text-slate-500 block">Status:</span>
                <span className="font-semibold">{getOutboxBadge(inspectOutbox.status)}</span>
              </div>
            </div>

            {inspectOutbox.lastError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700">
                <span className="font-semibold block mb-1">Last Publication Error:</span>
                <p className="font-mono break-all">{inspectOutbox.lastError}</p>
              </div>
            )}

            <div className="space-y-1">
              <span className="text-xs font-semibold uppercase text-slate-500">Payload JSON:</span>
              <pre className="font-mono text-[11px] bg-slate-900 text-slate-200 p-3 rounded-lg overflow-x-auto max-h-60">
                {(() => {
                  try {
                    return JSON.stringify(JSON.parse(inspectOutbox.payload), null, 2);
                  } catch {
                    return inspectOutbox.payload;
                  }
                })()}
              </pre>
            </div>

            <div className="flex items-center justify-between pt-3 border-t">
              <span className="text-xs text-slate-500">
                Created: {new Date(inspectOutbox.createdAt).toLocaleString()}
              </span>
              <div className="flex items-center gap-3">
                <Button variant="outline" onClick={() => setInspectOutbox(null)}>
                  Close
                </Button>
                {inspectOutbox.status !== 'PUBLISHED' && (
                  <Button
                    disabled={isRepublishing}
                    onClick={() => handleRepublishOutbox(inspectOutbox.eventId)}
                    className="bg-amber-600 hover:bg-amber-700 text-white flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    {isRepublishing ? 'Republishing...' : 'Republish Event'}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
