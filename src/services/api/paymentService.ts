import { apiClient } from './apiClient';
import { ApiResponse, PagedResponse } from '@/types/api';
import {
  PaymentCreatePayload,
  PaymentItem,
  PaymentAttemptItem,
  PaymentStatusResponse,
  PaymentStatus,
} from '@/types/payment';

export const paymentService = {
  async createPayment(payload: PaymentCreatePayload): Promise<PaymentItem> {
    const response = await apiClient.post<ApiResponse<PaymentItem>>('/payments', payload);
    return response.data.data;
  },

  async listMerchantPayments(params?: {
    status?: PaymentStatus;
    search?: string;
    page?: number;
    size?: number;
    sortBy?: string;
    sortDirection?: string;
  }): Promise<PagedResponse<PaymentItem>> {
    const response = await apiClient.get<ApiResponse<PagedResponse<PaymentItem>>>('/payments', {
      params,
    });
    return response.data.data;
  },

  async getPayment(paymentReference: string): Promise<PaymentItem> {
    const response = await apiClient.get<ApiResponse<PaymentItem>>(`/payments/${paymentReference}`);
    return response.data.data;
  },

  async getPaymentAttempts(paymentReference: string): Promise<PaymentAttemptItem[]> {
    const response = await apiClient.get<ApiResponse<PaymentAttemptItem[]>>(`/payments/${paymentReference}/attempts`);
    return response.data.data;
  },

  async getPaymentStatus(paymentReference: string, verify: boolean = true): Promise<PaymentStatusResponse> {
    const response = await apiClient.get<ApiResponse<PaymentStatusResponse>>(`/payments/${paymentReference}/status`, {
      params: { verify },
    });
    return response.data.data;
  },

  async cancelPayment(paymentReference: string, reason?: string): Promise<PaymentItem> {
    const response = await apiClient.post<ApiResponse<PaymentItem>>(
      `/payments/${paymentReference}/cancel`,
      null,
      { params: { reason } }
    );
    return response.data.data;
  },

  // Admin APIs
  async listAdminPayments(params?: {
    status?: PaymentStatus;
    merchantId?: number;
    search?: string;
    page?: number;
    size?: number;
    sortBy?: string;
    sortDirection?: string;
  }): Promise<PagedResponse<PaymentItem>> {
    const response = await apiClient.get<ApiResponse<PagedResponse<PaymentItem>>>('/admin/payments', {
      params,
    });
    return response.data.data;
  },

  async getAdminPayment(paymentReference: string): Promise<PaymentItem> {
    const response = await apiClient.get<ApiResponse<PaymentItem>>(`/admin/payments/${paymentReference}`);
    return response.data.data;
  },

  async getAdminPaymentAttempts(paymentReference: string): Promise<PaymentAttemptItem[]> {
    const response = await apiClient.get<ApiResponse<PaymentAttemptItem[]>>(`/admin/payments/${paymentReference}/attempts`);
    return response.data.data;
  },
};
