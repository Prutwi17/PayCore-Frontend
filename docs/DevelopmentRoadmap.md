# PAYCORE FRONTEND — 8-MILESTONE ROADMAP

## Milestone 1: Project Foundation & Shell
- Initialize Vite + React + TypeScript + Tailwind CSS project.
- Establish theme tokens, color palette (`#2563EB`, `#0F172A`, `#FFFFFF`), custom font configuration.
- Implement reusable UI foundation: Button, Input, Modal, Table, Badge, Card, Toast notifications.
- Configure React Router with route skeletons and protected route guards.
- Implement CI pipeline in `.github/workflows/frontend-ci.yml`.

## Milestone 2: Authentication & Onboarding
- Public Landing Page with Hero and feature highlights.
- Implement Login, Register, Forgot Password, and Reset Password pages strictly adhering to `paycore-ui-reference.png` visual styling (white canvas, bottom wave, circular gradient orbs, coin-inspired logo).
- Implement `AuthContext` and Axios token interceptors.
- Merchant API Keys management interface (`/merchant/api-keys`).

## Milestone 3: Core Payment Dashboard & Transactions
- Merchant Dashboard view with 4 top KPI cards (Total Payments, Successful, Failed, Refunded) and Payment Volume Chart.
- Payments Explorer view with search, status filters, and pagination.
- Create Payment modal with amount, currency, and auto-generated UUID idempotency key.
- Payment Details view with interactive vertical transition timeline (`CREATED` -> `PROCESSING` -> `SUCCESS` / `FAILED`).

## Milestone 4: Idempotency & Reliability UX
- Visual indicators for idempotent request deduplication.
- Handling of `UNKNOWN` / pending verification state with poll / refresh alerts.
- Conflict (409) and Payload Mismatch (422) error banner components.

## Milestone 5: Refund Management & Transaction History [COMPLETED]
- **Merchant Refunds Page (`/merchant/refunds`):** Top KPI metric cards (Total Refunds, Settled Volume, Processing In-Flight, Unconfirmed UNKNOWN), status filter tabs, search across references, paginated table, and details drawer with one-click provider verification.
- **Merchant Transactions Ledger (`/merchant/transactions`):** Unified financial ledger combining payments and refunds with transaction type pills (`All`, `Payments`, `Refunds`), status badges, date range filter, and pageable table.
- **Payment Details Refund Workflow (`/merchant/payments`):**
  - Live Refundable Balance Overview card displaying original amount, total refunded, pending reserved, and remaining refundable balance.
  - "+ Initiate Refund" modal with live validation against available balance, quick 100% and 50% autofill buttons, and full/partial refund warnings.
  - Optional `Idempotency-Key` support with quick generation and copy controls.
  - Deterministic simulation shortcuts (`[SIM_FAIL]`, `[SIM_TIMEOUT]`).
  - Embedded Payment Refunds History table tracking all refunds issued for that payment.
- **Admin Operations:**
  - `/admin/refunds`: Global refund auditing across all merchants with filter by merchant ID and status.
  - `/admin/transactions`: Unified platform-wide transaction ledger.
- **Navigation & Routing:** Integrated into sidebar for Merchant and Admin portals with active link highlights; all routes protected by authentication and role guards.

## Milestone 6: Webhooks Telemetry [COMPLETED]
- **Merchant Webhooks Page (`/merchant/webhooks`):**
  - Registered Endpoints management: destination URL, subscribed event badges, active toggle, consecutive failure counts, and masked signing secret (`whsec_***`).
  - "+ Register Webhook" modal with destination URL validation, description, and event selection checkboxes (`PAYMENT_CREATED`, `PAYMENT_SUCCESS`, `REFUND_SUCCESS`, etc.).
  - Secret Reveal Modal: One-time plain secret exposure banner with copy button, security guidance, and HMAC-SHA256 signature verification standards (`X-PayCore-Signature`, `X-PayCore-Event`).
  - Actions: Pause/Activate, Edit Endpoint, Rotate Secret, Delete.
  - Delivery History tab: Filter by delivery status (`SUCCESS`, `RETRYING`, `DEAD_LETTER`, `FAILED`), table showing attempt count, HTTP code, latency (ms), and timestamp.
  - Delivery Inspection drawer: Request URL, failure reason, next scheduled retry time, response body snippet, and manual "Retry Now" action.
- **Admin Webhook Pipeline Governance (`/admin/webhooks`):**
  - KPI Metrics cards: Total Deliveries, Delivery Success Rate (%), Outbox Pending, Outbox Failed, and Dead-Letter Queue count.
  - Four governance tabs: All Deliveries multi-tenant explorer, Dead-Letter Queue quarantine with Force Replay action, Transactional Outbox monitor with Force Republish action, and Idempotent Inbox Consumers telemetry.
- **Integration & Verification:**
  - Sidebar and router integration (`/merchant/webhooks`, `/admin/webhooks`).
  - TypeScript compilation and ESLint pass with 0 errors, 0 warnings.
  - Vite production bundle builds in under 7 seconds.

## Milestone 7: Admin Portal & Reconciliation
- Admin Portal shell with dedicated dark navy navigation.
- Admin Dashboard with platform-wide volume metrics, success rate gauge, and daily volume bar charts.
- Admin Merchants directory management table.
- Financial Reconciliation view: Matched, Mismatched, Missing Provider, Missing Internal KPI cards, and Discrepancy details table.
- System Audit Logs viewer with JSON diff preview.

## Milestone 8: Optimization & Production Readiness
- Bundle optimization, lazy-loading routes (`React.lazy`), asset compression.
- Responsive design audit across tablet and mobile viewports.
- Production Nginx Dockerfile testing and E2E verification with backend.
