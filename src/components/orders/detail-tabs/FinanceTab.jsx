import React from 'react';
import { CreditCard, Package, CheckCircle2 } from 'lucide-react';
import { InfoCard, FormField } from '../../common';
import { ORDER_STAGES } from '../../../constants';

export function FinanceTab({ order, activeTab, financeData, setEditingFinanceItemId, editingFinanceItemId, isSubmittingFinance, saveFinance, updateFinanceItem, hasPermission, PERMISSIONS }) {
  const allPurchases = order.procurement?.boqPurchases || [];
  // Only show POs that have been escalated from Procurement
  const purchases = allPurchases.filter(p => 
    order.currentStage === ORDER_STAGES.FINANCE ||
    p.poDetails?.poStatus === 'Pending Approval' || 
    p.poDetails?.poStatus === 'Finance Approved' ||
    (order.finance || []).some(f => f.boqItemId === p.boqItemId && f.paymentStatus !== 'Pending')
  );
  const pendingEscalationCount = allPurchases.length - purchases.length;

  if (purchases.length === 0) {
    return (
      <div className="text-center py-20 bg-slate-900 border border-dashed border-slate-800 rounded-3xl">
        <CreditCard className="w-12 h-12 text-slate-700 mx-auto mb-4 opacity-20" />
        <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">
          {allPurchases.length > 0 ? 'Awaiting PO Escalation' : 'Awaiting Procurement Data'}
        </p>
        <p className="text-xs text-slate-600 mt-2">
          {allPurchases.length > 0 
            ? `${pendingEscalationCount} PO(s) are still with Procurement. They will appear here once escalated.`
            : 'Payments can be recorded once POs are generated.'}
        </p>
      </div>
    );
  }

  // Group purchases by PO number
  const poGroups = new Map();
  purchases.forEach(p => {
    const poKey = p.poDetails?.poNumber || p.vendorDetails?.name || 'unassigned';
    if (!poGroups.has(poKey)) {
      poGroups.set(poKey, {
        poNumber: p.poDetails?.poNumber || '',
        vendorName: p.vendorDetails?.name || 'Unassigned',
        poValue: p.poDetails?.poValue || '',
        poDate: p.poDetails?.poDate || '',
        items: []
      });
    }
    const boqItem = (order.items || []).find(i => i.id === p.boqItemId) || {};
    poGroups.get(poKey).items.push({ ...p, boqItem });
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center border border-emerald-500/20">
            <CreditCard className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white tracking-tight">
              {activeTab === 'payments' ? 'PO-wise Payment Approval' : 'Finance Dashboard'}
            </h3>
            <p className="text-slate-500 text-xs font-medium uppercase tracking-widest mt-0.5">Approve POs one by one — No. of vendors = No. of POs</p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {pendingEscalationCount > 0 && (
          <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-3 flex items-center gap-2 mb-4">
            <Package className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <p className="text-xs text-slate-400">
              <strong className="text-amber-400">{pendingEscalationCount} PO(s)</strong> still with Procurement — will appear here once escalated.
            </p>
          </div>
        )}
        {Array.from(poGroups.entries()).map(([poKey, poGroup], idx) => {
          const representativeId = poGroup.items[0]?.boqItemId;
          const itemFinance = financeData.find(f => f.poNumber === poGroup.poNumber || f.boqItemId === representativeId) || {
            advanceApprovalDate: '', advancePaymentRef: '',
            receiptUploaded: false, receiptUrl: '',
            remarks: '', poNumber: poGroup.poNumber, paymentStatus: 'Pending'
          };
          const isEditing = editingFinanceItemId === poKey;

          return (
            <div key={poKey} className={`bg-slate-900 border transition-all duration-300 rounded-2xl overflow-hidden ${isEditing ? 'border-emerald-500/50 shadow-2xl shadow-emerald-500/10 scale-[1.01]' : 'border-slate-800'}`}>
              <div className="bg-slate-800/40 p-5 border-b border-slate-800 flex justify-between items-center bg-gradient-to-r from-slate-800/20 to-transparent">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-slate-950/50 rounded-xl flex items-center justify-center border border-slate-700/30 text-slate-400 font-mono text-xs font-bold">
                    PO{idx + 1}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white mb-1">{poGroup.vendorName}</p>
                    <div className="flex items-center gap-2">
                     <span className="text-[10px] bg-slate-800 text-emerald-400 px-2 py-0.5 rounded font-bold uppercase tracking-wider">{poGroup.poNumber || 'PO PENDING'}</span>
                     <span className="text-[10px] text-slate-500 font-bold">{poGroup.items.length} item{poGroup.items.length !== 1 ? 's' : ''}</span>
                     {poGroup.poValue && <span className="text-[10px] text-emerald-400/70 font-mono">₹{Number(poGroup.poValue).toLocaleString('en-IN')}</span>}
                    </div>
                  </div>
                </div>

                {!isEditing && hasPermission(PERMISSIONS.EDIT_FINANCE) && (
                  <button
                    onClick={() => setEditingFinanceItemId(poKey)}
                    className="group flex items-center gap-2 px-4 py-2 bg-emerald-500/10 text-emerald-400 rounded-xl text-xs font-black uppercase tracking-widest border border-emerald-500/20 hover:bg-emerald-500 hover:text-white transition-all shadow-lg hover:shadow-emerald-500/20"
                  >
                    <CreditCard className="w-3.5 h-3.5" />
                    Approve PO
                  </button>
                )}
              </div>

              <div className="p-4 border-b border-slate-800/40 bg-slate-950/10">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">BOQ Items in this PO</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {poGroup.items.map(({ boqItem }, i) => (
                    <div key={i} className="flex items-center gap-2 px-3 py-2 bg-slate-900/60 border border-slate-800 rounded-lg">
                      <Package className="w-3.5 h-3.5 text-slate-500" />
                      <span className="text-xs text-white font-medium">{boqItem.name || 'Unknown Item'}</span>
                      <span className="text-[10px] text-slate-500 font-mono ml-auto">{boqItem.shortQty || boqItem.quantity} {boqItem.unit}</span>
                    </div>
                  ))}
                </div>
              </div>

              {isEditing ? (
                <div className="p-6 bg-slate-950/20 animate-in fade-in slide-in-from-top-4 duration-500">
                  <div className="grid grid-cols-2 gap-6">
                    <FormField label="PO Value (Reference)">
                      <div className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-emerald-400 font-mono text-sm font-bold">
                        ₹{poGroup.poValue ? Number(poGroup.poValue).toLocaleString('en-IN') : '0'}
                      </div>
                    </FormField>
                    {hasPermission(PERMISSIONS.APPROVE_PAYMENTS) && (
                      <FormField label="Payment Status">
                        <select
                          value={itemFinance.paymentStatus || 'Pending'}
                          onChange={(e) => {
                            const val = e.target.value;
                            poGroup.items.forEach(({ boqItemId }) => updateFinanceItem(boqItemId || poGroup.items[0].boqItemId, { paymentStatus: val, poNumber: poGroup.poNumber }));
                          }}
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-emerald-500/40"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Partial Payment">Partial Payment</option>
                          <option value="Completed">Complete Payment</option>
                        </select>
                      </FormField>
                    )}
                    <FormField label="Approval Date">
                      <input
                        type="date"
                        value={itemFinance.advanceApprovalDate || ''}
                        onChange={(e) => poGroup.items.forEach(({ boqItemId }) => updateFinanceItem(boqItemId || poGroup.items[0].boqItemId, { advanceApprovalDate: e.target.value, poNumber: poGroup.poNumber }))}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white"
                      />
                    </FormField>
                    <FormField label="Payment Reference">
                      <input
                        type="text"
                        value={itemFinance.advancePaymentRef || ''}
                        onChange={(e) => poGroup.items.forEach(({ boqItemId }) => updateFinanceItem(boqItemId || poGroup.items[0].boqItemId, { advancePaymentRef: e.target.value, poNumber: poGroup.poNumber }))}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white font-mono"
                        placeholder="UTR / Ref Number"
                      />
                    </FormField>
                    <FormField label="Receipt Status">
                      <select
                        value={itemFinance.receiptUploaded ? 'yes' : 'no'}
                        onChange={(e) => poGroup.items.forEach(({ boqItemId }) => updateFinanceItem(boqItemId || poGroup.items[0].boqItemId, { receiptUploaded: e.target.value === 'yes', poNumber: poGroup.poNumber }))}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white"
                      >
                        <option value="no">Not Uploaded</option>
                        <option value="yes">Uploaded</option>
                      </select>
                    </FormField>
                    <div className="col-span-2">
                      <FormField label="Finance Remarks">
                        <textarea
                          value={itemFinance.remarks || ''}
                          onChange={(e) => poGroup.items.forEach(({ boqItemId }) => updateFinanceItem(boqItemId || poGroup.items[0].boqItemId, { remarks: e.target.value, poNumber: poGroup.poNumber }))}
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white"
                          rows={2}
                          placeholder="Any specific notes regarding this PO payment..."
                        />
                      </FormField>
                    </div>
                  </div>
                  <div className="flex justify-end gap-3 mt-6">
                    <button onClick={() => setEditingFinanceItemId(null)} disabled={isSubmittingFinance} className="px-6 py-2.5 text-slate-500 font-bold hover:text-white transition-colors uppercase text-[10px] tracking-widest disabled:opacity-50">Cancel</button>
                    <button onClick={saveFinance} disabled={isSubmittingFinance} className="flex items-center gap-2 px-10 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-emerald-500/20 disabled:opacity-50">
                      {isSubmittingFinance && <span className="w-3 h-3 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>}
                      {isSubmittingFinance ? 'SAVING...' : 'Confirm & Save Payment'}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <InfoCard label="PO Amount" value={poGroup.poValue ? `₹${Number(poGroup.poValue).toLocaleString('en-IN')}` : '-'} highlight />
                    <div className="flex flex-col gap-1 p-3 bg-slate-950/20 rounded-xl border border-slate-800/40">
                      <span className="text-[10px] font-bold text-slate-500 uppercase">Payment Status</span>
                      <div className="flex items-center gap-2 pt-1">
                        <div className={`w-2 h-2 rounded-full ${(itemFinance.paymentStatus === 'Completed' || itemFinance.paymentStatus === 'Partial Payment') ? 'bg-emerald-500' : 'bg-slate-700'}`} />
                        <span className={`text-xs font-black uppercase ${(itemFinance.paymentStatus === 'Completed' || itemFinance.paymentStatus === 'Partial Payment') ? 'text-emerald-400' : 'text-slate-500'}`}>
                          {itemFinance.paymentStatus || 'Pending'}
                        </span>
                      </div>
                    </div>
                    {(itemFinance.paymentStatus === 'Completed' || itemFinance.paymentStatus === 'Partial Payment') && (
                      <>
                        <InfoCard label="Payment Date" value={itemFinance.advanceApprovalDate} />
                        <InfoCard label="Ref Number" value={itemFinance.advancePaymentRef} />
                        <InfoCard label="Receipt" value={itemFinance.receiptUploaded ? 'Uploaded' : 'Missing'} />
                        <InfoCard label="Remarks" value={itemFinance.remarks} />
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
