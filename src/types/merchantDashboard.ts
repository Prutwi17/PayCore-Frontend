import { TransactionItem } from './transaction';

export interface MerchantDashboardSummary {
  totalPayments: number;
  successfulPayments: number;
  failedPayments: number;
  pendingPayments: number;
  totalPaymentVolume: number;
  totalRefunds: number;
  successfulRefunds: number;
  totalRefundVolume: number;
  netVolume: number;
  totalWebhooks: number;
  failedWebhooks: number;
  recentTransactions: TransactionItem[];
}
