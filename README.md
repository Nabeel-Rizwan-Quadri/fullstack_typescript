# Next.js + NestJS + Postgres Auth Starter

Monorepo with:
- `apps/web`: Next.js (App Router) frontend
- `apps/api`: NestJS backend with Postgres (TypeORM) and cookie-based JWT auth

## Prerequisites
- Node.js (tested with v22.x)
- Docker (for Postgres)
- pnpm via Corepack (recommended): `corepack pnpm -v`

## Local development
1. Start Postgres:
   - `corepack pnpm db:up`
2. Start backend + frontend:
   - `corepack pnpm dev`
3. Open:
   - Web: http://localhost:3000
   - API: http://localhost:3001

## Tests
- Run all tests (unit + e2e):
  - `corepack pnpm test`

## Environment
Copy env examples:
- `apps/api/.env.example` → `apps/api/.env`
- `apps/web/.env.example` → `apps/web/.env.local`

(Defaults also exist in the root `.env.example`.)
