import pool from './db.js';
import { createTables } from './schema.js';

const SAMPLE_USERS = [
  { name: 'Super Admin', email: 'admin@company.com', department: 'admin', password: 'admin123', permissions: ['view_dashboard','view_all_orders','view_assigned_orders','create_order','view_order_overview','view_project_name','view_customer_name','view_boq','view_order_value','view_order_history','view_procurement','edit_procurement','view_vendor_name','view_vendor_rates','view_advance_details','view_finance','edit_finance','approve_payments','view_payment_receipts','view_stores','edit_stores','view_dispatch','edit_dispatch','escalate_orders','delete_orders','edit_orders','export_data','manage_users','manage_permissions','view_settings','edit_settings'], isActive: true },
  { name: 'Rajesh Kumar', email: 'rajesh@company.com', department: 'management', password: 'mgmt123', permissions: ['view_dashboard','view_all_orders','view_order_overview','view_project_name','view_customer_name','view_boq','view_order_value','view_order_history','create_order','escalate_orders','view_procurement','view_vendor_name','view_finance','view_stores','view_dispatch','export_data'], isActive: true },
  { name: 'Priya Sharma', email: 'priya@company.com', department: 'procurement', password: 'proc123', permissions: ['view_dashboard','view_assigned_orders','view_order_overview','view_boq','view_order_history','view_procurement','edit_procurement','view_vendor_name','view_vendor_rates','view_advance_details','escalate_orders'], isActive: true },
  { name: 'Amit Patel', email: 'amit@company.com', department: 'finance', password: 'fin123', permissions: ['view_dashboard','view_assigned_orders','view_order_overview','view_project_name','view_customer_name','view_order_value','view_order_history','view_procurement','view_advance_details','view_finance','edit_finance','approve_payments','view_payment_receipts','escalate_orders'], isActive: true },
  { name: 'Sunita Verma', email: 'sunita@company.com', department: 'stores', password: 'store123', permissions: ['view_dashboard','view_assigned_orders','view_order_overview','view_project_name','view_customer_name','view_boq','view_order_history','view_stores','edit_stores','escalate_orders'], isActive: true },
  { name: 'Vikram Singh', email: 'vikram@company.com', department: 'dispatch', password: 'disp123', permissions: ['view_dashboard','view_assigned_orders','view_order_overview','view_project_name','view_customer_name','view_boq','view_order_history','view_dispatch','edit_dispatch','escalate_orders'], isActive: true },
  { name: 'Neha Gupta', email: 'neha@company.com', department: 'procurement', password: 'neha123', permissions: ['view_dashboard','view_assigned_orders','view_order_overview','view_boq','view_procurement','edit_procurement','view_vendor_name'], isActive: true },
  { name: 'Rahul Mehta', email: 'rahul@company.com', department: 'finance', password: 'rahul123', permissions: ['view_dashboard','view_assigned_orders','view_order_overview','view_project_name','view_customer_name','view_order_value','view_finance','view_payment_receipts'], isActive: true },
];

