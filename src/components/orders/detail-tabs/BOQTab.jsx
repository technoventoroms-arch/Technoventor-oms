import React from 'react';
import { Download } from 'lucide-react';
import { PERMISSIONS } from '../../../constants';

export function BOQTab({ order, hasPermission, onExportBOQ }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-text-primary">Bill of Quantities</h3>
        <button 
          onClick={onExportBOQ}
          className="flex items-center gap-2 px-3 py-1.5 bg-surface-raised dark:bg-slate-800 border border-border rounded-lg text-sm text-text-secondary hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
        >
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1000px]">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left p-4 text-xs font-semibold text-text-muted uppercase">Sr.</th>
              <th className="text-left p-4 text-xs font-semibold text-text-muted uppercase">Item Description</th>
              <th className="text-left p-4 text-xs font-semibold text-text-muted uppercase">Specs</th>
              <th className="text-left p-4 text-xs font-semibold text-text-muted uppercase">Qty/Unit</th>
              <th className="text-left p-4 text-xs font-semibold text-text-muted uppercase">Install</th>
              {hasPermission(PERMISSIONS.VIEW_ORDER_VALUE) && (
                <>
                  <th className="text-left p-4 text-xs font-semibold text-text-muted uppercase">Rate</th>
                  <th className="text-left p-4 text-xs font-semibold text-text-muted uppercase">GST %</th>
                  <th className="text-right p-4 text-xs font-semibold text-text-muted uppercase">Total Amount</th>
                </>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {order.items.map((item, index) => (
              <tr key={item.id} className={`hover:bg-surface-raised transition-colors ${item.parentItemIndex ? 'bg-surface-raised dark:bg-slate-800/20' : ''}`}>
                <td className="p-4 text-text-muted font-mono text-sm">
                  {item.parentItemIndex ? (
                     <div className="flex items-center text-text-muted"><span className="ml-4 mr-2">↳</span></div>
                  ) : (
                     index + 1
                  )}
                </td>
                <td className="p-4">
                  <div className="text-sm font-medium text-text-primary">{item.name}</div>
                  <div className="text-[10px] text-text-muted font-mono mt-0.5">{item.itemCode || 'CODE-NOT-SET'}</div>
                  {item.description && (
                    <div className="text-[11px] text-text-secondary mt-2 bg-slate-50 dark:bg-slate-950/20 p-2 rounded-lg italic border border-border">
                      {item.description}
                    </div>
                  )}
                </td>
                <td className="p-4">
                  <div className="text-xs text-text-secondary">{item.make || '-'}</div>
                  <div className="text-[10px] text-text-muted">{item.model || '-'}</div>
                </td>
                <td className="p-4 text-sm text-text-secondary">{item.quantity} {item.unit}</td>
                <td className="p-4 text-xs">
                  {item.itemType === 'service' ? (
                    <span className="text-text-muted">—</span>
                  ) : item.requiresInstallation ? (
                    <span className="px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-500/20 font-semibold">Required</span>
                  ) : (
                    <span className="text-text-muted">Deliver only</span>
                  )}
                </td>
                {hasPermission(PERMISSIONS.VIEW_ORDER_VALUE) && (
                  <>
                    <td className="p-4 text-sm text-text-secondary font-mono">₹{item.rate.toLocaleString('en-IN')}</td>
                    <td className="p-4 text-xs text-text-secondary">{item.gstPercent || 18}%</td>
                    <td className="p-4 text-right text-emerald-700 dark:text-emerald-400 font-bold font-mono">₹{(item.totalAmount || item.amount).toLocaleString('en-IN')}</td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
          {hasPermission(PERMISSIONS.VIEW_ORDER_VALUE) && (
            <tfoot className="bg-surface-raised dark:bg-slate-800/20">
              <tr className="border-t border-border">
                <td colSpan="7" className="p-4 text-right font-semibold text-text-secondary">Sub Total:</td>
                <td className="p-4 text-right font-mono text-text-primary font-bold text-lg">₹{(order.summary?.subTotal || order.totalValue).toLocaleString('en-IN')}</td>
              </tr>
              {order.summary && (
                <tr>
                  <td colSpan="7" className="px-4 py-2 text-right text-text-muted text-xs">Total GST:</td>
                  <td className="px-4 py-2 text-right font-mono text-text-secondary text-sm">₹{order.summary.gstAmount.toLocaleString('en-IN')}</td>
                </tr>
              )}
              <tr className="border-t-2 border-emerald-500/20">
                <td colSpan="7" className="p-4 text-right font-black text-emerald-700 dark:text-emerald-400">GRAND TOTAL:</td>
                <td className="p-4 text-right font-mono text-emerald-700 dark:text-emerald-400 font-black text-2xl animate-pulse">₹{(order.summary?.grandTotal || order.totalValue).toLocaleString('en-IN')}</td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </div>
  );
}
