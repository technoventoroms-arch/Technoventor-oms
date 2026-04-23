import React from 'react';

export function StatCard({ label, value, icon, color, onClick, subValue, subLabel }) {
  const colors = {
    slate: 'from-slate-500/20 to-slate-600/20 text-slate-400 border-slate-700',
    blue: 'from-blue-500/20 to-blue-600/20 text-blue-400 border-blue-500/30',
    purple: 'from-purple-500/20 to-purple-600/20 text-purple-400 border-purple-500/30',
    amber: 'from-amber-500/20 to-amber-600/20 text-amber-400 border-amber-500/30',
    cyan: 'from-cyan-500/20 to-cyan-600/20 text-cyan-400 border-cyan-500/30',
    orange: 'from-orange-500/20 to-orange-600/20 text-orange-400 border-orange-500/30',
    green: 'from-green-500/20 to-green-600/20 text-green-400 border-green-500/30',
    yellow: 'from-yellow-500/20 to-yellow-600/20 text-yellow-400 border-yellow-500/30',
    indigo: 'from-indigo-500/20 to-indigo-600/20 text-indigo-400 border-indigo-500/30'
  };

  return (
    <div 
      className={`bg-gradient-to-br ${colors[color]} border rounded-xl p-4 ${onClick ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''} flex flex-col justify-between h-full`}
      onClick={onClick}
    >
      <div>
        <div className="flex items-center gap-2 mb-2">
          {React.cloneElement(icon, { className: 'w-4 h-4' })}
          <span className="text-[10px] uppercase font-bold tracking-wider truncate">{label}</span>
        </div>
        <p className="text-2xl font-black text-white">{value}</p>
      </div>
      {subValue !== undefined && (
        <div className="mt-2 pt-2 border-t border-white/5">
          <p className="text-[10px] font-bold text-white/50 truncate">
            {subValue} <span className="text-[9px] font-normal lowercase">{subLabel || 'pending'}</span>
          </p>
        </div>
      )}
    </div>
  );
}

