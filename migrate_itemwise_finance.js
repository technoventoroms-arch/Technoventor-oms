import pool from './server/db.js';

async function migrate() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    console.log('Migrating order_finance to item-wise...');
    
    // Drop existing table or alter it
    // To be safe and simple, drop and recreate since it's dev
    await client.query('DROP TABLE IF EXISTS order_finance');
    
    await client.query(`
      CREATE TABLE order_finance (
        id SERIAL PRIMARY KEY,
        order_id VARCHAR(50) REFERENCES orders(id) ON DELETE CASCADE,
        boq_item_id INT NOT NULL,
        po_number VARCHAR(100),
        advance_approved BOOLEAN DEFAULT false,
        advance_approval_date DATE,
        advance_payment_ref VARCHAR(255),
        receipt_uploaded BOOLEAN DEFAULT false,
        receipt_url TEXT,
        total_payment_approved BOOLEAN DEFAULT false,
        remarks TEXT,
        UNIQUE(order_id, boq_item_id)
      );
    `);
    
    await client.query('COMMIT');
    console.log('✅ Item-wise finance migration successful');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Migration failed:', err);
  } finally {
    client.release();
    process.exit();
  }
}

migrate();
