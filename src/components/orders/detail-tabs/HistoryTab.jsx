import React from 'react';
import { Clock } from 'lucide-react';
import { formatDateTime } from '../../../utils';

export function HistoryTab({ order }) {
  return (
    <div>
      <h3 className="text-lg font-semibold text-white mb-4">Order History</h3>
      <div className="space-y-4">
        {order.history.map((entry, index) => (
          <div key={index} className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center flex-shrink-0">
              <Clock className="w-4 h-4 text-slate-400" />
            </div>
            <div className="flex-1 bg-slate-800/50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <p className="font-medium text-white">{entry.action}</p>
                <span className="text-sm text-slate-400">{formatDateTime(entry.date)}</span>
              </div>
              <p className="text-sm text-slate-400 mt-1">by {entry.by} • {entry.department}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