const SAMPLE_ORDERS = [
  {
    id: 'ORD-2024-001',
    projectName: 'Mumbai Office Renovation',
    customerDetails: { name: 'Tata Consultancy', type: 'Private', billingAddress: 'Plot No. 1, TCS Road, Sahar, Mumbai - 400099', shippingAddress: 'Plot No. 1, TCS Road, Sahar, Mumbai - 400099', contactPerson: 'John Doe', contactNumber: '9876543210', email: 'john@tata.com', gstNumber: '27AAAAA0000A1Z5' },
    orderDetails: { orderNumber: 'PO-TCS-2024-88', orderDate: '2024-01-15', quotationNumber: 'QTN/TV/2023/452', quotationDate: '2023-12-15' },
    epbgDetails: { required: 'No', attachmentDraft: null },
    commercialTerms: { paymentTerm: 'Net 30', warrantyTerm: '1 Year', others: 'Installation included' },
    createdDate: '2024-01-15',
    createdBy: 'Management',
    currentStage: 'procurement',
    totalValue: 2500000,
    items: [
      { id: 1, name: 'Office Chairs - Executive', itemCode: 'CH-EXEC', make: 'Godrej', model: 'Zenith', quantity: 50, unit: 'Nos', rate: 8500, amount: 425000, gstPercent: 18, totalAmount: 501500 },
      { id: 2, name: 'Workstation Tables', itemCode: 'WS-STD', make: 'Godrej', model: 'Focus', quantity: 100, unit: 'Nos', rate: 12000, amount: 1200000, gstPercent: 18, totalAmount: 1416000 },
      { id: 3, name: 'Conference Table - 20 Seater', itemCode: 'CT-20', make: 'Interio', model: 'Grand', quantity: 2, unit: 'Nos', rate: 85000, amount: 170000, gstPercent: 18, totalAmount: 200600 },
      { id: 4, name: 'Filing Cabinets', itemCode: 'FC-MTL', make: 'Godrej', model: 'Safe', quantity: 30, unit: 'Nos', rate: 6500, amount: 195000, gstPercent: 18, totalAmount: 230100 },
      { id: 5, name: 'Partition Panels', itemCode: 'PP-ALU', make: 'Modular', model: 'X-70', quantity: 200, unit: 'Sqft', rate: 2550, amount: 510000, gstPercent: 18, totalAmount: 601800 }
    ],
    summary: { subTotal: 2500000, gstAmount: 450000, grandTotal: 2950000 },
    procurement: {
      boqPurchases: [
        {
          boqItemId: 1,
          vendorDetails: { name: 'Godrej Interio', code: 'V-GDJ-01', contactPerson: 'John Smith', contactNumber: '9988776655', email: 'john@godrej.com', address: 'Mumbai Factory Outlet', gstNumber: '27AAAAA0000A1Z5' },
          quotationDetails: { quotationNumber: 'QTN-GDJ-455', quotationDate: '2024-01-22', rfqNumber: 'RFQ-TV-201', rfqDate: '2024-01-18' },
          poDetails: { poNumber: 'PO-2024-101', poDate: '2024-01-25', poValue: '425000', poStatus: 'Issued to Vendor' },
          paymentAndDelivery: { paymentType: 'Net 30', creditDays: '30', deliveryMethod: 'Truck', expectedDeliveryDate: '2024-02-28' }
        },
        {
          boqItemId: 2,
          vendorDetails: { name: 'Godrej Interio', code: 'V-GDJ-01', contactPerson: 'John Smith', contactNumber: '9988776655', email: 'john@godrej.com', address: 'Mumbai Factory Outlet', gstNumber: '27AAAAA0000A1Z5' },
          quotationDetails: { quotationNumber: 'QTN-GDJ-456', quotationDate: '2024-01-22', rfqNumber: 'RFQ-TV-201', rfqDate: '2024-01-18' },
          poDetails: { poNumber: 'PO-2024-102', poDate: '2024-01-25', poValue: '1200000', poStatus: 'Issued to Vendor' },
          paymentAndDelivery: { paymentType: 'Net 30', creditDays: '30', deliveryMethod: 'Truck', expectedDeliveryDate: '2024-03-05' }
        }
      ]
    },
    finance: null,
    history: [
      { date: '2024-01-15', action: 'Order Created', by: 'Management', department: 'Management' },
      { date: '2024-01-16', action: 'Escalated to Procurement', by: 'System', department: 'System' },
      { date: '2024-01-18', action: 'RFQ Sent to Vendor', by: 'Procurement', department: 'Procurement' }
    ]
  },
  {
    id: 'ORD-2024-002',
    projectName: 'Pune Campus Setup',
    customerDetails: { name: 'Infosys Limited', type: 'Private', billingAddress: 'Hinjewadi Phase 2, Pune - 411057', shippingAddress: 'Hinjewadi Phase 2, Pune - 411057', contactPerson: 'Sarah Chen', contactNumber: '9123456789', email: 'sarah.c@infosys.com', gstNumber: '27BBBBB1111B2Z6' },
    orderDetails: { orderNumber: 'INF/PNE/24/09', orderDate: '2024-01-20', quotationNumber: 'QTN/TV/2023/510', quotationDate: '2023-12-28' },
    epbgDetails: { required: 'Yes', attachmentDraft: null },
    commercialTerms: { paymentTerm: 'Advance', warrantyTerm: '3 Years', others: 'Extended support included' },
    createdDate: '2024-01-20',
    createdBy: 'Management',
    currentStage: 'finance',
    totalValue: 4800000,
    items: [
      { id: 1, name: 'Server Racks', itemCode: 'SRV-RK', make: 'APC', model: 'Netshelter', quantity: 10, unit: 'Nos', rate: 125000, amount: 1250000, gstPercent: 18, totalAmount: 1475000 },
      { id: 2, name: 'UPS Systems - 10KVA', itemCode: 'UPS-10K', make: 'Eaton', model: '9PX', quantity: 5, unit: 'Nos', rate: 180000, amount: 900000, gstPercent: 18, totalAmount: 1062000 },
      { id: 3, name: 'Network Switches', itemCode: 'SW-48P', make: 'Cisco', model: 'Catalyst', quantity: 20, unit: 'Nos', rate: 45000, amount: 900000, gstPercent: 18, totalAmount: 1062000 },
      { id: 4, name: 'Raised Flooring', itemCode: 'RF-CMP', make: 'Tate', model: 'Concore', quantity: 5000, unit: 'Sqft', rate: 350, amount: 1750000, gstPercent: 18, totalAmount: 2065000 }
    ],
    summary: { subTotal: 4800000, gstAmount: 864000, grandTotal: 5664000 },
    procurement: {
      boqPurchases: [
        {
          boqItemId: 1,
          vendorDetails: { name: 'Schneider Electric', code: 'V-SCH-01', contactPerson: 'Sarah Evans', contactNumber: '9922334455', email: 'sarah@schneider.com', address: 'Electronic City, Bangalore', gstNumber: '29BBBBB1111B1Z2' },
          quotationDetails: { quotationNumber: 'QTN-SCH-882', quotationDate: '2024-01-24', rfqNumber: 'RFQ-TV-305', rfqDate: '2024-01-21' },
          poDetails: { poNumber: 'PO-2024-205', poDate: '2024-01-26', poValue: '1250000', poStatus: 'Approved' },
          paymentAndDelivery: { paymentType: 'Advance', creditDays: '0', deliveryMethod: 'Courier', expectedDeliveryDate: '2024-03-15' }
        },
        {
          boqItemId: 2,
          vendorDetails: { name: 'Eaton Power', code: 'V-EAT-22', contactPerson: 'Mike Ross', contactNumber: '9911223344', email: 'mike@eaton.com', address: 'Pune Industrial Area', gstNumber: '27CCCCC2222C1Z3' },
          quotationDetails: { quotationNumber: 'QTN-EAT-112', quotationDate: '2024-01-24', rfqNumber: 'RFQ-TV-305', rfqDate: '2024-01-21' },
          poDetails: { poNumber: 'PO-2024-206', poDate: '2024-01-26', poValue: '900000', poStatus: 'Approved' },
          paymentAndDelivery: { paymentType: 'Net 45', creditDays: '45', deliveryMethod: 'Truck', expectedDeliveryDate: '2024-03-20' }
        }
      ]
    },
    finance: {
      advanceApproved: true,
      advanceApprovalDate: '2024-01-28',
      advancePaymentRef: 'PAY-2024-0128',
      receiptUploaded: true,
      receiptUrl: '/receipts/pay-2024-0128.pdf',
      totalPaymentApproved: false,
      remarks: 'Advance payment processed successfully'
    },
    history: [
      { date: '2024-01-20', action: 'Order Created', by: 'Management', department: 'Management' },
      { date: '2024-01-21', action: 'Escalated to Procurement', by: 'System', department: 'System' },
      { date: '2024-01-26', action: 'PO Generated & Sent', by: 'Procurement', department: 'Procurement' },
      { date: '2024-01-27', action: 'Escalated to Finance', by: 'System', department: 'System' },
      { date: '2024-01-28', action: 'Advance Payment Approved', by: 'Finance', department: 'Finance' }
    ]
  }
];

