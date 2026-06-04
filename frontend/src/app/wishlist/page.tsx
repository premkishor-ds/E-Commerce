'use" strict';
'use client';

import React from 'react';
import { useStore } from '../../store/store';
import { PRODUCTS } from '../../data/mockData';
import { ShoppingCart, Trash2, HeartOff, Star } from 'lucide-react';
import Link from 'next/link';

export default function WishlistPage() {
  const { wishlist, toggleWishlist, addToCart } = useStore();

  const wishlistedItems = PRODUCTS.filter((p) => wishlist.includes(p.id));

  return (
    <div className="flex-1 bg-zinc-50 dark:bg-zinc-950 py-12">
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white">Your Wishlist</h1>
          <p className="text-zinc-500 mt-1 text-sm">Save products to buy them later or sync them across devices.</p>
        </div>

        {wishlistedItems.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl border text-center dark:bg-zinc-900 dark:border-zinc-800 space-y-4">
            <HeartOff className="h-12 w-12 text-zinc-400 mx-auto" />
            <h3 className="text-lg font-bold text-zinc-700 dark:text-zinc-300">Your wishlist is empty</h3>
            <p className="text-sm text-zinc-500 max-w-xs mx-auto">Explore our catalog and click the heart icon on any product to save it here.</p>
            <Link
              href="/"
              className="inline-block rounded-lg bg-indigo-600 px-6 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {wishlistedItems.map((p) => (
              <div
                key={p.id}
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-zinc-200 bg-white p-4 transition-all hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900"
              >
                <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-zinc-100">
                  <img
                    src={p.images[0]}
                    alt={p.title}
                    className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                  <button
                    onClick={() => toggleWishlist(p.id)}
                    className="absolute top-2 right-2 rounded-full p-2 bg-white/90 shadow text-red-500 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="mt-4 flex-1 space-y-2">
                  <span className="text-[10px] uppercase tracking-wider text-zinc-400 font-bold">{p.brand}</span>
                  <h3 className="font-semibold text-sm text-zinc-900 dark:text-white line-clamp-1">
                    <Link href={`/product/${p.id}`} className="hover:text-indigo-600">{p.title}</Link>
                  </h3>
                  <div className="flex items-center gap-1 text-xs text-amber-500 font-bold">
                    <Star className="h-3.5 w-3.5 fill-current" />
                    <span>{p.averageRating}</span>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between pt-2 border-t dark:border-zinc-800">
                  <span className="font-extrabold text-zinc-900 dark:text-white">${p.price.toFixed(2)}</span>
                  <button
                    onClick={() => addToCart({ id: p.id, title: p.title, price: p.price, image: p.images[0] })}
                    className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-500 transition-all shadow"
                  >
                    <ShoppingCart className="h-3.5 w-3.5" />
                    <span>Add to Cart</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
