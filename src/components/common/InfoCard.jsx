import React from 'react';

export function InfoCard({ label, value, highlight = false, icon: Icon }) {
  return (
    <div className={`p-4 rounded-xl border transition-all ${highlight ? 'bg-emerald-50 border-emerald-200 dark:bg-emerald-500/10 dark:border-emerald-500/20' : 'bg-surface-raised border-border'}`}>
      <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
        {Icon && <Icon className="w-3 h-3" />}
        {label}
      </p>
      <p className={`text-sm font-medium ${highlight ? 'text-emerald-700 dark:text-emerald-400' : 'text-text-primary'}`}>{value || '-'}</p>
    </div>
  );
}
