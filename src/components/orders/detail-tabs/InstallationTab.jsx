import React from 'react';
import { Zap, Edit2 } from 'lucide-react';
import { EmptyState, InfoCard } from '../../common';
import { formatDate } from '../../../utils';
import { PERMISSIONS } from '../../../constants';

export function InstallationTab({ order, editingInstallation, setEditingInstallation, installationData, saveInstallation, InstallationForm, hasPermission }) {
  if (editingInstallation) {
    return (
      <InstallationForm
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
          <h3 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Zap className="w-5 h-5 text-blue-400" />
            Order Installation
          </h3>
          <p className="text-slate-400 mt-1 max-w-2xl text-sm leading-relaxed">
            Record installation details, technician names, and site contact information.
          </p>
        </div>

        {hasPermission(PERMISSIONS.EDIT_INSTALLATION) && (
          <button
            onClick={() => setEditingInstallation(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl text-sm font-black shadow-lg shadow-blue-500/20 active:scale-[0.98] transition-all"
          >
             <Edit2 className="w-4 h-4" /> Edit Installation Details
          </button>
        )}
      </div>

      {installationData?.date || installationData?.installedBy ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <InfoCard label="Installed By" value={installationData.installedBy} highlight />
            <InfoCard label="Site Contact" value={installationData.siteContact} />
            <InfoCard label="Installation Date" value={formatDate(installationData.date)} />
          </div>

          {installationData.remarks && (
            <div className="mt-6">
              <InfoCard label="Remarks" value={installationData.remarks} />
            </div>
          )}
        </div>
      ) : (
        <EmptyState 
          icon={<Zap className="w-6 h-6 text-slate-400" />} 
          message="No installation details have been recorded yet." 
          canEdit={hasPermission(PERMISSIONS.EDIT_INSTALLATION)}
          onEdit={() => setEditingInstallation(true)}
        />
      )}
    </div>
  );
}
