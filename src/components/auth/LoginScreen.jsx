import React, { useState } from 'react';
import { Package, Mail, Lock, LogIn, AlertCircle } from 'lucide-react';

export function LoginScreen({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    const success = await onLogin(email, password);
    if (!success) {
      setError('Invalid email or password');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-slate-900/50 border border-slate-800 rounded-3xl p-8 shadow-2xl backdrop-blur-xl">
        <div className="flex flex-col items-center mb-8">
          <div className="w-20 h-20 mb-4 drop-shadow-2xl">
            <img src="/logo.jpg" alt="Technoventor Logo" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">TECHNOVENTOR</h1>
          <p className="text-slate-500 font-medium">Order Management System</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5 block ml-1">Email Address</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 transition-colors group-focus-within:text-emerald-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 transition-all font-medium"
                placeholder="name@company.com"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5 block ml-1">Password</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 transition-colors group-focus-within:text-emerald-500" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 transition-all font-medium"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-400 bg-red-400/10 border border-red-400/20 p-3 rounded-xl animate-shake">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm font-medium">{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-emerald-500/20 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <>
                <LogIn className="w-5 h-5" />
                SIGN IN TO OMS
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-slate-600 text-xs font-medium uppercase tracking-widest mb-4">Sample Credentials</p>
          <div className="grid grid-cols-2 gap-2">
            <button onClick={() => {setEmail('admin@company.com'); setPassword('admin123');}} className="px-3 py-2 bg-slate-800/50 hover:bg-slate-800 rounded-lg text-[10px] text-slate-400 font-bold transition-colors">ADMIN ACCESS</button>
            <button onClick={() => {setEmail('priya@company.com'); setPassword('proc123');}} className="px-3 py-2 bg-slate-800/50 hover:bg-slate-800 rounded-lg text-[10px] text-slate-400 font-bold transition-colors">PROCUREMENT ACCESS</button>
          </div>
        </div>
      </div>
    </div>
  );
}
