'use client';

import React, { useEffect, useState } from 'react';
import { useStore } from '../../../store/store';
import {
  Wallet, Receipt, Percent, Plus, AlertCircle, Box, DollarSign, Tag, Package,
  ImageIcon, AlignLeft, Pencil, Trash2, X
} from 'lucide-react';

export default function ListingsPage() {
  const { user } = useStore();
  const [vendorStatus, setVendorStatus] = useState('Verification In Progress');
  const [totalSettledAmount, setTotalSettledAmount] = useState(0);
  const [pendingSettlement, setPendingSettlement] = useState(0);
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
        const [catalogRes, settlementsRes, profileRes] = await Promise.all([
          fetch(`http://localhost:5001/api/v1/catalog/products?vendorId=${user.id}`),
          fetch('http://localhost:5001/api/v1/sales/vendor/settlements', {
            headers: { 'Authorization': `Bearer ${user.token}` }
          }),
          fetch('http://localhost:5001/api/v1/profile/me', {
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
        }
        if (profileRes.ok) {
          const prof = await profileRes.json();
          setVendorStatus(prof.vendorStatus || 'Active');
        }
      } catch (err) { console.error(err); }
    };
    fetchSellerData();
  }, [user]);

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

  return (
    <>
      <title>Merchant Listings - ApexStore Seller</title>
      {/* Edit Modal */}
      {editProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border dark:border-zinc-800 shadow-2xl w-full max-w-lg p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-zinc-900 dark:text-white flex items-center gap-2">
                <Pencil className="h-4 w-4 text-emerald-500" /> Edit Listing
              </h3>
              <button onClick={() => setEditProduct(null)} className="p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-405 cursor-pointer bg-transparent border-0">
                <X className="h-4 w-4" />
              </button>
            </div>
            <form onSubmit={handleEditProduct} className="space-y-3 text-xs">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-1">Product Title</label>
                <input type="text" required value={editTitle} onChange={e => setEditTitle(e.target.value)}
                  className="w-full rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-955 p-2.5 text-xs text-zinc-905 dark:text-white focus:outline-none focus:border-emerald-500" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-1">Price ($)</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-2 text-zinc-400"><DollarSign className="h-3.5 w-3.5" /></span>
                    <input type="number" required step="0.01" value={editPrice} onChange={e => setEditPrice(e.target.value)}
                      className="w-full rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-955 pl-7 pr-2.5 py-2.5 text-xs text-zinc-900 dark:text-white focus:outline-none focus:border-emerald-500" />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-1">Stock</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-2 text-zinc-400"><Package className="h-3.5 w-3.5" /></span>
                    <input type="number" value={editStock} onChange={e => setEditStock(e.target.value)}
                      className="w-full rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-955 pl-7 pr-2.5 py-2.5 text-xs text-zinc-900 dark:text-white focus:outline-none focus:border-emerald-500" />
                  </div>
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-1">Category</label>
                <select value={editCategory} onChange={e => setEditCategory(e.target.value)}
                  className="w-full rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-955 p-2.5 text-xs text-zinc-900 dark:text-white focus:outline-none focus:border-emerald-500 cursor-pointer">
                  {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-1">Description</label>
                <div className="relative">
                  <span className="absolute top-2.5 left-2 text-zinc-400"><AlignLeft className="h-3.5 w-3.5" /></span>
                  <textarea rows={2} value={editDesc} onChange={e => setEditDesc(e.target.value)}
                    className="w-full rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-955 pl-7 pr-2.5 py-2.5 text-xs text-zinc-900 dark:text-white focus:outline-none focus:border-emerald-500 resize-none" />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-1">Image URL</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-2 text-zinc-400"><ImageIcon className="h-3.5 w-3.5" /></span>
                  <input type="text" value={editImage} onChange={e => setEditImage(e.target.value)} placeholder="https://..."
                    className="w-full rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-955 pl-7 pr-2.5 py-2.5 text-xs text-zinc-900 dark:text-white focus:outline-none focus:border-emerald-500" />
                </div>
              </div>
              <div className="flex gap-2 pt-1">
                <button type="submit" disabled={editLoading}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 text-white rounded-lg py-2 text-xs font-semibold shadow border-0 cursor-pointer transition-all">
                  {editLoading ? 'Saving...' : 'Save Changes'}
                </button>
                <button type="button" onClick={() => setEditProduct(null)}
                  className="border border-zinc-200 dark:border-zinc-700 text-zinc-650 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-lg px-4 py-2 text-xs font-semibold bg-transparent cursor-pointer">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div>
        <h1 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-white">Merchant Listings</h1>
        <p className="text-zinc-550 text-sm mt-1">Manage product listings, monitor commission settlements, add and edit products.</p>
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
              className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-550 text-white rounded-lg px-3 py-1.5 text-xs font-semibold shadow border-0 cursor-pointer">
              <Plus className="h-3.5 w-3.5" /><span>New Listing</span>
            </button>
          ) : (
            <span className="text-xs text-amber-600 dark:text-amber-400 font-bold bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/30 px-3 py-1.5 rounded-lg flex items-center gap-1">
              <AlertCircle className="h-3.5 w-3.5" /> Verification Pending
            </span>
          )}
        </div>

        {showAddForm && (
          <form onSubmit={handleAddProduct} className="bg-zinc-50 dark:bg-zinc-950 border border-zinc-205 dark:border-zinc-800/80 p-4 rounded-xl space-y-4 text-xs">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-600 flex items-center gap-1.5">
              <Box className="h-4 w-4" /><span>New Product</span>
            </h4>
            <div className="grid sm:grid-cols-2 gap-3">
              <input type="text" required placeholder="Product Title" value={newTitle} onChange={e => setNewTitle(e.target.value)}
                className="rounded-lg border border-zinc-200 bg-white p-2.5 text-xs focus:outline-none dark:border-zinc-800 dark:bg-zinc-900 text-zinc-900 dark:text-white" />
              <select value={newCategory} onChange={e => setNewCategory(e.target.value)}
                className="rounded-lg border border-zinc-200 bg-white p-2.5 text-xs focus:outline-none dark:border-zinc-800 dark:bg-zinc-900 text-zinc-900 dark:text-white cursor-pointer">
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
              <button type="submit" className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg px-3 py-1.5 text-xs font-semibold shadow border-0 cursor-pointer">Save Listing</button>
              <button type="button" onClick={() => setShowAddForm(false)} className="border border-zinc-200 dark:border-zinc-800 text-zinc-650 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/40 rounded-lg px-3 py-1.5 text-xs font-semibold cursor-pointer bg-transparent">Cancel</button>
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
                <button onClick={() => openEditModal(p)} className="p-2 text-zinc-400 hover:text-emerald-500 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-950/20 cursor-pointer bg-transparent border-0" aria-label="Edit">
                  <Pencil className="h-4 w-4" />
                </button>
                <button onClick={() => handleDeleteProduct(p.id)} className="p-2 text-zinc-400 hover:text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/20 cursor-pointer bg-transparent border-0" aria-label="Delete">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
