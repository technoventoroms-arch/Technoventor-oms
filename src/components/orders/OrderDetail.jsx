import React, { useState, useMemo } from 'react';
import { ChevronRight, Send, Users, Tag, ShieldCheck, CreditCard, Download, DollarSign, Building2, Edit2, Warehouse, Truck, Zap, Clock, Package, Trash2, CheckCircle2, FileText, ArrowUpRight } from 'lucide-react';
import { PERMISSIONS, ORDER_STAGES, STAGE_LABELS, DEPARTMENTS } from '../../constants';
import { InfoCard, StageTag, FormField, EmptyState } from '../common';
import { formatAddress, formatDate, formatDateTime, downloadCSV } from '../../utils';
import { ProcurementForm } from './ProcurementForm';
import { StoresForm } from './StoresForm';
import { StoresInventoryForm } from './StoresInventoryForm';
import { OrderPlanningTab } from './OrderPlanningTab';
import { DispatchForm } from './DispatchForm';
import { InvoicingForm } from './InvoicingForm';
import { DeliveryForm } from './DeliveryForm';
import InstallationForm from './InstallationForm';
import {
  OverviewTab,
  BOQTab,
  ProcurementTab,
  FinanceTab,
  InvoicingTab,
  DeliveryTab,
  InstallationTab,
  StoresTab,
  DispatchTab,
  HistoryTab
} from './detail-tabs';

