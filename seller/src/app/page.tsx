'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useStore } from '../store/store';
import { PRODUCTS } from '../data/mockData';
import { 
  LayoutDashboard, 
  Wallet, 
  Percent, 
  Receipt, 
  Lock, 
  Mail, 
  Plus, 
  Trash2, 
  LogOut, 
  Sun, 
  Moon, 
  ShieldCheck, 
  Store,
  Box,
  Tag,
  DollarSign
} from 'lucide-react';

export default function SellerPage() {
  const { user, login, logout, theme, toggleTheme } = useStore();
  const [mounted, setMounted] = useState(false);

  // Authentication Form States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Dashboard States
  const [activeTab, setActiveTab] = useState('listings');
  const [shopName, setShopName] = useState('ApexTech Partner Shop');
  const [legalName, setLegalName] = useState('ApexTech Global LLC');
  const [bizPhone, setBizPhone] = useState('+12025550189');
  const [bankName, setBankName] = useState('Chase Bank');
  const [bankAccount, setBankAccount] = useState('•••• •••• 8821');
  const [routingCode, setRoutingCode] = useState('021000021');
  const [mfaEnabled, setMfaEnabled] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [catalog, setCatalog] = useState(() => PRODUCTS.filter(p => p.brand === 'ApexTech'));
  const [newTitle, setNewTitle] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newCategory, setNewCategory] = useState('Electronics');
  const [newSku, setNewSku] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Sync document theme classes on mount
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Statistics
  const commissionRate = 10; // 10% platform commission
  const totalSettledAmount = useMemo(() => {
    return catalog.reduce((sum, p) => sum + p.price * 12, 0); // Mock 12 sales per item
  }, [catalog]);
  const pendingSettlement = useMemo(() => {
    return catalog.reduce((sum, p) => sum + p.price * 1.5, 0); // Mock pending sales
  }, [catalog]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    const token = 'JWT-SELLER-' + Math.random().toString(36).substring(2, 12);
    login(email, 'Seller', token);
  };

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newPrice || !newSku) return;

    const newProd = {
      id: `custom-prod-${Date.now()}`,
      title: newTitle,
      description: 'Vendor custom-added product listing.',
      price: parseFloat(newPrice) || 0,
      category: newCategory,
      brand: 'ApexTech',
      sku: newSku,
      images: ['https://picsum.photos/seed/' + newSku + '/600/600'],
      tags: ['custom', 'seller-added'],
      averageRating: 5.0,
      specifications: [],
      faqs: [],
      reviews: []
    };

    setCatalog([newProd, ...catalog]);
    setNewTitle('');
    setNewPrice('');
    setNewSku('');
    setShowAddForm(false);
  };

  const handleDeleteProduct = (id: string) => {
    setCatalog(catalog.filter(p => p.id !== id));
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  // 1. Authentication View
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl border border-zinc-200/85 dark:bg-zinc-900 dark:border-zinc-800 shadow-xl transition-colors duration-300">
          <div className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
              <Store className="h-6 w-6" />
            </div>
            <h2 className="mt-4 text-3xl font-extrabold text-zinc-900 dark:text-white">ApexStore Seller Console</h2>
            <p className="mt-2 text-sm text-zinc-500">Sign in to manage product listings, pricing, and settlements.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">

            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-400">
                <Mail className="h-5 w-5" />
              </span>
              <input
                type="email"
                required
                placeholder="Seller Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-zinc-200 pl-10 pr-4 py-3 text-sm focus:border-emerald-500 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 text-zinc-900 dark:text-white"
              />
            </div>

            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-400">
                <Lock className="h-5 w-5" />
              </span>
              <input
                type="password"
                required
                placeholder="Console Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-zinc-200 pl-10 pr-4 py-3 text-sm focus:border-emerald-500 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 text-zinc-900 dark:text-white"
              />
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 font-semibold text-white hover:bg-emerald-500 shadow-lg shadow-emerald-600/20 active:scale-95 transition-all text-sm cursor-pointer"
            >
              <span>Authenticate Merchant</span>
            </button>
          </form>

          <div className="flex justify-center pt-2">
            <button
              onClick={toggleTheme}
              className="p-2 text-zinc-400 hover:text-emerald-500 rounded-lg border dark:border-zinc-800 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 2. Dashboard View
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col transition-colors duration-300">
      {/* Topbar */}
      <header className="sticky top-0 z-40 w-full border-b border-zinc-200/80 bg-white/80 backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-950/80 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl text-emerald-600 dark:text-emerald-400">
            <Store className="h-6 w-6" />
            <span>ApexStore Seller Console</span>
            <span className="hidden sm:inline-block text-[10px] ml-2 px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 font-semibold border border-emerald-200/50">
              Workspace
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden md:inline-block text-xs font-semibold text-zinc-500">
              Merchant: <strong className="text-zinc-800 dark:text-zinc-200">{user.email}</strong> ({user.role})
            </span>
            <button
              onClick={toggleTheme}
              className="p-2 text-zinc-500 hover:text-emerald-500 dark:text-zinc-400"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </button>
            <button
              onClick={logout}
              className="flex items-center gap-1.5 rounded-lg border border-zinc-200 px-3 py-1.5 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-900 cursor-pointer"
            >
              <LogOut className="h-3.5 w-3.5" />
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Workspace Panel */}
      <div className="flex-1 max-w-7xl w-full mx-auto flex">
        {/* Sidebar Workspace */}
        <aside className="w-64 border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 flex flex-col justify-between hidden lg:flex">
          <div className="space-y-6">
            <div className="flex items-center gap-2 font-bold text-sm text-zinc-400 uppercase tracking-wider">
              <LayoutDashboard className="h-4 w-4 text-emerald-500" />
              <span>Console Routes</span>
            </div>
            <nav className="space-y-1">
              <button 
                onClick={() => setActiveTab('listings')}
                className={`w-full text-left rounded-xl px-4 py-2.5 text-xs font-semibold ${
                  activeTab === 'listings' 
                    ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-300 border border-emerald-100/50 dark:border-emerald-900/30' 
                    : 'text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/40'
                }`}
              >
                Shop Listings
              </button>
              <button 
                onClick={() => setActiveTab('profile')}
                className={`w-full text-left rounded-xl px-4 py-2.5 text-xs font-semibold ${
                  activeTab === 'profile' 
                    ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-300 border border-emerald-100/50 dark:border-emerald-900/30' 
                    : 'text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/40'
                }`}
              >
                Merchant Profile
              </button>
            </nav>
          </div>
          <div className="text-[10px] font-bold text-zinc-400/80 bg-zinc-50 dark:bg-zinc-950 border dark:border-zinc-800/80 p-3 rounded-lg flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0" />
            <div className="truncate">
              <div>Secure Environment</div>
              <div className="font-normal text-[8px] truncate">{user.token}</div>
            </div>
          </div>
        </aside>

        {/* Main Panel Area */}
        <main className="flex-1 p-6 sm:p-8 space-y-8 overflow-y-auto">
          {activeTab === 'listings' ? (
            <>
              <div>
                <h1 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-white">Merchant Dashboard</h1>
                <p className="text-zinc-500 text-sm mt-1">Manage mock product catalogs, monitor commission settlements, and add new product revisions.</p>
              </div>

              {/* Settlement Metrics grid */}
              <section className="grid sm:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl border dark:bg-zinc-900 shadow-sm flex items-center justify-between dark:border-zinc-800">
                  <div>
                    <div className="text-xs text-zinc-400 font-bold uppercase tracking-wider">Settled Payouts</div>
                    <div className="text-2xl font-black mt-1 text-zinc-900 dark:text-white">${totalSettledAmount.toFixed(2)}</div>
                  </div>
                  <Wallet className="h-10 w-10 text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20 p-2 rounded-xl border border-emerald-100/50 dark:border-emerald-900/30" />
                </div>

                <div className="bg-white p-6 rounded-2xl border dark:bg-zinc-900 shadow-sm flex items-center justify-between dark:border-zinc-800">
                  <div>
                    <div className="text-xs text-zinc-400 font-bold uppercase tracking-wider">Pending Balance</div>
                    <div className="text-2xl font-black mt-1 text-zinc-900 dark:text-white">${pendingSettlement.toFixed(2)}</div>
                  </div>
                  <Receipt className="h-10 w-10 text-indigo-500 bg-indigo-50 dark:bg-indigo-950/20 p-2 rounded-xl border border-indigo-100/50 dark:border-indigo-900/30" />
                </div>

                <div className="bg-white p-6 rounded-2xl border dark:bg-zinc-900 shadow-sm flex items-center justify-between dark:border-zinc-800">
                  <div>
                    <div className="text-xs text-zinc-400 font-bold uppercase tracking-wider">Commission Charge</div>
                    <div className="text-2xl font-black mt-1 text-zinc-900 dark:text-white">{commissionRate}%</div>
                  </div>
                  <Percent className="h-10 w-10 text-amber-500 bg-amber-50 dark:bg-amber-950/20 p-2 rounded-xl border border-amber-100/50 dark:border-amber-900/30" />
                </div>
              </section>

              {/* Catalog Listings Header */}
              <section className="bg-white p-6 rounded-2xl border dark:bg-zinc-900 shadow-sm space-y-6 dark:border-zinc-800">
                <div className="flex items-center justify-between border-b pb-4 dark:border-zinc-850">
                  <div>
                    <h3 className="font-bold text-lg text-zinc-900 dark:text-white">Shop Listings Catalog</h3>
                    <p className="text-xs text-zinc-400 mt-0.5">Showing mock inventory products owned by brand <strong className="text-emerald-500">ApexTech</strong>.</p>
                  </div>
                  <button
                    onClick={() => setShowAddForm(!showAddForm)}
                    className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg px-3 py-1.5 text-xs font-semibold shadow transition-all cursor-pointer"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>New Listing</span>
                  </button>
                </div>

                {/* Add product simulator */}
                {showAddForm && (
                  <form onSubmit={handleAddProduct} className="bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800/80 p-4 rounded-xl space-y-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-600 flex items-center gap-1.5">
                      <Box className="h-4 w-4" />
                      <span>Configure New Mock Product</span>
                    </h4>
                    <div className="grid sm:grid-cols-4 gap-4">
                      <div className="sm:col-span-2 relative">
                        <input
                          type="text"
                          required
                          placeholder="Product Title (e.g. Apex Sound Pro)"
                          value={newTitle}
                          onChange={(e) => setNewTitle(e.target.value)}
                          className="w-full rounded-lg border border-zinc-200 bg-white p-2.5 text-xs focus:outline-none dark:border-zinc-800 dark:bg-zinc-900 text-zinc-900 dark:text-white"
                        />
                      </div>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-2 text-zinc-400">
                          <DollarSign className="h-3.5 w-3.5" />
                        </span>
                        <input
                          type="number"
                          required
                          step="0.01"
                          placeholder="Price"
                          value={newPrice}
                          onChange={(e) => setNewPrice(e.target.value)}
                          className="w-full rounded-lg border border-zinc-200 bg-white pl-7 pr-2.5 py-2.5 text-xs focus:outline-none dark:border-zinc-800 dark:bg-zinc-900 text-zinc-900 dark:text-white"
                        />
                      </div>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-2 text-zinc-400">
                          <Tag className="h-3.5 w-3.5" />
                        </span>
                        <input
                          type="text"
                          required
                          placeholder="SKU Code"
                          value={newSku}
                          onChange={(e) => setNewSku(e.target.value)}
                          className="w-full rounded-lg border border-zinc-200 bg-white pl-7 pr-2.5 py-2.5 text-xs focus:outline-none dark:border-zinc-800 dark:bg-zinc-900 text-zinc-900 dark:text-white"
                        />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="submit"
                        className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg px-3 py-1.5 text-xs font-semibold shadow cursor-pointer"
                      >
                        Save Listing
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowAddForm(false)}
                        className="border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-450 hover:bg-zinc-50 dark:hover:bg-zinc-800/40 rounded-lg px-3 py-1.5 text-xs font-semibold cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}

                {/* Catalog Grid */}
                <div className="grid sm:grid-cols-2 gap-4">
                  {catalog.map((p) => (
                    <div key={p.id} className="flex gap-4 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 items-center bg-zinc-50/30 dark:bg-zinc-900/30 group">
                      <img src={p.images[0]} alt={p.title} className="h-16 w-16 object-cover rounded-lg border dark:border-zinc-800 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-sm text-zinc-900 dark:text-white truncate">{p.title}</h4>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">Price: <strong className="text-zinc-900 dark:text-zinc-200">${p.price.toFixed(2)}</strong></p>
                        <p className="text-[10px] text-zinc-400 mt-0.5">SKU: {p.sku}</p>
                      </div>
                      <button
                        onClick={() => handleDeleteProduct(p.id)}
                        className="p-2 text-zinc-400 hover:text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/20 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                        aria-label="Delete listing"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </section>
            </>
          ) : (
            <section className="bg-white p-6 rounded-2xl border dark:bg-zinc-900 shadow-sm space-y-6 dark:border-zinc-800">
              <div>
                <h3 className="font-bold text-xl text-zinc-900 dark:text-white">Merchant Profile & Settings</h3>
                <p className="text-xs text-zinc-500 mt-0.5">Edit store details, payout preferences, and MFA security options.</p>
              </div>

              <div className="grid sm:grid-cols-2 gap-6 border-b pb-6 dark:border-zinc-800">
                <div className="space-y-1">
                  <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block">Shop Name</label>
                  <input 
                    type="text" 
                    value={shopName} onChange={e => setShopName(e.target.value)}
                    className="w-full rounded-xl border border-zinc-200 bg-white p-3 text-xs focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 text-zinc-900 dark:text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block">Business Entity Legal Name</label>
                  <input 
                    type="text" 
                    value={legalName} onChange={e => setLegalName(e.target.value)}
                    className="w-full rounded-xl border border-zinc-200 bg-white p-3 text-xs focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 text-zinc-900 dark:text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block">Merchant Phone Number</label>
                  <input 
                    type="text" 
                    value={bizPhone} onChange={e => setBizPhone(e.target.value)}
                    className="w-full rounded-xl border border-zinc-200 bg-white p-3 text-xs focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 text-zinc-900 dark:text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block">Platform Commission Rate</label>
                  <input 
                    type="text" 
                    disabled value="10%"
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50 p-3 text-xs focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 text-zinc-400"
                  />
                </div>
              </div>

              {/* Payout configuration */}
              <div className="border-b pb-6 dark:border-zinc-800 space-y-4">
                <h4 className="font-bold text-sm text-zinc-900 dark:text-white">Bank Payout Destination</h4>
                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block">Bank Name</label>
                    <input 
                      type="text" 
                      value={bankName} onChange={e => setBankName(e.target.value)}
                      className="w-full rounded-xl border border-zinc-200 bg-white p-3 text-xs focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 text-zinc-900 dark:text-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block">Account Number</label>
                    <input 
                      type="text" 
                      value={bankAccount} onChange={e => setBankAccount(e.target.value)}
                      className="w-full rounded-xl border border-zinc-200 bg-white p-3 text-xs focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 text-zinc-900 dark:text-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block">Routing Transit Code</label>
                    <input 
                      type="text" 
                      value={routingCode} onChange={e => setRoutingCode(e.target.value)}
                      className="w-full rounded-xl border border-zinc-200 bg-white p-3 text-xs focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 text-zinc-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Security and TFA toggling */}
              <div className="space-y-4 pt-2">
                <h4 className="font-bold text-sm text-zinc-900 dark:text-white">Merchant Dashboard Security</h4>
                <div className="flex justify-between items-center bg-zinc-50 dark:bg-zinc-950/40 p-4 rounded-xl border dark:border-zinc-850">
                  <div>
                    <h5 className="font-bold text-xs">Two-Factor Authentication (MFA)</h5>
                    <p className="text-[10px] text-zinc-400">Secure wholesale account logs with temporary verification codes.</p>
                  </div>
                  <button 
                    onClick={() => {
                      setMfaEnabled(!mfaEnabled);
                      alert(`2FA Status modified for seller!`);
                    }}
                    className={`rounded-xl px-4 py-2 text-xs font-bold shadow cursor-pointer transition-all ${
                      mfaEnabled ? 'bg-red-500 text-white' : 'bg-emerald-600 text-white'
                    }`}
                  >
                    {mfaEnabled ? 'Disable 2FA' : 'Enable 2FA'}
                  </button>
                </div>
              </div>

              <div className="flex gap-2">
                <button 
                  onClick={() => {
                    alert('Merchant Settings saved successfully (API synchronized)!');
                    setActiveTab('listings');
                  }}
                  className="bg-emerald-650 hover:bg-emerald-600 text-white rounded-xl px-4 py-2.5 text-xs font-semibold shadow cursor-pointer"
                >
                  Save Settings
                </button>
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}
