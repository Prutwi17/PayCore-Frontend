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


### 3.4 Payment & Telemetry Types (src/types/payment.ts)

`	ypescript
export type PaymentStatus =
  | 'CREATED'
  | 'PROCESSING'
  | 'REQUIRES_ACTION'
  | 'AUTHORIZED'
  | 'SUCCESS'
  | 'FAILED'
  | 'CANCELLED'
  | 'UNKNOWN';

export type PaymentMethodType =
  | 'CREDIT_CARD'
  | 'DEBIT_CARD'
  | 'BANK_TRANSFER'
  | 'UPI'
  | 'WALLET';

export type PaymentAttemptStatus = 'SUCCESS' | 'FAILED' | 'PENDING' | 'TIMEOUT';

export interface PaymentAttemptItem {
  id: number;
  attemptNumber: number;
  provider: string;
  providerTransactionId?: string;
  status: PaymentAttemptStatus;
  requestReference: string;
  responseCode?: string;
  responseMessage?: string;
  startedAt: string;
  completedAt?: string;
  createdAt: string;
}

export interface PaymentItem {
  id: number;
  paymentReference: string;
  merchantCode: string;
  customerReference: string;
  amount: number;
  currency: string;
  description?: string;
  paymentMethod: PaymentMethodType;
  status: PaymentStatus;
  provider?: string;
  providerTransactionId?: string;
  failureCode?: string;
  failureMessage?: string;
  createdAt: string;
  updatedAt: string;
  processedAt?: string;
  attempts?: PaymentAttemptItem[];
}

export interface PaymentCreatePayload {
  amount: number;
  currency: string;
  paymentMethod: PaymentMethodType;
  customerReference: string;
  description?: string;
  simulationScenario?: 'SUCCESS' | 'FAIL' | 'TIMEOUT' | 'REQUIRES_ACTION';
}

export interface PaymentStatusResponse {
  paymentReference: string;
  status: PaymentStatus;
  previousStatus?: PaymentStatus;
  updated: boolean;
  message: string;
  checkedAt: string;
}
`

---

### 4.4 Payment Service (src/services/api/paymentService.ts)
- createPayment(payload: PaymentCreatePayload): Promise<PaymentItem> -> POST /api/v1/payments
- listMerchantPayments(params): Promise<PagedResponse<PaymentItem>> -> GET /api/v1/payments
- getPayment(ref: string): Promise<PaymentItem> -> GET /api/v1/payments/{paymentReference}
- getPaymentAttempts(ref: string): Promise<PaymentAttemptItem[]> -> GET /api/v1/payments/{paymentReference}/attempts
- getPaymentStatus(ref: string): Promise<PaymentStatusResponse> -> GET /api/v1/payments/{paymentReference}/status
- cancelPayment(ref: string, reason?: string): Promise<PaymentItem> -> POST /api/v1/payments/{paymentReference}/cancel
- listAdminPayments(params): Promise<PagedResponse<PaymentItem>> -> GET /api/v1/admin/payments
- getAdminPayment(ref: string): Promise<PaymentItem> -> GET /api/v1/admin/payments/{paymentReference}
- getAdminPaymentAttempts(ref: string): Promise<PaymentAttemptItem[]> -> GET /api/v1/admin/payments/{paymentReference}/attempts

---

### 4.5 Refund Types & Service (src/types/refund.ts & src/services/api/refundService.ts)

```typescript
export type RefundStatus = 'REQUESTED' | 'PROCESSING' | 'SUCCESS' | 'FAILED' | 'UNKNOWN';

export interface RefundItem {
  id: number;
  refundReference: string;
  paymentReference: string;
  merchantId: number;
  merchantCode: string;
  amount: number;
  currency: string;
  reason?: string;
  status: RefundStatus;
  providerRefundId?: string;
  failureCode?: string;
  failureMessage?: string;
  requestedAt: string;
  processedAt?: string;
  createdAt: string;
  updatedAt: string;
  idempotentReplay?: boolean;
}

export interface RefundCreatePayload {
  amount: number;
  currency: string;
  reason?: string;
}

export interface RefundableAmountResponse {
  paymentReference: string;
  originalAmount: number;
  totalRefundedAmount: number;
  pendingRefundAmount: number;
  remainingRefundableAmount: number;
  currency: string;
  refundable: boolean;
}
```

**Refund Service Methods:**
- `initiateRefund(paymentReference, payload, idempotencyKey)`: `POST /api/v1/payments/{paymentReference}/refunds`
- `getRefundableAmount(paymentReference)`: `GET /api/v1/payments/{paymentReference}/refundable-amount`
- `listMerchantRefunds(params)`: `GET /api/v1/refunds`
- `getRefund(refundReference)`: `GET /api/v1/refunds/{refundReference}`
- `getPaymentRefunds(paymentReference)`: `GET /api/v1/payments/{paymentReference}/refunds`
- `verifyRefund(refundReference)`: `POST /api/v1/refunds/{refundReference}/verify`
- `listAdminRefunds(params)`: `GET /api/v1/admin/refunds`
- `getAdminRefund(refundReference)`: `GET /api/v1/admin/refunds/{refundReference}`
- `verifyAdminRefund(refundReference)`: `POST /api/v1/admin/refunds/{refundReference}/verify`

