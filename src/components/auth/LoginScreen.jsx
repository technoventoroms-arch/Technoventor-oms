import React, { useState } from 'react';
import { Package, Mail, Lock, LogIn, AlertCircle } from 'lucide-react';
import { ThemeToggle } from '../common';

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
    <div className="min-h-screen bg-page flex items-center justify-center p-4 relative">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="max-w-md w-full card p-8 shadow-2xl backdrop-blur-xl">
        <div className="flex flex-col items-center mb-8">
          <div className="w-20 h-20 mb-4 drop-shadow-2xl">
            <img src="/logo.jpg" alt="Technoventor Logo" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-3xl font-black text-text-primary tracking-tight">TECHNOVENTOR</h1>
          <p className="text-text-muted font-medium">Order Management System</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-text-muted uppercase tracking-widest mb-1.5 block ml-1">Email Address</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted transition-colors group-focus-within:text-emerald-600 dark:group-focus-within:text-emerald-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field py-3.5 pl-12 pr-4 font-medium"
                placeholder="name@company.com"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-text-muted uppercase tracking-widest mb-1.5 block ml-1">Password</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted transition-colors group-focus-within:text-emerald-600 dark:group-focus-within:text-emerald-500" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field py-3.5 pl-12 pr-4 font-medium"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-400/10 border border-red-200 dark:border-red-400/20 p-3 rounded-xl animate-shake">
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
          <p className="text-text-muted text-xs font-medium uppercase tracking-widest mb-4">Sample Credentials</p>
          <div className="grid grid-cols-2 gap-2">
            <button onClick={() => {setEmail('admin@company.com'); setPassword('admin123');}} className="px-3 py-2 bg-surface-raised hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg text-[10px] text-text-secondary font-bold transition-colors border border-border">ADMIN ACCESS</button>
            <button onClick={() => {setEmail('priya@company.com'); setPassword('proc123');}} className="px-3 py-2 bg-surface-raised hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg text-[10px] text-text-secondary font-bold transition-colors border border-border">PROCUREMENT ACCESS</button>
          </div>
        </div>
      </div>
    </div>
  );
}
