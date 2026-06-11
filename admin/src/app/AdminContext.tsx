'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter, usePathname } from 'next/navigation';

const API = 'http://localhost:5001/api/v1';

function authHeaders(token: string) {
  return { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };
}

interface AdminContextType {
  API: string;
  mounted: boolean;
  theme: 'light' | 'dark';
  token: string;
  adminEmail: string;
  loginEmail: string;
  loginPassword: string;
  loginError: string;
  loading: boolean;
  apiError: string;
  
  setToken: (t: string) => void;
  setAdminEmail: (e: string) => void;
  setLoginEmail: (e: string) => void;
  setLoginPassword: (p: string) => void;
  setLoginError: (e: string) => void;
  setApiError: (e: string) => void;
  toggleTheme: () => void;
  logout: () => void;
  handleLogin: (e: React.FormEvent) => Promise<void>;
  
  apiFetch: (path: string) => Promise<any>;
  apiAction: (method: string, path: string, body?: any) => Promise<any>;
  
  // Data States
  stats: any;
  users: any[];
  orders: any[];
  products: any[];
  vendors: any[];
  reviews: any[];
  coupons: any[];
  adminProfile: any;
  adminSessions: any[];
  tickets: any[];
  agentsList: any[];
  blogs: any[];
  featureFlags: any[];
  announcements: any[];
  fraudLogs: any[];
  gdprRequests: any[];
  healthMetrics: any;
  rolesMatrix: any;

  // Setters
  setStats: React.Dispatch<React.SetStateAction<any>>;
  setUsers: React.Dispatch<React.SetStateAction<any[]>>;
  setOrders: React.Dispatch<React.SetStateAction<any[]>>;
  setProducts: React.Dispatch<React.SetStateAction<any[]>>;
  setVendors: React.Dispatch<React.SetStateAction<any[]>>;
  setBlogs: React.Dispatch<React.SetStateAction<any[]>>;
  setFeatureFlags: React.Dispatch<React.SetStateAction<any[]>>;
  setAnnouncements: React.Dispatch<React.SetStateAction<any[]>>;
  setFraudLogs: React.Dispatch<React.SetStateAction<any[]>>;
  setGdprRequests: React.Dispatch<React.SetStateAction<any[]>>;
  setRolesMatrix: React.Dispatch<React.SetStateAction<any>>;
  setTickets: React.Dispatch<React.SetStateAction<any[]>>;

  // Loaders
  loadStats: () => Promise<void>;
  loadUsers: () => Promise<void>;
  loadOrders: () => Promise<void>;
  loadProducts: () => Promise<void>;
  loadVendors: () => Promise<void>;
  loadAdminProfile: () => Promise<void>;
  loadSystemSettings: (cat: string) => Promise<void>;
  loadLogs: () => Promise<void>;
  loadTickets: () => Promise<void>;
  loadFeedback: () => Promise<void>;
  loadFeedbackDetail: (id: string) => Promise<void>;
  loadBlogs: () => Promise<void>;

  // Selection Drawer States
  selectedUser: any | null;
  setSelectedUser: (u: any | null) => void;
  selectedSeller: any | null;
  setSelectedSeller: (s: any | null) => void;
  selectedVendor: any | null;
  setSelectedVendor: (v: any | null) => void;
  selectedOrder: any | null;
  setSelectedOrder: (o: any | null) => void;
  selectedProduct: any | null;
  setSelectedProduct: (p: any | null) => void;
  selectedTicket: any | null;
  setSelectedTicket: (t: any | null) => void;
  selectedFeedback: any | null;
  setSelectedFeedback: (f: any | null) => void;
  selectedLogDetail: any | null;
  setSelectedLogDetail: (l: any | null) => void;
  selectedChatLog: any | null;
  setSelectedChatLog: (c: any | null) => void;

  // Input states & UI controls
  userSearch: string;
  setUserSearch: (s: string) => void;
  userRole: string;
  setUserRole: (r: string) => void;
  userStatus: string;
  setUserStatus: (s: string) => void;
  userSortField: string;
  setUserSortField: (f: string) => void;
  userSortOrder: 'asc' | 'desc';
  setUserSortOrder: (o: 'asc' | 'desc') => void;
  userPage: number;
  setUserPage: (p: number) => void;

  orderSearch: string;
  setOrderSearch: (s: string) => void;
  orderStatus: string;
  setOrderStatus: (s: string) => void;
  orderSortField: string;
  setOrderSortField: (f: string) => void;
  orderSortOrder: 'asc' | 'desc';
  setOrderSortOrder: (o: 'asc' | 'desc') => void;
  orderPage: number;
  setOrderPage: (p: number) => void;

  productSearch: string;
  setProductSearch: (s: string) => void;
  productSortField: string;
  setProductSortField: (f: string) => void;
  productSortOrder: 'asc' | 'desc';
  setProductSortOrder: (o: 'asc' | 'desc') => void;
  productPage: number;
  setProductPage: (p: number) => void;

  vendorSearch: string;
  setVendorSearch: (s: string) => void;
  vendorStatus: string;
  setVendorStatus: (s: string) => void;
  vendorType: string;
  setVendorType: (t: string) => void;
  vendorSortField: string;
  setVendorSortField: (f: string) => void;
  vendorSortOrder: 'asc' | 'desc';
  setVendorSortOrder: (o: 'asc' | 'desc') => void;
  vendorPage: number;
  setVendorPage: (p: number) => void;

