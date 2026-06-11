'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useStore } from '../../../../store/store';
import { ArrowLeft, Save, Trash2, Box, Tag, DollarSign, Layers } from 'lucide-react';

export default function ListingDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useStore();
  const [product, setProduct] = useState<any>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Edit fields
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [desc, setDesc] = useState('');
  const [category, setCategory] = useState('');
  const [stock, setStock] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const catRes = await fetch('http://localhost:5001/api/v1/catalog/categories');
        if (catRes.ok) {
          const catJson = await catRes.json();
          const catData = Array.isArray(catJson) ? catJson : (catJson && Array.isArray(catJson.data) ? catJson.data : []);
          setCategories(catData);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchMetadata();
  }, []);

  useEffect(() => {
    if (!user) return;
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await fetch(`http://localhost:5001/api/v1/catalog/products/${id}`);
        if (res.ok) {
          const data = await res.json();
          const p = data.data || data;
          setProduct(p);
          setTitle(p.title || '');
          setPrice(p.price?.toString() || '0');
          setDesc(p.description || '');
          setCategory(p.category?._id || p.category || '');
          setStock(p.stock?.toString() || '0');
          setImageUrl(p.images?.[0] || '');
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [user, id]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    try {
      const payload = {
        title,
        price: parseFloat(price),
        description: desc,
        category,
        stock: parseInt(stock),
        images: imageUrl ? [imageUrl] : []
      };

      const res = await fetch(`http://localhost:5001/api/v1/catalog/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        alert('Listing updated successfully!');
        router.push('/listings');
      } else {
        alert('Failed to update listing');
      }
    } catch (err) {
      console.error(err);
      alert('Error updating listing');
    }
  };

  const handleDelete = async () => {
    if (!user) return;
    if (!confirm('Are you sure you want to delete this listing?')) return;
    try {
      const res = await fetch(`http://localhost:5001/api/v1/catalog/products/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });
      if (res.ok) {
        alert('Listing deleted!');
        router.push('/listings');
      } else {
        alert('Failed to delete listing');
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-12">
        <h3 className="text-sm font-bold text-zinc-550">Listing not found.</h3>
        <button onClick={() => router.push('/listings')} className="mt-4 px-4 py-2 bg-emerald-650 text-white rounded-lg text-xs font-semibold">
          Back to Listings
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.push('/listings')}
          className="p-2 border dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-500 rounded-xl hover:text-emerald-500 transition-colors cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div>
          <h1 className="text-xl font-black text-zinc-900 dark:text-white">
            Edit Listing: {product.title}
          </h1>
          <p className="text-xs text-zinc-400">SKU: {product.sku}</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border dark:border-zinc-800 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-zinc-800 dark:text-zinc-200 uppercase tracking-wider flex items-center gap-2">
              <Box className="h-4 w-4 text-emerald-500" />
              Listing Details
            </h3>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] text-zinc-400 font-bold uppercase mb-1">Product Title</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3 py-2 border dark:border-zinc-800 bg-white dark:bg-zinc-950 rounded-lg text-zinc-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-zinc-400 font-bold uppercase mb-1">Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full px-3 py-2 border dark:border-zinc-800 bg-white dark:bg-zinc-950 rounded-lg text-zinc-800 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] text-zinc-400 font-bold uppercase mb-1">Description</label>
                <textarea
                  rows={4}
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  className="w-full px-3 py-2 border dark:border-zinc-800 bg-white dark:bg-zinc-950 rounded-lg text-zinc-800 dark:text-white"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] text-zinc-400 font-bold uppercase mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 border dark:border-zinc-800 bg-white dark:bg-zinc-950 rounded-lg text-zinc-800 dark:text-white"
                  >
                    <option value="">Select Category</option>
                    {categories.map((c) => (
                      <option key={c._id} value={c._id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] text-zinc-400 font-bold uppercase mb-1">Stock / Quantity</label>
                  <input
                    type="number"
                    required
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    className="w-full px-3 py-2 border dark:border-zinc-800 bg-white dark:bg-zinc-950 rounded-lg text-zinc-800 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] text-zinc-400 font-bold uppercase mb-1">Product Image URL</label>
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full px-3 py-2 border dark:border-zinc-800 bg-white dark:bg-zinc-950 rounded-lg text-zinc-800 dark:text-white"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow cursor-pointer border-0"
                >
                  <Save className="h-4 w-4 mr-2 inline" />
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border dark:border-zinc-800 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-zinc-800 dark:text-zinc-200 uppercase tracking-wider flex items-center gap-2">
              <Layers className="h-4 w-4 text-emerald-500" />
              Listing Actions
            </h3>
            <div className="pt-2">
              <button
                onClick={handleDelete}
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl cursor-pointer border-0 shadow"
              >
                <Trash2 className="h-4 w-4" />
                Delete Product Listing
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
