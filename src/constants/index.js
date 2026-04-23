export const MODULES = {
  DASHBOARD: 'dashboard',
  ORDERS: 'orders',
  CREATE_ORDER: 'create_order',
  PROCUREMENT: 'procurement',
  FINANCE: 'finance',
  STORES: 'stores',
  DISPATCH: 'dispatch',
  INVOICING: 'invoicing',
  USERS: 'users',
  SETTINGS: 'settings'
};

export const PERMISSIONS = {
  // Module Access
  VIEW_DASHBOARD: 'view_dashboard',
  VIEW_ALL_ORDERS: 'view_all_orders',
  VIEW_ASSIGNED_ORDERS: 'view_assigned_orders',
  CREATE_ORDER: 'create_order',

  // Order Details
  VIEW_ORDER_OVERVIEW: 'view_order_overview',
  VIEW_PROJECT_NAME: 'view_project_name',
  VIEW_CUSTOMER_NAME: 'view_customer_name',
  VIEW_BOQ: 'view_boq',
  VIEW_ORDER_VALUE: 'view_order_value',
  VIEW_ORDER_HISTORY: 'view_order_history',

  // Procurement
  VIEW_PROCUREMENT: 'view_procurement',
  EDIT_PROCUREMENT: 'edit_procurement',
  VIEW_VENDOR_NAME: 'view_vendor_name',
  VIEW_VENDOR_RATES: 'view_vendor_rates',
  VIEW_ADVANCE_DETAILS: 'view_advance_details',

  // Finance
  VIEW_FINANCE: 'view_finance',
  EDIT_FINANCE: 'edit_finance',
  APPROVE_PAYMENTS: 'approve_payments',
  VIEW_PAYMENT_RECEIPTS: 'view_payment_receipts',

  // Stores
  VIEW_STORES: 'view_stores',
  EDIT_STORES: 'edit_stores',

  // Dispatch
  VIEW_DISPATCH: 'view_dispatch',
  EDIT_DISPATCH: 'edit_dispatch',

  // Planning
  VIEW_PLANNING: 'view_planning',
  EDIT_PLANNING: 'edit_planning',

  // Invoicing
  VIEW_INVOICING: 'view_invoicing',
  EDIT_INVOICING: 'edit_invoicing',

  // Delivery
  VIEW_DELIVERY: 'view_delivery',
  EDIT_DELIVERY: 'edit_delivery',
  VIEW_INSTALLATION: 'view_installation',
  EDIT_INSTALLATION: 'edit_installation',

  // Actions
  ESCALATE_ORDERS: 'escalate_orders',
  DELETE_ORDERS: 'delete_orders',
  EDIT_ORDERS: 'edit_orders',
  EXPORT_DATA: 'export_data',

  // Admin
  MANAGE_USERS: 'manage_users',
  MANAGE_PERMISSIONS: 'manage_permissions',
  VIEW_SETTINGS: 'view_settings',
  EDIT_SETTINGS: 'edit_settings'
};

