# PAYCORE FRONTEND — GIT & GITHUB WORKFLOW SPECIFICATION

## 1. Repository Standard
The `PayCore-Frontend` repository (`origin https://github.com/Prutwi17/PayCore-Frontend.git`) enforces the identical branch and review protocols as the backend:

- Base Branch: `main`
- No direct pushes or commits to `main`.
- All features developed in `feature/<milestone-or-capability>` branches.

---

## 2. Multi-Repo Synchronization Protocol
When a milestone introduces both API and UI changes:
1. Feature branch created in `PayCore-Backend`: `feature/<name>`
2. Feature branch created in `PayCore-Frontend`: `feature/<name>`
3. Frontend uses the API contracts defined in `docs/API-Contracts.md`.
4. Both PRs are opened concurrently and cross-referenced.

---

## 3. Pull Request Requirements
Before submitting a PR for the frontend:
1. `npm run typecheck` passes with zero TypeScript errors.
2. `npm run lint` passes with zero lint warnings.
3. `npm run build` succeeds generating clean assets in `dist/`.
4. Responsive layout verified across mobile (375px) and desktop (1280px+).
