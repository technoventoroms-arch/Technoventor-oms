import React from 'react';
import { X, AlertTriangle, CheckCircle2, AlertCircle } from 'lucide-react';

export function NotificationPanel({ notifications = [], onClose, onMarkRead }) {
  return (
    <div className="absolute right-0 top-12 w-96 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden z-50">
      <div className="p-4 border-b border-slate-700 flex items-center justify-between bg-slate-800/50">
        <h3 className="font-semibold text-white">Recent Activities</h3>
        <button onClick={onClose} className="p-1 hover:bg-slate-800 rounded-lg">
          <X className="w-4 h-4 text-slate-400" />
        </button>
      </div>
      <div className="max-h-[450px] overflow-y-auto custom-scrollbar">
        {notifications.length === 0 ? (
          <div className="p-8 text-center">
            <AlertCircle className="w-10 h-10 text-slate-700 mx-auto mb-2" />
            <p className="text-slate-500">No recent activities</p>
          </div>
        ) : (
          notifications.map(notif => (
            <div 
              key={notif.id}
              onClick={() => onMarkRead && onMarkRead(notif.id)}
              className={`p-4 border-b border-slate-800 cursor-pointer hover:bg-slate-800/50 transition-colors ${!notif.read ? 'bg-slate-800/30' : ''}`}
            >
              <div className="flex items-start gap-4">
                <div className="mt-1">
                  {notif.type === 'warning' && <AlertTriangle className="w-5 h-5 text-amber-500" />}
                  {notif.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
                  {notif.type === 'info' && <AlertCircle className="w-5 h-5 text-blue-500" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-slate-200">{notif.message}</div>
                  <p className="text-[10px] text-slate-500 mt-1.5 flex items-center gap-1.5 font-medium">
                    <span className="w-1 h-1 rounded-full bg-slate-700"></span>
                    {notif.date}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
