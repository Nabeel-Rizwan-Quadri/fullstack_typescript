import path from 'node:path';
import { execSync } from 'node:child_process';

export default async function globalSetup() {
  const repoRoot = path.resolve(__dirname, '../../../..');
  execSync('docker compose up -d postgres postgres_test', {
    cwd: repoRoot,
    stdio: 'inherit',
  });
}
