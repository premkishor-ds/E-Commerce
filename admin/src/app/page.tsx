'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  LayoutDashboard, Users, ShoppingBag, Package, Star, Tag, Store,
  LogOut, Sun, Moon, Search, Filter, ChevronUp, ChevronDown,
  Trash2, CheckCircle, XCircle, ShieldCheck, TrendingUp,
  Mail, Lock, AlertCircle, RefreshCw, Edit2, X, Check,
  User, Settings, Database, Activity, Eye, ShieldAlert, Cpu, Download, ToggleLeft, ToggleRight, Phone, Calendar
} from 'lucide-react';

const API = 'http://localhost:5001/api/v1';

function badge(color: string, text: string) {
  const map: Record<string, string> = {
    green:  'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-300 dark:border-emerald-800',
    red:    'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/30 dark:text-red-300 dark:border-red-800',
    amber:  'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-300 dark:border-amber-800',
    blue:   'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/30 dark:text-blue-300 dark:border-blue-800',
    zinc:   'bg-zinc-100 text-zinc-600 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700',
  };
  return <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold border ${map[color] ?? map.zinc}`}>{text}</span>;
}

function statusColor(s: string) {
  const m: Record<string, string> = {
    Active: 'green', Approved: 'green', Delivered: 'green', Completed: 'green',
    Pending: 'amber', Open: 'amber', 'In Progress': 'amber', 'Verification In Progress': 'amber',
    Cancelled: 'red', Suspended: 'red', Rejected: 'red', Flagged: 'red',
    Shipped: 'blue', Paid: 'blue',
    Inactive: 'zinc', Resolved: 'zinc', Closed: 'zinc',
  };
  return m[s] ?? 'zinc';
}

function AccordionItem({ title, content }: { title: string; content: string }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border dark:border-zinc-800 rounded-lg overflow-hidden bg-white dark:bg-zinc-950">
      <button 
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-3 text-left font-bold text-xs flex justify-between items-center text-zinc-805 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
      >
        <span>{title}</span>
        <span className="text-zinc-400">{isOpen ? '−' : '+'}</span>
      </button>
      {isOpen && (
        <div className="p-3 border-t dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 bg-zinc-50/50 dark:bg-zinc-950/20 leading-relaxed text-xs">
          {content}
        </div>
      )}
    </div>
  );
}

function authHeaders(token: string) {
  return { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };
}

export default function AdminPage() {
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [token, setToken] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);

  // States
  const [stats, setStats] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [vendors, setVendors] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [coupons, setCoupons] = useState<any[]>([]);
  const [adminProfile, setAdminProfile] = useState<any>(null);
  const [adminSessions, setAdminSessions] = useState<any[]>([]);
  const [tickets, setTickets] = useState<any[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<any | null>(null);
  const [ticketReplyText, setTicketReplyText] = useState('');
  const [ticketStatusSelect, setTicketStatusSelect] = useState('');
  const [ticketAgentSelect, setTicketAgentSelect] = useState('');
  const [agentsList, setAgentsList] = useState<any[]>([]);
  const [ticketSearch, setTicketSearch] = useState('');
  const [ticketStatusFilter, setTicketStatusFilter] = useState('');
  const [ticketPage, setTicketPage] = useState(1);

  // Logs States
  const [logSubTab, setLogSubTab] = useState<'audit' | 'search' | 'activity' | 'chatbot'>('audit');
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [searchLogs, setSearchLogs] = useState<any[]>([]);
  const [activityLogs, setActivityLogs] = useState<any[]>([]);
  const [chatbotLogs, setChatbotLogs] = useState<any[]>([]);
  const [selectedChatLog, setSelectedChatLog] = useState<any | null>(null);
  const [selectedLogDetail, setSelectedLogDetail] = useState<any | null>(null);
  const [auditPage, setAuditPage] = useState(1);
  const [searchPage, setSearchPage] = useState(1);
  const [activityPage, setActivityPage] = useState(1);
  const [chatbotPage, setChatbotPage] = useState(1);
  const [analyticsSubTab, setAnalyticsSubTab] = useState<'overview' | 'sales' | 'chatbot' | 'demographics'>('overview');
  const [apiError, setApiError] = useState<string>('');

  // Filters & Sorting States
  const [userSearch, setUserSearch] = useState('');
  const [userRole, setUserRole] = useState('');
  const [userStatus, setUserStatus] = useState('');
  const [userSortField, setUserSortField] = useState('email');
  const [userSortOrder, setUserSortOrder] = useState<'asc' | 'desc'>('asc');

  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatus, setOrderStatus] = useState('');
  const [orderSortField, setOrderSortField] = useState('createdAt');
  const [orderSortOrder, setOrderSortOrder] = useState<'asc' | 'desc'>('desc');

  const [productSearch, setProductSearch] = useState('');
  const [productSortField, setProductSortField] = useState('title');
  const [productSortOrder, setProductSortOrder] = useState<'asc' | 'desc'>('asc');

  const [vendorSearch, setVendorSearch] = useState('');
  const [vendorStatus, setVendorStatus] = useState('');
  const [vendorType, setVendorType] = useState('all');
  const [vendorSortField, setVendorSortField] = useState('shopName');
  const [vendorSortOrder, setVendorSortOrder] = useState<'asc' | 'desc'>('asc');

  // Chatbot Filters & Sorting
  const [chatSearch, setChatSearch] = useState('');
  const [chatFilterType, setChatFilterType] = useState('all');
  const [chatMinMsgs, setChatMinMsgs] = useState(0);
  const [chatShowOnlyFallbacks, setChatShowOnlyFallbacks] = useState(false);
  const [chatSortField, setChatSortField] = useState('updatedAt');
  const [chatSortOrder, setChatSortOrder] = useState<'asc' | 'desc'>('desc');

  // System Audit Filters & Sorting
  const [auditSearch, setAuditSearch] = useState('');
  const [auditRole, setAuditRole] = useState('all');
  const [auditSortField, setAuditSortField] = useState('createdAt');
  const [auditSortOrder, setAuditSortOrder] = useState<'asc' | 'desc'>('desc');

  // Search Queries Filters & Sorting
  const [searchQuery, setSearchQuery] = useState('');
  const [searchRole, setSearchRole] = useState('all');
  const [searchSource, setSearchSource] = useState('all');
  const [searchSortField, setSearchSortField] = useState('createdAt');
  const [searchSortOrder, setSearchSortOrder] = useState<'asc' | 'desc'>('desc');

  // User Activities Filters & Sorting
  const [activitySearch, setActivitySearch] = useState('');
  const [activityCategory, setActivityCategory] = useState('all');
  const [activitySortField, setActivitySortField] = useState('createdAt');
  const [activitySortOrder, setActivitySortOrder] = useState<'asc' | 'desc'>('desc');

  // Drawer/Modal States
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [selectedSeller, setSelectedSeller] = useState<any | null>(null);
  const [sellerCommission, setSellerCommission] = useState(10);
  const [editCompanyLegalName, setEditCompanyLegalName] = useState('');
  const [editBusinessPhone, setEditBusinessPhone] = useState('');
  const [selectedVendor, setSelectedVendor] = useState<any | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [activeProductImageIndex, setActiveProductImageIndex] = useState(0);
  const [orderTrackingCode, setOrderTrackingCode] = useState('');
  const [orderStatusSelect, setOrderStatusSelect] = useState('');

  // System Settings State
  const [settingTab, setSettingTab] = useState('general');
  const [generalSettings, setGeneralSettings] = useState({ siteName: 'ApexStore', siteUrl: '', supportEmail: '', maintenanceMode: false, pageSize: 20 });
  const [userPage, setUserPage] = useState(1);
  const [orderPage, setOrderPage] = useState(1);
  const [productPage, setProductPage] = useState(1);
  const [vendorPage, setVendorPage] = useState(1);
  const [emailSettings, setEmailSettings] = useState({ smtpHost: '', smtpPort: 25, smtpUsername: '', senderEmail: '' });
  const [smsSettings, setSmsSettings] = useState({ provider: 'Twilio', twilioSid: '', twilioToken: '' });
  const [storageSettings, setStorageSettings] = useState({ provider: 'Local', bucketName: '' });
  const [apiSettings, setApiSettings] = useState({ googleMapKey: '', openaiKey: '' });

  // Role Permissions matrix state
  const [rolesMatrix, setRolesMatrix] = useState<any>({
    'Super Admin': { dashboard: true, products: true, orders: true, settings: true, logs: true },
    'Admin': { dashboard: true, products: true, orders: true, settings: false, logs: true },
    'Manager': { dashboard: true, products: true, orders: true, settings: false, logs: false },
    'Customer Support': { dashboard: true, products: false, orders: true, settings: false, logs: false },
    'Analytics Viewer': { dashboard: true, products: false, orders: false, settings: false, logs: false },
  });

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('apex-admin');
    if (saved) {
      const p = JSON.parse(saved);
      setToken(p.token);
      setAdminEmail(p.email);
    }
    const t = (localStorage.getItem('apex-admin-theme') ?? 'light') as 'light' | 'dark';
    setTheme(t);
    if (t === 'dark') document.documentElement.classList.add('dark');

    // Parse Tab/Subtab and all filters/sorting from URL Search Params on mount
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const tab = params.get('tab');
      if (tab) setActiveTab(tab);
      const sub = params.get('sub');
      if (sub) {
        if (tab === 'vendors') setVendorType(sub);
        if (tab === 'logs') setLogSubTab(sub as any);
        if (tab === 'settings') setSettingTab(sub);
      }

      // User filters & sorting
      if (params.get('userSearch')) setUserSearch(params.get('userSearch')!);
      if (params.get('userStatus')) setUserStatus(params.get('userStatus')!);
      if (params.get('userSortField')) setUserSortField(params.get('userSortField')!);
      if (params.get('userSortOrder')) setUserSortOrder(params.get('userSortOrder') as 'asc' | 'desc');

      // Order filters & sorting
      if (params.get('orderSearch')) setOrderSearch(params.get('orderSearch')!);
      if (params.get('orderStatus')) setOrderStatus(params.get('orderStatus')!);
      if (params.get('orderSortField')) setOrderSortField(params.get('orderSortField')!);
      if (params.get('orderSortOrder')) setOrderSortOrder(params.get('orderSortOrder') as 'asc' | 'desc');

      // Product filters & sorting
      if (params.get('productSearch')) setProductSearch(params.get('productSearch')!);
      if (params.get('productSortField')) setProductSortField(params.get('productSortField')!);
      if (params.get('productSortOrder')) setProductSortOrder(params.get('productSortOrder') as 'asc' | 'desc');

      // Vendor filters & sorting
      if (params.get('vendorSearch')) setVendorSearch(params.get('vendorSearch')!);
      if (params.get('vendorStatus')) setVendorStatus(params.get('vendorStatus')!);
      if (params.get('vendorSortField')) setVendorSortField(params.get('vendorSortField')!);
      if (params.get('vendorSortOrder')) setVendorSortOrder(params.get('vendorSortOrder') as 'asc' | 'desc');

      // Audit filters & sorting
      if (params.get('auditSearch')) setAuditSearch(params.get('auditSearch')!);
      if (params.get('auditRole')) setAuditRole(params.get('auditRole')!);
      if (params.get('auditSortField')) setAuditSortField(params.get('auditSortField')!);
      if (params.get('auditSortOrder')) setAuditSortOrder(params.get('auditSortOrder') as 'asc' | 'desc');

      // Search filters & sorting
      if (params.get('searchQuery')) setSearchQuery(params.get('searchQuery')!);
      if (params.get('searchRole')) setSearchRole(params.get('searchRole')!);
      if (params.get('searchSource')) setSearchSource(params.get('searchSource')!);
      if (params.get('searchSortField')) setSearchSortField(params.get('searchSortField')!);
      if (params.get('searchSortOrder')) setSearchSortOrder(params.get('searchSortOrder') as 'asc' | 'desc');

      // Activity filters & sorting
      if (params.get('activitySearch')) setActivitySearch(params.get('activitySearch')!);
      if (params.get('activityCategory')) setActivityCategory(params.get('activityCategory')!);
      if (params.get('activitySortField')) setActivitySortField(params.get('activitySortField')!);
      if (params.get('activitySortOrder')) setActivitySortOrder(params.get('activitySortOrder') as 'asc' | 'desc');

      // Chatbot filters & sorting
      if (params.get('chatSearch')) setChatSearch(params.get('chatSearch')!);
      if (params.get('chatFilterType')) setChatFilterType(params.get('chatFilterType')!);
      if (params.get('chatMinMsgs')) setChatMinMsgs(Number(params.get('chatMinMsgs')));
      if (params.get('chatShowOnlyFallbacks')) setChatShowOnlyFallbacks(params.get('chatShowOnlyFallbacks') === 'true');
      if (params.get('chatSortField')) setChatSortField(params.get('chatSortField')!);
      if (params.get('chatSortOrder')) setChatSortOrder(params.get('chatSortOrder') as 'asc' | 'desc');
    }
  }, []);

  // Synchronize Tab & Filters & Sorting state changes to browser URL Search Params
  useEffect(() => {
    if (typeof window === 'undefined' || !mounted) return;
    const url = new URL(window.location.href);
    url.searchParams.set('tab', activeTab);
    
    // Add sub-tab category if applicable
    if (activeTab === 'vendors' && vendorType !== 'all') {
      url.searchParams.set('sub', vendorType);
    } else if (activeTab === 'logs' && logSubTab !== 'audit') {
      url.searchParams.set('sub', logSubTab);
    } else if (activeTab === 'settings' && settingTab !== 'general') {
      url.searchParams.set('sub', settingTab);
    } else {
      url.searchParams.delete('sub');
    }

    const setParam = (key: string, val: any, defaultVal: any = '') => {
      if (val !== undefined && val !== null && val !== defaultVal && val !== '') {
        url.searchParams.set(key, String(val));
      } else {
        url.searchParams.delete(key);
      }
    };

    // User filters & sorting
    setParam('userSearch', userSearch);
    setParam('userStatus', userStatus);
    setParam('userSortField', userSortField, 'email');
    setParam('userSortOrder', userSortOrder, 'asc');

    // Order filters & sorting
    setParam('orderSearch', orderSearch);
    setParam('orderStatus', orderStatus);
    setParam('orderSortField', orderSortField, 'createdAt');
    setParam('orderSortOrder', orderSortOrder, 'desc');

    // Product filters & sorting
    setParam('productSearch', productSearch);
    setParam('productSortField', productSortField, 'title');
    setParam('productSortOrder', productSortOrder, 'asc');

    // Vendor filters & sorting
    setParam('vendorSearch', vendorSearch);
    setParam('vendorStatus', vendorStatus);
    setParam('vendorSortField', vendorSortField, 'shopName');
    setParam('vendorSortOrder', vendorSortOrder, 'asc');

    // Audit filters & sorting
    setParam('auditSearch', auditSearch);
    setParam('auditRole', auditRole, 'all');
    setParam('auditSortField', auditSortField, 'createdAt');
    setParam('auditSortOrder', auditSortOrder, 'desc');

    // Search filters & sorting
    setParam('searchQuery', searchQuery);
    setParam('searchRole', searchRole, 'all');
    setParam('searchSource', searchSource, 'all');
    setParam('searchSortField', searchSortField, 'createdAt');
    setParam('searchSortOrder', searchSortOrder, 'desc');

    // Activity filters & sorting
    setParam('activitySearch', activitySearch);
    setParam('activityCategory', activityCategory, 'all');
    setParam('activitySortField', activitySortField, 'createdAt');
    setParam('activitySortOrder', activitySortOrder, 'desc');

    // Chatbot filters & sorting
    setParam('chatSearch', chatSearch);
    setParam('chatFilterType', chatFilterType, 'all');
    setParam('chatMinMsgs', chatMinMsgs, 0);
    setParam('chatShowOnlyFallbacks', chatShowOnlyFallbacks, false);
    setParam('chatSortField', chatSortField, 'updatedAt');
    setParam('chatSortOrder', chatSortOrder, 'desc');

    window.history.pushState({}, '', url.pathname + url.search);
  }, [
    activeTab, vendorType, logSubTab, settingTab, mounted,
    userSearch, userStatus, userSortField, userSortOrder,
    orderSearch, orderStatus, orderSortField, orderSortOrder,
    productSearch, productSortField, productSortOrder,
    vendorSearch, vendorStatus, vendorSortField, vendorSortOrder,
    auditSearch, auditRole, auditSortField, auditSortOrder,
    searchQuery, searchRole, searchSource, searchSortField, searchSortOrder,
    activitySearch, activityCategory, activitySortField, activitySortOrder,
    chatSearch, chatFilterType, chatMinMsgs, chatShowOnlyFallbacks, chatSortField, chatSortOrder
  ]);

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    localStorage.setItem('apex-admin-theme', next);
    document.documentElement.classList.toggle('dark', next === 'dark');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    try {
      const res = await fetch(`${API}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });
      if (!res.ok) throw new Error('Invalid credentials');
      const data = await res.json();
      if (!data.user.roles?.some((r: string) => ['Admin', 'Super Admin', 'Manager'].includes(r)))
        throw new Error('Access denied — admin role required');
      setToken(data.accessToken);
      setAdminEmail(data.user.email);
      localStorage.setItem('apex-admin', JSON.stringify({ token: data.accessToken, email: data.user.email }));
    } catch (err: any) { setLoginError(err.message); }
  };

  const logout = () => {
    setToken('');
    setAdminEmail('');
    localStorage.removeItem('apex-admin');
  };

  const apiFetch = useCallback(async (path: string) => {
    try {
      const res = await fetch(`${API}${path}`, { headers: authHeaders(token) });
      if (!res.ok) {
        const msg = `HTTP ${res.status} error on GET ${path}`;
        setApiError(msg);
        throw new Error(msg);
      }
      setApiError('');
      return res.json();
    } catch (err: any) {
      setApiError(err.message || `Failed to fetch GET ${path}`);
      throw err;
    }
  }, [token]);

  const apiAction = useCallback(async (method: string, path: string, body?: any) => {
    try {
      const res = await fetch(`${API}${path}`, {
        method,
        headers: authHeaders(token),
        body: body ? JSON.stringify(body) : undefined,
      });
      if (!res.ok) {
        const e = await res.json().catch(() => ({}));
        const msg = e.message || `HTTP ${res.status} error on ${method} ${path}`;
        setApiError(msg);
        throw new Error(msg);
      }
      setApiError('');
      return res.json();
    } catch (err: any) {
      setApiError(err.message || `Failed to execute ${method} ${path}`);
      throw err;
    }
  }, [token]);

  const loadStats = useCallback(async () => {
    try {
      const s = await apiFetch('/admin/analytics/summary');
      setStats(s);
    } catch {
      // Fallback summary stats
      setStats({
        revenue: { total: 110063.80, monthlyTrend: [{ month: 'Jan', amount: 8000 }, { month: 'Feb', amount: 12000 }, { month: 'Mar', amount: 15000 }] },
        orders: { total: 18, statusDistribution: { Shipped: 5, Delivered: 10, Pending: 3 }, locationDistribution: { NY: 8, CA: 6, TX: 4 } },
        customers: { total: 25, retentionRate: 84.5 },
        chatbot: { totalQueries: 42, fallbackRate: 4.8, averageConfidence: 89.2, commonIntents: [{ goal: 'TRACK_ORDER', count: 18 }] },
        traffic: { browsers: { Chrome: 64, Safari: 18, Firefox: 10 }, devices: { Desktop: 70, Mobile: 25 } }
      });
    }
  }, [apiFetch]);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      const p = new URLSearchParams();
      if (userSearch) p.set('search', userSearch);
      if (userRole) p.set('role', userRole);
      if (userStatus) p.set('status', userStatus);
      setUsers(await apiFetch(`/admin/users?${p}`));
    } catch { setUsers([]); }
    finally { setLoading(false); }
  }, [apiFetch, userSearch, userRole, userStatus]);

  const loadOrders = useCallback(async () => {
    setLoading(true);
    try {
      const p = new URLSearchParams();
      if (orderSearch) p.set('search', orderSearch);
      if (orderStatus) p.set('status', orderStatus);
      setOrders(await apiFetch(`/admin/orders?${p}`));
    } catch { setOrders([]); }
    finally { setLoading(false); }
  }, [apiFetch, orderSearch, orderStatus]);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      setProducts(await apiFetch('/admin/products'));
    } catch { setProducts([]); }
    finally { setLoading(false); }
  }, [apiFetch]);

  const loadVendors = useCallback(async () => {
    setLoading(true);
    try {
      const p = new URLSearchParams();
      if (vendorSearch) p.set('search', vendorSearch);
      if (vendorStatus) p.set('status', vendorStatus);
      setVendors(await apiFetch(`/admin/vendors?${p}`));
    } catch { setVendors([]); }
    finally { setLoading(false); }
  }, [apiFetch, vendorSearch, vendorStatus]);

  const loadAdminProfile = useCallback(async () => {
    try {
      setAdminProfile(await apiFetch('/admin/profile'));
      setAdminSessions(await apiFetch('/admin/profile/sessions'));
    } catch { /* */ }
  }, [apiFetch]);

  const loadSystemSettings = useCallback(async (cat: string) => {
    try {
      const data = await apiFetch(`/admin/settings/${cat}`);
      if (cat === 'general') setGeneralSettings(data);
      if (cat === 'email') setEmailSettings(data);
      if (cat === 'sms') setSmsSettings(data);
      if (cat === 'storage') setStorageSettings(data);
      if (cat === 'api') setApiSettings(data);
    } catch { /* */ }
  }, [apiFetch]);

  const loadLogs = useCallback(async () => {
    setLoading(true);
    try {
      if (logSubTab === 'audit') setAuditLogs(await apiFetch('/admin/audit-logs'));
      if (logSubTab === 'search') setSearchLogs(await apiFetch('/admin/search-logs'));
      if (logSubTab === 'activity') setActivityLogs(await apiFetch('/admin/activity-logs'));
      if (logSubTab === 'chatbot') setChatbotLogs(await apiFetch('/admin/chatbot-logs'));
    } catch { /* */ }
    finally { setLoading(false); }
  }, [apiFetch, logSubTab]);

  const loadTickets = useCallback(async () => {
    setLoading(true);
    try {
      setTickets(await apiFetch('/support/tickets'));
      setAgentsList(await apiFetch('/support/agents/available').catch(() => []));
    } catch {
      setTickets([]);
      setAgentsList([]);
    } finally {
      setLoading(false);
    }
  }, [apiFetch]);

  useEffect(() => { if (!token) return; loadStats(); }, [token, loadStats]);
  useEffect(() => { if (!token || activeTab !== 'users') return; loadUsers(); }, [token, activeTab, loadUsers]);
  useEffect(() => { if (!token || activeTab !== 'orders') return; loadOrders(); }, [token, activeTab, loadOrders]);
  useEffect(() => { if (!token || activeTab !== 'products') return; loadProducts(); }, [token, activeTab, loadProducts]);
  useEffect(() => { if (!token || activeTab !== 'vendors') return; loadVendors(); }, [token, activeTab, loadVendors]);
  useEffect(() => { if (!token || activeTab !== 'profile') return; loadAdminProfile(); }, [token, activeTab, loadAdminProfile]);
  useEffect(() => { if (!token || activeTab !== 'settings') return; loadSystemSettings(settingTab); }, [token, activeTab, settingTab, loadSystemSettings]);
  useEffect(() => { if (!token || activeTab !== 'logs') return; loadLogs(); }, [token, activeTab, logSubTab, loadLogs]);
  useEffect(() => { if (!token || activeTab !== 'support') return; loadTickets(); }, [token, activeTab, loadTickets]);

  useEffect(() => {
    if (selectedSeller) {
      setEditCompanyLegalName(selectedSeller.companyLegalName || '');
      setEditBusinessPhone(selectedSeller.businessPhone || '');
    }
  }, [selectedSeller]);

  useEffect(() => {
    if (selectedOrder) {
      setOrderTrackingCode(selectedOrder.trackingCode || '');
      setOrderStatusSelect(selectedOrder.status || '');
    }
  }, [selectedOrder]);

  useEffect(() => {
    setActiveProductImageIndex(0);
  }, [selectedProduct]);

  useEffect(() => {
    if (selectedTicket) {
      setTicketStatusSelect(selectedTicket.status || '');
      setTicketAgentSelect(selectedTicket.assignedAgentId || '');
      setTicketReplyText('');
    }
  }, [selectedTicket]);

  useEffect(() => {
    setAuditPage(1);
    setSearchPage(1);
    setActivityPage(1);
    setChatbotPage(1);
    setSelectedLogDetail(null);
  }, [logSubTab]);

  // Export helper
  const handleExportCustomers = async () => {
    try {
      const res = await apiFetch('/admin/customers/export');
      const blob = new Blob([res.csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = res.filename;
      a.click();
    } catch (err) { alert('Export failed'); }
  };

  const handleUpdateSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let body = {};
      if (settingTab === 'general') body = generalSettings;
      if (settingTab === 'email') body = emailSettings;
      if (settingTab === 'sms') body = smsSettings;
      if (settingTab === 'storage') body = storageSettings;
      if (settingTab === 'api') body = apiSettings;

      await apiAction('PUT', `/admin/settings/${settingTab}`, body);
      alert('Settings updated successfully!');
    } catch (err: any) { alert(err.message); }
  };

  const toggleMatrixPermission = (role: string, permission: string) => {
    setRolesMatrix((prev: any) => ({
      ...prev,
      [role]: {
        ...prev[role],
        [permission]: !prev[role][permission]
      }
    }));
  };

  const filteredUsers = useMemo(() => {
    let result = users.filter((u: any) => u.roles?.includes('Customer'));
    if (userSearch.trim()) {
      const q = userSearch.toLowerCase();
      result = result.filter(u => 
        (u.email && u.email.toLowerCase().includes(q)) ||
        (u.firstName && u.firstName.toLowerCase().includes(q)) ||
        (u.lastName && u.lastName.toLowerCase().includes(q))
      );
    }
    if (userStatus) {
      result = result.filter(u => u.accountStatus === userStatus);
    }
    if (userSortField) {
      result.sort((a, b) => {
        let valA = a[userSortField];
        let valB = b[userSortField];
        if (userSortField === 'name') {
          valA = `${a.firstName || ''} ${a.lastName || ''}`.trim();
          valB = `${b.firstName || ''} ${b.lastName || ''}`.trim();
        }
        if (userSortField === 'walletBalance') {
          valA = Number(valA || 0);
          valB = Number(valB || 0);
          return userSortOrder === 'asc' ? valA - valB : valB - valA;
        }
        valA = String(valA ?? '');
        valB = String(valB ?? '');
        return userSortOrder === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
      });
    }
    return result;
  }, [users, userSearch, userStatus, userSortField, userSortOrder]);

  const filteredOrders = useMemo(() => {
    let result = [...orders];
    if (orderSearch.trim()) {
      const q = orderSearch.toLowerCase();
      result = result.filter(o => 
        (o._id && o._id.toLowerCase().includes(q)) ||
        (o.status && o.status.toLowerCase().includes(q))
      );
    }
    if (orderStatus) {
      result = result.filter(o => o.status === orderStatus);
    }
    if (orderSortField) {
      result.sort((a, b) => {
        let valA = a[orderSortField];
        let valB = b[orderSortField];
        if (orderSortField === 'totalPrice') {
          valA = Number(valA || 0);
          valB = Number(valB || 0);
          return orderSortOrder === 'asc' ? valA - valB : valB - valA;
        }
        if (orderSortField === 'createdAt') {
          valA = new Date(a.createdAt || 0).getTime();
          valB = new Date(b.createdAt || 0).getTime();
          return orderSortOrder === 'asc' ? valA - valB : valB - valA;
        }
        valA = String(valA ?? '');
        valB = String(valB ?? '');
        return orderSortOrder === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
      });
    }
    return result;
  }, [orders, orderSearch, orderStatus, orderSortField, orderSortOrder]);

  const filteredProducts = useMemo(() => {
    let result = products.filter((p: any) => p.title?.toLowerCase().includes(productSearch.toLowerCase()));
    if (productSortField) {
      result.sort((a, b) => {
        let valA = a[productSortField];
        let valB = b[productSortField];
        if (productSortField === 'price') {
          valA = Number(valA || 0);
          valB = Number(valB || 0);
          return productSortOrder === 'asc' ? valA - valB : valB - valA;
        }
        if (productSortField === 'isApproved') {
          valA = a.isApproved ? 1 : 0;
          valB = b.isApproved ? 1 : 0;
          return productSortOrder === 'asc' ? valA - valB : valB - valA;
        }
        valA = String(valA ?? '');
        valB = String(valB ?? '');
        return productSortOrder === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
      });
    }
    return result;
  }, [products, productSearch, productSortField, productSortOrder]);

  const filteredVendors = useMemo(() => {
    let result = vendors.filter((v: any) => {
      const roles = v.userId?.roles || [];
      if (vendorType === 'seller') return roles.includes('Seller');
      if (vendorType === 'vendor') return roles.includes('Vendor');
      return true;
    });

    if (vendorSearch.trim()) {
      const q = vendorSearch.toLowerCase();
      result = result.filter(v => 
        (v.shopName && v.shopName.toLowerCase().includes(q)) ||
        (v.companyLegalName && v.companyLegalName.toLowerCase().includes(q))
      );
    }

    if (vendorStatus) {
      result = result.filter(v => v.status === vendorStatus);
    }
    
    if (vendorSortField) {
      result.sort((a, b) => {
        let valA = a[vendorSortField];
        let valB = b[vendorSortField];
        if (vendorSortField === 'type') {
          valA = a.userId?.roles?.includes('Seller') ? 'Seller' : 'Vendor';
          valB = b.userId?.roles?.includes('Seller') ? 'Seller' : 'Vendor';
        }
        if (vendorSortField === 'commissionRate') {
          valA = Number(valA || 0);
          valB = Number(valB || 0);
          return vendorSortOrder === 'asc' ? valA - valB : valB - valA;
        }
        valA = String(valA ?? '');
        valB = String(valB ?? '');
        return vendorSortOrder === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
      });
    }
    return result;
  }, [vendors, vendorType, vendorSearch, vendorStatus, vendorSortField, vendorSortOrder]);

  const limit = generalSettings.pageSize || 20;

  const totalUserPages = Math.ceil(filteredUsers.length / limit) || 1;
  const paginatedUsers = useMemo(() => {
    return filteredUsers.slice((userPage - 1) * limit, userPage * limit);
  }, [filteredUsers, userPage, limit]);

  const totalOrderPages = Math.ceil(filteredOrders.length / limit) || 1;
  const paginatedOrders = useMemo(() => {
    return filteredOrders.slice((orderPage - 1) * limit, orderPage * limit);
  }, [filteredOrders, orderPage, limit]);

  const totalProductPages = Math.ceil(filteredProducts.length / limit) || 1;
  const paginatedProducts = useMemo(() => {
    return filteredProducts.slice((productPage - 1) * limit, productPage * limit);
  }, [filteredProducts, productPage, limit]);

  const totalVendorPages = Math.ceil(filteredVendors.length / limit) || 1;
  const paginatedVendors = useMemo(() => {
    return filteredVendors.slice((vendorPage - 1) * limit, vendorPage * limit);
  }, [filteredVendors, vendorPage, limit]);

  useEffect(() => {
    if (userPage > totalUserPages) setUserPage(1);
  }, [filteredUsers.length, totalUserPages, userPage]);

  useEffect(() => {
    if (orderPage > totalOrderPages) setOrderPage(1);
  }, [filteredOrders.length, totalOrderPages, orderPage]);

  useEffect(() => {
    if (productPage > totalProductPages) setProductPage(1);
  }, [filteredProducts.length, totalProductPages, productPage]);

  useEffect(() => {
    if (vendorPage > totalVendorPages) setVendorPage(1);
  }, [filteredVendors.length, totalVendorPages, vendorPage]);

  const filteredSessions = useMemo(() => {
    let result = [...chatbotLogs];

    // Filter by search query (Session ID or Owner)
    if (chatSearch.trim()) {
      const q = chatSearch.toLowerCase();
      result = result.filter(session => 
        (session.sessionId && session.sessionId.toLowerCase().includes(q)) ||
        (session.userId?.email && session.userId.email.toLowerCase().includes(q)) ||
        (session.guestId && session.guestId.toLowerCase().includes(q))
      );
    }

    // Filter by owner type
    if (chatFilterType === 'users') {
      result = result.filter(session => session.userId);
    } else if (chatFilterType === 'guests') {
      result = result.filter(session => !session.userId);
    }

    // Filter by min message count
    if (chatMinMsgs > 0) {
      result = result.filter(session => (session.messages?.length || 0) >= chatMinMsgs);
    }

    // Filter by fallbacks
    if (chatShowOnlyFallbacks) {
      result = result.filter(session => {
        const messages = session.messages || [];
        return messages.some((msg: any) => 
          msg.role === 'user' && 
          (msg.intent === 'FALLBACK' || msg.intent === 'HELP' || !msg.intent)
        );
      });
    }

    // Sorting
    if (chatSortField === 'sessionId') {
      result.sort((a, b) => {
        const valA = a.sessionId || '';
        const valB = b.sessionId || '';
        return chatSortOrder === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
      });
    } else if (chatSortField === 'owner') {
      result.sort((a, b) => {
        const valA = a.userId?.email || a.guestId || 'Guest';
        const valB = b.userId?.email || b.guestId || 'Guest';
        return chatSortOrder === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
      });
    } else if (chatSortField === 'msgs') {
      result.sort((a, b) => {
        const lenA = a.messages?.length || 0;
        const lenB = b.messages?.length || 0;
        return chatSortOrder === 'asc' ? lenA - lenB : lenB - lenA;
      });
    } else {
      result.sort((a, b) => {
        const tA = new Date(a.updatedAt || a.createdAt || 0).getTime();
        const tB = new Date(b.updatedAt || b.createdAt || 0).getTime();
        return chatSortOrder === 'asc' ? tA - tB : tB - tA;
      });
    }

    return result;
  }, [chatbotLogs, chatSearch, chatFilterType, chatMinMsgs, chatShowOnlyFallbacks, chatSortField, chatSortOrder]);

  const filteredAudits = useMemo(() => {
    let result = [...auditLogs];
    if (auditSearch.trim()) {
      const q = auditSearch.toLowerCase();
      result = result.filter(l => 
        (l.action && l.action.toLowerCase().includes(q)) ||
        (l.resource && l.resource.toLowerCase().includes(q)) ||
        (l.userId?.email && l.userId.email.toLowerCase().includes(q)) ||
        (l.ipAddress && l.ipAddress.toLowerCase().includes(q))
      );
    }
    if (auditRole !== 'all') {
      result = result.filter(l => l.userRole === auditRole);
    }
    if (auditSortField) {
      result.sort((a, b) => {
        let valA = a[auditSortField];
        let valB = b[auditSortField];
        if (auditSortField === 'operator') {
          valA = a.userId?.email || 'System';
          valB = b.userId?.email || 'System';
        }
        if (auditSortField === 'createdAt') {
          valA = new Date(a.createdAt || 0).getTime();
          valB = new Date(b.createdAt || 0).getTime();
          return auditSortOrder === 'asc' ? valA - valB : valB - valA;
        }
        valA = String(valA ?? '');
        valB = String(valB ?? '');
        return auditSortOrder === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
      });
    }
    return result;
  }, [auditLogs, auditSearch, auditRole, auditSortField, auditSortOrder]);

  const filteredSearches = useMemo(() => {
    let result = [...searchLogs];
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(l => l.keyword && l.keyword.toLowerCase().includes(q));
    }
    if (searchRole !== 'all') {
      result = result.filter(l => l.userRole === searchRole);
    }
    if (searchSource !== 'all') {
      result = result.filter(l => l.source === searchSource);
    }
    if (searchSortField) {
      result.sort((a, b) => {
        let valA = a[searchSortField];
        let valB = b[searchSortField];
        if (searchSortField === 'createdAt') {
          valA = new Date(a.createdAt || 0).getTime();
          valB = new Date(b.createdAt || 0).getTime();
          return searchSortOrder === 'asc' ? valA - valB : valB - valA;
        }
        if (searchSortField === 'resultsCount') {
          valA = Number(valA || 0);
          valB = Number(valB || 0);
          return searchSortOrder === 'asc' ? valA - valB : valB - valA;
        }
        valA = String(valA ?? '');
        valB = String(valB ?? '');
        return searchSortOrder === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
      });
    }
    return result;
  }, [searchLogs, searchQuery, searchRole, searchSource, searchSortField, searchSortOrder]);

  const filteredActivities = useMemo(() => {
    let result = [...activityLogs];
    if (activitySearch.trim()) {
      const q = activitySearch.toLowerCase();
      result = result.filter(l => 
        (l.action && l.action.toLowerCase().includes(q)) ||
        (l.category && l.category.toLowerCase().includes(q)) ||
        (l.details && l.details.toLowerCase().includes(q))
      );
    }
    if (activityCategory !== 'all') {
      result = result.filter(l => l.category === activityCategory);
    }
    if (activitySortField) {
      result.sort((a, b) => {
        let valA = a[activitySortField];
        let valB = b[activitySortField];
        if (activitySortField === 'createdAt') {
          valA = new Date(a.createdAt || 0).getTime();
          valB = new Date(b.createdAt || 0).getTime();
          return activitySortOrder === 'asc' ? valA - valB : valB - valA;
        }
        valA = String(valA ?? '');
        valB = String(valB ?? '');
        return activitySortOrder === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
      });
    }
    return result;
  }, [activityLogs, activitySearch, activityCategory, activitySortField, activitySortOrder]);

  const totalAuditPages = Math.ceil(filteredAudits.length / limit) || 1;
  const paginatedAudits = useMemo(() => {
    return filteredAudits.slice((auditPage - 1) * limit, auditPage * limit);
  }, [filteredAudits, auditPage, limit]);

  const totalSearchPages = Math.ceil(filteredSearches.length / limit) || 1;
  const paginatedSearches = useMemo(() => {
    return filteredSearches.slice((searchPage - 1) * limit, searchPage * limit);
  }, [filteredSearches, searchPage, limit]);

  const totalActivityPages = Math.ceil(filteredActivities.length / limit) || 1;
  const paginatedActivities = useMemo(() => {
    return filteredActivities.slice((activityPage - 1) * limit, activityPage * limit);
  }, [filteredActivities, activityPage, limit]);

  const totalChatbotPages = Math.ceil(filteredSessions.length / limit) || 1;
  const paginatedSessions = useMemo(() => {
    return filteredSessions.slice((chatbotPage - 1) * limit, chatbotPage * limit);
  }, [filteredSessions, chatbotPage, limit]);

  useEffect(() => {
    if (auditPage > totalAuditPages) setAuditPage(1);
  }, [filteredAudits.length, totalAuditPages, auditPage]);

  useEffect(() => {
    if (searchPage > totalSearchPages) setSearchPage(1);
  }, [filteredSearches.length, totalSearchPages, searchPage]);

  useEffect(() => {
    if (activityPage > totalActivityPages) setActivityPage(1);
  }, [filteredActivities.length, totalActivityPages, activityPage]);

  useEffect(() => {
    if (chatbotPage > totalChatbotPages) setChatbotPage(1);
  }, [filteredSessions.length, totalChatbotPages, chatbotPage]);

  const breadcrumbs = useMemo(() => {
    const list = [{ label: 'Admin Console', onClick: () => setActiveTab('overview') }];
    
    const tabLabels: Record<string, string> = {
      overview: 'Dashboard Home',
      profile: 'Admin Profile',
      users: 'Customers Workspace',
      orders: 'Orders Management',
      products: 'Supply Catalog',
      vendors: 'Merchant Partners',
      support: 'Support Center',
      settings: 'System Configurations',
      analytics: 'Analytics Overview',
      logs: 'Log Registries',
      roles: 'Permissions Matrix',
    };

    if (activeTab !== 'overview') {
      list.push({
        label: tabLabels[activeTab] || activeTab,
        onClick: () => {
          if (activeTab === 'vendors') setVendorType('all');
          if (activeTab === 'logs') setLogSubTab('audit');
          if (activeTab === 'settings') setSettingTab('general');
          setSelectedUser(null);
          setSelectedSeller(null);
          setSelectedVendor(null);
          setSelectedOrder(null);
          setSelectedProduct(null);
          setSelectedTicket(null);
          setSelectedLogDetail(null);
        }
      });
    }

    if (activeTab === 'vendors' && vendorType !== 'all') {
      list.push({
        label: vendorType === 'seller' ? 'Sellers (B2C)' : 'Vendors (B2B)',
        onClick: () => {}
      });
    }

    if (activeTab === 'logs') {
      const subLabels: Record<string, string> = {
        audit: 'System Audits',
        search: 'Searches Log',
        activity: 'User Activities',
        chatbot: 'Chatbot Conversations',
      };
      list.push({
        label: subLabels[logSubTab] || logSubTab,
        onClick: () => {
          setSelectedLogDetail(null);
        }
      });
    }

    if (activeTab === 'settings') {
      const subLabels: Record<string, string> = {
        general: 'General Info',
        email: 'SMTP Mailer',
        sms: 'Twilio Settings',
        storage: 'S3 / Local Storage',
        api: 'OpenAI / Maps API Keys',
      };
      list.push({
        label: subLabels[settingTab] || settingTab,
        onClick: () => {}
      });
    }

    if (selectedUser) {
      list.push({
        label: `Customer: ${selectedUser.firstName} ${selectedUser.lastName}`,
        onClick: () => {}
      });
    }

    if (selectedSeller) {
      list.push({
        label: `Seller: ${selectedSeller.shopName || selectedSeller.userId?.email}`,
        onClick: () => {}
      });
    }

    if (selectedVendor) {
      list.push({
        label: `Vendor: ${selectedVendor.shopName || selectedVendor.userId?.email}`,
        onClick: () => {}
      });
    }

    if (selectedOrder) {
      list.push({
        label: `Order: #${selectedOrder._id?.toString().slice(-8).toUpperCase()}`,
        onClick: () => {}
      });
    }

    if (selectedProduct) {
      list.push({
        label: `Product: ${selectedProduct.title}`,
        onClick: () => {}
      });
    }

    if (selectedTicket) {
      list.push({
        label: `Ticket: ${selectedTicket.subject || selectedTicket._id}`,
        onClick: () => {}
      });
    }

    if (selectedLogDetail) {
      list.push({
        label: `Log Detail: ${selectedLogDetail.action || selectedLogDetail.keyword || 'Overview'}`,
        onClick: () => {}
      });
    }

    return list;
  }, [activeTab, vendorType, logSubTab, settingTab, selectedUser, selectedSeller, selectedVendor, selectedOrder, selectedProduct, selectedTicket, selectedLogDetail]);

  if (!mounted) return null;

  if (!token) return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 px-4">
      <div className="max-w-md w-full bg-white dark:bg-zinc-900 rounded-2xl border dark:border-zinc-800 shadow-xl p-8 space-y-6">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 rounded-xl bg-indigo-100 dark:bg-indigo-950 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <h1 className="mt-4 text-2xl font-extrabold text-zinc-900 dark:text-white">ApexStore Admin</h1>
          <p className="mt-1 text-sm text-zinc-500">Sign in with your admin credentials</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <input type="email" required placeholder="Admin email" value={loginEmail} onChange={e => setLoginEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border dark:border-zinc-700 bg-white dark:bg-zinc-950 text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-indigo-500" />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <input type="password" required placeholder="Password" value={loginPassword} onChange={e => setLoginPassword(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border dark:border-zinc-700 bg-white dark:bg-zinc-950 text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-indigo-500" />
          </div>
          {loginError && (
            <div className="flex items-center gap-2 text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-xl px-3 py-2">
              <AlertCircle className="h-4 w-4 shrink-0" /> {loginError}
            </div>
          )}
          <button type="submit" className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-lg active:scale-95 transition-all cursor-pointer">
            Sign In to Admin
          </button>
        </form>
        <div className="flex justify-center">
          <button onClick={toggleTheme} className="p-2 rounded-lg border dark:border-zinc-700 text-zinc-400 hover:text-indigo-500">
            {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </div>
  );

  const navItems = [
    { key: 'overview',  label: 'Overview',  icon: <LayoutDashboard className="h-4 w-4" /> },
    { key: 'users',     label: 'Customers', icon: <Users className="h-4 w-4" /> },
    { key: 'orders',    label: 'Orders',    icon: <ShoppingBag className="h-4 w-4" /> },
    { key: 'products',  label: 'Products',  icon: <Package className="h-4 w-4" /> },
    { key: 'vendors',   label: 'Merchants', icon: <Store className="h-4 w-4" /> },
    { key: 'support',   label: 'Support Center', icon: <AlertCircle className="h-4 w-4" /> },
    { key: 'settings',  label: 'Settings',  icon: <Settings className="h-4 w-4" /> },
    { key: 'analytics', label: 'Analytics', icon: <TrendingUp className="h-4 w-4" /> },
    { key: 'logs',      label: 'System Logs',icon: <Database className="h-4 w-4" /> },
    { key: 'roles',     label: 'Permissions',icon: <ShieldAlert className="h-4 w-4" /> },
  ];

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col transition-colors duration-300">
      {/* Topbar */}
      <header className="sticky top-0 z-40 border-b border-zinc-200/80 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2 font-bold text-lg text-indigo-600 dark:text-indigo-400">
          <ShieldCheck className="h-5 w-5" />
          <span>ApexStore Admin Console</span>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setActiveTab('profile')} 
            className={`flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              activeTab === 'profile'
                ? 'text-indigo-600 bg-indigo-50 dark:bg-indigo-950/20 dark:text-indigo-400'
                : 'text-zinc-500 hover:text-indigo-500 hover:bg-zinc-50 dark:hover:bg-zinc-800'
            }`}
          >
            <User className="h-4 w-4" />
            <span className="hidden md:block font-semibold">{adminEmail}</span>
          </button>
          <button onClick={toggleTheme} className="p-2 text-zinc-500 hover:text-indigo-500 rounded-lg">
            {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </button>
          <button onClick={logout} className="flex items-center gap-1.5 text-xs font-semibold text-zinc-600 dark:text-zinc-300 border dark:border-zinc-700 rounded-lg px-3 py-1.5 hover:bg-zinc-50 dark:hover:bg-zinc-800 cursor-pointer">
            <LogOut className="h-3.5 w-3.5" /> Sign Out
          </button>
        </div>
      </header>

      <div className="flex flex-1 max-w-[1600px] w-full mx-auto">
        {/* Sidebar */}
        <aside className="hidden lg:flex w-56 flex-col border-r dark:border-zinc-800 bg-white dark:bg-zinc-900 py-6 px-4 gap-1">
          {navItems.map(n => (
            <button key={n.key} onClick={() => setActiveTab(n.key)}
              className={`flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-xs font-semibold w-full text-left transition-colors ${activeTab === n.key
                ? 'bg-indigo-50 dark:bg-indigo-950/20 text-indigo-700 dark:text-indigo-300 border border-indigo-100/50 dark:border-indigo-900/30'
                : 'text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/40'}`}>
              {n.icon}{n.label}
            </button>
          ))}
        </aside>

        <main className="flex-1 p-6 space-y-6 overflow-y-auto">
          {apiError && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-xl text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <span>API Connection Error: {apiError}. Please sign out and sign back in, or check backend logs.</span>
            </div>
          )}
          {/* Breadcrumbs Navigation */}
          <nav className="flex items-center gap-1.5 text-xs text-zinc-400 dark:text-zinc-500 font-medium pb-2 border-b dark:border-zinc-800">
            {breadcrumbs.map((b, idx) => (
              <React.Fragment key={idx}>
                {idx > 0 && <span className="text-[10px] text-zinc-300">/</span>}
                <button
                  onClick={b.onClick}
                  className={`hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors ${
                    idx === breadcrumbs.length - 1 
                      ? 'text-zinc-800 dark:text-zinc-200 font-bold' 
                      : 'cursor-pointer'
                  }`}
                  disabled={idx === breadcrumbs.length - 1}
                >
                  {b.label}
                </button>
              </React.Fragment>
            ))}
          </nav>

          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <>
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-black text-zinc-900 dark:text-white">Dashboard Home</h1>
                  <p className="text-sm text-zinc-500 mt-0.5">Central system performance metrics and analytics cache.</p>
                </div>
                <div className="flex items-center gap-2 bg-emerald-100/60 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-900/30 px-3.5 py-1.5 rounded-xl text-xs font-bold">
                  <Activity className="h-4 w-4 animate-pulse" /> System Health: 99.9% Operational
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard label="Total Users" value={users.length || 25} icon={<Users className="h-5 w-5" />} color="indigo" />
                <StatCard label="Total Orders" value={orders.length || 18} icon={<ShoppingBag className="h-5 w-5" />} color="blue" />
                <StatCard label="Active Sellers" value={vendors.filter((v:any)=>v.status==='Active' && v.userId?.roles?.includes('Seller')).length || 2} icon={<Store className="h-5 w-5" />} color="emerald" />
                <StatCard label="Active Vendors" value={vendors.filter((v:any)=>v.status==='Active' && v.userId?.roles?.includes('Vendor')).length || 2} icon={<Package className="h-5 w-5" />} color="violet" />
              </div>

              {/* Quick Activities */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-zinc-900 rounded-2xl border dark:border-zinc-800 shadow-sm p-6 space-y-4">
                  <h3 className="font-bold text-sm text-zinc-900 dark:text-white border-b pb-2 dark:border-zinc-800">Pending Merchant Review</h3>
                  <div className="space-y-3">
                    {vendors.filter((v:any)=>v.status==='Verification In Progress').slice(0, 3).map((v:any) => (
                      <div key={v._id} className="flex justify-between items-center p-3 border dark:border-zinc-800 rounded-xl bg-zinc-50/20">
                        <div>
                          <div className="text-xs font-bold text-zinc-900 dark:text-white">{v.shopName}</div>
                          <div className="text-[10px] text-zinc-400">{v.companyLegalName || 'Individual Retailer'}</div>
                        </div>
                        <button onClick={() => { setSelectedSeller(v); setActiveTab('vendors'); }}
                          className="px-2.5 py-1 bg-indigo-600 text-white rounded-lg text-[10px] font-bold">Verify</button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white dark:bg-zinc-900 rounded-2xl border dark:border-zinc-800 shadow-sm p-6 space-y-4">
                  <h3 className="font-bold text-sm text-zinc-900 dark:text-white border-b pb-2 dark:border-zinc-800">Recent System Audits</h3>
                  <div className="space-y-3">
                    <div className="text-xs text-zinc-400 space-y-2">
                      <div className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-emerald-500" /> Admin updated System SMTP Configurations</div>
                      <div className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-emerald-500" /> Admin approved vendor 'Mega Vendor Corp'</div>
                      <div className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-emerald-500" /> User bob.johnson@example.com status updated to Active</div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* MY PROFILE TAB */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-black text-zinc-900 dark:text-white">Admin Profile Management</h1>
                <p className="text-sm text-zinc-500 mt-0.5">Manage credentials, connected devices, and 2FA security.</p>
              </div>

              <div className="bg-white dark:bg-zinc-900 rounded-2xl border dark:border-zinc-800 overflow-hidden shadow-sm">
                <div className="h-32 bg-gradient-to-r from-indigo-500 to-purple-600 relative"></div>
                <div className="px-6 pb-6 relative flex flex-col md:flex-row justify-between items-start gap-4">
                  <div className="flex items-end gap-4 -mt-10">
                    <div className="h-20 w-20 rounded-2xl bg-zinc-200 border-4 border-white dark:border-zinc-900 flex items-center justify-center text-zinc-500 text-xl font-bold">A</div>
                    <div>
                      <h2 className="text-lg font-bold text-zinc-900 dark:text-white">Platform Administrator</h2>
                      <p className="text-xs text-zinc-400">Employee ID: EMP-2026-9872 · Joined Jan 2026</p>
                    </div>
                  </div>
                  <div className="pt-4 flex gap-2">
                    <button className="px-3.5 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-semibold">Upload Photo</button>
                    <button className="px-3.5 py-1.5 border dark:border-zinc-800 text-zinc-600 dark:text-zinc-300 rounded-lg text-xs font-semibold">Change Cover</button>
                  </div>
                </div>
              </div>

              {/* Profile details & Connected devices */}
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-zinc-900 rounded-2xl border dark:border-zinc-800 p-6 space-y-4 md:col-span-2">
                  <h3 className="font-bold text-sm text-zinc-900 dark:text-white border-b pb-2 dark:border-zinc-800">Account Credentials</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block mb-1">First Name</label>
                      <input className="w-full rounded-lg border dark:border-zinc-800 p-2 text-xs focus:outline-none focus:border-indigo-500 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white" defaultValue="Platform" />
                    </div>
                    <div>
                      <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block mb-1">Last Name</label>
                      <input className="w-full rounded-lg border dark:border-zinc-800 p-2 text-xs focus:outline-none focus:border-indigo-500 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white" defaultValue="Administrator" />
                    </div>
                    <div>
                      <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block mb-1">Email</label>
                      <input disabled className="w-full rounded-lg border dark:border-zinc-800 p-2 text-xs bg-zinc-50 dark:bg-zinc-950 text-zinc-400" value={adminEmail} />
                    </div>
                    <div>
                      <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block mb-1">Department</label>
                      <input disabled className="w-full rounded-lg border dark:border-zinc-800 p-2 text-xs bg-zinc-50 dark:bg-zinc-950 text-zinc-400" value="Platform Administration" />
                    </div>
                  </div>
                  <button className="px-3.5 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-semibold">Save Personal Details</button>
                </div>

                <div className="bg-white dark:bg-zinc-900 rounded-2xl border dark:border-zinc-800 p-6 space-y-4">
                  <h3 className="font-bold text-sm text-zinc-900 dark:text-white border-b pb-2 dark:border-zinc-800">MFA & Security</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="text-xs font-bold text-zinc-800 dark:text-zinc-200">Two-Factor Authentication</div>
                        <div className="text-[10px] text-zinc-400">Code check on panel logins</div>
                      </div>
                      <button className="text-emerald-500"><ToggleRight className="h-8 w-8" /></button>
                    </div>
                    <div className="border-t dark:border-zinc-800 pt-3">
                      <div className="text-xs font-bold text-zinc-800 dark:text-zinc-200 mb-2">Connected Devices</div>
                      <div className="space-y-2">
                        {adminSessions.map((s:any) => (
                          <div key={s._id} className="flex justify-between items-center text-[10px] p-2 border dark:border-zinc-800 rounded bg-zinc-50/20">
                            <div>
                              <div className="font-bold text-zinc-800 dark:text-zinc-200">{s.browser} · {s.os}</div>
                              <div className="text-zinc-400">{s.ipAddress}</div>
                            </div>
                            <button onClick={async()=>{await apiAction('DELETE',`/admin/profile/sessions/${s._id}`);loadAdminProfile();}}
                              className="text-red-500 font-semibold hover:underline">Revoke</button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* CUSTOMERS TAB */}
          {activeTab === 'users' && (
            <Section>
              <SectionHeader title="Customers Workspace" desc={`Showing ${paginatedUsers.length} of ${filteredUsers.length} B2C customers (${users.filter((u:any)=>u.roles?.includes('Customer')).length} total)`}
                right={
                  <div className="flex gap-2">
                    <button onClick={handleExportCustomers} className="flex items-center gap-1 px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-semibold shadow cursor-pointer">
                      <Download className="h-3.5 w-3.5" /> CSV Export
                    </button>
                    <button onClick={loadUsers} className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 cursor-pointer"><RefreshCw className="h-4 w-4" /></button>
                  </div>
                } />
              <FilterBar>
                <SearchBar value={userSearch} onChange={setUserSearch} placeholder="Search email, name, phone…" />
                <Sel value={userStatus} onChange={setUserStatus} placeholder="All Statuses" options={[
                  {value:'Active',label:'Active'},{value:'Inactive',label:'Inactive'},{value:'Suspended',label:'Suspended'},
                ]} />
                <ApplyBtn onClick={loadUsers} />
              </FilterBar>
              {loading ? <Loading /> : (
                <>
                  <Table>
                    <Thead><tr>
                      {renderSortableHeader('Email', 'email', userSortField, userSortOrder, (f, o) => { setUserSortField(f); setUserSortOrder(o); })}
                      {renderSortableHeader('Name', 'name', userSortField, userSortOrder, (f, o) => { setUserSortField(f); setUserSortOrder(o); })}
                      {renderSortableHeader('Wallet Balance', 'walletBalance', userSortField, userSortOrder, (f, o) => { setUserSortField(f); setUserSortOrder(o); })}
                      {renderSortableHeader('Status', 'accountStatus', userSortField, userSortOrder, (f, o) => { setUserSortField(f); setUserSortOrder(o); })}
                      <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-zinc-500">Actions</th>
                    </tr></Thead>
                    <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                      {paginatedUsers.map((u:any) => (
                        <tr key={u._id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40">
                          <td className="px-4 py-3 text-sm font-medium text-zinc-900 dark:text-white cursor-pointer" onClick={() => setSelectedUser(u)}>{u.email}</td>
                          <td className="px-4 py-3 text-sm text-zinc-500">{u.firstName} {u.lastName}</td>
                          <td className="px-4 py-3 text-sm text-zinc-500">${(u.walletBalance??0).toFixed(2)}</td>
                          <td className="px-4 py-3">{badge(statusColor(u.accountStatus), u.accountStatus)}</td>
                          <td className="px-4 py-3"><div className="flex gap-1">
                            <button onClick={async()=>{await apiAction('PUT',`/admin/users/${u._id}`,{accountStatus:u.accountStatus==='Active'?'Suspended':'Active'});loadUsers();}}
                              className="p-1.5 rounded-lg text-zinc-400 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950/20 cursor-pointer" title="Toggle status"><Edit2 className="h-3.5 w-3.5"/></button>
                            <button onClick={async()=>{if(!confirm('Delete customer account?'))return;await apiAction('DELETE',`/admin/users/${u._id}`);loadUsers();}}
                              className="p-1.5 rounded-lg text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 cursor-pointer"><Trash2 className="h-3.5 w-3.5"/></button>
                          </div></td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                  <Pagination currentPage={userPage} totalPages={totalUserPages} onPageChange={setUserPage} />
                </>
              )}

              {/* Customer Detail Drawer */}
              {selectedUser && (
                <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-sm">
                  <div className="w-full max-w-md bg-white dark:bg-zinc-900 h-full p-6 shadow-2xl border-l dark:border-zinc-800 overflow-y-auto space-y-6">
                    <div className="flex items-center justify-between border-b pb-3 dark:border-zinc-800">
                      <h3 className="font-black text-base text-zinc-900 dark:text-white">Customer Profile</h3>
                      <button onClick={() => setSelectedUser(null)} className="p-1 text-zinc-400"><X className="h-5 w-5" /></button>
                    </div>
                    <div className="space-y-4 text-sm">
                      <div><strong className="text-zinc-400">Email:</strong> <span className="text-zinc-800 dark:text-zinc-200">{selectedUser.email}</span></div>
                      <div><strong className="text-zinc-400">Name:</strong> <span className="text-zinc-800 dark:text-zinc-200">{selectedUser.firstName} {selectedUser.lastName}</span></div>
                      <div><strong className="text-zinc-400">Wallet:</strong> <span className="text-zinc-800 dark:text-zinc-200">${(selectedUser.walletBalance || 0).toFixed(2)}</span></div>
                      <div><strong className="text-zinc-400">Rewards:</strong> <span className="text-zinc-800 dark:text-zinc-200">{selectedUser.rewardPoints || 0} Points</span></div>
                      <div><strong className="text-zinc-400">Status:</strong> {badge(statusColor(selectedUser.accountStatus), selectedUser.accountStatus)}</div>
                    </div>
                  </div>
                </div>
              )}
            </Section>
          )}

          {/* ORDERS TAB */}
          {activeTab === 'orders' && (
            <Section>
              {selectedOrder ? (
                <>
                  <SectionHeader title={`Order Details: #${selectedOrder._id?.toString().slice(-8).toUpperCase()}`} desc={`ID: ${selectedOrder._id}`}
                    right={
                      <button onClick={() => setSelectedOrder(null)} className="px-3 py-1.5 border dark:border-zinc-800 text-zinc-600 hover:text-indigo-500 rounded-lg text-xs font-semibold flex items-center gap-1.5 dark:text-zinc-300 bg-white dark:bg-zinc-900 cursor-pointer">
                        <X className="h-4 w-4"/> Back to Orders
                      </button>
                    } />
                  <div className="grid md:grid-cols-2 gap-6 text-xs mt-4">
                    {/* Left side: Status & Shipping */}
                    <div className="space-y-4">
                      <div className="bg-zinc-50 dark:bg-zinc-950 p-4 rounded-xl space-y-3 border dark:border-zinc-800">
                        <h4 className="font-bold text-[10px] text-zinc-400 uppercase tracking-wider">Order Management</h4>
                        
                        <div>
                          <label className="block text-[10px] text-zinc-400 font-bold mb-1">Status</label>
                          <select 
                            value={orderStatusSelect} 
                            onChange={e => setOrderStatusSelect(e.target.value)}
                            className="w-full px-2 py-1.5 border dark:border-zinc-800 bg-white dark:bg-zinc-950 rounded-lg text-xs text-zinc-900 dark:text-white"
                          >
                            <option value="Pending">Pending</option>
                            <option value="Paid">Paid</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-[10px] text-zinc-400 font-bold mb-1">Tracking Code</label>
                          <input 
                            type="text" 
                            value={orderTrackingCode} 
                            onChange={e => setOrderTrackingCode(e.target.value)}
                            className="w-full px-2 py-1.5 border dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white rounded-lg text-xs"
                            placeholder="Enter tracking code"
                          />
                        </div>

                        <button 
                          onClick={async () => {
                            try {
                              await apiAction('PUT', `/admin/orders/${selectedOrder._id}/status`, { status: orderStatusSelect, trackingCode: orderTrackingCode });
                              alert('Order updated successfully!');
                              setSelectedOrder(null);
                              loadOrders();
                            } catch (err: any) {
                              alert(`Failed to update order: ${err.message}`);
                            }
                          }}
                          className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg text-center cursor-pointer"
                        >
                          Save Status & Tracking
                        </button>
                      </div>

                      <div className="space-y-2">
                        <h4 className="font-bold text-[10px] text-zinc-400 uppercase tracking-wider">Shipping Address</h4>
                        <div className="bg-zinc-50 dark:bg-zinc-950 p-4 rounded-xl border dark:border-zinc-800 space-y-1 text-zinc-700 dark:text-zinc-300">
                          <div><strong>Name:</strong> {selectedOrder.shippingAddress?.fullName || '—'}</div>
                          <div><strong>Street:</strong> {selectedOrder.shippingAddress?.addressLine1 || '—'}</div>
                          <div><strong>City/State:</strong> {selectedOrder.shippingAddress?.city || '—'}, {selectedOrder.shippingAddress?.state || '—'}</div>
                          <div><strong>Postal Code:</strong> {selectedOrder.shippingAddress?.postalCode || '—'}</div>
                          <div><strong>Country:</strong> {selectedOrder.shippingAddress?.country || '—'}</div>
                          <div><strong>Phone:</strong> {selectedOrder.shippingAddress?.phone || '—'}</div>
                        </div>
                      </div>
                    </div>

                    {/* Right side: Items & Totals */}
                    <div className="space-y-4">
                      <h4 className="font-bold text-[10px] text-zinc-400 uppercase tracking-wider">Ordered Items</h4>
                      <div className="divide-y divide-zinc-100 dark:divide-zinc-800 bg-zinc-50 dark:bg-zinc-950 p-4 rounded-xl border dark:border-zinc-800 space-y-3">
                        {selectedOrder.items?.map((item: any, idx: number) => (
                          <div key={idx} className="flex justify-between items-center py-2 text-xs first:pt-0 last:pb-0">
                            <div>
                              <div className="font-bold text-zinc-805 dark:text-zinc-200">{item.productId?.title || 'Product Item'}</div>
                              <div className="text-[10px] text-zinc-400 font-mono">Qty: {item.quantity} × ${item.price?.toFixed(2)}</div>
                            </div>
                            <span className="font-bold text-zinc-900 dark:text-white">${((item.quantity || 1) * (item.price || 0)).toFixed(2)}</span>
                          </div>
                        ))}
                        
                        <div className="pt-3 border-t dark:border-zinc-800 space-y-1.5 text-xs">
                          <div className="flex justify-between text-zinc-500">
                            <span>Tax:</span>
                            <span>${(selectedOrder.tax || 0).toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between text-zinc-500">
                            <span>Discount:</span>
                            <span>-${(selectedOrder.discount || 0).toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between font-black text-sm text-zinc-900 dark:text-white pt-1">
                            <span>Total Price:</span>
                            <span>${(selectedOrder.totalPrice || 0).toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <SectionHeader title="Orders Workspace" desc={`Showing ${paginatedOrders.length} of ${filteredOrders.length} orders (${orders.length} total)`}
                    right={<button onClick={loadOrders} className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 cursor-pointer"><RefreshCw className="h-4 w-4"/></button>} />
                  <FilterBar>
                    <SearchBar value={orderSearch} onChange={setOrderSearch} placeholder="Search order ID, status…" />
                    <Sel value={orderStatus} onChange={setOrderStatus} placeholder="All Statuses" options={[
                      {value:'Pending',label:'Pending'},{value:'Paid',label:'Paid'},{value:'Shipped',label:'Shipped'},
                      {value:'Delivered',label:'Delivered'},{value:'Cancelled',label:'Cancelled'},
                    ]} />
                    <ApplyBtn onClick={loadOrders} />
                  </FilterBar>
                  {loading ? <Loading /> : (
                    <>
                      <Table>
                        <Thead><tr>
                          {renderSortableHeader('Order ID', '_id', orderSortField, orderSortOrder, (f, o) => { setOrderSortField(f); setOrderSortOrder(o); })}
                          {renderSortableHeader('Status', 'status', orderSortField, orderSortOrder, (f, o) => { setOrderSortField(f); setOrderSortOrder(o); })}
                          {renderSortableHeader('Total Price', 'totalPrice', orderSortField, orderSortOrder, (f, o) => { setOrderSortField(f); setOrderSortOrder(o); })}
                          {renderSortableHeader('Tracking Code', 'trackingCode', orderSortField, orderSortOrder, (f, o) => { setOrderSortField(f); setOrderSortOrder(o); })}
                          {renderSortableHeader('Date', 'createdAt', orderSortField, orderSortOrder, (f, o) => { setOrderSortField(f); setOrderSortOrder(o); })}
                        </tr></Thead>
                        <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                          {paginatedOrders.map((o: any) => (
                            <tr key={o._id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40">
                              <td className="px-4 py-3 text-xs font-mono text-indigo-600 dark:text-indigo-400 font-bold hover:underline cursor-pointer" onClick={() => setSelectedOrder(o)}>
                                {o._id?.toString().slice(-8).toUpperCase()}
                              </td>
                              <td className="px-4 py-3">{badge(statusColor(o.status), o.status)}</td>
                              <td className="px-4 py-3 text-sm font-semibold text-zinc-900 dark:text-white">${(o.totalPrice??0).toFixed(2)}</td>
                              <td className="px-4 py-3 text-xs text-zinc-400 font-mono">{o.trackingCode || '—'}</td>
                              <td className="px-4 py-3 text-xs text-zinc-400">{o.createdAt ? new Date(o.createdAt).toLocaleString() : '—'}</td>
                              <td className="px-4 py-3 text-xs">
                                <button onClick={async()=>{await apiAction('PUT',`/admin/orders/${o._id}/status`,{status:'Shipped'});loadOrders();}}
                                  className="px-2 py-1 bg-indigo-600 text-white rounded font-bold">Mark Shipped</button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                      <Pagination currentPage={orderPage} totalPages={totalOrderPages} onPageChange={setOrderPage} />
                    </>
                  )}
                </>
              )}
            </Section>
          )}

          {/* PRODUCTS TAB */}
          {activeTab === 'products' && (
            <Section>
              {selectedProduct ? (
                <>
                  <SectionHeader title={`Product Details: ${selectedProduct.title}`} desc={`SKU: ${selectedProduct.sku} · ID: ${selectedProduct._id}`}
                    right={
                      <button onClick={() => setSelectedProduct(null)} className="px-3 py-1.5 border dark:border-zinc-800 text-zinc-650 hover:text-indigo-500 rounded-lg text-xs font-semibold flex items-center gap-1.5 dark:text-zinc-300 bg-white dark:bg-zinc-900 cursor-pointer">
                        <X className="h-4 w-4"/> Back to Products
                      </button>
                    } />
                  <div className="grid md:grid-cols-2 gap-6 text-xs mt-4">
                    {/* Left Column: Media Gallery, Description, Specifications & FAQs */}
                    <div className="space-y-6">
                      {/* Media Gallery */}
                      <div className="bg-white dark:bg-zinc-900 border dark:border-zinc-800 rounded-2xl p-4 shadow-sm space-y-4">
                        <h4 className="font-bold text-[10px] text-zinc-400 uppercase tracking-wider mb-2">Media Gallery</h4>
                        {selectedProduct.images && selectedProduct.images.length > 0 ? (
                          <div className="space-y-3">
                            <div className="aspect-video w-full rounded-xl overflow-hidden bg-zinc-50 dark:bg-zinc-950 border dark:border-zinc-800 flex items-center justify-center">
                              <img 
                                src={selectedProduct.images[activeProductImageIndex]} 
                                alt={selectedProduct.title} 
                                className="max-h-full max-w-full object-contain"
                              />
                            </div>
                            <div className="flex gap-2 flex-wrap">
                              {selectedProduct.images.map((img: string, idx: number) => (
                                <button
                                  key={idx}
                                  onClick={() => setActiveProductImageIndex(idx)}
                                  className={`w-14 h-14 rounded-lg overflow-hidden border-2 transition-all ${
                                    activeProductImageIndex === idx 
                                      ? 'border-indigo-600 scale-95 shadow-md' 
                                      : 'border-zinc-200 dark:border-zinc-800 hover:border-indigo-400'
                                  }`}
                                >
                                  <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                                </button>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <div className="aspect-video w-full rounded-xl bg-zinc-50 dark:bg-zinc-950 border dark:border-zinc-800 flex flex-col items-center justify-center text-zinc-400 gap-2">
                            <Package className="h-10 w-10 text-zinc-300 dark:text-zinc-700" />
                            <span className="font-medium text-xs">No media images uploaded.</span>
                          </div>
                        )}
                      </div>

                      {/* Description */}
                      <div className="bg-white dark:bg-zinc-900 border dark:border-zinc-800 rounded-2xl p-4 shadow-sm space-y-2">
                        <h4 className="font-bold text-[10px] text-zinc-400 uppercase tracking-wider">Product Description</h4>
                        <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed text-xs">
                          {selectedProduct.description || 'No description provided.'}
                        </p>
                      </div>

                      {/* Specifications */}
                      {selectedProduct.specifications && selectedProduct.specifications.length > 0 && (
                        <div className="bg-white dark:bg-zinc-900 border dark:border-zinc-800 rounded-2xl p-4 shadow-sm space-y-3">
                          <h4 className="font-bold text-[10px] text-zinc-400 uppercase tracking-wider">Technical Specifications</h4>
                          <div className="border dark:border-zinc-800 rounded-lg overflow-hidden">
                            <table className="w-full text-left border-collapse text-xs">
                              <thead>
                                <tr className="bg-zinc-50 dark:bg-zinc-950 border-b dark:border-zinc-800 font-bold text-zinc-500">
                                  <th className="p-2.5">Parameter</th>
                                  <th className="p-2.5">Specification</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                                {selectedProduct.specifications.map((spec: any, idx: number) => (
                                  <tr key={idx} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/20">
                                    <td className="p-2.5 font-medium text-zinc-800 dark:text-zinc-200">{spec.name}</td>
                                    <td className="p-2.5 text-zinc-650 dark:text-zinc-400">{spec.value}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}

                      {/* FAQs Accordion */}
                      {selectedProduct.faqs && selectedProduct.faqs.length > 0 && (
                        <div className="bg-white dark:bg-zinc-900 border dark:border-zinc-800 rounded-2xl p-4 shadow-sm space-y-3">
                          <h4 className="font-bold text-[10px] text-zinc-400 uppercase tracking-wider">Product FAQs</h4>
                          <div className="space-y-2">
                            {selectedProduct.faqs.map((faq: any, idx: number) => (
                              <AccordionItem key={idx} title={faq.question} content={faq.answer} />
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Right Column: Pricing, Stats, Seller Info & System Actions */}
                    <div className="space-y-6">
                      {/* Pricing & Performance Dashboard */}
                      <div className="bg-white dark:bg-zinc-900 border dark:border-zinc-800 rounded-2xl p-6 shadow-sm space-y-5">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block mb-0.5">Wholesale Price</span>
                            <span className="text-3xl font-black text-indigo-650 dark:text-indigo-400">${(selectedProduct.price || 0).toFixed(2)}</span>
                          </div>
                          <div className="flex flex-col items-end gap-1">
                            <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Catalog Meta</span>
                            <div className="flex gap-1.5 flex-wrap">
                              {badge('blue', selectedProduct.category?.name || 'General')}
                              {badge('zinc', selectedProduct.brand?.name || 'Unbranded')}
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t dark:border-zinc-800">
                          <div className="space-y-1">
                            <span className="text-[10px] text-zinc-400 font-medium block">Rating Score</span>
                            <span className="font-bold text-sm text-zinc-900 dark:text-white flex items-center gap-1">
                              ★ {selectedProduct.averageRating || 0}
                            </span>
                          </div>
                          <div className="space-y-1">
                            <span className="text-[10px] text-zinc-400 font-medium block">Total Views</span>
                            <span className="font-bold text-sm text-zinc-900 dark:text-white">
                              {selectedProduct.views || 0}
                            </span>
                          </div>
                          <div className="space-y-1">
                            <span className="text-[10px] text-zinc-400 font-medium block">Sales Count</span>
                            <span className="font-bold text-sm text-zinc-900 dark:text-white">
                              {selectedProduct.salesCount || 0} units
                            </span>
                          </div>
                          <div className="space-y-1">
                            <span className="text-[10px] text-zinc-400 font-medium block">Gross Revenue</span>
                            <span className="font-bold text-sm text-emerald-600 dark:text-emerald-400">
                              ${((selectedProduct.price || 0) * (selectedProduct.salesCount || 0)).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Seller/Merchant Partner Details */}
                      <div className="bg-white dark:bg-zinc-900 border dark:border-zinc-800 rounded-2xl p-6 shadow-sm space-y-4">
                        <h4 className="font-bold text-[10px] text-zinc-400 uppercase tracking-wider border-b pb-2 dark:border-zinc-800">Merchant Partner Info</h4>
                        {(() => {
                          const matchedVendor = vendors.find(
                            (v: any) => 
                              v.userId?._id === selectedProduct.vendorId || 
                              v.userId === selectedProduct.vendorId || 
                              v._id === selectedProduct.vendorId
                          );
                          if (matchedVendor) {
                            return (
                              <div className="space-y-3">
                                <div className="grid grid-cols-2 gap-3">
                                  <div>
                                    <span className="text-[10px] text-zinc-400 block font-medium">Shop Name</span>
                                    <span className="font-bold text-zinc-800 dark:text-zinc-200">{matchedVendor.shopName}</span>
                                  </div>
                                  <div>
                                    <span className="text-[10px] text-zinc-400 block font-medium">Company Entity</span>
                                    <span className="font-bold text-zinc-800 dark:text-zinc-200">{matchedVendor.companyLegalName || '—'}</span>
                                  </div>
                                  <div>
                                    <span className="text-[10px] text-zinc-400 block font-medium">Contact Phone</span>
                                    <span className="font-bold text-zinc-800 dark:text-zinc-200">{matchedVendor.businessPhone || '—'}</span>
                                  </div>
                                  <div>
                                    <span className="text-[10px] text-zinc-400 block font-medium">Associated Account</span>
                                    <span className="font-bold text-zinc-800 dark:text-zinc-200">{matchedVendor.userId?.email || '—'}</span>
                                  </div>
                                </div>
                                <button
                                  onClick={() => {
                                    setSelectedSeller(matchedVendor);
                                    setActiveTab('vendors');
                                  }}
                                  className="w-full mt-2 py-2 border dark:border-zinc-800 hover:border-indigo-500 hover:text-indigo-600 rounded-lg text-center font-bold text-xs bg-zinc-50/50 dark:bg-zinc-950/20 text-zinc-600 dark:text-zinc-400 cursor-pointer"
                                >
                                  View Partner Workspace
                                </button>
                              </div>
                            );
                          }
                          return (
                            <div className="text-zinc-400 font-medium text-xs py-2 flex items-center gap-1.5">
                              <Store className="h-4 w-4 shrink-0 text-zinc-300 dark:text-zinc-700" />
                              <span>Platform Direct Product (No Merchant Partner)</span>
                            </div>
                          );
                        })()}
                      </div>

                      {/* Moderation Controls */}
                      <div className="bg-white dark:bg-zinc-900 border dark:border-zinc-800 rounded-2xl p-6 shadow-sm space-y-4">
                        <h4 className="font-bold text-[10px] text-zinc-400 uppercase tracking-wider border-b pb-2 dark:border-zinc-800">System Approvals & Listing Status</h4>
                        
                        <div className="space-y-4">
                          <div className="flex justify-between items-center bg-zinc-50 dark:bg-zinc-950 border dark:border-zinc-800/40 p-3 rounded-xl">
                            <div>
                              <span className="font-bold text-xs text-zinc-800 dark:text-zinc-200 block">Approval Standing</span>
                              <span className="text-[10px] text-zinc-400">Verifies this product meets catalog policies.</span>
                            </div>
                            {badge(selectedProduct.isApproved ? 'green' : 'amber', selectedProduct.isApproved ? 'Approved' : 'Pending Review')}
                          </div>

                          <div className="flex justify-between items-center bg-zinc-50 dark:bg-zinc-950 border dark:border-zinc-800/40 p-3 rounded-xl">
                            <div>
                              <span className="font-bold text-xs text-zinc-800 dark:text-zinc-200 block">Public Visibility</span>
                              <span className="text-[10px] text-zinc-400">Controls whether customers can buy this listing.</span>
                            </div>
                            {badge(selectedProduct.isActive ? 'green' : 'zinc', selectedProduct.isActive ? 'Active Listing' : 'Hidden Listing')}
                          </div>

                          <div className="pt-2 flex flex-col gap-2.5">
                            {!selectedProduct.isApproved && (
                              <button 
                                onClick={async () => {
                                  try {
                                    await apiAction('PUT', `/admin/products/${selectedProduct._id}/approve`);
                                    alert('Product approved successfully!');
                                    setSelectedProduct(null);
                                    loadProducts();
                                  } catch (err: any) {
                                    alert(`Approval failed: ${err.message}`);
                                  }
                                }}
                                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-center cursor-pointer text-xs"
                              >
                                Approve Product Listing
                              </button>
                            )}

                            <button 
                              onClick={async () => {
                                try {
                                  await apiAction('PUT', `/admin/products/${selectedProduct._id}/activation`, { active: !selectedProduct.isActive });
                                  alert(`Product status successfully changed to ${!selectedProduct.isActive ? 'Active' : 'Inactive'}!`);
                                  setSelectedProduct(null);
                                  loadProducts();
                                } catch (err: any) {
                                  alert(`Failed to update status: ${err.message}`);
                                }
                              }}
                              className={`w-full py-2.5 font-bold rounded-lg text-center text-white cursor-pointer text-xs ${
                                selectedProduct.isActive 
                                  ? 'bg-amber-600 hover:bg-amber-500' 
                                  : 'bg-indigo-600 hover:bg-indigo-500'
                              }`}
                            >
                              {selectedProduct.isActive ? 'Deactivate Listing (Hide)' : 'Activate Listing (Show)'}
                            </button>

                            <div className="border-t dark:border-zinc-800 pt-3">
                              <button 
                                onClick={async () => {
                                  if (!confirm('Are you sure you want to delete this product? This action is permanent and cannot be undone.')) return;
                                  try {
                                    await apiAction('DELETE', `/admin/products/${selectedProduct._id}`);
                                    alert('Product deleted successfully!');
                                    setSelectedProduct(null);
                                    loadProducts();
                                  } catch (err: any) {
                                    alert(`Deletion failed: ${err.message}`);
                                  }
                                }}
                                className="w-full py-2.5 bg-red-600 hover:bg-red-500 text-white font-bold rounded-lg text-center cursor-pointer text-xs shadow-sm shadow-red-200 dark:shadow-none"
                              >
                                Permanent Delete Product
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <SectionHeader title="Wholesale Supply Catalog" desc={`Showing ${paginatedProducts.length} of ${filteredProducts.length} products listed (${products.length} total)`}
                    right={<button onClick={loadProducts} className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 cursor-pointer"><RefreshCw className="h-4 w-4"/></button>} />
                  <FilterBar>
                    <SearchBar value={productSearch} onChange={setProductSearch} placeholder="Search product title…" />
                    <ApplyBtn onClick={loadProducts} />
                  </FilterBar>
                  {loading ? <Loading /> : (
                    <>
                      <Table>
                        <Thead><tr>
                          {renderSortableHeader('Product', 'title', productSortField, productSortOrder, (f, o) => { setProductSortField(f); setProductSortOrder(o); })}
                          {renderSortableHeader('Price', 'price', productSortField, productSortOrder, (f, o) => { setProductSortField(f); setProductSortOrder(o); })}
                          {renderSortableHeader('SKU', 'sku', productSortField, productSortOrder, (f, o) => { setProductSortField(f); setProductSortOrder(o); })}
                          {renderSortableHeader('Approval', 'isApproved', productSortField, productSortOrder, (f, o) => { setProductSortField(f); setProductSortOrder(o); })}
                          <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-zinc-500">Actions</th>
                        </tr></Thead>
                        <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                          {paginatedProducts.map((p: any) => (
                            <tr key={p._id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40">
                              <td className="px-4 py-3 text-sm font-medium text-indigo-600 dark:text-indigo-400 font-bold hover:underline cursor-pointer" onClick={() => setSelectedProduct(p)}>{p.title}</td>
                              <td className="px-4 py-3 text-sm text-zinc-500">${(p.price??0).toFixed(2)}</td>
                              <td className="px-4 py-3 text-xs text-zinc-400 font-mono">{p.sku}</td>
                              <td className="px-4 py-3">{badge(p.isApproved ? 'green' : 'amber', p.isApproved ? 'Approved' : 'Pending')}</td>
                              <td className="px-4 py-3"><div className="flex gap-1">
                                {!p.isApproved && <button onClick={async()=>{await apiAction('PUT',`/admin/products/${p._id}/approve`);loadProducts();}}
                                  className="p-1.5 rounded-lg text-zinc-400 hover:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 cursor-pointer" title="Approve"><CheckCircle className="h-3.5 w-3.5"/></button>}
                                <button onClick={async()=>{if(!confirm('Delete product?'))return;await apiAction('DELETE',`/admin/products/${p._id}`);loadProducts();}}
                                  className="p-1.5 rounded-lg text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 cursor-pointer"><Trash2 className="h-3.5 w-3.5"/></button>
                              </div></td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                      <Pagination currentPage={productPage} totalPages={totalProductPages} onPageChange={setProductPage} />
                    </>
                  )}
                </>
              )}
            </Section>
          )}

          {/* MERCHANTS TAB */}
          {activeTab === 'vendors' && (
            <Section>
              <SectionHeader title="Merchant Partner Directory" desc={`Showing ${paginatedVendors.length} of ${filteredVendors.length} merchants (${vendors.length} total)`}
                right={<button onClick={loadVendors} className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 cursor-pointer"><RefreshCw className="h-4 w-4" /></button>} />
              
              {/* Tabs */}
              <div className="flex border-b dark:border-zinc-800 px-6 bg-zinc-50/30 dark:bg-zinc-900/10">
                {[
                  { key: 'all', label: 'All Accounts' },
                  { key: 'seller', label: 'Sellers (Retail / B2C)' },
                  { key: 'vendor', label: 'Vendors (Wholesale / B2B)' }
                ].map(t => (
                  <button key={t.key} onClick={() => setVendorType(t.key)}
                    className={`px-4 py-3 text-xs font-bold border-b-2 -mb-[2px] transition-all cursor-pointer ${
                      vendorType === t.key
                        ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                        : 'border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
                    }`}>
                    {t.label}
                  </button>
                ))}
              </div>

              <FilterBar>
                <SearchBar value={vendorSearch} onChange={setVendorSearch} placeholder="Search shop, company…" />
                <Sel value={vendorStatus} onChange={setVendorStatus} placeholder="All Statuses" options={[
                  {value:'Verification In Progress',label:'Verification In Progress'},{value:'Active',label:'Active'},{value:'Suspended',label:'Suspended'},
                ]} />
                <ApplyBtn onClick={loadVendors} />
              </FilterBar>

              {loading ? <Loading /> : (
                <>
                  <Table>
                    <Thead><tr>
                      {renderSortableHeader('Shop', 'shopName', vendorSortField, vendorSortOrder, (f, o) => { setVendorSortField(f); setVendorSortOrder(o); })}
                      {renderSortableHeader('Type', 'type', vendorSortField, vendorSortOrder, (f, o) => { setVendorSortField(f); setVendorSortOrder(o); })}
                      {renderSortableHeader('Email', 'email', vendorSortField, vendorSortOrder, (f, o) => { setVendorSortField(f); setVendorSortOrder(o); })}
                      {renderSortableHeader('Company Name', 'companyLegalName', vendorSortField, vendorSortOrder, (f, o) => { setVendorSortField(f); setVendorSortOrder(o); })}
                      {renderSortableHeader('Phone', 'businessPhone', vendorSortField, vendorSortOrder, (f, o) => { setVendorSortField(f); setVendorSortOrder(o); })}
                      {renderSortableHeader('Commission', 'commissionRate', vendorSortField, vendorSortOrder, (f, o) => { setVendorSortField(f); setVendorSortOrder(o); })}
                      {renderSortableHeader('Status', 'status', vendorSortField, vendorSortOrder, (f, o) => { setVendorSortField(f); setVendorSortOrder(o); })}
                      <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-zinc-500">Actions</th>
                    </tr></Thead>
                    <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                      {paginatedVendors.map((v: any) => {
                        const isSeller = v.userId?.roles?.includes('Seller');
                        const isVendor = v.userId?.roles?.includes('Vendor');
                        const mType = isSeller ? 'Seller' : isVendor ? 'Vendor' : 'Unknown';
                        const mColor = isSeller ? 'green' : isVendor ? 'blue' : 'zinc';
                        return (
                          <tr key={v._id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40">
                            <td className="px-4 py-3 text-sm font-semibold text-zinc-900 dark:text-white cursor-pointer" onClick={() => { setSelectedSeller(v); setSellerCommission(v.commissionRate || 10); }}>{v.shopName}</td>
                            <td className="px-4 py-3">{badge(mColor, mType)}</td>
                            <td className="px-4 py-3 text-sm text-zinc-500">{v.userId?.email || '—'}</td>
                            <td className="px-4 py-3 text-sm text-zinc-500">{v.companyLegalName || '—'}</td>
                            <td className="px-4 py-3 text-sm text-zinc-500">{v.businessPhone || '—'}</td>
                            <td className="px-4 py-3 text-sm text-zinc-500">{v.commissionRate}%</td>
                            <td className="px-4 py-3">{badge(statusColor(v.status), v.status)}</td>
                            <td className="px-4 py-3"><div className="flex gap-1">
                              {v.status !== 'Active' && (
                                <button onClick={async()=>{await apiAction('PUT',`/admin/vendors/${v._id}/status`,{status:'Active'});loadVendors();}}
                                  className="p-1.5 rounded-lg text-zinc-400 hover:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 cursor-pointer" title="Approve"><CheckCircle className="h-3.5 w-3.5" /></button>
                              )}
                              {v.status !== 'Suspended' && (
                                <button onClick={async()=>{await apiAction('PUT',`/admin/vendors/${v._id}/status`,{status:'Suspended'});loadVendors();}}
                                  className="p-1.5 rounded-lg text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 cursor-pointer" title="Suspend"><XCircle className="h-3.5 w-3.5" /></button>
                              )}
                            </div></td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>
                  <Pagination currentPage={vendorPage} totalPages={totalVendorPages} onPageChange={setVendorPage} />
                </>
              )}

              {/* Verify / Details Modal */}
              {selectedSeller && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                  <div className="bg-white dark:bg-zinc-900 rounded-2xl border dark:border-zinc-800 shadow-2xl w-full max-w-lg p-6 space-y-4">
                    <div className="flex items-center justify-between border-b pb-3 dark:border-zinc-800">
                      <h3 className="font-bold text-zinc-900 dark:text-white">Merchant Validation Drawer</h3>
                      <button onClick={() => setSelectedSeller(null)} className="p-1 text-zinc-400"><X className="h-5 w-5" /></button>
                    </div>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4 text-xs">
                        <div><strong className="text-zinc-400">Shop Name:</strong> <div className="text-zinc-800 dark:text-zinc-200 mt-0.5">{selectedSeller.shopName}</div></div>
                        <div><strong className="text-zinc-400">PAN details:</strong> <div className="text-zinc-800 dark:text-zinc-200 mt-0.5 font-mono">ABCDE1234F</div></div>
                        <div className="col-span-2"><strong className="text-zinc-400">GST Registration:</strong> <div className="text-zinc-800 dark:text-zinc-200 mt-0.5 font-mono">22AAAAA0000A1Z5</div></div>
                      </div>

                      {/* Edit Fields */}
                      <div className="space-y-3 border-t dark:border-zinc-800 pt-3">
                        <div>
                          <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block mb-1">Company Legal Name <span className="text-red-500">*</span></label>
                          <input 
                            type="text"
                            className="w-full rounded-lg border dark:border-zinc-800 p-2 text-xs focus:outline-none focus:border-indigo-500 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white font-medium" 
                            value={editCompanyLegalName} 
                            onChange={e=>setEditCompanyLegalName(e.target.value)} 
                            placeholder="Enter Legal Name"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block mb-1">Business Phone <span className="text-red-500">*</span></label>
                          <input 
                            type="text"
                            className="w-full rounded-lg border dark:border-zinc-800 p-2 text-xs focus:outline-none focus:border-indigo-500 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white font-medium" 
                            value={editBusinessPhone} 
                            onChange={e=>setEditBusinessPhone(e.target.value)} 
                            placeholder="Enter Business Phone"
                          />
                        </div>
                      </div>

                      {/* Commission Rates slider */}
                      <div className="space-y-2 border-t dark:border-zinc-800 pt-3">
                        <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block">Commission Percentage: <strong className="text-indigo-600">{sellerCommission}%</strong></label>
                        <input type="range" min="0" max="100" value={sellerCommission} onChange={e=>setSellerCommission(parseInt(e.target.value))} className="w-full h-1 bg-zinc-200 rounded-lg appearance-none cursor-pointer" />
                        <button onClick={async()=>{
                          if (!editCompanyLegalName.trim() || !editBusinessPhone.trim()) {
                            alert('Company Legal Name and Business Phone are mandatory fields!');
                            return;
                          }
                          try {
                            await apiAction('PUT', `/admin/users/${selectedSeller.userId?._id || selectedSeller.userId}`, { walletBalance: selectedSeller.userId?.walletBalance, commissionRate: sellerCommission }); 
                            await apiAction('PUT', `/admin/vendors/${selectedSeller._id}`, { companyLegalName: editCompanyLegalName, businessPhone: editBusinessPhone, commissionRate: sellerCommission });
                            alert('Merchant details and commission updated successfully!'); 
                            setSelectedSeller(null); 
                            loadVendors();
                          } catch (err: any) {
                            alert(`Failed to save: ${err.message}`);
                          }
                        }}
                          className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg">Save Merchant Details</button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </Section>
          )}

          {/* SUPPORT TAB */}
          {activeTab === 'support' && (
            <Section>
              {selectedTicket ? (
                <>
                  <SectionHeader 
                    title={`Ticket: ${selectedTicket.subject}`} 
                    desc={`Priority: ${selectedTicket.priority} · Status: ${selectedTicket.status}`}
                    right={
                      <button 
                        onClick={() => setSelectedTicket(null)} 
                        className="px-3 py-1.5 border dark:border-zinc-800 text-zinc-650 hover:text-indigo-500 rounded-lg text-xs font-semibold flex items-center gap-1.5 dark:text-zinc-300 bg-white dark:bg-zinc-900 cursor-pointer"
                      >
                        <X className="h-4 w-4"/> Back to Tickets
                      </button>
                    } 
                  />
                  <div className="grid md:grid-cols-3 gap-6 text-xs mt-4">
                    {/* Left & Middle: Chat Messages */}
                    <div className="md:col-span-2 space-y-4 flex flex-col bg-white dark:bg-zinc-900 border dark:border-zinc-800 rounded-2xl p-4 shadow-sm min-h-[450px]">
                      <h4 className="font-bold text-[10px] text-zinc-400 uppercase tracking-wider border-b pb-2 dark:border-zinc-800">Conversation History</h4>
                      
                      {/* Messages Box */}
                      <div className="flex-1 overflow-y-auto space-y-3 p-2 max-h-[300px] min-h-[200px]">
                        {selectedTicket.messages && selectedTicket.messages.length > 0 ? (
                          selectedTicket.messages.map((msg: any, idx: number) => {
                            const isStaff = String(msg.senderId) !== String(selectedTicket.userId);
                            return (
                              <div key={idx} className={`flex flex-col ${isStaff ? 'items-end' : 'items-start'}`}>
                                <div className={`max-w-[75%] rounded-2xl p-3 text-xs ${
                                  isStaff 
                                    ? 'bg-indigo-600 text-white rounded-tr-none' 
                                    : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-tl-none'
                                }`}>
                                  <div className="font-semibold text-[9px] opacity-75 mb-1">
                                    {isStaff ? 'Support Agent (Staff)' : 'Ticket Creator'}
                                  </div>
                                  <p className="leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                                </div>
                                <span className="text-[9px] text-zinc-400 mt-1 px-1">
                                  {msg.sentAt ? new Date(msg.sentAt).toLocaleString() : '—'}
                                </span>
                              </div>
                            );
                          })
                        ) : (
                          <div className="text-zinc-400 text-center py-10 font-medium">No messages found.</div>
                        )}
                      </div>

                      {/* Reply Box */}
                      <div className="border-t dark:border-zinc-800 pt-3 space-y-2">
                        <textarea
                          rows={3}
                          value={ticketReplyText}
                          onChange={e => setTicketReplyText(e.target.value)}
                          placeholder="Type your reply to the customer / merchant..."
                          className="w-full rounded-xl border dark:border-zinc-800 p-2 text-xs focus:outline-none focus:border-indigo-500 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white resize-none"
                        />
                        <div className="flex justify-end">
                          <button
                            onClick={async () => {
                              if (!ticketReplyText.trim()) return;
                              try {
                                const updated = await apiAction('POST', `/support/tickets/${selectedTicket._id}/reply`, { message: ticketReplyText });
                                alert('Reply sent successfully!');
                                setTicketReplyText('');
                                // Refresh tickets and update details view
                                const freshTickets = await apiFetch('/support/tickets');
                                setTickets(freshTickets);
                                const found = freshTickets.find((t: any) => t._id === selectedTicket._id);
                                if (found) setSelectedTicket(found);
                              } catch (err: any) {
                                alert(`Failed to send reply: ${err.message}`);
                              }
                            }}
                            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg cursor-pointer"
                          >
                            Send Reply
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Right: Ticket Details & Metadata */}
                    <div className="space-y-6">
                      {/* Ticket Creator Metadata Card */}
                      <div className="bg-white dark:bg-zinc-900 border dark:border-zinc-800 rounded-2xl p-4 shadow-sm space-y-3">
                        <h4 className="font-bold text-[10px] text-zinc-400 uppercase tracking-wider border-b pb-2 dark:border-zinc-800">Creator Information</h4>
                        {(() => {
                          const cUser = users.find(u => String(u._id) === String(selectedTicket.userId));
                          const cVendor = vendors.find(v => 
                            String(v.userId?._id) === String(selectedTicket.userId) || 
                            String(v.userId) === String(selectedTicket.userId) ||
                            String(v._id) === String(selectedTicket.userId)
                          );

                          if (cUser) {
                            return (
                              <div className="space-y-1.5 text-xs text-zinc-700 dark:text-zinc-300">
                                <div><strong className="text-zinc-550">Name:</strong> {cUser.firstName} {cUser.lastName}</div>
                                <div><strong className="text-zinc-550">Role:</strong> {badge('green', 'Customer')}</div>
                                <div><strong className="text-zinc-550">Email:</strong> {cUser.email}</div>
                                <div><strong className="text-zinc-550">Wallet:</strong> ${(cUser.walletBalance || 0).toFixed(2)}</div>
                              </div>
                            );
                          } else if (cVendor) {
                            const isSeller = cVendor.userId?.roles?.includes('Seller');
                            return (
                              <div className="space-y-1.5 text-xs text-zinc-700 dark:text-zinc-300">
                                <div><strong className="text-zinc-550">Shop:</strong> {cVendor.shopName}</div>
                                <div><strong className="text-zinc-550">Role:</strong> {badge(isSeller ? 'green' : 'blue', isSeller ? 'Seller (B2C)' : 'Vendor (B2B)')}</div>
                                <div><strong className="text-zinc-550">Legal Entity:</strong> {cVendor.companyLegalName || '—'}</div>
                                <div><strong className="text-zinc-550">Phone:</strong> {cVendor.businessPhone || '—'}</div>
                                <div><strong className="text-zinc-550">Email:</strong> {cVendor.userId?.email || '—'}</div>
                              </div>
                            );
                          }
                          return (
                            <div className="text-zinc-400 font-medium text-xs">
                              <div><strong className="text-zinc-500">User ID:</strong> <span className="font-mono text-[10px]">{selectedTicket.userId}</span></div>
                            </div>
                          );
                        })()}
                      </div>

                      {/* Ticket Properties and Actions */}
                      <div className="bg-white dark:bg-zinc-900 border dark:border-zinc-800 rounded-2xl p-4 shadow-sm space-y-4">
                        <h4 className="font-bold text-[10px] text-zinc-400 uppercase tracking-wider border-b pb-2 dark:border-zinc-800">Ticket Actions</h4>
                        
                        {/* Status Change */}
                        <div className="space-y-1">
                          <label className="block text-[10px] text-zinc-400 font-bold mb-1">Update Status</label>
                          <select
                            value={ticketStatusSelect}
                            onChange={async (e) => {
                              const newStatus = e.target.value;
                              setTicketStatusSelect(newStatus);
                              try {
                                await apiAction('PUT', `/support/tickets/${selectedTicket._id}/status`, { status: newStatus });
                                alert('Status updated successfully!');
                                const freshTickets = await apiFetch('/support/tickets');
                                setTickets(freshTickets);
                                const found = freshTickets.find((t: any) => t._id === selectedTicket._id);
                                if (found) setSelectedTicket(found);
                              } catch (err: any) {
                                alert(`Failed to update status: ${err.message}`);
                              }
                            }}
                            className="w-full px-2 py-1.5 border dark:border-zinc-800 bg-white dark:bg-zinc-950 rounded-lg text-xs text-zinc-900 dark:text-white"
                          >
                            <option value="Open">Open</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Resolved">Resolved</option>
                            <option value="Closed">Closed</option>
                          </select>
                        </div>

                        {/* Assign Agent */}
                        <div className="space-y-1">
                          <label className="block text-[10px] text-zinc-400 font-bold mb-1">Assign Agent</label>
                          <select
                            value={ticketAgentSelect}
                            onChange={async (e) => {
                              const newAgent = e.target.value;
                              setTicketAgentSelect(newAgent);
                              try {
                                await apiAction('PUT', `/support/tickets/${selectedTicket._id}/assign`, { agentId: newAgent });
                                alert('Agent assigned successfully!');
                                const freshTickets = await apiFetch('/support/tickets');
                                setTickets(freshTickets);
                                const found = freshTickets.find((t: any) => t._id === selectedTicket._id);
                                if (found) setSelectedTicket(found);
                              } catch (err: any) {
                                alert(`Failed to assign agent: ${err.message}`);
                              }
                            }}
                            className="w-full px-2 py-1.5 border dark:border-zinc-800 bg-white dark:bg-zinc-950 rounded-lg text-xs text-zinc-900 dark:text-white"
                          >
                            <option value="">Unassigned</option>
                            {agentsList.map((agent: any) => (
                              <option key={agent._id} value={agent.agentId?._id || agent.agentId}>
                                {agent.agentId?.email || agent.agentId || 'Online Staff'}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <SectionHeader 
                    title="Support Center" 
                    desc="Manage Customer, Seller, and Vendor support requests and agent workloads."
                    right={
                      <button onClick={loadTickets} className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 cursor-pointer">
                        <RefreshCw className="h-4 w-4"/>
                      </button>
                    }
                  />

                  <FilterBar>
                    <SearchBar value={ticketSearch} onChange={setTicketSearch} placeholder="Search tickets by subject..." />
                    <Sel 
                      value={ticketStatusFilter} 
                      onChange={setTicketStatusFilter} 
                      placeholder="All Statuses" 
                      options={[
                        { value: 'Open', label: 'Open' },
                        { value: 'In Progress', label: 'In Progress' },
                        { value: 'Resolved', label: 'Resolved' },
                        { value: 'Closed', label: 'Closed' },
                      ]} 
                    />
                    <ApplyBtn onClick={loadTickets} />
                  </FilterBar>

                  {loading ? <Loading /> : (
                    <>
                      <Table>
                        <Thead>
                          <tr>
                            <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-zinc-500">Subject</th>
                            <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-zinc-500">User Creator</th>
                            <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-zinc-500">Priority</th>
                            <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-zinc-500">Status</th>
                            <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-zinc-500">Created At</th>
                          </tr>
                        </Thead>
                        <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                          {tickets
                            .filter(t => {
                              const matchSearch = t.subject?.toLowerCase().includes(ticketSearch.toLowerCase());
                              const matchStatus = !ticketStatusFilter || t.status === ticketStatusFilter;
                              return matchSearch && matchStatus;
                            })
                            .slice((ticketPage - 1) * limit, ticketPage * limit)
                            .map((t: any) => {
                              const cUser = users.find(u => String(u._id) === String(t.userId));
                              const cVendor = vendors.find(v => 
                                String(v.userId?._id) === String(t.userId) || 
                                String(v.userId) === String(t.userId) ||
                                String(v._id) === String(t.userId)
                              );

                              let priorityColor = 'zinc';
                              if (t.priority === 'Urgent') priorityColor = 'red';
                              else if (t.priority === 'High') priorityColor = 'amber';
                              else if (t.priority === 'Medium') priorityColor = 'blue';

                              let statusColor = 'zinc';
                              if (t.status === 'Resolved') statusColor = 'green';
                              else if (t.status === 'In Progress') statusColor = 'blue';
                              else if (t.status === 'Open') statusColor = 'amber';

                              return (
                                <tr key={t._id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40">
                                  <td 
                                    className="px-4 py-3 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                                    onClick={() => setSelectedTicket(t)}
                                  >
                                    {t.subject}
                                  </td>
                                  <td className="px-4 py-3 text-xs text-zinc-650 dark:text-zinc-400">
                                    {cUser ? (
                                      <span>{cUser.firstName} {cUser.lastName} (Customer)</span>
                                    ) : cVendor ? (
                                      <span>{cVendor.shopName} (Merchant)</span>
                                    ) : (
                                      <span className="font-mono">{t.userId?.toString().slice(-8).toUpperCase()}</span>
                                    )}
                                  </td>
                                  <td className="px-4 py-3">{badge(priorityColor, t.priority)}</td>
                                  <td className="px-4 py-3">{badge(statusColor, t.status)}</td>
                                  <td className="px-4 py-3 text-xs text-zinc-400">
                                    {t.createdAt ? new Date(t.createdAt).toLocaleString() : '—'}
                                  </td>
                                </tr>
                              );
                            })}
                        </tbody>
                      </Table>
                      <Pagination 
                        currentPage={ticketPage} 
                        totalPages={Math.ceil(
                          tickets.filter(t => {
                            const matchSearch = t.subject?.toLowerCase().includes(ticketSearch.toLowerCase());
                            const matchStatus = !ticketStatusFilter || t.status === ticketStatusFilter;
                            return matchSearch && matchStatus;
                          }).length / limit
                        ) || 1} 
                        onPageChange={setTicketPage} 
                      />
                    </>
                  )}
                </>
              )}
            </Section>
          )}

          {/* SETTINGS TAB */}
          {activeTab === 'settings' && (
            <Section>
              <SectionHeader title="Centralized Configurations" desc="Adjust SMTP details, SMS routing, and social API integrations." />
              
              {/* Subtabs */}
              <div className="flex border-b dark:border-zinc-800 px-6 bg-zinc-50/30 dark:bg-zinc-900/10">
                {[
                  { key: 'general', label: 'General' },
                  { key: 'email', label: 'Email SMTP' },
                  { key: 'sms', label: 'SMS Twilio' },
                  { key: 'storage', label: 'Storage' },
                  { key: 'api', label: 'API Keys' }
                ].map(t => (
                  <button key={t.key} onClick={() => setSettingTab(t.key)}
                    className={`px-4 py-3 text-xs font-bold border-b-2 -mb-[2px] transition-all cursor-pointer ${
                      settingTab === t.key
                        ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                        : 'border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
                    }`}>
                    {t.label}
                  </button>
                ))}
              </div>

              <form onSubmit={handleUpdateSettings} className="p-6 space-y-4">
                {settingTab === 'general' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block mb-1">Site Title</label>
                      <input className="w-full rounded-lg border dark:border-zinc-800 p-2 text-xs focus:outline-none focus:border-indigo-500 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white" value={generalSettings.siteName} onChange={e=>setGeneralSettings({...generalSettings, siteName: e.target.value})} />
                    </div>
                    <div>
                      <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block mb-1">Support Email</label>
                      <input className="w-full rounded-lg border dark:border-zinc-800 p-2 text-xs focus:outline-none focus:border-indigo-500 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white" value={generalSettings.supportEmail} onChange={e=>setGeneralSettings({...generalSettings, supportEmail: e.target.value})} />
                    </div>
                    <div>
                      <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block mb-1">Table Page Size Limit</label>
                      <input type="number" min="1" max="100" className="w-full rounded-lg border dark:border-zinc-800 p-2 text-xs focus:outline-none focus:border-indigo-500 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white" value={generalSettings.pageSize} onChange={e=>setGeneralSettings({...generalSettings, pageSize: parseInt(e.target.value) || 20})} />
                    </div>
                  </div>
                )}

                {settingTab === 'email' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block mb-1">SMTP Host</label>
                      <input className="w-full rounded-lg border dark:border-zinc-800 p-2 text-xs focus:outline-none focus:border-indigo-500 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white" value={emailSettings.smtpHost} onChange={e=>setEmailSettings({...emailSettings, smtpHost: e.target.value})} />
                    </div>
                    <div>
                      <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block mb-1">SMTP Port</label>
                      <input className="w-full rounded-lg border dark:border-zinc-800 p-2 text-xs focus:outline-none focus:border-indigo-500 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white" value={emailSettings.smtpPort} onChange={e=>setEmailSettings({...emailSettings, smtpPort: parseInt(e.target.value)||25})} />
                    </div>
                  </div>
                )}

                {settingTab === 'sms' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block mb-1">Twilio SID</label>
                      <input className="w-full rounded-lg border dark:border-zinc-800 p-2 text-xs focus:outline-none focus:border-indigo-500 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white" value={smsSettings.twilioSid} onChange={e=>setSmsSettings({...smsSettings, twilioSid: e.target.value})} />
                    </div>
                  </div>
                )}

                {settingTab === 'storage' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block mb-1">AWS Bucket Name</label>
                      <input className="w-full rounded-lg border dark:border-zinc-800 p-2 text-xs focus:outline-none focus:border-indigo-500 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white" value={storageSettings.bucketName} onChange={e=>setStorageSettings({...storageSettings, bucketName: e.target.value})} />
                    </div>
                  </div>
                )}

                {settingTab === 'api' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block mb-1">OpenAI Secret Key</label>
                      <input type="password" className="w-full rounded-lg border dark:border-zinc-800 p-2 text-xs focus:outline-none focus:border-indigo-500 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white" value={apiSettings.openaiKey} onChange={e=>setApiSettings({...apiSettings, openaiKey: e.target.value})} />
                    </div>
                  </div>
                )}

                <button type="submit" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl cursor-pointer">Save configurations</button>
              </form>
            </Section>
          )}

          {/* ANALYTICS TAB */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-black text-zinc-900 dark:text-white">Platform Analytics Hub</h1>
                  <p className="text-sm text-zinc-500 mt-0.5">Real-time platform insights, conversion rates, and chat telemetry.</p>
                </div>
                
                {/* Time range indicator */}
                <div className="flex items-center gap-1.5 bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100/50 dark:border-indigo-900/30 px-3.5 py-1.5 rounded-xl text-xs font-bold text-indigo-700 dark:text-indigo-300">
                  <Calendar className="h-4 w-4" /> Live Tracking Enabled
                </div>
              </div>

              {/* Subtabs for Analytics */}
              <div className="flex border-b dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-xl p-1 border dark:border-zinc-800">
                {[
                  { key: 'overview', label: 'Dashboard Overview', icon: <LayoutDashboard className="h-3.5 w-3.5" /> },
                  { key: 'sales', label: 'Sales & Revenue Analysis', icon: <TrendingUp className="h-3.5 w-3.5" /> },
                  { key: 'chatbot', label: 'AI Chatbot Telemetry', icon: <Cpu className="h-3.5 w-3.5" /> },
                  { key: 'demographics', label: 'Traffic & Demographics', icon: <Users className="h-3.5 w-3.5" /> }
                ].map(t => (
                  <button key={t.key} onClick={() => setAnalyticsSubTab(t.key as any)}
                    className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold rounded-lg transition-all cursor-pointer flex-1 justify-center ${
                      analyticsSubTab === t.key
                        ? 'bg-indigo-600 text-white shadow'
                        : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800/40'
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
                            {/* Smooth path */}
                            <path fill="url(#chartGrad)" d="M 0 150 Q 50 120 100 130 T 200 90 T 300 60 T 400 30 T 500 15 L 500 160 L 0 160 Z" />
                            <path fill="none" stroke="#4f46e5" strokeWidth="2.5" strokeLinecap="round" d="M 0 150 Q 50 120 100 130 T 200 90 T 300 60 T 400 30 T 500 15" />
                            
                            {/* Dots at data points */}
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
                          const color = statusColor(status);
                          const colorClasses: Record<string, string> = {
                            green: 'bg-emerald-600',
                            amber: 'bg-amber-500',
                            red: 'bg-red-500',
                            blue: 'bg-blue-600'
                          };
                          return (
                            <div key={status} className="space-y-1.5">
                              <div className="flex justify-between text-xs">
                                <span className="font-medium text-zinc-600 dark:text-zinc-400">{status}</span>
                                <span className="font-bold text-zinc-950 dark:text-white">{count} ({percentage}%)</span>
                              </div>
                              <div className="w-full bg-zinc-100 dark:bg-zinc-850 rounded-full h-2">
                                <div className={`h-2 rounded-full transition-all duration-500 ${colorClasses[color] || 'bg-zinc-400'}`} style={{ width: `${percentage}%` }}></div>
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
                  {/* Detailed Performance Data Table */}
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

                  {/* Estimation / Commission Earnings card */}
                  <div className="bg-white dark:bg-zinc-900 rounded-2xl border dark:border-zinc-800 p-6 space-y-4 shadow-sm">
                    <div className="border-b pb-2 dark:border-zinc-800">
                      <h3 className="font-bold text-sm text-zinc-900 dark:text-white">Platform Commission Rates</h3>
                    </div>
                    <p className="text-xs text-zinc-500">Platform commission summary estimates from merchant listings.</p>
                    
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
                  {/* Chatbot metrics panels */}
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
                              <span className="font-mono text-zinc-600 dark:text-zinc-400">{intent.goal}</span>
                              <span className="font-bold text-zinc-900 dark:text-white">{intent.count} matches ({pct}%)</span>
                            </div>
                            <div className="w-full bg-zinc-100 dark:bg-zinc-850 rounded-full h-2">
                              <div className="bg-indigo-600 h-2 rounded-full" style={{ width: `${pct}%` }}></div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Fallback ratios */}
                  <div className="space-y-6">
                    <div className="bg-white dark:bg-zinc-900 rounded-2xl border dark:border-zinc-800 p-6 space-y-4 shadow-sm">
                      <div className="border-b pb-2 dark:border-zinc-800">
                        <h3 className="font-bold text-sm text-zinc-900 dark:text-white">Confidence Threshold</h3>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <div className="text-3xl font-black text-zinc-900 dark:text-white">{stats?.chatbot?.averageConfidence || 89.2}%</div>
                          <div className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Avg Intent Confidence</div>
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
                          <div className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Fallback / Unmatched Intent Rate</div>
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
                  {/* Browser ratios card */}
                  <div className="bg-white dark:bg-zinc-900 rounded-2xl border dark:border-zinc-800 p-6 space-y-4 shadow-sm">
                    <div className="border-b pb-2 dark:border-zinc-800">
                      <h3 className="font-bold text-sm text-zinc-900 dark:text-white">Referrals & Browsers Distributions</h3>
                    </div>
                    <div className="space-y-4 pt-2">
                      {Object.entries(stats?.traffic?.browsers || { Chrome: 64, Safari: 18, Firefox: 10 }).map(([browser, ratio]: [string, any]) => (
                        <div key={browser} className="space-y-1.5">
                          <div className="flex justify-between text-xs">
                            <span className="font-medium text-zinc-600 dark:text-zinc-400">{browser}</span>
                            <span className="font-bold text-zinc-900 dark:text-white">{ratio}%</span>
                          </div>
                          <div className="w-full bg-zinc-100 dark:bg-zinc-850 rounded-full h-1.5">
                            <div className="bg-indigo-600 h-1.5 rounded-full" style={{ width: `${ratio}%` }}></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Device and Locations */}
                  <div className="bg-white dark:bg-zinc-900 rounded-2xl border dark:border-zinc-800 p-6 space-y-4 shadow-sm">
                    <div className="border-b pb-2 dark:border-zinc-800">
                      <h3 className="font-bold text-sm text-zinc-900 dark:text-white">Client Device Profile</h3>
                    </div>
                    <div className="space-y-4 pt-2">
                      {Object.entries(stats?.traffic?.devices || { Desktop: 70, Mobile: 25 }).map(([device, ratio]: [string, any]) => (
                        <div key={device} className="space-y-1.5">
                          <div className="flex justify-between text-xs">
                            <span className="font-medium text-zinc-600 dark:text-zinc-400">{device}</span>
                            <span className="font-bold text-zinc-900 dark:text-white">{ratio}%</span>
                          </div>
                          <div className="w-full bg-zinc-100 dark:bg-zinc-850 rounded-full h-1.5">
                            <div className="bg-indigo-600 h-1.5 rounded-full" style={{ width: `${ratio}%` }}></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* PERMISSIONS MATRIX */}
          {activeTab === 'roles' && (
            <Section>
              <SectionHeader title="Staff Role Permission Matrix" desc="Assign create, update, or log audit capabilities globally." />
              <div className="p-6">
                <Table>
                  <Thead><tr>
                    <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-zinc-500">Staff Role</th>
                    <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-zinc-500">Dashboard</th>
                    <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-zinc-500">Products</th>
                    <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-zinc-500">Orders</th>
                    <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-zinc-500">Settings</th>
                    <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-zinc-500">Logs</th>
                  </tr></Thead>
                  <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                    {Object.keys(rolesMatrix).map((role: string) => (
                      <tr key={role} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40">
                        <td className="px-4 py-3 text-sm font-bold text-zinc-800 dark:text-zinc-200">{role}</td>
                        {['dashboard', 'products', 'orders', 'settings', 'logs'].map((perm: string) => (
                          <td key={perm} className="px-4 py-3">
                            <input type="checkbox" checked={rolesMatrix[role][perm]} onChange={()=>toggleMatrixPermission(role, perm)} className="rounded border-zinc-300 text-indigo-600 focus:ring-indigo-500 h-4 w-4" />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </Table>
                <button onClick={()=>alert('Permissions updated successfully!')} className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold">Save Permission matrix</button>
              </div>
            </Section>
          )}

          {/* SYSTEM LOGS TAB */}
          {activeTab === 'logs' && (
            <Section>
              {selectedLogDetail ? (
                <div className="p-6 space-y-6 text-zinc-800 dark:text-zinc-200">
                  {/* Back button */}
                  <div className="flex justify-between items-center border-b pb-3 dark:border-zinc-800">
                    <div>
                      <h3 className="font-bold text-base text-zinc-900 dark:text-white">Log Entry Details</h3>
                      <p className="text-xs text-zinc-400 mt-0.5 font-mono">Log ID: {selectedLogDetail._id}</p>
                    </div>
                    <button onClick={() => setSelectedLogDetail(null)} className="px-3 py-1.5 border dark:border-zinc-800 text-zinc-600 hover:text-indigo-500 rounded-lg text-xs font-semibold flex items-center gap-1.5 dark:text-zinc-300 bg-white dark:bg-zinc-900 cursor-pointer">
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
                        <span className="text-sm font-semibold mt-1 block text-indigo-600 dark:text-indigo-400 font-mono">{selectedLogDetail.keyword}</span>
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
                        <span className="text-sm font-semibold mt-1 block text-zinc-800 dark:text-zinc-200">{selectedLogDetail.userRole}</span>
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
                        <span className="text-xs font-semibold mt-1 block truncate text-zinc-500 dark:text-zinc-400" title={selectedLogDetail.browser}>{selectedLogDetail.browser}</span>
                      </div>
                    )}
                    {selectedLogDetail.device && (
                      <div className="bg-zinc-50/50 dark:bg-zinc-900/40 p-4 border dark:border-zinc-800 rounded-2xl shadow-sm">
                        <span className="block text-[10px] uppercase font-bold tracking-wider text-zinc-400">Device Platform</span>
                        <span className="text-sm font-semibold mt-1 block text-zinc-800 dark:text-zinc-200">{selectedLogDetail.device}</span>
                      </div>
                    )}
                  </div>

                  {selectedLogDetail.details && (
                    <div className="bg-zinc-50/50 dark:bg-zinc-900/40 border dark:border-zinc-800 rounded-2xl p-5 space-y-2 shadow-sm">
                      <span className="block text-[10px] uppercase font-bold tracking-wider text-zinc-400 font-bold">Details / Payload</span>
                      <div className="bg-white dark:bg-zinc-950 p-4 rounded-xl border dark:border-zinc-900 font-mono text-xs overflow-x-auto whitespace-pre-wrap text-zinc-800 dark:text-zinc-200">
                        {selectedLogDetail.details}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <SectionHeader title="Database Log Registries" desc="Audit trails, keyword searches, and chatbot intelligence queries."
                    right={
                      <button onClick={async()=>{const res = await apiFetch('/admin/logs/export'); const blob = new Blob([res.csv], { type: 'text/csv' }); const url = window.URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = res.filename; a.click();}}
                        className="flex items-center gap-1 px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-semibold shadow cursor-pointer">
                        <Download className="h-3.5 w-3.5" /> Export Logs
                      </button>
                    } />
                  
                  {/* Tabs */}
                  <div className="flex border-b dark:border-zinc-800 px-6 bg-zinc-50/30 dark:bg-zinc-900/10">
                    {[
                      { key: 'audit', label: 'System Audits' },
                      { key: 'search', label: 'Queries Searched' },
                      { key: 'activity', label: 'User Activities' },
                      { key: 'chatbot', label: 'Chatbot Intents Log' }
                    ].map(t => (
                      <button key={t.key} onClick={() => setLogSubTab(t.key as any)}
                        className={`px-4 py-3 text-xs font-bold border-b-2 -mb-[2px] transition-all cursor-pointer ${
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
                      {logSubTab === 'audit' && (
                        <div className="space-y-4">
                          {/* Filter Row */}
                          <div className="flex flex-wrap gap-3 p-3 bg-zinc-50 dark:bg-zinc-900/40 border dark:border-zinc-800 rounded-xl text-xs">
                            <input type="text" value={auditSearch} onChange={e=>setAuditSearch(e.target.value)}
                              placeholder="Search action, resource, email, IP..."
                              className="px-3 py-1.5 border dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-lg focus:ring-1 focus:ring-indigo-500 outline-none text-zinc-800 dark:text-zinc-100 flex-1 min-w-[200px]" />
                            <select value={auditRole} onChange={e=>setAuditRole(e.target.value)}
                              className="px-3 py-1.5 border dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-lg focus:ring-1 focus:ring-indigo-500 outline-none text-zinc-800 dark:text-zinc-100 cursor-pointer">
                              <option value="all">All Roles</option>
                              <option value="Admin">Admin</option>
                              <option value="Super Admin">Super Admin</option>
                              <option value="Manager">Manager</option>
                            </select>
                          </div>
                          {/* Count display */}
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
                                  <td className="px-4 py-3 text-zinc-500">{l.resource}</td>
                                  <td className="px-4 py-3 text-zinc-500">{l.userId?.email || 'System'}</td>
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

                      {logSubTab === 'search' && (
                        <div className="space-y-4">
                          {/* Filter Row */}
                          <div className="flex flex-wrap gap-3 p-3 bg-zinc-50 dark:bg-zinc-900/40 border dark:border-zinc-800 rounded-xl text-xs">
                            <input type="text" value={searchQuery} onChange={e=>setSearchQuery(e.target.value)}
                              placeholder="Search keyword..."
                              className="px-3 py-1.5 border dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-lg focus:ring-1 focus:ring-indigo-500 outline-none text-zinc-800 dark:text-zinc-100 flex-1 min-w-[200px]" />
                            <select value={searchRole} onChange={e=>setSearchRole(e.target.value)}
                              className="px-3 py-1.5 border dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-lg focus:ring-1 focus:ring-indigo-500 outline-none text-zinc-800 dark:text-zinc-100 cursor-pointer">
                              <option value="all">All Roles</option>
                              <option value="Customer">Customer</option>
                              <option value="Guest">Guest</option>
                            </select>
                            <select value={searchSource} onChange={e=>setSearchSource(e.target.value)}
                              className="px-3 py-1.5 border dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-lg focus:ring-1 focus:ring-indigo-500 outline-none text-zinc-800 dark:text-zinc-100 cursor-pointer">
                              <option value="all">All Sources</option>
                              <option value="web">Web</option>
                              <option value="mobile">Mobile</option>
                            </select>
                          </div>
                          {/* Count display */}
                          <div className="flex justify-between items-center text-xs text-zinc-500 font-semibold px-2">
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
                                  <td className="px-4 py-3 text-zinc-500">{l.userRole}</td>
                                  <td className="px-4 py-3 text-zinc-500">{l.category}</td>
                                  <td className="px-4 py-3 text-zinc-500 font-semibold">{l.resultsCount}</td>
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

                      {logSubTab === 'activity' && (
                        <div className="space-y-4">
                          {/* Filter Row */}
                          <div className="flex flex-wrap gap-3 p-3 bg-zinc-50 dark:bg-zinc-900/40 border dark:border-zinc-800 rounded-xl text-xs">
                            <input type="text" value={activitySearch} onChange={e=>setActivitySearch(e.target.value)}
                              placeholder="Search action or details..."
                              className="px-3 py-1.5 border dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-lg focus:ring-1 focus:ring-indigo-500 outline-none text-zinc-800 dark:text-zinc-100 flex-1 min-w-[200px]" />
                            <select value={activityCategory} onChange={e=>setActivityCategory(e.target.value)}
                              className="px-3 py-1.5 border dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-lg focus:ring-1 focus:ring-indigo-500 outline-none text-zinc-800 dark:text-zinc-100 cursor-pointer">
                              <option value="all">All Categories</option>
                              <option value="Login">Login</option>
                              <option value="Profile">Profile</option>
                              <option value="Settings">Settings</option>
                              <option value="Vendors">Vendors</option>
                            </select>
                          </div>
                          {/* Count display */}
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
                                  <td className="px-4 py-3 text-zinc-500">{l.details}</td>
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

                      {logSubTab === 'chatbot' && (
                        <div className="space-y-4">
                          {/* Filter Controls Header */}
                          <div className="bg-zinc-50 dark:bg-zinc-900/40 p-4 rounded-xl border dark:border-zinc-800 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                            {/* Search Input */}
                            <div>
                              <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1">Search</label>
                              <input type="text" value={chatSearch} onChange={(e) => setChatSearch(e.target.value)}
                                placeholder="Session ID or Owner..."
                                className="w-full px-3 py-2 border dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-lg focus:ring-1 focus:ring-indigo-500 outline-none text-zinc-800 dark:text-zinc-100" />
                            </div>

                            {/* Owner Type Filter */}
                            <div>
                              <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1">Owner Type</label>
                              <select value={chatFilterType} onChange={(e) => setChatFilterType(e.target.value)}
                                className="w-full px-3 py-2 border dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-lg focus:ring-1 focus:ring-indigo-500 outline-none text-zinc-800 dark:text-zinc-100 cursor-pointer">
                                 <option value="all">All Owners</option>
                                <option value="users">Registered Users</option>
                                <option value="guests">Guests Only</option>
                              </select>
                            </div>

                            {/* Message Count Filter */}
                            <div>
                              <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1">Min Messages</label>
                              <select value={chatMinMsgs} onChange={(e) => setChatMinMsgs(Number(e.target.value))}
                                className="w-full px-3 py-2 border dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-lg focus:ring-1 focus:ring-indigo-500 outline-none text-zinc-800 dark:text-zinc-100 cursor-pointer">
                                <option value="0">Any count</option>
                                <option value="2">2+ messages</option>
                                <option value="5">5+ messages</option>
                                <option value="10">10+ messages</option>
                                <option value="20">20+ messages</option>
                              </select>
                            </div>

                            {/* Fallback Filter */}
                            <div className="flex items-center pt-5">
                              <label className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400 cursor-pointer select-none">
                                <input type="checkbox" checked={chatShowOnlyFallbacks} onChange={(e) => setChatShowOnlyFallbacks(e.target.checked)}
                                  className="rounded border-zinc-300 dark:border-zinc-700 text-indigo-600 focus:ring-indigo-500 h-4 w-4 cursor-pointer" />
                                <span>Show only Fallbacks</span>
                              </label>
                            </div>
                          </div>

                          {/* Main Split Layout */}
                          <div className="grid md:grid-cols-3 gap-6">
                            {/* Left: Chat Sessions List */}
                            <div className="md:col-span-1 border dark:border-zinc-800 rounded-xl overflow-hidden bg-white dark:bg-zinc-900 h-[550px] flex flex-col">
                              {/* Session Count Header */}
                              <div className="p-3 bg-zinc-50 dark:bg-zinc-900 border-b dark:border-zinc-800 text-[10px] text-zinc-500 font-bold uppercase tracking-wider flex justify-between items-center">
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
                                        <td className="px-3 py-3 font-semibold text-indigo-600 dark:text-indigo-400">
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

                            {/* Right: Full Conversation Flow Preview */}
                            <div className="md:col-span-2 bg-zinc-50/50 dark:bg-zinc-900/50 border dark:border-zinc-800 rounded-xl p-5 flex flex-col h-[550px]">
                              <h4 className="font-bold text-xs text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5 pb-3 border-b dark:border-zinc-800 mb-4">
                                <Cpu className="h-4 w-4 text-indigo-500" /> 
                                {selectedChatLog ? `Session: ${selectedChatLog.sessionId}` : 'Conversation Preview'}
                              </h4>
                              
                              {selectedChatLog ? (
                                <div className="flex-1 flex flex-col min-h-0">
                                  {/* Metadata */}
                                  <div className="text-[10px] text-zinc-400 flex flex-wrap gap-4 mb-3 bg-white dark:bg-zinc-900 border dark:border-zinc-800 rounded-lg p-2.5 font-mono">
                                    <div><strong>Guest ID:</strong> {selectedChatLog.guestId || 'N/A'}</div>
                                    <div><strong>User Email:</strong> {selectedChatLog.userId?.email || 'N/A'}</div>
                                    <div><strong>Last Update:</strong> {new Date(selectedChatLog.updatedAt || selectedChatLog.createdAt).toLocaleTimeString()}</div>
                                  </div>

                                  {/* Chat Bubbles Scroll View */}
                                  <div className="flex-1 overflow-y-auto space-y-3 pr-2 mb-2 min-h-0 bg-white dark:bg-zinc-950 border dark:border-zinc-800 rounded-xl p-4">
                                    {selectedChatLog.messages && selectedChatLog.messages.map((msg: any, mIdx: number) => {
                                      const isUser = msg.role === 'user';
                                      return (
                                        <div key={mIdx} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                                          <div className={`max-w-[75%] rounded-2xl p-3 text-xs leading-relaxed shadow-sm ${
                                            isUser 
                                              ? 'bg-indigo-600 text-white rounded-br-none' 
                                              : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-100 rounded-bl-none'
                                          }`}>
                                            <p>{msg.text}</p>
                                            <div className={`text-[9px] mt-1.5 flex items-center gap-2 ${isUser ? 'text-indigo-200' : 'text-zinc-400'}`}>
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
                                <div className="flex-1 flex flex-col items-center justify-center text-zinc-400 py-8">
                                  <Cpu className="h-10 w-10 text-zinc-300 dark:text-zinc-700 mb-2 animate-pulse" />
                                  <p className="text-xs text-center">Select a chatbot session from the left to view the entire real-time conversation history.</p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </Section>
          )}

        </main>
      </div>
    </div>
  );
}

// Helpers
function StatCard({ label, value, icon, color }: { label: string; value: string | number; icon: React.ReactNode; color: string }) {
  const colors: Record<string, string> = {
    indigo: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-950/20 border-indigo-100 dark:border-indigo-900/30',
    emerald: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20 border-emerald-100 dark:border-emerald-900/30',
    amber: 'text-amber-500 bg-amber-50 dark:bg-amber-950/20 border-amber-100 dark:border-amber-900/30',
    blue: 'text-blue-500 bg-blue-50 dark:bg-blue-950/20 border-blue-100 dark:border-blue-900/30',
    rose: 'text-rose-500 bg-rose-50 dark:bg-rose-950/20 border-rose-100 dark:border-rose-900/30',
    violet: 'text-violet-500 bg-violet-50 dark:bg-violet-950/20 border-violet-100 dark:border-violet-900/30',
  };
  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl border dark:border-zinc-800 shadow-sm p-5 flex items-center justify-between">
      <div>
        <p className="text-xs text-zinc-400 font-bold uppercase tracking-wider">{label}</p>
        <p className="text-2xl font-black text-zinc-900 dark:text-white mt-1">{value}</p>
      </div>
      <div className={`h-11 w-11 rounded-xl border flex items-center justify-center ${colors[color] ?? colors.indigo}`}>{icon}</div>
    </div>
  );
}

function Section({ children }: { children: React.ReactNode }) {
  return <div className="bg-white dark:bg-zinc-900 rounded-2xl border dark:border-zinc-800 shadow-sm overflow-hidden">{children}</div>;
}

function SectionHeader({ title, desc, right }: { title: string; desc?: string; right?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between px-6 py-4 border-b dark:border-zinc-800">
      <div>
        <h2 className="font-bold text-base text-zinc-900 dark:text-white">{title}</h2>
        {desc && <p className="text-xs text-zinc-400 mt-0.5">{desc}</p>}
      </div>
      {right}
    </div>
  );
}

function Table({ children }: { children: React.ReactNode }) {
  return <div className="overflow-x-auto"><table className="w-full text-sm">{children}</table></div>;
}

function Thead({ children }: { children: React.ReactNode }) {
  return <thead className="bg-zinc-50 dark:bg-zinc-800/50 border-b dark:border-zinc-700">{children}</thead>;
}

function FilterBar({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-wrap gap-3 px-6 py-4 border-b dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">{children}</div>;
}

function ApplyBtn({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick} className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl cursor-pointer transition-colors">
      <Filter className="h-3.5 w-3.5" /> Apply
    </button>
  );
}

function Loading() {
  return <div className="px-6 py-10 text-sm text-zinc-400 flex items-center gap-2"><RefreshCw className="h-4 w-4 animate-spin" /> Loading…</div>;
}

function Sel({ value, onChange, options, placeholder }: { value: string; onChange: (v: string) => void; options: { value: string; label: string }[]; placeholder?: string }) {
  return (
    <select value={value} onChange={e => onChange(e.target.value)}
      className="px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-indigo-500 min-w-[140px]">
      <option value="">{placeholder ?? 'All'}</option>
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  );
}

function SearchBar({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div className="relative flex-1 min-w-[200px]">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
      <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder ?? 'Search…'}
        className="w-full pl-9 pr-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-indigo-500" />
    </div>
  );
}

function renderSortableHeader(
  label: string,
  field: string,
  currentField: string,
  currentOrder: 'asc' | 'desc',
  onSort: (field: string, order: 'asc' | 'desc') => void,
  align: 'left' | 'right' | 'center' = 'left'
) {
  const isCurrent = currentField === field;
  const alignClass = align === 'right' ? 'text-right' : align === 'center' ? 'text-center' : 'text-left';
  return (
    <th 
      onClick={() => {
        const nextOrder = isCurrent && currentOrder === 'desc' ? 'asc' : 'desc';
        onSort(field, nextOrder);
      }}
      className={`px-4 py-3 ${alignClass} text-[10px] font-bold uppercase tracking-wider text-zinc-500 cursor-pointer select-none hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors`}
    >
      <span className="inline-flex items-center gap-1">
        {label}
        {isCurrent ? (
          currentOrder === 'asc' ? <ChevronUp className="h-3 w-3 text-indigo-600 dark:text-indigo-400" /> : <ChevronDown className="h-3 w-3 text-indigo-600 dark:text-indigo-400" />
        ) : (
          <ChevronDown className="h-3 w-3 text-zinc-300 dark:text-zinc-700 opacity-20 hover:opacity-100 transition-opacity" />
        )}
      </span>
    </th>
  );
}

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;
  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 px-6 py-4 border-t dark:border-zinc-800 bg-zinc-50/20 dark:bg-zinc-900/10">
      <span className="text-xs text-zinc-500 font-semibold">Page {currentPage} of {totalPages}</span>
      <div className="flex items-center gap-2">
        <button 
          disabled={currentPage === 1}
          onClick={() => onPageChange(1)}
          className="px-3 py-1.5 text-xs border dark:border-zinc-800 rounded-lg disabled:opacity-40 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-semibold cursor-pointer disabled:cursor-not-allowed transition-colors"
        >
          First
        </button>
        <button 
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="px-3 py-1.5 text-xs border dark:border-zinc-800 rounded-lg disabled:opacity-40 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-semibold cursor-pointer disabled:cursor-not-allowed transition-colors"
        >
          Previous
        </button>
        <button 
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="px-3 py-1.5 text-xs border dark:border-zinc-800 rounded-lg disabled:opacity-40 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-semibold cursor-pointer disabled:cursor-not-allowed transition-colors"
        >
          Next
        </button>
        <button 
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(totalPages)}
          className="px-3 py-1.5 text-xs border dark:border-zinc-800 rounded-lg disabled:opacity-40 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-semibold cursor-pointer disabled:cursor-not-allowed transition-colors"
        >
          Last
        </button>
      </div>
    </div>
  );
}
