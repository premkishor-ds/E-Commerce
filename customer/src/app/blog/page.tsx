'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Calendar, Tag, ChevronRight, BookOpen, Clock } from 'lucide-react';

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
    content: '<p>Welcome to the next generation of online shopping platforms. We are excited to launch ApexStore, a high-performance, multi-vendor environment optimized for speed, reliability, and security...</p>',
    tags: ['Announcement', 'Company'],
    status: 'Published',
    featuredImage: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=600&q=80',
    createdAt: new Date().toISOString(),
  },
  {
    _id: '2',
    title: 'Top E-Commerce Trends to Watch in 2026',
    slug: 'top-ecommerce-trends-2026',
    content: '<p>The digital storefront space is evolving rapidly. In this guide, we dive deep into the rising adoption of AI assistants, localized multi-channel networks, and same-day ledger settlements...</p>',
    tags: ['Tech', 'Trends'],
    status: 'Published',
    featuredImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
];

export default function BlogListPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const res = await fetch('http://localhost:5001/api/v1/blog/posts');
        if (!res.ok) throw new Error('API offline');
        const data = await res.json();
        // Only show published posts
        const published = data.filter((p: any) => p.status === 'Published');
        setPosts(published.length > 0 ? published : MOCK_POSTS);
      } catch (e) {
        setPosts(MOCK_POSTS);
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, []);

  // Filter posts
  const filteredPosts = posts.filter(post => {
    const matchesSearch = 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = selectedTag ? post.tags?.includes(selectedTag) : true;
    return matchesSearch && matchesTag;
  });

  // Get all unique tags
  const allTags = Array.from(new Set(posts.flatMap(p => p.tags || [])));

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 transition-colors duration-300">
      {/* Hero Header Section */}
      <div className="relative bg-zinc-900 py-24 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center opacity-30" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1200&q=85')" }}></div>
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-900/80 to-transparent"></div>
        <div className="relative mx-auto max-w-5xl text-center space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
            <BookOpen className="h-3.5 w-3.5" /> Company Blog
          </span>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">ApexStore Journal</h1>
          <p className="text-sm md:text-base text-zinc-300 max-w-xl mx-auto">Latest announcements, engineering insights, vendor strategy, and trends in enterprise e-commerce.</p>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8 space-y-8">
        {/* Search and Tag filter panel */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white dark:bg-zinc-900 p-6 rounded-2xl border dark:border-zinc-800 shadow-sm">
          {/* Search bar */}
          <div className="relative w-full md:max-w-xs">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-400">
              <Search className="h-4 w-4" />
            </span>
            <input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 pl-10 pr-4 py-2 text-xs focus:border-indigo-500 focus:outline-none dark:bg-zinc-950 text-zinc-900 dark:text-white"
            />
          </div>

          {/* Tags */}
          <div className="flex gap-2 flex-wrap items-center">
            <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Filter by Tag:</span>
            <button
              onClick={() => setSelectedTag(null)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-all ${
                !selectedTag 
                  ? 'bg-indigo-600 border-indigo-650 text-white shadow-sm' 
                  : 'bg-zinc-50 border-zinc-200 text-zinc-650 hover:bg-zinc-100 dark:bg-zinc-950 dark:border-zinc-800 dark:text-zinc-400'
              }`}
            >
              All Tags
            </button>
            {allTags.map(tag => (
              <button
                key={tag}
                onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-all ${
                  selectedTag === tag 
                    ? 'bg-indigo-600 border-indigo-650 text-white shadow-sm' 
                    : 'bg-zinc-50 border-zinc-200 text-zinc-650 hover:bg-zinc-100 dark:bg-zinc-950 dark:border-zinc-800 dark:text-zinc-400'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Blog Post Cards Grid */}
        {loading ? (
          <div className="grid md:grid-cols-2 gap-8 animate-pulse">
            {Array(4).fill(0).map((_, i) => (
              <div key={i} className="flex flex-col bg-white dark:bg-zinc-900 border dark:border-zinc-800/80 rounded-2xl overflow-hidden shadow-sm space-y-4 pb-6">
                <div className="h-56 bg-zinc-200 dark:bg-zinc-800 w-full" />
                <div className="px-6 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-2.5">
                    <div className="flex gap-4">
                      <div className="h-3 w-20 bg-zinc-200 dark:bg-zinc-800 rounded-lg" />
                      <div className="h-3 w-16 bg-zinc-200 dark:bg-zinc-800 rounded-lg" />
                    </div>
                    <div className="h-6 w-3/4 bg-zinc-200 dark:bg-zinc-800 rounded-xl" />
                    <div className="space-y-1.5 pt-2">
                      <div className="h-3 w-full bg-zinc-150 dark:bg-zinc-800 rounded-lg" />
                      <div className="h-3 w-5/6 bg-zinc-150 dark:bg-zinc-800 rounded-lg" />
                    </div>
                  </div>
                  <div className="pt-4 border-t dark:border-zinc-800/60 h-4 w-24 bg-zinc-200 dark:bg-zinc-800 rounded-lg" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-8">
            {filteredPosts.map((post) => (
              <article key={post._id} className="group flex flex-col bg-white dark:bg-zinc-900 border dark:border-zinc-800/80 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
                {post.featuredImage && (
                  <div className="relative h-56 overflow-hidden bg-zinc-100">
                    <img 
                      src={post.featuredImage} 
                      alt={post.title} 
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" 
                    />
                    <div className="absolute top-4 left-4 flex gap-2">
                      {post.tags?.map((t: string) => (
                        <span key={t} className="bg-zinc-950/80 backdrop-blur-sm text-white text-[9px] font-bold px-2 py-0.5 rounded border border-white/10 uppercase tracking-wider">{t}</span>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2.5">
                    {/* Timestamp */}
                    <div className="flex items-center gap-4 text-[10px] text-zinc-400 font-semibold uppercase tracking-wider">
                      <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {new Date(post.createdAt).toLocaleDateString()}</span>
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> 5 min read</span>
                    </div>
                    
                    {/* Title */}
                    <h3 className="text-lg font-black text-zinc-900 dark:text-white group-hover:text-indigo-600 transition-colors leading-tight">
                      <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                    </h3>

                    {/* Excerpt */}
                    <p className="text-xs text-zinc-550 dark:text-zinc-400 line-clamp-3 leading-relaxed" 
                       dangerouslySetInnerHTML={{ __html: post.content.replace(/<[^>]*>/g, '') }}></p>
                  </div>

                  <div className="pt-4 border-t dark:border-zinc-800/60 flex justify-between items-center">
                    <Link href={`/blog/${post.slug}`} className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 group">
                      Read Article <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}

            {filteredPosts.length === 0 && (
              <div className="col-span-2 text-center py-20 bg-white dark:bg-zinc-900 rounded-2xl border dark:border-zinc-800 space-y-2">
                <p className="text-sm font-semibold text-zinc-500">No blog posts found matching your search criteria.</p>
                <button onClick={() => { setSearchQuery(''); setSelectedTag(null); }} className="text-xs font-bold text-indigo-600 hover:underline">Reset Filters</button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
