'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAdmin } from '../../../AdminContext';
import { ArrowLeft, Send, User, MessageCircle, AlertCircle, Clock } from 'lucide-react';
import { Section, SectionHeader, badge } from '../../../../components/AdminUI';

export default function TicketDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { tickets, loadTickets, apiAction, apiFetch, setTickets, agentsList, ticketReplyText, setTicketReplyText } = useAdmin();
  
  const [ticket, setTicket] = useState<any>(null);
  const [localLoading, setLocalLoading] = useState(true);
  const [ticketStatusSelect, setTicketStatusSelect] = useState('Open');
  const [ticketAgentSelect, setTicketAgentSelect] = useState('');

  useEffect(() => {
    const init = async () => {
      setLocalLoading(true);
      if (tickets.length === 0) {
        await loadTickets();
      }
      setLocalLoading(false);
    };
    init();
  }, []);

  useEffect(() => {
    if (tickets.length > 0) {
      const found = tickets.find((t) => t._id === id);
      if (found) {
        setTicket(found);
        setTicketStatusSelect(found.status || 'Open');
        setTicketAgentSelect(found.assignedTo || '');
      }
    }
  }, [tickets, id]);

  const saveTicketProperties = async (status: string) => {
    try {
      const res = await apiAction('PUT', `/support/tickets/${id}/status`, { status });
      setTicket(res);
      await loadTickets();
    } catch (err: any) {
      alert(err.message || 'Failed to update ticket status');
    }
  };

  const assignTicketAgent = async (agentId: string) => {
    try {
      await apiAction('PUT', `/support/tickets/${id}/assign`, { agentId: agentId || null });
      const fresh = await apiFetch('/support/tickets');
      setTickets(fresh);
      const found = fresh.find((t: any) => t._id === id);
      if (found) setTicket(found);
    } catch (err: any) {
      alert(err.message || 'Failed to assign agent');
    }
  };

  const sendTicketReply = async () => {
    if (!ticketReplyText.trim()) return;
    try {
      const res = await apiAction('POST', `/support/tickets/${id}/reply`, { message: ticketReplyText });
      setTicketReplyText('');
      setTicket(res);
      await loadTickets();
    } catch (err: any) {
      alert(err.message || 'Failed to send reply');
    }
  };

  if (localLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-650"></div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="text-center py-12">
        <h3 className="text-sm font-bold text-zinc-550">Ticket record not found.</h3>
        <button onClick={() => router.push('/support')} className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-semibold">
          Back to Support Center
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.push('/support')}
          className="p-2 border dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-500 rounded-xl hover:text-indigo-500 transition-colors cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div>
          <h1 className="text-xl font-black text-zinc-900 dark:text-white">
            {ticket.subject}
          </h1>
          <p className="text-xs text-zinc-400">Queue: {ticket.category || 'General'}</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column: Chat Conversation */}
        <div className="lg:col-span-2 space-y-6">
          <Section>
            <SectionHeader title="Conversation Log" desc="Full messaging timeline with customer." />
            <div className="p-6 space-y-6 flex flex-col justify-between min-h-[450px]">
              <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2">
                {ticket.messages?.map((msg: any, idx: number) => {
                  const isStaff = String(msg.senderId) !== String(ticket.userId);
                  return (
                    <div key={idx} className={`flex ${isStaff ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[75%] rounded-2xl p-3 text-xs shadow-sm ${
                        isStaff ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-850 dark:text-zinc-100 rounded-tl-none'
                      }`}>
                        <p>{msg.message}</p>
                        <span className={`text-[9px] block mt-1 ${isStaff ? 'text-indigo-200' : 'text-zinc-400'}`}>
                          {msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString() : ''}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="border-t dark:border-zinc-800 pt-4 flex gap-2">
                <input
                  type="text"
                  className="flex-1 rounded-xl border dark:border-zinc-850 p-2.5 text-xs bg-white dark:bg-zinc-950 text-zinc-905 dark:text-white outline-none focus:border-indigo-500"
                  placeholder="Type your response..."
                  value={ticketReplyText}
                  onChange={(e) => setTicketReplyText(e.target.value)}
                />
                <button
                  onClick={sendTicketReply}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs cursor-pointer border-0"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          </Section>
        </div>

        {/* Right Column: Properties */}
        <div className="space-y-6">
          <Section>
            <SectionHeader title="Ticket Settings" desc="Assign agents and change status." />
            <div className="p-6 space-y-4 text-xs">
              <div className="space-y-1">
                <label className="block text-[10px] text-zinc-400 font-bold uppercase">Update Status</label>
                <select
                  value={ticketStatusSelect}
                  onChange={(e) => {
                    setTicketStatusSelect(e.target.value);
                    saveTicketProperties(e.target.value);
                  }}
                  className="w-full px-3 py-2 border dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-xl text-zinc-805 dark:text-white"
                >
                  <option value="Open">Open</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] text-zinc-400 font-bold uppercase">Assign Agent</label>
                <select
                  value={ticketAgentSelect}
                  onChange={(e) => {
                    setTicketAgentSelect(e.target.value);
                    assignTicketAgent(e.target.value);
                  }}
                  className="w-full px-3 py-2 border dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-xl text-zinc-805 dark:text-white"
                >
                  <option value="">Unassigned</option>
                  {agentsList.map((agent: any) => (
                    <option key={agent._id} value={agent.agentId?._id || agent.agentId}>
                      {agent.agentId?.email || 'Support Agent'}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-3 pt-3 border-t dark:border-zinc-800 text-zinc-500">
                <div className="flex justify-between">
                  <span>Priority Level:</span>
                  <span>{badge(ticket.priority === 'Urgent' ? 'red' : 'blue', ticket.priority)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Ticket Creator:</span>
                  <span className="font-semibold text-zinc-700 dark:text-zinc-350">{ticket.name || ticket.userId?.email || 'Guest User'}</span>
                </div>
              </div>
            </div>
          </Section>
        </div>
      </div>
    </div>
  );
}
