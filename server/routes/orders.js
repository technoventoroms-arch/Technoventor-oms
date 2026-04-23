import { Router } from 'express';
import pool from '../db.js';
import { sendNewOrderEmail } from '../mail.js';
import { createTables } from '../schema.js';
import { emitUpdate } from '../utils/events.js';

const router = Router();

// Endpoint to trigger schema migration
router.get('/run-migration', async (req, res) => {
  try {
    await createTables();
    res.json({ success: true, message: 'Migrations completed successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Migration failed', details: error.message });
  }
});

// Helper: convert empty strings to null (PostgreSQL rejects '' for DATE columns)
const nullIfEmpty = (val) => (val === '' || val === undefined ? null : val);

// Helper: assemble full order object from DB rows
async function assembleOrder(orderId) {
  try {
    const orderResult = await pool.query('SELECT * FROM orders WHERE id = $1', [orderId]);
    if (orderResult.rows.length === 0) return null;

    const order = orderResult.rows[0];
    const items = await pool.query('SELECT * FROM order_items WHERE order_id = $1 ORDER BY item_index', [orderId]);
    const purchases = await pool.query('SELECT * FROM procurement_purchases WHERE order_id = $1 ORDER BY boq_item_id', [orderId]);
    const finance = await pool.query('SELECT * FROM order_finance WHERE order_id = $1', [orderId]);
    const stores = await pool.query('SELECT * FROM order_stores WHERE order_id = $1', [orderId]);
    const dispatch = await pool.query('SELECT * FROM order_dispatch WHERE order_id = $1', [orderId]);
    const invoices = await pool.query('SELECT * FROM order_invoices WHERE order_id = $1', [orderId]);
    const deliveries = await pool.query('SELECT * FROM order_deliveries WHERE order_id = $1', [orderId]);
    const installations = await pool.query('SELECT * FROM order_installations WHERE order_id = $1', [orderId]);
    const history = await pool.query('SELECT * FROM order_history WHERE order_id = $1 ORDER BY date, id', [orderId]);

    return mapOrderToFrontend(
      order, 
      items.rows || [], 
      purchases.rows || [], 
      finance.rows || [], 
      stores.rows?.[0] || null, 
      dispatch.rows?.[0] || null, 
      invoices.rows?.[0] || null,
      deliveries.rows?.[0] || null,
      installations.rows?.[0] || null,
      history.rows || []
    );
  } catch (err) {
    console.error(`Error assembling order ${orderId}:`, err);
    return null;
  }
}

