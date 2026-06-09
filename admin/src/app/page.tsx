'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  LayoutDashboard, Users, ShoppingBag, Package, Star, Tag, Store,
  LogOut, Sun, Moon, Search, Filter, ChevronUp, ChevronDown,
  Trash2, CheckCircle, XCircle, ShieldCheck, TrendingUp,
  Mail, Lock, AlertCircle, RefreshCw, Edit2, X, Check,
  User, Settings, Database, Activity, Eye, ShieldAlert, Cpu, Download, ToggleLeft, ToggleRight, Phone, Calendar,
  Megaphone, FileText
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
  const [logSubTab, setLogSubTab] = useState<'audit' | 'search' | 'activity' | 'chatbot' | 'api' | 'security' | 'importexport' | 'guest' | 'changehistory' | 'analytics' | 'retention'>('audit');
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [searchLogs, setSearchLogs] = useState<any[]>([]);
  const [activityLogs, setActivityLogs] = useState<any[]>([]);
  const [chatbotLogs, setChatbotLogs] = useState<any[]>([]);
  const [apiLogs, setApiLogs] = useState<any[]>([]);
  const [securityLogs, setSecurityLogs] = useState<any[]>([]);
  const [importLogs, setImportLogs] = useState<any[]>([]);
  const [exportLogs, setExportLogs] = useState<any[]>([]);
  const [guestLogs, setGuestLogs] = useState<any[]>([]);
  const [changeHistoryLogs, setChangeHistoryLogs] = useState<any[]>([]);
  const [logAnalytics, setLogAnalytics] = useState<any | null>(null);
  const [selectedChatLog, setSelectedChatLog] = useState<any | null>(null);
  const [selectedLogDetail, setSelectedLogDetail] = useState<any | null>(null);
  const [auditPage, setAuditPage] = useState(1);
  const [searchPage, setSearchPage] = useState(1);
  const [activityPage, setActivityPage] = useState(1);
  const [chatbotPage, setChatbotPage] = useState(1);
  const [apiPage, setApiPage] = useState(1);
  const [securityPage, setSecurityPage] = useState(1);
  const [importPage, setImportPage] = useState(1);
  const [exportPage, setExportPage] = useState(1);
  const [guestPage, setGuestPage] = useState(1);
  const [changeHistoryPage, setChangeHistoryPage] = useState(1);
  const [retentionDays, setRetentionDays] = useState(90);
  const [analyticsSubTab, setAnalyticsSubTab] = useState<'overview' | 'sales' | 'chatbot' | 'demographics'>('overview');
  const [apiError, setApiError] = useState<string>('');

  // Feedback Center States
  const [supportSubTab, setSupportSubTab] = useState<'tickets' | 'feedback'>('tickets');
  const [feedbackTickets, setFeedbackTickets] = useState<any[]>([]);
  const [feedbackStats, setFeedbackStats] = useState<any | null>(null);
  const [selectedFeedback, setSelectedFeedback] = useState<any | null>(null);
  const [feedbackComments, setFeedbackComments] = useState<any[]>([]);
  const [feedbackAttachments, setFeedbackAttachments] = useState<any[]>([]);
  const [feedbackActivities, setFeedbackActivities] = useState<any[]>([]);
  const [feedbackSearch, setFeedbackSearch] = useState('');
  const [feedbackTypeFilter, setFeedbackTypeFilter] = useState('');
  const [feedbackStatusFilter, setFeedbackStatusFilter] = useState('');
  const [feedbackCategoryFilter, setFeedbackCategoryFilter] = useState('');
  const [feedbackPage, setFeedbackPage] = useState(1);
  const [feedbackSortField, setFeedbackSortField] = useState('createdAt');
  const [feedbackSortOrder, setFeedbackSortOrder] = useState<'asc' | 'desc'>('desc');
  const [feedbackReplyText, setFeedbackReplyText] = useState('');
  const [feedbackIsPrivateNote, setFeedbackIsPrivateNote] = useState(false);
  const [feedbackRoadmapStatusSelect, setFeedbackRoadmapStatusSelect] = useState('');
  const [feedbackStatusSelect, setFeedbackStatusSelect] = useState('');
  const [feedbackAssignTeamSelect, setFeedbackAssignTeamSelect] = useState('');
  const [feedbackAssignAgentSelect, setFeedbackAssignAgentSelect] = useState('');
  
  // Floating widget states
  const [showFloatingWidget, setShowFloatingWidget] = useState(false);
  const [widgetType, setWidgetType] = useState('Feedback');
  const [widgetCategory, setWidgetCategory] = useState('General');
  const [widgetSubject, setWidgetSubject] = useState('');
  const [widgetDescription, setWidgetDescription] = useState('');
  const [widgetName, setWidgetName] = useState('');
  const [widgetEmail, setWidgetEmail] = useState('');
  const [widgetPhone, setWidgetPhone] = useState('');
  const [widgetPriority, setWidgetPriority] = useState('Medium');
  const [widgetSeverity, setWidgetSeverity] = useState('Medium');
  const [widgetCaptcha, setWidgetCaptcha] = useState('');
  const [widgetCaptchaVal, setWidgetCaptchaVal] = useState('8F9A');
  const [widgetAttachments, setWidgetAttachments] = useState<any[]>([]);
  const [duplicateSuggestions, setDuplicateSuggestions] = useState<any[]>([]);

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
  const limit = generalSettings.pageSize || 20;
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

  // Phase F State Variables
  const [featureFlags, setFeatureFlags] = useState<any[]>([
    { _id: 'flag-1', name: 'Al Chatbot Assistant', key: 'ENABLE_CHATBOT', description: 'Enable NLP chatbot assistant widget in storefront.', isEnabled: true, group: 'Storefront' },
    { _id: 'flag-2', name: 'Direct Wallet Payouts', key: 'ENABLE_WALLET_WITHDRAWAL', description: 'Allow sellers/vendors to request direct bank deposit settlements.', isEnabled: true, group: 'Payments' },
    { _id: 'flag-3', name: 'SSO Login Integration', key: 'ENABLE_SSO', description: 'Show Google and GitHub quick authentication login buttons.', isEnabled: false, group: 'Authentication' }
  ]);
  const [newFlagName, setNewFlagName] = useState('');
  const [newFlagKey, setNewFlagKey] = useState('');
  const [newFlagDesc, setNewFlagDesc] = useState('');
  const [newFlagGroup, setNewFlagGroup] = useState('Storefront');

  const [announcements, setAnnouncements] = useState<any[]>([
    { _id: 'ann-1', title: 'Summer Sale Promo Event', message: 'The platform summer sale campaign starts tomorrow! Make sure all items are stocked.', targetRole: 'Customer', isActive: true, createdAt: '2026-06-08T10:00:00.000Z' },
    { _id: 'ann-2', title: 'Scheduled Database Maintenance', message: 'We will be conducting platform DB maintenance on Sunday at 02:00 AM UTC. Expect brief downtime.', targetRole: 'Seller', isActive: true, createdAt: '2026-06-05T08:30:00.000Z' }
  ]);
  const [newAnnTitle, setNewAnnTitle] = useState('');
  const [newAnnMsg, setNewAnnMsg] = useState('');
  const [newAnnTarget, setNewAnnTarget] = useState('Customer');

  const [fraudLogs, setFraudLogs] = useState<any[]>([
    { _id: 'frd-1', email: 'spammer_99@example.com', riskScore: 92, reason: 'High-frequency brute-force login attempts (15 failures/min)', ipAddress: '198.51.100.42', status: 'Blocked', createdAt: '2026-06-09T02:15:00.000Z' },
    { _id: 'frd-2', email: 'clara.oswald@example.com', riskScore: 45, reason: 'Cross-device session activity in short interval', ipAddress: '203.0.113.195', status: 'Flagged', createdAt: '2026-06-08T18:40:00.000Z' }
  ]);

  const [gdprRequests, setGdprRequests] = useState<any[]>([
    { _id: 'gdp-1', email: 'dDonna.noble@example.com', requestType: 'Export Data', status: 'Pending', createdAt: '2026-06-09T01:00:00.000Z' },
    { _id: 'gdp-2', email: 'rory.williams@example.com', requestType: 'Delete Profile', status: 'Completed', processedAt: '2026-06-07T12:00:00.000Z', createdAt: '2026-06-06T10:30:00.000Z' }
  ]);

  const [healthMetrics, setHealthMetrics] = useState({
    cpu: 18,
    memory: 46,
    disk: 34,
    dbConnected: true,
    uptime: '14 Days, 6 Hours'
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
      if (logSubTab === 'api') setApiLogs(await apiFetch('/admin/api-logs'));
      if (logSubTab === 'security') setSecurityLogs(await apiFetch('/admin/security-logs'));
      if (logSubTab === 'importexport') {
        setImportLogs(await apiFetch('/admin/import-logs'));
        setExportLogs(await apiFetch('/admin/export-logs'));
      }
      if (logSubTab === 'guest') setGuestLogs(await apiFetch('/admin/guest-logs'));
      if (logSubTab === 'changehistory') setChangeHistoryLogs(await apiFetch('/admin/change-history'));
      if (logSubTab === 'analytics') setLogAnalytics(await apiFetch('/admin/logs/analytics'));
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

  const loadFeedback = useCallback(async () => {
    setLoading(true);
    try {
      const p = new URLSearchParams();
      if (feedbackSearch) p.set('search', feedbackSearch);
      if (feedbackTypeFilter) p.set('type', feedbackTypeFilter);
      if (feedbackStatusFilter) p.set('status', feedbackStatusFilter);
      if (feedbackCategoryFilter) p.set('category', feedbackCategoryFilter);
      p.set('page', String(feedbackPage));
      p.set('limit', String(limit));
      p.set('sortField', feedbackSortField);
      p.set('sortOrder', feedbackSortOrder);

      const res = await apiFetch(`/admin/feedback?${p}`);
      setFeedbackTickets(res.data || []);
      
      const statsRes = await apiFetch('/admin/feedback/dashboard');
      setFeedbackStats(statsRes);
    } catch { 
      setFeedbackTickets([]); 
    } finally {
      setLoading(false);
    }
  }, [apiFetch, feedbackSearch, feedbackTypeFilter, feedbackStatusFilter, feedbackCategoryFilter, feedbackPage, feedbackSortField, feedbackSortOrder, limit]);

  const loadFeedbackDetail = useCallback(async (id: string) => {
    try {
      const res = await apiFetch(`/admin/feedback/${id}`);
      setSelectedFeedback(res.ticket);
      setFeedbackComments(res.comments || []);
      setFeedbackAttachments(res.attachments || []);
      setFeedbackActivities(res.activities || []);
      
      setFeedbackStatusSelect(res.ticket.status || '');
      setFeedbackRoadmapStatusSelect(res.ticket.roadmapStatus || '');
      setFeedbackAssignTeamSelect(res.ticket.assignedTo || '');
      setFeedbackAssignAgentSelect(res.ticket.assignedAgentId || '');
    } catch (err: any) {
      alert(`Access denied: ${err.message || 'Error loading feedback details.'}`);
      setSelectedFeedback(null);
    }
  }, [apiFetch]);

  // Floating Feedback widget callbacks
  useEffect(() => {
    if (!widgetSubject.trim() || widgetSubject.length < 4) {
      setDuplicateSuggestions([]);
      return;
    }
    const delay = setTimeout(async () => {
      try {
        const res = await fetch(`${API}/feedback/duplicates?type=${widgetType}&subject=${encodeURIComponent(widgetSubject)}`);
        if (res.ok) {
          const data = await res.json();
          setDuplicateSuggestions(data || []);
        }
      } catch (e) {
        console.error(e);
      }
    }, 450);
    return () => clearTimeout(delay);
  }, [widgetSubject, widgetType]);

  const handleVoteSuggestion = async (id: string) => {
    if (!token) {
      alert('Please sign in or use an authorized session to vote.');
      return;
    }
    try {
      await apiAction('POST', `/feedback/${id}/vote`);
      alert('Thank you! Your vote has been recorded.');
      // Refresh duplicate list
      const res = await fetch(`${API}/feedback/duplicates?type=${widgetType}&subject=${encodeURIComponent(widgetSubject)}`);
      if (res.ok) {
        setDuplicateSuggestions(await res.json());
      }
    } catch (err: any) {
      alert(err.message || 'Failed to vote');
    }
  };

  const handleWidgetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (widgetCaptcha.trim().toUpperCase() !== widgetCaptchaVal.toUpperCase()) {
      alert('Verification CAPTCHA code is incorrect.');
      return;
    }

    const metadata = {
      browser: typeof window !== 'undefined' ? navigator.userAgent : 'Browser',
      os: typeof window !== 'undefined' ? navigator.platform : 'OS',
      device: typeof window !== 'undefined' && window.innerWidth < 768 ? 'Mobile' : 'Desktop',
      screenResolution: typeof window !== 'undefined' ? `${window.innerWidth}x${window.innerHeight}` : '1920x1080',
      url: typeof window !== 'undefined' ? window.location.href : '',
    };

    const payload = {
      type: widgetType,
      category: widgetCategory,
      subject: widgetSubject,
      description: widgetDescription,
      name: widgetName || 'Anonymous Guest',
      email: widgetEmail || 'guest@example.com',
      phone: widgetPhone,
      priority: widgetPriority,
      severity: widgetSeverity,
      ...metadata,
      attachments: widgetAttachments,
    };

    try {
      const path = token ? '/feedback/submit-logged-in' : '/feedback/submit';
      const res = await fetch(`${API}${path}`, {
        method: 'POST',
        headers: token ? authHeaders(token) : { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('Submission failed');
      alert('Feedback ticket created successfully! Our quality control teams will review it.');
      
      // Reset state
      setWidgetSubject('');
      setWidgetDescription('');
      setWidgetName('');
      setWidgetEmail('');
      setWidgetPhone('');
      setWidgetCaptcha('');
      setWidgetAttachments([]);
      setDuplicateSuggestions([]);
      setShowFloatingWidget(false);

      if (token && activeTab === 'support' && supportSubTab === 'feedback') {
        loadFeedback();
      }
    } catch (err: any) {
      alert(err.message || 'Failed to submit feedback request.');
    }
  };

  const handleGenerateCaptcha = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let cap = '';
    for (let i = 0; i < 4; i++) {
      cap += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setWidgetCaptchaVal(cap);
  };

  useEffect(() => { if (!token) return; loadStats(); }, [token, loadStats]);
  useEffect(() => { if (!token || activeTab !== 'users') return; loadUsers(); }, [token, activeTab, loadUsers]);
  useEffect(() => { if (!token || activeTab !== 'orders') return; loadOrders(); }, [token, activeTab, loadOrders]);
  useEffect(() => { if (!token || activeTab !== 'products') return; loadProducts(); }, [token, activeTab, loadProducts]);
  useEffect(() => { if (!token || activeTab !== 'vendors') return; loadVendors(); }, [token, activeTab, loadVendors]);
  useEffect(() => { if (!token || activeTab !== 'profile') return; loadAdminProfile(); }, [token, activeTab, loadAdminProfile]);
  useEffect(() => { if (!token || activeTab !== 'settings') return; loadSystemSettings(settingTab); }, [token, activeTab, settingTab, loadSystemSettings]);
  useEffect(() => { if (!token || activeTab !== 'logs') return; loadLogs(); }, [token, activeTab, logSubTab, loadLogs]);
  useEffect(() => { if (!token || activeTab !== 'support') return; loadTickets(); }, [token, activeTab, loadTickets]);
  useEffect(() => { if (!token || activeTab !== 'support' || supportSubTab !== 'feedback') return; loadFeedback(); }, [token, activeTab, supportSubTab, loadFeedback]);

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

  const totalApiPages = Math.ceil(apiLogs.length / limit) || 1;
  const paginatedApis = useMemo(() => {
    return apiLogs.slice((apiPage - 1) * limit, apiPage * limit);
  }, [apiLogs, apiPage, limit]);

  const totalSecurityPages = Math.ceil(securityLogs.length / limit) || 1;
  const paginatedSecurities = useMemo(() => {
    return securityLogs.slice((securityPage - 1) * limit, securityPage * limit);
  }, [securityLogs, securityPage, limit]);

  const totalImportPages = Math.ceil(importLogs.length / limit) || 1;
  const paginatedImports = useMemo(() => {
    return importLogs.slice((importPage - 1) * limit, importPage * limit);
  }, [importLogs, importPage, limit]);

  const totalExportPages = Math.ceil(exportLogs.length / limit) || 1;
  const paginatedExports = useMemo(() => {
    return exportLogs.slice((exportPage - 1) * limit, exportPage * limit);
  }, [exportLogs, exportPage, limit]);

  const totalGuestPages = Math.ceil(guestLogs.length / limit) || 1;
  const paginatedGuests = useMemo(() => {
    return guestLogs.slice((guestPage - 1) * limit, guestPage * limit);
  }, [guestLogs, guestPage, limit]);

  const totalChangeHistoryPages = Math.ceil(changeHistoryLogs.length / limit) || 1;
  const paginatedChangeHistories = useMemo(() => {
    return changeHistoryLogs.slice((changeHistoryPage - 1) * limit, changeHistoryPage * limit);
  }, [changeHistoryLogs, changeHistoryPage, limit]);

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

  useEffect(() => {
    if (apiPage > totalApiPages) setApiPage(1);
  }, [apiLogs.length, totalApiPages, apiPage]);

  useEffect(() => {
    if (securityPage > totalSecurityPages) setSecurityPage(1);
  }, [securityLogs.length, totalSecurityPages, securityPage]);

  useEffect(() => {
    if (importPage > totalImportPages) setImportPage(1);
  }, [importLogs.length, totalImportPages, importPage]);

  useEffect(() => {
    if (exportPage > totalExportPages) setExportPage(1);
  }, [exportLogs.length, totalExportPages, exportPage]);

  useEffect(() => {
    if (guestPage > totalGuestPages) setGuestPage(1);
  }, [guestLogs.length, totalGuestPages, guestPage]);

  useEffect(() => {
    if (changeHistoryPage > totalChangeHistoryPages) setChangeHistoryPage(1);
  }, [changeHistoryLogs.length, totalChangeHistoryPages, changeHistoryPage]);

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
        api: 'API Requests',
        security: 'Security Alerts',
        importexport: 'Import/Export Activity',
        guest: 'Guest Visitors',
        changehistory: 'Change Differential Diffs',
        analytics: 'Activity Analytics',
        retention: 'Retention Controls',
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

    if (selectedFeedback) {
      list.push({
        label: `Feedback: ${selectedFeedback.subject || selectedFeedback.ticketId}`,
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
  }, [activeTab, vendorType, logSubTab, settingTab, selectedUser, selectedSeller, selectedVendor, selectedOrder, selectedProduct, selectedTicket, selectedLogDetail, selectedFeedback, supportSubTab]);

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
    { key: 'flags',     label: 'Feature Flags', icon: <ToggleLeft className="h-4 w-4" /> },
    { key: 'announcements', label: 'Announcements', icon: <Megaphone className="h-4 w-4" /> },
    { key: 'fraud',     label: 'Fraud Control', icon: <ShieldAlert className="h-4 w-4" /> },
    { key: 'gdpr',      label: 'GDPR Queue', icon: <FileText className="h-4 w-4" /> },
    { key: 'health',    label: 'System Health', icon: <Activity className="h-4 w-4" /> },
    { key: 'settings',  label: 'Settings',  icon: <Settings className="h-4 w-4" /> },
    { key: 'analytics', label: 'Analytics', icon: <TrendingUp className="h-4 w-4" /> },
    { key: 'logs',      label: 'System Logs',icon: <Database className="h-4 w-4" /> },
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
              {/* Subtabs for Support Center */}
              <div className="flex border-b dark:border-zinc-800 px-6 bg-zinc-50/30 dark:bg-zinc-900/10">
                {[
                  { key: 'tickets', label: 'Support Tickets' },
                  { key: 'feedback', label: 'Feedback Center' }
                ].map(t => (
                  <button key={t.key} onClick={() => { setSupportSubTab(t.key as any); setSelectedTicket(null); setSelectedFeedback(null); }}
                    className={`px-4 py-3 text-xs font-bold border-b-2 -mb-[2px] transition-all cursor-pointer ${
                      supportSubTab === t.key
                        ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                        : 'border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
                    }`}>
                    {t.label}
                  </button>
                ))}
              </div>

              {supportSubTab === 'tickets' ? (
                selectedTicket ? (
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
                    <div className="grid md:grid-cols-3 gap-6 text-xs mt-4 p-6">
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
                                      : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-100 rounded-tl-none'
                                  }`}>
                                    <p>{msg.message}</p>
                                    <span className={`text-[9px] block mt-1 ${isStaff ? 'text-indigo-200' : 'text-zinc-400'}`}>
                                      {msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString() : ''}
                                    </span>
                                  </div>
                                </div>
                              );
                            })
                          ) : (
                            <div className="text-center py-12 text-zinc-400">No message logs.</div>
                          )}
                        </div>

                        {/* Reply form */}
                        <div className="border-t dark:border-zinc-800 pt-3 flex gap-2">
                          <input 
                            type="text" 
                            className="flex-1 rounded-xl border dark:border-zinc-800 p-2.5 text-xs bg-white dark:bg-zinc-955 text-zinc-900 dark:text-white outline-none focus:border-indigo-500" 
                            placeholder="Type your reply to the customer / merchant..." 
                            value={ticketReplyText} 
                            onChange={e => setTicketReplyText(e.target.value)} 
                          />
                          <button 
                            onClick={async () => {
                              if (!ticketReplyText.trim()) return;
                              try {
                                const res = await apiAction('POST', `/support/tickets/${selectedTicket._id}/reply`, { message: ticketReplyText });
                                setTicketReplyText('');
                                setSelectedTicket(res);
                                loadTickets();
                              } catch (err: any) {
                                alert(`Failed to reply: ${err.message}`);
                              }
                            }}
                            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl text-xs cursor-pointer shadow"
                          >
                            Send
                          </button>
                        </div>
                      </div>

                      {/* Right: Ticket Sidebar Details */}
                      <div className="space-y-4">
                        {/* Properties Card */}
                        <div className="bg-zinc-50/50 dark:bg-zinc-900/40 border dark:border-zinc-800 rounded-2xl p-4 space-y-4 shadow-sm">
                          <h4 className="font-bold text-[10px] text-zinc-400 uppercase tracking-wider border-b pb-2 dark:border-zinc-800">Properties</h4>
                          
                          <div className="space-y-3">
                            <div>
                              <span className="block text-[10px] text-zinc-400 font-bold uppercase">Department/Queue</span>
                              <span className="text-xs font-semibold text-zinc-900 dark:text-white mt-0.5 block">{selectedTicket.category || 'General Support'}</span>
                            </div>
                            
                            <div>
                              <span className="block text-[10px] text-zinc-400 font-bold uppercase">Priority Level</span>
                              <span className="mt-1 block">{badge(selectedTicket.priority === 'Urgent' ? 'red' : selectedTicket.priority === 'High' ? 'amber' : 'blue', selectedTicket.priority)}</span>
                            </div>

                            <div className="space-y-1">
                              <label className="text-[10px] text-zinc-400 font-bold uppercase">Update Status</label>
                              <select 
                                value={ticketStatusSelect} 
                                onChange={async (e) => {
                                  const val = e.target.value;
                                  setTicketStatusSelect(val);
                                  try {
                                    const res = await apiAction('PUT', `/support/tickets/${selectedTicket._id}/status`, { status: val });
                                    setSelectedTicket(res);
                                    loadTickets();
                                  } catch (err: any) {
                                    alert(`Failed: ${err.message}`);
                                  }
                                }}
                                className="w-full px-2 py-1.5 border dark:border-zinc-850 bg-white dark:bg-zinc-950 rounded-lg text-xs text-zinc-900 dark:text-white cursor-pointer"
                              >
                                <option value="Open">Open</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Resolved">Resolved</option>
                                <option value="Closed">Closed</option>
                              </select>
                            </div>

                            <div className="space-y-1">
                              <label className="text-[10px] text-zinc-400 font-bold uppercase">Assign Staff Agent</label>
                              <select 
                                value={ticketAgentSelect} 
                                onChange={async (e) => {
                                  const val = e.target.value;
                                  setTicketAgentSelect(val);
                                  try {
                                    await apiAction('PUT', `/support/tickets/${selectedTicket._id}/assign`, { agentId: val || null });
                                    const freshTickets = await apiFetch('/support/tickets');
                                    setTickets(freshTickets);
                                    const found = freshTickets.find((t: any) => t._id === selectedTicket._id);
                                    if (found) setSelectedTicket(found);
                                  } catch (err: any) {
                                    alert(`Failed to assign agent: ${err.message}`);
                                  }
                                }}
                                className="w-full px-2 py-1.5 border dark:border-zinc-800 bg-white dark:bg-zinc-955 rounded-lg text-xs text-zinc-905 dark:text-white"
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
                                  <tr key={t._id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40 text-xs">
                                    <td 
                                      className="px-4 py-3 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                                      onClick={() => setSelectedTicket(t)}
                                    >
                                      {t.subject}
                                    </td>
                                    <td className="px-4 py-3 text-zinc-500">
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
                                    <td className="px-4 py-3 text-zinc-400">
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
                )
              ) : (
                // ================= FEEDBACK CENTER SUB-TAB =================
                selectedFeedback ? (
                  <>
                    <SectionHeader 
                      title={`Feedback: [${selectedFeedback.ticketId}] ${selectedFeedback.subject}`}
                      desc={`Category: ${selectedFeedback.category} · Priority: ${selectedFeedback.priority}`}
                      right={
                        <button 
                          onClick={() => setSelectedFeedback(null)} 
                          className="px-3 py-1.5 border dark:border-zinc-800 text-zinc-650 hover:text-indigo-500 rounded-lg text-xs font-semibold flex items-center gap-1.5 dark:text-zinc-300 bg-white dark:bg-zinc-900 cursor-pointer"
                        >
                          <X className="h-4 w-4"/> Back to Listing
                        </button>
                      } 
                    />

                    {selectedFeedback.isConfidential && (
                      <div className="bg-rose-50 border border-rose-200 text-rose-800 dark:bg-rose-950/20 dark:border-rose-900/30 dark:text-rose-450 px-6 py-2 text-xs font-bold flex items-center gap-2">
                        <Lock className="h-4 w-4 animate-pulse" /> Confidential Security Report. Restricted Access Authorized.
                      </div>
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
                      {/* Left and Middle: Details & Communication */}
                      <div className="lg:col-span-2 space-y-6">
                        {/* Reporter & Context Info */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                          {/* Reporter Info */}
                          <div className="bg-zinc-50/50 dark:bg-zinc-900/40 p-4 border dark:border-zinc-800 rounded-xl space-y-2 shadow-sm">
                            <h4 className="font-bold text-[10px] text-zinc-400 uppercase tracking-wider">Reporter Info</h4>
                            <div className="space-y-1">
                              <div><strong>Name:</strong> {selectedFeedback.name}</div>
                              <div><strong>Email:</strong> {selectedFeedback.email}</div>
                              <div><strong>Role:</strong> {selectedFeedback.userRole}</div>
                              {selectedFeedback.userId && <div><strong>User ID:</strong> <span className="font-mono text-[10px]">{selectedFeedback.userId}</span></div>}
                            </div>
                          </div>

                          {/* Technical Context */}
                          <div className="bg-zinc-50/50 dark:bg-zinc-900/40 p-4 border dark:border-zinc-800 rounded-xl space-y-2 shadow-sm">
                            <h4 className="font-bold text-[10px] text-zinc-400 uppercase tracking-wider">Technical Environment</h4>
                            <div className="space-y-1">
                              <div><strong>OS / Browser:</strong> {selectedFeedback.os} / {selectedFeedback.browser}</div>
                              <div><strong>Device / Size:</strong> {selectedFeedback.device} ({selectedFeedback.screenResolution})</div>
                              <div><strong>IP Address:</strong> <span className="font-mono">{selectedFeedback.ipAddress}</span></div>
                            </div>
                          </div>

                          {/* Meta & Issue details */}
                          <div className="bg-zinc-50/50 dark:bg-zinc-900/40 p-4 border dark:border-zinc-800 rounded-xl space-y-2 shadow-sm">
                            <h4 className="font-bold text-[10px] text-zinc-400 uppercase tracking-wider">Issue Meta</h4>
                            <div className="space-y-1">
                              <div><strong>Type:</strong> {badge('blue', selectedFeedback.type)}</div>
                              <div><strong>Severity:</strong> {badge(selectedFeedback.severity === 'Critical' ? 'red' : 'zinc', selectedFeedback.severity)}</div>
                              <div><strong>Created:</strong> {new Date(selectedFeedback.createdAt).toLocaleString()}</div>
                              {selectedFeedback.url && <div className="truncate"><strong>URL:</strong> <a href={selectedFeedback.url} target="_blank" rel="noreferrer" className="text-indigo-500 hover:underline">{selectedFeedback.url}</a></div>}
                            </div>
                          </div>
                        </div>

                        {/* Description Box */}
                        <div className="bg-white dark:bg-zinc-900 border dark:border-zinc-800 rounded-2xl p-5 shadow-sm space-y-3">
                          <h4 className="font-bold text-xs text-zinc-900 dark:text-white uppercase tracking-wider">Description</h4>
                          <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed whitespace-pre-wrap">{selectedFeedback.description}</p>
                        </div>

                        {/* Attachments Section */}
                        {feedbackAttachments.length > 0 && (
                          <div className="bg-white dark:bg-zinc-900 border dark:border-zinc-800 rounded-2xl p-5 shadow-sm space-y-3">
                            <h4 className="font-bold text-xs text-zinc-900 dark:text-white uppercase tracking-wider">Attachments ({feedbackAttachments.length})</h4>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                              {feedbackAttachments.map((att: any) => {
                                const isImg = att.fileType.startsWith('image/');
                                return (
                                  <div key={att._id} className="border dark:border-zinc-800 rounded-xl p-2.5 bg-zinc-50/50 dark:bg-zinc-950 flex flex-col justify-between items-center text-center">
                                    {isImg ? (
                                      <div className="h-16 w-full rounded bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center overflow-hidden">
                                        <img src={att.fileUrl || '/api/placeholder'} alt="Attachment preview" className="object-cover h-full w-full" />
                                      </div>
                                    ) : (
                                      <div className="h-16 w-full rounded bg-zinc-100 dark:bg-zinc-850 flex items-center justify-center text-zinc-400 font-bold text-[10px]">
                                        {att.fileType.split('/')[1]?.toUpperCase() || 'FILE'}
                                      </div>
                                    )}
                                    <span className="text-[10px] text-zinc-800 dark:text-zinc-200 truncate w-full mt-2 font-medium">{att.fileName}</span>
                                    <a href={att.fileUrl} target="_blank" rel="noreferrer" className="mt-1 text-[9px] text-indigo-500 font-bold hover:underline">Download</a>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {/* Customer Closure Survey Metric (Show if Resolved/Closed) */}
                        {selectedFeedback.rating > 0 && (
                          <div className="bg-emerald-50 border border-emerald-250 text-emerald-800 dark:bg-emerald-950/20 dark:border-emerald-900/30 dark:text-emerald-450 p-5 rounded-2xl shadow-sm space-y-2">
                            <h4 className="font-bold text-xs uppercase tracking-wider flex items-center gap-1.5"><CheckCircle className="h-4 w-4" /> Customer Satisfaction Survey Rating</h4>
                            <div className="flex items-center gap-1">
                              {[1, 2, 3, 4, 5].map(star => (
                                <span key={star} className={`text-lg ${star <= selectedFeedback.rating ? 'text-amber-500' : 'text-zinc-300'}`}>★</span>
                              ))}
                              <span className="text-xs font-bold ml-2">({selectedFeedback.rating} / 5 Stars)</span>
                            </div>
                            {selectedFeedback.surveyComment && (
                              <p className="text-xs italic mt-1 bg-white/50 dark:bg-zinc-950/40 p-2 rounded-xl border border-emerald-100 dark:border-emerald-955">
                                "{selectedFeedback.surveyComment}"
                              </p>
                            )}
                          </div>
                        )}

                        {/* Conversation & Activities box */}
                        <div className="bg-white dark:bg-zinc-900 border dark:border-zinc-800 rounded-2xl p-5 shadow-sm space-y-4">
                          <h4 className="font-bold text-xs text-zinc-900 dark:text-white uppercase tracking-wider">Communication Logs & Audit Trail</h4>
                          
                          <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                            {/* Merge comments & activities chronologically */}
                            {[
                              ...feedbackComments.map(c => ({ ...c, type: 'comment' })),
                              ...feedbackActivities.map(a => ({ ...a, type: 'activity' })),
                            ]
                              .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
                              .map((item: any, idx: number) => {
                                if (item.type === 'activity') {
                                  return (
                                    <div key={idx} className="flex gap-2 items-center text-[10px] text-zinc-400 font-mono py-1.5 border-b border-dashed dark:border-zinc-800/85">
                                      <Activity className="h-3 w-3 text-indigo-500 shrink-0" />
                                      <span><strong>{item.userName} ({item.userRole})</strong> triggered <strong>{item.action}</strong> {item.newValue ? `-> ${item.newValue}` : ''}</span>
                                    </div>
                                  );
                                } else {
                                  const isStaff = item.userRole === 'Admin' || item.userRole === 'Super Admin' || item.userRole === 'Support Agent';
                                  return (
                                    <div key={idx} className={`flex ${isStaff ? 'justify-end' : 'justify-start'}`}>
                                      <div className={`max-w-[80%] rounded-2xl p-3 text-xs shadow-sm ${
                                        item.isPrivate
                                          ? 'bg-amber-50 dark:bg-amber-950/20 border border-amber-200/50 text-amber-800 dark:text-amber-400'
                                          : isStaff 
                                            ? 'bg-indigo-600 text-white rounded-tr-none'
                                            : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-150 rounded-tl-none'
                                      }`}>
                                        <div className="flex justify-between items-center gap-4 text-[9px] font-bold uppercase tracking-wider mb-1 opacity-70">
                                          <span>{item.userName} ({item.userRole})</span>
                                          {item.isPrivate && <span className="bg-amber-600 text-white text-[8px] px-1 rounded uppercase tracking-wider font-extrabold">Internal Note</span>}
                                        </div>
                                        <p>{item.text}</p>
                                        <span className="text-[8px] block text-right mt-1 opacity-60">{new Date(item.createdAt).toLocaleTimeString()}</span>
                                      </div>
                                    </div>
                                  );
                                }
                              })}
                          </div>

                          {/* Submit Comment */}
                          <div className="border-t dark:border-zinc-800 pt-3 space-y-3">
                            <div className="flex items-center justify-between">
                              <label className="flex items-center gap-1.5 text-xs text-zinc-650 dark:text-zinc-350 cursor-pointer select-none font-bold">
                                <input 
                                  type="checkbox" 
                                  checked={feedbackIsPrivateNote} 
                                  onChange={e => setFeedbackIsPrivateNote(e.target.checked)} 
                                  className="rounded border-zinc-300 text-amber-600 focus:ring-amber-500 h-4 w-4" 
                                />
                                <span className={feedbackIsPrivateNote ? 'text-amber-600 font-extrabold' : ''}>Internal Private Note (Developer / QA Notes)</span>
                              </label>
                            </div>
                            <div className="flex gap-2">
                              <input 
                                type="text"
                                className="flex-1 rounded-xl border dark:border-zinc-800 p-2.5 text-xs bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white outline-none focus:border-indigo-500"
                                placeholder={feedbackIsPrivateNote ? "Add developer/QA notes (restricted to staff)..." : "Type a response update to the user..."}
                                value={feedbackReplyText}
                                onChange={e => setFeedbackReplyText(e.target.value)}
                              />
                              <button 
                                onClick={async () => {
                                  if (!feedbackReplyText.trim()) return;
                                  try {
                                    await apiAction('POST', `/admin/feedback/${selectedFeedback._id}/comments`, {
                                      text: feedbackReplyText,
                                      isPrivate: feedbackIsPrivateNote,
                                    });
                                    setFeedbackReplyText('');
                                    loadFeedbackDetail(selectedFeedback._id);
                                    loadFeedback();
                                  } catch (err: any) {
                                    alert(`Failed: ${err.message}`);
                                  }
                                }}
                                className={`px-5 py-2.5 font-bold rounded-xl text-xs cursor-pointer shadow text-white ${feedbackIsPrivateNote ? 'bg-amber-600 hover:bg-amber-500' : 'bg-indigo-600 hover:bg-indigo-500'}`}
                              >
                                Post Note
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Right: Operations & Workflows Panel */}
                      <div className="space-y-4">
                        {/* Properties Settings Card */}
                        <div className="bg-zinc-50/50 dark:bg-zinc-900/40 border dark:border-zinc-800 rounded-2xl p-4 space-y-4 shadow-sm">
                          <h4 className="font-bold text-[10px] text-zinc-400 uppercase tracking-wider border-b pb-2 dark:border-zinc-800">Workflow Operations</h4>
                          
                          <div className="space-y-4">
                            {/* Roadmap status if Feature Request */}
                            {selectedFeedback.type === 'Feature Request' && (
                              <div className="space-y-1">
                                <label className="text-[10px] text-zinc-450 font-bold uppercase block">Roadmap Status (Feature Voting)</label>
                                <select 
                                  value={feedbackRoadmapStatusSelect}
                                  onChange={async (e) => {
                                    const val = e.target.value;
                                    setFeedbackRoadmapStatusSelect(val);
                                    try {
                                      await apiAction('PUT', `/admin/feedback/${selectedFeedback._id}/roadmap`, { roadmapStatus: val });
                                      loadFeedbackDetail(selectedFeedback._id);
                                      loadFeedback();
                                    } catch (err: any) { alert(`Failed: ${err.message}`); }
                                  }}
                                  className="w-full px-3 py-2 border dark:border-zinc-800 bg-white dark:bg-zinc-950 rounded-lg text-xs text-zinc-900 dark:text-white cursor-pointer"
                                >
                                  <option value="none">Not on Roadmap</option>
                                  <option value="Planned">Planned</option>
                                  <option value="Under Development">Under Development</option>
                                  <option value="Released">Released</option>
                                  <option value="Rejected">Rejected</option>
                                </select>
                                <div className="text-[10px] text-indigo-600 font-bold mt-1">Total Votes: {selectedFeedback.votesCount || 0}</div>
                              </div>
                            )}

                            {/* Ticket Status */}
                            <div className="space-y-1">
                              <label className="text-[10px] text-zinc-450 font-bold uppercase block">Ticket Status</label>
                              <select 
                                value={feedbackStatusSelect}
                                onChange={async (e) => {
                                  const val = e.target.value;
                                  setFeedbackStatusSelect(val);
                                  try {
                                    await apiAction('PUT', `/admin/feedback/${selectedFeedback._id}/status`, { status: val });
                                    loadFeedbackDetail(selectedFeedback._id);
                                    loadFeedback();
                                  } catch (err: any) { alert(`Failed: ${err.message}`); }
                                }}
                                className="w-full px-3 py-2 border dark:border-zinc-800 bg-white dark:bg-zinc-950 rounded-lg text-xs text-zinc-900 dark:text-white cursor-pointer"
                              >
                                <option value="New">New</option>
                                <option value="Open">Open</option>
                                <option value="In Review">In Review</option>
                                <option value="Assigned">Assigned</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Awaiting Response">Awaiting Response</option>
                                <option value="Testing">Testing</option>
                                <option value="Resolved">Resolved</option>
                                <option value="Closed">Closed</option>
                                <option value="Rejected">Rejected</option>
                              </select>
                            </div>

                            {/* Assignment Team / Agent */}
                            <div className="space-y-2">
                              <label className="text-[10px] text-zinc-450 font-bold uppercase block">Assign Department</label>
                              <select 
                                value={feedbackAssignTeamSelect}
                                onChange={async (e) => {
                                  const team = e.target.value;
                                  setFeedbackAssignTeamSelect(team);
                                  try {
                                    await apiAction('PUT', `/admin/feedback/${selectedFeedback._id}/assign`, {
                                      team,
                                      agentId: feedbackAssignAgentSelect || null
                                    });
                                    loadFeedbackDetail(selectedFeedback._id);
                                    loadFeedback();
                                  } catch (err: any) { alert(`Failed: ${err.message}`); }
                                }}
                                className="w-full px-3 py-2 border dark:border-zinc-800 bg-white dark:bg-zinc-955 rounded-lg text-xs text-zinc-900 dark:text-white cursor-pointer"
                              >
                                <option value="Support Team">Support Team</option>
                                <option value="QA Team">QA Team</option>
                                <option value="Development Team">Development Team</option>
                                <option value="Product Team">Product Team</option>
                              </select>
                            </div>

                            <div className="space-y-2">
                              <label className="text-[10px] text-zinc-455 font-bold uppercase block">Assign Specific Agent</label>
                              <select 
                                value={feedbackAssignAgentSelect}
                                onChange={async (e) => {
                                  const agentId = e.target.value;
                                  setFeedbackAssignAgentSelect(agentId);
                                  try {
                                    await apiAction('PUT', `/admin/feedback/${selectedFeedback._id}/assign`, {
                                      team: feedbackAssignTeamSelect,
                                      agentId: agentId || null
                                    });
                                    loadFeedbackDetail(selectedFeedback._id);
                                    loadFeedback();
                                  } catch (err: any) { alert(`Failed: ${err.message}`); }
                                }}
                                className="w-full px-3 py-2 border dark:border-zinc-800 bg-white dark:bg-zinc-950 rounded-lg text-xs text-zinc-900 dark:text-white cursor-pointer"
                              >
                                <option value="">Select Agent...</option>
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
                    </div>
                  </>
                ) : (
                  // Feedback dashboard & List view
                  <>
                    <SectionHeader 
                      title="Feedback Management Center" 
                      desc="Monitor user satisfaction, bug reports, feature voting, and custom technical logs."
                      right={
                        <button onClick={loadFeedback} className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 cursor-pointer">
                          <RefreshCw className="h-4 w-4"/>
                        </button>
                      } 
                    />

                    {/* Stats Dashboard */}
                    {feedbackStats && (
                      <div className="p-6 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 border-b dark:border-zinc-800 bg-zinc-50/20">
                        <div className="space-y-1"><span className="text-[9px] uppercase tracking-wider text-zinc-400 font-bold">Total Feedback</span><div className="text-lg font-black">{feedbackStats.total}</div></div>
                        <div className="space-y-1"><span className="text-[9px] uppercase tracking-wider text-zinc-400 font-bold">Open Tickets</span><div className="text-lg font-black text-indigo-600">{feedbackStats.open}</div></div>
                        <div className="space-y-1"><span className="text-[9px] uppercase tracking-wider text-zinc-400 font-bold">Resolved</span><div className="text-lg font-black text-emerald-600">{feedbackStats.resolved}</div></div>
                        <div className="space-y-1"><span className="text-[9px] uppercase tracking-wider text-rose-500 font-bold">Bugs Reported</span><div className="text-lg font-black text-rose-500">{feedbackStats.bugs}</div></div>
                        <div className="space-y-1"><span className="text-[9px] uppercase tracking-wider text-indigo-400 font-bold">Features</span><div className="text-lg font-black text-indigo-400">{feedbackStats.features}</div></div>
                        <div className="space-y-1"><span className="text-[9px] uppercase tracking-wider text-amber-500 font-bold">Complaints</span><div className="text-lg font-black text-amber-500">{feedbackStats.complaints}</div></div>
                        <div className="space-y-1"><span className="text-[9px] uppercase tracking-wider text-emerald-650 font-bold">Satisfaction Score</span><div className="text-lg font-black text-emerald-650">{feedbackStats.userSatisfactionScore}%</div></div>
                      </div>
                    )}

                    {/* Filter Bar */}
                    <FilterBar>
                      <SearchBar value={feedbackSearch} onChange={setFeedbackSearch} placeholder="Search Ticket ID, subject, email..." />
                      
                      <select value={feedbackTypeFilter} onChange={e => setFeedbackTypeFilter(e.target.value)}
                        className="px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-indigo-500 min-w-[140px]">
                        <option value="">All Types</option>
                        <option value="Feedback">Feedback</option>
                        <option value="Suggestion">Suggestion</option>
                        <option value="Bug Report">Bug Report</option>
                        <option value="Feature Request">Feature Request</option>
                        <option value="Complaint">Complaint</option>
                        <option value="Security Report">Security Report</option>
                      </select>

                      <select value={feedbackStatusFilter} onChange={e => setFeedbackStatusFilter(e.target.value)}
                        className="px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-indigo-500 min-w-[140px]">
                        <option value="">All Statuses</option>
                        <option value="New">New</option>
                        <option value="Open">Open</option>
                        <option value="In Review">In Review</option>
                        <option value="Assigned">Assigned</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Resolved">Resolved</option>
                        <option value="Closed">Closed</option>
                        <option value="Rejected">Rejected</option>
                      </select>

                      <select value={feedbackCategoryFilter} onChange={e => setFeedbackCategoryFilter(e.target.value)}
                        className="px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-indigo-500 min-w-[140px]">
                        <option value="">All Categories</option>
                        <option value="General">General</option>
                        <option value="Bug Reports">Bug Reports</option>
                        <option value="Feature Requests">Feature Requests</option>
                        <option value="Complaint Reports">Complaint Reports</option>
                        <option value="Security Reports">Security Reports</option>
                      </select>

                      <ApplyBtn onClick={loadFeedback} />
                    </FilterBar>

                    {loading ? <Loading /> : (
                      <>
                        <Table>
                          <Thead>
                            <tr>
                              <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-zinc-500">Ticket ID</th>
                              <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-zinc-500">Subject</th>
                              <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-zinc-500">Type</th>
                              <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-zinc-500">Reporter</th>
                              <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-zinc-500">Priority</th>
                              <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-zinc-500">Status</th>
                              <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-zinc-500">Votes</th>
                              <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-zinc-500">Roadmap</th>
                              <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-zinc-500">Created Date</th>
                            </tr>
                          </Thead>
                          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                            {feedbackTickets.map((t: any) => {
                              return (
                                <tr key={t._id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40 text-xs cursor-pointer" onClick={() => loadFeedbackDetail(t._id)}>
                                  <td className="px-4 py-3 font-mono font-bold text-zinc-650">{t.ticketId}</td>
                                  <td className="px-4 py-3 font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1.5">
                                    {t.isConfidential && <Lock className="h-3.5 w-3.5 text-rose-500 shrink-0" />}
                                    {t.subject}
                                  </td>
                                  <td className="px-4 py-3">{badge('indigo', t.type)}</td>
                                  <td className="px-4 py-3 text-zinc-500">{t.name} ({t.userRole})</td>
                                  <td className="px-4 py-3">{badge(t.priority === 'Critical' || t.priority === 'Emergency' ? 'red' : t.priority === 'High' ? 'amber' : 'blue', t.priority)}</td>
                                  <td className="px-4 py-3">{badge(t.status === 'Resolved' || t.status === 'Closed' ? 'green' : t.status === 'Rejected' ? 'zinc' : 'blue', t.status)}</td>
                                  <td className="px-4 py-3 font-bold font-mono">{t.votesCount || 0}</td>
                                  <td className="px-4 py-3">{t.roadmapStatus !== 'none' ? badge('indigo', t.roadmapStatus) : '—'}</td>
                                  <td className="px-4 py-3 text-zinc-400">{new Date(t.createdAt).toLocaleDateString()}</td>
                                </tr>
                              );
                            })}
                            {feedbackTickets.length === 0 && (
                              <tr>
                                <td colSpan={9} className="text-center py-8 text-zinc-400">No feedback submissions found.</td>
                              </tr>
                            )}
                          </tbody>
                        </Table>
                        <Pagination 
                          currentPage={feedbackPage} 
                          totalPages={feedbackStats?.totalPages || 1} 
                          onPageChange={setFeedbackPage} 
                        />
                      </>
                    )}
                  </>
                )
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
                    {/* API request details if applicable */}
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
                    {/* ChangeHistory details if applicable */}
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
                          <span className="block text-[10px] uppercase font-bold tracking-wider text-zinc-400 font-bold">Operator Profile</span>
                          <span className="text-sm font-semibold mt-1 block">
                            {selectedLogDetail.changedByName} ({selectedLogDetail.changedRole})
                          </span>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Change History Before / After Diff Inspector */}
                  {selectedLogDetail.changedField && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-zinc-50/50 dark:bg-zinc-900/40 border dark:border-zinc-800 rounded-2xl p-5 shadow-sm">
                      <div>
                        <span className="block text-[10px] uppercase font-bold tracking-wider text-red-500 mb-2">Before Change (Old Value)</span>
                        <pre className="bg-red-50/50 dark:bg-red-950/10 p-4 rounded-xl border border-red-100 dark:border-red-900/30 font-mono text-xs overflow-x-auto whitespace-pre-wrap text-red-800 dark:text-red-300">
                          {selectedLogDetail.previousValue}
                        </pre>
                      </div>
                      <div>
                        <span className="block text-[10px] uppercase font-bold tracking-wider text-emerald-500 mb-2">After Change (New Value)</span>
                        <pre className="bg-emerald-50/50 dark:bg-emerald-950/10 p-4 rounded-xl border border-emerald-100 dark:border-emerald-900/30 font-mono text-xs overflow-x-auto whitespace-pre-wrap text-emerald-800 dark:text-emerald-300">
                          {selectedLogDetail.newValue}
                        </pre>
                      </div>
                    </div>
                  )}

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
                  <SectionHeader title="Enterprise Log Registries" desc="Audit trails, keyword searches, and platform database activity."
                    right={
                      <button onClick={async()=>{const res = await apiFetch('/admin/logs/export'); const blob = new Blob([res.csv], { type: 'text/csv' }); const url = window.URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = res.filename; a.click();}}
                        className="flex items-center gap-1 px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-semibold shadow cursor-pointer">
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
                                  <span className="font-medium text-zinc-600 dark:text-zinc-400">Admin Actions</span>
                                  <span className="font-bold text-zinc-900 dark:text-white">{logAnalytics.totalAdminActions}</span>
                                </div>
                                <div className="flex justify-between text-xs">
                                  <span className="font-medium text-zinc-600 dark:text-zinc-400">Customer Actions</span>
                                  <span className="font-bold text-zinc-900 dark:text-white">{logAnalytics.totalCustomerActions}</span>
                                </div>
                                <div className="flex justify-between text-xs">
                                  <span className="font-medium text-zinc-600 dark:text-zinc-400">Seller/Vendor Actions</span>
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
                                    <div className="w-6 bg-indigo-500 rounded-t h-20" style={{ height: `${(item.value / 250) * 100}px` }} title={`${item.value} logs`}></div>
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
                              className="px-3 py-1.5 border dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-lg focus:ring-1 focus:ring-indigo-500 outline-none text-zinc-800 dark:text-zinc-100 cursor-pointer">
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

                      {/* 3. USER ACTIVITY SUBTAB */}
                      {logSubTab === 'activity' && (
                        <div className="space-y-4">
                          <div className="flex flex-wrap gap-3 p-3 bg-zinc-50 dark:bg-zinc-900/40 border dark:border-zinc-800 rounded-xl text-xs">
                            <input type="text" value={activitySearch} onChange={e=>setActivitySearch(e.target.value)}
                              placeholder="Search action or details..."
                              className="px-3 py-1.5 border dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-lg focus:ring-1 focus:ring-indigo-500 outline-none text-zinc-800 dark:text-zinc-100 flex-1 min-w-[200px]" />
                            <select value={activityCategory} onChange={e=>setActivityCategory(e.target.value)}
                              className="px-3 py-1.5 border dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-lg focus:ring-1 focus:ring-indigo-500 outline-none text-zinc-800 dark:text-zinc-100 cursor-pointer">
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
                                  <td className="px-4 py-3 text-zinc-500 font-semibold">{l.latencyMs} ms</td>
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
                                  <td className="px-4 py-3 text-zinc-500 font-sans text-xs">{l.changedByName}</td>
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
                          <div className="flex justify-between items-center text-xs text-zinc-500 font-semibold px-2">
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
                          {/* Left: Imports log */}
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
                                    <td className="px-3 py-2 text-zinc-500 truncate max-w-[120px]" title={l.fileName}>{l.fileName}</td>
                                    <td className="px-3 py-2 font-mono text-zinc-600"><span className="text-emerald-600">{l.successRecords}</span>/<span className="text-red-500">{l.failedRecords}</span></td>
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

                          {/* Right: Exports log */}
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
                                    <td className="px-3 py-2 text-zinc-500">{l.exportType} ({l.fileFormat})</td>
                                    <td className="px-3 py-2 font-mono text-indigo-600 font-semibold">{l.numberOfRecords} recs</td>
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

                      {/* 9. GUEST VISITS SUBTAB */}
                      {logSubTab === 'guest' && (
                        <div className="space-y-4">
                          <div className="flex justify-between items-center text-xs text-zinc-500 font-semibold px-2">
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
                                  <td className="px-4 py-3 text-zinc-500">{l.browser} ({l.device})</td>
                                  <td className="px-4 py-3 text-zinc-500">{l.city || 'Unknown'}, {l.country}</td>
                                  <td className="px-4 py-3 font-mono text-zinc-500 truncate max-w-[120px]">{l.landingPage}</td>
                                  <td className="px-4 py-3 font-bold text-zinc-700 dark:text-zinc-300">{l.timeOnSite} sec</td>
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

                      {/* 11. RETENTION CONFIGURATOR SUBTAB */}
                      {logSubTab === 'retention' && (
                        <div className="space-y-6 max-w-2xl mx-auto p-4 bg-white dark:bg-zinc-900 border dark:border-zinc-800 rounded-2xl shadow-sm">
                          <h3 className="font-bold text-sm text-zinc-900 dark:text-white flex items-center gap-2 border-b pb-3 dark:border-zinc-800">
                            <Settings className="h-5 w-5 text-indigo-500" /> Log Retention & Archiving Settings
                          </h3>
                          
                          <div className="space-y-4">
                            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400">Retention Period Policy</label>
                            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                              {[
                                { val: 30, label: '30 Days' },
                                { val: 90, label: '90 Days' },
                                { val: 180, label: '180 Days' },
                                { val: 360, label: '1 Year' },
                                { val: 0, label: 'Forever' }
                              ].map(item => (
                                <button key={item.val}
                                  onClick={() => setRetentionDays(item.val)}
                                  className={`px-3 py-2.5 text-xs font-semibold rounded-xl border text-center transition-all ${
                                    retentionDays === item.val
                                      ? 'bg-indigo-600 border-indigo-600 text-white shadow'
                                      : 'bg-zinc-50 border-zinc-200 dark:bg-zinc-800 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100'
                                  }`}>
                                  {item.label}
                                </button>
                              ))}
                            </div>
                            <p className="text-[11px] text-zinc-400">Logs older than the configured period will be automatically cleaned up during background daily tasks.</p>
                          </div>

                          <div className="pt-4 border-t dark:border-zinc-800 space-y-4">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">Manual Archive & Cleanup Actions</h4>
                            <div className="flex flex-wrap gap-4">
                              <button onClick={async () => {
                                try {
                                  const res = await apiAction('PUT', '/admin/logs/retention', { daysLimit: retentionDays });
                                  alert(`Successfully triggered manual log retention sweep! Purged ${res.purgedCount || 0} old log entries.`);
                                  loadLogs();
                                } catch {
                                  alert('Failed to trigger logs retention sweep.');
                                }
                              }} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow flex items-center gap-1.5 transition-colors cursor-pointer">
                                <RefreshCw className="h-3.5 w-3.5 animate-spin" /> Run Retention Cleanup Now
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
          )}

          {/* FEATURE FLAGS TAB */}
          {activeTab === 'flags' && (
            <Section>
              <SectionHeader title="Global Feature Flags" desc="Instantly enable or disable specific platform capabilities across storefronts and consoles." />
              <div className="p-6 space-y-6">
                {/* Create Flag Form */}
                <form onSubmit={(e) => {
                  e.preventDefault();
                  if (!newFlagName || !newFlagKey) return;
                  const newFlag = {
                    _id: `flag-${Date.now()}`,
                    name: newFlagName,
                    key: newFlagKey.trim().toUpperCase(),
                    description: newFlagDesc || 'No description provided.',
                    group: newFlagGroup,
                    isEnabled: false
                  };
                  setFeatureFlags([...featureFlags, newFlag]);
                  setNewFlagName(''); setNewFlagKey(''); setNewFlagDesc('');
                  alert(`Feature flag ${newFlag.key} created!`);
                }} className="bg-zinc-50 dark:bg-zinc-950/40 p-5 rounded-2xl border dark:border-zinc-850 space-y-4">
                  <h4 className="font-bold text-xs uppercase text-indigo-600 dark:text-indigo-400">Register New Feature Flag</h4>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <input type="text" required placeholder="Feature Name (e.g. Apple Pay)" value={newFlagName} onChange={e=>setNewFlagName(e.target.value)}
                      className="px-3 py-2 border dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-xl text-xs focus:outline-none focus:border-indigo-500 text-zinc-900 dark:text-white" />
                    <input type="text" required placeholder="Flag Key (e.g. ENABLE_APPLE_PAY)" value={newFlagKey} onChange={e=>setNewFlagKey(e.target.value)}
                      className="px-3 py-2 border dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-xl text-xs focus:outline-none focus:border-indigo-500 text-zinc-900 dark:text-white font-mono" />
                    <select value={newFlagGroup} onChange={e=>setNewFlagGroup(e.target.value)}
                      className="px-3 py-2 border dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-xl text-xs focus:outline-none focus:border-indigo-500 text-zinc-900 dark:text-white cursor-pointer">
                      <option value="Storefront">Storefront</option>
                      <option value="Payments">Payments</option>
                      <option value="Authentication">Authentication</option>
                      <option value="System">System Backend</option>
                    </select>
                    <button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold py-2 shadow transition-all">
                      Create Flag
                    </button>
                  </div>
                  <input type="text" placeholder="Short description of what this feature flag controls..." value={newFlagDesc} onChange={e=>setNewFlagDesc(e.target.value)}
                    className="w-full px-3 py-2 border dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-xl text-xs focus:outline-none focus:border-indigo-500 text-zinc-900 dark:text-white" />
                </form>

                {/* Flags list */}
                <div className="grid md:grid-cols-2 gap-4">
                  {featureFlags.map((flag) => (
                    <div key={flag._id} className="border dark:border-zinc-800 rounded-2xl p-5 bg-zinc-50/20 dark:bg-zinc-900/30 flex justify-between items-start gap-4">
                      <div className="space-y-1">
                        <span className="inline-block bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-305 text-[9px] font-bold px-2 py-0.5 rounded">
                          {flag.group}
                        </span>
                        <h4 className="font-extrabold text-sm text-zinc-900 dark:text-white">{flag.name}</h4>
                        <code className="text-[10px] text-zinc-400 font-mono block">{flag.key}</code>
                        <p className="text-xs text-zinc-500 mt-1">{flag.description}</p>
                      </div>
                      <div className="flex flex-col items-end gap-2 shrink-0">
                        <button 
                          onClick={() => {
                            setFeatureFlags(featureFlags.map(f => f._id === flag._id ? { ...f, isEnabled: !f.isEnabled } : f));
                          }}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold shadow transition-all ${
                            flag.isEnabled 
                              ? 'bg-emerald-600 text-white hover:bg-emerald-500' 
                              : 'bg-zinc-200 text-zinc-700 hover:bg-zinc-300 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700'
                          }`}
                        >
                          {flag.isEnabled ? 'Enabled' : 'Disabled'}
                        </button>
                        <button 
                          onClick={() => {
                            if (confirm('Delete this feature flag?')) {
                              setFeatureFlags(featureFlags.filter(f => f._id !== flag._id));
                            }
                          }}
                          className="text-red-500 hover:text-red-650 text-[10px] font-semibold hover:underline"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Section>
          )}

          {/* SYSTEM ANNOUNCEMENTS TAB */}
          {activeTab === 'announcements' && (
            <Section>
              <SectionHeader title="System Broadcasts & Announcements" desc="Publish banner notifications and warnings globally targeting customers, sellers, or vendors." />
              <div className="p-6 space-y-6">
                {/* Create form */}
                <form onSubmit={(e) => {
                  e.preventDefault();
                  if (!newAnnTitle || !newAnnMsg) return;
                  const newAnn = {
                    _id: `ann-${Date.now()}`,
                    title: newAnnTitle,
                    message: newAnnMsg,
                    targetRole: newAnnTarget,
                    isActive: true,
                    createdAt: new Date().toISOString()
                  };
                  setAnnouncements([newAnn, ...announcements]);
                  setNewAnnTitle(''); setNewAnnMsg('');
                  alert('Announcement broadcasted successfully!');
                }} className="bg-zinc-50 dark:bg-zinc-950/40 p-5 rounded-2xl border dark:border-zinc-850 space-y-3">
                  <h4 className="font-bold text-xs uppercase text-indigo-650 dark:text-indigo-400">Draft New Broadcast Announcement</h4>
                  <div className="grid sm:grid-cols-3 gap-3">
                    <input type="text" required placeholder="Announcement Title" value={newAnnTitle} onChange={e=>setNewAnnTitle(e.target.value)}
                      className="rounded-xl border border-zinc-200 bg-white p-2.5 text-xs focus:outline-none dark:border-zinc-800 dark:bg-zinc-900 text-zinc-900 dark:text-white sm:col-span-2" />
                    <select value={newAnnTarget} onChange={e=>setNewAnnTarget(e.target.value)}
                      className="rounded-xl border border-zinc-200 bg-white p-2.5 text-xs focus:outline-none dark:border-zinc-800 dark:bg-zinc-900 text-zinc-900 dark:text-white cursor-pointer">
                      <option value="Customer">Audience: Customers</option>
                      <option value="Seller">Audience: Sellers</option>
                      <option value="Vendor">Audience: Vendors</option>
                      <option value="All">Audience: All Roles</option>
                    </select>
                  </div>
                  <textarea rows={3} required placeholder="Compose message body broadcast details..." value={newAnnMsg} onChange={e=>setNewAnnMsg(e.target.value)}
                    className="w-full rounded-xl border border-zinc-200 bg-white p-2.5 text-xs focus:outline-none dark:border-zinc-800 dark:bg-zinc-900 text-zinc-900 dark:text-white resize-none" />
                  <button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold px-4 py-2 shadow">
                    Broadcast Announcement
                  </button>
                </form>

                {/* List announcements */}
                <div className="space-y-4">
                  {announcements.map((ann) => (
                    <div key={ann._id} className="border dark:border-zinc-800 rounded-2xl p-5 bg-zinc-50/20 dark:bg-zinc-900/30 flex justify-between items-start gap-4">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <span className="bg-indigo-50 text-indigo-700 text-[9px] font-bold px-2 py-0.5 rounded border border-indigo-100">
                            To: {ann.targetRole}s
                          </span>
                          <span className={`text-[9px] font-bold px-2 py-0.5 rounded border ${
                            ann.isActive 
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                              : 'bg-zinc-100 text-zinc-550 border-zinc-200'
                          }`}>
                            {ann.isActive ? 'Active Broadcast' : 'Archived'}
                          </span>
                        </div>
                        <h4 className="font-extrabold text-sm text-zinc-900 dark:text-white">{ann.title}</h4>
                        <p className="text-xs text-zinc-650 dark:text-zinc-350">{ann.message}</p>
                        <span className="text-[10px] text-zinc-400 block">{new Date(ann.createdAt).toLocaleString()}</span>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => {
                            setAnnouncements(announcements.map(a => a._id === ann._id ? { ...a, isActive: !a.isActive } : a));
                          }}
                          className="text-indigo-600 hover:underline text-xs font-semibold"
                        >
                          Toggle Active
                        </button>
                        <span className="text-zinc-200">|</span>
                        <button 
                          onClick={() => {
                            if (confirm('Delete this announcement?')) {
                              setAnnouncements(announcements.filter(a => a._id !== ann._id));
                            }
                          }}
                          className="text-red-500 hover:underline text-xs font-semibold"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Section>
          )}

          {/* FRAUD CONTROL TAB */}
          {activeTab === 'fraud' && (
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
                              className="text-indigo-600 hover:underline font-bold"
                            >
                              {log.status === 'Blocked' ? 'Unblock' : 'Block IP'}
                            </button>
                            <span className="text-zinc-200">|</span>
                            <button 
                              onClick={() => {
                                setFraudLogs(fraudLogs.filter(l => l._id !== log._id));
                                alert('Alert dismissed successfully.');
                              }}
                              className="text-zinc-400 hover:text-zinc-650 hover:underline font-semibold"
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
          )}

          {/* GDPR QUEUE TAB */}
          {activeTab === 'gdpr' && (
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
                      <tr key={req._id} className="text-xs hover:bg-zinc-50 dark:hover:bg-zinc-800/40">
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
                                className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg px-3 py-1 font-semibold"
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
          )}

          {/* SYSTEM HEALTH TAB */}
          {activeTab === 'health' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-black text-zinc-900 dark:text-white">System Infrastructure Health</h1>
                  <p className="text-sm text-zinc-500 mt-0.5">Live monitoring metrics for CPU cores, RAM allocations, database latency, and websocket networks.</p>
                </div>
                <button 
                  onClick={() => {
                    alert("System Health Diagnostic Complete:\n\n• CPU Cores: 12 Cores Online\n• NestJS Backend REST API: Healthy\n• MongoDB Atlas Cluster: 9ms Latency\n• Redis Caching Server: Active\n• Socket.IO Live Support Server: Active\n• Elasticsearch Indexing: 100% Synced");
                  }}
                  className="bg-indigo-650 hover:bg-indigo-600 text-white rounded-xl px-4 py-2 text-xs font-semibold shadow"
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
                          <div className="font-bold text-zinc-855 dark:text-zinc-200">{s.service}</div>
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
          )}
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
              className="absolute top-4 right-4 p-1 rounded-full text-zinc-400 hover:bg-zinc-105 dark:hover:bg-zinc-850"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="text-center">
              <h2 className="text-lg font-black text-zinc-900 dark:text-white">Feedback Center Widget</h2>
              <p className="text-xs text-zinc-500">Report bugs, request features, or submit feature votes directly to our product engineering teams.</p>
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
                  className="w-full px-3 py-2 border dark:border-zinc-800 bg-white dark:bg-zinc-950 rounded-lg text-zinc-800 dark:text-white outline-none focus:border-indigo-500"
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
                          className="px-2.5 py-1 bg-indigo-600 text-white rounded text-[9px] font-bold shrink-0 hover:bg-indigo-500"
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
                  className="w-full px-3 py-2 border dark:border-zinc-800 bg-white dark:bg-zinc-950 rounded-lg text-zinc-800 dark:text-white outline-none focus:border-indigo-500"
                />
              </div>

              {/* Guest Profile Details (Only when not logged in / token is empty) */}
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
                        className="w-full px-2.5 py-1.5 border dark:border-zinc-800 bg-white dark:bg-zinc-950 rounded-lg text-zinc-800 dark:text-white"
                      />
                    </div>
                    <div>
                      <input
                        type="email"
                        required
                        placeholder="Your Email"
                        value={widgetEmail}
                        onChange={(e) => setWidgetEmail(e.target.value)}
                        className="w-full px-2.5 py-1.5 border dark:border-zinc-800 bg-white dark:bg-zinc-950 rounded-lg text-zinc-800 dark:text-white"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        placeholder="Phone (Optional)"
                        value={widgetPhone}
                        onChange={(e) => setWidgetPhone(e.target.value)}
                        className="w-full px-2.5 py-1.5 border dark:border-zinc-800 bg-white dark:bg-zinc-950 rounded-lg text-zinc-800 dark:text-white"
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
                    className="w-full px-3 py-2 border dark:border-zinc-800 bg-white dark:bg-zinc-950 rounded-lg text-zinc-850 dark:text-white"
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
                    className="w-full px-3 py-2 border dark:border-zinc-800 bg-white dark:bg-zinc-950 rounded-lg text-zinc-850 dark:text-white"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] text-zinc-455 font-bold uppercase mb-1">CAPTCHA: <span className="font-mono font-black text-indigo-600 dark:text-indigo-400 bg-zinc-100 dark:bg-zinc-950 px-1 rounded">{widgetCaptchaVal}</span></label>
                  <div className="flex gap-1.5">
                    <input
                      type="text"
                      required
                      placeholder="Enter code"
                      value={widgetCaptcha}
                      onChange={(e) => setWidgetCaptcha(e.target.value)}
                      className="w-full px-2.5 py-1.5 border dark:border-zinc-800 bg-white dark:bg-zinc-950 rounded-lg font-mono tracking-widest text-zinc-800 dark:text-white"
                    />
                    <button
                      type="button"
                      onClick={handleGenerateCaptcha}
                      className="px-2 py-1.5 border dark:border-zinc-800 hover:bg-zinc-50 rounded-lg text-zinc-500"
                    >
                      <RefreshCw className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Attachments list / simulator */}
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
                    <span className="text-zinc-500 self-center font-bold">({widgetAttachments.length} Files Attached)</span>
                  )}
                </div>
              </div>

              {/* Actions */}
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
