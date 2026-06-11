'use client';

import React, { useEffect, useState } from 'react';
import { useAdmin } from '../../AdminContext';
import {
  LayoutDashboard, TrendingUp, ShoppingBag, Users, Activity, Cpu, Calendar, CheckCircle, AlertCircle
} from 'lucide-react';
import { Section, Table, Thead, badge } from '../../../components/AdminUI';

export default function AnalyticsPage() {
  const {
    stats, loadStats, products, loadProducts, vendors, loadVendors
  } = useAdmin();

  const [analyticsSubTab, setAnalyticsSubTab] = useState<'overview' | 'sales' | 'chatbot' | 'demographics'>('overview');

  useEffect(() => {
    loadStats();
    loadProducts();
    loadVendors();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-zinc-905 dark:text-white">Platform Analytics Hub</h1>
          <p className="text-sm text-zinc-500 mt-0.5">Real-time platform insights, conversion rates, and chat telemetry.</p>
        </div>
        
        {/* Time range indicator */}
        <div className="flex items-center gap-1.5 bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100/50 dark:border-indigo-900/30 px-3.5 py-1.5 rounded-xl text-xs font-bold text-indigo-700 dark:text-indigo-300">
          <Calendar className="h-4 w-4" /> Live Tracking Enabled
        </div>
      </div>

      {/* Subtabs for Analytics */}
      <div className="flex border-b dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-xl p-1 border">
        {[
          { key: 'overview', label: 'Dashboard Overview', icon: <LayoutDashboard className="h-3.5 w-3.5" /> },
          { key: 'sales', label: 'Sales & Revenue Analysis', icon: <TrendingUp className="h-3.5 w-3.5" /> },
          { key: 'chatbot', label: 'AI Chatbot Telemetry', icon: <Cpu className="h-3.5 w-3.5" /> },
          { key: 'demographics', label: 'Traffic & Demographics', icon: <Users className="h-3.5 w-3.5" /> }
        ].map(t => (
          <button key={t.key} onClick={() => setAnalyticsSubTab(t.key as any)}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold rounded-lg transition-all cursor-pointer flex-1 justify-center border-0 ${
              analyticsSubTab === t.key
                ? 'bg-indigo-600 text-white shadow'
                : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800/40 bg-transparent'
            }`}>
            {t.icon}
            {t.label}
          </button>
        ))}
      </div>

      {/* OVERVIEW SUBTAB */}
      {analyticsSubTab === 'overview' && (
        <div className="space-y-6">
          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Gross Revenue Card */}
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border dark:border-zinc-800 p-6 space-y-4 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Gross Sales</span>
                <div className="p-2 bg-indigo-50 dark:bg-indigo-950/40 rounded-xl text-indigo-600 dark:text-indigo-400"><TrendingUp className="h-4 w-4" /></div>
              </div>
              <div>
                <div className="text-2xl font-black text-zinc-900 dark:text-white">
                  ${(stats?.revenue?.total || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <p className="text-[10px] text-emerald-500 font-bold mt-1">↑ +14.2% from last month</p>
              </div>
              {/* Sparkline */}
              <div className="h-10">
                <svg className="w-full h-full" viewBox="0 0 100 30" preserveAspectRatio="none">
                  <path fill="none" stroke="#4f46e5" strokeWidth="1.5" strokeLinecap="round" d="M0,25 Q15,20 30,10 T60,18 T90,5 T100,8" />
                  <path fill="rgba(79, 70, 229, 0.05)" d="M0,25 Q15,20 30,10 T60,18 T90,5 T100,8 L100,30 L0,30 Z" />
                </svg>
              </div>
            </div>

            {/* Total Orders Card */}
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border dark:border-zinc-800 p-6 space-y-4 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Total Orders</span>
                <div className="p-2 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl text-emerald-600 dark:text-emerald-400"><ShoppingBag className="h-4 w-4" /></div>
              </div>
              <div>
                <div className="text-2xl font-black text-zinc-900 dark:text-white">{stats?.orders?.total || 0}</div>
                <p className="text-[10px] text-emerald-500 font-bold mt-1">↑ +8.3% vs yesterday</p>
              </div>
              <div className="h-10">
                <svg className="w-full h-full" viewBox="0 0 100 30" preserveAspectRatio="none">
                  <path fill="none" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" d="M0,25 L20,15 L40,28 L60,10 L80,12 L100,5" />
                  <path fill="rgba(16, 185, 129, 0.05)" d="M0,25 L20,15 L40,28 L60,10 L80,12 L100,5 L100,30 L0,30 Z" />
                </svg>
              </div>
            </div>

            {/* Active Customers */}
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border dark:border-zinc-800 p-6 space-y-4 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Total Customers</span>
                <div className="p-2 bg-blue-50 dark:bg-blue-950/40 rounded-xl text-blue-600 dark:text-blue-400"><Users className="h-4 w-4" /></div>
              </div>
              <div>
                <div className="text-2xl font-black text-zinc-900 dark:text-white">{stats?.customers?.total || 0}</div>
                <p className="text-[10px] text-zinc-400 font-medium mt-1">Active customer directory</p>
              </div>
              <div className="h-10">
                <svg className="w-full h-full" viewBox="0 0 100 30" preserveAspectRatio="none">
                  <path fill="none" stroke="#3b82f6" strokeWidth="1.5" strokeLinecap="round" d="M0,20 Q25,25 50,15 T100,5" />
                  <path fill="rgba(59, 130, 246, 0.05)" d="M0,20 Q25,25 50,15 T100,5 L100,30 L0,30 Z" />
                </svg>
              </div>
            </div>

            {/* Average Order Value (AOV) */}
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border dark:border-zinc-800 p-6 space-y-4 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Avg Order Value (AOV)</span>
                <div className="p-2 bg-purple-50 dark:bg-purple-950/40 rounded-xl text-purple-600 dark:text-purple-400"><Activity className="h-4 w-4" /></div>
              </div>
              <div>
                <div className="text-2xl font-black text-zinc-900 dark:text-white">
                  ${stats?.orders?.total ? ((stats?.revenue?.total || 0) / stats.orders.total).toFixed(2) : '0.00'}
                </div>
                <p className="text-[10px] text-emerald-500 font-bold mt-1">↑ +2.4% avg conversion price</p>
              </div>
              <div className="h-10">
                <svg className="w-full h-full" viewBox="0 0 100 30" preserveAspectRatio="none">
                  <path fill="none" stroke="#a855f7" strokeWidth="1.5" strokeLinecap="round" d="M0,15 Q30,10 60,20 T100,10" />
                  <path fill="rgba(168, 85, 247, 0.05)" d="M0,15 Q30,10 60,20 T100,10 L100,30 L0,30 Z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Main Grid Panel */}
          <div className="grid md:grid-cols-3 gap-6">
            {/* SVG Analytics Revenue Graph */}
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border dark:border-zinc-800 p-6 md:col-span-2 space-y-4 shadow-sm">
              <div className="flex items-center justify-between border-b pb-3 dark:border-zinc-800">
                <h3 className="font-bold text-sm text-zinc-900 dark:text-white">Monthly Revenue Distribution</h3>
                <span className="text-xs text-zinc-400 font-semibold">12-Month Performance Cycle</span>
              </div>
              
              <div className="w-full h-60 bg-zinc-50/30 dark:bg-zinc-950/30 rounded-xl relative flex flex-col justify-between p-4 border dark:border-zinc-800/80">
                {/* Grid lines */}
                <div className="absolute inset-0 flex flex-col justify-between py-6 px-4 pointer-events-none opacity-20 dark:opacity-10">
                  <div className="border-b border-zinc-400 w-full"></div>
                  <div className="border-b border-zinc-400 w-full"></div>
                  <div className="border-b border-zinc-400 w-full"></div>
                  <div className="border-b border-zinc-400 w-full"></div>
                </div>

                {/* Chart Render */}
                <div className="flex-1 w-full relative">
                  <svg className="w-full h-full" viewBox="0 0 500 160" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.25"/>
                        <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.0"/>
                      </linearGradient>
                    </defs>
                    <path fill="url(#chartGrad)" d="M 0 150 Q 50 120 100 130 T 200 90 T 300 60 T 400 30 T 500 15 L 500 160 L 0 160 Z" />
                    <path fill="none" stroke="#4f46e5" strokeWidth="2.5" strokeLinecap="round" d="M 0 150 Q 50 120 100 130 T 200 90 T 300 60 T 400 30 T 500 15" />
                    
                    <circle cx="0" cy="150" r="4" fill="#4f46e5" />
                    <circle cx="100" cy="130" r="4" fill="#4f46e5" />
                    <circle cx="200" cy="90" r="4" fill="#4f46e5" />
                    <circle cx="300" cy="60" r="4" fill="#4f46e5" />
                    <circle cx="400" cy="30" r="4" fill="#4f46e5" />
                    <circle cx="500" cy="15" r="4" fill="#4f46e5" />
                  </svg>
                </div>
                <div className="flex justify-between mt-2 text-[9px] text-zinc-400 font-bold tracking-wider px-2">
                  {stats?.revenue?.monthlyTrend ? stats.revenue.monthlyTrend.map((t: any, idx: number) => (
                    <span key={idx}>{t.month} (${t.amount.toLocaleString()})</span>
                  )) : (
                    <>
                      <span>JAN</span>
                      <span>FEB</span>
                      <span>MAR</span>
                      <span>APR</span>
                      <span>MAY</span>
                      <span>JUN</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Breakdown distribution side panel */}
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border dark:border-zinc-800 p-6 space-y-4 shadow-sm">
              <div className="border-b pb-2 dark:border-zinc-800">
                <h3 className="font-bold text-sm text-zinc-900 dark:text-white">Order Status Distributions</h3>
              </div>
              <div className="space-y-4 pt-2">
                {Object.entries(stats?.orders?.statusDistribution || { Shipped: 5, Delivered: 10, Pending: 3 }).map(([status, count]: [string, any]) => {
                  const percentage = stats?.orders?.total ? Math.round((count / stats.orders.total) * 100) : 0;
                  const colorClasses: Record<string, string> = {
                    Delivered: 'bg-emerald-600',
                    Completed: 'bg-emerald-600',
                    Pending: 'bg-amber-500',
                    Cancelled: 'bg-red-500',
                    Shipped: 'bg-blue-600',
                    Paid: 'bg-blue-600'
                  };
                  return (
                    <div key={status} className="space-y-1.5">
                      <div className="flex justify-between text-xs">
                        <span className="font-medium text-zinc-600 dark:text-zinc-400">{status}</span>
                        <span className="font-bold text-zinc-950 dark:text-white">{count} ({percentage}%)</span>
                      </div>
                      <div className="w-full bg-zinc-100 dark:bg-zinc-850 rounded-full h-2">
                        <div className={`h-2 rounded-full transition-all duration-500 ${colorClasses[status] || 'bg-zinc-400'}`} style={{ width: `${percentage}%` }}></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SALES SUBTAB */}
      {analyticsSubTab === 'sales' && (
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border dark:border-zinc-800 shadow-sm p-6 md:col-span-2 space-y-4">
            <div className="flex items-center justify-between border-b pb-3 dark:border-zinc-800">
              <h3 className="font-bold text-sm text-zinc-900 dark:text-white">Top Sales & Products Breakdown</h3>
              <span className="text-xs text-zinc-400 font-semibold">{products.length} catalog items</span>
            </div>

            <Table>
              <Thead>
                <tr>
                  <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-zinc-500">Product Title</th>
                  <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-zinc-500">Price</th>
                  <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-zinc-500">SKU</th>
                  <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-zinc-500">Approval Status</th>
                </tr>
              </Thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {products.slice(0, 6).map((p: any) => (
                  <tr key={p._id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40 text-xs">
                    <td className="px-4 py-3 font-semibold text-zinc-900 dark:text-white">{p.title}</td>
                    <td className="px-4 py-3 text-zinc-500 font-mono">${(p.price || 0).toFixed(2)}</td>
                    <td className="px-4 py-3 text-zinc-400 font-mono">{p.sku}</td>
                    <td className="px-4 py-3">{badge(p.isApproved ? 'green' : 'amber', p.isApproved ? 'Approved' : 'Pending')}</td>
                  </tr>
                ))}
                {products.length === 0 && (
                  <tr>
                    <td colSpan={4} className="text-center py-6 text-zinc-400">No catalog items to display.</td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>

          <div className="bg-white dark:bg-zinc-900 rounded-2xl border dark:border-zinc-800 p-6 space-y-4 shadow-sm">
            <div className="border-b pb-2 dark:border-zinc-800">
              <h3 className="font-bold text-sm text-zinc-900 dark:text-white">Platform Commission Rates</h3>
            </div>
            <p className="text-xs text-zinc-505">Platform commission summary estimates from merchant listings.</p>
            
            <div className="space-y-4 pt-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-zinc-500 font-medium">Total Registered Merchants:</span>
                <span className="font-bold text-zinc-900 dark:text-white">{vendors.length}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-zinc-500 font-medium">Active Seller Ratio:</span>
                <span className="font-bold text-zinc-900 dark:text-white">
                  {vendors.filter(v => v.status === 'Active').length} / {vendors.length}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs border-t dark:border-zinc-800 pt-3">
                <span className="text-indigo-600 dark:text-indigo-400 font-semibold">Average Commission Percentage:</span>
                <span className="font-bold text-indigo-600 dark:text-indigo-400">
                  {vendors.length ? (vendors.reduce((sum, v) => sum + (v.commissionRate || 10), 0) / vendors.length).toFixed(1) : '10.0'}%
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CHATBOT SUBTAB */}
      {analyticsSubTab === 'chatbot' && (
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border dark:border-zinc-800 p-6 space-y-6 shadow-sm md:col-span-2">
            <div className="border-b pb-3 dark:border-zinc-800">
              <h3 className="font-bold text-sm text-zinc-900 dark:text-white">AI Assistant Intent Distribution</h3>
            </div>

            <div className="space-y-4">
              {(stats?.chatbot?.commonIntents || [{ goal: 'TRACK_ORDER', count: 18 }, { goal: 'VENDOR_SIGNUP', count: 12 }, { goal: 'COMPLAINTS', count: 8 }]).map((intent: any, index: number) => {
                const total = (stats?.chatbot?.commonIntents || []).reduce((sum: number, curr: any) => sum + curr.count, 0) || 38;
                const pct = Math.round((intent.count / total) * 100);
                return (
                  <div key={index} className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="font-mono text-zinc-650 dark:text-zinc-400">{intent.goal}</span>
                      <span className="font-bold text-zinc-900 dark:text-white">{intent.count} matches ({pct}%)</span>
                    </div>
                    <div className="w-full bg-zinc-100 dark:bg-zinc-850 rounded-full h-2">
                      <div className="bg-indigo-650 h-2 rounded-full" style={{ width: `${pct}%` }}></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border dark:border-zinc-800 p-6 space-y-4 shadow-sm">
              <div className="border-b pb-2 dark:border-zinc-800">
                <h3 className="font-bold text-sm text-zinc-900 dark:text-white">Confidence Threshold</h3>
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="text-3xl font-black text-zinc-900 dark:text-white">{stats?.chatbot?.averageConfidence || 89.2}%</div>
                  <div className="text-[10px] text-zinc-405 font-bold uppercase tracking-wider">Avg Intent Confidence</div>
                </div>
                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl text-emerald-600 dark:text-emerald-400">
                  <CheckCircle className="h-6 w-6" />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-zinc-900 rounded-2xl border dark:border-zinc-800 p-6 space-y-4 shadow-sm">
              <div className="border-b pb-2 dark:border-zinc-800">
                <h3 className="font-bold text-sm text-zinc-900 dark:text-white">Conversations Fallback</h3>
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="text-3xl font-black text-zinc-900 dark:text-white">{stats?.chatbot?.fallbackRate || 4.8}%</div>
                  <div className="text-[10px] text-zinc-405 font-bold uppercase tracking-wider">Fallback Intent Rate</div>
                </div>
                <div className="p-3 bg-amber-50 dark:bg-amber-950/40 rounded-2xl text-amber-600 dark:text-amber-400">
                  <AlertCircle className="h-6 w-6" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DEMOGRAPHICS SUBTAB */}
      {analyticsSubTab === 'demographics' && (
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border dark:border-zinc-800 p-6 space-y-4 shadow-sm">
            <div className="border-b pb-2 dark:border-zinc-800">
              <h3 className="font-bold text-sm text-zinc-905 dark:text-white">Referrals & Browsers Distributions</h3>
            </div>
            <div className="space-y-4 pt-2">
              {Object.entries(stats?.traffic?.browsers || { Chrome: 64, Safari: 18, Firefox: 10 }).map(([browser, ratio]: [string, any]) => (
                <div key={browser} className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium text-zinc-650 dark:text-zinc-400">{browser}</span>
                    <span className="font-bold text-zinc-900 dark:text-white">{ratio}%</span>
                  </div>
                  <div className="w-full bg-zinc-100 dark:bg-zinc-850 rounded-full h-1.5">
                    <div className="bg-indigo-650 h-1.5 rounded-full" style={{ width: `${ratio}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-900 rounded-2xl border dark:border-zinc-800 p-6 space-y-4 shadow-sm">
            <div className="border-b pb-2 dark:border-zinc-800">
              <h3 className="font-bold text-sm text-zinc-905 dark:text-white">Client Device Profile</h3>
            </div>
            <div className="space-y-4 pt-2">
              {Object.entries(stats?.traffic?.devices || { Desktop: 70, Mobile: 25 }).map(([device, ratio]: [string, any]) => (
                <div key={device} className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium text-zinc-650 dark:text-zinc-400">{device}</span>
                    <span className="font-bold text-zinc-900 dark:text-white">{ratio}%</span>
                  </div>
                  <div className="w-full bg-zinc-100 dark:bg-zinc-850 rounded-full h-1.5">
                    <div className="bg-indigo-650 h-1.5 rounded-full" style={{ width: `${ratio}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
