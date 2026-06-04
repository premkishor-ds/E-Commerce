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
  LogOut, 
  Sun, 
  Moon, 
  ShieldCheck, 
  Coins,
  Send,
  CheckCircle2,
  FileSpreadsheet
} from 'lucide-react';

export default function VendorPage() {
  const { user, login, logout, theme, toggleTheme } = useStore();
  const [mounted, setMounted] = useState(false);

  // Authentication Form States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Dashboard / Settlement States
  const [activeTab, setActiveTab] = useState('settlements');
  const [companyLegalName, setCompanyLegalName] = useState('NexaHome Brands Inc.');
  const [businessPhone, setBusinessPhone] = useState('+12025550156');
  const [bankName, setBankName] = useState('Bank of America');
  const [bankAccount, setBankAccount] = useState('•••• •••• 9918');
  const [routingCode, setRoutingCode] = useState('021000022');
  const [mfaEnabled, setMfaEnabled] = useState(false);

  const [settledAmount, setSettledAmount] = useState(4580.00);
  const [pendingAmount, setPendingAmount] = useState(1290.00);
  const [commissionRate, setCommissionRate] = useState(8); // 8% commission
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [payoutsHistory, setPayoutsHistory] = useState<Array<{ id: string; amount: number; date: string; status: string }>>([
    { id: 'PAY-8821', amount: 1500.00, date: 'May 28, 2026', status: 'Completed' },
    { id: 'PAY-8819', amount: 3080.00, date: 'May 15, 2026', status: 'Completed' }
  ]);

  useEffect(() => {
    setMounted(true);
    // Sync document theme classes on mount
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Vendor Catalog (brand filter)
  const vendorProducts = useMemo(() => {
    return PRODUCTS.filter((p) => p.brand === 'NexaHome' || p.brand === 'VeloSport');
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    const token = 'JWT-VENDOR-' + Math.random().toString(36).substring(2, 12);
    login(email, 'Vendor', token);
  };

  const handleWithdrawalRequest = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(withdrawAmount);
    if (!val || val <= 0 || val > pendingAmount) {
      alert('Invalid withdrawal amount or insufficient pending balance.');
      return;
    }

    setPendingAmount(prev => prev - val);
    setSettledAmount(prev => prev + val);
    setPayoutsHistory([
      {
        id: `PAY-${Math.floor(1000 + Math.random() * 9000)}`,
        amount: val,
        date: 'Just now',
        status: 'Completed'
      },
      ...payoutsHistory
    ]);
    setWithdrawAmount('');
    alert(`Transfer of $${val.toFixed(2)} to bank account succeeded!`);
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
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
              <Coins className="h-6 w-6" />
            </div>
            <h2 className="mt-4 text-3xl font-extrabold text-zinc-900 dark:text-white">ApexStore Vendor Console</h2>
            <p className="mt-2 text-sm text-zinc-500">Sign in to check wholesale settlements, payouts, and platform charges.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-400">
                <Mail className="h-5 w-5" />
              </span>
              <input
                type="email"
                required
                placeholder="Vendor Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-zinc-200 pl-10 pr-4 py-3 text-sm focus:border-indigo-500 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 text-zinc-900 dark:text-white"
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
                className="w-full rounded-xl border border-zinc-200 pl-10 pr-4 py-3 text-sm focus:border-indigo-500 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 text-zinc-900 dark:text-white"
              />
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 font-semibold text-white hover:bg-indigo-500 shadow-lg shadow-indigo-600/20 active:scale-95 transition-all text-sm cursor-pointer"
            >
              <span>Authenticate Vendor</span>
            </button>
          </form>

          <div className="flex justify-center pt-2">
            <button
              onClick={toggleTheme}
              className="p-2 text-zinc-400 hover:text-indigo-500 rounded-lg border dark:border-zinc-800 transition-colors"
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
          <div className="flex items-center gap-2 font-bold text-xl text-indigo-600 dark:text-indigo-400">
            <Coins className="h-6 w-6" />
            <span>ApexStore Vendor Console</span>
            <span className="hidden sm:inline-block text-[10px] ml-2 px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950/50 text-indigo-755 dark:text-indigo-300 font-semibold border border-indigo-200/50">
              Settlements
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden md:inline-block text-xs font-semibold text-zinc-500">
              Vendor: <strong className="text-zinc-800 dark:text-zinc-200">{user.email}</strong>
            </span>
            <button
              onClick={toggleTheme}
              className="p-2 text-zinc-500 hover:text-indigo-500 dark:text-zinc-400"
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
      <div className="flex-1 max-w-7xl w-full mx-auto flex animate-fade-in">
        {/* Sidebar Workspace */}
        <aside className="w-64 border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 flex flex-col justify-between hidden lg:flex">
          <div className="space-y-6">
            <div className="flex items-center gap-2 font-bold text-sm text-zinc-400 uppercase tracking-wider">
              <LayoutDashboard className="h-4 w-4 text-indigo-500" />
              <span>Accounting Console</span>
            </div>
            <nav className="space-y-1">
              <button 
                onClick={() => setActiveTab('settlements')}
                className={`w-full text-left rounded-xl px-4 py-2.5 text-xs font-semibold ${
                  activeTab === 'settlements' 
                    ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/20 dark:text-indigo-300 border border-indigo-100/50 dark:border-indigo-900/30' 
                    : 'text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/40'
                }`}
              >
                Settlements Overview
              </button>
              <button 
                onClick={() => setActiveTab('profile')}
                className={`w-full text-left rounded-xl px-4 py-2.5 text-xs font-semibold ${
                  activeTab === 'profile' 
                    ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/20 dark:text-indigo-300 border border-indigo-100/50 dark:border-indigo-900/30' 
                    : 'text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/40'
                }`}
              >
                Vendor Profile
              </button>
            </nav>
          </div>
          <div className="text-[10px] font-bold text-zinc-400/80 bg-zinc-50 dark:bg-zinc-950 border dark:border-zinc-800/80 p-3 rounded-lg flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-indigo-500 shrink-0" />
            <div className="truncate">
              <div>Secure Vault</div>
              <div className="font-normal text-[8px] truncate">{user.token}</div>
            </div>
          </div>
        </aside>

        {/* Main Panel Area */}
          {activeTab === 'settlements' ? (
            <>
              <div>
                <h1 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-white">Vendor Balance Sheets</h1>
                <p className="text-zinc-500 text-sm mt-1">Request transfers of pending payout funds, configure commission rate targets, and track invoice logs.</p>
              </div>

              {/* Settlement Metrics grid */}
              <section className="grid sm:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl border dark:bg-zinc-900 shadow-sm flex items-center justify-between dark:border-zinc-800">
                  <div>
                    <div className="text-xs text-zinc-400 font-bold uppercase tracking-wider">Settled Balance</div>
                    <div className="text-2xl font-black mt-1 text-zinc-900 dark:text-white">${settledAmount.toFixed(2)}</div>
                  </div>
                  <Wallet className="h-10 w-10 text-indigo-500 bg-indigo-50 dark:bg-indigo-950/20 p-2 rounded-xl border border-indigo-100/50 dark:border-indigo-900/30" />
                </div>

                <div className="bg-white p-6 rounded-2xl border dark:bg-zinc-900 shadow-sm flex items-center justify-between dark:border-zinc-800">
                  <div>
                    <div className="text-xs text-zinc-400 font-bold uppercase tracking-wider">Pending Payouts</div>
                    <div className="text-2xl font-black mt-1 text-zinc-900 dark:text-white">${pendingAmount.toFixed(2)}</div>
                  </div>
                  <Receipt className="h-10 w-10 text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20 p-2 rounded-xl border border-emerald-100/50 dark:border-emerald-900/30" />
                </div>

                <div className="bg-white p-6 rounded-2xl border dark:bg-zinc-900 shadow-sm flex items-center justify-between dark:border-zinc-800">
                  <div>
                    <div className="text-xs text-zinc-400 font-bold uppercase tracking-wider">Commission Charge</div>
                    <div className="text-2xl font-black mt-1 text-zinc-900 dark:text-white">{commissionRate}%</div>
                  </div>
                  <Percent className="h-10 w-10 text-amber-500 bg-amber-50 dark:bg-amber-955/20 p-2 rounded-xl border border-amber-100/50 dark:border-amber-900/30" />
                </div>
              </section>

              {/* Interactive Transfer Area */}
              <section className="grid md:grid-cols-2 gap-8">
                {/* Fund Withdrawal Request */}
                <div className="bg-white p-6 rounded-2xl border dark:bg-zinc-900 shadow-sm space-y-4 dark:border-zinc-800">
                  <h3 className="font-bold text-lg text-zinc-900 dark:text-white flex items-center gap-2 border-b pb-2 dark:border-zinc-800">
                    <Coins className="h-5 w-5 text-indigo-500" />
                    <span>Request Settlement Payout</span>
                  </h3>
                  <form onSubmit={handleWithdrawalRequest} className="space-y-4">
                    <div className="space-y-1">
                      <label className="block text-xs font-semibold text-zinc-500">
                        Withdrawal Amount ($)
                      </label>
                      <input
                        type="number"
                        required
                        step="0.01"
                        max={pendingAmount}
                        placeholder={`Max ${pendingAmount.toFixed(2)}`}
                        value={withdrawAmount}
                        onChange={(e) => setWithdrawAmount(e.target.value)}
                        className="w-full rounded-xl border border-zinc-200 bg-white p-3 text-sm focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 text-zinc-900 dark:text-white"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 font-semibold text-white hover:bg-indigo-500 shadow-md active:scale-95 transition-all text-xs cursor-pointer"
                    >
                      <Send className="h-4 w-4" />
                      <span>Execute Bank Settlement</span>
                    </button>
                  </form>
                </div>

                {/* Payout Logs Table */}
                <div className="bg-white p-6 rounded-2xl border dark:bg-zinc-900 shadow-sm space-y-4 dark:border-zinc-800">
                  <h3 className="font-bold text-lg text-zinc-900 dark:text-white flex items-center gap-2 border-b pb-2 dark:border-zinc-800">
                    <FileSpreadsheet className="h-5 w-5 text-emerald-500" />
                    <span>Transfer Ledgers</span>
                  </h3>
                  <div className="space-y-3 overflow-y-auto max-h-[160px]">
                    {payoutsHistory.map((log) => (
                      <div key={log.id} className="flex justify-between items-center p-3 rounded-xl border border-zinc-100 dark:border-zinc-850 bg-zinc-50/20 dark:bg-zinc-950/20">
                        <div>
                          <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">{log.id}</span>
                          <span className="ml-2 text-xs text-zinc-400">{log.date}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200">${log.amount.toFixed(2)}</span>
                          <span className="flex items-center gap-0.5 text-[9px] bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 font-bold px-2 py-0.5 rounded border border-emerald-100/50">
                            <CheckCircle2 className="h-2.5 w-2.5" />
                            {log.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* Wholesale Inventory lists */}
              <section className="bg-white p-6 rounded-2xl border dark:bg-zinc-900 shadow-sm space-y-4 dark:border-zinc-800">
                <h3 className="font-bold text-lg border-b pb-2">Wholesale Brand Supply Listings</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  {vendorProducts.map((p) => (
                    <div key={p.id} className="flex gap-4 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 items-center bg-zinc-50/30 dark:bg-zinc-900/30">
                      <img src={p.images[0]} alt={p.title} className="h-16 w-16 object-cover rounded-lg border dark:border-zinc-800 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-sm text-zinc-900 dark:text-white truncate">{p.title}</h4>
                        <p className="text-xs text-zinc-505 dark:text-zinc-400 mt-0.5">Wholesale: <strong className="text-zinc-900 dark:text-zinc-200">${p.price.toFixed(2)}</strong></p>
                        <p className="text-[10px] text-zinc-450 mt-0.5">Supply Brand: {p.brand} | SKU: {p.sku}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </>
          ) : (
            <section className="bg-white p-6 rounded-2xl border dark:bg-zinc-900 shadow-sm space-y-6 dark:border-zinc-800">
              <div>
                <h3 className="font-bold text-xl text-zinc-900 dark:text-white">Vendor Profile Settings</h3>
                <p className="text-xs text-zinc-500 mt-0.5">Configure supply brand company profile, bank routing details, and auth settings.</p>
              </div>

              <div className="grid sm:grid-cols-2 gap-6 border-b pb-6 dark:border-zinc-800">
                <div className="space-y-1">
                  <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block">Company Legal Name</label>
                  <input 
                    type="text" 
                    value={companyLegalName} onChange={e => setCompanyLegalName(e.target.value)}
                    className="w-full rounded-xl border border-zinc-200 bg-white p-3 text-xs focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 text-zinc-900 dark:text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block">Primary Business Phone</label>
                  <input 
                    type="text" 
                    value={businessPhone} onChange={e => setBusinessPhone(e.target.value)}
                    className="w-full rounded-xl border border-zinc-200 bg-white p-3 text-xs focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 text-zinc-900 dark:text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block">Account Email Address</label>
                  <input 
                    type="text" 
                    disabled value={user.email}
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50 p-3 text-xs focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 text-zinc-400"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block">Wholesale Commission Charge</label>
                  <input 
                    type="text" 
                    disabled value={`${commissionRate}%`}
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50 p-3 text-xs focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 text-zinc-400"
                  />
                </div>
              </div>

              {/* Bank Payout Setup */}
              <div className="border-b pb-6 dark:border-zinc-800 space-y-4">
                <h4 className="font-bold text-sm text-zinc-900 dark:text-white">Direct Deposit Bank Account</h4>
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
                <h4 className="font-bold text-sm text-zinc-900 dark:text-white">Partner Security options</h4>
                <div className="flex justify-between items-center bg-zinc-50 dark:bg-zinc-950/40 p-4 rounded-xl border dark:border-zinc-850">
                  <div>
                    <h5 className="font-bold text-xs">Two-Factor Authentication (MFA)</h5>
                    <p className="text-[10px] text-zinc-400">Force SMS/App OTP verification codes on console sign ins.</p>
                  </div>
                  <button 
                    onClick={() => {
                      setMfaEnabled(!mfaEnabled);
                      alert(`2FA Status modified for vendor!`);
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
                    alert('Vendor Profile Settings saved successfully (API synchronized)!');
                    setActiveTab('settlements');
                  }}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl px-4 py-2.5 text-xs font-semibold shadow cursor-pointer"
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
