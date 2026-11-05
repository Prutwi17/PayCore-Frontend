export type EndpointStatus = 'ACTIVE' | 'INACTIVE' | 'DISABLED';

export type WebhookDeliveryStatus =
  | 'PENDING'
  | 'SUCCESS'
  | 'RETRYING'
  | 'FAILED'
  | 'DEAD_LETTER';

export type OutboxStatus = 'PENDING' | 'PUBLISHED' | 'FAILED';

export type InboxStatus = 'RECEIVED' | 'PROCESSING' | 'PROCESSED' | 'FAILED';

export interface WebhookEndpointItem {
  id: number;
  endpointReference: string;
  merchantId: number;
  url: string;
  maskedSecret: string;
  secret?: string | null;
  subscribedEvents: string;
  status: EndpointStatus;
  description?: string;
  failureCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface WebhookEndpointCreatePayload {
  url: string;
  subscribedEvents?: string;
  description?: string;
}

export interface WebhookEndpointUpdatePayload {
  url?: string;
  subscribedEvents?: string;
  description?: string;
}

export interface WebhookDeliveryItem {
  id: number;
  attemptReference: string;
  eventReference: string;
  eventType: string;
  endpointReference: string;
  merchantId: number;
  requestUrl: string;
  attemptNumber: number;
  deliveryStatus: WebhookDeliveryStatus;
  httpStatusCode?: number | null;
  responseBody?: string | null;
  executionDurationMs?: number | null;
  nextRetryAt?: string | null;
  failureReason?: string | null;
  attemptedAt: string;
  createdAt: string;
}

export interface WebhookEventItem {
  id: number;
  eventReference: string;
  merchantId: number;
  eventType: string;
  aggregateId: string;
  payload: string;
  createdAt: string;
}

export interface OutboxEventItem {
  id: number;
  eventId: string;
  aggregateType: string;
  aggregateId: string;
  eventType: string;
  merchantId: number;
  payload: string;
  status: OutboxStatus;
  retryCount: number;
  lastError?: string | null;
  createdAt: string;
  publishedAt?: string | null;
}

export interface InboxEventItem {
  id: number;
  eventId: string;
  consumerName: string;
  eventType: string;
  processingStatus: InboxStatus;
  errorMessage?: string | null;
  receivedAt: string;
  processedAt?: string | null;
}

export interface WebhookMetricsResponse {
  pendingOutboxCount: number;
  failedOutboxCount: number;
  totalDeliveries: number;
  successfulDeliveries: number;
  failedDeliveries: number;
  deadLetterDeliveries: number;
  deliverySuccessRate: number;
}
