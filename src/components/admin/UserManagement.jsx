import React, { useState } from 'react';
import { Plus, Lock, Unlock, Trash2, Key } from 'lucide-react';
import { DEPARTMENTS, PERMISSION_TEMPLATES } from '../../constants';
import { FormField } from '../common';

export function UserManagement({ users, onAddUser, onUpdateUser, onDeleteUser, currentUser, hasPermission }) {
  const [showAddUser, setShowAddUser] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', department: 'management', password: '', permissions: [] });
  const [changingPasswordUserId, setChangingPasswordUserId] = useState(null);
  const [newPassword, setNewPassword] = useState('');

  const handleAddUser = async () => {
    const user = {
      ...newUser,
      isActive: true,
      permissions: PERMISSION_TEMPLATES['View Only']
    };
    await onAddUser(user);
    setNewUser({ name: '', email: '', department: 'management', password: '', permissions: [] });
    setShowAddUser(false);
  };

  const handleToggleUserStatus = (userId) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      onUpdateUser(userId, { isActive: !user.isActive });
    }
  };

  const handleDeleteUser = (userId) => {
    if (userId !== currentUser.id) {
      onDeleteUser(userId);
    }
  };

  const handleUpdatePassword = async () => {
    if (newPassword.trim()) {
      await onUpdateUser(changingPasswordUserId, { password: newPassword });
      setChangingPasswordUserId(null);
      setNewPassword('');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">User Management</h2>
          <p className="text-slate-400">Manage users and their access</p>
        </div>
        <button
          onClick={() => setShowAddUser(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold rounded-lg"
        >
          <Plus className="w-4 h-4" /> Add User
        </button>
      </div>

      {showAddUser && (
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Add New User</h3>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Name">
              <input type="text" value={newUser.name} onChange={(e) => setNewUser({...newUser, name: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white" />
            </FormField>
            <FormField label="Email">
              <input type="email" value={newUser.email} onChange={(e) => setNewUser({...newUser, email: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white" />
            </FormField>
            <FormField label="Department">
              <select value={newUser.department} onChange={(e) => setNewUser({...newUser, department: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white">
                {Object.entries(DEPARTMENTS).map(([key, value]) => (
                  <option key={key} value={value}>{key}</option>
                ))}
              </select>
            </FormField>
            <FormField label="Password">
              <input type="password" value={newUser.password} onChange={(e) => setNewUser({...newUser, password: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white" />
            </FormField>
          </div>
          <p className="text-sm text-slate-400 mt-4">
            💡 After creating the user, go to Permissions to assign specific access rights.
          </p>
          <div className="flex justify-end gap-3 mt-4">
            <button onClick={() => setShowAddUser(false)} className="px-4 py-2 text-slate-400 hover:text-white">Cancel</button>
            <button onClick={handleAddUser} className="px-4 py-2 bg-emerald-500 text-white rounded-lg">Add User</button>
          </div>
        </div>
      )}

      <div className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-800/50">
            <tr>
              <th className="text-left p-4 text-sm font-medium text-slate-400">User</th>
              <th className="text-left p-4 text-sm font-medium text-slate-400">Email</th>
              <th className="text-left p-4 text-sm font-medium text-slate-400">Department</th>
              <th className="text-left p-4 text-sm font-medium text-slate-400">Permissions</th>
              <th className="text-left p-4 text-sm font-medium text-slate-400">Status</th>
              <th className="text-left p-4 text-sm font-medium text-slate-400">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {users.map(user => (
              <tr key={user.id} className="hover:bg-slate-800/30">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-semibold">
                      {user.name.charAt(0)}
                    </div>
                    <span className="text-white font-medium">{user.name}</span>
                  </div>
                </td>
                <td className="p-4 text-slate-300">{user.email}</td>
                <td className="p-4">
                  <span className="px-3 py-1 bg-slate-800 rounded-full text-sm capitalize text-slate-300">
                    {user.department}
                  </span>
                </td>
                <td className="p-4">
                  <span className="text-sm text-slate-400">{user.permissions?.length || 0} permissions</span>
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-xs ${user.isActive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                    {user.isActive ? 'Active' : 'Disabled'}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setChangingPasswordUserId(user.id)}
                      className="p-2 text-slate-500 hover:text-emerald-400 transition-colors"
                      title="Change Password"
                    >
                      <Key className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleToggleUserStatus(user.id)}
                      className={`p-2 rounded-lg transition-colors ${user.isActive ? 'text-amber-400 hover:bg-amber-500/20' : 'text-green-400 hover:bg-green-500/20'}`}
                      title={user.isActive ? 'Disable' : 'Enable'}
                    >
                      {user.isActive ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      className="p-2 text-slate-500 hover:text-red-400 transition-colors"
                      disabled={user.id === currentUser.id}
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Change Password Modal */}
      {changingPasswordUserId && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200">
            <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
              <Key className="w-5 h-5 text-emerald-400" /> Reset Password
            </h3>
            <p className="text-sm text-slate-400 mb-6 font-medium">
              Update password for <span className="text-white font-bold">{users.find(u => u.id === changingPasswordUserId)?.name}</span>
            </p>
            
            <FormField label="New Password">
              <input 
                type="password" 
                value={newPassword} 
                onChange={(e) => setNewPassword(e.target.value)} 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-emerald-500/40" 
                placeholder="Enter strong password..."
                autoFocus
              />
            </FormField>
            
            <div className="flex justify-end gap-3 mt-8">
              <button 
                onClick={() => { setChangingPasswordUserId(null); setNewPassword(''); }} 
                className="px-6 py-2.5 text-slate-400 font-bold hover:text-white transition-colors uppercase text-[10px] tracking-widest"
              >
                Cancel
              </button>
              <button 
                onClick={handleUpdatePassword} 
                className="px-8 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-emerald-500/20"
              >
                Save New Password
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
