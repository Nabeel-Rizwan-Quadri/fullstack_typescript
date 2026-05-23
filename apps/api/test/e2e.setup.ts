import path from 'node:path';
import fs from 'node:fs';
import { config as loadEnv } from 'dotenv';

const envPath = path.resolve(__dirname, '../.env.test');

if (fs.existsSync(envPath)) {
	loadEnv({ path: envPath });
}

process.env.NODE_ENV = process.env.NODE_ENV ?? 'test';
process.env.DATABASE_URL =
	process.env.DATABASE_URL ?? 'postgres://app:app@localhost:5433/app_test';
process.env.JWT_SECRET = process.env.JWT_SECRET ?? 'test-secret';
process.env.JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN ?? '1h';
process.env.COOKIE_NAME = process.env.COOKIE_NAME ?? 'access_token';
process.env.WEB_ORIGIN = process.env.WEB_ORIGIN ?? 'http://localhost:3000';
process.env.PORT = process.env.PORT ?? '3001';
