# PAYCORE FRONTEND — UI PAGE STRUCTURE & DESIGN SYSTEM

## 1. Visual Direction & Design Tokens

Derived from the official design reference (`design-reference/paycore-ui-reference.png`) and architectural requirements:

- **Primary Brand Color:** Blue (`#2563EB` / Tailwind `blue-600`, `#1D4ED8` / `blue-700`)
- **Portal Sidebar & Header Dark Accents:** Deep Slate / Navy (`#0F172A` / `slate-900`, `#1E293B` / `slate-800`)
- **Canvas Background:** Pure White (`#FFFFFF`) with subtle surface tints (`#F8FAFC` / `slate-50`)
- **Typography:** Modern clean sans-serif (Inter / System Font Stack)
- **Borders & Dividers:** Subtle soft gray borders (`#E2E8F0` / `slate-200`)
- **Shadows:** Minimal soft elevations (`shadow-sm`, `shadow-md`)
- **Status Colors:**
  - `SUCCESS` / `Active`: Emerald Green (`bg-emerald-50 text-emerald-700 border-emerald-200`)
  - `PROCESSING` / `Pending`: Royal Blue (`bg-blue-50 text-blue-700 border-blue-200`)
  - `FAILED` / `Cancelled`: Coral Red (`bg-red-50 text-red-700 border-red-200`)
  - `UNKNOWN` / `Requires Action`: Amber Orange (`bg-amber-50 text-amber-700 border-amber-200`)

---

## 2. Authentication Pages Architecture (Public)

Applies to: **Login**, **Register**, **Forgot Password**, **Reset Password**

### Visual Specifications
- Full white background (`#FFFFFF`)
- Subtle circular ambient blue gradient orbs in background (`bg-gradient-to-tr from-blue-100/50 to-transparent blur-3xl`)
- Flowing blue wave accent pinned cleanly along the bottom viewport
- Centered card container (max width 420px) with crisp white surface and soft boundary shadow
- **PayCore Logo:** Coin-inspired metallic blue circular emblem featuring a stylized payment "P" with clean geometric lines (zero resemblance to Bitcoin).

### Form Elements & UX
- Floating / labelled inputs with inline icon prefixes (`Mail`, `Lock`, `User`).
- Password visibility toggle icon.
- High-contrast, full-width solid blue CTA button (`bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-2.5 font-medium transition`).
- Responsive mobile centering with viewport height management.

---

## 3. Merchant Portal Layout (`/merchant/*`)

### 3.1 Dark Navy Sidebar
- Fixed left navigation (`w-64 bg-slate-900 text-slate-300 min-h-screen`)
- PayCore branding emblem and "Merchant Portal" pill badge
- Navigation Links:
  - 📊 **Dashboard** (`/merchant/dashboard`)
  - 💳 **Payments** (`/merchant/payments`)
  - 🔄 **Refunds** (`/merchant/refunds`)
  - ⚡ **Webhooks** (`/merchant/webhooks`)
  - ⚖️ **Reconciliation** (`/merchant/reconciliation`)
  - 🔑 **API Keys** (`/merchant/api-keys`)
  - ⚙️ **Settings** (`/merchant/settings`)

### 3.2 Top Bar
- Contextual breadcrumb / page title
- Quick-filter date range selector ("Last 30 Days", "This Month", "Custom")
- Live environment indicator pill ("TEST" / "LIVE")
- User profile dropdown with merchant code display and Sign Out action

### 3.3 Dashboard Screen Components
- **Top Metric Cards (4 Grid):**
  - Total Payments (e.g., `₹12,56,000` with subtle upward trend badge)
  - Successful Payments count (e.g., `3,842`)
  - Failed Payments count (e.g., `126`)
  - Refunded Volume (e.g., `₹4,32,000`)
- **Payment Volume Chart:** Responsive line chart mapping volume across time intervals
- **Recent Transactions Quick Table:** Snapshot of latest 5 payments with quick action links

### 3.4 Payments Screen
- Search input by Order ID or Payment ID with debounced querying
- Filter drawer / modal (Status, Date Range, Currency)
- Interactive Data Table:
  - Columns: `Payment ID`, `Order ID`, `Amount`, `Status Badge`, `Created At`, `Actions`
  - Pagination bar (`Rows per page`, `Previous`, `Next`)
- "+ Create Payment" primary action button triggering creation drawer/modal:
  - Fields: Order ID, Amount, Currency dropdown, Payment Method, pre-filled auto-generated Idempotency Key (UUID).

