import { apiClient } from './apiClient';
import { ApiResponse } from '@/types/api';
import {
  AdminDashboardSummary,
  PaymentTrendPoint,
  RefundTrendPoint,
  StatusDistribution,
  ReconciliationSummary,
} from '@/types/dashboard';

export const dashboardService = {
  /**
   * Retrieves high-level operational KPIs and platform summary metrics.
   */
  async getSummary(startDate?: string, endDate?: string): Promise<AdminDashboardSummary> {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);

    const query = params.toString() ? `?${params.toString()}` : '';
    const response = await apiClient.get<ApiResponse<AdminDashboardSummary>>(
      `/admin/dashboard/summary${query}`
    );
    return response.data.data;
  },

  /**
   * Retrieves aggregated payment volume and count trends over time.
   */
  async getPaymentTrends(startDate?: string, endDate?: string): Promise<PaymentTrendPoint[]> {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);

    const query = params.toString() ? `?${params.toString()}` : '';
    const response = await apiClient.get<ApiResponse<PaymentTrendPoint[]>>(
      `/admin/dashboard/trends/payments${query}`
    );
    return response.data.data;
  },

  /**
   * Retrieves aggregated refund trends over time.
   */
  async getRefundTrends(startDate?: string, endDate?: string): Promise<RefundTrendPoint[]> {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);

    const query = params.toString() ? `?${params.toString()}` : '';
    const response = await apiClient.get<ApiResponse<RefundTrendPoint[]>>(
      `/admin/dashboard/trends/refunds${query}`
    );
    return response.data.data;
  },

  /**
   * Retrieves the distribution breakdown of payment states.
   */
  async getStatusDistribution(startDate?: string, endDate?: string): Promise<StatusDistribution[]> {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);

    const query = params.toString() ? `?${params.toString()}` : '';
    const response = await apiClient.get<ApiResponse<StatusDistribution[]>>(
      `/admin/dashboard/status-distribution${query}`
    );
    return response.data.data;
  },

  /**
   * Retrieves reconciliation health and discrepancy status metrics.
   */
  async getReconciliationSummary(): Promise<ReconciliationSummary> {
    const response = await apiClient.get<ApiResponse<ReconciliationSummary>>(
      '/admin/dashboard/reconciliation-summary'
    );
    return response.data.data;
  },
};
