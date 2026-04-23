import pool from './db.js';

async function updatePermissions() {
  const client = await pool.connect();
  try {
    console.log('🏁 Updating permissions for existing users...');
    
    const newPerms = ['view_delivery', 'edit_delivery'];
    
    // Update all users who should have these permissions
    // For simplicity, let's give them to admins and anyone who has invoicing permissions
    await client.query(`
      UPDATE users 
      SET permissions = array_cat(permissions, $1) 
      WHERE (department = 'admin' OR 'view_invoicing' = ANY(permissions) OR 'view_dispatch' = ANY(permissions))
      AND NOT ('view_delivery' = ANY(permissions));
    `, [newPerms]);
    
    console.log('✅ Permissions updated successfully.');
  } catch (err) {
    console.error('❌ Update failed:', err);
  } finally {
    client.release();
    process.exit();
  }
}

updatePermissions();
