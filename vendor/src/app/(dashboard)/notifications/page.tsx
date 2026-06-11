'use client';

import React, { useEffect, useState } from 'react';
import { useStore } from '../../../store/store';
import { Bell } from 'lucide-react';

export default function VendorNotificationsPage() {
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
            { id: '1', title: 'New PO Request Received', message: 'GizmoStore Retail requested a wholesale PO-8812 for NexaHome Kitchen Set.', isRead: false },
            { id: '2', title: 'Settlement Account Linked', message: 'Your direct deposit routing numbers were verified successfully.', isRead: true }
          ]);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchNotifications();
  }, [user]);

  return (
    <>
      <title>Notifications - ApexStore Vendor</title>
      <section className="bg-white p-6 rounded-2xl border dark:bg-zinc-900 shadow-sm space-y-6 dark:border-zinc-800">
        <div>
          <h3 className="font-bold text-xl text-zinc-900 dark:text-white">Partner Notifications</h3>
          <p className="text-xs text-zinc-550 mt-0.5">Latest system logs, incoming POs, and contract modifications.</p>
        </div>
        <div className="space-y-3">
          {notifications.length === 0 && (
            <p className="text-xs text-zinc-400 text-center py-4">No notifications yet.</p>
          )}
          {notifications.map(n => (
            <div key={n.id} className={`p-4 rounded-xl border flex gap-3 ${n.isRead ? 'border-zinc-100 bg-zinc-50/50 dark:border-zinc-800/85 dark:bg-zinc-900/40' : 'border-indigo-200 bg-indigo-50/20 dark:border-indigo-900/30'}`}>
              <Bell className={`h-5 w-5 shrink-0 ${n.isRead ? 'text-zinc-400' : 'text-indigo-500'}`} />
              <div>
                <h4 className="font-bold text-xs text-zinc-900 dark:text-white">{n.title}</h4>
                <p className="text-[11px] text-zinc-655 dark:text-zinc-400 mt-0.5">{n.message}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
