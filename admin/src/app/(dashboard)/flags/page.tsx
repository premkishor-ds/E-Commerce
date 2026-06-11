'use client';

import React, { useState } from 'react';
import { useAdmin } from '../../AdminContext';
import { Section, SectionHeader } from '../../../components/AdminUI';

export default function FlagsPage() {
  const { featureFlags, setFeatureFlags } = useAdmin();
  const [newFlagName, setNewFlagName] = useState('');
  const [newFlagKey, setNewFlagKey] = useState('');
  const [newFlagDesc, setNewFlagDesc] = useState('');
  const [newFlagGroup, setNewFlagGroup] = useState('Storefront');

  const handleCreateFlag = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFlagName || !newFlagKey) return;
    const newFlag = {
      _id: `flag-${Date.now()}`,
      name: newFlagName,
      key: newFlagKey.trim().toUpperCase(),
      description: newFlagDesc || 'No description provided.',
      group: newFlagGroup,
      isEnabled: false
    };
    setFeatureFlags([...featureFlags, newFlag]);
    setNewFlagName(''); setNewFlagKey(''); setNewFlagDesc('');
    alert(`Feature flag ${newFlag.key} created!`);
  };

  const toggleFlag = (id: string) => {
    setFeatureFlags(featureFlags.map(f => f._id === id ? { ...f, isEnabled: !f.isEnabled } : f));
  };

  const removeFlag = (id: string) => {
    if (confirm('Delete this feature flag?')) {
      setFeatureFlags(featureFlags.filter(f => f._id !== id));
    }
  };

  return (
    <Section>
      <SectionHeader title="Global Feature Flags" desc="Instantly enable or disable specific platform capabilities across storefronts and consoles." />
      <div className="p-6 space-y-6 text-left">
        {/* Create Flag Form */}
        <form onSubmit={handleCreateFlag} className="bg-zinc-50 dark:bg-zinc-950/40 p-5 rounded-2xl border dark:border-zinc-850 space-y-4">
          <h4 className="font-bold text-xs uppercase text-indigo-650 dark:text-indigo-400">Register New Feature Flag</h4>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <input type="text" required placeholder="Feature Name (e.g. Apple Pay)" value={newFlagName} onChange={e=>setNewFlagName(e.target.value)}
              className="px-3 py-2 border dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-xl text-xs focus:outline-none focus:border-indigo-500 text-zinc-900 dark:text-white" />
            <input type="text" required placeholder="Flag Key (e.g. ENABLE_APPLE_PAY)" value={newFlagKey} onChange={e=>setNewFlagKey(e.target.value)}
              className="px-3 py-2 border dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-xl text-xs focus:outline-none focus:border-indigo-500 text-zinc-900 dark:text-white font-mono" />
            <select value={newFlagGroup} onChange={e=>setNewFlagGroup(e.target.value)}
              className="px-3 py-2 border dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-xl text-xs focus:outline-none focus:border-indigo-500 text-zinc-900 dark:text-white cursor-pointer">
              <option value="Storefront">Storefront</option>
              <option value="Payments">Payments</option>
              <option value="Authentication">Authentication</option>
              <option value="System">System Backend</option>
            </select>
            <button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold py-2 shadow transition-all border-0 cursor-pointer">
              Create Flag
            </button>
          </div>
          <input type="text" placeholder="Short description of what this feature flag controls..." value={newFlagDesc} onChange={e=>setNewFlagDesc(e.target.value)}
            className="w-full px-3 py-2 border dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-xl text-xs focus:outline-none focus:border-indigo-500 text-zinc-900 dark:text-white" />
        </form>

        {/* Flags list */}
        <div className="grid md:grid-cols-2 gap-4">
          {featureFlags.map((flag) => (
            <div key={flag._id} className="border dark:border-zinc-800 rounded-2xl p-5 bg-zinc-50/20 dark:bg-zinc-900/30 flex justify-between items-start gap-4">
              <div className="space-y-1">
                <span className="inline-block bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-[9px] font-bold px-2 py-0.5 rounded">
                  {flag.group}
                </span>
                <h4 className="font-extrabold text-sm text-zinc-900 dark:text-white">{flag.name}</h4>
                <code className="text-[10px] text-zinc-400 font-mono block">{flag.key}</code>
                <p className="text-xs text-zinc-500 mt-1">{flag.description}</p>
              </div>
              <div className="flex flex-col items-end gap-2 shrink-0">
                <button 
                  onClick={() => toggleFlag(flag._id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold shadow transition-all border-0 cursor-pointer ${
                    flag.isEnabled 
                      ? 'bg-emerald-600 text-white hover:bg-emerald-500' 
                      : 'bg-zinc-200 text-zinc-700 hover:bg-zinc-300 dark:bg-zinc-850 dark:text-zinc-300 dark:hover:bg-zinc-700'
                  }`}
                >
                  {flag.isEnabled ? 'Enabled' : 'Disabled'}
                </button>
                <button 
                  onClick={() => removeFlag(flag._id)}
                  className="text-red-500 hover:text-red-650 text-[10px] font-semibold hover:underline bg-transparent border-0 cursor-pointer"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
