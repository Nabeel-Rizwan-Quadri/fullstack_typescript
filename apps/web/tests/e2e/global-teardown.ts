import path from 'node:path';
import { execSync } from 'node:child_process';

export default async function globalTeardown() {
  const repoRoot = path.resolve(__dirname, '../../../..');
  execSync('docker compose down', { cwd: repoRoot, stdio: 'inherit' });
}
