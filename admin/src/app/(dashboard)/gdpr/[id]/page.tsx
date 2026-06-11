'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAdmin } from '../../../AdminContext';
import { ArrowLeft, Save, ShieldCheck, Download, Trash2, Calendar, FileText } from 'lucide-react';
import { Section, SectionHeader, badge } from '../../../../components/AdminUI';

export default function GDPRDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { gdprRequests, setGdprRequests } = useAdmin();
  
  const [req, setReq] = useState<any>(null);
  const [localLoading, setLocalLoading] = useState(true);

  useEffect(() => {
    setLocalLoading(true);
    const found = gdprRequests.find((r) => r._id === id);
    if (found) {
      setReq(found);
    }
    setLocalLoading(false);
  }, [gdprRequests, id]);

  const processRequest = () => {
    // Simulate data export or erasure
    const mockData = {
      email: req.email,
      exportedAt: new Date().toISOString(),
      profile: { firstName: 'Simulated', lastName: 'Customer' },
      addresses: [],
      orders: [],
    };
    const blob = new Blob([JSON.stringify(mockData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `GDPR-Export-${req.email}.json`;
    a.click();
    
    const processedAt = new Date().toISOString();
    setGdprRequests(gdprRequests.map((r) => r._id === id ? { ...r, status: 'Completed', processedAt } : r));
    setReq({ ...req, status: 'Completed', processedAt });
    alert('GDPR privacy package generated and downloaded successfully!');
  };

  if (localLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-650"></div>
      </div>
    );
  }

  if (!req) {
    return (
      <div className="text-center py-12">
        <h3 className="text-sm font-bold text-zinc-550">Privacy request record not found.</h3>
        <button onClick={() => router.push('/gdpr')} className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-semibold">
          Back to GDPR Queue
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.push('/gdpr')}
          className="p-2 border dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-500 rounded-xl hover:text-indigo-500 transition-colors cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div>
          <h1 className="text-xl font-black text-zinc-900 dark:text-white">
            GDPR: {req.email}
          </h1>
          <p className="text-xs text-zinc-400">Request Type: {req.requestType}</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column: Details */}
        <div className="lg:col-span-2 space-y-6">
          <Section>
            <SectionHeader title="Privacy Action Log" desc="Metadata relating to the customer data request." />
            <div className="p-6 grid md:grid-cols-2 gap-6 text-xs text-zinc-700 dark:text-zinc-300">
              <div className="space-y-4">
                <div className="flex items-center gap-3 bg-zinc-50 dark:bg-zinc-950 p-3 rounded-xl border dark:border-zinc-850">
                  <FileText className="h-4 w-4 text-zinc-405" />
                  <div>
                    <span className="block text-[9px] font-bold text-zinc-450 uppercase">Request Type</span>
                    <span className="font-bold text-indigo-600 dark:text-indigo-400">{req.requestType}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-zinc-50 dark:bg-zinc-950 p-3 rounded-xl border dark:border-zinc-850">
                  <Calendar className="h-4 w-4 text-zinc-405" />
                  <div>
                    <span className="block text-[9px] font-bold text-zinc-450 uppercase">Date Received</span>
                    <span className="font-semibold">{new Date(req.createdAt).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {req.processedAt && (
                  <div className="flex items-center gap-3 bg-zinc-50 dark:bg-zinc-950 p-3 rounded-xl border dark:border-zinc-850">
                    <ShieldCheck className="h-4 w-4 text-zinc-405" />
                    <div>
                      <span className="block text-[9px] font-bold text-zinc-450 uppercase">Processed Timestamp</span>
                      <span className="font-semibold">{new Date(req.processedAt).toLocaleString()}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Section>
        </div>

        {/* Right Column: Actions */}
        <div className="space-y-6">
          <Section>
            <SectionHeader title="Mitigation Queue" desc="Execute data export or removal actions." />
            <div className="p-6 space-y-4 text-xs">
              <div className="space-y-2">
                <span className="block text-[10px] text-zinc-400 font-bold uppercase">Status</span>
                <div>{badge(req.status === 'Completed' ? 'green' : 'amber', req.status)}</div>
              </div>

              <div className="pt-2">
                {req.status === 'Pending' ? (
                  <button
                    onClick={processRequest}
                    className="w-full flex items-center justify-center gap-2 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl cursor-pointer border-0 shadow"
                  >
                    <Download className="h-4 w-4" />
                    {req.requestType === 'Export Data' ? 'Generate & Export Data' : 'Execute System Erasure'}
                  </button>
                ) : (
                  <div className="bg-zinc-50 dark:bg-zinc-950 p-4 rounded-xl border dark:border-zinc-850 text-center text-zinc-450 italic">
                    Request resolved on {new Date(req.processedAt).toLocaleDateString()}
                  </div>
                )}
              </div>
            </div>
          </Section>
        </div>
      </div>
    </div>
  );
}
