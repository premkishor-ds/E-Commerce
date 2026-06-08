'use client';

import React, { useState, useMemo } from 'react';
import { MessageSquare, FileText, Send, HelpCircle, UserPlus, Undo2, ShoppingBag, Landmark, ChevronDown, ChevronUp, Search, Lock, Tag, Briefcase, Shield } from 'lucide-react';

interface SupportMessage {
  sender: 'User' | 'Agent';
  message: string;
  timestamp: string;
}

interface FaqItem {
  question: string;
  answer: string;
  icon: React.ReactNode;
  steps?: string[];
}

export default function SupportHub() {
  const [activeTab, setActiveTab] = useState<'faq' | 'tickets'>('faq');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [faqSearchQuery, setFaqSearchQuery] = useState('');

  // Ticketing state
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [ticketsList, setTicketsList] = useState<Array<{ id: string; subject: string; status: string }>>([
    { id: 'TCK-1092', subject: 'Refund delay on cancelled sound-pro headphones', status: 'Open' },
  ]);

  const [activeChatTicketId, setActiveChatTicketId] = useState<string | null>('TCK-1092');
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<SupportMessage[]>([
    { sender: 'User', message: 'Hi support team, I cancelled my order but have not received my refund credit yet.', timestamp: '10:00 AM' },
    { sender: 'Agent', message: 'Hello! I am reviewing your order status right now. Rest assured, refunds typically clear within 3 business days.', timestamp: '10:05 AM' }
  ]);

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !message) return;
    const tckId = 'TCK-' + Math.floor(1000 + Math.random() * 9000);
    setTicketsList([...ticketsList, { id: tckId, subject, status: 'Open' }]);
    
    // Add default user message to chat log
    setChatMessages([...chatMessages, { sender: 'User', message, timestamp: 'Just now' }]);
    setActiveChatTicketId(tckId);
    setSubject('');
    setMessage('');
    alert(`Support ticket ${tckId} created successfully! Our agents will review it shortly.`);
    setActiveTab('tickets');
  };

  const handleSendChatMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput) return;
    const newMsg: SupportMessage = { sender: 'User', message: chatInput, timestamp: 'Just now' };
    setChatMessages((prev) => [...prev, newMsg]);
    setChatInput('');

    // Simulate Agent auto-reply within 1.5 seconds
    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        { sender: 'Agent', message: 'Thank you for updating the ticket. Let me run diagnostics and verify this detail for you.', timestamp: 'Just now' }
      ]);
    }, 1500);
  };

  const faqs: FaqItem[] = [
    {
      question: 'How do I create an account?',
      icon: <UserPlus className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />,
      answer: 'Creating an account on ApexStore is simple and grants you access to personalized recommendations, support ticket tracking, and order history.',
      steps: [
        'Click the "Sign In" button on the top right header of the page.',
        'On the authentication card, click the link "Don\'t have an account? Sign Up" to toggle to the registration form.',
        'Enter your email address and choose a strong password.',
        'Select your desired profile role (Customer, Vendor/Seller, or Admin).',
        'Click "Sign Up" to register. You will automatically be logged in to your new account dashboard.'
      ]
    },
    {
      question: 'How do I return a product & request a refund?',
      icon: <Undo2 className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />,
      answer: 'We offer a 30-day hassle-free return policy for unopened items in their original packaging.',
      steps: [
        'Ensure the product has been purchased within the last 30 days and remains unused.',
        'Go to this Help/Support page and click on the "File a Support Ticket" tab.',
        'Fill out the ticket form. Set the subject as "Return Request: [Order ID]" and provide product details.',
        'Our support agents will review your request and send you a pre-paid shipping return label.',
        'Once our warehouse inspects the returned package, your refund will be processed and should clear on your original payment method within 3 business days.'
      ]
    },
    {
      question: 'How do I place and track an order?',
      icon: <ShoppingBag className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />,
      answer: 'Placing an order is quick and secure, using Stripe-certified integrations.',
      steps: [
        'Browse our homepage catalog or search for specific products on the `/search` page.',
        'Click the "Add to Cart" button on any product card.',
        'Click the shopping cart icon in the header, review your items, and click "Proceed to Checkout".',
        'In the checkout page, fill in your shipping address and payment details. You can apply coupon codes to claim active discounts.',
        'Click "Place Order" to finalize your purchase. You can track your active orders and shipping statuses inside your Vendor/User dashboard.'
      ]
    },
    {
      question: 'How do I create and monitor a support ticket?',
      icon: <MessageSquare className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />,
      answer: 'Our Ticket Support Hub allows you to raise technical or billing tickets and chat live with simulated support agents.',
      steps: [
        'Ensure you are logged into your user profile.',
        'Navigate to this Support Hub and select the "File a Support Ticket" tab.',
        'Fill in the Subject, Priority Level, and detailed description, then submit.',
        'Your newly created ticket will appear in your "Your Support Tickets" history sidebar list.',
        'Click on any active ticket in the list to load it. You can chat directly with the assigned agent in the "Live Support Chat" panel on the right.'
      ]
    },
    {
      question: 'How do coupon and promo codes work?',
      icon: <Tag className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />,
      answer: 'Coupons apply flat-rate or percentage discounts to your total shopping cart items.',
      steps: [
        'Browse our catalogue and add desired items to your cart.',
        'Navigate to the checkout page.',
        'Locate the "Apply Coupon" input field on the order summary sidebar.',
        'Enter an active code (e.g. SAVE10) and click Apply. The discount will instantly recalculate.',
        'Note: Coupons cannot be stacked and are limited to one per customer order.'
      ]
    },
    {
      question: 'How do vendor and seller profiles function?',
      icon: <Briefcase className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />,
      answer: 'Vendor profiles allow sellers to build catalog lists, configure warehouse inventory, and receive transaction settlements.',
      steps: [
        'Create a user account selecting the "Vendor" or "Seller" role during registration.',
        'Log in to load your custom Vendor Dashboard.',
        'Use the inventory logs page to catalog new products, adjust pricing, and track order fullfillment.',
        'Monthly sales balances are settled and deposited directly to registered accounts through automated payouts.'
      ]
    },
    {
      question: 'Are online card payments secure?',
      icon: <Lock className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />,
      answer: 'Yes. All payments are encrypted, tokenized, and processed directly via Stripe API protocols. We never store raw credit card details on our local database.',
      steps: [
        'Transactions employ SSL/TLS 256-bit encryption pipelines.',
        'Our platforms strictly adhere to PCI-DSS Level 1 compliance standards.',
        'Double-factor authentication is requested for supported cards to prevent fraudulent orders.'
      ]
    },
    {
      question: 'What user roles and permissions exist?',
      icon: <Shield className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />,
      answer: 'ApexStore supports Role-Based Access Controls (RBAC) to enforce security partitions.',
      steps: [
        'Customers: Purchase products, manage wishlists, write product reviews, and raise support tickets.',
        'Vendors / Sellers: Manage catalog items, warehouse stock levels, and check settlement stats.',
        'Customer Support: Review and answer filed troubleshooting tickets.',
        'Admins & Super Admins: Complete platform management including CMS, system settings, audit logs, and user roles assignment.'
      ]
    }
  ];

  // Filtered FAQs based on search input
  const filteredFaqs = useMemo(() => {
    if (!faqSearchQuery.trim()) return faqs;
    const q = faqSearchQuery.toLowerCase();
    return faqs.filter(
      (f) =>
        f.question.toLowerCase().includes(q) ||
        f.answer.toLowerCase().includes(q) ||
        (f.steps && f.steps.some((step) => step.toLowerCase().includes(q)))
    );
  }, [faqSearchQuery]);

  return (
    <div className="flex-1 bg-zinc-50 dark:bg-zinc-950 py-12">
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b pb-6 dark:border-zinc-800">
          <div>
            <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-white">Support & Help Center</h1>
            <p className="text-zinc-500 mt-1 text-sm">Read step-by-step guides or file live support tickets with customer agents.</p>
          </div>

          {/* Tab Navigation */}
          <div className="flex bg-zinc-100 dark:bg-zinc-900 p-1 rounded-xl border border-zinc-200 dark:border-zinc-800 shrink-0 self-start md:self-auto">
            <button
              onClick={() => setActiveTab('faq')}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'faq'
                  ? 'bg-white text-zinc-900 shadow dark:bg-zinc-950 dark:text-white'
                  : 'text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-white'
              }`}
            >
              <HelpCircle className="h-4 w-4" />
              <span>FAQ & Help Guides</span>
            </button>
            <button
              onClick={() => setActiveTab('tickets')}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'tickets'
                  ? 'bg-white text-zinc-900 shadow dark:bg-zinc-950 dark:text-white'
                  : 'text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-white'
              }`}
            >
              <MessageSquare className="h-4 w-4" />
              <span>File a Support Ticket</span>
            </button>
          </div>
        </div>

        {/* Tab 1: Interactive FAQ guides */}
        {activeTab === 'faq' && (
          <div className="space-y-6">
            {/* FAQ Search Bar */}
            <div className="relative max-w-md w-full bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm p-3">
              <span className="absolute inset-y-0 left-3 flex items-center pl-3 text-zinc-400">
                <Search className="h-5 w-5" />
              </span>
              <input
                type="text"
                placeholder="Search FAQs, return policies, roles..."
                value={faqSearchQuery}
                onChange={(e) => setFaqSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-zinc-200 pl-10 pr-4 py-2 text-sm focus:border-indigo-500 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 text-zinc-900 dark:text-white"
              />
            </div>

            {filteredFaqs.length === 0 ? (
              <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-12 text-center text-zinc-500 shadow-sm">
                No help guides found matching your search term. Try another query.
              </div>
            ) : (
              <section className="grid md:grid-cols-2 gap-6">
                {filteredFaqs.map((faq, index) => {
                  const isExpanded = expandedFaq === index;
                  return (
                    <div
                      key={index}
                      className="bg-white p-6 rounded-2xl border border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800 shadow-sm transition-all hover:shadow-md cursor-pointer flex flex-col justify-between"
                      onClick={() => setExpandedFaq(isExpanded ? null : index)}
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800">
                              {faq.icon}
                            </div>
                            <h3 className="font-bold text-sm text-zinc-900 dark:text-white">{faq.question}</h3>
                          </div>
                          {isExpanded ? (
                            <ChevronUp className="h-5 w-5 text-zinc-400" />
                          ) : (
                            <ChevronDown className="h-5 w-5 text-zinc-400" />
                          )}
                        </div>

                        <p className="text-xs text-zinc-500 mt-4 leading-relaxed">{faq.answer}</p>

                        {isExpanded && faq.steps && (
                          <div className="mt-4 border-t pt-4 dark:border-zinc-800 space-y-3">
                            <h4 className="font-bold text-xs text-zinc-800 dark:text-zinc-200">Step-by-Step Instructions:</h4>
                            <ol className="list-decimal pl-4 space-y-2 text-xs text-zinc-500">
                              {faq.steps.map((step, idx) => (
                                <li key={idx} className="leading-relaxed">{step}</li>
                              ))}
                            </ol>
                          </div>
                        )}
                      </div>

                      <div className="mt-4 flex items-center justify-end">
                        <span className="text-[10px] text-indigo-600 font-semibold hover:underline">
                          {isExpanded ? 'Show Less' : 'View Instructions'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </section>
            )}
          </div>
        )}

        {/* Tab 2: Ticket Creation & Chat Hub */}
        {activeTab === 'tickets' && (
          <section className="grid lg:grid-cols-12 gap-8">
            {/* Left column: Create Ticket & History (7 Cols) */}
            <div className="lg:col-span-7 space-y-6">
              {/* Ticket Creation form */}
              <form onSubmit={handleCreateTicket} className="bg-white p-6 rounded-2xl border dark:bg-zinc-900 shadow-sm space-y-4">
                <h3 className="font-bold text-base flex items-center gap-2 border-b pb-2 text-zinc-900 dark:text-white">
                  <FileText className="h-5 w-5 text-indigo-600" /> File a Troubleshooting Ticket
                </h3>
                <div className="space-y-4">
                  <input
                    type="text"
                    required
                    placeholder="Subject Line (e.g. Broken charger, delivery delay)"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full rounded-xl border p-3 text-sm focus:outline-none focus:border-indigo-500 dark:bg-zinc-950 dark:border-zinc-800 text-zinc-900 dark:text-white"
                  />
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="w-full rounded-xl border p-3 text-sm focus:outline-none focus:border-indigo-500 dark:bg-zinc-950 dark:border-zinc-800 text-zinc-900 dark:text-white"
                  >
                    <option value="Low">Low Priority</option>
                    <option value="Medium">Medium Priority</option>
                    <option value="High">High Priority</option>
                    <option value="Urgent">Urgent / Critical</option>
                  </select>
                  <textarea
                    required
                    rows={4}
                    placeholder="Explain the problem in detail..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full rounded-xl border p-3 text-sm focus:outline-none focus:border-indigo-500 dark:bg-zinc-950 dark:border-zinc-800 text-zinc-900 dark:text-white"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full rounded-xl bg-indigo-600 py-3 font-semibold text-white hover:bg-indigo-500 shadow-md transition-all active:scale-95 text-sm"
                >
                  Submit Support Ticket
                </button>
              </form>

              {/* Ticket History */}
              <div className="bg-white p-6 rounded-2xl border dark:bg-zinc-900 shadow-sm space-y-4">
                <h3 className="font-bold text-base border-b pb-2 text-zinc-900 dark:text-white">Your Support Tickets</h3>
                <div className="space-y-2">
                  {ticketsList.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setActiveChatTicketId(t.id)}
                      className={`w-full flex justify-between items-center p-3 rounded-xl border text-left text-sm transition-all ${
                        activeChatTicketId === t.id
                          ? 'border-indigo-500 bg-indigo-50/20 dark:bg-indigo-950/10'
                          : 'border-zinc-100 hover:bg-zinc-50 dark:border-zinc-800'
                      }`}
                    >
                      <div>
                        <span className="font-bold text-indigo-600 dark:text-indigo-400">{t.id}</span>
                        <span className="ml-2 font-semibold text-zinc-800 dark:text-zinc-200">{t.subject}</span>
                      </div>
                      <span className="rounded bg-indigo-50 px-2 py-0.5 text-[10px] font-bold text-indigo-700">
                        {t.status}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right column: Active Live Chat Simulation (5 Cols) */}
            <div className="lg:col-span-5 bg-white rounded-2xl border dark:bg-zinc-900 shadow-sm flex flex-col h-[600px] justify-between">
              <div className="p-4 border-b dark:border-zinc-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-indigo-600" />
                  <div>
                    <h3 className="font-bold text-sm text-zinc-900 dark:text-white">Live Support Chat</h3>
                    <p className="text-[10px] text-zinc-400">Active ticket: {activeChatTicketId || 'None'}</p>
                  </div>
                </div>
                <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
              </div>

              {/* Chat Messages Log */}
              <div className="flex-1 p-4 space-y-4 overflow-y-auto">
                {chatMessages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex flex-col max-w-[80%] rounded-2xl p-3 text-xs leading-relaxed ${
                      msg.sender === 'User'
                        ? 'ml-auto bg-indigo-600 text-white rounded-tr-none'
                        : 'bg-zinc-100 text-zinc-800 rounded-tl-none dark:bg-zinc-800 dark:text-zinc-200'
                    }`}
                  >
                    <div className="font-bold mb-0.5">{msg.sender}</div>
                    <p>{msg.message}</p>
                    <span className="text-[9px] text-zinc-300 text-right mt-1">{msg.timestamp}</span>
                  </div>
                ))}
              </div>

              {/* Message input */}
              <form onSubmit={handleSendChatMessage} className="p-4 border-t dark:border-zinc-800 flex gap-2">
                <input
                  type="text"
                  placeholder="Type your message..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  className="flex-1 rounded-xl border px-3 py-2 text-xs focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 text-zinc-900 dark:text-white"
                />
                <button
                  type="submit"
                  className="rounded-xl bg-indigo-600 text-white px-4 py-2 hover:bg-indigo-500 shadow"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>
            </div>
          </section>
        )}
        
      </main>
    </div>
  );
}
