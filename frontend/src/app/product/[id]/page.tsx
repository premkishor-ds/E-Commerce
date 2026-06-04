'use client';

import React, { use } from 'react';
import { PRODUCTS } from '../../../data/mockData';
import { useStore } from '../../../store/store';
import { Star, ShoppingCart, Heart, ShieldCheck, CheckCircle2, ChevronRight } from 'lucide-react';
import Link from 'next/link';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ProductDetail({ params }: PageProps) {
  const resolvedParams = use(params);
  const productId = resolvedParams.id;
  const { addToCart, toggleWishlist, wishlist } = useStore();

  const product = PRODUCTS.find((p) => p.id === productId);

  if (!product) {
    return (
      <div className="flex flex-1 items-center justify-center py-24 text-center">
        <div>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">Product Not Found</h2>
          <p className="text-zinc-500 mt-2">The product you are looking for does not exist in our catalog.</p>
          <Link href="/" className="mt-4 inline-block text-indigo-600 font-semibold hover:underline">Return Home</Link>
        </div>
      </div>
    );
  }

  // Related products logic (same category)
  const relatedProducts = PRODUCTS.filter((p) => p.category === product.category && p.id !== product.id);
  const isWishlisted = wishlist.includes(product.id);

  return (
    <div className="flex-1 bg-zinc-50 dark:bg-zinc-950 py-12">
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
          <Link href="/">Catalog</Link>
          <ChevronRight className="h-3 w-3" />
          <span>{product.category}</span>
          <ChevronRight className="h-3 w-3" />
          <span className="text-zinc-900 dark:text-white">{product.title}</span>
        </nav>

        {/* Product Info Section */}
        <section className="grid lg:grid-cols-2 gap-12 bg-white p-8 rounded-2xl border border-zinc-200/80 dark:bg-zinc-900 dark:border-zinc-800 shadow-sm">
          {/* Zoomable Image Panel */}
          <div className="relative aspect-square overflow-hidden rounded-2xl bg-zinc-100">
            <img
              src={product.images[0]}
              alt={product.title}
              className="h-full w-full object-cover object-center transform hover:scale-105 transition-transform duration-500 cursor-zoom-in"
            />
          </div>

          {/* Details Column */}
          <div className="space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">{product.brand}</span>
                <span className="text-xs text-zinc-400">SKU: {product.sku}</span>
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white">{product.title}</h1>
              
              <div className="flex items-center gap-2">
                <div className="flex items-center text-amber-500 font-bold gap-1">
                  <Star className="h-4 w-4 fill-current" />
                  <span>{product.averageRating}</span>
                </div>
                <span className="text-zinc-300">|</span>
                <span className="text-xs text-zinc-500">{product.reviews.length} Customer Reviews</span>
              </div>

              <div className="text-3xl font-black text-zinc-900 dark:text-white">${product.price.toFixed(2)}</div>
              
              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-sm">{product.description}</p>
            </div>

            {/* CTA Buttons */}
            <div className="space-y-4 pt-6 border-t">
              <div className="flex gap-4">
                <button
                  onClick={() => addToCart({ id: product.id, title: product.title, price: product.price, image: product.images[0] })}
                  className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 font-semibold text-white hover:bg-indigo-500 shadow-lg shadow-indigo-600/20 active:scale-95 transition-all"
                >
                  <ShoppingCart className="h-5 w-5" />
                  <span>Add To Cart</span>
                </button>
                <button
                  onClick={() => toggleWishlist(product.id)}
                  className={`rounded-xl border p-3 flex items-center justify-center transition-all active:scale-95 ${
                    isWishlisted ? 'border-red-500 text-red-500 bg-red-50/50' : 'border-zinc-200 text-zinc-400 hover:text-red-500'
                  }`}
                >
                  <Heart className="h-5 w-5 fill-current" />
                </button>
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20 px-3 py-2 rounded-lg">
                <ShieldCheck className="h-4 w-4" />
                <span>Verified Stock - Dispatched within 24 hours.</span>
              </div>
            </div>
          </div>
        </section>

        {/* Specifications & Reviews Tabs */}
        <section className="grid md:grid-cols-2 gap-8">
          {/* Specifications */}
          <div className="bg-white p-6 rounded-2xl border border-zinc-200/80 dark:bg-zinc-900 dark:border-zinc-800 shadow-sm space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">Technical Specifications</h3>
            <table className="w-full text-sm text-left">
              <tbody>
                {product.specifications.map((spec) => (
                  <tr key={spec.name} className="border-b last:border-0">
                    <td className="py-2.5 font-semibold text-zinc-500 w-1/3">{spec.name}</td>
                    <td className="py-2.5 text-zinc-900 dark:text-white">{spec.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Customer Reviews */}
          <div className="bg-white p-6 rounded-2xl border border-zinc-200/80 dark:bg-zinc-900 dark:border-zinc-800 shadow-sm space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">Customer Reviews</h3>
            {product.reviews.map((rev, index) => (
              <div key={index} className="space-y-2 border-b last:border-0 pb-4 last:pb-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm">{rev.user}</span>
                    {rev.verified && (
                      <span className="inline-flex items-center gap-0.5 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                        <CheckCircle2 className="h-3 w-3" /> Verified Purchase
                      </span>
                    )}
                  </div>
                  <div className="flex text-amber-500">
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-current" />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-zinc-500 italic">&quot;{rev.comment}&quot;</p>
              </div>
            ))}
          </div>
        </section>

        {/* AI Recommendations: Related Products */}
        {relatedProducts.length > 0 && (
          <section className="space-y-6">
            <h3 className="text-xl font-bold">Frequently Bought Together</h3>
            <div className="grid sm:grid-cols-3 gap-6">
              {relatedProducts.map((p) => (
                <div key={p.id} className="bg-white p-4 rounded-xl border border-zinc-200/80 hover:shadow transition-all dark:bg-zinc-900 dark:border-zinc-800">
                  <img src={p.images[0]} alt={p.title} className="h-40 w-full object-cover rounded-lg" />
                  <h4 className="font-semibold text-sm mt-3 line-clamp-1">
                    <Link href={`/product/${p.id}`} className="hover:text-indigo-600">{p.title}</Link>
                  </h4>
                  <div className="flex justify-between items-center mt-2">
                    <span className="font-bold text-sm">${p.price.toFixed(2)}</span>
                    <button
                      onClick={() => addToCart({ id: p.id, title: p.title, price: p.price, image: p.images[0] })}
                      className="rounded bg-zinc-100 hover:bg-indigo-600 hover:text-white px-2 py-1 text-xs font-semibold dark:bg-zinc-800"
                    >
                      Quick Add
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