  ticketSearch: string;
  setTicketSearch: (s: string) => void;
  ticketStatusFilter: string;
  setTicketStatusFilter: (s: string) => void;
  ticketPage: number;
  setTicketPage: (p: number) => void;

  // Log sub-tabs states
  logSubTab: 'audit' | 'search' | 'activity' | 'chatbot' | 'api' | 'security' | 'importexport' | 'guest' | 'changehistory' | 'analytics' | 'retention';
  setLogSubTab: (t: any) => void;
  auditLogs: any[];
  searchLogs: any[];
  activityLogs: any[];
  chatbotLogs: any[];
  apiLogs: any[];
  securityLogs: any[];
  importLogs: any[];
  exportLogs: any[];
  guestLogs: any[];
  changeHistoryLogs: any[];
  logAnalytics: any;
  retentionDays: number;
  setRetentionDays: (d: number) => void;

  // Log Pagination states
  auditPage: number;
  setAuditPage: (p: number) => void;
  searchPage: number;
  setSearchPage: (p: number) => void;
  activityPage: number;
  setActivityPage: (p: number) => void;
  chatbotPage: number;
  setChatbotPage: (p: number) => void;
  apiPage: number;
  setApiPage: (p: number) => void;
  securityPage: number;
  setSecurityPage: (p: number) => void;
  importPage: number;
  setImportPage: (p: number) => void;
  exportPage: number;
  setExportPage: (p: number) => void;
  guestPage: number;
  setGuestPage: (p: number) => void;
  changeHistoryPage: number;
  setChangeHistoryPage: (p: number) => void;

  // Log Search / Filters
  auditSearch: string;
  setAuditSearch: (s: string) => void;
  auditRole: string;
  setAuditRole: (r: string) => void;
  auditSortField: string;
  setAuditSortField: (f: string) => void;
  auditSortOrder: 'asc' | 'desc';
  setAuditSortOrder: (o: 'asc' | 'desc') => void;

  searchQuery: string;
  setSearchQuery: (q: string) => void;
  searchRole: string;
  setSearchRole: (r: string) => void;
  searchSource: string;
  setSearchSource: (s: string) => void;
  searchSortField: string;
  setSearchSortField: (f: string) => void;
  searchSortOrder: 'asc' | 'desc';
  setSearchSortOrder: (o: 'asc' | 'desc') => void;

  activitySearch: string;
  setActivitySearch: (s: string) => void;
  activityCategory: string;
  setActivityCategory: (c: string) => void;
  activitySortField: string;
  setActivitySortField: (f: string) => void;
  activitySortOrder: 'asc' | 'desc';
  setActivitySortOrder: (o: 'asc' | 'desc') => void;

  chatSearch: string;
  setChatSearch: (s: string) => void;
  chatFilterType: string;
  setChatFilterType: (t: string) => void;
  chatMinMsgs: number;
  setChatMinMsgs: (n: number) => void;
  chatShowOnlyFallbacks: boolean;
  setChatShowOnlyFallbacks: (b: boolean) => void;
  chatSortField: string;
  setChatSortField: (f: string) => void;
  chatSortOrder: 'asc' | 'desc';
  setChatSortOrder: (o: 'asc' | 'desc') => void;

  // Feedback States
  supportSubTab: 'tickets' | 'feedback';
  setSupportSubTab: (t: any) => void;
  feedbackTickets: any[];
  feedbackStats: any;
  feedbackComments: any[];
  feedbackAttachments: any[];
  feedbackActivities: any[];
  feedbackSearch: string;
  setFeedbackSearch: (s: string) => void;
  feedbackTypeFilter: string;
  setFeedbackTypeFilter: (t: string) => void;
  feedbackStatusFilter: string;
  setFeedbackStatusFilter: (s: string) => void;
  feedbackCategoryFilter: string;
  setFeedbackCategoryFilter: (c: string) => void;
  feedbackPage: number;
  setFeedbackPage: (p: number) => void;
  feedbackSortField: string;
  setFeedbackSortField: (f: string) => void;
  feedbackSortOrder: 'asc' | 'desc';
  setFeedbackSortOrder: (o: 'asc' | 'desc') => void;
  feedbackReplyText: string;
  setFeedbackReplyText: (t: string) => void;
  feedbackIsPrivateNote: boolean;
  setFeedbackIsPrivateNote: (b: boolean) => void;
  feedbackRoadmapStatusSelect: string;
  setFeedbackRoadmapStatusSelect: (s: string) => void;
  feedbackStatusSelect: string;
  setFeedbackStatusSelect: (s: string) => void;
  feedbackAssignTeamSelect: string;
  setFeedbackAssignTeamSelect: (t: string) => void;
  feedbackAssignAgentSelect: string;
  setFeedbackAssignAgentSelect: (a: string) => void;

  // System settings state
  settingTab: string;
  setSettingTab: (t: string) => void;
  generalSettings: any;
  setGeneralSettings: (s: any) => void;
  emailSettings: any;
  setEmailSettings: (s: any) => void;
  smsSettings: any;
  setSmsSettings: (s: any) => void;
  storageSettings: any;
  setStorageSettings: (s: any) => void;
  apiSettings: any;
  setApiSettings: (s: any) => void;

