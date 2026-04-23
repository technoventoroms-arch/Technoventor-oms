import React from 'react';
import { Truck, Edit2, Download } from 'lucide-react';
import { EmptyState, InfoCard } from '../../common';
import { formatDate } from '../../../utils';
import { PERMISSIONS } from '../../../constants';

export function DeliveryTab({ order, editingDelivery, setEditingDelivery, deliveryData, saveDelivery, DeliveryForm, hasPermission }) {
  if (editingDelivery) {
    return (
      <DeliveryForm
        initialData={deliveryData}
        onSave={saveDelivery}
        onCancel={() => setEditingDelivery(false)}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Truck className="w-5 h-5 text-emerald-400" />
            Order Delivery
          </h3>
          <p className="text-slate-400 mt-1 max-w-2xl text-sm leading-relaxed">
            Record final handover details and upload the signed Proof of Delivery (POD).
          </p>
        </div>

        {hasPermission(PERMISSIONS.EDIT_DELIVERY) && (
          <button
            onClick={() => setEditingDelivery(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl text-sm font-black shadow-lg shadow-emerald-500/20 active:scale-[0.98] transition-all"
          >
             <Edit2 className="w-4 h-4" /> Edit Delivery Details
          </button>
        )}
      </div>

      {deliveryData?.deliveryDate || deliveryData?.handoverTo ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <InfoCard label="Handover To" value={deliveryData.handoverTo} highlight />
            <InfoCard label="Delivery Date" value={formatDate(deliveryData.deliveryDate)} />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 pt-6 border-t border-slate-800">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
               <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-3">Proof of Delivery (POD)</p>
               {deliveryData.proofOfDelivery ? (
                 <button onClick={() => {
                    const link = document.createElement('a');
                    link.href = deliveryData.proofOfDelivery;
                    link.download = `POD_${order.id}.pdf`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                 }} className="flex items-center gap-2 px-4 py-2.5 bg-emerald-500/10 text-emerald-400 rounded-xl text-sm font-semibold hover:bg-emerald-500 hover:text-white transition-colors">
                    <Download className="w-4 h-4" /> Download POD
                 </button>
               ) : (
                 <p className="text-slate-500 text-sm italic">Not Uploaded</p>
               )}
            </div>
          </div>

          {deliveryData.remarks && (
            <div className="mt-6">
              <InfoCard label="Remarks" value={deliveryData.remarks} />
            </div>
          )}
        </div>
      ) : (
        <EmptyState 
          icon={<Truck className="w-6 h-6 text-slate-400" />} 
          message="No delivery details have been recorded yet." 
          canEdit={hasPermission(PERMISSIONS.EDIT_DELIVERY)}
          onEdit={() => setEditingDelivery(true)}
        />
      )}
    </div>
  );
}
