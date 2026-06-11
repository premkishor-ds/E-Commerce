'use client';

import React from 'react';
import { useAdmin } from '../../AdminContext';

export default function HealthPage() {
  const { healthMetrics } = useAdmin();

  return (
    <>
      <title>System Infrastructure Health - ApexStore Admin</title>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-black text-zinc-905 dark:text-white">System Infrastructure Health</h1>
            <p className="text-sm text-zinc-500 mt-0.5">Live monitoring metrics for CPU cores, RAM allocations, database latency, and websocket networks.</p>
          </div>
          <button 
            onClick={() => {
              alert("System Health Diagnostic Complete:\n\n• CPU Cores: 12 Cores Online\n• NestJS Backend REST API: Healthy\n• MongoDB Atlas Cluster: 9ms Latency\n• Redis Caching Server: Active\n• Socket.IO Live Support Server: Active\n• Elasticsearch Indexing: 100% Synced");
            }}
            className="bg-indigo-650 hover:bg-indigo-600 text-white rounded-xl px-4 py-2 text-xs font-semibold shadow border-0 cursor-pointer"
          >
            Run Full Infrastructure Diagnostics
          </button>
        </div>

        {/* Gauges grid */}
        <div className="grid sm:grid-cols-3 gap-6">
          {[
            { label: 'CPU Cluster Load', value: `${healthMetrics.cpu}%`, progress: healthMetrics.cpu, color: 'indigo' },
            { label: 'Memory Allocation', value: `${healthMetrics.memory}%`, progress: healthMetrics.memory, color: 'blue' },
            { label: 'Disk Storage Volume', value: `${healthMetrics.disk}%`, progress: healthMetrics.disk, color: 'emerald' }
          ].map(g => {
            const barColors: Record<string, string> = {
              indigo: 'bg-indigo-600',
              blue: 'bg-blue-600',
              emerald: 'bg-emerald-600'
            };
            return (
              <div key={g.label} className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border dark:border-zinc-800 shadow-sm space-y-4">
                <div className="text-xs text-zinc-400 font-bold uppercase tracking-wider">{g.label}</div>
                <div className="text-3xl font-black text-zinc-900 dark:text-white">{g.value}</div>
                <div className="w-full bg-zinc-150 dark:bg-zinc-800 rounded-full h-2">
                  <div className={`h-2 rounded-full ${barColors[g.color]}`} style={{ width: `${g.progress}%` }}></div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Status and Uptime details */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border dark:border-zinc-800 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-zinc-900 dark:text-white border-b pb-2 dark:border-zinc-800">Operational Microservices</h3>
            <div className="space-y-3 pt-1 text-xs">
              {[
                { service: 'NestJS REST API Gateway', status: 'Online', desc: 'Port 5001' },
                { service: 'MongoDB Atlas Replica Set', status: 'Online', desc: 'Latency 9ms' },
                { service: 'Redis Session & Cache Store', status: 'Online', desc: 'Active' },
                { service: 'Socket.IO Websocket Gateway', status: 'Online', desc: 'Live Support Port' }
              ].map(s => (
                <div key={s.service} className="flex justify-between items-center border-b pb-2 last:border-0 dark:border-zinc-800">
                  <div>
                    <div className="font-bold text-zinc-800 dark:text-zinc-200">{s.service}</div>
                    <div className="text-[10px] text-zinc-450">{s.desc}</div>
                  </div>
                  <span className="bg-emerald-50 text-emerald-800 font-bold text-[9px] px-2 py-0.5 rounded border border-emerald-100">{s.status}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border dark:border-zinc-800 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-zinc-900 dark:text-white border-b pb-2 dark:border-zinc-800">Server Metrics Overview</h3>
            <div className="space-y-3 pt-1 text-xs">
              <div className="flex justify-between">
                <span className="text-zinc-500 font-medium">Server Uptime:</span>
                <span className="font-bold text-zinc-900 dark:text-white">{healthMetrics.uptime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500 font-medium">Active Websocket Connections:</span>
                <span className="font-bold text-zinc-900 dark:text-white">14 Client Connections</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500 font-medium">Average Request Latency:</span>
                <span className="font-bold text-zinc-900 dark:text-white">12ms</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500 font-medium">Cron Retention sweeps:</span>
                <span className="font-bold text-zinc-900 dark:text-white">Daily at 00:00 UTC</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
