'use client';

import React from 'react';
import { useAdmin } from '../../AdminContext';
import { ShieldAlert, AlertCircle, Lock } from 'lucide-react';
import { Section, SectionHeader, Table, Thead, badge, StatCard } from '../../../components/AdminUI';

export default function FraudPage() {
  const { fraudLogs, setFraudLogs } = useAdmin();

  return (
    <>
      <title>Fraud & Threat Intelligence Monitor - ApexStore Admin</title>
      <Section>
        <SectionHeader title="Fraud & Threat Intelligence Monitor" desc="Real-time login failures monitoring, transaction threat scores, and suspicious IP logs." />
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard label="Critical Alerts" value={fraudLogs.filter(l => l.riskScore >= 80).length} icon={<ShieldAlert className="h-5 w-5"/>} color="rose" />
            <StatCard label="Flagged Users" value={fraudLogs.filter(l => l.status === 'Flagged').length} icon={<AlertCircle className="h-5 w-5"/>} color="amber" />
            <StatCard label="IP Blocks in Vault" value={24} icon={<Lock className="h-5 w-5"/>} color="indigo" />
          </div>

          <Table>
            <Thead>
              <tr>
                <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-zinc-500">Account / IP</th>
                <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-zinc-500">Risk Score</th>
                <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-zinc-500">Reason / Incident Description</th>
                <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-zinc-500">Status</th>
                <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-zinc-500 text-right">Actions</th>
              </tr>
            </Thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {fraudLogs.map((log) => (
                <tr key={log._id} className="text-xs hover:bg-zinc-50 dark:hover:bg-zinc-800/40">
                  <td className="px-4 py-3">
                    <div className="font-semibold text-zinc-900 dark:text-white">{log.email}</div>
                    <div className="text-[10px] text-zinc-400 font-mono">IP: {log.ipAddress}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      log.riskScore >= 80 
                        ? 'bg-red-50 text-red-750 border border-red-100' 
                        : 'bg-amber-50 text-amber-750 border border-amber-100'
                    }`}>
                      {log.riskScore}% Risk
                    </span>
                  </td>
                  <td className="px-4 py-3 text-zinc-500 max-w-[240px] truncate" title={log.reason}>{log.reason}</td>
                  <td className="px-4 py-3">{badge(log.status === 'Blocked' ? 'red' : 'amber', log.status)}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex gap-2 justify-end">
                      <button 
                        onClick={() => {
                          setFraudLogs(fraudLogs.map(l => l._id === log._id ? { ...l, status: l.status === 'Blocked' ? 'Flagged' : 'Blocked' } : l));
                          alert(`Security status updated!`);
                        }}
                        className="text-indigo-600 hover:underline font-bold bg-transparent border-0 cursor-pointer"
                      >
                        {log.status === 'Blocked' ? 'Unblock' : 'Block IP'}
                      </button>
                      <span className="text-zinc-200">|</span>
                      <button 
                        onClick={() => {
                          setFraudLogs(fraudLogs.filter(l => l._id !== log._id));
                          alert('Alert dismissed successfully.');
                        }}
                        className="text-zinc-400 hover:text-zinc-655 hover:underline font-semibold bg-transparent border-0 cursor-pointer"
                      >
                        Dismiss
                      </button>
                    </div>
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
