import pool from './db.js';

export async function createTables() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // 1. Users table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        department VARCHAR(50) NOT NULL,
        password VARCHAR(255) NOT NULL,
        permissions TEXT[] DEFAULT '{}',
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    // 2. Orders table (main order info + customer + order details + epbg + commercial + summary)
    await client.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id VARCHAR(50) PRIMARY KEY,
        project_name VARCHAR(500) NOT NULL,

        -- Customer Details
        customer_name VARCHAR(255),
        customer_type VARCHAR(50),
        billing_address JSONB,
        shipping_address JSONB,
        contact_person VARCHAR(255),
        contact_number VARCHAR(50),
        customer_email VARCHAR(255),
        gst_number VARCHAR(50),

        -- Order Details
        order_number VARCHAR(100),
        order_date DATE,
        quotation_number VARCHAR(100),
        quotation_date DATE,
        expected_delivery_date DATE,
        dispatch_date DATE,

        -- EPBG Details
        epbg_required VARCHAR(10) DEFAULT 'No',
        epbg_attachment_draft TEXT,

        -- Commercial Terms
        payment_term VARCHAR(100),
        warranty_term VARCHAR(100),
        commercial_others TEXT,

        -- Summary
        total_value DECIMAL(15,2) DEFAULT 0,
        sub_total DECIMAL(15,2) DEFAULT 0,
        gst_amount DECIMAL(15,2) DEFAULT 0,
        grand_total DECIMAL(15,2) DEFAULT 0,

        -- Meta
        created_date DATE DEFAULT CURRENT_DATE,
        created_by VARCHAR(255),
        current_stage VARCHAR(50) DEFAULT 'new',

        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);

    // Safe migrations for existing tables
    await client.query(`
      ALTER TABLE orders ALTER COLUMN billing_address TYPE JSONB USING to_jsonb(billing_address);
      ALTER TABLE orders ALTER COLUMN shipping_address TYPE JSONB USING to_jsonb(shipping_address);
      ALTER TABLE orders ADD COLUMN IF NOT EXISTS expected_delivery_date DATE;
      ALTER TABLE orders ADD COLUMN IF NOT EXISTS dispatch_date DATE;
      ALTER TABLE orders ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN DEFAULT false;
      ALTER TABLE order_items ADD COLUMN IF NOT EXISTS parent_item_index INT DEFAULT NULL;
    `);

    // Add planning column if it doesn't exist yet (safe migration)
    await client.query(`
      ALTER TABLE orders ADD COLUMN IF NOT EXISTS planning JSONB DEFAULT NULL;
      ALTER TABLE order_items ADD COLUMN IF NOT EXISTS description TEXT;
      ALTER TABLE order_items ADD COLUMN IF NOT EXISTS short_qty DECIMAL(15,2) DEFAULT 0;
    `);

    // 3. Order Items (BOQ)
    await client.query(`
      CREATE TABLE IF NOT EXISTS order_items (
        id SERIAL PRIMARY KEY,
        order_id VARCHAR(50) REFERENCES orders(id) ON DELETE CASCADE ON UPDATE CASCADE,
        item_index INT NOT NULL,
        name VARCHAR(500) NOT NULL,
        item_code VARCHAR(100),
        make VARCHAR(255),
        model VARCHAR(255),
        quantity DECIMAL(15,2) DEFAULT 0,
        unit VARCHAR(20) DEFAULT 'Nos',
        rate DECIMAL(15,2) DEFAULT 0,
        amount DECIMAL(15,2) DEFAULT 0,
        gst_percent DECIMAL(5,2) DEFAULT 18,
        total_amount DECIMAL(15,2) DEFAULT 0,
        parent_item_index INT DEFAULT NULL,
        description TEXT,
        short_qty DECIMAL(15,2) DEFAULT 0,
        item_type VARCHAR(50) DEFAULT 'goods'
      );
    `);

    // 4. Procurement Purchases (per BOQ item)
    await client.query(`
      CREATE TABLE IF NOT EXISTS procurement_purchases (
        id SERIAL PRIMARY KEY,
        order_id VARCHAR(50) REFERENCES orders(id) ON DELETE CASCADE ON UPDATE CASCADE,
        boq_item_id INT NOT NULL,

        -- Vendor Details
        vendor_name VARCHAR(255),
        vendor_code VARCHAR(50),
        vendor_contact_person VARCHAR(255),
        vendor_contact_number VARCHAR(50),
        vendor_email VARCHAR(255),
        vendor_address TEXT,
        vendor_gst_number VARCHAR(50),
        vendor_account_holder_name VARCHAR(255),
        vendor_bank_name VARCHAR(255),
        vendor_account_number VARCHAR(100),
        vendor_account_type VARCHAR(50),
        vendor_ifsc_code VARCHAR(50),

        -- Quotation Details
        quotation_number VARCHAR(100),
        quotation_date DATE,
        rfq_number VARCHAR(100),
        rfq_date DATE,

        -- PO Details
        po_number VARCHAR(100),
        po_date DATE,
        po_value VARCHAR(50),
        po_status VARCHAR(100),

        -- Payment & Delivery
        payment_type VARCHAR(100),
        credit_days VARCHAR(20),
        payment_notes TEXT,
        delivery_method VARCHAR(100),
        expected_delivery_date DATE
      );
    `);

    // Safe migrations for procurement_purchases
    await client.query(`
      ALTER TABLE procurement_purchases ADD COLUMN IF NOT EXISTS payment_notes TEXT;
    `);

    // 5. Order Finance
    await client.query(`
      CREATE TABLE IF NOT EXISTS order_finance (
        id SERIAL PRIMARY KEY,
        order_id VARCHAR(50) REFERENCES orders(id) ON DELETE CASCADE ON UPDATE CASCADE,
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

    // Safe migrations for order_finance
    await client.query(`
      ALTER TABLE order_finance ADD COLUMN IF NOT EXISTS payment_status VARCHAR(50) DEFAULT 'Pending';
    `);

    // 6. Order Stores (Inward)
    await client.query(`
      CREATE TABLE IF NOT EXISTS order_stores (
        id SERIAL PRIMARY KEY,
        order_id VARCHAR(50) UNIQUE REFERENCES orders(id) ON DELETE CASCADE ON UPDATE CASCADE,
        grn_number VARCHAR(100),
        grn_date DATE,
        received_quantity DECIMAL(15,2),
        condition_status VARCHAR(100),
        inspection_done BOOLEAN DEFAULT false,
        inspection_notes TEXT,
        storage_location VARCHAR(255),
        received_by VARCHAR(255),
        remarks TEXT,
        boq_inwards JSONB DEFAULT '[]'
      );
    `);

    // Safe migrations for order_stores
    await client.query(`
      ALTER TABLE order_stores ADD COLUMN IF NOT EXISTS boq_inwards JSONB DEFAULT '[]';
    `);

    // 7. Order Dispatch
    await client.query(`
      CREATE TABLE IF NOT EXISTS order_dispatch (
        id SERIAL PRIMARY KEY,
        order_id VARCHAR(50) UNIQUE REFERENCES orders(id) ON DELETE CASCADE ON UPDATE CASCADE,
        dispatch_number VARCHAR(100),
        dispatch_date DATE,
        transporter_name VARCHAR(255),
        vehicle_number VARCHAR(100),
        lr_number VARCHAR(100),
        lr_date DATE,
        number_of_boxes INT,
        weight VARCHAR(50),
        delivery_status VARCHAR(100),
        delivered_date DATE,
        pod_uploaded BOOLEAN DEFAULT false,
        pod_url TEXT,
        dispatched_by VARCHAR(255),
        remarks TEXT,
        
        -- New fields
        delivery_type VARCHAR(100),
        packing_type VARCHAR(100),
        delivery_location VARCHAR(500),
        eway_bill_available VARCHAR(10) DEFAULT 'No',
        transit_insurance VARCHAR(10) DEFAULT 'No',
        boq_dispatch JSONB DEFAULT '[]'
      );
    `);

    // Safe migrations for existing tables
    await client.query(`
      ALTER TABLE order_dispatch ADD COLUMN IF NOT EXISTS delivery_type VARCHAR(100);
      ALTER TABLE order_dispatch ADD COLUMN IF NOT EXISTS packing_type VARCHAR(100);
      ALTER TABLE order_dispatch ADD COLUMN IF NOT EXISTS delivery_location VARCHAR(500);
      ALTER TABLE order_dispatch ADD COLUMN IF NOT EXISTS eway_bill_available VARCHAR(10) DEFAULT 'No';
      ALTER TABLE order_dispatch ADD COLUMN IF NOT EXISTS transit_insurance VARCHAR(10) DEFAULT 'No';
      ALTER TABLE order_dispatch ADD COLUMN IF NOT EXISTS boq_dispatch JSONB DEFAULT '[]';
    `);

    // 8. Order History (audit trail)
    await client.query(`
      CREATE TABLE IF NOT EXISTS order_history (
        id SERIAL PRIMARY KEY,
        order_id VARCHAR(50) REFERENCES orders(id) ON DELETE CASCADE ON UPDATE CASCADE,
        date TIMESTAMP NOT NULL,
        action TEXT NOT NULL,
        performed_by VARCHAR(255),
        department VARCHAR(100),
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    // Migration to change date to TIMESTAMP if it's currently DATE
    await client.query(`
      ALTER TABLE order_history ALTER COLUMN date TYPE TIMESTAMP;
    `);

    // 9. Order Invoices
    await client.query(`
      CREATE TABLE IF NOT EXISTS order_invoices (
        id SERIAL PRIMARY KEY,
        order_id VARCHAR(50) UNIQUE REFERENCES orders(id) ON DELETE CASCADE ON UPDATE CASCADE,
        invoice_number VARCHAR(100),
        invoice_date DATE,
        invoice_attachment TEXT,
        eway_bill_attachment TEXT,
        remarks TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    // 10. Order Deliveries
    await client.query(`
      CREATE TABLE IF NOT EXISTS order_deliveries (
        id SERIAL PRIMARY KEY,
        order_id VARCHAR(50) UNIQUE REFERENCES orders(id) ON DELETE CASCADE ON UPDATE CASCADE,
        handover_to VARCHAR(255),
        delivery_date DATE,
        proof_of_delivery TEXT,
        remarks TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    // 11. Order Installations
    await client.query(`
      CREATE TABLE IF NOT EXISTS order_installations (
        id SERIAL PRIMARY KEY,
        order_id VARCHAR(50) UNIQUE REFERENCES orders(id) ON DELETE CASCADE ON UPDATE CASCADE,
        installed_by VARCHAR(255),
        site_contact VARCHAR(255),
        installation_date DATE,
        remarks TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    // Safe migrations for order_items
    await client.query(`
      ALTER TABLE order_items ADD COLUMN IF NOT EXISTS item_type VARCHAR(50) DEFAULT 'goods';
    `);

    // Add ON UPDATE CASCADE to existing constraints
    await client.query(`
      ALTER TABLE order_items DROP CONSTRAINT IF EXISTS order_items_order_id_fkey;
      ALTER TABLE order_items ADD CONSTRAINT order_items_order_id_fkey FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE ON UPDATE CASCADE;

      ALTER TABLE procurement_purchases DROP CONSTRAINT IF EXISTS procurement_purchases_order_id_fkey;
      ALTER TABLE procurement_purchases ADD CONSTRAINT procurement_purchases_order_id_fkey FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE ON UPDATE CASCADE;

      ALTER TABLE order_finance DROP CONSTRAINT IF EXISTS order_finance_order_id_fkey;
      ALTER TABLE order_finance ADD CONSTRAINT order_finance_order_id_fkey FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE ON UPDATE CASCADE;

      ALTER TABLE order_stores DROP CONSTRAINT IF EXISTS order_stores_order_id_fkey;
      ALTER TABLE order_stores ADD CONSTRAINT order_stores_order_id_fkey FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE ON UPDATE CASCADE;

      ALTER TABLE order_dispatch DROP CONSTRAINT IF EXISTS order_dispatch_order_id_fkey;
      ALTER TABLE order_dispatch ADD CONSTRAINT order_dispatch_order_id_fkey FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE ON UPDATE CASCADE;

      ALTER TABLE order_history DROP CONSTRAINT IF EXISTS order_history_order_id_fkey;
      ALTER TABLE order_history ADD CONSTRAINT order_history_order_id_fkey FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE ON UPDATE CASCADE;

      ALTER TABLE order_invoices DROP CONSTRAINT IF EXISTS order_invoices_order_id_fkey;
      ALTER TABLE order_invoices ADD CONSTRAINT order_invoices_order_id_fkey FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE ON UPDATE CASCADE;

      ALTER TABLE order_deliveries DROP CONSTRAINT IF EXISTS order_deliveries_order_id_fkey;
      ALTER TABLE order_deliveries ADD CONSTRAINT order_deliveries_order_id_fkey FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE ON UPDATE CASCADE;

      ALTER TABLE order_installations DROP CONSTRAINT IF EXISTS order_installations_order_id_fkey;
      ALTER TABLE order_installations ADD CONSTRAINT order_installations_order_id_fkey FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE ON UPDATE CASCADE;
    `);

    await client.query(`
      UPDATE users 
      SET permissions = array_cat(permissions, ARRAY['view_delivery', 'edit_delivery']) 
      WHERE (department = 'admin' OR email = 'admin@company.com') 
      AND NOT ('view_delivery' = ANY(permissions));
    `);

    await client.query('COMMIT');
    console.log('✅ All tables created successfully');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Error creating tables:', err);
    throw err;
  } finally {
    client.release();
  }
}
