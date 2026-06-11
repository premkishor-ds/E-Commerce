'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useStore } from '../../store/store';
import {
  LayoutDashboard, Wallet, LogOut, Sun, Moon, ShieldCheck, Store, Box, Tag, Package,
  ShoppingCart, Star, BarChart3, Bell, HelpCircle
} from 'lucide-react';

export default function SellerLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout, theme, toggleTheme } = useStore();
  const [mounted, setMounted] = useState(false);
  const [vendorStatus, setVendorStatus] = useState('Verification In Progress');

  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch status once user is loaded
  useEffect(() => {
    if (!user) return;
    const fetchStatus = async () => {
      try {
        const profileRes = await fetch('http://localhost:5001/api/v1/profile/me', {
          headers: { 'Authorization': `Bearer ${user.token}` }
        });
        if (profileRes.ok) {
          const prof = await profileRes.json();
          setVendorStatus(prof.vendorStatus || 'Active');
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchStatus();
  }, [user]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (mounted && !user) {
      router.push('/');
    }
  }, [mounted, user, router]);

  if (!mounted || !user) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  const subRoute = pathname.split('/').filter(Boolean)[0] || 'dashboard';

  const navItems = [
    { id: 'dashboard', label: 'Overview', icon: <LayoutDashboard className="h-4 w-4" /> },
    { id: 'listings', label: 'Listings', icon: <Box className="h-4 w-4" /> },
    { id: 'inventory', label: 'Inventory', icon: <Package className="h-4 w-4" /> },
    { id: 'orders', label: 'Orders', icon: <ShoppingCart className="h-4 w-4" /> },
    { id: 'revenue', label: 'Revenue & Payouts', icon: <Wallet className="h-4 w-4" /> },
    { id: 'reviews', label: 'Reviews', icon: <Star className="h-4 w-4" /> },
    { id: 'analytics', label: 'Analytics', icon: <BarChart3 className="h-4 w-4" /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell className="h-4 w-4" /> },
    { id: 'support', label: 'Support', icon: <HelpCircle className="h-4 w-4" /> },
    { id: 'profile', label: 'Profile', icon: <Store className="h-4 w-4" /> }
  ];

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col transition-colors duration-300">
      {/* Topbar */}
      <header className="sticky top-0 z-40 w-full border-b border-zinc-200/80 bg-white/80 backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-950/80 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl text-emerald-600 dark:text-emerald-400">
            <Store className="h-6 w-6" />
            <span>ApexStore Seller Console</span>
            <span className={`hidden sm:inline-block text-[10px] ml-2 px-2 py-0.5 rounded-full font-semibold border ${
              vendorStatus === 'Active'
                ? 'bg-emerald-100 dark:bg-emerald-955/50 text-emerald-700 dark:text-emerald-300 border-emerald-200/50'
                : 'bg-amber-100 dark:bg-amber-955/50 text-amber-700 dark:text-amber-300 border-amber-200/50'
            }`}>{vendorStatus}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden md:inline-block text-xs font-semibold text-zinc-500">
              Merchant: <strong className="text-zinc-800 dark:text-zinc-200">{user.email}</strong> ({user.role})
            </span>
            <button onClick={toggleTheme} className="p-2 text-zinc-550 hover:text-emerald-500 dark:text-zinc-400 bg-transparent border-0 cursor-pointer">
              {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </button>
            <button onClick={logout} className="flex items-center gap-1.5 rounded-lg border border-zinc-200 px-3 py-1.5 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-900 cursor-pointer bg-white">
              <LogOut className="h-3.5 w-3.5" /> Sign Out
            </button>
          </div>
        </div>
      </header>

      <div className="flex-1 max-w-7xl w-full mx-auto flex">
        {/* Sidebar */}
        <aside className="w-64 border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 flex flex-col justify-between hidden lg:flex">
          <div className="space-y-6">
            <div className="flex items-center gap-2 font-bold text-sm text-zinc-400 uppercase tracking-wider">
              <LayoutDashboard className="h-4 w-4 text-emerald-500" /><span>Console Routes</span>
            </div>
            <nav className="space-y-1">
              {navItems.map(tab => (
                <button key={tab.id} onClick={() => router.push(`/${tab.id}`)}
                  className={`w-full text-left rounded-xl px-4 py-2 flex items-center gap-2.5 text-xs font-semibold transition-all cursor-pointer border-0 ${subRoute === tab.id
                    ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-300 border border-emerald-100/50 dark:border-indigo-900/30'
                    : 'text-zinc-550 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/40 bg-transparent'}`}>
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
          <div className="text-[10px] font-bold text-zinc-400/80 bg-zinc-50 dark:bg-zinc-950 border dark:border-zinc-800/80 p-3 rounded-lg flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0" />
            <div className="truncate"><div>Secure Environment</div><div className="font-normal text-[8px] truncate">{user.token}</div></div>
          </div>
        </aside>

        <main className="flex-1 p-6 sm:p-8 space-y-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