### 3.5 Payment Details Screen (`/merchant/payments/:paymentId`)
- Header: Payment ID (`PAY_8F2301`), Order ID (`ORD-1001`), Gross Amount, Status Badge
- Tabbed Navigation:
  - **Timeline Tab:** Vertical stepper timeline illustrating transition history (`Payment Created` -> `Processing` -> `Payment Successful`) with exact ISO timestamps.
  - **Refunds Tab:** List of all full or partial refunds issued against this payment, remaining refundable amount calculator, and "+ Issue Refund" button.
  - **Webhooks Tab:** Log of outbound webhook events dispatched for this payment with delivery status.

---


### 3.6 Refunds Screen (`/merchant/refunds`)
- **Top Metric Cards (4 Grid):**
  - Total Refunds Count (all states)
  - Settled Volume (sum of SUCCESS refunds)
  - Pending / In-Flight Processing count
  - Indeterminate UNKNOWN count (with prompt to verify)
- **Controls & Filters:** Search by refund reference, payment reference, or provider refund ID; filter by status (`SUCCESS`, `PROCESSING`, `REQUESTED`, `FAILED`, `UNKNOWN`).
- **Interactive Refunds Table:**
  - Columns: `Refund Ref`, `Payment Ref`, `Amount`, `Status Badge`, `Reason / Memo`, `Created At`, `Actions`
  - Actions: "View Details" drawer, "Verify Status" button for indeterminate refunds.
- **Refund Details Drawer:**
  - Complete refund metadata, parent payment reference, provider refund ID, timestamps.
  - Failure categorization code and message if failed.
  - One-click Authoritative Reconcile button for `UNKNOWN` outcomes.

### 3.7 Transactions Screen (`/merchant/transactions`)
- **Unified Financial Ledger:** Combines payments and refunds into a single chronologically sorted ledger.
- **Controls & Filters:**
  - Type Filter: `All`, `Payments` only, `Refunds` only.
  - Status Filter: `SUCCESS`, `PARTIALLY_REFUNDED`, `REFUNDED`, `FAILED`, `UNKNOWN`.
  - Date Range pickers (`From` and `To`).
  - Text search across transaction references and parent payment references.
- **Ledger Table:**
  - Type indicator: Green `+` for Payments, Purple `-` for Refunds with directional icons.
  - Formatted currency amounts, status badges, order/reason descriptions, and full timestamps.

### 3.8 Webhooks & Notifications Screen (`/merchant/webhooks`)
- **Dual Tab Architecture:**
  - **Endpoints Tab:**
    - List of registered endpoints displaying destination URL, subscribed event badges (`PAYMENT_SUCCESS`, `REFUND_SUCCESS`, or `*`), active status badge, consecutive failure counter, and masked signing secret (`whsec_***`).
    - Actions: Pause/Activate toggle, Edit Endpoint, Rotate Secret, Delete.
    - "+ Register Webhook" modal with SSRF guidance and event multi-select checkboxes.
    - Secret Reveal modal (one-time exposure with copy button and HMAC-SHA256 verification guide).
  - **Delivery History Tab:**
    - Delivery attempts table displaying Event Type, destination URL, attempt count (`#1/5`), status badge (`SUCCESS`, `RETRYING`, `DEAD_LETTER`, `FAILED`), HTTP status code, latency (ms), and timestamp.
    - Inspect Delivery modal with request URL, failure reasons, next scheduled retry time, response body snippet, and "Retry Now" action.

## 4. Admin Portal Layout (`/admin/*`)

### 4.1 Dark Navy Sidebar
- Dedicated "Admin Portal" badge with shield icon
- Navigation Links:
  - 📊 **Dashboard** (`/admin/dashboard`)
  - 🏢 **Merchants** (`/admin/merchants`)
  - 💳 **Payments** (`/admin/payments`)
  - 🔄 **Refunds** (`/admin/refunds`)
  - ⚖️ **Reconciliation** (`/admin/reconciliation`)
  - ⚡ **Webhook Events** (`/admin/webhooks`)
  - 📜 **Audit Logs** (`/admin/audit-logs`)
  - 🖥️ **System Health** (`/admin/system`)

### 4.2 Admin Dashboard Screen
- Platform-wide Metric Cards:
  - Total System Volume (`₹28,40,000`)
  - Total Payments Processed (`9,284`)
  - Total Refunds Issued (`1,230`)
  - Platform Success Rate (`96.8%`)
