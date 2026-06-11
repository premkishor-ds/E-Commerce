'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAdmin } from '../../../AdminContext';
import { ArrowLeft, CheckCircle, Trash2, Package, Tag, Layers, DollarSign, Star, Eye, ShoppingCart } from 'lucide-react';
import { Section, SectionHeader, badge } from '../../../../components/AdminUI';

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { products, loadProducts, apiAction } = useAdmin();
  
  const [product, setProduct] = useState<any>(null);
  const [localLoading, setLocalLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      setLocalLoading(true);
      if (products.length === 0) {
        await loadProducts();
      }
      setLocalLoading(false);
    };
    init();
  }, []);

  useEffect(() => {
    if (products.length > 0) {
      const found = products.find((p) => p._id === id);
      if (found) {
        setProduct(found);
      }
    }
  }, [products, id]);

  const approveProduct = async () => {
    try {
      await apiAction('PUT', `/admin/products/${id}/approve`);
      alert('Product approved!');
      await loadProducts();
    } catch (err: any) {
      alert(err.message || 'Failed to approve product');
    }
  };

  const deleteProduct = async () => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      await apiAction('DELETE', `/admin/products/${id}`);
      alert('Product deleted!');
      router.push('/products');
    } catch (err: any) {
      alert(err.message || 'Failed to delete product');
    }
  };

  if (localLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-650"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-12">
        <h3 className="text-sm font-bold text-zinc-550">Product record not found.</h3>
        <button onClick={() => router.push('/products')} className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-semibold">
          Back to Products
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.push('/products')}
          className="p-2 border dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-500 rounded-xl hover:text-indigo-500 transition-colors cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div>
          <h1 className="text-xl font-black text-zinc-900 dark:text-white">
            {product.title}
          </h1>
          <p className="text-xs text-zinc-400">SKU: {product.sku || '—'}</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left column: product detail & image */}
        <div className="lg:col-span-2 space-y-6">
          <Section>
            <SectionHeader title="Product Listing Details" desc="Wholesale catalog listing information." />
            <div className="p-6 space-y-6 text-xs">
              <div className="flex items-start gap-4">
                {product.images && product.images.length > 0 ? (
                  <div className="h-24 w-24 rounded-xl overflow-hidden bg-zinc-50 dark:bg-zinc-950 border dark:border-zinc-800 flex items-center justify-center shrink-0">
                    <img src={product.images[0]} alt={product.title} className="max-h-full max-w-full object-contain" />
                  </div>
                ) : (
                  <div className="h-24 w-24 bg-zinc-50 dark:bg-zinc-955 rounded-xl border dark:border-zinc-800 flex items-center justify-center shrink-0">
                    <Package className="h-8 w-8 text-zinc-300" />
                  </div>
                )}
                <div className="space-y-2">
                  <div className="text-zinc-805 dark:text-zinc-200 font-bold text-sm">{product.title}</div>
                  <div className="text-zinc-500 leading-relaxed">{product.description || 'No description provided.'}</div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6 pt-4 border-t dark:border-zinc-800 text-zinc-700 dark:text-zinc-300">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 bg-zinc-50 dark:bg-zinc-950 p-3 rounded-xl border dark:border-zinc-850">
                    <DollarSign className="h-4 w-4 text-zinc-405" />
                    <div>
                      <span className="block text-[9px] font-bold text-zinc-450 uppercase">Wholesale Price</span>
                      <span className="font-bold text-sm text-zinc-900 dark:text-white">${(product.price ?? 0).toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 bg-zinc-50 dark:bg-zinc-950 p-3 rounded-xl border dark:border-zinc-850">
                    <Tag className="h-4 w-4 text-zinc-405" />
                    <div>
                      <span className="block text-[9px] font-bold text-zinc-450 uppercase">SKU Reference</span>
                      <span className="font-semibold font-mono">{product.sku}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3 bg-zinc-50 dark:bg-zinc-950 p-3 rounded-xl border dark:border-zinc-850">
                    <Eye className="h-4 w-4 text-zinc-405" />
                    <div>
                      <span className="block text-[9px] font-bold text-zinc-450 uppercase">Views / Traffic</span>
                      <span className="font-bold">{product.views ?? 0} total</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 bg-zinc-50 dark:bg-zinc-950 p-3 rounded-xl border dark:border-zinc-850">
                    <ShoppingCart className="h-4 w-4 text-zinc-405" />
                    <div>
                      <span className="block text-[9px] font-bold text-zinc-450 uppercase">Units Sold</span>
                      <span className="font-bold text-indigo-600 dark:text-indigo-400">{product.totalUnitsSold ?? product.salesCount ?? 0} units</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Section>
        </div>

        {/* Right column: Actions */}
        <div className="space-y-6">
          <Section>
            <SectionHeader title="Status & Approval" desc="Perform administrative listing actions." />
            <div className="p-6 space-y-4 text-xs">
              <div className="space-y-2">
                <span className="block text-[10px] text-zinc-400 font-bold uppercase">Approval Status</span>
                <div>{badge(product.isApproved ? 'green' : 'amber', product.isApproved ? 'Approved' : 'Pending Verification')}</div>
              </div>

              <div className="pt-2 space-y-2">
                {!product.isApproved && (
                  <button
                    onClick={approveProduct}
                    className="w-full flex items-center justify-center gap-2 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl cursor-pointer border-0"
                  >
                    <CheckCircle className="h-4 w-4" />
                    Approve Listing
                  </button>
                )}

                <button
                  onClick={deleteProduct}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-red-650 hover:bg-red-500 text-white font-bold rounded-xl cursor-pointer border-0"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete Listing
                </button>
              </div>
            </div>
          </Section>
        </div>
      </div>
    </div>
  );
}
