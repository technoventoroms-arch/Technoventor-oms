import React from 'react';
import { Layers, Plus, Trash2 } from 'lucide-react';
import { ITEM_UNITS } from '../../../constants';

export function BOQItemsSection({ items, setItems, updateItem, removeItem, addItem, addSubItem }) {
  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
      <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-800/20">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500/20 rounded-lg">
            <Layers className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-white">5. BOQ Item List</h3>
            <p className="text-xs text-slate-500">Add detailed bill of quantity items</p>
          </div>
        </div>
        <button type="button" onClick={addItem} className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-xl text-sm font-semibold hover:bg-emerald-500/20 transition-all shadow-lg">
          <Plus className="w-4 h-4" /> Add Row
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1200px]">
          <thead className="bg-slate-950/50">
            <tr>
              <th className="text-left p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Sr.</th>
              <th className="text-left p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Item Details</th>
              <th className="text-left p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Specs (Make/Model)</th>
              <th className="text-left p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Qty/Unit</th>
              <th className="text-left p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Pricing (₹)</th>
              <th className="text-left p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">GST %</th>
              <th className="text-left p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Type</th>
              <th className="text-left p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Amount (₹)</th>
              <th className="p-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {items.map((item, index) => (
              <tr key={item.id} className={`hover:bg-slate-800/30 transition-colors group ${item.parentItemIndex ? 'bg-slate-800/20' : ''}`}>
                <td className="p-4 text-slate-500 font-mono text-sm">
                  {item.parentItemIndex ? (
                     <div className="flex items-center text-slate-600"><span className="ml-4 mr-2">↳</span></div>
                  ) : (
                     index + 1
                  )}
                </td>
                <td className="p-4 space-y-2 w-72">
                  <input
                    type="text"
                    placeholder="Item Description"
                    value={item.name}
                    onChange={(e) => updateItem(index, 'name', e.target.value)}
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-white"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Item Code"
                    value={item.itemCode}
                    onChange={(e) => updateItem(index, 'itemCode', e.target.value)}
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-1.5 text-[10px] text-slate-400 font-mono"
                  />
                  <textarea
                    placeholder="Detailed Description (Optional)"
                    value={item.description}
                    onChange={(e) => updateItem(index, 'description', e.target.value)}
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-1.5 text-[11px] text-slate-300 min-h-[50px] focus:ring-1 focus:ring-emerald-500/30 outline-none resize-none"
                    rows={2}
                  />
                </td>
                <td className="p-4 space-y-2 w-48">
                  <input
                    type="text"
                    placeholder="Make"
                    value={item.make}
                    onChange={(e) => updateItem(index, 'make', e.target.value)}
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-white"
                  />
                  <input
                    type="text"
                    placeholder="Model"
                    value={item.model}
                    onChange={(e) => updateItem(index, 'model', e.target.value)}
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-white"
                  />
                </td>
                <td className="p-4 w-40">
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => updateItem(index, 'quantity', parseFloat(e.target.value) || 0)}
                      className="w-20 bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-white text-center"
                      min="0.01"
                      step="0.01"
                      required
                    />
                    <select
                      value={item.unit}
                      onChange={(e) => updateItem(index, 'unit', e.target.value)}
                      className="w-24 bg-slate-800/50 border border-slate-700 rounded-lg px-2 py-1.5 text-xs text-white"
                    >
                      {ITEM_UNITS.map(unit => <option key={unit} value={unit}>{unit}</option>)}
                    </select>
                  </div>
                </td>
                <td className="p-4 w-40">
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs">₹</span>
                    <input
                      type="number"
                      value={item.rate}
                      onChange={(e) => updateItem(index, 'rate', parseFloat(e.target.value) || 0)}
                      className="w-full bg-slate-800/50 border border-slate-700 rounded-lg pl-6 pr-3 py-1.5 text-sm text-white"
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>
                </td>
                <td className="p-4 w-24">
                  <select
                    value={item.gstPercent}
                    onChange={(e) => updateItem(index, 'gstPercent', parseFloat(e.target.value))}
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-2 py-1.5 text-sm text-white"
                  >
                    {[0, 5, 12, 18, 28].map(rate => <option key={rate} value={rate}>{rate}%</option>)}
                  </select>
                </td>
                <td className="p-4 w-32">
                  <select
                    value={item.itemType || 'goods'}
                    onChange={(e) => updateItem(index, 'itemType', e.target.value)}
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-2 py-1.5 text-[10px] text-white font-bold uppercase"
                  >
                    <option value="goods">Goods</option>
                    <option value="service" className="text-blue-400">Service</option>
                  </select>
                </td>
                <td className="p-4 text-right">
                  <div className="text-xs text-slate-500 mb-1">Total (Incl GST)</div>
                  <div className="text-sm font-bold text-white font-mono">₹{item.totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {!item.parentItemIndex && (
                      <button
                        type="button"
                        onClick={() => addSubItem(item.id)}
                        className="p-1.5 text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                        title="Add Sub-item"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
