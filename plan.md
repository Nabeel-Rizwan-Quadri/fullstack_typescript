## Plan: Next.js + NestJS + Postgres Auth Starter

Build a minimal full-stack TypeScript monorepo: Next.js frontend with signup/login and a protected dashboard, NestJS backend with Postgres (TypeORM) and cookie-based JWT auth. Add automated tests for backend (unit + e2e) and frontend (component + e2e) that cover the auth flow end-to-end.

**Assumptions / constraints**
- Frontend uses **Next.js App Router**.
- Local dev and e2e use Docker for Postgres.
- Single JWT cookie only (no refresh token flow).

**Non-goals (explicitly out of scope)**
- No email verification, password reset, refresh tokens, roles/permissions, profile editing.
- No fancy UI, no extra pages beyond signup/login/dashboard.
- No production deployment hardening beyond the cookie flags noted below.

**Steps**
1. Initialize monorepo workspace (pnpm)
   - Choose and document Node + pnpm versions (recommend: set `packageManager` in root `package.json`; use Corepack).
   - Create root `package.json` with workspace scripts to run frontend/backend/dev/test.
   - Add `pnpm-workspace.yaml` with `apps/*` (and optionally `packages/*` if shared types are needed).
   - Add root `.gitignore`, `.editorconfig`, and a minimal `README.md` describing local dev + test commands.
   - Add repo-wide TypeScript and tooling scripts:
     - `tsconfig.base.json` (strict, shared), plus per-app `tsconfig.json` extending it.
     - Root scripts: `lint`, `format`, `typecheck` (even if CI is added later).

2. Provision Postgres for local development
   - Add root `docker-compose.yml` with a `postgres` service (ports, volume) and a dedicated database for dev.
   - Add root `.env.example` holding Postgres connection defaults.
   - Decide and document how tests access Postgres (see step 8).

3. Scaffold NestJS backend (`apps/api`)
   - Create a NestJS app in `apps/api` using TypeScript.
   - Add configuration via `@nestjs/config` and environment file `.env` + `.env.example`.
   - Add TypeORM wiring (`@nestjs/typeorm`, `typeorm`, `pg`) using `TypeOrmModule.forRootAsync`.
   - Add `cookie-parser` middleware so auth can read cookies.
   - Standardize API port (e.g. 3001) and document it.

4. Implement data model with TypeORM
   - Create `User` entity with `id`, `username`, `email`, `passwordHash`, timestamps.
   - Add unique constraints on `email` and `username`.
   - Choose a migration strategy (TypeORM v0.3+ recommended):
     - Recommended for real projects: migrations (`typeorm migration:generate` / `run`).
     - For MVP: `synchronize: true` in dev only, off in production.
   - Decide whether e2e tests use migrations or `synchronize` and keep it consistent.

5. Implement authentication (cookie-based JWT)
   - Add `AuthModule` + `UsersModule`.
   - Signup endpoint: `POST /auth/signup` accepts username/email/password, hashes password (bcrypt), creates user.
   - Login endpoint: `POST /auth/login` validates credentials, sets `access_token` cookie (httpOnly; `secure` in prod; `sameSite` appropriate for localhost).
   - Logout endpoint: `POST /auth/logout` clears cookie.
   - “Who am I” endpoint: `GET /me` returns `{ id, username, email }` for authenticated users.
   - Protect `GET /me` using Passport JWT strategy configured to read token from cookies.
    - Add env vars (and document in `.env.example`):
       - `DATABASE_URL` (or host/user/password/db/port), `JWT_SECRET`, `JWT_EXPIRES_IN`.
       - `COOKIE_NAME` (default `access_token`), `WEB_ORIGIN` (e.g. `http://localhost:3000`).
    - Cookie details to lock down (dev vs prod):
       - `httpOnly: true`, `secure: false` in dev / `true` in prod.
       - `sameSite`: default to `lax` for localhost unless you truly need `none`.
       - Ensure logout clears the cookie using the same `path`/`domain`/`sameSite`/`secure` options used when setting it.

6. Add backend security + DX essentials
   - Enable CORS with credentials for the frontend origin (dev: `http://localhost:3000`) and set `Access-Control-Allow-Credentials`.
   - Add request validation with `class-validator` + `class-transformer` (DTOs for signup/login).
   - Add consistent error responses (409 on duplicate username/email, 401 on invalid login).
   - Add a global validation pipe (whitelist + forbidNonWhitelisted) to keep request shapes strict.

