import React, { useState } from 'react';
import {
  ClipboardList, Package, CalendarDays, Flag, ChevronRight,
  CheckCircle2, Clock, AlertCircle, Search, Filter
} from 'lucide-react';
import { PERMISSIONS } from '../../constants';

const STATUS_STYLE = {
  Completed: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
  'In Progress': 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
  Pending: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
  'Not Applicable': 'bg-slate-500/10 text-slate-400 border border-slate-500/20',
};

function StatusBadge({ status }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${STATUS_STYLE[status] || STATUS_STYLE.Pending}`}>
      {status || 'Pending'}
    </span>
  );
}

function PlanningStats({ orders }) {
  const withPlanning = orders.filter(o => o.planning);
  const withDelivery = orders.filter(o => o.planning?.projectEndDate);
  const completed = orders.filter(o =>
    o.planning?.stages?.every(s => s.status === 'Completed')
  );

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {[
        { label: 'Total Orders', value: orders.length, icon: <Package className="w-5 h-5" />, color: 'text-slate-300' },
        { label: 'Plans Created', value: withPlanning.length, icon: <ClipboardList className="w-5 h-5" />, color: 'text-blue-400' },
        { label: 'Delivery Set', value: withDelivery.length, icon: <CalendarDays className="w-5 h-5" />, color: 'text-amber-400' },
        { label: 'Fully Planned', value: completed.length, icon: <CheckCircle2 className="w-5 h-5" />, color: 'text-emerald-400' },
      ].map(stat => (
        <div key={stat.label} className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 flex items-center gap-4">
          <div className={`${stat.color} opacity-70`}>{stat.icon}</div>
          <div>
            <p className={`text-2xl font-black ${stat.color}`}>{stat.value}</p>
            <p className="text-xs text-slate-500 font-semibold uppercase tracking-wide mt-0.5">{stat.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export function PlanningView({ orders, onSelectOrder, currentUser, hasPermission }) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all'); // all | planned | unplanned

  const filtered = orders.filter(order => {
    const matchSearch =
      (order.projectName || '').toLowerCase().includes(search.toLowerCase()) ||
      order.id.toLowerCase().includes(search.toLowerCase());
    const matchFilter =
      filter === 'all' ||
      (filter === 'planned' && order.planning) ||
      (filter === 'unplanned' && !order.planning);
    return matchSearch && matchFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-500/20 to-teal-600/20 border border-emerald-500/30 rounded-xl p-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white/10 rounded-xl">
            <ClipboardList className="w-6 h-6 text-emerald-300" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Planning Department</h2>
            <p className="text-slate-300 text-sm mt-0.5">Manage delivery schedules, BOQ timelines & project milestones</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <PlanningStats orders={orders} />

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            className="w-full bg-slate-900/60 border border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/40"
            placeholder="Search by order ID or project name..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          {['all', 'planned', 'unplanned'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2.5 rounded-xl text-sm font-semibold capitalize transition-all ${filter === f
                  ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                  : 'bg-slate-900/50 border border-slate-800 text-slate-400 hover:text-white'
                }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      {filtered.length === 0 ? (
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-12 text-center">
          <ClipboardList className="w-16 h-16 mx-auto mb-4 text-slate-700" />
          <h3 className="text-xl font-semibold text-white mb-2">No Orders Found</h3>
          <p className="text-slate-400 text-sm">Try changing your search or filter.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(order => {
            const planning = order.planning;
            const boqItems = planning?.boqItems || [];
            const stages = planning?.stages || [];
            const applicableStages = stages.filter(s => s.status !== 'Not Applicable');
            const completedStages = applicableStages.filter(s => s.status === 'Completed').length;
            const inProgressStages = applicableStages.filter(s => s.status === 'In Progress').length;
            
            let overallStatus = 'Pending';
            if (stages.length > 0 && applicableStages.length === 0) {
              overallStatus = 'Not Applicable';
            } else if (completedStages === applicableStages.length && applicableStages.length > 0) {
              overallStatus = 'Completed';
            } else if (inProgressStages > 0 || completedStages > 0) {
              overallStatus = 'In Progress';
            }

            return (
              <div
                key={order.id}
                className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden hover:border-slate-700 transition-all"
              >
                {/* Order Header Row */}
                <div
                  className="flex items-center justify-between p-5 cursor-pointer hover:bg-slate-800/30 transition-colors"
                  onClick={() => onSelectOrder(order, 'planning')}
                >
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${overallStatus === 'Completed' ? 'bg-emerald-400' :
                        overallStatus === 'In Progress' ? 'bg-blue-400' : overallStatus === 'Not Applicable' ? 'bg-slate-500' : 'bg-slate-600'
                      }`} />
                    <div className="min-w-0">
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="font-mono text-emerald-400 text-sm">{order.id}</span>
                        <span className="font-semibold text-white truncate">
                          {hasPermission(PERMISSIONS.VIEW_PROJECT_NAME) ? order.projectName : 'Restricted'}
                        </span>
                        <StatusBadge status={overallStatus} />
                      </div>
                      <div className="flex items-center gap-4 mt-1 flex-wrap">
                        <span className="text-xs text-slate-500">
                          {hasPermission(PERMISSIONS.VIEW_CUSTOMER_NAME)
                            ? order.customerDetails?.name || 'N/A'
                            : 'Restricted'}
                        </span>
                        {planning?.projectEndDate && (
                          <span className="text-xs text-amber-400 flex items-center gap-1">
                            <CalendarDays className="w-3 h-3" />
                            Due: {planning.projectEndDate}
                          </span>
                        )}
                        {planning?.deliveryLocation && (
                          <span className="text-xs text-slate-500">📍 {planning.deliveryLocation}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 flex-shrink-0">
                    {!planning ? (
                      <span className="flex items-center gap-1.5 text-xs text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-lg font-semibold">
                        <AlertCircle className="w-3.5 h-3.5" /> Not Planned
                      </span>
                    ) : (
                      <span className="text-xs text-slate-400">
                        {completedStages}/{stages.length} stages
                      </span>
                    )}
                    <ChevronRight className="w-4 h-4 text-slate-600" />
                  </div>
                </div>

                {/* Planning Preview — only if planning exists */}
                {planning && (
                  <div className="border-t border-slate-800/60 bg-slate-950/30 px-5 py-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                      {/* BOQ Summary */}
                      <div>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                          <Package className="w-3 h-3" /> BOQ Items
                        </p>
                        <div className="space-y-1.5">
                          {boqItems.slice(0, 3).map((item, i) => (
                            <div key={i} className="flex items-center justify-between text-sm">
                              <span className="text-slate-400 truncate max-w-[150px]">{item.itemName}</span>
                              <StatusBadge status={item.status || 'Pending'} />
                            </div>
                          ))}
                          {boqItems.length > 3 && (
                            <p className="text-[10px] text-slate-600">+{boqItems.length - 3} more items</p>
                          )}
                          {boqItems.length === 0 && (
                            <p className="text-xs text-slate-600 italic">No items planned</p>
                          )}
                        </div>
                      </div>

                      {/* Stage Progress */}
                      <div>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                          <Clock className="w-3 h-3" /> Stages
                        </p>
                        <div className="space-y-1.5">
                          {stages.map((stage, i) => (
                            <div key={i} className="flex items-center gap-2 text-sm">
                              <div className={`w-2 h-2 rounded-full flex-shrink-0 ${stage.status === 'Completed' ? 'bg-emerald-400' :
                                  stage.status === 'In Progress' ? 'bg-blue-400' : stage.status === 'Not Applicable' ? 'bg-slate-500' : 'bg-slate-700'
                                }`} />
                              <span className="text-slate-400 flex-1 truncate">{stage.stage}</span>
                              {stage.end && <span className="text-slate-600 text-xs">{stage.end}</span>}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Milestones */}
                      <div>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                          <Flag className="w-3 h-3 text-amber-400" /> Milestones
                        </p>
                        <div className="space-y-1.5">
                          {(planning.milestones || []).filter(m => m.date).slice(0, 4).map((m, i) => (
                            <div key={i} className="flex items-center gap-2 text-sm">
                              <span className="text-amber-400 font-mono flex-shrink-0">{m.date}</span>
                              <span className="text-slate-400 truncate">{m.title}</span>
                            </div>
                          ))}
                          {!(planning.milestones || []).some(m => m.date) && (
                            <p className="text-xs text-slate-600 italic">No milestones set</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
