'use client';

import React, { useEffect, useState } from 'react';
import { useStore } from '../../../store/store';
import { Wallet, Receipt, FileText, ClipboardList, AlertCircle } from 'lucide-react';

export default function VendorDashboardOverview() {
  const { user } = useStore();
  const [settledAmount, setSettledAmount] = useState(0);
  const [pendingAmount, setPendingAmount] = useState(0);
  const [vendorStatus, setVendorStatus] = useState('Verification In Progress');
  const [purchaseOrders, setPurchaseOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [contracts] = useState<any[]>([
    { id: 'CTR-4412', partner: 'ApexTech Global LLC', startDate: '2026-01-10', endDate: '2027-01-10', status: 'Active', terms: '10% Commission Cap, Net-30 Settlements' },
    { id: 'CTR-1102', partner: 'GizmoStore Group', startDate: '2026-03-01', endDate: '2027-03-01', status: 'Active', terms: 'Wholesale Distribution Contract' }
  ]);

  useEffect(() => {
    if (!user) return;
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [settlementsRes, profileRes, poRes] = await Promise.all([
          fetch('http://localhost:5001/api/v1/sales/vendor/settlements', {
            headers: { 'Authorization': `Bearer ${user.token}` }
          }),
          fetch('http://localhost:5001/api/v1/profile/me', {
            headers: { 'Authorization': `Bearer ${user.token}` }
          }),
          fetch('http://localhost:5001/api/v1/sales/orders', {
            headers: { 'Authorization': `Bearer ${user.token}` }
          })
        ]);

        if (settlementsRes.ok) {
          const s = await settlementsRes.json();
          const sData = s.data || s;
          setSettledAmount(sData.totalEarnings || 0);
          setPendingAmount(sData.pendingSettlement || 0);
        }
        if (profileRes.ok) {
          const prof = await profileRes.json();
          const profData = prof.data || prof;
          setVendorStatus(profData.vendorStatus || 'Active');
        }
        if (poRes.ok) {
          const po = await poRes.json();
          const poData = Array.isArray(po) ? po : (po && Array.isArray(po.data) ? po.data : []);
          setPurchaseOrders(poData);
        } else {
          setPurchaseOrders([
            { id: 'PO-7721', sellerStore: 'ApexTech Partner Shop', item: 'NexaHome Bamboo Sheets', quantity: 120, total: 3600.00, status: 'Approved', date: '2026-06-08' },
            { id: 'PO-8812', sellerStore: 'GizmoStore Retail', item: 'NexaHome Kitchen Set', quantity: 50, total: 1850.00, status: 'Pending', date: '2026-06-09' }
          ]);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, [user]);

  return (
    <>
      <title>Supply Dashboard - ApexStore Vendor</title>

      {vendorStatus !== 'Active' && !loading && (
        <div className="bg-amber-50 border border-amber-200 dark:bg-amber-955/20 dark:border-amber-900/30 rounded-2xl p-4 flex items-start gap-3 text-amber-800 dark:text-amber-300">
          <AlertCircle className="h-5 w-5 shrink-0 mt-0.5 text-amber-500" />
          <div>
            <h4 className="font-bold text-sm">Account Verification In Progress</h4>
            <p className="text-xs mt-1 leading-relaxed">
              Your vendor account is currently under review by our administrators. You will be able to list new products and manage settlements as soon as your account is approved.
            </p>
          </div>
        </div>
      )}

      <div>
        <h1 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-white">Supply Dashboard</h1>
        <p className="text-zinc-500 text-sm mt-1">Overview of supplied inventory, active wholesale contracts, and pending bank transfers.</p>
      </div>

      <section className="grid sm:grid-cols-4 gap-6">
        {[
          { label: 'Total Earnings', value: loading ? null : `$${settledAmount.toFixed(2)}`, icon: <Wallet className="h-10 w-10 text-indigo-500 bg-indigo-50 dark:bg-indigo-950/20 p-2 rounded-xl" /> },
          { label: 'Pending Payouts', value: loading ? null : `$${pendingAmount.toFixed(2)}`, icon: <Receipt className="h-10 w-10 text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20 p-2 rounded-xl" /> },
          { label: 'Active Contracts', value: loading ? null : contracts.length, icon: <FileText className="h-10 w-10 text-amber-500 bg-amber-50 dark:bg-amber-950/20 p-2 rounded-xl" /> },
          { label: 'Pending POs', value: loading ? null : purchaseOrders.filter(po => po.status === 'Pending').length, icon: <ClipboardList className="h-10 w-10 text-rose-500 bg-rose-50 dark:bg-rose-950/20 p-2 rounded-xl" /> }
        ].map(s => (
          <div key={s.label} className="bg-white p-6 rounded-2xl border dark:bg-zinc-900 shadow-sm flex items-center justify-between dark:border-zinc-800">
            <div>
              <div className="text-xs text-zinc-400 font-bold uppercase tracking-wider">{s.label}</div>
              {s.value === null ? (
                <div className="h-7 w-24 bg-zinc-200 dark:bg-zinc-800 rounded-lg animate-pulse mt-1" />
              ) : (
                <div className="text-2xl font-black mt-1 text-zinc-900 dark:text-white">{s.value}</div>
              )}
            </div>
            {s.icon}
          </div>
        ))}
      </section>
    </>
  );
}

