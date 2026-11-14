import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Key,
  CreditCard,
  RotateCcw,
  Webhook,
  Scale,
  Shield,
  Layers,
  CheckCircle2,
  Database,
  ArrowRight,
  FileCode,
} from 'lucide-react';

interface ModuleCard {
  id: string;
  number: string;
  name: string;
  subtitle: string;
  description: string;
  icon: React.ElementType;
  tables: string[];
  keyClasses: string[];
  responsibilities: string[];
}

const MODULES: ModuleCard[] = [
  {
    id: 'auth',
    number: '01',
    name: 'Authentication & Google Identity',
    subtitle: 'Zero-Trust Identity, Google OpenID Connect & Email Verification',
    description: 'Manages user registration, real Google OAuth OpenID Connect sign-in, Gmail API verification, and rotatable refresh tokens.',
    icon: Key,
    tables: ['users', 'roles', 'user_roles', 'user_external_identities', 'email_verification_tokens', 'password_reset_tokens', 'refresh_tokens', 'admin_setup_tokens'],
    keyClasses: ['AuthService', 'DefaultGoogleTokenVerifier', 'GmailApiEmailService', 'GmailOAuthService', 'JwtAuthenticationFilter', 'TokenCleanupScheduler'],
    responsibilities: [
      'Verifies Google OpenID Connect ID token signatures and maps Google subject IDs (sub) safely',
      'Dispatches verification emails through Gmail API and OAuth 2.0 offline refresh tokens',
      'Stores SHA-256 token hashes at rest with 24h verification and 1h reset expiration',
      'Rotates refresh tokens and invalidates entire token family upon replay detection',
      'Enforces zero default passwords in production; restricts onboarding for omp27614@gmail.com'
    ]
  },
  {
    id: 'merchant',
    number: '02',
    name: 'Merchant Management & API Credentials',
    subtitle: 'Multi-Tenant Isolation & Scoped Programmatic Access',
    description: 'Maintains merchant operational profiles, business validation, and single-exposure SHA-256 hashed API keys.',
    icon: Shield,
    tables: ['merchants', 'merchant_api_keys'],
    keyClasses: ['MerchantService', 'MerchantApiKeyService', 'ApiKeyAuthenticationFilter', 'AdminMerchantController'],
    responsibilities: [
      'Multi-tenant merchant isolation with unique merchantCode identifiers',
      'Generates cryptographically secure API keys with sk_live_ and sk_test_ prefixes',
      'Single-exposure secret disclosure policy; database stores only SHA-256 hashes',
      'Merchant activation, status suspension, and audit event dispatch'
    ]
  },
  {
    id: 'payment',
    number: '03',
    name: 'Payment Processing & State Machine',
    subtitle: 'High-Throughput State Machine & Non-Blocking Provider Communication',
    description: 'Executes payments across provider integrations without holding transactional database locks during network roundtrips.',
    icon: CreditCard,
    tables: ['payments', 'payment_attempts'],
    keyClasses: ['PaymentService', 'PaymentStateMachine', 'SimulatedPaymentProvider', 'PaymentRetryExecutor'],
    responsibilities: [
      'Atomic payment lifecycle management across CREATED, PROCESSING, SUCCESS, FAILED',
      'Asynchronous simulated provider execution with deterministic latency simulation',
      'Full attempt telemetry logging including roundtrip latency and provider references',
      'Immediate outbox event creation upon terminal state persistence'
    ]
  },
  {
    id: 'idempotency',
    number: '04',
    name: 'Distributed Idempotency Layer',
    subtitle: 'Composite Database Constraints & Redis Fast Locking',
    description: 'Guarantees exactly-once processing semantics for network retries and duplicate HTTP requests.',
    icon: Layers,
    tables: ['idempotency_records'],
    keyClasses: ['IdempotencyService', 'RedisDistributedLockService', 'RequestFingerprintUtil'],
    responsibilities: [
      'Composite MySQL unique constraint on (merchant_id, idempotency_key) as authoritative barrier',
      'Redis distributed fast-locking with atomic TTL and automatic failover fallback',
      'Deterministic SHA-256 request payload fingerprinting rejecting payload mutation with 409 Conflict',
      'Cached response replay with original HTTP headers and Idempotent-Replay: true'
    ]
  },
  {
    id: 'refund',
    number: '05',
    name: 'Two-Phase Balance Refund Engine',
    subtitle: 'Atomic Refundable Sum Validation & Reversal Ledger',
    description: 'Executes partial and full refunds with database-level pessimistic locking ensuring refunded sums never exceed charges.',
    icon: RotateCcw,
    tables: ['refunds', 'refund_attempts'],
    keyClasses: ['RefundService', 'RefundStateMachine', 'SimulatedRefundProvider'],
    responsibilities: [
      'Enforces total refunded amount <= original charge amount with 0-cent precision',
      'Pessimistic write locking on payment records during refund initiation',
      'Maintains independent refund attempt logs and reversible accounting records',
      'Dispatches REFUND_SUCCESS outbox events for webhook consumers'
    ]
  },
  {
    id: 'webhooks',
    number: '06',
    name: 'Transactional Outbox & Webhooks',
    subtitle: 'At-Least-Once Delivery via Apache Kafka & HMAC-SHA256 Signing',
    description: 'Publishes payment and refund events through transactional outbox to Kafka, dispatched to merchants with cryptographic signatures.',
    icon: Webhook,
    tables: ['outbox_events', 'webhook_endpoints', 'webhook_delivery_attempts'],
    keyClasses: ['OutboxPublisherScheduler', 'KafkaPaymentEventProducer', 'WebhookDeliveryWorker', 'WebhookSigner'],
    responsibilities: [
      'Guaranteed outbox persistence inside payment and refund ACID database transactions',
      'Kafka partition distribution by merchant aggregate ID for strict event ordering',
      'HMAC-SHA256 signed headers (X-PayCore-Signature) with anti-replay timestamps',
      'Exponential backoff retry scheduler with dead-letter queue escalation'
    ]
  },
  {
    id: 'reconciliation',
    number: '07',
    name: 'Multi-Source Settlement Reconciliation',
    subtitle: 'Independent Provider Feed Comparison & Discrepancy Resolution',
    description: 'Compares internal payment ledgers against independent provider settlement statements to identify and resolve mismatches.',
    icon: Scale,
    tables: ['reconciliation_runs', 'reconciliation_records', 'provider_statement_records'],
    keyClasses: ['ReconciliationService', 'ReconciliationMatcher', 'SimulatedProviderReconciliationAdapter'],
    responsibilities: [
      'Automated batch comparison between PayCore ledger and external provider records',
      'Categorizes discrepancies: AMOUNT_MISMATCH, STATUS_MISMATCH, MISSING_IN_PROVIDER',
      'Manual triage interface allowing administrative overrides with audit justification',
      'Produces reconciliation run summaries and discrepancy audit reports'
    ]
  },
  {
    id: 'audit',
    number: '08',
    name: 'Immutable Audit Trail & Forensics',
    subtitle: 'Append-Only Governance & Administrative Activity Logging',
    description: 'Captures every privileged operation, role mutation, refund execution, and key rotation with client IP and forensic snapshots.',
    icon: Shield,
    tables: ['audit_logs'],
    keyClasses: ['AuditLogService', 'AuditLogRepository', 'AdminAuditLogController'],
    responsibilities: [
      'Immutable append-only audit trail capturing actor, role, IP, and before/after diffs',
      'Structured categorization across AUTH, PAYMENT, REFUND, MERCHANT, and RECONCILIATION',
      'Granular search filters for compliance auditing and incident investigation',
      'Zero mutation API policy; records cannot be updated or deleted'
    ]
  }
];

