import React from 'react';

export function FormField({ label, children, icon }) {
  return (
    <div className="space-y-1.5 w-full">
      <label className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-tight ml-1">
        {icon && <span className="text-slate-600">{icon}</span>}
        {label}
      </label>
      {children}
    </div>
  );
}
