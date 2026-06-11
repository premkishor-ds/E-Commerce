'use client';

import React from 'react';
import { useAdmin } from '../../AdminContext';
import { Section, SectionHeader, Table, Thead, badge } from '../../../components/AdminUI';

export default function GDPRPage() {
  const { gdprRequests, setGdprRequests } = useAdmin();

  return (
    <>
      <title>GDPR & Privacy Compliance Queue - ApexStore Admin</title>
      <Section>
        <SectionHeader title="GDPR & Privacy Compliance Queue" desc="Review, audit, and execute customer privacy requests for personal data exports or erasures." />
        <div className="p-6 space-y-6">
          <Table>
            <Thead>
              <tr>
                <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-zinc-500">Requestor Email</th>
                <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-zinc-500">Request Type</th>
                <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-zinc-500">Date Received</th>
                <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-zinc-500">Status</th>
                <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-zinc-500 text-right">Privacy Execution Actions</th>
              </tr>
            </Thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {gdprRequests.map((req) => (
                <tr key={req._id} className="text-xs hover:bg-zinc-55 dark:hover:bg-zinc-800/40">
                  <td className="px-4 py-3 font-semibold text-zinc-900 dark:text-white">{req.email}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      req.requestType === 'Delete Profile' 
                        ? 'bg-rose-50 text-rose-700 border border-rose-100' 
                        : 'bg-indigo-50 text-indigo-700 border border-indigo-100'
                    }`}>
                      {req.requestType}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-zinc-400">{new Date(req.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3">{badge(req.status === 'Completed' ? 'green' : 'amber', req.status)}</td>
                  <td className="px-4 py-3 text-right">
                    {req.status === 'Pending' ? (
                      <div className="flex gap-2 justify-end">
                        <button 
                          onClick={() => {
                            // Simulate data export
                            const mockData = {
                              email: req.email,
                              exportedAt: new Date().toISOString(),
                              profile: { firstName: 'Simulated', lastName: 'Customer' },
                              addresses: [],
                              orders: []
                            };
                            const blob = new Blob([JSON.stringify(mockData, null, 2)], { type: 'application/json' });
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = `GDPR-Export-${req.email}.json`;
                            a.click();
                            setGdprRequests(gdprRequests.map(r => r._id === req._id ? { ...r, status: 'Completed', processedAt: new Date().toISOString() } : r));
                            alert('GDPR data package generated and downloaded successfully!');
                          }}
                          className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg px-3 py-1 font-semibold border-0 cursor-pointer text-xs"
                        >
                          {req.requestType === 'Export Data' ? 'Generate Export' : 'Process Erasure'}
                        </button>
                      </div>
                    ) : (
                      <span className="text-[10px] text-zinc-450 italic">Processed on {new Date(req.processedAt).toLocaleDateString()}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </Section>
    </>
  );
}
