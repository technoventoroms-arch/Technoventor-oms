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
          <h2 className="text-2xl font-bold text-text-primary">All Orders</h2>
          <p className="text-text-secondary">{filteredOrders.length} orders</p>
        </div>
        <select
          value={filterStage}
          onChange={(e) => setFilterStage(e.target.value)}
          className="bg-surface-raised dark:bg-slate-800 border border-border rounded-lg px-4 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
        >
          <option value="all">All Stages</option>
          {Object.entries(STAGE_LABELS).map(([key, label]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>
      </div>

      <div className="bg-surface border border-border rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-surface-raised">
            <tr>
              <th className="text-left p-4 text-xs font-semibold text-text-muted uppercase tracking-widest">Sr.</th>
              <th className="text-left p-4 text-xs font-semibold text-text-muted uppercase tracking-widest">Order ID</th>
              <th className="text-left p-4 text-xs font-semibold text-text-muted uppercase tracking-widest">Project Name</th>
              <th className="text-left p-4 text-xs font-semibold text-text-muted uppercase tracking-widest">Client Name</th>
              {hasPermission(PERMISSIONS.VIEW_ORDER_VALUE) && (
                <th className="text-left p-4 text-xs font-semibold text-text-muted uppercase tracking-widest">Value</th>
              )}
              <th className="text-left p-4 text-xs font-semibold text-text-muted uppercase tracking-widest">Current Stage</th>
              <th className="p-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filteredOrders.map((order, index) => (
              <tr 
                key={order.id}
                onClick={() => onSelectOrder(order)}
                className="hover:bg-surface-raised cursor-pointer transition-all active:scale-[0.998]"
              >
                <td className="p-4 text-xs font-mono text-text-muted">{index + 1}</td>
                <td className="p-4 text-sm font-mono text-emerald-700 dark:text-emerald-400">{order.id}</td>
                <td className="p-4 text-sm font-bold text-text-primary uppercase tracking-tight">{hasPermission(PERMISSIONS.VIEW_PROJECT_NAME) ? order.projectName : 'Restricted'}</td>
                <td className="p-4 text-sm text-text-secondary font-medium">{hasPermission(PERMISSIONS.VIEW_CUSTOMER_NAME) ? (order.customerDetails?.name || 'N/A') : 'Restricted'}</td>
                {hasPermission(PERMISSIONS.VIEW_ORDER_VALUE) && (
                  <td className="p-4 text-sm text-text-primary font-mono font-bold">₹{order.totalValue.toLocaleString('en-IN')}</td>
                )}
                <td className="p-4"><StageTag stage={order.currentStage} /></td>
                <td className="p-4"><ChevronRight className="w-5 h-5 text-text-muted" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
