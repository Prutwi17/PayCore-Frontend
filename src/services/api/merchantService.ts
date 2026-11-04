import { apiClient } from './apiClient';
import { ApiResponse, PagedResponse } from '@/types/api';
import { MerchantProfile, MerchantStatus, MerchantUpdateRequest } from '@/types/auth';

export const merchantService = {
  async getProfile(): Promise<MerchantProfile> {
    const response = await apiClient.get<ApiResponse<MerchantProfile>>('/merchants/profile');
    return response.data.data;
  },

  async updateProfile(data: MerchantUpdateRequest): Promise<MerchantProfile> {
    const response = await apiClient.put<ApiResponse<MerchantProfile>>('/merchants/profile', data);
    return response.data.data;
  },

  async getMerchantById(id: number): Promise<MerchantProfile> {
    const response = await apiClient.get<ApiResponse<MerchantProfile>>(`/merchants/${id}`);
    return response.data.data;
  },

  // Admin APIs
  async listMerchants(params?: {
    status?: MerchantStatus;
    page?: number;
    size?: number;
    sortBy?: string;
    sortDirection?: string;
  }): Promise<PagedResponse<MerchantProfile>> {
    const response = await apiClient.get<ApiResponse<PagedResponse<MerchantProfile>>>('/admin/merchants', {
      params,
    });
    return response.data.data;
  },

  async updateMerchantStatus(id: number, status: MerchantStatus): Promise<MerchantProfile> {
    const response = await apiClient.patch<ApiResponse<MerchantProfile>>(`/admin/merchants/${id}/status`, {
      status,
    });
    return response.data.data;
  },

  async approveMerchant(id: number): Promise<MerchantProfile> {
    const response = await apiClient.patch<ApiResponse<MerchantProfile>>(`/admin/merchants/${id}/approve`);
    return response.data.data;
  },

  async suspendMerchant(id: number): Promise<MerchantProfile> {
    const response = await apiClient.patch<ApiResponse<MerchantProfile>>(`/admin/merchants/${id}/suspend`);
    return response.data.data;
  },

  async rejectMerchant(id: number): Promise<MerchantProfile> {
    const response = await apiClient.patch<ApiResponse<MerchantProfile>>(`/admin/merchants/${id}/reject`);
    return response.data.data;
  },
};
