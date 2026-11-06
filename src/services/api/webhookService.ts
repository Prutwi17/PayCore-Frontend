import { apiClient } from './apiClient';
import { ApiResponse, PagedResponse } from '@/types/api';
import {
  WebhookEndpointItem,
  WebhookEndpointCreatePayload,
  WebhookEndpointUpdatePayload,
  WebhookDeliveryItem,
  WebhookEventItem,
  OutboxEventItem,
  InboxEventItem,
  WebhookMetricsResponse,
  EndpointStatus,
  WebhookDeliveryStatus,
  OutboxStatus,
  InboxStatus,
} from '@/types/webhook';

export const webhookService = {
  // ================= MERCHANT WEBHOOK ENDPOINTS =================

  async listEndpoints(): Promise<WebhookEndpointItem[]> {
    const response = await apiClient.get<ApiResponse<WebhookEndpointItem[]>>(
      '/webhooks/endpoints'
    );
    return response.data.data;
  },

  async createEndpoint(
    payload: WebhookEndpointCreatePayload
  ): Promise<WebhookEndpointItem> {
    const response = await apiClient.post<ApiResponse<WebhookEndpointItem>>(
      '/webhooks/endpoints',
      payload
    );
    return response.data.data;
  },

  async getEndpoint(endpointReference: string): Promise<WebhookEndpointItem> {
    const response = await apiClient.get<ApiResponse<WebhookEndpointItem>>(
      `/webhooks/endpoints/${endpointReference}`
    );
    return response.data.data;
  },

  async updateEndpoint(
    endpointReference: string,
    payload: WebhookEndpointUpdatePayload
  ): Promise<WebhookEndpointItem> {
    const response = await apiClient.put<ApiResponse<WebhookEndpointItem>>(
      `/webhooks/endpoints/${endpointReference}`,
      payload
    );
    return response.data.data;
  },

  async updateEndpointStatus(
    endpointReference: string,
    status: EndpointStatus
  ): Promise<WebhookEndpointItem> {
    const response = await apiClient.patch<ApiResponse<WebhookEndpointItem>>(
      `/webhooks/endpoints/${endpointReference}/status`,
      null,
      { params: { status } }
    );
    return response.data.data;
  },

  async rotateSecret(endpointReference: string): Promise<WebhookEndpointItem> {
    const response = await apiClient.post<ApiResponse<WebhookEndpointItem>>(
      `/webhooks/endpoints/${endpointReference}/rotate-secret`
    );
    return response.data.data;
  },

  async deleteEndpoint(endpointReference: string): Promise<void> {
    await apiClient.delete<ApiResponse<void>>(
      `/webhooks/endpoints/${endpointReference}`
    );
  },

  // ================= MERCHANT DELIVERIES & EVENTS =================

  async listDeliveries(params?: {
    status?: WebhookDeliveryStatus;
    page?: number;
    size?: number;
  }): Promise<PagedResponse<WebhookDeliveryItem>> {
    const response = await apiClient.get<ApiResponse<PagedResponse<WebhookDeliveryItem>>>(
      '/webhooks/deliveries',
      { params }
    );
    return response.data.data;
  },

  async getDelivery(attemptReference: string): Promise<WebhookDeliveryItem> {
    const response = await apiClient.get<ApiResponse<WebhookDeliveryItem>>(
      `/webhooks/deliveries/${attemptReference}`
    );
    return response.data.data;
  },

  async retryDelivery(attemptReference: string): Promise<WebhookDeliveryItem> {
    const response = await apiClient.post<ApiResponse<WebhookDeliveryItem>>(
      `/webhooks/deliveries/${attemptReference}/retry`
    );
    return response.data.data;
  },

  async listEvents(params?: {
    page?: number;
    size?: number;
  }): Promise<PagedResponse<WebhookEventItem>> {
    const response = await apiClient.get<ApiResponse<PagedResponse<WebhookEventItem>>>(
      '/webhooks/events',
      { params }
    );
    return response.data.data;
  },

  // ================= ADMIN GOVERNANCE & TELEMETRY =================

  async getMetrics(): Promise<WebhookMetricsResponse> {
    const response = await apiClient.get<ApiResponse<WebhookMetricsResponse>>(
      '/admin/webhooks/metrics'
    );
    return response.data.data;
  },

  async listOutboxEvents(params?: {
    status?: OutboxStatus;
    page?: number;
    size?: number;
  }): Promise<PagedResponse<OutboxEventItem>> {
    const response = await apiClient.get<ApiResponse<PagedResponse<OutboxEventItem>>>(
      '/admin/webhooks/outbox',
      { params }
    );
    return response.data.data;
  },

  async republishOutboxEvent(eventId: string): Promise<OutboxEventItem> {
    const response = await apiClient.post<ApiResponse<OutboxEventItem>>(
      `/admin/webhooks/outbox/${eventId}/republish`
    );
    return response.data.data;
  },

  async listInboxEvents(params?: {
    status?: InboxStatus;
    page?: number;
    size?: number;
  }): Promise<PagedResponse<InboxEventItem>> {
    const response = await apiClient.get<ApiResponse<PagedResponse<InboxEventItem>>>(
      '/admin/webhooks/inbox',
      { params }
    );
    return response.data.data;
  },

  async listAdminDeliveries(params?: {
    merchantId?: number;
    status?: WebhookDeliveryStatus;
    page?: number;
    size?: number;
  }): Promise<PagedResponse<WebhookDeliveryItem>> {
    const response = await apiClient.get<ApiResponse<PagedResponse<WebhookDeliveryItem>>>(
      '/admin/webhooks/deliveries',
      { params }
    );
    return response.data.data;
  },

  async listDeadLetterDeliveries(params?: {
    page?: number;
    size?: number;
  }): Promise<PagedResponse<WebhookDeliveryItem>> {
    const response = await apiClient.get<ApiResponse<PagedResponse<WebhookDeliveryItem>>>(
      '/admin/webhooks/deliveries/dead-letter',
      { params }
    );
    return response.data.data;
  },

  async replayDelivery(attemptReference: string): Promise<WebhookDeliveryItem> {
    const response = await apiClient.post<ApiResponse<WebhookDeliveryItem>>(
      `/admin/webhooks/deliveries/${attemptReference}/replay`
    );
    return response.data.data;
  },
};
