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

## Milestone 5: Refund Management
- Merchant Refunds Explorer view with status badges.
- "+ New Refund" modal with dynamic validation against remaining refundable balance.
- Refund tab embedded inside Payment Details view showing partial refund history.

## Milestone 6: Webhooks Telemetry
- Merchant Webhook Configuration screen (register endpoint URL, select subscribed events, display signing secret `whsec_...`).
- Webhook Delivery History view: HTTP status indicators, latency, payload inspector drawer, and manual "Retry Delivery" button.

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
