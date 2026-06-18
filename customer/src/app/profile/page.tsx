'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../../store/store';
import { useRouter } from 'next/navigation';
import { 
  User, Lock, MapPin, ShoppingBag, CreditCard, Wallet, 
  Award, Shield, HelpCircle, FileText, Activity, Save, 
  Trash2, Plus, Edit2, RotateCw, CheckCircle, AlertTriangle, 
  LogOut, Upload, Download, Eye, RefreshCw, Star, Trash,
  Tag, Bell, Gift, X
} from 'lucide-react';

// --- MOCK INVOICE GENERATOR HELPER ---
const downloadMockInvoice = (orderId: string, total: number) => {
  const content = `
========================================
             APEXSTORE INVOICE          
========================================
Order ID:   ${orderId}
Date:       ${new Date().toLocaleDateString()}
Status:     Delivered
Payment:    Visa Credit Card (Masked)
----------------------------------------
Items:
- Apex Sound-Pro ANC Headphones x 1  $299.99
----------------------------------------
Tax:        $24.00
Shipping:   FREE
Total Paid: $${total.toFixed(2)}
========================================
Thank you for shopping with ApexStore!
`;
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Invoice-${orderId}.txt`;
  a.click();
};

export default function ProfilePage() {
  const { user, wishlist, cart, orders: zOrders, logout } = useStore();
  const router = useRouter();
  
  // Navigation & Tabs
  const [activeTab, setActiveTab] = useState('overview');
  
  // Loading & State
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [walletTx, setWalletTx] = useState<any[]>([]);
  const [tickets, setTickets] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  
  // Input Form States
  const [profileForm, setProfileForm] = useState<any>({});
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [addressForm, setAddressForm] = useState<any>({ fullName: '', mobileNumber: '', alternateMobile: '', country: '', state: '', city: '', street: '', landmark: '', pincode: '', addressType: 'Home', isDefault: false });
  const [paymentForm, setPaymentForm] = useState<any>({ type: 'card', cardDetails: { brand: 'Visa', last4: '', expiryMonth: 12, expiryYear: 2028, token: 'TOK-MOCK' }, upiDetails: { vpa: '' }, walletDetails: { provider: 'Paytm' }, isDefault: false });
  const [ticketForm, setTicketForm] = useState({ subject: '', priority: 'Medium', message: '' });
  const [walletAmount, setWalletAmount] = useState('');
  const [pointsConvert, setPointsConvert] = useState('');
  
  // Phase E States
  const [notifications, setNotifications] = useState<any[]>([]);
  const [coupons, setCoupons] = useState<any[]>([
    { code: 'SAVE20', discount: '20% OFF', description: '20% off on all items', validUntil: '2026-12-31', claimed: false },
    { code: 'WELCOME10', discount: '10% OFF', description: '10% off for new signups', validUntil: '2026-08-30', claimed: true },
    { code: 'FREESHIP', discount: 'FREE SHIPPING', description: 'Free shipping on orders above $50', validUntil: '2026-10-15', claimed: false }
  ]);
  const [couponInput, setCouponInput] = useState('');
  const [referrals, setReferrals] = useState({
    code: 'REF-JOHNDOE-2026',
    earnedBalance: 25.00,
    list: [
      { email: 'alex.smith@example.com', status: 'Completed', date: '2026-05-12', bonus: '$10.00' },
      { email: 'sarah.j@example.com', status: 'Completed', date: '2026-06-01', bonus: '$15.00' },
      { email: 'mike.d@example.com', status: 'Pending', date: '2026-06-08', bonus: '$0.00' }
    ]
  });
  const [trackingOrder, setTrackingOrder] = useState<any | null>(null);
  
  // Avatar editor simulation
  const [avatarPreview, setAvatarPreview] = useState('');
  const [avatarAngle, setAvatarAngle] = useState(0);
  
  // Modal visibility
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showTicketModal, setShowTicketModal] = useState(false);
  
  // Feedback Messages
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Check login session
  useEffect(() => {
    if (!user) {
      router.push('/auth');
    }
  }, [user, router]);

  // Fetch API Details (with robust mock local fallbacks)
  const fetchAllData = async () => {
    if (!user) return;
    setLoading(true);
    const token = typeof window !== 'undefined' ? localStorage.getItem('apex_token') : null;
    
    try {
      // Profile Fetch
      const pResp = await fetch('http://localhost:5001/api/v1/profile/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!pResp.ok) throw new Error();
      const pData = await pResp.json();
      setProfile(pData);
      setProfileForm(pData);
      setAvatarPreview(pData.profilePhoto || 'https://picsum.photos/seed/useravatar/200/200');
    } catch {
      // Offline / Local Mock Profile
      const mockProfile = {
        firstName: 'John',
        lastName: 'Doe',
        displayName: 'John Doe',
        username: 'johndoe',
        email: user.email,
        phone: (user as any).phone || '+12025550143',
        alternatePhone: '+12025550999',
        dob: '1995-05-15',
        gender: 'Male',
        profilePhoto: 'https://picsum.photos/seed/useravatar/200/200',
        languagePreference: 'en',
        currencyPreference: 'USD',
        timezone: 'UTC',
        membershipLevel: 'Gold',
        rewardPoints: 450,
        walletBalance: 125.50,
        accountStatus: 'Active',
        verificationStatus: true,
        joinDate: '01/10/2025',
        lastLogin: new Date().toLocaleString(),
        mfaEnabled: false,
      };
      setProfile(mockProfile);
      setProfileForm(mockProfile);
      setAvatarPreview(mockProfile.profilePhoto);
    }

    try {
      // Addresses Fetch
      const aResp = await fetch('http://localhost:5001/api/v1/profile/addresses', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!aResp.ok) throw new Error();
      const aData = await aResp.json();
      setAddresses(aData);
    } catch {
      setAddresses([
        { _id: 'addr-1', fullName: 'John Doe', mobileNumber: '+12025550143', country: 'US', state: 'NY', city: 'Metropolis', street: '100 Commerce St', landmark: 'Apex Building', pincode: '10001', addressType: 'Home', isDefault: true }
      ]);
    }

    try {
      // Payments Fetch
      const payResp = await fetch('http://localhost:5001/api/v1/profile/payments', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!payResp.ok) throw new Error();
      const payData = await payResp.json();
      setPayments(payData);
    } catch {
      setPayments([
        { _id: 'pay-1', type: 'card', cardDetails: { brand: 'Visa', last4: '4242', expiryMonth: 12, expiryYear: 2028, token: 'TOK-4242' }, isDefault: true }
      ]);
    }

    try {
      // Wallet Fetch
      const wResp = await fetch('http://localhost:5001/api/v1/profile/wallet', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!wResp.ok) throw new Error();
      const wData = await wResp.json();
      setWalletTx(wData);
    } catch {
      setWalletTx([
        { _id: 'tx-1', amount: 50.00, transactionType: 'Credit', description: 'Initial balance load', status: 'Completed', createdAt: '2026-06-01T10:00:00.000Z' },
        { _id: 'tx-2', amount: 25.50, transactionType: 'Cashback', description: 'Coupon code match cashback reward', status: 'Completed', createdAt: '2026-06-03T14:30:00.000Z' }
      ]);
    }

    try {
      // Support Tickets Fetch
      const tResp = await fetch('http://localhost:5001/api/v1/profile/tickets', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!tResp.ok) throw new Error();
      const tData = await tResp.json();
      setTickets(tData);
    } catch {
      setTickets([
        { _id: 't-1', subject: 'Refund delay status', status: 'Open', priority: 'Medium', messages: [{ senderId: 'user', message: 'I returned order ORD-123 but did not receive funds yet.', sentAt: new Date().toISOString() }], createdAt: new Date().toISOString() }
      ]);
    }

    try {
      // Orders Fetch
      const oResp = await fetch('http://localhost:5001/api/v1/sales/orders', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!oResp.ok) throw new Error();
      const oData = await oResp.json();
      
      const formattedOrders = await Promise.all(oData.map(async (o: any) => {
        const items = await Promise.all((o.items || []).map(async (item: any) => {
          try {
            const prodResp = await fetch(`http://localhost:5001/api/v1/catalog/products/${item.productId.toString()}`);
            if (prodResp.ok) {
              const prod = await prodResp.json();
              return {
                id: item.productId.toString(),
                title: prod.title,
                price: item.price,
                image: prod.images?.[0] || 'https://picsum.photos/seed/product/600/600',
                quantity: item.quantity
              };
            }
          } catch {}
          return {
            id: item.productId.toString(),
            title: `Product #${item.productId.toString().slice(-4).toUpperCase()}`,
            price: item.price,
            image: 'https://picsum.photos/seed/product/600/600',
            quantity: item.quantity
          };
        }));

        return {
          id: String(o._id).slice(-8).toUpperCase(),
          items,
          fullName: o.shippingAddress?.fullName || 'Customer',
          address: o.shippingAddress?.addressLine1 || o.shippingAddress?.street || '123 E-Commerce Way',
          city: o.shippingAddress?.city || 'Metropolis',
          zipCode: o.shippingAddress?.postalCode || o.shippingAddress?.pincode || '10001',
          status: o.status || 'Pending',
          createdAt: new Date(o.createdAt).toLocaleDateString()
        };
      }));

      setOrders(formattedOrders);
    } catch {
      setOrders(zOrders);
    }

    try {
      // Audit Logs Fetch
      const lResp = await fetch('http://localhost:5001/api/v1/profile/logs', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!lResp.ok) throw new Error();
      const lData = await lResp.json();
      setLogs(lData);
    } catch {
      setLogs([
        { _id: 'l-1', action: 'Console Authentication', details: 'User successfully logged into ApexStore identity console', type: 'Security', createdAt: new Date().toISOString() }
      ]);
    }

    try {
      // Notifications Fetch
      const nResp = await fetch('http://localhost:5001/api/v1/notifications', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!nResp.ok) throw new Error();
      const nData = await nResp.json();
      setNotifications(nData);
    } catch {
      setNotifications([
        { _id: 'notif-1', title: 'Order Shipped!', message: 'Your order #ORD-123 has been shipped and is on its way.', isRead: false, createdAt: new Date(Date.now() - 3600000).toISOString() },
        { _id: 'notif-2', title: 'Points Converted Successfully', message: 'You converted 500 reward points into $5.00 wallet balance.', isRead: true, createdAt: new Date(Date.now() - 86400000).toISOString() },
        { _id: 'notif-3', title: 'Security Alert', message: 'Your password was updated successfully.', isRead: true, createdAt: new Date(Date.now() - 172800000).toISOString() }
      ]);
    }
    
    setLoading(false);
  };

  useEffect(() => {
    fetchAllData();
  }, [user]);

  // Handle Edit profile update
  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('apex_token');
    try {
      const resp = await fetch('http://localhost:5001/api/v1/profile/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(profileForm)
      });
      if (!resp.ok) throw new Error();
      const data = await resp.json();
      setProfile(data);
      showToast('Profile settings updated successfully!');
    } catch {
      setProfile(profileForm);
      showToast('Profile updated locally (offline mode)!');
    }
  };

  // Handle Password modification
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showToast('New passwords do not match!', 'error');
      return;
    }
    const token = localStorage.getItem('apex_token');
    try {
      const resp = await fetch('http://localhost:5001/api/v1/profile/security/password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ currentPassword: passwordForm.currentPassword, newPassword: passwordForm.newPassword })
      });
      if (!resp.ok) {
        const err = await resp.json();
        throw new Error(err.message || 'Operation failed');
      }
      showToast('Security password changed successfully!');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err: any) {
      showToast(err.message || 'Incorrect current password', 'error');
    }
  };

  // Add or Edit Address
  const handleAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('apex_token');
    
    try {
      if (editingAddressId) {
        // Edit Address
        const resp = await fetch(`http://localhost:5001/api/v1/profile/addresses/${editingAddressId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify(addressForm)
        });
        if (!resp.ok) throw new Error();
        const updated = await resp.json();
        setAddresses(addresses.map(a => a._id === editingAddressId ? updated : a));
        showToast('Shipping address edited successfully!');
      } else {
        // Add Address
        const resp = await fetch('http://localhost:5001/api/v1/profile/addresses', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify(addressForm)
        });
        if (!resp.ok) throw new Error();
        const saved = await resp.json();
        setAddresses([...addresses, saved]);
        showToast('New address saved to book!');
      }
    } catch {
      // Fallback offline simulator
      const simulated = {
        _id: editingAddressId || `addr-${Date.now()}`,
        ...addressForm
      };
      if (editingAddressId) {
        setAddresses(addresses.map(a => a._id === editingAddressId ? simulated : a));
      } else {
        setAddresses([...addresses, simulated]);
      }
      showToast('Address book synchronized offline!');
    }
    
    setShowAddressModal(false);
    setEditingAddressId(null);
    setAddressForm({ fullName: '', mobileNumber: '', alternateMobile: '', country: '', state: '', city: '', street: '', landmark: '', pincode: '', addressType: 'Home', isDefault: false });
  };

  // Delete shipping address
  const handleAddressDelete = async (id: string) => {
    const token = localStorage.getItem('apex_token');
    try {
      await fetch(`http://localhost:5001/api/v1/profile/addresses/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      setAddresses(addresses.filter(a => a._id !== id));
      showToast('Address removed successfully');
    } catch {
      setAddresses(addresses.filter(a => a._id !== id));
      showToast('Address deleted offline');
    }
  };

  // Add Card Payment Method
  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('apex_token');
    try {
      const resp = await fetch('http://localhost:5001/api/v1/profile/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(paymentForm)
      });
      if (!resp.ok) throw new Error();
      const saved = await resp.json();
      setPayments([...payments, saved]);
      showToast('Payment method saved to vault.');
    } catch {
      const simulated = {
        _id: `pay-${Date.now()}`,
        ...paymentForm
      };
      setPayments([...payments, simulated]);
      showToast('Card saved securely to offline vault!');
    }
    setShowPaymentModal(false);
  };

  // Delete card payment method
  const handlePaymentDelete = async (id: string) => {
    const token = localStorage.getItem('apex_token');
    try {
      await fetch(`http://localhost:5001/api/v1/profile/payments/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      setPayments(payments.filter(p => p._id !== id));
      showToast('Payment card revoked.');
    } catch {
      setPayments(payments.filter(p => p._id !== id));
      showToast('Card revoked offline.');
    }
  };

  // Raise Support ticket
  const handleTicketSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('apex_token');
    try {
      const resp = await fetch('http://localhost:5001/api/v1/profile/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(ticketForm)
      });
      if (!resp.ok) throw new Error();
      const saved = await resp.json();
      setTickets([saved, ...tickets]);
      showToast('Helpline ticket raised successfully!');
    } catch {
      const simulated = {
        _id: `t-${Date.now()}`,
        subject: ticketForm.subject,
        status: 'Open',
        priority: ticketForm.priority,
        messages: [{ senderId: 'user', message: ticketForm.message, sentAt: new Date().toISOString() }],
        createdAt: new Date().toISOString()
      };
      setTickets([simulated, ...tickets]);
      showToast('Ticket submitted (offline record created)!');
    }
    setShowTicketModal(false);
    setTicketForm({ subject: '', priority: 'Medium', message: '' });
  };

  // Convert loyalty points
  const handleConvertPoints = async (e: React.FormEvent) => {
    e.preventDefault();
    const pts = parseInt(pointsConvert);
    if (!pts || pts <= 0 || pts > (profile?.rewardPoints || 0)) {
      showToast('Invalid point range input!', 'error');
      return;
    }
    const token = localStorage.getItem('apex_token');
    try {
      const resp = await fetch('http://localhost:5001/api/v1/profile/rewards/convert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ points: pts })
      });
      if (!resp.ok) throw new Error();
      const res = await resp.json();
      setProfile({ ...profile, rewardPoints: res.rewardPoints, walletBalance: res.walletBalance });
      showToast(`Points converted! Added $${(pts / 100).toFixed(2)} to wallet credit.`);
      setPointsConvert('');
    } catch {
      const val = pts / 100;
      setProfile({
        ...profile,
        rewardPoints: profile.rewardPoints - pts,
        walletBalance: profile.walletBalance + val
      });
      setWalletTx([
        { _id: `tx-${Date.now()}`, amount: val, transactionType: 'Cashback', description: `Points conversion credit`, status: 'Completed', createdAt: new Date().toISOString() },
        ...walletTx
      ]);
      showToast(`Conversion complete: Points converted locally!`);
      setPointsConvert('');
    }
  };

  // Add wallet balance
  const handleAddWalletBalance = async (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(walletAmount);
    if (!amt || amt <= 0) {
      showToast('Invalid fund amount entered!', 'error');
      return;
    }
    const token = localStorage.getItem('apex_token');
    try {
      const resp = await fetch('http://localhost:5001/api/v1/profile/wallet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ amount: amt, description: 'Added wallet balance funds' })
      });
      if (!resp.ok) throw new Error();
      const res = await resp.json();
      setProfile({ ...profile, walletBalance: res.walletBalance });
      showToast(`Successfully added $${amt.toFixed(2)} cash funds!`);
      setWalletAmount('');
    } catch {
      setProfile({ ...profile, walletBalance: profile.walletBalance + amt });
      setWalletTx([
        { _id: `tx-${Date.now()}`, amount: amt, transactionType: 'Credit', description: 'Manually loaded cash funds', status: 'Completed', createdAt: new Date().toISOString() },
        ...walletTx
      ]);
      showToast(`Added $${amt.toFixed(2)} offline credits!`);
      setWalletAmount('');
    }
  };

  // Toggle MFA 2FA security
  const handleTfaToggle = async () => {
    const nextState = !profile?.mfaEnabled;
    const token = localStorage.getItem('apex_token');
    try {
      const resp = await fetch('http://localhost:5001/api/v1/profile/security/2fa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ enabled: nextState, secret: nextState ? 'TFA-SECRET-APEX-1234' : undefined })
      });
      if (!resp.ok) throw new Error();
      const res = await resp.json();
      setProfile({ ...profile, mfaEnabled: nextState });
      if (nextState) {
        alert(`2FA Enabled! Save your backup recovery codes:\n\n${res.backupCodes.join('\n')}`);
      } else {
        showToast('2FA Security deactivated');
      }
    } catch {
      setProfile({ ...profile, mfaEnabled: nextState });
      showToast(`2FA status toggled locally: ${nextState ? 'Activated' : 'Deactivated'}`);
    }
  };

  // GDPR Export snap JSON
  const handleGdprExport = async () => {
    const token = localStorage.getItem('apex_token');
    try {
      const resp = await fetch('http://localhost:5001/api/v1/profile/export', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!resp.ok) throw new Error();
      const blobData = await resp.json();
      const blob = new Blob([JSON.stringify(blobData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ApexStore-Data-Export.json`;
      a.click();
      showToast('Personal data snap exported!');
    } catch {
      const backupSnap = { profile, addresses, wishlist, cart, orders, walletTx, tickets };
      const blob = new Blob([JSON.stringify(backupSnap, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ApexStore-Data-OfflineExport.json`;
      a.click();
      showToast('Personal backup file downloaded!');
    }
  };

  // GDPR deletion request
  const handleGdprDelete = async () => {
    if (!confirm('Are you absolutely sure you want to request account deletion? This request will clear all addresses, payment configurations, and wallet credits.')) return;
    const token = localStorage.getItem('apex_token');
    try {
      const resp = await fetch('http://localhost:5001/api/v1/profile/delete-request', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!resp.ok) throw new Error();
      showToast('Deletion request submitted! Logging out...', 'info');
      setTimeout(logout, 3000);
    } catch {
      showToast('Soft-deletion scheduled offline! Logging out...', 'info');
      setTimeout(logout, 3000);
    }
  };

  if (!user || loading) {
    return (
      <div className="min-h-screen flex-1 flex flex-col items-center justify-center bg-zinc-50 dark:bg-zinc-950 py-12 px-4">
        <div className="text-center space-y-4">
          <RefreshCw className="h-10 w-10 text-indigo-600 animate-spin mx-auto" />
          <p className="text-sm font-semibold text-zinc-500">Decrypting account profile credentials...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-zinc-50 dark:bg-zinc-950 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Toast Alert */}
        {toast && (
          <div className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-xl border text-xs font-semibold shadow-lg transition-all ${
            toast.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-950/80 dark:border-emerald-900 dark:text-emerald-300' :
            toast.type === 'error' ? 'bg-red-50 border-red-200 text-red-800 dark:bg-red-950/80 dark:border-red-900 dark:text-red-300' :
            'bg-indigo-50 border-indigo-200 text-indigo-850 dark:bg-indigo-950/80 dark:border-indigo-900 dark:text-indigo-300'
          }`}>
            {toast.type === 'success' && <CheckCircle className="h-4 w-4 text-emerald-600" />}
            {toast.type === 'error' && <AlertTriangle className="h-4 w-4 text-red-600" />}
            <span>{toast.message}</span>
          </div>
        )}

        {/* Dashboard Profile Overview Card */}
        <section className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left w-full md:w-auto">
            <div className="relative h-24 w-24 rounded-full overflow-hidden border-2 border-indigo-650 bg-zinc-150">
              <img 
                src={avatarPreview} 
                alt="Avatar Profile" 
                className="h-full w-full object-cover transition-transform"
                style={{ transform: `rotate(${avatarAngle}deg)` }}
              />
            </div>
            <div className="space-y-1 flex-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h1 className="text-2xl font-black text-zinc-900 dark:text-white">
                  {profile?.firstName ? `${profile.firstName} ${profile.lastName}` : user.email.split('@')[0]}
                </h1>
                <span className="inline-flex items-center rounded-full bg-indigo-50 dark:bg-indigo-950/40 px-2.5 py-0.5 text-xs font-semibold text-indigo-700 dark:text-indigo-350 border border-indigo-100 dark:border-indigo-900/50">
                  {profile?.membershipLevel} Rank
                </span>
                <span className="inline-flex items-center rounded-full bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 dark:text-emerald-350 border border-emerald-100 dark:border-emerald-900/50">
                  {profile?.accountStatus}
                </span>
              </div>
              <p className="text-xs text-zinc-400">Username: <strong className="text-zinc-650 dark:text-zinc-300">@{profile?.username || 'user'}</strong> | Registered: {profile?.joinDate || 'Oct 2025'}</p>
              <p className="text-xs text-zinc-500">{user.email} &bull; {profile?.phone}</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6 text-center border-t md:border-t-0 pt-4 md:pt-0 border-zinc-150 dark:border-zinc-800 w-full md:w-auto">
            <div className="bg-zinc-50 dark:bg-zinc-950/40 p-3.5 rounded-xl border dark:border-zinc-850">
              <div className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Wallet balance</div>
              <div className="text-lg font-black text-zinc-900 dark:text-white mt-0.5">${profile?.walletBalance?.toFixed(2)}</div>
            </div>
            <div className="bg-zinc-50 dark:bg-zinc-950/40 p-3.5 rounded-xl border dark:border-zinc-850">
              <div className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Reward Points</div>
              <div className="text-lg font-black text-amber-500 mt-0.5">{profile?.rewardPoints}</div>
            </div>
            <div className="bg-zinc-50 dark:bg-zinc-950/40 p-3.5 rounded-xl border dark:border-zinc-850">
              <div className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">My Orders</div>
              <div className="text-lg font-black text-zinc-900 dark:text-white mt-0.5">{orders.length}</div>
            </div>
          </div>
        </section>

        {/* Dashboard Panels */}
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar Tabs Controls */}
          <aside className="lg:col-span-1 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 p-4 shadow-sm h-fit">
            <nav className="space-y-1">
              {[
                { id: 'overview', label: 'Dashboard Overview', icon: User },
                { id: 'personal', label: 'Personal Information', icon: Save },
                { id: 'avatar', label: 'Profile Picture', icon: Upload },
                { id: 'addresses', label: 'Manage Addresses', icon: MapPin },
                { id: 'orders', label: 'Order History', icon: ShoppingBag },
                { id: 'payments', label: 'Saved Payments', icon: CreditCard },
                { id: 'wallet', label: 'Wallet & Rewards', icon: Wallet },
                { id: 'coupons', label: 'Coupons Center', icon: Tag },
                { id: 'notifications', label: 'Notifications Inbox', icon: Bell },
                { id: 'referrals', label: 'Referrals Hub', icon: Gift },
                { id: 'security', label: 'Security & 2FA', icon: Shield },
                { id: 'support', label: 'Support helpline', icon: HelpCircle },
                { id: 'privacy', label: 'Privacy & GDPR', icon: FileText },
                { id: 'audit', label: 'Activity Logs', icon: Activity },
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all text-left ${
                      activeTab === tab.id
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-950/40 hover:text-indigo-650'
                    }`}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
              
              <button 
                onClick={logout}
                className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all text-left mt-4 border-t dark:border-zinc-800/80 pt-4"
              >
                <LogOut className="h-4 w-4 shrink-0" />
                <span>Logout Session</span>
              </button>
            </nav>
          </aside>

          {/* Tab Content Panels */}
          <main className="lg:col-span-3 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 p-6 shadow-sm min-h-[480px]">
            
            {/* 1. OVERVIEW */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-zinc-900 dark:text-white">Dashboard Overview</h3>
                  <p className="text-xs text-zinc-500">Shortcut console actions and account activities.</p>
                </div>
                
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="bg-zinc-50 dark:bg-zinc-950/30 p-5 rounded-2xl border dark:border-zinc-850 space-y-3">
                    <Award className="h-8 w-8 text-amber-500" />
                    <h4 className="font-bold text-sm">Convert reward points</h4>
                    <p className="text-xs text-zinc-500">Redeem loyalty point ranks to add cash rewards directly to your shopping wallet balance.</p>
                    <button 
                      onClick={() => setActiveTab('wallet')}
                      className="text-xs font-bold text-indigo-600 hover:underline"
                    >
                      Convert Points Now &rarr;
                    </button>
                  </div>
                  
                  <div className="bg-zinc-50 dark:bg-zinc-950/30 p-5 rounded-2xl border dark:border-zinc-850 space-y-3">
                    <Shield className="h-8 w-8 text-indigo-650" />
                    <h4 className="font-bold text-sm">Two-Factor authentication</h4>
                    <p className="text-xs text-zinc-500">Deconstruct vulnerabilities. Force MFA codes verification on login attempts.</p>
                    <button 
                      onClick={() => setActiveTab('security')}
                      className="text-xs font-bold text-indigo-650 hover:underline"
                    >
                      Manage Security &rarr;
                    </button>
                  </div>
                </div>

                {/* Wishlist summary preview */}
                <div className="border-t pt-6 dark:border-zinc-800">
                  <h4 className="font-bold text-sm mb-4">Saved Wishlist ({wishlist.length} products)</h4>
                  {wishlist.length === 0 ? (
                    <p className="text-xs text-zinc-500">No products saved to wishlist yet.</p>
                  ) : (
                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                      {wishlist.map(id => (
                        <div key={id} className="h-10 px-4 bg-zinc-50 dark:bg-zinc-950/40 border dark:border-zinc-850 rounded-xl flex items-center justify-between gap-3 text-xs shrink-0 font-semibold">
                          <span>Product Code: {id}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 2. PERSONAL INFORMATION */}
            {activeTab === 'personal' && (
              <form onSubmit={handleProfileSave} className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-zinc-900 dark:text-white">Personal Information</h3>
                  <p className="text-xs text-zinc-500">Edit display metadata preferences.</p>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">First Name</label>
                    <input 
                      type="text" 
                      value={profileForm.firstName || ''} 
                      onChange={e => setProfileForm({ ...profileForm, firstName: e.target.value })}
                      className="w-full rounded-xl border border-zinc-200 bg-white p-3 text-xs focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 text-zinc-900 dark:text-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Last Name</label>
                    <input 
                      type="text" 
                      value={profileForm.lastName || ''} 
                      onChange={e => setProfileForm({ ...profileForm, lastName: e.target.value })}
                      className="w-full rounded-xl border border-zinc-200 bg-white p-3 text-xs focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 text-zinc-900 dark:text-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Display Name</label>
                    <input 
                      type="text" 
                      value={profileForm.displayName || ''} 
                      onChange={e => setProfileForm({ ...profileForm, displayName: e.target.value })}
                      className="w-full rounded-xl border border-zinc-200 bg-white p-3 text-xs focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 text-zinc-900 dark:text-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Username</label>
                    <input 
                      type="text" 
                      value={profileForm.username || ''} 
                      onChange={e => setProfileForm({ ...profileForm, username: e.target.value })}
                      className="w-full rounded-xl border border-zinc-200 bg-white p-3 text-xs focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 text-zinc-900 dark:text-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Primary Mobile</label>
                    <input 
                      type="text" 
                      value={profileForm.phone || ''} 
                      disabled
                      className="w-full rounded-xl border border-zinc-200 bg-zinc-50 p-3 text-xs focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 text-zinc-400"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Alternate Mobile</label>
                    <input 
                      type="text" 
                      value={profileForm.alternatePhone || ''} 
                      onChange={e => setProfileForm({ ...profileForm, alternatePhone: e.target.value })}
                      className="w-full rounded-xl border border-zinc-200 bg-white p-3 text-xs focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 text-zinc-900 dark:text-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Date of Birth</label>
                    <input 
                      type="date" 
                      value={profileForm.dob ? profileForm.dob.split('T')[0] : ''} 
                      onChange={e => setProfileForm({ ...profileForm, dob: e.target.value })}
                      className="w-full rounded-xl border border-zinc-200 bg-white p-3 text-xs focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 text-zinc-900 dark:text-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Gender</label>
                    <select 
                      value={profileForm.gender || ''} 
                      onChange={e => setProfileForm({ ...profileForm, gender: e.target.value })}
                      className="w-full rounded-xl border border-zinc-200 bg-white p-3 text-xs focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 text-zinc-900 dark:text-white"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Non-binary">Non-binary</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="border-t pt-6 dark:border-zinc-800 space-y-4">
                  <h4 className="font-bold text-sm">System Preferences</h4>
                  <div className="grid sm:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Language</label>
                      <select 
                        value={profileForm.languagePreference || 'en'} 
                        onChange={e => setProfileForm({ ...profileForm, languagePreference: e.target.value })}
                        className="w-full rounded-xl border border-zinc-200 bg-white p-3 text-xs focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 text-zinc-900 dark:text-white"
                      >
                        <option value="en">English (US)</option>
                        <option value="es">Español</option>
                        <option value="fr">Français</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Currency</label>
                      <select 
                        value={profileForm.currencyPreference || 'USD'} 
                        onChange={e => setProfileForm({ ...profileForm, currencyPreference: e.target.value })}
                        className="w-full rounded-xl border border-zinc-200 bg-white p-3 text-xs focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 text-zinc-900 dark:text-white"
                      >
                        <option value="USD">USD ($)</option>
                        <option value="EUR">EUR (€)</option>
                        <option value="GBP">GBP (£)</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Timezone</label>
                      <select 
                        value={profileForm.timezone || 'UTC'} 
                        onChange={e => setProfileForm({ ...profileForm, timezone: e.target.value })}
                        className="w-full rounded-xl border border-zinc-200 bg-white p-3 text-xs focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 text-zinc-900 dark:text-white"
                      >
                        <option value="UTC">UTC (Greenwich)</option>
                        <option value="EST">EST (New York)</option>
                        <option value="IST">IST (India)</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-6 dark:border-zinc-800 space-y-3">
                  <h4 className="font-bold text-sm">Communication Preferences</h4>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={profileForm.marketingEmails} 
                        onChange={e => setProfileForm({ ...profileForm, marketingEmails: e.target.checked })}
                      />
                      <span>Receive promotional offers & marketing emails</span>
                    </label>
                    <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={profileForm.productRecommendations} 
                        onChange={e => setProfileForm({ ...profileForm, productRecommendations: e.target.checked })}
                      />
                      <span>Enable personalized product recommendations feed</span>
                    </label>
                  </div>
                </div>

                <button 
                  type="submit" 
                  className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-indigo-500 shadow active:scale-95 transition-all"
                >
                  <Save className="h-4 w-4" />
                  <span>Save Profile Updates</span>
                </button>
              </form>
            )}

            {/* 3. PROFILE PICTURE MANAGEMENT */}
            {activeTab === 'avatar' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-zinc-900 dark:text-white">Profile Picture Manager</h3>
                  <p className="text-xs text-zinc-500">Edit, crop, and rotate account banner photos.</p>
                </div>

                <div className="flex flex-col md:flex-row items-center gap-8 bg-zinc-50 dark:bg-zinc-950/40 p-6 rounded-2xl border dark:border-zinc-850">
                  <div className="relative h-44 w-44 rounded-2xl overflow-hidden border bg-zinc-200 dark:border-zinc-800">
                    <img 
                      src={avatarPreview} 
                      alt="Crop View" 
                      className="h-full w-full object-cover transition-transform" 
                      style={{ transform: `rotate(${avatarAngle}deg)` }}
                    />
                  </div>
                  <div className="space-y-4 flex-1 w-full">
                    <div className="space-y-1">
                      <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block">Mock Avatar Link URL</label>
                      <input 
                        type="text" 
                        value={avatarPreview} 
                        onChange={e => setAvatarPreview(e.target.value)}
                        className="w-full rounded-xl border border-zinc-200 bg-white p-3 text-xs focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 text-zinc-900 dark:text-white"
                      />
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button 
                        onClick={() => setAvatarAngle(prev => (prev + 90) % 360)}
                        className="flex items-center gap-1 border border-zinc-200 dark:border-zinc-800 text-zinc-650 dark:text-zinc-300 hover:bg-zinc-150/40 rounded-xl px-3.5 py-2 text-xs font-semibold cursor-pointer"
                      >
                        <RotateCw className="h-4 w-4" />
                        <span>Rotate 90°</span>
                      </button>
                      <button 
                        onClick={async () => {
                          const token = localStorage.getItem('apex_token');
                          try {
                            await fetch('http://localhost:5001/api/v1/profile/avatar', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                              body: JSON.stringify({ avatarUrl: avatarPreview })
                            });
                          } catch {}
                          showToast('Profile photo updated successfully!');
                        }}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl px-4 py-2 text-xs font-semibold shadow cursor-pointer"
                      >
                        Crop & Save Photo
                      </button>
                      <button 
                        onClick={() => {
                          setAvatarPreview('https://picsum.photos/seed/useravatar/200/200');
                          setAvatarAngle(0);
                        }}
                        className="text-red-500 text-xs font-semibold hover:underline"
                      >
                        Reset Default
                      </button>
                    </div>
                    <p className="text-[10px] text-zinc-400">Supported formats: JPG, PNG, WEBP. Max file size: 2MB.</p>
                  </div>
                </div>
              </div>
            )}

            {/* 4. ADDRESS BOOK */}
            {activeTab === 'addresses' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b pb-4 dark:border-zinc-800">
                  <div>
                    <h3 className="text-xl font-bold text-zinc-900 dark:text-white">Shipping Address Book</h3>
                    <p className="text-xs text-zinc-500">Configure multiple delivery locations.</p>
                  </div>
                  <button 
                    onClick={() => {
                      setEditingAddressId(null);
                      setAddressForm({ fullName: '', mobileNumber: '', alternateMobile: '', country: 'US', state: '', city: '', street: '', landmark: '', pincode: '', addressType: 'Home', isDefault: false });
                      setShowAddressModal(true);
                    }}
                    className="flex items-center gap-1 bg-indigo-650 hover:bg-indigo-600 text-white rounded-xl px-3 py-2 text-xs font-semibold shadow transition-all cursor-pointer"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Add Address</span>
                  </button>
                </div>

                {/* Addresses Grid */}
                <div className="grid md:grid-cols-2 gap-4">
                  {addresses.map((addr) => (
                    <div 
                      key={addr._id} 
                      className={`border rounded-2xl p-4 flex flex-col justify-between bg-zinc-50/20 dark:bg-zinc-900/30 ${
                        addr.isDefault ? 'border-indigo-500 dark:border-indigo-600' : 'border-zinc-200 dark:border-zinc-800'
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="inline-block bg-zinc-100 dark:bg-zinc-800 text-[10px] font-bold px-2 py-0.5 rounded text-zinc-600 dark:text-zinc-350">
                            {addr.addressType}
                          </span>
                          {addr.isDefault && (
                            <span className="text-[9px] bg-indigo-50 text-indigo-700 font-bold px-2 py-0.5 rounded border border-indigo-100">
                              Default Address
                            </span>
                          )}
                        </div>
                        <h4 className="font-bold text-xs text-zinc-900 dark:text-white">{addr.fullName}</h4>
                        <p className="text-xs text-zinc-500 leading-relaxed">
                          {addr.street}, {addr.landmark ? `${addr.landmark}, ` : ''}{addr.city}, {addr.state} - {addr.pincode}
                        </p>
                        <p className="text-xs text-zinc-400">Phone: {addr.mobileNumber}</p>
                      </div>
                      
                      <div className="flex gap-4 border-t pt-3 mt-4 border-zinc-100 dark:border-zinc-800">
                        <button 
                          onClick={() => {
                            setEditingAddressId(addr._id);
                            setAddressForm({ ...addr });
                            setShowAddressModal(true);
                          }}
                          className="flex items-center gap-1 text-[11px] font-semibold text-zinc-500 hover:text-indigo-600"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                          <span>Edit</span>
                        </button>
                        <button 
                          onClick={() => handleAddressDelete(addr._id)}
                          className="flex items-center gap-1 text-[11px] font-semibold text-red-500 hover:text-red-650"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add/Edit Modal */}
                {showAddressModal && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div className="absolute inset-0 bg-zinc-900/50 backdrop-blur-sm" onClick={() => setShowAddressModal(false)} />
                    <form onSubmit={handleAddressSubmit} className="relative bg-white dark:bg-zinc-900 border dark:border-zinc-800 p-6 rounded-2xl w-full max-w-lg space-y-4 shadow-2xl mx-4">
                      <h4 className="font-bold text-base text-zinc-900 dark:text-white border-b pb-2">
                        {editingAddressId ? 'Edit Saved Address' : 'Configure Shipping Location'}
                      </h4>
                      
                      <div className="grid sm:grid-cols-2 gap-3">
                        <input 
                          type="text" required placeholder="Receiver Full Name" 
                          value={addressForm.fullName} onChange={e => setAddressForm({ ...addressForm, fullName: e.target.value })}
                          className="w-full rounded-xl border border-zinc-200 bg-white p-2.5 text-xs focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 text-zinc-900 dark:text-white"
                        />
                        <input 
                          type="text" required placeholder="Mobile Number" 
                          value={addressForm.mobileNumber} onChange={e => setAddressForm({ ...addressForm, mobileNumber: e.target.value })}
                          className="w-full rounded-xl border border-zinc-200 bg-white p-2.5 text-xs focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 text-zinc-900 dark:text-white"
                        />
                        <input 
                          type="text" placeholder="Landmark (Optional)" 
                          value={addressForm.landmark} onChange={e => setAddressForm({ ...addressForm, landmark: e.target.value })}
                          className="w-full rounded-xl border border-zinc-200 bg-white p-2.5 text-xs focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 text-zinc-900 dark:text-white sm:col-span-2"
                        />
                        <input 
                          type="text" required placeholder="Street / Block Address" 
                          value={addressForm.street} onChange={e => setAddressForm({ ...addressForm, street: e.target.value })}
                          className="w-full rounded-xl border border-zinc-200 bg-white p-2.5 text-xs focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 text-zinc-900 dark:text-white sm:col-span-2"
                        />
                        <input 
                          type="text" required placeholder="ZIP / Pincode" 
                          value={addressForm.pincode} onChange={e => setAddressForm({ ...addressForm, pincode: e.target.value })}
                          className="w-full rounded-xl border border-zinc-200 bg-white p-2.5 text-xs focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 text-zinc-900 dark:text-white"
                        />
                        <input 
                          type="text" required placeholder="City" 
                          value={addressForm.city} onChange={e => setAddressForm({ ...addressForm, city: e.target.value })}
                          className="w-full rounded-xl border border-zinc-200 bg-white p-2.5 text-xs focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 text-zinc-900 dark:text-white"
                        />
                        <input 
                          type="text" required placeholder="State" 
                          value={addressForm.state} onChange={e => setAddressForm({ ...addressForm, state: e.target.value })}
                          className="w-full rounded-xl border border-zinc-200 bg-white p-2.5 text-xs focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 text-zinc-900 dark:text-white"
                        />
                        <input 
                          type="text" required placeholder="Country" 
                          value={addressForm.country} onChange={e => setAddressForm({ ...addressForm, country: e.target.value })}
                          className="w-full rounded-xl border border-zinc-200 bg-white p-2.5 text-xs focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 text-zinc-900 dark:text-white"
                        />
                        <select 
                          value={addressForm.addressType} onChange={e => setAddressForm({ ...addressForm, addressType: e.target.value })}
                          className="w-full rounded-xl border border-zinc-200 bg-white p-2.5 text-xs focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 text-zinc-900 dark:text-white"
                        >
                          <option value="Home">Home</option>
                          <option value="Office">Office</option>
                          <option value="Billing">Billing</option>
                          <option value="Shipping">Shipping</option>
                        </select>
                        <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={addressForm.isDefault} onChange={e => setAddressForm({ ...addressForm, isDefault: e.target.checked })}
                          />
                          <span>Set default location</span>
                        </label>
                      </div>

                      <div className="flex gap-2 justify-end border-t pt-4">
                        <button 
                          type="submit" 
                          className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl px-4 py-2 text-xs font-semibold shadow cursor-pointer"
                        >
                          Save Address
                        </button>
                        <button 
                          type="button" 
                          onClick={() => setShowAddressModal(false)}
                          className="border dark:border-zinc-800 rounded-xl px-4 py-2 text-xs font-semibold cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            )}

            {/* 5. ORDER HISTORY */}
            {activeTab === 'orders' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-zinc-900 dark:text-white">Your Orders</h3>
                  <p className="text-xs text-zinc-500">Track shipments, downloads, and return statuses.</p>
                </div>

                <div className="space-y-4">
                  {orders.map((ord) => (
                    <div key={ord.id} className="border dark:border-zinc-800 rounded-2xl p-5 bg-zinc-50/20 dark:bg-zinc-900/30 space-y-4">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b pb-3 dark:border-zinc-800 gap-2">
                        <div>
                          <span className="text-xs text-zinc-400">Order ID</span>
                          <h4 className="font-bold text-xs text-indigo-600 dark:text-indigo-400">{ord.id}</h4>
                        </div>
                        <div className="text-left sm:text-right">
                          <span className="text-xs text-zinc-400">Ordered On</span>
                          <p className="text-xs font-semibold text-zinc-850 dark:text-zinc-300">{ord.createdAt}</p>
                        </div>
                        <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold border ${
                          ord.status === 'Delivered' ? 'bg-emerald-50 border-emerald-250 text-emerald-800' : 'bg-amber-50 border-amber-250 text-amber-800'
                        }`}>
                          {ord.status}
                        </span>
                      </div>

                      {/* Items */}
                      <div className="space-y-3">
                        {ord.items.map((item: any) => (
                          <div key={item.id} className="flex gap-4 items-center">
                            <img src={item.image} alt={item.title} className="h-12 w-12 object-cover rounded-lg border dark:border-zinc-800" />
                            <div className="flex-1 min-w-0">
                              <h5 className="font-bold text-xs truncate text-zinc-800 dark:text-zinc-100">{item.title}</h5>
                              <p className="text-xs text-zinc-450">${item.price} &times; {item.quantity}</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Total and Actions */}
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-t pt-3 dark:border-zinc-800 gap-4">
                        <p className="text-xs font-semibold">Total Paid: <strong className="text-sm font-black text-zinc-950 dark:text-white">${ord.items.reduce((s: number, i: any) => s + i.price * i.quantity, 0).toFixed(2)}</strong></p>
                        
                        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                          <button 
                            onClick={() => downloadMockInvoice(ord.id, ord.items.reduce((s: number, i: any) => s + i.price * i.quantity, 0))}
                            className="flex items-center gap-1 bg-white border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:bg-zinc-950 dark:text-zinc-300 hover:bg-zinc-100 rounded-xl px-3 py-2 text-[10px] font-bold cursor-pointer"
                          >
                            <Download className="h-3.5 w-3.5" />
                            <span>Download Invoice</span>
                          </button>
                          
                          
                          <button 
                            onClick={() => {
                              setTrackingOrder(ord);
                            }}
                            className="flex items-center gap-1 bg-indigo-600 text-white rounded-xl px-3.5 py-2 text-[10px] font-bold hover:bg-indigo-550 cursor-pointer transition-all"
                          >
                            <Eye className="h-3.5 w-3.5" />
                            <span>Track Order</span>
                          </button>

                          {ord.status === 'Delivered' ? (
                            <button 
                              onClick={() => {
                                showToast('Return request submitted successfully. Support team will contact you shortly.', 'info');
                              }}
                              className="border border-red-200 text-red-500 rounded-xl px-3.5 py-2 text-[10px] font-bold hover:bg-red-50 dark:hover:bg-red-950/20 cursor-pointer"
                            >
                              Return / Exchange
                            </button>
                          ) : (
                            <button 
                              onClick={() => {
                                showToast('Order cancellation initiated successfully.', 'info');
                              }}
                              className="border border-red-250 text-red-500 rounded-xl px-3.5 py-2 text-[10px] font-bold hover:bg-red-50 dark:hover:bg-red-950/20 cursor-pointer"
                            >
                              Cancel Order
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {trackingOrder && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div className="absolute inset-0 bg-zinc-900/50 backdrop-blur-sm" onClick={() => setTrackingOrder(null)} />
                    <div className="relative bg-white dark:bg-zinc-900 border dark:border-zinc-800 p-6 rounded-2xl w-full max-w-lg space-y-6 shadow-2xl mx-4">
                      <div className="flex justify-between items-center border-b pb-3 dark:border-zinc-800">
                        <div>
                          <h4 className="font-bold text-base text-zinc-900 dark:text-white">Order Shipment Tracking</h4>
                          <p className="text-xs text-zinc-500">Carrier: FedEx Express &bull; ID: {trackingOrder.id}</p>
                        </div>
                        <button onClick={() => setTrackingOrder(null)} className="p-1 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400">
                          <X className="h-5 w-5" />
                        </button>
                      </div>
                      
                      {/* Visual Stepper */}
                      <div className="space-y-6 py-2">
                        {[
                          { label: 'Order Placed', desc: 'We received your order and payment authorization.', date: trackingOrder.createdAt, completed: true },
                          { label: 'Processing', desc: 'Preparing package and generating package labels.', date: trackingOrder.createdAt, completed: true },
                          { label: 'Shipped', desc: 'Handed over to FedEx carrier branch.', date: trackingOrder.createdAt, completed: trackingOrder.status === 'Delivered' || trackingOrder.status === 'Shipped' },
                          { label: 'Out for Delivery', desc: 'FedEx delivery driver is en route to address.', date: trackingOrder.status === 'Delivered' ? trackingOrder.createdAt : 'Pending', completed: trackingOrder.status === 'Delivered' },
                          { label: 'Delivered', desc: 'Package dropped off at destination address front door.', date: trackingOrder.status === 'Delivered' ? trackingOrder.createdAt : 'Pending', completed: trackingOrder.status === 'Delivered' }
                        ].map((step, idx) => (
                          <div key={idx} className="flex gap-4 relative">
                            {idx < 4 && (
                              <div className={`absolute left-3 top-6 w-[2px] h-10 ${step.completed ? 'bg-indigo-650' : 'bg-zinc-200 dark:bg-zinc-850'}`} />
                            )}
                            <div className={`h-6 w-6 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                              step.completed ? 'bg-indigo-600 text-white' : 'bg-zinc-100 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-500'
                            }`}>
                              {idx + 1}
                            </div>
                            <div>
                              <h5 className="font-bold text-xs text-zinc-900 dark:text-white">{step.label}</h5>
                              <p className="text-[11px] text-zinc-500 mt-0.5">{step.desc}</p>
                              <span className="text-[9px] text-zinc-400 block mt-1">{step.date}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="flex justify-end pt-2 border-t dark:border-zinc-800">
                        <button onClick={() => setTrackingOrder(null)} className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl px-4 py-2 text-xs font-semibold">
                          Close tracking
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 6. SAVED PAYMENT METHODS */}
            {activeTab === 'payments' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b pb-4 dark:border-zinc-800">
                  <div>
                    <h3 className="text-xl font-bold text-zinc-900 dark:text-white">Saved Payment Methods</h3>
                    <p className="text-xs text-zinc-500">Manage tokenized cards and payment wallets.</p>
                  </div>
                  <button 
                    onClick={() => setShowPaymentModal(true)}
                    className="flex items-center gap-1 bg-indigo-650 hover:bg-indigo-600 text-white rounded-xl px-3 py-2 text-xs font-semibold shadow transition-all cursor-pointer"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Add Card</span>
                  </button>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  {payments.map((p) => (
                    <div key={p._id} className="border dark:border-zinc-800 rounded-2xl p-5 bg-zinc-50/20 dark:bg-zinc-900/30 flex justify-between items-center relative overflow-hidden">
                      <div className="space-y-2">
                        <span className="inline-block bg-indigo-100 text-indigo-700 text-[9px] font-bold px-2 py-0.5 rounded">
                          {p.cardDetails?.brand || p.type.toUpperCase()}
                        </span>
                        <h4 className="font-extrabold text-sm text-zinc-900 dark:text-white">
                          •••• •••• •••• {p.cardDetails?.last4 || '4242'}
                        </h4>
                        <p className="text-[10px] text-zinc-400">Expires: {p.cardDetails?.expiryMonth}/{p.cardDetails?.expiryYear}</p>
                      </div>
                      <button 
                        onClick={() => handlePaymentDelete(p._id)}
                        className="text-red-500 hover:text-red-650 p-2 border dark:border-zinc-850 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
                        aria-label="Delete card"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Add Payment Modal */}
                {showPaymentModal && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div className="absolute inset-0 bg-zinc-900/50 backdrop-blur-sm" onClick={() => setShowPaymentModal(false)} />
                    <form onSubmit={handlePaymentSubmit} className="relative bg-white dark:bg-zinc-900 border dark:border-zinc-800 p-6 rounded-2xl w-full max-w-md space-y-4 shadow-2xl mx-4">
                      <h4 className="font-bold text-base text-zinc-900 dark:text-white border-b pb-2">Add Payment Method</h4>
                      
                      <div className="space-y-3">
                        <select 
                          value={paymentForm.cardDetails.brand} 
                          onChange={e => setPaymentForm({ ...paymentForm, cardDetails: { ...paymentForm.cardDetails, brand: e.target.value } })}
                          className="w-full rounded-xl border border-zinc-200 bg-white p-2.5 text-xs focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 text-zinc-900 dark:text-white"
                        >
                          <option value="Visa">Visa</option>
                          <option value="MasterCard">MasterCard</option>
                          <option value="Amex">American Express</option>
                        </select>

                        <input 
                          type="text" required placeholder="Cardholder Name"
                          className="w-full rounded-xl border border-zinc-200 bg-white p-2.5 text-xs focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 text-zinc-900 dark:text-white"
                        />
                        
                        <input 
                          type="text" required maxLength={16} placeholder="16-Digit Card Number"
                          value={paymentForm.cardDetails.last4} onChange={e => setPaymentForm({ ...paymentForm, cardDetails: { ...paymentForm.cardDetails, last4: e.target.value.slice(-4) } })}
                          className="w-full rounded-xl border border-zinc-200 bg-white p-2.5 text-xs focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 text-zinc-900 dark:text-white"
                        />

                        <div className="grid grid-cols-3 gap-2">
                          <input 
                            type="number" required placeholder="MM" min={1} max={12}
                            onChange={e => setPaymentForm({ ...paymentForm, cardDetails: { ...paymentForm.cardDetails, expiryMonth: parseInt(e.target.value) } })}
                            className="w-full rounded-xl border border-zinc-200 bg-white p-2.5 text-xs focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 text-zinc-900 dark:text-white"
                          />
                          <input 
                            type="number" required placeholder="YYYY" min={2026}
                            onChange={e => setPaymentForm({ ...paymentForm, cardDetails: { ...paymentForm.cardDetails, expiryYear: parseInt(e.target.value) } })}
                            className="w-full rounded-xl border border-zinc-200 bg-white p-2.5 text-xs focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 text-zinc-900 dark:text-white"
                          />
                          <input 
                            type="password" required maxLength={3} placeholder="CVV"
                            className="w-full rounded-xl border border-zinc-200 bg-white p-2.5 text-xs focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 text-zinc-900 dark:text-white"
                          />
                        </div>
                      </div>

                      <div className="flex gap-2 justify-end border-t pt-4">
                        <button 
                          type="submit" 
                          className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl px-4 py-2 text-xs font-semibold shadow cursor-pointer"
                        >
                          Save Card securely
                        </button>
                        <button 
                          type="button" 
                          onClick={() => setShowPaymentModal(false)}
                          className="border dark:border-zinc-800 rounded-xl px-4 py-2 text-xs font-semibold cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            )}

            {/* 7. WALLET & REWARDS */}
            {activeTab === 'wallet' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-zinc-900 dark:text-white">Wallet & Rewards Console</h3>
                  <p className="text-xs text-zinc-500">Monitor transaction credits and points redemption schedules.</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6 border-b pb-6 dark:border-zinc-800">
                  {/* Fund upload */}
                  <form onSubmit={handleAddWalletBalance} className="bg-zinc-50 dark:bg-zinc-950/40 p-5 rounded-2xl border dark:border-zinc-850 space-y-3">
                    <h4 className="font-bold text-sm text-zinc-900 dark:text-white flex items-center gap-1.5">
                      <Wallet className="h-4 w-4 text-indigo-650" />
                      <span>Add Funds to Balance</span>
                    </h4>
                    <input 
                      type="number" required placeholder="Enter Dollar amount (e.g. 50)" step="1" min="1"
                      value={walletAmount} onChange={e => setWalletAmount(e.target.value)}
                      className="w-full rounded-xl border border-zinc-200 bg-white p-2.5 text-xs focus:outline-none dark:border-zinc-800 dark:bg-zinc-900 text-zinc-900 dark:text-white"
                    />
                    <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl py-2 cursor-pointer shadow">
                      Simulate Deposit transfer
                    </button>
                  </form>

                  {/* Points converter */}
                  <form onSubmit={handleConvertPoints} className="bg-zinc-50 dark:bg-zinc-950/40 p-5 rounded-2xl border dark:border-zinc-850 space-y-3">
                    <h4 className="font-bold text-sm text-zinc-900 dark:text-white flex items-center gap-1.5">
                      <Award className="h-4 w-4 text-amber-500" />
                      <span>Convert reward points (Rate: 100pts = $1)</span>
                    </h4>
                    <input 
                      type="number" required placeholder={`Max ${profile?.rewardPoints} points`} min="100" step="100"
                      value={pointsConvert} onChange={e => setPointsConvert(e.target.value)}
                      className="w-full rounded-xl border border-zinc-200 bg-white p-2.5 text-xs focus:outline-none dark:border-zinc-800 dark:bg-zinc-900 text-zinc-900 dark:text-white"
                    />
                    <button type="submit" className="w-full bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-xl py-2 cursor-pointer shadow">
                      Convert Points to Credit
                    </button>
                  </form>
                </div>

                {/* Ledger Transactions list */}
                <div className="space-y-4">
                  <h4 className="font-bold text-sm">Statement Ledger Transactions</h4>
                  <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                    {walletTx.map((tx) => (
                      <div key={tx._id} className="flex justify-between items-center p-3 rounded-xl border border-zinc-100 dark:border-zinc-850 bg-zinc-50/20 dark:bg-zinc-950/20 text-xs">
                        <div>
                          <p className="font-bold text-zinc-800 dark:text-zinc-205">{tx.description}</p>
                          <span className="text-[10px] text-zinc-400">{new Date(tx.createdAt).toLocaleDateString()}</span>
                        </div>
                        <span className={`font-black ${
                          tx.transactionType === 'Debit' ? 'text-red-500' : 'text-emerald-500'
                        }`}>
                          {tx.transactionType === 'Debit' ? '-' : '+'}${tx.amount.toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 8. SECURITY & 2FA */}
            {activeTab === 'security' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-zinc-900 dark:text-white">Security & sessions</h3>
                  <p className="text-xs text-zinc-500">Configure TFA security and check device session logs.</p>
                </div>

                {/* Password changes form */}
                <form onSubmit={handlePasswordChange} className="bg-zinc-50 dark:bg-zinc-950/40 p-5 rounded-2xl border dark:border-zinc-850 space-y-4">
                  <h4 className="font-bold text-sm text-zinc-900 dark:text-white">Modify account password</h4>
                  <div className="grid sm:grid-cols-3 gap-3">
                    <input 
                      type="password" required placeholder="Current Password"
                      value={passwordForm.currentPassword} onChange={e => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                      className="w-full rounded-xl border border-zinc-200 bg-white p-2.5 text-xs focus:outline-none dark:border-zinc-850 dark:bg-zinc-950 text-zinc-900 dark:text-white"
                    />
                    <input 
                      type="password" required placeholder="New Password"
                      value={passwordForm.newPassword} onChange={e => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                      className="w-full rounded-xl border border-zinc-200 bg-white p-2.5 text-xs focus:outline-none dark:border-zinc-850 dark:bg-zinc-950 text-zinc-900 dark:text-white"
                    />
                    <input 
                      type="password" required placeholder="Confirm New Password"
                      value={passwordForm.confirmPassword} onChange={e => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                      className="w-full rounded-xl border border-zinc-200 bg-white p-2.5 text-xs focus:outline-none dark:border-zinc-850 dark:bg-zinc-950 text-zinc-900 dark:text-white"
                    />
                  </div>
                  <button type="submit" className="bg-indigo-650 hover:bg-indigo-600 text-white rounded-xl px-4 py-2 text-xs font-semibold cursor-pointer shadow">
                    Update credential password
                  </button>
                </form>

                {/* 2FA Toggle */}
                <div className="flex justify-between items-center bg-zinc-50 dark:bg-zinc-950/40 p-5 rounded-2xl border dark:border-zinc-850">
                  <div>
                    <h4 className="font-bold text-sm">Two-Factor Authentication (MFA)</h4>
                    <p className="text-xs text-zinc-500 mt-0.5">Secure logins by prompting verification codes via authenticator applications.</p>
                  </div>
                  <button 
                    onClick={handleTfaToggle}
                    className={`rounded-xl px-4 py-2 text-xs font-extrabold shadow cursor-pointer transition-all ${
                      profile?.mfaEnabled 
                        ? 'bg-red-500 text-white hover:bg-red-650' 
                        : 'bg-emerald-650 hover:bg-emerald-600 text-white'
                    }`}
                  >
                    {profile?.mfaEnabled ? 'Disable 2FA' : 'Enable 2FA'}
                  </button>
                </div>
              </div>
            )}

            {/* 9. SUPPORT TICKETS */}
            {activeTab === 'support' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b pb-4 dark:border-zinc-800">
                  <div>
                    <h3 className="text-xl font-bold text-zinc-900 dark:text-white">Customer support helpline</h3>
                    <p className="text-xs text-zinc-500">Raise query tickets to contact representatives.</p>
                  </div>
                  <button 
                    onClick={() => setShowTicketModal(true)}
                    className="flex items-center gap-1 bg-indigo-650 hover:bg-indigo-600 text-white rounded-xl px-3 py-2 text-xs font-semibold shadow transition-all cursor-pointer"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Raise Query Ticket</span>
                  </button>
                </div>

                {/* Tickets list */}
                <div className="space-y-4">
                  {tickets.map((t) => (
                    <div key={t._id} className="border dark:border-zinc-800 rounded-2xl p-4 bg-zinc-50/20 dark:bg-zinc-900/30 text-xs space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-zinc-900 dark:text-white text-sm">{t.subject}</span>
                        <span className={`rounded px-2 py-0.5 font-bold ${
                          t.status === 'Open' ? 'bg-amber-50 text-amber-705 border border-amber-200' : 'bg-zinc-100 text-zinc-600 border dark:bg-zinc-800'
                        }`}>
                          {t.status}
                        </span>
                      </div>
                      <p className="text-zinc-500 leading-relaxed">{t.messages?.[0]?.message}</p>
                      <p className="text-[10px] text-zinc-400">Created: {new Date(t.createdAt).toLocaleString()}</p>
                    </div>
                  ))}
                </div>

                {/* Ticket modal */}
                {showTicketModal && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div className="absolute inset-0 bg-zinc-900/50 backdrop-blur-sm" onClick={() => setShowTicketModal(false)} />
                    <form onSubmit={handleTicketSubmit} className="relative bg-white dark:bg-zinc-900 border dark:border-zinc-800 p-6 rounded-2xl w-full max-w-md space-y-4 shadow-2xl mx-4">
                      <h4 className="font-bold text-base text-zinc-900 dark:text-white border-b pb-2">Raise Support Ticket</h4>
                      
                      <div className="space-y-3">
                        <input 
                          type="text" required placeholder="Subject / Title of query"
                          value={ticketForm.subject} onChange={e => setTicketForm({ ...ticketForm, subject: e.target.value })}
                          className="w-full rounded-xl border border-zinc-200 bg-white p-2.5 text-xs focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 text-zinc-900 dark:text-white"
                        />
                        <select 
                          value={ticketForm.priority} onChange={e => setTicketForm({ ...ticketForm, priority: e.target.value })}
                          className="w-full rounded-xl border border-zinc-200 bg-white p-2.5 text-xs focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 text-zinc-900 dark:text-white"
                        >
                          <option value="Low">Low priority</option>
                          <option value="Medium">Medium priority</option>
                          <option value="High">High priority</option>
                        </select>
                        <textarea 
                          required placeholder="Detailed explanation message..." rows={4}
                          value={ticketForm.message} onChange={e => setTicketForm({ ...ticketForm, message: e.target.value })}
                          className="w-full rounded-xl border border-zinc-200 bg-white p-2.5 text-xs focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 text-zinc-900 dark:text-white"
                        />
                      </div>

                      <div className="flex gap-2 justify-end border-t pt-4">
                        <button type="submit" className="bg-indigo-605 hover:bg-indigo-600 text-white rounded-xl px-4 py-2 text-xs font-semibold shadow cursor-pointer">
                          Submit ticket
                        </button>
                        <button type="button" onClick={() => setShowTicketModal(false)} className="border dark:border-zinc-800 rounded-xl px-4 py-2 text-xs font-semibold cursor-pointer">
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            )}

            {/* 10. PRIVACY & GDPR */}
            {activeTab === 'privacy' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-zinc-900 dark:text-white">GDPR & Privacy Controls</h3>
                  <p className="text-xs text-zinc-500">Exercise compliance controls and data erasures.</p>
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="bg-zinc-50 dark:bg-zinc-950/40 p-5 rounded-2xl border dark:border-zinc-850 space-y-3">
                    <Download className="h-8 w-8 text-indigo-500" />
                    <h4 className="font-bold text-sm">Download personal info snap</h4>
                    <p className="text-xs text-zinc-500">GDPR portability compliance. Requests full snaps of saved addresses, orders, and tickets as JSON.</p>
                    <button 
                      onClick={handleGdprExport}
                      className="flex items-center gap-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl px-4 py-2 text-xs font-semibold cursor-pointer"
                    >
                      <span>Request data file download</span>
                    </button>
                  </div>

                  <div className="bg-zinc-50 dark:bg-zinc-950/40 p-5 rounded-2xl border dark:border-zinc-850 space-y-3">
                    <AlertTriangle className="h-8 w-8 text-red-500" />
                    <h4 className="font-bold text-sm text-red-505">Right to Erasure (Soft-delete)</h4>
                    <p className="text-xs text-zinc-500">Submit requests for full identity erasures from our services. Safe lockouts applied on confirmation.</p>
                    <button 
                      onClick={handleGdprDelete}
                      className="flex items-center gap-1 bg-red-600 hover:bg-red-500 text-white rounded-xl px-4 py-2 text-xs font-semibold cursor-pointer"
                    >
                      <span>Delete my account</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* 11. SECURITY AUDIT LOGS */}
            {activeTab === 'audit' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-zinc-900 dark:text-white">Account security logs</h3>
                  <p className="text-xs text-zinc-500">Security history audits and active device tokens logs.</p>
                </div>

                <div className="space-y-3 overflow-y-auto max-h-[360px] pr-1">
                  {logs.map((log) => (
                    <div key={log._id} className="flex justify-between items-center p-3 rounded-xl border border-zinc-100 dark:border-zinc-850 bg-zinc-50/20 dark:bg-zinc-950/20 text-xs">
                      <div>
                        <span className="inline-block bg-zinc-100 dark:bg-zinc-800 text-[9px] font-bold px-2 py-0.5 rounded text-zinc-500 mr-2">
                          {log.type}
                        </span>
                        <span className="font-bold text-zinc-800 dark:text-zinc-200">{log.action}</span>
                        <p className="text-[10px] text-zinc-400 mt-1">{log.details}</p>
                      </div>
                      <span className="text-[10px] text-zinc-400 text-right">{new Date(log.createdAt).toLocaleDateString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 12. COUPONS CENTER */}
            {activeTab === 'coupons' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-zinc-900 dark:text-white">Coupons Center</h3>
                  <p className="text-xs text-zinc-500">View active promotional discounts and check coupon validity.</p>
                </div>
                
                <form onSubmit={(e) => {
                  e.preventDefault();
                  const code = couponInput.trim().toUpperCase();
                  if (!code) return;
                  const match = coupons.find(c => c.code === code);
                  if (match) {
                    showToast(`Coupon ${code} is active! (${match.discount} - ${match.description})`, 'success');
                  } else {
                    showToast(`Coupon ${code} not found or expired.`, 'error');
                  }
                  setCouponInput('');
                }} className="bg-zinc-50 dark:bg-zinc-950/40 p-5 rounded-2xl border dark:border-zinc-850 space-y-3">
                  <h4 className="font-bold text-sm">Verify Promo Code</h4>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="Enter Coupon Code (e.g. SAVE20)" 
                      value={couponInput}
                      onChange={e => setCouponInput(e.target.value)}
                      className="flex-1 rounded-xl border border-zinc-200 bg-white p-2.5 text-xs focus:outline-none dark:border-zinc-800 dark:bg-zinc-900 text-zinc-900 dark:text-white uppercase"
                    />
                    <button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl px-4 py-2 cursor-pointer shadow">
                      Check Coupon
                    </button>
                  </div>
                </form>

                <div className="grid md:grid-cols-2 gap-4">
                  {coupons.map((coupon) => (
                    <div key={coupon.code} className="border dark:border-zinc-800 rounded-2xl p-5 bg-zinc-50/20 dark:bg-zinc-900/30 flex justify-between items-center relative overflow-hidden">
                      <div className="space-y-2">
                        <span className="inline-block bg-indigo-100 text-indigo-700 text-[10px] font-bold px-2 py-0.5 rounded">
                          {coupon.discount}
                        </span>
                        <h4 className="font-extrabold text-sm text-zinc-900 dark:text-white">{coupon.code}</h4>
                        <p className="text-xs text-zinc-500">{coupon.description}</p>
                        <p className="text-[10px] text-zinc-400">Valid until: {coupon.validUntil}</p>
                      </div>
                      <button 
                        onClick={() => {
                          if (coupon.claimed) {
                            showToast('This coupon is already claimed!', 'info');
                          } else {
                            setCoupons(coupons.map(c => c.code === coupon.code ? { ...c, claimed: true } : c));
                            showToast(`Coupon ${coupon.code} claimed successfully!`, 'success');
                          }
                        }}
                        className={`text-xs font-bold rounded-xl px-3 py-1.5 border transition-all ${
                          coupon.claimed 
                            ? 'bg-zinc-100 border-zinc-200 text-zinc-400 cursor-not-allowed dark:bg-zinc-800 dark:border-zinc-700' 
                            : 'bg-white border-zinc-250 text-zinc-700 hover:bg-zinc-50 dark:bg-zinc-950 dark:border-zinc-800 dark:text-zinc-300'
                        }`}
                      >
                        {coupon.claimed ? 'Claimed' : 'Claim'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 13. NOTIFICATIONS INBOX */}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center border-b pb-4 dark:border-zinc-800">
                  <div>
                    <h3 className="text-xl font-bold text-zinc-900 dark:text-white">Notifications Inbox</h3>
                    <p className="text-xs text-zinc-500">Latest alerts, updates, and news from ApexStore.</p>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={async () => {
                        const token = localStorage.getItem('apex_token');
                        try {
                          await fetch('http://localhost:5001/api/v1/notifications/read-all', {
                            method: 'PUT',
                            headers: { Authorization: `Bearer ${token}` }
                          });
                        } catch {}
                        setNotifications(notifications.map(n => ({ ...n, isRead: true })));
                        showToast('All notifications marked as read.', 'success');
                      }}
                      className="border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 px-3 py-1.5 rounded-xl text-xs font-semibold"
                    >
                      Mark all read
                    </button>
                    <button 
                      onClick={async () => {
                        const token = localStorage.getItem('apex_token');
                        try {
                          await fetch('http://localhost:5001/api/v1/notifications/clear-all', {
                            method: 'DELETE',
                            headers: { Authorization: `Bearer ${token}` }
                          });
                        } catch {}
                        setNotifications([]);
                        showToast('Notifications inbox cleared.', 'success');
                      }}
                      className="border border-red-200 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 px-3 py-1.5 rounded-xl text-xs font-semibold"
                    >
                      Clear all
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  {notifications.length === 0 ? (
                    <p className="text-xs text-zinc-400 text-center py-8">Your inbox is empty.</p>
                  ) : (
                    notifications.map((notif) => (
                      <div 
                        key={notif._id} 
                        onClick={async () => {
                          const token = localStorage.getItem('apex_token');
                          try {
                            await fetch(`http://localhost:5001/api/v1/notifications/${notif._id}/read`, {
                              method: 'PUT',
                              headers: { Authorization: `Bearer ${token}` }
                            });
                          } catch {}
                          setNotifications(notifications.map(n => n._id === notif._id ? { ...n, isRead: true } : n));
                        }}
                        className={`p-4 rounded-xl border flex gap-3 cursor-pointer transition-all ${
                          notif.isRead 
                            ? 'border-zinc-100 bg-zinc-50/50 dark:border-zinc-800/85 dark:bg-zinc-900/40 opacity-70' 
                            : 'border-indigo-200 bg-indigo-50/20 dark:border-indigo-900/30'
                        }`}
                      >
                        <div className={`h-2.5 w-2.5 rounded-full mt-1.5 shrink-0 ${notif.isRead ? 'bg-zinc-300' : 'bg-indigo-600'}`} />
                        <div className="flex-1">
                          <h4 className="font-bold text-xs text-zinc-900 dark:text-white">{notif.title}</h4>
                          <p className="text-[11px] text-zinc-650 dark:text-zinc-400 mt-0.5">{notif.message}</p>
                          <span className="text-[9px] text-zinc-400 block mt-1">{new Date(notif.createdAt).toLocaleString()}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* 14. REFERRALS HUB */}
            {activeTab === 'referrals' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-zinc-900 dark:text-white">Referrals Hub</h3>
                  <p className="text-xs text-zinc-500">Invite friends and earn shopping cash rewards.</p>
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="bg-zinc-50 dark:bg-zinc-950/40 p-5 rounded-2xl border dark:border-zinc-850 space-y-3">
                    <Gift className="h-8 w-8 text-indigo-500" />
                    <h4 className="font-bold text-sm">Your Referral Code</h4>
                    <div className="flex gap-2">
                      <div className="flex-1 bg-white dark:bg-zinc-950 border dark:border-zinc-800 rounded-xl px-3 py-2 text-xs font-bold text-zinc-800 dark:text-zinc-200 flex items-center justify-between">
                        <span>{referrals.code}</span>
                      </div>
                      <button 
                        onClick={() => {
                          navigator.clipboard.writeText(`http://localhost:3000/register?ref=${referrals.code}`);
                          showToast('Referral link copied to clipboard!', 'success');
                        }}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl px-4 py-2 cursor-pointer shadow"
                      >
                        Copy Link
                      </button>
                    </div>
                    <p className="text-[10px] text-zinc-400">Share your link to earn $10.00 for every friend who places their first order.</p>
                  </div>

                  <div className="bg-zinc-50 dark:bg-zinc-950/40 p-5 rounded-2xl border dark:border-zinc-850 space-y-3 flex flex-col justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-zinc-900 dark:text-white">Total Rewards Earned</h4>
                      <p className="text-xs text-zinc-500">Credited directly to your shopping wallet balance.</p>
                    </div>
                    <div className="text-3xl font-black text-indigo-600 dark:text-indigo-400">${referrals.earnedBalance.toFixed(2)}</div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-bold text-sm">Referred Friends Log</h4>
                  <div className="border dark:border-zinc-850 rounded-2xl overflow-hidden">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-zinc-50 dark:bg-zinc-950 border-b dark:border-zinc-800 font-bold text-zinc-500">
                          <th className="p-3">Email Address</th>
                          <th className="p-3">Status</th>
                          <th className="p-3">Date</th>
                          <th className="p-3 text-right">Bonus Earned</th>
                        </tr>
                      </thead>
                      <tbody>
                        {referrals.list.map((ref, idx) => (
                          <tr key={idx} className="border-b dark:border-zinc-850 last:border-0 hover:bg-zinc-50/50 dark:hover:bg-zinc-950/25">
                            <td className="p-3 font-semibold text-zinc-800 dark:text-zinc-200">{ref.email}</td>
                            <td className="p-3">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                ref.status === 'Completed' ? 'bg-emerald-50 text-emerald-800' : 'bg-amber-50 text-amber-805'
                              }`}>
                                {ref.status}
                              </span>
                            </td>
                            <td className="p-3 text-zinc-400">{ref.date}</td>
                            <td className="p-3 text-right font-bold text-zinc-805 dark:text-zinc-200">{ref.bonus}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

          </main>
        </div>
      </div>
    </div>
  );
}
