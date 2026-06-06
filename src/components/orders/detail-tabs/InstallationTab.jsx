import React from 'react';
import { Wrench, Edit2 } from 'lucide-react';
import { EmptyState, InfoCard } from '../../common';
import { formatDate } from '../../../utils';
import { PERMISSIONS, ORDER_STAGES } from '../../../constants';
import {
  getInstallableItems,
  getPendingInstallationCount,
  getItemInstallationStatus
} from '../../../utils/orderWorkflow';

export function InstallationTab({
  order,
  editingInstallation,
  setEditingInstallation,
  installationData,
  saveInstallation,
  InstallationForm,
  hasPermission
}) {
  const installableItems = getInstallableItems(order);
  const pendingCount = getPendingInstallationCount(order);
  const canEdit =
    hasPermission(PERMISSIONS.EDIT_SERVICE) ||
    hasPermission(PERMISSIONS.EDIT_INSTALLATION);

  if (editingInstallation) {
    return (
      <InstallationForm
        order={order}
        initialData={installationData}
        onSave={saveInstallation}
        onCancel={() => setEditingInstallation(false)}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-text-primary tracking-tight flex items-center gap-2">
            <Wrench className="w-5 h-5 text-rose-500" />
            Service / Installation
          </h3>
          <p className="text-text-secondary mt-1 max-w-2xl text-sm leading-relaxed">
            Record installation for delivered items requiring on-site service.
            {order.currentStage === ORDER_STAGES.SERVICE && pendingCount > 0 && (
              <span className="block mt-1 text-amber-600 dark:text-amber-400 font-semibold">
                {pendingCount} item(s) pending installation.
              </span>
            )}
          </p>
        </div>

        {canEdit && installableItems.length > 0 && (
          <button
            onClick={() => setEditingInstallation(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-rose-500 to-pink-600 text-white rounded-xl text-sm font-black shadow-lg shadow-rose-500/20 active:scale-[0.98] transition-all"
          >
            <Edit2 className="w-4 h-4" /> Record Installation
          </button>
        )}
      </div>

      {installableItems.length === 0 ? (
        <EmptyState
          icon={<Wrench className="w-6 h-6 text-text-secondary" />}
          message="No items on this order require installation."
        />
      ) : (
        <div className="space-y-3">
          {installableItems.map((item) => {
            const entry = (installationData?.boqInstallation || []).find(
              (b) => b.boqItemId === item.id
            );
            const status = getItemInstallationStatus(
              { ...order, installation: installationData },
              item.id
            );
            const isInstalled = status === 'Installed';
            return (
              <div
                key={item.id}
                className={`rounded-xl border p-4 ${
                  isInstalled
                    ? 'border-emerald-500/30 bg-emerald-500/5'
                    : 'border-amber-500/30 bg-amber-500/5'
                }`}
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-semibold text-text-primary">{item.name}</p>
                    <p className="text-xs text-text-muted mt-0.5">
                      {item.quantity} {item.unit}
                    </p>
                  </div>
                  <span
                    className={`text-xs font-bold px-3 py-1 rounded-full border ${
                      isInstalled
                        ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20'
                        : 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20'
                    }`}
                  >
                    {isInstalled ? 'Installed' : 'Installation Pending'}
                  </span>
                </div>
                {isInstalled && entry && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-4 border-t border-border">
                    <InfoCard label="Installed By" value={entry.installedBy} />
                    <InfoCard label="Installation Date" value={formatDate(entry.installedDate)} />
                    {entry.remarks && <InfoCard label="Remarks" value={entry.remarks} />}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
