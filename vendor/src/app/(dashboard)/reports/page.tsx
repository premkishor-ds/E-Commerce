'use client';

import React, { useState } from 'react';

export default function VendorReportsPage() {
  const [analyticsData] = useState<any>({
    monthlySupply: 4200,
    activeContracts: 3,
    supplyHistory: [120, 240, 310, 480, 520, 680]
  });

  return (
    <>
      <title>Reports - ApexStore Vendor</title>
      <section className="bg-white p-6 rounded-2xl border dark:bg-zinc-900 shadow-sm space-y-6 dark:border-zinc-800">
        <div>
          <h3 className="font-bold text-xl text-zinc-900 dark:text-white">Wholesale Supply Analytics</h3>
          <p className="text-xs text-zinc-550 mt-0.5">Supply capacity logs and historical data.</p>
        </div>
        <div className="space-y-4">
          <div className="flex items-end gap-2 h-32 pt-6">
            {analyticsData.supplyHistory.map((val: number, idx: number) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                <div className="bg-indigo-600 rounded-t w-full" style={{ height: `${(val / 800) * 100}%` }}></div>
                <span className="text-[10px] text-zinc-400">M{idx+1}</span>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-4 text-center pt-4 border-t dark:border-zinc-800">
            <div>
              <div className="text-xs text-zinc-400 font-semibold">Monthly Units Dispatched</div>
              <div className="text-lg font-bold text-zinc-900 dark:text-white">{analyticsData.monthlySupply} Units</div>
            </div>
            <div>
              <div className="text-xs text-zinc-400 font-semibold">Active Distribution Channels</div>
              <div className="text-lg font-bold text-zinc-900 dark:text-white">{analyticsData.activeContracts} Sellers</div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
