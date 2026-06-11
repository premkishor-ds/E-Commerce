'use client';

import React, { useState } from 'react';

export default function AnalyticsPage() {
  const [analyticsData] = useState<any>({
    conversionRate: 2.4,
    salesCount: 124,
    revenueHistory: [3200, 4100, 3900, 5200, 6100, 7500],
  });

  return (
    <>
      <title>Sales Analytics - ApexStore Seller</title>
      <section className="bg-white p-6 rounded-2xl border dark:bg-zinc-900 shadow-sm space-y-6 dark:border-zinc-800">
        <div>
          <h3 className="font-bold text-xl text-zinc-900 dark:text-white">Sales & Payout Analytics</h3>
          <p className="text-xs text-zinc-555 mt-0.5">Sales analytics trends, monthly metrics, and conversion rates.</p>
        </div>
        <div className="space-y-4">
          <div className="flex items-end gap-2 h-32 pt-6">
            {analyticsData.revenueHistory.map((val: number, idx: number) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                <div className="bg-emerald-600 rounded-t w-full" style={{ height: `${(val / 8000) * 100}%` }}></div>
                <span className="text-[10px] text-zinc-400">M{idx+1}</span>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-4 text-center pt-4 border-t dark:border-zinc-800">
            <div>
              <div className="text-xs text-zinc-400 font-semibold">Total Revenue</div>
              <div className="text-lg font-bold text-zinc-900 dark:text-white">$30,800</div>
            </div>
            <div>
              <div className="text-xs text-zinc-400 font-semibold">Average Ticket Size</div>
              <div className="text-lg font-bold text-zinc-900 dark:text-white">$248.38</div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
