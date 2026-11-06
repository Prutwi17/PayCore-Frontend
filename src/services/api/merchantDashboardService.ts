import { apiClient } from './apiClient';
import { ApiResponse } from '@/types/api';
import { MerchantDashboardSummary } from '@/types/merchantDashboard';

export const merchantDashboardService = {
  async getSummary(merchantId?: number): Promise<MerchantDashboardSummary> {
    const response = await apiClient.get<ApiResponse<MerchantDashboardSummary>>('/merchant/dashboard/summary', {
      params: { merchantId },
    });
    return response.data.data;
  },
};
