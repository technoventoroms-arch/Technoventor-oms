import React from 'react';

export function ToggleSwitch({ enabled }) {
  return (
    <div className={`w-12 h-6 rounded-full relative cursor-pointer ${enabled ? 'bg-emerald-500' : 'bg-slate-700'}`}>
      <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${enabled ? 'right-1' : 'left-1'}`} />
    </div>
  );
}
