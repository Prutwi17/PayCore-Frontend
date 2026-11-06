export type RunType = 'PAYMENTS' | 'REFUNDS' | 'FULL';

export type RunStatus =
  | 'PENDING'
  | 'RUNNING'
  | 'COMPLETED'
  | 'COMPLETED_WITH_ERRORS'
  | 'FAILED';

export type RecordType = 'PAYMENT' | 'REFUND';

export type DiscrepancyType =
  | 'MATCHED'
  | 'MISSING_INTERNAL'
  | 'MISSING_PROVIDER'
  | 'AMOUNT_MISMATCH'
  | 'CURRENCY_MISMATCH'
  | 'STATUS_MISMATCH'
  | 'DUPLICATE_PROVIDER_RECORD'
  | 'UNKNOWN_OUTCOME'
  | 'REVIEW_REQUIRED';

export type RecordStatus = 'MATCHED' | 'UNMATCHED' | 'REVIEW_REQUIRED' | 'RESOLVED';

export interface ReconciliationRun {
  id: number;
  runReference: string;
  runType: RunType;
  status: RunStatus;
  startedAt: string | null;
  completedAt: string | null;
  totalRecords: number;
  matchedRecords: number;
  discrepancyRecords: number;
  failedRecords: number;
  initiatedBy: string | null;
  errorSummary: string | null;
  scopeStartDate: string | null;
  scopeEndDate: string | null;
  createdAt: string;
}

export interface ReconciliationRecord {
  id: number;
  runId: number;
  runReference: string;
  recordType: RecordType;
  internalReference: string | null;
  providerReference: string | null;
  internalAmount: number | null;
  providerAmount: number | null;
  currency: string;
  internalStatus: string | null;
  providerStatus: string | null;
  discrepancyType: DiscrepancyType;
  status: RecordStatus;
  resolutionNotes: string | null;
  resolvedBy: string | null;
  resolvedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ReconciliationRunRequest {
  runType?: RunType;
  startDate?: string;
  endDate?: string;
  notes?: string;
}

export interface DiscrepancyResolutionRequest {
  reason: string;
  notes: string;
}

export interface ReconciliationRunFilter {
  status?: RunStatus;
  page?: number;
  size?: number;
}

export interface ReconciliationRecordFilter {
  status?: RecordStatus;
  discrepancyType?: DiscrepancyType;
  recordType?: RecordType;
  page?: number;
  size?: number;
}
