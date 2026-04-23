import React from 'react';
import { Lock } from 'lucide-react';

export function AccessDenied() {
  return (
    <div className="flex flex-col items-center justify-center h-96">
      <div className="bg-red-500/20 p-4 rounded-full mb-4">
        <Lock className="w-12 h-12 text-red-400" />
      </div>
      <h2 className="text-2xl font-bold text-white mb-2">Access Denied</h2>
      <p className="text-slate-400 text-center max-w-md">
        You don't have permission to access this section. Please contact your administrator if you need access.
      </p>
    </div>
  );
}
