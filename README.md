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
