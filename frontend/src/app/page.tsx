'use client';

import React, { useMemo } from 'react';
import { PRODUCTS, CATEGORIES } from '../data/mockData';
import { useStore } from '../store/store';
import { Heart, ShoppingCart, Search, ArrowRight, Star, HelpCircle, FireExtinguisher, Flame, Sparkles, Compass } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Home() {
  const { addToCart, toggleWishlist, wishlist, user } = useStore();
  const [searchTerm, setSearchTerm] = React.useState('');
  const router = useRouter();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  // Best Sellers (Rating >= 4.8)
  const bestSellers = useMemo(() => {
    return PRODUCTS.filter((p) => p.averageRating >= 4.8).slice(0, 4);
  }, []);

  // New Arrivals (Newest versions / first few generated products)
  const newArrivals = useMemo(() => {
    return PRODUCTS.filter((p) => p.id.startsWith('generated-prod-') && Number(p.id.split('-').pop()) <= 4);
  }, []);

  // Recommended (personalized based on logged-in user)
  const recommended = useMemo(() => {
    if (!user) {
      // Guest users see a general top-rated selection
      return PRODUCTS.filter((p) => p.averageRating >= 4.6 && p.averageRating < 4.8).slice(4, 8);
    }
    
    // Personalize category using a deterministic hash of the user's email
    const categories = ['Electronics', 'Home & Kitchen', 'Fashion & Apparel', 'Fitness & Sports'];
    const charCodeSum = user.email.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
    const preferredCategory = categories[charCodeSum % categories.length];
    
    return PRODUCTS.filter((p) => p.category === preferredCategory && p.averageRating >= 4.5).slice(0, 4);
  }, [user]);

  // Shared component to render a product grid
  const renderProductGrid = (items: typeof PRODUCTS) => (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {items.map((p) => {
        const isWishlisted = wishlist.includes(p.id);
        return (
          <div
            key={p.id}
            className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-zinc-200/80 bg-white p-4 transition-all hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900"
          >
            {/* Header Image section */}
            <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-zinc-100">
              <img
                src={p.images[0]}
                alt={p.title}
                className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
              />
              <button
                onClick={() => toggleWishlist(p.id)}
                className={`absolute top-2 right-2 rounded-full p-2 bg-white/90 shadow dark:bg-zinc-900/90 transition-all ${
                  isWishlisted ? 'text-red-500' : 'text-zinc-400 hover:text-red-500'
                }`}
              >
                <Heart className="h-4 w-4 fill-current" />
              </button>
            </div>

            {/* Metadata Details */}
            <div className="mt-4 flex-1 space-y-2">
              <span className="text-[10px] uppercase tracking-wider text-zinc-400 font-bold">{p.brand}</span>
              <h3 className="font-semibold text-sm text-zinc-900 dark:text-white line-clamp-1">
                <Link href={`/product/${p.id}`} className="hover:text-indigo-600">
                  {p.title}
                </Link>
              </h3>
              <div className="flex items-center gap-1 text-xs text-amber-500 font-bold">
                <Star className="h-3.5 w-3.5 fill-current" />
                <span>{p.averageRating}</span>
              </div>
              <p className="text-xs text-zinc-500 line-clamp-2 leading-relaxed">{p.description}</p>
            </div>

            {/* Pricing & Cart Action */}
            <div className="mt-4 flex items-center justify-between pt-2 border-t border-zinc-100 dark:border-zinc-800">
              <span className="font-extrabold text-zinc-900 dark:text-white">${p.price.toFixed(2)}</span>
              <button
                onClick={() => addToCart({ id: p.id, title: p.title, price: p.price, image: p.images[0] })}
                className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-500 active:scale-95 transition-all shadow-md shadow-indigo-600/10"
              >
                <ShoppingCart className="h-3.5 w-3.5" />
                <span>Add</span>
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="flex-1 bg-zinc-50 dark:bg-zinc-950 pb-16">
      {/* Premium Hero Banner */}
      <section className="relative overflow-hidden bg-zinc-900 text-white py-24 px-6 sm:px-12 text-center lg:text-left">
        <div className="absolute inset-0 opacity-40 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-900 via-zinc-950 to-black" />
        <div className="relative mx-auto max-w-7xl grid lg:grid-cols-2 items-center gap-12">
          <div className="space-y-6">
            <span className="inline-flex items-center rounded-full bg-indigo-500/10 px-3 py-1 text-sm font-medium text-indigo-400 ring-1 ring-inset ring-indigo-500/20">
              Summer Collection 2026
            </span>
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight bg-clip-text bg-gradient-to-r from-white via-indigo-100 to-zinc-400">
              Next-Gen Shopping Experience
            </h1>
            <p className="text-lg text-zinc-300 max-w-lg leading-relaxed">
              Discover top-tier electronic gears, smart home automation appliances, elite styling apparel, and carbon cycling machinery.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link
                href="/search"
                className="flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 font-semibold hover:bg-indigo-500 shadow-lg shadow-indigo-600/30 transition-all active:scale-95 text-white"
              >
                <span>Browse Products</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/support"
                className="rounded-lg border border-zinc-700 px-6 py-3 font-semibold hover:bg-zinc-800 transition-all text-center"
              >
                Get Customer Support
              </Link>
            </div>
          </div>
          <div 
            className="hidden lg:block relative h-96 w-full rounded-2xl overflow-hidden shadow-2xl"
            suppressHydrationWarning={true}
          >
            <img
              src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80"
              alt="Storefront Hub Banner"
              className="absolute inset-0 h-full w-full object-cover rounded-2xl brightness-90 transform hover:scale-105 transition-transform duration-700"
            />
          </div>
        </div>
      </section>

      {/* Main Container */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-12 space-y-16">
        
        {/* Search Suggestion Component */}
        <section className="bg-white p-6 rounded-2xl border border-zinc-200/80 dark:bg-zinc-900 dark:border-zinc-800 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
          <form onSubmit={handleSearchSubmit} className="relative w-full md:max-w-md">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-400">
              <Search className="h-5 w-5" />
            </span>
            <input
              type="text"
              placeholder="Search products, brands, tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && searchTerm.trim()) {
                  e.preventDefault();
                  router.push(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
                }
              }}
              className="w-full rounded-xl border border-zinc-200 pl-10 pr-4 py-3 text-sm focus:border-indigo-500 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 text-zinc-900 dark:text-white"
            />
          </form>

          {/* Quick Categories Filter (Redirects directly to Search results with pre-applied filter) */}
          <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
            <button
              onClick={() => router.push('/search')}
              className="rounded-full px-4 py-2 text-xs font-semibold whitespace-nowrap bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700 transition-all"
            >
              All Categories
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.slug}
                onClick={() => router.push(`/search?category=${encodeURIComponent(cat.name)}`)}
                className="rounded-full px-4 py-2 text-xs font-semibold whitespace-nowrap bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700 transition-all"
              >
                {cat.name}
              </button>
            ))}
          </div>
        </section>

        {/* 1. Best Selling Section */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b pb-4 dark:border-zinc-800">
            <h2 className="text-2xl font-extrabold text-zinc-900 dark:text-white flex items-center gap-2">
              <Flame className="h-6 w-6 text-amber-500 fill-current" />
              <span>Best Selling Products</span>
            </h2>
            <Link href="/search?sort=rating" className="text-xs text-indigo-600 hover:underline font-semibold flex items-center gap-1">
              <span>View All Best Sellers</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          {renderProductGrid(bestSellers)}
        </section>

        {/* 2. New Arrivals Section */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b pb-4 dark:border-zinc-800">
            <h2 className="text-2xl font-extrabold text-zinc-900 dark:text-white flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-indigo-500 fill-current" />
              <span>New Arrivals</span>
            </h2>
            <Link href="/search" className="text-xs text-indigo-600 hover:underline font-semibold flex items-center gap-1">
              <span>View All New Releases</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          {renderProductGrid(newArrivals)}
        </section>

        {/* 3. Recommended For You Section */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b pb-4 dark:border-zinc-800">
            <h2 className="text-2xl font-extrabold text-zinc-900 dark:text-white flex items-center gap-2">
              <Compass className="h-6 w-6 text-emerald-500" />
              <span>Recommended For You</span>
            </h2>
            <Link href="/search?rating=4" className="text-xs text-indigo-600 hover:underline font-semibold flex items-center gap-1">
              <span>Explore Personalized Feed</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          {renderProductGrid(recommended)}
        </section>

        {/* Dynamic FAQ Blocks (AEO Optimized) */}
        <section className="bg-white p-8 rounded-2xl border border-zinc-200/80 dark:bg-zinc-900 dark:border-zinc-800 shadow-sm space-y-6">
          <div className="flex items-center gap-2 border-b pb-4 dark:border-zinc-800">
            <HelpCircle className="h-6 w-6 text-indigo-600" />
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Frequently Asked Questions</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <h4 className="font-bold text-zinc-900 dark:text-white">What payment methods do you support?</h4>
              <p className="text-sm text-zinc-500 leading-relaxed">
                We accept credit cards (Visa, MasterCard, Amex), PayPal, and Google Pay through our secure Stripe integrations.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-bold text-zinc-900 dark:text-white">What is your shipping & return policy?</h4>
              <p className="text-sm text-zinc-500 leading-relaxed">
                We offer free standard shipping on orders over $50. Unopened products can be returned within 30 days of purchase for a full refund.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
