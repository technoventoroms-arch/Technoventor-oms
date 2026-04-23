import React, { useState, useMemo } from 'react';
import { Warehouse, ChevronDown, CheckCircle2, AlertCircle, Package, CreditCard, Send } from 'lucide-react';
import { FormField } from '../common';

export function StoresForm({ initialData, boqItems, order, onSave, onCancel, canEscalate }) {
  const [submittingAction, setSubmittingAction] = useState(null);
  // Group items by PO from procurement data
  const poGroups = useMemo(() => {
    const purchases = order?.procurement?.boqPurchases || [];
    const financeData = order?.finance || [];
    const groups = new Map();

    purchases.forEach(p => {
      const poKey = p.poDetails?.poNumber || p.vendorDetails?.name || 'unassigned';
      if (!groups.has(poKey)) {
        const finRecord = financeData.find(f => f.poNumber === p.poDetails?.poNumber) || {};
        const isApproved = finRecord.paymentStatus === 'Completed';
        
        // Only include POs that have been fully approved by finance
        if (isApproved || poKey === '_in_stock') {
          groups.set(poKey, {
            poNumber: p.poDetails?.poNumber || '',
            vendorName: p.vendorDetails?.name || 'Unknown',
            poValue: p.poDetails?.poValue || '',
            approved: true,
            items: []
          });
        }
      }
      const boqItem = boqItems.find(i => i.id === p.boqItemId);
      if (boqItem && groups.has(poKey)) groups.get(poKey).items.push(boqItem);
    });

    // Clean up empty groups just in case
    for (const [key, val] of groups.entries()) {
      if (val.items.length === 0) groups.delete(key);
    }

    return groups;
  }, [order, boqItems]);

  const [inwards, setInwards] = useState(() => {
    const emptyInward = (item) => ({
      boqItemId: item.id,
      inwardDate: '',
      grnNumber: '',
      qualityCheckStatus: 'Pending',
      receivedQuantity: '',
      damageReport: '',
      storageLocation: '',
      remarks: ''
    });
    
    if (initialData?.boqInwards?.length > 0) {
      return boqItems.map(item => {
        const existing = initialData.boqInwards.find(i => i.boqItemId === item.id);
        return existing || emptyInward(item);
      });
    }
    return boqItems.map(emptyInward);
  });

  const [expandedPO, setExpandedPO] = useState(() => {
    const keys = Array.from(poGroups.keys());
    return keys.length > 0 ? keys[0] : null;
  });

  const updateInward = (boqItemId, field, value) => {
    setInwards(prev => prev.map(i => 
      i.boqItemId === boqItemId ? { ...i, [field]: value } : i
    ));
  };

  const getInward = (boqItemId) => inwards.find(i => i.boqItemId === boqItemId) || {};

  const filledCount = inwards.filter(i => i.inwardDate || i.grnNumber).length;

  const handleSave = async (actionType) => {
    setSubmittingAction(actionType);
    try {
      await onSave({ boqInwards: inwards }, actionType === 'escalate');
    } finally {
      setSubmittingAction(null);
    }
  };

  const inputCls = "w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/40";

  return (
    <div className="space-y-3 pb-20">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5 px-1">
        <div className="p-2 bg-cyan-500/10 rounded-xl"><Warehouse className="w-5 h-5 text-cyan-400" /></div>
        <div>
          <h2 className="text-base font-bold text-white">Expected Delivery Items</h2>
          <p className="text-xs text-slate-400">Record inward details for POs whose payment is completed</p>
        </div>
        <div className="ml-auto text-xs px-3 py-1.5 bg-slate-800 rounded-lg text-slate-400 border border-slate-700">
          {filledCount}/{inwards.length} items recorded
        </div>
      </div>

      {/* PO-grouped cards */}
      {Array.from(poGroups.entries()).map(([poKey, poGroup]) => {
        const isExpanded = expandedPO === poKey;
        const groupInwards = poGroup.items.map(item => getInward(item.id));
        const groupFilled = groupInwards.filter(i => i.inwardDate || i.grnNumber).length;

        return (
          <div key={poKey} className={`border rounded-2xl overflow-hidden transition-all duration-200 ${isExpanded ? 'border-cyan-500/30 shadow-lg shadow-cyan-500/5' : 'border-slate-800 hover:border-slate-700'}`}>
            {/* PO Header */}
            <button
              onClick={() => setExpandedPO(isExpanded ? null : poKey)}
              className="w-full flex items-center gap-4 px-5 py-4 bg-slate-900/50 hover:bg-slate-800/40 transition-colors text-left"
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center border text-sm font-black flex-shrink-0 ${
                poGroup.approved
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                  : 'bg-slate-800 border-slate-700 text-slate-500'
              }`}>
                {poKey === '_in_stock' ? '✓' : <CreditCard className="w-5 h-5" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-white text-sm">{poGroup.vendorName}</span>
                  {poGroup.poNumber && (
                    <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                      PO: {poGroup.poNumber}
                    </span>
                  )}
                  {poGroup.approved ? (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      Payment Completed
                    </span>
                  ) : null}
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                    {groupFilled}/{poGroup.items.length} inwarded
                  </span>
                </div>
                <div className="flex items-center gap-3 mt-0.5">
                  {poGroup.poValue && <span className="text-xs text-emerald-400/70 font-mono">₹{Number(poGroup.poValue).toLocaleString('en-IN')}</span>}
                  <span className="text-xs text-slate-500 truncate">{poGroup.items.map(i => i.name).join(', ')}</span>
                </div>
              </div>
              <ChevronDown className={`w-5 h-5 text-slate-400 flex-shrink-0 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
            </button>

            {/* Expanded: items in this PO */}
            {isExpanded && (
              <div className="border-t border-slate-800/50 bg-slate-950/20 divide-y divide-slate-800/30">
                {poGroup.items.map((item, index) => {
                  const inward = getInward(item.id);
                  const hasData = inward.inwardDate || inward.grnNumber;

                  return (
                    <div key={item.id} className="p-5 space-y-4">
                      {/* Item label */}
                      <div className={`flex items-center gap-3 ${item.parentItemIndex ? 'ml-8' : ''}`}>
                        <span className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-slate-400 flex-shrink-0">
                          {item.parentItemIndex ? '└' : index + 1}
                        </span>
                        <div>
                          <span className={`font-semibold text-sm ${item.parentItemIndex ? 'text-slate-400' : 'text-white'}`}>{item.name}</span>
                          <span className="text-[10px] font-mono text-slate-500 ml-2">{item.itemCode || ''}</span>
                        </div>
                        <span className="text-xs text-slate-500 font-mono ml-auto">{item.shortQty || item.quantity} {item.unit}</span>
                        {hasData && <CheckCircle2 className="w-4 h-4 text-cyan-400" />}
                      </div>

                      {/* Inward Fields */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-10">
                        <FormField label="Inward Date">
                          <input type="date" value={inward.inwardDate || ''} onChange={e => updateInward(item.id, 'inwardDate', e.target.value)} className={inputCls} />
                        </FormField>
                        <FormField label="GRN Number">
                          <input type="text" value={inward.grnNumber || ''} onChange={e => updateInward(item.id, 'grnNumber', e.target.value)} className={inputCls} placeholder="e.g. GRN/2024/001" />
                        </FormField>
                        <FormField label="Quality Check Status">
                          <select value={inward.qualityCheckStatus || 'Pending'} onChange={e => updateInward(item.id, 'qualityCheckStatus', e.target.value)} className={inputCls}>
                            <option value="Pending">Pending</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Passed">Passed</option>
                            <option value="Failed">Failed</option>
                          </select>
                        </FormField>
                        <FormField label="Received Quantity">
                          <select value={inward.receivedQuantity || ''} onChange={e => updateInward(item.id, 'receivedQuantity', e.target.value)} className={inputCls}>
                            <option value="">Select</option>
                            <option value="Full">Full</option>
                            <option value="Partial">Partial</option>
                            <option value="None">None</option>
                          </select>
                        </FormField>
                        <FormField label="Storage Location">
                          <input type="text" value={inward.storageLocation || ''} onChange={e => updateInward(item.id, 'storageLocation', e.target.value)} className={inputCls} placeholder="e.g. Bin A-15" />
                        </FormField>
                        <FormField label="Damage Report">
                          <input type="text" value={inward.damageReport || ''} onChange={e => updateInward(item.id, 'damageReport', e.target.value)} className={inputCls} placeholder="Detail any damages found" />
                        </FormField>
                        <div className="md:col-span-2">
                          <FormField label="Remarks">
                            <textarea value={inward.remarks || ''} onChange={e => updateInward(item.id, 'remarks', e.target.value)} className={inputCls} rows={2} placeholder="Additional notes..." />
                          </FormField>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}

      {/* Fallback if no PO groups (legacy orders) */}
      {poGroups.size === 0 && (
        <div className="text-center py-12 bg-slate-900/50 border border-dashed border-slate-800 rounded-2xl">
          <Warehouse className="w-10 h-10 text-slate-700 mx-auto mb-3" />
          <p className="text-sm text-slate-500 font-bold">No items to inward</p>
          <p className="text-xs text-slate-600 mt-1">Items will appear here after procurement and finance approval.</p>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-end border-t border-slate-800 pt-8 mt-8">
        <button onClick={onCancel} disabled={submittingAction} className="flex-1 md:flex-none px-8 py-3 border border-slate-700 rounded-xl text-slate-300 font-semibold hover:bg-slate-800 disabled:opacity-50">Cancel</button>
        <button onClick={() => handleSave('draft')} disabled={submittingAction} className="flex flex-1 md:flex-none justify-center items-center gap-2 px-8 py-3 bg-slate-800 text-white rounded-xl font-semibold border border-slate-700 hover:bg-slate-700 disabled:opacity-50">
          {submittingAction === 'draft' ? <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></span> : null}
          {submittingAction === 'draft' ? 'Saving...' : 'Save Draft'}
        </button>
        <button onClick={() => handleSave('submit')} disabled={submittingAction} className="flex flex-1 md:flex-none justify-center items-center gap-2 px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl font-black shadow-lg shadow-cyan-500/20 disabled:opacity-50">
          {submittingAction === 'submit' ? <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></span> : null}
          {submittingAction === 'submit' ? 'Submitting...' : 'Complete Inward'}
        </button>
        {canEscalate && order.currentStage === 'stores_inward' && (
          <button onClick={() => handleSave('escalate')} disabled={submittingAction} title="Saves the form and moves order to Dispatch" className="flex flex-1 md:flex-none justify-center items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl font-black shadow-lg shadow-blue-600/20 disabled:opacity-50">
            {submittingAction === 'escalate' ? <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></span> : <Send className="w-4 h-4" />}
            {submittingAction === 'escalate' ? 'Escalating...' : 'Complete & Escalate to Dispatch'}
          </button>
        )}
      </div>
    </div>
  );
}
