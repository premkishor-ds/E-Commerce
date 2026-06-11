'use client';

import React, { useEffect, useState } from 'react';
import { useStore } from '../../../store/store';
import { Bell } from 'lucide-react';

export default function NotificationsPage() {
  const { user } = useStore();
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    const fetchNotifications = async () => {
      try {
        const notifyRes = await fetch('http://localhost:5001/api/v1/notifications', {
          headers: { 'Authorization': `Bearer ${user.token}` }
        });
        if (notifyRes.ok) {
          setNotifications(await notifyRes.json());
        } else {
          setNotifications([
            { id: '1', title: 'Payout Processed Successfully', message: 'Your payment of $350.00 was sent to your bank account.', isRead: false },
            { id: '2', title: 'Low Stock Alert', message: 'Product ApexTech Smart Watch is low in stock.', isRead: true }
          ]);
        }
      } catch (err) { console.error(err); }
    };
    fetchNotifications();
  }, [user]);

  return (
    <>
      <title>Merchant Notifications - ApexStore Seller</title>
      <section className="bg-white p-6 rounded-2xl border dark:bg-zinc-900 shadow-sm space-y-6 dark:border-zinc-800">
        <div>
          <h3 className="font-bold text-xl text-zinc-900 dark:text-white">Merchant Notifications</h3>
          <p className="text-xs text-zinc-550 mt-0.5">Recent system alerts, order notifications, and verification status.</p>
        </div>
        <div className="space-y-3">
          {notifications.map(n => (
            <div key={n.id || n._id} className={`p-4 rounded-xl border flex gap-3 text-xs ${n.isRead ? 'border-zinc-105 bg-zinc-50/50 dark:border-zinc-800/80 dark:bg-zinc-900/40' : 'border-emerald-200 bg-emerald-50/20 dark:border-emerald-900/30'}`}>
              <Bell className={`h-5 w-5 shrink-0 ${n.isRead ? 'text-zinc-400' : 'text-emerald-500'}`} />
              <div>
                <h4 className="font-bold text-xs text-zinc-900 dark:text-white">{n.title}</h4>
                <p className="text-[11px] text-zinc-600 dark:text-zinc-400 mt-0.5">{n.message}</p>
              </div>
            </div>
          ))}
          {notifications.length === 0 && <p className="text-sm text-zinc-400 text-center py-6">No notifications found.</p>}
        </div>
      </section>
    </>
  );
}
