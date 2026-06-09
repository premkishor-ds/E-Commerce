'use client';

import React, { useState, useEffect } from 'react';
import { useStore } from '../store/store';
import {
  LayoutDashboard, Wallet, Percent, Receipt, Lock, Mail, Plus, Trash2,
  LogOut, Sun, Moon, ShieldCheck, Store, Box, Tag, DollarSign, Pencil, X, ImageIcon, AlignLeft, Package,
  AlertCircle, ShoppingCart, Star, BarChart3, Bell, HelpCircle, ArrowUpRight
} from 'lucide-react';

export default function SellerPage() {
  const { user, login, logout, theme, toggleTheme } = useStore();
  const [mounted, setMounted] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [vendorStatus, setVendorStatus] = useState('Verification In Progress');

  const [activeTab, setActiveTab] = useState('dashboard');
  const [shopName, setShopName] = useState('ApexTech Partner Shop');
  const [legalName, setLegalName] = useState('ApexTech Global LLC');
  const [bizPhone, setBizPhone] = useState('+12025550189');
  const [bankName, setBankName] = useState('Chase Bank');
  const [bankAccount, setBankAccount] = useState('•••• •••• 8821');
  const [routingCode, setRoutingCode] = useState('021000021');
  const [mfaEnabled, setMfaEnabled] = useState(false);

  const [catalog, setCatalog] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);

  // Add form
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [newSku, setNewSku] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newStock, setNewStock] = useState('50');
  const [newImage, setNewImage] = useState('');

  // Edit modal
  const [editProduct, setEditProduct] = useState<any | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editPrice, setEditPrice] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editStock, setEditStock] = useState('');
  const [editImage, setEditImage] = useState('');
  const [editLoading, setEditLoading] = useState(false);

  const commissionRate = 10;
  const [totalSettledAmount, setTotalSettledAmount] = useState(0);
  const [pendingSettlement, setPendingSettlement] = useState(0);

  // Expanded Tab States
  const [orders, setOrders] = useState<any[]>([]);
  const [withdrawals, setWithdrawals] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [tickets, setTickets] = useState<any[]>([]);
  const [analyticsData, setAnalyticsData] = useState<any>({
    conversionRate: 2.4,
    salesCount: 124,
    revenueHistory: [3200, 4100, 3900, 5200, 6100, 7500],
  });

  // Support inputs
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketMessage, setTicketMessage] = useState('');

  // Withdrawal input
  const [withdrawAmount, setWithdrawAmount] = useState('');

  useEffect(() => {
    setMounted(true);
    if (theme === 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [theme]);

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const [catRes, brandRes] = await Promise.all([
          fetch('http://localhost:5001/api/v1/catalog/categories'),
          fetch('http://localhost:5001/api/v1/catalog/brands')
        ]);
        if (catRes.ok) {
          const catData = await catRes.json();
          setCategories(catData);
          if (catData.length > 0) setNewCategory(catData[0]._id);
        }
        if (brandRes.ok) setBrands(await brandRes.json());
      } catch (err) { console.error(err); }
    };
    fetchMetadata();
  }, []);

  useEffect(() => {
    if (!user) return;
    const fetchSellerData = async () => {
      try {
        const [catalogRes, settlementsRes, profileRes, ordersRes, ticketsRes, notifyRes] = await Promise.all([
          fetch(`http://localhost:5001/api/v1/catalog/products?vendorId=${user.id}`),
          fetch('http://localhost:5001/api/v1/sales/vendor/settlements', {
            headers: { 'Authorization': `Bearer ${user.token}` }
          }),
          fetch('http://localhost:5001/api/v1/profile/me', {
            headers: { 'Authorization': `Bearer ${user.token}` }
          }),
          fetch('http://localhost:5001/api/v1/sales/orders', {
            headers: { 'Authorization': `Bearer ${user.token}` }
          }),
          fetch('http://localhost:5001/api/v1/support/tickets', {
            headers: { 'Authorization': `Bearer ${user.token}` }
          }),
          fetch('http://localhost:5001/api/v1/notifications', {
            headers: { 'Authorization': `Bearer ${user.token}` }
          })
        ]);
        if (catalogRes.ok) {
          const data = await catalogRes.json();
          setCatalog(data.map((p: any) => mapProduct(p)));
        }
        if (settlementsRes.ok) {
          const s = await settlementsRes.json();
          setTotalSettledAmount(s.totalEarnings || 0);
          setPendingSettlement(s.pendingSettlement || 0);
          setWithdrawals(s.history || [
            { id: '1', amount: 350.00, status: 'Completed', processedAt: '2026-06-05' },
            { id: '2', amount: 150.00, status: 'Pending', processedAt: null }
          ]);
        }
        if (profileRes.ok) {
          const prof = await profileRes.json();
          setVendorStatus(prof.vendorStatus || 'Active');
          setShopName(prof.shopName || 'ApexTech Partner Shop');
        }
        if (ordersRes.ok) {
          setOrders(await ordersRes.json());
        } else {
          setOrders([
            { id: 'ORD-9921', customerName: 'John Doe', total: 249.99, status: 'Shipped', date: '2026-06-08' },
            { id: 'ORD-8822', customerName: 'Sarah Smith', total: 89.50, status: 'Paid', date: '2026-06-09' }
          ]);
        }
        if (ticketsRes.ok) {
          setTickets(await ticketsRes.json());
        } else {
          setTickets([
            { id: 'TKT-102', subject: 'API access keys clarification', status: 'Open', priority: 'Medium' }
          ]);
        }
        if (notifyRes.ok) {
          setNotifications(await notifyRes.json());
        } else {
          setNotifications([
            { id: '1', title: 'Payout Processed Successfully', message: 'Your payment of $350.00 was sent to your bank account.', isRead: false },
            { id: '2', title: 'Low Stock Alert', message: 'Product ApexTech Smart Watch is low in stock.', isRead: true }
          ]);
        }
        setReviews([
          { id: 'REV-01', rating: 5, comment: 'Excellent product! Super high quality.', customerName: 'Alex Jones', fakeScore: 5 },
          { id: 'REV-02', rating: 2, comment: 'Delivery was slightly delayed.', customerName: 'Emma Watson', fakeScore: 12 }
        ]);
      } catch (err) { console.error(err); }
    };
    fetchSellerData();
  }, [user]);

  function mapProduct(p: any) {
    return {
      id: p._id,
      title: p.title,
      description: p.description || '',
      price: p.price,
      category: p.category?.name || p.category || 'Electronics',
      categoryId: p.category?._id || p.category || '',
      brand: p.brand?.name || p.brand || 'ApexTech',
      sku: p.sku,
      stock: p.stock ?? 0,
      images: p.images && p.images.length > 0 ? p.images : ['https://picsum.photos/seed/' + p.sku + '/600/600'],
      tags: p.tags || []
    };
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5001/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      if (!res.ok) throw new Error('Invalid credentials');
      const data = await res.json();
      login(data.user.email, data.user.roles[0], data.accessToken, data.user.id);
    } catch (err: any) { alert(err.message); }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5001/api/v1/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          roles: ['Seller'],
          shopName
        })
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || 'Registration failed');
      }
      const data = await res.json();
      login(data.user.email, data.user.roles[0], data.accessToken, data.user.id);
    } catch (err: any) { alert(err.message); }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const brandObj = brands.find(b => b.name === 'ApexTech');
    try {
      const res = await fetch('http://localhost:5001/api/v1/catalog/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${user.token}` },
        body: JSON.stringify({
          title: newTitle,
          description: newDesc || 'Seller product listing.',
          price: parseFloat(newPrice) || 0,
          category: newCategory,
          brand: brandObj?._id,
          sku: newSku,
          stock: parseInt(newStock) || 50,
          images: newImage ? [newImage] : []
        })
      });
      if (!res.ok) { const e = await res.json(); throw new Error(e.message || 'Failed'); }
      const p = await res.json();
      setCatalog([mapProduct({ ...p, category: { _id: newCategory, name: categories.find(c => c._id === newCategory)?.name } }), ...catalog]);
      setNewTitle(''); setNewPrice(''); setNewSku(''); setNewDesc(''); setNewStock('50'); setNewImage('');
      setShowAddForm(false);
    } catch (err: any) { alert(err.message); }
  };

  const openEditModal = (p: any) => {
    setEditProduct(p);
    setEditTitle(p.title);
    setEditPrice(String(p.price));
    setEditDesc(p.description || '');
    setEditCategory(p.categoryId || '');
    setEditStock(String(p.stock ?? ''));
    setEditImage(p.images?.[0] || '');
  };

  const handleEditProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !editProduct) return;
    setEditLoading(true);
    try {
      const res = await fetch(`http://localhost:5001/api/v1/catalog/products/${editProduct.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${user.token}` },
        body: JSON.stringify({
          title: editTitle,
          price: parseFloat(editPrice) || 0,
          description: editDesc,
          category: editCategory || undefined,
          stock: parseInt(editStock) || 0,
          images: editImage ? [editImage] : editProduct.images
        })
      });
      if (!res.ok) { const e = await res.json(); throw new Error(e.message || 'Failed to update'); }
      const updated = await res.json();
      setCatalog(catalog.map(p => p.id === editProduct.id ? mapProduct({ ...updated, _id: editProduct.id }) : p));
      setEditProduct(null);
    } catch (err: any) { alert(err.message); }
    finally { setEditLoading(false); }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!user || !confirm('Delete this listing?')) return;
    try {
      const res = await fetch(`http://localhost:5001/api/v1/catalog/products/${id}`, {
        method: 'DELETE', headers: { 'Authorization': `Bearer ${user.token}` }
      });
      if (!res.ok) throw new Error('Failed to delete');
      setCatalog(catalog.filter(p => p.id !== id));
    } catch (err: any) { alert(err.message); }
  };

  if (!mounted) return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
    </div>
  );

  if (!user) return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 px-4">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl border border-zinc-200/85 dark:bg-zinc-900 dark:border-zinc-800 shadow-xl">
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
            <Store className="h-6 w-6" />
          </div>
          <h2 className="mt-4 text-3xl font-extrabold text-zinc-900 dark:text-white">ApexStore Seller Console</h2>
          <p className="mt-2 text-sm text-zinc-500">
            {isRegisterMode ? 'Register a merchant account to start listing.' : 'Sign in to manage product listings, pricing, and settlements.'}
          </p>
        </div>
        <form onSubmit={isRegisterMode ? handleRegister : handleLogin} className="space-y-4">
          {isRegisterMode && (
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-400"><Store className="h-5 w-5" /></span>
              <input type="text" required placeholder="Shop Name" value={shopName} onChange={e => setShopName(e.target.value)}
                className="w-full rounded-xl border border-zinc-200 pl-10 pr-4 py-3 text-sm focus:border-emerald-500 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 text-zinc-900 dark:text-white" />
            </div>
          )}
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-400"><Mail className="h-5 w-5" /></span>
            <input type="email" required placeholder="Seller Email Address" value={email} onChange={e => setEmail(e.target.value)}
              className="w-full rounded-xl border border-zinc-200 pl-10 pr-4 py-3 text-sm focus:border-emerald-500 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 text-zinc-900 dark:text-white" />
          </div>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-400"><Lock className="h-5 w-5" /></span>
            <input type="password" required placeholder="Console Password" value={password} onChange={e => setPassword(e.target.value)}
              className="w-full rounded-xl border border-zinc-200 pl-10 pr-4 py-3 text-sm focus:border-emerald-500 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 text-zinc-900 dark:text-white" />
          </div>
          <button type="submit" className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 font-semibold text-white hover:bg-emerald-500 shadow-lg active:scale-95 transition-all text-sm cursor-pointer">
            {isRegisterMode ? 'Register Merchant' : 'Authenticate Merchant'}
          </button>
        </form>
        <div className="text-center text-sm text-zinc-500">
          {isRegisterMode ? (
            <p>
              Already have an account?{' '}
              <button onClick={() => setIsRegisterMode(false)} className="text-emerald-600 font-semibold hover:underline bg-transparent border-0 cursor-pointer">
                Sign In
              </button>
            </p>
          ) : (
            <p>
              Don't have an account?{' '}
              <button onClick={() => setIsRegisterMode(true)} className="text-emerald-600 font-semibold hover:underline bg-transparent border-0 cursor-pointer">
                Register as Seller
              </button>
            </p>
          )}
        </div>
        <div className="flex justify-center pt-2">
          <button onClick={toggleTheme} className="p-2 text-zinc-400 hover:text-emerald-500 rounded-lg border dark:border-zinc-800 bg-transparent cursor-pointer">
            {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col transition-colors duration-300">
      {/* Edit Modal */}
      {editProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border dark:border-zinc-800 shadow-2xl w-full max-w-lg p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-zinc-900 dark:text-white flex items-center gap-2">
                <Pencil className="h-4 w-4 text-emerald-500" /> Edit Listing
              </h3>
              <button onClick={() => setEditProduct(null)} className="p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 cursor-pointer">
                <X className="h-4 w-4" />
              </button>
            </div>
            <form onSubmit={handleEditProduct} className="space-y-3">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-1">Product Title</label>
                <input type="text" required value={editTitle} onChange={e => setEditTitle(e.target.value)}
                  className="w-full rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 p-2.5 text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-emerald-500" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-1">Price ($)</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-2 text-zinc-400"><DollarSign className="h-3.5 w-3.5" /></span>
                    <input type="number" required step="0.01" value={editPrice} onChange={e => setEditPrice(e.target.value)}
                      className="w-full rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 pl-7 pr-2.5 py-2.5 text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-emerald-500" />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-1">Stock</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-2 text-zinc-400"><Package className="h-3.5 w-3.5" /></span>
                    <input type="number" value={editStock} onChange={e => setEditStock(e.target.value)}
                      className="w-full rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 pl-7 pr-2.5 py-2.5 text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-emerald-500" />
                  </div>
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-1">Category</label>
                <select value={editCategory} onChange={e => setEditCategory(e.target.value)}
                  className="w-full rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 p-2.5 text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-emerald-500">
                  {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-1">Description</label>
                <div className="relative">
                  <span className="absolute top-2.5 left-2 text-zinc-400"><AlignLeft className="h-3.5 w-3.5" /></span>
                  <textarea rows={2} value={editDesc} onChange={e => setEditDesc(e.target.value)}
                    className="w-full rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 pl-7 pr-2.5 py-2.5 text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-emerald-500 resize-none" />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-1">Image URL</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-2 text-zinc-400"><ImageIcon className="h-3.5 w-3.5" /></span>
                  <input type="text" value={editImage} onChange={e => setEditImage(e.target.value)} placeholder="https://..."
                    className="w-full rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 pl-7 pr-2.5 py-2.5 text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-emerald-500" />
                </div>
              </div>
              <div className="flex gap-2 pt-1">
                <button type="submit" disabled={editLoading}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 text-white rounded-lg py-2 text-xs font-semibold shadow cursor-pointer transition-all">
                  {editLoading ? 'Saving...' : 'Save Changes'}
                </button>
                <button type="button" onClick={() => setEditProduct(null)}
                  className="border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-lg px-4 py-2 text-xs font-semibold cursor-pointer">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Topbar */}
      <header className="sticky top-0 z-40 w-full border-b border-zinc-200/80 bg-white/80 backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-950/80 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl text-emerald-600 dark:text-emerald-400">
            <Store className="h-6 w-6" />
            <span>ApexStore Seller Console</span>
            <span className={`hidden sm:inline-block text-[10px] ml-2 px-2 py-0.5 rounded-full font-semibold border ${
              vendorStatus === 'Active'
                ? 'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-200/50'
                : 'bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border-amber-200/50'
            }`}>{vendorStatus}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden md:inline-block text-xs font-semibold text-zinc-500">
              Merchant: <strong className="text-zinc-800 dark:text-zinc-200">{user.email}</strong> ({user.role})
            </span>
            <button onClick={toggleTheme} className="p-2 text-zinc-500 hover:text-emerald-500 dark:text-zinc-400">
              {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </button>
            <button onClick={logout} className="flex items-center gap-1.5 rounded-lg border border-zinc-200 px-3 py-1.5 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-900 cursor-pointer">
              <LogOut className="h-3.5 w-3.5" /> Sign Out
            </button>
          </div>
        </div>
      </header>

      <div className="flex-1 max-w-7xl w-full mx-auto flex">
        {/* Sidebar */}
        <aside className="w-64 border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 flex flex-col justify-between hidden lg:flex">
          <div className="space-y-6">
            <div className="flex items-center gap-2 font-bold text-sm text-zinc-400 uppercase tracking-wider">
              <LayoutDashboard className="h-4 w-4 text-emerald-500" /><span>Console Routes</span>
            </div>
            <nav className="space-y-1">
              {[
                { id: 'dashboard', label: 'Overview', icon: <LayoutDashboard className="h-4 w-4" /> },
                { id: 'listings', label: 'Listings', icon: <Box className="h-4 w-4" /> },
                { id: 'inventory', label: 'Inventory', icon: <Package className="h-4 w-4" /> },
                { id: 'orders', label: 'Orders', icon: <ShoppingCart className="h-4 w-4" /> },
                { id: 'revenue', label: 'Revenue & Payouts', icon: <Wallet className="h-4 w-4" /> },
                { id: 'reviews', label: 'Reviews', icon: <Star className="h-4 w-4" /> },
                { id: 'analytics', label: 'Analytics', icon: <BarChart3 className="h-4 w-4" /> },
                { id: 'notifications', label: 'Notifications', icon: <Bell className="h-4 w-4" /> },
                { id: 'support', label: 'Support', icon: <HelpCircle className="h-4 w-4" /> },
                { id: 'profile', label: 'Profile', icon: <Store className="h-4 w-4" /> }
              ].map(tab => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                  className={`w-full text-left rounded-xl px-4 py-2 flex items-center gap-2.5 text-xs font-semibold transition-all ${activeTab === tab.id
                    ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-300 border border-emerald-100/50 dark:border-emerald-900/30'
                    : 'text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/40'}`}>
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
          <div className="text-[10px] font-bold text-zinc-400/80 bg-zinc-50 dark:bg-zinc-950 border dark:border-zinc-800/80 p-3 rounded-lg flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0" />
            <div className="truncate"><div>Secure Environment</div><div className="font-normal text-[8px] truncate">{user.token}</div></div>
          </div>
        </aside>

        <main className="flex-1 p-6 sm:p-8 space-y-8 overflow-y-auto">

          {activeTab === 'dashboard' && (
            <>
              <div>
                <h1 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-white">Store Overview</h1>
                <p className="text-zinc-500 text-sm mt-1">Real-time performance metrics, balance overview, and top selling products.</p>
              </div>
              <section className="grid sm:grid-cols-4 gap-6">
                {[
                  { label: 'Settled Payouts', value: `$${totalSettledAmount.toFixed(2)}`, icon: <Wallet className="h-10 w-10 text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20 p-2 rounded-xl" /> },
                  { label: 'Pending Balance', value: `$${pendingSettlement.toFixed(2)}`, icon: <Receipt className="h-10 w-10 text-indigo-500 bg-indigo-50 dark:bg-indigo-950/20 p-2 rounded-xl" /> },
                  { label: 'Total Orders', value: orders.length, icon: <ShoppingCart className="h-10 w-10 text-rose-500 bg-rose-50 dark:bg-rose-950/20 p-2 rounded-xl" /> },
                  { label: 'Conversion Rate', value: `${analyticsData.conversionRate}%`, icon: <BarChart3 className="h-10 w-10 text-amber-500 bg-amber-50 dark:bg-amber-950/20 p-2 rounded-xl" /> }
                ].map(s => (
                  <div key={s.label} className="bg-white p-6 rounded-2xl border dark:bg-zinc-900 shadow-sm flex items-center justify-between dark:border-zinc-800">
                    <div>
                      <div className="text-xs text-zinc-400 font-bold uppercase tracking-wider">{s.label}</div>
                      <div className="text-2xl font-black mt-1 text-zinc-900 dark:text-white">{s.value}</div>
                    </div>
                    {s.icon}
                  </div>
                ))}
              </section>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-2xl border dark:bg-zinc-900 dark:border-zinc-800 shadow-sm space-y-4">
                  <h3 className="font-bold text-sm text-zinc-800 dark:text-zinc-200 uppercase tracking-wider">Top Performing Products</h3>
                  <div className="space-y-3">
                    {catalog.slice(0, 3).map(p => (
                      <div key={p.id} className="flex justify-between items-center border-b pb-2 dark:border-zinc-800">
                        <div>
                          <div className="font-bold text-xs text-zinc-900 dark:text-white">{p.title}</div>
                          <div className="text-[10px] text-zinc-400">SKU: {p.sku}</div>
                        </div>
                        <div className="text-xs font-bold text-emerald-600">${p.price.toFixed(2)}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border dark:bg-zinc-900 dark:border-zinc-800 shadow-sm space-y-4">
                  <h3 className="font-bold text-sm text-zinc-800 dark:text-zinc-200 uppercase tracking-wider">Recent Orders</h3>
                  <div className="space-y-3">
                    {orders.slice(0, 3).map(o => (
                      <div key={o.id} className="flex justify-between items-center border-b pb-2 dark:border-zinc-800">
                        <div>
                          <div className="font-bold text-xs text-zinc-900 dark:text-white">{o.customerName}</div>
                          <div className="text-[10px] text-zinc-400">ID: {o.id} · {o.date}</div>
                        </div>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${o.status === 'Shipped' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'}`}>{o.status}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'listings' && (
            <>
              <div>
                <h1 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-white">Merchant Listings</h1>
                <p className="text-zinc-500 text-sm mt-1">Manage product listings, monitor commission settlements, add and edit products.</p>
              </div>

              {/* Stats */}
              <section className="grid sm:grid-cols-3 gap-6">
                {[
                  { label: 'Settled Payouts', value: `$${totalSettledAmount.toFixed(2)}`, icon: <Wallet className="h-10 w-10 text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20 p-2 rounded-xl" /> },
                  { label: 'Pending Balance', value: `$${pendingSettlement.toFixed(2)}`, icon: <Receipt className="h-10 w-10 text-indigo-500 bg-indigo-50 dark:bg-indigo-950/20 p-2 rounded-xl" /> },
                  { label: 'Commission Charge', value: `${commissionRate}%`, icon: <Percent className="h-10 w-10 text-amber-500 bg-amber-50 dark:bg-amber-950/20 p-2 rounded-xl" /> }
                ].map(s => (
                  <div key={s.label} className="bg-white p-6 rounded-2xl border dark:bg-zinc-900 shadow-sm flex items-center justify-between dark:border-zinc-800">
                    <div>
                      <div className="text-xs text-zinc-400 font-bold uppercase tracking-wider">{s.label}</div>
                      <div className="text-2xl font-black mt-1 text-zinc-900 dark:text-white">{s.value}</div>
                    </div>
                    {s.icon}
                  </div>
                ))}
              </section>

              {/* Catalog */}
              <section className="bg-white p-6 rounded-2xl border dark:bg-zinc-900 shadow-sm space-y-6 dark:border-zinc-800">
                <div className="flex items-center justify-between border-b pb-4 dark:border-zinc-800">
                  <div>
                    <h3 className="font-bold text-lg text-zinc-900 dark:text-white">Shop Listings Catalog</h3>
                    <p className="text-xs text-zinc-400 mt-0.5">{catalog.length} product{catalog.length !== 1 ? 's' : ''} in your store</p>
                  </div>
                  {vendorStatus === 'Active' ? (
                    <button onClick={() => setShowAddForm(!showAddForm)}
                      className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg px-3 py-1.5 text-xs font-semibold shadow cursor-pointer">
                      <Plus className="h-3.5 w-3.5" /><span>New Listing</span>
                    </button>
                  ) : (
                    <span className="text-xs text-amber-600 dark:text-amber-400 font-bold bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/30 px-3 py-1.5 rounded-lg flex items-center gap-1">
                      <AlertCircle className="h-3.5 w-3.5" /> Verification Pending
                    </span>
                  )}
                </div>

                {showAddForm && (
                  <form onSubmit={handleAddProduct} className="bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800/80 p-4 rounded-xl space-y-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-600 flex items-center gap-1.5">
                      <Box className="h-4 w-4" /><span>New Product</span>
                    </h4>
                    <div className="grid sm:grid-cols-2 gap-3">
                      <input type="text" required placeholder="Product Title" value={newTitle} onChange={e => setNewTitle(e.target.value)}
                        className="rounded-lg border border-zinc-200 bg-white p-2.5 text-xs focus:outline-none dark:border-zinc-800 dark:bg-zinc-900 text-zinc-900 dark:text-white" />
                      <select value={newCategory} onChange={e => setNewCategory(e.target.value)}
                        className="rounded-lg border border-zinc-200 bg-white p-2.5 text-xs focus:outline-none dark:border-zinc-800 dark:bg-zinc-900 text-zinc-900 dark:text-white">
                        {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                      </select>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-2 text-zinc-400"><DollarSign className="h-3.5 w-3.5" /></span>
                        <input type="number" required step="0.01" placeholder="Price" value={newPrice} onChange={e => setNewPrice(e.target.value)}
                          className="w-full rounded-lg border border-zinc-200 bg-white pl-7 pr-2.5 py-2.5 text-xs focus:outline-none dark:border-zinc-800 dark:bg-zinc-900 text-zinc-900 dark:text-white" />
                      </div>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-2 text-zinc-400"><Tag className="h-3.5 w-3.5" /></span>
                        <input type="text" required placeholder="SKU Code" value={newSku} onChange={e => setNewSku(e.target.value)}
                          className="w-full rounded-lg border border-zinc-200 bg-white pl-7 pr-2.5 py-2.5 text-xs focus:outline-none dark:border-zinc-800 dark:bg-zinc-900 text-zinc-900 dark:text-white" />
                      </div>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-2 text-zinc-400"><Package className="h-3.5 w-3.5" /></span>
                        <input type="number" placeholder="Stock" value={newStock} onChange={e => setNewStock(e.target.value)}
                          className="w-full rounded-lg border border-zinc-200 bg-white pl-7 pr-2.5 py-2.5 text-xs focus:outline-none dark:border-zinc-800 dark:bg-zinc-900 text-zinc-900 dark:text-white" />
                      </div>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-2 text-zinc-400"><ImageIcon className="h-3.5 w-3.5" /></span>
                        <input type="text" placeholder="Image URL (optional)" value={newImage} onChange={e => setNewImage(e.target.value)}
                          className="w-full rounded-lg border border-zinc-200 bg-white pl-7 pr-2.5 py-2.5 text-xs focus:outline-none dark:border-zinc-800 dark:bg-zinc-900 text-zinc-900 dark:text-white" />
                      </div>
                    </div>
                    <textarea rows={2} placeholder="Description (optional)" value={newDesc} onChange={e => setNewDesc(e.target.value)}
                      className="w-full rounded-lg border border-zinc-200 bg-white p-2.5 text-xs focus:outline-none dark:border-zinc-800 dark:bg-zinc-900 text-zinc-900 dark:text-white resize-none" />
                    <div className="flex gap-2">
                      <button type="submit" className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg px-3 py-1.5 text-xs font-semibold shadow cursor-pointer">Save Listing</button>
                      <button type="button" onClick={() => setShowAddForm(false)} className="border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/40 rounded-lg px-3 py-1.5 text-xs font-semibold cursor-pointer">Cancel</button>
                    </div>
                  </form>
                )}

                <div className="grid sm:grid-cols-2 gap-4">
                  {catalog.length === 0 && (
                    <p className="col-span-2 text-center text-sm text-zinc-400 py-8">No products yet. Add your first listing.</p>
                  )}
                  {catalog.map(p => (
                    <div key={p.id} className="flex gap-4 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 items-center bg-zinc-50/30 dark:bg-zinc-900/30 group">
                      <img src={p.images[0]} alt={p.title} className="h-16 w-16 object-cover rounded-lg border dark:border-zinc-800 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-sm text-zinc-900 dark:text-white truncate">{p.title}</h4>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">Price: <strong className="text-zinc-900 dark:text-zinc-200">${p.price.toFixed(2)}</strong> · Stock: <strong className="text-zinc-900 dark:text-zinc-200">{p.stock}</strong></p>
                        <p className="text-[10px] text-zinc-400 mt-0.5">SKU: {p.sku} · {p.category}</p>
                      </div>
                      <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => openEditModal(p)} className="p-2 text-zinc-400 hover:text-emerald-500 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-950/20 cursor-pointer" aria-label="Edit">
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button onClick={() => handleDeleteProduct(p.id)} className="p-2 text-zinc-400 hover:text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/20 cursor-pointer" aria-label="Delete">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </>
          )}

          {activeTab === 'inventory' && (
            <section className="bg-white p-6 rounded-2xl border dark:bg-zinc-900 shadow-sm space-y-6 dark:border-zinc-800">
              <div>
                <h3 className="font-bold text-xl text-zinc-900 dark:text-white">Inventory & Stock Levels</h3>
                <p className="text-xs text-zinc-500 mt-0.5">Track low stock items and replenish inventory warehouses.</p>
              </div>
              <div className="space-y-4">
                {catalog.map(p => (
                  <div key={p.id} className="flex justify-between items-center border-b pb-3 dark:border-zinc-800">
                    <div>
                      <div className="font-bold text-sm text-zinc-900 dark:text-white">{p.title}</div>
                      <div className="text-xs text-zinc-400">SKU: {p.sku}</div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${p.stock < 10 ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'}`}>
                        {p.stock} Units
                      </span>
                      <button onClick={() => alert('Restock order placed!')}
                        className="bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 px-3 py-1.5 rounded-lg text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                        Restock +50
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {activeTab === 'orders' && (
            <section className="bg-white p-6 rounded-2xl border dark:bg-zinc-900 shadow-sm space-y-6 dark:border-zinc-800">
              <div>
                <h3 className="font-bold text-xl text-zinc-900 dark:text-white">Customer Orders</h3>
                <p className="text-xs text-zinc-500 mt-0.5">Manage customer purchase orders, updates status and track shipping.</p>
              </div>
              <div className="space-y-4">
                {orders.map(o => (
                  <div key={o.id} className="flex justify-between items-center border-b pb-3 dark:border-zinc-800">
                    <div>
                      <div className="font-bold text-sm text-zinc-900 dark:text-white">{o.customerName}</div>
                      <div className="text-xs text-zinc-400">Order ID: {o.id} · Date: {o.date}</div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-sm font-bold text-zinc-900 dark:text-white">${o.total.toFixed(2)}</div>
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-amber-100 text-amber-800">{o.status}</span>
                      </div>
                      <button onClick={() => alert('Order status marked as Shipped!')}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg px-3 py-1.5 text-xs font-semibold">
                        Ship Order
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {activeTab === 'revenue' && (
            <section className="bg-white p-6 rounded-2xl border dark:bg-zinc-900 shadow-sm space-y-6 dark:border-zinc-800">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-xl text-zinc-900 dark:text-white">Revenue settlements & Withdrawals</h3>
                  <p className="text-xs text-zinc-500 mt-0.5">Request payouts to your registered bank account.</p>
                </div>
                <div className="flex gap-2">
                  <input type="number" placeholder="Amt ($)" value={withdrawAmount} onChange={e => setWithdrawAmount(e.target.value)}
                    className="border dark:border-zinc-800 dark:bg-zinc-950 text-zinc-900 dark:text-white p-2 rounded-lg text-xs w-24 focus:outline-none" />
                  <button onClick={() => { if(!withdrawAmount) return; alert(`Requested withdrawal of $${withdrawAmount}`); setWithdrawAmount(''); }}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg px-3 py-1.5 text-xs font-semibold flex items-center gap-1">
                    <ArrowUpRight className="h-3 w-3" /> Withdraw
                  </button>
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="font-bold text-xs uppercase tracking-wider text-zinc-400">Payout History</h4>
                {withdrawals.map(w => (
                  <div key={w.id} className="flex justify-between items-center border-b pb-3 dark:border-zinc-800">
                    <div>
                      <div className="font-bold text-sm text-zinc-900 dark:text-white">${w.amount.toFixed(2)}</div>
                      <div className="text-xs text-zinc-400">Date: {w.processedAt || 'Pending Review'}</div>
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${w.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>{w.status}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {activeTab === 'reviews' && (
            <section className="bg-white p-6 rounded-2xl border dark:bg-zinc-900 shadow-sm space-y-6 dark:border-zinc-800">
              <div>
                <h3 className="font-bold text-xl text-zinc-900 dark:text-white">Customer Reviews</h3>
                <p className="text-xs text-zinc-500 mt-0.5">Manage reviews left by customers and review system-generated AI authenticity scores.</p>
              </div>
              <div className="space-y-4">
                {reviews.map(r => (
                  <div key={r.id} className="border border-zinc-100 dark:border-zinc-800 rounded-xl p-4 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-xs text-zinc-900 dark:text-white">{r.customerName}</span>
                      <div className="flex items-center gap-1 text-[10px] text-amber-500 font-bold">
                        <Star className="h-3 w-3 fill-amber-500" /> {r.rating} / 5
                      </div>
                    </div>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400">{r.comment}</p>
                    <div className="flex justify-between items-center text-[10px] pt-1">
                      <span className="text-zinc-400">AI Fraud Risk: <strong className="text-rose-500">{r.fakeScore}%</strong></span>
                      <button onClick={() => alert('Reply registered!')} className="text-emerald-600 font-semibold hover:underline">Reply</button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {activeTab === 'analytics' && (
            <section className="bg-white p-6 rounded-2xl border dark:bg-zinc-900 shadow-sm space-y-6 dark:border-zinc-800">
              <div>
                <h3 className="font-bold text-xl text-zinc-900 dark:text-white">Sales & Payout Analytics</h3>
                <p className="text-xs text-zinc-500 mt-0.5">Sales analytics trends, monthly metrics, and conversion rates.</p>
              </div>
              <div className="space-y-4">
                <div className="flex items-end gap-2 h-32 pt-6">
                  {analyticsData.revenueHistory.map((val: number, idx: number) => (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                      <div className="bg-emerald-600 rounded-t w-full" style={{ height: `${(val / 8000) * 100}%` }}></div>
                      <span className="text-[10px] text-zinc-400">M{idx+1}</span>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-4 text-center pt-4 border-t dark:border-zinc-800">
                  <div>
                    <div className="text-xs text-zinc-400 font-semibold">Total Revenue</div>
                    <div className="text-lg font-bold text-zinc-900 dark:text-white">$30,800</div>
                  </div>
                  <div>
                    <div className="text-xs text-zinc-400 font-semibold">Average Ticket Size</div>
                    <div className="text-lg font-bold text-zinc-900 dark:text-white">$248.38</div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {activeTab === 'notifications' && (
            <section className="bg-white p-6 rounded-2xl border dark:bg-zinc-900 shadow-sm space-y-6 dark:border-zinc-800">
              <div>
                <h3 className="font-bold text-xl text-zinc-900 dark:text-white">Merchant Notifications</h3>
                <p className="text-xs text-zinc-500 mt-0.5">Recent system alerts, order notifications, and verification status.</p>
              </div>
              <div className="space-y-3">
                {notifications.map(n => (
                  <div key={n.id} className={`p-4 rounded-xl border flex gap-3 ${n.isRead ? 'border-zinc-100 bg-zinc-50/50 dark:border-zinc-800/80 dark:bg-zinc-900/40' : 'border-emerald-200 bg-emerald-50/20 dark:border-emerald-900/30'}`}>
                    <Bell className={`h-5 w-5 shrink-0 ${n.isRead ? 'text-zinc-400' : 'text-emerald-500'}`} />
                    <div>
                      <h4 className="font-bold text-xs text-zinc-900 dark:text-white">{n.title}</h4>
                      <p className="text-[11px] text-zinc-600 dark:text-zinc-400 mt-0.5">{n.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {activeTab === 'support' && (
            <section className="bg-white p-6 rounded-2xl border dark:bg-zinc-900 shadow-sm space-y-6 dark:border-zinc-800">
              <div>
                <h3 className="font-bold text-xl text-zinc-900 dark:text-white">Support & Help Tickets</h3>
                <p className="text-xs text-zinc-500 mt-0.5">Submit support queries and view ticket statuses.</p>
              </div>
              <form onSubmit={e => { e.preventDefault(); if(!ticketSubject) return; setTickets([...tickets, { id: 'TKT-NEW', subject: ticketSubject, status: 'Open', priority: 'Medium' }]); setTicketSubject(''); setTicketMessage(''); alert('Support ticket created!'); }}
                className="space-y-3 bg-zinc-50 dark:bg-zinc-950 p-4 rounded-xl">
                <h4 className="font-bold text-xs text-zinc-800 dark:text-zinc-200 uppercase tracking-wider">Submit New Ticket</h4>
                <input type="text" placeholder="Subject" value={ticketSubject} onChange={e => setTicketSubject(e.target.value)} required
                  className="w-full rounded-lg border border-zinc-200 bg-white p-2.5 text-xs focus:outline-none dark:border-zinc-800 dark:bg-zinc-900 text-zinc-900 dark:text-white" />
                <textarea placeholder="Message details" value={ticketMessage} onChange={e => setTicketMessage(e.target.value)} rows={3}
                  className="w-full rounded-lg border border-zinc-200 bg-white p-2.5 text-xs focus:outline-none dark:border-zinc-800 dark:bg-zinc-900 text-zinc-900 dark:text-white resize-none" />
                <button type="submit" className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg px-3 py-1.5 text-xs font-semibold">Submit Ticket</button>
              </form>
              <div className="space-y-3">
                <h4 className="font-bold text-xs uppercase tracking-wider text-zinc-400">Your Tickets</h4>
                {tickets.map(t => (
                  <div key={t.id} className="flex justify-between items-center border-b pb-3 dark:border-zinc-800">
                    <div>
                      <div className="font-bold text-sm text-zinc-900 dark:text-white">{t.subject}</div>
                      <div className="text-xs text-zinc-400">ID: {t.id} · Priority: {t.priority}</div>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-amber-100 text-amber-800">{t.status}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {activeTab === 'profile' && (
            <section className="bg-white p-6 rounded-2xl border dark:bg-zinc-900 shadow-sm space-y-6 dark:border-zinc-800">
              <div>
                <h3 className="font-bold text-xl text-zinc-900 dark:text-white">Merchant Profile & Settings</h3>
                <p className="text-xs text-zinc-500 mt-0.5">Edit store details, payout preferences, and MFA security options.</p>
              </div>
              <div className="grid sm:grid-cols-2 gap-6 border-b pb-6 dark:border-zinc-800">
                {[
                  { label: 'Shop Name', value: shopName, setter: setShopName },
                  { label: 'Business Entity Legal Name', value: legalName, setter: setLegalName },
                  { label: 'Merchant Phone Number', value: bizPhone, setter: setBizPhone }
                ].map(f => (
                  <div key={f.label} className="space-y-1">
                    <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block">{f.label}</label>
                    <input type="text" value={f.value} onChange={e => f.setter(e.target.value)}
                      className="w-full rounded-xl border border-zinc-200 bg-white p-3 text-xs focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 text-zinc-900 dark:text-white" />
                  </div>
                ))}
                <div className="space-y-1">
                  <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block">Platform Commission Rate</label>
                  <input type="text" disabled value="10%" className="w-full rounded-xl border border-zinc-200 bg-zinc-50 p-3 text-xs focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 text-zinc-400" />
                </div>
              </div>
              <div className="border-b pb-6 dark:border-zinc-800 space-y-4">
                <h4 className="font-bold text-sm text-zinc-900 dark:text-white">Bank Payout Destination</h4>
                <div className="grid sm:grid-cols-3 gap-4">
                  {[
                    { label: 'Bank Name', value: bankName, setter: setBankName },
                    { label: 'Account Number', value: bankAccount, setter: setBankAccount },
                    { label: 'Routing Transit Code', value: routingCode, setter: setRoutingCode }
                  ].map(f => (
                    <div key={f.label} className="space-y-1">
                      <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block">{f.label}</label>
                      <input type="text" value={f.value} onChange={e => f.setter(e.target.value)}
                        className="w-full rounded-xl border border-zinc-200 bg-white p-3 text-xs focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 text-zinc-900 dark:text-white" />
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-4 pt-2">
                <h4 className="font-bold text-sm text-zinc-900 dark:text-white">Merchant Dashboard Security</h4>
                <div className="flex justify-between items-center bg-zinc-50 dark:bg-zinc-950/40 p-4 rounded-xl border dark:border-zinc-800">
                  <div>
                    <h5 className="font-bold text-xs">Two-Factor Authentication (MFA)</h5>
                    <p className="text-[10px] text-zinc-400">Secure account with temporary verification codes.</p>
                  </div>
                  <button onClick={() => { setMfaEnabled(!mfaEnabled); alert('2FA status updated!'); }}
                    className={`rounded-xl px-4 py-2 text-xs font-bold shadow cursor-pointer transition-all ${mfaEnabled ? 'bg-red-500 text-white' : 'bg-emerald-600 text-white'}`}>
                    {mfaEnabled ? 'Disable 2FA' : 'Enable 2FA'}
                  </button>
                </div>
              </div>
              <button onClick={() => { alert('Settings saved!'); setActiveTab('dashboard'); }}
                className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl px-4 py-2.5 text-xs font-semibold shadow cursor-pointer">
                Save Settings
              </button>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}
