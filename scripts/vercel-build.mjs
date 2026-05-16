import { execSync } from 'node:child_process';
import { validateDatabaseUrl } from './validate-database-url.mjs';

try {
  validateDatabaseUrl(process.env.DATABASE_URL);
} catch (error) {
  console.error('\n[build] Invalid DATABASE_URL:\n');
  console.error(error instanceof Error ? error.message : error);
  console.error('\n');
  process.exit(1);
}

execSync('npx prisma migrate deploy', { stdio: 'inherit', env: process.env });
execSync('npm run build', { stdio: 'inherit', env: process.env });
