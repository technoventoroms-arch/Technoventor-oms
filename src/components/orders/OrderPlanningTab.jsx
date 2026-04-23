import React, { useState } from 'react';
import { CalendarDays, Package, MapPin, ClipboardList, Flag, ChevronDown, ChevronUp } from 'lucide-react';

const STATUS_COLORS = {
  Completed: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  'In Progress': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  Pending: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  'Not Applicable': 'bg-slate-500/10 text-slate-400 border-slate-500/20',
};

function StatusBadge({ status }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${STATUS_COLORS[status] || STATUS_COLORS['Pending']}`}>
      {status}
    </span>
  );
}

export function OrderPlanningTab({ order, onUpdate, currentUser, canEdit = true }) {
  const [planning, setPlanning] = useState(() => {
    const existing = order.planning || {};
    return {
      deliveryLocation: existing.deliveryLocation || '',
      projectStartDate: existing.projectStartDate || '',
      projectEndDate: existing.projectEndDate || '',
      boqItems: (order.items || []).map(item => {
        const ex = (existing.boqItems || []).find(b => b.itemId === item.id) || {};
        return {
          itemId: item.id,
          itemName: item.name,
          totalQty: item.quantity,
          unit: item.unit,
          plannedQty: ex.plannedQty || '',
          deliveryDate: ex.deliveryDate || '',
          status: ex.status || 'Pending',
        };
      }),
      stages: existing.stages || [
        { stage: 'Material Procurement', start: '', end: '', status: 'Pending' },
        { stage: 'Dispatch', start: '', end: '', status: 'Pending' },
        { stage: 'Installation', start: '', end: '', status: 'Pending' },
        { stage: 'Testing & Handover', start: '', end: '', status: 'Pending' },
      ],
      milestones: existing.milestones || [
        { date: '', title: 'First Material Delivery' },
        { date: '', title: 'Dispatch Complete' },
        { date: '', title: 'Installation Complete' },
        { date: '', title: 'Project Handover' },
      ],
    };
  });

  const [saved, setSaved] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [expandedStage, setExpandedStage] = useState(null);
  const [isBoqExpanded, setIsBoqExpanded] = useState(true);

  const updateBoqItem = (index, field, value) => {
    setPlanning(prev => {
      const items = [...prev.boqItems];
      items[index] = { ...items[index], [field]: value };
      return { ...prev, boqItems: items };
    });
    setSaved(false);
  };

  const updateStage = (index, field, value) => {
    setPlanning(prev => {
      const stages = [...prev.stages];
      stages[index] = { ...stages[index], [field]: value };
      return { ...prev, stages };
    });
    setSaved(false);
  };

  const updateMilestone = (index, field, value) => {
    setPlanning(prev => {
      const milestones = [...prev.milestones];
      milestones[index] = { ...milestones[index], [field]: value };
      return { ...prev, milestones };
    });
    setSaved(false);
  };

  const handleSave = async () => {
    setIsSubmitting(true);
    try {
      await onUpdate({ 
        planning,
        history: [
          ...(order.history || []),
          {
            date: new Date().toISOString(),
            action: `Order Planning details updated`,
            by: currentUser?.name || 'Unknown',
            department: currentUser?.department || 'Unknown'
          }
        ]
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputCls = 'w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/40 transition';
  const selectCls = `${inputCls} cursor-pointer`;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-emerald-400" />
            Order Planning
          </h3>
          <p className="text-slate-500 text-xs mt-1">Plan delivery, BOQ execution, and stage timelines</p>
        </div>
        {canEdit && (
          <button
            onClick={handleSave}
            disabled={isSubmitting}
            className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg flex items-center gap-2 disabled:opacity-50 ${saved ? 'bg-emerald-600 text-white' : 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:shadow-emerald-500/30'}`}
          >
            {isSubmitting ? <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></span> : null}
            {isSubmitting ? 'Saving...' : saved ? '✓ Saved' : 'Save Planning'}
          </button>
        )}
      </div>

      {/* Project Info */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
        <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
          <MapPin className="w-4 h-4 text-blue-400" /> Project Details
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1.5">Delivery Location</label>
            <input
              className={inputCls}
              value={planning.deliveryLocation}
              onChange={e => { setPlanning(p => ({ ...p, deliveryLocation: e.target.value })); setSaved(false); }}
              placeholder="e.g. Hinjewadi, Pune"
              disabled={!canEdit}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1.5">Project Start Date</label>
            <input
              type="date"
              className={inputCls}
              value={planning.projectStartDate}
              onChange={e => { setPlanning(p => ({ ...p, projectStartDate: e.target.value })); setSaved(false); }}
              disabled={!canEdit}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1.5">Project End Date</label>
            <input
              type="date"
              className={inputCls}
              value={planning.projectEndDate}
              onChange={e => { setPlanning(p => ({ ...p, projectEndDate: e.target.value })); setSaved(false); }}
              disabled={!canEdit}
            />
          </div>
        </div>
      </div>

      {/* BOQ Delivery Planning Table */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden">
        <div 
          className="px-6 py-4 border-b border-slate-800 flex justify-between items-center cursor-pointer hover:bg-slate-800/30 transition-colors"
          onClick={() => setIsBoqExpanded(!isBoqExpanded)}
        >
          <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <Package className="w-4 h-4 text-emerald-400" /> BOQ Item-wise Delivery Plan
          </h4>
          {isBoqExpanded ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
        </div>
        {isBoqExpanded && (
          <div className="overflow-x-auto animate-in fade-in duration-300">
            <table className="w-full min-w-[800px]">
            <thead className="bg-slate-800/40">
              <tr>
                <th className="text-left p-4 text-xs font-semibold text-slate-500 uppercase">#</th>
                <th className="text-left p-4 text-xs font-semibold text-slate-500 uppercase">Item</th>
                <th className="text-left p-4 text-xs font-semibold text-slate-500 uppercase">Total Qty</th>
                <th className="text-left p-4 text-xs font-semibold text-slate-500 uppercase">Planned Qty</th>
                <th className="text-left p-4 text-xs font-semibold text-slate-500 uppercase">Delivery Date</th>
                <th className="text-left p-4 text-xs font-semibold text-slate-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {planning.boqItems.map((item, idx) => (
                <tr key={item.itemId} className="hover:bg-slate-800/20 transition-colors">
                  <td className="p-4 text-slate-500 font-mono text-sm">{idx + 1}</td>
                  <td className="p-4">
                    <span className="text-sm font-medium text-white">{item.itemName}</span>
                    <span className="block text-xs text-slate-500 mt-0.5">{item.unit}</span>
                  </td>
                  <td className="p-4 text-slate-300 font-mono text-sm">{item.totalQty}</td>
                  <td className="p-4">
                    <input
                      type="number"
                      className="w-24 bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-emerald-500/40"
                      value={item.plannedQty}
                      onChange={e => updateBoqItem(idx, 'plannedQty', e.target.value)}
                      placeholder="0"
                      min="0"
                      max={item.totalQty}
                      disabled={!canEdit}
                    />
                  </td>
                  <td className="p-4">
                    <input
                      type="date"
                      className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-emerald-500/40"
                      value={item.deliveryDate}
                      onChange={e => updateBoqItem(idx, 'deliveryDate', e.target.value)}
                      disabled={!canEdit}
                    />
                  </td>
                  <td className="p-4">
                    <select
                      className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-emerald-500/40"
                      value={item.status}
                      onChange={e => updateBoqItem(idx, 'status', e.target.value)}
                      disabled={!canEdit}
                    >
                      <option>Pending</option>
                      <option>In Progress</option>
                      <option>Completed</option>
                      <option>Not Applicable</option>
                    </select>
                  </td>
                </tr>
              ))}
              {planning.boqItems.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500 text-sm">
                    No BOQ items found. Add items to the order first.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        )}
      </div>

      {/* Stage Timeline */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-800">
          <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <CalendarDays className="w-4 h-4 text-purple-400" /> Stage-wise Timeline
          </h4>
        </div>
        <div className="divide-y divide-slate-800/50">
          {planning.stages.map((stage, idx) => (
            <div key={idx} className="p-4">
              <div
                className="flex items-center justify-between cursor-pointer"
                onClick={() => setExpandedStage(expandedStage === idx ? null : idx)}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${stage.status === 'Completed' ? 'bg-emerald-400' : stage.status === 'In Progress' ? 'bg-blue-400' : stage.status === 'Not Applicable' ? 'bg-slate-500' : 'bg-slate-600'}`} />
                  <span className="font-semibold text-white text-sm">{stage.stage}</span>
                  <StatusBadge status={stage.status} />
                </div>
                <div className="flex items-center gap-4 text-slate-500 text-xs">
                  {stage.start && stage.end && (
                    <span>{stage.start} → {stage.end}</span>
                  )}
                  {expandedStage === idx ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </div>

              {expandedStage === idx && (
                <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 pl-5 animate-in fade-in duration-200">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1.5">Start Date</label>
                    <input type="date" className={inputCls} value={stage.start} onChange={e => updateStage(idx, 'start', e.target.value)} disabled={!canEdit} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1.5">End Date</label>
                    <input type="date" className={inputCls} value={stage.end} onChange={e => updateStage(idx, 'end', e.target.value)} disabled={!canEdit} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1.5">Status</label>
                    <select className={selectCls} value={stage.status} onChange={e => updateStage(idx, 'status', e.target.value)} disabled={!canEdit}>
                      <option>Pending</option>
                      <option>In Progress</option>
                      <option>Completed</option>
                      <option>Not Applicable</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Milestones */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-800">
          <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <Flag className="w-4 h-4 text-amber-400" /> Key Milestones
          </h4>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {planning.milestones.map((m, idx) => (
            <div key={idx} className="flex items-center gap-3 p-4 bg-slate-800/30 border border-slate-700/50 rounded-xl">
              <div className="w-2 h-2 rounded-full bg-amber-400 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">{m.title}</p>
                <input
                  type="date"
                  className="mt-1.5 w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:ring-1 focus:ring-amber-500/40"
                  value={m.date}
                  onChange={e => updateMilestone(idx, 'date', e.target.value)}
                  disabled={!canEdit}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
