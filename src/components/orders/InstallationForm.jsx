import React, { useState } from 'react';
import { Wrench, Package } from 'lucide-react';
import { getInstallableItems } from '../../utils/orderWorkflow';

const InstallationForm = ({ order, initialData = {}, onSave, onCancel }) => {
  const installableItems = getInstallableItems(order);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [itemStatuses, setItemStatuses] = useState(() => {
    const existing = initialData?.boqInstallation || [];
    return installableItems.map((item) => {
      const entry = existing.find((b) => b.boqItemId === item.id);
      return entry || {
        boqItemId: item.id,
        status: 'Pending',
        installedBy: '',
        installedDate: '',
        remarks: ''
      };
    });
  });

  const updateItem = (boqItemId, field, value) => {
    setItemStatuses((prev) =>
      prev.map((entry) =>
        entry.boqItemId === boqItemId ? { ...entry, [field]: value } : entry
      )
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const invalid = itemStatuses.some(
      (entry) =>
        entry.status === 'Installed' && (!entry.installedBy?.trim() || !entry.installedDate)
    );
    if (invalid) {
      alert('Please fill Installed By and Installation Date for all items marked Installed.');
      return;
    }
    setIsSubmitting(true);
    try {
      await onSave({
        ...initialData,
        boqInstallation: itemStatuses
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (installableItems.length === 0) {
    return (
      <div className="bg-surface border border-border rounded-2xl p-8 text-center">
        <Package className="w-12 h-12 mx-auto mb-4 text-text-muted" />
        <p className="text-text-secondary">No items on this order require installation.</p>
        <button
          type="button"
          onClick={onCancel}
          className="mt-6 px-6 py-2.5 border border-border text-text-secondary rounded-xl hover:bg-surface-raised"
        >
          Close
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pb-8">
      <div className="bg-white dark:bg-slate-900 border border-border rounded-2xl p-6">
        <h3 className="text-lg font-bold text-text-primary mb-2 flex items-center gap-2">
          <Wrench className="w-5 h-5 text-rose-500" />
          Installation Checklist
        </h3>
        <p className="text-sm text-text-secondary mb-6">
          Mark each delivered item as installed once on-site work is complete.
        </p>

        <div className="space-y-4">
          {installableItems.map((item) => {
            const entry = itemStatuses.find((s) => s.boqItemId === item.id) || {};
            const isInstalled = entry.status === 'Installed';
            return (
              <div
                key={item.id}
                className={`rounded-2xl border p-4 transition-all ${
                  isInstalled
                    ? 'border-emerald-500/30 bg-emerald-500/5'
                    : 'border-border bg-surface-raised dark:bg-slate-950/40'
                } ${item.parentItemIndex ? 'ml-6' : ''}`}
              >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="flex-1">
                    <p className="text-sm font-bold text-text-primary">{item.name}</p>
                    <p className="text-xs text-text-muted mt-1">
                      Qty: {item.quantity} {item.unit}
                      {item.itemCode ? ` · ${item.itemCode}` : ''}
                    </p>
                  </div>
                  <select
                    value={entry.status || 'Pending'}
                    onChange={(e) => updateItem(item.id, 'status', e.target.value)}
                    className={`rounded-xl border px-3 py-1.5 text-xs font-bold outline-none cursor-pointer ${
                      isInstalled
                        ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20'
                        : 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20'
                    }`}
                  >
                    <option value="Pending">Installation Pending</option>
                    <option value="Installed">Installed</option>
                  </select>
                </div>

                {isInstalled && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-4 border-t border-border">
                    <div>
                      <label className="block text-[10px] font-bold text-text-muted uppercase mb-1">
                        Installed By *
                      </label>
                      <input
                        type="text"
                        value={entry.installedBy || ''}
                        onChange={(e) => updateItem(item.id, 'installedBy', e.target.value)}
                        placeholder="Technician / team"
                        className="w-full bg-white dark:bg-slate-950 border border-border rounded-xl px-3 py-2 text-sm text-text-primary"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-text-muted uppercase mb-1">
                        Installation Date *
                      </label>
                      <input
                        type="date"
                        value={entry.installedDate || ''}
                        onChange={(e) => updateItem(item.id, 'installedDate', e.target.value)}
                        className="w-full bg-white dark:bg-slate-950 border border-border rounded-xl px-3 py-2 text-sm text-text-primary"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-text-muted uppercase mb-1">
                        Remarks
                      </label>
                      <input
                        type="text"
                        value={entry.remarks || ''}
                        onChange={(e) => updateItem(item.id, 'remarks', e.target.value)}
                        placeholder="Optional notes"
                        className="w-full bg-white dark:bg-slate-950 border border-border rounded-xl px-3 py-2 text-sm text-text-primary"
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2.5 border border-border text-text-secondary font-medium rounded-xl hover:bg-surface-raised"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-medium rounded-xl shadow-lg shadow-rose-500/20 flex items-center gap-2 disabled:opacity-50"
        >
          {isSubmitting ? <span className="w-4 h-4 btn-spinner" /> : <Wrench className="w-4 h-4" />}
          {isSubmitting ? 'Saving...' : 'Save Installation Details'}
        </button>
      </div>
    </form>
  );
};

export default InstallationForm;
