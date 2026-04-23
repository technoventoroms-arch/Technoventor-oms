import { DEPARTMENTS, PERMISSION_TEMPLATES, ORDER_STAGES } from '../constants';

export const SAMPLE_USERS = [
  { 
    id: 1, 
    name: 'Super Admin', 
    email: 'admin@company.com', 
    department: DEPARTMENTS.ADMIN,
    password: 'admin123',
    permissions: PERMISSION_TEMPLATES['Super Admin'],
    isActive: true
  },
  { 
    id: 2, 
    name: 'Rajesh Kumar', 
    email: 'rajesh@company.com', 
    department: DEPARTMENTS.MANAGEMENT,
    password: 'mgmt123',
    permissions: PERMISSION_TEMPLATES['Management'],
    isActive: true
  },
  { 
    id: 3, 
    name: 'Priya Sharma', 
    email: 'priya@company.com', 
    department: DEPARTMENTS.PROCUREMENT,
    password: 'proc123',
    permissions: PERMISSION_TEMPLATES['Procurement Team'],
    isActive: true
  },
  { 
    id: 4, 
    name: 'Amit Patel', 
    email: 'amit@company.com', 
    department: DEPARTMENTS.FINANCE,
    password: 'fin123',
    permissions: PERMISSION_TEMPLATES['Finance Team'],
    isActive: true
  },
  { 
    id: 5, 
    name: 'Sunita Verma', 
    email: 'sunita@company.com', 
    department: DEPARTMENTS.STORES,
    password: 'store123',
    permissions: PERMISSION_TEMPLATES['Stores Team'],
    isActive: true
  },
  { 
    id: 6, 
    name: 'Vikram Singh', 
    email: 'vikram@company.com', 
    department: DEPARTMENTS.DISPATCH,
    password: 'disp123',
    permissions: PERMISSION_TEMPLATES['Dispatch Team'],
    isActive: true
  },
  { 
    id: 7, 
    name: 'Neha Gupta', 
    email: 'neha@company.com', 
    department: DEPARTMENTS.PROCUREMENT,
    password: 'neha123',
    permissions: PERMISSION_TEMPLATES['Procurement (Limited)'],
    isActive: true
  },
  { 
    id: 8, 
    name: 'Rahul Mehta', 
    email: 'rahul@company.com', 
    department: DEPARTMENTS.FINANCE,
    password: 'rahul123',
    permissions: PERMISSION_TEMPLATES['Finance (View Only)'],
    isActive: true
  },
];

