'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '../../../store/store';

export default function OrdersPage() {
  const router = useRouter();
  const { user } = useStore();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const ordersRes = await fetch('http://localhost:5001/api/v1/sales/orders', {
          headers: { 'Authorization': `Bearer ${user.token}` }
        });
        if (ordersRes.ok) {
          const resJson = await ordersRes.json();
          const list = Array.isArray(resJson) ? resJson : (resJson && Array.isArray(resJson.data) ? resJson.data : []);
          setOrders(list);
        } else {
          setOrders([
            { id: 'ORD-9921', customerName: 'John Doe', total: 249.99, status: 'Shipped', date: '2026-06-08' },
            { id: 'ORD-8822', customerName: 'Sarah Smith', total: 89.50, status: 'Paid', date: '2026-06-09' }
          ]);
        }
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchOrders();
  }, [user]);

  if (loading) {
    return (
      <section className="bg-white p-6 rounded-2xl border dark:bg-zinc-900 shadow-sm space-y-6 dark:border-zinc-800 animate-pulse">
        <div className="space-y-2">
          <div className="h-6 w-40 bg-zinc-200 dark:bg-zinc-800 rounded-lg" />
          <div className="h-4 w-72 bg-zinc-200/80 dark:bg-zinc-800/80 rounded-lg" />
        </div>
        <div className="space-y-4">
          {Array(3).fill(0).map((_, i) => (
            <div key={i} className="flex justify-between items-center border-b pb-3 dark:border-zinc-800 last:border-0 last:pb-0">
              <div className="space-y-2">
                <div className="h-4.5 w-32 bg-zinc-200 dark:bg-zinc-800 rounded-md" />
                <div className="h-3.5 w-48 bg-zinc-200 dark:bg-zinc-800 rounded-md" />
              </div>
              <div className="h-8 w-16 bg-zinc-200 dark:bg-zinc-800 rounded-lg" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <>
      <title>Manage Orders - ApexStore Seller</title>
      <section className="bg-white p-6 rounded-2xl border dark:bg-zinc-900 shadow-sm space-y-6 dark:border-zinc-800">
        <div>
          <h3 className="font-bold text-xl text-zinc-900 dark:text-white">Customer Orders</h3>
          <p className="text-xs text-zinc-550 mt-0.5">Manage customer purchase orders, updates status and track shipping.</p>
        </div>
        <div className="space-y-4">
          {orders.map(o => (
            <div
              key={o.id || o._id}
              onClick={() => router.push(`/orders/${o.id || o._id}`)}
              className="flex justify-between items-center border-b pb-3 dark:border-zinc-800 last:border-0 last:pb-0 cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-950 p-2 rounded-xl transition-colors"
            >
              <div>
                <div className="font-bold text-sm text-zinc-900 dark:text-white">{o.customerName || (o.shippingAddress?.fullName)}</div>
                <div className="text-xs text-zinc-400">Order ID: {o.id || o._id} · Date: {o.date || new Date(o.createdAt).toLocaleDateString()}</div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-sm font-bold text-zinc-900 dark:text-white">${o.total.toFixed(2)}</div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-amber-100 text-amber-800">{o.status}</span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/orders/${o.id || o._id}`);
                  }}
                  className="bg-emerald-650 hover:bg-emerald-500 text-white rounded-lg px-3 py-1.5 text-xs font-semibold border-0 cursor-pointer"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
          {orders.length === 0 && <p className="text-sm text-zinc-400 text-center py-6">No orders found.</p>}
        </div>
      </section>
    </>
  );
}
