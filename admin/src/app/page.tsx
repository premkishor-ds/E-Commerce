'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAdmin } from './AdminContext';
import { Mail, Lock, AlertCircle, ShieldCheck, Moon, Sun } from 'lucide-react';

export default function AdminRootPage() {
  const router = useRouter();
  const {
    token, mounted, loginEmail, setLoginEmail, loginPassword, setLoginPassword,
    loginError, handleLogin, theme, toggleTheme
  } = useAdmin();

  // If token already exists, redirect to overview page
  useEffect(() => {
    if (mounted && token) {
      router.push('/overview');
    }
  }, [mounted, token, router]);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-650"></div>
      </div>
    );
  }

  if (token) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-650"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 px-4">
      <div className="max-w-md w-full bg-white dark:bg-zinc-900 rounded-2xl border dark:border-zinc-800 shadow-xl p-8 space-y-6">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 rounded-xl bg-indigo-100 dark:bg-indigo-955 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <h1 className="mt-4 text-2xl font-extrabold text-zinc-905 dark:text-white">ApexStore Admin</h1>
          <p className="mt-1 text-sm text-zinc-500">Sign in with your admin credentials</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <input type="email" required placeholder="Admin email" value={loginEmail} onChange={e => setLoginEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border dark:border-zinc-700 bg-white dark:bg-zinc-950 text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-indigo-500" />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <input type="password" required placeholder="Password" value={loginPassword} onChange={e => setLoginPassword(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border dark:border-zinc-700 bg-white dark:bg-zinc-950 text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-indigo-500" />
          </div>
          {loginError && (
            <div className="flex items-center gap-2 text-xs text-red-650 dark:text-red-400 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-xl px-3 py-2">
              <AlertCircle className="h-4 w-4 shrink-0" /> {loginError}
            </div>
          )}
          <button type="submit" className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-lg active:scale-95 transition-all cursor-pointer">
            Sign In to Admin
          </button>
        </form>
        <div className="flex justify-center">
          <button onClick={toggleTheme} className="p-2 rounded-lg border dark:border-zinc-700 text-zinc-400 hover:text-indigo-500">
            {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </div>
  );
}