---

### 4.6 Transaction Types & Service (src/types/transaction.ts & src/services/api/transactionService.ts)

```typescript
export type TransactionType = 'PAYMENT' | 'REFUND';

export interface TransactionItem {
  transactionId: string;
  transactionReference: string;
  parentReference: string;
  merchantId: number;
  type: TransactionType;
  amount: number;
  currency: string;
  status: string;
  description?: string;
  createdAt: string;
  processedAt?: string;
}
```

**Transaction Service Methods:**
- `listMerchantTransactions(filters)`: `GET /api/v1/transactions`
- `listAdminTransactions(filters)`: `GET /api/v1/admin/transactions`

---

### 4.7 Webhook Types & Service (src/types/webhook.ts & src/services/api/webhookService.ts)

```typescript
export type EndpointStatus = 'ACTIVE' | 'INACTIVE' | 'DISABLED';
export type WebhookDeliveryStatus = 'PENDING' | 'SUCCESS' | 'RETRYING' | 'FAILED' | 'DEAD_LETTER';
export type OutboxStatus = 'PENDING' | 'PUBLISHED' | 'FAILED';
export type InboxStatus = 'RECEIVED' | 'PROCESSING' | 'PROCESSED' | 'FAILED';

export interface WebhookEndpointItem {
  id: number;
  endpointReference: string;
  merchantId: number;
  url: string;
  maskedSecret: string;
  secret?: string | null;
  subscribedEvents: string;
  status: EndpointStatus;
  description?: string;
  failureCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface WebhookDeliveryItem {
  id: number;
  attemptReference: string;
  eventReference: string;
  eventType: string;
  endpointReference: string;
  merchantId: number;
  requestUrl: string;
  attemptNumber: number;
  deliveryStatus: WebhookDeliveryStatus;
  httpStatusCode?: number | null;
  responseBody?: string | null;
  executionDurationMs?: number | null;
  nextRetryAt?: string | null;
  failureReason?: string | null;
  attemptedAt: string;
  createdAt: string;
}

export interface WebhookMetricsResponse {
  pendingOutboxCount: number;
  failedOutboxCount: number;
  totalDeliveries: number;
  successfulDeliveries: number;
  failedDeliveries: number;
  deadLetterDeliveries: number;
  deliverySuccessRate: number;
}
```

**Webhook Service Methods:**
- Merchant Endpoints:
  - `listEndpoints()`: `GET /api/v1/webhooks/endpoints`
  - `createEndpoint(payload)`: `POST /api/v1/webhooks/endpoints`
  - `getEndpoint(ref)`: `GET /api/v1/webhooks/endpoints/{endpointReference}`
  - `updateEndpoint(ref, payload)`: `PUT /api/v1/webhooks/endpoints/{endpointReference}`
  - `updateEndpointStatus(ref, status)`: `PATCH /api/v1/webhooks/endpoints/{endpointReference}/status`
  - `rotateSecret(ref)`: `POST /api/v1/webhooks/endpoints/{endpointReference}/rotate-secret`
  - `deleteEndpoint(ref)`: `DELETE /api/v1/webhooks/endpoints/{endpointReference}`
- Merchant Deliveries & Events:
  - `listDeliveries(params)`: `GET /api/v1/webhooks/deliveries`
  - `getDelivery(ref)`: `GET /api/v1/webhooks/deliveries/{attemptReference}`
  - `retryDelivery(ref)`: `POST /api/v1/webhooks/deliveries/{attemptReference}/retry`
  - `listEvents(params)`: `GET /api/v1/webhooks/events`
- Admin Governance & Pipeline:
  - `getMetrics()`: `GET /api/v1/admin/webhooks/metrics`
  - `listOutboxEvents(params)`: `GET /api/v1/admin/webhooks/outbox`
  - `republishOutboxEvent(eventId)`: `POST /api/v1/admin/webhooks/outbox/{eventId}/republish`
  - `listInboxEvents(params)`: `GET /api/v1/admin/webhooks/inbox`
  - `listAdminDeliveries(params)`: `GET /api/v1/admin/webhooks/deliveries`
  - `listDeadLetterDeliveries(params)`: `GET /api/v1/admin/webhooks/deliveries/dead-letter`
  - `replayDelivery(ref)`: `POST /api/v1/admin/webhooks/deliveries/{attemptReference}/replay`
