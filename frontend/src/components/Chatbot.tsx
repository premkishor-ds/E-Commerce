'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { MessageCircle, X, Send, Bot, Loader2, ShieldCheck, Wifi, WifiOff, Zap } from 'lucide-react';
import { useStore } from '../store/store';
import { PRODUCTS } from '../data/mockData';
import { useRouter } from 'next/navigation';

// ─── TYPES ───────────────────────────────────────────────────────────────────

interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: string;
  suggestions?: string[];
  data?: any;
  intent?: string;
  isError?: boolean;
}

interface AgentResponse {
  reply: string;
  intent: string;
  confidence: number;
  actions: Array<{ type: string; payload: Record<string, any> }>;
  nextStep?: string;
  stepData?: Record<string, any>;
  data?: any;
  needsAuth?: boolean;
  suggestions?: string[];
}

// ─── CONSTANTS ────────────────────────────────────────────────────────────────

const AGENT_URL = 'http://127.0.0.1:5001/api/v1/agent/message';

const DEFAULT_SUGGESTIONS = [
  'Search headphones',
  'My orders',
  'My cart',
  'Support ticket',
  'Login',
];

const TYPING_PLACEHOLDERS = [
  'Ask me anything about ApexStore...',
  'Search products, track orders...',
  'Type "help" to see all commands...',
  'Login, register, manage orders...',
  'Find products, apply coupons...',
];

// ─── GUEST ID GENERATOR ───────────────────────────────────────────────────────

function getOrCreateGuestId(): string {
  if (typeof window === 'undefined') return '';
  const key = 'apexstore_guest_id';
  let guestId = localStorage.getItem(key);
  if (!guestId) {
    guestId = 'guest_' + Date.now() + '_' + Math.random().toString(36).substring(2, 10);
    localStorage.setItem(key, guestId);
  }
  return guestId;
}

function getOrCreateSessionId(): string {
  if (typeof window === 'undefined') return '';
  const key = 'apexstore_session_id';
  let sessionId = sessionStorage.getItem(key);
  if (!sessionId) {
    sessionId = 'sess_' + Date.now() + '_' + Math.random().toString(36).substring(2, 10);
    sessionStorage.setItem(key, sessionId);
  }
  return sessionId;
}

// ─── COMPONENT ───────────────────────────────────────────────────────────────

