'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  LayoutDashboard, Users, ShoppingBag, Package, Star, Tag, Store,
  LogOut, Sun, Moon, Search, Filter, ChevronUp, ChevronDown,
  Trash2, CheckCircle, XCircle, ShieldCheck, TrendingUp,
  Mail, Lock, AlertCircle, RefreshCw, Edit2, X, Check,
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
    Pending: 'amber', Open: 'amber', 'In Progress': 'amber',
    Cancelled: 'red', Suspended: 'red', Rejected: 'red', Flagged: 'red',
    Shipped: 'blue', Paid: 'blue',
    Inactive: 'zinc', Resolved: 'zinc', Closed: 'zinc',
  };
  return m[s] ?? 'zinc';
}

function authHeaders(token: string) {
  return { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };
}

function Th({ label, field, sort, setSort }: { label: string; field: string; sort: string; setSort: (s: string) => void }) {
  const active = sort.startsWith(field);
  const asc = sort === field + '_asc';
  return (
    <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-zinc-500 cursor-pointer select-none hover:text-zinc-800 dark:hover:text-zinc-200 whitespace-nowrap"
      onClick={() => setSort(active && asc ? field + '_desc' : field + '_asc')}>
      <span className="flex items-center gap-1">
        {label}
        {active ? (asc ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />) : <ChevronDown className="h-3 w-3 opacity-30" />}
      </span>
    </th>
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

function Sel({ value, onChange, options, placeholder }: { value: string; onChange: (v: string) => void; options: { value: string; label: string }[]; placeholder?: string }) {
  return (
    <select value={value} onChange={e => onChange(e.target.value)}
      className="px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-indigo-500 min-w-[140px]">
      <option value="">{placeholder ?? 'All'}</option>
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  );
}

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

  const [stats, setStats] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [vendors, setVendors] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [coupons, setCoupons] = useState<any[]>([]);

  const [userSearch, setUserSearch] = useState('');
  const [userRole, setUserRole] = useState('');
  const [userStatus, setUserStatus] = useState('');
  const [userSort, setUserSort] = useState('createdAt_desc');

  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatus, setOrderStatus] = useState('');
  const [orderSort, setOrderSort] = useState('createdAt_desc');

  const [productSearch, setProductSearch] = useState('');
  const [productApproved, setProductApproved] = useState('');
  const [productActive, setProductActive] = useState('');
  const [productSort, setProductSort] = useState('createdAt_desc');

  const [vendorSearch, setVendorSearch] = useState('');
  const [vendorStatus, setVendorStatus] = useState('');

  const [reviewSearch, setReviewSearch] = useState('');
  const [reviewStatus, setReviewStatus] = useState('');
  const [reviewSentiment, setReviewSentiment] = useState('');
  const [reviewSort, setReviewSort] = useState('createdAt_desc');

  const [couponSearch, setCouponSearch] = useState('');
  const [couponActive, setCouponActive] = useState('');

  const [editOrderId, setEditOrderId] = useState('');
  const [editOrderStatus, setEditOrderStatus] = useState('');

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('apex-admin');
    if (saved) { const p = JSON.parse(saved); setToken(p.token); setAdminEmail(p.email); }
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
      const data = await res.json();
      if (!data.user.roles?.some((r: string) => ['Admin', 'Super Admin', 'Manager'].includes(r)))
        throw new Error('Access denied — admin role required');
      setToken(data.accessToken);
      setAdminEmail(data.user.email);
      localStorage.setItem('apex-admin', JSON.stringify({ token: data.accessToken, email: data.user.email }));
    } catch (err: any) { setLoginError(err.message); }
  };

  const logout = () => { setToken(''); setAdminEmail(''); localStorage.removeItem('apex-admin'); };

  const apiFetch = useCallback(async (path: string) => {
    const res = await fetch(`${API}${path}`, { headers: authHeaders(token) });
    if (!res.ok) throw new Error(`Failed: ${path}`);
    return res.json();
  }, [token]);

  const apiAction = useCallback(async (method: string, path: string, body?: any) => {
    const res = await fetch(`${API}${path}`, {
      method,
      headers: authHeaders(token),
      body: body ? JSON.stringify(body) : undefined,
    });
    if (!res.ok) { const e = await res.json(); throw new Error(e.message ?? 'Failed'); }
    return res.json();
  }, [token]);

  const loadStats   = useCallback(async () => { try { setStats(await apiFetch('/admin/stats')); } catch { /* */ } }, [apiFetch]);
  const loadUsers   = useCallback(async () => { setLoading(true); try { const p = new URLSearchParams(); if (userSearch) p.set('search', userSearch); if (userRole) p.set('role', userRole); if (userStatus) p.set('status', userStatus); setUsers(await apiFetch(`/admin/users?${p}`)); } catch { setUsers([]); } finally { setLoading(false); } }, [apiFetch, userSearch, userRole, userStatus]);
  const loadOrders  = useCallback(async () => { setLoading(true); try { const p = new URLSearchParams(); if (orderSearch) p.set('search', orderSearch); if (orderStatus) p.set('status', orderStatus); const sm: Record<string,string> = {'totalPrice_asc':'lowest','totalPrice_desc':'highest','createdAt_asc':'oldest','createdAt_desc':'newest'}; p.set('sort', sm[orderSort] ?? 'newest'); setOrders(await apiFetch(`/admin/orders?${p}`)); } catch { setOrders([]); } finally { setLoading(false); } }, [apiFetch, orderSearch, orderStatus, orderSort]);
  const loadProducts = useCallback(async () => { setLoading(true); try { const p = new URLSearchParams(); if (productSearch) p.set('search', productSearch); if (productApproved !== '') p.set('approved', productApproved); if (productActive !== '') p.set('active', productActive); const sm: Record<string,string> = {'price_asc':'price_asc','price_desc':'price_desc','averageRating_desc':'rating','salesCount_desc':'sales'}; if (productSort in sm) p.set('sort', sm[productSort]); setProducts(await apiFetch(`/admin/products?${p}`)); } catch { setProducts([]); } finally { setLoading(false); } }, [apiFetch, productSearch, productApproved, productActive, productSort]);
  const loadVendors  = useCallback(async () => { setLoading(true); try { const p = new URLSearchParams(); if (vendorSearch) p.set('search', vendorSearch); if (vendorStatus) p.set('status', vendorStatus); setVendors(await apiFetch(`/admin/vendors?${p}`)); } catch { setVendors([]); } finally { setLoading(false); } }, [apiFetch, vendorSearch, vendorStatus]);
  const loadReviews  = useCallback(async () => { setLoading(true); try { const p = new URLSearchParams(); if (reviewSearch) p.set('search', reviewSearch); if (reviewStatus) p.set('status', reviewStatus); if (reviewSentiment) p.set('sentiment', reviewSentiment); const sm: Record<string,string> = {'rating_asc':'rating_asc','rating_desc':'rating_desc'}; if (reviewSort in sm) p.set('sort', sm[reviewSort]); setReviews(await apiFetch(`/admin/reviews?${p}`)); } catch { setReviews([]); } finally { setLoading(false); } }, [apiFetch, reviewSearch, reviewStatus, reviewSentiment, reviewSort]);
  const loadCoupons  = useCallback(async () => { setLoading(true); try { const p = new URLSearchParams(); if (couponSearch) p.set('search', couponSearch); if (couponActive !== '') p.set('active', couponActive); setCoupons(await apiFetch(`/admin/coupons?${p}`)); } catch { setCoupons([]); } finally { setLoading(false); } }, [apiFetch, couponSearch, couponActive]);

  useEffect(() => { if (!token) return; loadStats(); }, [token, loadStats]);
  useEffect(() => { if (!token || activeTab !== 'users') return; loadUsers(); }, [token, activeTab, loadUsers]);
  useEffect(() => { if (!token || activeTab !== 'orders') return; loadOrders(); }, [token, activeTab, loadOrders]);
  useEffect(() => { if (!token || activeTab !== 'products') return; loadProducts(); }, [token, activeTab, loadProducts]);
  useEffect(() => { if (!token || activeTab !== 'vendors') return; loadVendors(); }, [token, activeTab, loadVendors]);
  useEffect(() => { if (!token || activeTab !== 'reviews') return; loadReviews(); }, [token, activeTab, loadReviews]);
  useEffect(() => { if (!token || activeTab !== 'coupons') return; loadCoupons(); }, [token, activeTab, loadCoupons]);

  function clientSort<T>(arr: T[], sort: string, map: Record<string, (a: T, b: T) => number>) {
    return map[sort] ? [...arr].sort(map[sort]) : arr;
  }

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
    { key: 'users',     label: 'Users',     icon: <Users className="h-4 w-4" /> },
    { key: 'orders',    label: 'Orders',    icon: <ShoppingBag className="h-4 w-4" /> },
    { key: 'products',  label: 'Products',  icon: <Package className="h-4 w-4" /> },
    { key: 'vendors',   label: 'Vendors',   icon: <Store className="h-4 w-4" /> },
    { key: 'reviews',   label: 'Reviews',   icon: <Star className="h-4 w-4" /> },
    { key: 'coupons',   label: 'Coupons',   icon: <Tag className="h-4 w-4" /> },
  ];

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col">
      {/* Topbar */}
      <header className="sticky top-0 z-40 border-b border-zinc-200/80 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2 font-bold text-lg text-indigo-600 dark:text-indigo-400">
          <ShieldCheck className="h-5 w-5" />
          <span>ApexStore Admin</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border border-indigo-200/50 font-semibold ml-1">Dashboard</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden md:block text-xs text-zinc-500 font-semibold">{adminEmail}</span>
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

          {/* OVERVIEW */}
          {activeTab === 'overview' && (
            <>
              <div>
                <h1 className="text-2xl font-black text-zinc-900 dark:text-white">Platform Overview</h1>
                <p className="text-sm text-zinc-500 mt-0.5">Real-time metrics across the entire ApexStore platform.</p>
              </div>
              {stats ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <StatCard label="Total Users"     value={stats.totalUsers}                              icon={<Users className="h-5 w-5" />}       color="indigo"  />
                  <StatCard label="Total Orders"    value={stats.totalOrders}                             icon={<ShoppingBag className="h-5 w-5" />}  color="blue"    />
                  <StatCard label="Total Products"  value={stats.totalProducts}                           icon={<Package className="h-5 w-5" />}      color="emerald" />
                  <StatCard label="Total Revenue"   value={`$${(stats.totalRevenue ?? 0).toFixed(2)}`}   icon={<TrendingUp className="h-5 w-5" />}   color="amber"   />
                  <StatCard label="Active Vendors"  value={stats.totalVendors}                            icon={<Store className="h-5 w-5" />}        color="violet"  />
                  <StatCard label="Today's Orders"  value={stats.todayOrders}                             icon={<ShoppingBag className="h-5 w-5" />}  color="blue"    />
                  <StatCard label="Open Tickets"    value={stats.openTickets}                             icon={<AlertCircle className="h-5 w-5" />}  color="rose"    />
                  <StatCard label="Pending Vendors" value={stats.pendingVendors}                          icon={<ShieldCheck className="h-5 w-5" />}  color="amber"   />
                </div>
              ) : (
                <div className="flex items-center gap-2 text-sm text-zinc-400"><RefreshCw className="h-4 w-4 animate-spin" /> Loading stats…</div>
              )}
            </>
          )}

          {/* USERS */}
          {activeTab === 'users' && (
            <Section>
              <SectionHeader title="Users" desc={`${users.length} total`}
                right={<button onClick={loadUsers} className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 cursor-pointer"><RefreshCw className="h-4 w-4" /></button>} />
              <FilterBar>
                <SearchBar value={userSearch} onChange={setUserSearch} placeholder="Search email, name, phone…" />
                <Sel value={userRole} onChange={setUserRole} placeholder="All Roles" options={[
                  {value:'Customer',label:'Customer'},{value:'Seller',label:'Seller'},
                  {value:'Vendor',label:'Vendor'},{value:'Admin',label:'Admin'},{value:'Super Admin',label:'Super Admin'},
                ]} />
                <Sel value={userStatus} onChange={setUserStatus} placeholder="All Statuses" options={[
                  {value:'Active',label:'Active'},{value:'Inactive',label:'Inactive'},{value:'Suspended',label:'Suspended'},
                ]} />
                <ApplyBtn onClick={loadUsers} />
              </FilterBar>
              {loading ? <Loading /> : (
                <Table>
                  <Thead><tr>
                    <Th label="Email"  field="email"         sort={userSort} setSort={setUserSort} />
                    <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-zinc-500">Name</th>
                    <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-zinc-500">Roles</th>
                    <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-zinc-500">Status</th>
                    <Th label="Wallet" field="walletBalance" sort={userSort} setSort={setUserSort} />
                    <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-zinc-500">Joined</th>
                    <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-zinc-500">Actions</th>
                  </tr></Thead>
                  <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                    {clientSort(users, userSort, {
                      'email_asc':         (a:any,b:any) => a.email.localeCompare(b.email),
                      'email_desc':        (a:any,b:any) => b.email.localeCompare(a.email),
                      'walletBalance_desc':(a:any,b:any) => (b.walletBalance??0)-(a.walletBalance??0),
                      'walletBalance_asc': (a:any,b:any) => (a.walletBalance??0)-(b.walletBalance??0),
                    }).map((u:any) => (
                      <tr key={u._id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40">
                        <td className="px-4 py-3 text-sm font-medium text-zinc-900 dark:text-white">{u.email}</td>
                        <td className="px-4 py-3 text-sm text-zinc-500">{u.firstName} {u.lastName}</td>
                        <td className="px-4 py-3"><div className="flex flex-wrap gap-1">{(u.roles??[]).map((r:string)=><span key={r} className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300">{r}</span>)}</div></td>
                        <td className="px-4 py-3">{badge(statusColor(u.accountStatus), u.accountStatus)}</td>
                        <td className="px-4 py-3 text-sm text-zinc-500">${(u.walletBalance??0).toFixed(2)}</td>
                        <td className="px-4 py-3 text-xs text-zinc-400">{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '—'}</td>
                        <td className="px-4 py-3"><div className="flex gap-1">
                          <button onClick={async()=>{await apiAction('PUT',`/admin/users/${u._id}`,{accountStatus:u.accountStatus==='Active'?'Suspended':'Active'});loadUsers();}}
                            className="p-1.5 rounded-lg text-zinc-400 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950/20 cursor-pointer" title="Toggle status"><Edit2 className="h-3.5 w-3.5"/></button>
                          <button onClick={async()=>{if(!confirm('Delete user?'))return;await apiAction('DELETE',`/admin/users/${u._id}`);loadUsers();}}
                            className="p-1.5 rounded-lg text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 cursor-pointer"><Trash2 className="h-3.5 w-3.5"/></button>
                        </div></td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Section>
          )}

          {/* ORDERS */}
          {activeTab === 'orders' && (
            <Section>
              <SectionHeader title="Orders" desc={`${orders.length} total`}
                right={<button onClick={loadOrders} className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 cursor-pointer"><RefreshCw className="h-4 w-4"/></button>} />
              <FilterBar>
                <SearchBar value={orderSearch} onChange={setOrderSearch} placeholder="Search order ID, tracking…" />
                <Sel value={orderStatus} onChange={setOrderStatus} placeholder="All Statuses" options={[
                  {value:'Pending',label:'Pending'},{value:'Paid',label:'Paid'},{value:'Shipped',label:'Shipped'},
                  {value:'Delivered',label:'Delivered'},{value:'Cancelled',label:'Cancelled'},{value:'Returned',label:'Returned'},
                ]} />
                <Sel value={orderSort} onChange={setOrderSort} placeholder="Sort" options={[
                  {value:'createdAt_desc',label:'Newest'},{value:'createdAt_asc',label:'Oldest'},
                  {value:'totalPrice_desc',label:'Highest Value'},{value:'totalPrice_asc',label:'Lowest Value'},
                ]} />
                <ApplyBtn onClick={loadOrders} />
              </FilterBar>
              {loading ? <Loading /> : (
                <Table>
                  <Thead><tr>
                    <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-zinc-500">Order ID</th>
                    <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-zinc-500">Status</th>
                    <Th label="Total"  field="totalPrice" sort={orderSort} setSort={setOrderSort} />
                    <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-zinc-500">Items</th>
                    <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-zinc-500">Tracking</th>
                    <Th label="Date"   field="createdAt"  sort={orderSort} setSort={setOrderSort} />
                    <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-zinc-500">Actions</th>
                  </tr></Thead>
                  <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                    {clientSort(orders, orderSort, {
                      'totalPrice_asc':  (a:any,b:any) => a.totalPrice - b.totalPrice,
                      'totalPrice_desc': (a:any,b:any) => b.totalPrice - a.totalPrice,
                      'createdAt_asc':   (a:any,b:any) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
                    }).map((o:any) => (
                      <tr key={o._id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40">
                        <td className="px-4 py-3 text-xs font-mono text-zinc-500">{o._id?.toString().slice(-8).toUpperCase()}</td>
                        <td className="px-4 py-3">
                          {editOrderId === o._id ? (
                            <div className="flex items-center gap-1">
                              <select value={editOrderStatus} onChange={e=>setEditOrderStatus(e.target.value)}
                                className="text-xs rounded-lg border dark:border-zinc-700 bg-white dark:bg-zinc-900 px-2 py-1 focus:outline-none text-zinc-900 dark:text-white">
                                {['Pending','Paid','Shipped','Delivered','Cancelled','Returned'].map(s=><option key={s}>{s}</option>)}
                              </select>
                              <button onClick={async()=>{await apiAction('PUT',`/admin/orders/${o._id}/status`,{status:editOrderStatus});setEditOrderId('');loadOrders();}}
                                className="p-1 rounded text-emerald-500 hover:bg-emerald-50 cursor-pointer"><Check className="h-3.5 w-3.5"/></button>
                              <button onClick={()=>setEditOrderId('')}
                                className="p-1 rounded text-zinc-400 hover:bg-zinc-100 cursor-pointer"><X className="h-3.5 w-3.5"/></button>
                            </div>
                          ) : badge(statusColor(o.status), o.status)}
                        </td>
                        <td className="px-4 py-3 text-sm font-semibold text-zinc-900 dark:text-white">${(o.totalPrice??0).toFixed(2)}</td>
                        <td className="px-4 py-3 text-sm text-zinc-500">{o.items?.length??0}</td>
                        <td className="px-4 py-3 text-xs text-zinc-400 font-mono">{o.trackingCode||'—'}</td>
                        <td className="px-4 py-3 text-xs text-zinc-400">{o.createdAt ? new Date(o.createdAt).toLocaleDateString() : '—'}</td>
                        <td className="px-4 py-3">
                          <button onClick={()=>{setEditOrderId(o._id);setEditOrderStatus(o.status);}}
                            className="p-1.5 rounded-lg text-zinc-400 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-950/20 cursor-pointer"><Edit2 className="h-3.5 w-3.5"/></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Section>
          )}

          {/* PRODUCTS */}
          {activeTab === 'products' && (
            <Section>
              <SectionHeader title="Products" desc={`${products.length} total`}
                right={<button onClick={loadProducts} className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 cursor-pointer"><RefreshCw className="h-4 w-4"/></button>} />
              <FilterBar>
                <SearchBar value={productSearch} onChange={setProductSearch} placeholder="Search title, SKU…" />
                <Sel value={productApproved} onChange={setProductApproved} placeholder="Approval" options={[{value:'true',label:'Approved'},{value:'false',label:'Pending'}]} />
                <Sel value={productActive}   onChange={setProductActive}   placeholder="Active"   options={[{value:'true',label:'Active'},{value:'false',label:'Inactive'}]} />
                <Sel value={productSort}     onChange={setProductSort}     placeholder="Sort"     options={[
                  {value:'price_asc',label:'Price ↑'},{value:'price_desc',label:'Price ↓'},
                  {value:'averageRating_desc',label:'Top Rated'},{value:'salesCount_desc',label:'Best Selling'},
                ]} />
                <ApplyBtn onClick={loadProducts} />
              </FilterBar>
              {loading ? <Loading /> : (
                <Table>
                  <Thead><tr>
                    <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-zinc-500">Product</th>
                    <Th label="Price"  field="price"         sort={productSort} setSort={setProductSort} />
                    <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-zinc-500">SKU</th>
                    <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-zinc-500">Approval</th>
                    <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-zinc-500">Active</th>
                    <Th label="Rating" field="averageRating" sort={productSort} setSort={setProductSort} />
                    <Th label="Sales"  field="salesCount"    sort={productSort} setSort={setProductSort} />
                    <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-zinc-500">Actions</th>
                  </tr></Thead>
                  <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                    {clientSort(products, productSort, {
                      'price_asc':          (a:any,b:any) => a.price - b.price,
                      'price_desc':         (a:any,b:any) => b.price - a.price,
                      'averageRating_desc': (a:any,b:any) => (b.averageRating??0)-(a.averageRating??0),
                      'salesCount_desc':    (a:any,b:any) => (b.salesCount??0)-(a.salesCount??0),
                    }).map((p:any) => (
                      <tr key={p._id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40">
                        <td className="px-4 py-3"><div className="flex items-center gap-3">
                          <img src={p.images?.[0]??`https://picsum.photos/seed/${p.sku}/40/40`} alt={p.title} className="h-9 w-9 rounded-lg object-cover border dark:border-zinc-700" />
                          <span className="text-sm font-medium text-zinc-900 dark:text-white line-clamp-1 max-w-[180px]">{p.title}</span>
                        </div></td>
                        <td className="px-4 py-3 text-sm text-zinc-700 dark:text-zinc-300">${p.price?.toFixed(2)}</td>
                        <td className="px-4 py-3 text-xs text-zinc-400 font-mono">{p.sku}</td>
                        <td className="px-4 py-3">{badge(p.isApproved?'green':'amber', p.isApproved?'Approved':'Pending')}</td>
                        <td className="px-4 py-3">{badge(p.isActive?'green':'zinc', p.isActive?'Active':'Inactive')}</td>
                        <td className="px-4 py-3 text-sm text-zinc-500">⭐ {p.averageRating??0}</td>
                        <td className="px-4 py-3 text-sm text-zinc-500">{p.salesCount??0}</td>
                        <td className="px-4 py-3"><div className="flex gap-1">
                          {!p.isApproved && <button onClick={async()=>{await apiAction('PUT',`/admin/products/${p._id}/approve`);loadProducts();}}
                            className="p-1.5 rounded-lg text-zinc-400 hover:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 cursor-pointer" title="Approve"><CheckCircle className="h-3.5 w-3.5"/></button>}
                          <button onClick={async()=>{await apiAction('PUT',`/admin/products/${p._id}/activation`,{active:!p.isActive});loadProducts();}}
                            className="p-1.5 rounded-lg text-zinc-400 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950/20 cursor-pointer" title="Toggle active"><Edit2 className="h-3.5 w-3.5"/></button>
                          <button onClick={async()=>{if(!confirm('Delete product?'))return;await apiAction('DELETE',`/admin/products/${p._id}`);loadProducts();}}
                            className="p-1.5 rounded-lg text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 cursor-pointer"><Trash2 className="h-3.5 w-3.5"/></button>
                        </div></td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Section>
          )}

          {/* VENDORS */}
          {activeTab === 'vendors' && (
            <Section>
              <SectionHeader title="Vendors" desc={`${vendors.length} total`}
                right={<button onClick={loadVendors} className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 cursor-pointer"><RefreshCw className="h-4 w-4"/></button>} />
              <FilterBar>
                <SearchBar value={vendorSearch} onChange={setVendorSearch} placeholder="Search shop name, company…" />
                <Sel value={vendorStatus} onChange={setVendorStatus} placeholder="All Statuses" options={[
                  {value:'Pending',label:'Pending'},{value:'Approved',label:'Approved'},{value:'Suspended',label:'Suspended'},
                ]} />
                <ApplyBtn onClick={loadVendors} />
              </FilterBar>
              {loading ? <Loading /> : (
                <Table>
                  <Thead><tr>
                    <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-zinc-500">Shop</th>
                    <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-zinc-500">Company</th>
                    <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-zinc-500">Phone</th>
                    <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-zinc-500">Commission</th>
                    <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-zinc-500">Status</th>
                    <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-zinc-500">Actions</th>
                  </tr></Thead>
                  <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                    {vendors.map((v:any) => (
                      <tr key={v._id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40">
                        <td className="px-4 py-3 text-sm font-medium text-zinc-900 dark:text-white">{v.shopName}</td>
                        <td className="px-4 py-3 text-sm text-zinc-500">{v.companyLegalName||'—'}</td>
                        <td className="px-4 py-3 text-sm text-zinc-500">{v.businessPhone||'—'}</td>
                        <td className="px-4 py-3 text-sm text-zinc-500">{v.commissionRate}%</td>
                        <td className="px-4 py-3">{badge(statusColor(v.status), v.status)}</td>
                        <td className="px-4 py-3"><div className="flex gap-1">
                          {v.status!=='Approved'   && <button onClick={async()=>{await apiAction('PUT',`/admin/vendors/${v._id}/status`,{status:'Approved'});loadVendors();}}
                            className="p-1.5 rounded-lg text-zinc-400 hover:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 cursor-pointer" title="Approve"><CheckCircle className="h-3.5 w-3.5"/></button>}
                          {v.status!=='Suspended'  && <button onClick={async()=>{await apiAction('PUT',`/admin/vendors/${v._id}/status`,{status:'Suspended'});loadVendors();}}
                            className="p-1.5 rounded-lg text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 cursor-pointer" title="Suspend"><XCircle className="h-3.5 w-3.5"/></button>}
                        </div></td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Section>
          )}

          {/* REVIEWS */}
          {activeTab === 'reviews' && (
            <Section>
              <SectionHeader title="Reviews" desc={`${reviews.length} total`}
                right={<button onClick={loadReviews} className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 cursor-pointer"><RefreshCw className="h-4 w-4"/></button>} />
              <FilterBar>
                <SearchBar value={reviewSearch} onChange={setReviewSearch} placeholder="Search comment…" />
                <Sel value={reviewStatus}    onChange={setReviewStatus}    placeholder="All Statuses" options={[{value:'Approved',label:'Approved'},{value:'Pending',label:'Pending'},{value:'Rejected',label:'Rejected'},{value:'Flagged',label:'Flagged'}]} />
                <Sel value={reviewSentiment} onChange={setReviewSentiment} placeholder="Sentiment"   options={[{value:'Positive',label:'Positive'},{value:'Neutral',label:'Neutral'},{value:'Negative',label:'Negative'}]} />
                <Sel value={reviewSort}      onChange={setReviewSort}      placeholder="Sort"        options={[{value:'createdAt_desc',label:'Newest'},{value:'rating_desc',label:'Highest Rating'},{value:'rating_asc',label:'Lowest Rating'}]} />
                <ApplyBtn onClick={loadReviews} />
              </FilterBar>
              {loading ? <Loading /> : (
                <Table>
                  <Thead><tr>
                    <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-zinc-500">Comment</th>
                    <Th label="Rating" field="rating"    sort={reviewSort} setSort={setReviewSort} />
                    <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-zinc-500">Sentiment</th>
                    <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-zinc-500">Status</th>
                    <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-zinc-500">Verified</th>
                    <Th label="Date"   field="createdAt" sort={reviewSort} setSort={setReviewSort} />
                    <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-zinc-500">Actions</th>
                  </tr></Thead>
                  <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                    {clientSort(reviews, reviewSort, {
                      'rating_asc':  (a:any,b:any) => a.rating - b.rating,
                      'rating_desc': (a:any,b:any) => b.rating - a.rating,
                    }).map((r:any) => (
                      <tr key={r._id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40">
                        <td className="px-4 py-3 text-sm text-zinc-700 dark:text-zinc-300 max-w-[240px] truncate">{r.comment}</td>
                        <td className="px-4 py-3 text-sm">{'⭐'.repeat(r.rating??0)}</td>
                        <td className="px-4 py-3">{badge(r.sentiment==='Positive'?'green':r.sentiment==='Negative'?'red':'zinc', r.sentiment??'Neutral')}</td>
                        <td className="px-4 py-3">{badge(statusColor(r.status), r.status)}</td>
                        <td className="px-4 py-3">{r.verifiedPurchase ? badge('green','Verified') : badge('zinc','Unverified')}</td>
                        <td className="px-4 py-3 text-xs text-zinc-400">{r.createdAt ? new Date(r.createdAt).toLocaleDateString() : '—'}</td>
                        <td className="px-4 py-3"><div className="flex gap-1">
                          {r.status!=='Approved' && <button onClick={async()=>{await apiAction('PUT',`/admin/reviews/${r._id}/moderate`,{status:'Approved'});loadReviews();}}
                            className="p-1.5 rounded-lg text-zinc-400 hover:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 cursor-pointer"><CheckCircle className="h-3.5 w-3.5"/></button>}
                          {r.status!=='Rejected' && <button onClick={async()=>{await apiAction('PUT',`/admin/reviews/${r._id}/moderate`,{status:'Rejected'});loadReviews();}}
                            className="p-1.5 rounded-lg text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 cursor-pointer"><XCircle className="h-3.5 w-3.5"/></button>}
                        </div></td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Section>
          )}

          {/* COUPONS */}
          {activeTab === 'coupons' && (
            <Section>
              <SectionHeader title="Coupons" desc={`${coupons.length} total`}
                right={<button onClick={loadCoupons} className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 cursor-pointer"><RefreshCw className="h-4 w-4"/></button>} />
              <FilterBar>
                <SearchBar value={couponSearch} onChange={setCouponSearch} placeholder="Search coupon code…" />
                <Sel value={couponActive} onChange={setCouponActive} placeholder="All" options={[{value:'true',label:'Active'},{value:'false',label:'Inactive'}]} />
                <ApplyBtn onClick={loadCoupons} />
              </FilterBar>
              {loading ? <Loading /> : (
                <Table>
                  <Thead><tr>
                    <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-zinc-500">Code</th>
                    <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-zinc-500">Type</th>
                    <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-zinc-500">Value</th>
                    <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-zinc-500">Min Purchase</th>
                    <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-zinc-500">Expires</th>
                    <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-zinc-500">Status</th>
                    <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-zinc-500">Actions</th>
                  </tr></Thead>
                  <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                    {coupons.map((c:any) => (
                      <tr key={c._id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40">
                        <td className="px-4 py-3 font-mono font-bold text-sm text-indigo-600 dark:text-indigo-400">{c.code}</td>
                        <td className="px-4 py-3 text-sm text-zinc-500 capitalize">{c.discountType}</td>
                        <td className="px-4 py-3 text-sm text-zinc-700 dark:text-zinc-300">{c.discountType==='percentage'?`${c.value}%`:`$${c.value}`}</td>
                        <td className="px-4 py-3 text-sm text-zinc-500">${c.minPurchase??0}</td>
                        <td className="px-4 py-3 text-xs text-zinc-400">{c.expiresAt ? new Date(c.expiresAt).toLocaleDateString() : '—'}</td>
                        <td className="px-4 py-3">{badge(c.isActive?'green':'zinc', c.isActive?'Active':'Inactive')}</td>
                        <td className="px-4 py-3"><div className="flex gap-1">
                          <button onClick={async()=>{await apiAction('PUT',`/admin/coupons/${c._id}`,{isActive:!c.isActive});loadCoupons();}}
                            className="p-1.5 rounded-lg text-zinc-400 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950/20 cursor-pointer"><Edit2 className="h-3.5 w-3.5"/></button>
                          <button onClick={async()=>{if(!confirm('Delete coupon?'))return;await apiAction('DELETE',`/admin/coupons/${c._id}`);loadCoupons();}}
                            className="p-1.5 rounded-lg text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 cursor-pointer"><Trash2 className="h-3.5 w-3.5"/></button>
                        </div></td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Section>
          )}

        </main>
      </div>
    </div>
  );
}
