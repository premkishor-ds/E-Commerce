'use client';

import Link from 'next/link';
import { useStore } from '../store/store';
import { ShoppingCart, Heart, User, LogOut, LayoutDashboard, Shield, Headphones, ShoppingBag, Sun, Moon, Search } from 'lucide-react';
import React, { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PRODUCTS } from '../data/mockData';

const placeholders = [
  'Search headphones...',
  'Search multi-cooker...',
  'Search training leggings...',
  'Search carbon bicycle...',
  'Search wireless earbuds...',
  'Search smart watches...'
];

export default function Header() {
  const { cart, wishlist, user, logout, theme, toggleTheme } = useStore();
  const [showCartDrawer, setShowCartDrawer] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [placeholderText, setPlaceholderText] = useState('Search products...');
  const router = useRouter();

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Animated typing placeholder loop
  useEffect(() => {
    let currentWordIdx = 0;
    let currentCharIdx = 0;
    let isDeleting = false;
    let typingSpeed = 100;
    let active = true;

    const cycle = () => {
      if (!active) return;
      const currentWord = placeholders[currentWordIdx];
      
      if (isDeleting) {
        setPlaceholderText(currentWord.substring(0, currentCharIdx - 1));
        currentCharIdx--;
        typingSpeed = 50;
      } else {
        setPlaceholderText(currentWord.substring(0, currentCharIdx + 1));
        currentCharIdx++;
        typingSpeed = 100;
      }

      if (!isDeleting && currentCharIdx === currentWord.length) {
        typingSpeed = 2000; // Pause at the end of the word
        isDeleting = true;
      } else if (isDeleting && currentCharIdx === 0) {
        isDeleting = false;
        currentWordIdx = (currentWordIdx + 1) % placeholders.length;
        typingSpeed = 500; // Pause before next word
      }

      setTimeout(cycle, typingSpeed);
    };

    const timeoutId = setTimeout(cycle, typingSpeed);
    return () => {
      active = false;
      clearTimeout(timeoutId);
    };
  }, []);

  // Compute live product suggestions as user types
  const suggestions = useMemo(() => {
    if (searchQuery.trim().length < 2) return [];
    const q = searchQuery.toLowerCase();
    return PRODUCTS.filter((p) =>
      p.title.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    ).slice(0, 5);
  }, [searchQuery]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-zinc-200/80 bg-white/80 backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-950/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo & Navigation */}
        <div className="flex items-center gap-6 flex-1">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl text-indigo-600 dark:text-indigo-400 shrink-0">
            <ShoppingBag className="h-6 w-6" />
            <span>ApexStore</span>
          </Link>
          <nav className="hidden lg:flex items-center gap-4 text-sm font-medium text-zinc-600 dark:text-zinc-400 shrink-0">
            <Link href="/" className="hover:text-indigo-600 dark:hover:text-indigo-400">Home</Link>
            <Link href="/support" className="hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-1">
              <Headphones className="h-4 w-4" /> Support Help
            </Link>
            <Link href="/search" className="hover:text-indigo-600 dark:hover:text-indigo-400">Browse Catalog</Link>
          </nav>
          
          {/* Header Search Bar */}
          <form onSubmit={handleSearchSubmit} className="hidden md:flex relative max-w-xs w-full ml-4">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-400">
              <Search className="h-4 w-4" />
            </span>
            <input
                type="text"
                placeholder={mounted ? placeholderText : 'Search products...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                suppressHydrationWarning
                className="w-full rounded-xl border border-zinc-200 pl-10 pr-4 py-1.5 text-xs focus:border-indigo-500 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 text-zinc-900 dark:text-white"
              />
            
            {/* Live Dropdown Suggestions */}
            {suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-lg overflow-hidden z-50">
                {suggestions.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => {
                      router.push(`/product/${p.id}`);
                      setSearchQuery('');
                    }}
                    className="w-full text-left px-4 py-2.5 hover:bg-zinc-50 dark:hover:bg-zinc-800/40 flex items-center gap-3 transition-colors border-b last:border-b-0 border-zinc-100 dark:border-zinc-800/40"
                  >
                    <img src={p.images[0]} alt={p.title} className="h-8 w-8 rounded object-cover shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-zinc-900 dark:text-white truncate">{p.title}</p>
                      <p className="text-[10px] text-zinc-400 truncate">{p.brand} in {p.category}</p>
                    </div>
                    <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 shrink-0">${p.price.toFixed(2)}</span>
                  </button>
                ))}
              </div>
            )}
          </form>
        </div>

        {/* Search Bar / Actions */}
        <div className="flex items-center gap-4">
          {/* Wishlist Link */}
          <Link href="/wishlist" className="relative p-2 text-zinc-600 hover:text-red-500 dark:text-zinc-400">
            <Heart className="h-5 w-5" />
            {wishlist.length > 0 && (
              <span className="absolute top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                {wishlist.length}
              </span>
            )}
          </Link>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2 text-zinc-600 hover:text-indigo-600 dark:text-zinc-400"
            aria-label="Toggle theme"
          >
            {!mounted || theme === 'light' ? (
              <Moon className="h-5 w-5" />
            ) : (
              <Sun className="h-5 w-5" />
            )}
          </button>

          {/* Cart Icon */}
          <button
            onClick={() => setShowCartDrawer(true)}
            className="relative p-2 text-zinc-600 hover:text-indigo-600 dark:text-zinc-400"
          >
            <ShoppingCart className="h-5 w-5" />
            {cart.length > 0 && (
              <span className="absolute top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white">
                {cart.reduce((sum, item) => sum + item.quantity, 0)}
              </span>
            )}
          </button>

          {/* Auth Actions / Dashboards */}
          {user ? (
            <div className="flex items-center gap-3">
              {/* User Profile Badge (Clickable Link to Profile Page) */}
              <Link
                href="/profile"
                className="flex items-center gap-1.5 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 px-3 py-1.5 text-xs font-semibold text-zinc-700 dark:text-zinc-300 shadow-sm hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                <User className="h-3.5 w-3.5 text-zinc-500 dark:text-zinc-400" />
                <span className="max-w-[120px] truncate">{user.email}</span>
              </Link>

              <button
                onClick={logout}
                className="flex items-center gap-1.5 rounded-lg border border-zinc-200 px-3 py-1.5 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-900 cursor-pointer"
              >
                <LogOut className="h-3.5 w-3.5" />
                Sign Out
              </button>
            </div>
          ) : (
            <Link
              href="/auth"
              className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-500 shadow-sm"
            >
              <User className="h-3.5 w-3.5" />
              Log In
            </Link>
          )}
        </div>
      </div>
    </header>

      {/* Slide-out Cart Drawer Overlay */}
      {showCartDrawer && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-zinc-900/50 backdrop-blur-sm transition-opacity" onClick={() => setShowCartDrawer(false)} />
          <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-md bg-white p-6 shadow-xl dark:bg-zinc-950 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-4 border-b dark:border-zinc-800">
                  <h2 className="text-lg font-bold text-zinc-900 dark:text-white">Shopping Cart</h2>
                  <button onClick={() => setShowCartDrawer(false)} className="text-zinc-400 hover:text-zinc-500">Close</button>
                </div>
                {cart.length === 0 ? (
                  <p className="py-8 text-center text-zinc-500">Your cart is empty.</p>
                ) : (
                  <div className="mt-4 space-y-4 overflow-y-auto max-h-[60vh]">
                    {cart.map((item) => (
                      <div key={item.id} className="flex gap-4 border-b pb-4 dark:border-zinc-800">
                        <img src={item.image} alt={item.title} className="h-16 w-16 rounded object-cover" />
                        <div className="flex-1">
                          <h4 className="text-sm font-semibold text-zinc-900 dark:text-white">{item.title}</h4>
                          <p className="text-xs text-zinc-500">${item.price} x {item.quantity}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {cart.length > 0 && (
                <div className="border-t pt-4 dark:border-zinc-800">
                  <div className="flex justify-between font-bold text-zinc-900 dark:text-white mb-4">
                    <span>Total Subtotal:</span>
                    <span>${cartTotal.toFixed(2)}</span>
                  </div>
                  <Link
                    href="/checkout"
                    onClick={() => setShowCartDrawer(false)}
                    className="block w-full text-center rounded-lg bg-indigo-600 py-3 font-semibold text-white hover:bg-indigo-500"
                  >
                    Proceed to Checkout
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Profile Modal Overlay */}
      {showProfileModal && user && (
        <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center">
          <div className="absolute inset-0 bg-zinc-900/50 backdrop-blur-sm transition-opacity" onClick={() => setShowProfileModal(false)} />
          <div className="relative w-full max-w-sm bg-white p-6 rounded-2xl shadow-xl dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800/80 mx-4">
            <div className="flex items-center justify-between pb-4 border-b dark:border-zinc-850">
              <h2 className="text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                <User className="h-4 w-4 text-indigo-650" />
                <span>My Profile Account</span>
              </h2>
              <button onClick={() => setShowProfileModal(false)} className="text-zinc-400 hover:text-zinc-500 text-xs font-semibold cursor-pointer">Close</button>
            </div>
            
            <div className="mt-4 space-y-3.5 text-xs">
              <div className="flex justify-between border-b pb-2 border-zinc-100 dark:border-zinc-850/50">
                <span className="text-zinc-400">Email Address</span>
                <span className="font-bold text-zinc-900 dark:text-white truncate max-w-[200px]">{user.email}</span>
              </div>
              <div className="flex justify-between border-b pb-2 border-zinc-100 dark:border-zinc-850/50">
                <span className="text-zinc-400">Profile Role</span>
                <span className="font-bold text-indigo-600 dark:text-indigo-400">{user.role}</span>
              </div>
              <div className="flex justify-between border-b pb-2 border-zinc-100 dark:border-zinc-850/50">
                <span className="text-zinc-400">Wishlist Saved</span>
                <span className="font-bold text-zinc-900 dark:text-white">{wishlist.length} products</span>
              </div>
              <div className="flex justify-between border-b pb-2 border-zinc-100 dark:border-zinc-850/50">
                <span className="text-zinc-400">Cart Quantity</span>
                <span className="font-bold text-zinc-900 dark:text-white">{cart.reduce((sum, item) => sum + item.quantity, 0)} items</span>
              </div>
              <div className="flex justify-between pb-1">
                <span className="text-zinc-400">Simulation Status</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 inline-block animate-pulse" />
                  Active Session
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
