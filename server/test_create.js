import pool from './db.js';

async function testCreate() {
  const o = {
    id: 'TEST-' + Date.now(),
    projectName: 'Test Project',
    customerDetails: { name: 'Test Client', type: 'Private' },
    summary: { subTotal: 100, gstAmount: 18, grandTotal: 118 },
    totalValue: 100,
    createdDate: '2024-01-01',
    createdBy: 'Tester',
    currentStage: 'new'
  };

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    console.log('🏁 Starting test order creation...');
    await client.query(
      `INSERT INTO orders (id, project_name, customer_name, customer_type, billing_address, shipping_address,
        contact_person, contact_number, customer_email, gst_number,
        order_number, order_date, quotation_number, quotation_date, expected_delivery_date, dispatch_date,
        epbg_required, epbg_attachment_draft, payment_term, warranty_term, commercial_others,
        total_value, sub_total, gst_amount, grand_total,
        created_date, created_by, current_stage, is_deleted)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26,$27,$28,$29)`,
      [
        o.id, o.projectName,
        o.customerDetails?.name, o.customerDetails?.type,
        JSON.stringify(o.customerDetails?.billingAddress || {}), JSON.stringify(o.customerDetails?.shippingAddress || {}),
        o.customerDetails?.contactPerson, o.customerDetails?.contactNumber,
        o.customerDetails?.email, o.customerDetails?.gstNumber,
        o.orderDetails?.orderNumber, o.orderDetails?.orderDate,
        o.orderDetails?.quotationNumber, o.orderDetails?.quotationDate,
        o.orderDetails?.expectedDeliveryDate, o.orderDetails?.dispatchDate,
        o.epbgDetails?.required, o.epbgDetails?.attachmentDraft,
        o.commercialTerms?.paymentTerm, o.commercialTerms?.warrantyTerm,
        o.commercialTerms?.others,
        o.totalValue || 0, o.summary?.subTotal || 0, o.summary?.gstAmount || 0, o.summary?.grandTotal || 0,
        o.createdDate, o.createdBy, o.currentStage || 'new', false
      ]
    );
    await client.query('COMMIT');
    console.log('✅ Test order created successfully!');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Creation failed:', err);
  } finally {
    client.release();
    process.exit();
  }
}

testCreate();
