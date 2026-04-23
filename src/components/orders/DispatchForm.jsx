import React, { useState } from 'react';
import { Truck, Package, CheckCircle2, ChevronRight, Box, MapPin, Calendar, ClipboardCheck } from 'lucide-react';

export function DispatchForm({ order, initialData, boqItems, onSave, onCancel }) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [dispatchDetails, setDispatchDetails] = useState({
    deliveryType: initialData?.deliveryType || 'Direct to Site',
    packingType: initialData?.packingType || 'Box Packing',
    dispatchDate: initialData?.dispatchDate || '',
    transporterName: initialData?.transporterName || '',
    vehicleNumber: initialData?.vehicleNumber || '',
    docketNumber: initialData?.docketNumber || '',
    ewayBillAvailable: initialData?.ewayBillAvailable || 'No',
    transitInsurance: initialData?.transitInsurance || 'No',
    deliveryStatus: initialData?.deliveryStatus || 'Pending',
    deliveryLocation: initialData?.deliveryLocation || (order.customerDetails?.shippingAddress?.city + ', ' + order.customerDetails?.shippingAddress?.state) || '',
    remarks: initialData?.remarks || ''
  });

  const [itemStatuses, setItemStatuses] = useState(() => {
    if (initialData?.boqDispatch?.length > 0) {
      return boqItems.map(item => {
        const existing = initialData.boqDispatch.find(d => d.boqItemId === item.id);
        return existing || { boqItemId: item.id, status: 'Pending' };
      });
    }
    return boqItems.map(item => ({ boqItemId: item.id, status: 'Pending' }));
  });

  const updateDetail = (field, value) => {
    setDispatchDetails(prev => ({ ...prev, [field]: value }));
  };

  const updateItemStatus = (boqItemId, status) => {
    setItemStatuses(prev => prev.map(item => 
      item.boqItemId === boqItemId ? { ...item, status } : item
    ));
  };



  const handleSave = async () => {
    setIsSubmitting(true);
    try {
      await onSave({ ...dispatchDetails, boqDispatch: itemStatuses });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-slate-900/50 p-4 md:p-8 rounded-3xl overflow-hidden text-white border border-slate-800/50">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* Header Section */}
        <div className="flex flex-col gap-4 rounded-3xl bg-slate-900 p-6 shadow-sm md:flex-row md:items-center md:justify-between border border-slate-800">
          <div>
            <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
              <div className="p-2 bg-blue-600 rounded-2xl">
                <Truck className="w-8 h-8 text-white" />
              </div>
              Packaging & Dispatch
            </h1>
            <p className="mt-1 text-sm text-slate-400 font-medium">Manage item-wise packaging and logistics tracking.</p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={onCancel}
              className="rounded-2xl border border-slate-700 bg-slate-800 px-6 py-3 text-sm font-bold text-slate-300 shadow-sm hover:bg-slate-700 transition-all"
            >
              Cancel
            </button>
            <button 
              onClick={handleSave}
              disabled={isSubmitting}
              className="flex items-center gap-2 rounded-2xl bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all disabled:opacity-50"
            >
              {isSubmitting ? <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></span> : null}
              {isSubmitting ? 'Submitting...' : 'Submit Dispatch'}
            </button>
          </div>
        </div>

        {/* Order Info Section */}
        <div className="rounded-3xl bg-slate-900 p-6 shadow-sm border border-slate-800">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <ClipboardCheck className="w-5 h-5 text-blue-400" />
              Order Link Details
            </h2>
            <span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs font-bold text-blue-400 border border-blue-500/20">Linked to Order</span>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <label className="mb-2 block text-xs font-bold text-slate-500 uppercase tracking-wider">Order Number</label>
              <div className="w-full rounded-2xl border border-slate-800 bg-slate-950/50 px-4 py-3 font-mono text-sm text-slate-300">
                {order.id}
              </div>
            </div>
            <div>
              <label className="mb-2 block text-xs font-bold text-slate-500 uppercase tracking-wider">Project Name</label>
              <div className="w-full rounded-2xl border border-slate-800 bg-slate-950/50 px-4 py-3 text-sm text-slate-300 font-semibold truncate">
                {order.projectName}
              </div>
            </div>
            <div>
              <label className="mb-2 block text-xs font-bold text-slate-500 uppercase tracking-wider">Delivery Location</label>
              <input 
                className="w-full rounded-2xl border border-slate-800 bg-slate-800/50 px-4 py-3 text-sm text-white outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" 
                value={dispatchDetails.deliveryLocation}
                onChange={(e) => updateDetail('deliveryLocation', e.target.value)}
                placeholder="City, State"
              />
            </div>
            <div>
              <label className="mb-2 block text-xs font-bold text-slate-500 uppercase tracking-wider">Dispatch Date</label>
              <input 
                type="date"
                className="w-full rounded-2xl border border-slate-800 bg-slate-800/50 px-4 py-3 text-sm text-white outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none [color-scheme:dark]" 
                value={dispatchDetails.dispatchDate}
                onChange={(e) => updateDetail('dispatchDate', e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Dispatch Details Form */}
          <div className="rounded-3xl bg-slate-900 p-6 shadow-sm border border-slate-800 flex flex-col">
            <h2 className="mb-5 text-xl font-bold text-white flex items-center gap-2">
              <Box className="w-5 h-5 text-blue-400" />
              Logistics Configuration
            </h2>
            <div className="grid gap-4 flex-1">
              <div>
                <label className="mb-2 block text-xs font-bold text-slate-500 uppercase tracking-wider">Delivery Type</label>
                <select 
                  className="w-full rounded-2xl border border-slate-800 bg-slate-800/50 px-4 py-3 text-sm text-white outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer"
                  value={dispatchDetails.deliveryType}
                  onChange={(e) => updateDetail('deliveryType', e.target.value)}
                >
                  <option className="bg-slate-900">Direct to Site</option>
                  <option className="bg-slate-900">Store to Site</option>
                  <option className="bg-slate-900">Client Pickup</option>
                </select>
              </div>
              <div>
                <label className="mb-2 block text-xs font-bold text-slate-500 uppercase tracking-wider">Packing Type</label>
                <select 
                  className="w-full rounded-2xl border border-slate-800 bg-slate-800/50 px-4 py-3 text-sm text-white outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer"
                  value={dispatchDetails.packingType}
                  onChange={(e) => updateDetail('packingType', e.target.value)}
                >
                  <option className="bg-slate-900">Box Packing</option>
                  <option className="bg-slate-900">Wooden Packing</option>
                  <option className="bg-slate-900">Loose Packing</option>
                  <option className="bg-slate-900">Palletized</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-2 block text-xs font-bold text-slate-500 uppercase tracking-wider">Transporter</label>
                  <input 
                    className="w-full rounded-2xl border border-slate-800 bg-slate-800/50 px-4 py-3 text-sm text-white outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" 
                    value={dispatchDetails.transporterName}
                    onChange={(e) => updateDetail('transporterName', e.target.value)}
                    placeholder="Courier/Vehicle Service"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-xs font-bold text-slate-500 uppercase tracking-wider">Vehicle No.</label>
                  <input 
                    className="w-full rounded-2xl border border-slate-800 bg-slate-800/50 px-4 py-3 text-sm text-white outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" 
                    value={dispatchDetails.vehicleNumber}
                    onChange={(e) => updateDetail('vehicleNumber', e.target.value)}
                    placeholder="MH 12 AB 1234"
                  />
                </div>
              </div>
              <div>
                <label className="mb-2 block text-xs font-bold text-slate-500 uppercase tracking-wider">Docket / LR Number</label>
                <input 
                  className="w-full rounded-2xl border border-slate-800 bg-slate-800/50 px-4 py-3 text-sm text-white outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-mono" 
                  value={dispatchDetails.docketNumber}
                  onChange={(e) => updateDetail('docketNumber', e.target.value)}
                  placeholder="TRACKING-ID"
                />
              </div>
              <div>
                <label className="mb-2 block text-xs font-bold text-slate-500 uppercase tracking-wider">Eway Bill Available</label>
                <select 
                  className="w-full rounded-2xl border border-slate-800 bg-slate-800/50 px-4 py-3 text-sm text-white outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer"
                  value={dispatchDetails.ewayBillAvailable}
                  onChange={(e) => updateDetail('ewayBillAvailable', e.target.value)}
                >
                  <option value="No" className="bg-slate-900">No</option>
                  <option value="Yes" className="bg-slate-900">Yes</option>
                </select>
              </div>
              <div>
                <label className="mb-2 block text-xs font-bold text-slate-500 uppercase tracking-wider">Transit Insurance</label>
                <select 
                  className="w-full rounded-2xl border border-slate-800 bg-slate-800/50 px-4 py-3 text-sm text-white outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer"
                  value={dispatchDetails.transitInsurance}
                  onChange={(e) => updateDetail('transitInsurance', e.target.value)}
                >
                  <option value="No" className="bg-slate-900">No</option>
                  <option value="Yes" className="bg-slate-900">Yes</option>
                </select>
              </div>
            </div>
          </div>

          {/* BOQ Items Status */}
          <div className="rounded-3xl bg-slate-900 p-6 shadow-sm border border-slate-800 flex flex-col">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Package className="w-5 h-5 text-blue-400" />
                Item Checklist
              </h2>
              <span className="text-xs font-bold text-slate-500">{boqItems.length} Items Total</span>
            </div>
            
            <div className="space-y-3 overflow-y-auto max-h-[400px] pr-2 custom-scrollbar">
              {boqItems.map((item) => {
                const itemStatus = itemStatuses.find(s => s.boqItemId === item.id)?.status || 'Pending';
                return (
                  <div key={item.id} className={`group flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-950/40 p-4 transition-all hover:border-blue-500/50 hover:bg-slate-800/50 ${item.parentItemIndex ? 'ml-8' : ''}`}>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        {item.parentItemIndex && <span className="text-slate-600 text-xs text-bold">└</span>}
                        <p className={`text-sm font-bold ${item.parentItemIndex ? 'text-slate-400' : 'text-white'}`}>{item.name}</p>
                      </div>
                      <div className={`flex items-center gap-3 mt-1 ${item.parentItemIndex ? 'ml-4' : ''}`}>
                        <p className="text-xs font-medium text-slate-400">Qty: {item.quantity} {item.unit}</p>
                        <span className="w-1 h-1 rounded-full bg-slate-700"></span>
                        <p className="text-[10px] font-mono text-slate-500">{item.itemCode || 'N/A'}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <select 
                        value={itemStatus}
                        onChange={(e) => updateItemStatus(item.id, e.target.value)}
                        className={`rounded-xl border px-3 py-1.5 text-xs font-bold outline-none transition-all cursor-pointer ${
                          itemStatus === 'Shipped' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                          itemStatus === 'Packed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                          itemStatus === 'Ready' ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' :
                          'bg-slate-800 text-slate-400 border-slate-700'
                        }`}
                      >
                        <option value="Pending" className="bg-slate-900">Pending</option>
                        <option value="Ready" className="bg-slate-900">Ready</option>
                        <option value="Packed" className="bg-slate-900">Packed</option>
                        <option value="Shipped" className="bg-slate-900">Shipped</option>
                      </select>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 pt-6 border-t border-slate-800">
               <label className="mb-2 block text-xs font-bold text-slate-500 uppercase tracking-wider">Dispatch Remarks</label>
               <textarea 
                  className="w-full rounded-2xl border border-slate-800 bg-slate-800/50 px-4 py-3 text-sm text-white outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium min-h-[80px]" 
                  value={dispatchDetails.remarks}
                  onChange={(e) => updateDetail('remarks', e.target.value)}
                  placeholder="Special instructions or notes..."
               />
            </div>
          </div>
        </div>
      </div>
      
      {/* Visual background element */}
      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #475569; }
      `}} />
    </div>
  );
}
