import { apiClient } from './apiClient';
import { ApiResponse, PagedResponse } from '@/types/api';
import {
  ReconciliationRun,
  ReconciliationRecord,
  ReconciliationRunRequest,
  DiscrepancyResolutionRequest,
  ReconciliationRunFilter,
  ReconciliationRecordFilter,
} from '@/types/reconciliation';

export const reconciliationService = {
  /**
   * Initiates a new reconciliation run across payments, refunds, or both.
   */
  async triggerRun(payload: ReconciliationRunRequest): Promise<ReconciliationRun> {
    const response = await apiClient.post<ApiResponse<ReconciliationRun>>(
      '/admin/reconciliation/runs',
      payload
    );
    return response.data.data;
  },

  /**
   * Retrieves a paginated list of previous and active reconciliation runs.
   */
  async getRuns(filter: ReconciliationRunFilter = {}): Promise<PagedResponse<ReconciliationRun>> {
    const params = new URLSearchParams();
    if (filter.status) params.append('status', filter.status);
    if (filter.page !== undefined) params.append('page', filter.page.toString());
    if (filter.size !== undefined) params.append('size', filter.size.toString());

    const response = await apiClient.get<ApiResponse<PagedResponse<ReconciliationRun>>>(
      `/admin/reconciliation/runs?${params.toString()}`
    );
    return response.data.data;
  },

  /**
   * Retrieves a single reconciliation run by its unique reference.
   */
  async getRunByReference(reference: string): Promise<ReconciliationRun> {
    const response = await apiClient.get<ApiResponse<ReconciliationRun>>(
      `/admin/reconciliation/runs/${reference}`
    );
    return response.data.data;
  },

  /**
   * Retrieves reconciliation records within a specific run.
   */
  async getRunRecords(
    reference: string,
    filter: ReconciliationRecordFilter = {}
  ): Promise<PagedResponse<ReconciliationRecord>> {
    const params = new URLSearchParams();
    if (filter.status) params.append('status', filter.status);
    if (filter.discrepancyType) params.append('discrepancyType', filter.discrepancyType);
    if (filter.recordType) params.append('recordType', filter.recordType);
    if (filter.page !== undefined) params.append('page', filter.page.toString());
    if (filter.size !== undefined) params.append('size', filter.size.toString());

    const response = await apiClient.get<ApiResponse<PagedResponse<ReconciliationRecord>>>(
      `/admin/reconciliation/runs/${reference}/records?${params.toString()}`
    );
    return response.data.data;
  },

  /**
   * Retrieves all discrepancy records requiring investigation or resolution across all runs.
   */
  async getDiscrepancies(
    filter: ReconciliationRecordFilter = {}
  ): Promise<PagedResponse<ReconciliationRecord>> {
    const params = new URLSearchParams();
    if (filter.status) params.append('status', filter.status);
    if (filter.discrepancyType) params.append('discrepancyType', filter.discrepancyType);
    if (filter.recordType) params.append('recordType', filter.recordType);
    if (filter.page !== undefined) params.append('page', filter.page.toString());
    if (filter.size !== undefined) params.append('size', filter.size.toString());

    const response = await apiClient.get<ApiResponse<PagedResponse<ReconciliationRecord>>>(
      `/admin/reconciliation/discrepancies?${params.toString()}`
    );
    return response.data.data;
  },

  /**
   * Resolves a discrepancy record with justification notes and audit logging.
   */
  async resolveDiscrepancy(
    recordId: number,
    payload: DiscrepancyResolutionRequest
  ): Promise<ReconciliationRecord> {
    const response = await apiClient.post<ApiResponse<ReconciliationRecord>>(
      `/admin/reconciliation/records/${recordId}/resolve`,
      payload
    );
    return response.data.data;
  },
};
