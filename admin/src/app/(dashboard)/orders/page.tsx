'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAdmin } from '../../AdminContext';
import { RefreshCw, X } from 'lucide-react';
import {
  Section, SectionHeader, FilterBar, SearchBar, Sel, ApplyBtn, Table, Thead, renderSortableHeader, Pagination, Loading, TableSkeleton, badge, statusColor
} from '../../../components/AdminUI';

export default function OrdersPage() {
  const router = useRouter();
  const {
    loadOrders, orderSearch, setOrderSearch, orderStatus, setOrderStatus,
    orderSortField, setOrderSortField, orderSortOrder, setOrderSortOrder, orderPage, setOrderPage,
    paginatedOrders, totalOrderPages, selectedOrder, setSelectedOrder, apiAction,
    orderTrackingCode, setOrderTrackingCode, orderStatusSelect, setOrderStatusSelect
  } = useAdmin();

  const [localLoading, setLocalLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const init = async () => {
      setLocalLoading(true);
      await loadOrders();
      if (active) setLocalLoading(false);
    };
    init();
    return () => { active = false; };
  }, []);

  const handleApply = async () => {
    setLocalLoading(true);
    await loadOrders();
    setLocalLoading(false);
  };

  const saveOrderStatus = async () => {
    if (!selectedOrder) return;
    try {
      await apiAction('PUT', `/admin/orders/${selectedOrder._id}/status`, {
        status: orderStatusSelect,
        trackingCode: orderTrackingCode
      });
      alert('Order status and tracking updated!');
      setSelectedOrder(null);
      setLocalLoading(true);
      await loadOrders();
      setLocalLoading(false);
    } catch (err: any) {
      alert(err.message || 'Failed to update order');
    }
  };

  return (
    <Section>
      <SectionHeader 
        title="Orders Workspace" 
        desc="Audit platform sales orders, logistics, and tracking status updates." 
        right={
          <button onClick={handleApply} className="p-2 rounded-lg border dark:border-zinc-800 text-zinc-400 hover:text-indigo-500 hover:bg-zinc-50 dark:hover:bg-zinc-800 bg-white dark:bg-zinc-900 cursor-pointer">
            <RefreshCw className="h-4 w-4" />
          </button>
        }
      />

      <FilterBar>
        <SearchBar value={orderSearch} onChange={setOrderSearch} placeholder="Search orders..." />
        <Sel 
          value={orderStatus} 
          onChange={setOrderStatus} 
          placeholder="All Statuses" 
          options={[
            { value: 'Pending', label: 'Pending' },
            { value: 'Paid', label: 'Paid' },
            { value: 'Shipped', label: 'Shipped' },
            { value: 'Delivered', label: 'Delivered' },
            { value: 'Cancelled', label: 'Cancelled' }
          ]} 
        />
        <ApplyBtn onClick={handleApply} />
      </FilterBar>

      <Table>
        <Thead>
          <tr>
            {renderSortableHeader('Order ID', '_id', orderSortField, orderSortOrder, (f, o) => { setOrderSortField(f); setOrderSortOrder(o); })}
            {renderSortableHeader('Status', 'status', orderSortField, orderSortOrder, (f, o) => { setOrderSortField(f); setOrderSortOrder(o); })}
            {renderSortableHeader('Total Price', 'totalPrice', orderSortField, orderSortOrder, (f, o) => { setOrderSortField(f); setOrderSortOrder(o); })}
            {renderSortableHeader('Tracking Code', 'trackingCode', orderSortField, orderSortOrder, (f, o) => { setOrderSortField(f); setOrderSortOrder(o); })}
            {renderSortableHeader('Date', 'createdAt', orderSortField, orderSortOrder, (f, o) => { setOrderSortField(f); setOrderSortOrder(o); })}
            <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-zinc-500 text-right">Quick Action</th>
          </tr>
        </Thead>
        {localLoading ? (
          <TableSkeleton cols={6} />
        ) : (
          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {paginatedOrders.map((o: any) => (
              <tr key={o._id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40 text-xs">
                <td 
                  onClick={() => router.push(`/orders/${o._id}`)} 
                  className="px-4 py-3 font-mono font-bold text-indigo-650 dark:text-indigo-400 hover:underline cursor-pointer"
                >
                  #{o._id?.toString().slice(-8).toUpperCase()}
                </td>
                <td className="px-4 py-3">{badge(statusColor(o.status), o.status)}</td>
                <td className="px-4 py-3 text-sm font-semibold text-zinc-900 dark:text-white">
                  ${(o.totalPrice ?? 0).toFixed(2)}
                </td>
                <td className="px-4 py-3 text-zinc-400 font-mono">{o.trackingCode || '—'}</td>
                <td className="px-4 py-3 text-zinc-400">
                  {o.createdAt ? new Date(o.createdAt).toLocaleString() : '—'}
                </td>
                <td className="px-4 py-3 text-right">
                  {o.status === 'Pending' || o.status === 'Paid' ? (
                    <button 
                      onClick={async () => {
                        try {
                          await apiAction('PUT', `/admin/orders/${o._id}/status`, { status: 'Shipped' });
                          handleApply();
                        } catch (err: any) {
                          alert(err.message);
                        }
                      }}
                      className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded font-bold cursor-pointer border-0 text-[10px]"
                    >
                      Mark Shipped
                    </button>
                  ) : '—'}
                </td>
              </tr>
            ))}
            {paginatedOrders.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-8 text-zinc-400">No orders found.</td>
              </tr>
            )}
          </tbody>
        )}
      </Table>
      {!localLoading && <Pagination currentPage={orderPage} totalPages={totalOrderPages} onPageChange={setOrderPage} />}

      {/* Selected Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border dark:border-zinc-800 shadow-2xl w-full max-w-2xl p-6 relative">
            <button onClick={() => setSelectedOrder(null)} className="absolute top-4 right-4 p-1 rounded-full text-zinc-405 hover:bg-zinc-100 dark:hover:bg-zinc-850 bg-transparent border-0 cursor-pointer">
              <X className="h-5 w-5" />
            </button>
            <div className="text-left border-b pb-3 dark:border-zinc-800">
              <h2 className="text-lg font-black text-zinc-900 dark:text-white">Order Details: #{selectedOrder._id?.toUpperCase()}</h2>
              <p className="text-xs text-zinc-500">Manage transaction status, logistics details, and customer shipping address.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 text-xs mt-4">
              {/* Left column: tracking update & shipping */}
              <div className="space-y-4">
                <div className="bg-zinc-50 dark:bg-zinc-950 p-4 rounded-xl border dark:border-zinc-850 space-y-3">
                  <span className="block text-[10px] text-zinc-450 font-bold uppercase">Logistics Standing</span>
                  <div className="space-y-2">
                    <div>
                      <label className="block text-[9px] text-zinc-400 font-semibold mb-1">Status</label>
                      <select 
                        value={orderStatusSelect} 
                        onChange={e => setOrderStatusSelect(e.target.value)}
                        className="w-full px-2.5 py-1.5 border dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-lg text-xs"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Paid">Paid</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[9px] text-zinc-400 font-semibold mb-1">Tracking Code</label>
                      <input 
                        type="text" 
                        value={orderTrackingCode} 
                        onChange={e => setOrderTrackingCode(e.target.value)}
                        className="w-full px-2.5 py-1.5 border dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-lg text-xs"
                        placeholder="Logistics Code..."
                      />
                    </div>
                  </div>
                  <button 
                    onClick={saveOrderStatus}
                    className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg text-center cursor-pointer border-0"
                  >
                    Save Status & Tracking
                  </button>
                </div>

                <div className="space-y-2">
                  <h4 className="font-bold text-[10px] text-zinc-400 uppercase tracking-wider">Shipping Address</h4>
                  <div className="bg-zinc-50 dark:bg-zinc-950 p-4 rounded-xl border dark:border-zinc-850 space-y-1 text-zinc-700 dark:text-zinc-300">
                    <div><strong>Name:</strong> {selectedOrder.shippingAddress?.fullName || '—'}</div>
                    <div><strong>Street:</strong> {selectedOrder.shippingAddress?.addressLine1 || '—'}</div>
                    <div><strong>City/State:</strong> {selectedOrder.shippingAddress?.city || '—'}, {selectedOrder.shippingAddress?.state || '—'}</div>
                    <div><strong>Postal Code:</strong> {selectedOrder.shippingAddress?.postalCode || '—'}</div>
                    <div><strong>Country:</strong> {selectedOrder.shippingAddress?.country || '—'}</div>
                    <div><strong>Phone:</strong> {selectedOrder.shippingAddress?.phone || '—'}</div>
                  </div>
                </div>
              </div>

              {/* Right column: Items list */}
              <div className="space-y-4">
                <h4 className="font-bold text-[10px] text-zinc-400 uppercase tracking-wider">Ordered Items</h4>
                <div className="divide-y divide-zinc-100 dark:divide-zinc-800 bg-zinc-50 dark:bg-zinc-950 p-4 rounded-xl border dark:border-zinc-850 space-y-3">
                  {selectedOrder.items?.map((item: any, idx: number) => (
                    <div key={idx} className="flex justify-between items-center py-2 text-xs first:pt-0 last:pb-0">
                      <div>
                        <div className="font-bold text-zinc-805 dark:text-zinc-200">{item.productId?.title || 'Product Item'}</div>
                        <div className="text-[10px] text-zinc-400 font-mono">Qty: {item.quantity} × ${item.price?.toFixed(2)}</div>
                      </div>
                      <span className="font-bold text-zinc-900 dark:text-white">${((item.quantity || 1) * (item.price || 0)).toFixed(2)}</span>
                    </div>
                  ))}
                  
                  <div className="pt-3 border-t dark:border-zinc-800 space-y-1.5 text-xs">
                    <div className="flex justify-between text-zinc-500">
                      <span>Tax:</span>
                      <span>${(selectedOrder.tax || 0).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-zinc-500">
                      <span>Discount:</span>
                      <span>-${(selectedOrder.discount || 0).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-black text-sm text-zinc-900 dark:text-white pt-1">
                      <span>Total Price:</span>
                      <span>${(selectedOrder.totalPrice ?? 0).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Section>
  );
}
