import pool from './db.js';

async function updateConstraints() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const tableFkeys = [
      {table: 'order_items', constraint: 'order_items_order_id_fkey'},
      {table: 'procurement_purchases', constraint: 'procurement_purchases_order_id_fkey'},
      {table: 'order_finance', constraint: 'order_finance_order_id_fkey'},
      {table: 'order_stores', constraint: 'order_stores_order_id_fkey'},
      {table: 'order_dispatch', constraint: 'order_dispatch_order_id_fkey'},
      {table: 'order_history', constraint: 'order_history_order_id_fkey'},
      {table: 'order_invoices', constraint: 'order_invoices_order_id_fkey'}
    ];

    for (const {table, constraint} of tableFkeys) {
      console.log(`Updating constraint for ${table}...`);
      await client.query(`ALTER TABLE ${table} DROP CONSTRAINT IF EXISTS ${constraint}`);
      await client.query(`ALTER TABLE ${table} ADD CONSTRAINT ${constraint} FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    await client.query('COMMIT');
    console.log('✅ Constraints updated successfully to support ON UPDATE CASCADE');
  } catch (e) {
    await client.query('ROLLBACK');
    console.error('❌ Failed to update constraints:', e);
  } finally {
    client.release();
    process.exit(0);
  }
}

updateConstraints();