export default function Chatbot() {
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { user, cart, wishlist, addToCart, orders, addOrder, clearCart, login, logout, toggleTheme } = useStore();
  const router = useRouter();

  // Mount effect
  useEffect(() => {
    setMounted(true);
  }, []);

  // Self-healing synchronization hook for legacy sessions
  useEffect(() => {
    if (user && user.token && typeof window !== 'undefined' && !localStorage.getItem('apex_token')) {
      localStorage.setItem('apex_token', user.token);
    }
  }, [user]);

  // Messages
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [currentSuggestions, setCurrentSuggestions] = useState<string[]>(DEFAULT_SUGGESTIONS);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Agent state (multi-step workflows)
  const [activeStep, setActiveStep] = useState<string | undefined>(undefined);
  const [stepData, setStepData] = useState<Record<string, any>>({});

  // ── Auto-clear stale auth steps if the user is already logged in ───────────
  // Prevents a stuck LOGIN_EMAIL / REGISTER_EMAIL banner when the user already
  // authenticated via the website header (not through the chatbot flow).
  useEffect(() => {
    const loginSteps = ['LOGIN_EMAIL', 'LOGIN_PASSWORD', 'REGISTER_EMAIL', 'REGISTER_PASSWORD'];
    if (user && activeStep && loginSteps.includes(activeStep)) {
      setActiveStep(undefined);
      setStepData({});
    }
  }, [user, activeStep]);

  // Identity
  const [guestId] = useState(() => getOrCreateGuestId());
  const [sessionId] = useState(() => getOrCreateSessionId());

  // ─── INJECT ANIMATION CSS (client-only, avoids SSR hash mismatch) ─────────
  useEffect(() => {
    const id = 'apex-chat-anim';
    if (!document.getElementById(id)) {
      const s = document.createElement('style');
      s.id = id;
      s.textContent = `@keyframes apexSlideUp{from{opacity:0;transform:translateY(20px) scale(.95)}to{opacity:1;transform:translateY(0) scale(1)}}`;
      document.head.appendChild(s);
    }
  }, []);

  // ─── INIT ──────────────────────────────────────────────────────────────────

  useEffect(() => {
    let active = true;
    const fetchGreeting = async () => {
      // Prompt backend with greet message to get dynamic response
      const token = user ? (typeof window !== 'undefined' ? localStorage.getItem('apex_token') : null) : null;
      try {
        const resp = await fetch(AGENT_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({
            message: 'hello',
            sessionId,
            guestId: user ? undefined : guestId,
          }),
        });
        if (!resp.ok) throw new Error();
        const data = await resp.json();
        if (active) {
          setMessages([
            {
              id: 'welcome',
              sender: 'bot',
              text: data.reply,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              suggestions: data.suggestions || ['Search headphones', 'My orders', 'Help'],
              intent: 'GREET',
            },
          ]);
          if (data.suggestions) {
            setCurrentSuggestions(data.suggestions);
          }
        }
      } catch {
        // Fallback default greeting if backend is offline
        if (active) {
          const welcome: ChatMessage = {
            id: 'welcome',
            sender: 'bot',
            text: `👋 Hello${user ? ` back, **${user.email}**` : ''}! I'm the **ApexStore AI Assistant**.\n\nI can perform real actions for you:\n• 🔍 Search & compare products from our catalog\n• 🛒 Add to cart, apply coupons, checkout\n• 📦 Track orders, cancel, request returns\n• 🎫 Create support tickets\n• 🔐 ${user ? 'Manage account, logout' : 'Login, register, manage account'}\n\nJust type naturally — no commands needed!`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            suggestions: user ? ['Search headphones', 'My orders', 'Create ticket', 'Help'] : ['Search headphones', 'My orders', 'Login', 'Help'],
            intent: 'GREET',
          };
          setMessages([welcome]);
        }
      }
    };
    fetchGreeting();
    return () => {
      active = false;
    };
  }, [user, guestId, sessionId]);

  // Rotate placeholder text
  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex(i => (i + 1) % TYPING_PLACEHOLDERS.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping, isOpen]);

  // Focus input on open or when typing ends
  useEffect(() => {
    if (isOpen && !isTyping) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen, isTyping]);

  // Check agent connectivity
  useEffect(() => {
    const checkOnline = async () => {
      try {
        const resp = await fetch('http://127.0.0.1:5001/api/v1', { method: 'GET', signal: AbortSignal.timeout(2000) });
        setIsOnline(true);
      } catch {
        setIsOnline(false);
      }
    };
    checkOnline();
    const interval = setInterval(checkOnline, 30000);
    return () => clearInterval(interval);
  }, []);

  // ─── ACTIONS EXECUTOR ─────────────────────────────────────────────────────

  const executeActions = useCallback((actions: AgentResponse['actions'], data?: any) => {
    for (const action of actions) {
      switch (action.type) {
        case 'ADD_TO_CART': {
          const p = action.payload;
          addToCart({ id: p.id, title: p.title, price: p.price, image: p.image || '' });
          break;
        }
        case 'CLEAR_CART':
          clearCart();
          break;
        case 'LOGIN': {
          const { user: u, token } = action.payload;
          if (u && token) {
            login(u.email, u.roles?.[0] || 'Customer', token, u.id);
            // Persist JWT for subsequent agent API calls
            if (typeof window !== 'undefined') {
              localStorage.setItem('apex_token', token);
            }
            // Merge guest data into account
            if (guestId) {
              fetch('http://127.0.0.1:5001/api/v1/agent/merge', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ guestId }),
              }).catch(() => {});
            }
          }
          break;
        }
        case 'LOGOUT':
          logout();
          break;
        case 'NAVIGATE':
          if (action.payload.path) router.push(action.payload.path);
          break;
        case 'NOTIFY':
          break;
        case 'TOGGLE_THEME':
          toggleTheme();
          break;
        default:
          break;
      }
    }
  }, [addToCart, clearCart, login, logout, router, guestId, toggleTheme]);

  // ─── AGENT API CALL ───────────────────────────────────────────────────────

  const callAgent = useCallback(async (message: string): Promise<AgentResponse | null> => {
    const token = user ? (typeof window !== 'undefined' ? localStorage.getItem('apex_token') : null) : null;
    try {
      const resp = await fetch(AGENT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          message,
          sessionId,
          guestId: user ? undefined : guestId,
          activeStep,
          stepData: {
            ...stepData,
            // Pass cart context for checkout
            cartItems: cart.map(item => ({ id: item.id, title: item.title, price: item.price, quantity: item.quantity })),
            total: cart.reduce((s, i) => s + i.price * i.quantity, 0) * 1.08,
            userId: user?.id,
          },
        }),
        signal: AbortSignal.timeout(10000),
      });
      if (!resp.ok) throw new Error('Backend error');
      return resp.json();
    } catch {
      return null;
    }
  }, [user, sessionId, guestId, activeStep, stepData, cart]);

  // ─── LOCAL FALLBACK ENGINE ────────────────────────────────────────────────
  // Used when backend is unreachable — preserves all existing chatbot logic

  const localFallback = useCallback((text: string): AgentResponse => {
    const q = text.toLowerCase().trim();

    // Buy / Add to cart
    const isBuyCmd = /^(buy|add|order|get)\s+.+/.test(q) || q.includes('add to cart');
    if (isBuyCmd) {
      const clean = q.replace(/^(buy|add|order|get)\s+/, '').replace(/\s*(to cart|a)\s*/g, '').trim();
      const prod = PRODUCTS.find(p =>
        p.title.toLowerCase().includes(clean) ||
        p.tags.some(t => t.toLowerCase().includes(clean))
      );
      if (prod) {
        addToCart({ id: prod.id, title: prod.title, price: prod.price, image: prod.images[0] });
        return {
          reply: `🛒 **Added to Cart!**\n\n✅ **${prod.title}** ($${prod.price}) has been added to your cart.\n\nWould you like to **checkout now**?`,
          intent: 'ADD_CART', confidence: 9,
          actions: [],
          suggestions: ['Checkout now', 'Continue shopping', 'View cart'],
          nextStep: 'CHECKOUT_NAME',
        };
      }
    }

    // Checkout
    if (q.includes('checkout') || q.includes('place order') || q.includes('buy now')) {
      if (cart.length === 0) return { reply: 'Your cart is empty! Search for products to add.', intent: 'CHECKOUT', confidence: 7, actions: [], suggestions: ['Search headphones'] };
      return {
        reply: `📦 Let's place your order!\n\nPlease enter the **Full Name** of the recipient:`,
        intent: 'CHECKOUT', confidence: 8, actions: [],
        nextStep: 'CHECKOUT_NAME', stepData: {},
        suggestions: [],
      };
    }

    // Login
    if (q.includes('login') || q.includes('sign in') || q === 'log in') {
      return { reply: 'Please enter your **email address**:', intent: 'LOGIN', confidence: 9, actions: [], nextStep: 'LOGIN_EMAIL' };
    }

    // Register
    if (q.includes('register') || q.includes('sign up') || q.includes('create account')) {
      return { reply: `Let's create your account!\n\nPlease enter your **email address**:`, intent: 'REGISTER', confidence: 9, actions: [], nextStep: 'REGISTER_EMAIL' };
    }

    // Logout
    if (q.includes('logout') || q.includes('sign out') || q === 'log out') {
      return { reply: `👋 **Logged out successfully!**\nSee you next time!`, intent: 'LOGOUT', confidence: 10, actions: [{ type: 'LOGOUT', payload: {} }], suggestions: ['Login', 'Register'] };
    }

    // Search
    const matched = PRODUCTS.filter(p =>
      p.title.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.tags.some(t => t.toLowerCase().includes(q))
    ).slice(0, 4);

    if (matched.length > 0) {
      const list = matched.map(p => `• **${p.title}** — $${p.price} ⭐${p.averageRating}`).join('\n');
      return {
        reply: `🔍 Found **${matched.length}** products:\n\n${list}\n\nType **"add [product]"** to add to cart!`,
        intent: 'SEARCH_PRODUCT', confidence: 7, actions: [],
        data: { products: matched },
        suggestions: matched.slice(0, 2).map(p => `Add ${p.title.split(' ').slice(0, 2).join(' ')} to cart`),
      };
    }

    // Orders
    if (q.includes('order') || q.includes('history')) {
      if (orders.length > 0) {
        const list = orders.map(o => `• **${o.id}** — ${o.status}`).join('\n');
        return { reply: `📦 **Your Orders:**\n\n${list}`, intent: 'VIEW_ORDERS', confidence: 8, actions: [], suggestions: ['Track order', 'Return order'] };
      }
      return { reply: `You have no orders yet. Start shopping!`, intent: 'VIEW_ORDERS', confidence: 7, actions: [], suggestions: ['Browse products'] };
    }

    // Wishlist
    if (q.includes('wishlist') || q.includes('watchlist')) {
      if (wishlist.length > 0) {
        const items = wishlist.map(id => {
          const p = PRODUCTS.find(pr => pr.id === id);
          return p ? `• ${p.title} ($${p.price})` : `• ${id}`;
        }).join('\n');
        return { reply: `💜 **Your Wishlist:**\n\n${items}`, intent: 'WISHLIST_VIEW', confidence: 8, actions: [] };
      }
      return { reply: 'Your wishlist is empty. Click the ❤️ icon on products to save them!', intent: 'WISHLIST_VIEW', confidence: 7, actions: [] };
    }

    // Profile
    if (q.includes('profile') || q.includes('who am i') || q === 'account') {
      if (user) {
        return {
          reply: `👤 **Your Signed-In Profile Details:**\n• **Email Address**: ${user.email}\n• **Role**: ${user.role}\n• **Session Status**: Active\n• **Wishlist count**: ${wishlist.length} items\n• **Cart count**: ${cart.reduce((s, i) => s + i.quantity, 0)} items\n\n[Go to Profile Settings Page](/profile)`,
          intent: 'VIEW_PROFILE', confidence: 10, actions: [],
          suggestions: ['My wallet', 'My addresses', 'GDPR export', 'Logout']
        };
      }
      return { reply: 'You are browsing as a guest. Type **"login"** to sign in.', intent: 'VIEW_PROFILE', confidence: 7, actions: [], needsAuth: true };
    }

    // Wallet
    if (q.includes('wallet') || q.includes('balance')) {
      if (user) {
        return {
          reply: `💳 **My Store Wallet:**\n• **Available Balance**: $15.00\n• **Linked cards**: 1 saved card\n• **Status**: Active\n\nType **"add 50 to wallet"** to add mock funds!`,
          intent: 'VIEW_WALLET', confidence: 10, actions: [],
          suggestions: ['Add 50 to wallet', 'My profile']
        };
      }
      return { reply: 'Please **login** to access your store wallet.', intent: 'VIEW_WALLET', confidence: 7, actions: [], needsAuth: true };
    }

    // Loyalty / points
    if (q.includes('loyalty') || q.includes('points') || q.includes('rewards')) {
      if (user) {
        return {
          reply: `🏆 **ApexStore Rewards Program:**\n• **Current Points**: 250 points\n• **Convertible Credit**: $2.50\n• **Membership Tier**: Gold Status\n\nType **"convert 100 points"** to redeem credit!`,
          intent: 'VIEW_LOYALTY', confidence: 10, actions: [],
          suggestions: ['Convert 100 points', 'My profile']
        };
      }
      return { reply: 'Please **login** to view loyalty rewards.', intent: 'VIEW_LOYALTY', confidence: 7, actions: [], needsAuth: true };
    }

    // Addresses
    if (q.includes('address') || q.includes('shipping')) {
      if (user) {
        return {
          reply: `🏠 **Saved Shipping Addresses:**\n• **Home**: 123 Main St, New York, 10001 (Default)\n\nYou can manage all saved addresses inside your [profile settings](/profile).`,
          intent: 'ADDRESS_MANAGE', confidence: 10, actions: [],
          suggestions: ['My profile', 'Checkout']
        };
      }
      return { reply: 'Please **login** to manage shipping addresses.', intent: 'ADDRESS_MANAGE', confidence: 7, actions: [], needsAuth: true };
    }

    // GDPR Export
    if (q.includes('export') || q.includes('gdpr export') || q.includes('download my data')) {
      if (user) {
        return {
          reply: `📄 **GDPR Right to Portability Data Export:**\n\nYour data snapshot is ready. [Click here to download your personal data snapshot](/api/v1/profile/export)`,
          intent: 'GDPR_EXPORT', confidence: 10, actions: []
        };
      }
      return { reply: 'Please **login** to request data portability exports.', intent: 'GDPR_EXPORT', confidence: 7, actions: [], needsAuth: true };
    }

    // GDPR Delete
    if (q.includes('delete my account') || q.includes('gdpr delete') || q.includes('erase my data')) {
      if (user) {
        return {
          reply: `⚠️ **GDPR Right to Be Forgotten: Account Scheduled for Deletion**\n\nYour profile has been scheduled for permanent erasure. You are now logged out.`,
          intent: 'GDPR_DELETE', confidence: 10, actions: [{ type: 'LOGOUT', payload: {} }]
        };
      }
      return { reply: 'Please **login** to submit deletion requests.', intent: 'GDPR_DELETE', confidence: 7, actions: [], needsAuth: true };
    }

    // Help
    if (q.includes('help') || q.includes('what can you do')) {
      return {
        reply: `🤖 **I can help you with:**\n\n🔍 Search products: "Show headphones"\n🛒 Add to cart: "Buy Sony headphones"\n📦 Orders: "My orders", "Track order"\n💜 Wishlist: "My wishlist"\n🎫 Support: "Create ticket"\n🔐 Account: "Login", "Register", "Logout"`,
        intent: 'HELP', confidence: 10, actions: [],
        suggestions: ['Search headphones', 'My orders', 'Create ticket', 'Login'],
      };
    }

    return {
      reply: `I'm not sure about that. Type **"help"** to see what I can do!`,
      intent: 'UNKNOWN', confidence: 1, actions: [],
      suggestions: ['Help', 'Search headphones', 'My orders'],
    };
  }, [addToCart, cart, orders, wishlist, user]);

  // ─── LOCAL STEP HANDLER ────────────────────────────────────────────────────

  const handleLocalStep = useCallback((message: string, step: string, data: Record<string, any>): AgentResponse | null => {
    const q = message.toLowerCase().trim();

    switch (step) {
      case 'REGISTER_EMAIL':
        if (!message.includes('@') || !message.includes('.')) return { reply: 'Please enter a valid **email address**:', intent: 'REGISTER', confidence: 0, actions: [], nextStep: 'REGISTER_EMAIL', stepData: data };
        return { reply: `Got it! Choose a **password** (min 6 chars):`, intent: 'REGISTER', confidence: 8, actions: [], nextStep: 'REGISTER_PASSWORD', stepData: { ...data, email: message.trim() } };

      case 'REGISTER_PASSWORD':
        if (message.length < 6) return { reply: 'Password must be at least **6 characters**:', intent: 'REGISTER', confidence: 0, actions: [], nextStep: 'REGISTER_PASSWORD', stepData: data };
        login(data.email, 'Customer', 'local_' + Date.now());
        return {
          reply: `🎉 **Account Created!**\nWelcome **${data.email}**! You're now signed in.`,
          intent: 'REGISTER', confidence: 10,
          actions: [{ type: 'LOGIN', payload: { user: { email: data.email, roles: ['Customer'] }, token: 'local_' + Date.now() } }],
          suggestions: ['Browse products', 'My orders'],
        };

      case 'LOGIN_EMAIL':
        if (!message.includes('@')) return { reply: 'Please enter a valid email:', intent: 'LOGIN', confidence: 0, actions: [], nextStep: 'LOGIN_EMAIL', stepData: data };
        return { reply: `Enter your **password** for ${message}:`, intent: 'LOGIN', confidence: 8, actions: [], nextStep: 'LOGIN_PASSWORD', stepData: { ...data, email: message.trim() } };

      case 'LOGIN_PASSWORD':
        login(data.email, 'Customer', 'local_' + Date.now());
        return {
          reply: `🔑 **Logged in!**\nWelcome back, **${data.email}**!`,
          intent: 'LOGIN', confidence: 10,
          actions: [{ type: 'LOGIN', payload: { user: { email: data.email, roles: ['Customer'] }, token: 'local_' + Date.now() } }],
          suggestions: ['My orders', 'Browse products'],
        };

      case 'CHECKOUT_NAME':
        return { reply: `Thanks **${message}**! Enter your **shipping address**:`, intent: 'CHECKOUT', confidence: 8, actions: [], nextStep: 'CHECKOUT_ADDRESS', stepData: { ...data, fullName: message } };

      case 'CHECKOUT_ADDRESS':
        return { reply: `Enter **City and ZIP** (e.g., "New York, 10001"):`, intent: 'CHECKOUT', confidence: 8, actions: [], nextStep: 'CHECKOUT_CITY_ZIP', stepData: { ...data, address: message } };

      case 'CHECKOUT_CITY_ZIP': {
        const parts = message.split(',');
        const city = parts[0]?.trim() || message;
        const zip = parts[1]?.trim() || '';
        const updData: any = { ...data, city, zipCode: zip };
        const subtotal = cart.reduce((s, i) => s + i.price * i.quantity, 0);
        const total = (subtotal * 1.08).toFixed(2);
        const cartStr = cart.map(i => `• ${i.title} ×${i.quantity}`).join('\n');
        return {
          reply: `📦 **Order Summary:**\n\n${cartStr}\n\n**Deliver to**: ${updData.fullName}, ${updData.address}, ${updData.city} ${updData.zipCode}\n**Total**: $${total}\n\nType **"confirm"** to place the order or **"cancel"** to abort.`,
          intent: 'CHECKOUT', confidence: 8, actions: [], nextStep: 'CHECKOUT_CONFIRM', stepData: { ...updData, total: parseFloat(total) },
          suggestions: ['✅ Confirm order', '❌ Cancel'],
        };
      }

      case 'CHECKOUT_CONFIRM':
        if (q === 'confirm' || q === 'yes' || q.includes('confirm order') || q === 'ok' || q === 'okay' || q === 'sure' || q.includes('place order')) {
          const orderId = 'ORD-' + Math.floor(100000 + Math.random() * 900000);
          addOrder({ id: orderId, items: [...cart], fullName: data.fullName, address: data.address, city: data.city, zipCode: data.zipCode });
          return {
            reply: `🎉 **Order Placed!**\n\nOrder **#${orderId}** confirmed!\n\n• Deliver to: ${data.fullName}, ${data.city}\n• Total: $${data.total?.toFixed(2)}`,
            intent: 'CHECKOUT', confidence: 10,
            actions: [{ type: 'CLEAR_CART', payload: {} }],
            suggestions: ['Track my order', 'Cancel order', 'Continue shopping'],
          };
        }
        return { reply: 'Order cancelled.', intent: 'CHECKOUT', confidence: 8, actions: [] };

      case 'REVIEW_RATING': {
        const num = parseInt(q.replace(/\D/g, ''));
        if (isNaN(num) || num < 1 || num > 5) return { reply: 'Please enter **1-5** stars:', intent: 'REVIEW_PRODUCT', confidence: 0, actions: [], nextStep: 'REVIEW_RATING', stepData: data };
        return { reply: `${num} stars! Write your **review comment**:`, intent: 'REVIEW_PRODUCT', confidence: 8, actions: [], nextStep: 'REVIEW_COMMENT', stepData: { ...data, rating: num } };
      }

      case 'REVIEW_COMMENT': {
        const prod = PRODUCTS.find(p => p.id === data.productId || p.title.toLowerCase().includes((data.productTitle || '').toLowerCase()));
        if (prod) {
          prod.reviews.push({ user: user?.email || 'Customer', rating: data.rating, comment: message, verified: true });
          const sum = prod.reviews.reduce((s, r) => s + r.rating, 0);
          prod.averageRating = parseFloat((sum / prod.reviews.length).toFixed(1));
        }
        return {
          reply: `⭐ **Review Submitted!**\n\nThank you for rating **${data.productTitle}** **${data.rating}/5 stars**!\n\n*"${message}"*`,
          intent: 'REVIEW_PRODUCT', confidence: 10, actions: [],
          suggestions: ['Browse similar products', 'My orders'],
        };
      }

      case 'CREATE_TICKET_SUBJECT':
        return { reply: `Please describe the **issue in detail**:`, intent: 'CREATE_TICKET', confidence: 8, actions: [], nextStep: 'CREATE_TICKET_MESSAGE', stepData: { ...data, subject: message } };

      case 'CREATE_TICKET_MESSAGE':
        return {
          reply: `✅ **Ticket Created!**\n\n• **Subject**: ${data.subject}\n• **Message**: ${message}\n• **Status**: Open\n\nOur team will respond within 24 hours!`,
          intent: 'CREATE_TICKET', confidence: 10, actions: [],
          suggestions: ['View tickets', 'Track order', 'Home'],
        };

      default:
        return null;
    }
  }, [cart, orders, addOrder, login, user]);

  // ─── MAIN MESSAGE HANDLER ─────────────────────────────────────────────────

  const handleSendMessage = useCallback(async (text: string) => {
    if (!text.trim() || isTyping) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    try {
      let agentResp: AgentResponse | null = null;

      // Try backend agent first
      if (isOnline) {
        agentResp = await callAgent(text);
      }

      // If backend unavailable or returned null, use local fallback
      if (!agentResp) {
        setIsOnline(false);
        // Skip LOGIN/REGISTER step handling if user is already authenticated
        const authSteps = ['LOGIN_EMAIL', 'LOGIN_PASSWORD', 'REGISTER_EMAIL', 'REGISTER_PASSWORD'];
        const isAuthStep = activeStep && authSteps.includes(activeStep);
        if (activeStep && !isAuthStep) {
          agentResp = handleLocalStep(text, activeStep, stepData);
        } else if (activeStep && isAuthStep && user) {
          // User is logged in but a login step is stuck — skip it
          setActiveStep(undefined);
          setStepData({});
        }
        if (!agentResp) {
          agentResp = localFallback(text);
        }
      }

      // Update step state — always clear when nextStep is absent or explicitly null/empty
      if (agentResp.nextStep) {
        setActiveStep(agentResp.nextStep);
        setStepData(agentResp.stepData || {});
      } else {
        // nextStep is undefined, null, or empty string → end of flow
        setActiveStep(undefined);
        setStepData({});
      }

      // Execute side-effects
      if (agentResp.actions?.length) {
        executeActions(agentResp.actions, agentResp.data);
      }

      // Also handle REVIEW action locally from data
      if (agentResp.intent === 'REVIEW_PRODUCT' && agentResp.data?.productId) {
        const prod = PRODUCTS.find(p => p.id === agentResp!.data.productId);
        if (prod) {
          prod.reviews.push({ user: user?.email || 'Customer', rating: agentResp.data.rating, comment: agentResp.data.comment, verified: true });
        }
      }

      // Update suggestions
      setCurrentSuggestions(agentResp.suggestions || DEFAULT_SUGGESTIONS);

      // Add bot message
      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: agentResp.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestions: agentResp.suggestions,
        data: agentResp.data,
        intent: agentResp.intent,
      };
      setMessages(prev => [...prev, botMsg]);

    } catch {
      const errMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: `⚠️ Something went wrong. Please try again or type **"help"** for assistance.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isError: true,
      };
      setMessages(prev => [...prev, errMsg]);
    } finally {
      setIsTyping(false);
    }
  }, [isTyping, isOnline, activeStep, stepData, callAgent, handleLocalStep, localFallback, executeActions, user]);

  // Position/Dragging and Resizing state
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const chatWindowRef = useRef<HTMLDivElement>(null);

  const [height, setHeight] = useState<number>(600);
  const [isResizing, setIsResizing] = useState(false);
  const resizeStartY = useRef<number>(0);
  const resizeStartHeight = useRef<number>(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('button') || target.closest('input') || target.closest('a')) return;
    
    e.preventDefault();
    setIsDragging(true);
    
    const rect = chatWindowRef.current?.getBoundingClientRect();
    const currentX = rect ? rect.left : window.innerWidth - 424;
    const currentY = rect ? rect.top : window.innerHeight - (height + 24);
    
    dragStart.current = {
      x: e.clientX - currentX,
      y: e.clientY - currentY,
    };
  };

  const handleResizeMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    resizeStartY.current = e.clientY;
    resizeStartHeight.current = height;
  };

  useEffect(() => {
    if (!isDragging && !isResizing) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        let newX = e.clientX - dragStart.current.x;
        let newY = e.clientY - dragStart.current.y;
        
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        const width = chatWindowRef.current?.offsetWidth || 400;
        
        newX = Math.max(0, Math.min(newX, windowWidth - width));
        newY = Math.max(0, Math.min(newY, windowHeight - height));
        
        setPosition({ x: newX, y: newY });
      } else if (isResizing) {
        const deltaY = e.clientY - resizeStartY.current;
        const newHeight = Math.max(400, Math.min(window.innerHeight - 50, resizeStartHeight.current - deltaY));
        setHeight(newHeight);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isResizing, height]);

  // ─── RENDER ──────────────────────────────────────────────────────────────
 
  if (!mounted) return null;

  return (
    <div 
      className="fixed bottom-6 right-6 z-50 font-sans"
      style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 50 }}
    >

      {/* ── Chat Bubble Button ── */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-indigo-600 text-white shadow-xl hover:bg-indigo-500 hover:scale-110 active:scale-95 transition-all duration-200"
          aria-label="Open AI Agent chat"
        >
          <MessageCircle className="h-6 w-6" />
          {/* Online indicator */}
          <span className={`absolute -top-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white ${isOnline ? 'bg-emerald-400' : 'bg-amber-400'}`} />
          {/* Pulse ring */}
          <span className="absolute inset-0 rounded-full bg-indigo-400 animate-ping opacity-20 group-hover:opacity-0" />
        </button>
      )}

      {/* ── Chat Window ── */}
      {isOpen && (
        <div 
          ref={chatWindowRef}
          className="flex flex-col bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 w-[360px] sm:w-[400px] rounded-2xl shadow-2xl overflow-hidden relative"
          style={{ 
            animation: 'apexSlideUp 0.2s ease-out',
            position: position ? 'fixed' : 'absolute',
            height: `${height}px`,
            ...(position 
              ? { left: `${position.x}px`, top: `${position.y}px`, bottom: 'auto', right: 'auto' } 
              : { bottom: '0px', right: '0px' }
            )
          }}
        >
          {/* Resize Handle at Top Border */}
          <div 
            onMouseDown={handleResizeMouseDown}
            className="absolute top-0 left-0 right-0 h-2 cursor-ns-resize z-50 hover:bg-indigo-500/20 active:bg-indigo-600/40 transition-colors"
            title="Drag to resize height"
          />

          {/* Header */}
          <div 
            onMouseDown={handleMouseDown}
            className="bg-gradient-to-r from-indigo-600 to-violet-600 p-4 text-white flex items-center justify-between flex-shrink-0 shadow-md cursor-grab active:cursor-grabbing select-none pt-5"
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="h-9 w-9 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
                  <Bot className="h-5 w-5 text-white" />
                </div>
                <span className={`absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border border-indigo-500 ${isOnline ? 'bg-emerald-400' : 'bg-amber-400'}`} />
              </div>
              <div>
                <h3 className="font-bold text-sm flex items-center gap-1.5">
                  ApexStore AI Agent
                  <Zap className="h-3 w-3 text-yellow-300" />
                </h3>
                <span className="flex items-center gap-1.5 text-[10px] text-indigo-200">
                  {isOnline ? (
                    <><Wifi className="h-2.5 w-2.5" /> Backend Connected</>
                  ) : (
                    <><WifiOff className="h-2.5 w-2.5 text-amber-300" /> <span className="text-amber-300">Offline Mode</span></>
                  )}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {user && (
                <div className="flex items-center gap-1 bg-white/15 px-2 py-0.5 rounded-full">
                  <ShieldCheck className="h-3 w-3 text-emerald-300" />
                  <span className="text-[10px] text-emerald-200 font-medium">{user.role}</span>
                </div>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                aria-label="Close chat"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Step indicator */}
          {activeStep && (
            <div className="bg-amber-50 dark:bg-amber-950/30 border-b border-amber-200 dark:border-amber-800 px-4 py-2 flex items-center gap-2 flex-shrink-0">
              <div className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
              <span className="text-[10px] text-amber-700 dark:text-amber-400 font-medium">
                Active workflow: {activeStep.replace(/_/g, ' ').toLowerCase()} — just type your answer
              </span>
            </div>
          )}

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-zinc-50/50 dark:bg-zinc-950/20 scroll-smooth">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`max-w-[88%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-indigo-600 text-white rounded-tr-none shadow-sm'
                    : `${msg.isError ? 'bg-red-50 border-red-200 dark:bg-red-950/30 dark:border-red-800' : 'bg-white dark:bg-zinc-900 border dark:border-zinc-800'} text-zinc-800 dark:text-zinc-200 rounded-tl-none shadow-sm border border-zinc-100`
                }`}>
                  <p className="whitespace-pre-line break-words">{msg.text}</p>
                  <span className="text-[9px] opacity-50 mt-1 block text-right">{msg.timestamp}</span>
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <div className="flex items-start gap-2">
                <div className="bg-white dark:bg-zinc-900 border dark:border-zinc-800 rounded-2xl rounded-tl-none px-4 py-3 shadow-sm flex items-center gap-2">
                  <Loader2 className="h-3 w-3 animate-spin text-indigo-500" />
                  <div className="flex gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                  <span className="text-[10px] text-zinc-400">Processing...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions */}
          <div className="px-3 pt-2 pb-1 bg-white dark:bg-zinc-900 border-t dark:border-zinc-800 flex-shrink-0">
            <div className="flex gap-1.5 overflow-x-auto scrollbar-hide pb-1">
              {currentSuggestions.map((action, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(action)}
                  disabled={isTyping}
                  className="text-[10px] bg-zinc-100 hover:bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-zinc-300 px-2.5 py-1.5 rounded-full transition-colors whitespace-nowrap flex-shrink-0 disabled:opacity-40"
                >
                  {action}
                </button>
              ))}
            </div>
          </div>

          {/* Input */}
          <form
            onSubmit={e => { e.preventDefault(); handleSendMessage(inputValue); }}
            className="p-3 bg-white dark:bg-zinc-900 border-t dark:border-zinc-800 flex gap-2 flex-shrink-0 items-end"
          >
            <textarea
              ref={inputRef}
              rows={1}
              placeholder={TYPING_PLACEHOLDERS[placeholderIndex]}
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage(inputValue);
                }
              }}
              className="flex-1 rounded-xl border border-zinc-200 dark:border-zinc-700 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 dark:bg-zinc-950 text-zinc-900 dark:text-white placeholder-zinc-400 transition-all disabled:opacity-50 resize-none max-h-24 py-2"
            />
            <button
              type="submit"
              disabled={isTyping || !inputValue.trim()}
              className="rounded-xl bg-indigo-600 text-white px-3 py-2 hover:bg-indigo-500 shadow active:scale-95 transition-all flex items-center justify-center shrink-0 disabled:opacity-40 disabled:cursor-not-allowed h-[32px] w-[38px]"
              aria-label="Send message"
            >
              {isTyping
                ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                : <Send className="h-3.5 w-3.5" />
              }
            </button>
          </form>
        </div>
      )}

    </div>
  );
}
