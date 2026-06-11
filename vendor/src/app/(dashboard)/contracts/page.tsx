'use client';

import React, { useState } from 'react';

export default function VendorContractsPage() {
  const [contracts] = useState<any[]>([
    { id: 'CTR-4412', partner: 'ApexTech Global LLC', startDate: '2026-01-10', endDate: '2027-01-10', status: 'Active', terms: '10% Commission Cap, Net-30 Settlements' },
    { id: 'CTR-1102', partner: 'GizmoStore Group', startDate: '2026-03-01', endDate: '2027-03-01', status: 'Active', terms: 'Wholesale Distribution Contract' }
  ]);

  return (
    <>
      <title>Contracts - ApexStore Vendor</title>
      <section className="bg-white p-6 rounded-2xl border dark:bg-zinc-900 shadow-sm space-y-6 dark:border-zinc-800">
        <div>
          <h3 className="font-bold text-xl text-zinc-900 dark:text-white">Active Contracts & SLA</h3>
          <p className="text-xs text-zinc-550 mt-0.5">Review current legal distribution contracts and wholesale terms.</p>
        </div>
        <div className="space-y-4">
          {contracts.map(c => (
            <div key={c.id} className="border border-zinc-100 dark:border-zinc-800 rounded-xl p-4 space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-bold text-sm text-zinc-900 dark:text-white">{c.partner}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-emerald-100 text-emerald-800">{c.status}</span>
              </div>
              <p className="text-xs text-zinc-500 mt-1">{c.terms}</p>
              <div className="text-[10px] text-zinc-400 pt-1">
                Active: {c.startDate} to {c.endDate}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
