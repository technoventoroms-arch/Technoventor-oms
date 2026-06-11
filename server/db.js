import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error(
    'DATABASE_URL is not set. Add a hosted PostgreSQL connection string to your environment (Vercel project settings, or a local .env file for development).'
  );
}

if (/localhost|127\.0\.0\.1/.test(connectionString) && process.env.VERCEL) {
  throw new Error(
    'DATABASE_URL points to localhost, which is not reachable from Vercel. Use a hosted database (e.g. Neon, Supabase, or Vercel Postgres) and set DATABASE_URL in Vercel environment variables.'
  );
}

const isLocalDb = /localhost|127\.0\.0\.1/.test(connectionString);

const pool = new Pool({
  connectionString,
  ssl: isLocalDb ? false : { rejectUnauthorized: false },
});

pool.on('connect', () => {
  console.log('✅ Connected to Neon PostgreSQL');
});

pool.on('error', (err) => {
  console.error('❌ Database pool error:', err);
});

export default pool;
