'use client';

import React, { useState, useEffect } from 'react';
import { useStore } from '../store/store';
import {
  LayoutDashboard, Wallet, Percent, Receipt, Lock, Mail, Plus, Trash2,
  LogOut, Sun, Moon, ShieldCheck, Coins, Send, CheckCircle2, FileSpreadsheet,
  Pencil, X, DollarSign, Tag, Package, ImageIcon, AlignLeft, Box, AlertCircle
} from 'lucide-react';

export default function VendorPage() {
  const { user, login, logout, theme, toggleTheme } = useStore();
  const [mounted, setMounted] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [vendorStatus, setVendorStatus] = useState('Verification In Progress');

  const [activeTab, setActiveTab] = useState('settlements');
  const [companyLegalName, setCompanyLegalName] = useState('NexaHome Brands Inc.');
  const [businessPhone, setBusinessPhone] = useState('+12025550156');
  const [bankName, setBankName] = useState('Bank of America');
  const [bankAccount, setBankAccount] = useState('•••• •••• 9918');
  const [routingCode, setRoutingCode] = useState('021000022');
  const [mfaEnabled, setMfaEnabled] = useState(false);

  const [settledAmount, setSettledAmount] = useState(0);
  const [pendingAmount, setPendingAmount] = useState(0);
  const [commissionRate, setCommissionRate] = useState(0);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [payoutsHistory, setPayoutsHistory] = useState<Array<{ id: string; amount: number; date: string; status: string }>>([]);

  const [vendorProducts, setVendorProducts] = useState<any[]>([]);
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
    const fetchVendorData = async () => {
      try {
        const [prodRes, settlementsRes, analyticsRes, profileRes] = await Promise.all([
          fetch(`http://localhost:5001/api/v1/catalog/products?vendorId=${user.id}`, {
            headers: { 'Authorization': `Bearer ${user.token}` }
          }),
          fetch('http://localhost:5001/api/v1/sales/vendor/settlements', {
            headers: { 'Authorization': `Bearer ${user.token}` }
          }),
          fetch('http://localhost:5001/api/v1/catalog/vendor/analytics', {
            headers: { 'Authorization': `Bearer ${user.token}` }
          }),
          fetch('http://localhost:5001/api/v1/profile/me', {
            headers: { 'Authorization': `Bearer ${user.token}` }
          })
        ]);

        if (prodRes.ok) {
          const data = await prodRes.json();
          setVendorProducts(data.map((p: any) => mapProduct(p)));
        }
        if (settlementsRes.ok) {
          const s = await settlementsRes.json();
          setSettledAmount(s.totalEarnings || 0);
          setPendingAmount(s.pendingSettlement || 0);
          setPayoutsHistory((s.settlements || []).map((s: any) => ({
            id: s._id?.toString().slice(-8).toUpperCase() || 'PAY-0000',
            amount: s.amount || 0,
            date: s.processedAt ? new Date(s.processedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A',
            status: s.status || 'Pending'
          })));
        }
        if (analyticsRes.ok) {
          const a = await analyticsRes.json();
          setCommissionRate(a.commissionRate || 10);
        }
        if (profileRes.ok) {
          const prof = await profileRes.json();
          setVendorStatus(prof.vendorStatus || 'Verification In Progress');
          setCompanyLegalName(prof.shopName || 'NexaHome Brands Inc.');
        }
      } catch (err) { console.error(err); }
    };
    fetchVendorData();
  }, [user]);

  function mapProduct(p: any) {
    return {
      id: p._id,
      title: p.title,
      description: p.description || '',
      price: p.price,
      category: p.category?.name || p.category || 'Electronics',
      categoryId: p.category?._id || p.category || '',
      brand: p.brand?.name || p.brand || 'NexaHome',
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
          roles: ['Vendor'],
          shopName: companyLegalName
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
    const brandObj = brands.find(b => b.name === 'NexaHome') || brands[0];
    try {
      const res = await fetch('http://localhost:5001/api/v1/catalog/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${user.token}` },
        body: JSON.stringify({
          title: newTitle,
          description: newDesc || 'Vendor wholesale product listing.',
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
      setVendorProducts([mapProduct({ ...p, category: { _id: newCategory, name: categories.find(c => c._id === newCategory)?.name } }), ...vendorProducts]);
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
      setVendorProducts(vendorProducts.map(p => p.id === editProduct.id ? mapProduct({ ...updated, _id: editProduct.id }) : p));
      setEditProduct(null);
    } catch (err: any) { alert(err.message); }
    finally { setEditLoading(false); }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!user || !confirm('Delete this product?')) return;
    try {
      const res = await fetch(`http://localhost:5001/api/v1/catalog/products/${id}`, {
        method: 'DELETE', headers: { 'Authorization': `Bearer ${user.token}` }
      });
      if (!res.ok) throw new Error('Failed to delete');
      setVendorProducts(vendorProducts.filter(p => p.id !== id));
    } catch (err: any) { alert(err.message); }
  };

  const handleWithdrawalRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(withdrawAmount);
    if (!val || val <= 0 || val > pendingAmount) {
      alert('Invalid withdrawal amount or insufficient pending balance.');
      return;
    }
    try {
      await fetch('http://localhost:5001/api/v1/payment/withdraw', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${user!.token}` },
        body: JSON.stringify({ amount: val })
      });
    } catch { /* optimistic update below */ }
    setPendingAmount(prev => prev - val);
    setSettledAmount(prev => prev + val);
    setPayoutsHistory([{
      id: `PAY-${Math.floor(1000 + Math.random() * 9000)}`,
      amount: val,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      status: 'Completed'
    }, ...payoutsHistory]);
    setWithdrawAmount('');
    alert(`Transfer of $${val.toFixed(2)} to bank account succeeded!`);
  };

  if (!mounted) return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
    </div>
  );

  if (!user) return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 px-4">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl border border-zinc-200/85 dark:bg-zinc-900 dark:border-zinc-800 shadow-xl">
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
            <Coins className="h-6 w-6" />
          </div>
          <h2 className="mt-4 text-3xl font-extrabold text-zinc-900 dark:text-white">ApexStore Vendor Console</h2>
          <p className="mt-2 text-sm text-zinc-500">
            {isRegisterMode ? 'Register a vendor partner account.' : 'Sign in to manage products, settlements, and payouts.'}
          </p>
        </div>
        <form onSubmit={isRegisterMode ? handleRegister : handleLogin} className="space-y-4">
          {isRegisterMode && (
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-400"><Coins className="h-5 w-5" /></span>
              <input type="text" required placeholder="Company Name" value={companyLegalName} onChange={e => setCompanyLegalName(e.target.value)}
                className="w-full rounded-xl border border-zinc-200 pl-10 pr-4 py-3 text-sm focus:border-indigo-500 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 text-zinc-900 dark:text-white" />
            </div>
          )}
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-400"><Mail className="h-5 w-5" /></span>
            <input type="email" required placeholder="Vendor Email Address" value={email} onChange={e => setEmail(e.target.value)}
              className="w-full rounded-xl border border-zinc-200 pl-10 pr-4 py-3 text-sm focus:border-indigo-500 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 text-zinc-900 dark:text-white" />
          </div>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-400"><Lock className="h-5 w-5" /></span>
            <input type="password" required placeholder="Console Password" value={password} onChange={e => setPassword(e.target.value)}
              className="w-full rounded-xl border border-zinc-200 pl-10 pr-4 py-3 text-sm focus:border-indigo-500 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 text-zinc-900 dark:text-white" />
          </div>
          <button type="submit" className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 font-semibold text-white hover:bg-indigo-500 shadow-lg active:scale-95 transition-all text-sm cursor-pointer">
            {isRegisterMode ? 'Register Vendor' : 'Authenticate Vendor'}
          </button>
        </form>
        <div className="text-center text-sm text-zinc-500">
          {isRegisterMode ? (
            <p>
              Already have an account?{' '}
              <button onClick={() => setIsRegisterMode(false)} className="text-indigo-600 font-semibold hover:underline bg-transparent border-0 cursor-pointer">
                Sign In
              </button>
            </p>
          ) : (
            <p>
              Don't have an account?{' '}
              <button onClick={() => setIsRegisterMode(true)} className="text-indigo-600 font-semibold hover:underline bg-transparent border-0 cursor-pointer">
                Register as Vendor
              </button>
            </p>
          )}
        </div>
        <div className="flex justify-center pt-2">
          <button onClick={toggleTheme} className="p-2 text-zinc-400 hover:text-indigo-500 rounded-lg border dark:border-zinc-800 bg-transparent cursor-pointer">
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
                <Pencil className="h-4 w-4 text-indigo-500" /> Edit Product
              </h3>
              <button onClick={() => setEditProduct(null)} className="p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 cursor-pointer">
                <X className="h-4 w-4" />
              </button>
            </div>
            <form onSubmit={handleEditProduct} className="space-y-3">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-1">Product Title</label>
                <input type="text" required value={editTitle} onChange={e => setEditTitle(e.target.value)}
                  className="w-full rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 p-2.5 text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-indigo-500" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-1">Price ($)</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-2 text-zinc-400"><DollarSign className="h-3.5 w-3.5" /></span>
                    <input type="number" required step="0.01" value={editPrice} onChange={e => setEditPrice(e.target.value)}
                      className="w-full rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 pl-7 pr-2.5 py-2.5 text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-indigo-500" />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-1">Stock</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-2 text-zinc-400"><Package className="h-3.5 w-3.5" /></span>
                    <input type="number" value={editStock} onChange={e => setEditStock(e.target.value)}
                      className="w-full rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 pl-7 pr-2.5 py-2.5 text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-indigo-500" />
                  </div>
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-1">Category</label>
                <select value={editCategory} onChange={e => setEditCategory(e.target.value)}
                  className="w-full rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 p-2.5 text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-indigo-500">
                  {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-1">Description</label>
                <div className="relative">
                  <span className="absolute top-2.5 left-2 text-zinc-400"><AlignLeft className="h-3.5 w-3.5" /></span>
                  <textarea rows={2} value={editDesc} onChange={e => setEditDesc(e.target.value)}
                    className="w-full rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 pl-7 pr-2.5 py-2.5 text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-indigo-500 resize-none" />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-1">Image URL</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-2 text-zinc-400"><ImageIcon className="h-3.5 w-3.5" /></span>
                  <input type="text" value={editImage} onChange={e => setEditImage(e.target.value)} placeholder="https://..."
                    className="w-full rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 pl-7 pr-2.5 py-2.5 text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-indigo-500" />
                </div>
              </div>
              <div className="flex gap-2 pt-1">
                <button type="submit" disabled={editLoading}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white rounded-lg py-2 text-xs font-semibold shadow cursor-pointer transition-all">
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
          <div className="flex items-center gap-2 font-bold text-xl text-indigo-600 dark:text-indigo-400">
            <Coins className="h-6 w-6" />
            <span>ApexStore Vendor Console</span>
            <span className={`hidden sm:inline-block text-[10px] ml-2 px-2 py-0.5 rounded-full font-semibold border ${
              vendorStatus === 'Active'
                ? 'bg-indigo-100 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border-indigo-200/50'
                : 'bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border-amber-200/50'
            }`}>{vendorStatus}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden md:inline-block text-xs font-semibold text-zinc-500">
              Vendor: <strong className="text-zinc-800 dark:text-zinc-200">{user.email}</strong>
            </span>
            <button onClick={toggleTheme} className="p-2 text-zinc-500 hover:text-indigo-500 dark:text-zinc-400">
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
              <LayoutDashboard className="h-4 w-4 text-indigo-500" /><span>Accounting Console</span>
            </div>
            <nav className="space-y-1">
              {[
                { key: 'settlements', label: 'Settlements Overview' },
                { key: 'products', label: 'Product Listings' },
                { key: 'profile', label: 'Vendor Profile' }
              ].map(tab => (
                <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                  className={`w-full text-left rounded-xl px-4 py-2.5 text-xs font-semibold ${activeTab === tab.key
                    ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/20 dark:text-indigo-300 border border-indigo-100/50 dark:border-indigo-900/30'
                    : 'text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/40'}`}>
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
          <div className="text-[10px] font-bold text-zinc-400/80 bg-zinc-50 dark:bg-zinc-950 border dark:border-zinc-800/80 p-3 rounded-lg flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-indigo-500 shrink-0" />
            <div className="truncate"><div>Secure Vault</div><div className="font-normal text-[8px] truncate">{user.token}</div></div>
          </div>
        </aside>

        <main className="flex-1 p-8 overflow-y-auto space-y-8">
          {/* Warning Banner if pending */}
          {vendorStatus !== 'Active' && (
            <div className="bg-amber-50 border border-amber-200 dark:bg-amber-950/20 dark:border-amber-900/30 rounded-2xl p-4 flex items-start gap-3 text-amber-800 dark:text-amber-300">
              <AlertCircle className="h-5 w-5 shrink-0 mt-0.5 text-amber-500" />
              <div>
                <h4 className="font-bold text-sm">Account Verification In Progress</h4>
                <p className="text-xs mt-1 leading-relaxed">
                  Your vendor account is currently under review by our administrators. You will be able to list new products and manage settlements as soon as your account is approved.
                </p>
              </div>
            </div>
          )}

          {/* SETTLEMENTS TAB */}
          {activeTab === 'settlements' && (
            <>
              <div>
                <h1 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-white">Vendor Balance Sheets</h1>
                <p className="text-zinc-500 text-sm mt-1">Request transfers of pending payout funds and track invoice logs.</p>
              </div>

              <section className="grid sm:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl border dark:bg-zinc-900 shadow-sm flex items-center justify-between dark:border-zinc-800">
                  <div>
                    <div className="text-xs text-zinc-400 font-bold uppercase tracking-wider">Settled Balance</div>
                    <div className="text-2xl font-black mt-1 text-zinc-900 dark:text-white">${settledAmount.toFixed(2)}</div>
                  </div>
                  <Wallet className="h-10 w-10 text-indigo-500 bg-indigo-50 dark:bg-indigo-950/20 p-2 rounded-xl border border-indigo-100/50" />
                </div>
                <div className="bg-white p-6 rounded-2xl border dark:bg-zinc-900 shadow-sm flex items-center justify-between dark:border-zinc-800">
                  <div>
                    <div className="text-xs text-zinc-400 font-bold uppercase tracking-wider">Pending Payouts</div>
                    <div className="text-2xl font-black mt-1 text-zinc-900 dark:text-white">${pendingAmount.toFixed(2)}</div>
                  </div>
                  <Receipt className="h-10 w-10 text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20 p-2 rounded-xl border border-emerald-100/50" />
                </div>
                <div className="bg-white p-6 rounded-2xl border dark:bg-zinc-900 shadow-sm flex items-center justify-between dark:border-zinc-800">
                  <div>
                    <div className="text-xs text-zinc-400 font-bold uppercase tracking-wider">Commission Charge</div>
                    <div className="text-2xl font-black mt-1 text-zinc-900 dark:text-white">{commissionRate}%</div>
                  </div>
                  <Percent className="h-10 w-10 text-amber-500 bg-amber-50 dark:bg-amber-950/20 p-2 rounded-xl border border-amber-100/50" />
                </div>
              </section>

              <section className="grid md:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-2xl border dark:bg-zinc-900 shadow-sm space-y-4 dark:border-zinc-800">
                  <h3 className="font-bold text-lg text-zinc-900 dark:text-white flex items-center gap-2 border-b pb-2 dark:border-zinc-800">
                    <Coins className="h-5 w-5 text-indigo-500" /><span>Request Settlement Payout</span>
                  </h3>
                  <form onSubmit={handleWithdrawalRequest} className="space-y-4">
                    <div className="space-y-1">
                      <label className="block text-xs font-semibold text-zinc-500">Withdrawal Amount ($)</label>
                      <input type="number" required step="0.01" max={pendingAmount} disabled={vendorStatus !== 'Active'}
                        placeholder={vendorStatus === 'Active' ? `Max ${pendingAmount.toFixed(2)}` : 'Verification Pending'} value={withdrawAmount}
                        onChange={e => setWithdrawAmount(e.target.value)}
                        className="w-full rounded-xl border border-zinc-200 bg-white p-3 text-sm focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 text-zinc-900 dark:text-white disabled:opacity-50" />
                    </div>
                    <button type="submit" disabled={vendorStatus !== 'Active'} className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 font-semibold text-white hover:bg-indigo-500 shadow-md active:scale-95 transition-all text-xs cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
                      <Send className="h-4 w-4" /><span>Execute Bank Settlement</span>
                    </button>
                  </form>
                </div>

                <div className="bg-white p-6 rounded-2xl border dark:bg-zinc-900 shadow-sm space-y-4 dark:border-zinc-800">
                  <h3 className="font-bold text-lg text-zinc-900 dark:text-white flex items-center gap-2 border-b pb-2 dark:border-zinc-800">
                    <FileSpreadsheet className="h-5 w-5 text-emerald-500" /><span>Transfer Ledgers</span>
                  </h3>
                  <div className="space-y-3 overflow-y-auto max-h-[160px]">
                    {payoutsHistory.length === 0 && <p className="text-xs text-zinc-400 text-center py-4">No payout history yet.</p>}
                    {payoutsHistory.map(log => (
                      <div key={log.id} className="flex justify-between items-center p-3 rounded-xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50/20 dark:bg-zinc-950/20">
                        <div>
                          <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">{log.id}</span>
                          <span className="ml-2 text-xs text-zinc-400">{log.date}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200">${log.amount.toFixed(2)}</span>
                          <span className="flex items-center gap-0.5 text-[9px] bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 font-bold px-2 py-0.5 rounded border border-emerald-100/50">
                            <CheckCircle2 className="h-2.5 w-2.5" />{log.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            </>
          )}

          {/* PRODUCTS TAB */}
          {activeTab === 'products' && (
            <>
              <div>
                <h1 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-white">Product Listings</h1>
                <p className="text-zinc-500 text-sm mt-1">Add, edit, and manage your wholesale supply catalog.</p>
              </div>

              <section className="bg-white p-6 rounded-2xl border dark:bg-zinc-900 shadow-sm space-y-6 dark:border-zinc-800">
                <div className="flex items-center justify-between border-b pb-4 dark:border-zinc-800">
                  <div>
                    <h3 className="font-bold text-lg text-zinc-900 dark:text-white">Wholesale Supply Catalog</h3>
                    <p className="text-xs text-zinc-400 mt-0.5">{vendorProducts.length} product{vendorProducts.length !== 1 ? 's' : ''} listed</p>
                  </div>
                  {vendorStatus === 'Active' ? (
                    <button onClick={() => setShowAddForm(!showAddForm)}
                      className="flex items-center gap-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg px-3 py-1.5 text-xs font-semibold shadow cursor-pointer">
                      <Plus className="h-3.5 w-3.5" /><span>New Product</span>
                    </button>
                  ) : (
                    <span className="text-xs text-amber-600 dark:text-amber-400 font-bold bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/30 px-3 py-1.5 rounded-lg flex items-center gap-1">
                      <AlertCircle className="h-3.5 w-3.5" /> Verification Pending
                    </span>
                  )}
                </div>

                {showAddForm && (
                  <form onSubmit={handleAddProduct} className="bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800/80 p-4 rounded-xl space-y-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-600 flex items-center gap-1.5">
                      <Box className="h-4 w-4" /><span>New Wholesale Product</span>
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
                      <button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg px-3 py-1.5 text-xs font-semibold shadow cursor-pointer">Save Product</button>
                      <button type="button" onClick={() => setShowAddForm(false)} className="border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/40 rounded-lg px-3 py-1.5 text-xs font-semibold cursor-pointer">Cancel</button>
                    </div>
                  </form>
                )}

                <div className="grid sm:grid-cols-2 gap-4">
                  {vendorProducts.length === 0 && (
                    <p className="col-span-2 text-center text-sm text-zinc-400 py-8">No products yet. Add your first wholesale listing.</p>
                  )}
                  {vendorProducts.map(p => (
                    <div key={p.id} className="flex gap-4 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 items-center bg-zinc-50/30 dark:bg-zinc-900/30 group">
                      <img src={p.images[0]} alt={p.title} className="h-16 w-16 object-cover rounded-lg border dark:border-zinc-800 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-sm text-zinc-900 dark:text-white truncate">{p.title}</h4>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">Wholesale: <strong className="text-zinc-900 dark:text-zinc-200">${p.price.toFixed(2)}</strong> · Stock: <strong className="text-zinc-900 dark:text-zinc-200">{p.stock}</strong></p>
                        <p className="text-[10px] text-zinc-400 mt-0.5">Brand: {p.brand} · SKU: {p.sku}</p>
                      </div>
                      <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => openEditModal(p)} className="p-2 text-zinc-400 hover:text-indigo-500 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-950/20 cursor-pointer" aria-label="Edit">
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

          {/* PROFILE TAB */}
          {activeTab === 'profile' && (
            <section className="bg-white p-6 rounded-2xl border dark:bg-zinc-900 shadow-sm space-y-6 dark:border-zinc-800">
              <div>
                <h3 className="font-bold text-xl text-zinc-900 dark:text-white">Vendor Profile Settings</h3>
                <p className="text-xs text-zinc-500 mt-0.5">Configure company profile, bank routing details, and auth settings.</p>
              </div>
              <div className="grid sm:grid-cols-2 gap-6 border-b pb-6 dark:border-zinc-800">
                <div className="space-y-1">
                  <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block">Company Legal Name</label>
                  <input type="text" value={companyLegalName} onChange={e => setCompanyLegalName(e.target.value)}
                    className="w-full rounded-xl border border-zinc-200 bg-white p-3 text-xs focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 text-zinc-900 dark:text-white" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block">Primary Business Phone</label>
                  <input type="text" value={businessPhone} onChange={e => setBusinessPhone(e.target.value)}
                    className="w-full rounded-xl border border-zinc-200 bg-white p-3 text-xs focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 text-zinc-900 dark:text-white" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block">Account Email</label>
                  <input type="text" disabled value={user.email}
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50 p-3 text-xs focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 text-zinc-400" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block">Commission Rate</label>
                  <input type="text" disabled value={`${commissionRate}%`}
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50 p-3 text-xs focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 text-zinc-400" />
                </div>
              </div>
              <div className="border-b pb-6 dark:border-zinc-800 space-y-4">
                <h4 className="font-bold text-sm text-zinc-900 dark:text-white">Direct Deposit Bank Account</h4>
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
                <h4 className="font-bold text-sm text-zinc-900 dark:text-white">Partner Security</h4>
                <div className="flex justify-between items-center bg-zinc-50 dark:bg-zinc-950/40 p-4 rounded-xl border dark:border-zinc-800">
                  <div>
                    <h5 className="font-bold text-xs">Two-Factor Authentication (MFA)</h5>
                    <p className="text-[10px] text-zinc-400">Force OTP verification on console sign ins.</p>
                  </div>
                  <button onClick={() => { setMfaEnabled(!mfaEnabled); alert('2FA status updated!'); }}
                    className={`rounded-xl px-4 py-2 text-xs font-bold shadow cursor-pointer transition-all ${mfaEnabled ? 'bg-red-500 text-white' : 'bg-indigo-600 text-white'}`}>
                    {mfaEnabled ? 'Disable 2FA' : 'Enable 2FA'}
                  </button>
                </div>
              </div>
              <button onClick={() => { alert('Vendor settings saved!'); setActiveTab('settlements'); }}
                className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl px-4 py-2.5 text-xs font-semibold shadow cursor-pointer">
                Save Settings
              </button>
            </section>
          )}

        </main>
      </div>
    </div>
  );
}
