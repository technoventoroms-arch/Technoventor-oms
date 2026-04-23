import React from 'react';
import { Building2, Edit2, Package, CheckCircle2, ArrowUpRight } from 'lucide-react';
import { EmptyState, InfoCard } from '../../common';
import { formatDate } from '../../../utils';
import { PERMISSIONS } from '../../../constants';

export function ProcurementTab({ order, hasPermission, editingProcurement, setEditingProcurement, procurementData, escalatedPoNumbers, canEscalate, handleEscalatePOToFinance, escalatingPO, currentUser, ProcurementForm, saveProcurement }) {
  if (editingProcurement) {
    return (
      <div className="animate-in fade-in slide-in-from-top-4 duration-300">
        <ProcurementForm
          initialData={procurementData}
          boqItems={order.items || []}
          onSave={saveProcurement}
          onCancel={() => setEditingProcurement(false)}
          escalatedPoNumbers={escalatedPoNumbers}
          currentUser={currentUser}
        />
      </div>
    );
  }

  if (!(order.procurement?.boqPurchases && order.procurement.boqPurchases.length > 0)) {
    return (
      <EmptyState
        icon={<Building2 />}
        message="No procurement / purchase details recorded yet."
        canEdit={hasPermission(PERMISSIONS.EDIT_PROCUREMENT)}
        onEdit={() => setEditingProcurement(true)}
      />
    );
  }

  const purchases = order.procurement.boqPurchases;
  const poGroups = new Map();
  purchases.forEach(p => {
    const poKey = p.poDetails?.poNumber || p.vendorDetails?.name || 'unassigned';
    if (!poGroups.has(poKey)) {
      poGroups.set(poKey, {
        poNumber: p.poDetails?.poNumber || '',
        vendorName: p.vendorDetails?.name || 'Unassigned',
        poValue: p.poDetails?.poValue || '',
        poDate: p.poDetails?.poDate || '',
        poStatus: p.poDetails?.poStatus || 'Draft',
        vendorDetails: p.vendorDetails || {},
        paymentAndDelivery: p.paymentAndDelivery || {},
        items: []
      });
    }
    const boqItem = (order.items || []).find(i => i.id === p.boqItemId) || {};
    poGroups.get(poKey).items.push({ ...p, boqItem });
  });

  const poEntries = Array.from(poGroups.entries());
  const escalatedCount = poEntries.filter(([k]) => escalatedPoNumbers.has(k)).length;
  const totalCount = poEntries.length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <Building2 className="w-5 h-5 text-emerald-400" />
          Procurement / Purchase Details
        </h3>
        {hasPermission(PERMISSIONS.EDIT_PROCUREMENT) && (
          <button
            onClick={() => setEditingProcurement(true)}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-xl text-sm font-semibold hover:bg-emerald-500/20 transition-all"
          >
            <Edit2 className="w-4 h-4" /> Edit Details
          </button>
        )}
      </div>

      <div className="flex items-center gap-3 px-4 py-3 bg-slate-900/60 border border-slate-800 rounded-xl mb-2">
        <Package className="w-4 h-4 text-emerald-400" />
        <span className="text-sm text-slate-400">
          {totalCount} PO{totalCount !== 1 ? 's' : ''} • {escalatedCount} sent to Finance
        </span>
      </div>

      {poEntries.map(([poKey, poGroup], idx) => {
        const isEscalatedToFinance = escalatedPoNumbers.has(poKey);
        const hasPO = !!poGroup.poNumber;
        const hasVendor = !!poGroup.vendorName && poGroup.vendorName !== 'Unassigned';
        const financeCompleted = poGroup.items.every(({ boqItem }) => 
          (order.finance || []).some(f => f.boqItemId === boqItem.id && f.paymentStatus === 'Completed')
        );

        return (
          <div key={poKey} className={`border rounded-2xl overflow-hidden transition-all ${
            isEscalatedToFinance 
              ? 'border-blue-500/30 bg-blue-500/[0.02]' 
              : 'border-slate-800/50'
          }`}>
            <div className="flex items-center gap-4 px-5 py-4 bg-slate-900/40">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 flex items-center justify-center text-sm font-black text-emerald-400 flex-shrink-0">
                P{idx + 1}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-white text-sm">
                    {poGroup.vendorName || 'Unnamed Vendor'}
                  </span>
                  {poGroup.poNumber && (
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      PO: {poGroup.poNumber}
                    </span>
                  )}
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                    {poGroup.items.length} item{poGroup.items.length !== 1 ? 's' : ''}
                  </span>
                </div>
                <div className="flex items-center gap-3 mt-0.5">
                  {poGroup.poValue && (
                    <span className="text-xs text-emerald-400/70 font-mono">₹{Number(poGroup.poValue).toLocaleString('en-IN')}</span>
                  )}
                  <span className="text-xs text-slate-500 truncate">
                    {poGroup.items.map(i => i.boqItem.name).join(', ')}
                  </span>
                </div>
              </div>

              {financeCompleted ? (
                <span className="text-[10px] font-bold px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 whitespace-nowrap flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Finance Approved
                </span>
              ) : isEscalatedToFinance ? (
                <span className="text-[10px] font-bold px-3 py-1.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 whitespace-nowrap flex items-center gap-1">
                  <ArrowUpRight className="w-3 h-3" /> Sent to Finance
                </span>
              ) : hasPO ? (
                <span className="text-[10px] font-bold px-3 py-1.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 whitespace-nowrap">
                  PO Issued
                </span>
              ) : hasVendor ? (
                <span className="text-[10px] font-bold px-3 py-1.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 whitespace-nowrap">
                  In Progress
                </span>
              ) : (
                <span className="text-[10px] font-bold px-3 py-1.5 rounded-full bg-slate-700/50 text-slate-500 border border-slate-700 whitespace-nowrap">
                  Not Started
                </span>
              )}

              {canEscalate && hasPO && !isEscalatedToFinance && !financeCompleted && (
                <button
                  onClick={() => handleEscalatePOToFinance(poKey, poGroup)}
                  disabled={escalatingPO !== null}
                  className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-lg shadow-blue-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 whitespace-nowrap"
                >
                  {escalatingPO === poKey ? (
                    <span className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
                  ) : (
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  )}
                  {escalatingPO === poKey ? 'Sending...' : 'Send to Finance'}
                </button>
              )}
            </div>

            <div className="p-4 border-t border-slate-800/40 bg-slate-950/10">
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

            {(hasVendor || hasPO) && (
              <div className="p-5 border-t border-slate-800/40 bg-slate-950/20 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="lg:col-span-2">
                    <InfoCard label="Vendor" value={poGroup.vendorDetails?.name || '-'} />
                  </div>
                  <InfoCard label="GST Number" value={poGroup.vendorDetails?.gstNumber || '-'} />
                </div>

                <div className="pt-4 border-t border-slate-800/40 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <InfoCard label="PO Number" value={poGroup.poNumber || '-'} highlight />
                  <InfoCard label="PO Date" value={formatDate(poGroup.poDate)} />
                  <InfoCard label="PO Value" value={poGroup.poValue ? `₹${Number(poGroup.poValue).toLocaleString('en-IN')}` : '-'} highlight />
                </div>

                <div className="pt-4 border-t border-slate-800/40 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <InfoCard label="Payment Type" value={poGroup.paymentAndDelivery?.paymentType || '-'} />
                  <InfoCard label="Credit Days" value={poGroup.paymentAndDelivery?.creditDays || '-'} />
                  <InfoCard label="Exp. Delivery" value={formatDate(poGroup.paymentAndDelivery?.expectedDeliveryDate)} highlight />
                  <div className="lg:col-span-3">
                    <InfoCard label="Payment Notes" value={poGroup.paymentAndDelivery?.paymentNotes || '-'} />
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
