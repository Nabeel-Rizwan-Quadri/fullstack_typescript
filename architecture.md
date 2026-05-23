# Architecture

This document explains what each part of the frontend/backend does and how to run the system.

## Overview
- Frontend: Next.js App Router (`apps/web`)
- Backend: NestJS (`apps/api`)
- Database: Postgres via Docker Compose (root `docker-compose.yml`)

## Frontend (`apps/web`)

### What it does
- Provides the UI for `/signup`, `/login`, and `/dashboard`.
- Sends auth requests to the backend using `fetch(..., { credentials: 'include' })` so the browser stores/sends the backend’s httpOnly JWT cookie.

### Key parts
- Routes (App Router pages):
	- `app/signup/page.tsx`: renders the signup form and navigates to `/dashboard` on success.
	- `app/login/page.tsx`: renders the login form and navigates to `/dashboard` on success.
	- `app/dashboard/page.tsx`: renders the protected dashboard.
- Client components:
	- `components/SignupForm.tsx`: posts to `POST /auth/signup`.
	- `components/LoginForm.tsx`: posts to `POST /auth/login`.
	- `components/DashboardClient.tsx`: fetches `GET /me` (with `cache: 'no-store'`) and renders exactly `Welcome {username}`.
- API helper:
	- `lib/api.ts`: wraps `fetch` and applies `credentials: 'include'`.

### How to run
- Env:
	- `apps/web/.env.local` sets `NEXT_PUBLIC_API_URL` (default `http://localhost:3001`).
- Dev server:
	- `corepack pnpm --filter @fs/web dev`

## Backend (`apps/api`)

### What it does
- Hosts the auth API and issues a JWT stored in an httpOnly cookie.
- Reads JWT from cookies using a Passport JWT strategy.
- Uses Postgres via TypeORM.

### Key parts
- Configuration + server bootstrap:
	- `src/main.ts`: enables CORS (credentials), sets up `cookie-parser`, and installs a global `ValidationPipe`.
	- `src/app.module.ts`: loads env via `@nestjs/config`, wires TypeORM, and imports modules.
- Database:
	- `src/users/user.entity.ts`: `User` entity with unique `email` + `username`.
	- TypeORM is configured with `synchronize: true` for non-prod; in `NODE_ENV=test` it also uses `dropSchema: true`.
- Auth:
	- `src/auth/auth.controller.ts`:
		- `POST /auth/signup`: creates a user, sets cookie, returns `{ id, username, email }`.
		- `POST /auth/login`: validates credentials, sets cookie, returns `{ id, username, email }`.
		- `POST /auth/logout`: clears cookie, returns `{ ok: true }`.
		- `GET /me`: protected; returns `{ id, username, email }`.
	- `src/auth/jwt.strategy.ts`: extracts JWT from cookie and loads the user.
	- `src/auth/auth.service.ts`: bcrypt hashing/verification + JWT signing + cookie helpers.

### How to run
- Env:
	- `apps/api/.env` sets `DATABASE_URL`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `COOKIE_NAME`, `WEB_ORIGIN`, `PORT`.
- Dev server:
	- `corepack pnpm --filter @fs/api dev`

## Database (Docker Compose)

### What it does
- `postgres`: dev database on `localhost:5432` (db: `app_dev`).
- `postgres_test`: test database on `localhost:5433` (db: `app_test`).

### How to run
- `docker compose up -d postgres postgres_test`
- `docker compose down`

## Running the whole stack

1. Start Postgres:
	 - `corepack pnpm db:up`
2. Start API + Web:
	 - `corepack pnpm dev`
3. Browse:
	 - Web: `http://localhost:3000`
	 - API: `http://localhost:3001`

Note: If you open `http://localhost:3001/` in the browser, the API’s root route returns `Hello World!` (a simple health check). The actual UI lives on `http://localhost:3000` (`/login`, `/signup`, `/dashboard`).

## Tests

### Backend
- Unit tests:
	- `corepack pnpm --filter @fs/api test`
- E2E tests (requires Docker/Postgres):
	- `corepack pnpm --filter @fs/api test:e2e`

### Frontend
- Component tests:
	- `corepack pnpm --filter @fs/web test`
- Playwright e2e (requires Docker/Postgres and Playwright browsers):
	- `corepack pnpm --filter @fs/web test:e2e`
