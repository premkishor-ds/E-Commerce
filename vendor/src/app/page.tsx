'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '../store/store';
import { Lock, Mail, Moon, Sun, Coins } from 'lucide-react';

export default function VendorRootPage() {
  const router = useRouter();
  const { user, login, theme, toggleTheme } = useStore();
  const [mounted, setMounted] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [companyLegalName, setCompanyLegalName] = useState('NexaHome Brands Inc.');

  useEffect(() => {
    setMounted(true);
  }, []);

  // Redirect if logged in
  useEffect(() => {
    if (mounted && user) {
      router.push('/dashboard');
    }
  }, [mounted, user, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5001/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      if (!res.ok) throw new Error('Invalid credentials');
      const resData = await res.json();
      const payload = resData.data || resData;
      login(payload.user.email, payload.user.roles[0], payload.accessToken, payload.user.id);
    } catch (err: any) { alert(err.message); }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5001/api/v1/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          roles: ['Vendor'],
          shopName: companyLegalName
        })
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || 'Registration failed');
      }
      const resData = await res.json();
      const payload = resData.data || resData;
      login(payload.user.email, payload.user.roles[0], payload.accessToken, payload.user.id);
    } catch (err: any) { alert(err.message); }
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (user) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 px-4">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl border border-zinc-200/85 dark:bg-zinc-900 dark:border-zinc-800 shadow-xl">
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
            <Coins className="h-6 w-6" />
          </div>
          <h2 className="mt-4 text-3xl font-extrabold text-zinc-900 dark:text-white">ApexStore Vendor Console</h2>
          <p className="mt-2 text-sm text-zinc-500">
            {isRegisterMode ? 'Register a vendor partner account.' : 'Sign in to manage products, settlements, and payouts.'}
          </p>
        </div>
        <form onSubmit={isRegisterMode ? handleRegister : handleLogin} className="space-y-4">
          {isRegisterMode && (
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-400"><Coins className="h-5 w-5" /></span>
              <input type="text" required placeholder="Company Name" value={companyLegalName} onChange={e => setCompanyLegalName(e.target.value)}
                className="w-full rounded-xl border border-zinc-200 pl-10 pr-4 py-3 text-sm focus:border-indigo-500 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 text-zinc-900 dark:text-white" />
            </div>
          )}
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-400"><Mail className="h-5 w-5" /></span>
            <input type="email" required placeholder="Vendor Email Address" value={email} onChange={e => setEmail(e.target.value)}
              className="w-full rounded-xl border border-zinc-200 pl-10 pr-4 py-3 text-sm focus:border-indigo-500 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 text-zinc-900 dark:text-white" />
          </div>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-400"><Lock className="h-5 w-5" /></span>
            <input type="password" required placeholder="Console Password" value={password} onChange={e => setPassword(e.target.value)}
              className="w-full rounded-xl border border-zinc-200 pl-10 pr-4 py-3 text-sm focus:border-indigo-500 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 text-zinc-900 dark:text-white" />
          </div>
          <button type="submit" className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 font-semibold text-white hover:bg-indigo-500 shadow-lg active:scale-95 transition-all text-sm cursor-pointer">
            {isRegisterMode ? 'Register Vendor' : 'Authenticate Vendor'}
          </button>
        </form>
        <div className="text-center text-sm text-zinc-500">
          {isRegisterMode ? (
            <p>
              Already have an account?{' '}
              <button onClick={() => setIsRegisterMode(false)} className="text-indigo-600 font-semibold hover:underline bg-transparent border-0 cursor-pointer">
                Sign In
              </button>
            </p>
          ) : (
            <p>
              Don't have an account?{' '}
              <button onClick={() => setIsRegisterMode(true)} className="text-indigo-600 font-semibold hover:underline bg-transparent border-0 cursor-pointer">
                Register as Vendor
              </button>
            </p>
          )}
        </div>
        <div className="flex justify-center pt-2">
          <button onClick={toggleTheme} className="p-2 text-zinc-400 hover:text-indigo-500 rounded-lg border dark:border-zinc-800 bg-transparent cursor-pointer">
            {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
          </button>
        </div>
      </div>
    </div>
  );
}
