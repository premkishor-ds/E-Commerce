'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAdmin } from '../../AdminContext';
import { RefreshCw, CheckCircle, Trash2, Package, X, Store } from 'lucide-react';
import {
  Section, SectionHeader, FilterBar, SearchBar, ApplyBtn, Table, Thead, renderSortableHeader, Pagination, Loading, TableSkeleton, badge
} from '../../../components/AdminUI';

export default function ProductsPage() {
  const router = useRouter();
  const {
    loadProducts, loadVendors, productSearch, setProductSearch,
    productSortField, setProductSortField, productSortOrder, setProductSortOrder,
    productPage, setProductPage, paginatedProducts, totalProductPages,
    selectedProduct, setSelectedProduct, apiAction, vendors, setSelectedSeller, setActiveTab,
    activeProductImageIndex, setActiveProductImageIndex
  } = useAdmin();

  const [localLoading, setLocalLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const init = async () => {
      setLocalLoading(true);
      await Promise.all([loadProducts(), loadVendors()]);
      if (active) setLocalLoading(false);
    };
    init();
    return () => { active = false; };
  }, []);

  const handleApply = async () => {
    setLocalLoading(true);
    await loadProducts();
    setLocalLoading(false);
  };

  return (
    <Section>
      <SectionHeader 
        title="Wholesale Supply Catalog" 
        desc="Moderate wholesale listings and manage catalog classifications." 
        right={
          <button onClick={handleApply} className="p-2 rounded-lg border dark:border-zinc-800 text-zinc-400 hover:text-indigo-500 hover:bg-zinc-55 dark:hover:bg-zinc-800 bg-white dark:bg-zinc-900 cursor-pointer">
            <RefreshCw className="h-4 w-4" />
          </button>
        }
      />

      <FilterBar>
        <SearchBar value={productSearch} onChange={setProductSearch} placeholder="Search product title..." />
        <ApplyBtn onClick={handleApply} />
      </FilterBar>

      <Table>
        <Thead>
          <tr>
            {renderSortableHeader('Product', 'title', productSortField, productSortOrder, (f, o) => { setProductSortField(f); setProductSortOrder(o); })}
            {renderSortableHeader('Price', 'price', productSortField, productSortOrder, (f, o) => { setProductSortField(f); setProductSortOrder(o); })}
            {renderSortableHeader('SKU', 'sku', productSortField, productSortOrder, (f, o) => { setProductSortField(f); setProductSortOrder(o); })}
            {renderSortableHeader('Approval', 'isApproved', productSortField, productSortOrder, (f, o) => { setProductSortField(f); setProductSortOrder(o); })}
            <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-zinc-500">Actions</th>
          </tr>
        </Thead>
        {localLoading ? (
          <TableSkeleton cols={5} />
        ) : (
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {paginatedProducts.map((p: any) => (
                <tr key={p._id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40 text-xs">
                  <td 
                    onClick={() => router.push(`/products/${p._id}`)} 
                    className="px-4 py-3 font-semibold text-indigo-655 dark:text-indigo-400 hover:underline cursor-pointer"
                  >
                    {p.title}
                  </td>
                  <td className="px-4 py-3 font-mono text-zinc-500">${(p.price ?? 0).toFixed(2)}</td>
                  <td className="px-4 py-3 text-zinc-400 font-mono">{p.sku}</td>
                  <td className="px-4 py-3">{badge(p.isApproved ? 'green' : 'amber', p.isApproved ? 'Approved' : 'Pending')}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      {!p.isApproved && (
                        <button 
                          onClick={async () => {
                            try {
                              await apiAction('PUT', `/admin/products/${p._id}/approve`);
                              loadProducts();
                            } catch (err: any) { alert(err.message); }
                          }}
                          className="p-1.5 rounded-lg border-0 text-zinc-400 hover:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 cursor-pointer bg-transparent" 
                          title="Approve"
                        >
                          <CheckCircle className="h-3.5 w-3.5" />
                        </button>
                      )}
                      <button 
                        onClick={async () => {
                          if (!confirm('Delete product?')) return;
                          try {
                            setLocalLoading(true);
                            await apiAction('DELETE', `/admin/products/${p._id}`);
                            await loadProducts();
                            setLocalLoading(false);
                          } catch (err: any) { alert(err.message); }
                        }}
                        className="p-1.5 rounded-lg border-0 text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 cursor-pointer bg-transparent"
                        title="Delete"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {paginatedProducts.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-zinc-400">No products found in catalog.</td>
                </tr>
              )}
            </tbody>
          )}
      </Table>
      {!localLoading && <Pagination currentPage={productPage} totalPages={totalProductPages} onPageChange={setProductPage} />}

      {/* Selected Product Drawer */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white dark:bg-zinc-900 rounded-3xl border dark:border-zinc-800 shadow-2xl w-full max-w-4xl p-6 relative max-h-[90vh] overflow-y-auto">
            <button onClick={() => setSelectedProduct(null)} className="absolute top-4 right-4 p-1.5 rounded-full text-zinc-405 hover:bg-zinc-100 dark:hover:bg-zinc-850 bg-transparent border-0 cursor-pointer">
              <X className="h-5 w-5" />
            </button>
            <div className="text-left border-b pb-3 dark:border-zinc-800">
              <h2 className="text-lg font-black text-zinc-900 dark:text-white">Product Details: {selectedProduct.title}</h2>
              <p className="text-xs text-zinc-500">SKU: {selectedProduct.sku} · ID: {selectedProduct._id}</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 text-xs mt-4">
              {/* Left Column: Media Gallery, Description */}
              <div className="space-y-6 text-left">
                {/* Media Gallery */}
                <div className="bg-white dark:bg-zinc-905 border dark:border-zinc-800 rounded-2xl p-4 shadow-sm space-y-4">
                  <h4 className="font-bold text-[10px] text-zinc-400 uppercase tracking-wider mb-2">Media Gallery</h4>
                  {selectedProduct.images && selectedProduct.images.length > 0 ? (
                    <div className="space-y-3">
                      <div className="aspect-video w-full rounded-xl overflow-hidden bg-zinc-55 dark:bg-zinc-950 border dark:border-zinc-800 flex items-center justify-center">
                        <img 
                          src={selectedProduct.images[activeProductImageIndex]} 
                          alt={selectedProduct.title} 
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>
                      <div className="flex gap-2 flex-wrap">
                        {selectedProduct.images.map((img: string, idx: number) => (
                          <button
                            key={idx}
                            onClick={() => setActiveProductImageIndex(idx)}
                            className={`w-14 h-14 rounded-lg overflow-hidden border-2 transition-all ${
                              activeProductImageIndex === idx 
                                ? 'border-indigo-600 scale-95 shadow-md' 
                                : 'border-zinc-200 dark:border-zinc-800 hover:border-indigo-400'
                            }`}
                          >
                            <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="aspect-video w-full rounded-xl bg-zinc-50 dark:bg-zinc-950 border dark:border-zinc-800 flex flex-col items-center justify-center text-zinc-400 gap-2">
                      <Package className="h-10 w-10 text-zinc-300 dark:text-zinc-700" />
                      <span className="font-medium text-xs">No media images uploaded.</span>
                    </div>
                  )}
                </div>

                {/* Description */}
                <div className="bg-white dark:bg-zinc-905 border dark:border-zinc-800 rounded-2xl p-4 shadow-sm space-y-2">
                  <h4 className="font-bold text-[10px] text-zinc-400 uppercase tracking-wider">Product Description</h4>
                  <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed text-xs">
                    {selectedProduct.description || 'No description provided.'}
                  </p>
                </div>
              </div>

              {/* Right Column: Pricing, Stats, Actions */}
              <div className="space-y-6 text-left">
                <div className="bg-white dark:bg-zinc-905 border dark:border-zinc-800 rounded-2xl p-6 shadow-sm space-y-5">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block mb-0.5">Wholesale Price</span>
                      <span className="text-3xl font-black text-indigo-650 dark:text-indigo-400">${(selectedProduct.price || 0).toFixed(2)}</span>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Catalog Meta</span>
                      <div className="flex gap-1.5 flex-wrap">
                        {badge('blue', selectedProduct.category?.name || 'General')}
                        {badge('zinc', selectedProduct.brand?.name || 'Unbranded')}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t dark:border-zinc-800">
                    <div className="space-y-1">
                      <span className="text-[10px] text-zinc-400 font-medium block">Rating</span>
                      <span className="font-bold text-xs text-zinc-900 dark:text-white">
                        ★ {selectedProduct.averageRating || 0}
                      </span>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] text-zinc-400 font-medium block">Total Views</span>
                      <span className="font-bold text-xs text-zinc-900 dark:text-white">
                        {selectedProduct.views || 0}
                      </span>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] text-zinc-400 font-medium block">Sales</span>
                      <span className="font-bold text-xs text-zinc-900 dark:text-white">
                        {selectedProduct.salesCount || 0} units
                      </span>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] text-zinc-400 font-medium block">Revenue</span>
                      <span className="font-bold text-xs text-emerald-600 dark:text-emerald-450">
                        ${((selectedProduct.price || 0) * (selectedProduct.salesCount || 0)).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Seller Partner Info */}
                <div className="bg-white dark:bg-zinc-905 border dark:border-zinc-800 rounded-2xl p-6 shadow-sm space-y-4">
                  <h4 className="font-bold text-[10px] text-zinc-400 uppercase tracking-wider border-b pb-2 dark:border-zinc-800">Merchant Partner Info</h4>
                  {(() => {
                    const matchedVendor = vendors.find(
                      (v: any) => v.userId?._id === selectedProduct.vendorId || v.userId === selectedProduct.vendorId || v._id === selectedProduct.vendorId
                    );
                    if (matchedVendor) {
                      return (
                        <div className="space-y-3">
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <span className="text-[10px] text-zinc-400 block font-medium">Shop Name</span>
                              <span className="font-bold text-zinc-800 dark:text-zinc-200">{matchedVendor.shopName}</span>
                            </div>
                            <div>
                              <span className="text-[10px] text-zinc-400 block font-medium">Company Entity</span>
                              <span className="font-bold text-zinc-800 dark:text-zinc-200">{matchedVendor.companyLegalName || '—'}</span>
                            </div>
                          </div>
                        </div>
                      );
                    }
                    return (
                      <div className="text-zinc-400 font-medium text-xs py-2 flex items-center gap-1.5">
                        <Store className="h-4 w-4 shrink-0 text-zinc-300" />
                        <span>Platform Direct Product (No Merchant Partner)</span>
                      </div>
                    );
                  })()}
                </div>

                {/* Moderation Controls */}
                <div className="bg-white dark:bg-zinc-905 border dark:border-zinc-800 rounded-2xl p-6 shadow-sm space-y-4">
                  <h4 className="font-bold text-[10px] text-zinc-400 uppercase tracking-wider border-b pb-2 dark:border-zinc-800">System Approvals & Listing Status</h4>
                  
                  <div className="pt-2 flex flex-col gap-2.5">
                    {!selectedProduct.isApproved && (
                      <button 
                        onClick={async () => {
                          try {
                            await apiAction('PUT', `/admin/products/${selectedProduct._id}/approve`);
                            alert('Product approved successfully!');
                            setSelectedProduct(null);
                            loadProducts();
                          } catch (err: any) { alert(err.message); }
                        }}
                        className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-center cursor-pointer border-0 text-xs shadow"
                      >
                        Approve Product Listing
                      </button>
                    )}

                    <button 
                      onClick={async () => {
                        try {
                          await apiAction('PUT', `/admin/products/${selectedProduct._id}/activation`, { active: !selectedProduct.isActive });
                          alert(`Product status successfully changed!`);
                          setSelectedProduct(null);
                          loadProducts();
                        } catch (err: any) { alert(err.message); }
                      }}
                      className={`w-full py-2.5 font-bold rounded-lg text-center text-white cursor-pointer border-0 text-xs shadow ${
                        selectedProduct.isActive ? 'bg-amber-600 hover:bg-amber-500' : 'bg-indigo-650 hover:bg-indigo-500'
                      }`}
                    >
                      {selectedProduct.isActive ? 'Deactivate Listing (Hide)' : 'Activate Listing (Show)'}
                    </button>

                    <button 
                      onClick={async () => {
                        if (!confirm('Permanently delete product?')) return;
                        try {
                          await apiAction('DELETE', `/admin/products/${selectedProduct._id}`);
                          alert('Product deleted successfully!');
                          setSelectedProduct(null);
                          loadProducts();
                        } catch (err: any) { alert(err.message); }
                      }}
                      className="w-full py-2.5 bg-red-600 hover:bg-red-500 text-white font-bold rounded-lg text-center cursor-pointer border-0 text-xs shadow"
                    >
                      Delete Product Listing
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Section>
  );
}
