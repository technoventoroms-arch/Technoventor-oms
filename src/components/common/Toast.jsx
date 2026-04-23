import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, AlertTriangle, X } from 'lucide-react';

export function Toast({ message, type = 'success', label, onClose, duration = 4000 }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const config = {
    success: { icon: <CheckCircle2 className="w-5 h-5 text-emerald-400" />, border: 'border-emerald-500/30', bg: 'bg-emerald-500/10', defaultLabel: 'Success Notification' },
    info: { icon: <AlertCircle className="w-5 h-5 text-blue-400" />, border: 'border-blue-500/30', bg: 'bg-blue-500/10', defaultLabel: 'Activity Update' },
    warning: { icon: <AlertTriangle className="w-5 h-5 text-amber-400" />, border: 'border-amber-500/30', bg: 'bg-amber-500/10', defaultLabel: 'Warning' }
  };

  const { icon, border, bg, defaultLabel } = config[type] || config.success;

  return (
    <div className="fixed bottom-6 right-6 z-[60] animate-in fade-in slide-in-from-right-4 duration-300 max-w-md">
      <div className={`bg-slate-900/90 backdrop-blur-xl border ${border} p-4 rounded-2xl shadow-2xl flex items-center gap-4`}>
        <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center border ${border}`}>
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-bold text-white leading-tight">{message}</div>
          <p className="text-[10px] text-slate-500 font-medium uppercase mt-0.5 tracking-wider">{label || defaultLabel}</p>
        </div>
        <button 
          onClick={onClose}
          className="p-1 hover:bg-slate-800 rounded-lg text-slate-500 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
