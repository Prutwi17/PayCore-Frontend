# PAYCORE FRONTEND — API CONTRACTS & INTEGRATION SPECIFICATION

## 1. Overview
The frontend communicates with the backend via the standardized `/api/v1` base route. All requests and responses are strictly typed via TypeScript interfaces located in `src/types/auth.ts` and `src/types/api.ts` that mirror the backend DTOs.

---

## 2. Authentication & Request Headers

### 2.1 Dashboard Requests (Axios Client)
All portal HTTP requests pass through an Axios request interceptor that injects:
```typescript
const token = localStorage.getItem('paycore_access_token');
if (token && config.headers) {
  config.headers.Authorization = `Bearer ${token}`;
}
```
Upon receiving an HTTP 401 response, the response interceptor automatically surfaces structured `ApiError` objects, and the `AuthContext` clears local session caches.

---

## 3. Core TypeScript Type Contracts

```typescript
// Common API Envelope
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Array<{ field: string; issue: string }>;
}

export interface PagedResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

// User & Auth Types
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
```

---

## 4. Frontend API Services (`src/services/api/`)

### 4.1 Authentication Service (`authService.ts`)
- `login(credentials: LoginCredentials): Promise<AuthResponse>` -> `POST /api/v1/auth/login`
- `register(data: RegisterFormData): Promise<UserProfile>` -> `POST /api/v1/auth/register`
- `getMe(): Promise<UserProfile>` -> `GET /api/v1/auth/me`

### 4.2 Merchant Service (`merchantService.ts`)
- `getProfile(): Promise<MerchantProfile>` -> `GET /api/v1/merchants/profile`
- `updateProfile(data: MerchantUpdateRequest): Promise<MerchantProfile>` -> `PUT /api/v1/merchants/profile`
- `getMerchantById(id: number): Promise<MerchantProfile>` -> `GET /api/v1/merchants/{id}`
- `listMerchants(params): Promise<PagedResponse<MerchantProfile>>` -> `GET /api/v1/admin/merchants`
- `approveMerchant(id: number): Promise<MerchantProfile>` -> `PATCH /api/v1/admin/merchants/{id}/approve`
- `suspendMerchant(id: number): Promise<MerchantProfile>` -> `PATCH /api/v1/admin/merchants/{id}/suspend`
- `rejectMerchant(id: number): Promise<MerchantProfile>` -> `PATCH /api/v1/admin/merchants/{id}/reject`

### 4.3 API Key Service (`apiKeyService.ts`)
- `listApiKeys(): Promise<ApiKeyItem[]>` -> `GET /api/v1/merchants/api-keys`
- `generateApiKey(payload): Promise<ApiKeyCreatedResponse>` -> `POST /api/v1/merchants/api-keys`
- `revokeApiKey(id: number): Promise<ApiKeyItem>` -> `DELETE /api/v1/merchants/api-keys/{id}`
