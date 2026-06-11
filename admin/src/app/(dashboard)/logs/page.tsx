'use client';

import React, { useEffect } from 'react';
import { useAdmin } from '../../AdminContext';
import {
  Database, Activity, ShieldAlert, Lock, X, Download, Cpu, Settings, RefreshCw
} from 'lucide-react';
import { Section, SectionHeader, Table, Thead, badge, Loading, Pagination, renderSortableHeader, StatCard } from '../../../components/AdminUI';

export default function LogsPage() {
  const {
    loading, loadLogs, selectedLogDetail, setSelectedLogDetail, apiFetch,
    logSubTab, setLogSubTab, logAnalytics, auditSearch, setAuditSearch,
    auditRole, setAuditRole, filteredAudits, auditPage, setAuditPage,
    totalAuditPages, paginatedAudits, auditSortField, setAuditSortField,
    auditSortOrder, setAuditSortOrder, activitySearch, setActivitySearch,
    activityCategory, setActivityCategory, filteredActivities, activityPage,
    setActivityPage, totalActivityPages, paginatedActivities, activitySortField,
    setActivitySortField, activitySortOrder, setActivitySortOrder, apiLogs,
    apiPage, setApiPage, totalApiPages, paginatedApis, changeHistoryLogs,
    changeHistoryPage, setChangeHistoryPage, totalChangeHistoryPages,
    paginatedChangeHistories, securityLogs, securityPage, setSecurityPage,
    totalSecurityPages, paginatedSecurities, importLogs, importPage,
    setImportPage, totalImportPages, paginatedImports, exportLogs, exportPage,
    setExportPage, totalExportPages, paginatedExports, searchQuery,
    setSearchQuery, searchRole, setSearchRole, searchSource, setSearchSource,
    filteredSearches, searchPage, setSearchPage, totalSearchPages,
    paginatedSearches, searchSortField, setSearchSortField, searchSortOrder,
    setSearchSortOrder, guestLogs, guestPage, setGuestPage, totalGuestPages,
    paginatedGuests, chatSearch, setChatSearch, chatFilterType, setChatFilterType,
    chatMinMsgs, setChatMinMsgs, chatShowOnlyFallbacks, setChatShowOnlyFallbacks,
    filteredSessions, chatbotPage, setChatbotPage, totalChatbotPages,
    paginatedSessions, chatSortField, setChatSortField, chatSortOrder,
    setChatSortOrder, selectedChatLog, setSelectedChatLog, retentionDays,
    setRetentionDays, apiAction, limit
  } = useAdmin();

  useEffect(() => {
    loadLogs();
  }, [logSubTab]);

  const handleExportLogs = async () => {
    try {
      const res = await apiFetch('/admin/logs/export');
      const blob = new Blob([res.csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = res.filename;
      a.click();
    } catch {
      alert('Export failed');
    }
  };

  const statusColor = (s: string) => {
    const m: Record<string, string> = {
      Active: 'green', Approved: 'green', Delivered: 'green', Completed: 'green',
      Pending: 'amber', Open: 'amber', 'In Progress': 'amber', 'Verification In Progress': 'amber',
      Cancelled: 'red', Suspended: 'red', Rejected: 'red', Flagged: 'red',
      Shipped: 'blue', Paid: 'blue',
      Inactive: 'zinc', Resolved: 'zinc', Closed: 'zinc',
    };
    return m[s] ?? 'zinc';
  };

  return (
    <Section>
      {selectedLogDetail ? (
        <div className="p-6 space-y-6 text-zinc-800 dark:text-zinc-200">
          {/* Back button */}
          <div className="flex justify-between items-center border-b pb-3 dark:border-zinc-800">
            <div>
              <h3 className="font-bold text-base text-zinc-905 dark:text-white">Log Entry Details</h3>
              <p className="text-xs text-zinc-400 mt-0.5 font-mono">Log ID: {selectedLogDetail._id}</p>
            </div>
            <button onClick={() => setSelectedLogDetail(null)} className="px-3 py-1.5 border dark:border-zinc-800 text-zinc-650 hover:text-indigo-500 rounded-lg text-xs font-semibold flex items-center gap-1.5 dark:text-zinc-300 bg-white dark:bg-zinc-900 cursor-pointer">
              <X className="h-4 w-4"/> Back to Logs List
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {selectedLogDetail.action && (
              <div className="bg-zinc-50/50 dark:bg-zinc-900/40 p-4 border dark:border-zinc-800 rounded-2xl shadow-sm">
                <span className="block text-[10px] uppercase font-bold tracking-wider text-zinc-400">Action</span>
                <span className="text-sm font-bold mt-1 block text-zinc-900 dark:text-zinc-100">{selectedLogDetail.action}</span>
              </div>
            )}
            {selectedLogDetail.keyword && (
              <div className="bg-zinc-50/50 dark:bg-zinc-900/40 p-4 border dark:border-zinc-800 rounded-2xl shadow-sm">
                <span className="block text-[10px] uppercase font-bold tracking-wider text-zinc-400">Search Keyword</span>
                <span className="text-sm font-semibold mt-1 block text-indigo-650 dark:text-indigo-400 font-mono">{selectedLogDetail.keyword}</span>
              </div>
            )}
            {selectedLogDetail.category && (
              <div className="bg-zinc-50/50 dark:bg-zinc-900/40 p-4 border dark:border-zinc-800 rounded-2xl shadow-sm">
                <span className="block text-[10px] uppercase font-bold tracking-wider text-zinc-400">Category</span>
                <span className="text-sm font-semibold mt-1 block text-zinc-800 dark:text-zinc-200">{selectedLogDetail.category}</span>
              </div>
            )}
            {selectedLogDetail.userRole && (
              <div className="bg-zinc-50/50 dark:bg-zinc-900/40 p-4 border dark:border-zinc-800 rounded-2xl shadow-sm">
                <span className="block text-[10px] uppercase font-bold tracking-wider text-zinc-400">User Role</span>
                <span className="text-sm font-semibold mt-1 block text-zinc-850 dark:text-zinc-200">{selectedLogDetail.userRole}</span>
              </div>
            )}
            {(selectedLogDetail.userId?.email || selectedLogDetail.userId) && (
              <div className="bg-zinc-50/50 dark:bg-zinc-900/40 p-4 border dark:border-zinc-800 rounded-2xl shadow-sm">
                <span className="block text-[10px] uppercase font-bold tracking-wider text-zinc-400">Operator / User</span>
                <span className="text-sm font-semibold mt-1 block text-zinc-800 dark:text-zinc-200">{selectedLogDetail.userId?.email || 'System / Guest'}</span>
              </div>
            )}
            {selectedLogDetail.ipAddress && (
              <div className="bg-zinc-50/50 dark:bg-zinc-900/40 p-4 border dark:border-zinc-800 rounded-2xl shadow-sm">
                <span className="block text-[10px] uppercase font-bold tracking-wider text-zinc-400">IP Address</span>
                <span className="text-sm font-semibold mt-1 block font-mono text-zinc-800 dark:text-zinc-200">{selectedLogDetail.ipAddress}</span>
              </div>
            )}
            {selectedLogDetail.resultsCount !== undefined && (
              <div className="bg-zinc-50/50 dark:bg-zinc-900/40 p-4 border dark:border-zinc-800 rounded-2xl shadow-sm">
                <span className="block text-[10px] uppercase font-bold tracking-wider text-zinc-400">Results Count</span>
                <span className="text-sm font-semibold mt-1 block text-zinc-800 dark:text-zinc-200">{selectedLogDetail.resultsCount} results</span>
              </div>
            )}
            {selectedLogDetail.source && (
              <div className="bg-zinc-50/50 dark:bg-zinc-900/40 p-4 border dark:border-zinc-800 rounded-2xl shadow-sm">
                <span className="block text-[10px] uppercase font-bold tracking-wider text-zinc-400">Source Platform</span>
                <span className="text-sm font-semibold mt-1 block uppercase font-mono text-zinc-800 dark:text-zinc-200">{selectedLogDetail.source}</span>
              </div>
            )}
            {selectedLogDetail.resource && (
              <div className="bg-zinc-50/50 dark:bg-zinc-900/40 p-4 border dark:border-zinc-800 rounded-2xl shadow-sm">
                <span className="block text-[10px] uppercase font-bold tracking-wider text-zinc-400">Target Resource</span>
                <span className="text-sm font-semibold mt-1 block font-mono truncate text-zinc-800 dark:text-zinc-200" title={selectedLogDetail.resource}>{selectedLogDetail.resource}</span>
              </div>
            )}
            {selectedLogDetail.createdAt && (
              <div className="bg-zinc-50/50 dark:bg-zinc-900/40 p-4 border dark:border-zinc-800 rounded-2xl shadow-sm">
                <span className="block text-[10px] uppercase font-bold tracking-wider text-zinc-400">Timestamp</span>
                <span className="text-sm font-semibold mt-1 block text-zinc-800 dark:text-zinc-200">{new Date(selectedLogDetail.createdAt).toLocaleString()}</span>
              </div>
            )}
            {selectedLogDetail.browser && (
              <div className="bg-zinc-50/50 dark:bg-zinc-900/40 p-4 border dark:border-zinc-800 rounded-2xl shadow-sm">
                <span className="block text-[10px] uppercase font-bold tracking-wider text-zinc-400">Browser / Agent</span>
                <span className="text-xs font-semibold mt-1 block truncate text-zinc-505 dark:text-zinc-400" title={selectedLogDetail.browser}>{selectedLogDetail.browser}</span>
              </div>
            )}
            {selectedLogDetail.device && (
              <div className="bg-zinc-50/50 dark:bg-zinc-900/40 p-4 border dark:border-zinc-800 rounded-2xl shadow-sm">
                <span className="block text-[10px] uppercase font-bold tracking-wider text-zinc-400">Device Platform</span>
                <span className="text-sm font-semibold mt-1 block text-zinc-800 dark:text-zinc-200">{selectedLogDetail.device}</span>
              </div>
            )}
            {selectedLogDetail.endpoint && (
              <>
                <div className="bg-zinc-50/50 dark:bg-zinc-900/40 p-4 border dark:border-zinc-800 rounded-2xl shadow-sm">
                  <span className="block text-[10px] uppercase font-bold tracking-wider text-zinc-400">HTTP Method & Path</span>
                  <span className="text-sm font-bold mt-1 block text-zinc-900 dark:text-zinc-100">
                    {badge(selectedLogDetail.method === 'GET' ? 'green' : 'blue', selectedLogDetail.method)} {selectedLogDetail.endpoint}
                  </span>
                </div>
                <div className="bg-zinc-50/50 dark:bg-zinc-900/40 p-4 border dark:border-zinc-800 rounded-2xl shadow-sm">
                  <span className="block text-[10px] uppercase font-bold tracking-wider text-zinc-400">Status & Latency</span>
                  <span className="text-sm font-semibold mt-1 block">
                    {badge(selectedLogDetail.status < 400 ? 'green' : 'red', String(selectedLogDetail.status))} in {selectedLogDetail.latencyMs} ms
                  </span>
                </div>
                <div className="bg-zinc-50/50 dark:bg-zinc-900/40 p-4 border dark:border-zinc-800 rounded-2xl shadow-sm">
                  <span className="block text-[10px] uppercase font-bold tracking-wider text-zinc-400">Payload Sizes</span>
                  <span className="text-sm font-semibold mt-1 block text-zinc-500">
                    Req: {selectedLogDetail.requestSize} B | Res: {selectedLogDetail.responseSize} B
                  </span>
                </div>
              </>
            )}
            {selectedLogDetail.changedField && (
              <>
                <div className="bg-zinc-50/50 dark:bg-zinc-900/40 p-4 border dark:border-zinc-800 rounded-2xl shadow-sm">
                  <span className="block text-[10px] uppercase font-bold tracking-wider text-zinc-400">Entity Type & ID</span>
                  <span className="text-sm font-bold mt-1 block font-mono text-zinc-800 dark:text-zinc-200">
                    {selectedLogDetail.entityType} ({selectedLogDetail.entityId})
                  </span>
                </div>
                <div className="bg-zinc-50/50 dark:bg-zinc-900/40 p-4 border dark:border-zinc-800 rounded-2xl shadow-sm">
                  <span className="block text-[10px] uppercase font-bold tracking-wider text-zinc-400">Changed Field Name</span>
                  <span className="text-sm font-bold mt-1 block text-indigo-600 dark:text-indigo-400 font-mono">
                    {selectedLogDetail.changedField}
                  </span>
                </div>
                <div className="bg-zinc-50/50 dark:bg-zinc-900/40 p-4 border dark:border-zinc-800 rounded-2xl shadow-sm">
                  <span className="block text-[10px] uppercase font-bold tracking-wider">Operator Profile</span>
                  <span className="text-sm font-semibold mt-1 block text-zinc-805 dark:text-zinc-200">
                    {selectedLogDetail.changedByName} ({selectedLogDetail.changedRole})
                  </span>
                </div>
              </>
            )}
          </div>

          {selectedLogDetail.changedField && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-zinc-50/50 dark:bg-zinc-900/40 border dark:border-zinc-800 rounded-2xl p-5 shadow-sm">
              <div>
                <span className="block text-[10px] uppercase font-bold tracking-wider text-red-500 mb-2">Before Change (Old Value)</span>
                <pre className="bg-red-50/50 dark:bg-red-950/10 p-4 rounded-xl border border-red-105 dark:border-red-900/30 font-mono text-xs overflow-x-auto whitespace-pre-wrap text-red-800 dark:text-red-300">
                  {selectedLogDetail.previousValue}
                </pre>
              </div>
              <div>
                <span className="block text-[10px] uppercase font-bold tracking-wider text-emerald-500 mb-2">After Change (New Value)</span>
                <pre className="bg-emerald-50/50 dark:bg-emerald-950/10 p-4 rounded-xl border border-emerald-105 dark:border-emerald-900/30 font-mono text-xs overflow-x-auto whitespace-pre-wrap text-emerald-800 dark:text-emerald-300">
                  {selectedLogDetail.newValue}
                </pre>
              </div>
            </div>
          )}

          {selectedLogDetail.details && (
            <div className="bg-zinc-50/50 dark:bg-zinc-900/40 border dark:border-zinc-800 rounded-2xl p-5 space-y-2 shadow-sm">
              <span className="block text-[10px] uppercase font-bold tracking-wider text-zinc-400">Details / Payload</span>
              <div className="bg-white dark:bg-zinc-955 p-4 rounded-xl border dark:border-zinc-900 font-mono text-xs overflow-x-auto whitespace-pre-wrap text-zinc-800 dark:text-zinc-200">
                {selectedLogDetail.details}
              </div>
            </div>
          )}
        </div>
      ) : (
        <>
          <SectionHeader title="Enterprise Log Registries" desc="Audit trails, keyword searches, and platform database activity."
            right={
              <button onClick={handleExportLogs}
                className="flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-55 text-white rounded-lg text-xs font-semibold shadow cursor-pointer border-0">
                <Download className="h-3.5 w-3.5" /> Export Logs
              </button>
            } />
          
          {/* Tabs */}
          <div className="flex border-b dark:border-zinc-800 px-6 bg-zinc-50/30 dark:bg-zinc-900/10 overflow-x-auto whitespace-nowrap scrollbar-thin">
            {[
              { key: 'analytics', label: 'Dashboard' },
              { key: 'audit', label: 'System Audits' },
              { key: 'activity', label: 'Activities' },
              { key: 'api', label: 'API Logs' },
              { key: 'changehistory', label: 'Change History' },
              { key: 'security', label: 'Security' },
              { key: 'importexport', label: 'Imports/Exports' },
              { key: 'search', label: 'Searches' },
              { key: 'guest', label: 'Guest Visits' },
              { key: 'chatbot', label: 'Chatbot Conversations' },
              { key: 'retention', label: 'Retention' }
            ].map(t => (
              <button key={t.key} onClick={() => setLogSubTab(t.key as any)}
                className={`px-4 py-3 text-xs font-bold border-b-2 -mb-[2px] transition-all cursor-pointer bg-transparent border-t-0 border-x-0 ${
                  logSubTab === t.key
                    ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                    : 'border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
                }`}>
                {t.label}
              </button>
            ))}
          </div>

          {loading ? <Loading /> : (
            <div className="p-4">
              {/* 1. ANALYTICS DASHBOARD SUBTAB */}
              {logSubTab === 'analytics' && logAnalytics && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard label="Total Logs Recorded" value={logAnalytics.totalLogsToday} icon={<Database className="h-4 w-4"/>} color="indigo" />
                    <StatCard label="API Requests (Total)" value={logAnalytics.totalApiCalls} icon={<Activity className="h-4 w-4"/>} color="blue" />
                    <StatCard label="Security Alerts Triggered" value={logAnalytics.securityAlerts} icon={<ShieldAlert className="h-4 w-4"/>} color="rose" />
                    <StatCard label="Failed Login Records" value={logAnalytics.failedLogins} icon={<Lock className="h-4 w-4"/>} color="amber" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Actions by Role Card */}
                    <div className="bg-white dark:bg-zinc-900 border dark:border-zinc-800 rounded-2xl p-5 shadow-sm space-y-4">
                      <h4 className="font-bold text-xs uppercase tracking-wider text-zinc-400 border-b pb-2 dark:border-zinc-800">Actions By Role Profile</h4>
                      <div className="space-y-3 pt-1">
                        <div className="flex justify-between text-xs">
                          <span className="font-medium text-zinc-650 dark:text-zinc-400">Admin Actions</span>
                          <span className="font-bold text-zinc-900 dark:text-white">{logAnalytics.totalAdminActions}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="font-medium text-zinc-655 dark:text-zinc-400">Customer Actions</span>
                          <span className="font-bold text-zinc-900 dark:text-white">{logAnalytics.totalCustomerActions}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="font-medium text-zinc-655 dark:text-zinc-400">Seller/Vendor Actions</span>
                          <span className="font-bold text-zinc-900 dark:text-white">{logAnalytics.totalSellerActions}</span>
                        </div>
                      </div>
                    </div>

                    {/* Activity Rate Mock graph */}
                    <div className="bg-white dark:bg-zinc-900 border dark:border-zinc-800 rounded-2xl p-5 shadow-sm md:col-span-2 space-y-4">
                      <h4 className="font-bold text-xs uppercase tracking-wider text-zinc-400 border-b pb-2 dark:border-zinc-800">Weekly System Activity Graph</h4>
                      <div className="flex items-end justify-between h-[120px] pt-4 px-2">
                        {logAnalytics.activityTimeline?.map((item: any) => (
                          <div key={item.date} className="flex flex-col items-center gap-1.5 flex-1">
                            <div className="w-6 bg-indigo-500 rounded-t" style={{ height: `${(item.value / 250) * 100}px` }} title={`${item.value} logs`}></div>
                            <span className="text-[10px] text-zinc-400 font-mono">{item.date}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 2. SYSTEM AUDIT SUBTAB */}
              {logSubTab === 'audit' && (
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-3 p-3 bg-zinc-50 dark:bg-zinc-900/40 border dark:border-zinc-800 rounded-xl text-xs">
                    <input type="text" value={auditSearch} onChange={e=>setAuditSearch(e.target.value)}
                      placeholder="Search action, resource, email, IP..."
                      className="px-3 py-1.5 border dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-lg focus:ring-1 focus:ring-indigo-500 outline-none text-zinc-800 dark:text-zinc-100 flex-1 min-w-[200px]" />
                    <select value={auditRole} onChange={e=>setAuditRole(e.target.value)}
                      className="px-3 py-1.5 border dark:border-zinc-800 bg-white dark:bg-zinc-905 rounded-lg focus:ring-1 focus:ring-indigo-500 outline-none text-zinc-850 dark:text-zinc-100 cursor-pointer">
                      <option value="all">All Roles</option>
                      <option value="Admin">Admin</option>
                      <option value="Super Admin">Super Admin</option>
                      <option value="Manager">Manager</option>
                    </select>
                  </div>
                  <div className="flex justify-between items-center text-xs text-zinc-500 font-semibold px-2">
                    <span>Showing {filteredAudits.length > 0 ? (auditPage - 1) * limit + 1 : 0}-{Math.min(filteredAudits.length, auditPage * limit)} of {filteredAudits.length} Audits</span>
                  </div>
                  <Table>
                    <Thead><tr>
                      {renderSortableHeader('Action', 'action', auditSortField, auditSortOrder, (f, o) => { setAuditSortField(f); setAuditSortOrder(o); })}
                      {renderSortableHeader('Resource', 'resource', auditSortField, auditSortOrder, (f, o) => { setAuditSortField(f); setAuditSortOrder(o); })}
                      {renderSortableHeader('Operator', 'operator', auditSortField, auditSortOrder, (f, o) => { setAuditSortField(f); setAuditSortOrder(o); })}
                      {renderSortableHeader('IP Address', 'ipAddress', auditSortField, auditSortOrder, (f, o) => { setAuditSortField(f); setAuditSortOrder(o); })}
                      {renderSortableHeader('Date', 'createdAt', auditSortField, auditSortOrder, (f, o) => { setAuditSortField(f); setAuditSortOrder(o); })}
                    </tr></Thead>
                    <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                      {paginatedAudits.map((l: any) => (
                        <tr key={l._id} className="text-xs hover:bg-zinc-50 dark:hover:bg-zinc-800/40 cursor-pointer" onClick={() => setSelectedLogDetail(l)}>
                          <td className="px-4 py-3 font-semibold text-zinc-900 dark:text-white">{l.action}</td>
                          <td className="px-4 py-3 text-zinc-505">{l.resource}</td>
                          <td className="px-4 py-3 text-zinc-505">{l.userId?.email || 'System'}</td>
                          <td className="px-4 py-3 text-zinc-400 font-mono">{l.ipAddress}</td>
                          <td className="px-4 py-3 text-zinc-400">{new Date(l.createdAt).toLocaleString()}</td>
                        </tr>
                      ))}
                      {filteredAudits.length === 0 && (
                        <tr>
                          <td colSpan={5} className="text-center py-6 text-zinc-400">No audits found matching filters.</td>
                        </tr>
                      )}
                    </tbody>
                  </Table>
                  <Pagination currentPage={auditPage} totalPages={totalAuditPages} onPageChange={setAuditPage} />
                </div>
              )}

              {/* 3. USER ACTIVITY SUBTAB */}
              {logSubTab === 'activity' && (
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-3 p-3 bg-zinc-50 dark:bg-zinc-900/40 border dark:border-zinc-800 rounded-xl text-xs">
                    <input type="text" value={activitySearch} onChange={e=>setActivitySearch(e.target.value)}
                      placeholder="Search action or details..."
                      className="px-3 py-1.5 border dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-lg focus:ring-1 focus:ring-indigo-500 outline-none text-zinc-800 dark:text-zinc-100 flex-1 min-w-[200px]" />
                    <select value={activityCategory} onChange={e=>setActivityCategory(e.target.value)}
                      className="px-3 py-1.5 border dark:border-zinc-800 bg-white dark:bg-zinc-905 rounded-lg focus:ring-1 focus:ring-indigo-500 outline-none text-zinc-850 dark:text-zinc-100 cursor-pointer">
                      <option value="all">All Categories</option>
                      <option value="Login">Authentication</option>
                      <option value="Profile">Profile / Address</option>
                      <option value="Product">Catalog / Search</option>
                      <option value="Order">Cart / Order / Review</option>
                      <option value="Vendors">KYC / Payouts</option>
                      <option value="Settings">Configuration</option>
                    </select>
                  </div>
                  <div className="flex justify-between items-center text-xs text-zinc-500 font-semibold px-2">
                    <span>Showing {filteredActivities.length > 0 ? (activityPage - 1) * limit + 1 : 0}-{Math.min(filteredActivities.length, activityPage * limit)} of {filteredActivities.length} Activities</span>
                  </div>
                  <Table>
                    <Thead><tr>
                      {renderSortableHeader('Action', 'action', activitySortField, activitySortOrder, (f, o) => { setActivitySortField(f); setActivitySortOrder(o); })}
                      {renderSortableHeader('Category', 'category', activitySortField, activitySortOrder, (f, o) => { setActivitySortField(f); setActivitySortOrder(o); })}
                      {renderSortableHeader('Details', 'details', activitySortField, activitySortOrder, (f, o) => { setActivitySortField(f); setActivitySortOrder(o); })}
                      {renderSortableHeader('Timestamp', 'createdAt', activitySortField, activitySortOrder, (f, o) => { setActivitySortField(f); setActivitySortOrder(o); })}
                    </tr></Thead>
                    <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                      {paginatedActivities.map((l: any) => (
                        <tr key={l._id} className="text-xs hover:bg-zinc-50 dark:hover:bg-zinc-800/40 cursor-pointer" onClick={() => setSelectedLogDetail(l)}>
                          <td className="px-4 py-3 font-semibold text-zinc-800 dark:text-zinc-200">{l.action}</td>
                          <td className="px-4 py-3">{badge('blue', l.category)}</td>
                          <td className="px-4 py-3 text-zinc-505">{l.details}</td>
                          <td className="px-4 py-3 text-zinc-400">{new Date(l.createdAt).toLocaleTimeString()}</td>
                        </tr>
                      ))}
                      {filteredActivities.length === 0 && (
                        <tr>
                          <td colSpan={4} className="text-center py-6 text-zinc-400">No activities found matching filters.</td>
                        </tr>
                      )}
                    </tbody>
                  </Table>
                  <Pagination currentPage={activityPage} totalPages={totalActivityPages} onPageChange={setActivityPage} />
                </div>
              )}

              {/* 4. API REQUESTS SUBTAB */}
              {logSubTab === 'api' && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-xs text-zinc-500 font-semibold px-2">
                    <span>Showing {apiLogs.length > 0 ? (apiPage - 1) * limit + 1 : 0}-{Math.min(apiLogs.length, apiPage * limit)} of {apiLogs.length} API Requests</span>
                  </div>
                  <Table>
                    <Thead><tr>
                      <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-zinc-500">Method</th>
                      <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-zinc-500">Endpoint</th>
                      <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-zinc-500">Status</th>
                      <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-zinc-500">Latency</th>
                      <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-zinc-500">Size (Req/Res)</th>
                      <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-zinc-500">IP Address</th>
                    </tr></Thead>
                    <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                      {paginatedApis.map((l: any) => (
                        <tr key={l._id} className="text-xs hover:bg-zinc-50 dark:hover:bg-zinc-800/40 cursor-pointer" onClick={() => setSelectedLogDetail(l)}>
                          <td className="px-4 py-3">{badge(l.method === 'GET' ? 'green' : 'blue', l.method)}</td>
                          <td className="px-4 py-3 font-mono text-zinc-800 dark:text-zinc-200 font-semibold truncate max-w-[200px]" title={l.endpoint}>{l.endpoint}</td>
                          <td className="px-4 py-3">{badge(l.status < 400 ? 'green' : 'red', String(l.status))}</td>
                          <td className="px-4 py-3 text-zinc-505 font-semibold">{l.latencyMs} ms</td>
                          <td className="px-4 py-3 text-zinc-400 font-mono">{l.requestSize}B / {l.responseSize}B</td>
                          <td className="px-4 py-3 text-zinc-400 font-mono">{l.ipAddress}</td>
                        </tr>
                      ))}
                      {apiLogs.length === 0 && (
                        <tr>
                          <td colSpan={6} className="text-center py-6 text-zinc-400">No API audit logs recorded.</td>
                        </tr>
                      )}
                    </tbody>
                  </Table>
                  <Pagination currentPage={apiPage} totalPages={totalApiPages} onPageChange={setApiPage} />
                </div>
              )}

              {/* 5. CHANGE HISTORY DIFF SUBTAB */}
              {logSubTab === 'changehistory' && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-xs text-zinc-500 font-semibold px-2">
                    <span>Showing {changeHistoryLogs.length > 0 ? (changeHistoryPage - 1) * limit + 1 : 0}-{Math.min(changeHistoryLogs.length, changeHistoryPage * limit)} of {changeHistoryLogs.length} Document Changes</span>
                  </div>
                  <Table>
                    <Thead><tr>
                      <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-zinc-500">Entity</th>
                      <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-zinc-500">ID</th>
                      <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-zinc-500">Field</th>
                      <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-zinc-500">Previous Value</th>
                      <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-zinc-500">New Value</th>
                      <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-zinc-500">Operator</th>
                    </tr></Thead>
                    <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800 font-mono text-[11px]">
                      {paginatedChangeHistories.map((l: any) => (
                        <tr key={l._id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40 cursor-pointer" onClick={() => setSelectedLogDetail(l)}>
                          <td className="px-4 py-3 text-zinc-800 dark:text-zinc-200 font-bold">{l.entityType}</td>
                          <td className="px-4 py-3 text-zinc-400 truncate max-w-[80px]">{l.entityId}</td>
                          <td className="px-4 py-3 text-indigo-600 dark:text-indigo-400 font-semibold">{l.changedField}</td>
                          <td className="px-4 py-3 text-red-500 line-through truncate max-w-[120px]">{l.previousValue}</td>
                          <td className="px-4 py-3 text-emerald-600 dark:text-emerald-400 font-bold truncate max-w-[120px]">{l.newValue}</td>
                          <td className="px-4 py-3 text-zinc-505 font-sans text-xs">{l.changedByName}</td>
                        </tr>
                      ))}
                      {changeHistoryLogs.length === 0 && (
                        <tr>
                          <td colSpan={6} className="text-center py-6 text-zinc-400">No database document diff logs found.</td>
                        </tr>
                      )}
                    </tbody>
                  </Table>
                  <Pagination currentPage={changeHistoryPage} totalPages={totalChangeHistoryPages} onPageChange={setChangeHistoryPage} />
                </div>
              )}

              {/* 6. SECURITY LOGS SUBTAB */}
              {logSubTab === 'security' && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-xs text-zinc-505 font-semibold px-2">
                    <span>Showing {securityLogs.length > 0 ? (securityPage - 1) * limit + 1 : 0}-{Math.min(securityLogs.length, securityPage * limit)} of {securityLogs.length} Security Alerts</span>
                  </div>
                  <Table>
                    <Thead><tr>
                      <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-zinc-500">Severity</th>
                      <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-zinc-500">Alert Action</th>
                      <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-zinc-500">Details</th>
                      <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-zinc-500">IP Address</th>
                      <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-zinc-500">Status</th>
                    </tr></Thead>
                    <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                      {paginatedSecurities.map((l: any) => (
                        <tr key={l._id} className="text-xs hover:bg-zinc-50 dark:hover:bg-zinc-800/40 cursor-pointer" onClick={() => setSelectedLogDetail(l)}>
                          <td className="px-4 py-3">{badge(l.severity === 'Critical' || l.severity === 'High' ? 'red' : l.severity === 'Medium' ? 'amber' : 'blue', l.severity)}</td>
                          <td className="px-4 py-3 font-semibold text-zinc-900 dark:text-white">{l.action}</td>
                          <td className="px-4 py-3 text-zinc-500 truncate max-w-[200px]" title={l.details}>{l.details}</td>
                          <td className="px-4 py-3 text-zinc-400 font-mono">{l.ipAddress}</td>
                          <td className="px-4 py-3">{badge(l.status === 'Blocked' ? 'red' : 'zinc', l.status)}</td>
                        </tr>
                      ))}
                      {securityLogs.length === 0 && (
                        <tr>
                          <td colSpan={5} className="text-center py-6 text-rose-500 font-semibold">No security flags raised. Excellent!</td>
                        </tr>
                      )}
                    </tbody>
                  </Table>
                  <Pagination currentPage={securityPage} totalPages={totalSecurityPages} onPageChange={setSecurityPage} />
                </div>
              )}

              {/* 7. IMPORT/EXPORT RECORDS SUBTAB */}
              {logSubTab === 'importexport' && (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h3 className="font-bold text-xs uppercase tracking-wider text-zinc-400 pl-2">Bulk Import History</h3>
                    <Table>
                      <Thead><tr>
                        <th className="px-3 py-2 text-left text-[10px] font-bold uppercase tracking-wider text-zinc-500">Module</th>
                        <th className="px-3 py-2 text-left text-[10px] font-bold uppercase tracking-wider text-zinc-500">File Name</th>
                        <th className="px-3 py-2 text-left text-[10px] font-bold uppercase tracking-wider text-zinc-500">Records (S/F)</th>
                      </tr></Thead>
                      <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800 text-xs">
                        {paginatedImports.map((l: any) => (
                          <tr key={l._id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40 cursor-pointer" onClick={() => setSelectedLogDetail(l)}>
                            <td className="px-3 py-2 font-bold text-zinc-900 dark:text-zinc-100">{l.module}</td>
                            <td className="px-3 py-2 text-zinc-505 truncate max-w-[120px]" title={l.fileName}>{l.fileName}</td>
                            <td className="px-3 py-2 font-mono text-zinc-655"><span className="text-emerald-600">{l.successRecords}</span>/<span className="text-red-500">{l.failedRecords}</span></td>
                          </tr>
                        ))}
                        {importLogs.length === 0 && (
                          <tr>
                            <td colSpan={3} className="text-center py-6 text-zinc-400">No bulk imports logged.</td>
                          </tr>
                        )}
                      </tbody>
                    </Table>
                    <Pagination currentPage={importPage} totalPages={totalImportPages} onPageChange={setImportPage} />
                  </div>

                  <div className="space-y-3">
                    <h3 className="font-bold text-xs uppercase tracking-wider text-zinc-400 pl-2">Data Export History</h3>
                    <Table>
                      <Thead><tr>
                        <th className="px-3 py-2 text-left text-[10px] font-bold uppercase tracking-wider text-zinc-500">Module</th>
                        <th className="px-3 py-2 text-left text-[10px] font-bold uppercase tracking-wider text-zinc-500">Type</th>
                        <th className="px-3 py-2 text-left text-[10px] font-bold uppercase tracking-wider text-zinc-500">Count</th>
                      </tr></Thead>
                      <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800 text-xs">
                        {paginatedExports.map((l: any) => (
                          <tr key={l._id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40 cursor-pointer" onClick={() => setSelectedLogDetail(l)}>
                            <td className="px-3 py-2 font-bold text-zinc-900 dark:text-zinc-100">{l.exportModule}</td>
                            <td className="px-3 py-2 text-zinc-505">{l.exportType} ({l.fileFormat})</td>
                            <td className="px-3 py-2 font-mono text-indigo-650 font-semibold">{l.numberOfRecords} recs</td>
                          </tr>
                        ))}
                        {exportLogs.length === 0 && (
                          <tr>
                            <td colSpan={3} className="text-center py-6 text-zinc-400">No data exports logged.</td>
                          </tr>
                        )}
                      </tbody>
                    </Table>
                    <Pagination currentPage={exportPage} totalPages={totalExportPages} onPageChange={setExportPage} />
                  </div>
                </div>
              )}

              {/* 8. SEARCH QUERIES SUBTAB */}
              {logSubTab === 'search' && (
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-3 p-3 bg-zinc-50 dark:bg-zinc-900/40 border dark:border-zinc-800 rounded-xl text-xs">
                    <input type="text" value={searchQuery} onChange={e=>setSearchQuery(e.target.value)}
                      placeholder="Search keyword..."
                      className="px-3 py-1.5 border dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-lg focus:ring-1 focus:ring-indigo-500 outline-none text-zinc-800 dark:text-zinc-100 flex-1 min-w-[200px]" />
                    <select value={searchRole} onChange={e=>setSearchRole(e.target.value)}
                      className="px-3 py-1.5 border dark:border-zinc-800 bg-white dark:bg-zinc-905 rounded-lg focus:ring-1 focus:ring-indigo-500 outline-none text-zinc-850 dark:text-zinc-100 cursor-pointer">
                      <option value="all">All Roles</option>
                      <option value="Customer">Customer</option>
                      <option value="Guest">Guest</option>
                    </select>
                    <select value={searchSource} onChange={e=>setSearchSource(e.target.value)}
                      className="px-3 py-1.5 border dark:border-zinc-800 bg-white dark:bg-zinc-905 rounded-lg focus:ring-1 focus:ring-indigo-500 outline-none text-zinc-850 dark:text-zinc-100 cursor-pointer">
                      <option value="all">All Sources</option>
                      <option value="web">Web</option>
                      <option value="mobile">Mobile</option>
                    </select>
                  </div>
                  <div className="flex justify-between items-center text-xs text-zinc-505 font-semibold px-2">
                    <span>Showing {filteredSearches.length > 0 ? (searchPage - 1) * limit + 1 : 0}-{Math.min(filteredSearches.length, searchPage * limit)} of {filteredSearches.length} Searches</span>
                  </div>
                  <Table>
                    <Thead><tr>
                      {renderSortableHeader('Keyword', 'keyword', searchSortField, searchSortOrder, (f, o) => { setSearchSortField(f); setSearchSortOrder(o); })}
                      {renderSortableHeader('Role', 'userRole', searchSortField, searchSortOrder, (f, o) => { setSearchSortField(f); setSearchSortOrder(o); })}
                      {renderSortableHeader('Category', 'category', searchSortField, searchSortOrder, (f, o) => { setSearchSortField(f); setSearchSortOrder(o); })}
                      {renderSortableHeader('Result Count', 'resultsCount', searchSortField, searchSortOrder, (f, o) => { setSearchSortField(f); setSearchSortOrder(o); })}
                      {renderSortableHeader('Source', 'source', searchSortField, searchSortOrder, (f, o) => { setSearchSortField(f); setSearchSortOrder(o); })}
                    </tr></Thead>
                    <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                      {paginatedSearches.map((l: any) => (
                        <tr key={l._id} className="text-xs hover:bg-zinc-50 dark:hover:bg-zinc-800/40 cursor-pointer" onClick={() => setSelectedLogDetail(l)}>
                          <td className="px-4 py-3 font-bold text-indigo-600">{l.keyword}</td>
                          <td className="px-4 py-3 text-zinc-505">{l.userRole}</td>
                          <td className="px-4 py-3 text-zinc-505">{l.category}</td>
                          <td className="px-4 py-3 text-zinc-505 font-semibold">{l.resultsCount}</td>
                          <td className="px-4 py-3 text-zinc-400">{l.source}</td>
                        </tr>
                      ))}
                      {filteredSearches.length === 0 && (
                        <tr>
                          <td colSpan={5} className="text-center py-6 text-zinc-400">No searches found matching filters.</td>
                        </tr>
                      )}
                    </tbody>
                  </Table>
                  <Pagination currentPage={searchPage} totalPages={totalSearchPages} onPageChange={setSearchPage} />
                </div>
              )}

              {/* 9. GUEST VISITS SUBTAB */}
              {logSubTab === 'guest' && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-xs text-zinc-505 font-semibold px-2">
                    <span>Showing {guestLogs.length > 0 ? (guestPage - 1) * limit + 1 : 0}-{Math.min(guestLogs.length, guestPage * limit)} of {guestLogs.length} Anonymous Guest Visits</span>
                  </div>
                  <Table>
                    <Thead><tr>
                      <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-zinc-500">Session ID</th>
                      <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-zinc-500">IP Address</th>
                      <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-zinc-500">Browser / Device</th>
                      <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-zinc-500">Location</th>
                      <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-zinc-500">Landing Page</th>
                      <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-zinc-500">Time on Site</th>
                    </tr></Thead>
                    <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                      {paginatedGuests.map((l: any) => (
                        <tr key={l._id} className="text-xs hover:bg-zinc-50 dark:hover:bg-zinc-800/40 cursor-pointer" onClick={() => setSelectedLogDetail(l)}>
                          <td className="px-4 py-3 font-mono text-[10px] text-zinc-900 dark:text-white font-semibold">{l.sessionId}</td>
                          <td className="px-4 py-3 text-zinc-400 font-mono">{l.ipAddress}</td>
                          <td className="px-4 py-3 text-zinc-505">{l.browser} ({l.device})</td>
                          <td className="px-4 py-3 text-zinc-550">{l.city || 'Unknown'}, {l.country}</td>
                          <td className="px-4 py-3 font-mono text-zinc-505 truncate max-w-[120px]">{l.landingPage}</td>
                          <td className="px-4 py-3 font-bold text-zinc-705 dark:text-zinc-300">{l.timeOnSite} sec</td>
                        </tr>
                      ))}
                      {guestLogs.length === 0 && (
                        <tr>
                          <td colSpan={6} className="text-center py-6 text-zinc-400">No anonymous visitor stats logged.</td>
                        </tr>
                      )}
                    </tbody>
                  </Table>
                  <Pagination currentPage={guestPage} totalPages={totalGuestPages} onPageChange={setGuestPage} />
                </div>
              )}

              {/* 10. CHATBOT INTENTS LOG SUBTAB */}
              {logSubTab === 'chatbot' && (
                <div className="space-y-4">
                  <div className="bg-zinc-50 dark:bg-zinc-900/40 p-4 rounded-xl border dark:border-zinc-800 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-505 mb-1">Search</label>
                      <input type="text" value={chatSearch} onChange={(e) => setChatSearch(e.target.value)}
                        placeholder="Session ID or Owner..."
                        className="w-full px-3 py-2 border dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-lg focus:ring-1 focus:ring-indigo-500 outline-none text-zinc-800 dark:text-zinc-100" />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-505 mb-1">Owner Type</label>
                      <select value={chatFilterType} onChange={(e) => setChatFilterType(e.target.value)}
                        className="w-full px-3 py-2 border dark:border-zinc-805 bg-white dark:bg-zinc-900 rounded-lg focus:ring-1 focus:ring-indigo-500 outline-none text-zinc-800 dark:text-zinc-100 cursor-pointer">
                         <option value="all">All Owners</option>
                        <option value="users">Registered Users</option>
                        <option value="guests">Guests Only</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-505 mb-1">Min Messages</label>
                      <select value={chatMinMsgs} onChange={(e) => setChatMinMsgs(Number(e.target.value))}
                        className="w-full px-3 py-2 border dark:border-zinc-805 bg-white dark:bg-zinc-900 rounded-lg focus:ring-1 focus:ring-indigo-500 outline-none text-zinc-800 dark:text-zinc-100 cursor-pointer">
                        <option value="0">Any count</option>
                        <option value="2">2+ messages</option>
                        <option value="5">5+ messages</option>
                        <option value="10">10+ messages</option>
                        <option value="20">20+ messages</option>
                      </select>
                    </div>

                    <div className="flex items-center pt-5">
                      <label className="flex items-center gap-2 text-zinc-650 dark:text-zinc-400 cursor-pointer select-none">
                        <input type="checkbox" checked={chatShowOnlyFallbacks} onChange={(e) => setChatShowOnlyFallbacks(e.target.checked)}
                          className="rounded border-zinc-300 dark:border-zinc-700 text-indigo-600 focus:ring-indigo-500 h-4 w-4 cursor-pointer" />
                        <span>Show only Fallbacks</span>
                      </label>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="md:col-span-1 border dark:border-zinc-800 rounded-xl overflow-hidden bg-white dark:bg-zinc-900 h-[550px] flex flex-col">
                      <div className="p-3 bg-zinc-50 dark:bg-zinc-900 border-b dark:border-zinc-800 text-[10px] text-zinc-505 font-bold uppercase tracking-wider flex justify-between items-center">
                        <span>Sessions: {filteredSessions.length}</span>
                      </div>
                      <div className="flex-1 overflow-y-auto">
                        <Table>
                          <Thead><tr>
                            {renderSortableHeader('Session ID', 'sessionId', chatSortField, chatSortOrder, (f, o) => { setChatSortField(f); setChatSortOrder(o); })}
                            {renderSortableHeader('Owner', 'owner', chatSortField, chatSortOrder, (f, o) => { setChatSortField(f); setChatSortOrder(o); })}
                            {renderSortableHeader('Msgs', 'msgs', chatSortField, chatSortOrder, (f, o) => { setChatSortField(f); setChatSortOrder(o); })}
                          </tr></Thead>
                          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                            {paginatedSessions.map((session: any) => (
                              <tr key={session._id}
                                className={`text-xs hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 cursor-pointer ${
                                  selectedChatLog?.sessionId === session.sessionId
                                    ? 'bg-indigo-50/40 dark:bg-indigo-950/20'
                                    : ''
                                }`}
                                onClick={() => setSelectedChatLog(session)}>
                                <td className="px-3 py-3 font-mono text-[10px] text-zinc-900 dark:text-white truncate max-w-[100px]">
                                  {session.sessionId}
                                </td>
                                <td className="px-3 py-3 text-zinc-500 truncate max-w-[80px]">
                                  {session.userId?.email || session.guestId || 'Guest'}
                                </td>
                                <td className="px-3 py-3 font-semibold text-indigo-650 dark:text-indigo-400">
                                  {session.messages?.length || 0}
                                </td>
                              </tr>
                            ))}
                            {filteredSessions.length === 0 && (
                              <tr>
                                <td colSpan={3} className="text-center py-8 text-zinc-400 text-xs">
                                  No sessions found matching filters.
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </Table>
                      </div>
                      <div className="border-t dark:border-zinc-800 p-2 bg-zinc-50/50 dark:bg-zinc-900/10">
                        <Pagination currentPage={chatbotPage} totalPages={totalChatbotPages} onPageChange={setChatbotPage} />
                      </div>
                    </div>

                    <div className="md:col-span-2 bg-zinc-50/50 dark:bg-zinc-900/50 border dark:border-zinc-800 rounded-xl p-5 flex flex-col h-[550px]">
                      <h4 className="font-bold text-xs text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5 pb-3 border-b dark:border-zinc-800 mb-4">
                        <Cpu className="h-4 w-4 text-indigo-500" /> 
                        {selectedChatLog ? `Session: ${selectedChatLog.sessionId}` : 'Conversation Preview'}
                      </h4>
                      
                      {selectedChatLog ? (
                        <div className="flex-1 flex flex-col min-h-0">
                          <div className="text-[10px] text-zinc-400 flex flex-wrap gap-4 mb-3 bg-white dark:bg-zinc-900 border dark:border-zinc-800 rounded-lg p-2.5 font-mono">
                            <div><strong>Guest ID:</strong> {selectedChatLog.guestId || 'N/A'}</div>
                            <div><strong>User Email:</strong> {selectedChatLog.userId?.email || 'N/A'}</div>
                            <div><strong>Last Update:</strong> {new Date(selectedChatLog.updatedAt || selectedChatLog.createdAt).toLocaleTimeString()}</div>
                          </div>

                          <div className="flex-1 overflow-y-auto space-y-3 pr-2 mb-2 min-h-0 bg-white dark:bg-zinc-950 border dark:border-zinc-800 rounded-xl p-4">
                            {selectedChatLog.messages && selectedChatLog.messages.map((msg: any, mIdx: number) => {
                              const isUser = msg.role === 'user';
                              return (
                                <div key={mIdx} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                                  <div className={`max-w-[75%] rounded-2xl p-3 text-xs leading-relaxed shadow-sm ${
                                    isUser 
                                      ? 'bg-indigo-650 text-white rounded-br-none' 
                                      : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-100 rounded-bl-none'
                                  }`}>
                                    <p>{msg.text}</p>
                                    <div className={`text-[9px] mt-1.5 flex items-center gap-2 ${isUser ? 'text-indigo-200' : 'text-zinc-405'}`}>
                                      <span>{msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : ''}</span>
                                      {isUser && msg.intent && (
                                        <span className="bg-indigo-800/50 text-[8px] font-bold px-1.5 py-0.5 rounded text-white uppercase tracking-wider">
                                          Intent: {msg.intent}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-zinc-400 py-8 font-semibold">
                          <Cpu className="h-10 w-10 text-zinc-300 dark:text-zinc-700 mb-2 animate-pulse" />
                          <p className="text-xs text-center">Select a chatbot session from the left to view the entire real-time conversation history.</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* 11. RETENTION CONFIGURATOR SUBTAB */}
              {logSubTab === 'retention' && (
                <div className="space-y-6 max-w-2xl mx-auto p-4 bg-white dark:bg-zinc-900 border dark:border-zinc-800 rounded-2xl shadow-sm">
                  <h3 className="font-bold text-sm text-zinc-900 dark:text-white flex items-center gap-2 border-b pb-3 dark:border-zinc-800">
                    <Settings className="h-5 w-5 text-indigo-500" /> Log Retention & Archiving Settings
                  </h3>
                  
                  <div className="space-y-4">
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500">Retention Period Policy</label>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                      {[
                        { val: 30, label: '30 Days' },
                        { val: 90, label: '90 Days' },
                        { val: 180, label: '180 Days' },
                        { val: 360, label: '1 Year' },
                        { val: 0, label: 'Forever' }
                      ].map(item => (
                        <button key={item.val}
                          type="button"
                          onClick={() => setRetentionDays(item.val)}
                          className={`px-3 py-2.5 text-xs font-semibold rounded-xl border text-center transition-all cursor-pointer ${
                            retentionDays === item.val
                              ? 'bg-indigo-600 border-indigo-600 text-white shadow'
                              : 'bg-zinc-55 border-zinc-200 dark:bg-zinc-800 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100'
                          }`}>
                          {item.label}
                        </button>
                      ))}
                    </div>
                    <p className="text-[11px] text-zinc-400">Logs older than the configured period will be automatically cleaned up during background daily tasks.</p>
                  </div>

                  <div className="pt-4 border-t dark:border-zinc-800 space-y-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-550">Manual Archive & Cleanup Actions</h4>
                    <div className="flex flex-wrap gap-4">
                      <button type="button" onClick={async () => {
                        try {
                          const res = await apiAction('PUT', '/admin/logs/retention', { daysLimit: retentionDays });
                          alert(`Successfully triggered manual log retention sweep! Purged ${res.purgedCount || 0} old log entries.`);
                          loadLogs();
                        } catch {
                          alert('Failed to trigger logs retention sweep.');
                        }
                      }} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow flex items-center gap-1.5 transition-colors cursor-pointer border-0">
                        <RefreshCw className="h-3.5 w-3.5" /> Run Retention Cleanup Now
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </Section>
  );
}