function mapOrderToFrontend(order, items = [], purchases = [], finance = [], stores = null, dispatch = null, invoice = null, delivery = null, installation = null, history = []) {
  if (!order) return null;

  return {
    id: order.id,
    projectName: order.project_name,
    customerDetails: {
      name: order.customer_name,
      type: order.customer_type,
      billingAddress: order.billing_address,
      shippingAddress: order.shipping_address,
      contactPerson: order.contact_person,
      contactNumber: order.contact_number,
      email: order.customer_email,
      gstNumber: order.gst_number
    },
    orderDetails: {
      orderNumber: order.order_number,
      orderDate: order.order_date,
      quotationNumber: order.quotation_number,
      quotationDate: order.quotation_date,
      expectedDeliveryDate: order.expected_delivery_date,
      dispatchDate: order.dispatch_date
    },
    epbgDetails: {
      required: order.epbg_required || 'No',
      attachmentDraft: order.epbg_attachment_draft
    },
    commercialTerms: {
      paymentTerm: order.payment_term,
      warrantyTerm: order.warranty_term,
      others: order.commercial_others
    },
    createdDate: order.created_date,
    createdBy: order.created_by,
    currentStage: order.current_stage || 'new',
    totalValue: parseFloat(order.total_value) || 0,
    items: Array.isArray(items) ? items.map(item => ({
      id: item.item_index,
      name: item.name,
      itemCode: item.item_code,
      make: item.make,
      model: item.model,
      quantity: parseFloat(item.quantity) || 0,
      unit: item.unit || 'Nos',
      rate: parseFloat(item.rate) || 0,
      amount: parseFloat(item.amount) || 0,
      gstPercent: parseFloat(item.gst_percent) || 0,
      totalAmount: parseFloat(item.total_amount) || 0,
      parentItemIndex: item.parent_item_index || null,
      description: item.description || '',
      shortQty: parseFloat(item.short_qty) || 0,
      itemType: item.item_type || 'goods'
    })) : [],
    summary: {
      subTotal: parseFloat(order.sub_total) || 0,
      gstAmount: parseFloat(order.gst_amount) || 0,
      grandTotal: parseFloat(order.grand_total) || 0
    },
    procurement: {
      boqPurchases: Array.isArray(purchases) ? purchases.map(p => ({
        boqItemId: p.boq_item_id,
        vendorDetails: {
          name: p.vendor_name,
          code: p.vendor_code,
          contactPerson: p.vendor_contact_person,
          contactNumber: p.vendor_contact_number,
          email: p.vendor_email,
          address: p.vendor_address,
          gstNumber: p.vendor_gst_number,
          accountHolderName: p.vendor_account_holder_name,
          bankName: p.vendor_bank_name,
          accountNumber: p.vendor_account_number,
          accountType: p.vendor_account_type,
          ifscCode: p.vendor_ifsc_code
        },
        quotationDetails: {
          quotationNumber: p.quotation_number,
          quotationDate: p.quotation_date,
          rfqNumber: p.rfq_number,
          rfqDate: p.rfq_date
        },
        poDetails: {
          poNumber: p.po_number,
          poDate: p.po_date,
          poValue: p.po_value,
          poStatus: p.po_status
        },
        paymentAndDelivery: {
          paymentType: p.payment_type,
          creditDays: p.credit_days,
          paymentNotes: p.payment_notes,
          deliveryMethod: p.delivery_method,
          expectedDeliveryDate: p.expected_delivery_date
        }
      })) : []
    },
    finance: Array.isArray(finance) ? finance.map(f => ({
      boqItemId: f.boq_item_id,
      poNumber: f.po_number,
      advanceApproved: !!f.advance_approved,
      advanceApprovalDate: f.advance_approval_date,
      advancePaymentRef: f.advance_payment_ref,
      receiptUploaded: !!f.receipt_uploaded,
      receiptUrl: f.receipt_url,
      totalPaymentApproved: !!f.total_payment_approved,
      remarks: f.remarks,
      paymentStatus: f.payment_status || 'Pending'
    })) : [],
    stores: stores ? {
      grnNumber: stores.grn_number,
      grnDate: stores.grn_date,
      receivedQuantity: stores.received_quantity ? parseFloat(stores.received_quantity) : null,
      conditionStatus: stores.condition_status,
      inspectionDone: !!stores.inspection_done,
      inspectionNotes: stores.inspection_notes,
      storageLocation: stores.storage_location,
      receivedBy: stores.received_by,
      remarks: stores.remarks,
      boqInwards: Array.isArray(stores.boq_inwards) ? stores.boq_inwards : []
    } : null,
    dispatch: dispatch ? {
      dispatchNumber: dispatch.dispatch_number,
      dispatchDate: dispatch.dispatch_date,
      transporterName: dispatch.transporter_name,
      vehicleNumber: dispatch.vehicle_number,
      docketNumber: dispatch.lr_number,
      lrDate: dispatch.lr_date,
      numberOfBoxes: dispatch.number_of_boxes,
      weight: dispatch.weight,
      deliveryStatus: dispatch.delivery_status,
      deliveredDate: dispatch.delivered_date,
      podUploaded: !!dispatch.pod_uploaded,
      podUrl: dispatch.pod_url,
      dispatchedBy: dispatch.dispatched_by,
      remarks: dispatch.remarks,
      deliveryType: dispatch.delivery_type,
      packingType: dispatch.packing_type,
      deliveryLocation: dispatch.delivery_location,
      ewayBillAvailable: dispatch.eway_bill_available || 'No',
      transitInsurance: dispatch.transit_insurance || 'No',
      boqDispatch: Array.isArray(dispatch.boq_dispatch) ? dispatch.boq_dispatch : []
    } : null,
    invoice: invoice ? {
      invoiceNumber: invoice.invoice_number,
      invoiceDate: invoice.invoice_date,
      invoiceAttachment: invoice.invoice_attachment,
      ewayBillAttachment: invoice.eway_bill_attachment,
      remarks: invoice.remarks
    } : null,
    delivery: delivery ? {
      handoverTo: delivery.handover_to,
      deliveryDate: delivery.delivery_date,
      proofOfDelivery: delivery.proof_of_delivery,
      remarks: delivery.remarks
    } : null,
    installation: installation ? {
      installedBy: installation.installed_by,
      siteContact: installation.site_contact,
      date: installation.installation_date,
      remarks: installation.remarks
    } : null,
    history: Array.isArray(history) ? history.map(h => ({
      date: h.date,
      action: h.action,
      by: h.performed_by,
      department: h.department
    })) : [],
    planning: order.planning || null,
  };
}

