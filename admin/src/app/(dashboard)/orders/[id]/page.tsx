'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAdmin } from '../../../AdminContext';
import { ArrowLeft, Save, ShoppingBag, MapPin, Truck, DollarSign } from 'lucide-react';
import { Section, SectionHeader, badge, statusColor } from '../../../../components/AdminUI';

export default function OrderDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { orders, loadOrders, apiAction, orderTrackingCode, setOrderTrackingCode, orderStatusSelect, setOrderStatusSelect } = useAdmin();
  
  const [order, setOrder] = useState<any>(null);
  const [localLoading, setLocalLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      setLocalLoading(true);
      if (orders.length === 0) {
        await loadOrders();
      }
      setLocalLoading(false);
    };
    init();
  }, []);

  useEffect(() => {
    if (orders.length > 0) {
      const found = orders.find((o) => o._id === id);
      if (found) {
        setOrder(found);
        setOrderStatusSelect(found.status || 'Pending');
        setOrderTrackingCode(found.trackingCode || '');
      }
    }
  }, [orders, id]);

  const saveOrderStatus = async () => {
    try {
      await apiAction('PUT', `/admin/orders/${id}/status`, {
        status: orderStatusSelect,
        trackingCode: orderTrackingCode,
      });
      alert('Order status and tracking updated!');
      await loadOrders();
    } catch (err: any) {
      alert(err.message || 'Failed to update order');
    }
  };

  if (localLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-650"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-12">
        <h3 className="text-sm font-bold text-zinc-550">Order record not found.</h3>
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
            Order #{order._id?.toUpperCase()}
          </h1>
          <p className="text-xs text-zinc-400">View transaction timeline, address details, and items.</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left: Items list & shipping address */}
        <div className="lg:col-span-2 space-y-6">
          <Section>
            <SectionHeader title="Ordered Items" desc="Products requested in this purchase transaction." />
            <div className="p-6 divide-y divide-zinc-100 dark:divide-zinc-800 space-y-4 text-xs">
              {order.items?.map((item: any, idx: number) => (
                <div key={idx} className="flex justify-between items-center py-3 first:pt-0 last:pb-0">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-zinc-50 dark:bg-zinc-950 rounded-lg flex items-center justify-center border dark:border-zinc-850 shrink-0">
                      <ShoppingBag className="h-5 w-5 text-zinc-400" />
                    </div>
                    <div>
                      <div className="font-bold text-zinc-800 dark:text-zinc-200">{item.productId?.title || 'Product Item'}</div>
                      <div className="text-[10px] text-zinc-400 font-mono mt-0.5">Qty: {item.quantity} × ${item.price?.toFixed(2)}</div>
                    </div>
                  </div>
                  <span className="font-bold text-zinc-900 dark:text-white">${((item.quantity || 1) * (item.price || 0)).toFixed(2)}</span>
                </div>
              ))}

              <div className="pt-4 space-y-2 border-t dark:border-zinc-800">
                <div className="flex justify-between text-zinc-500">
                  <span>Tax:</span>
                  <span>${(order.tax || 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-zinc-500">
                  <span>Discount:</span>
                  <span>-${(order.discount || 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-black text-sm text-zinc-900 dark:text-white pt-2 border-t border-dashed dark:border-zinc-850">
                  <span>Total Amount Paid:</span>
                  <span>${(order.totalPrice ?? 0).toFixed(2)}</span>
                </div>
              </div>
            </div>
          </Section>

          <Section>
            <SectionHeader title="Shipping Logistics Address" desc="Target destination details for courier dispatch." />
            <div className="p-6 grid md:grid-cols-2 gap-6 text-xs text-zinc-700 dark:text-zinc-300">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-zinc-400" />
                  <strong>Address Credentials:</strong>
                </div>
                <div className="bg-zinc-50 dark:bg-zinc-950 p-4 rounded-xl border dark:border-zinc-850 space-y-1">
                  <div><strong>Name:</strong> {order.shippingAddress?.fullName || '—'}</div>
                  <div><strong>Street:</strong> {order.shippingAddress?.addressLine1 || '—'}</div>
                  <div><strong>City/State:</strong> {order.shippingAddress?.city || '—'}, {order.shippingAddress?.state || '—'}</div>
                  <div><strong>Postal Code:</strong> {order.shippingAddress?.postalCode || '—'}</div>
                  <div><strong>Country:</strong> {order.shippingAddress?.country || '—'}</div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Truck className="h-4 w-4 text-zinc-400" />
                  <strong>Logistics & Delivery Slot:</strong>
                </div>
                <div className="bg-zinc-50 dark:bg-zinc-950 p-4 rounded-xl border dark:border-zinc-850 space-y-1">
                  <div><strong>Phone:</strong> {order.shippingAddress?.phone || '—'}</div>
                  <div><strong>Delivery Slot:</strong> {order.deliverySlot || 'Standard Delivery'}</div>
                  <div><strong>Tracking Code:</strong> <span className="font-mono text-indigo-600 dark:text-indigo-400 font-bold">{order.trackingCode || 'No code set'}</span></div>
                </div>
              </div>
            </div>
          </Section>
        </div>

        {/* Right: Actions */}
        <div className="space-y-6">
          <Section>
            <SectionHeader title="Manage Standing" desc="Update shipment and payment parameters." />
            <div className="p-6 space-y-4 text-xs">
              <div className="space-y-1">
                <label className="block text-[10px] text-zinc-450 font-bold uppercase mb-1">Status</label>
                <select
                  value={orderStatusSelect}
                  onChange={(e) => setOrderStatusSelect(e.target.value)}
                  className="w-full px-3 py-2 border dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-xl text-zinc-805 dark:text-white"
                >
                  <option value="Pending">Pending</option>
                  <option value="Paid">Paid</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] text-zinc-450 font-bold uppercase mb-1">Tracking Code</label>
                <input
                  type="text"
                  value={orderTrackingCode}
                  onChange={(e) => setOrderTrackingCode(e.target.value)}
                  className="w-full px-3 py-2 border dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-xl text-zinc-805 dark:text-white font-mono"
                  placeholder="Courier Tracking ID..."
                />
              </div>

              <button
                onClick={saveOrderStatus}
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl cursor-pointer border-0"
              >
                <Save className="h-4 w-4" />
                Update Order Status
              </button>
            </div>
          </Section>
        </div>
      </div>
    </div>
  );
}
