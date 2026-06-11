'use client';

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAdmin } from '../AdminContext';
import {
  LayoutDashboard, Users, ShoppingBag, Package, Star, Tag, Store,
  LogOut, Sun, Moon, ShieldCheck, AlertCircle, RefreshCw, X,
  User, Settings, Database, Activity, Cpu, ToggleLeft, Megaphone, FileText, ChevronUp, ChevronDown, ChevronRight, TrendingUp, Search, Filter, Lock, Phone, Calendar, ShieldAlert, Download, Edit2, Check
} from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const {
    token, adminEmail, theme, toggleTheme, logout, mounted, apiError, breadcrumbs,
    showFloatingWidget, setShowFloatingWidget, widgetType, setWidgetType, widgetCategory, setWidgetCategory,
    widgetSubject, setWidgetSubject, widgetDescription, setWidgetDescription, widgetName, setWidgetName,
    widgetEmail, setWidgetEmail, widgetPhone, setWidgetPhone, widgetPriority, setWidgetPriority,
    widgetSeverity, setWidgetSeverity, widgetCaptcha, setWidgetCaptcha, widgetCaptchaVal,
    widgetAttachments, setWidgetAttachments, duplicateSuggestions, handleVoteSuggestion,
    handleWidgetSubmit, handleGenerateCaptcha
  } = useAdmin();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (mounted && !token) {
      router.push('/');
    }
  }, [mounted, token, router]);

  if (!mounted || !token) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-650"></div>
      </div>
    );
  }

  const subRoute = pathname.split('/').filter(Boolean)[0] || 'overview';

  const navItems = [
    { key: 'overview',  label: 'Overview',  icon: <LayoutDashboard className="h-4 w-4" /> },
    { key: 'users',     label: 'Customers', icon: <Users className="h-4 w-4" /> },
    { key: 'orders',    label: 'Orders',    icon: <ShoppingBag className="h-4 w-4" /> },
    { key: 'products',  label: 'Products',  icon: <Package className="h-4 w-4" /> },
    { key: 'vendors',   label: 'Merchants', icon: <Store className="h-4 w-4" /> },
    { key: 'support',   label: 'Support Center', icon: <AlertCircle className="h-4 w-4" /> },
    { key: 'cms',       label: 'CMS / Blogs', icon: <FileText className="h-4 w-4" /> },
    { key: 'flags',     label: 'Feature Flags', icon: <ToggleLeft className="h-4 w-4" /> },
    { key: 'announcements', label: 'Announcements', icon: <Megaphone className="h-4 w-4" /> },
    { key: 'fraud',     label: 'Fraud Control', icon: <ShieldAlert className="h-4 w-4" /> },
    { key: 'gdpr',      label: 'GDPR Queue', icon: <FileText className="h-4 w-4" /> },
    { key: 'health',    label: 'System Health', icon: <Activity className="h-4 w-4" /> },
    { key: 'settings',  label: 'Settings',  icon: <Settings className="h-4 w-4" /> },
    { key: 'analytics', label: 'Analytics', icon: <TrendingUp className="h-4 w-4" /> },
    { key: 'logs',      label: 'System Logs', icon: <Database className="h-4 w-4" /> },
  ];

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-955 flex flex-col transition-colors duration-300">
      {/* Topbar */}
      <header className="sticky top-0 z-40 border-b border-zinc-200/80 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2 font-bold text-lg text-indigo-650 dark:text-indigo-400">
          <ShieldCheck className="h-5 w-5" />
          <span>ApexStore Admin Console</span>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => router.push('/profile')} 
            className={`flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              subRoute === 'profile'
                ? 'text-indigo-650 bg-indigo-50 dark:bg-indigo-950/20 dark:text-indigo-400'
                : 'text-zinc-500 hover:text-indigo-500 hover:bg-zinc-50 dark:hover:bg-zinc-800'
            }`}
          >
            <User className="h-4 w-4" />
            <span className="hidden md:block font-semibold">{adminEmail}</span>
          </button>
          <button onClick={toggleTheme} className="p-2 text-zinc-500 hover:text-indigo-500 rounded-lg">
            {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </button>
          <button onClick={logout} className="flex items-center gap-1.5 text-xs font-semibold text-zinc-650 dark:text-zinc-300 border dark:border-zinc-700 rounded-lg px-3 py-1.5 hover:bg-zinc-50 dark:hover:bg-zinc-800 cursor-pointer">
            <LogOut className="h-3.5 w-3.5" /> Sign Out
          </button>
        </div>
      </header>

      <div className="flex flex-1 max-w-[1600px] w-full mx-auto">
        {/* Sidebar */}
        <aside className="hidden lg:flex w-56 flex-col border-r dark:border-zinc-800 bg-white dark:bg-zinc-900 py-6 px-4 gap-1">
          {navItems.map(n => (
            <button key={n.key} onClick={() => router.push(`/${n.key}`)}
              className={`flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-xs font-semibold w-full text-left transition-colors border ${subRoute === n.key
                ? 'bg-indigo-50 dark:bg-indigo-950/20 text-indigo-705 dark:text-indigo-300 border-indigo-100/50 dark:border-indigo-900/30'
                : 'border-transparent text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/40'}`}>
              {n.icon}{n.label}
            </button>
          ))}
        </aside>

        <main className="flex-1 p-6 space-y-6 overflow-y-auto">
          {apiError && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-xl text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-red-650" />
              <span>API Connection Error: {apiError}. Please sign out and sign back in, or check backend logs.</span>
            </div>
          )}
          {/* Breadcrumbs Navigation */}
          <nav className="flex items-center gap-1.5 text-xs text-zinc-405 dark:text-zinc-500 font-medium pb-2 border-b dark:border-zinc-800">
            {breadcrumbs.map((b, idx) => (
              <React.Fragment key={idx}>
                {idx > 0 && <span className="text-[10px] text-zinc-300">/</span>}
                <button
                  onClick={b.onClick}
                  className={`hover:text-indigo-650 dark:hover:text-indigo-400 transition-colors ${
                    idx === breadcrumbs.length - 1 
                      ? 'text-zinc-805 dark:text-zinc-200 font-bold' 
                      : 'cursor-pointer'
                  }`}
                  disabled={idx === breadcrumbs.length - 1}
                >
                  {b.label}
                </button>
              </React.Fragment>
            ))}
          </nav>

          {children}
        </main>
      </div>

      {/* Floating Action Button */}
      <button
        onClick={() => {
          handleGenerateCaptcha();
          setShowFloatingWidget(true);
        }}
        className="fixed bottom-6 right-6 z-50 p-4 bg-indigo-600 hover:bg-indigo-500 hover:scale-105 active:scale-95 text-white rounded-full shadow-2xl transition-all flex items-center gap-2 cursor-pointer font-bold text-xs"
      >
        <Star className="h-5 w-5 animate-pulse" />
        <span>Give Feedback</span>
      </button>

      {/* Glassmorphic overlay widget */}
      {showFloatingWidget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 backdrop-blur-md p-4 overflow-y-auto">
          <div className="w-full max-w-xl bg-white/90 dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-2xl p-6 relative backdrop-filter max-h-[90vh] overflow-y-auto space-y-4">
            <button
              onClick={() => setShowFloatingWidget(false)}
              className="absolute top-4 right-4 p-1 rounded-full text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-850"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="text-center">
              <h2 className="text-lg font-black text-zinc-900 dark:text-white">Feedback Center Widget</h2>
              <p className="text-xs text-zinc-505">Report bugs, request features, or submit feature votes directly to our product engineering teams.</p>
            </div>

            <form onSubmit={handleWidgetSubmit} className="space-y-4 text-xs">
              {/* Type & Category selection */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] text-zinc-450 font-bold uppercase mb-1">Feedback Type</label>
                  <select
                    value={widgetType}
                    onChange={(e) => setWidgetType(e.target.value)}
                    className="w-full px-3 py-2 border dark:border-zinc-800 bg-white dark:bg-zinc-950 rounded-lg text-zinc-800 dark:text-white"
                  >
                    <option value="Feedback">Feedback</option>
                    <option value="Suggestion">Suggestion</option>
                    <option value="Bug Report">Bug Report</option>
                    <option value="Feature Request">Feature Request</option>
                    <option value="Complaint">Complaint</option>
                    <option value="Security Report">Security Report</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] text-zinc-450 font-bold uppercase mb-1">Queue Category</label>
                  <select
                    value={widgetCategory}
                    onChange={(e) => setWidgetCategory(e.target.value)}
                    className="w-full px-3 py-2 border dark:border-zinc-800 bg-white dark:bg-zinc-955 rounded-lg text-zinc-805 dark:text-white"
                  >
                    <option value="General">General</option>
                    <option value="Bug Reports">Bug Reports</option>
                    <option value="Feature Requests">Feature Requests</option>
                    <option value="Complaint Reports">Complaint Reports</option>
                    <option value="Security Reports">Security Reports</option>
                  </select>
                </div>
              </div>

              {/* Subject */}
              <div>
                <label className="block text-[10px] text-zinc-450 font-bold uppercase mb-1">Subject / Summary</label>
                <input
                  type="text"
                  required
                  placeholder="Summarize the request or issue..."
                  value={widgetSubject}
                  onChange={(e) => setWidgetSubject(e.target.value)}
                  className="w-full px-3 py-2 border dark:border-zinc-800 bg-white dark:bg-zinc-905 rounded-lg text-zinc-800 dark:text-white outline-none focus:border-indigo-500"
                />
              </div>

              {/* Duplicate suggestions */}
              {duplicateSuggestions.length > 0 && (
                <div className="bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-150/40 p-3.5 rounded-xl space-y-2">
                  <span className="block text-[10px] text-indigo-700 dark:text-indigo-400 font-extrabold uppercase tracking-wider">Similar Existing Submissions</span>
                  <div className="space-y-2 max-h-[120px] overflow-y-auto pr-1">
                    {duplicateSuggestions.map((item: any) => (
                      <div key={item._id} className="flex justify-between items-center bg-white dark:bg-zinc-900 border dark:border-zinc-850 p-2 rounded-lg gap-3">
                        <div className="min-w-0">
                          <div className="font-bold text-zinc-800 dark:text-zinc-200 truncate">{item.subject}</div>
                          <div className="text-[9px] text-zinc-450 mt-0.5">Roadmap: {item.roadmapStatus} · Votes: {item.votesCount}</div>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleVoteSuggestion(item._id)}
                          className="px-2.5 py-1 bg-indigo-650 text-white rounded text-[9px] font-bold shrink-0 hover:bg-indigo-500"
                        >
                          Vote (+1)
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Description */}
              <div>
                <label className="block text-[10px] text-zinc-450 font-bold uppercase mb-1">Details & Description</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Provide precise details, steps to reproduce, or product goals..."
                  value={widgetDescription}
                  onChange={(e) => setWidgetDescription(e.target.value)}
                  className="w-full px-3 py-2 border dark:border-zinc-800 bg-white dark:bg-zinc-905 rounded-lg text-zinc-800 dark:text-white outline-none focus:border-indigo-500"
                />
              </div>

              {/* Guest Profile Details */}
              {!token && (
                <div className="border-t border-dashed dark:border-zinc-800 pt-3.5 space-y-3">
                  <span className="block text-[10px] text-zinc-455 font-bold uppercase tracking-wider">Guest Contact Details</span>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <input
                        type="text"
                        required
                        placeholder="Your Name"
                        value={widgetName}
                        onChange={(e) => setWidgetName(e.target.value)}
                        className="w-full px-2.5 py-1.5 border dark:border-zinc-800 bg-white dark:bg-zinc-905 rounded-lg text-zinc-800 dark:text-white"
                      />
                    </div>
                    <div>
                      <input
                        type="email"
                        required
                        placeholder="Your Email"
                        value={widgetEmail}
                        onChange={(e) => setWidgetEmail(e.target.value)}
                        className="w-full px-2.5 py-1.5 border dark:border-zinc-800 bg-white dark:bg-zinc-905 rounded-lg text-zinc-800 dark:text-white"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        placeholder="Phone (Optional)"
                        value={widgetPhone}
                        onChange={(e) => setWidgetPhone(e.target.value)}
                        className="w-full px-2.5 py-1.5 border dark:border-zinc-800 bg-white dark:bg-zinc-905 rounded-lg text-zinc-800 dark:text-white"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Priority / Severity / CAPTCHA */}
              <div className="grid grid-cols-3 gap-3 border-t border-dashed dark:border-zinc-800 pt-3">
                <div>
                  <label className="block text-[10px] text-zinc-450 font-bold uppercase mb-1">Priority</label>
                  <select
                    value={widgetPriority}
                    onChange={(e) => setWidgetPriority(e.target.value)}
                    className="w-full px-3 py-2 border dark:border-zinc-800 bg-white dark:bg-zinc-905 rounded-lg text-zinc-850 dark:text-white"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] text-zinc-450 font-bold uppercase mb-1">Severity</label>
                  <select
                    value={widgetSeverity}
                    onChange={(e) => setWidgetSeverity(e.target.value)}
                    className="w-full px-3 py-2 border dark:border-zinc-800 bg-white dark:bg-zinc-905 rounded-lg text-zinc-855 dark:text-white"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] text-zinc-455 font-bold uppercase mb-1">CAPTCHA: <span className="font-mono font-black text-indigo-650 dark:text-indigo-400 bg-zinc-100 dark:bg-zinc-950 px-1 rounded">{widgetCaptchaVal}</span></label>
                  <div className="flex gap-1.5">
                    <input
                      type="text"
                      required
                      placeholder="Enter code"
                      value={widgetCaptcha}
                      onChange={(e) => setWidgetCaptcha(e.target.value)}
                      className="w-full px-2.5 py-1.5 border dark:border-zinc-800 bg-white dark:bg-zinc-905 rounded-lg font-mono tracking-widest text-zinc-800 dark:text-white"
                    />
                    <button
                      type="button"
                      onClick={handleGenerateCaptcha}
                      className="px-2 py-1.5 border dark:border-zinc-800 hover:bg-zinc-55 rounded-lg text-zinc-500"
                    >
                      <RefreshCw className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Attachments */}
              <div className="space-y-2">
                <span className="block text-[10px] text-zinc-450 font-bold uppercase">Simulated Attachments</span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const id = Date.now().toString();
                      setWidgetAttachments([
                        ...widgetAttachments,
                        {
                          fileName: `screenshot_${id.slice(-4)}.png`,
                          fileType: 'image/png',
                          fileUrl: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=400&q=80',
                        },
                      ]);
                    }}
                    className="px-3 py-1.5 border dark:border-zinc-800 hover:border-indigo-400 rounded-lg text-zinc-650 hover:text-indigo-650"
                  >
                    + Add Mock Screenshot
                  </button>
                  {widgetAttachments.length > 0 && (
                    <span className="text-zinc-505 self-center font-bold">({widgetAttachments.length} Files Attached)</span>
                  )}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold rounded-xl shadow-lg active:scale-95 transition-all text-xs"
              >
                Submit Feedback Request
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
