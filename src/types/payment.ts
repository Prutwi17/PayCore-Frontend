export type PaymentStatus =
  | 'CREATED'
  | 'PROCESSING'
  | 'REQUIRES_ACTION'
  | 'AUTHORIZED'
  | 'SUCCESS'
  | 'FAILED'
  | 'CANCELLED'
  | 'UNKNOWN'
  | 'PARTIALLY_REFUNDED'
  | 'REFUNDED';

export type PaymentMethodType =
  | 'CARD'
  | 'UPI'
  | 'NET_BANKING'
  | 'WALLET'
  | 'BANK_TRANSFER';

export type PaymentAttemptStatus =
  | 'INITIATED'
  | 'SUCCESS'
  | 'FAILED'
  | 'REQUIRES_ACTION'
  | 'UNKNOWN';

export interface PaymentItem {
  id: number;
  paymentReference: string;
  merchantId: number;
  merchantCode: string;
  customerReference?: string;
  amount: number;
  amountRefunded?: number;
  remainingRefundableAmount?: number;
  currency: string;
  description?: string;
  paymentMethod: PaymentMethodType;
  status: PaymentStatus;
  provider: string;
  providerTransactionId?: string;
  failureCode?: string;
  failureMessage?: string;
  createdAt: string;
  updatedAt: string;
  processedAt?: string;
  idempotentReplay?: boolean;
}

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

export interface PaymentCreatePayload {
  amount: number;
  currency: string;
  description?: string;
  paymentMethod?: PaymentMethodType;
  customerReference?: string;
  simulationScenario?: 'SUCCESS' | 'FAIL' | 'TIMEOUT' | 'REQUIRES_ACTION';
  idempotencyKey?: string;
}

export interface PaymentStatusResponse {
  paymentReference: string;
  status: PaymentStatus;
  amount: number;
  currency: string;
  failureCode?: string;
  failureMessage?: string;
  processedAt?: string;
}

export interface PaymentCreationResult {
  payment: PaymentItem;
  isReplay: boolean;
  httpStatus: number;
}
