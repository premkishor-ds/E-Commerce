'use client';

import React, { useEffect } from 'react';
import { useAdmin } from '../../AdminContext';
import { Section, SectionHeader } from '../../../components/AdminUI';

export default function SettingsPage() {
  const {
    settingTab, setSettingTab, generalSettings, setGeneralSettings,
    emailSettings, setEmailSettings, smsSettings, setSmsSettings,
    storageSettings, setStorageSettings, apiSettings, setApiSettings,
    handleUpdateSettings, loadSystemSettings
  } = useAdmin();

  useEffect(() => {
    loadSystemSettings(settingTab);
  }, [settingTab]);

  return (
    <Section>
      <SectionHeader title="Centralized Configurations" desc="Adjust SMTP details, SMS routing, and social API integrations." />
      
      {/* Subtabs */}
      <div className="flex border-b dark:border-zinc-805 px-6 bg-zinc-50/30 dark:bg-zinc-900/10">
        {[
          { key: 'general', label: 'General' },
          { key: 'email', label: 'Email SMTP' },
          { key: 'sms', label: 'SMS Twilio' },
          { key: 'storage', label: 'Storage' },
          { key: 'api', label: 'API Keys' }
        ].map(t => (
          <button key={t.key} onClick={() => setSettingTab(t.key)}
            className={`px-4 py-3 text-xs font-bold border-b-2 -mb-[2px] transition-all cursor-pointer bg-transparent border-t-0 border-x-0 ${
              settingTab === t.key
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-zinc-500 hover:text-zinc-850 dark:hover:text-zinc-200'
            }`}>
            {t.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleUpdateSettings} className="p-6 space-y-4">
        {settingTab === 'general' && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block mb-1">Site Title</label>
              <input className="w-full rounded-lg border dark:border-zinc-800 p-2 text-xs focus:outline-none focus:border-indigo-500 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white" value={generalSettings.siteName} onChange={e=>setGeneralSettings({...generalSettings, siteName: e.target.value})} />
            </div>
            <div>
              <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block mb-1">Support Email</label>
              <input className="w-full rounded-lg border dark:border-zinc-800 p-2 text-xs focus:outline-none focus:border-indigo-500 bg-white dark:bg-zinc-950 text-zinc-905 dark:text-white" value={generalSettings.supportEmail} onChange={e=>setGeneralSettings({...generalSettings, supportEmail: e.target.value})} />
            </div>
            <div>
              <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block mb-1">Table Page Size Limit</label>
              <input type="number" min="1" max="100" className="w-full rounded-lg border dark:border-zinc-800 p-2 text-xs focus:outline-none focus:border-indigo-500 bg-white dark:bg-zinc-955 text-zinc-900 dark:text-white" value={generalSettings.pageSize} onChange={e=>setGeneralSettings({...generalSettings, pageSize: parseInt(e.target.value) || 20})} />
            </div>
          </div>
        )}

        {settingTab === 'email' && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block mb-1">SMTP Host</label>
              <input className="w-full rounded-lg border dark:border-zinc-800 p-2 text-xs focus:outline-none focus:border-indigo-500 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white" value={emailSettings.smtpHost} onChange={e=>setEmailSettings({...emailSettings, smtpHost: e.target.value})} />
            </div>
            <div>
              <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block mb-1">SMTP Port</label>
              <input className="w-full rounded-lg border dark:border-zinc-800 p-2 text-xs focus:outline-none focus:border-indigo-500 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white" value={emailSettings.smtpPort} onChange={e=>setEmailSettings({...emailSettings, smtpPort: parseInt(e.target.value)||25})} />
            </div>
          </div>
        )}

        {settingTab === 'sms' && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block mb-1">Twilio SID</label>
              <input className="w-full rounded-lg border dark:border-zinc-800 p-2 text-xs focus:outline-none focus:border-indigo-500 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white" value={smsSettings.twilioSid} onChange={e=>setSmsSettings({...smsSettings, twilioSid: e.target.value})} />
            </div>
          </div>
        )}

        {settingTab === 'storage' && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block mb-1">AWS Bucket Name</label>
              <input className="w-full rounded-lg border dark:border-zinc-800 p-2 text-xs focus:outline-none focus:border-indigo-500 bg-white dark:bg-zinc-955 text-zinc-900 dark:text-white" value={storageSettings.bucketName} onChange={e=>setStorageSettings({...storageSettings, bucketName: e.target.value})} />
            </div>
          </div>
        )}

        {settingTab === 'api' && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block mb-1">OpenAI Secret Key</label>
              <input type="password" className="w-full rounded-lg border dark:border-zinc-800 p-2 text-xs focus:outline-none focus:border-indigo-500 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white" value={apiSettings.openaiKey} onChange={e=>setApiSettings({...apiSettings, openaiKey: e.target.value})} />
            </div>
          </div>
        )}

        <button type="submit" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl cursor-pointer border-0 shadow">Save configurations</button>
      </form>
    </Section>
  );
}
