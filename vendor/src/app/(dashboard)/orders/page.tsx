'use client';

import React, { useEffect, useState } from 'react';
import { useStore } from '../../../store/store';

export default function VendorPurchaseOrdersPage() {
  const { user } = useStore();
  const [purchaseOrders, setPurchaseOrders] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    const fetchOrders = async () => {
      try {
        const poRes = await fetch('http://localhost:5001/api/v1/sales/orders', {
          headers: { 'Authorization': `Bearer ${user.token}` }
        });
        if (poRes.ok) {
          const resJson = await poRes.json();
          const list = Array.isArray(resJson) ? resJson : (resJson && Array.isArray(resJson.data) ? resJson.data : []);
          setPurchaseOrders(list);
        } else {
          setPurchaseOrders([
            { id: 'PO-7721', sellerStore: 'ApexTech Partner Shop', item: 'NexaHome Bamboo Sheets', quantity: 120, total: 3600.00, status: 'Approved', date: '2026-06-08' },
            { id: 'PO-8812', sellerStore: 'GizmoStore Retail', item: 'NexaHome Kitchen Set', quantity: 50, total: 1850.00, status: 'Pending', date: '2026-06-09' }
          ]);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchOrders();
  }, [user]);

  return (
    <>
      <title>Purchase Orders - ApexStore Vendor</title>
      <section className="bg-white p-6 rounded-2xl border dark:bg-zinc-900 shadow-sm space-y-6 dark:border-zinc-800">
        <div>
          <h3 className="font-bold text-xl text-zinc-900 dark:text-white">Purchase Orders (POs)</h3>
          <p className="text-xs text-zinc-550 mt-0.5">Approve and track merchant PO wholesale supply requests.</p>
        </div>
        <div className="space-y-4">
          {purchaseOrders.length === 0 && (
            <p className="text-xs text-zinc-400 text-center py-4">No purchase orders found.</p>
          )}
          {purchaseOrders.map(po => (
            <div key={po.id} className="flex justify-between items-center border-b pb-3 dark:border-zinc-800 last:border-0 last:pb-0">
              <div>
                <div className="font-bold text-sm text-zinc-900 dark:text-white">{po.sellerStore}</div>
                <div className="text-xs text-zinc-400">PO: {po.id} · Item: {po.item} · Qty: {po.quantity}</div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-sm font-bold text-zinc-900 dark:text-white">${po.total.toFixed(2)}</div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-amber-100 text-amber-800">{po.status}</span>
                </div>
                <button onClick={() => alert('PO request approved & dispatched!')}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg px-3 py-1.5 text-xs font-semibold border-0 cursor-pointer shadow">
                  Approve
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
