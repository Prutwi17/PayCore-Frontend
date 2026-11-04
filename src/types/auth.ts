export type UserRole = 'ROLE_ADMIN' | 'ROLE_MERCHANT' | 'ROLE_CUSTOMER';

export type UserStatus = 'ACTIVE' | 'SUSPENDED' | 'LOCKED';

export type MerchantStatus = 'PENDING' | 'ACTIVE' | 'SUSPENDED' | 'REJECTED';

export interface UserProfile {
  id: number;
  username: string;
  email: string;
  fullName: string;
  phoneNumber?: string;
  status: UserStatus;
  merchantId?: number;
  merchantCode?: string;
  roles: UserRole[];
  createdAt: string;
}

export interface AuthResponse {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
  user: UserProfile;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterFormData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword?: string;
  phoneNumber?: string;
  businessName?: string;
  businessAddress?: string;
}

export interface MerchantProfile {
  id: number;
  merchantCode: string;
  businessName: string;
  businessEmail: string;
  contactNumber?: string;
  businessAddress?: string;
  status: MerchantStatus;
  userId: number;
  createdAt: string;
  updatedAt: string;
}

export interface MerchantUpdateRequest {
  businessName: string;
  contactNumber?: string;
  businessAddress?: string;
}

export interface ApiKeyItem {
  id: number;
  keyPrefix: string;
  keyType: 'SECRET' | 'PUBLISHABLE';
  environment: 'TEST' | 'LIVE';
  status: 'ACTIVE' | 'REVOKED';
  createdAt: string;
  revokedAt?: string;
  lastUsedAt?: string;
}

export interface ApiKeyCreatedResponse {
  id: number;
  keyPrefix: string;
  secretKey: string;
  keyType: string;
  environment: string;
  status: string;
  createdAt: string;
  warningMessage: string;
}
