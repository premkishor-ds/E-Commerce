'use client';

import React, { useEffect, useState } from 'react';
import { useStore } from '../../../store/store';

export default function ProfilePage() {
  const { user } = useStore();
  const [shopName, setShopName] = useState('ApexTech Partner Shop');
  const [legalName, setLegalName] = useState('ApexTech Global LLC');
  const [bizPhone, setBizPhone] = useState('+12025550189');
  const [bankName, setBankName] = useState('Chase Bank');
  const [bankAccount, setBankAccount] = useState('•••• •••• 8821');
  const [routingCode, setRoutingCode] = useState('021000021');
  const [mfaEnabled, setMfaEnabled] = useState(false);

  useEffect(() => {
    if (!user) return;
    const fetchProfile = async () => {
      try {
        const profileRes = await fetch('http://localhost:5001/api/v1/profile/me', {
          headers: { 'Authorization': `Bearer ${user.token}` }
        });
        if (profileRes.ok) {
          const prof = await profileRes.json();
          setShopName(prof.shopName || 'ApexTech Partner Shop');
          setLegalName(prof.companyLegalName || 'ApexTech Global LLC');
          setBizPhone(prof.businessPhone || '+12025550189');
          setBankName(prof.bankName || 'Chase Bank');
          setBankAccount(prof.bankAccount || '•••• •••• 8821');
          setRoutingCode(prof.routingCode || '021000021');
          setMfaEnabled(prof.mfaEnabled || false);
        }
      } catch (err) { console.error(err); }
    };
    fetchProfile();
  }, [user]);

  return (
    <>
      <title>Merchant Profile - ApexStore Seller</title>
      <section className="bg-white p-6 rounded-2xl border dark:bg-zinc-900 shadow-sm space-y-6 dark:border-zinc-800">
        <div>
          <h3 className="font-bold text-xl text-zinc-900 dark:text-white">Merchant Profile & Settings</h3>
          <p className="text-xs text-zinc-550 mt-0.5">Edit store details, payout preferences, and MFA security options.</p>
        </div>
        <div className="grid sm:grid-cols-2 gap-6 border-b pb-6 dark:border-zinc-800">
          {[
            { label: 'Shop Name', value: shopName, setter: setShopName },
            { label: 'Business Entity Legal Name', value: legalName, setter: setLegalName },
            { label: 'Merchant Phone Number', value: bizPhone, setter: setBizPhone }
          ].map(f => (
            <div key={f.label} className="space-y-1">
              <label className="text-[10px] text-zinc-405 font-bold uppercase tracking-wider block">{f.label}</label>
              <input type="text" value={f.value} onChange={e => f.setter(e.target.value)}
                className="w-full rounded-xl border border-zinc-200 bg-white p-3 text-xs focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 text-zinc-900 dark:text-white" />
            </div>
          ))}
          <div className="space-y-1">
            <label className="text-[10px] text-zinc-405 font-bold uppercase tracking-wider block">Platform Commission Rate</label>
            <input type="text" disabled value="10%" className="w-full rounded-xl border border-zinc-205 bg-zinc-50 p-3 text-xs focus:outline-none dark:border-zinc-800 dark:bg-zinc-955 text-zinc-400" />
          </div>
        </div>
        <div className="border-b pb-6 dark:border-zinc-800 space-y-4">
          <h4 className="font-bold text-sm text-zinc-900 dark:text-white">Bank Payout Destination</h4>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { label: 'Bank Name', value: bankName, setter: setBankName },
              { label: 'Account Number', value: bankAccount, setter: setBankAccount },
              { label: 'Routing Transit Code', value: routingCode, setter: setRoutingCode }
            ].map(f => (
              <div key={f.label} className="space-y-1">
                <label className="text-[10px] text-zinc-405 font-bold uppercase tracking-wider block">{f.label}</label>
                <input type="text" value={f.value} onChange={e => f.setter(e.target.value)}
                  className="w-full rounded-xl border border-zinc-200 bg-white p-3 text-xs focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 text-zinc-900 dark:text-white" />
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-4 pt-2">
          <h4 className="font-bold text-sm text-zinc-905 dark:text-white">Merchant Dashboard Security</h4>
          <div className="flex justify-between items-center bg-zinc-55 dark:bg-zinc-950/40 p-4 rounded-xl border dark:border-zinc-800">
            <div>
              <h5 className="font-bold text-xs">Two-Factor Authentication (MFA)</h5>
              <p className="text-[10px] text-zinc-400">Secure account with temporary verification codes.</p>
            </div>
            <button onClick={() => { setMfaEnabled(!mfaEnabled); alert('2FA status updated!'); }}
              className={`rounded-xl px-4 py-2 text-xs font-bold shadow cursor-pointer transition-all border-0 ${mfaEnabled ? 'bg-red-500 text-white' : 'bg-emerald-600 text-white'}`}>
              {mfaEnabled ? 'Disable 2FA' : 'Enable 2FA'}
            </button>
          </div>
        </div>
        <button onClick={() => { alert('Settings saved!'); }}
          className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl px-4 py-2.5 text-xs font-semibold shadow cursor-pointer border-0">
          Save Settings
        </button>
      </section>
    </>
  );
}