export function OrderDetail({ order, currentUser, hasPermission, onUpdate, onEscalate, onDelete, onEdit, onBack, openTab }) {
  const [activeTab, setActiveTab] = useState(openTab || 'overview');
  const [isDeleting, setIsDeleting] = useState(false);
  const [editingProcurement, setEditingProcurement] = useState(false);
  const [editingFinance, setEditingFinance] = useState(false);
  const [editingStores, setEditingStores] = useState(false);
  const [editingDispatch, setEditingDispatch] = useState(false);
  const [editingInventory, setEditingInventory] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState(false);
  const [editingDelivery, setEditingDelivery] = useState(false);
  const [editingInstallation, setEditingInstallation] = useState(false);
  const [isSubmittingFinance, setIsSubmittingFinance] = useState(false);
  const [isEscalating, setIsEscalating] = useState(null); // store stage trying to escalate to
  const [isDeletingOrder, setIsDeletingOrder] = useState(false);
  const [escalatingPO, setEscalatingPO] = useState(null); // track which PO is being escalated

  const [procurementData, setProcurementData] = useState(() => {
    const p = order.procurement || {};
    if (p.boqPurchases && p.boqPurchases.length > 0) return p;
    return {
      boqPurchases: (order.items || []).map(item => ({
        boqItemId: item.id,
        vendorDetails: { name: '', code: '', contactPerson: '', contactNumber: '', email: '', address: '', gstNumber: '', accountHolderName: '', bankName: '', accountNumber: '', retypeAccountNumber: '', accountType: '', ifscCode: '' },
        quotationDetails: { quotationNumber: '', quotationDate: '', rfqNumber: '', rfqDate: '' },
        poDetails: { poNumber: '', poDate: '', poValue: '', poStatus: 'Draft' },
        paymentAndDelivery: { paymentType: '', creditDays: '', paymentNotes: '', deliveryMethod: '', expectedDeliveryDate: '' },
      }))
    };
  });

  const [financeData, setFinanceData] = useState(() => {
    return (order.finance || []).map(f => ({ ...f }));
  });
  const [editingFinanceItemId, setEditingFinanceItemId] = useState(null);

  const [storesData, setStoresData] = useState(() => {
    const s = order.stores || {};
    if (s.boqInwards && s.boqInwards.length > 0) return s;
    return {
      boqInwards: (order.items || []).map(item => ({
        boqItemId: item.id,
        inwardDate: '',
        grnNumber: '',
        qualityCheckStatus: 'Pending',
        receivedQuantity: '',
        damageReport: '',
        storageLocation: '',
        remarks: ''
      }))
    };
  });

  const [dispatchData, setDispatchData] = useState(order.dispatch || {
    packagingDate: '', packagingList: '', packagingStatus: 'Pending',
    dispatchDate: '', transporterName: '', vehicleNumber: '', docketNumber: '',
    expectedDeliveryDate: '', deliveryStatus: 'Pending', podUploaded: false, podUrl: '', remarks: ''
  });

  const [invoiceData, setInvoiceData] = useState(order.invoice || {
    invoiceNumber: '', invoiceDate: '', invoiceAttachment: '', ewayBillAttachment: '', remarks: ''
  });

  const [deliveryData, setDeliveryData] = useState(order.delivery || {
    proofOfDelivery: '', handoverTo: '', remarks: '', deliveryDate: ''
  });

  const [installationData, setInstallationData] = useState(order.installation || {
    installedBy: '', siteContact: '', remarks: '', date: ''
  });

  // Keep local states in sync when order changes
  React.useEffect(() => {
    if (order.procurement?.boqPurchases?.length > 0) {
      setProcurementData(order.procurement);
    } else {
      setProcurementData({
        boqPurchases: (order.items || []).map(item => ({
          boqItemId: item.id,
          vendorDetails: { name: '', code: '', contactPerson: '', contactNumber: '', email: '', address: '', gstNumber: '', accountHolderName: '', bankName: '', accountNumber: '', retypeAccountNumber: '', accountType: '', ifscCode: '' },
          quotationDetails: { quotationNumber: '', quotationDate: '', rfqNumber: '', rfqDate: '' },
          poDetails: { poNumber: '', poDate: '', poValue: '', poStatus: 'Draft' },
          paymentAndDelivery: { paymentType: '', creditDays: '', paymentNotes: '', deliveryMethod: '', expectedDeliveryDate: '' },
        }))
      });
    }

    setFinanceData((order.finance || []).map(f => ({ ...f })));

    if (order.stores?.boqInwards?.length > 0) {
      setStoresData(order.stores);
    } else {
      setStoresData({
        boqInwards: (order.items || []).map(item => ({
          boqItemId: item.id,
          inwardDate: '',
          grnNumber: '',
          qualityCheckStatus: 'Pending',
          receivedQuantity: '',
          damageReport: '',
          storageLocation: '',
          remarks: ''
        }))
      });
    }

    setDispatchData(order.dispatch || {
      packagingDate: '', packagingList: '', packagingStatus: 'Pending',
      dispatchDate: '', transporterName: '', vehicleNumber: '', docketNumber: '',
      expectedDeliveryDate: '', deliveryStatus: 'Pending', podUploaded: false, podUrl: '', remarks: ''
    });

    setInvoiceData(order.invoice || {
      invoiceNumber: '', invoiceDate: '', invoiceAttachment: '', ewayBillAttachment: '', remarks: ''
    });

    setDeliveryData(order.delivery || {
      proofOfDelivery: '', handoverTo: '', remarks: '', deliveryDate: ''
    });
    setInstallationData(order.installation || {
      installedBy: '', siteContact: '', remarks: '', date: ''
    });
  }, [order]);

  const canEscalate = hasPermission(PERMISSIONS.ESCALATE_ORDERS);

  const getNextStage = () => {
    const stages = Object.values(ORDER_STAGES);
    const currentIndex = stages.indexOf(order.currentStage);
    if (currentIndex === -1 || currentIndex === stages.length - 1) return null;

    let nextIndex = currentIndex + 1;
    const hasGoods = (order.items || []).some(item => item.itemType === 'goods');
    
    // Stages that are only for goods
    const goodsOnlyStages = [
      ORDER_STAGES.PLANNING,
      ORDER_STAGES.STORES,
      ORDER_STAGES.PROCUREMENT,
      ORDER_STAGES.FINANCE,
      ORDER_STAGES.STORES_INWARD,
      ORDER_STAGES.DISPATCH
    ];

    while (nextIndex < stages.length) {
      const nextStage = stages[nextIndex];
      // If it's a goods-only stage and we have no goods, skip it
      if (goodsOnlyStages.includes(nextStage) && !hasGoods) {
        nextIndex++;
        continue;
      }
      return nextStage;
    }
    return null;
  };

  const getPreviousStage = () => {
    const stages = Object.values(ORDER_STAGES);
    const currentIndex = stages.indexOf(order.currentStage);
    if (currentIndex <= 0) return null;

    let prevIndex = currentIndex - 1;
    const hasGoods = (order.items || []).some(item => item.itemType === 'goods');
    
    const goodsOnlyStages = [
      ORDER_STAGES.PLANNING,
      ORDER_STAGES.STORES,
      ORDER_STAGES.PROCUREMENT,
      ORDER_STAGES.FINANCE,
      ORDER_STAGES.STORES_INWARD,
      ORDER_STAGES.DISPATCH
    ];

    while (prevIndex >= 0) {
      const prevStage = stages[prevIndex];
      if (goodsOnlyStages.includes(prevStage) && !hasGoods) {
        prevIndex--;
        continue;
      }
      return prevStage;
    }
    return null;
  };

  // Compute which PO numbers have been escalated to finance (poStatus === 'Pending Approval' or later finance statuses)
  const escalatedPoNumbers = useMemo(() => {
    const poNums = new Set();
    (order.procurement?.boqPurchases || []).forEach(p => {
      if (p.poDetails?.poStatus === 'Pending Approval' || p.poDetails?.poStatus === 'Finance Approved') {
        const key = p.poDetails?.poNumber || p.vendorDetails?.name;
        if (key) poNums.add(key);
      }
    });
    return poNums;
  }, [order.procurement]);

  // Escalate a single PO group to Finance
  const handleEscalatePOToFinance = async (poKey, poGroup) => {
    setEscalatingPO(poKey);
    try {
      const updatedPurchases = (order.procurement?.boqPurchases || []).map(p => {
        const key = p.poDetails?.poNumber || p.vendorDetails?.name;
        if (key === poKey) {
          return { ...p, poDetails: { ...p.poDetails, poStatus: 'Pending Approval' } };
        }
        return p;
      });

      const historyEntry = {
        date: new Date().toISOString(),
        action: `PO ${poKey} escalated to Finance`,
        by: currentUser.name,
        department: currentUser.department
      };

      // Update all boqPurchases in this PO group to 'Pending Approval'
      const updatePayload = {
        procurement: { boqPurchases: updatedPurchases },
        history: [...(order.history || []), historyEntry]
      };

      // Auto-escalation check: If all items with shortQty > 0 have an escalated PO
      const shortages = (order.items || []).filter(item => (item.shortQty || 0) > 0 && item.itemType !== 'service');
      const escalatedItemIds = new Set(
        updatedPurchases
          .filter(p => p.poDetails?.poStatus === 'Pending Approval' || p.poDetails?.poStatus === 'Finance Approved')
          .map(p => p.boqItemId)
      );
      
      const allShortagesEscalated = shortages.length > 0 && shortages.every(item => escalatedItemIds.has(item.id));

      if (allShortagesEscalated && order.currentStage === ORDER_STAGES.PROCUREMENT) {
        const nextStage = getNextStage();
        if (nextStage) {
          updatePayload.currentStage = nextStage;
          updatePayload.history.push({
            date: new Date().toISOString(),
            action: `Order automatically escalated to ${STAGE_LABELS[nextStage]} (Triggered by ${currentUser.name} - All POs escalated)`,
            by: 'System',
            department: 'System'
          });
        }
      }

      await onUpdate(updatePayload);
    } finally {
      setEscalatingPO(null);
    }
  };

  const saveProcurement = (data) => {
    const updatePayload = { procurement: data };
    
    // Auto-escalation check: If all items with shortages are now escalated
    const shortages = (order.items || []).filter(item => (item.shortQty || 0) > 0 && item.itemType !== 'service');
    const escalatedItemIds = new Set(
      (data.boqPurchases || [])
        .filter(p => p.poDetails?.poStatus === 'Pending Approval' || p.poDetails?.poStatus === 'Finance Approved')
        .map(p => p.boqItemId)
    );
    
    const allShortagesEscalated = shortages.length > 0 && shortages.every(item => escalatedItemIds.has(item.id));
    
    if (allShortagesEscalated && order.currentStage === ORDER_STAGES.PROCUREMENT) {
      const nextStage = getNextStage();
      if (nextStage) {
        updatePayload.currentStage = nextStage;
        updatePayload.history = [
          ...(order.history || []),
          {
            date: new Date().toISOString(),
            action: `Order automatically escalated to ${STAGE_LABELS[nextStage]} (Triggered by ${currentUser.name} - All POs submitted)`,
            by: 'System',
            department: 'System'
          }
        ];
      }
    }

    if (!updatePayload.history) {
      updatePayload.history = [
        ...(order.history || []),
        {
          date: new Date().toISOString(),
          action: `Procurement details updated`,
          by: currentUser.name,
          department: currentUser.department
        }
      ];
    }
    
    onUpdate(updatePayload);
    setProcurementData(data);
    setEditingProcurement(false);
  };

  const saveFinance = async () => { 
    setIsSubmittingFinance(true);
    try {
      const updatePayload = { finance: financeData };
      const poNumbersFromProcurement = new Set(
        (order.procurement?.boqPurchases || [])
          .map(p => p.poDetails?.poNumber || p.vendorDetails?.name)
          .filter(Boolean)
      );
      const paidPoNumbers = new Set(
        financeData
          .filter(f => f.paymentStatus === 'Completed')
          .map(f => f.poNumber)
      );
      
      const allPOsPaid = poNumbersFromProcurement.size > 0 && 
                         Array.from(poNumbersFromProcurement).every(po => paidPoNumbers.has(po));
      
      if (allPOsPaid && order.currentStage === ORDER_STAGES.FINANCE) {
        const nextStage = getNextStage();
        if (nextStage) {
          updatePayload.currentStage = nextStage;
          updatePayload.history = [
            ...(order.history || []),
            {
              date: new Date().toISOString(),
              action: `Order automatically escalated to ${STAGE_LABELS[nextStage]} (Triggered by ${currentUser.name} - All payments completed)`,
              by: 'System',
              department: 'System'
            }
          ];
        }
      }

      if (!updatePayload.history) {
        updatePayload.history = [
          ...(order.history || []),
          {
            date: new Date().toISOString(),
            action: `Finance / Payment details updated`,
            by: currentUser.name,
            department: currentUser.department
          }
        ];
      }

      await onUpdate(updatePayload); 
    } finally {
      setIsSubmittingFinance(false);
      setEditingFinanceItemId(null); 
    }
  };

  const updateFinanceItem = (itemId, data) => {
    setFinanceData(prev => {
      const existing = prev.find(f => f.boqItemId === itemId);
      const poNumber = (order.procurement?.boqPurchases || []).find(p => p.boqItemId === itemId)?.poDetails?.poNumber || '';
      
      if (existing) {
        return prev.map(f => f.boqItemId === itemId ? { ...f, ...data, poNumber: data.poNumber || f.poNumber || poNumber } : f);
      }
      return [...prev, { boqItemId: itemId, ...data, poNumber: data.poNumber || poNumber }];
    });
  };

  const saveStores = async (data, shouldEscalate = false) => { 
    const sData = data || storesData;
    const updatePayload = { stores: sData };
    
    const allInwarded = (order.items || []).every(item => {
      const inward = (sData.boqInwards || []).find(i => i.boqItemId === item.id);
      return inward && inward.inwardDate && inward.receivedQuantity === 'Full';
    });
    
    if ((shouldEscalate || allInwarded) && (order.currentStage === ORDER_STAGES.STORES || order.currentStage === ORDER_STAGES.STORES_INWARD)) {
      const nextStage = ORDER_STAGES.DISPATCH;
      updatePayload.currentStage = nextStage;
      updatePayload.history = [
        ...(order.history || []),
        {
          date: new Date().toISOString(),
          action: `Order ${shouldEscalate ? 'manually' : 'automatically'} escalated to ${STAGE_LABELS[nextStage]} (Triggered by ${currentUser.name}${allInwarded ? ' - All items inwarded' : ''})`,
          by: shouldEscalate ? currentUser.name : 'System',
          department: shouldEscalate ? currentUser.department : 'System'
        }
      ];
    }

    if (!updatePayload.history) {
      updatePayload.history = [
        ...(order.history || []),
        {
          date: new Date().toISOString(),
          action: `Stores / Inward details updated`,
          by: currentUser.name,
          department: currentUser.department
        }
      ];
    }
    
    await onUpdate(updatePayload); 
    setStoresData(sData);
    setEditingStores(false); 
  };

  const saveDispatch = (data) => {
    const d = data || dispatchData;
    const updatePayload = { dispatch: d };
    
    if (d.dispatchDate && order.currentStage === ORDER_STAGES.DISPATCH) {
      const nextStage = getNextStage();
      if (nextStage) {
        updatePayload.currentStage = nextStage;
        updatePayload.history = [
          ...(order.history || []),
          {
            date: new Date().toISOString(),
            action: `Order automatically escalated to ${STAGE_LABELS[nextStage]} (Triggered by ${currentUser.name} - Packaging & Dispatch completed)`,
            by: 'System',
            department: 'System'
          }
        ];
      }
    }

    if (!updatePayload.history) {
      updatePayload.history = [
        ...(order.history || []),
        {
          date: new Date().toISOString(),
          action: `Dispatch / Planning details updated`,
          by: currentUser.name,
          department: currentUser.department
        }
      ];
    }
    
    onUpdate(updatePayload);
    if (data) setDispatchData(data);
    setEditingDispatch(false);
  };

  const saveInvoice = (data) => {
    const i = data || invoiceData;
    const updatePayload = { invoice: i };
    
    if (i.invoiceNumber && i.invoiceDate && order.currentStage === ORDER_STAGES.INVOICE) {
      updatePayload.currentStage = ORDER_STAGES.COMPLETED;
      updatePayload.history = [
        ...(order.history || []),
        {
          date: new Date().toISOString(),
          action: `Order marked as COMPLETED (Triggered by ${currentUser.name} - Invoice generated)`,
          by: 'System',
          department: 'System'
        }
      ];
    } else {
      updatePayload.history = [
        ...(order.history || []),
        {
          date: new Date().toISOString(),
          action: `Invoice details updated`,
          by: currentUser.name,
          department: currentUser.department
        }
      ];
    }
    
    onUpdate(updatePayload);
    if (data) setInvoiceData(data);
    setEditingInvoice(false);
  };

  const saveDelivery = (data) => {
    const d = data || deliveryData;
    const updatePayload = { delivery: d };
    
    if (!updatePayload.history) {
      updatePayload.history = [
        ...(order.history || []),
        {
          date: new Date().toISOString(),
          action: `Delivery / Handover details updated`,
          by: currentUser.name,
          department: currentUser.department
        }
      ];
    }
    
    onUpdate(updatePayload);
    if (data) setDeliveryData(data);
    setEditingDelivery(false);
  };

  const saveInstallation = (data) => {
    const i = data || installationData;
    const updatePayload = { 
      installation: i,
      history: [
        ...(order.history || []),
        {
          date: new Date().toISOString(),
          action: `Installation details updated`,
          by: currentUser.name,
          department: currentUser.department
        }
      ]
    };
    
    onUpdate(updatePayload);
    if (data) setInstallationData(data);
    setEditingInstallation(false);
  };

  const saveInventory = (updatedItems) => {
    onUpdate({ items: updatedItems });
    setEditingInventory(false);
  };

  const handleExportBOQ = () => {
    const headers = ['Sr.', 'Item Description', 'Make', 'Model', 'Qty', 'Unit'];
    const showValues = hasPermission(PERMISSIONS.VIEW_ORDER_VALUE);
    
    if (showValues) {
      headers.push('Rate', 'GST %', 'Total Amount');
    }

    const rows = order.items.map((item, index) => {
      const row = [
        item.parentItemIndex ? '' : index + 1,
        `"${item.name || ''}"`,
        `"${item.make || '-'}"`,
        `"${item.model || '-'}"`,
        item.quantity,
        `"${item.unit || ''}"`
      ];
      if (showValues) {
        row.push(item.rate, item.gstPercent || 18, item.totalAmount || item.amount);
      }
      return row.join(',');
    });

    const csvContent = [headers.join(','), ...rows].join('\n');
    downloadCSV(csvContent, `BOQ_${order.id}_${order.projectName.replace(/\s+/g, '_')}.csv`);
  };

  const tabs = [];
  if (hasPermission(PERMISSIONS.VIEW_ORDER_OVERVIEW)) tabs.push('overview');
  if (hasPermission(PERMISSIONS.VIEW_BOQ)) tabs.push('boq');

  // Stores inventory tab (when order is at stores stage or later)
  if (hasPermission(PERMISSIONS.VIEW_STORES)) tabs.push('inventory');

  // Multi-department visibility: Ensure Procurement and Finance/Payments are visible where appropriate
  if (hasPermission(PERMISSIONS.VIEW_PROCUREMENT)) tabs.push('procurement');
  
  if (currentUser.department === 'finance') {
    if (hasPermission(PERMISSIONS.VIEW_FINANCE)) tabs.push('payments');
  } else {
    if (hasPermission(PERMISSIONS.VIEW_FINANCE)) tabs.push('finance');
  }

  if (hasPermission(PERMISSIONS.VIEW_STORES)) tabs.push('stores');
  if (hasPermission(PERMISSIONS.VIEW_DISPATCH)) tabs.push('dispatch');
  if (hasPermission(PERMISSIONS.VIEW_INVOICING)) tabs.push('invoicing');
  if (hasPermission(PERMISSIONS.VIEW_DELIVERY)) tabs.push('delivery');
  if (hasPermission(PERMISSIONS.VIEW_INSTALLATION)) tabs.push('installation');
  if (hasPermission(PERMISSIONS.VIEW_ORDER_HISTORY)) tabs.push('history');
  if (hasPermission(PERMISSIONS.VIEW_PLANNING)) tabs.push('planning');

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={onBack} className="p-2 hover:bg-slate-800 rounded-lg">
          <ChevronRight className="w-5 h-5 text-slate-400 rotate-180" />
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold text-white">{hasPermission(PERMISSIONS.VIEW_PROJECT_NAME) ? order.projectName : 'Restricted Info'}</h2>
            <StageTag stage={order.currentStage} />
          </div>
          <p className="text-slate-400">{order.id} • {hasPermission(PERMISSIONS.VIEW_CUSTOMER_NAME) ? (order.customerDetails?.name || 'N/A') : 'Restricted'}</p>
        </div>
        {canEscalate && getPreviousStage() && (
          <button
            onClick={async () => {
              setIsEscalating(`prev-${getPreviousStage()}`);
              try {
                await onEscalate(getPreviousStage(), true);
              } finally {
                setIsEscalating(null);
              }
            }}
            disabled={isEscalating !== null}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-600 text-white font-semibold rounded-lg shadow-lg shadow-orange-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
          >
            {isEscalating === `prev-${getPreviousStage()}` ? (
              <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
            ) : (
              <ChevronRight className="w-4 h-4 rotate-180" />
            )}
            Send back to {STAGE_LABELS[getPreviousStage()]}
          </button>
        )}
        {canEscalate && getNextStage() && !(order.currentStage === ORDER_STAGES.PROCUREMENT && getNextStage() === ORDER_STAGES.FINANCE) && (
          <button
            onClick={async () => {
              setIsEscalating(`next-${getNextStage()}`);
              try {
                await onEscalate(getNextStage(), false);
              } finally {
                setIsEscalating(null);
              }
            }}
            disabled={isEscalating !== null}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold rounded-lg shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
          >
            {isEscalating === `next-${getNextStage()}` ? (
              <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
            ) : (
              <Send className="w-4 h-4" />
            )}
            Escalate to {STAGE_LABELS[getNextStage()]}
          </button>
        )}
        {canEscalate && Object.values(ORDER_STAGES).indexOf(order.currentStage) < Object.values(ORDER_STAGES).indexOf(ORDER_STAGES.DISPATCH) && !(order.items || []).some(item => (item.shortQty || 0) > 0 && item.itemType !== 'service') && (
          <button
            onClick={async () => {
              setIsEscalating(`straight-dispatch`);
              try {
                await onEscalate(ORDER_STAGES.DISPATCH, false);
              } finally {
                setIsEscalating(null);
              }
            }}
            disabled={isEscalating !== null}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-lg shadow-lg shadow-blue-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
          >
            {isEscalating === `straight-dispatch` ? (
              <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
            ) : (
              <Zap className="w-4 h-4" />
            )}
            Straight to Dispatch
          </button>
        )}
        {hasPermission(PERMISSIONS.EDIT_ORDERS) && (
          <button
            onClick={onEdit}
            className="flex items-center gap-2 px-4 py-2 bg-amber-500/10 text-amber-400 border border-amber-500/20 font-semibold rounded-lg hover:bg-amber-500 hover:text-white transition-all shadow-lg hover:shadow-amber-500/20 active:scale-[0.98]"
          >
            <Edit2 className="w-4 h-4" />
            Edit
          </button>
        )}
        {hasPermission(PERMISSIONS.DELETE_ORDERS) && (
          <button
            onClick={async () => {
              if (window.confirm('Are you sure you want to delete this order? It will be soft deleted and hidden from the dashboard.')) {
                setIsDeletingOrder(true);
                try {
                  await onDelete(order.id);
                } finally {
                  setIsDeletingOrder(false);
                }
              }
            }}
            disabled={isDeletingOrder}
            className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-400 border border-red-500/20 font-semibold rounded-lg hover:bg-red-500 hover:text-white transition-all shadow-lg hover:shadow-red-500/20 active:scale-[0.98] disabled:opacity-50"
          >
            {isDeletingOrder ? <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></span> : <Trash2 className="w-4 h-4" />}
            {isDeletingOrder ? 'Deleting...' : 'Delete'}
          </button>
        )}
      </div>

      <div className="flex gap-2 border-b border-slate-800">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2.5 text-sm font-medium transition-colors capitalize ${activeTab === tab ? 'text-emerald-400 border-b-2 border-emerald-400' : 'text-slate-400 hover:text-white'
              }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-8">
        {activeTab === 'overview' && (
          <OverviewTab order={order} hasPermission={hasPermission} />
        )}

        {activeTab === 'boq' && (
          <BOQTab order={order} hasPermission={hasPermission} onExportBOQ={handleExportBOQ} />
        )}

        {activeTab === 'inventory' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-white">Stores — Inventory Check</h3>
                <p className="text-xs text-slate-400 mt-1">Review stock and set Short Qty for items that need procurement</p>
              </div>
              {hasPermission(PERMISSIONS.EDIT_STORES) && !editingInventory && (
                <button onClick={() => setEditingInventory(true)} className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-400 border border-amber-500/30 rounded-xl text-sm font-semibold">
                  <Edit2 className="w-4 h-4" /> Set Short Qty
                </button>
              )}
            </div>

            {editingInventory ? (
              <StoresInventoryForm
                items={order.items || []}
                onSave={saveInventory}
                onCancel={() => setEditingInventory(false)}
              />
            ) : (
              <div className="space-y-4">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[600px]">
                    <thead>
                      <tr className="border-b border-slate-800">
                        <th className="text-left p-3 text-[10px] font-bold text-slate-500 uppercase">#</th>
                        <th className="text-left p-3 text-[10px] font-bold text-slate-500 uppercase">Item</th>
                        <th className="text-center p-3 text-[10px] font-bold text-slate-500 uppercase">BOQ Qty</th>
                        <th className="text-center p-3 text-[10px] font-bold text-amber-400 uppercase">Short Qty</th>
                        <th className="text-center p-3 text-[10px] font-bold text-emerald-400 uppercase">Available</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/50">
                      {(order.items || []).map((item, idx) => (
                        <tr key={item.id} className={`${item.shortQty > 0 ? 'bg-amber-500/[0.03]' : ''} ${item.parentItemIndex ? 'bg-slate-800/20' : ''}`}>
                          <td className="p-3 text-sm text-slate-500 font-mono">{item.parentItemIndex ? '└' : idx + 1}</td>
                          <td className="p-3">
                            <span className={`text-sm font-medium ${item.parentItemIndex ? 'text-slate-400 pl-4' : 'text-white'}`}>{item.name}</span>
                            <span className="text-[10px] text-slate-500 font-mono ml-2">{item.itemCode || ''}</span>
                          </td>
                          <td className="p-3 text-center text-sm text-white font-mono">{item.quantity} {item.unit}</td>
                          <td className="p-3 text-center text-sm font-mono font-bold text-amber-400">{item.shortQty || 0}</td>
                          <td className="p-3 text-center text-sm font-mono text-emerald-400">{Math.round(item.quantity - (item.shortQty || 0))}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {(order.items || []).some(i => i.shortQty > 0) && (
                  <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-3 flex items-center gap-2">
                    <Package className="w-4 h-4 text-amber-400" />
                    <p className="text-xs text-slate-400">
                      <strong className="text-amber-400">{(order.items || []).filter(i => i.shortQty > 0).length} item(s)</strong> with shortage — will be sent to Procurement when escalated.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === 'procurement' && (
          <ProcurementTab 
            order={order}
            hasPermission={hasPermission}
            editingProcurement={editingProcurement}
            setEditingProcurement={setEditingProcurement}
            procurementData={procurementData}
            escalatedPoNumbers={escalatedPoNumbers}
            canEscalate={canEscalate}
            handleEscalatePOToFinance={handleEscalatePOToFinance}
            escalatingPO={escalatingPO}
            currentUser={currentUser}
            ProcurementForm={ProcurementForm}
            saveProcurement={saveProcurement}
          />
        )}

        {(activeTab === 'finance' || activeTab === 'payments') && (
          <FinanceTab 
            order={order}
            activeTab={activeTab}
            financeData={financeData}
            setEditingFinanceItemId={setEditingFinanceItemId}
            editingFinanceItemId={editingFinanceItemId}
            isSubmittingFinance={isSubmittingFinance}
            saveFinance={saveFinance}
            updateFinanceItem={updateFinanceItem}
            hasPermission={hasPermission}
            PERMISSIONS={PERMISSIONS}
          />
        )}

        {activeTab === 'invoicing' && (
          <InvoicingTab 
            order={order}
            editingInvoice={editingInvoice}
            setEditingInvoice={setEditingInvoice}
            invoiceData={invoiceData}
            saveInvoice={saveInvoice}
            InvoicingForm={InvoicingForm}
            hasPermission={hasPermission}
          />
        )}

        {activeTab === 'delivery' && (
          <DeliveryTab 
            order={order}
            editingDelivery={editingDelivery}
            setEditingDelivery={setEditingDelivery}
            deliveryData={deliveryData}
            saveDelivery={saveDelivery}
            DeliveryForm={DeliveryForm}
            hasPermission={hasPermission}
          />
        )}

        {activeTab === 'installation' && (
          <InstallationTab 
            order={order}
            editingInstallation={editingInstallation}
            setEditingInstallation={setEditingInstallation}
            installationData={installationData}
            saveInstallation={saveInstallation}
            InstallationForm={InstallationForm}
            hasPermission={hasPermission}
          />
        )}

        {activeTab === 'stores' && (
          <StoresTab 
            order={order}
            editingStores={editingStores}
            setEditingStores={setEditingStores}
            storesData={storesData}
            saveStores={saveStores}
            StoresForm={StoresForm}
            hasPermission={hasPermission}
            canEscalate={canEscalate}
            onEscalate={onEscalate}
            isEscalating={isEscalating}
          />
        )}

        {activeTab === 'dispatch' && (
          <DispatchTab 
            order={order}
            editingDispatch={editingDispatch}
            setEditingDispatch={setEditingDispatch}
            dispatchData={dispatchData}
            saveDispatch={saveDispatch}
            DispatchForm={DispatchForm}
            hasPermission={hasPermission}
          />
        )}

        {activeTab === 'history' && (
          <HistoryTab order={order} />
        )}

        {activeTab === 'planning' && hasPermission(PERMISSIONS.VIEW_PLANNING) && (
          <OrderPlanningTab order={order} onUpdate={onUpdate} currentUser={currentUser} canEdit={hasPermission(PERMISSIONS.EDIT_PLANNING)} />
        )}
      </div>
    </div>
  );
}