// GET /api/orders
router.get('/', async (req, res) => {
  try {
    const ordersResult = await pool.query('SELECT * FROM orders WHERE is_deleted = false ORDER BY created_at DESC');
    if (ordersResult.rows.length === 0) return res.json([]);

    const orderIds = ordersResult.rows.map(o => o.id);

    // Bulk fetch all related data in parallel
    const [
      itemsResult,
      purchasesResult,
      financeResult,
      storesResult,
      dispatchResult,
      invoicesResult,
      deliveriesResult,
      installationsResult,
      historyResult
    ] = await Promise.all([
      pool.query('SELECT * FROM order_items WHERE order_id = ANY($1) ORDER BY item_index', [orderIds]),
      pool.query('SELECT * FROM procurement_purchases WHERE order_id = ANY($1) ORDER BY boq_item_id', [orderIds]),
      pool.query('SELECT * FROM order_finance WHERE order_id = ANY($1)', [orderIds]),
      pool.query('SELECT * FROM order_stores WHERE order_id = ANY($1)', [orderIds]),
      pool.query('SELECT * FROM order_dispatch WHERE order_id = ANY($1)', [orderIds]),
      pool.query('SELECT * FROM order_invoices WHERE order_id = ANY($1)', [orderIds]),
      pool.query('SELECT * FROM order_deliveries WHERE order_id = ANY($1)', [orderIds]),
      pool.query('SELECT * FROM order_installations WHERE order_id = ANY($1)', [orderIds]),
      pool.query('SELECT * FROM order_history WHERE order_id = ANY($1) ORDER BY date, id', [orderIds])
    ]);

    // Create maps for efficient lookup
    const itemsMap = {};
    const purchasesMap = {};
    const financeMap = {};
    const storesMap = {};
    const dispatchMap = {};
    const invoicesMap = {};
    const deliveriesMap = {};
    const installationsMap = {};
    const historyMap = {};

    itemsResult.rows.forEach(row => {
      if (!itemsMap[row.order_id]) itemsMap[row.order_id] = [];
      itemsMap[row.order_id].push(row);
    });

    purchasesResult.rows.forEach(row => {
      if (!purchasesMap[row.order_id]) purchasesMap[row.order_id] = [];
      purchasesMap[row.order_id].push(row);
    });

    financeResult.rows.forEach(row => {
      if (!financeMap[row.order_id]) financeMap[row.order_id] = [];
      financeMap[row.order_id].push(row);
    });

    storesResult.rows.forEach(row => {
      storesMap[row.order_id] = row;
    });

    dispatchResult.rows.forEach(row => {
      dispatchMap[row.order_id] = row;
    });

    invoicesResult.rows.forEach(row => {
      invoicesMap[row.order_id] = row;
    });

    deliveriesResult.rows.forEach(row => {
      deliveriesMap[row.order_id] = row;
    });

    installationsResult.rows.forEach(row => {
      installationsMap[row.order_id] = row;
    });

    historyResult.rows.forEach(row => {
      if (!historyMap[row.order_id]) historyMap[row.order_id] = [];
      historyMap[row.order_id].push(row);
    });

    // Assemble orders
    const orders = ordersResult.rows.map(order => 
      mapOrderToFrontend(
        order,
        itemsMap[order.id] || [],
        purchasesMap[order.id] || [],
        financeMap[order.id] || [],
        storesMap[order.id] || null,
        dispatchMap[order.id] || null,
        invoicesMap[order.id] || null,
        deliveriesMap[order.id] || null,
        installationsMap[order.id] || null,
        historyMap[order.id] || []
      )
    );

    res.json(orders);
  } catch (err) {
    console.error('Error fetching orders:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/orders/:id
router.get('/:id', async (req, res) => {
  try {
    const order = await assembleOrder(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  } catch (err) {
    console.error('Error fetching order:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/orders
router.post('/', async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const o = req.body;

    // Generate unique ID on server side 
    // This fixes the 'duplicate key value violates unique constraint' error when orders are deleted
    let newId = (req.body.id && typeof req.body.id === 'string' && req.body.id.trim() !== '') ? req.body.id.trim() : null;
    
    if (!newId) {
      const countResult = await client.query('SELECT COUNT(*) FROM orders');
      const totalOrders = parseInt(countResult.rows[0].count);
      newId = `ORD-${new Date().getFullYear()}-${String(totalOrders + 1).padStart(3, '0')}`;
    }

    await client.query(
      `INSERT INTO orders (id, project_name, customer_name, customer_type, billing_address, shipping_address,
        contact_person, contact_number, customer_email, gst_number,
        order_number, order_date, quotation_number, quotation_date, expected_delivery_date, dispatch_date,
        epbg_required, epbg_attachment_draft, payment_term, warranty_term, commercial_others,
        total_value, sub_total, gst_amount, grand_total,
        created_date, created_by, current_stage, is_deleted)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26,$27,$28,$29)`,
      [
        newId, o.projectName,
        o.customerDetails?.name, o.customerDetails?.type,
        JSON.stringify(o.customerDetails?.billingAddress || {}), JSON.stringify(o.customerDetails?.shippingAddress || {}),
        o.customerDetails?.contactPerson, o.customerDetails?.contactNumber,
        o.customerDetails?.email, o.customerDetails?.gstNumber,
        o.orderDetails?.orderNumber, o.orderDetails?.orderDate || null,
        o.orderDetails?.quotationNumber, o.orderDetails?.quotationDate || null,
        o.orderDetails?.expectedDeliveryDate || null, o.orderDetails?.dispatchDate || null,
        o.epbgDetails?.required, o.epbgDetails?.attachmentDraft,
        o.commercialTerms?.paymentTerm, o.commercialTerms?.warrantyTerm,
        o.commercialTerms?.others,
        o.totalValue || 0, o.summary?.subTotal || 0, o.summary?.gstAmount || 0, o.summary?.grandTotal || 0,
        o.createdDate || null, o.createdBy, o.currentStage || 'new', false
      ]
    );

    // Use newId for subsequent queries
    const orderId = newId;
    o.id = newId; // Update o.id so items and history use the correct ID

    // Insert items
    if (o.items?.length) {
      for (const item of o.items) {
        await client.query(
          `INSERT INTO order_items (order_id, item_index, name, item_code, make, model, quantity, unit, rate, amount, gst_percent, total_amount, parent_item_index, description, short_qty, item_type)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16)`,
          [o.id, item.id, item.name, item.itemCode, item.make, item.model, item.quantity, item.unit, item.rate, item.amount, item.gstPercent, item.totalAmount, item.parentItemIndex || null, item.description || '', item.shortQty || 0, item.itemType || 'goods']
        );
      }
    }

    // Insert history
    if (o.history?.length) {
      for (const h of o.history) {
        await client.query(
          `INSERT INTO order_history (order_id, date, action, performed_by, department) VALUES ($1,$2,$3,$4,$5)`,
          [o.id, h.date, h.action, h.by, h.department]
        );
      }
    }

    await client.query('COMMIT');
    const created = await assembleOrder(o.id);

    // Send email notifications to all active users
    try {
      const userEmailsResult = await pool.query('SELECT email FROM users WHERE is_active = true');
      const userEmails = userEmailsResult.rows.map(row => row.email).filter(Boolean);
      
      if (userEmails.length > 0) {
        console.log(`Sending new order notification to ${userEmails.length} users...`);
        // We can send to all users in one go
        await sendNewOrderEmail(created, userEmails);
      }
    } catch (emailErr) {
      // Don't fail the order creation if email sending fails, just log it
      console.error('Error in sendNewOrderEmail:', emailErr);
    }

    emitUpdate('orders_updated');
    res.status(201).json(created);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error creating order:', err);
    res.status(500).json({ error: 'Server error' });
  } finally {
    client.release();
  }
});

// PUT /api/orders/:id
router.put('/:id', async (req, res) => {
  const client = await pool.connect();
  try {
    // Check permission
    if (req.user.department !== 'admin' && !(req.user.permissions || []).includes('edit_orders')) {
      return res.status(403).json({ error: 'Unauthorized: Admin access or edit_orders permission required' });
    }
    await client.query('BEGIN');
    const o = req.body;
    const orderId = req.params.id;

    // Update main order fields if provided
    const updateFields = [];
    const updateValues = [];
    let paramIndex = 1;

    const fieldMap = {
      projectName: 'project_name',
      currentStage: 'current_stage',
      totalValue: 'total_value',
      createdBy: 'created_by',
      createdDate: 'created_date'
    };

    let newOrderId = orderId;
    const providedId = o.id ? String(o.id).trim() : '';
    if (providedId && providedId !== orderId) {
      updateFields.push(`id = $${paramIndex}`);
      updateValues.push(providedId);
      paramIndex++;
      newOrderId = providedId;
    }

    for (const [jsKey, dbKey] of Object.entries(fieldMap)) {
      if (o[jsKey] !== undefined) {
        updateFields.push(`${dbKey} = $${paramIndex}`);
        updateValues.push(o[jsKey]);
        paramIndex++;
      }
    }

    // Customer details
    if (o.customerDetails) {
      const cd = o.customerDetails;
      const customerMap = {
        name: 'customer_name', type: 'customer_type',
        billingAddress: 'billing_address', shippingAddress: 'shipping_address',
        contactPerson: 'contact_person', contactNumber: 'contact_number',
        email: 'customer_email', gstNumber: 'gst_number'
      };
      for (const [jsKey, dbKey] of Object.entries(customerMap)) {
        if (cd[jsKey] !== undefined) {
          updateFields.push(`${dbKey} = $${paramIndex}`);
          const val = (jsKey === 'billingAddress' || jsKey === 'shippingAddress') ? JSON.stringify(cd[jsKey]) : cd[jsKey];
          updateValues.push(val);
          paramIndex++;
        }
      }
    }

    // Order details
    if (o.orderDetails) {
      const od = o.orderDetails;
      const orderMap = {
        orderNumber: 'order_number', orderDate: 'order_date',
        quotationNumber: 'quotation_number', quotationDate: 'quotation_date',
        expectedDeliveryDate: 'expected_delivery_date', dispatchDate: 'dispatch_date'
      };
      for (const [jsKey, dbKey] of Object.entries(orderMap)) {
        if (od[jsKey] !== undefined) {
          updateFields.push(`${dbKey} = $${paramIndex}`);
          let val = od[jsKey];
          if (['orderDate', 'quotationDate', 'expectedDeliveryDate', 'dispatchDate'].includes(jsKey) && val === '') {
            val = null;
          }
          updateValues.push(val);
          paramIndex++;
        }
      }
    }

    // EPBG
    if (o.epbgDetails) {
      if (o.epbgDetails.required !== undefined) {
        updateFields.push(`epbg_required = $${paramIndex}`);
        updateValues.push(o.epbgDetails.required);
        paramIndex++;
      }
    }

    // Commercial terms
    if (o.commercialTerms) {
      const ct = o.commercialTerms;
      if (ct.paymentTerm !== undefined) { updateFields.push(`payment_term = $${paramIndex}`); updateValues.push(ct.paymentTerm); paramIndex++; }
      if (ct.warrantyTerm !== undefined) { updateFields.push(`warranty_term = $${paramIndex}`); updateValues.push(ct.warrantyTerm); paramIndex++; }
      if (ct.others !== undefined) { updateFields.push(`commercial_others = $${paramIndex}`); updateValues.push(ct.others); paramIndex++; }
    }

    // Summary
    if (o.summary) {
      if (o.summary.subTotal !== undefined) { updateFields.push(`sub_total = $${paramIndex}`); updateValues.push(o.summary.subTotal); paramIndex++; }
      if (o.summary.gstAmount !== undefined) { updateFields.push(`gst_amount = $${paramIndex}`); updateValues.push(o.summary.gstAmount); paramIndex++; }
      if (o.summary.grandTotal !== undefined) { updateFields.push(`grand_total = $${paramIndex}`); updateValues.push(o.summary.grandTotal); paramIndex++; }
    }

    // Planning data
    if (o.planning !== undefined) {
      updateFields.push(`planning = $${paramIndex}`);
      updateValues.push(JSON.stringify(o.planning));
      paramIndex++;
    }

    if (updateFields.length > 0) {
      updateFields.push(`updated_at = NOW()`);
      updateValues.push(orderId);
      await client.query(
        `UPDATE orders SET ${updateFields.join(', ')} WHERE id = $${paramIndex}`,
        updateValues
      );
    }

    // Update items if provided
    if (o.items) {
      await client.query('DELETE FROM order_items WHERE order_id = $1', [newOrderId]);
      for (const item of o.items) {
        await client.query(
          `INSERT INTO order_items (order_id, item_index, name, item_code, make, model, quantity, unit, rate, amount, gst_percent, total_amount, parent_item_index, description, short_qty, item_type)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16)`,
          [newOrderId, item.id, item.name, item.itemCode, item.make, item.model, item.quantity, item.unit, item.rate, item.amount, item.gstPercent, item.totalAmount, item.parentItemIndex || null, item.description || '', item.shortQty || 0, item.itemType || 'goods']
        );
      }
    }

    // Update procurement purchases if provided
    if (o.procurement?.boqPurchases) {
      await client.query('DELETE FROM procurement_purchases WHERE order_id = $1', [newOrderId]);
      for (const p of o.procurement.boqPurchases) {
        await client.query(
          `INSERT INTO procurement_purchases (order_id, boq_item_id,
            vendor_name, vendor_code, vendor_contact_person, vendor_contact_number, vendor_email, vendor_address, vendor_gst_number,
            quotation_number, quotation_date, rfq_number, rfq_date,
            po_number, po_date, po_value, po_status,
            payment_type, credit_days, payment_notes, delivery_method, expected_delivery_date,
            vendor_account_holder_name, vendor_bank_name, vendor_account_number, vendor_account_type, vendor_ifsc_code)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26,$27)`,
          [
            newOrderId, p.boqItemId,
            p.vendorDetails?.name, p.vendorDetails?.code,
            p.vendorDetails?.contactPerson, p.vendorDetails?.contactNumber,
            p.vendorDetails?.email, p.vendorDetails?.address, p.vendorDetails?.gstNumber,
            p.quotationDetails?.quotationNumber, nullIfEmpty(p.quotationDetails?.quotationDate),
            p.quotationDetails?.rfqNumber, nullIfEmpty(p.quotationDetails?.rfqDate),
            p.poDetails?.poNumber, nullIfEmpty(p.poDetails?.poDate),
            p.poDetails?.poValue, p.poDetails?.poStatus,
            p.paymentAndDelivery?.paymentType, p.paymentAndDelivery?.creditDays,
            p.paymentAndDelivery?.paymentNotes, p.paymentAndDelivery?.deliveryMethod, nullIfEmpty(p.paymentAndDelivery?.expectedDeliveryDate),
            p.vendorDetails?.accountHolderName, p.vendorDetails?.bankName,
            p.vendorDetails?.accountNumber, p.vendorDetails?.accountType,
            p.vendorDetails?.ifscCode
          ]
        );
      }
    }

    // Update finance if provided (now item-wise)
    if (o.finance && Array.isArray(o.finance)) {
      await client.query('DELETE FROM order_finance WHERE order_id = $1', [newOrderId]);
      for (const f of o.finance) {
        if (f) {
          await client.query(
            `INSERT INTO order_finance (order_id, boq_item_id, po_number, advance_approved, advance_approval_date, advance_payment_ref, receipt_uploaded, receipt_url, total_payment_approved, remarks, payment_status)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)`,
            [newOrderId, f.boqItemId, f.poNumber, f.advanceApproved, nullIfEmpty(f.advanceApprovalDate), f.advancePaymentRef, f.receiptUploaded, f.receiptUrl, f.totalPaymentApproved, f.remarks, f.paymentStatus || 'Pending']
          );
        }
      }
    }

    // Update stores if provided
    if (o.stores !== undefined) {
      await client.query('DELETE FROM order_stores WHERE order_id = $1', [newOrderId]);
      if (o.stores) {
        await client.query(
          `INSERT INTO order_stores (order_id, grn_number, grn_date, received_quantity, condition_status, inspection_done, inspection_notes, storage_location, received_by, remarks, boq_inwards)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)`,
          [newOrderId, o.stores.grnNumber, nullIfEmpty(o.stores.grnDate), o.stores.receivedQuantity, o.stores.conditionStatus, o.stores.inspectionDone, o.stores.inspectionNotes, o.stores.storageLocation, o.stores.receivedBy, o.stores.remarks, JSON.stringify(o.stores.boqInwards || [])]
        );
      }
    }

    // Update dispatch if provided
    if (o.dispatch !== undefined) {
      await client.query('DELETE FROM order_dispatch WHERE order_id = $1', [newOrderId]);
      if (o.dispatch) {
        await client.query(
          `INSERT INTO order_dispatch (order_id, dispatch_number, dispatch_date, transporter_name, vehicle_number, lr_number, lr_date, number_of_boxes, weight, delivery_status, delivered_date, pod_uploaded, pod_url, dispatched_by, remarks, 
            delivery_type, packing_type, delivery_location, eway_bill_available, transit_insurance, boq_dispatch)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21)`,
          [
            newOrderId, o.dispatch.dispatchNumber, nullIfEmpty(o.dispatch.dispatchDate), o.dispatch.transporterName, o.dispatch.vehicleNumber, o.dispatch.docketNumber, nullIfEmpty(o.dispatch.lrDate), o.dispatch.numberOfBoxes, o.dispatch.weight, o.dispatch.deliveryStatus, nullIfEmpty(o.dispatch.delivered_date), o.dispatch.podUploaded, o.dispatch.podUrl, o.dispatch.dispatchedBy, o.dispatch.remarks,
            o.dispatch.deliveryType, o.dispatch.packingType, o.dispatch.deliveryLocation, o.dispatch.ewayBillAvailable, o.dispatch.transitInsurance, JSON.stringify(o.dispatch.boqDispatch || [])
          ]
        );
      }
    }

    // Update invoices if provided
    if (o.invoice !== undefined) {
      await client.query('DELETE FROM order_invoices WHERE order_id = $1', [newOrderId]);
      if (o.invoice) {
        await client.query(
          `INSERT INTO order_invoices (order_id, invoice_number, invoice_date, invoice_attachment, eway_bill_attachment, remarks)
           VALUES ($1,$2,$3,$4,$5,$6)`,
          [newOrderId, o.invoice.invoiceNumber, nullIfEmpty(o.invoice.invoiceDate), o.invoice.invoiceAttachment, o.invoice.ewayBillAttachment, o.invoice.remarks]
        );
      }
    }

    // Update deliveries if provided
    if (o.delivery !== undefined) {
      await client.query('DELETE FROM order_deliveries WHERE order_id = $1', [newOrderId]);
      if (o.delivery) {
        await client.query(
          `INSERT INTO order_deliveries (order_id, handover_to, delivery_date, proof_of_delivery, remarks)
           VALUES ($1,$2,$3,$4,$5)`,
          [newOrderId, o.delivery.handoverTo, nullIfEmpty(o.delivery.deliveryDate), o.delivery.proofOfDelivery, o.delivery.remarks]
        );
      }
    }
    // Update installations if provided
    if (o.installation !== undefined) {
      await client.query('DELETE FROM order_installations WHERE order_id = $1', [newOrderId]);
      if (o.installation) {
        await client.query(
          `INSERT INTO order_installations (order_id, installed_by, site_contact, installation_date, remarks)
           VALUES ($1,$2,$3,$4,$5)`,
          [newOrderId, o.installation.installedBy, o.installation.siteContact, nullIfEmpty(o.installation.date), o.installation.remarks]
        );
      }
    }

    // Append history if provided
    if (o.history) {
      // Check if we should replace or append
      // If the update includes a full history array, replace it
      await client.query('DELETE FROM order_history WHERE order_id = $1', [newOrderId]);
      for (const h of o.history) {
        await client.query(
          `INSERT INTO order_history (order_id, date, action, performed_by, department) VALUES ($1,$2,$3,$4,$5)`,
          [newOrderId, h.date, h.action, h.by, h.department]
        );
      }
    }

    await client.query('COMMIT');
    const updated = await assembleOrder(newOrderId);
    emitUpdate('orders_updated');
    res.json(updated);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error updating order:', err);
    res.status(500).json({ error: 'Server error' });
  } finally {
    client.release();
  }
});

// DELETE /api/orders/:id
router.delete('/:id', async (req, res) => {
  try {
    const userPermissions = req.user.permissions || [];
    const isDeleteAllowed = req.user.department === 'admin' || userPermissions.includes('delete_orders');

    if (!isDeleteAllowed) {
      return res.status(403).json({ error: 'Access denied: You do not have permission to delete orders.' });
    }

    const result = await pool.query('UPDATE orders SET is_deleted = true WHERE id = $1 RETURNING id', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }
    emitUpdate('orders_updated');
    res.json({ success: true, message: 'Order soft deleted successfully.' });
  } catch (err) {
    console.error('Error deleting order:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
