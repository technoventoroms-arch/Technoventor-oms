import React from 'react';
import { Plus } from 'lucide-react';

export function EmptyState({ icon, message, canEdit, onEdit }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center bg-surface-raised border-2 border-dashed border-border rounded-2xl">
      <div className="p-4 bg-surface rounded-full mb-4 text-text-muted border border-border">
        {icon && (icon.type ? icon : React.cloneElement(icon, { className: 'w-6 h-6' }))}
      </div>
      <p className="text-text-secondary mb-6 max-w-xs">{message}</p>
      {canEdit && (
        <button onClick={onEdit} className="flex items-center gap-2 px-6 py-2.5 bg-emerald-500 text-white rounded-xl font-bold hover:bg-emerald-600 transition-all">
          <Plus className="w-4 h-4" /> Add Details Now
        </button>
      )}
    </div>
  );
}
