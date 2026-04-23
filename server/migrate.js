import pool from './db.js';
import { createTables } from './schema.js';

async function migrate() {
  console.log('🔄 Running database migrations...');
  try {
    await createTables();
    console.log('✅ Migrations completed successfully.');
  } catch (error) {
    console.error('❌ Migration failed:', error);
  } finally {
    await pool.end();
    process.exit();
  }
}

migrate();
