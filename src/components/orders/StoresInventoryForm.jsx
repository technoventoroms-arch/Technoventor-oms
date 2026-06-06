import React, { useState } from 'react';
import { Warehouse, AlertTriangle, CheckCircle2, Package } from 'lucide-react';

export function StoresInventoryForm({ items, onSave, onCancel }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localItems, setLocalItems] = useState(() =>
    items.map(item => ({
      ...item,
      shortQty: item.shortQty || 0
    }))
  );

  const updateShortQty = (itemId, value) => {
    const numVal = parseFloat(value) || 0;
    setLocalItems(prev =>
      prev.map(item => {
        if (item.id !== itemId) return item;
        // Clamp: short qty cannot exceed total qty
        const clamped = Math.min(Math.max(numVal, 0), item.quantity);
        return { ...item, shortQty: clamped };
      })
    );
  };

  const shortItems = localItems.filter(i => i.shortQty > 0);
  const availableItems = localItems.filter(i => i.shortQty === 0);

  const inputCls = "w-full bg-surface-raised border border-border rounded-xl px-4 py-2.5 text-text-primary placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-500/40 font-mono text-center";

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex items-center gap-3 mb-2 px-1">
        <div className="p-2 bg-amber-500/10 rounded-xl">
          <Warehouse className="w-5 h-5 text-amber-400" />
        </div>
        <div>
          <h2 className="text-base font-bold text-text-primary">Stores — Inventory Check</h2>
          <p className="text-xs text-text-secondary">Review BOQ items and specify the <strong className="text-amber-400">Short Qty</strong> that needs to be procured. Items with 0 short qty are available in stock.</p>
        </div>
      </div>

      {/* Summary Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-4 flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-700 dark:text-emerald-400 flex-shrink-0" />
          <div>
            <p className="text-xs text-text-muted font-bold uppercase">Available In Stock</p>
            <p className="text-lg font-black text-emerald-700 dark:text-emerald-400">{availableItems.length} <span className="text-xs text-text-muted font-normal">items</span></p>
          </div>
        </div>
        <div className="bg-amber-500/5 border border-amber-500/20 rounded-2xl p-4 flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0" />
          <div>
            <p className="text-xs text-text-muted font-bold uppercase">Short / Need Procurement</p>
            <p className="text-lg font-black text-amber-400">{shortItems.length} <span className="text-xs text-text-muted font-normal">items</span></p>
          </div>
        </div>
        <div className="bg-surface-raised border border-border rounded-2xl p-4 flex items-center gap-3">
          <Package className="w-5 h-5 text-text-secondary flex-shrink-0" />
          <div>
            <p className="text-xs text-text-muted font-bold uppercase">Total BOQ Items</p>
            <p className="text-lg font-black text-text-primary">{localItems.length}</p>
          </div>
        </div>
      </div>

      {/* Item Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px]">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left p-4 text-[10px] font-bold text-text-muted uppercase tracking-widest">Sr.</th>
              <th className="text-left p-4 text-[10px] font-bold text-text-muted uppercase tracking-widest">Item Description</th>
              <th className="text-left p-4 text-[10px] font-bold text-text-muted uppercase tracking-widest">Make / Model</th>
              <th className="text-center p-4 text-[10px] font-bold text-text-muted uppercase tracking-widest">BOQ Qty</th>
              <th className="text-center p-4 text-[10px] font-bold text-amber-400 uppercase tracking-widest bg-amber-500/5 rounded-t-xl">Short Qty</th>
              <th className="text-center p-4 text-[10px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-widest">Available</th>
              <th className="text-center p-4 text-[10px] font-bold text-text-muted uppercase tracking-widest">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {localItems.filter(i => i.itemType !== 'service').map((item, index) => {
              const shortQty = item.shortQty || 0;
              const availableQty = item.quantity - shortQty;
              const isShort = shortQty > 0;

              return (
                <tr key={item.id} className={`transition-colors ${isShort ? 'bg-amber-500/[0.03]' : 'hover:bg-surface-raised'}`}>
                  <td className="p-4 text-text-muted font-mono text-sm">{index + 1}</td>
                  <td className="p-4">
                    <div className={`text-sm font-medium ${item.parentItemIndex ? 'text-text-secondary pl-6' : 'text-text-primary'}`}>
                      {item.parentItemIndex && <span className="text-text-muted mr-2">└</span>}
                      {item.name}
                    </div>
                    <div className={`text-[10px] text-text-muted font-mono mt-0.5 ${item.parentItemIndex ? 'pl-9' : ''}`}>{item.itemCode || 'NO-CODE'}</div>
                  </td>
                  <td className="p-4">
                    <div className="text-xs text-text-secondary">{item.make || '-'}</div>
                    <div className="text-[10px] text-text-muted">{item.model || '-'}</div>
                  </td>
                  <td className="p-4 text-center">
                    <span className="text-sm text-text-primary font-mono font-bold">{item.quantity}</span>
                    <span className="text-[10px] text-text-muted ml-1">{item.unit}</span>
                  </td>
                  <td className="p-4 bg-amber-500/5">
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      max={item.quantity}
                      value={shortQty}
                      onChange={e => updateShortQty(item.id, e.target.value)}
                      className={inputCls}
                    />
                  </td>
                  <td className="p-4 text-center">
                    <span className={`text-sm font-mono font-bold ${isShort ? 'text-emerald-700 dark:text-emerald-400/60' : 'text-emerald-700 dark:text-emerald-400'}`}>
                      {Math.round(availableQty)}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    {isShort ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        <AlertTriangle className="w-3 h-3" />
                        Short
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                        <CheckCircle2 className="w-3 h-3" />
                        In Stock
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Info Note */}
      {shortItems.length > 0 && (
        <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-4 flex items-start gap-3">
          <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-text-secondary">
            <strong className="text-amber-400">{shortItems.length} item(s)</strong> have a shortage and will be escalated to Procurement. The procurement team will only see items with Short Qty &gt; 0.
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-end border-t border-border pt-8 mt-8">
        <button
          onClick={onCancel}
          disabled={isSubmitting}
          className="flex-1 md:flex-none px-8 py-3 border border-border rounded-xl text-text-secondary font-semibold hover:bg-surface-raised disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          onClick={async () => {
            setIsSubmitting(true);
            try {
              await onSave(localItems);
            } finally {
              setIsSubmitting(false);
            }
          }}
          disabled={isSubmitting}
          className="flex-1 md:flex-none px-8 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-xl font-black shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isSubmitting ? <span className="w-4 h-4 btn-spinner"></span> : null}
          {isSubmitting ? 'Saving...' : 'Save Inventory Check'}
        </button>
      </div>
    </div>
  );
}
