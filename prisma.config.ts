import 'dotenv/config';
import { defineConfig } from 'prisma/config';
import { validateDatabaseUrl } from './scripts/validate-database-url.mjs';

function getDatabaseUrl(): string {
  return validateDatabaseUrl(process.env.DATABASE_URL);
}

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    seed: 'tsx prisma/seed.ts',
  },
  datasource: {
    url: getDatabaseUrl(),
  },
});
