import React from 'react';
import { Edit2, Truck, Package, CheckCircle2, Warehouse, Send } from 'lucide-react';
import { EmptyState, InfoCard } from '../../common';
import { formatDate } from '../../../utils';
import { PERMISSIONS, ORDER_STAGES } from '../../../constants';

export function StoresTab({ order, editingStores, setEditingStores, storesData, saveStores, StoresForm, hasPermission, canEscalate, onEscalate, isEscalating }) {
  if (editingStores) {
    return (
      <StoresForm
        initialData={storesData}
        boqItems={order.items || []}
        order={order}
        onSave={saveStores}
        onCancel={() => setEditingStores(false)}
        canEscalate={canEscalate}
        isEscalating={isEscalating}
      />
    );
  }

  const purchases = order.procurement?.boqPurchases || [];
  const financeRecords = order.finance || [];
  
  // Group by PO, only include POs with completed payment
  const expectedGroups = new Map();
  purchases.forEach(p => {
    const poKey = p.poDetails?.poNumber || p.vendorDetails?.name || 'unassigned';
    const finRecord = financeRecords.find(f => f.poNumber === p.poDetails?.poNumber || f.boqItemId === p.boqItemId);
    const isApproved = finRecord?.paymentStatus === 'Completed';
    
    if (!isApproved) return;
    
    if (!expectedGroups.has(poKey)) {
      expectedGroups.set(poKey, {
        poNumber: p.poDetails?.poNumber || '',
        vendorName: p.vendorDetails?.name || 'Unknown',
        poValue: p.poDetails?.poValue || '',
        expectedDeliveryDate: p.paymentAndDelivery?.expectedDeliveryDate || '',
        items: []
      });
    }
    const boqItem = (order.items || []).find(i => i.id === p.boqItemId) || {};
    expectedGroups.get(poKey).items.push({ ...p, boqItem });
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-white">Stores & Inward Details</h3>
          <p className="text-xs text-slate-400 mt-1">Record receiving and quality check status for each item</p>
        </div>
        {hasPermission(PERMISSIONS.EDIT_STORES) && (
          <button onClick={() => setEditingStores(true)} className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-400 border border-cyan-500/30 rounded-xl text-sm font-semibold">
            <Edit2 className="w-4 h-4" /> Edit Details
          </button>
        )}
      </div>

      {expectedGroups.size > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 bg-amber-500/10 rounded-lg">
              <Truck className="w-4 h-4 text-amber-400" />
            </div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Expected Delivery Items</h4>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
              {expectedGroups.size} PO{expectedGroups.size !== 1 ? 's' : ''} approved
            </span>
          </div>

          {Array.from(expectedGroups.entries()).map(([poKey, group]) => (
            <div key={poKey} className="border border-amber-500/20 bg-amber-500/[0.02] rounded-2xl overflow-hidden">
              <div className="flex items-center gap-4 px-5 py-4 bg-amber-500/5">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center flex-shrink-0">
                  <Package className="w-5 h-5 text-amber-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-white text-sm">{group.vendorName}</span>
                    {group.poNumber && (
                      <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                        PO: {group.poNumber}
                      </span>
                    )}
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Payment Completed
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-0.5">
                    {group.poValue && (
                      <span className="text-xs text-emerald-400/70 font-mono">₹{Number(group.poValue).toLocaleString('en-IN')}</span>
                    )}
                    {group.expectedDeliveryDate && (
                      <span className="text-xs text-amber-400/80">
                        Expected: {formatDate(group.expectedDeliveryDate)}
                      </span>
                    )}
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                  {group.items.length} item{group.items.length !== 1 ? 's' : ''}
                </span>
              </div>
              <div className="p-4 border-t border-amber-500/10 bg-slate-950/10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {group.items.map(({ boqItem }, i) => (
                    <div key={i} className="flex items-center gap-2 px-3 py-2 bg-slate-900/60 border border-slate-800 rounded-lg">
                      <Package className="w-3.5 h-3.5 text-amber-400/60" />
                      <span className="text-xs text-white font-medium">{boqItem.name || 'Unknown Item'}</span>
                      <span className="text-[10px] text-slate-500 font-mono ml-auto">{boqItem.shortQty || boqItem.quantity} {boqItem.unit}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {order.stores?.boqInwards ? (
        <div className="space-y-4">
          <div className="p-4 bg-cyan-500/5 border border-cyan-500/10 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-cyan-400" />
              <span className="text-sm text-slate-400">
                {order.stores.boqInwards.filter(i => i.inwardDate).length} of {order.stores.boqInwards.length} items recorded inward
              </span>
            </div>
          </div>

          {order.stores.boqInwards.map((inward, idx) => {
            const boqItem = (order.items || []).find(i => i.id === inward.boqItemId) || {};
            return (
              <div key={inward.boqItemId} className={`border border-slate-800/50 rounded-2xl overflow-hidden ${boqItem.parentItemIndex ? 'ml-8' : ''}`}>
                <div className="flex items-center gap-4 px-5 py-4 bg-slate-900/40">
                  <span className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-slate-400 flex-shrink-0">{boqItem.parentItemIndex ? '└' : idx + 1}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-white text-sm">{boqItem.name || `Item #${inward.boqItemId}`}</span>
                      <span className="text-[10px] font-mono text-slate-500 bg-slate-800 px-1.5 py-0.5 rounded">{boqItem.itemCode || '-'}</span>
                      {inward.qualityCheckStatus === 'Passed' && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 border border-green-500/20">Passed QC</span>}
                      {inward.qualityCheckStatus === 'Failed' && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20">Failed QC</span>}
                    </div>
                    <span className="text-xs text-slate-500 font-mono">{boqItem.quantity} {boqItem.unit}</span>
                  </div>
                </div>
                {inward.inwardDate && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-5 border-t border-slate-800/40 bg-slate-950/20">
                    <InfoCard label="Inward Date" value={inward.inwardDate} />
                    <InfoCard label="GRN Number" value={inward.grnNumber || '-'} highlight />
                    <InfoCard label="QC Status" value={inward.qualityCheckStatus} />
                    <InfoCard label="Received" value={inward.receivedQuantity || '-'} />
                    <InfoCard label="Storage" value={inward.storageLocation || '-'} />
                    <InfoCard label="Demage" value={inward.damageReport || 'None'} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState icon={<Warehouse />} message="No inward details yet" canEdit={hasPermission(PERMISSIONS.EDIT_STORES)} onEdit={() => setEditingStores(true)} />
      )}

      {hasPermission(PERMISSIONS.ESCALATE_ORDERS) && order.currentStage === ORDER_STAGES.STORES_INWARD && (
        <div className="mt-8 p-6 bg-gradient-to-br from-blue-600/10 to-indigo-600/10 border border-blue-500/20 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
              <Send className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-white">Ready for Dispatch?</h4>
              <p className="text-sm text-slate-400">If all items are inwarded and checked, you can move this order to the Dispatch stage.</p>
            </div>
          </div>
          <button
            onClick={async () => {
              if (onEscalate) {
                await onEscalate(ORDER_STAGES.DISPATCH, false);
              }
            }}
            disabled={isEscalating !== null}
            className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
          >
            {isEscalating === `next-${ORDER_STAGES.DISPATCH}` ? (
              <span className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
            ) : (
              <Send className="w-5 h-5" />
            )}
            Escalate to Dispatch
          </button>
        </div>
      )}
    </div>
  );
}
