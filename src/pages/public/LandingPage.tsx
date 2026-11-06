import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { HeroInfrastructureVisual } from '@/assets/visuals/HeroInfrastructureVisual';
// PaymentWorkflowVisual omitted
import { PaymentDashboardVisual } from '@/assets/visuals/PaymentDashboardVisual';
import { RefundWorkflowVisual } from '@/assets/visuals/RefundWorkflowVisual';
import { TransactionMonitoringVisual } from '@/assets/visuals/TransactionMonitoringVisual';
import { MerchantManagementVisual } from '@/assets/visuals/MerchantManagementVisual';
import { WebhookFlowVisual } from '@/assets/visuals/WebhookFlowVisual';
import { ReconciliationVisual } from '@/assets/visuals/ReconciliationVisual';
import { AuditTimelineVisual } from '@/assets/visuals/AuditTimelineVisual';
import { AdminDashboardVisual } from '@/assets/visuals/AdminDashboardVisual';
import {
  CreditCard,
  RotateCcw,
  Globe,
  Scale,
  ShieldCheck,
  Building2,
  Code2,
  ScrollText,
  CheckCircle2,
  ArrowRight,
  Lock,
  Layers,
  Cpu,
  Key,
  Shield,
  Check,
  Copy,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'curl' | 'node' | 'python'>('curl');
  const [copiedCode, setCopiedCode] = useState(false);

  const codeSnippets = {
    curl: `curl -X POST https://api.paycore.internal/api/v1/payments \\
  -H "Authorization: Bearer sk_live_948a7b1c..." \\
  -H "X-Idempotency-Key: 8f47b2c0-e019-4b92" \\
  -H "Content-Type: application/json" \\
  -d '{
    "amount": 125000,
    "currency": "USD",
    "paymentMethod": "CARD",
    "customerEmail": "customer@example.com",
    "description": "Invoice #10492"
  }'`,
    node: `import axios from 'axios';

const response = await axios.post(
  'https://api.paycore.internal/api/v1/payments',
  {
    amount: 125000,
    currency: 'USD',
    paymentMethod: 'CARD',
    customerEmail: 'customer@example.com',
    description: 'Invoice #10492'
  },
  {
    headers: {
      'Authorization': 'Bearer sk_live_948a7b1c...',
      'X-Idempotency-Key': '8f47b2c0-e019-4b92'
    }
  }
);`,
    python: `import requests

headers = {
    "Authorization": "Bearer sk_live_948a7b1c...",
    "X-Idempotency-Key": "8f47b2c0-e019-4b92",
    "Content-Type": "application/json"
}

payload = {
    "amount": 125000,
    "currency": "USD",
    "paymentMethod": "CARD",
    "customerEmail": "customer@example.com",
    "description": "Invoice #10492"
}

response = requests.post("https://api.paycore.internal/api/v1/payments", json=payload, headers=headers)`
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(codeSnippets[activeTab]);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="w-full bg-white text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-800">
      
      {/* =================================================================== */}
      {/* 1. HERO SECTION (Section 3.2)                                       */}
      {/* =================================================================== */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-32 overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-50/50 border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                <span>Enterprise Payment Infrastructure</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
                Payment Infrastructure Built for Reliable Transactions.
              </h1>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl mx-auto lg:mx-0">
                Initiate payments, manage refunds, monitor transactions, and connect payment workflows through one unified platform.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
                <Link
                  to="/register"
                  className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md shadow-blue-500/20 transition-all hover:shadow-lg hover:shadow-blue-500/30"
                >
                  Get Started
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
                <a
                  href="#what-paycore-does"
                  className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm border border-slate-300 shadow-xs transition-all"
                >
                  Explore Platform
                </a>
              </div>

              <div className="pt-4 flex items-center justify-center lg:justify-start space-x-6 text-xs text-slate-500">
                <span className="flex items-center gap-1.5 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Idempotent Requests
                </span>
                <span className="flex items-center gap-1.5 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Signed Webhooks
                </span>
                <span className="flex items-center gap-1.5 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Reconciliation
                </span>
              </div>
            </div>

            {/* Right Hero Visual: Merchant Application ➔ PayCore ➔ Payment Processing ➔ Transaction Result */}
            <div className="lg:col-span-6">
              <HeroInfrastructureVisual />
            </div>

          </div>
        </div>
      </section>

      {/* =================================================================== */}
      {/* 2. WHAT PAYCORE DOES (Section 3.3)                                  */}
      {/* =================================================================== */}
      <section id="what-paycore-does" className="py-20 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 block mb-2">Core Capabilities</span>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Everything Your Business Needs to Process and Reconcile Payments
            </h2>
            <p className="text-sm text-slate-600 mt-3 leading-relaxed">
              PayCore abstracts payment complexities into high-reliability primitives designed for continuous operation without silent transaction failure.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* 1. Payment Initiation */}
            <div className="p-6 rounded-2xl border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all bg-slate-50/50">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-4">
                <CreditCard className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1.5">Payment Initiation</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Accept programmatic charges with deterministic idempotency keys, currency support, and validation rules.
              </p>
            </div>

            {/* 2. Payment Processing */}
            <div className="p-6 rounded-2xl border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all bg-slate-50/50">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center mb-4">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1.5">Payment Processing</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Two-phase provider dispatch handles network timeouts, card declines, and 3D Secure verification smoothly.
              </p>
            </div>

            {/* 3. Transaction Management */}
            <div className="p-6 rounded-2xl border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all bg-slate-50/50">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center mb-4">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1.5">Transaction Management</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Unified ledger view tracking charges, refunds, references, and statuses with real-time filtering and search.
              </p>
            </div>

            {/* 4. Refund Handling */}
            <div className="p-6 rounded-2xl border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all bg-slate-50/50">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-4">
                <RotateCcw className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1.5">Refund Handling</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Execute partial and full refunds with atomic balance locking to mathematically eliminate over-refund exploitation.
              </p>
            </div>

            {/* 5. Payment Notifications */}
            <div className="p-6 rounded-2xl border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all bg-slate-50/50">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4">
                <Globe className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1.5">Payment Notifications</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Deliver signed Kafka-backed webhooks to merchant endpoints with guaranteed exponential backoff retry schedules.
              </p>
            </div>

            {/* 6. Reconciliation */}
            <div className="p-6 rounded-2xl border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all bg-slate-50/50">
              <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center mb-4">
                <Scale className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1.5">Reconciliation</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Automated runs comparing internal payments and refunds against external provider transaction statements.
              </p>
            </div>

            {/* 7. Merchant Management */}
            <div className="p-6 rounded-2xl border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all bg-slate-50/50">
              <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center mb-4">
                <Building2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1.5">Merchant Management</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Multi-tenant merchant isolation, secret key generation, webhook configuration, and credential rotation.
              </p>
            </div>

            {/* 8. API Integration */}
            <div className="p-6 rounded-2xl border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all bg-slate-50/50">
              <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center mb-4">
                <Code2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1.5">API Integration</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Developer-first OpenAPI documentation, structured error codes, standard HTTP status codes, and JSON payloads.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =================================================================== */}
      {/* 3. PRODUCT FEATURES (Section 3.4) — 10 Feature Cards                */}
      {/* =================================================================== */}
      <section id="features" className="py-20 bg-slate-50/70 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 block mb-2">Engineered for Reliability</span>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              10 Enterprise Primitives for Resilient Financial Operations
            </h2>
            <p className="text-sm text-slate-600 mt-3 leading-relaxed">
              Every component is built to withstand network partitions, duplicate requests, and transient third-party downtime.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1: Reliable Payment Processing */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3.5">
                <CreditCard className="w-4 h-4" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Reliable Payment Processing</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Coordinates the payment lifecycle through state machines, ensuring consistent transactions and safe terminal status resolution.
              </p>
              <Link to="/features" className="inline-flex items-center text-xs font-semibold text-blue-600 hover:underline mt-4">
                Learn more <ArrowRight className="w-3 h-3 ml-1" />
              </Link>
            </div>

            {/* Feature 2: Idempotent Payment Requests */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3.5">
                <Lock className="w-4 h-4" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Idempotent Payment Requests</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Prevents accidental double billing by fingerprinting payloads and caching execution records using client-supplied keys.
              </p>
              <Link to="/features" className="inline-flex items-center text-xs font-semibold text-blue-600 hover:underline mt-4">
                Learn more <ArrowRight className="w-3 h-3 ml-1" />
              </Link>
            </div>

            {/* Feature 3: Payment Lifecycle Management */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all">
              <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3.5">
                <Layers className="w-4 h-4" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Payment Lifecycle Management</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Tracks state changes from CREATED and PROCESSING to terminal states with full attempt auditing and latency metrics.
              </p>
              <Link to="/features" className="inline-flex items-center text-xs font-semibold text-blue-600 hover:underline mt-4">
                Learn more <ArrowRight className="w-3 h-3 ml-1" />
              </Link>
            </div>

            {/* Feature 4: Refund Management */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all">
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center mb-3.5">
                <RotateCcw className="w-4 h-4" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Refund Management</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Enables flexible partial and full refunds with server-side validation that guarantees total refunded sums never exceed charges.
              </p>
              <Link to="/features" className="inline-flex items-center text-xs font-semibold text-blue-600 hover:underline mt-4">
                Learn more <ArrowRight className="w-3 h-3 ml-1" />
              </Link>
            </div>

            {/* Feature 5: Webhook Notifications */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all">
              <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-3.5">
                <Globe className="w-4 h-4" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Webhook Notifications</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Dispatches HMAC-SHA256 signed event notifications to merchant webhooks via Kafka event streams and scheduled background workers.
              </p>
              <Link to="/features" className="inline-flex items-center text-xs font-semibold text-blue-600 hover:underline mt-4">
                Learn more <ArrowRight className="w-3 h-3 ml-1" />
              </Link>
            </div>

            {/* Feature 6: Transaction Monitoring */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all">
              <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mb-3.5">
                <ScrollText className="w-4 h-4" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Transaction Monitoring</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Provides real-time visibility into transaction history, decline codes, attempt counts, and settled volumes across accounts.
              </p>
              <Link to="/features" className="inline-flex items-center text-xs font-semibold text-blue-600 hover:underline mt-4">
                Learn more <ArrowRight className="w-3 h-3 ml-1" />
              </Link>
            </div>

            {/* Feature 7: Reconciliation */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all">
              <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center mb-3.5">
                <Scale className="w-4 h-4" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Reconciliation</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Cross-references internal payment and refund ledgers against independent provider transaction logs to detect discrepancies.
              </p>
              <Link to="/features" className="inline-flex items-center text-xs font-semibold text-blue-600 hover:underline mt-4">
                Learn more <ArrowRight className="w-3 h-3 ml-1" />
              </Link>
            </div>

            {/* Feature 8: Audit Logging */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all">
              <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center mb-3.5">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Audit Logging</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Records immutable audit trails capturing actor identities, state diffs, IP addresses, and timestamps for every administrative action.
              </p>
              <Link to="/features" className="inline-flex items-center text-xs font-semibold text-blue-600 hover:underline mt-4">
                Learn more <ArrowRight className="w-3 h-3 ml-1" />
              </Link>
            </div>

            {/* Feature 9: Merchant API Integration */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all">
              <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center mb-3.5">
                <Key className="w-4 h-4" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Merchant API Integration</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Enables programmatic access with scoped API keys (sk_live_...), granular permissions, and automated rate limiting.
              </p>
              <Link to="/features" className="inline-flex items-center text-xs font-semibold text-blue-600 hover:underline mt-4">
                Learn more <ArrowRight className="w-3 h-3 ml-1" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* =================================================================== */}
      {/* 4. APPLICATION MODULES (Section 3.5) — 8 Detailed Sections         */}
      {/* =================================================================== */}
      <section id="modules" className="py-20 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24">
          <div className="text-center max-w-3xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 block mb-2">Application Modules</span>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Modular Monolith Architecture Built for Scale
            </h2>
            <p className="text-sm text-slate-600 mt-3 leading-relaxed">
              Explore the actual production modules operating within PayCore, complete with database entities and service workflows.
            </p>
          </div>

          {/* Module 1: Payment Management */}
          <div id="module-payments" className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center pt-8 border-t border-slate-100">
            <div className="lg:col-span-5 space-y-4">
              <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-blue-50 text-blue-700 font-mono">MODULE 01</span>
              <h3 className="text-2xl font-bold text-slate-900">Payment Management</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Initiate payments, inspect attempt telemetry, search transactions, and monitor state transitions. The payment engine guarantees deterministic handling for successes, declines, and timeouts without lingering unconfirmed states.
              </p>
              <ul className="space-y-2 text-xs text-slate-700">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-blue-600" /> Granular status tracking (CREATED, PROCESSING, SUCCESS, FAILED)</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-blue-600" /> Automatic attempt recording with provider latency metrics</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-blue-600" /> Multi-currency support and customer reference binding</li>
              </ul>
            </div>
            <div className="lg:col-span-7">
              <PaymentDashboardVisual />
            </div>
          </div>

          {/* Module 2: Refund Management */}
          <div id="module-refunds" className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center pt-8 border-t border-slate-100">
            <div className="lg:col-span-7 order-2 lg:order-1">
              <RefundWorkflowVisual />
            </div>
            <div className="lg:col-span-5 space-y-4 order-1 lg:order-2">
              <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-amber-50 text-amber-700 font-mono">MODULE 02</span>
              <h3 className="text-2xl font-bold text-slate-900">Refund Management</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Two-phase balance refund protocol ensures partial and full refunds are executed against current verified refundable sums. Prevents over-refunding and races between simultaneous refund requests.
              </p>
              <ul className="space-y-2 text-xs text-slate-700">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-amber-600" /> Deterministic refundable balance verification</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-amber-600" /> Concurrent refund deduplication and pessimistic locking</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-amber-600" /> Detailed refund audit reason and provider reversal logging</li>
              </ul>
            </div>
          </div>

          {/* Module 3: Transaction Management */}
          <div id="module-transactions" className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center pt-8 border-t border-slate-100">
            <div className="lg:col-span-5 space-y-4">
              <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-purple-50 text-purple-700 font-mono">MODULE 03</span>
              <h3 className="text-2xl font-bold text-slate-900">Transaction Management</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Unified database transaction view unifying both payments and refunds into a chronological ledger with pagination, date range filtering, reference indexing, and merchant tenancy.
              </p>
              <ul className="space-y-2 text-xs text-slate-700">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-purple-600" /> Unified SQL view joining payments and refunds</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-purple-600" /> Indexed searching across references and customer emails</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-purple-600" /> Strict tenant isolation ensuring zero cross-merchant data leaks</li>
              </ul>
            </div>
            <div className="lg:col-span-7">
              <TransactionMonitoringVisual />
            </div>
          </div>

          {/* Module 4: Merchant Management */}
          <div id="module-merchants" className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center pt-8 border-t border-slate-100">
            <div className="lg:col-span-7 order-2 lg:order-1">
              <MerchantManagementVisual />
            </div>
            <div className="lg:col-span-5 space-y-4 order-1 lg:order-2">
              <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-emerald-50 text-emerald-700 font-mono">MODULE 04</span>
              <h3 className="text-2xl font-bold text-slate-900">Merchant Management</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Onboard merchants with business profile verification, generate 256-bit cryptographically random API keys stored with SHA-256 salt hashes, and manage live operational status.
              </p>
              <ul className="space-y-2 text-xs text-slate-700">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> One-way SHA-256 hashed secret keys (sk_live_...)</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Instant key rotation and revocation capabilities</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Merchant status lifecycle (PENDING, ACTIVE, SUSPENDED)</li>
              </ul>
            </div>
          </div>

          {/* Module 5: Webhook Management */}
          <div id="module-webhooks" className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center pt-8 border-t border-slate-100">
            <div className="lg:col-span-5 space-y-4">
              <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-blue-50 text-blue-700 font-mono">MODULE 05</span>
              <h3 className="text-2xl font-bold text-slate-900">Webhook Management</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Event-driven asynchronous processing pipeline using the Transactional Outbox pattern and Apache Kafka. Delivers events to registered endpoints with cryptographic HMAC-SHA256 signatures.
              </p>
              <ul className="space-y-2 text-xs text-slate-700">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-blue-600" /> Transactional outbox prevents event loss during crashes</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-blue-600" /> Kafka partition concurrency with idempotent consumer processing</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-blue-600" /> Configurable exponential retry backoff and dead-letter queue</li>
              </ul>
            </div>
            <div className="lg:col-span-7">
              <WebhookFlowVisual />
            </div>
          </div>

          {/* Module 6: Reconciliation */}
          <div id="module-reconciliation" className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center pt-8 border-t border-slate-100">
            <div className="lg:col-span-7 order-2 lg:order-1">
              <ReconciliationVisual />
            </div>
            <div className="lg:col-span-5 space-y-4 order-1 lg:order-2">
              <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-teal-50 text-teal-700 font-mono">MODULE 06</span>
              <h3 className="text-2xl font-bold text-slate-900">Reconciliation Engine</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Multi-source settlement reconciliation engine that queries independent provider statement stores to identify discrepancies, amount mismatches, and missing transactions.
              </p>
              <ul className="space-y-2 text-xs text-slate-700">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-teal-600" /> Automated matching across references, currencies, and amounts</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-teal-600" /> Discrepancy triage workflow with manual operator resolution</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-teal-600" /> Complete discrepancy history and audit justification logs</li>
              </ul>
            </div>
          </div>

          {/* Module 7: Audit Logs */}
          <div id="module-audit" className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center pt-8 border-t border-slate-100">
            <div className="lg:col-span-5 space-y-4">
              <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-slate-100 text-slate-700 font-mono">MODULE 07</span>
              <h3 className="text-2xl font-bold text-slate-900">Audit Logs & Forensics</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Enterprise forensic audit logging for critical financial operations, administrative overrides, and credential rotations. Provides immutable proof of who performed each action.
              </p>
              <ul className="space-y-2 text-xs text-slate-700">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-slate-600" /> Immutable append-only operational audit store</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-slate-600" /> Captures Actor ID, Role, Client IP, and Before/After snapshots</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-slate-600" /> Structured querying by date range, resource type, and action</li>
              </ul>
            </div>
            <div className="lg:col-span-7">
              <AuditTimelineVisual />
            </div>
          </div>

          {/* Module 8: Admin Dashboard */}
          <div id="module-admin" className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center pt-8 border-t border-slate-100">
            <div className="lg:col-span-7 order-2 lg:order-1">
              <AdminDashboardVisual />
            </div>
            <div className="lg:col-span-5 space-y-4 order-1 lg:order-2">
              <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-blue-50 text-blue-700 font-mono">MODULE 08</span>
              <h3 className="text-2xl font-bold text-slate-900">Platform Command Center</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Real-time operational dashboard for platform administrators aggregating live payment volumes, refund rates, merchant onboarding counts, webhook retries, and reconciliation runs.
              </p>
              <ul className="space-y-2 text-xs text-slate-700">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-blue-600" /> Real database queries calculating true volume and counts</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-blue-600" /> Instant triggering of ad-hoc reconciliation runs</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-blue-600" /> High-priority alert banner for pending discrepancy reviews</li>
              </ul>
            </div>
          </div>

        </div>
      </section>

      {/* =================================================================== */}
      {/* 5. HOW PAYCORE WORKS (Section 3.6) — 10-Step Flow Diagram           */}
      {/* =================================================================== */}
      <section id="how-it-works" className="py-20 bg-slate-900 text-white border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-400 block mb-2">Process Architecture</span>
            <h2 className="text-3xl font-extrabold text-white tracking-tight">
              How PayCore Processes Transactions
            </h2>
            <p className="text-sm text-slate-400 mt-3 leading-relaxed">
              Step-by-step end-to-end execution path from merchant API initiation to final settlement and reconciliation.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Step 1 */}
            <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/80">
              <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center mb-3">1</span>
              <h4 className="text-xs font-bold text-slate-200">Merchant Integration</h4>
              <p className="text-[11px] text-slate-400 mt-1">Merchant application integrates PayCore REST APIs using provisioned secret keys.</p>
            </div>

            {/* Step 2 */}
            <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/80">
              <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center mb-3">2</span>
              <h4 className="text-xs font-bold text-slate-200">Payment Request</h4>
              <p className="text-[11px] text-slate-400 mt-1">Initiates charge with amount, currency, and mandatory X-Idempotency-Key header.</p>
            </div>

            {/* Step 3 */}
            <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/80">
              <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center mb-3">3</span>
              <h4 className="text-xs font-bold text-slate-200">Request Validation</h4>
              <p className="text-[11px] text-slate-400 mt-1">PayCore verifies API key signature, merchant status, and input field schema.</p>
            </div>

            {/* Step 4 */}
            <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/80">
              <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center mb-3">4</span>
              <h4 className="text-xs font-bold text-slate-200">Idempotency Guard</h4>
              <p className="text-[11px] text-slate-400 mt-1">Fingerprints payload. If duplicate key detected, safely returns cached response.</p>
            </div>

            {/* Step 5 */}
            <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/80">
              <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center mb-3">5</span>
              <h4 className="text-xs font-bold text-slate-200">Provider Dispatch</h4>
              <p className="text-[11px] text-slate-400 mt-1">Transitions to PROCESSING and communicates with provider without DB locks.</p>
            </div>

            {/* Step 6 */}
            <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/80">
              <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center mb-3">6</span>
              <h4 className="text-xs font-bold text-slate-200">Response Handling</h4>
              <p className="text-[11px] text-slate-400 mt-1">Parses provider authorization or decline code and logs attempt latency.</p>
            </div>

            {/* Step 7 */}
            <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/80">
              <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center mb-3">7</span>
              <h4 className="text-xs font-bold text-slate-200">Status Settlement</h4>
              <p className="text-[11px] text-slate-400 mt-1">State machine atomically transitions payment record to SUCCESS or FAILED.</p>
            </div>

            {/* Step 8 */}
            <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/80">
              <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center mb-3">8</span>
              <h4 className="text-xs font-bold text-slate-200">Outbox Event Stage</h4>
              <p className="text-[11px] text-slate-400 mt-1">Outbox row written in same ACID transaction; Kafka publishes event asynchronously.</p>
            </div>

            {/* Step 9 */}
            <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/80">
              <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center mb-3">9</span>
              <h4 className="text-xs font-bold text-slate-200">Signed Webhook</h4>
              <p className="text-[11px] text-slate-400 mt-1">Merchant endpoint receives HTTP POST with HMAC signature and verifies authenticity.</p>
            </div>

            {/* Step 10 */}
            <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/80">
              <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center mb-3">10</span>
              <h4 className="text-xs font-bold text-slate-200">Reconciliation</h4>
              <p className="text-[11px] text-slate-400 mt-1">Records are cross-matched in nightly reconciliation runs for discrepancy resolution.</p>
            </div>
          </div>
        </div>
      </section>

      {/* =================================================================== */}
      {/* 6. DEVELOPER INTEGRATION SECTION (Section 3.7)                      */}
      {/* =================================================================== */}
      <section id="developers" className="py-20 bg-slate-950 text-white border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Description */}
            <div className="lg:col-span-5 space-y-6">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-400 block">Developer First</span>
              <h2 className="text-3xl font-extrabold text-white tracking-tight">
                Designed for Developers, Engineered for Production
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed">
                Connect in minutes with predictable REST APIs, strict idempotency headers, standard HTTP status codes, and signed event payloads.
              </p>

              <div className="space-y-3 font-sans text-xs">
                <div className="flex items-center gap-2.5 text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-blue-400 flex-shrink-0" />
                  <span>X-Api-Key and Bearer JWT authentication</span>
                </div>
                <div className="flex items-center gap-2.5 text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-blue-400 flex-shrink-0" />
                  <span>Deterministic idempotency key caching</span>
                </div>
                <div className="flex items-center gap-2.5 text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-blue-400 flex-shrink-0" />
                  <span>HMAC-SHA256 signature verification code</span>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  to="/docs"
                  className="inline-flex items-center justify-center px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-all shadow-md"
                >
                  Explore Developer Documentation
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </div>
            </div>

            {/* Right Interactive Code Box */}
            <div className="lg:col-span-7">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden font-mono text-xs">
                {/* Code header bar */}
                <div className="flex items-center justify-between px-4 py-3 bg-slate-950 border-b border-slate-800">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setActiveTab('curl')}
                      className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                        activeTab === 'curl' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      cURL
                    </button>
                    <button
                      onClick={() => setActiveTab('node')}
                      className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                        activeTab === 'node' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Node.js
                    </button>
                    <button
                      onClick={() => setActiveTab('python')}
                      className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                        activeTab === 'python' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Python
                    </button>
                  </div>
                  <button
                    onClick={copyToClipboard}
                    className="flex items-center space-x-1.5 text-slate-400 hover:text-white text-[11px] transition-colors"
                  >
                    {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCode ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>

                {/* Code Snippet */}
                <div className="p-4 overflow-x-auto text-slate-300 leading-relaxed">
                  <pre>{codeSnippets[activeTab]}</pre>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =================================================================== */}
      {/* 7. SECURITY SECTION (Section 3.8) — Genuine Security Features       */}
      {/* =================================================================== */}
      <section id="security" className="py-20 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 block mb-2">Security Architecture</span>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Rigorous Security at Every Application Boundary
            </h2>
            <p className="text-sm text-slate-600 mt-3 leading-relaxed">
              PayCore implements verified security primitives. We accurately detail implemented technical defenses without unverified external compliance claims.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Sec 1 */}
            <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50/60">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-4">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Cryptographic Token Auth</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                HMAC-SHA384 signed JWT tokens with 15-minute expiration and rotating persistent refresh tokens stored with SHA-256 hashes.
              </p>
            </div>

            {/* Sec 2 */}
            <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50/60">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">BCrypt Password Hashing</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Adaptive BCrypt hashing with work factor 12 protects stored passwords against dictionary and offline rainbow-table attacks.
              </p>
            </div>

            {/* Sec 3 */}
            <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50/60">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center mb-4">
                <Globe className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Webhook HMAC Signatures</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                All outgoing webhook dispatches include an HMAC-SHA256 signature calculated with the merchant's secret key to prevent spoofing.
              </p>
            </div>

            {/* Sec 4 */}
            <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50/60">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center mb-4">
                <Building2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Strict Tenant Isolation</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Granular Spring Security method-level annotations (@PreAuthorize) verify merchant ownership before executing any transaction read or write.
              </p>
            </div>

            {/* Sec 5 */}
            <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50/60">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-4">
                <Shield className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Google OpenID Connect</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Real server-side cryptographic verification of Google ID tokens with audience, issuer, expiration, and email-verification claim enforcement.
              </p>
            </div>

            {/* Sec 6 */}
            <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50/60">
              <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center mb-4">
                <ScrollText className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Immutable Audit Logging</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Critical administrative decisions, key generations, and state overrides are captured in an append-only audit trail with actor IDs and IP addresses.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =================================================================== */}
      {/* 8. FINAL CTA (Section 3.9)                                          */}
      {/* =================================================================== */}
      <section className="py-20 bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 text-white text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Start Building with PayCore
          </h2>
          <p className="text-base text-blue-100 max-w-xl mx-auto leading-relaxed">
            Integrate high-availability payment processing, idempotent charges, and automated multi-source reconciliation into your application today.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              to="/register"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white text-blue-700 font-bold text-sm shadow-lg hover:bg-blue-50 transition-all"
            >
              Create Account
            </Link>
            <Link
              to="/features"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-blue-800/60 hover:bg-blue-800 text-white font-bold text-sm border border-blue-400/30 transition-all"
            >
              Explore Platform
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};
