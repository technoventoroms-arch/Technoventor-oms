import React, { useState } from 'react';
import { Key, Check, ChevronUp, ChevronDown, UserCog } from 'lucide-react';
import { PERMISSION_GROUPS, PERMISSION_TEMPLATES } from '../../constants';

export function PermissionManagement({ users, onUpdateUser, currentUser }) {
  const [selectedUser, setSelectedUser] = useState(null);
  const [expandedGroups, setExpandedGroups] = useState({});
  const [userPermissions, setUserPermissions] = useState([]);

  const selectUser = (user) => {
    setSelectedUser(user);
    setUserPermissions([...user.permissions]);
  };

  const toggleGroup = (groupName) => {
    setExpandedGroups(prev => ({ ...prev, [groupName]: !prev[groupName] }));
  };

  const togglePermission = (permissionKey) => {
    if (userPermissions.includes(permissionKey)) {
      setUserPermissions(userPermissions.filter(p => p !== permissionKey));
    } else {
      setUserPermissions([...userPermissions, permissionKey]);
    }
  };

  const applyTemplate = (templateName) => {
    setUserPermissions([...PERMISSION_TEMPLATES[templateName]]);
  };

  const savePermissions = () => {
    onUpdateUser(selectedUser.id, { permissions: userPermissions });
    setSelectedUser(null);
  };

  const selectAllInGroup = (groupName) => {
    const groupPermissions = PERMISSION_GROUPS[groupName].map(p => p.key);
    const allSelected = groupPermissions.every(p => userPermissions.includes(p));
    
    if (allSelected) {
      setUserPermissions(userPermissions.filter(p => !groupPermissions.includes(p)));
    } else {
      setUserPermissions([...new Set([...userPermissions, ...groupPermissions])]);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Permission Management</h2>
        <p className="text-slate-400">Control what each user can see and do</p>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* User List */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden">
          <div className="p-4 border-b border-slate-800">
            <h3 className="font-semibold text-white">Select User</h3>
          </div>
          <div className="divide-y divide-slate-800 max-h-[600px] overflow-y-auto">
            {users.filter(u => u.id !== currentUser.id).map(user => (
              <button
                key={user.id}
                onClick={() => selectUser(user)}
                className={`w-full p-4 text-left hover:bg-slate-800/50 transition-colors ${selectedUser?.id === user.id ? 'bg-emerald-500/10 border-l-2 border-emerald-500' : ''}`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-semibold text-sm">
                    {user.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-white">{user.name}</p>
                    <p className="text-xs text-slate-400 capitalize">{user.department}</p>
                  </div>
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <Key className="w-3 h-3 text-slate-500" />
                  <span className="text-xs text-slate-500">{user.permissions?.length || 0} permissions</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Permission Editor */}
        <div className="col-span-2 bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden">
          {selectedUser ? (
            <>
              <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-white">Permissions for {selectedUser.name}</h3>
                  <p className="text-sm text-slate-400">{userPermissions.length} permissions selected</p>
                </div>
                <div className="flex items-center gap-3">
                  <select
                    onChange={(e) => e.target.value && applyTemplate(e.target.value)}
                    className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white"
                    defaultValue=""
                  >
                    <option value="">Apply Template...</option>
                    {Object.keys(PERMISSION_TEMPLATES).map(template => (
                      <option key={template} value={template}>{template}</option>
                    ))}
                  </select>
                  <button
                    onClick={savePermissions}
                    className="px-4 py-2 bg-emerald-500 text-white rounded-lg text-sm font-medium hover:bg-emerald-600"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
              
              <div className="p-4 max-h-[500px] overflow-y-auto space-y-4">
                {Object.entries(PERMISSION_GROUPS).map(([groupName, permissions]) => {
                  const groupPermissionKeys = permissions.map(p => p.key);
                  const selectedCount = groupPermissionKeys.filter(p => userPermissions.includes(p)).length;
                  const allSelected = selectedCount === permissions.length;
                  const someSelected = selectedCount > 0 && !allSelected;

                  return (
                    <div key={groupName} className="border border-slate-700 rounded-lg overflow-hidden">
                      <button
                        onClick={() => toggleGroup(groupName)}
                        className="w-full p-4 flex items-center justify-between bg-slate-800/50 hover:bg-slate-800"
                      >
                        <div className="flex items-center gap-3">
                          <div 
                            onClick={(e) => { e.stopPropagation(); selectAllInGroup(groupName); }}
                            className={`w-5 h-5 rounded border flex items-center justify-center cursor-pointer ${
                              allSelected ? 'bg-emerald-500 border-emerald-500' : 
                              someSelected ? 'bg-emerald-500/50 border-emerald-500' : 
                              'border-slate-600'
                            }`}
                          >
                            {(allSelected || someSelected) && <Check className="w-3 h-3 text-white" />}
                          </div>
                          <span className="font-medium text-white">{groupName}</span>
                          <span className="text-xs text-slate-400">({selectedCount}/{permissions.length})</span>
                        </div>
                        {expandedGroups[groupName] ? (
                          <ChevronUp className="w-5 h-5 text-slate-400" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-slate-400" />
                        )}
                      </button>
                      
                      {expandedGroups[groupName] && (
                        <div className="p-4 space-y-3 bg-slate-900/50">
                          {permissions.map(permission => (
                            <label
                              key={permission.key}
                              className="flex items-start gap-3 cursor-pointer hover:bg-slate-800/30 p-2 rounded-lg -m-2"
                            >
                              <input
                                type="checkbox"
                                checked={userPermissions.includes(permission.key)}
                                onChange={() => togglePermission(permission.key)}
                                className="mt-1 w-4 h-4 rounded border-slate-600 text-emerald-500 focus:ring-emerald-500/50 bg-slate-800"
                              />
                              <div>
                                <p className="text-sm font-medium text-white">{permission.label}</p>
                                <p className="text-xs text-slate-400">{permission.description}</p>
                              </div>
                            </label>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-96 text-slate-400">
              <UserCog className="w-16 h-16 mb-4 opacity-50" />
              <p className="text-lg">Select a user to manage permissions</p>
              <p className="text-sm">Click on any user from the list</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
