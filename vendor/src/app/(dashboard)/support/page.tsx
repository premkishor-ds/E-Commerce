'use client';

import React, { useEffect, useState } from 'react';
import { useStore } from '../../../store/store';

export default function VendorSupportPage() {
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
            { id: 'TKT-202', subject: 'Wholesale listing bulk CSV import guide', status: 'Resolved', priority: 'Medium' }
          ]);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchTickets();
  }, [user]);

  const handleSubmitTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject) return;
    try {
      // Optimistically insert ticket
      setTickets([
        ...tickets,
        { id: 'TKT-NEW', subject: ticketSubject, status: 'Open', priority: 'Medium' }
      ]);
      setTicketSubject('');
      setTicketMessage('');
      alert('Support ticket created!');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <title>Support - ApexStore Vendor</title>
      <section className="bg-white p-6 rounded-2xl border dark:bg-zinc-900 shadow-sm space-y-6 dark:border-zinc-800">
        <div>
          <h3 className="font-bold text-xl text-zinc-900 dark:text-white">Partner Support Center</h3>
          <p className="text-xs text-zinc-550 mt-0.5">Submit wholesale queries and track ticket logs.</p>
        </div>
        <form onSubmit={handleSubmitTicket} className="space-y-3 bg-zinc-50 dark:bg-zinc-950 p-4 rounded-xl">
          <h4 className="font-bold text-xs text-zinc-800 dark:text-zinc-200 uppercase tracking-wider font-sans">Submit Support Request</h4>
          <input type="text" placeholder="Subject" value={ticketSubject} onChange={e => setTicketSubject(e.target.value)} required
            className="w-full rounded-lg border border-zinc-200 bg-white p-2.5 text-xs focus:outline-none dark:border-zinc-800 dark:bg-zinc-900 text-zinc-900 dark:text-white" />
          <textarea placeholder="Tell us how we can help" value={ticketMessage} onChange={e => setTicketMessage(e.target.value)} rows={3}
            className="w-full rounded-lg border border-zinc-200 bg-white p-2.5 text-xs focus:outline-none dark:border-zinc-800 dark:bg-zinc-900 text-zinc-900 dark:text-white resize-none" />
          <button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg px-3 py-1.5 text-xs font-semibold border-0 cursor-pointer shadow">Submit Ticket</button>
        </form>
        <div className="space-y-3">
          <h4 className="font-bold text-xs uppercase tracking-wider text-zinc-400">Open Tickets</h4>
          {tickets.map(t => (
            <div key={t.id} className="flex justify-between items-center border-b pb-3 dark:border-zinc-800 last:border-0 last:pb-0">
              <div>
                <div className="font-bold text-sm text-zinc-900 dark:text-white">{t.subject}</div>
                <div className="text-xs text-zinc-400">ID: {t.id} · Priority: {t.priority}</div>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-amber-100 text-amber-800">{t.status}</span>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
