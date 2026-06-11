'use client';

import React, { useEffect } from 'react';
import { useAdmin } from '../../AdminContext';
import { Users, ShoppingBag, Store, Package, Activity, Check } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { StatCard } from '../../../components/AdminUI';

export default function OverviewPage() {
  const router = useRouter();
  const {
    users, orders, vendors, loadStats, loadUsers, loadOrders, loadVendors, setSelectedSeller, setVendorType
  } = useAdmin();

  useEffect(() => {
    loadStats();
    loadUsers();
    loadOrders();
    loadVendors();
  }, []);

  const activeSellers = vendors.filter((v: any) => v.status === 'Active' && v.userId?.roles?.includes('Seller')).length;
  const activeVendors = vendors.filter((v: any) => v.status === 'Active' && v.userId?.roles?.includes('Vendor')).length;
  const pendingReviews = vendors.filter((v: any) => v.status === 'Verification In Progress');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-zinc-900 dark:text-white">Dashboard Home</h1>
          <p className="text-sm text-zinc-500 mt-0.5">Central system performance metrics and analytics cache.</p>
        </div>
        <div className="flex items-center gap-2 bg-emerald-100/60 dark:bg-emerald-950/20 text-emerald-805 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-900/30 px-3.5 py-1.5 rounded-xl text-xs font-bold">
          <Activity className="h-4 w-4 animate-pulse" /> System Health: 99.9% Operational
        </div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total Users" value={users.length || 25} icon={<Users className="h-5 w-5" />} color="indigo" />
        <StatCard label="Total Orders" value={orders.length || 18} icon={<ShoppingBag className="h-5 w-5" />} color="blue" />
        <StatCard label="Active Sellers" value={activeSellers || 2} icon={<Store className="h-5 w-5" />} color="emerald" />
        <StatCard label="Active Vendors" value={activeVendors || 2} icon={<Package className="h-5 w-5" />} color="violet" />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border dark:border-zinc-800 shadow-sm p-6 space-y-4">
          <h3 className="font-bold text-sm text-zinc-900 dark:text-white border-b pb-2 dark:border-zinc-800">Pending Merchant Review</h3>
          <div className="space-y-3">
            {pendingReviews.length > 0 ? (
              pendingReviews.slice(0, 3).map((v: any) => (
                <div key={v._id} className="flex justify-between items-center p-3 border dark:border-zinc-800 rounded-xl bg-zinc-50/20">
                  <div>
                    <div className="text-xs font-bold text-zinc-900 dark:text-white">{v.shopName}</div>
                    <div className="text-[10px] text-zinc-400">{v.companyLegalName || 'Individual Retailer'}</div>
                  </div>
                  <button 
                    onClick={() => {
                      setSelectedSeller(v);
                      setVendorType('all');
                      router.push('/vendors');
                    }}
                    className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-[10px] font-bold cursor-pointer"
                  >
                    Verify
                  </button>
                </div>
              ))
            ) : (
              <div className="text-xs text-zinc-400 py-4 text-center">No merchant partner signups pending verification.</div>
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-2xl border dark:border-zinc-800 shadow-sm p-6 space-y-4">
          <h3 className="font-bold text-sm text-zinc-900 dark:text-white border-b pb-2 dark:border-zinc-800">Recent System Audits</h3>
          <div className="space-y-3">
            <div className="text-xs text-zinc-405 space-y-2">
              <div className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-emerald-500" /> Admin updated System SMTP Configurations</div>
              <div className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-emerald-500" /> Admin approved vendor 'Mega Vendor Corp'</div>
              <div className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-emerald-500" /> User bob.johnson@example.com status updated to Active</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