export const ModulesPage: React.FC = () => {
  const [selectedModule, setSelectedModule] = useState<ModuleCard>(MODULES[0]);

  return (
    <div className="w-full bg-slate-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
            Enterprise Architecture Specification
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            PayCore Application Modules
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Architectural breakdown of the 8 core domain modules comprising the PayCore Payment Processing Engine. Each module maintains strict isolation, dedicated persistence entities, and transaction boundaries.
          </p>
        </div>

        {/* Module Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {MODULES.map((m) => {
            const Icon = m.icon;
            const isSelected = selectedModule.id === m.id;
            return (
              <button
                key={m.id}
                onClick={() => setSelectedModule(m)}
                className={`p-5 rounded-2xl text-left transition-all border ${
                  isSelected
                    ? 'bg-white border-blue-600 shadow-lg shadow-blue-500/10 ring-2 ring-blue-500/20'
                    : 'bg-white/80 border-slate-200 hover:border-slate-300 hover:bg-white shadow-xs'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                    isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="font-mono text-xs font-bold text-slate-400">{m.number}</span>
                </div>
                <h3 className="font-bold text-sm text-slate-900 tracking-tight">{m.name}</h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">{m.subtitle}</p>
              </button>
            );
          })}
        </div>

        {/* Selected Module Detail Card */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-8 sm:p-10 shadow-xl space-y-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center font-bold">
                {React.createElement(selectedModule.icon, { className: 'w-6 h-6' })}
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-xs font-bold text-blue-600">MODULE {selectedModule.number}</span>
                  <span className="text-slate-300">/</span>
                  <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">{selectedModule.id}</span>
                </div>
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">{selectedModule.name}</h2>
              </div>
            </div>
            <Link
              to="/docs"
              className="inline-flex items-center space-x-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 px-4 py-2 rounded-xl transition-colors"
            >
              <span>View API Docs</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <p className="text-sm text-slate-700 leading-relaxed max-w-4xl">
            {selectedModule.description}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
            {/* Responsibilities */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-blue-600" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">Key Domain Responsibilities</h4>
              </div>
              <ul className="space-y-2.5">
                {selectedModule.responsibilities.map((r, i) => (
                  <li key={i} className="flex items-start space-x-2.5 text-xs text-slate-600 leading-relaxed">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 flex-shrink-0" />
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Architecture Metadata */}
            <div className="space-y-6">
              {/* Tables */}
              <div>
                <div className="flex items-center space-x-2 mb-2.5">
                  <Database className="w-4 h-4 text-slate-500" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">Relational Tables</h4>
                </div>
                <div className="flex flex-wrap gap-1.5 font-mono text-xs">
                  {selectedModule.tables.map((t) => (
                    <span key={t} className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg border border-slate-200">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Spring Boot Classes */}
              <div>
                <div className="flex items-center space-x-2 mb-2.5">
                  <FileCode className="w-4 h-4 text-slate-500" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">Primary Spring Boot Classes</h4>
                </div>
                <div className="flex flex-wrap gap-1.5 font-mono text-xs">
                  {selectedModule.keyClasses.map((c) => (
                    <span key={c} className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-lg border border-blue-200/60">
                      {c}.java
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
