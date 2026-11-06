import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  RotateCcw,
  Webhook,
  Scale,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  Terminal,
  Activity
} from 'lucide-react';

interface FeatureTab {
  id: string;
  title: string;
  badge: string;
  description: string;
  icon: React.ElementType;
  points: string[];
  codeSample: string;
}

const FEATURE_TABS: FeatureTab[] = [
  {
    id: 'idempotency',
    title: 'Distributed Idempotency & Zero Double-Charges',
    badge: 'Core Reliability',
    description: 'Guarantees that network retries, client disconnects, and duplicate requests never trigger duplicate charges or ledger inconsistencies.',
    icon: ShieldCheck,
    points: [
      'Composite MySQL unique constraint on (merchant_id, idempotency_key) as the authoritative final barrier',
      'Redis distributed fast-locking with atomic TTL coordination and automatic failover circuit breakers',
      'Deterministic SHA-256 request fingerprinting rejecting payload alteration with HTTP 409 Conflict',
      'Safe cached replay returning original transaction with Idempotent-Replay: true header'
    ],
    codeSample: `// Client Request with Distributed Idempotency Key
POST /api/v1/payments HTTP/1.1
Host: api.paycore.internal
Authorization: Bearer <jwt_access_token>
X-Api-Key: sk_live_4f89d9e2a1b7...
Idempotency-Key: 9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d
Content-Type: application/json

{
  "amount": 150.00,
  "currency": "USD",
  "paymentMethod": "CREDIT_CARD",
  "customerEmail": "customer@business.com",
  "description": "Enterprise Subscription - Monthly"
}`
  },
  {
    id: 'state-machine',
    title: 'Strict Payment Lifecycle State Machine',
    badge: 'Deterministic Transitions',
    description: 'Enforces mathematically validated state transitions across every stage of the payment and settlement lifecycle.',
    icon: Activity,
    points: [
      'Strict transitions: CREATED → PROCESSING → SUCCESS, FAILED, REQUIRES_ACTION, or UNKNOWN',
      'Terminal state immutability: completed or cancelled transactions cannot be mutated or overridden',
      'Two-Phase Zero-DB Network I/O: database connections are never held open during external gateway network latency',
      'Self-healing status query endpoint to authoritatively resolve indeterminate UNKNOWN outcomes'
    ],
    codeSample: `// State Machine Transition Enforcement
public enum PaymentStatus {
    CREATED,
    PROCESSING,
    REQUIRES_ACTION,
    AUTHORIZED,
    SUCCESS,
    FAILED,
    CANCELLED,
    UNKNOWN;

    public boolean canTransitionTo(PaymentStatus next) {
        // Enforces valid lifecycle transitions
        return VALID_TRANSITIONS.getOrDefault(this, Set.of()).contains(next);
    }
}`
  },
  {
    id: 'webhooks',
    title: 'Transactional Outbox & Kafka Webhooks',
    badge: 'Event-Driven Architecture',
    description: 'Asynchronous, fault-tolerant event streaming delivering cryptographically signed webhooks to merchant endpoints.',
    icon: Webhook,
    points: [
      'Transactional Outbox Pattern guarantees zero lost events across application crashes or broker restarts',
      'Apache Kafka topic partitioning on paymentReference guarantees strict per-entity message ordering',
      'Canonical HMAC-SHA256 signature headers (X-PayCore-Signature: t=timestamp,v1=hash) with 5-minute replay tolerance',
      'Multi-layer SSRF defense blocking RFC-1918 private subnets, loopback addresses, and cloud metadata endpoints'
    ],
    codeSample: `// Verifying Outbound PayCore Webhook Signature (Node.js / Express)
const crypto = require('crypto');

function verifyWebhook(rawBody, signatureHeader, secret) {
  const parts = Object.fromEntries(signatureHeader.split(',').map(kv => kv.split('=')));
  const timestamp = parts.t;
  const signature = parts.v1;

  const payload = timestamp + '.' + rawBody;
  const expected = crypto.createHmac('sha256', secret).update(payload).digest('hex');

  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
}`
  },
  {
    id: 'refunds',
    title: 'Two-Phase Balance-Reserved Refund Engine',
    badge: 'Financial Integrity',
    description: 'High-concurrency refund engine with atomic balance reservations preventing simultaneous over-refunding.',
    icon: RotateCcw,
    points: [
      'Row-level pessimistic write locking on payment records during reservation phase',
      'Atomically tracks amount_refund_reserved and amount_refunded in MySQL DECIMAL(19, 4)',
      'Network timeouts leave balance safely reserved in UNKNOWN status awaiting verification',
      'Unified high-performance v_transactions database view consolidating payments and refunds'
    ],
    codeSample: `// Atomic Reservation Phase
@Lock(LockModeType.PESSIMISTIC_WRITE)
@Query("SELECT p FROM Payment p WHERE p.paymentReference = :reference")
Optional<Payment> findByReferenceForUpdate(@Param("reference") String reference);

// Balance Safety Check:
BigDecimal available = payment.getAmount()
    .subtract(payment.getAmountRefunded())
    .subtract(payment.getAmountRefundReserved());

if (refundAmount.compareTo(available) > 0) {
    throw new InsufficientRefundableBalanceException(paymentReference);
}`
  },
  {
    id: 'reconciliation',
    title: 'Two-Sided Financial Settlement Reconciliation',
    badge: 'Audit & Compliance',
    description: 'Independent reconciliation engine verifying PayCore internal transaction ledgers against provider statement records.',
    icon: Scale,
    points: [
      'Compares internal payments and refunds against independent simulated provider transaction archives',
      'Automated discrepancy classification: status mismatch, amount difference, missing internal, missing provider',
      'Manual adjustment resolution interface recording operator notes, timestamp, and audit trail',
      'Immutable audit logging capturing every administrative, payment, and reconciliation action'
    ],
    codeSample: `// Reconciliation Run Execution
POST /api/v1/admin/reconciliation/runs/trigger?provider=SIMULATED_PROVIDER HTTP/1.1
Host: api.paycore.internal
Authorization: Bearer <admin_jwt_token>

Response 201 Created:
{
  "status": "success",
  "data": {
    "runReference": "rec_run_9d42e18f",
    "provider": "SIMULATED_PROVIDER",
    "totalRecordsProcessed": 12840,
    "matchedCount": 12822,
    "discrepancyCount": 18,
    "status": "COMPLETED"
  }
}`
  }
];