  // Custom Detail/Form states
  sellerCommission: number;
  setSellerCommission: (c: number) => void;
  editCompanyLegalName: string;
  setEditCompanyLegalName: (n: string) => void;
  editBusinessPhone: string;
  setEditBusinessPhone: (p: string) => void;
  orderTrackingCode: string;
  setOrderTrackingCode: (c: string) => void;
  orderStatusSelect: string;
  setOrderStatusSelect: (s: string) => void;
  activeProductImageIndex: number;
  setActiveProductImageIndex: (i: number) => void;
  ticketReplyText: string;
  setTicketReplyText: (t: string) => void;
  ticketStatusSelect: string;
  setTicketStatusSelect: (s: string) => void;
  ticketAgentSelect: string;
  setTicketAgentSelect: (a: string) => void;

  // Floating widget states
  showFloatingWidget: boolean;
  setShowFloatingWidget: (b: boolean) => void;
  widgetType: string;
  setWidgetType: (t: string) => void;
  widgetCategory: string;
  setWidgetCategory: (c: string) => void;
  widgetSubject: string;
  setWidgetSubject: (s: string) => void;
  widgetDescription: string;
  setWidgetDescription: (d: string) => void;
  widgetName: string;
  setWidgetName: (n: string) => void;
  widgetEmail: string;
  setWidgetEmail: (e: string) => void;
  widgetPhone: string;
  setWidgetPhone: (p: string) => void;
  widgetPriority: string;
  setWidgetPriority: (p: string) => void;
  widgetSeverity: string;
  setWidgetSeverity: (s: string) => void;
  widgetCaptcha: string;
  setWidgetCaptcha: (c: string) => void;
  widgetCaptchaVal: string;
  setWidgetCaptchaVal: (c: string) => void;
  widgetAttachments: any[];
  setWidgetAttachments: (a: any[]) => void;
  duplicateSuggestions: any[];
  setDuplicateSuggestions: (s: any[]) => void;
  handleVoteSuggestion: (id: string) => Promise<void>;
  handleWidgetSubmit: (e: React.FormEvent) => Promise<void>;
  handleGenerateCaptcha: () => void;

  // Filters computed
  filteredUsers: any[];
  filteredOrders: any[];
  filteredProducts: any[];
  filteredVendors: any[];
  filteredAudits: any[];
  filteredSearches: any[];
  filteredActivities: any[];
  filteredSessions: any[];
  
  paginatedUsers: any[];
  paginatedOrders: any[];
  paginatedProducts: any[];
  paginatedVendors: any[];
  paginatedAudits: any[];
  paginatedSearches: any[];
  paginatedActivities: any[];
  paginatedSessions: any[];
  paginatedApis: any[];
  paginatedSecurities: any[];
  paginatedImports: any[];
  paginatedExports: any[];
  paginatedGuests: any[];
  paginatedChangeHistories: any[];

  totalUserPages: number;
  totalOrderPages: number;
  totalProductPages: number;
  totalVendorPages: number;
  totalAuditPages: number;
  totalSearchPages: number;
  totalActivityPages: number;
  totalChatbotPages: number;
  totalApiPages: number;
  totalSecurityPages: number;
  totalImportPages: number;
  totalExportPages: number;
  totalGuestPages: number;
  totalChangeHistoryPages: number;

  limit: number;
  blogSearch: string;
  setBlogSearch: (s: string) => void;
  blogsFiltered: any[];

  // Modal CMS Blog states
  selectedBlog: any | null;
  setSelectedBlog: (b: any | null) => void;
  blogTitle: string;
  setBlogTitle: (t: string) => void;
  blogSlug: string;
  setBlogSlug: (s: string) => void;
  blogContent: string;
  setBlogContent: (c: string) => void;
  blogTags: string;
  setBlogTags: (t: string) => void;
  blogStatus: string;
  setBlogStatus: (s: string) => void;
  blogFeaturedImage: string;
  setBlogFeaturedImage: (i: string) => void;
  showBlogModal: boolean;
  setShowBlogModal: (b: boolean) => void;

  // Export helpers
  handleExportCustomers: () => Promise<void>;
  handleUpdateSettings: (e: React.FormEvent) => Promise<void>;
  toggleMatrixPermission: (role: string, permission: string) => void;
  breadcrumbs: { label: string; onClick?: () => void }[];
  activeTab: string;
  setActiveTab: (t: string) => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [token, setToken] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

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

  // CMS Blog States
  const [blogs, setBlogs] = useState<any[]>([]);
  const [selectedBlog, setSelectedBlog] = useState<any | null>(null);
  const [blogTitle, setBlogTitle] = useState('');
  const [blogSlug, setBlogSlug] = useState('');
  const [blogContent, setBlogContent] = useState('');
  const [blogTags, setBlogTags] = useState('');
  const [blogStatus, setBlogStatus] = useState('Draft');
  const [blogFeaturedImage, setBlogFeaturedImage] = useState('');
  const [showBlogModal, setShowBlogModal] = useState(false);
  const [blogSearch, setBlogSearch] = useState('');

