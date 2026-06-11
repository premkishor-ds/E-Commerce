'use client';

import React, { useState, useEffect } from 'react';
import { Star, X, RefreshCw } from 'lucide-react';

interface FeedbackWidgetProps {
  token?: string;
  email?: string;
}

export default function FeedbackWidget({ token, email }: FeedbackWidgetProps) {
  const [showWidget, setShowWidget] = useState(false);
  const [type, setType] = useState('Feedback');
  const [category, setCategory] = useState('General');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [name, setName] = useState('');
  const [guestEmail, setGuestEmail] = useState(email || '');
  const [phone, setPhone] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [severity, setSeverity] = useState('Medium');
  const [captchaInput, setCaptchaInput] = useState('');
  const [captchaVal, setCaptchaVal] = useState('8F9A');
  const [duplicates, setDuplicates] = useState<any[]>([]);

  const generateCaptcha = () => {
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let code = '';
    for (let i = 0; i < 4; i++) {
      code += chars[Math.floor(Math.random() * chars.length)];
    }
    setCaptchaVal(code);
  };

  useEffect(() => {
    if (email) setGuestEmail(email);
  }, [email]);

  useEffect(() => {
    if (showWidget) {
      generateCaptcha();
    }
  }, [showWidget]);

  // Check duplicate bug reports / features
  useEffect(() => {
    if (subject.trim().length > 3) {
      const delayDebounce = setTimeout(() => {
        fetch(`http://localhost:5001/api/v1/feedback/duplicates?type=${type}&subject=${subject}`)
          .then((res) => res.json())
          .then((data) => {
            const list = data.data || data;
            setDuplicates(Array.isArray(list) ? list : []);
          })
          .catch(() => setDuplicates([]));
      }, 500);
      return () => clearTimeout(delayDebounce);
    } else {
      setDuplicates([]);
    }
  }, [subject, type]);

  const handleVote = async (id: string) => {
    if (!token) {
      alert('Please sign in to vote on feature submissions!');
      return;
    }
    try {
      const res = await fetch(`http://localhost:5001/api/v1/feedback/${id}/vote`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (res.ok) {
        alert('Thank you! Your vote has been recorded.');
        // Update duplicates list
        setDuplicates(duplicates.map(d => d._id === id ? { ...d, votesCount: (d.votesCount || 0) + 1 } : d));
      } else {
        const err = await res.json();
        alert(err.message || 'Failed to submit vote.');
      }
    } catch {
      alert('Error voting on feature request.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (captchaInput.toUpperCase() !== captchaVal) {
      alert('Invalid CAPTCHA code! Please try again.');
      generateCaptcha();
      return;
    }

    const body: any = {
      feedbackType: type,
      category,
      subject,
      description,
      priority,
      severity,
      technicalContext: {
        userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'Server',
        url: typeof window !== 'undefined' ? window.location.href : '',
        screenResolution: typeof window !== 'undefined' ? `${window.screen.width}x${window.screen.height}` : '',
      }
    };

    if (token) {
      body.email = email || guestEmail;
    } else {
      body.name = name;
      body.email = guestEmail;
      body.phone = phone;
    }

    try {
      const url = token 
        ? 'http://localhost:5001/api/v1/feedback/submit-logged-in'
        : 'http://localhost:5001/api/v1/feedback/submit';
      
      const headers: any = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(body)
      });

      if (res.ok) {
        alert('Thank you! Your feedback has been submitted successfully.');
        setShowWidget(false);
        setSubject('');
        setDescription('');
        setCaptchaInput('');
      } else {
        const err = await res.json();
        alert(err.message || 'Failed to submit feedback.');
      }
    } catch {
      alert('Error connecting to feedback server. Please try again later.');
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setShowWidget(true)}
        className="fixed bottom-6 right-6 z-50 p-4 bg-indigo-600 hover:bg-indigo-500 hover:scale-105 active:scale-95 text-white rounded-full shadow-2xl transition-all flex items-center gap-2 cursor-pointer font-bold text-xs border-0"
      >
        <Star className="h-5 w-5 animate-pulse" />
        <span>Give Feedback</span>
      </button>

      {/* Overlay modal */}
      {showWidget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 backdrop-blur-md p-4 overflow-y-auto">
          <div className="w-full max-w-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-2xl p-6 relative max-h-[90vh] overflow-y-auto space-y-4">
            <button
              onClick={() => setShowWidget(false)}
              className="absolute top-4 right-4 p-1 rounded-full text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-850 bg-transparent border-0 cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="text-center">
              <h2 className="text-lg font-black text-zinc-900 dark:text-white">Feedback Center</h2>
              <p className="text-xs text-zinc-500">Report bugs, request features, or submit feedback directly to our product engineering teams.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] text-zinc-400 font-bold uppercase mb-1">Feedback Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full px-3 py-2 border dark:border-zinc-800 bg-white dark:bg-zinc-950 rounded-lg text-zinc-800 dark:text-white outline-none"
                  >
                    <option value="Feedback">Feedback</option>
                    <option value="Suggestion">Suggestion</option>
                    <option value="Bug Report">Bug Report</option>
                    <option value="Feature Request">Feature Request</option>
                    <option value="Complaint">Complaint</option>
                    <option value="Security Report">Security Report</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] text-zinc-400 font-bold uppercase mb-1">Queue Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 border dark:border-zinc-800 bg-white dark:bg-zinc-950 rounded-lg text-zinc-800 dark:text-white outline-none"
                  >
                    <option value="General">General</option>
                    <option value="Bug Reports">Bug Reports</option>
                    <option value="Feature Requests">Feature Requests</option>
                    <option value="Complaint Reports">Complaint Reports</option>
                    <option value="Security Reports">Security Reports</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] text-zinc-400 font-bold uppercase mb-1">Subject / Summary</label>
                <input
                  type="text"
                  required
                  placeholder="Summarize the request or issue..."
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-3 py-2 border dark:border-zinc-800 bg-white dark:bg-zinc-950 rounded-lg text-zinc-805 dark:text-white outline-none focus:border-indigo-500"
                />
              </div>

              {/* Duplicate suggestions */}
              {duplicates.length > 0 && (
                <div className="bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-150/40 p-3.5 rounded-xl space-y-2">
                  <span className="block text-[10px] text-indigo-700 dark:text-indigo-400 font-extrabold uppercase tracking-wider">Similar Existing Submissions</span>
                  <div className="space-y-2 max-h-[120px] overflow-y-auto pr-1">
                    {duplicates.map((item: any) => (
                      <div key={item._id} className="flex justify-between items-center bg-white dark:bg-zinc-900 border dark:border-zinc-850 p-2 rounded-lg gap-3">
                        <div className="min-w-0">
                          <div className="font-bold text-zinc-800 dark:text-zinc-200 truncate">{item.subject}</div>
                          <div className="text-[9px] text-zinc-450 mt-0.5">Status: {item.status} · Votes: {item.votesCount || 0}</div>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleVote(item._id)}
                          className="px-2.5 py-1 bg-indigo-650 text-white rounded text-[9px] font-bold shrink-0 hover:bg-indigo-500 border-0 cursor-pointer"
                        >
                          Vote (+1)
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-[10px] text-zinc-400 font-bold uppercase mb-1">Details & Description</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Provide precise details, steps to reproduce, or product goals..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 border dark:border-zinc-800 bg-white dark:bg-zinc-950 rounded-lg text-zinc-800 dark:text-white outline-none focus:border-indigo-500"
                />
              </div>

              {!token && (
                <div className="border-t border-dashed dark:border-zinc-800 pt-3.5 space-y-3">
                  <span className="block text-[10px] text-zinc-455 font-bold uppercase tracking-wider">Guest Contact Details</span>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <input
                        type="text"
                        required
                        placeholder="Your Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-2.5 py-1.5 border dark:border-zinc-800 bg-white dark:bg-zinc-955 rounded-lg text-zinc-800 dark:text-white outline-none"
                      />
                    </div>
                    <div>
                      <input
                        type="email"
                        required
                        placeholder="Your Email"
                        value={guestEmail}
                        onChange={(e) => setGuestEmail(e.target.value)}
                        className="w-full px-2.5 py-1.5 border dark:border-zinc-800 bg-white dark:bg-zinc-955 rounded-lg text-zinc-805 dark:text-white outline-none"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        placeholder="Phone (Optional)"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-2.5 py-1.5 border dark:border-zinc-800 bg-white dark:bg-zinc-955 rounded-lg text-zinc-805 dark:text-white outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-3 gap-3 border-t border-dashed dark:border-zinc-800 pt-3">
                <div>
                  <label className="block text-[10px] text-zinc-400 font-bold uppercase mb-1">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="w-full px-3 py-2 border dark:border-zinc-800 bg-white dark:bg-zinc-955 rounded-lg text-zinc-800 dark:text-white outline-none"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] text-zinc-400 font-bold uppercase mb-1">Severity</label>
                  <select
                    value={severity}
                    onChange={(e) => setSeverity(e.target.value)}
                    className="w-full px-3 py-2 border dark:border-zinc-800 bg-white dark:bg-zinc-955 rounded-lg text-zinc-800 dark:text-white outline-none"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] text-zinc-400 font-bold uppercase mb-1">
                    CAPTCHA: <span className="font-mono font-black text-indigo-650 dark:text-indigo-400 bg-zinc-100 dark:bg-zinc-950 px-1 rounded">{captchaVal}</span>
                  </label>
                  <div className="flex gap-1.5">
                    <input
                      type="text"
                      required
                      placeholder="Code"
                      value={captchaInput}
                      onChange={(e) => setCaptchaInput(e.target.value)}
                      className="w-full px-2.5 py-1.5 border dark:border-zinc-800 bg-white dark:bg-zinc-955 rounded-lg font-mono tracking-widest text-zinc-800 dark:text-white outline-none"
                    />
                    <button
                      type="button"
                      onClick={generateCaptcha}
                      className="px-2 py-1.5 border dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 bg-transparent rounded-lg text-zinc-500 cursor-pointer"
                    >
                      <RefreshCw className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold rounded-xl shadow-lg active:scale-95 transition-all text-xs border-0 cursor-pointer"
              >
                Submit Feedback Request
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
