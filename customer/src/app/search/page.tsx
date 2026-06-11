'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { PRODUCTS, CATEGORIES, BRANDS } from '../../data/mockData';
import { useStore } from '../../store/store';
import { Heart, ShoppingCart, Star, Filter, SlidersHorizontal, ArrowUpDown, RefreshCw, X } from 'lucide-react';
import Link from 'next/link';

function SearchPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { addToCart, toggleWishlist, wishlist } = useStore();

  // Get active query parameters
  const query = searchParams.get('q') || '';
  const activeCategory = searchParams.get('category') || 'All';
  const activeBrand = searchParams.get('brand') || 'All';
  const activeRating = Number(searchParams.get('rating')) || 0;
  const activeSort = searchParams.get('sort') || 'featured';
  const activeMinPrice = Number(searchParams.get('minPrice')) || 0;
  const activeMaxPrice = Number(searchParams.get('maxPrice')) || 2000;

  // Local state for sidebar filters on mobile
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Update filters in URL
  const updateFilter = (updates: Record<string, string | number | undefined>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, val]) => {
      if (val === undefined || val === 'All' || val === 0 || val === '') {
        params.delete(key);
      } else {
        params.set(key, String(val));
      }
    });
    router.push(`/search?${params.toString()}`);
  };

  // Reset all filters
  const resetFilters = () => {
    router.push('/search');
  };

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (query) params.set('search', query);
    if (activeCategory && activeCategory !== 'All') params.set('category', activeCategory);
    if (activeBrand && activeBrand !== 'All') params.set('brand', activeBrand);

    fetch(`http://127.0.0.1:5001/api/v1/catalog/products?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        setProducts(Array.isArray(data) ? data : (data && Array.isArray(data.products) ? data.products : []));
        setLoading(false);
      })
      .catch(() => {
        // Fallback to static mock data if backend is offline
        let result = Array.isArray(PRODUCTS) ? [...PRODUCTS] : [];
        if (query.trim()) {
          const q = query.toLowerCase();
          result = result.filter(
            (p) =>
              p.title.toLowerCase().includes(q) ||
              p.description.toLowerCase().includes(q) ||
              p.brand.toLowerCase().includes(q) ||
              p.category.toLowerCase().includes(q) ||
              p.tags.some((t) => t.toLowerCase().includes(q)),
          );
        }
        if (activeCategory !== 'All') {
          result = result.filter((p) => p.category === activeCategory);
        }
        if (activeBrand !== 'All') {
          result = result.filter((p) => p.brand === activeBrand);
        }
        setProducts(result);
        setLoading(false);
      });
  }, [query, activeCategory, activeBrand]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = Array.isArray(products) ? [...products] : [];

    // Rating filter
    if (activeRating > 0) {
      result = result.filter(
        (p) =>
          (p.averageRating || p.rating || 0) >= activeRating,
      );
    }

    // Price range filter
    result = result.filter(
      (p) => p.price >= activeMinPrice && p.price <= activeMaxPrice,
    );

    // Sorting
    if (activeSort === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (activeSort === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (activeSort === 'rating') {
      result.sort(
        (a, b) =>
          (b.averageRating || b.rating || 0) -
          (a.averageRating || a.rating || 0),
      );
    }

    return result;
  }, [products, activeRating, activeSort, activeMinPrice, activeMaxPrice]);

  return (
    <div className="flex-grow bg-zinc-50 dark:bg-zinc-950 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Search header / breadcrumb */}
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-white">
              {query ? `Search Results for "${query}"` : 'Browse Products'}
            </h1>
            <p className="text-sm text-zinc-500 mt-1">{filteredProducts.length} items matching your criteria</p>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 bg-white dark:bg-zinc-900 px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm text-sm">
              <ArrowUpDown className="h-4 w-4 text-zinc-400" />
              <select
                value={activeSort}
                onChange={(e) => updateFilter({ sort: e.target.value })}
                className="bg-transparent focus:outline-none text-zinc-800 dark:text-zinc-200 cursor-pointer font-medium"
              >
                <option value="featured">Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>

            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setMobileFiltersOpen(true)}
              className="md:hidden flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-xl shadow font-semibold hover:bg-indigo-500 active:scale-95 transition-all"
            >
              <Filter className="h-4 w-4" />
              <span>Filters</span>
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          
          {/* Desktop Filters Sidebar */}
          <aside className="hidden md:block space-y-6">
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 p-6 shadow-sm sticky top-24 space-y-6">
              <div className="flex items-center justify-between border-b pb-4 dark:border-zinc-800">
                <h3 className="font-bold text-zinc-900 dark:text-white flex items-center gap-2 text-base">
                  <SlidersHorizontal className="h-4 w-4 text-indigo-600" />
                  <span>Filters</span>
                </h3>
                <button
                  onClick={resetFilters}
                  className="text-xs text-indigo-600 hover:text-indigo-500 font-semibold flex items-center gap-1"
                >
                  <RefreshCw className="h-3 w-3" />
                  <span>Reset All</span>
                </button>
              </div>

              {/* Categories */}
              <div>
                <h4 className="font-semibold text-sm text-zinc-900 dark:text-white mb-3">Categories</h4>
                <div className="space-y-2">
                  <button
                    onClick={() => updateFilter({ category: 'All' })}
                    className={`block text-sm transition-colors text-left w-full px-2 py-1 rounded ${
                      activeCategory === 'All'
                        ? 'bg-indigo-50 text-indigo-600 font-bold dark:bg-indigo-950/40 dark:text-indigo-400'
                        : 'text-zinc-600 hover:text-indigo-600 dark:text-zinc-400 dark:hover:text-white'
                    }`}
                  >
                    All Categories
                  </button>
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.slug}
                      onClick={() => updateFilter({ category: cat.name })}
                      className={`block text-sm transition-colors text-left w-full px-2 py-1 rounded ${
                        activeCategory === cat.name
                          ? 'bg-indigo-50 text-indigo-600 font-bold dark:bg-indigo-950/40 dark:text-indigo-400'
                          : 'text-zinc-600 hover:text-indigo-600 dark:text-zinc-400 dark:hover:text-white'
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Brands */}
              <div>
                <h4 className="font-semibold text-sm text-zinc-900 dark:text-white mb-3">Brands</h4>
                <div className="space-y-2">
                  <button
                    onClick={() => updateFilter({ brand: 'All' })}
                    className={`block text-sm transition-colors text-left w-full px-2 py-1 rounded ${
                      activeBrand === 'All'
                        ? 'bg-indigo-50 text-indigo-600 font-bold dark:bg-indigo-950/40 dark:text-indigo-400'
                        : 'text-zinc-600 hover:text-indigo-600 dark:text-zinc-400 dark:hover:text-white'
                    }`}
                  >
                    All Brands
                  </button>
                  {BRANDS.map((br) => (
                    <button
                      key={br}
                      onClick={() => updateFilter({ brand: br })}
                      className={`block text-sm transition-colors text-left w-full px-2 py-1 rounded ${
                        activeBrand === br
                          ? 'bg-indigo-50 text-indigo-600 font-bold dark:bg-indigo-950/40 dark:text-indigo-400'
                          : 'text-zinc-600 hover:text-indigo-600 dark:text-zinc-400 dark:hover:text-white'
                      }`}
                    >
                      {br}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <h4 className="font-semibold text-sm text-zinc-900 dark:text-white mb-3">Price Range</h4>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] text-zinc-400 block mb-1">Min Price</label>
                    <input
                      type="number"
                      value={activeMinPrice}
                      onChange={(e) => updateFilter({ minPrice: e.target.value })}
                      className="w-full bg-zinc-50 border border-zinc-200 dark:bg-zinc-950 dark:border-zinc-800 rounded-lg p-2 text-xs focus:border-indigo-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-zinc-400 block mb-1">Max Price</label>
                    <input
                      type="number"
                      value={activeMaxPrice}
                      onChange={(e) => updateFilter({ maxPrice: e.target.value })}
                      className="w-full bg-zinc-50 border border-zinc-200 dark:bg-zinc-950 dark:border-zinc-800 rounded-lg p-2 text-xs focus:border-indigo-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Rating */}
              <div>
                <h4 className="font-semibold text-sm text-zinc-900 dark:text-white mb-3">Customer Rating</h4>
                <div className="space-y-2">
                  {[4, 3, 2].map((ratingVal) => (
                    <button
                      key={ratingVal}
                      onClick={() => updateFilter({ rating: ratingVal })}
                      className={`flex items-center gap-2 text-sm w-full px-2 py-1 rounded text-left transition-colors ${
                        activeRating === ratingVal
                          ? 'bg-indigo-50 text-indigo-600 font-bold dark:bg-indigo-950/40 dark:text-indigo-400'
                          : 'text-zinc-600 hover:text-indigo-600 dark:text-zinc-400 dark:hover:text-white'
                      }`}
                    >
                      <div className="flex text-amber-500">
                        {Array.from({ length: 5 }).map((_, idx) => (
                          <Star
                            key={idx}
                            className={`h-3.5 w-3.5 ${
                              idx < ratingVal ? 'fill-current' : 'text-zinc-200 dark:text-zinc-800'
                            }`}
                          />
                        ))}
                      </div>
                      <span>& Up</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Product Grid Area */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array(6).fill(0).map((_, i) => (
                  <div key={i} className="rounded-2xl border border-zinc-200/80 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900 animate-pulse space-y-4">
                    <div className="aspect-square w-full rounded-xl bg-zinc-200 dark:bg-zinc-800" />
                    <div className="space-y-2">
                      <div className="h-3 w-16 bg-zinc-200 dark:bg-zinc-800 rounded" />
                      <div className="h-4 w-40 bg-zinc-200 dark:bg-zinc-800 rounded" />
                      <div className="h-3 w-32 bg-zinc-200 dark:bg-zinc-800 rounded" />
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-zinc-105 dark:border-zinc-800">
                      <div className="h-5 w-16 bg-zinc-200 dark:bg-zinc-800 rounded" />
                      <div className="h-8 w-16 bg-zinc-200 dark:bg-zinc-800 rounded-lg" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-12 text-center text-zinc-500 shadow-sm flex flex-col items-center justify-center space-y-4">
                <SlidersHorizontal className="h-10 w-10 text-zinc-300 dark:text-zinc-700" />
                <h3 className="font-bold text-zinc-900 dark:text-white text-lg">No Results Found</h3>
                <p className="max-w-md text-sm leading-relaxed">
                  We couldn't find any products matching your search term or active filters. Try adjusting your search query or reset the sidebar filters.
                </p>
                <button
                  onClick={resetFilters}
                  className="rounded-xl bg-indigo-600 px-6 py-2.5 font-semibold text-white hover:bg-indigo-500 active:scale-95 transition-all shadow-md"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((p) => {
                  const pId = p.id || p._id;
                  const isWishlisted = wishlist.includes(pId);
                  const brandName = typeof p.brand === 'object' && p.brand !== null ? (p.brand.name || '') : p.brand;
                  const imgUrl = p.images?.[0] || 'https://picsum.photos/seed/product/600/600';
                  return (
                    <div
                      key={pId}
                      className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-zinc-200/80 bg-white p-4 transition-all hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900"
                    >
                      <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-zinc-100">
                        <img
                          src={imgUrl}
                          alt={p.title}
                          className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                        />
                        <button
                          onClick={() => toggleWishlist(pId)}
                          className={`absolute top-2 right-2 rounded-full p-2 bg-white/90 shadow dark:bg-zinc-900/90 transition-all ${
                            isWishlisted ? 'text-red-500' : 'text-zinc-400 hover:text-red-500'
                          }`}
                        >
                          <Heart className="h-4 w-4 fill-current" />
                        </button>
                      </div>

                      <div className="mt-4 flex-1 space-y-2">
                        <span className="text-[10px] uppercase tracking-wider text-zinc-400 font-bold">{brandName}</span>
                        <h3 className="font-semibold text-sm text-zinc-900 dark:text-white line-clamp-1">
                          <Link href={`/product/${pId}`} className="hover:text-indigo-600">
                            {p.title}
                          </Link>
                        </h3>
                        <div className="flex items-center gap-1 text-xs text-amber-500 font-bold">
                          <Star className="h-3.5 w-3.5 fill-current" />
                          <span>{p.averageRating || p.rating || 0}</span>
                        </div>
                        <p className="text-xs text-zinc-500 line-clamp-2 leading-relaxed">{p.description}</p>
                      </div>

                      <div className="mt-4 flex items-center justify-between pt-2 border-t border-zinc-100 dark:border-zinc-800">
                        <span className="font-extrabold text-zinc-900 dark:text-white">${p.price.toFixed(2)}</span>
                        <button
                          onClick={() => addToCart({ id: pId, title: p.title, price: p.price, image: imgUrl })}
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
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filters Drawer Overlay */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden bg-black/60 backdrop-blur-sm transition-all duration-300">
          <div className="relative flex flex-col w-full max-w-xs bg-white dark:bg-zinc-900 h-full p-6 shadow-xl animate-in slide-in-from-right duration-250">
            <div className="flex items-center justify-between border-b pb-4 dark:border-zinc-800 mb-6">
              <h3 className="font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4" />
                <span>Filters</span>
              </h3>
              <button onClick={() => setMobileFiltersOpen(false)} className="text-zinc-500 hover:text-zinc-400">
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-6 pr-2 scrollbar-thin">
              {/* Reset */}
              <button
                onClick={() => {
                  resetFilters();
                  setMobileFiltersOpen(false);
                }}
                className="w-full text-center py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 text-sm font-semibold hover:bg-zinc-50 dark:hover:bg-zinc-800 flex items-center justify-center gap-2 text-indigo-600"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Reset All Filters</span>
              </button>

              {/* Category */}
              <div>
                <h4 className="font-semibold text-sm text-zinc-900 dark:text-white mb-3">Categories</h4>
                <div className="space-y-2">
                  <button
                    onClick={() => {
                      updateFilter({ category: 'All' });
                      setMobileFiltersOpen(false);
                    }}
                    className={`block text-sm text-left w-full px-2 py-1 rounded ${
                      activeCategory === 'All' ? 'text-indigo-600 font-bold' : 'text-zinc-500'
                    }`}
                  >
                    All Categories
                  </button>
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.slug}
                      onClick={() => {
                        updateFilter({ category: cat.name });
                        setMobileFiltersOpen(false);
                      }}
                      className={`block text-sm text-left w-full px-2 py-1 rounded ${
                        activeCategory === cat.name ? 'text-indigo-600 font-bold' : 'text-zinc-500'
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Brand */}
              <div>
                <h4 className="font-semibold text-sm text-zinc-900 dark:text-white mb-3">Brands</h4>
                <div className="space-y-2">
                  <button
                    onClick={() => {
                      updateFilter({ brand: 'All' });
                      setMobileFiltersOpen(false);
                    }}
                    className={`block text-sm text-left w-full px-2 py-1 rounded ${
                      activeBrand === 'All' ? 'text-indigo-600 font-bold' : 'text-zinc-500'
                    }`}
                  >
                    All Brands
                  </button>
                  {BRANDS.map((br) => (
                    <button
                      key={br}
                      onClick={() => {
                        updateFilter({ brand: br });
                        setMobileFiltersOpen(false);
                      }}
                      className={`block text-sm text-left w-full px-2 py-1 rounded ${
                        activeBrand === br ? 'text-indigo-600 font-bold' : 'text-zinc-500'
                      }`}
                    >
                      {br}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price range */}
              <div>
                <h4 className="font-semibold text-sm text-zinc-900 dark:text-white mb-3">Price Range</h4>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={activeMinPrice}
                    onChange={(e) => updateFilter({ minPrice: e.target.value })}
                    className="w-full bg-zinc-50 border border-zinc-200 dark:bg-zinc-950 dark:border-zinc-800 rounded-lg p-2 text-xs"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={activeMaxPrice}
                    onChange={(e) => updateFilter({ maxPrice: e.target.value })}
                    className="w-full bg-zinc-50 border border-zinc-200 dark:bg-zinc-950 dark:border-zinc-800 rounded-lg p-2 text-xs"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="flex-1 flex justify-center items-center py-24 text-zinc-500">
        <RefreshCw className="h-8 w-8 animate-spin" />
      </div>
    }>
      <SearchPageContent />
    </Suspense>
  );
}
