import React from 'react';
import { Clock } from 'lucide-react';
import { formatDateTime } from '../../../utils';

export function HistoryTab({ order }) {
  return (
    <div>
      <h3 className="text-lg font-semibold text-text-primary mb-4">Order History</h3>
      <div className="space-y-4">
        {order.history.map((entry, index) => (
          <div key={index} className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-surface-raised dark:bg-slate-800 flex items-center justify-center flex-shrink-0">
              <Clock className="w-4 h-4 text-text-secondary" />
            </div>
            <div className="flex-1 bg-surface-raised rounded-lg p-4">
              <div className="flex items-center justify-between">
                <p className="font-medium text-text-primary">{entry.action}</p>
                <span className="text-sm text-text-secondary">{formatDateTime(entry.date)}</span>
              </div>
              <p className="text-sm text-text-secondary mt-1">by {entry.by} • {entry.department}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
