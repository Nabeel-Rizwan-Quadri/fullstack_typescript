# Version / Progress Log

Date: 2026-05-23

## Completed
- [x] Step 1: Initialize pnpm monorepo workspace
- [x] Step 2: Provision Postgres (docker-compose)
- [x] Step 3: Scaffold NestJS backend (`apps/api`)
- [x] Step 4: Implement TypeORM User model
- [x] Step 5: Implement cookie-based JWT auth endpoints
- [x] Step 6: Backend CORS + validation + error handling
- [x] Step 7: Scaffold Next.js frontend (`apps/web`) + pages
- [~] Step 8: Add backend + frontend tests (unit + e2e)
- [x] Step 9: Developer scripts and workflow

## Notes
- This file is updated as tasks are completed.
- Backend e2e tests and Playwright e2e tests require Docker (Postgres via `docker compose`). In this workspace environment, `docker` was not found on PATH, so those e2e tests could not be executed here.
