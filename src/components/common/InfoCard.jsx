import React from 'react';

export function InfoCard({ label, value, highlight = false, icon: Icon }) {
  return (
    <div className={`p-4 rounded-xl border transition-all ${highlight ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-slate-800/30 border-slate-700/30'}`}>
      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
        {Icon && <Icon className="w-3 h-3" />}
        {label}
      </p>
      <p className={`text-sm font-medium ${highlight ? 'text-emerald-400' : 'text-slate-200'}`}>{value || '-'}</p>
    </div>
  );
}
