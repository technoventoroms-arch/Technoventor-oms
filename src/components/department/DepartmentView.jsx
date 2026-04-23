import React from 'react';
import { Building2, CreditCard, Warehouse, Truck, CheckCircle2, ClipboardList } from 'lucide-react';
import { PERMISSIONS, STAGE_LABELS } from '../../constants';
import { StageTag } from '../common';

export function DepartmentView({ department, orders, pastOrders = [], onSelectOrder, onSelectOrderWithPlanning, currentUser, hasPermission }) {
  const icons = {
    procurement: <Building2 className="w-6 h-6" />,
    finance: <CreditCard className="w-6 h-6" />,
    stores: <Warehouse className="w-6 h-6" />,
    dispatch: <Truck className="w-6 h-6" />
  };

  const colors = {
    procurement: 'from-purple-500/20 to-purple-600/20 border-purple-500/30',
    finance: 'from-amber-500/20 to-amber-600/20 border-amber-500/30',
    stores: 'from-cyan-500/20 to-cyan-600/20 border-cyan-500/30',
    dispatch: 'from-orange-500/20 to-orange-600/20 border-orange-500/30'
  };

  const renderOrderCard = (order, isPast = false) => (
    <div 
      key={order.id}
      className={`bg-slate-900/50 border border-slate-800 rounded-xl p-6 hover:bg-slate-800/50 transition-all ${isPast ? 'opacity-80' : ''}`}
    >
      <div className="flex items-center justify-between">
        <div
          className="flex-1 cursor-pointer"
          onClick={() => onSelectOrder(order)}
        >
          <div className="flex items-center gap-3">
            <span className="font-mono text-emerald-400">{order.id}</span>
            <span className="text-white font-semibold">{hasPermission(PERMISSIONS.VIEW_PROJECT_NAME) ? order.projectName : 'Restricted'}</span>
            <StageTag stage={order.currentStage} />
          </div>
          <div className="flex gap-4 mt-1">
            <p className="text-sm text-slate-400">{hasPermission(PERMISSIONS.VIEW_CUSTOMER_NAME) ? (order.customerDetails?.name || 'N/A') : 'Restricted'}</p>
            {department === 'finance' && (
              <div className="flex gap-4">
                <p className="text-sm text-emerald-400 font-mono">
                  PO: {(order.procurement?.boqPurchases || [])
                    .map(p => p.poDetails?.poNumber)
                    .filter(n => n && n.trim() !== '')
                    .filter((v, i, a) => a.indexOf(v) === i)
                    .join(', ') || 'N/A'}
                </p>
                <p className="text-sm text-blue-400 font-mono">
                  Items: {order.items?.length || 0}
                </p>
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right" onClick={() => onSelectOrder(order)} style={{cursor:'pointer'}}>
            {hasPermission(PERMISSIONS.VIEW_ORDER_VALUE) && (
              <p className="text-lg font-bold text-white">₹{order.totalValue?.toLocaleString('en-IN') || 0}</p>
            )}
            <p className="text-sm text-slate-400">Created: {order.createdDate}</p>
          </div>
          {onSelectOrderWithPlanning && (
            <button
              onClick={() => onSelectOrderWithPlanning(order)}
              className="flex items-center gap-1.5 px-3 py-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-xl text-xs font-bold hover:bg-emerald-500/20 transition-all whitespace-nowrap"
              title="View Order Planning"
            >
              <ClipboardList className="w-3.5 h-3.5" />
              Planning
            </button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className={`bg-gradient-to-r ${colors[department]} border rounded-xl p-6`}>
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white/10 rounded-xl">{icons[department]}</div>
          <div>
            <h2 className="text-2xl font-bold text-white capitalize">{department} Department</h2>
            <p className="text-slate-300">{orders.length} orders pending action</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-bold text-white mb-4">Pending Action</h3>
        {orders.length === 0 ? (
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-12 text-center">
            <CheckCircle2 className="w-16 h-16 mx-auto mb-4 text-green-500/50" />
            <h3 className="text-xl font-semibold text-white mb-2">All Clear!</h3>
            <p className="text-slate-400">No pending orders</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map(o => renderOrderCard(o, false))}
          </div>
        )}
      </div>

      {pastOrders.length > 0 && (
        <div className="space-y-4 mt-8 pt-8 border-t border-slate-800/50">
          <h3 className="text-lg font-bold text-white mb-4">Escalated / Past Orders</h3>
          <div className="space-y-4">
            {pastOrders.map(o => renderOrderCard(o, true))}
          </div>
        </div>
      )}
    </div>
  );
}
