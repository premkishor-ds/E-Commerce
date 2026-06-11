'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAdmin } from '../../../AdminContext';
import { ArrowLeft, Save, Store, Mail, ShieldAlert, Award, Percent, Building2, Phone } from 'lucide-react';
import { Section, SectionHeader, badge, statusColor } from '../../../../components/AdminUI';

export default function VendorDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { vendors, loadVendors, apiAction } = useAdmin();
  
  const [vendor, setVendor] = useState<any>(null);
  const [localLoading, setLocalLoading] = useState(true);
  
  const [editCompanyLegalName, setEditCompanyLegalName] = useState('');
  const [editBusinessPhone, setEditBusinessPhone] = useState('');
  const [sellerCommission, setSellerCommission] = useState(10);
  const [editStatus, setEditStatus] = useState('Active');

  useEffect(() => {
    const init = async () => {
      setLocalLoading(true);
      if (vendors.length === 0) {
        await loadVendors();
      }
      setLocalLoading(false);
    };
    init();
  }, []);

  useEffect(() => {
    if (vendors.length > 0) {
      const found = vendors.find((v) => v._id === id);
      if (found) {
        setVendor(found);
        setEditCompanyLegalName(found.companyLegalName || '');
        setEditBusinessPhone(found.businessPhone || '');
        setSellerCommission(found.commissionRate || 10);
        setEditStatus(found.status || 'Active');
      }
    }
  }, [vendors, id]);

  const saveMerchantChanges = async () => {
    if (!editCompanyLegalName.trim() || !editBusinessPhone.trim()) {
      alert('Company Legal Name and Business Phone are mandatory fields!');
      return;
    }
    try {
      await apiAction('PUT', `/admin/users/${vendor.userId?._id || vendor.userId}`, {
        accountStatus: editStatus,
        walletBalance: vendor.userId?.walletBalance,
        commissionRate: sellerCommission,
      });
      await apiAction('PUT', `/admin/vendors/${id}`, {
        companyLegalName: editCompanyLegalName,
        businessPhone: editBusinessPhone,
        commissionRate: sellerCommission,
        status: editStatus,
      });
      alert('Merchant details updated successfully!');
      await loadVendors();
    } catch (err: any) {
      alert(`Failed to save merchant changes: ${err.message}`);
    }
  };

  if (localLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-650"></div>
      </div>
    );
  }

  if (!vendor) {
    return (
      <div className="text-center py-12">
        <h3 className="text-sm font-bold text-zinc-550">Merchant record not found.</h3>
        <button onClick={() => router.push('/vendors')} className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-semibold">
          Back to Merchants
        </button>
      </div>
    );
  }

  const isSeller = vendor.userId?.roles?.includes('Seller');
  const isVendor = vendor.userId?.roles?.includes('Vendor');
  const mType = isSeller ? 'Seller' : isVendor ? 'Vendor' : 'Unknown';
  const mColor = isSeller ? 'green' : isVendor ? 'blue' : 'zinc';

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.push('/vendors')}
          className="p-2 border dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-500 rounded-xl hover:text-indigo-500 transition-colors cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div>
          <h1 className="text-xl font-black text-zinc-900 dark:text-white">
            {vendor.shopName}
          </h1>
          <p className="text-xs text-zinc-400">Manage store commission, legal standing, and account details.</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left column: merchant detail */}
        <div className="lg:col-span-2 space-y-6">
          <Section>
            <SectionHeader title="Merchant Partner Credentials" desc="Store details and merchant category classifications." />
            <div className="p-6 grid md:grid-cols-2 gap-6 text-xs text-zinc-700 dark:text-zinc-300">
              <div className="space-y-4">
                <div className="flex items-center gap-3 bg-zinc-50 dark:bg-zinc-950 p-3 rounded-xl border dark:border-zinc-850">
                  <Store className="h-4 w-4 text-zinc-400" />
                  <div>
                    <span className="block text-[9px] font-bold text-zinc-450 uppercase">Shop Name</span>
                    <span className="font-semibold">{vendor.shopName}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-zinc-50 dark:bg-zinc-950 p-3 rounded-xl border dark:border-zinc-850">
                  <Building2 className="h-4 w-4 text-zinc-400" />
                  <div>
                    <span className="block text-[9px] font-bold text-zinc-450 uppercase">Company Legal Name</span>
                    <span className="font-semibold">{vendor.companyLegalName || '—'}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-zinc-50 dark:bg-zinc-950 p-3 rounded-xl border dark:border-zinc-850">
                  <Mail className="h-4 w-4 text-zinc-400" />
                  <div>
                    <span className="block text-[9px] font-bold text-zinc-450 uppercase">Owner Email</span>
                    <span className="font-semibold">{vendor.userId?.email || '—'}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 bg-zinc-50 dark:bg-zinc-950 p-3 rounded-xl border dark:border-zinc-850">
                  <Percent className="h-4 w-4 text-zinc-400" />
                  <div>
                    <span className="block text-[9px] font-bold text-zinc-450 uppercase">Commission Rate</span>
                    <span className="font-bold text-zinc-900 dark:text-white">{vendor.commissionRate || 10}%</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-zinc-50 dark:bg-zinc-950 p-3 rounded-xl border dark:border-zinc-850">
                  <Phone className="h-4 w-4 text-zinc-400" />
                  <div>
                    <span className="block text-[9px] font-bold text-zinc-450 uppercase">Business Phone</span>
                    <span className="font-semibold">{vendor.businessPhone || '—'}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-zinc-50 dark:bg-zinc-950 p-3 rounded-xl border dark:border-zinc-850">
                  <Award className="h-4 w-4 text-zinc-400" />
                  <div>
                    <span className="block text-[9px] font-bold text-zinc-450 uppercase">Partner Type</span>
                    <div>{badge(mColor, mType)}</div>
                  </div>
                </div>
              </div>
            </div>
          </Section>
        </div>

        {/* Right column: Actions */}
        <div className="space-y-6">
          <Section>
            <SectionHeader title="Manage Merchant Rules" desc="Commission rates and active standing." />
            <div className="p-6 space-y-4 text-xs">
              <div className="space-y-1">
                <label className="block text-[10px] text-zinc-400 font-bold uppercase">Account Status</label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value)}
                  className="w-full px-3 py-2 border dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-xl text-zinc-805 dark:text-white"
                >
                  <option value="Active">Active</option>
                  <option value="Verification In Progress">Verification In Progress</option>
                  <option value="Suspended">Suspended</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] text-zinc-400 font-bold uppercase">Company Legal Name</label>
                <input
                  type="text"
                  value={editCompanyLegalName}
                  onChange={(e) => setEditCompanyLegalName(e.target.value)}
                  className="w-full px-3 py-2 border dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-xl text-zinc-805 dark:text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] text-zinc-400 font-bold uppercase">Business Phone</label>
                <input
                  type="text"
                  value={editBusinessPhone}
                  onChange={(e) => setEditBusinessPhone(e.target.value)}
                  className="w-full px-3 py-2 border dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-xl text-zinc-805 dark:text-white font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] text-zinc-400 font-bold uppercase">Commission Rate (%)</label>
                <input
                  type="number"
                  value={sellerCommission}
                  onChange={(e) => setSellerCommission(Number(e.target.value))}
                  className="w-full px-3 py-2 border dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-xl text-zinc-805 dark:text-white font-mono"
                />
              </div>

              <button
                onClick={saveMerchantChanges}
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl cursor-pointer border-0"
              >
                <Save className="h-4 w-4" />
                Save Partner Settings
              </button>
            </div>
          </Section>
        </div>
      </div>
    </div>
  );
}
