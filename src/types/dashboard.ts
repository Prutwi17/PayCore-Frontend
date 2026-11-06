export interface AdminDashboardSummary {
  totalPayments: number;
  successfulPayments: number;
  failedPayments: number;
  pendingProcessingPayments: number;
  unknownPayments: number;
  totalPaymentVolume: number;
  paymentSuccessRate: number;

  totalRefunds: number;
  successfulRefunds: number;
  successfulRefundVolume: number;
  pendingRefunds: number;

  webhookDeliveryFailures: number;
  pendingWebhookRetries: number;

  latestReconciliationStatus: string;
  latestReconciliationAt: string | null;
  unresolvedDiscrepanciesCount: number;
}

export interface PaymentTrendPoint {
  date: string;
  total: number;
  successful: number;
  failed: number;
  amount: number;
}

export interface RefundTrendPoint {
  date: string;
  total: number;
  successful: number;
  amount: number;
}

export interface StatusDistribution {
  status: string;
  count: number;
  percentage: number;
}

export interface ReconciliationSummary {
  totalRuns: number;
  unresolvedDiscrepancies: number;
  latestRunReference: string | null;
  latestRunStatus: string | null;
  latestRunCompletedAt: string | null;
  discrepancyTypeCounts: Record<string, number>;
}
