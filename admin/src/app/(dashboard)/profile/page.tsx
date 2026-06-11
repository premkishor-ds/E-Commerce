'use client';

import React, { useEffect } from 'react';
import { useAdmin } from '../../AdminContext';
import { ToggleRight } from 'lucide-react';

export default function ProfilePage() {
  const { adminEmail, adminSessions, apiAction, loadAdminProfile } = useAdmin();

  useEffect(() => {
    loadAdminProfile();
  }, []);

  return (
    <>
      <title>Admin Profile Management - ApexStore Admin</title>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-black text-zinc-900 dark:text-white">Admin Profile Management</h1>
          <p className="text-sm text-zinc-500 mt-0.5">Manage credentials, connected devices, and 2FA security.</p>
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-2xl border dark:border-zinc-800 overflow-hidden shadow-sm">
          <div className="h-32 bg-gradient-to-r from-indigo-500 to-purple-600 relative"></div>
          <div className="px-6 pb-6 relative flex flex-col md:flex-row justify-between items-start gap-4">
            <div className="flex items-end gap-4 -mt-10">
              <div className="h-20 w-20 rounded-2xl bg-zinc-200 border-4 border-white dark:border-zinc-900 flex items-center justify-center text-zinc-500 text-xl font-bold">A</div>
              <div>
                <h2 className="text-lg font-bold text-zinc-900 dark:text-white">Platform Administrator</h2>
                <p className="text-xs text-zinc-400">Employee ID: EMP-2026-9872 · Joined Jan 2026</p>
              </div>
            </div>
            <div className="pt-4 flex gap-2">
              <button className="px-3.5 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-semibold border-0 cursor-pointer">Upload Photo</button>
              <button className="px-3.5 py-1.5 border dark:border-zinc-800 text-zinc-600 dark:text-zinc-300 rounded-lg text-xs font-semibold bg-white dark:bg-zinc-900 cursor-pointer">Change Cover</button>
            </div>
          </div>
        </div>

        {/* Profile details & Connected devices */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border dark:border-zinc-800 p-6 space-y-4 md:col-span-2">
            <h3 className="font-bold text-sm text-zinc-905 dark:text-white border-b pb-2 dark:border-zinc-800">Account Credentials</h3>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block mb-1">First Name</label>
                <input className="w-full rounded-lg border dark:border-zinc-800 p-2 focus:outline-none focus:border-indigo-500 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white" defaultValue="Platform" />
              </div>
              <div>
                <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block mb-1">Last Name</label>
                <input className="w-full rounded-lg border dark:border-zinc-800 p-2 focus:outline-none focus:border-indigo-500 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white" defaultValue="Administrator" />
              </div>
              <div>
                <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block mb-1">Email</label>
                <input disabled className="w-full rounded-lg border dark:border-zinc-800 p-2 bg-zinc-50 dark:bg-zinc-950 text-zinc-400" value={adminEmail} />
              </div>
              <div>
                <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block mb-1">Department</label>
                <input disabled className="w-full rounded-lg border dark:border-zinc-800 p-2 bg-zinc-50 dark:bg-zinc-950 text-zinc-400" value="Platform Administration" />
              </div>
            </div>
            <button className="px-3.5 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-semibold border-0 cursor-pointer">Save Personal Details</button>
          </div>

          <div className="bg-white dark:bg-zinc-900 rounded-2xl border dark:border-zinc-800 p-6 space-y-4">
            <h3 className="font-bold text-sm text-zinc-900 dark:text-white border-b pb-2 dark:border-zinc-800">MFA & Security</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-xs font-bold text-zinc-800 dark:text-zinc-200">Two-Factor Authentication</div>
                  <div className="text-[10px] text-zinc-400">Code check on panel logins</div>
                </div>
                <button className="text-emerald-500 bg-transparent border-0 cursor-pointer"><ToggleRight className="h-8 w-8" /></button>
              </div>
              <div className="border-t dark:border-zinc-800 pt-3">
                <div className="text-xs font-bold text-zinc-855 dark:text-zinc-200 mb-2">Connected Devices</div>
                <div className="space-y-2">
                  {adminSessions.map((s: any) => (
                    <div key={s._id} className="flex justify-between items-center text-[10px] p-2 border dark:border-zinc-800 rounded bg-zinc-50/20">
                      <div>
                        <div className="font-bold text-zinc-800 dark:text-zinc-200">{s.browser} · {s.os}</div>
                        <div className="text-zinc-455">{s.ipAddress}</div>
                      </div>
                      <button onClick={async () => { await apiAction('DELETE', `/admin/profile/sessions/${s._id}`); loadAdminProfile(); }}
                        className="text-red-500 font-semibold hover:underline bg-transparent border-0 cursor-pointer">Revoke</button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
