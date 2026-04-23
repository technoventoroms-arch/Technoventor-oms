import React from 'react';
import { Download } from 'lucide-react';
import { PERMISSIONS } from '../../../constants';

export function BOQTab({ order, hasPermission, onExportBOQ }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white">Bill of Quantities</h3>
        <button 
          onClick={onExportBOQ}
          className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-sm text-slate-300 hover:bg-slate-700 transition-colors"
        >
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1000px]">
          <thead>
            <tr className="border-b border-slate-800">
              <th className="text-left p-4 text-xs font-semibold text-slate-500 uppercase">Sr.</th>
              <th className="text-left p-4 text-xs font-semibold text-slate-500 uppercase">Item Description</th>
              <th className="text-left p-4 text-xs font-semibold text-slate-500 uppercase">Specs</th>
              <th className="text-left p-4 text-xs font-semibold text-slate-500 uppercase">Qty/Unit</th>
              {hasPermission(PERMISSIONS.VIEW_ORDER_VALUE) && (
                <>
                  <th className="text-left p-4 text-xs font-semibold text-slate-500 uppercase">Rate</th>
                  <th className="text-left p-4 text-xs font-semibold text-slate-500 uppercase">GST %</th>
                  <th className="text-right p-4 text-xs font-semibold text-slate-500 uppercase">Total Amount</th>
                </>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {order.items.map((item, index) => (
              <tr key={item.id} className={`hover:bg-slate-800/30 transition-colors ${item.parentItemIndex ? 'bg-slate-800/20' : ''}`}>
                <td className="p-4 text-slate-500 font-mono text-sm">
                  {item.parentItemIndex ? (
                     <div className="flex items-center text-slate-600"><span className="ml-4 mr-2">↳</span></div>
                  ) : (
                     index + 1
                  )}
                </td>
                <td className="p-4">
                  <div className="text-sm font-medium text-white">{item.name}</div>
                  <div className="text-[10px] text-slate-500 font-mono mt-0.5">{item.itemCode || 'CODE-NOT-SET'}</div>
                  {item.description && (
                    <div className="text-[11px] text-slate-400 mt-2 bg-slate-950/20 p-2 rounded-lg italic border border-slate-800/30">
                      {item.description}
                    </div>
                  )}
                </td>
                <td className="p-4">
                  <div className="text-xs text-slate-300">{item.make || '-'}</div>
                  <div className="text-[10px] text-slate-500">{item.model || '-'}</div>
                </td>
                <td className="p-4 text-sm text-slate-300">{item.quantity} {item.unit}</td>
                {hasPermission(PERMISSIONS.VIEW_ORDER_VALUE) && (
                  <>
                    <td className="p-4 text-sm text-slate-300 font-mono">₹{item.rate.toLocaleString('en-IN')}</td>
                    <td className="p-4 text-xs text-slate-400">{item.gstPercent || 18}%</td>
                    <td className="p-4 text-right text-emerald-400 font-bold font-mono">₹{(item.totalAmount || item.amount).toLocaleString('en-IN')}</td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
          {hasPermission(PERMISSIONS.VIEW_ORDER_VALUE) && (
            <tfoot className="bg-slate-800/20">
              <tr className="border-t border-slate-700">
                <td colSpan="6" className="p-4 text-right font-semibold text-slate-400">Sub Total:</td>
                <td className="p-4 text-right font-mono text-white font-bold text-lg">₹{(order.summary?.subTotal || order.totalValue).toLocaleString('en-IN')}</td>
              </tr>
              {order.summary && (
                <tr>
                  <td colSpan="6" className="px-4 py-2 text-right text-slate-500 text-xs">Total GST:</td>
                  <td className="px-4 py-2 text-right font-mono text-slate-400 text-sm">₹{order.summary.gstAmount.toLocaleString('en-IN')}</td>
                </tr>
              )}
              <tr className="border-t-2 border-emerald-500/20">
                <td colSpan="6" className="p-4 text-right font-black text-emerald-400">GRAND TOTAL:</td>
                <td className="p-4 text-right font-mono text-emerald-400 font-black text-2xl animate-pulse">₹{(order.summary?.grandTotal || order.totalValue).toLocaleString('en-IN')}</td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </div>
  );
}