export const PERMISSION_GROUPS = {
  'Order Viewing': [
    { key: PERMISSIONS.VIEW_DASHBOARD, label: 'View Dashboard', description: 'Access to main dashboard' },
    { key: PERMISSIONS.VIEW_ALL_ORDERS, label: 'View All Orders', description: 'See all orders in system' },
    { key: PERMISSIONS.VIEW_ASSIGNED_ORDERS, label: 'View Assigned Orders Only', description: 'Only see orders assigned to their department' },
    { key: PERMISSIONS.VIEW_ORDER_OVERVIEW, label: 'View Order Overview', description: 'See basic order details' },
    { key: PERMISSIONS.VIEW_PROJECT_NAME, label: 'View Project Name', description: 'See project names' },
    { key: PERMISSIONS.VIEW_CUSTOMER_NAME, label: 'View Customer Name', description: 'See customer names' },
    { key: PERMISSIONS.VIEW_BOQ, label: 'View BOQ/Items', description: 'See bill of quantities' },
    { key: PERMISSIONS.VIEW_ORDER_VALUE, label: 'View Order Value', description: 'See monetary values' },
    { key: PERMISSIONS.VIEW_ORDER_HISTORY, label: 'View Order History', description: 'See audit trail' },
  ],
  'Order Management': [
    { key: PERMISSIONS.CREATE_ORDER, label: 'Create Orders', description: 'Create new orders' },
    { key: PERMISSIONS.ESCALATE_ORDERS, label: 'Escalate Orders', description: 'Move orders to next stage' },
    { key: PERMISSIONS.DELETE_ORDERS, label: 'Delete Orders', description: 'Remove orders from system' },
    { key: PERMISSIONS.EDIT_ORDERS, label: 'Edit Orders', description: 'Modify existing order details' },
    { key: PERMISSIONS.EXPORT_DATA, label: 'Export Data', description: 'Download reports and data' },
  ],
  'Procurement Access': [
    { key: PERMISSIONS.VIEW_PROCUREMENT, label: 'View Procurement Tab', description: 'Access procurement section' },
    { key: PERMISSIONS.EDIT_PROCUREMENT, label: 'Edit Procurement Details', description: 'Modify procurement data' },
    { key: PERMISSIONS.VIEW_VENDOR_NAME, label: 'View Vendor Name', description: 'See vendor information' },
    { key: PERMISSIONS.VIEW_VENDOR_RATES, label: 'View Vendor Rates', description: 'See pricing details' },
    { key: PERMISSIONS.VIEW_ADVANCE_DETAILS, label: 'View Advance Details', description: 'See advance payment info' },
  ],
  'Finance Access': [
    { key: PERMISSIONS.VIEW_FINANCE, label: 'View Finance Tab', description: 'Access finance section' },
    { key: PERMISSIONS.EDIT_FINANCE, label: 'Edit Finance Details', description: 'Modify payment data' },
    { key: PERMISSIONS.APPROVE_PAYMENTS, label: 'Approve Payments', description: 'Authorize payment requests' },
    { key: PERMISSIONS.VIEW_PAYMENT_RECEIPTS, label: 'View Payment Receipts', description: 'Access uploaded receipts' },
  ],
  'Stores Access': [
    { key: PERMISSIONS.VIEW_STORES, label: 'View Stores Tab', description: 'Access stores section' },
    { key: PERMISSIONS.EDIT_STORES, label: 'Edit Stores Details', description: 'Modify inward data' },
  ],
  'Dispatch Access': [
    { key: PERMISSIONS.VIEW_DISPATCH, label: 'View Dispatch Tab', description: 'Access dispatch section' },
    { key: PERMISSIONS.EDIT_DISPATCH, label: 'Edit Dispatch Details', description: 'Modify shipping data' },
  ],
  'Planning Access': [
    { key: PERMISSIONS.VIEW_PLANNING, label: 'View Planning', description: 'Access order planning section' },
    { key: PERMISSIONS.EDIT_PLANNING, label: 'Edit Planning Details', description: 'Modify planning timelines and BOQ schedules' },
  ],
  'Invoicing Access': [
    { key: PERMISSIONS.VIEW_INVOICING, label: 'View Invoicing Tab', description: 'Access final order invoicing section' },
    { key: PERMISSIONS.EDIT_INVOICING, label: 'Edit Invoicing Details', description: 'Modify invoice information and upload attachments' },
  ],
  'Delivery Access': [
    { key: PERMISSIONS.VIEW_DELIVERY, label: 'View Delivery Tab', description: 'Access order delivery section' },
    { key: PERMISSIONS.EDIT_DELIVERY, label: 'Edit Delivery Details', description: 'Modify delivery information and upload attachments' },
  ],
  'Installation Access': [
    { key: PERMISSIONS.VIEW_INSTALLATION, label: 'View Installation Tab', description: 'Access order installation section' },
    { key: PERMISSIONS.EDIT_INSTALLATION, label: 'Edit Installation Details', description: 'Modify installation information and upload attachments' },
  ],
  'Administration': [
    { key: PERMISSIONS.MANAGE_USERS, label: 'Manage Users', description: 'Add/edit/delete users' },
    { key: PERMISSIONS.MANAGE_PERMISSIONS, label: 'Manage Permissions', description: 'Change user access rights' },
    { key: PERMISSIONS.VIEW_SETTINGS, label: 'View Settings', description: 'Access system settings' },
    { key: PERMISSIONS.EDIT_SETTINGS, label: 'Edit Settings', description: 'Modify system configuration' },
  ],
};

