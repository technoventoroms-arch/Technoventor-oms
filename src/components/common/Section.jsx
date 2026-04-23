import React from 'react';

export function Section({ icon, title, children, className = '' }) {
  return (
    <div className={`bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden shadow-lg flex flex-col ${className}`}>
      <div className="p-5 border-b border-slate-800 bg-slate-800/30 flex items-center gap-3">
        <div className="text-emerald-400">{icon}</div>
        <h3 className="text-lg font-semibold text-white">{title}</h3>
      </div>
      <div className="p-6 flex-1 flex flex-col">
        {children}
      </div>
    </div>
  );
}
