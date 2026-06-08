'use client';

import React, { useState } from 'react';
import { useStore } from '../../store/store';
import { CreditCard, ShoppingBag, Truck, Percent, CheckCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function CheckoutPage() {
  const { cart, appliedCoupon, applyCoupon, clearCart, addOrder } = useStore();
  const router = useRouter();

  const [fullName, setFullName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [paymentProvider, setPaymentProvider] = useState('Stripe');
  const [couponCode, setCouponCode] = useState('');
  const [orderCompleted, setOrderCompleted] = useState(false);
  const [newOrderId, setNewOrderId] = useState('');

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.08;
  const discount = appliedCoupon ? (appliedCoupon.discountType === 'percentage' ? (subtotal * appliedCoupon.value) / 100 : appliedCoupon.value) : 0;
  const total = subtotal + tax - discount;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponCode.toUpperCase() === 'SAVE20') {
      applyCoupon({ code: 'SAVE20', discountType: 'percentage', value: 20 });
      alert('Coupon SAVE20 applied successfully! 20% off.');
    } else {
      alert('Invalid code. Try using: SAVE20');
    }
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !address || !city || !zipCode) {
      alert('Please fill out all shipping details.');
      return;
    }
    const orderId = 'ORD-' + Math.floor(100000 + Math.random() * 900000);
    addOrder({
      id: orderId,
      items: [...cart],
      fullName,
      address,
      city,
      zipCode
    });
    setNewOrderId(orderId);
    setOrderCompleted(true);
    clearCart();
  };

  if (orderCompleted) {
    return (
      <div className="flex-1 flex items-center justify-center py-20 px-4 bg-zinc-50 dark:bg-zinc-950">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl border text-center dark:bg-zinc-900 dark:border-zinc-800 space-y-6">
          <CheckCircle className="h-16 w-16 text-emerald-500 mx-auto" />
          <h2 className="text-2xl font-black text-zinc-900 dark:text-white">Order Confirmed!</h2>
          <p className="text-zinc-500 text-sm">
            Thank you for your purchase. Your order ID is <strong className="text-indigo-600 dark:text-indigo-400">{newOrderId}</strong>.
          </p>
          <div className="bg-zinc-50 dark:bg-zinc-950 p-4 rounded-xl text-left text-xs space-y-1.5 border">
            <div><strong>Deliver to:</strong> {fullName}</div>
            <div><strong>Address:</strong> {address}, {city}, {zipCode}</div>
            <div><strong>Payment Method:</strong> {paymentProvider}</div>
            <div><strong>Shipping Status:</strong> Pending Dispatch</div>
          </div>
          <button
            onClick={() => router.push('/')}
            className="w-full rounded-xl bg-indigo-600 py-3 font-semibold text-white hover:bg-indigo-500"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-zinc-50 dark:bg-zinc-950 py-12">
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid lg:grid-cols-12 gap-8">
        
        {/* Checkout Forms (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-white">Secure Checkout</h1>
          
          <form onSubmit={handlePlaceOrder} className="space-y-6">
            {/* Shipping Address */}
            <div className="bg-white p-6 rounded-2xl border border-zinc-200/80 dark:bg-zinc-900 dark:border-zinc-800 shadow-sm space-y-4">
              <h3 className="font-bold text-lg flex items-center gap-2 border-b pb-2">
                <Truck className="h-5 w-5 text-indigo-600" /> Shipping Details
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <input
                  type="text"
                  required
                  placeholder="Full Name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="rounded-xl border p-3 text-sm focus:border-indigo-500 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950"
                />
                <input
                  type="text"
                  required
                  placeholder="Address Line"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="rounded-xl border p-3 text-sm focus:border-indigo-500 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950"
                />
                <input
                  type="text"
                  required
                  placeholder="City"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="rounded-xl border p-3 text-sm focus:border-indigo-500 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950"
                />
                <input
                  type="text"
                  required
                  placeholder="ZIP / Postal Code"
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                  className="rounded-xl border p-3 text-sm focus:border-indigo-500 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950"
                />
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white p-6 rounded-2xl border border-zinc-200/80 dark:bg-zinc-900 dark:border-zinc-800 shadow-sm space-y-4">
              <h3 className="font-bold text-lg flex items-center gap-2 border-b pb-2">
                <CreditCard className="h-5 w-5 text-indigo-600" /> Payment Provider
              </h3>
              <div className="grid grid-cols-3 gap-4">
                {['Stripe', 'PayPal', 'Wallet'].map((provider) => (
                  <button
                    key={provider}
                    type="button"
                    onClick={() => setPaymentProvider(provider)}
                    className={`rounded-xl border p-4 text-center text-sm font-semibold transition-all ${
                      paymentProvider === provider
                        ? 'border-indigo-600 bg-indigo-50/50 text-indigo-600 dark:bg-indigo-950/20'
                        : 'border-zinc-200 hover:bg-zinc-50 dark:border-zinc-800'
                    }`}
                  >
                    {provider}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={cart.length === 0}
              className="w-full rounded-xl bg-indigo-600 py-3.5 font-bold text-white hover:bg-indigo-500 disabled:bg-zinc-300 disabled:cursor-not-allowed shadow-lg shadow-indigo-600/20"
            >
              Complete Checkout - Pay ${total.toFixed(2)}
            </button>
          </form>
        </div>

        {/* Cart Summary (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-zinc-200/80 dark:bg-zinc-900 dark:border-zinc-800 shadow-sm space-y-4">
            <h3 className="font-bold text-lg flex items-center gap-2 border-b pb-2">
              <ShoppingBag className="h-5 w-5 text-indigo-600" /> Order Summary
            </h3>
            {cart.length === 0 ? (
              <p className="text-zinc-500 text-sm py-4">No items in cart.</p>
            ) : (
              <div className="space-y-4 overflow-y-auto max-h-60 pr-1">
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between items-center text-sm">
                    <div className="line-clamp-1 w-2/3">{item.title} (x{item.quantity})</div>
                    <div className="font-semibold">${(item.price * item.quantity).toFixed(2)}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Promo Code Coupon engine */}
            <form onSubmit={handleApplyCoupon} className="flex gap-2 pt-4 border-t">
              <div className="relative flex-1">
                <span className="absolute inset-y-0 left-0 flex items-center pl-2 text-zinc-400">
                  <Percent className="h-4 w-4" />
                </span>
                <input
                  type="text"
                  placeholder="Coupon Code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="w-full rounded-lg border pl-8 pr-2 py-2 text-xs focus:outline-none dark:border-zinc-800 dark:bg-zinc-950"
                />
              </div>
              <button
                type="submit"
                className="rounded-lg bg-zinc-900 text-white px-4 text-xs font-semibold hover:bg-zinc-800 dark:bg-zinc-800"
              >
                Apply
              </button>
            </form>

            <div className="border-t pt-4 space-y-2 text-sm">
              <div className="flex justify-between text-zinc-500">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-zinc-500">
                <span>Est. Tax (8%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-medium">
                  <span>Discount ({appliedCoupon?.code})</span>
                  <span>-${discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between font-extrabold text-base pt-2 border-t text-zinc-900 dark:text-white">
                <span>Total Amount</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
