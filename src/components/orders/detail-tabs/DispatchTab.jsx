import React from 'react';
import { Edit2, Truck, Package } from 'lucide-react';
import { EmptyState, InfoCard } from '../../common';
import { PERMISSIONS } from '../../../constants';

export function DispatchTab({ order, editingDispatch, setEditingDispatch, dispatchData, saveDispatch, DispatchForm, hasPermission }) {
  if (editingDispatch) {
    return (
      <DispatchForm
        order={order}
        initialData={dispatchData}
        boqItems={order.items || []}
        onSave={saveDispatch}
        onCancel={() => setEditingDispatch(false)}
      />
    );
  }

  if (!order.dispatch) {
    return (
      <EmptyState icon={<Truck />} message="No dispatch details yet" canEdit={hasPermission(PERMISSIONS.EDIT_DISPATCH)} onEdit={() => setEditingDispatch(true)} />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white">Dispatch & Planning Details</h3>
        {hasPermission(PERMISSIONS.EDIT_DISPATCH) && (
          <button onClick={() => setEditingDispatch(true)} className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/20 text-emerald-400 rounded-lg text-sm">
            <Edit2 className="w-4 h-4" /> Edit
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <InfoCard label="Delivery Type" value={order.dispatch.deliveryType || '-'} />
        <InfoCard label="Packing Type" value={order.dispatch.packingType || '-'} />
        <InfoCard label="Dispatch Date" value={order.dispatch.dispatchDate || '-'} />
        <InfoCard label="Delivery Location" value={order.dispatch.deliveryLocation || '-'} />
        <InfoCard label="Transporter" value={order.dispatch.transporterName || '-'} />
        <InfoCard label="Vehicle Number" value={order.dispatch.vehicleNumber || '-'} />
        <InfoCard label="Docket Number" value={order.dispatch.docketNumber || '-'} />
        <InfoCard label="Eway Bill" value={order.dispatch.ewayBillAvailable || 'No'} highlight={order.dispatch.ewayBillAvailable === 'Yes'} />
        <InfoCard label="Transit Insurance" value={order.dispatch.transitInsurance || 'No'} highlight={order.dispatch.transitInsurance === 'Yes'} />
        <InfoCard label="Delivery Status" value={order.dispatch.deliveryStatus || '-'} highlight />
      </div>

      {order.dispatch.boqDispatch && (
        <div className="mt-8">
          <h4 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">Item Checklist Status</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {order.dispatch.boqDispatch.map((itemStatus, idx) => {
              const boqItem = (order.items || []).find(i => i.id === itemStatus.boqItemId);
              if (!boqItem) return null;
              return (
                <div key={idx} className="flex items-center justify-between p-3 bg-slate-900/60 border border-slate-800 rounded-xl">
                  <div>
                    <p className="text-xs font-bold text-white">{boqItem.name}</p>
                    <p className="text-[10px] text-slate-500">{boqItem.quantity} {boqItem.unit}</p>
                  </div>
                  <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-lg ${itemStatus.status === 'Shipped' ? 'bg-blue-500/10 text-blue-400' :
                      itemStatus.status === 'Packed' ? 'bg-emerald-500/10 text-emerald-400' :
                        itemStatus.status === 'Ready' ? 'bg-cyan-500/10 text-cyan-400' :
                          'bg-slate-800 text-slate-500'
                    }`}>
                    {itemStatus.status}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {order.dispatch.remarks && (
        <div className="mt-4 p-4 bg-slate-950/20 border border-slate-800/50 rounded-xl">
          <p className="text-xs font-bold text-slate-500 uppercase mb-2">Remarks</p>
          <p className="text-sm text-slate-300 italic">"{order.dispatch.remarks}"</p>
        </div>
      )}
    </div>
  );
}
