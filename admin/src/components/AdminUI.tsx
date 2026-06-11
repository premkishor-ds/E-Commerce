'use client';

import React from 'react';
import { ChevronUp, ChevronDown, Search, Filter, RefreshCw } from 'lucide-react';

export function badge(color: string, text: string) {
  const map: Record<string, string> = {
    green:  'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-300 dark:border-emerald-800',
    red:    'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/30 dark:text-red-300 dark:border-red-800',
    amber:  'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-300 dark:border-amber-800',
    blue:   'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/30 dark:text-blue-300 dark:border-blue-800',
    zinc:   'bg-zinc-100 text-zinc-650 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700',
  };
  return <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold border ${map[color] ?? map.zinc}`}>{text}</span>;
}

export function statusColor(s: string) {
  const m: Record<string, string> = {
    Active: 'green', Approved: 'green', Delivered: 'green', Completed: 'green',
    Pending: 'amber', Open: 'amber', 'In Progress': 'amber', 'Verification In Progress': 'amber',
    Cancelled: 'red', Suspended: 'red', Rejected: 'red', Flagged: 'red',
    Shipped: 'blue', Paid: 'blue',
    Inactive: 'zinc', Resolved: 'zinc', Closed: 'zinc',
  };
  return m[s] ?? 'zinc';
}

export function Section({ children }: { children: React.ReactNode }) {
  return <div className="bg-white dark:bg-zinc-900 rounded-2xl border dark:border-zinc-800 shadow-sm overflow-hidden">{children}</div>;
}

export function SectionHeader({ title, desc, right }: { title: string; desc?: string; right?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between px-6 py-4 border-b dark:border-zinc-800">
      <div>
        <h2 className="font-bold text-base text-zinc-900 dark:text-white">{title}</h2>
        {desc && <p className="text-xs text-zinc-400 mt-0.5">{desc}</p>}
      </div>
      {right}
    </div>
  );
}

export function Table({ children }: { children: React.ReactNode }) {
  return <div className="overflow-x-auto"><table className="w-full text-sm">{children}</table></div>;
}

export function Thead({ children }: { children: React.ReactNode }) {
  return <thead className="bg-zinc-50 dark:bg-zinc-800/50 border-b dark:border-zinc-700">{children}</thead>;
}

export function FilterBar({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-wrap gap-3 px-6 py-4 border-b dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">{children}</div>;
}

export function ApplyBtn({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick} className="flex items-center gap-1.5 px-4 py-2 bg-indigo-650 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl cursor-pointer transition-colors border-0">
      <Filter className="h-3.5 w-3.5" /> Apply
    </button>
  );
}

export function Loading() {
  return (
    <div className="w-full animate-pulse divide-y divide-zinc-150 dark:divide-zinc-800 border-t dark:border-zinc-800 bg-white dark:bg-zinc-900">
      {Array(5).fill(0).map((_, i) => (
        <div key={i} className="flex items-center gap-6 px-6 py-4.5">
          <div className="h-3.5 w-1/4 bg-zinc-200 dark:bg-zinc-850 rounded-lg" />
          <div className="h-3.5 w-2/4 bg-zinc-200 dark:bg-zinc-850 rounded-lg" />
          <div className="h-3.5 w-1/4 bg-zinc-200 dark:bg-zinc-850 rounded-lg" />
        </div>
      ))}
    </div>
  );
}

export function TableSkeleton({ cols, rows = 5 }: { cols: number; rows?: number }) {
  return (
    <tbody className="animate-pulse bg-white dark:bg-zinc-900 divide-y divide-zinc-100 dark:divide-zinc-800">
      {Array(rows).fill(0).map((_, rowIndex) => (
        <tr key={rowIndex}>
          {Array(cols).fill(0).map((_, colIndex) => (
            <td key={colIndex} className="px-4 py-4.5">
              <div className="h-3.5 bg-zinc-200 dark:bg-zinc-850 rounded-lg w-2/3" />
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  );
}

export function Sel({ value, onChange, options, placeholder }: { value: string; onChange: (v: string) => void; options: { value: string; label: string }[]; placeholder?: string }) {
  return (
    <select value={value} onChange={e => onChange(e.target.value)}
      className="px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-indigo-500 min-w-[140px] cursor-pointer">
      <option value="">{placeholder ?? 'All'}</option>
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  );
}

export function SearchBar({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div className="relative flex-1 min-w-[200px]">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-405" />
      <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder ?? 'Search…'}
        className="w-full pl-9 pr-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm text-zinc-905 dark:text-white focus:outline-none focus:border-indigo-500" />
    </div>
  );
}

export function renderSortableHeader(
  label: string,
  field: string,
  currentField: string,
  currentOrder: 'asc' | 'desc',
  onSort: (field: string, order: 'asc' | 'desc') => void,
  align: 'left' | 'right' | 'center' = 'left'
) {
  const isCurrent = currentField === field;
  const alignClass = align === 'right' ? 'text-right' : align === 'center' ? 'text-center' : 'text-left';
  return (
    <th 
      onClick={() => {
        const nextOrder = isCurrent && currentOrder === 'desc' ? 'asc' : 'desc';
        onSort(field, nextOrder);
      }}
      className={`px-4 py-3 ${alignClass} text-[10px] font-bold uppercase tracking-wider text-zinc-500 cursor-pointer select-none hover:text-indigo-650 dark:hover:text-indigo-400 transition-colors`}
    >
      <span className="inline-flex items-center gap-1">
        {label}
        {isCurrent ? (
          currentOrder === 'asc' ? <ChevronUp className="h-3 w-3 text-indigo-650 dark:text-indigo-400" /> : <ChevronDown className="h-3 w-3 text-indigo-650 dark:text-indigo-400" />
        ) : (
          <ChevronDown className="h-3 w-3 text-zinc-300 dark:text-zinc-700 opacity-20 hover:opacity-100 transition-opacity" />
        )}
      </span>
    </th>
  );
}

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;
  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 px-6 py-4 border-t dark:border-zinc-800 bg-zinc-50/20 dark:bg-zinc-900/10">
      <span className="text-xs text-zinc-505 font-semibold">Page {currentPage} of {totalPages}</span>
      <div className="flex items-center gap-2">
        <button 
          disabled={currentPage === 1}
          onClick={() => onPageChange(1)}
          className="px-3 py-1.5 text-xs border dark:border-zinc-800 rounded-lg disabled:opacity-40 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-305 font-semibold cursor-pointer disabled:cursor-not-allowed transition-colors bg-white dark:bg-zinc-900"
        >
          First
        </button>
        <button 
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="px-3 py-1.5 text-xs border dark:border-zinc-800 rounded-lg disabled:opacity-40 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-305 font-semibold cursor-pointer disabled:cursor-not-allowed transition-colors bg-white dark:bg-zinc-900"
        >
          Previous
        </button>
        <button 
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="px-3 py-1.5 text-xs border dark:border-zinc-800 rounded-lg disabled:opacity-40 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-305 font-semibold cursor-pointer disabled:cursor-not-allowed transition-colors bg-white dark:bg-zinc-900"
        >
          Next
        </button>
        <button 
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(totalPages)}
          className="px-3 py-1.5 text-xs border dark:border-zinc-800 rounded-lg disabled:opacity-40 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-305 font-semibold cursor-pointer disabled:cursor-not-allowed transition-colors bg-white dark:bg-zinc-900"
        >
          Last
        </button>
      </div>
    </div>
  );
}

export function StatCard({ label, value, icon, color }: { label: string; value: string | number; icon: React.ReactNode; color: string }) {
  const colors: Record<string, string> = {
    indigo: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-950/20 border-indigo-100 dark:border-indigo-900/30',
    emerald: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-955/20 border-emerald-100 dark:border-emerald-900/30',
    amber: 'text-amber-500 bg-amber-50 dark:bg-amber-955/20 border-amber-100 dark:border-amber-900/30',
    blue: 'text-blue-500 bg-blue-50 dark:bg-blue-955/20 border-blue-100 dark:border-blue-900/30',
    rose: 'text-rose-500 bg-rose-50 dark:bg-rose-955/20 border-rose-100 dark:border-rose-900/30',
    violet: 'text-violet-500 bg-violet-50 dark:bg-violet-955/20 border-violet-100 dark:border-violet-900/30',
  };
  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl border dark:border-zinc-800 shadow-sm p-5 flex items-center justify-between">
      <div>
        <p className="text-xs text-zinc-400 font-bold uppercase tracking-wider">{label}</p>
        <p className="text-2xl font-black text-zinc-905 dark:text-white mt-1">{value}</p>
      </div>
      <div className={`h-11 w-11 rounded-xl border flex items-center justify-center ${colors[color] ?? colors.indigo}`}>{icon}</div>
    </div>
  );
}

