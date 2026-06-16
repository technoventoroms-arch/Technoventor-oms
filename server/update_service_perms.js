import pool from './db.js';

async function updatePermissions() {
  const client = await pool.connect();
  try {
    console.log('Updating service permissions for existing users...');

    await client.query(`
      UPDATE users
      SET permissions = array_cat(permissions, $1)
      WHERE department IN ('admin', 'service')
      AND NOT ('view_service' = ANY(permissions));
    `, [['view_service', 'edit_service']]);

    await client.query(`
      UPDATE users
      SET permissions = array_remove(array_remove(permissions, 'view_service'), 'edit_service')
      WHERE department = 'management';
    `);

    console.log('Service permissions updated successfully.');
  } catch (err) {
    console.error('Update failed:', err);
  } finally {
    client.release();
    process.exit();
  }
}

updatePermissions();
