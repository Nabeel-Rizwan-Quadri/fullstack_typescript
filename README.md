# Next.js + NestJS + Postgres Auth Starter

Monorepo with:
- `apps/web`: Next.js (App Router) frontend
- `apps/api`: NestJS backend with Postgres (TypeORM) and cookie-based JWT auth

## Prerequisites
- Node.js (tested with v22.x)
- Docker (for Postgres)
- pnpm via Corepack (recommended): `corepack pnpm -v`

Note (Windows): if `corepack enable` fails with EPERM (can’t write to `C:\Program Files\nodejs\`), you may not have a `pnpm` shim on PATH. This repo’s scripts are written to work with `corepack pnpm ...` without needing the shim.

## Local development
1. Start Postgres:
   - `corepack pnpm db:up`
2. Start backend + frontend:
   - `corepack pnpm dev`
3. Open:
   - Web: http://localhost:3000
   - API: http://localhost:3001

If you see `Hello World!` in the browser, you’re likely on the API (`http://localhost:3001/`). The UI routes are on the web app (`http://localhost:3000/login`, `http://localhost:3000/signup`, `http://localhost:3000/dashboard`).

## Tests
- Run all tests (unit + e2e):
  - `corepack pnpm test`

## Environment
Copy env examples:
- `apps/api/.env.example` → `apps/api/.env`
- `apps/web/.env.example` → `apps/web/.env.local`

(Defaults also exist in the root `.env.example`.)
