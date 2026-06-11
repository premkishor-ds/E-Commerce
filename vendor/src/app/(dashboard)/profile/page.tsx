'use client';

import React, { useEffect, useState } from 'react';
import { useStore } from '../../../store/store';

export default function VendorProfilePage() {
  const { user } = useStore();
  const [companyLegalName, setCompanyLegalName] = useState('NexaHome Brands Inc.');
  const [businessPhone, setBusinessPhone] = useState('+12025550156');
  const [bankName, setBankName] = useState('Bank of America');
  const [bankAccount, setBankAccount] = useState('•••• •••• 9918');
  const [routingCode, setRoutingCode] = useState('021000022');
  const [mfaEnabled, setMfaEnabled] = useState(false);
  const [commissionRate, setCommissionRate] = useState(0);

  useEffect(() => {
    if (!user) return;
    const fetchProfileData = async () => {
      try {
        const [profileRes, analyticsRes] = await Promise.all([
          fetch('http://localhost:5001/api/v1/profile/me', {
            headers: { 'Authorization': `Bearer ${user.token}` }
          }),
          fetch('http://localhost:5001/api/v1/catalog/vendor/analytics', {
            headers: { 'Authorization': `Bearer ${user.token}` }
          })
        ]);

        if (profileRes.ok) {
          const prof = await profileRes.json();
          setCompanyLegalName(prof.shopName || 'NexaHome Brands Inc.');
        }
        if (analyticsRes.ok) {
          const a = await analyticsRes.json();
          setCommissionRate(a.commissionRate || 10);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchProfileData();
  }, [user]);

  if (!user) return null;

  return (
    <>
      <title>Profile Settings - ApexStore Vendor</title>
      <section className="bg-white p-6 rounded-2xl border dark:bg-zinc-900 shadow-sm space-y-6 dark:border-zinc-800">
        <div>
          <h3 className="font-bold text-xl text-zinc-900 dark:text-white">Vendor Profile Settings</h3>
          <p className="text-xs text-zinc-550 mt-0.5">Configure company profile, bank routing details, and auth settings.</p>
        </div>
        <div className="grid sm:grid-cols-2 gap-6 border-b pb-6 dark:border-zinc-800">
          <div className="space-y-1">
            <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block">Company Legal Name</label>
            <input type="text" value={companyLegalName} onChange={e => setCompanyLegalName(e.target.value)}
              className="w-full rounded-xl border border-zinc-200 bg-white p-3 text-xs focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 text-zinc-900 dark:text-white" />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block">Primary Business Phone</label>
            <input type="text" value={businessPhone} onChange={e => setBusinessPhone(e.target.value)}
              className="w-full rounded-xl border border-zinc-200 bg-white p-3 text-xs focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 text-zinc-900 dark:text-white" />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block">Account Email</label>
            <input type="text" disabled value={user.email}
              className="w-full rounded-xl border border-zinc-200 bg-zinc-50 p-3 text-xs focus:outline-none dark:border-zinc-800 dark:bg-zinc-955 text-zinc-450" />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block">Commission Rate</label>
            <input type="text" disabled value={`${commissionRate}%`}
              className="w-full rounded-xl border border-zinc-200 bg-zinc-50 p-3 text-xs focus:outline-none dark:border-zinc-800 dark:bg-zinc-955 text-zinc-450" />
          </div>
        </div>
        <div className="border-b pb-6 dark:border-zinc-800 space-y-4">
          <h4 className="font-bold text-sm text-zinc-900 dark:text-white">Direct Deposit Bank Account</h4>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { label: 'Bank Name', value: bankName, setter: setBankName },
              { label: 'Account Number', value: bankAccount, setter: setBankAccount },
              { label: 'Routing Transit Code', value: routingCode, setter: setRoutingCode }
            ].map(f => (
              <div key={f.label} className="space-y-1">
                <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block">{f.label}</label>
                <input type="text" value={f.value} onChange={e => f.setter(e.target.value)}
                  className="w-full rounded-xl border border-zinc-200 bg-white p-3 text-xs focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 text-zinc-900 dark:text-white" />
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-4 pt-2">
          <h4 className="font-bold text-sm text-zinc-900 dark:text-white">Partner Security</h4>
          <div className="flex justify-between items-center bg-zinc-55 dark:bg-zinc-950/40 p-4 rounded-xl border dark:border-zinc-800">
            <div>
              <h5 className="font-bold text-xs">Two-Factor Authentication (MFA)</h5>
              <p className="text-[10px] text-zinc-400">Force OTP verification on console sign ins.</p>
            </div>
            <button onClick={() => { setMfaEnabled(!mfaEnabled); alert('2FA status updated!'); }}
              className={`rounded-xl px-4 py-2 text-xs font-bold shadow cursor-pointer transition-all border-0 ${mfaEnabled ? 'bg-red-500 text-white' : 'bg-indigo-600 text-white'}`}>
              {mfaEnabled ? 'Disable 2FA' : 'Enable 2FA'}
            </button>
          </div>
        </div>
        <button onClick={() => { alert('Vendor settings saved!'); }}
          className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl px-4 py-2.5 text-xs font-semibold shadow cursor-pointer border-0">
          Save Settings
        </button>
      </section>
    </>
  );
}
