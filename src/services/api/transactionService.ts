import { apiClient } from './apiClient';
import { ApiResponse, PagedResponse } from '@/types/api';
import { TransactionFilters, TransactionItem } from '@/types/transaction';

export const transactionService = {
  /**
   * Retrieves unified transaction ledger for the authenticated merchant.
   */
  async listMerchantTransactions(
    params?: TransactionFilters
  ): Promise<PagedResponse<TransactionItem>> {
    const response = await apiClient.get<ApiResponse<PagedResponse<TransactionItem>>>(
      '/transactions',
      { params }
    );
    return response.data.data;
  },

  /**
   * Administrator: retrieves global transaction ledger across all merchants.
   */
  async listAdminTransactions(
    params?: TransactionFilters & { merchantId?: number }
  ): Promise<PagedResponse<TransactionItem>> {
    const response = await apiClient.get<ApiResponse<PagedResponse<TransactionItem>>>(
      '/admin/transactions',
      { params }
    );
    return response.data.data;
  },
};
