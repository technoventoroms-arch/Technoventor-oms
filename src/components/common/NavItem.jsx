import React from 'react';

export function NavItem({ icon, label, active, onClick, badge }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all ${
        active 
          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-gradient-to-r dark:from-emerald-500/20 dark:to-teal-500/20 dark:text-emerald-400 dark:border-emerald-500/30' 
          : 'text-text-secondary hover:bg-surface-raised hover:text-text-primary'
      }`}
    >
      <span className="flex items-center gap-3">
        {React.cloneElement(icon, { className: 'w-5 h-5' })}
        <span className="text-sm font-medium">{label}</span>
      </span>
      {badge > 0 && (
        <span className="bg-emerald-500 text-white text-xs px-2 py-0.5 rounded-full">{badge}</span>
      )}
    </button>
  );
}