- Daily Payment Volume Bar Chart: Bar visualization over 7/30 days
- Quick Merchant Telemetry overview

### 4.3 Reconciliation Screen
- "+ Run Reconciliation" primary action button triggering on-demand settlement audit
- Summary Metric Cards:
  - Matched Records count (`48,120` - Green)
  - Mismatches count (`28` - Red)
  - Missing in Provider (`12` - Orange)
  - Missing in Internal Ledger (`14` - Orange)
- Historical Batches Table with discrepancy drill-down modal

### 4.4 Webhook Pipeline Governance Screen (`/admin/webhooks`)
- High-level pipeline KPI cards: Total Deliveries, Success Rate (%), Outbox Pending, Outbox Failed, and Dead-Letter Queue Quarantine count.
- Four comprehensive governance tabs:
  - **All Deliveries:** Multi-tenant delivery attempts table with status filters, latency metrics, and detailed inspection drawer.
  - **Dead-Letter Queue:** Quarantined attempts that exhausted 5 retries or failed SSRF validation, with immediate Force Replay action.
  - **Transactional Outbox:** Real-time outbox table showing aggregate types, payload JSON inspector, retry counters, and Force Republish action.
  - **Idempotent Inbox Consumers:** Consumer telemetry showing duplicate message suppression records and processing statuses across Kafka worker components.

### 4.5 Admin Refunds Screen (`/admin/refunds`)
- Platform-wide refund inspection across all onboarded merchants.
- Merchant ID filter, status filter, and keyword search.
- Administrative status verification action for stuck or indeterminate refunds.

### 4.6 Admin Transactions Screen (`/admin/transactions`)
- Global multi-tenant ledger uniting all payments and refunds across the entire platform.
- High-level platform cash inflow and outflow tracking with multi-criteria filtering.


---

## 4. Admin Portal Layout (`/admin/*`) — Stage 7 Enhancements

### 4.1 System Admin Dashboard (`/admin/dashboard`)
- **Real Database Operational KPIs:** Live payment volume, success conversion percentage, settled refund volume, active dispute count, webhook failures, pending retries, latest reconciliation status, and count of unresolved discrepancies.
- **Responsive Inline SVG Trends:** Payment volume throughput and refund trends over selectable time ranges (`24h`, `7d`, `30d`, `all`).
- **Payment Lifecycle Distribution:** Colored distribution progress bars representing `SUCCESS`, `FAILED`, `PROCESSING`, and `UNKNOWN`.
- **Operational Quick Actions:** Immediate modal trigger for reconciliation runs, recent discrepancies table, and live immutable audit trail.

### 4.2 Reconciliation Center (`/admin/reconciliation`)
- **Trigger Run Modal:** Selectable scope (`FULL`, `PAYMENTS`, `REFUNDS`) with date range picker.
- **Reconciliation Runs Tab:** Table of previous runs showing run reference, type, status badge, matched records count, discrepancy count, initiated by, timestamp, and link to inspect.
- **Active Discrepancies Tab:** Global list of all unresolved discrepancies across the platform with filters by discrepancy type, record status, and entity (`PAYMENT`/`REFUND`).
- **Manual Discrepancy Resolution Modal:** Selectable reason (`FEE_ADJUSTMENT`, `REFUND_TIMING_DELAY`, `DUPLICATE_SETTLED`, `MANUAL_CORRECTION`, `PROVIDER_UNAVAILABLE`, `OTHER`) with mandatory audit notes.

### 4.3 Reconciliation Run Detail Page (`/admin/reconciliation/:reference`)
- **Run Overview Banner:** Run reference, status badge, scope, initiator, and start/completion timestamps.
- **Filtered Record Views:** `ALL`, `DISCREPANCIES`, `MATCHED`, `REVIEW_REQUIRED`.
- **Side-by-Side Comparison Drawer:** Side-by-side inspection comparing Internal Database attributes (reference, amount, currency, status) against Independent External Statement Ledger attributes.

### 4.4 Immutable Audit Logs Viewer (`/admin/audit-logs`)
- **Comprehensive Filter Bar:** Filter by actor, action, resource type, resource ID, merchant ID, and date range.
- **Detailed JSON Inspector Drawer:** Modal displaying sanitized pre-action (`before_data`) and post-action (`after_data`) JSON state diffs, administrator justification reason, IP address, and user agent.
