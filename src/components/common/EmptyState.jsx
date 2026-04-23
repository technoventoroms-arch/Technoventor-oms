import React from 'react';
import { Plus } from 'lucide-react';

export function EmptyState({ icon, message, canEdit, onEdit }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center bg-slate-950/20 border-2 border-dashed border-slate-800 rounded-2xl">
      <div className="p-4 bg-slate-900 rounded-full mb-4 text-slate-600">
        {icon && (icon.type ? icon : React.cloneElement(icon, { className: 'w-6 h-6' }))}
      </div>
      <p className="text-slate-400 mb-6 max-w-xs">{message}</p>
      {canEdit && (
        <button onClick={onEdit} className="flex items-center gap-2 px-6 py-2.5 bg-emerald-500 text-white rounded-xl font-bold hover:bg-emerald-600 transition-all">
          <Plus className="w-4 h-4" /> Add Details Now
        </button>
      )}
    </div>
  );
}
