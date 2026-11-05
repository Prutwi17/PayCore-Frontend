export type RefundStatus =
  | 'REQUESTED'
  | 'PROCESSING'
  | 'SUCCESS'
  | 'FAILED'
  | 'UNKNOWN';

export interface RefundItem {
  id: number;
  refundReference: string;
  paymentReference: string;
  merchantId: number;
  merchantCode: string;
  amount: number;
  currency: string;
  status: RefundStatus;
  reason?: string;
  providerRefundId?: string;
  failureCode?: string;
  failureMessage?: string;
  requestedAt: string;
  processedAt?: string;
  createdAt: string;
  idempotentReplay?: boolean;
}

export interface RefundCreatePayload {
  amount: number;
  currency: string;
  reason?: string;
  idempotencyKey?: string;
}

export interface RefundableAmountResponse {
  paymentReference: string;
  currency: string;
  originalAmount: number;
  totalRefundedAmount: number;
  pendingRefundAmount: number;
  remainingRefundableAmount: number;
  refundable: boolean;
}

export interface RefundCreationResult {
  refund: RefundItem;
  isReplay: boolean;
  httpStatus: number;
}
