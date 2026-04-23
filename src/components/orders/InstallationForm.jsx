import React, { useState } from 'react';
import { Save, X, Calendar, User, Phone, FileText } from 'lucide-react';

const InstallationForm = ({ initialData, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    installedBy: initialData?.installedBy || '',
    siteContact: initialData?.siteContact || '',
    remarks: initialData?.remarks || '',
    date: initialData?.date || new Date().toISOString().split('T')[0],
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Installed By */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">
            Installed By
          </label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <User className="h-4 w-4 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
            </div>
            <input
              type="text"
              value={formData.installedBy}
              onChange={(e) => setFormData({ ...formData, installedBy: e.target.value })}
              className="w-full bg-slate-950/50 border border-slate-800 text-white rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all"
              placeholder="Technician/Team Name"
              required
            />
          </div>
        </div>

        {/* Site Contact */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">
            Site Contact
          </label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Phone className="h-4 w-4 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
            </div>
            <input
              type="text"
              value={formData.siteContact}
              onChange={(e) => setFormData({ ...formData, siteContact: e.target.value })}
              className="w-full bg-slate-950/50 border border-slate-800 text-white rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all"
              placeholder="Name or Phone Number"
              required
            />
          </div>
        </div>

        {/* Installation Date */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">
            Installation Date
          </label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Calendar className="h-4 w-4 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
            </div>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full bg-slate-950/50 border border-slate-800 text-white rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all [color-scheme:dark]"
              required
            />
          </div>
        </div>
      </div>

      {/* Remarks */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">
          Remarks
        </label>
        <div className="relative group">
          <div className="absolute top-3 left-4 pointer-events-none">
            <FileText className="h-4 w-4 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
          </div>
          <textarea
            value={formData.remarks}
            onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
            className="w-full bg-slate-950/50 border border-slate-800 text-white rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all min-h-[100px] resize-none"
            placeholder="Any specific installation notes..."
          />
        </div>
      </div>

      <div className="flex gap-3 pt-4 border-t border-slate-800">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-bold transition-all active:scale-[0.98]"
        >
          <X className="w-4 h-4" /> Cancel
        </button>
        <button
          type="submit"
          className="flex-[2] flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 text-white rounded-xl font-bold shadow-lg shadow-blue-500/20 transition-all active:scale-[0.98]"
        >
          <Save className="w-4 h-4" /> Save Installation Details
        </button>
      </div>
    </form>
  );
};

export default InstallationForm;
