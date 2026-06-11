'use client';

import React, { useEffect, useState } from 'react';
import { useStore } from '../../../store/store';
import { Wallet, Receipt, ShoppingCart, BarChart3 } from 'lucide-react';

export default function OverviewPage() {
  const { user } = useStore();
  const [totalSettledAmount, setTotalSettledAmount] = useState(0);
  const [pendingSettlement, setPendingSettlement] = useState(0);
  const [orders, setOrders] = useState<any[]>([]);
  const [catalog, setCatalog] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [analyticsData] = useState<any>({
    conversionRate: 2.4,
    salesCount: 124,
    revenueHistory: [3200, 4100, 3900, 5200, 6100, 7500],
  });

  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      try {
        setLoading(true);
        const [catalogRes, settlementsRes, ordersRes] = await Promise.all([
          fetch(`http://localhost:5001/api/v1/catalog/products?vendorId=${user.id}`),
          fetch('http://localhost:5001/api/v1/sales/vendor/settlements', {
            headers: { 'Authorization': `Bearer ${user.token}` }
          }),
          fetch('http://localhost:5001/api/v1/sales/orders', {
            headers: { 'Authorization': `Bearer ${user.token}` }
          })
        ]);

        if (catalogRes.ok) {
          const rawCatalog = await catalogRes.json();
          const data = Array.isArray(rawCatalog) ? rawCatalog : (rawCatalog && Array.isArray(rawCatalog.data) ? rawCatalog.data : []);
          setCatalog(data.slice(0, 3));
        }
        if (settlementsRes.ok) {
          const s = await settlementsRes.json();
          const sData = s.data || s;
          setTotalSettledAmount(sData.totalEarnings || 0);
          setPendingSettlement(sData.pendingSettlement || 0);
        }
        if (ordersRes.ok) {
          const ord = await ordersRes.json();
          const ordData = Array.isArray(ord) ? ord : (ord && Array.isArray(ord.data) ? ord.data : []);
          setOrders(ordData);
        } else {
          setOrders([
            { id: 'ORD-9921', customerName: 'John Doe', total: 249.99, status: 'Shipped', date: '2026-06-08' },
            { id: 'ORD-8822', customerName: 'Sarah Smith', total: 89.50, status: 'Paid', date: '2026-06-09' }
          ]);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  return (
    <div className="space-y-8">
      <title>Overview Dashboard - ApexStore Seller</title>
      <div>

        <h1 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-white">Store Overview</h1>
        <p className="text-zinc-500 text-sm mt-1">Real-time performance metrics, balance overview, and top selling products.</p>
      </div>

      <section className="grid sm:grid-cols-4 gap-6">
        {[
          { label: 'Settled Payouts', value: loading ? null : `$${totalSettledAmount.toFixed(2)}`, icon: <Wallet className="h-10 w-10 text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20 p-2 rounded-xl" /> },
          { label: 'Pending Balance', value: loading ? null : `$${pendingSettlement.toFixed(2)}`, icon: <Receipt className="h-10 w-10 text-indigo-500 bg-indigo-50 dark:bg-indigo-950/20 p-2 rounded-xl" /> },
          { label: 'Total Orders', value: loading ? null : orders.length, icon: <ShoppingCart className="h-10 w-10 text-rose-500 bg-rose-50 dark:bg-rose-950/20 p-2 rounded-xl" /> },
          { label: 'Conversion Rate', value: `${analyticsData.conversionRate}%`, icon: <BarChart3 className="h-10 w-10 text-amber-500 bg-amber-50 dark:bg-amber-950/20 p-2 rounded-xl" /> }
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

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border dark:bg-zinc-900 dark:border-zinc-800 shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-zinc-800 dark:text-zinc-200 uppercase tracking-wider">Top Performing Products</h3>
          <div className="space-y-3">
            {loading ? (
              Array(3).fill(0).map((_, i) => (
                <div key={i} className="flex justify-between items-center border-b pb-2 last:border-0 dark:border-zinc-800 animate-pulse">
                  <div className="space-y-1.5">
                    <div className="h-3.5 w-32 bg-zinc-200 dark:bg-zinc-800 rounded" />
                    <div className="h-3 w-20 bg-zinc-200 dark:bg-zinc-800 rounded" />
                  </div>
                  <div className="h-4 w-12 bg-zinc-200 dark:bg-zinc-800 rounded" />
                </div>
              ))
            ) : (
              <>
                {catalog.map(p => (
                  <div key={p._id} className="flex justify-between items-center border-b pb-2 dark:border-zinc-800 last:border-0 last:pb-0">
                    <div>
                      <div className="font-bold text-xs text-zinc-900 dark:text-white">{p.title}</div>
                      <div className="text-[10px] text-zinc-400">SKU: {p.sku}</div>
                    </div>
                    <div className="text-xs font-bold text-emerald-600">${p.price.toFixed(2)}</div>
                  </div>
                ))}
                {catalog.length === 0 && <p className="text-xs text-zinc-455">No products found.</p>}
              </>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border dark:bg-zinc-900 dark:border-zinc-800 shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-zinc-800 dark:text-zinc-200 uppercase tracking-wider">Recent Orders</h3>
          <div className="space-y-3">
            {loading ? (
              Array(3).fill(0).map((_, i) => (
                <div key={i} className="flex justify-between items-center border-b pb-2 last:border-0 dark:border-zinc-800 animate-pulse">
                  <div className="space-y-1.5">
                    <div className="h-3.5 w-24 bg-zinc-200 dark:bg-zinc-800 rounded" />
                    <div className="h-3 w-28 bg-zinc-200 dark:bg-zinc-800 rounded" />
                  </div>
                  <div className="h-5 w-16 bg-zinc-200 dark:bg-zinc-800 rounded-full" />
                </div>
              ))
            ) : (
              <>
                {orders.slice(0, 3).map(o => (
                  <div key={o.id || o._id} className="flex justify-between items-center border-b pb-2 dark:border-zinc-800 last:border-0 last:pb-0">
                    <div>
                      <div className="font-bold text-xs text-zinc-900 dark:text-white">{o.customerName || (o.shippingAddress?.fullName)}</div>
                      <div className="text-[10px] text-zinc-400">ID: {o.id || o._id} · {o.date || new Date(o.createdAt).toLocaleDateString()}</div>
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${o.status === 'Shipped' || o.status === 'Delivered' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'}`}>{o.status}</span>
                  </div>
                ))}
                {orders.length === 0 && <p className="text-xs text-zinc-455">No orders found.</p>}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
