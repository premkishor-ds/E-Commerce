'use client';

import React, { useEffect, useState } from 'react';
import { useStore } from '../../../store/store';

export default function SupportPage() {
  const { user } = useStore();
  const [tickets, setTickets] = useState<any[]>([]);
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketMessage, setTicketMessage] = useState('');

  useEffect(() => {
    if (!user) return;
    const fetchTickets = async () => {
      try {
        const ticketsRes = await fetch('http://localhost:5001/api/v1/support/tickets', {
          headers: { 'Authorization': `Bearer ${user.token}` }
        });
        if (ticketsRes.ok) {
          setTickets(await ticketsRes.json());
        } else {
          setTickets([
            { id: 'TKT-102', subject: 'API access keys clarification', status: 'Open', priority: 'Medium' }
          ]);
        }
      } catch (err) { console.error(err); }
    };
    fetchTickets();
  }, [user]);

  return (
    <>
      <title>Merchant Support - ApexStore Seller</title>
      <section className="bg-white p-6 rounded-2xl border dark:bg-zinc-900 shadow-sm space-y-6 dark:border-zinc-800">
        <div>
          <h3 className="font-bold text-xl text-zinc-900 dark:text-white">Support & Help Tickets</h3>
          <p className="text-xs text-zinc-550 mt-0.5">Submit support queries and view ticket statuses.</p>
        </div>
        <form onSubmit={e => { e.preventDefault(); if(!ticketSubject) return; setTickets([...tickets, { id: 'TKT-NEW', subject: ticketSubject, status: 'Open', priority: 'Medium' }]); setTicketSubject(''); setTicketMessage(''); alert('Support ticket created!'); }}
          className="space-y-3 bg-zinc-50 dark:bg-zinc-950 p-4 rounded-xl text-xs">
          <h4 className="font-bold text-xs text-zinc-800 dark:text-zinc-200 uppercase tracking-wider">Submit New Ticket</h4>
          <input type="text" placeholder="Subject" value={ticketSubject} onChange={e => setTicketSubject(e.target.value)} required
            className="w-full rounded-lg border border-zinc-200 bg-white p-2.5 text-xs focus:outline-none dark:border-zinc-800 dark:bg-zinc-900 text-zinc-900 dark:text-white" />
          <textarea placeholder="Message details" value={ticketMessage} onChange={e => setTicketMessage(e.target.value)} rows={3}
            className="w-full rounded-lg border border-zinc-200 bg-white p-2.5 text-xs focus:outline-none dark:border-zinc-800 dark:bg-zinc-900 text-zinc-900 dark:text-white resize-none" />
          <button type="submit" className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg px-3 py-1.5 text-xs font-semibold border-0 cursor-pointer">Submit Ticket</button>
        </form>
        <div className="space-y-3 text-xs">
          <h4 className="font-bold text-xs uppercase tracking-wider text-zinc-400">Your Tickets</h4>
          {tickets.map(t => (
            <div key={t.id || t._id} className="flex justify-between items-center border-b pb-3 dark:border-zinc-800 last:border-0 last:pb-0">
              <div>
                <div className="font-bold text-sm text-zinc-900 dark:text-white">{t.subject}</div>
                <div className="text-xs text-zinc-400">ID: {t.id || t._id} · Priority: {t.priority}</div>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-amber-100 text-amber-800">{t.status}</span>
            </div>
          ))}
          {tickets.length === 0 && <p className="text-sm text-zinc-400 text-center py-6">No support tickets found.</p>}
        </div>
      </section>
    </>
  );
}
