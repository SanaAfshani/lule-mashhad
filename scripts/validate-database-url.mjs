/** @param {string | undefined} url */
export function validateDatabaseUrl(url) {
  const value = url?.trim();

  if (!value) {
    throw new Error(
      'DATABASE_URL is not set. In Vercel: Project → Settings → Environment Variables → add your Neon PostgreSQL URL.',
    );
  }

  if (value.startsWith('file:')) {
    throw new Error(
      'DATABASE_URL must be PostgreSQL (postgresql://...), not SQLite. Use a Neon connection string: https://neon.tech',
    );
  }

  if (!value.startsWith('postgresql://') && !value.startsWith('postgres://')) {
    throw new Error('DATABASE_URL must start with postgresql:// or postgres://');
  }

  const placeholderSignals = [
    'ep-xxx',
    'USER:PASSWORD',
    '@HOST/',
    'region.aws.neon.tech/neondb',
    'your-password',
    'changeme',
  ];

  const matched = placeholderSignals.find((signal) =>
    value.toLowerCase().includes(signal.toLowerCase()),
  );

  if (matched) {
    throw new Error(
      `DATABASE_URL still contains placeholder "${matched}" from .env.example. ` +
        'Create a project at https://neon.tech → Connection Details → copy the real "Pooled" URL into Vercel (not this example file).',
    );
  }

  return value;
}
