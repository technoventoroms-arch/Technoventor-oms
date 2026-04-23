import React, { useState } from 'react';
import { ArrowRight, ShieldCheck, Key, User, CheckCircle2 } from 'lucide-react';
import { ToggleSwitch, FormField } from '../common';
import { PERMISSIONS } from '../../constants';

export function SettingsView({ currentUser, onUpdateUser, hasPermission }) {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [status, setStatus] = useState(null); // null | saving | saved | error

  const handleUpdateMyPassword = async (e) => {
    e.preventDefault();
    if (!newPassword || newPassword !== confirmPassword) {
      setStatus('error');
      return;
    }

    setStatus('saving');
    try {
      await onUpdateUser(currentUser.id, { password: newPassword });
      setNewPassword('');
      setConfirmPassword('');
      setStatus('saved');
      setTimeout(() => setStatus(null), 3000);
    } catch (err) {
      setStatus('error');
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-3xl font-black text-white tracking-tight">System Settings</h2>
        <p className="text-slate-400 mt-1 font-medium">Manage your profile and system configuration</p>
      </div>

      {/* 1. Account & Security (Available to everyone with Settings access) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            My Security
          </h3>
          <p className="text-sm text-slate-500 mt-2">Update your login credentials and personal security settings.</p>
        </div>
        
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-1.5">
              <Key className="w-4 h-4" /> Change Password
            </h4>
            
            <form onSubmit={handleUpdateMyPassword} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField label="New Password">
                  <input 
                    type="password" 
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-emerald-500/40 transition-all placeholder:text-slate-700" 
                    placeholder="Enter new password"
                  />
                </FormField>
                <FormField label="Confirm New Password">
                  <input 
                    type="password" 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-emerald-500/40 transition-all placeholder:text-slate-700" 
                    placeholder="Confirm new password"
                  />
                </FormField>
              </div>

              {status === 'error' && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl font-medium animate-in slide-in-from-top-2">
                  ⚠️ Passwords do not match or are empty.
                </div>
              )}

              <div className="flex items-center justify-between gap-4">
                <div className="text-xs text-slate-500 max-w-[200px]">
                  Use at least 8 characters with a mix of letters and numbers.
                </div>
                <button 
                  type="submit"
                  disabled={status === 'saving'}
                  className={`px-8 py-3 rounded-xl font-black uppercase text-[11px] tracking-widest transition-all shadow-xl ${
                    status === 'saved' 
                      ? 'bg-emerald-500 text-white' 
                      : 'bg-white text-slate-950 hover:shadow-white/20 active:scale-95'
                  }`}
                >
                  {status === 'saving' ? 'Updating...' : status === 'saved' ? 'Password Updated!' : 'Update Password'}
                </button>
              </div>
            </form>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
            <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-1.5">
              <User className="w-4 h-4" /> Personal Profile
            </h4>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-2xl font-black text-white shadow-lg">
                {(currentUser?.name || '').split(' ').filter(Boolean).map(n => n[0]).join('')}
              </div>
              <div>
                <p className="text-lg font-bold text-white leading-none">{currentUser?.name}</p>
                <p className="text-sm text-slate-500 mt-1">{currentUser?.email}</p>
                <span className="inline-block px-2.5 py-0.5 bg-slate-800 text-slate-400 text-[10px] uppercase font-bold tracking-widest rounded-full mt-2">
                  {currentUser?.department} Department
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Global System Settings (Admin only) */}
      {hasPermission(PERMISSIONS.MANAGE_PERMISSIONS) && (
        <>
          <div className="h-px bg-slate-800 my-10" />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                System Config
              </h3>
              <p className="text-sm text-slate-500 mt-2">Admin level settings for global system behavior and automation.</p>
            </div>
            
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
                <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Automation & Notification</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b border-slate-800">
                    <div>
                      <p className="text-white font-medium">Global Email Notifications</p>
                      <p className="text-sm text-slate-400 text-[11px]">System-wide notifications for all departments</p>
                    </div>
                    <ToggleSwitch enabled={true} />
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-slate-800">
                    <div>
                      <p className="text-white font-medium">Auto-escalation Logic</p>
                      <p className="text-sm text-slate-400 text-[11px]">Escalate orders held in stage for &gt;48h</p>
                    </div>
                    <ToggleSwitch enabled={false} />
                  </div>
                </div>
              </div>

              <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
                <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                  Workflow Visualization
                </h4>
                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest flex-wrap">
                    <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded">New</span>
                    <ArrowRight className="w-3 h-3 text-slate-600" />
                    <span className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded">Procurement</span>
                    <ArrowRight className="w-3 h-3 text-slate-600" />
                    <span className="px-2 py-1 bg-amber-500/20 text-amber-400 rounded">Finance</span>
                    <ArrowRight className="w-3 h-3 text-slate-600" />
                    <span className="px-2 py-1 bg-cyan-500/20 text-cyan-400 rounded">Stores</span>
                    <ArrowRight className="w-3 h-3 text-slate-600" />
                    <span className="px-2 py-1 bg-orange-500/20 text-orange-400 rounded">Dispatch</span>
                    <ArrowRight className="w-3 h-3 text-slate-600" />
                    <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-green-500">Completed</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
