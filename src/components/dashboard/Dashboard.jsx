import React, { useState, useMemo } from 'react';
import { Package, Plus, Building2, CreditCard, Warehouse, Truck, CheckCircle2, ClipboardList } from 'lucide-react';
import { ORDER_STAGES, PERMISSIONS, STAGE_LABELS } from '../../constants';
import { StatCard, StageTag } from '../common';

export function Dashboard({ orders, currentUser, hasPermission, onSelectOrder }) {
  const [selectedStage, setSelectedStage] = useState('all');
  const stats = useMemo(() => {
    const s = {
      total: orders.length,
      new: orders.filter(o => o.currentStage === ORDER_STAGES.NEW).length,
      planning: orders.filter(o => o.currentStage === ORDER_STAGES.PLANNING).length,
      stores: orders.filter(o => o.currentStage === ORDER_STAGES.STORES).length,
      procurement: orders.filter(o => o.currentStage === ORDER_STAGES.PROCUREMENT).length,
      finance: orders.filter(o => o.currentStage === ORDER_STAGES.FINANCE).length,
      stores_inward: orders.filter(o => o.currentStage === ORDER_STAGES.STORES_INWARD).length,
      dispatch: orders.filter(o => o.currentStage === ORDER_STAGES.DISPATCH).length,
      completed: orders.filter(o => o.currentStage === ORDER_STAGES.COMPLETED).length,
      totalValue: orders.reduce((sum, o) => sum + o.totalValue, 0),
      // Pending sub-counts
      pendingFinancePOs: 0,
      pendingInwardPOs: 0,
      pendingDispatchItems: 0
    };

    orders.forEach(order => {
      // 1. Finance pending POs
      const poGroupsFinance = new Set();
      (order.procurement?.boqPurchases || []).forEach(p => {
        if (p.poDetails?.poStatus === 'Pending Approval') {
          // Check if this PO is already completed in finance
          const finRecord = (order.finance || []).find(f => f.poNumber === p.poDetails?.poNumber);
          if (finRecord?.paymentStatus === 'Completed') return;

          const key = p.poDetails?.poNumber || p.vendorDetails?.name;
          if (key) poGroupsFinance.add(key);
        }
      });
      s.pendingFinancePOs += poGroupsFinance.size;

      // 2. Inward pending POs (Paid by Finance but not yet inwarded)
      const financeMap = (order.finance || []).reduce((acc, f) => {
        if (f.poNumber) acc[f.poNumber] = f.paymentStatus;
        return acc;
      }, {});
      
      const inwardedItemIds = new Set((order.stores?.boqInwards || []).filter(i => i.inwardDate).map(i => i.boqItemId));
      const poToItems = {};
      (order.procurement?.boqPurchases || []).forEach(p => {
        const key = p.poDetails?.poNumber;
        if (!key) return;
        if (!poToItems[key]) poToItems[key] = [];
        poToItems[key].push(p.boqItemId);
      });

      Object.keys(poToItems).forEach(poKey => {
        if (financeMap[poKey] === 'Completed') {
          const allInwarded = poToItems[poKey].every(id => inwardedItemIds.has(id));
          if (!allInwarded) s.pendingInwardPOs++;
        }
      });

      // 3. Dispatch pending (Orders at dispatch stage with pending items)
      if (order.currentStage === ORDER_STAGES.DISPATCH) {
        const dispatchItems = order.dispatch?.boqDispatch || [];
        const pendingCount = (order.items || []).filter(item => {
          const d = dispatchItems.find(di => di.boqItemId === item.id);
          return !d || d.status !== 'Shipped';
        }).length;
        if (pendingCount > 0) s.pendingDispatchItems += pendingCount;
      }
    });

    return s;
  }, [orders]);


  const allPOs = useMemo(() => {
    const pos = [];
    orders.forEach(order => {
      const purchases = order.procurement?.boqPurchases || [];
      const poMap = new Map();
      
      purchases.forEach(p => {
        const poKey = p.poDetails?.poNumber || p.vendorDetails?.name;
        if (!poKey) return;
        
        if (!poMap.has(poKey)) {
          const finRecord = (order.finance || []).find(f => f.poNumber === p.poDetails?.poNumber) || {};
          poMap.set(poKey, {
            poNumber: p.poDetails?.poNumber,
            vendorName: p.vendorDetails?.name,
            poValue: p.poDetails?.poValue,
            poStatus: p.poDetails?.poStatus,
            paymentStatus: finRecord.paymentStatus || 'Pending',
            orderId: order.id,
            projectName: order.projectName,
            order: order
          });
        }
      });
      poMap.forEach(po => pos.push(po));
    });
    return pos;
  }, [orders]);

  const pendingFinancePOs = allPOs.filter(po => 
    po.poStatus === 'Pending Approval' && po.paymentStatus !== 'Completed'
  );

  const completedPOs = allPOs.filter(po => 
    po.paymentStatus === 'Completed'
  );

  const [poListView, setPoListView] = useState('pending'); // 'pending' or 'completed'

  const displayedOrders = useMemo(() => {
    let filtered = orders;
    if (selectedStage !== 'all') {
      if (selectedStage === 'stores_combined') {
        filtered = orders.filter(o => o.currentStage === ORDER_STAGES.STORES || o.currentStage === ORDER_STAGES.STORES_INWARD);
      } else {
        filtered = orders.filter(o => o.currentStage === selectedStage);
      }
    }
    return filtered.slice(0, 10);
  }, [orders, selectedStage]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Dashboard</h2>
          <p className="text-slate-400">Welcome back, {currentUser?.name}</p>
        </div>
        {hasPermission(PERMISSIONS.VIEW_ORDER_VALUE) && (
          <div className="text-right">
            <p className="text-sm text-slate-400">Total Order Value</p>
            <p className="text-2xl font-bold text-emerald-400">₹{stats.totalValue.toLocaleString('en-IN')}</p>
          </div>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-10 gap-3">
        <StatCard label="Total" value={stats.total} icon={<Package />} color="slate" onClick={() => setSelectedStage('all')} />
        <StatCard label="New" value={stats.new} icon={<Plus />} color="blue" onClick={() => setSelectedStage('new')} />
        <StatCard label="Planning" value={stats.planning} icon={<ClipboardList className="w-5 h-5" />} color="indigo" onClick={() => setSelectedStage('planning')} />
        <StatCard label="Stores" value={stats.stores} icon={<Warehouse />} color="amber" onClick={() => setSelectedStage('stores')} />
        <StatCard label="Procurement" value={stats.procurement} icon={<Building2 />} color="purple" onClick={() => setSelectedStage('procurement')} />
        <StatCard label="Finance" value={stats.finance} icon={<CreditCard />} color="yellow" onClick={() => setSelectedStage('finance')} subValue={stats.pendingFinancePOs} subLabel="POs pend" />
        <StatCard label="Inward" value={stats.stores_inward} icon={<Warehouse />} color="cyan" onClick={() => setSelectedStage('stores_inward')} subValue={stats.pendingInwardPOs} subLabel="POs pend" />
        <StatCard label="Dispatch" value={stats.dispatch} icon={<Truck />} color="orange" onClick={() => setSelectedStage('dispatch')} subValue={stats.pendingDispatchItems} subLabel="Items pend" />
        <StatCard label="Done" value={stats.completed} icon={<CheckCircle2 />} color="green" onClick={() => setSelectedStage('completed')} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders List */}
        <div className="lg:col-span-1 bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden flex flex-col h-[500px]">
          <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/80">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              {selectedStage === 'all' ? 'Recent Orders' : `${STAGE_LABELS[selectedStage] || 'Filtered'} Orders`}
            </h3>
            {selectedStage !== 'all' && (
              <button 
                onClick={() => setSelectedStage('all')}
                className="text-[10px] font-bold text-emerald-400 hover:text-emerald-300 transition-colors uppercase"
              >
                Clear
              </button>
            )}
          </div>
          <div className="flex-1 overflow-y-auto divide-y divide-slate-800 scrollbar-thin scrollbar-thumb-slate-700">
            {displayedOrders.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-sm">No orders found.</div>
            ) : (
              displayedOrders.map(order => (
                <div 
                  key={order.id}
                  onClick={() => onSelectOrder(order)}
                  className="p-4 hover:bg-slate-800/50 cursor-pointer transition-colors"
                >
                  <p className="font-semibold text-white text-sm truncate">{hasPermission(PERMISSIONS.VIEW_PROJECT_NAME) ? order.projectName : 'Restricted Project'}</p>
                  <div className="flex justify-between items-center mt-1">
                    <p className="text-[10px] text-slate-500 font-mono">{order.id}</p>
                    <StageTag stage={order.currentStage} />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* PO Task View */}
        <div className="lg:col-span-2 bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden flex flex-col h-[500px]">
          <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-950/40">
            <div className="flex gap-4">
              <button 
                onClick={() => setPoListView('pending')}
                className={`text-sm font-bold uppercase tracking-wider transition-colors ${poListView === 'pending' ? 'text-amber-400' : 'text-slate-500 hover:text-slate-400'}`}
              >
                Pending POs ({pendingFinancePOs.length})
              </button>
              <button 
                onClick={() => setPoListView('completed')}
                className={`text-sm font-bold uppercase tracking-wider transition-colors ${poListView === 'completed' ? 'text-emerald-400' : 'text-slate-500 hover:text-slate-400'}`}
              >
                Past Escalated ({completedPOs.length})
              </button>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700">
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 bg-slate-900 z-10">
                <tr className="border-b border-slate-800">
                  <th className="p-4 text-[10px] font-bold text-slate-500 uppercase">Vendor & PO</th>
                  <th className="p-4 text-[10px] font-bold text-slate-500 uppercase">Project / Order</th>
                  <th className="p-4 text-[10px] font-bold text-slate-500 uppercase">Amount</th>
                  <th className="p-4 text-[10px] font-bold text-slate-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {(poListView === 'pending' ? pendingFinancePOs : completedPOs).map((po, idx) => (
                  <tr 
                    key={`${po.orderId}-${po.poNumber || idx}`}
                    onClick={() => onSelectOrder(po.order)}
                    className="hover:bg-slate-800/40 cursor-pointer transition-colors group"
                  >
                    <td className="p-4">
                      <p className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">{po.vendorName}</p>
                      <p className="text-[10px] font-mono text-slate-500">PO: {po.poNumber || 'N/A'}</p>
                    </td>
                    <td className="p-4">
                      <p className="text-xs font-semibold text-slate-300 truncate max-w-[200px]">{po.projectName}</p>
                      <p className="text-[10px] text-slate-500">{po.orderId}</p>
                    </td>
                    <td className="p-4 font-mono text-xs text-slate-300">
                      ₹{Number(po.poValue || 0).toLocaleString('en-IN')}
                    </td>
                    <td className="p-4">
                      <span className={`text-[10px] font-bold px-2 py-1 rounded-lg border ${
                        po.paymentStatus === 'Completed' 
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                          : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                      }`}>
                        {po.paymentStatus}
                      </span>
                    </td>
                  </tr>
                ))}
                {(poListView === 'pending' ? pendingFinancePOs : completedPOs).length === 0 && (
                  <tr>
                    <td colSpan="4" className="p-12 text-center text-slate-500 text-sm italic">
                      No {poListView} Purchase Orders found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
