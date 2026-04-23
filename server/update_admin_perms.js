import pool from './db.js';

async function updateAdminPerms() {
  const client = await pool.connect();
  try {
    console.log('🏁 Updating Admin permissions...');
    // Add edit_orders to the admin user (admin@company.com)
    await client.query(`
      UPDATE users 
      SET permissions = array_cat(permissions, ARRAY['edit_orders']) 
      WHERE email = 'admin@company.com' 
      AND NOT ('edit_orders' = ANY(permissions));
    `);
    console.log('✅ Admin user updated with edit_orders permission.');
  } catch (err) {
    console.error('❌ Update failed:', err);
  } finally {
    client.release();
    process.exit();
  }
}

updateAdminPerms();
