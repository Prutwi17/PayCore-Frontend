import { apiClient } from './apiClient';
import { ApiResponse } from '@/types/api';
import { AuthResponse, LoginCredentials, RegisterFormData, UserProfile } from '@/types/auth';

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiClient.post<ApiResponse<AuthResponse>>('/auth/login', credentials);
    return response.data.data;
  },

  async register(data: RegisterFormData): Promise<UserProfile> {
    const response = await apiClient.post<ApiResponse<UserProfile>>('/auth/register', data);
    return response.data.data;
  },

  async getMe(): Promise<UserProfile> {
    const response = await apiClient.get<ApiResponse<UserProfile>>('/auth/me');
    return response.data.data;
  },
};