async function seed() {
  console.log('🌱 Starting database seed...');

  // Create tables first
  await createTables();

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Clear existing data in order
    await client.query('DELETE FROM order_history');
    await client.query('DELETE FROM procurement_purchases');
    await client.query('DELETE FROM order_finance');
    await client.query('DELETE FROM order_stores');
    await client.query('DELETE FROM order_dispatch');
    await client.query('DELETE FROM order_items');
    await client.query('DELETE FROM orders');
    await client.query('DELETE FROM users');

    // Reset user ID sequence
    await client.query('ALTER SEQUENCE users_id_seq RESTART WITH 1');

    // Seed users
    for (const user of SAMPLE_USERS) {
      await client.query(
        `INSERT INTO users (name, email, department, password, permissions, is_active)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [user.name, user.email, user.department, user.password, user.permissions, user.isActive]
      );
    }
    console.log(`✅ Seeded ${SAMPLE_USERS.length} users`);

    // Seed orders
    for (const order of SAMPLE_ORDERS) {
      // Insert main order
      await client.query(
        `INSERT INTO orders (id, project_name, customer_name, customer_type, billing_address, shipping_address,
          contact_person, contact_number, customer_email, gst_number,
          order_number, order_date, quotation_number, quotation_date,
          epbg_required, epbg_attachment_draft,
          payment_term, warranty_term, commercial_others,
          total_value, sub_total, gst_amount, grand_total,
          created_date, created_by, current_stage, is_deleted)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26,$27)`,
        [
          order.id, order.projectName,
          order.customerDetails.name, order.customerDetails.type,
          order.customerDetails.billingAddress, order.customerDetails.shippingAddress,
          order.customerDetails.contactPerson, order.customerDetails.contactNumber,
          order.customerDetails.email, order.customerDetails.gstNumber,
          order.orderDetails.orderNumber, order.orderDetails.orderDate,
          order.orderDetails.quotationNumber, order.orderDetails.quotationDate,
          order.epbgDetails.required, order.epbgDetails.attachmentDraft,
          order.commercialTerms.paymentTerm, order.commercialTerms.warrantyTerm,
          order.commercialTerms.others,
          order.totalValue, order.summary.subTotal, order.summary.gstAmount, order.summary.grandTotal,
          order.createdDate, order.createdBy, order.currentStage, false
        ]
      );

      // Insert order items
      for (const item of order.items) {
        await client.query(
          `INSERT INTO order_items (order_id, item_index, name, item_code, make, model, quantity, unit, rate, amount, gst_percent, total_amount)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)`,
          [order.id, item.id, item.name, item.itemCode, item.make, item.model, item.quantity, item.unit, item.rate, item.amount, item.gstPercent, item.totalAmount]
        );
      }

      // Insert procurement purchases
      if (order.procurement?.boqPurchases) {
        for (const purchase of order.procurement.boqPurchases) {
          await client.query(
            `INSERT INTO procurement_purchases (order_id, boq_item_id,
              vendor_name, vendor_code, vendor_contact_person, vendor_contact_number, vendor_email, vendor_address, vendor_gst_number,
              quotation_number, quotation_date, rfq_number, rfq_date,
              po_number, po_date, po_value, po_status,
              payment_type, credit_days, delivery_method, expected_delivery_date,
              vendor_account_holder_name, vendor_bank_name, vendor_account_number, vendor_account_type, vendor_ifsc_code)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26)`,
            [
              order.id, purchase.boqItemId,
              purchase.vendorDetails.name, purchase.vendorDetails.code,
              purchase.vendorDetails.contactPerson, purchase.vendorDetails.contactNumber,
              purchase.vendorDetails.email, purchase.vendorDetails.address, purchase.vendorDetails.gstNumber,
              purchase.quotationDetails.quotationNumber, purchase.quotationDetails.quotationDate,
              purchase.quotationDetails.rfqNumber, purchase.quotationDetails.rfqDate,
              purchase.poDetails.poNumber, purchase.poDetails.poDate,
              purchase.poDetails.poValue, purchase.poDetails.poStatus,
              purchase.paymentAndDelivery.paymentType, purchase.paymentAndDelivery.creditDays,
              purchase.paymentAndDelivery.deliveryMethod, purchase.paymentAndDelivery.expectedDeliveryDate,
              purchase.vendorDetails.accountHolderName || 'Sample Holder',
              purchase.vendorDetails.bankName || 'Sample Bank',
              purchase.vendorDetails.accountNumber || '1234567890',
              purchase.vendorDetails.accountType || 'Current',
              purchase.vendorDetails.ifscCode || 'IFSC0001234'
            ]
          );
        }
      }

      // Insert finance (item-wise)
      if (order.finance && Array.isArray(order.finance)) {
        for (const f of order.finance) {
          await client.query(
            `INSERT INTO order_finance (order_id, boq_item_id, advance_approved, advance_approval_date, advance_payment_ref, receipt_uploaded, receipt_url, total_payment_approved, remarks)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
            [order.id, f.boqItemId, f.advanceApproved, f.advanceApprovalDate, f.advancePaymentRef, f.receiptUploaded, f.receiptUrl, f.totalPaymentApproved, f.remarks]
          );
        }
      } else if (order.finance) {
        // Fallback for single finance object (legacy sample migration)
        await client.query(
          `INSERT INTO order_finance (order_id, boq_item_id, advance_approved, advance_approval_date, advance_payment_ref, receipt_uploaded, receipt_url, total_payment_approved, remarks)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
          [order.id, (order.items && order.items[0]?.id) || 1, order.finance.advanceApproved, order.finance.advanceApprovalDate, order.finance.advancePaymentRef, order.finance.receiptUploaded, order.finance.receiptUrl, order.finance.totalPaymentApproved, order.finance.remarks]
        );
      }

      // Insert history
      for (const entry of order.history) {
        await client.query(
          `INSERT INTO order_history (order_id, date, action, performed_by, department)
           VALUES ($1,$2,$3,$4,$5)`,
          [order.id, entry.date, entry.action, entry.by, entry.department]
        );
      }
    }
    console.log(`✅ Seeded ${SAMPLE_ORDERS.length} orders with items, procurement, finance, and history`);

    await client.query('COMMIT');
    console.log('🎉 Database seed completed successfully!');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Seed error:', err);
    throw err;
  } finally {
    client.release();
    await pool.end();
  }
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
