'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAdmin } from '../../AdminContext';
import { RefreshCw, CheckCircle, XCircle, X } from 'lucide-react';
import {
  Section, SectionHeader, FilterBar, SearchBar, Sel, ApplyBtn, Table, Thead, renderSortableHeader, Pagination, Loading, TableSkeleton, badge, statusColor
} from '../../../components/AdminUI';

export default function VendorsPage() {
  const router = useRouter();
  const {
    loadVendors, vendorSearch, setVendorSearch, vendorStatus, setVendorStatus,
    vendorType, setVendorType, vendorSortField, setVendorSortField, vendorSortOrder, setVendorSortOrder,
    vendorPage, setVendorPage, paginatedVendors, totalVendorPages, selectedSeller, setSelectedSeller,
    sellerCommission, setSellerCommission, editCompanyLegalName, setEditCompanyLegalName,
    editBusinessPhone, setEditBusinessPhone, apiAction,
    vendorMinCommission, setVendorMinCommission, vendorStartDate, setVendorStartDate, vendorEndDate, setVendorEndDate
  } = useAdmin();

  const [localLoading, setLocalLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const init = async () => {
      setLocalLoading(true);
      await loadVendors();
      if (active) setLocalLoading(false);
    };
    init();
    return () => { active = false; };
  }, []);

  const handleApply = async () => {
    setLocalLoading(true);
    await loadVendors();
    setLocalLoading(false);
  };

  const saveMerchantChanges = async () => {
    if (!selectedSeller) return;
    if (!editCompanyLegalName.trim() || !editBusinessPhone.trim()) {
      alert('Company Legal Name and Business Phone are mandatory fields!');
      return;
    }
    try {
      await apiAction('PUT', `/admin/users/${selectedSeller.userId?._id || selectedSeller.userId}`, {
        walletBalance: selectedSeller.userId?.walletBalance,
        commissionRate: sellerCommission
      });
      await apiAction('PUT', `/admin/vendors/${selectedSeller._id}`, {
        companyLegalName: editCompanyLegalName,
        businessPhone: editBusinessPhone,
        commissionRate: sellerCommission
      });
      alert('Merchant details and commission updated successfully!');
      setSelectedSeller(null);
      setLocalLoading(true);
      await loadVendors();
      setLocalLoading(false);
    } catch (err: any) {
      alert(`Failed to save merchant changes: ${err.message}`);
    }
  };

  return (
    <Section>
      <SectionHeader 
        title="Merchant Partner Directory" 
        desc="Validate and manage B2C Retail Sellers and B2B Wholesale Vendors."
        right={
          <button onClick={handleApply} className="p-2 rounded-lg border dark:border-zinc-800 text-zinc-405 hover:text-indigo-500 hover:bg-zinc-55 dark:hover:bg-zinc-800 bg-white dark:bg-zinc-900 cursor-pointer">
            <RefreshCw className="h-4 w-4" />
          </button>
        }
      />

      <div className="flex border-b dark:border-zinc-800 px-6 bg-zinc-50/30 dark:bg-zinc-900/10">
        {[
          { key: 'all', label: 'All Accounts' },
          { key: 'seller', label: 'Sellers (Retail / B2C)' },
          { key: 'vendor', label: 'Vendors (Wholesale / B2B)' }
        ].map(t => (
          <button 
            key={t.key} 
            onClick={() => {
              setVendorType(t.key);
            }}
            className={`px-4 py-3 text-xs font-bold border-b-2 -mb-[2px] transition-all cursor-pointer border-0 bg-transparent ${
              vendorType === t.key
                ? 'border-indigo-600 text-indigo-650 dark:text-indigo-400 font-extrabold'
                : 'border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <FilterBar>
        <SearchBar value={vendorSearch} onChange={setVendorSearch} placeholder="Search shop, company..." />
        <input 
          type="number" 
          value={vendorMinCommission} 
          onChange={e => setVendorMinCommission(e.target.value)} 
          placeholder="Min Commission %..." 
          className="px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-indigo-500 w-[150px]"
        />
        <Sel 
          value={vendorStatus} 
          onChange={setVendorStatus} 
          placeholder="All Statuses" 
          options={[
            { value: 'Verification In Progress', label: 'Verification In Progress' },
            { value: 'Active', label: 'Active' },
            { value: 'Suspended', label: 'Suspended' }
          ]} 
        />
        <div className="flex items-center gap-1.5 text-xs text-zinc-500">
          <span className="font-semibold text-zinc-400">Registered From:</span>
          <input 
            type="date" 
            value={vendorStartDate} 
            onChange={e => setVendorStartDate(e.target.value)} 
            className="px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs text-zinc-900 dark:text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
          />
          <span className="font-semibold text-zinc-400">To:</span>
          <input 
            type="date" 
            value={vendorEndDate} 
            onChange={e => setVendorEndDate(e.target.value)} 
            className="px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs text-zinc-900 dark:text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
          />
        </div>
        <ApplyBtn onClick={handleApply} />
      </FilterBar>

      <Table>
        <Thead>
          <tr>
            {renderSortableHeader('Shop', 'shopName', vendorSortField, vendorSortOrder, (f, o) => { setVendorSortField(f); setVendorSortOrder(o); })}
            {renderSortableHeader('Type', 'type', vendorSortField, vendorSortOrder, (f, o) => { setVendorSortField(f); setVendorSortOrder(o); })}
            {renderSortableHeader('Email Address', 'email', vendorSortField, vendorSortOrder, (f, o) => { setVendorSortField(f); setVendorSortOrder(o); })}
            {renderSortableHeader('Company Name', 'companyLegalName', vendorSortField, vendorSortOrder, (f, o) => { setVendorSortField(f); setVendorSortOrder(o); })}
            {renderSortableHeader('Phone', 'businessPhone', vendorSortField, vendorSortOrder, (f, o) => { setVendorSortField(f); setVendorSortOrder(o); })}
            {renderSortableHeader('Commission', 'commissionRate', vendorSortField, vendorSortOrder, (f, o) => { setVendorSortField(f); setVendorSortOrder(o); })}
            {renderSortableHeader('Status', 'status', vendorSortField, vendorSortOrder, (f, o) => { setVendorSortField(f); setVendorSortOrder(o); })}
            <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-zinc-500">Actions</th>
          </tr>
        </Thead>
        {localLoading ? (
          <TableSkeleton cols={8} />
        ) : (
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {paginatedVendors.map((v: any) => {
                const isSeller = v.userId?.roles?.includes('Seller');
                const isVendor = v.userId?.roles?.includes('Vendor');
                const mType = isSeller ? 'Seller' : isVendor ? 'Vendor' : 'Unknown';
                const mColor = isSeller ? 'green' : isVendor ? 'blue' : 'zinc';
                return (
                  <tr key={v._id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40 text-xs">
                    <td 
                      onClick={() => router.push(`/vendors/${v._id}`)} 
                      className="px-4 py-3 font-semibold text-indigo-650 dark:text-indigo-400 hover:underline cursor-pointer"
                    >
                      {v.shopName}
                    </td>
                    <td className="px-4 py-3">{badge(mColor, mType)}</td>
                    <td className="px-4 py-3 text-zinc-500">{v.userId?.email || '—'}</td>
                    <td className="px-4 py-3 text-zinc-500">{v.companyLegalName || '—'}</td>
                    <td className="px-4 py-3 text-zinc-500">{v.businessPhone || '—'}</td>
                    <td className="px-4 py-3 text-zinc-550 font-bold">{v.commissionRate}%</td>
                    <td className="px-4 py-3">{badge(statusColor(v.status), v.status)}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        {v.status !== 'Active' && (
                          <button 
                            onClick={async () => {
                              try {
                                setLocalLoading(true);
                                await apiAction('PUT', `/admin/vendors/${v._id}/status`, { status: 'Active' });
                                await loadVendors();
                                setLocalLoading(false);
                              } catch (err: any) { alert(err.message); }
                            }}
                            className="p-1.5 rounded-lg border-0 text-zinc-400 hover:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 cursor-pointer bg-transparent" 
                            title="Approve"
                          >
                            <CheckCircle className="h-3.5 w-3.5" />
                          </button>
                        )}
                        {v.status !== 'Suspended' && (
                          <button 
                            onClick={async () => {
                              try {
                                setLocalLoading(true);
                                await apiAction('PUT', `/admin/vendors/${v._id}/status`, { status: 'Suspended' });
                                await loadVendors();
                                setLocalLoading(false);
                              } catch (err: any) { alert(err.message); }
                            }}
                            className="p-1.5 rounded-lg border-0 text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 cursor-pointer bg-transparent" 
                            title="Suspend"
                          >
                            <XCircle className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
              {paginatedVendors.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center py-8 text-zinc-400">No merchant partners found.</td>
                </tr>
              )}
            </tbody>
          )}
      </Table>
      {!localLoading && <Pagination currentPage={vendorPage} totalPages={totalVendorPages} onPageChange={setVendorPage} />}

      {/* Verify / Details Modal */}
      {selectedSeller && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border dark:border-zinc-800 shadow-2xl w-full max-w-lg p-6 space-y-4">
            <div className="flex items-center justify-between border-b pb-3 dark:border-zinc-800">
              <h3 className="font-bold text-zinc-900 dark:text-white">Merchant Validation Drawer</h3>
              <button onClick={() => setSelectedSeller(null)} className="p-1 text-zinc-400 bg-transparent border-0 cursor-pointer"><X className="h-5 w-5" /></button>
            </div>
            
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div><strong className="text-zinc-400 block mb-0.5">Shop Name:</strong> <div className="text-zinc-800 dark:text-zinc-200">{selectedSeller.shopName}</div></div>
                <div><strong className="text-zinc-400 block mb-0.5">PAN details:</strong> <div className="text-zinc-800 dark:text-zinc-200 font-mono">ABCDE1234F</div></div>
                <div className="col-span-2"><strong className="text-zinc-400 block mb-0.5">GST Registration:</strong> <div className="text-zinc-800 dark:text-zinc-200 font-mono">22AAAAA0000A1Z5</div></div>
              </div>

              <div className="space-y-3 border-t dark:border-zinc-800 pt-3">
                <div>
                  <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block mb-1">Company Legal Name <span className="text-red-500">*</span></label>
                  <input 
                    type="text"
                    className="w-full rounded-lg border dark:border-zinc-800 p-2 text-xs focus:outline-none focus:border-indigo-500 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white font-medium" 
                    value={editCompanyLegalName} 
                    onChange={e => setEditCompanyLegalName(e.target.value)} 
                    placeholder="Enter Legal Name"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block mb-1">Business Phone <span className="text-red-500">*</span></label>
                  <input 
                    type="text"
                    className="w-full rounded-lg border dark:border-zinc-800 p-2 text-xs focus:outline-none focus:border-indigo-500 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white font-medium" 
                    value={editBusinessPhone} 
                    onChange={e => setEditBusinessPhone(e.target.value)} 
                    placeholder="Enter Business Phone"
                  />
                </div>
              </div>

              <div className="space-y-2 border-t dark:border-zinc-800 pt-3">
                <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block">Commission Percentage: <strong className="text-indigo-650">{sellerCommission}%</strong></label>
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={sellerCommission} 
                  onChange={e => setSellerCommission(parseInt(e.target.value))} 
                  className="w-full h-1 bg-zinc-200 rounded-lg appearance-none cursor-pointer" 
                />
                <button 
                  onClick={saveMerchantChanges}
                  className="w-full mt-2 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg border-0 cursor-pointer shadow"
                >
                  Save Merchant Details
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Section>
  );
}
