import { apiClient } from './apiClient';
import { ApiResponse, PagedResponse } from '@/types/api';
import { AuditLog, AuditLogFilter } from '@/types/audit';

export const auditService = {
  /**
   * Retrieves paginated, filterable immutable audit log entries.
   */
  async getAuditLogs(filter: AuditLogFilter = {}): Promise<PagedResponse<AuditLog>> {
    const params = new URLSearchParams();
    if (filter.actorId) params.append('actorId', filter.actorId);
    if (filter.action) params.append('action', filter.action);
    if (filter.resourceType) params.append('resourceType', filter.resourceType);
    if (filter.resourceId) params.append('resourceId', filter.resourceId);
    if (filter.merchantId) params.append('merchantId', filter.merchantId.toString());
    if (filter.startDate) params.append('startDate', filter.startDate);
    if (filter.endDate) params.append('endDate', filter.endDate);
    if (filter.page !== undefined) params.append('page', filter.page.toString());
    if (filter.size !== undefined) params.append('size', filter.size.toString());

    const response = await apiClient.get<ApiResponse<PagedResponse<AuditLog>>>(
      `/admin/audit-logs?${params.toString()}`
    );
    return response.data.data;
  },

  /**
   * Retrieves a single immutable audit log entry by ID.
   */
  async getAuditLogById(id: number): Promise<AuditLog> {
    const response = await apiClient.get<ApiResponse<AuditLog>>(`/admin/audit-logs/${id}`);
    return response.data.data;
  },

  /**
   * Retrieves the 20 most recent system audit log events.
   */
  async getRecentAuditLogs(): Promise<AuditLog[]> {
    const response = await apiClient.get<ApiResponse<AuditLog[]>>('/admin/audit-logs/recent');
    return response.data.data;
  },
};
