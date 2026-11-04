# PAYCORE FRONTEND — API CONTRACTS & INTEGRATION SPECIFICATION

## 1. Overview
The frontend communicates with the backend via the standardized `/api/v1` base route. All requests and responses are strictly typed via TypeScript interfaces that mirror the backend DTOs.

---

## 2. Authentication & Request Headers

### 2.1 Dashboard Requests (Axios Client)
All portal HTTP requests pass through an Axios request interceptor that injects:
```typescript
config.headers.Authorization = `Bearer ${accessToken}`;
```
Upon receiving an HTTP 401 response, the response interceptor automatically initiates token refresh or redirects to `/login`.

### 2.2 Payment Initiation
When creating a test payment from the merchant UI:
```typescript
config.headers['Idempotency-Key'] = crypto.randomUUID();
```

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

export interface UserProfile {
  id: number;
  username: string;
  email: string;
  fullName: string;
  role: UserRole;
  merchantId?: number;
  merchantCode?: string;
}

export interface AuthResponseData {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
  user: UserProfile;
}

// Payment Types
export type PaymentStatus = 
  | 'CREATED'
  | 'PROCESSING'
  | 'REQUIRES_ACTION'
  | 'AUTHORIZED'
  | 'SUCCESS'
  | 'FAILED'
  | 'CANCELLED'
  | 'UNKNOWN';

export interface PaymentSummary {
  paymentId: string;
  orderId: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  paymentMethod: string;
  createdAt: string;
}

export interface PaymentDetail extends PaymentSummary {
  merchantId: number;
  amountRefunded: number;
  refundableAmount: number;
  providerTransactionId?: string;
  errorCode?: string;
  errorMessage?: string;
  attempts: PaymentAttempt[];
  refunds: RefundSummary[];
  webhooks: WebhookEventSummary[];
}

export interface PaymentAttempt {
  attemptId: string;
  attemptNumber: number;
  status: string;
  responseCode?: string;
  createdAt: string;
}

// Refund Types
export type RefundStatus = 'REQUESTED' | 'PROCESSING' | 'SUCCESS' | 'FAILED';

export interface RefundSummary {
  refundId: string;
  paymentId: string;
  amount: number;
  currency: string;
  status: RefundStatus;
  reason?: string;
  createdAt: string;
}

// Webhook Types
export interface WebhookEndpoint {
  id: number;
  url: string;
  status: 'ACTIVE' | 'DISABLED';
  subscribedEvents: string[];
  createdAt: string;
}

export interface WebhookEventSummary {
  eventId: string;
  eventType: string;
  status: 'SUCCESS' | 'FAILED' | 'PENDING';
  receivedAt: string;
}

// Reconciliation Types
export interface ReconciliationSummary {
  batchId: string;
  runAt: string;
  status: 'COMPLETED' | 'RUNNING' | 'FAILED';
  matched: number;
  mismatched: number;
  missingProvider: number;
  missingInternal: number;
}
```

---

## 4. Sample vs Real Data Policy

- During early milestone UI prototyping, mock fixture data may be used solely for layout validation.
- Mock fixtures must be placed in a dedicated `src/services/mock/` folder and strictly gated behind an environment flag (`VITE_USE_MOCK_DATA=false` by default).
- Production and integration tests must always connect to the actual Spring Boot backend APIs.
