import React from 'react';
import { X, AlertTriangle, CheckCircle2, AlertCircle } from 'lucide-react';

export function NotificationPanel({ notifications = [], onClose, onMarkRead }) {
  return (
    <div className="absolute right-0 top-12 w-96 bg-surface border border-border rounded-xl shadow-2xl overflow-hidden z-50">
      <div className="p-4 border-b border-border flex items-center justify-between bg-surface-raised">
        <h3 className="font-semibold text-text-primary">Recent Activities</h3>
        <button onClick={onClose} className="p-1 hover:bg-surface-raised rounded-lg">
          <X className="w-4 h-4 text-text-secondary" />
        </button>
      </div>
      <div className="max-h-[450px] overflow-y-auto custom-scrollbar">
        {notifications.length === 0 ? (
          <div className="p-8 text-center">
            <AlertCircle className="w-10 h-10 text-text-muted mx-auto mb-2" />
            <p className="text-text-muted">No recent activities</p>
          </div>
        ) : (
          notifications.map(notif => (
            <div 
              key={notif.id}
              onClick={() => onMarkRead && onMarkRead(notif.id)}
              className={`p-4 border-b border-border cursor-pointer hover:bg-surface-raised transition-colors ${!notif.read ? 'bg-surface-raised/80' : ''}`}
            >
              <div className="flex items-start gap-4">
                <div className="mt-1">
                  {notif.type === 'warning' && <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-500" />}
                  {notif.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-500" />}
                  {notif.type === 'info' && <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-500" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-text-primary">{notif.message}</div>
                  <p className="text-[10px] text-text-muted mt-1.5 flex items-center gap-1.5 font-medium">
                    <span className="w-1 h-1 rounded-full bg-border"></span>
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