  // Role Permissions matrix state
  const [rolesMatrix, setRolesMatrix] = useState<any>({
    'Super Admin': { dashboard: true, products: true, orders: true, settings: true, logs: true },
    'Admin': { dashboard: true, products: true, orders: true, settings: false, logs: true },
    'Manager': { dashboard: true, products: true, orders: true, settings: false, logs: false },
    'Customer Support': { dashboard: true, products: false, orders: true, settings: false, logs: false },
    'Analytics Viewer': { dashboard: true, products: false, orders: false, settings: false, logs: false },
  });

  // Feature flags state
  const [featureFlags, setFeatureFlags] = useState<any[]>([
    { _id: 'flag-1', name: 'Al Chatbot Assistant', key: 'ENABLE_CHATBOT', description: 'Enable NLP chatbot assistant widget in storefront.', isEnabled: true, group: 'Storefront' },
    { _id: 'flag-2', name: 'Direct Wallet Payouts', key: 'ENABLE_WALLET_WITHDRAWAL', description: 'Allow sellers/vendors to request direct bank deposit settlements.', isEnabled: true, group: 'Payments' },
    { _id: 'flag-3', name: 'SSO Login Integration', key: 'ENABLE_SSO', description: 'Show Google and GitHub quick authentication login buttons.', isEnabled: false, group: 'Authentication' }
  ]);

  // Announcements state
  const [announcements, setAnnouncements] = useState<any[]>([
    { _id: 'ann-1', title: 'Summer Sale Promo Event', message: 'The platform summer sale campaign starts tomorrow! Make sure all items are stocked.', targetRole: 'Customer', isActive: true, createdAt: '2026-06-08T10:00:00.000Z' },
    { _id: 'ann-2', title: 'Scheduled Database Maintenance', message: 'We will be conducting platform DB maintenance on Sunday at 02:00 AM UTC. Expect brief downtime.', targetRole: 'Seller', isActive: true, createdAt: '2026-06-05T08:30:00.000Z' }
  ]);

  // Fraud alerts state
  const [fraudLogs, setFraudLogs] = useState<any[]>([
    { _id: 'frd-1', email: 'spammer_99@example.com', riskScore: 92, reason: 'High-frequency brute-force login attempts (15 failures/min)', ipAddress: '198.51.100.42', status: 'Blocked', createdAt: '2026-06-09T02:15:00.000Z' },
    { _id: 'frd-2', email: 'clara.oswald@example.com', riskScore: 45, reason: 'Cross-device session activity in short interval', ipAddress: '203.0.113.195', status: 'Flagged', createdAt: '2026-06-08T18:40:00.000Z' }
  ]);

  // GDPR Requests state
  const [gdprRequests, setGdprRequests] = useState<any[]>([
    { _id: 'gdp-1', email: 'dDonna.noble@example.com', requestType: 'Export Data', status: 'Pending', createdAt: '2026-06-09T01:00:00.000Z' },
    { _id: 'gdp-2', email: 'rory.williams@example.com', requestType: 'Delete Profile', status: 'Completed', processedAt: '2026-06-07T12:00:00.000Z', createdAt: '2026-06-06T10:30:00.000Z' }
  ]);

