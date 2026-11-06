import { apiClient } from './apiClient';
import { ApiResponse } from '@/types/api';
import {
  AuthResponse,
  LoginCredentials,
  RegisterFormData,
  UserProfile,
  ResetPasswordRequest,
  AdminSetupRequest,
  EmailStatusResponse,
} from '@/types/auth';

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiClient.post<ApiResponse<AuthResponse>>('/auth/login', credentials);
    return response.data.data;
  },

  async loginWithGoogle(idToken: string): Promise<AuthResponse> {
    const response = await apiClient.post<ApiResponse<AuthResponse>>('/auth/google', { idToken });
    return response.data.data;
  },

  async register(data: RegisterFormData): Promise<UserProfile> {
    const response = await apiClient.post<ApiResponse<UserProfile>>('/auth/register', data);
    return response.data.data;
  },

  async verifyEmail(token: string): Promise<string> {
    const response = await apiClient.post<ApiResponse<void>>('/auth/verify-email', { token });
    return response.data.message;
  },

  async resendVerification(email: string): Promise<string> {
    const response = await apiClient.post<ApiResponse<void>>('/auth/resend-verification', { email });
    return response.data.message;
  },

  async forgotPassword(email: string): Promise<string> {
    const response = await apiClient.post<ApiResponse<void>>('/auth/forgot-password', { email });
    return response.data.message;
  },

  async resetPassword(data: ResetPasswordRequest): Promise<string> {
    const response = await apiClient.post<ApiResponse<void>>('/auth/reset-password', data);
    return response.data.message;
  },

  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    const response = await apiClient.post<ApiResponse<AuthResponse>>('/auth/refresh', { refreshToken });
    return response.data.data;
  },

  async logout(refreshToken?: string): Promise<void> {
    try {
      await apiClient.post<ApiResponse<void>>('/auth/logout', { refreshToken });
    } catch (error) {
      console.warn('Logout endpoint reported error, proceeding with client cleanup:', error);
    }
  },

  async initiateAdminSetup(setupKey?: string): Promise<string> {
    const response = await apiClient.post<ApiResponse<void>>('/auth/admin/initiate-setup', { setupKey });
    return response.data.message;
  },

  async completeAdminSetup(data: AdminSetupRequest): Promise<string> {
    const response = await apiClient.post<ApiResponse<void>>('/auth/admin/complete-setup', data);
    return response.data.message;
  },

  async getEmailStatus(): Promise<EmailStatusResponse> {
    const response = await apiClient.get<ApiResponse<EmailStatusResponse>>('/auth/email-status');
    return response.data.data;
  },

  async getGoogleOAuthUrl(state?: string): Promise<string> {
    const response = await apiClient.get<ApiResponse<{ authorizationUrl: string }>>('/auth/google/oauth-url', {
      params: { state },
    });
    return response.data.data.authorizationUrl;
  },

  async getMe(): Promise<UserProfile> {
    const response = await apiClient.get<ApiResponse<UserProfile>>('/auth/me');
    return response.data.data;
  },
};
