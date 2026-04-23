import pool from './server/db.js';

async function listUsers() {
  try {
    const result = await pool.query('SELECT id, name, email, department, is_active FROM users ORDER BY id');
    console.log('--- Users in Database ---');
    console.table(result.rows);
    console.log('-------------------------');
    await pool.end();
  } catch (err) {
    console.error('Error listing users:', err);
    process.exit(1);
  }
}

listUsers();
