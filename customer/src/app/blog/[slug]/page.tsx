'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Calendar, Tag, ChevronLeft, BookOpen, Clock, User, Share2 } from 'lucide-react';

interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  content: string;
  tags: string[];
  status: string;
  featuredImage?: string;
  createdAt: string;
}

const MOCK_POSTS: BlogPost[] = [
  {
    _id: '1',
    title: 'Introducing ApexStore: The Future of E-Commerce',
    slug: 'introducing-apexstore',
    content: `
      <p>Welcome to the next generation of online shopping platforms. We are excited to launch ApexStore, a high-performance, multi-vendor environment optimized for speed, reliability, and security.</p>
      <p>ApexStore has been built from the ground up using NestJS on the backend and Next.js 16 on the frontend. By combining these leading-edge technologies with custom state management and highly indexed document storage databases, we are able to achieve page loads under 150ms.</p>
      <h2>Key Architectural Advantages</h2>
      <ul>
        <li><strong>Sub-second catalog search</strong>: Utilizing text indices and semantic relevance boosters.</li>
        <li><strong>Empathetic AI chatbot support</strong>: Built-in Natural Language Processing with local LLM fallbacks.</li>
        <li><strong>Double-entry ledger vault</strong>: Ensuring financial operations and payouts match down to the cent.</li>
      </ul>
      <p>Stay tuned for more updates as we continue rolling out features to our buyer, seller, and vendor consoles.</p>
    `,
    tags: ['Announcement', 'Company'],
    status: 'Published',
    featuredImage: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1200&q=80',
    createdAt: new Date().toISOString(),
  },
  {
    _id: '2',
    title: 'Top E-Commerce Trends to Watch in 2026',
    slug: 'top-ecommerce-trends-2026',
    content: `
      <p>The digital storefront space is evolving rapidly. In this guide, we dive deep into the rising adoption of AI assistants, localized multi-channel networks, and same-day ledger settlements.</p>
      <h2>1. The Rise of Agentic Support</h2>
      <p>Rule-based chatbots are a thing of the past. Customers in 2026 expect full multi-turn conversational agents that can execute refunds, track orders, adjust carts, and recommend complementary products in real time.</p>
      <h2>2. Real-Time Vendor Payout Ledgers</h2>
      <p>Modern marketplaces require instant settlements. Sellers need access to their cleared funds immediately, necessitating robust banking gateways, double-entry ledgers, and fraud filters that scan transfers at low latencies.</p>
    `,
    tags: ['Tech', 'Trends'],
    status: 'Published',
    featuredImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
];

export default function BlogPostPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPost() {
      try {
        const res = await fetch(`http://localhost:5001/api/v1/blog/posts/${slug}`);
        if (!res.ok) throw new Error('Post not found');
        const data = await res.json();
        setPost(data);
      } catch (e) {
        // Fallback to mock posts
        const mockMatch = MOCK_POSTS.find(p => p.slug === slug);
        setPost(mockMatch || null);
      } finally {
        setLoading(false);
      }
    }
    if (slug) fetchPost();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 transition-colors duration-300 pb-20 animate-pulse">
        {/* Banner Skeleton */}
        <div className="h-[400px] w-full bg-zinc-200 dark:bg-zinc-800" />
        
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 mt-10 space-y-8">
          <div className="h-4 w-36 bg-zinc-200 dark:bg-zinc-800 rounded-lg" />
          <div className="space-y-4">
            <div className="h-10 w-full bg-zinc-200 dark:bg-zinc-800 rounded-xl" />
            <div className="h-10 w-2/3 bg-zinc-200 dark:bg-zinc-800 rounded-xl" />
            <div className="flex justify-between items-center py-4 border-y border-zinc-200/80 dark:border-zinc-800/80">
              <div className="flex gap-4">
                <div className="h-3.5 w-24 bg-zinc-200 dark:bg-zinc-800 rounded-lg" />
                <div className="h-3.5 w-16 bg-zinc-200 dark:bg-zinc-800 rounded-lg" />
              </div>
              <div className="h-3.5 w-20 bg-zinc-200 dark:bg-zinc-800 rounded-lg" />
            </div>
          </div>
          <div className="space-y-3">
            <div className="h-3 w-full bg-zinc-150 dark:bg-zinc-850 rounded-lg" />
            <div className="h-3 w-full bg-zinc-150 dark:bg-zinc-850 rounded-lg" />
            <div className="h-3 w-5/6 bg-zinc-150 dark:bg-zinc-850 rounded-lg" />
            <div className="h-3 w-full bg-zinc-150 dark:bg-zinc-850 rounded-lg" />
            <div className="h-3 w-2/3 bg-zinc-150 dark:bg-zinc-850 rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center py-20 bg-zinc-50 dark:bg-zinc-950 text-center space-y-4">
        <BookOpen className="h-12 w-12 text-zinc-350" />
        <h2 className="text-xl font-black text-zinc-900 dark:text-white">Blog Post Not Found</h2>
        <p className="text-xs text-zinc-450">The article you are looking for does not exist or has been archived.</p>
        <Link href="/blog" className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline">
          <ChevronLeft className="h-4 w-4" /> Return to Blog
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 transition-colors duration-300 pb-20">
      {/* Banner / Header Image */}
      {post.featuredImage && (
        <div className="relative h-[400px] w-full bg-zinc-900">
          <img 
            src={post.featuredImage} 
            alt={post.title} 
            className="w-full h-full object-cover opacity-60" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-50 via-zinc-950/20 to-zinc-950/45 dark:from-zinc-950"></div>
          <div className="absolute bottom-6 left-6 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-left">
            <div className="flex gap-2 mb-3">
              {post.tags?.map((t: string) => (
                <span key={t} className="bg-indigo-600 text-white text-[9px] font-bold px-2 py-0.5 rounded border border-indigo-500 uppercase tracking-wider">{t}</span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Container */}
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 mt-10 space-y-8">
        {/* Navigation back button */}
        <Link href="/blog" className="inline-flex items-center gap-1.5 text-xs font-bold text-zinc-500 hover:text-indigo-600 transition-colors">
          <ChevronLeft className="h-4 w-4" /> Back to all articles
        </Link>

        {/* Article Metadata */}
        <div className="space-y-4">
          <h1 className="text-3xl sm:text-4xl font-black text-zinc-900 dark:text-white leading-tight">{post.title}</h1>
          
          <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-y border-zinc-200/80 dark:border-zinc-800/80 text-xs text-zinc-400">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" /> {new Date(post.createdAt).toLocaleDateString()}</span>
              <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /> 5 min read</span>
              <span className="flex items-center gap-1.5"><User className="h-3.5 w-3.5" /> By ApexStore Editor</span>
            </div>
            
            <button 
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                alert('Article link copied to clipboard!');
              }}
              className="flex items-center gap-1.5 font-bold hover:text-indigo-600 transition-colors"
            >
              <Share2 className="h-3.5 w-3.5" /> Share Article
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div 
          className="prose dark:prose-invert max-w-none text-sm text-zinc-650 dark:text-zinc-300 leading-relaxed space-y-6"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </div>
    </div>
  );
}
