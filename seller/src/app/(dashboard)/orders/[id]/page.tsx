'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useStore } from '../../../../store/store';
import { ArrowLeft, ShoppingCart, User, Calendar, MapPin, Truck, ChevronRight } from 'lucide-react';

export default function OrderDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useStore();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');

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
          setOrder(data.data || data);
          setStatus(data.status || 'Pending');
          setTrackingNumber(data.trackingNumber || '');
        } else {
          // Fallback static mock
          setOrder({
            _id: id,
            id: id,
            customerName: 'John Doe',
            customerEmail: 'john.doe@example.com',
            createdAt: new Date().toISOString(),
            total: 249.99,
            status: 'Paid',
            items: [
              { title: 'Samsung Phone - WHITE (M)', quantity: 1, price: 249.99 }
            ],
            shippingAddress: {
              fullName: 'John Doe',
              addressLine1: '123 Main St',
              city: 'Mumbai',
              state: 'Maharashtra',
              postalCode: '400001',
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
        body: JSON.stringify({ status, trackingNumber })
      });
      if (res.ok) {
        alert('Order status updated successfully!');
      } else {
        alert('Failed to update order status');
      }
    } catch (err) {
      console.error(err);
      alert('Error updating order');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-12">
        <h3 className="text-sm font-bold text-zinc-500">Order not found.</h3>
        <button onClick={() => router.push('/orders')} className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-lg text-xs font-semibold">
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
          className="p-2 border dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-500 rounded-xl hover:text-emerald-500 transition-colors cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div>
          <h1 className="text-xl font-black text-zinc-900 dark:text-white">
            Order Detail: {order.id || order._id}
          </h1>
          <p className="text-xs text-zinc-400">Date: {new Date(order.createdAt).toLocaleString()}</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border dark:border-zinc-800 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-zinc-800 dark:text-zinc-200 uppercase tracking-wider flex items-center gap-2">
              <ShoppingCart className="h-4 w-4 text-emerald-500" />
              Order Items
            </h3>
            <div className="space-y-3">
              {(order.items || []).map((item: any, idx: number) => (
                <div key={idx} className="flex justify-between items-center border-b pb-3 dark:border-zinc-800 last:border-0 last:pb-0">
                  <div>
                    <div className="font-bold text-xs text-zinc-900 dark:text-white">{item.title}</div>
                    <div className="text-[10px] text-zinc-400">Quantity: {item.quantity} · Price: ${item.price?.toFixed(2)}</div>
                  </div>
                  <div className="text-xs font-bold text-zinc-900 dark:text-white">
                    ${(item.quantity * item.price)?.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
            <div className="pt-4 border-t dark:border-zinc-800 flex justify-between items-center text-sm font-bold text-zinc-900 dark:text-white">
              <span>Total Earnings (Estimated)</span>
              <span>${order.total?.toFixed(2)}</span>
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border dark:border-zinc-800 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-zinc-800 dark:text-zinc-200 uppercase tracking-wider flex items-center gap-2">
              <User className="h-4 w-4 text-emerald-500" />
              Customer Information
            </h3>
            <div className="grid md:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="block text-[10px] text-zinc-400 font-bold uppercase">Buyer Name</span>
                <span className="font-semibold text-zinc-900 dark:text-white">{order.customerName || order.shippingAddress?.fullName || 'N/A'}</span>
              </div>
              <div>
                <span className="block text-[10px] text-zinc-400 font-bold uppercase">Buyer Email</span>
                <span className="font-semibold text-zinc-900 dark:text-white">{order.customerEmail || 'N/A'}</span>
              </div>
            </div>
          </div>

          {order.shippingAddress && (
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border dark:border-zinc-800 shadow-sm space-y-4">
              <h3 className="font-bold text-sm text-zinc-800 dark:text-zinc-200 uppercase tracking-wider flex items-center gap-2">
                <MapPin className="h-4 w-4 text-emerald-500" />
                Shipping Destination
              </h3>
              <div className="text-xs text-zinc-700 dark:text-zinc-300 space-y-1">
                <p className="font-semibold">{order.shippingAddress.fullName}</p>
                <p>{order.shippingAddress.addressLine1}</p>
                <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}</p>
                <p>{order.shippingAddress.country}</p>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border dark:border-zinc-800 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-zinc-800 dark:text-zinc-200 uppercase tracking-wider flex items-center gap-2">
              <Truck className="h-4 w-4 text-emerald-500" />
              Shipment Status
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] text-zinc-400 font-bold uppercase mb-1">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-3 py-2 border dark:border-zinc-800 bg-white dark:bg-zinc-950 rounded-lg text-xs font-semibold text-zinc-800 dark:text-white"
                >
                  <option value="Pending">Pending</option>
                  <option value="Paid">Paid</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] text-zinc-400 font-bold uppercase mb-1">Tracking Number</label>
                <input
                  type="text"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="e.g. FedEx-9281982"
                  className="w-full px-3 py-2 border dark:border-zinc-800 bg-white dark:bg-zinc-950 rounded-lg text-xs text-zinc-800 dark:text-white"
                />
              </div>

              <button
                onClick={updateStatus}
                className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow cursor-pointer border-0 text-xs"
              >
                Update Fulfillment
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
