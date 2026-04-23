import pool from './db.js';

async function migrate() {
  const client = await pool.connect();
  try {
    console.log('🏁 Starting soft delete migration...');
    await client.query(`
      ALTER TABLE orders ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN DEFAULT false;
    `);
    console.log('✅ Migration successful: is_deleted column added to orders table.');
  } catch (err) {
    console.error('❌ Migration failed:', err);
  } finally {
    client.release();
    process.exit();
  }
}

migrate();
