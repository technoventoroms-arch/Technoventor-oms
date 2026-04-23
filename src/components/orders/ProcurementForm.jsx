import React, { useState, useMemo } from 'react';
import { Package, ChevronDown, Plus, Trash2, CheckCircle2, AlertTriangle, Lock } from 'lucide-react';
import { PO_STATUS_OPTIONS, DEPARTMENTS } from '../../constants';
import { FormField } from '../common';

export function ProcurementForm({ initialData, boqItems, onSave, onCancel, escalatedPoNumbers = new Set(), currentUser }) {
  const [submittingAction, setSubmittingAction] = useState(null);

  // Only show items that have short_qty > 0 (need procurement) and are 'goods' (not services)
  const shortItems = useMemo(() =>
    boqItems.filter(item => (item.shortQty || 0) > 0 && item.itemType !== 'service'),
    [boqItems]
  );

  // Build initial POs from existing procurement data
  const [purchaseOrders, setPurchaseOrders] = useState(() => {
    if (initialData?.boqPurchases?.length > 0) {
      // Group existing purchases by PO number (or vendor name as fallback)
      const poMap = new Map();
      initialData.boqPurchases.forEach(p => {
        // Only group items that actually have some vendor or PO information
        const key = p.poDetails?.poNumber || p.vendorDetails?.name;
        if (!key) return; // Skip items that are essentially unassigned

        if (!poMap.has(key)) {
          poMap.set(key, {
            id: `po-${Date.now()}-${Math.random()}`,
            vendorDetails: { ...p.vendorDetails },
            poDetails: { ...p.poDetails },
            paymentAndDelivery: { ...p.paymentAndDelivery },
            boqItemIds: []
          });
        }
        poMap.get(key).boqItemIds.push(p.boqItemId);
      });
      return Array.from(poMap.values());
    }
    return [];
  });

  const [expandedPO, setExpandedPO] = useState(purchaseOrders.length > 0 ? purchaseOrders[0].id : null);

  // Get items not yet assigned to any PO
  const unassignedItems = useMemo(() => {
    const assignedIds = new Set(purchaseOrders.flatMap(po => po.boqItemIds));
    return shortItems.filter(item => !assignedIds.has(item.id));
  }, [shortItems, purchaseOrders]);

  const addNewPO = () => {
    const newPO = {
      id: Date.now(),
      vendorDetails: { name: '', code: '', contactPerson: '', contactNumber: '', email: '', address: '', gstNumber: '' },
      poDetails: { poNumber: '', poDate: '', poValue: '', poStatus: 'Draft' },
      paymentAndDelivery: { paymentType: '', creditDays: '', paymentNotes: '', deliveryMethod: '', expectedDeliveryDate: '' },
      boqItemIds: []
    };
    setPurchaseOrders(prev => [...prev, newPO]);
    setExpandedPO(newPO.id);
  };

  const removePO = (poId) => {
    setPurchaseOrders(prev => prev.filter(po => po.id !== poId));
  };

  const updatePO = (poId, section, field, value) => {
    setPurchaseOrders(prev => prev.map(po =>
      po.id === poId ? { ...po, [section]: { ...po[section], [field]: value } } : po
    ));
  };

  const toggleItemInPO = (poId, itemId) => {
    setPurchaseOrders(prev => {
      // 1. First, check if item is in any OTHER PO and remove it (Stealing behavior)
      let next = prev.map(po => {
        if (po.id === poId) return po;
        return {
          ...po,
          boqItemIds: po.boqItemIds.filter(id => id !== itemId)
        };
      });

      // 2. Then toggle in current PO
      return next.map(po => {
        if (po.id !== poId) return po;
        const has = po.boqItemIds.includes(itemId);
        return {
          ...po,
          boqItemIds: has ? po.boqItemIds.filter(id => id !== itemId) : [...po.boqItemIds, itemId]
        };
      });
    });
  };

  // Convert PO-centric data back to per-BOQ format for backend compatibility
  const handleSave = async (actionType) => {
    setSubmittingAction(actionType);
    try {
      const boqPurchases = [];
      purchaseOrders.forEach(po => {
        po.boqItemIds.forEach(boqItemId => {
          boqPurchases.push({
            boqItemId,
            vendorDetails: { ...po.vendorDetails },
            quotationDetails: { quotationNumber: '', quotationDate: '', rfqNumber: '', rfqDate: '' },
            poDetails: { 
              ...po.poDetails,
              poStatus: actionType === 'submit' ? 'Pending Approval' : po.poDetails.poStatus 
            },
            paymentAndDelivery: { ...po.paymentAndDelivery }
          });
        });
      });
      await onSave({ boqPurchases });
    } finally {
      setSubmittingAction(null);
    }
  };

  const inputCls = "w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/40";

  const totalPOs = purchaseOrders.length;
  const assignedCount = purchaseOrders.reduce((sum, po) => sum + po.boqItemIds.length, 0);

  return (
    <div className="space-y-3 pb-20">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5 px-1">
        <div className="p-2 bg-emerald-500/10 rounded-xl"><Package className="w-5 h-5 text-emerald-400" /></div>
        <div>
          <h2 className="text-base font-bold text-white">Purchase Orders — Vendor Grouped</h2>
          <p className="text-xs text-slate-400">Create POs per vendor. Assign multiple BOQ items to a single PO to avoid repetition.</p>
        </div>
        <div className="ml-auto flex items-center gap-3">
          <div className="text-xs px-3 py-1.5 bg-slate-800 rounded-lg text-slate-400 border border-slate-700">
            {totalPOs} PO{totalPOs !== 1 ? 's' : ''} • {assignedCount}/{shortItems.length} items assigned
          </div>
        </div>
      </div>

      {/* Summary of short items needing procurement */}
      {shortItems.length > 0 && (
        <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-4 flex items-start gap-3 mb-4">
          <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-xs text-slate-400">
              <strong className="text-amber-400">{shortItems.length} item(s)</strong> need procurement (Short Qty &gt; 0). Assign them to POs below.
            </p>
            <div className="flex flex-wrap gap-2 mt-2">
              {shortItems.map(item => {
                const isAssigned = purchaseOrders.some(po => po.boqItemIds.includes(item.id));
                return (
                  <span key={item.id} className={`text-[10px] font-bold px-2 py-1 rounded-lg border ${isAssigned
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                    : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}>
                    {item.name} ({item.shortQty} {item.unit})
                    {isAssigned && <CheckCircle2 className="w-3 h-3 inline ml-1" />}
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Unassigned items warning */}
      {unassignedItems.length > 0 && totalPOs > 0 && (
        <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-3 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />
          <p className="text-xs text-red-400 font-medium">
            {unassignedItems.length} item(s) still not assigned to any PO: {unassignedItems.map(i => i.name).join(', ')}
          </p>
        </div>
      )}

      {/* PO Cards */}
      {purchaseOrders.map((po, poIndex) => {
        const isExpanded = expandedPO === po.id;
        const assignedItems = shortItems.filter(item => po.boqItemIds.includes(item.id));
        const poKey = po.poDetails?.poNumber || po.vendorDetails?.name;
        const isAdmin = currentUser?.department === DEPARTMENTS.ADMIN;
        const isLocked = poKey && escalatedPoNumbers.has(poKey) && !isAdmin;

        return (
          <div key={po.id} className={`border rounded-2xl overflow-hidden transition-all duration-200 ${isLocked ? 'border-blue-500/20 opacity-80' : isExpanded ? 'border-emerald-500/30 shadow-lg shadow-emerald-500/5' : 'border-slate-800 hover:border-slate-700'}`}>
            {/* PO Header */}
            <button
              onClick={() => !isLocked && setExpandedPO(isExpanded ? null : po.id)}
              className={`w-full flex items-center gap-4 px-5 py-4 bg-slate-900/50 transition-colors text-left ${isLocked ? 'cursor-default' : 'hover:bg-slate-800/40'}`}
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 flex items-center justify-center text-sm font-black text-emerald-400 flex-shrink-0">
                P{poIndex + 1}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-white text-sm">
                    {po.vendorDetails?.name || 'New Purchase Order'}
                  </span>
                  {po.poDetails?.poNumber && (
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      PO: {po.poDetails.poNumber}
                    </span>
                  )}
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                    {assignedItems.length} item{assignedItems.length !== 1 ? 's' : ''}
                  </span>
                  {isLocked && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center gap-1">
                      <Lock className="w-3 h-3" /> Sent to Finance
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 mt-0.5">
                  {po.poDetails?.poValue && (
                    <span className="text-xs text-emerald-400/70 font-mono">₹{Number(po.poDetails.poValue).toLocaleString('en-IN')}</span>
                  )}
                  {assignedItems.length > 0 && (
                    <span className="text-xs text-slate-500 truncate">{assignedItems.map(i => i.name).join(', ')}</span>
                  )}
                </div>
              </div>
              {!isLocked && (
                <button
                  onClick={(e) => { e.stopPropagation(); removePO(po.id); }}
                  className="p-2 text-slate-600 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors flex-shrink-0"
                  title="Remove this PO"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
              {!isLocked && <ChevronDown className={`w-5 h-5 text-slate-400 flex-shrink-0 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />}
            </button>

            {/* Expanded PO Form */}
            {isExpanded && !isLocked && (
              <div className="border-t border-slate-800/50 bg-slate-950/20 p-5 space-y-8">
                {/* 1. Select BOQ Items for this PO */}
                <div className="space-y-3">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                    <span className="w-4 h-4 rounded bg-blue-500/10 flex items-center justify-center text-blue-400">1</span>
                    Select BOQ Items for this PO
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {shortItems.map(item => {
                      const isSelected = po.boqItemIds.includes(item.id);
                      const isAssignedElsewhere = !isSelected && purchaseOrders.some(other => other.id !== po.id && other.boqItemIds.includes(item.id));
                      return (
                        <button
                          key={item.id}
                          onClick={() => toggleItemInPO(po.id, item.id)}
                          className={`flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all border ${isSelected
                              ? 'bg-emerald-500/10 border-emerald-500/30 text-white'
                              : isAssignedElsewhere
                                ? 'bg-amber-500/5 border-amber-500/20 text-slate-400 hover:border-amber-500/40'
                                : 'bg-slate-900/50 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-white'
                            }`}
                        >
                          <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${isSelected ? 'bg-emerald-500 border-emerald-500' : isAssignedElsewhere ? 'border-amber-500/50' : 'border-slate-600'
                            }`}>
                            {isSelected && <CheckCircle2 className="w-3 h-3 text-white" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              {item.parentItemIndex && <span className="text-slate-600 text-[10px]">└</span>}
                              <span className={`text-sm font-medium block truncate ${item.parentItemIndex ? 'text-slate-400' : ''}`}>{item.name}</span>
                            </div>
                            <span className="text-[10px] text-slate-500">
                              Short: {item.shortQty} {item.unit}
                              {isAssignedElsewhere && <span className="text-amber-500/70 ml-2">(assigned to another PO - click to move here)</span>}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Vendor Details */}
                <div className="space-y-4 pt-4 border-t border-slate-800/50">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                    <span className="w-4 h-4 rounded bg-emerald-500/10 flex items-center justify-center text-emerald-400">2</span>
                    Vendor Information
                  </p>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <FormField label="Vendor Name">
                      <input type="text" value={po.vendorDetails?.name || ''} onChange={e => updatePO(po.id, 'vendorDetails', 'name', e.target.value)} className={inputCls} placeholder="e.g. Godrej Interio" />
                    </FormField>
                  </div>
                </div>

                {/* 3. PO Details */}
                <div className="space-y-4 pt-4 border-t border-slate-800/50">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                    <span className="w-4 h-4 rounded bg-purple-500/10 flex items-center justify-center text-purple-400">3</span>
                    Purchase Order Details
                  </p>
                  <div className={`grid grid-cols-1 ${isAdmin ? 'lg:grid-cols-4' : 'lg:grid-cols-3'} gap-4`}>
                    <FormField label="PO Number">
                      <input type="text" value={po.poDetails?.poNumber || ''} onChange={e => updatePO(po.id, 'poDetails', 'poNumber', e.target.value)} className={inputCls} />
                    </FormField>
                    <FormField label="PO Date">
                      <input type="date" value={po.poDetails?.poDate || ''} onChange={e => updatePO(po.id, 'poDetails', 'poDate', e.target.value)} className={inputCls} />
                    </FormField>
                    <FormField label="PO Value">
                      <input type="number" value={po.poDetails?.poValue || ''} onChange={e => updatePO(po.id, 'poDetails', 'poValue', e.target.value)} className={inputCls} placeholder="0.00" />
                    </FormField>
                    {isAdmin && (
                      <FormField label="PO Status">
                        <select 
                          value={po.poDetails?.poStatus || 'Draft'} 
                          onChange={e => updatePO(po.id, 'poDetails', 'poStatus', e.target.value)} 
                          className={inputCls}
                        >
                          {PO_STATUS_OPTIONS.map(status => (
                            <option key={status} value={status}>{status}</option>
                          ))}
                        </select>
                      </FormField>
                    )}
                  </div>
                </div>

                {/* 4. Payment & Delivery */}
                <div className="space-y-4 pt-4 border-t border-slate-800/50">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                    <span className="w-4 h-4 rounded bg-amber-500/10 flex items-center justify-center text-amber-400">4</span>
                    Payment & Delivery
                  </p>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <FormField label="Payment Type">
                      <select value={po.paymentAndDelivery?.paymentType || ''} onChange={e => updatePO(po.id, 'paymentAndDelivery', 'paymentType', e.target.value)} className={inputCls}>
                        <option value="">Select</option>
                        <option value="Cash">Cash</option>
                        <option value="Credit Card">Credit Card</option>
                        <option value="Bank Transfer">Bank Transfer</option>
                      </select>
                    </FormField>
                    <FormField label="Credit Days">
                      <input type="number" min="0" value={po.paymentAndDelivery?.creditDays || ''} onChange={e => updatePO(po.id, 'paymentAndDelivery', 'creditDays', e.target.value)} className={inputCls} />
                    </FormField>
                    <div className="lg:col-span-2">
                      <FormField label="Payment Notes / Conditions">
                        <textarea value={po.paymentAndDelivery?.paymentNotes || ''} onChange={e => updatePO(po.id, 'paymentAndDelivery', 'paymentNotes', e.target.value)} className={inputCls} rows={2} />
                      </FormField>
                    </div>
                    <FormField label="Delivery Method">
                      <select value={po.paymentAndDelivery?.deliveryMethod || ''} onChange={e => updatePO(po.id, 'paymentAndDelivery', 'deliveryMethod', e.target.value)} className={inputCls}>
                        <option value="">Select</option>
                        <option value="Manual">Manual</option>
                        <option value="Transport">Transport</option>
                        <option value="Courier">Courier</option>
                      </select>
                    </FormField>
                    <FormField label="Expected Delivery Date">
                      <input type="date" value={po.paymentAndDelivery?.expectedDeliveryDate || ''} onChange={e => updatePO(po.id, 'paymentAndDelivery', 'expectedDeliveryDate', e.target.value)} className={inputCls} />
                    </FormField>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}

      {/* Add PO button */}
      <button
        onClick={addNewPO}
        className="w-full py-4 border-2 border-dashed border-slate-700 rounded-2xl text-slate-400 hover:text-emerald-400 hover:border-emerald-500/30 hover:bg-emerald-500/5 transition-all flex items-center justify-center gap-2 text-sm font-bold"
      >
        <Plus className="w-4 h-4" />
        Add New Purchase Order (1 Vendor = 1 PO)
      </button>

      {/* Actions */}
      <div className="flex flex-col lg:flex-row gap-4 items-center justify-end border-t border-slate-800 pt-8 mt-8">
        <button onClick={onCancel} disabled={submittingAction} className="flex-1 lg:flex-none px-8 py-3 border border-slate-700 rounded-xl text-slate-300 font-semibold hover:bg-slate-800 disabled:opacity-50">Cancel</button>
        <button onClick={() => handleSave('draft')} disabled={submittingAction} className="flex flex-1 lg:flex-none justify-center items-center gap-2 px-8 py-3 bg-slate-800 text-white rounded-xl font-semibold border border-slate-700 hover:bg-slate-700 disabled:opacity-50">
          {submittingAction === 'draft' ? <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></span> : null}
          {submittingAction === 'draft' ? 'Saving...' : 'Save Draft'}
        </button>
        <button onClick={() => handleSave('submit')} disabled={submittingAction} className="flex flex-1 lg:flex-none justify-center items-center gap-2 px-8 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-black shadow-lg shadow-emerald-500/20 disabled:opacity-50">
          {submittingAction === 'submit' ? <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></span> : null}
          {submittingAction === 'submit' ? 'Submitting...' : 'Submit for Approval'}
        </button>
      </div>
    </div>
  );
}
