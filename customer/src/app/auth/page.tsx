'use client';

import React, { useState, useEffect } from 'react';
import { useStore } from '../../store/store';
import { useRouter } from 'next/navigation';
import { Lock, Mail, Phone, ArrowRight } from 'lucide-react';

export default function AuthPage() {
  const { user, login } = useStore();
  const router = useRouter();

  // ── All hooks must be declared before any conditional returns ──────────────
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [otpMode, setOtpMode] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [loginError, setLoginError] = useState('');

  // ── Redirect already-logged-in users to their profile ──────────────────────
  useEffect(() => {
    if (user) {
      router.replace('/profile');
    }
  }, [user, router]);

  // While redirect is pending, show a brief message (avoids flash of login form)
  if (user) {
    return (
      <div className="flex-1 flex items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <p className="text-zinc-500 text-sm animate-pulse">Redirecting to your profile…</p>
      </div>
    );
  }


  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoginError('');
    try {
      const res = await fetch('http://localhost:5001/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        setLoginError(err.message || 'Invalid email or password');
        return;
      }
      const data = await res.json();
      const token = data.accessToken;
      const userId = data.user?.id || '';
      login(email, data.user?.roles?.[0] || 'Customer', token, userId);
      router.push('/');
    } catch {
      setLoginError('Unable to reach the server. Please try again.');
    }
  };

  const handleOtpSend = () => {
    if (!phone) return;
    setOtpMode(true);
    alert('Mock verification code sent: 123456');
  };

  const handleOtpVerify = () => {
    if (otpCode === '123456') {
      const token = 'JWT-OTP-' + Math.random().toString(36).substring(2, 12);
      login(phone + '@mobile-otp.com', 'Customer', token);
      router.push('/');
    } else {
      alert('Invalid OTP code. Enter 123456');
    }
  };

  const handleSsoLogin = async (ssoEmail: string) => {
    setLoginError('');
    try {
      const res = await fetch('http://localhost:5001/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: ssoEmail, password: 'oauth_secure_password_sso' }),
      });
      if (!res.ok) {
        // Fallback to local store login if server fails
        const mockToken = ssoEmail.includes('google') ? 'OAUTH-GG-TOKEN' : 'OAUTH-GH-TOKEN';
        login(ssoEmail, 'Customer', mockToken);
        router.push('/');
        return;
      }
      const data = await res.json();
      const token = data.accessToken;
      const userId = data.user?.id || '';
      login(ssoEmail, data.user?.roles?.[0] || 'Customer', token, userId);
      router.push('/');
    } catch {
      // Fallback
      const mockToken = ssoEmail.includes('google') ? 'OAUTH-GG-TOKEN' : 'OAUTH-GH-TOKEN';
      login(ssoEmail, 'Customer', mockToken);
      router.push('/');
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl border border-zinc-200/80 dark:bg-zinc-900 dark:border-zinc-800 shadow-xl">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-zinc-900 dark:text-white">ApexStore Identity</h2>
          <p className="mt-2 text-sm text-zinc-500">Sign in to access your customer account and shop products.</p>
        </div>

        {/* Login tabs */}
        <div className="space-y-6">
          {!otpMode ? (
            <form onSubmit={handleEmailLogin} className="space-y-4">
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-400">
                  <Mail className="h-5 w-5" />
                </span>
                <input
                  type="email"
                  required
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-zinc-200 pl-10 pr-4 py-3 text-sm focus:border-indigo-500 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 text-zinc-900 dark:text-white"
                />
              </div>

              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-400">
                  <Lock className="h-5 w-5" />
                </span>
                <input
                  type="password"
                  required
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-zinc-200 pl-10 pr-4 py-3 text-sm focus:border-indigo-500 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 text-zinc-900 dark:text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 font-semibold text-white hover:bg-indigo-500 shadow-lg shadow-indigo-600/20 active:scale-95 transition-all"
              >
                <span>Continue Access</span>
                <ArrowRight className="h-4 w-4" />
              </button>
              {loginError && (
                <p className="text-sm text-red-500 text-center">{loginError}</p>
              )}
            </form>
          ) : (
            <div className="space-y-4">
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-400">
                  <Lock className="h-5 w-5" />
                </span>
                <input
                  type="text"
                  placeholder="Enter 6-Digit OTP Code (123456)"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  className="w-full rounded-xl border border-zinc-200 pl-10 pr-4 py-3 text-sm focus:border-indigo-500 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 text-zinc-900 dark:text-white"
                />
              </div>

              <button
                onClick={handleOtpVerify}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 font-semibold text-white hover:bg-indigo-500 active:scale-95 transition-all"
              >
                Verify Code & Login
              </button>
            </div>
          )}

          {/* OTP and Social Toggles */}
          {!otpMode && (
            <div className="space-y-4 pt-4 border-t border-zinc-100 dark:border-zinc-800">
              <div className="text-center text-xs text-zinc-400 font-bold uppercase tracking-wider">Or authenticate via</div>
              
              {/* Phone OTP */}
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-400">
                    <Phone className="h-5 w-5" />
                  </span>
                  <input
                    type="tel"
                    placeholder="Phone number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full rounded-xl border border-zinc-200 pl-10 pr-4 py-2.5 text-xs focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 text-zinc-900 dark:text-white"
                  />
                </div>
                <button
                  onClick={handleOtpSend}
                  className="rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-xs font-semibold hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-950 text-zinc-900 dark:text-white"
                >
                  Send OTP
                </button>
              </div>

              {/* SSO Buttons */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={() => handleSsoLogin('google-user@oauth.com')}
                  className="flex items-center justify-center gap-2 rounded-xl border border-zinc-200 py-2.5 text-xs font-semibold hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-950 text-zinc-900 dark:text-white"
                >
                  <svg className="h-4 w-4 text-red-500 fill-current" viewBox="0 0 24 24">
                    <path d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114-3.478 0-6.3-2.822-6.3-6.3s2.822-6.3 6.3-6.3c1.706 0 3.23.68 4.35 1.778l3.195-3.196C18.91 2.215 15.82 1 12.24 1 6.033 1 1 6.033 1 12.24s5.033 11.24 11.24 11.24c6.478 0 11.24-4.545 11.24-11.24 0-.768-.068-1.514-.2-2.222H12.24z"/>
                  </svg>
                  <span>Google</span>
                </button>
                <button
                  onClick={() => handleSsoLogin('github-user@oauth.com')}
                  className="flex items-center justify-center gap-2 rounded-xl border border-zinc-200 py-2.5 text-xs font-semibold hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-950 text-zinc-900 dark:text-white"
                >
                  <svg className="h-4 w-4 text-zinc-900 dark:text-white fill-current" viewBox="0 0 24 24">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.137 20.162 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
                  </svg>
                  <span>GitHub</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
