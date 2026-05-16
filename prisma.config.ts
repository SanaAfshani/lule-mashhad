import 'dotenv/config';
import { defineConfig } from 'prisma/config';

function getDatabaseUrl(): string {
  const url = process.env.DATABASE_URL?.trim();
  if (!url) {
    throw new Error(
      'DATABASE_URL is not set. Add a PostgreSQL URL in Vercel → Settings → Environment Variables (e.g. from Neon).',
    );
  }
  if (url.startsWith('file:')) {
    throw new Error(
      'DATABASE_URL must be PostgreSQL (postgresql://...), not SQLite (file:./dev.db). ' +
        'Create a free database at https://neon.tech and paste the pooled connection string into Vercel.',
    );
  }
  if (!url.startsWith('postgresql://') && !url.startsWith('postgres://')) {
    throw new Error(
      `DATABASE_URL must start with postgresql:// or postgres://. Got: ${url.slice(0, 20)}...`,
    );
  }
  return url;
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