  // Health Metrics
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
  }, []);

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
      const resData = await res.json();
      const payload = resData.data || resData;
      if (!payload.user?.roles?.some((r: string) => ['Admin', 'Super Admin', 'Manager'].includes(r)))
        throw new Error('Access denied — admin role required');
      setToken(payload.accessToken);
      setAdminEmail(payload.user.email);
      localStorage.setItem('apex-admin', JSON.stringify({ token: payload.accessToken, email: payload.user.email }));
      router.push('/overview');
    } catch (err: any) { setLoginError(err.message); }
  };

  const logout = () => {
    setToken('');
    setAdminEmail('');
    localStorage.removeItem('apex-admin');
    router.push('/');
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
      const json = await res.json();
      return json && json.hasOwnProperty('data') ? json.data : json;
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
      const json = await res.json();
      return json && json.hasOwnProperty('data') ? json.data : json;
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

  const loadBlogs = useCallback(async () => {
    setLoading(true);
    try {
      setBlogs(await apiFetch('/blog/posts'));
    } catch { setBlogs([]); }
    finally { setLoading(false); }
  }, [apiFetch]);

  // duplicate suggestions feedback widget hook
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
      const res = await fetch(`${API}/feedback/duplicates?type=${widgetType}&subject=${encodeURIComponent(widgetSubject)}`);
      if (res.ok) setDuplicateSuggestions(await res.json());
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
      setWidgetSubject('');
      setWidgetDescription('');
      setWidgetName('');
      setWidgetEmail('');
      setWidgetPhone('');
      setWidgetCaptcha('');
      setWidgetAttachments([]);
      setDuplicateSuggestions([]);
      setShowFloatingWidget(false);

      if (token && pathname === '/support' && supportSubTab === 'feedback') {
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

  // Memoized Filterings
  const filteredUsers = useMemo(() => {
    let result = Array.isArray(users) ? users.filter((u: any) => u.roles?.includes('Customer')) : [];
    if (userSearch.trim()) {
      const q = userSearch.toLowerCase();
      result = result.filter(u => 
        (u.email && u.email.toLowerCase().includes(q)) ||
        (u.firstName && u.firstName.toLowerCase().includes(q)) ||
        (u.lastName && u.lastName.toLowerCase().includes(q))
      );
    }
    if (userStatus) result = result.filter(u => u.accountStatus === userStatus);
    if (userSortField) {
      result.sort((a, b) => {
        let valA = a[userSortField];
        let valB = b[userSortField];
        if (userSortField === 'name') {
          valA = `${a.firstName || ''} ${a.lastName || ''}`.trim();
          valB = `${b.firstName || ''} ${b.lastName || ''}`.trim();
        }
        if (userSortField === 'walletBalance') {
          return userSortOrder === 'asc' ? Number(valA || 0) - Number(valB || 0) : Number(valB || 0) - Number(valA || 0);
        }
        valA = String(valA ?? ''); valB = String(valB ?? '');
        return userSortOrder === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
      });
    }
    return result;
  }, [users, userSearch, userStatus, userSortField, userSortOrder]);

  const filteredOrders = useMemo(() => {
    let result = Array.isArray(orders) ? [...orders] : [];
    if (orderSearch.trim()) {
      const q = orderSearch.toLowerCase();
      result = result.filter(o => 
        (o._id && o._id.toLowerCase().includes(q)) ||
        (o.status && o.status.toLowerCase().includes(q))
      );
    }
    if (orderStatus) result = result.filter(o => o.status === orderStatus);
    if (orderSortField) {
      result.sort((a, b) => {
        let valA = a[orderSortField]; let valB = b[orderSortField];
        if (orderSortField === 'totalPrice') {
          return orderSortOrder === 'asc' ? Number(valA || 0) - Number(valB || 0) : Number(valB || 0) - Number(valA || 0);
        }
        if (orderSortField === 'createdAt') {
          return orderSortOrder === 'asc' ? new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime() : new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
        }
        valA = String(valA ?? ''); valB = String(valB ?? '');
        return orderSortOrder === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
      });
    }
    return result;
  }, [orders, orderSearch, orderStatus, orderSortField, orderSortOrder]);

  const filteredProducts = useMemo(() => {
    let result = Array.isArray(products) ? products.filter((p: any) => p.title?.toLowerCase().includes(productSearch.toLowerCase())) : [];
    if (productSortField) {
      result.sort((a, b) => {
        let valA = a[productSortField]; let valB = b[productSortField];
        if (productSortField === 'price') {
          return productSortOrder === 'asc' ? Number(valA || 0) - Number(valB || 0) : Number(valB || 0) - Number(valA || 0);
        }
        if (productSortField === 'isApproved') {
          return productSortOrder === 'asc' ? (a.isApproved ? 1 : 0) - (b.isApproved ? 1 : 0) : (b.isApproved ? 1 : 0) - (a.isApproved ? 1 : 0);
        }
        valA = String(valA ?? ''); valB = String(valB ?? '');
        return productSortOrder === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
      });
    }
    return result;
  }, [products, productSearch, productSortField, productSortOrder]);

  const filteredVendors = useMemo(() => {
    let result = Array.isArray(vendors) ? vendors.filter((v: any) => {
      const roles = v.userId?.roles || [];
      if (vendorType === 'seller') return roles.includes('Seller');
      if (vendorType === 'vendor') return roles.includes('Vendor');
      return true;
    }) : [];
    if (vendorSearch.trim()) {
      const q = vendorSearch.toLowerCase();
      result = result.filter(v => 
        (v.shopName && v.shopName.toLowerCase().includes(q)) ||
        (v.companyLegalName && v.companyLegalName.toLowerCase().includes(q))
      );
    }
    if (vendorStatus) result = result.filter(v => v.status === vendorStatus);
    if (vendorSortField) {
      result.sort((a, b) => {
        let valA = a[vendorSortField]; let valB = b[vendorSortField];
        if (vendorSortField === 'type') {
          valA = a.userId?.roles?.includes('Seller') ? 'Seller' : 'Vendor';
          valB = b.userId?.roles?.includes('Seller') ? 'Seller' : 'Vendor';
        }
        if (vendorSortField === 'commissionRate') {
          return vendorSortOrder === 'asc' ? Number(valA || 0) - Number(valB || 0) : Number(valB || 0) - Number(valA || 0);
        }
        valA = String(valA ?? ''); valB = String(valB ?? '');
        return vendorSortOrder === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
      });
    }
    return result;
  }, [vendors, vendorType, vendorSearch, vendorStatus, vendorSortField, vendorSortOrder]);

  const filteredAudits = useMemo(() => {
    let result = Array.isArray(auditLogs) ? [...auditLogs] : [];
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
        if (auditSortField === 'createdAt') {
          return auditSortOrder === 'asc' ? new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime() : new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
        }
        valA = String(valA ?? ''); valB = String(valB ?? '');
        return auditSortOrder === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
      });
    }
    return result;
  }, [auditLogs, auditSearch, auditRole, auditSortField, auditSortOrder]);

  const filteredSearches = useMemo(() => {
    let result = Array.isArray(searchLogs) ? [...searchLogs] : [];
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(l => l.keyword && l.keyword.toLowerCase().includes(q));
    }
    if (searchRole !== 'all') result = result.filter(l => l.userRole === searchRole);
    if (searchSource !== 'all') result = result.filter(l => l.source === searchSource);
    if (searchSortField) {
      result.sort((a, b) => {
        let valA = a[searchSortField];
        let valB = b[searchSortField];
        if (searchSortField === 'resultsCount') {
          return searchSortOrder === 'asc' ? Number(valA || 0) - Number(valB || 0) : Number(valB || 0) - Number(valA || 0);
        }
        if (searchSortField === 'createdAt') {
          return searchSortOrder === 'asc' ? new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime() : new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
        }
        valA = String(valA ?? ''); valB = String(valB ?? '');
        return searchSortOrder === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
      });
    }
    return result;
  }, [searchLogs, searchQuery, searchRole, searchSource, searchSortField, searchSortOrder]);

  const filteredActivities = useMemo(() => {
    let result = Array.isArray(activityLogs) ? [...activityLogs] : [];
    if (activitySearch.trim()) {
      const q = activitySearch.toLowerCase();
      result = result.filter(l => 
        (l.action && l.action.toLowerCase().includes(q)) ||
        (l.details && l.details.toLowerCase().includes(q))
      );
    }
    if (activityCategory !== 'all') result = result.filter(l => l.category === activityCategory);
    if (activitySortField) {
      result.sort((a, b) => {
        let valA = a[activitySortField];
        let valB = b[activitySortField];
        if (activitySortField === 'createdAt') {
          return activitySortOrder === 'asc' ? new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime() : new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
        }
        valA = String(valA ?? ''); valB = String(valB ?? '');
        return activitySortOrder === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
      });
    }
    return result;
  }, [activityLogs, activitySearch, activityCategory, activitySortField, activitySortOrder]);

  const filteredSessions = useMemo(() => {
    let result = Array.isArray(chatbotLogs) ? [...chatbotLogs] : [];
    if (chatSearch.trim()) {
      const q = chatSearch.toLowerCase();
      result = result.filter(session => 
        (session.sessionId && session.sessionId.toLowerCase().includes(q)) ||
        (session.userId?.email && session.userId.email.toLowerCase().includes(q)) ||
        (session.guestId && session.guestId.toLowerCase().includes(q))
      );
    }
    if (chatFilterType === 'users') {
      result = result.filter(session => session.userId);
    } else if (chatFilterType === 'guests') {
      result = result.filter(session => !session.userId);
    }
    if (chatMinMsgs > 0) {
      result = result.filter(session => (session.messages?.length || 0) >= chatMinMsgs);
    }
    if (chatShowOnlyFallbacks) {
      result = result.filter(session => {
        const messages = session.messages || [];
        return messages.some((msg: any) => msg.role === 'user' && (msg.intent === 'FALLBACK' || msg.intent === 'HELP' || !msg.intent));
      });
    }
    if (chatSortField === 'sessionId') {
      result.sort((a, b) => (a.sessionId || '').localeCompare(b.sessionId || ''));
      if (chatSortOrder === 'desc') result.reverse();
    } else if (chatSortField === 'owner') {
      result.sort((a, b) => {
        const valA = a.userId?.email || a.guestId || 'Guest';
        const valB = b.userId?.email || b.guestId || 'Guest';
        return chatSortOrder === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
      });
    } else if (chatSortField === 'msgs') {
      result.sort((a, b) => {
        const lenA = a.messages?.length || 0; const lenB = b.messages?.length || 0;
        return chatSortOrder === 'asc' ? lenA - lenB : lenB - lenA;
      });
    } else {
      result.sort((a, b) => {
        const valA = new Date(a.updatedAt || a.createdAt || 0).getTime();
        const valB = new Date(b.updatedAt || b.createdAt || 0).getTime();
        return chatSortOrder === 'asc' ? valA - valB : valB - valA;
      });
    }
    return result;
  }, [chatbotLogs, chatSearch, chatFilterType, chatMinMsgs, chatShowOnlyFallbacks, chatSortField, chatSortOrder]);

  const totalUserPages = Math.ceil(filteredUsers.length / limit) || 1;
  const paginatedUsers = useMemo(() => filteredUsers.slice((userPage - 1) * limit, userPage * limit), [filteredUsers, userPage, limit]);

  const totalOrderPages = Math.ceil(filteredOrders.length / limit) || 1;
  const paginatedOrders = useMemo(() => filteredOrders.slice((orderPage - 1) * limit, orderPage * limit), [filteredOrders, orderPage, limit]);

  const totalProductPages = Math.ceil(filteredProducts.length / limit) || 1;
  const paginatedProducts = useMemo(() => filteredProducts.slice((productPage - 1) * limit, productPage * limit), [filteredProducts, productPage, limit]);

  const totalVendorPages = Math.ceil(filteredVendors.length / limit) || 1;
  const paginatedVendors = useMemo(() => filteredVendors.slice((vendorPage - 1) * limit, vendorPage * limit), [filteredVendors, vendorPage, limit]);

  const totalAuditPages = Math.ceil(filteredAudits.length / limit) || 1;
  const paginatedAudits = useMemo(() => filteredAudits.slice((auditPage - 1) * limit, auditPage * limit), [filteredAudits, auditPage, limit]);

  const totalSearchPages = Math.ceil(filteredSearches.length / limit) || 1;
  const paginatedSearches = useMemo(() => filteredSearches.slice((searchPage - 1) * limit, searchPage * limit), [filteredSearches, searchPage, limit]);

  const totalActivityPages = Math.ceil(filteredActivities.length / limit) || 1;
  const paginatedActivities = useMemo(() => filteredActivities.slice((activityPage - 1) * limit, activityPage * limit), [filteredActivities, activityPage, limit]);

  const totalChatbotPages = Math.ceil(filteredSessions.length / limit) || 1;
  const paginatedSessions = useMemo(() => filteredSessions.slice((chatbotPage - 1) * limit, chatbotPage * limit), [filteredSessions, chatbotPage, limit]);

  const totalApiPages = Math.ceil(apiLogs.length / limit) || 1;
  const paginatedApis = useMemo(() => apiLogs.slice((apiPage - 1) * limit, apiPage * limit), [apiLogs, apiPage, limit]);

  const totalSecurityPages = Math.ceil(securityLogs.length / limit) || 1;
  const paginatedSecurities = useMemo(() => securityLogs.slice((securityPage - 1) * limit, securityPage * limit), [securityLogs, securityPage, limit]);

  const totalImportPages = Math.ceil(importLogs.length / limit) || 1;
  const paginatedImports = useMemo(() => importLogs.slice((importPage - 1) * limit, importPage * limit), [importLogs, importPage, limit]);

  const totalExportPages = Math.ceil(exportLogs.length / limit) || 1;
  const paginatedExports = useMemo(() => exportLogs.slice((exportPage - 1) * limit, exportPage * limit), [exportLogs, exportPage, limit]);

  const totalGuestPages = Math.ceil(guestLogs.length / limit) || 1;
  const paginatedGuests = useMemo(() => guestLogs.slice((guestPage - 1) * limit, guestPage * limit), [guestLogs, guestPage, limit]);

  const totalChangeHistoryPages = Math.ceil(changeHistoryLogs.length / limit) || 1;
  const paginatedChangeHistories = useMemo(() => changeHistoryLogs.slice((changeHistoryPage - 1) * limit, changeHistoryPage * limit), [changeHistoryLogs, changeHistoryPage, limit]);

  const blogsFiltered = useMemo(() => {
    return blogs.filter(b => b.title?.toLowerCase().includes(blogSearch.toLowerCase()) || b.slug?.toLowerCase().includes(blogSearch.toLowerCase()));
  }, [blogs, blogSearch]);

  const breadcrumbs = useMemo(() => {
    const list = [{ label: 'Admin Console', onClick: () => router.push('/overview') }];
    const parts = pathname.split('/').filter(Boolean);
    const subRoute = parts[0] || 'overview';
    
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
      cms: 'Content Management (CMS)',
      flags: 'Global Feature Flags',
      announcements: 'System Broadcasts',
      fraud: 'Threat Monitor',
      gdpr: 'GDPR privacy',
      health: 'System Health'
    };

    if (subRoute !== 'overview') {
      list.push({
        label: tabLabels[subRoute] || subRoute,
        onClick: () => {
          router.push(`/${subRoute}`);
          if (subRoute === 'vendors') setVendorType('all');
          if (subRoute === 'logs') setLogSubTab('audit');
          if (subRoute === 'settings') setSettingTab('general');
          setSelectedUser(null); setSelectedSeller(null); setSelectedVendor(null); setSelectedOrder(null);
          setSelectedProduct(null); setSelectedTicket(null); setSelectedLogDetail(null);
        }
      });
    }
    return list;
  }, [pathname, router]);

  return (
    <AdminContext.Provider value={{
      API, mounted, theme, token, adminEmail, loginEmail, loginPassword, loginError, loading, apiError,
      setToken, setAdminEmail, setLoginEmail, setLoginPassword, setLoginError, setApiError, toggleTheme, logout, handleLogin,
      apiFetch, apiAction,
      stats, users, orders, products, vendors, reviews, coupons, adminProfile, adminSessions, tickets, agentsList, blogs,
      featureFlags, announcements, fraudLogs, gdprRequests, healthMetrics, rolesMatrix,
      setStats, setUsers, setOrders, setProducts, setVendors, setBlogs, setFeatureFlags, setAnnouncements, setFraudLogs, setGdprRequests, setRolesMatrix, setTickets,
      loadStats, loadUsers, loadOrders, loadProducts, loadVendors, loadAdminProfile, loadSystemSettings, loadLogs, loadTickets, loadFeedback, loadFeedbackDetail, loadBlogs,
      selectedUser, setSelectedUser, selectedSeller, setSelectedSeller, selectedVendor, setSelectedVendor, selectedOrder, setSelectedOrder,
      selectedProduct, setSelectedProduct, selectedTicket, setSelectedTicket, selectedFeedback, setSelectedFeedback, selectedLogDetail, setSelectedLogDetail,
      selectedChatLog, setSelectedChatLog,
      userSearch, setUserSearch, userRole, setUserRole, userStatus, setUserStatus, userSortField, setUserSortField, userSortOrder, setUserSortOrder, userPage, setUserPage,
      orderSearch, setOrderSearch, orderStatus, setOrderStatus, orderSortField, setOrderSortField, orderSortOrder, setOrderSortOrder, orderPage, setOrderPage,
      productSearch, setProductSearch, productSortField, setProductSortField, productSortOrder, setProductSortOrder, productPage, setProductPage,
      vendorSearch, setVendorSearch, vendorStatus, setVendorStatus, vendorType, setVendorType, vendorSortField, setVendorSortField, vendorSortOrder, setVendorSortOrder, vendorPage, setVendorPage,
      ticketSearch, setTicketSearch, ticketStatusFilter, setTicketStatusFilter, ticketPage, setTicketPage,
      logSubTab, setLogSubTab, auditLogs, searchLogs, activityLogs, chatbotLogs, apiLogs, securityLogs, importLogs, exportLogs, guestLogs, changeHistoryLogs, logAnalytics,
      retentionDays, setRetentionDays,
      auditPage, setAuditPage, searchPage, setSearchPage, activityPage, setActivityPage, chatbotPage, setChatbotPage, apiPage, setApiPage, securityPage, setSecurityPage,
      importPage, setImportPage, exportPage, setExportPage, guestPage, setGuestPage, changeHistoryPage, setChangeHistoryPage,
      auditSearch, setAuditSearch, auditRole, setAuditRole, auditSortField, setAuditSortField, auditSortOrder, setAuditSortOrder,
      searchQuery, setSearchQuery, searchRole, setSearchRole, searchSource, setSearchSource, searchSortField, setSearchSortField, searchSortOrder, setSearchSortOrder,
      activitySearch, setActivitySearch, activityCategory, setActivityCategory, activitySortField, setActivitySortField, activitySortOrder, setActivitySortOrder,
      chatSearch, setChatSearch, chatFilterType, setChatFilterType, chatMinMsgs, setChatMinMsgs, chatShowOnlyFallbacks, setChatShowOnlyFallbacks, chatSortField, setChatSortField, chatSortOrder, setChatSortOrder,
      supportSubTab, setSupportSubTab, feedbackTickets, feedbackStats, feedbackComments, feedbackAttachments, feedbackActivities,
      feedbackSearch, setFeedbackSearch, feedbackTypeFilter, setFeedbackTypeFilter, feedbackStatusFilter, setFeedbackStatusFilter, feedbackCategoryFilter, setFeedbackCategoryFilter,
      feedbackPage, setFeedbackPage, feedbackSortField, setFeedbackSortField, feedbackSortOrder, setFeedbackSortOrder,
      feedbackReplyText, setFeedbackReplyText, feedbackIsPrivateNote, setFeedbackIsPrivateNote,
      feedbackRoadmapStatusSelect, setFeedbackRoadmapStatusSelect, feedbackStatusSelect, setFeedbackStatusSelect, feedbackAssignTeamSelect, setFeedbackAssignTeamSelect, feedbackAssignAgentSelect, setFeedbackAssignAgentSelect,
      settingTab, setSettingTab, generalSettings, setGeneralSettings, emailSettings, setEmailSettings, smsSettings, setSmsSettings, storageSettings, setStorageSettings, apiSettings, setApiSettings,
      sellerCommission, setSellerCommission, editCompanyLegalName, setEditCompanyLegalName, editBusinessPhone, setEditBusinessPhone,
      orderTrackingCode, setOrderTrackingCode, orderStatusSelect, setOrderStatusSelect, activeProductImageIndex, setActiveProductImageIndex,
      ticketReplyText, setTicketReplyText, ticketStatusSelect, setTicketStatusSelect, ticketAgentSelect, setTicketAgentSelect,
      showFloatingWidget, setShowFloatingWidget, widgetType, setWidgetType, widgetCategory, setWidgetCategory, widgetSubject, setWidgetSubject, widgetDescription, setWidgetDescription,
      widgetName, setWidgetName, widgetEmail, setWidgetEmail, widgetPhone, setWidgetPhone, widgetPriority, setWidgetPriority, widgetSeverity, setWidgetSeverity,
      widgetCaptcha, setWidgetCaptcha, widgetCaptchaVal, setWidgetCaptchaVal, widgetAttachments, setWidgetAttachments, duplicateSuggestions, setDuplicateSuggestions,
      handleVoteSuggestion, handleWidgetSubmit, handleGenerateCaptcha,
      filteredUsers, filteredOrders, filteredProducts, filteredVendors, filteredAudits, filteredSearches, filteredActivities, filteredSessions,
      paginatedUsers, paginatedOrders, paginatedProducts, paginatedVendors, paginatedAudits, paginatedSearches, paginatedActivities, paginatedSessions,
      paginatedApis, paginatedSecurities, paginatedImports, paginatedExports, paginatedGuests, paginatedChangeHistories,
      totalUserPages, totalOrderPages, totalProductPages, totalVendorPages, totalAuditPages, totalSearchPages, totalActivityPages, totalChatbotPages, totalApiPages, totalSecurityPages, totalImportPages, totalExportPages, totalGuestPages, totalChangeHistoryPages,
      limit, blogSearch, setBlogSearch, blogsFiltered,
      selectedBlog, setSelectedBlog, blogTitle, setBlogTitle, blogSlug, setBlogSlug, blogContent, setBlogContent, blogTags, setBlogTags, blogStatus, setBlogStatus, blogFeaturedImage, setBlogFeaturedImage, showBlogModal, setShowBlogModal,
      handleExportCustomers, handleUpdateSettings, toggleMatrixPermission, breadcrumbs, activeTab, setActiveTab
    }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) throw new Error('useAdmin must be used within AdminProvider');
  return context;
}
