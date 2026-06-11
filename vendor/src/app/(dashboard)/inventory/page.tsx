'use client';

import React, { useEffect, useState } from 'react';
import { useStore } from '../../../store/store';

export default function VendorInventoryPage() {
  const { user } = useStore();
  const [vendorProducts, setVendorProducts] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    const fetchVendorProducts = async () => {
      try {
        const prodRes = await fetch(`http://localhost:5001/api/v1/catalog/products?vendorId=${user.id}`, {
          headers: { 'Authorization': `Bearer ${user.token}` }
        });
        if (prodRes.ok) {
          const data = await prodRes.json();
          setVendorProducts(data.map((p: any) => ({
            id: p._id,
            title: p.title,
            sku: p.sku,
            stock: p.stock ?? 0
          })));
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchVendorProducts();
  }, [user]);

  return (
    <>
      <title>Inventory Supply - ApexStore Vendor</title>
      <section className="bg-white p-6 rounded-2xl border dark:bg-zinc-900 shadow-sm space-y-6 dark:border-zinc-800">
        <div>
          <h3 className="font-bold text-xl text-zinc-900 dark:text-white">Wholesale Supply Inventory</h3>
          <p className="text-xs text-zinc-550 mt-0.5">Manage stock supplied to retail partner sellers.</p>
        </div>
        <div className="space-y-4">
          {vendorProducts.length === 0 && (
            <p className="text-xs text-zinc-400 text-center py-4">No products found in catalog.</p>
          )}
          {vendorProducts.map(p => (
            <div key={p.id} className="flex justify-between items-center border-b pb-3 dark:border-zinc-800 last:border-0 last:pb-0">
              <div>
                <div className="font-bold text-sm text-zinc-900 dark:text-white">{p.title}</div>
                <div className="text-xs text-zinc-400">SKU: {p.sku}</div>
              </div>
              <div className="flex items-center gap-4">
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${p.stock < 20 ? 'bg-red-100 text-red-800' : 'bg-indigo-100 text-indigo-800'}`}>
                  {p.stock} Available
                </span>
                <button onClick={() => alert('Stock replenishment request sent!')}
                  className="bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-750 px-3 py-1.5 rounded-lg text-xs font-semibold text-zinc-700 dark:text-zinc-300 border-0 cursor-pointer">
                  Add +100 Units
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
