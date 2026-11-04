# PayCore — Payment Processing Engine (Frontend)

[![React](https://img.shields.io/badge/React-18.x-blue.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.x-purple.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.4.x-38B2AC.svg)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE)

> **PayCore Frontend** is a modern, responsive Single Page Application (SPA) providing dedicated Merchant and Admin operation portals for the PayCore Payment Processing Engine.

---

## 🎨 Visual Design System

Faithfully designed following the visual direction in [`design-reference/paycore-ui-reference.png`](./design-reference/paycore-ui-reference.png):
- **Primary Color:** High-contrast Blue (`#2563EB` / `#1D4ED8`)
- **Portal Shell:** Deep Navy / Slate navigation (`#0F172A`)
- **Canvas:** Clean white with subtle surface gray accents
- **Public & Auth Screens:** Minimalist white backdrop, soft ambient circular blue glow orbs, bottom flowing blue wave accent, and custom coin-inspired PayCore emblem (no Bitcoin styling).

---

## 📁 Project Documentation

Detailed frontend specifications are maintained under [`docs/`](./docs):

| Document | Description |
|---|---|
| [**PRD.md**](./docs/PRD.md) | Frontend requirements, user roles, core operational workflows |
| [**TechStack.md**](./docs/TechStack.md) | Component architecture, TypeScript, Tailwind, routing, state management |
| [**UI-PageStructure.md**](./docs/UI-PageStructure.md) | Visual design tokens, layout hierarchy, page-by-page specs |
| [**API-Contracts.md**](./docs/API-Contracts.md) | TypeScript interfaces, Axios interceptors, backend DTO parity |
| [**CICD.md**](./docs/CICD.md) | GitHub Actions workflow, Dockerfile, Nginx SPA configuration |
| [**GitWorkflow.md**](./docs/GitWorkflow.md) | Feature branching, conventional commits, dual-repo coordination |
| [**DevelopmentRoadmap.md**](./docs/DevelopmentRoadmap.md) | 8-Milestone frontend delivery plan |

---

## 🛠 Local Setup

### Prerequisites
- Node.js 20+
- npm 10+

### Installation & Run
```bash
cd PayCore-Frontend
npm install
npm run dev
```

Application starts at: `http://localhost:5173`

### Build & Verification
```bash
# Typecheck TypeScript definitions
npm run typecheck

# Lint codebase (0 warnings permitted)
npm run lint

# Production build
npm run build
```

---

## 🚀 Implemented Modules (Stage 3 Complete)

1. **Authentication & Session (AuthContext):**
   - Centralized authentication state management with localStorage persistence and /auth/me token hydration.
   - Axios Bearer token injection and error interception.
2. **Route Guards:**
   - ProtectedRoute: Guarantees only authenticated users can access protected sections.
   - RoleRoute: Enforces role-based boundaries (ROLE_ADMIN vs ROLE_MERCHANT).
   - PublicOnlyRoute: Prevents authenticated users from viewing guest login/register screens.
3. **Public Auth Pages:**
   - /login: Clean interface with password visibility toggle, developer quick-fill admin helper, and error alerts.
   - /register: Comprehensive account creation with optional merchant business provisioning.
4. **Merchant Workspace:**
   - /merchant/dashboard: Portal telemetry overview, merchant code, quick action cards, and Stage 3 core payment engine status indicator.
   - /merchant/payments: Interactive payment processing console, dynamic status filter tabs (ALL, SUCCESS, PROCESSING, REQUIRES_ACTION, FAILED, CANCELLED, UNKNOWN), search by reference/customer, and initiation modal with deterministic simulation scenario injection (NORMAL, FAIL, TIMEOUT, ACTION).
   - /merchant/payments (Attempt Telemetry Inspection): Modal with granular attempt logs, provider transaction references, timestamps, error codes, in-place payment cancellation for eligible states, and self-healing status verification for UNKNOWN states.
   - /merchant/settings: Business profile review, status badges (PENDING, ACTIVE, SUSPENDED), and editable contact details.
   - /merchant/api-keys: API credential registry, generation modal, single-exposure secret key disclosure, and key revocation.
5. **Admin Operations:**
   - /admin/dashboard: Platform health and governance summary.
   - /admin/merchants: Merchant auditing directory with search, status filtering, and approval/suspension lifecycle actions.
   - /admin/payments: Global payments ledger with cross-merchant auditing, status filters, reference search, and deep per-attempt telemetry inspection.
