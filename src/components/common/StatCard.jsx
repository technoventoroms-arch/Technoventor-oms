import React from 'react';
import { STAT_CARD_COLORS } from '../../constants/theme';

export function StatCard({ label, value, icon, color, onClick, subValue, subLabel }) {
  return (
    <div 
      className={`bg-gradient-to-br ${STAT_CARD_COLORS[color] || STAT_CARD_COLORS.slate} border rounded-xl p-4 ${onClick ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''} flex flex-col justify-between h-full`}
      onClick={onClick}
    >
      <div>
        <div className="flex items-center gap-2 mb-2">
          {React.cloneElement(icon, { className: 'w-4 h-4' })}
          <span className="text-[10px] uppercase font-bold tracking-wider truncate">{label}</span>
        </div>
        <p className="text-2xl font-black text-text-primary">{value}</p>
      </div>
      {subValue !== undefined && (
        <div className="mt-2 pt-2 border-t border-border">
          <p className="text-[10px] font-bold text-text-muted truncate">
            {subValue} <span className="text-[9px] font-normal lowercase">{subLabel || 'pending'}</span>
          </p>
        </div>
      )}
    </div>
  );
}
