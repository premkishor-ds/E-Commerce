'use client';

import React, { useEffect, useState } from 'react';
import { useStore } from '../../../store/store';

export default function InventoryPage() {
  const { user } = useStore();
  const [catalog, setCatalog] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  function mapProduct(p: any) {
    return {
      id: p._id,
      title: p.title,
      description: p.description || '',
      price: p.price,
      category: p.category?.name || p.category || 'Electronics',
      categoryId: p.category?._id || p.category || '',
      brand: p.brand?.name || p.brand || 'ApexTech',
      sku: p.sku,
      stock: p.stock ?? 0,
      images: p.images && p.images.length > 0 ? p.images : ['https://picsum.photos/seed/' + p.sku + '/600/600'],
      tags: p.tags || []
    };
  }

  useEffect(() => {
    if (!user) return;
    const fetchSellerData = async () => {
      try {
        setLoading(true);
        const res = await fetch(`http://localhost:5001/api/v1/catalog/products?vendorId=${user.id}`);
        if (res.ok) {
          const resJson = await res.json();
          const list = Array.isArray(resJson) ? resJson : (resJson && Array.isArray(resJson.data) ? resJson.data : []);
          setCatalog(list.map((p: any) => mapProduct(p)));
        }
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchSellerData();
  }, [user]);

  if (loading) {
    return (
      <section className="bg-white p-6 rounded-2xl border dark:bg-zinc-900 shadow-sm space-y-6 dark:border-zinc-800 animate-pulse">
        <div className="space-y-2">
          <div className="h-6 w-48 bg-zinc-200 dark:bg-zinc-800 rounded-lg" />
          <div className="h-4 w-72 bg-zinc-200/80 dark:bg-zinc-800/80 rounded-lg" />
        </div>
        <div className="space-y-4">
          {Array(3).fill(0).map((_, i) => (
            <div key={i} className="flex justify-between items-center border-b pb-3 dark:border-zinc-800 last:border-0 last:pb-0">
              <div className="space-y-2">
                <div className="h-4.5 w-32 bg-zinc-200 dark:bg-zinc-800 rounded-md" />
                <div className="h-3.5 w-24 bg-zinc-200 dark:bg-zinc-800 rounded-md" />
              </div>
              <div className="h-8 w-24 bg-zinc-200 dark:bg-zinc-800 rounded-lg" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <>
      <title>Inventory & Stock - ApexStore Seller</title>
      <section className="bg-white p-6 rounded-2xl border dark:bg-zinc-900 shadow-sm space-y-6 dark:border-zinc-800">
        <div>
          <h3 className="font-bold text-xl text-zinc-900 dark:text-white">Inventory & Stock Levels</h3>
          <p className="text-xs text-zinc-550 mt-0.5">Track low stock items and replenish inventory warehouses.</p>
        </div>
        <div className="space-y-4">
          {catalog.map(p => (
            <div key={p.id} className="flex justify-between items-center border-b pb-3 dark:border-zinc-800 last:border-0 last:pb-0">
              <div>
                <div className="font-bold text-sm text-zinc-900 dark:text-white">{p.title}</div>
                <div className="text-xs text-zinc-400 font-mono">SKU: {p.sku}</div>
              </div>
              <div className="flex items-center gap-4">
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${p.stock < 10 ? 'bg-red-150 text-red-700' : 'bg-emerald-150 text-emerald-700'}`}>
                  {p.stock} Units
                </span>
                <button onClick={() => alert('Restock order placed!')}
                  className="bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 px-3 py-1.5 rounded-lg text-xs font-semibold text-zinc-700 dark:text-zinc-300 border-0 cursor-pointer">
                  Restock +50
                </button>
              </div>
            </div>
          ))}
          {catalog.length === 0 && <p className="text-sm text-zinc-400 text-center py-6">No products found.</p>}
        </div>
      </section>
    </>
  );
}
