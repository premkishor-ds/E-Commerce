'use client';

import React, { useEffect, useState } from 'react';
import { Star } from 'lucide-react';

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([]);

  useEffect(() => {
    // Simulated fetch or actual mapping
    setReviews([
      { id: 'REV-01', rating: 5, comment: 'Excellent product! Super high quality.', customerName: 'Alex Jones', fakeScore: 5 },
      { id: 'REV-02', rating: 2, comment: 'Delivery was slightly delayed.', customerName: 'Emma Watson', fakeScore: 12 }
    ]);
  }, []);

  return (
    <>
      <title>Customer Reviews - ApexStore Seller</title>
      <section className="bg-white p-6 rounded-2xl border dark:bg-zinc-900 shadow-sm space-y-6 dark:border-zinc-800">
        <div>
          <h3 className="font-bold text-xl text-zinc-900 dark:text-white">Customer Reviews</h3>
          <p className="text-xs text-zinc-550 mt-0.5">Manage reviews left by customers and review system-generated AI authenticity scores.</p>
        </div>
        <div className="space-y-4">
          {reviews.map(r => (
            <div key={r.id} className="border border-zinc-100 dark:border-zinc-800 rounded-xl p-4 space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-bold text-xs text-zinc-900 dark:text-white">{r.customerName}</span>
                <div className="flex items-center gap-1 text-[10px] text-amber-500 font-bold">
                  <Star className="h-3 w-3 fill-amber-500" /> {r.rating} / 5
                </div>
              </div>
              <p className="text-xs text-zinc-650 dark:text-zinc-400">{r.comment}</p>
              <div className="flex justify-between items-center text-[10px] pt-1">
                <span className="text-zinc-400">AI Fraud Risk: <strong className="text-rose-500">{r.fakeScore}%</strong></span>
                <button onClick={() => alert('Reply registered!')} className="text-emerald-600 font-semibold hover:underline bg-transparent border-0 cursor-pointer">Reply</button>
              </div>
            </div>
          ))}
          {reviews.length === 0 && <p className="text-sm text-zinc-400 text-center py-6">No customer reviews yet.</p>}
        </div>
      </section>
    </>
  );
}
