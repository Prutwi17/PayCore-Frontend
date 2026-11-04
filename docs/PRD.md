# PAYCORE FRONTEND — PRODUCT REQUIREMENTS DOCUMENT (PRD)

## 1. Document Overview
- **Project Name:** PayCore Frontend Dashboard
- **Target Audience:** Frontend Engineers, UI/UX Designers, Product Managers
- **Architecture:** Single Page Application (SPA) built with React, Vite, TypeScript, and Tailwind CSS.

---

## 2. Product Vision & Scope
The PayCore Frontend delivers a high-performance, clean, and intuitive administrative and merchant operations interface. It connects to the PayCore Backend REST APIs, translating complex backend financial states, idempotency mechanisms, webhook event streams, and reconciliation batches into clear, actionable interfaces.

---

## 3. User Roles & Experience Scenarios

### 3.1 Public User / Prospective Merchant
- Discover PayCore platform capabilities via the Landing Page.
- Register a new business account with immediate credential generation.
- Access self-service password recovery workflows.

### 3.2 Merchant Operator
- **KPI Monitoring:** Real-time visibility into Gross Payment Volume, Success Rate, and Refund Volume.
- **Transaction Processing:** Manual payment creation with auto-generated idempotency keys.
- **Payment Lifecycle Visibility:** Step-by-step visual audit timeline (`CREATED` -> `PROCESSING` -> `SUCCESS` / `FAILED` / `UNKNOWN`).
- **Refund Execution:** Quick-action full or partial refund initiation with remaining balance validation.
- **Developer Experience:** Generate, inspect, and roll over API keys (`sk_live_...`, `pk_live_...`).
- **Webhook Operations:** Configure callback URLs, view payload logs, inspect HTTP response codes, and manually redeliver failed webhooks.

### 3.3 Platform Administrator
- Platform-wide telemetry (Total transaction volume, system success rate, active merchants).
- Merchant directory management (view details, suspend or reactivate merchants).
- Centralized payment and refund oversight across all merchants.
- Financial reconciliation management (trigger on-demand reconciliation runs, inspect mismatched transactions).
- System-wide immutable audit trail exploration.
