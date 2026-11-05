export type TransactionType = 'PAYMENT' | 'REFUND';

export interface TransactionItem {
  transactionReference: string;
  transactionType: TransactionType;
  paymentReference: string;
  refundReference?: string;
  merchantId: number;
  merchantCode: string;
  amount: number;
  currency: string;
  status: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TransactionFilters {
  type?: TransactionType | '';
  status?: string;
  search?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  size?: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}