7. Scaffold Next.js frontend (`apps/web`)
   - Create a Next.js app with TypeScript.
   - Add environment variables (`NEXT_PUBLIC_API_URL`) and `.env.example`.
   - Create routes:
     - `/signup`: form that calls `POST /auth/signup` (credentials included) then navigates to `/dashboard`.
     - `/login`: form that calls `POST /auth/login` (credentials included) then navigates to `/dashboard`.
     - `/dashboard`: protected view that fetches `GET /me` and displays exactly: “Welcome {username}”.
   - Keep UI minimal (no extra pages, roles, or profile editing).
    - App Router specifics:
       - Use `app/signup/page.tsx`, `app/login/page.tsx`, `app/dashboard/page.tsx`.
       - When calling the API from the browser, always use `fetch(..., { credentials: 'include' })`.
       - For `/dashboard`, fetch `/me` with `cache: 'no-store'` (avoid stale/cached auth responses).

8. Testing strategy (backend + frontend)
   - Backend unit tests (Jest):
     - `AuthService` hashing/validation behavior.
     - `UsersService` create/find constraints.
   - Backend e2e tests (Jest + supertest):
     - Signup → login sets cookie → `/me` returns username.
     - Duplicate signup returns 409.
     - `/me` without cookie returns 401.
    - Use `supertest`'s `request.agent(app)` so cookies persist across calls.
   - Postgres for tests (pick one and document prerequisites):
     - Option A (simplest): `docker-compose` starts a separate `postgres_test` DB; e2e points to it.
     - Option B (more isolated): Testcontainers spins up Postgres per test run (requires Docker Desktop).
       - Document DB reset strategy between e2e tests (truncate tables or recreate schema).
   - Frontend component tests:
       - Use React Testing Library to test extracted login/signup form components and “dashboard renders welcome text after /me resolves”.
     - Mock network using MSW (or `fetch` mocking) so tests run without the backend.
   - Frontend e2e tests (Playwright):
     - Bring up Postgres + backend + frontend; run a real signup/login and assert dashboard text contains username.
       - Decide how Playwright starts the stack (recommended: Playwright `webServer` starts a single root command that runs both apps).

9. Developer scripts and local workflow
   - Root scripts:
     - `dev` runs `apps/api` and `apps/web` concurrently.
     - `test` runs backend unit/e2e and frontend unit/e2e.
   - Add a minimal CI workflow later if desired (lint + test).

**Relevant files**
- `pnpm-workspace.yaml` — declares workspace packages.
- `package.json` (root) — orchestrates `dev`/`test` across apps.
- `docker-compose.yml` — Postgres service(s) for dev (and possibly test).
- `apps/api/src/app.module.ts` — module composition (Config, TypeORM, Auth, Users).
- `apps/api/src/auth/*` — controllers, DTOs, service, JWT strategy.
- `apps/api/src/users/*` — user entity/service.
- `apps/web/app/login/page.tsx` — login UI and submit logic.
- `apps/web/app/signup/page.tsx` — signup UI and submit logic.
- `apps/web/app/dashboard/page.tsx` — fetch `/me`, render welcome+username.
- `apps/web/playwright.config.*` and `apps/web/tests/*` — e2e + component tests.

**Verification**
1. Local dev: start Postgres, then run `pnpm dev`; manually verify signup → login → dashboard shows correct username.
2. Backend tests: run unit tests and e2e tests; confirm cookie auth behavior and proper status codes.
3. Frontend tests: run component tests (mocked) and Playwright e2e (real stack).

**Decisions**
- Monorepo: pnpm workspaces.
- Backend DB: Postgres via TypeORM.
- Auth: JWT stored in httpOnly cookie set by backend.
- UI scope: only signup, login, and a dashboard that displays “Welcome {username}”.

**Further Considerations**
1. Password policy: minimal (length only) vs stronger rules.
2. Token lifetime: short access token with refresh flow vs single token for MVP (recommended MVP: single token first).
3. Environment: confirm you can run Docker Desktop locally (needed for Postgres dev and e2e tests).
