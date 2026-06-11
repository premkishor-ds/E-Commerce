'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAdmin } from '../../../AdminContext';
import { ArrowLeft, Save, Trash2, ToggleLeft, Shield } from 'lucide-react';
import { Section, SectionHeader, badge } from '../../../../components/AdminUI';

export default function FlagDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { featureFlags, setFeatureFlags } = useAdmin();
  
  const [flag, setFlag] = useState<any>(null);
  const [localLoading, setLocalLoading] = useState(true);

  const [name, setName] = useState('');
  const [key, setKey] = useState('');
  const [description, setDescription] = useState('');
  const [group, setGroup] = useState('Storefront');
  const [isEnabled, setIsEnabled] = useState(false);

  useEffect(() => {
    setLocalLoading(true);
    const found = featureFlags.find((f) => f._id === id);
    if (found) {
      setFlag(found);
      setName(found.name || '');
      setKey(found.key || '');
      setDescription(found.description || '');
      setGroup(found.group || 'Storefront');
      setIsEnabled(found.isEnabled || false);
    }
    setLocalLoading(false);
  }, [featureFlags, id]);

  const saveFlagChanges = (e: React.FormEvent) => {
    e.preventDefault();
    setFeatureFlags(featureFlags.map((f) =>
      f._id === id
        ? { ...f, name, key: key.toUpperCase(), description, group, isEnabled }
        : f
    ));
    alert('Feature flag saved successfully!');
  };

  const removeFlag = () => {
    if (confirm('Delete this feature flag?')) {
      setFeatureFlags(featureFlags.filter((f) => f._id !== id));
      alert('Feature flag deleted!');
      router.push('/flags');
    }
  };

  if (localLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-650"></div>
      </div>
    );
  }

  if (!flag) {
    return (
      <div className="text-center py-12">
        <h3 className="text-sm font-bold text-zinc-550">Feature flag not found.</h3>
        <button onClick={() => router.push('/flags')} className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-semibold">
          Back to Flags
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.push('/flags')}
          className="p-2 border dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-500 rounded-xl hover:text-indigo-500 transition-colors cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div>
          <h1 className="text-xl font-black text-zinc-900 dark:text-white">
            {flag.name}
          </h1>
          <p className="text-xs text-zinc-400">Key: {flag.key}</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column: Form */}
        <div className="lg:col-span-2 space-y-6">
          <Section>
            <SectionHeader title="Flag Configurations" desc="Adjust keys, names, and operational scope." />
            <form onSubmit={saveFlagChanges} className="p-6 space-y-4 text-xs text-left">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] text-zinc-455 font-bold uppercase mb-1">Feature Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 border dark:border-zinc-800 bg-white dark:bg-zinc-950 rounded-lg text-zinc-805 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-zinc-455 font-bold uppercase mb-1">Flag Key</label>
                  <input
                    type="text"
                    required
                    value={key}
                    onChange={(e) => setKey(e.target.value)}
                    className="w-full px-3 py-2 border dark:border-zinc-800 bg-white dark:bg-zinc-955 rounded-lg text-zinc-805 dark:text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] text-zinc-455 font-bold uppercase mb-1">Group Category</label>
                <select
                  value={group}
                  onChange={(e) => setGroup(e.target.value)}
                  className="w-full px-3 py-2 border dark:border-zinc-800 bg-white dark:bg-zinc-950 rounded-lg text-zinc-805 dark:text-white"
                >
                  <option value="Storefront">Storefront</option>
                  <option value="Payments">Payments</option>
                  <option value="Authentication">Authentication</option>
                  <option value="System">System Backend</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] text-zinc-455 font-bold uppercase mb-1">Description</label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
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
            <SectionHeader title="Status Standing" desc="Enable or disable flag parameters." />
            <div className="p-6 space-y-4 text-xs">
              <div className="space-y-2">
                <span className="block text-[10px] text-zinc-400 font-bold uppercase">Status</span>
                <button
                  onClick={() => setIsEnabled(!isEnabled)}
                  className={`w-full py-2.5 rounded-xl text-xs font-bold shadow transition-all border-0 cursor-pointer ${
                    isEnabled
                      ? 'bg-emerald-600 text-white hover:bg-emerald-500'
                      : 'bg-zinc-200 text-zinc-700 hover:bg-zinc-300 dark:bg-zinc-850 dark:text-zinc-300 dark:hover:bg-zinc-700'
                  }`}
                >
                  {isEnabled ? 'Enabled' : 'Disabled'}
                </button>
              </div>

              <div className="pt-2 border-t dark:border-zinc-800">
                <button
                  onClick={removeFlag}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-red-650 hover:bg-red-500 text-white font-bold rounded-xl cursor-pointer border-0"
                >
                  <Trash2 className="h-4 w-4" />
                  Remove Feature Flag
                </button>
              </div>
            </div>
          </Section>
        </div>
      </div>
    </div>
  );
}
