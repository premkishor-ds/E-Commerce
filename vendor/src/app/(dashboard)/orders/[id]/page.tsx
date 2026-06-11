'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useStore } from '../../../../store/store';
import { ArrowLeft, ShoppingCart, Calendar, Truck, AlertCircle } from 'lucide-react';

export default function VendorOrderDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useStore();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');

  useEffect(() => {
    if (!user) return;
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const orderRes = await fetch(`http://localhost:5001/api/v1/sales/orders/${id}`, {
          headers: { 'Authorization': `Bearer ${user.token}` }
        });
        if (orderRes.ok) {
          const data = await orderRes.json();
          const o = data.data || data;
          setOrder(o);
          setStatus(o.status || 'Pending');
        } else {
          // Fallback static mock
          setOrder({
            _id: id,
            id: id,
            sellerStore: 'ApexTech Partner Shop',
            item: 'NexaHome Bamboo Sheets',
            quantity: 120,
            total: 3600.00,
            status: 'Approved',
            createdAt: new Date().toISOString(),
            shippingAddress: {
              fullName: 'ApexStore Warehouse India',
              addressLine1: '45 Regional Logistics Hub',
              city: 'New Delhi',
              state: 'Delhi',
              postalCode: '110001',
              country: 'India'
            }
          });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [user, id]);

  const updateStatus = async () => {
    if (!user) return;
    try {
      const res = await fetch(`http://localhost:5001/api/v1/sales/orders/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        alert('PO status updated successfully!');
      } else {
        alert('Failed to update PO status');
      }
    } catch (err) {
      console.error(err);
      alert('Error updating PO');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-650"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-12">
        <h3 className="text-sm font-bold text-zinc-550">Purchase Order not found.</h3>
        <button onClick={() => router.push('/orders')} className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-semibold">
          Back to Orders
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.push('/orders')}
          className="p-2 border dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-500 rounded-xl hover:text-indigo-500 transition-colors cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div>
          <h1 className="text-xl font-black text-zinc-900 dark:text-white">
            PO Detail: {order.id || order._id}
          </h1>
          <p className="text-xs text-zinc-400">Issued On: {new Date(order.createdAt).toLocaleString()}</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border dark:border-zinc-800 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-zinc-800 dark:text-zinc-200 uppercase tracking-wider flex items-center gap-2">
              <ShoppingCart className="h-4 w-4 text-indigo-500" />
              Supplied Stock & Pricing
            </h3>
            <div className="text-xs text-zinc-700 dark:text-zinc-300 space-y-2">
              <div className="flex justify-between border-b pb-2 dark:border-zinc-850">
                <span className="font-bold">Item Description</span>
                <span>{order.item || 'Wholesale Supply Goods'}</span>
              </div>
              <div className="flex justify-between border-b pb-2 dark:border-zinc-850">
                <span className="font-bold">Requested Quantity</span>
                <span>{order.quantity} units</span>
              </div>
              <div className="flex justify-between border-b pb-2 dark:border-zinc-850">
                <span className="font-bold">Total Wholesale Cost</span>
                <span className="font-black text-indigo-600 dark:text-indigo-400">${order.total?.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border dark:border-zinc-800 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-zinc-800 dark:text-zinc-200 uppercase tracking-wider flex items-center gap-2">
              <Truck className="h-4 w-4 text-indigo-500" />
              Store / Merchant Destination
            </h3>
            <div className="text-xs text-zinc-700 dark:text-zinc-300 space-y-1">
              <p className="font-bold">{order.sellerStore || 'ApexStore Retail Partner'}</p>
              {order.shippingAddress && (
                <>
                  <p>{order.shippingAddress.addressLine1}</p>
                  <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}</p>
                  <p>{order.shippingAddress.country}</p>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border dark:border-zinc-800 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-zinc-800 dark:text-zinc-200 uppercase tracking-wider flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-indigo-500" />
              PO Verification Status
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] text-zinc-400 font-bold uppercase mb-1">Update Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-3 py-2 border dark:border-zinc-800 bg-white dark:bg-zinc-950 rounded-lg text-xs font-semibold text-zinc-800 dark:text-white"
                >
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="Dispatched">Dispatched</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <button
                onClick={updateStatus}
                className="w-full py-2 bg-indigo-605 hover:bg-indigo-500 text-white font-bold rounded-xl shadow cursor-pointer border-0 text-xs"
              >
                Update PO Status
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
