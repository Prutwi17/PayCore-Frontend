import { apiClient } from './apiClient';
import { ApiResponse } from '@/types/api';
import { ApiKeyCreatedResponse, ApiKeyItem } from '@/types/auth';

export interface CreateApiKeyPayload {
  description?: string;
  environment?: 'TEST' | 'LIVE';
  keyType?: 'SECRET' | 'PUBLISHABLE';
}

export const apiKeyService = {
  async listApiKeys(): Promise<ApiKeyItem[]> {
    const response = await apiClient.get<ApiResponse<ApiKeyItem[]>>('/merchants/api-keys');
    return response.data.data;
  },

  async generateApiKey(payload: CreateApiKeyPayload = {}): Promise<ApiKeyCreatedResponse> {
    const response = await apiClient.post<ApiResponse<ApiKeyCreatedResponse>>('/merchants/api-keys', payload);
    return response.data.data;
  },

  async revokeApiKey(keyId: number): Promise<ApiKeyItem> {
    const response = await apiClient.delete<ApiResponse<ApiKeyItem>>(`/merchants/api-keys/${keyId}`);
    return response.data.data;
  },
};
