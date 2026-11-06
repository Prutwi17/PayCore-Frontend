export interface AuditLog {
  id: number;
  actorId: string;
  actorRole: string | null;
  merchantId: number | null;
  action: string;
  resourceType: string;
  resourceId: string;
  description: string | null;
  beforeData: string | null;
  afterData: string | null;
  reason: string | null;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: string;
}

export interface AuditLogFilter {
  actorId?: string;
  action?: string;
  resourceType?: string;
  resourceId?: string;
  merchantId?: number;
  startDate?: string;
  endDate?: string;
  page?: number;
  size?: number;
}