export const PERMISSION_TEMPLATES = {
  'Super Admin': Object.values(PERMISSIONS),
  'Planning Team': [
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.VIEW_ALL_ORDERS,
    PERMISSIONS.VIEW_ORDER_OVERVIEW,
    PERMISSIONS.VIEW_PROJECT_NAME,
    PERMISSIONS.VIEW_CUSTOMER_NAME,
    PERMISSIONS.VIEW_BOQ,
    PERMISSIONS.VIEW_ORDER_VALUE,
    PERMISSIONS.VIEW_ORDER_HISTORY,
    PERMISSIONS.VIEW_PLANNING,
    PERMISSIONS.EDIT_PLANNING,
    PERMISSIONS.VIEW_INVOICING,
    PERMISSIONS.EDIT_INVOICING,
    PERMISSIONS.VIEW_DELIVERY,
    PERMISSIONS.EDIT_DELIVERY,
    PERMISSIONS.VIEW_INSTALLATION,
    PERMISSIONS.EDIT_INSTALLATION,
  ],
  'Management': [
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.VIEW_ALL_ORDERS,
    PERMISSIONS.VIEW_ORDER_OVERVIEW,
    PERMISSIONS.VIEW_PROJECT_NAME,
    PERMISSIONS.VIEW_CUSTOMER_NAME,
    PERMISSIONS.VIEW_BOQ,
    PERMISSIONS.VIEW_ORDER_VALUE,
    PERMISSIONS.VIEW_ORDER_HISTORY,
    PERMISSIONS.CREATE_ORDER,
    PERMISSIONS.ESCALATE_ORDERS,
    PERMISSIONS.VIEW_PROCUREMENT,
    PERMISSIONS.VIEW_VENDOR_NAME,
    PERMISSIONS.VIEW_FINANCE,
    PERMISSIONS.VIEW_STORES,
    PERMISSIONS.VIEW_DISPATCH,
    PERMISSIONS.VIEW_PLANNING,
    PERMISSIONS.EDIT_PLANNING,
    PERMISSIONS.VIEW_INVOICING,
    PERMISSIONS.EDIT_INVOICING,
    PERMISSIONS.VIEW_DELIVERY,
    PERMISSIONS.EDIT_DELIVERY,
    PERMISSIONS.VIEW_INSTALLATION,
    PERMISSIONS.EDIT_INSTALLATION,
    PERMISSIONS.EXPORT_DATA,
  ],
  'Procurement Team': [
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.VIEW_ALL_ORDERS,
    PERMISSIONS.VIEW_ORDER_OVERVIEW,
    PERMISSIONS.VIEW_PROJECT_NAME,
    PERMISSIONS.VIEW_CUSTOMER_NAME,
    PERMISSIONS.VIEW_BOQ,
    PERMISSIONS.VIEW_ORDER_HISTORY,
    PERMISSIONS.VIEW_PROCUREMENT,
    PERMISSIONS.EDIT_PROCUREMENT,
    PERMISSIONS.VIEW_VENDOR_NAME,
    PERMISSIONS.VIEW_VENDOR_RATES,
    PERMISSIONS.VIEW_ADVANCE_DETAILS,
    PERMISSIONS.VIEW_PLANNING,
    PERMISSIONS.ESCALATE_ORDERS,
  ],
  'Procurement (Limited)': [
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.VIEW_ASSIGNED_ORDERS,
    PERMISSIONS.VIEW_ORDER_OVERVIEW,
    PERMISSIONS.VIEW_PROJECT_NAME,
    PERMISSIONS.VIEW_CUSTOMER_NAME,
    PERMISSIONS.VIEW_BOQ,
    PERMISSIONS.VIEW_PROCUREMENT,
    PERMISSIONS.EDIT_PROCUREMENT,
    PERMISSIONS.VIEW_VENDOR_NAME,
    PERMISSIONS.VIEW_PLANNING,
    PERMISSIONS.VIEW_SETTINGS,
  ],
  'Finance Team': [
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.VIEW_ASSIGNED_ORDERS,
    PERMISSIONS.VIEW_ORDER_OVERVIEW,
    PERMISSIONS.VIEW_PROJECT_NAME,
    PERMISSIONS.VIEW_CUSTOMER_NAME,
    PERMISSIONS.VIEW_BOQ,
    PERMISSIONS.VIEW_ORDER_VALUE,
    PERMISSIONS.VIEW_ORDER_HISTORY,
    PERMISSIONS.VIEW_PROCUREMENT,
    PERMISSIONS.VIEW_VENDOR_NAME,
    PERMISSIONS.VIEW_VENDOR_RATES,
    PERMISSIONS.VIEW_ADVANCE_DETAILS,
    PERMISSIONS.VIEW_FINANCE,
    PERMISSIONS.EDIT_FINANCE,
    PERMISSIONS.APPROVE_PAYMENTS,
    PERMISSIONS.VIEW_PAYMENT_RECEIPTS,
    PERMISSIONS.VIEW_PLANNING,
    PERMISSIONS.VIEW_INVOICING,
    PERMISSIONS.EDIT_INVOICING,
    PERMISSIONS.VIEW_DELIVERY,
    PERMISSIONS.VIEW_INSTALLATION,
    PERMISSIONS.VIEW_SETTINGS,
    PERMISSIONS.ESCALATE_ORDERS,
  ],
  'Finance (View Only)': [
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.VIEW_ASSIGNED_ORDERS,
    PERMISSIONS.VIEW_ORDER_OVERVIEW,
    PERMISSIONS.VIEW_PROJECT_NAME,
    PERMISSIONS.VIEW_CUSTOMER_NAME,
    PERMISSIONS.VIEW_BOQ,
    PERMISSIONS.VIEW_ORDER_VALUE,
    PERMISSIONS.VIEW_FINANCE,
    PERMISSIONS.VIEW_VENDOR_NAME,
    PERMISSIONS.VIEW_PAYMENT_RECEIPTS,
    PERMISSIONS.VIEW_PLANNING,
    PERMISSIONS.VIEW_SETTINGS,
  ],
  'Stores Team': [
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.VIEW_ASSIGNED_ORDERS,
    PERMISSIONS.VIEW_ORDER_OVERVIEW,
    PERMISSIONS.VIEW_PROJECT_NAME,
    PERMISSIONS.VIEW_CUSTOMER_NAME,
    PERMISSIONS.VIEW_BOQ,
    PERMISSIONS.VIEW_ORDER_HISTORY,
    PERMISSIONS.VIEW_STORES,
    PERMISSIONS.EDIT_STORES,
    PERMISSIONS.VIEW_PLANNING,
    PERMISSIONS.VIEW_SETTINGS,
    PERMISSIONS.ESCALATE_ORDERS,
  ],
  'Dispatch Team': [
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.VIEW_ASSIGNED_ORDERS,
    PERMISSIONS.VIEW_ORDER_OVERVIEW,
    PERMISSIONS.VIEW_PROJECT_NAME,
    PERMISSIONS.VIEW_CUSTOMER_NAME,
    PERMISSIONS.VIEW_BOQ,
    PERMISSIONS.VIEW_ORDER_HISTORY,
    PERMISSIONS.VIEW_DISPATCH,
    PERMISSIONS.EDIT_DISPATCH,
    PERMISSIONS.VIEW_DELIVERY,
    PERMISSIONS.EDIT_DELIVERY,
    PERMISSIONS.VIEW_INSTALLATION,
    PERMISSIONS.EDIT_INSTALLATION,
    PERMISSIONS.VIEW_PLANNING,
    PERMISSIONS.ESCALATE_ORDERS,
  ],
  'View Only': [
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.VIEW_ASSIGNED_ORDERS,
    PERMISSIONS.VIEW_ORDER_OVERVIEW,
    PERMISSIONS.VIEW_PROJECT_NAME,
    PERMISSIONS.VIEW_CUSTOMER_NAME,
  ],
};

