import pool from './db.js';

async function migrate() {
  const client = await pool.connect();
  try {
    console.log('🏁 Fixing is_deleted column values...');
    await client.query(`
      UPDATE orders SET is_deleted = false WHERE is_deleted IS NULL;
    `);
    console.log('✅ Updated existing orders to is_deleted = false.');
  } catch (err) {
    console.error('❌ Migration failed:', err);
  } finally {
    client.release();
    process.exit();
  }
}

migrate();
