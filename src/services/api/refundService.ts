import { apiClient } from './apiClient';
import { ApiResponse, PagedResponse } from '@/types/api';
import {
  RefundCreatePayload,
  RefundItem,
  RefundableAmountResponse,
  RefundStatus,
  RefundCreationResult,
} from '@/types/refund';

export const refundService = {
  /**
   * Initiates a refund for an eligible payment under idempotency protection.
   */
  async createRefund(
    paymentReference: string,
    payload: RefundCreatePayload,
    idempotencyKey?: string
  ): Promise<RefundCreationResult> {
    const headers: Record<string, string> = {};
    if (idempotencyKey) {
      headers['Idempotency-Key'] = idempotencyKey;
    }

    const response = await apiClient.post<ApiResponse<RefundItem>>(
      `/payments/${paymentReference}/refunds`,
      {
        amount: payload.amount,
        currency: payload.currency,
        reason: payload.reason,
      },
      { headers }
    );

    const isReplay =
      response.status === 200 ||
      Boolean(response.data.data.idempotentReplay);

    return {
      refund: response.data.data,
      isReplay,
      httpStatus: response.status,
    };
  },

  /**
   * Retrieves the live refundable balance calculation for a payment.
   */
  async getRefundableAmount(paymentReference: string): Promise<RefundableAmountResponse> {
    const response = await apiClient.get<ApiResponse<RefundableAmountResponse>>(
      `/payments/${paymentReference}/refundable-amount`
    );
    return response.data.data;
  },

  /**
   * Lists refunds for the authenticated merchant with filtering and pagination.
   */
  async listMerchantRefunds(params?: {
    status?: RefundStatus;
    search?: string;
    page?: number;
    size?: number;
    sortBy?: string;
    sortDirection?: string;
  }): Promise<PagedResponse<RefundItem>> {
    const response = await apiClient.get<ApiResponse<PagedResponse<RefundItem>>>('/refunds', {
      params,
    });
    return response.data.data;
  },

  /**
   * Retrieves details of a specific refund.
   */
  async getRefund(refundReference: string): Promise<RefundItem> {
    const response = await apiClient.get<ApiResponse<RefundItem>>(`/refunds/${refundReference}`);
    return response.data.data;
  },

  /**
   * Retrieves all refunds issued for a payment reference.
   */
  async getPaymentRefunds(paymentReference: string): Promise<RefundItem[]> {
    const response = await apiClient.get<ApiResponse<RefundItem[]>>(
      `/payments/${paymentReference}/refunds`
    );
    return response.data.data;
  },

  /**
   * Queries downstream provider to verify/reconcile an UNKNOWN refund outcome.
   */
  async verifyRefund(refundReference: string): Promise<RefundItem> {
    const response = await apiClient.post<ApiResponse<RefundItem>>(
      `/refunds/${refundReference}/verify`
    );
    return response.data.data;
  },

  /**
   * Administrator: lists all refunds across merchants.
   */
  async listAdminRefunds(params?: {
    status?: RefundStatus;
    merchantId?: number;
    search?: string;
    page?: number;
    size?: number;
    sortBy?: string;
    sortDirection?: string;
  }): Promise<PagedResponse<RefundItem>> {
    const response = await apiClient.get<ApiResponse<PagedResponse<RefundItem>>>(
      '/admin/refunds',
      { params }
    );
    return response.data.data;
  },

  /**
   * Administrator: retrieves refund details across any merchant.
   */
  async getAdminRefund(refundReference: string): Promise<RefundItem> {
    const response = await apiClient.get<ApiResponse<RefundItem>>(
      `/admin/refunds/${refundReference}`
    );
    return response.data.data;
  },

  /**
   * Administrator: verifies/reconciles UNKNOWN refund status.
   */
  async verifyAdminRefund(refundReference: string): Promise<RefundItem> {
    const response = await apiClient.post<ApiResponse<RefundItem>>(
      `/admin/refunds/${refundReference}/verify`
    );
    return response.data.data;
  },
};
