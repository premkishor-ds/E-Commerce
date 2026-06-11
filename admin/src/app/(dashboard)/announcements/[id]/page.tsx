'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAdmin } from '../../../AdminContext';
import { ArrowLeft, Save, Trash2, Megaphone, Bell } from 'lucide-react';
import { Section, SectionHeader, badge } from '../../../../components/AdminUI';

export default function AnnouncementDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { announcements, setAnnouncements } = useAdmin();
  
  const [ann, setAnn] = useState<any>(null);
  const [localLoading, setLocalLoading] = useState(true);

  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [targetRole, setTargetRole] = useState('Customer');
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    setLocalLoading(true);
    const found = announcements.find((a) => a._id === id);
    if (found) {
      setAnn(found);
      setTitle(found.title || '');
      setMessage(found.message || '');
      setTargetRole(found.targetRole || 'Customer');
      setIsActive(found.isActive ?? true);
    }
    setLocalLoading(false);
  }, [announcements, id]);

  const saveAnnChanges = (e: React.FormEvent) => {
    e.preventDefault();
    setAnnouncements(announcements.map((a) =>
      a._id === id
        ? { ...a, title, message, targetRole, isActive }
        : a
    ));
    alert('Announcement saved successfully!');
  };

  const removeAnn = () => {
    if (confirm('Delete this announcement?')) {
      setAnnouncements(announcements.filter((a) => a._id !== id));
      alert('Announcement deleted!');
      router.push('/announcements');
    }
  };

  if (localLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-650"></div>
      </div>
    );
  }

  if (!ann) {
    return (
      <div className="text-center py-12">
        <h3 className="text-sm font-bold text-zinc-550">Announcement not found.</h3>
        <button onClick={() => router.push('/announcements')} className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-semibold">
          Back to Announcements
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.push('/announcements')}
          className="p-2 border dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-500 rounded-xl hover:text-indigo-500 transition-colors cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div>
          <h1 className="text-xl font-black text-zinc-900 dark:text-white">
            {ann.title}
          </h1>
          <p className="text-xs text-zinc-400">Broadcast Target: {ann.targetRole}s</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column: Form */}
        <div className="lg:col-span-2 space-y-6">
          <Section>
            <SectionHeader title="Broadcast Settings" desc="Compose title, message body, and target roles." />
            <form onSubmit={saveAnnChanges} className="p-6 space-y-4 text-xs text-left">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-[10px] text-zinc-455 font-bold uppercase mb-1">Title</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3 py-2 border dark:border-zinc-800 bg-white dark:bg-zinc-950 rounded-lg text-zinc-805 dark:text-white"
                  />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-[10px] text-zinc-455 font-bold uppercase mb-1">Target Audience</label>
                  <select
                    value={targetRole}
                    onChange={(e) => setTargetRole(e.target.value)}
                    className="w-full px-3 py-2 border dark:border-zinc-800 bg-white dark:bg-zinc-950 rounded-lg text-zinc-850 dark:text-white"
                  >
                    <option value="Customer">Customers</option>
                    <option value="Seller">Sellers</option>
                    <option value="Vendor">Vendors</option>
                    <option value="All">All Roles</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] text-zinc-455 font-bold uppercase mb-1">Message Body</label>
                <textarea
                  required
                  rows={6}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-3 py-2 border dark:border-zinc-800 bg-white dark:bg-zinc-950 rounded-lg text-zinc-805 dark:text-white"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow cursor-pointer border-0"
                >
                  <Save className="h-4 w-4 mr-2 inline" />
                  Save Changes
                </button>
              </div>
            </form>
          </Section>
        </div>

        {/* Right Column: Actions */}
        <div className="space-y-6">
          <Section>
            <SectionHeader title="Status & Control" desc="Enable or disable broadcast banners." />
            <div className="p-6 space-y-4 text-xs">
              <div className="space-y-2">
                <span className="block text-[10px] text-zinc-400 font-bold uppercase">Broadcast Status</span>
                <button
                  onClick={() => setIsActive(!isActive)}
                  className={`w-full py-2.5 rounded-xl text-xs font-bold shadow transition-all border-0 cursor-pointer ${
                    isActive
                      ? 'bg-emerald-600 text-white hover:bg-emerald-500'
                      : 'bg-zinc-200 text-zinc-700 hover:bg-zinc-300 dark:bg-zinc-850 dark:text-zinc-300 dark:hover:bg-zinc-700'
                  }`}
                >
                  {isActive ? 'Active Broadcast' : 'Archived / Inactive'}
                </button>
              </div>

              <div className="pt-2 border-t dark:border-zinc-800">
                <button
                  onClick={removeAnn}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-red-650 hover:bg-red-500 text-white font-bold rounded-xl cursor-pointer border-0"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete Broadcast
                </button>
              </div>
            </div>
          </Section>
        </div>
      </div>
    </div>
  );
}
