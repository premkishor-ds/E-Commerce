'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAdmin } from '../../AdminContext';
import { RefreshCw, Download, X } from 'lucide-react';
import {
  Section, SectionHeader, FilterBar, SearchBar, Sel, ApplyBtn, Table, Thead, renderSortableHeader, Pagination, Loading, TableSkeleton, badge, statusColor
} from '../../../components/AdminUI';

export default function UsersPage() {
  const router = useRouter();
  const {
    loadUsers, userSearch, setUserSearch, userRole, setUserRole, userStatus, setUserStatus,
    userSortField, setUserSortField, userSortOrder, setUserSortOrder, userPage, setUserPage,
    paginatedUsers, totalUserPages, selectedUser, setSelectedUser, handleExportCustomers, apiAction
  } = useAdmin();


  const [editStatus, setEditStatus] = useState('Active');
  const [editWallet, setEditWallet] = useState(0);
  const [localLoading, setLocalLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const init = async () => {
      setLocalLoading(true);
      await loadUsers();
      if (active) setLocalLoading(false);
    };
    init();
    return () => { active = false; };
  }, []);

  const handleApply = async () => {
    setLocalLoading(true);
    await loadUsers();
    setLocalLoading(false);
  };

  useEffect(() => {
    if (selectedUser) {
      setEditStatus(selectedUser.accountStatus || 'Active');
      setEditWallet(selectedUser.walletBalance || 0);
    }
  }, [selectedUser]);

  const saveUserChanges = async () => {
    if (!selectedUser) return;
    try {
      await apiAction('PUT', `/admin/users/${selectedUser._id}`, {
        accountStatus: editStatus,
        walletBalance: Number(editWallet)
      });
      alert('Customer updated successfully!');
      setSelectedUser(null);
      setLocalLoading(true);
      await loadUsers();
      setLocalLoading(false);
    } catch (err: any) {
      alert(err.message || 'Failed to update user');
    }
  };

  return (
    <Section>
      <SectionHeader 
        title="Customers Workspace" 
        desc="Audit customer registrations, account standings, and wallet values." 
        right={
          <div className="flex gap-2">
            <button onClick={handleApply} className="p-2 rounded-lg border dark:border-zinc-800 text-zinc-400 hover:text-indigo-500 hover:bg-zinc-50 dark:hover:bg-zinc-800 bg-white dark:bg-zinc-900 cursor-pointer">
              <RefreshCw className="h-4 w-4" />
            </button>
            <button onClick={handleExportCustomers} className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold shadow cursor-pointer border-0">
              <Download className="h-3.5 w-3.5" /> Export CSV
            </button>
          </div>
        }
      />

      <FilterBar>
        <SearchBar value={userSearch} onChange={setUserSearch} placeholder="Search customers name, email..." />
        <Sel 
          value={userStatus} 
          onChange={setUserStatus} 
          placeholder="All Standings" 
          options={[
            { value: 'Active', label: 'Active' },
            { value: 'Suspended', label: 'Suspended' },
            { value: 'Inactive', label: 'Inactive' }
          ]} 
        />
        <ApplyBtn onClick={handleApply} />
      </FilterBar>

      <Table>
        <Thead>
          <tr>
            {renderSortableHeader('Name', 'name', userSortField, userSortOrder, (f, o) => { setUserSortField(f); setUserSortOrder(o); })}
            {renderSortableHeader('Email Address', 'email', userSortField, userSortOrder, (f, o) => { setUserSortField(f); setUserSortOrder(o); })}
            {renderSortableHeader('Wallet Value', 'walletBalance', userSortField, userSortOrder, (f, o) => { setUserSortField(f); setUserSortOrder(o); }, 'right')}
            {renderSortableHeader('Standing', 'accountStatus', userSortField, userSortOrder, (f, o) => { setUserSortField(f); setUserSortOrder(o); })}
            <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-zinc-500">Registered At</th>
          </tr>
        </Thead>
        {localLoading ? (
          <TableSkeleton cols={5} />
        ) : (
          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {paginatedUsers.map((u: any) => (
              <tr key={u._id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40 text-xs">
                <td 
                  onClick={() => router.push(`/users/${u._id}`)} 
                  className="px-4 py-3 font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                >
                  {u.firstName} {u.lastName}
                </td>
                <td className="px-4 py-3 text-zinc-550">{u.email}</td>
                <td className="px-4 py-3 text-right font-mono font-bold text-zinc-800 dark:text-zinc-200">
                  ${(u.walletBalance ?? 0).toFixed(2)}
                </td>
                <td className="px-4 py-3">{badge(statusColor(u.accountStatus), u.accountStatus || 'Active')}</td>
                <td className="px-4 py-3 text-zinc-400">
                  {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'N/A'}
                </td>
              </tr>
            ))}
            {paginatedUsers.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-8 text-zinc-400">No customers found matching queries.</td>
              </tr>
            )}
          </tbody>
        )}
      </Table>
      {!localLoading && <Pagination currentPage={userPage} totalPages={totalUserPages} onPageChange={setUserPage} />}

      {/* Selected Customer Details Drawer */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border dark:border-zinc-800 shadow-2xl w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between border-b pb-3 dark:border-zinc-800">
              <h3 className="font-bold text-zinc-905 dark:text-white">Customer Account Standing</h3>
              <button onClick={() => setSelectedUser(null)} className="p-1 text-zinc-400 hover:text-zinc-650 bg-transparent border-0 cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-4 text-xs">
              <div className="space-y-2">
                <div><strong>Full Name:</strong> {selectedUser.firstName} {selectedUser.lastName}</div>
                <div><strong>Email:</strong> {selectedUser.email}</div>
                <div><strong>Joined On:</strong> {selectedUser.createdAt ? new Date(selectedUser.createdAt).toLocaleString() : 'N/A'}</div>
              </div>

              <div className="border-t dark:border-zinc-800 pt-3 space-y-3">
                <div>
                  <label className="text-[10px] text-zinc-400 font-bold uppercase block mb-1">Account standing</label>
                  <select 
                    value={editStatus} 
                    onChange={e => setEditStatus(e.target.value)} 
                    className="w-full rounded-lg border dark:border-zinc-800 p-2 text-xs bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white outline-none focus:border-indigo-500 cursor-pointer"
                  >
                    <option value="Active">Active</option>
                    <option value="Suspended">Suspended</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
                
                <div>
                  <label className="text-[10px] text-zinc-400 font-bold uppercase block mb-1">Wallet value ($)</label>
                  <input 
                    type="number" 
                    value={editWallet} 
                    onChange={e => setEditWallet(Number(e.target.value))} 
                    className="w-full rounded-lg border dark:border-zinc-800 p-2 text-xs bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="border-t dark:border-zinc-800 pt-3">
                <button 
                  onClick={saveUserChanges} 
                  className="w-full py-2.5 bg-indigo-650 hover:bg-indigo-600 text-white font-semibold rounded-xl text-xs cursor-pointer shadow border-0"
                >
                  Save Account Standing
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Section>
  );
}
