'use client';

import React, { useEffect } from 'react';
import { useAdmin } from '../../AdminContext';
import { RefreshCw, X, CheckCircle, Lock, Activity, Star } from 'lucide-react';
import {
  Section, SectionHeader, FilterBar, SearchBar, Sel, ApplyBtn, Table, Thead, Pagination, Loading, badge
} from '../../../components/AdminUI';

export default function SupportPage() {
  const {
    loading, loadTickets, tickets, userPage, limit, selectedTicket, setSelectedTicket,
    ticketSearch, setTicketSearch, ticketStatusFilter, setTicketStatusFilter, ticketPage, setTicketPage,
    ticketStatusSelect, setTicketStatusSelect, ticketAgentSelect, setTicketAgentSelect, ticketReplyText, setTicketReplyText,
    agentsList, apiAction, apiFetch, setTickets, users, vendors,
    supportSubTab, setSupportSubTab, selectedFeedback, setSelectedFeedback, loadFeedback, loadFeedbackDetail,
    feedbackTickets, feedbackStats, feedbackComments, feedbackAttachments, feedbackActivities,
    feedbackSearch, setFeedbackSearch, feedbackTypeFilter, setFeedbackTypeFilter, feedbackStatusFilter, setFeedbackStatusFilter,
    feedbackCategoryFilter, setFeedbackCategoryFilter, feedbackPage, setFeedbackPage,
    feedbackReplyText, setFeedbackReplyText, feedbackIsPrivateNote, setFeedbackIsPrivateNote,
    feedbackRoadmapStatusSelect, setFeedbackRoadmapStatusSelect, feedbackStatusSelect, setFeedbackStatusSelect,
    feedbackAssignTeamSelect, setFeedbackAssignTeamSelect, feedbackAssignAgentSelect, setFeedbackAssignAgentSelect
  } = useAdmin();

  useEffect(() => {
    loadTickets();
    loadFeedback();
  }, [supportSubTab]);

  const saveTicketProperties = async (status: string) => {
    if (!selectedTicket) return;
    try {
      const res = await apiAction('PUT', `/support/tickets/${selectedTicket._id}/status`, { status });
      setSelectedTicket(res);
      loadTickets();
    } catch (err: any) { alert(err.message); }
  };

  const assignTicketAgent = async (agentId: string) => {
    if (!selectedTicket) return;
    try {
      await apiAction('PUT', `/support/tickets/${selectedTicket._id}/assign`, { agentId: agentId || null });
      const fresh = await apiFetch('/support/tickets');
      setTickets(fresh);
      const found = fresh.find((t: any) => t._id === selectedTicket._id);
      if (found) setSelectedTicket(found);
    } catch (err: any) { alert(err.message); }
  };

  const sendTicketReply = async () => {
    if (!ticketReplyText.trim() || !selectedTicket) return;
    try {
      const res = await apiAction('POST', `/support/tickets/${selectedTicket._id}/reply`, { message: ticketReplyText });
      setTicketReplyText('');
      setSelectedTicket(res);
      loadTickets();
    } catch (err: any) { alert(err.message); }
  };

  return (
    <Section>
      <div className="flex border-b dark:border-zinc-800 px-6 bg-zinc-50/30 dark:bg-zinc-900/10">
        {[
          { key: 'tickets', label: 'Support Tickets' },
          { key: 'feedback', label: 'Feedback Center' }
        ].map(t => (
          <button 
            key={t.key} 
            onClick={() => {
              setSupportSubTab(t.key as any);
              setSelectedTicket(null);
              setSelectedFeedback(null);
            }}
            className={`px-4 py-3 text-xs font-bold border-b-2 -mb-[2px] transition-all cursor-pointer border-0 bg-transparent ${
              supportSubTab === t.key
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 font-extrabold'
                : 'border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {supportSubTab === 'tickets' ? (
        selectedTicket ? (
          <>
            <SectionHeader 
              title={`Ticket: ${selectedTicket.subject}`} 
              desc={`Priority: ${selectedTicket.priority} · Status: ${selectedTicket.status}`}
              right={
                <button 
                  onClick={() => setSelectedTicket(null)} 
                  className="px-3 py-1.5 border dark:border-zinc-800 text-zinc-650 hover:text-indigo-500 rounded-lg text-xs font-semibold flex items-center gap-1.5 dark:text-zinc-300 bg-white dark:bg-zinc-900 cursor-pointer"
                >
                  <X className="h-4 w-4"/> Back to Tickets
                </button>
              } 
            />
            <div className="grid md:grid-cols-3 gap-6 text-xs p-6">
              <div className="md:col-span-2 space-y-4 flex flex-col bg-white dark:bg-zinc-900 border dark:border-zinc-800 rounded-2xl p-4 shadow-sm min-h-[450px]">
                <h4 className="font-bold text-[10px] text-zinc-400 uppercase tracking-wider border-b pb-2 dark:border-zinc-800">Conversation History</h4>
                
                <div className="flex-1 overflow-y-auto space-y-3 p-2 max-h-[300px] min-h-[200px]">
                  {selectedTicket.messages?.map((msg: any, idx: number) => {
                    const isStaff = String(msg.senderId) !== String(selectedTicket.userId);
                    return (
                      <div key={idx} className={`flex flex-col ${isStaff ? 'items-end' : 'items-start'}`}>
                        <div className={`max-w-[75%] rounded-2xl p-3 text-xs ${
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

                <div className="border-t dark:border-zinc-800 pt-3 flex gap-2">
                  <input 
                    type="text" 
                    className="flex-1 rounded-xl border dark:border-zinc-800 p-2.5 text-xs bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white outline-none focus:border-indigo-500" 
                    placeholder="Type your reply..." 
                    value={ticketReplyText} 
                    onChange={e => setTicketReplyText(e.target.value)} 
                  />
                  <button 
                    onClick={sendTicketReply}
                    className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl text-xs cursor-pointer shadow border-0"
                  >
                    Send
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-zinc-50/50 dark:bg-zinc-900/40 border dark:border-zinc-800 rounded-2xl p-4 space-y-4 shadow-sm text-left">
                  <h4 className="font-bold text-[10px] text-zinc-400 uppercase tracking-wider border-b pb-2 dark:border-zinc-800">Properties</h4>
                  <div className="space-y-3">
                    <div>
                      <span className="block text-[10px] text-zinc-400 font-bold uppercase">Department/Queue</span>
                      <span className="text-xs font-semibold text-zinc-905 dark:text-white mt-0.5 block">{selectedTicket.category || 'General Support'}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] text-zinc-400 font-bold uppercase">Priority Level</span>
                      <span className="mt-1 block">{badge(selectedTicket.priority === 'Urgent' ? 'red' : 'blue', selectedTicket.priority)}</span>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-zinc-400 font-bold uppercase block">Update Status</label>
                      <select 
                        value={ticketStatusSelect} 
                        onChange={e => { setTicketStatusSelect(e.target.value); saveTicketProperties(e.target.value); }}
                        className="w-full px-2 py-1.5 border dark:border-zinc-850 bg-white dark:bg-zinc-950 rounded-lg text-xs text-zinc-900 dark:text-white cursor-pointer"
                      >
                        <option value="Open">Open</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Resolved">Resolved</option>
                        <option value="Closed">Closed</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-zinc-400 font-bold uppercase block">Assign Staff Agent</label>
                      <select 
                        value={ticketAgentSelect} 
                        onChange={e => { setTicketAgentSelect(e.target.value); assignTicketAgent(e.target.value); }}
                        className="w-full px-2 py-1.5 border dark:border-zinc-800 bg-white dark:bg-zinc-950 rounded-lg text-xs text-zinc-900 dark:text-white cursor-pointer"
                      >
                        <option value="">Unassigned</option>
                        {agentsList.map((agent: any) => (
                          <option key={agent._id} value={agent.agentId?._id || agent.agentId}>
                            {agent.agentId?.email || 'Online Staff'}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <SectionHeader 
              title="Support Center" 
              desc="Manage platform support workloads and ticket queues."
              right={
                <button onClick={loadTickets} className="p-2 rounded-lg border dark:border-zinc-800 text-zinc-400 hover:text-indigo-500 hover:bg-zinc-50 dark:hover:bg-zinc-800 bg-white dark:bg-zinc-900 cursor-pointer">
                  <RefreshCw className="h-4 w-4"/>
                </button>
              }
            />

            <FilterBar>
              <SearchBar value={ticketSearch} onChange={setTicketSearch} placeholder="Search tickets..." />
              <Sel 
                value={ticketStatusFilter} 
                onChange={setTicketStatusFilter} 
                placeholder="All Statuses" 
                options={[
                  { value: 'Open', label: 'Open' },
                  { value: 'In Progress', label: 'In Progress' },
                  { value: 'Resolved', label: 'Resolved' },
                  { value: 'Closed', label: 'Closed' }
                ]} 
              />
              <ApplyBtn onClick={loadTickets} />
            </FilterBar>

            {loading ? <Loading /> : (
              <>
                <Table>
                  <Thead>
                    <tr>
                      <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-zinc-500">Subject</th>
                      <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-zinc-500">Priority</th>
                      <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-zinc-500">Status</th>
                      <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-zinc-500">Created At</th>
                    </tr>
                  </Thead>
                  <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                    {tickets
                      .filter(t => {
                        const matchSearch = t.subject?.toLowerCase().includes(ticketSearch.toLowerCase());
                        const matchStatus = !ticketStatusFilter || t.status === ticketStatusFilter;
                        return matchSearch && matchStatus;
                      })
                      .slice((ticketPage - 1) * limit, ticketPage * limit)
                      .map((t: any) => (
                        <tr key={t._id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40 text-xs">
                          <td 
                            className="px-4 py-3 font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                            onClick={() => setSelectedTicket(t)}
                          >
                            {t.subject}
                          </td>
                          <td className="px-4 py-3">{badge(t.priority === 'Urgent' ? 'red' : 'blue', t.priority)}</td>
                          <td className="px-4 py-3">{badge(t.status === 'Resolved' ? 'green' : 'amber', t.status)}</td>
                          <td className="px-4 py-3 text-zinc-400">
                            {t.createdAt ? new Date(t.createdAt).toLocaleString() : '—'}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </Table>
                <Pagination 
                  currentPage={ticketPage} 
                  totalPages={Math.ceil(tickets.length / limit) || 1} 
                  onPageChange={setTicketPage} 
                />
              </>
            )}
          </>
        )
      ) : (
        /* Feedback Subtab */
        selectedFeedback ? (
          <>
            <SectionHeader 
              title={`Feedback: [${selectedFeedback.ticketId}] ${selectedFeedback.subject}`}
              desc={`Category: ${selectedFeedback.category} · Priority: ${selectedFeedback.priority}`}
              right={
                <button 
                  onClick={() => setSelectedFeedback(null)} 
                  className="px-3 py-1.5 border dark:border-zinc-800 text-zinc-650 hover:text-indigo-500 rounded-lg text-xs font-semibold flex items-center gap-1.5 dark:text-zinc-300 bg-white dark:bg-zinc-900 cursor-pointer"
                >
                  <X className="h-4 w-4"/> Back to Listing
                </button>
              } 
            />
            {selectedFeedback.isConfidential && (
              <div className="bg-rose-50 border border-rose-200 text-rose-800 dark:bg-rose-950/20 dark:border-rose-900/30 dark:text-rose-450 px-6 py-2 text-xs font-bold flex items-center gap-2">
                <Lock className="h-4 w-4" /> Confidential Security Report. Restricted Access Authorized.
              </div>
            )}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6 text-left">
              <div className="lg:col-span-2 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div className="bg-zinc-50/50 dark:bg-zinc-900/40 p-4 border dark:border-zinc-800 rounded-xl space-y-2 shadow-sm">
                    <h4 className="font-bold text-[10px] text-zinc-400 uppercase tracking-wider">Reporter Info</h4>
                    <div className="space-y-1">
                      <div>Name: {selectedFeedback.name}</div>
                      <div>Email: {selectedFeedback.email}</div>
                      <div>Role: {selectedFeedback.userRole}</div>
                    </div>
                  </div>
                  <div className="bg-zinc-50/50 dark:bg-zinc-900/40 p-4 border dark:border-zinc-800 rounded-xl space-y-2 shadow-sm">
                    <h4 className="font-bold text-[10px] text-zinc-400 uppercase tracking-wider">Environment</h4>
                    <div className="space-y-1">
                      <div>OS: {selectedFeedback.os}</div>
                      <div>Browser: {selectedFeedback.browser}</div>
                      <div>IP: {selectedFeedback.ipAddress}</div>
                    </div>
                  </div>
                  <div className="bg-zinc-50/50 dark:bg-zinc-900/40 p-4 border dark:border-zinc-800 rounded-xl space-y-2 shadow-sm">
                    <h4 className="font-bold text-[10px] text-zinc-400 uppercase tracking-wider">Issue Meta</h4>
                    <div className="space-y-1">
                      <div>Type: {selectedFeedback.type}</div>
                      <div>Severity: {selectedFeedback.severity}</div>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-zinc-900 border dark:border-zinc-800 rounded-2xl p-5 shadow-sm space-y-3">
                  <h4 className="font-bold text-xs text-zinc-900 dark:text-white uppercase tracking-wider">Description</h4>
                  <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed whitespace-pre-wrap">{selectedFeedback.description}</p>
                </div>

                <div className="bg-white dark:bg-zinc-900 border dark:border-zinc-800 rounded-2xl p-5 shadow-sm space-y-4">
                  <h4 className="font-bold text-xs text-zinc-900 dark:text-white uppercase tracking-wider">Communication Logs</h4>
                  <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                    {[
                      ...feedbackComments.map(c => ({ ...c, type: 'comment' })),
                      ...feedbackActivities.map(a => ({ ...a, type: 'activity' })),
                    ]
                      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
                      .map((item: any, idx: number) => {
                        if (item.type === 'activity') {
                          return (
                            <div key={idx} className="flex gap-2 items-center text-[10px] text-zinc-400 font-mono py-1.5 border-b border-dashed dark:border-zinc-800/85">
                              <Activity className="h-3 w-3 text-indigo-505 shrink-0" />
                              <span>{item.userName} triggered {item.action}</span>
                            </div>
                          );
                        } else {
                          const isStaff = item.userRole === 'Admin' || item.userRole === 'Super Admin';
                          return (
                            <div key={idx} className={`flex ${isStaff ? 'justify-end' : 'justify-start'}`}>
                              <div className={`max-w-[80%] rounded-2xl p-3 text-xs shadow-sm ${
                                item.isPrivate ? 'bg-amber-50 dark:bg-amber-905 border text-amber-800' : isStaff ? 'bg-indigo-600 text-white' : 'bg-zinc-100 dark:bg-zinc-800'
                              }`}>
                                <p>{item.text}</p>
                              </div>
                            </div>
                          );
                        }
                      })}
                  </div>

                  <div className="border-t dark:border-zinc-800 pt-3 space-y-3">
                    <label className="flex items-center gap-1.5 text-xs text-zinc-650 cursor-pointer select-none font-bold">
                      <input type="checkbox" checked={feedbackIsPrivateNote} onChange={e => setFeedbackIsPrivateNote(e.target.checked)} />
                      <span>Internal Private Note</span>
                    </label>
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        className="flex-1 rounded-xl border dark:border-zinc-800 p-2.5 text-xs bg-white dark:bg-zinc-950" 
                        value={feedbackReplyText} 
                        onChange={e => setFeedbackReplyText(e.target.value)} 
                        placeholder="Type response..." 
                      />
                      <button 
                        onClick={async () => {
                          if (!feedbackReplyText.trim()) return;
                          try {
                            await apiAction('POST', `/admin/feedback/${selectedFeedback._id}/comments`, { text: feedbackReplyText, isPrivate: feedbackIsPrivateNote });
                            setFeedbackReplyText('');
                            loadFeedbackDetail(selectedFeedback._id);
                          } catch (err: any) { alert(err.message); }
                        }}
                        className="px-5 py-2.5 font-bold rounded-xl text-xs text-white bg-indigo-600 cursor-pointer border-0"
                      >
                        Post Note
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-zinc-50/50 dark:bg-zinc-900/40 border dark:border-zinc-800 rounded-2xl p-4 space-y-4 shadow-sm text-xs">
                  <h4 className="font-bold text-[10px] text-zinc-400 uppercase tracking-wider border-b pb-2 dark:border-zinc-800">Workflows</h4>
                  
                  <div className="space-y-4">
                    {selectedFeedback.type === 'Feature Request' && (
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold block">Roadmap Status</label>
                        <select 
                          value={feedbackRoadmapStatusSelect}
                          onChange={async e => {
                            setFeedbackRoadmapStatusSelect(e.target.value);
                            try {
                              await apiAction('PUT', `/admin/feedback/${selectedFeedback._id}/roadmap`, { roadmapStatus: e.target.value });
                              loadFeedbackDetail(selectedFeedback._id);
                            } catch (err: any) { alert(err.message); }
                          }}
                          className="w-full px-3 py-2 border dark:border-zinc-800 bg-white dark:bg-zinc-950 rounded-lg text-xs"
                        >
                          <option value="none">Not on Roadmap</option>
                          <option value="Planned">Planned</option>
                          <option value="Under Development">Under Development</option>
                          <option value="Released">Released</option>
                        </select>
                      </div>
                    )}
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold block">Ticket Status</label>
                      <select 
                        value={feedbackStatusSelect}
                        onChange={async e => {
                          setFeedbackStatusSelect(e.target.value);
                          try {
                            await apiAction('PUT', `/admin/feedback/${selectedFeedback._id}/status`, { status: e.target.value });
                            loadFeedbackDetail(selectedFeedback._id);
                          } catch (err: any) { alert(err.message); }
                        }}
                        className="w-full px-3 py-2 border dark:border-zinc-800 bg-white dark:bg-zinc-955 rounded-lg text-xs"
                      >
                        <option value="New">New</option>
                        <option value="Open">Open</option>
                        <option value="Resolved">Resolved</option>
                        <option value="Closed">Closed</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <SectionHeader 
              title="Feedback Management Center" 
              desc="Monitor user suggestions, bug reports, and technical feedbacks."
              right={
                <button onClick={loadFeedback} className="p-2 rounded-lg border dark:border-zinc-800 text-zinc-400 hover:text-indigo-500 hover:bg-zinc-50 dark:hover:bg-zinc-800 bg-white dark:bg-zinc-900 cursor-pointer">
                  <RefreshCw className="h-4 w-4"/>
                </button>
              } 
            />
            <FilterBar>
              <SearchBar value={feedbackSearch} onChange={setFeedbackSearch} placeholder="Search feedback..." />
              <Sel 
                value={feedbackTypeFilter} 
                onChange={setFeedbackTypeFilter} 
                placeholder="All Types" 
                options={[
                  { value: 'Feedback', label: 'Feedback' },
                  { value: 'Suggestion', label: 'Suggestion' },
                  { value: 'Bug Report', label: 'Bug Report' },
                  { value: 'Feature Request', label: 'Feature Request' }
                ]} 
              />
              <ApplyBtn onClick={loadFeedback} />
            </FilterBar>

            {loading ? <Loading /> : (
              <>
                <Table>
                  <Thead>
                    <tr>
                      <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-zinc-500">Ticket ID</th>
                      <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-zinc-500">Subject</th>
                      <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-zinc-500">Type</th>
                      <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-zinc-500">Reporter</th>
                      <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-zinc-500">Status</th>
                    </tr>
                  </Thead>
                  <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                    {feedbackTickets.map((t: any) => (
                      <tr 
                        key={t._id} 
                        className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40 text-xs cursor-pointer" 
                        onClick={() => loadFeedbackDetail(t._id)}
                      >
                        <td className="px-4 py-3 font-mono font-bold text-zinc-650">{t.ticketId}</td>
                        <td className="px-4 py-3 font-semibold text-indigo-605 dark:text-indigo-400 hover:underline">{t.subject}</td>
                        <td className="px-4 py-3">{badge('indigo', t.type)}</td>
                        <td className="px-4 py-3 text-zinc-500">{t.name}</td>
                        <td className="px-4 py-3">{badge(t.status === 'Resolved' ? 'green' : 'blue', t.status)}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
                <Pagination currentPage={feedbackPage} totalPages={feedbackStats?.totalPages || 1} onPageChange={setFeedbackPage} />
              </>
            )}
          </>
        )
      )}
    </Section>
  );
}