export const FeaturesPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('idempotency');
  const currentTab = FEATURE_TABS.find((t) => t.id === activeTab) || FEATURE_TABS[0];
  const IconComponent = currentTab.icon;

  return (
    <div className="relative min-h-screen bg-white">
      {/* Subtle ambient lighting */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-100/40 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/3 left-10 w-80 h-80 bg-blue-50/50 rounded-full blur-2xl pointer-events-none -z-10" />

      {/* Header Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 md:pt-20 md:pb-16 text-center">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-xs font-semibold text-blue-700 mb-6">
          <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
          <span>Enterprise Payment Architecture</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-slate-900 leading-tight">
          Engineered for <span className="text-blue-600">Zero-Failure</span> Payment Operations
        </h1>
        <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
          Explore the technical guarantees, architectural patterns, and security mechanisms powering the PayCore Payment Processing Engine.
        </p>
      </section>

      {/* Interactive Feature Explorer */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {/* Navigation Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12 p-1.5 bg-slate-100/80 rounded-2xl max-w-4xl mx-auto border border-slate-200/60">
          {FEATURE_TABS.map((tab) => {
            const TabIcon = tab.icon;
            const isActive = tab.id === activeTab;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-white text-blue-600 shadow-sm border border-slate-200/80'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                }`}
              >
                <TabIcon className="w-4 h-4" />
                <span>{tab.badge}</span>
              </button>
            );
          })}
        </div>

        {/* Feature Detail Card */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-200">
            {/* Left Column: Description & Guarantees */}
            <div className="lg:col-span-6 p-8 sm:p-10 space-y-6">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-xs font-semibold text-blue-700">
                <IconComponent className="w-3.5 h-3.5" />
                <span>{currentTab.badge}</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 leading-snug">
                {currentTab.title}
              </h2>

              <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                {currentTab.description}
              </p>

              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Technical Guarantees</h4>
                {currentTab.points.map((point, idx) => (
                  <div key={idx} className="flex items-start space-x-3 text-sm text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <span>{point}</span>
                  </div>
                ))}
              </div>

              <div className="pt-4">
                <Link
                  to="/docs"
                  className="inline-flex items-center text-sm font-semibold text-blue-600 hover:text-blue-700 group"
                >
                  <span>Explore Developer Documentation</span>
                  <ArrowRight className="w-4 h-4 ml-1.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            {/* Right Column: Code & Architecture Snippet */}
            <div className="lg:col-span-6 p-6 sm:p-8 bg-slate-900 text-slate-100 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-slate-800 text-xs font-mono text-slate-400">
                  <div className="flex items-center space-x-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <span className="ml-2 text-slate-300 font-semibold">PayCore Engine Implementation</span>
                  </div>
                  <Terminal className="w-4 h-4 text-slate-400" />
                </div>
                <pre className="mt-4 p-2 overflow-x-auto text-xs sm:text-sm font-mono text-blue-300 leading-relaxed">
                  <code>{currentTab.codeSample}</code>
                </pre>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <span>Production Monolith • Java 17 • Spring Boot 3.2</span>
                <span className="text-emerald-400 font-medium">100% Tested</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Grid */}
      <section className="bg-slate-50 border-t border-slate-200 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h3 className="text-2xl font-bold text-slate-900">Architecture Comparison</h3>
            <p className="mt-2 text-sm text-slate-600">
              How PayCore’s modular monolith compares to fragile ad-hoc payment wrappers.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-100/70 border-b border-slate-200 text-xs font-bold uppercase tracking-wider text-slate-600">
                  <tr>
                    <th className="py-4 px-6">Capability</th>
                    <th className="py-4 px-6 text-blue-600">PayCore Engine</th>
                    <th className="py-4 px-6 text-slate-500">Traditional Gateway Wrappers</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="py-4 px-6 font-semibold text-slate-800">Double-Charge Prevention</td>
                    <td className="py-4 px-6 text-emerald-600 font-medium">Authoritative MySQL Composite Unique Key + Redis Lock</td>
                    <td className="py-4 px-6 text-slate-500">In-memory or uncoordinated application checks</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-6 font-semibold text-slate-800">Timeout Resilience</td>
                    <td className="py-4 px-6 text-emerald-600 font-medium">Non-blocking UNKNOWN state with self-healing verification</td>
                    <td className="py-4 px-6 text-slate-500">Blind retries causing duplicate merchant debit charges</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-6 font-semibold text-slate-800">Database Connection Locking</td>
                    <td className="py-4 px-6 text-emerald-600 font-medium">Zero open DB transactions during external provider HTTP I/O</td>
                    <td className="py-4 px-6 text-slate-500">Holds DB transactions open, risking pool starvation</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-6 font-semibold text-slate-800">Event Delivery Guarantees</td>
                    <td className="py-4 px-6 text-emerald-600 font-medium">Transactional Outbox Pattern + Partitioned Kafka Topics</td>
                    <td className="py-4 px-6 text-slate-500">Dual-write fire-and-forget; lost events on crash</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-6 font-semibold text-slate-800">Settlement Reconciliation</td>
                    <td className="py-4 px-6 text-emerald-600 font-medium">Two-sided ledger verification against independent statement store</td>
                    <td className="py-4 px-6 text-slate-500">Queries internal DB twice without external validation</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-3xl p-10 sm:p-14 text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <h3 className="text-3xl font-bold tracking-tight">Ready to test enterprise payment flows?</h3>
            <p className="text-blue-100 text-sm sm:text-base">
              Explore the interactive Merchant and Admin portals with pre-configured developer credentials.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <Link
                to="/register"
                className="px-6 py-3 rounded-xl bg-white text-blue-600 font-semibold hover:bg-blue-50 transition-colors shadow-sm text-sm"
              >
                Create Merchant Account
              </Link>
              <Link
                to="/login"
                className="px-6 py-3 rounded-xl bg-blue-800 text-white font-semibold hover:bg-blue-900 transition-colors border border-blue-500 text-sm"
              >
                Sign In to Portal
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
