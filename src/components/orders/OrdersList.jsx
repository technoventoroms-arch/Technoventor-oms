import React, { useState, useMemo, useEffect } from 'react';
import { ChevronRight } from 'lucide-react';
import { PERMISSIONS, STAGE_LABELS } from '../../constants';
import { StageTag } from '../common';

export function OrdersList({ orders, initialFilter = 'all', onSelectOrder, currentUser, hasPermission }) {
  const [filterStage, setFilterStage] = useState(initialFilter);

  useEffect(() => {
    setFilterStage(initialFilter);
  }, [initialFilter]);

  const filteredOrders = useMemo(() => {
    if (filterStage === 'all') return orders;
    if (filterStage === 'planning') return orders.filter(order => order.planning);
    return orders.filter(order => order.currentStage === filterStage);
  }, [orders, filterStage]);
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">All Orders</h2>
          <p className="text-slate-400">{filteredOrders.length} orders</p>
        </div>
        <select
          value={filterStage}
          onChange={(e) => setFilterStage(e.target.value)}
          className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
        >
          <option value="all">All Stages</option>
          {Object.entries(STAGE_LABELS).map(([key, label]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>
      </div>

      <div className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-800/50">
            <tr>
              <th className="text-left p-4 text-xs font-semibold text-slate-500 uppercase tracking-widest">Sr.</th>
              <th className="text-left p-4 text-xs font-semibold text-slate-500 uppercase tracking-widest">Order ID</th>
              <th className="text-left p-4 text-xs font-semibold text-slate-500 uppercase tracking-widest">Project Name</th>
              <th className="text-left p-4 text-xs font-semibold text-slate-500 uppercase tracking-widest">Client Name</th>
              {hasPermission(PERMISSIONS.VIEW_ORDER_VALUE) && (
                <th className="text-left p-4 text-xs font-semibold text-slate-500 uppercase tracking-widest">Value</th>
              )}
              <th className="text-left p-4 text-xs font-semibold text-slate-500 uppercase tracking-widest">Current Stage</th>
              <th className="p-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {filteredOrders.map((order, index) => (
              <tr 
                key={order.id}
                onClick={() => onSelectOrder(order)}
                className="hover:bg-slate-800/50 cursor-pointer transition-all active:scale-[0.998]"
              >
                <td className="p-4 text-xs font-mono text-slate-500">{index + 1}</td>
                <td className="p-4 text-sm font-mono text-emerald-400">{order.id}</td>
                <td className="p-4 text-sm font-bold text-white uppercase tracking-tight">{hasPermission(PERMISSIONS.VIEW_PROJECT_NAME) ? order.projectName : 'Restricted'}</td>
                <td className="p-4 text-sm text-slate-300 font-medium">{hasPermission(PERMISSIONS.VIEW_CUSTOMER_NAME) ? (order.customerDetails?.name || 'N/A') : 'Restricted'}</td>
                {hasPermission(PERMISSIONS.VIEW_ORDER_VALUE) && (
                  <td className="p-4 text-sm text-white font-mono font-bold">₹{order.totalValue.toLocaleString('en-IN')}</td>
                )}
                <td className="p-4"><StageTag stage={order.currentStage} /></td>
                <td className="p-4"><ChevronRight className="w-5 h-5 text-slate-500" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
