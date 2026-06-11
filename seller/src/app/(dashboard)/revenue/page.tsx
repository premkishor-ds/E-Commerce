'use client';

import React, { useEffect, useState } from 'react';
import { useStore } from '../../../store/store';
import { ArrowUpRight } from 'lucide-react';

export default function RevenuePage() {
  const { user } = useStore();
  const [totalSettledAmount, setTotalSettledAmount] = useState(0);
  const [pendingSettlement, setPendingSettlement] = useState(0);
  const [withdrawals, setWithdrawals] = useState<any[]>([]);
  const [withdrawAmount, setWithdrawAmount] = useState('');

  useEffect(() => {
    if (!user) return;
    const fetchRevenue = async () => {
      try {
        const settlementsRes = await fetch('http://localhost:5001/api/v1/sales/vendor/settlements', {
          headers: { 'Authorization': `Bearer ${user.token}` }
        });
        if (settlementsRes.ok) {
          const s = await settlementsRes.json();
          setTotalSettledAmount(s.totalEarnings || 0);
          setPendingSettlement(s.pendingSettlement || 0);
          setWithdrawals(s.history || [
            { id: '1', amount: 350.00, status: 'Completed', processedAt: '2026-06-05' },
            { id: '2', amount: 150.00, status: 'Pending', processedAt: null }
          ]);
        }
      } catch (err) { console.error(err); }
    };
    fetchRevenue();
  }, [user]);

  return (
    <>
      <title>Revenue & Payouts - ApexStore Seller</title>
      <section className="bg-white p-6 rounded-2xl border dark:bg-zinc-900 shadow-sm space-y-6 dark:border-zinc-800">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h3 className="font-bold text-xl text-zinc-900 dark:text-white">Revenue settlements & Withdrawals</h3>
            <p className="text-xs text-zinc-550 mt-0.5">Request payouts to your registered bank account.</p>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <input type="number" placeholder="Amt ($)" value={withdrawAmount} onChange={e => setWithdrawAmount(e.target.value)}
              className="border dark:border-zinc-800 dark:bg-zinc-950 text-zinc-900 dark:text-white p-2 rounded-lg text-xs w-24 focus:outline-none" />
            <button onClick={() => { if(!withdrawAmount) return; alert(`Requested withdrawal of $${withdrawAmount}`); setWithdrawAmount(''); }}
              className="bg-emerald-650 hover:bg-emerald-500 text-white rounded-lg px-3 py-1.5 text-xs font-semibold flex items-center gap-1 border-0 cursor-pointer">
              <ArrowUpRight className="h-3 w-3" /> Withdraw
            </button>
          </div>
        </div>
        <div className="space-y-4 text-xs">
          <h4 className="font-bold text-xs uppercase tracking-wider text-zinc-400">Payout History</h4>
          {withdrawals.map(w => (
            <div key={w.id || w._id} className="flex justify-between items-center border-b pb-3 dark:border-zinc-800 last:border-0 last:pb-0">
              <div>
                <div className="font-bold text-sm text-zinc-900 dark:text-white">${w.amount.toFixed(2)}</div>
                <div className="text-xs text-zinc-400">Date: {w.processedAt || 'Pending Review'}</div>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${w.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>{w.status}</span>
            </div>
          ))}
          {withdrawals.length === 0 && <p className="text-sm text-zinc-400 text-center py-6">No payout transactions recorded.</p>}
        </div>
      </section>
    </>
  );
}
