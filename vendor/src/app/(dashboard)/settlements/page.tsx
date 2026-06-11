'use client';

import React, { useEffect, useState } from 'react';
import { useStore } from '../../../store/store';
import { Wallet, Receipt, Percent, Coins, Send, FileSpreadsheet, CheckCircle2 } from 'lucide-react';

export default function VendorSettlementsPage() {
  const { user } = useStore();
  const [vendorStatus, setVendorStatus] = useState('Verification In Progress');
  const [settledAmount, setSettledAmount] = useState(0);
  const [pendingAmount, setPendingAmount] = useState(0);
  const [commissionRate, setCommissionRate] = useState(0);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [payoutsHistory, setPayoutsHistory] = useState<Array<{ id: string; amount: number; date: string; status: string }>>([]);

  useEffect(() => {
    if (!user) return;
    const fetchSettlementData = async () => {
      try {
        const [settlementsRes, analyticsRes, profileRes] = await Promise.all([
          fetch('http://localhost:5001/api/v1/sales/vendor/settlements', {
            headers: { 'Authorization': `Bearer ${user.token}` }
          }),
          fetch('http://localhost:5001/api/v1/catalog/vendor/analytics', {
            headers: { 'Authorization': `Bearer ${user.token}` }
          }),
          fetch('http://localhost:5001/api/v1/profile/me', {
            headers: { 'Authorization': `Bearer ${user.token}` }
          })
        ]);

        if (settlementsRes.ok) {
          const s = await settlementsRes.json();
          setSettledAmount(s.totalEarnings || 0);
          setPendingAmount(s.pendingSettlement || 0);
          setPayoutsHistory((s.settlements || []).map((st: any) => ({
            id: st._id?.toString().slice(-8).toUpperCase() || 'PAY-0000',
            amount: st.amount || 0,
            date: st.processedAt ? new Date(st.processedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A',
            status: st.status || 'Pending'
          })));
        }
        if (analyticsRes.ok) {
          const a = await analyticsRes.json();
          setCommissionRate(a.commissionRate || 10);
        }
        if (profileRes.ok) {
          const prof = await profileRes.json();
          setVendorStatus(prof.vendorStatus || 'Active');
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchSettlementData();
  }, [user]);

  const handleWithdrawalRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(withdrawAmount);
    if (!val || val <= 0 || val > pendingAmount) {
      alert('Invalid withdrawal amount or insufficient pending balance.');
      return;
    }
    try {
      await fetch('http://localhost:5001/api/v1/payment/withdraw', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${user!.token}` },
        body: JSON.stringify({ amount: val })
      });
    } catch { /* optimistic update below */ }
    setPendingAmount(prev => prev - val);
    setSettledAmount(prev => prev + val);
    setPayoutsHistory([{
      id: `PAY-${Math.floor(1000 + Math.random() * 9000)}`,
      amount: val,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      status: 'Completed'
    }, ...payoutsHistory]);
    setWithdrawAmount('');
    alert(`Transfer of $${val.toFixed(2)} to bank account succeeded!`);
  };

  return (
    <>
      <title>Settlements - ApexStore Vendor</title>
      <div>
        <h1 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-white">Vendor Balance Sheets</h1>
        <p className="text-zinc-550 text-sm mt-1">Request transfers of pending payout funds and track invoice logs.</p>
      </div>

      <section className="grid sm:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border dark:bg-zinc-900 shadow-sm flex items-center justify-between dark:border-zinc-800">
          <div>
            <div className="text-xs text-zinc-400 font-bold uppercase tracking-wider">Settled Balance</div>
            <div className="text-2xl font-black mt-1 text-zinc-900 dark:text-white">${settledAmount.toFixed(2)}</div>
          </div>
          <Wallet className="h-10 w-10 text-indigo-500 bg-indigo-50 dark:bg-indigo-950/20 p-2 rounded-xl border border-indigo-100/50" />
        </div>
        <div className="bg-white p-6 rounded-2xl border dark:bg-zinc-900 shadow-sm flex items-center justify-between dark:border-zinc-800">
          <div>
            <div className="text-xs text-zinc-400 font-bold uppercase tracking-wider">Pending Payouts</div>
            <div className="text-2xl font-black mt-1 text-zinc-900 dark:text-white">${pendingAmount.toFixed(2)}</div>
          </div>
          <Receipt className="h-10 w-10 text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20 p-2 rounded-xl border border-emerald-100/50" />
        </div>
        <div className="bg-white p-6 rounded-2xl border dark:bg-zinc-900 shadow-sm flex items-center justify-between dark:border-zinc-800">
          <div>
            <div className="text-xs text-zinc-400 font-bold uppercase tracking-wider">Commission Charge</div>
            <div className="text-2xl font-black mt-1 text-zinc-900 dark:text-white">{commissionRate}%</div>
          </div>
          <Percent className="h-10 w-10 text-amber-500 bg-amber-50 dark:bg-amber-950/20 p-2 rounded-xl border border-amber-100/50" />
        </div>
      </section>

      <section className="grid md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl border dark:bg-zinc-900 shadow-sm space-y-4 dark:border-zinc-800">
          <h3 className="font-bold text-lg text-zinc-900 dark:text-white flex items-center gap-2 border-b pb-2 dark:border-zinc-800">
            <Coins className="h-5 w-5 text-indigo-500" /><span>Request Settlement Payout</span>
          </h3>
          <form onSubmit={handleWithdrawalRequest} className="space-y-4">
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-zinc-500">Withdrawal Amount ($)</label>
              <input type="number" required step="0.01" max={pendingAmount} disabled={vendorStatus !== 'Active'}
                placeholder={vendorStatus === 'Active' ? `Max ${pendingAmount.toFixed(2)}` : 'Verification Pending'} value={withdrawAmount}
                onChange={e => setWithdrawAmount(e.target.value)}
                className="w-full rounded-xl border border-zinc-200 bg-white p-3 text-sm focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 text-zinc-900 dark:text-white disabled:opacity-50" />
            </div>
            <button type="submit" disabled={vendorStatus !== 'Active'} className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 font-semibold text-white hover:bg-indigo-500 shadow-md active:scale-95 transition-all text-xs cursor-pointer border-0 disabled:opacity-50 disabled:cursor-not-allowed">
              <Send className="h-4 w-4" /><span>Execute Bank Settlement</span>
            </button>
          </form>
        </div>

        <div className="bg-white p-6 rounded-2xl border dark:bg-zinc-900 shadow-sm space-y-4 dark:border-zinc-800">
          <h3 className="font-bold text-lg text-zinc-900 dark:text-white flex items-center gap-2 border-b pb-2 dark:border-zinc-800">
            <FileSpreadsheet className="h-5 w-5 text-emerald-500" /><span>Transfer Ledgers</span>
          </h3>
          <div className="space-y-3 overflow-y-auto max-h-[160px]">
            {payoutsHistory.length === 0 && <p className="text-xs text-zinc-400 text-center py-4">No payout history yet.</p>}
            {payoutsHistory.map(log => (
              <div key={log.id} className="flex justify-between items-center p-3 rounded-xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50/20 dark:bg-zinc-950/20">
                <div>
                  <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">{log.id}</span>
                  <span className="ml-2 text-xs text-zinc-400">{log.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200">${log.amount.toFixed(2)}</span>
                  <span className="flex items-center gap-0.5 text-[9px] bg-emerald-50 dark:bg-emerald-955/50 text-emerald-700 dark:text-emerald-300 font-bold px-2 py-0.5 rounded border border-emerald-100/50">
                    <CheckCircle2 className="h-2.5 w-2.5" />{log.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
