# PAYCORE FRONTEND — TECHNOLOGY STACK SPECIFICATION

## 1. Core Framework & Tooling

| Layer | Technology | Version | Rationale |
|---|---|---|---|
| **Runtime & Language** | TypeScript | 5.x | Strict type safety, shared DTO interfaces matching backend models. |
| **UI Framework** | React | 18.x | Declarative component model, fast reconciliation, robust ecosystem. |
| **Build Tool & Dev Server** | Vite | 5.x | Near-instant HMR, optimized Rollup production bundling, fast cold starts. |
| **Styling Engine** | Tailwind CSS | 3.4.x | Utility-first CSS, rapid UI development, consistent spacing and theme tokens. |
| **Routing** | React Router | 6.x | Nested layout routing, route guards (AuthGuard, RoleGuard), lazy loading. |
| **HTTP Client** | Axios | 1.6.x | Centralized request/response interceptors, automatic JWT injection, error handling. |
| **Data Visualization** | Recharts | 2.x | Composable SVG-based responsive charting for payment volume time series. |
| **Icons** | Lucide React | Latest | Modern, lightweight, consistent SVG iconography. |
| **Code Quality** | ESLint & Prettier | Latest | Automated code formatting and static lint checks. |

---

## 2. Directory Structure

```
PayCore-Frontend
├── public/                     # Static assets (favicons, fonts)
├── src/
│   ├── assets/                 # SVGs, brand assets, coin-inspired PayCore logo
│   ├── components/             # Reusable UI component library
│   │   ├── common/             # Button, Input, Modal, Badge, Toast, Table, Card
│   │   ├── layout/             # Sidebar, Navbar, PageHeader, Footer
│   │   └── payment/            # PaymentTimeline, StatusBadge, IdempotencyBanner
│   ├── context/                # React Contexts (AuthContext, ToastContext)
│   ├── hooks/                  # Custom hooks (useAuth, usePayments, useDebounce)
│   ├── pages/                  # Page components
│   │   ├── public/             # Home, Login, Register, ForgotPassword, ResetPassword
│   │   ├── merchant/           # Dashboard, Payments, PaymentDetails, CreatePayment,
│   │   │                       # Refunds, Webhooks, Reconciliation, ApiKeys, Settings
│   │   └── admin/              # Dashboard, Merchants, Payments, Refunds,
│   │                           # Webhooks, Reconciliation, AuditLogs, System
│   ├── services/               # API service modules
│   │   ├── api.ts              # Axios base client & interceptors
│   │   ├── authService.ts      # Login, registration, token refresh
│   │   ├── paymentService.ts   # Payment queries, initiation
│   │   ├── refundService.ts    # Refund requests
│   │   ├── webhookService.ts   # Webhook endpoint configuration
│   │   └── adminService.ts     # Platform analytics & merchant management
│   ├── types/                  # TypeScript interface definitions (DTOs)
│   ├── utils/                  # Formatting helpers (currency, date, UUID generator)
│   ├── App.tsx                 # Root router configuration
│   └── main.tsx                # Application bootstrap
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
```