export const DEPARTMENTS = {
  ADMIN: 'admin',
  MANAGEMENT: 'management',
  PROCUREMENT: 'procurement',
  FINANCE: 'finance',
  STORES: 'stores',
  DISPATCH: 'dispatch',
  PLANNING: 'planning'
};

export const ORDER_STAGES = {
  NEW: 'new',
  PLANNING: 'planning',
  STORES: 'stores',
  PROCUREMENT: 'procurement',
  FINANCE: 'finance',
  STORES_INWARD: 'stores_inward',
  DISPATCH: 'dispatch',
  INVOICE: 'invoice',
  COMPLETED: 'completed'
};

export const STAGE_LABELS = {
  new: 'New Order',
  planning: 'Planning',
  stores: 'Stores (Inventory)',
  procurement: 'Procurement',
  finance: 'Finance',
  stores_inward: 'Stores (Inward)',
  dispatch: 'Dispatch',
  invoice: 'Order Invoicing',
  completed: 'Completed'
};

export const PROCUREMENT_STATUS_OPTIONS = [
  'Pending', 'RFQ Sent', 'Quote Received', 'PO Generated', 'PO Sent',
  'Advance Pending', 'Advance Paid', 'In Production', 'Ready for Dispatch', 'Dispatched', 'Delivered'
];

export const CUSTOMER_TYPES = ['Government', 'Private', 'PSU', 'Dealer', 'Distributor'];
export const PAYMENT_TERMS = ['Advance', 'Net 30', 'Net 45', 'Net 60', 'Against Delivery', 'PDC'];
export const WARRANTY_TERMS = ['6 Months', '1 Year', '18 Months', '2 Years', '3 Years', '5 Years', 'N/A'];
export const ITEM_UNITS = ['Nos', 'Sqft', 'Sqm', 'Rft', 'Kg', 'Set', 'Lot', 'Pkt', 'Mtr'];

export const PO_STATUS_OPTIONS = ['Draft', 'Pending Approval', 'Issued', 'Partially Received', 'Received', 'Cancelled'];

export const MODULE_LABELS = {
  dashboard: 'Overview & Analytics',
  orders: 'Order Database',
  'create-order': 'Create New Project',
  procurement: 'Procurement Pipeline',
  finance: 'Financial Controls',
  stores: 'Stores & Inward',
  dispatch: 'Packaging & Dispatch',
  invoicing: 'Order Invoicing',
  planning: 'Order Planning',
  users: 'User Administration',
  permissions: 'System Permissions',
  settings: 'Global Settings'
};
