'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAdmin } from '../../AdminContext';
import { Section, SectionHeader } from '../../../components/AdminUI';

export default function AnnouncementsPage() {
  const router = useRouter();
  const { announcements, setAnnouncements } = useAdmin();
  const [newAnnTitle, setNewAnnTitle] = useState('');
  const [newAnnMsg, setNewAnnMsg] = useState('');
  const [newAnnTarget, setNewAnnTarget] = useState('Customer');

  return (
    <>
      <title>System Broadcasts & Announcements - ApexStore Admin</title>
      <Section>
        <SectionHeader title="System Broadcasts & Announcements" desc="Publish banner notifications and warnings globally targeting customers, sellers, or vendors." />
        <div className="p-6 space-y-6">
          {/* Create form */}
          <form onSubmit={(e) => {
            e.preventDefault();
            if (!newAnnTitle || !newAnnMsg) return;
            const newAnn = {
              _id: `ann-${Date.now()}`,
              title: newAnnTitle,
              message: newAnnMsg,
              targetRole: newAnnTarget,
              isActive: true,
              createdAt: new Date().toISOString()
            };
            setAnnouncements([newAnn, ...announcements]);
            setNewAnnTitle(''); setNewAnnMsg('');
            alert('Announcement broadcasted successfully!');
          }} className="bg-zinc-50 dark:bg-zinc-950/40 p-5 rounded-2xl border dark:border-zinc-850 space-y-3">
            <h4 className="font-bold text-xs uppercase text-indigo-650 dark:text-indigo-400">Draft New Broadcast Announcement</h4>
            <div className="grid sm:grid-cols-3 gap-3">
              <input type="text" required placeholder="Announcement Title" value={newAnnTitle} onChange={e=>setNewAnnTitle(e.target.value)}
                className="rounded-xl border border-zinc-200 bg-white p-2.5 text-xs focus:outline-none dark:border-zinc-800 dark:bg-zinc-900 text-zinc-900 dark:text-white sm:col-span-2" />
              <select value={newAnnTarget} onChange={e=>setNewAnnTarget(e.target.value)}
                className="rounded-xl border border-zinc-200 bg-white p-2.5 text-xs focus:outline-none dark:border-zinc-800 dark:bg-zinc-900 text-zinc-900 dark:text-white cursor-pointer">
                <option value="Customer">Audience: Customers</option>
                <option value="Seller">Audience: Sellers</option>
                <option value="Vendor">Audience: Vendors</option>
                <option value="All">Audience: All Roles</option>
              </select>
            </div>
            <textarea rows={3} required placeholder="Compose message body broadcast details..." value={newAnnMsg} onChange={e=>setNewAnnMsg(e.target.value)}
              className="w-full rounded-xl border border-zinc-200 bg-white p-2.5 text-xs focus:outline-none dark:border-zinc-800 dark:bg-zinc-900 text-zinc-900 dark:text-white resize-none" />
            <button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold px-4 py-2 shadow border-0 cursor-pointer">
              Broadcast Announcement
            </button>
          </form>

          {/* List announcements */}
          <div className="space-y-4">
            {announcements.map((ann) => (
              <div key={ann._id} className="border dark:border-zinc-800 rounded-2xl p-5 bg-zinc-50/20 dark:bg-zinc-900/30 flex justify-between items-start gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="bg-indigo-50 text-indigo-700 text-[9px] font-bold px-2 py-0.5 rounded border border-indigo-100">
                      To: {ann.targetRole}s
                    </span>
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded border ${
                      ann.isActive 
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                        : 'bg-zinc-100 text-zinc-550 border-zinc-200'
                    }`}>
                      {ann.isActive ? 'Active Broadcast' : 'Archived'}
                    </span>
                  </div>
                  <h4 
                    onClick={() => router.push(`/announcements/${ann._id}`)}
                    className="font-extrabold text-sm text-indigo-650 dark:text-indigo-400 hover:underline cursor-pointer"
                  >
                    {ann.title}
                  </h4>
                  <p className="text-xs text-zinc-650 dark:text-zinc-350">{ann.message}</p>
                  <span className="text-[10px] text-zinc-400 block">{new Date(ann.createdAt).toLocaleString()}</span>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => {
                      setAnnouncements(announcements.map(a => a._id === ann._id ? { ...a, isActive: !a.isActive } : a));
                    }}
                    className="text-indigo-600 hover:underline text-xs font-semibold bg-transparent border-0 cursor-pointer"
                  >
                    Toggle Active
                  </button>
                  <span className="text-zinc-200">|</span>
                  <button 
                    onClick={() => {
                      if (confirm('Delete this announcement?')) {
                        setAnnouncements(announcements.filter(a => a._id !== ann._id));
                      }
                    }}
                    className="text-red-500 hover:underline text-xs font-semibold bg-transparent border-0 cursor-pointer"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>
    </>
  );
}
