'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAdmin } from '../../../AdminContext';
import { ArrowLeft, User, Mail, Phone, Wallet, Award, Calendar, Shield, Save } from 'lucide-react';
import { Section, SectionHeader, badge, statusColor } from '../../../../components/AdminUI';

export default function UserDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { users, loadUsers, apiAction } = useAdmin();
  
  const [user, setUser] = useState<any>(null);
  const [localLoading, setLocalLoading] = useState(true);
  const [editStatus, setEditStatus] = useState('Active');
  const [editWallet, setEditWallet] = useState(0);

  useEffect(() => {
    const init = async () => {
      setLocalLoading(true);
      if (users.length === 0) {
        await loadUsers();
      }
      setLocalLoading(false);
    };
    init();
  }, []);

  useEffect(() => {
    if (users.length > 0) {
      const found = users.find((u) => u._id === id);
      if (found) {
        setUser(found);
        setEditStatus(found.accountStatus || 'Active');
        setEditWallet(found.walletBalance || 0);
      }
    }
  }, [users, id]);

  const saveUserChanges = async () => {
    try {
      await apiAction('PUT', `/admin/users/${id}`, {
        accountStatus: editStatus,
        walletBalance: Number(editWallet),
      });
      alert('Customer updated successfully!');
      await loadUsers();
    } catch (err: any) {
      alert(err.message || 'Failed to update user');
    }
  };

  if (localLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-650"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <h3 className="text-sm font-bold text-zinc-550">Customer record not found.</h3>
        <button onClick={() => router.push('/users')} className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-semibold">
          Back to Customers
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.push('/users')}
          className="p-2 border dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-500 rounded-xl hover:text-indigo-500 transition-colors cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div>
          <h1 className="text-xl font-black text-zinc-900 dark:text-white">
            {user.firstName} {user.lastName}
          </h1>
          <p className="text-xs text-zinc-400">Manage account standing, wallet value, and roles.</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Card: Info */}
        <div className="lg:col-span-2 space-y-6">
          <Section>
            <SectionHeader title="Profile Information" desc="Personal credentials and account statistics." />
            <div className="p-6 grid md:grid-cols-2 gap-6 text-xs text-zinc-700 dark:text-zinc-300">
              <div className="space-y-4">
                <div className="flex items-center gap-3 bg-zinc-50 dark:bg-zinc-950 p-3 rounded-xl border dark:border-zinc-850">
                  <User className="h-4 w-4 text-zinc-400" />
                  <div>
                    <span className="block text-[9px] font-bold text-zinc-450 uppercase">Display Name</span>
                    <span className="font-semibold">{user.displayName || '—'}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-zinc-50 dark:bg-zinc-950 p-3 rounded-xl border dark:border-zinc-850">
                  <Mail className="h-4 w-4 text-zinc-400" />
                  <div>
                    <span className="block text-[9px] font-bold text-zinc-450 uppercase">Email Address</span>
                    <span className="font-semibold">{user.email || '—'}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-zinc-50 dark:bg-zinc-950 p-3 rounded-xl border dark:border-zinc-850">
                  <Phone className="h-4 w-4 text-zinc-400" />
                  <div>
                    <span className="block text-[9px] font-bold text-zinc-455 uppercase">Phone Number</span>
                    <span className="font-semibold">{user.phone || '—'}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 bg-zinc-50 dark:bg-zinc-950 p-3 rounded-xl border dark:border-zinc-850">
                  <Wallet className="h-4 w-4 text-zinc-400" />
                  <div>
                    <span className="block text-[9px] font-bold text-zinc-450 uppercase">Wallet Balance</span>
                    <span className="font-bold text-zinc-900 dark:text-white">${(user.walletBalance ?? 0).toFixed(2)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-zinc-50 dark:bg-zinc-950 p-3 rounded-xl border dark:border-zinc-850">
                  <Award className="h-4 w-4 text-zinc-400" />
                  <div>
                    <span className="block text-[9px] font-bold text-zinc-450 uppercase">Reward Points</span>
                    <span className="font-bold text-indigo-600 dark:text-indigo-400">{user.rewardPoints ?? 0} pts</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-zinc-50 dark:bg-zinc-950 p-3 rounded-xl border dark:border-zinc-850">
                  <Calendar className="h-4 w-4 text-zinc-400" />
                  <div>
                    <span className="block text-[9px] font-bold text-zinc-450 uppercase">Member Since</span>
                    <span className="font-semibold">{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</span>
                  </div>
                </div>
              </div>
            </div>
          </Section>
        </div>

        {/* Right Card: Actions */}
        <div className="space-y-6">
          <Section>
            <SectionHeader title="Manage Status" desc="Change account standing and limits." />
            <div className="p-6 space-y-4 text-xs">
              <div className="space-y-1">
                <label className="block text-[10px] text-zinc-400 font-bold uppercase">Account Status</label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value)}
                  className="w-full px-3 py-2 border dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-xl text-zinc-800 dark:text-white"
                >
                  <option value="Active">Active</option>
                  <option value="Suspended">Suspended</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] text-zinc-400 font-bold uppercase">Wallet Balance ($)</label>
                <input
                  type="number"
                  value={editWallet}
                  onChange={(e) => setEditWallet(Number(e.target.value))}
                  className="w-full px-3 py-2 border dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-xl text-zinc-800 dark:text-white font-mono"
                />
              </div>

              <div className="pt-2">
                <button
                  onClick={saveUserChanges}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl cursor-pointer border-0"
                >
                  <Save className="h-4 w-4" />
                  Save Changes
                </button>
              </div>
            </div>
          </Section>
        </div>
      </div>
    </div>
  );
}