export const SAMPLE_ORDERS = [
  {
    id: 'ORD-2024-001',
    projectName: 'Mumbai Office Renovation',
    customerDetails: {
      name: 'Tata Consultancy',
      type: 'Private',
      billingAddress: 'Plot No. 1, TCS Road, Sahar, Mumbai - 400099',
      shippingAddress: 'Plot No. 1, TCS Road, Sahar, Mumbai - 400099',
      contactPerson: 'John Doe',
      contactNumber: '9876543210',
      email: 'john@tata.com',
      gstNumber: '27AAAAA0000A1Z5'
    },
    orderDetails: {
      orderNumber: 'PO-TCS-2024-88',
      orderDate: '2024-01-15',
      quotationNumber: 'QTN/TV/2023/452',
      quotationDate: '2023-12-15'
    },
    epbgDetails: {
      required: 'No',
      attachmentDraft: null
    },
    commercialTerms: {
      paymentTerm: 'Net 30',
      warrantyTerm: '1 Year',
      others: 'Installation included'
    },
    createdDate: '2024-01-15',
    createdBy: 'Management',
    currentStage: ORDER_STAGES.PROCUREMENT,
    totalValue: 2500000,
    items: [
      { id: 1, name: 'Office Chairs - Executive', itemCode: 'CH-EXEC', make: 'Godrej', model: 'Zenith', quantity: 50, unit: 'Nos', rate: 8500, amount: 425000, gstPercent: 18, totalAmount: 501500 },
      { id: 2, name: 'Workstation Tables', itemCode: 'WS-STD', make: 'Godrej', model: 'Focus', quantity: 100, unit: 'Nos', rate: 12000, amount: 1200000, gstPercent: 18, totalAmount: 1416000 },
      { id: 3, name: 'Conference Table - 20 Seater', itemCode: 'CT-20', make: 'Interio', model: 'Grand', quantity: 2, unit: 'Nos', rate: 85000, amount: 170000, gstPercent: 18, totalAmount: 200600 },
      { id: 4, name: 'Filing Cabinets', itemCode: 'FC-MTL', make: 'Godrej', model: 'Safe', quantity: 30, unit: 'Nos', rate: 6500, amount: 195000, gstPercent: 18, totalAmount: 230100 },
      { id: 5, name: 'Partition Panels', itemCode: 'PP-ALU', make: 'Modular', model: 'X-70', quantity: 200, unit: 'Sqft', rate: 2550, amount: 510000, gstPercent: 18, totalAmount: 601800 }
    ],
    summary: {
      subTotal: 2500000,
      gstAmount: 450000,
      grandTotal: 2950000
    },
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
    stores: null,
    dispatch: null,
    history: [
      { date: '2024-01-15', action: 'Order Created', by: 'Management', department: 'Management' },
      { date: '2024-01-16', action: 'Escalated to Procurement', by: 'System', department: 'System' },
      { date: '2024-01-18', action: 'RFQ Sent to Vendor', by: 'Procurement', department: 'Procurement' }
    ],
  },
  {
    id: 'ORD-2024-002',
    projectName: 'Pune Campus Setup',
    customerDetails: {
      name: 'Infosys Limited',
      type: 'Private',
      billingAddress: 'Hinjewadi Phase 2, Pune - 411057',
      shippingAddress: 'Hinjewadi Phase 2, Pune - 411057',
      contactPerson: 'Sarah Chen',
      contactNumber: '9123456789',
      email: 'sarah.c@infosys.com',
      gstNumber: '27BBBBB1111B2Z6'
    },
    orderDetails: {
      orderNumber: 'INF/PNE/24/09',
      orderDate: '2024-01-20',
      quotationNumber: 'QTN/TV/2023/510',
      quotationDate: '2023-12-28'
    },
    epbgDetails: {
      required: 'Yes',
      attachmentDraft: null
    },
    commercialTerms: {
      paymentTerm: 'Advance',
      warrantyTerm: '3 Years',
      others: 'Extended support included'
    },
    createdDate: '2024-01-20',
    createdBy: 'Management',
    currentStage: ORDER_STAGES.FINANCE,
    totalValue: 4800000,
    items: [
      { id: 1, name: 'Server Racks', itemCode: 'SRV-RK', make: 'APC', model: 'Netshelter', quantity: 10, unit: 'Nos', rate: 125000, amount: 1250000, gstPercent: 18, totalAmount: 1475000 },
      { id: 2, name: 'UPS Systems - 10KVA', itemCode: 'UPS-10K', make: 'Eaton', model: '9PX', quantity: 5, unit: 'Nos', rate: 180000, amount: 900000, gstPercent: 18, totalAmount: 1062000 },
      { id: 3, name: 'Network Switches', itemCode: 'SW-48P', make: 'Cisco', model: 'Catalyst', quantity: 20, unit: 'Nos', rate: 45000, amount: 900000, gstPercent: 18, totalAmount: 1062000 },
      { id: 4, name: 'Raised Flooring', itemCode: 'RF-CMP', make: 'Tate', model: 'Concore', quantity: 5000, unit: 'Sqft', rate: 350, amount: 1750000, gstPercent: 18, totalAmount: 2065000 }
    ],
    summary: {
      subTotal: 4800000,
      gstAmount: 864000,
      grandTotal: 5664000
    },
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
    stores: null,
    dispatch: null,
    history: [
      { date: '2024-01-20', action: 'Order Created', by: 'Management', department: 'Management' },
      { date: '2024-01-21', action: 'Escalated to Procurement', by: 'System', department: 'System' },
      { date: '2024-01-26', action: 'PO Generated & Sent', by: 'Procurement', department: 'Procurement' },
      { date: '2024-01-27', action: 'Escalated to Finance', by: 'System', department: 'System' },
      { date: '2024-01-28', action: 'Advance Payment Approved', by: 'Finance', department: 'Finance' }
    ],
  },
];
