import pool from './db.js';

async function updatePermissions() {
  const client = await pool.connect();
  try {
    console.log('Updating service permissions for existing users...');

    await client.query(`
      UPDATE users
      SET permissions = array_cat(permissions, $1)
      WHERE (
        department = 'admin'
        OR 'manage_users' = ANY(permissions)
        OR 'view_all_orders' = ANY(permissions)
        OR 'view_installation' = ANY(permissions)
        OR 'view_dispatch' = ANY(permissions)
      )
      AND NOT ('view_service' = ANY(permissions));
    `, [['view_service', 'edit_service']]);

    console.log('Service permissions updated successfully.');
  } catch (err) {
    console.error('Update failed:', err);
  } finally {
    client.release();
    process.exit();
  }
}

updatePermissions();
