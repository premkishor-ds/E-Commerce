'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAdmin } from '../../../AdminContext';
import { ArrowLeft, ShieldAlert, Check, Ban, Clock, MapPin, HardDrive } from 'lucide-react';
import { Section, SectionHeader, badge } from '../../../../components/AdminUI';

export default function FraudDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { fraudLogs, setFraudLogs } = useAdmin();
  
  const [log, setLog] = useState<any>(null);
  const [localLoading, setLocalLoading] = useState(true);

  useEffect(() => {
    setLocalLoading(true);
    const found = fraudLogs.find((l) => l._id === id);
    if (found) {
      setLog(found);
    }
    setLocalLoading(false);
  }, [fraudLogs, id]);

  const toggleStatus = () => {
    const nextStatus = log.status === 'Blocked' ? 'Flagged' : 'Blocked';
    setFraudLogs(fraudLogs.map((l) => l._id === id ? { ...l, status: nextStatus } : l));
    setLog({ ...log, status: nextStatus });
    alert(`Security status updated to ${nextStatus}!`);
  };

  const dismissAlert = () => {
    if (confirm('Dismiss this threat alert?')) {
      setFraudLogs(fraudLogs.filter((l) => l._id !== id));
      alert('Alert dismissed.');
      router.push('/fraud');
    }
  };

  if (localLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-650"></div>
      </div>
    );
  }

  if (!log) {
    return (
      <div className="text-center py-12">
        <h3 className="text-sm font-bold text-zinc-550">Fraud incident record not found.</h3>
        <button onClick={() => router.push('/fraud')} className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-semibold">
          Back to Fraud Monitor
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.push('/fraud')}
          className="p-2 border dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-500 rounded-xl hover:text-indigo-500 transition-colors cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div>
          <h1 className="text-xl font-black text-zinc-900 dark:text-white">
            Security Incident: {log.email}
          </h1>
          <p className="text-xs text-zinc-400">Threat Risk Score: {log.riskScore}%</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column: Details */}
        <div className="lg:col-span-2 space-y-6">
          <Section>
            <SectionHeader title="Threat Incident Log" desc="Incident description and network origin." />
            <div className="p-6 space-y-4 text-xs text-zinc-700 dark:text-zinc-300">
              <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 p-4 rounded-2xl flex items-start gap-3">
                <ShieldAlert className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-red-800 dark:text-red-400">Incident Reason</h4>
                  <p className="mt-1 font-semibold leading-relaxed text-zinc-800 dark:text-zinc-200">{log.reason}</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 pt-2">
                <div className="flex items-center gap-3 bg-zinc-50 dark:bg-zinc-950 p-3 rounded-xl border dark:border-zinc-850">
                  <MapPin className="h-4 w-4 text-zinc-400" />
                  <div>
                    <span className="block text-[9px] font-bold text-zinc-450 uppercase">IP Address Location</span>
                    <span className="font-mono font-semibold">{log.ipAddress}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-zinc-50 dark:bg-zinc-950 p-3 rounded-xl border dark:border-zinc-850">
                  <Clock className="h-4 w-4 text-zinc-400" />
                  <div>
                    <span className="block text-[9px] font-bold text-zinc-450 uppercase">Logged At</span>
                    <span className="font-semibold">{new Date(log.createdAt).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </Section>
        </div>

        {/* Right Column: Actions */}
        <div className="space-y-6">
          <Section>
            <SectionHeader title="Threat Mitigation" desc="Execute swift security controls." />
            <div className="p-6 space-y-4 text-xs">
              <div className="space-y-2">
                <span className="block text-[10px] text-zinc-400 font-bold uppercase">Incident Status</span>
                <div>{badge(log.status === 'Blocked' ? 'red' : 'amber', log.status)}</div>
              </div>

              <div className="pt-2 space-y-2">
                <button
                  onClick={toggleStatus}
                  className={`w-full flex items-center justify-center gap-2 py-2.5 text-white font-bold rounded-xl cursor-pointer border-0 shadow ${
                    log.status === 'Blocked' ? 'bg-emerald-650 hover:bg-emerald-500' : 'bg-red-650 hover:bg-red-500'
                  }`}
                >
                  {log.status === 'Blocked' ? <Check className="h-4 w-4" /> : <Ban className="h-4 w-4" />}
                  {log.status === 'Blocked' ? 'Unblock IP / User' : 'Block User & IP'}
                </button>

                <button
                  onClick={dismissAlert}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-zinc-150 hover:bg-zinc-200 text-zinc-700 dark:bg-zinc-850 dark:text-zinc-300 dark:hover:bg-zinc-750 font-bold rounded-xl cursor-pointer border-0"
                >
                  Dismiss Incident Alert
                </button>
              </div>
            </div>
          </Section>
        </div>
      </div>
    </div>
  );
}
