'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAdmin } from '../../../AdminContext';
import { ArrowLeft, Save, Trash2, Calendar, FileText, Image, Globe } from 'lucide-react';
import { Section, SectionHeader, badge } from '../../../../components/AdminUI';

export default function BlogDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { loadBlogs, blogsFiltered, apiAction } = useAdmin();
  
  const [blog, setBlog] = useState<any>(null);
  const [localLoading, setLocalLoading] = useState(true);

  const [blogTitle, setBlogTitle] = useState('');
  const [blogSlug, setBlogSlug] = useState('');
  const [blogContent, setBlogContent] = useState('');
  const [blogTags, setBlogTags] = useState('');
  const [blogStatus, setBlogStatus] = useState('Draft');
  const [blogFeaturedImage, setBlogFeaturedImage] = useState('');

  useEffect(() => {
    const init = async () => {
      setLocalLoading(true);
      await loadBlogs();
      setLocalLoading(false);
    };
    init();
  }, []);

  useEffect(() => {
    if (blogsFiltered.length > 0) {
      const found = blogsFiltered.find((b) => b._id === id);
      if (found) {
        setBlog(found);
        setBlogTitle(found.title || '');
        setBlogSlug(found.slug || '');
        setBlogContent(found.content || '');
        setBlogTags(found.tags?.join(', ') || '');
        setBlogStatus(found.status || 'Draft');
        setBlogFeaturedImage(found.featuredImage || '');
      }
    }
  }, [blogsFiltered, id]);

  const saveBlogPost = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      title: blogTitle,
      slug: blogSlug,
      content: blogContent,
      tags: blogTags.split(',').map((t) => t.trim()).filter(Boolean),
      status: blogStatus,
      featuredImage: blogFeaturedImage,
    };
    try {
      await apiAction('PUT', `/blog/posts/${id}`, payload);
      alert('Blog post updated successfully!');
      await loadBlogs();
    } catch (err: any) {
      alert(err.message || 'Error saving post');
    }
  };

  const deleteBlogPost = async () => {
    if (!confirm('Are you sure you want to delete this blog post?')) return;
    try {
      await apiAction('DELETE', `/blog/posts/${id}`);
      alert('Blog post deleted successfully!');
      router.push('/cms');
    } catch (err: any) {
      alert(err.message || 'Deletion failed');
    }
  };

  if (localLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-650"></div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="text-center py-12">
        <h3 className="text-sm font-bold text-zinc-550">Blog post record not found.</h3>
        <button onClick={() => router.push('/cms')} className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-semibold">
          Back to CMS
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.push('/cms')}
          className="p-2 border dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-500 rounded-xl hover:text-indigo-500 transition-colors cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div>
          <h1 className="text-xl font-black text-zinc-900 dark:text-white">
            {blog.title}
          </h1>
          <p className="text-xs text-zinc-400">/{blog.slug}</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column: Editor */}
        <div className="lg:col-span-2 space-y-6">
          <Section>
            <SectionHeader title="Article Content" desc="Write HTML safe content and structure headings." />
            <form onSubmit={saveBlogPost} className="p-6 space-y-4 text-xs text-left">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] text-zinc-450 font-bold uppercase mb-1">Title</label>
                  <input
                    type="text"
                    required
                    value={blogTitle}
                    onChange={(e) => setBlogTitle(e.target.value)}
                    className="w-full px-3 py-2 border dark:border-zinc-800 bg-white dark:bg-zinc-950 rounded-lg text-zinc-850 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-zinc-450 font-bold uppercase mb-1">Slug (URL Path)</label>
                  <input
                    type="text"
                    required
                    value={blogSlug}
                    onChange={(e) => setBlogSlug(e.target.value)}
                    className="w-full px-3 py-2 border dark:border-zinc-800 bg-white dark:bg-zinc-955 rounded-lg text-zinc-850 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] text-zinc-450 font-bold uppercase mb-1">Featured Image URL</label>
                <input
                  type="text"
                  value={blogFeaturedImage}
                  onChange={(e) => setBlogFeaturedImage(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3 py-2 border dark:border-zinc-800 bg-white dark:bg-zinc-950 rounded-lg text-zinc-850 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-[10px] text-zinc-455 font-bold uppercase mb-1">Content (HTML allowed)</label>
                <textarea
                  required
                  rows={10}
                  value={blogContent}
                  onChange={(e) => setBlogContent(e.target.value)}
                  className="w-full px-3 py-2 border dark:border-zinc-800 bg-white dark:bg-zinc-950 rounded-lg text-zinc-850 dark:text-white font-mono"
                  placeholder="<p>Blog post content...</p>"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow cursor-pointer border-0"
                >
                  <Save className="h-4 w-4 mr-2 inline" />
                  Save Changes
                </button>
              </div>
            </form>
          </Section>
        </div>

        {/* Right Column: Settings */}
        <div className="space-y-6">
          <Section>
            <SectionHeader title="Publishing Metadata" desc="Select publication settings and tag lists." />
            <div className="p-6 space-y-4 text-xs">
              <div className="space-y-1">
                <label className="block text-[10px] text-zinc-400 font-bold uppercase">Status</label>
                <select
                  value={blogStatus}
                  onChange={(e) => setBlogStatus(e.target.value)}
                  className="w-full px-3 py-2 border dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-xl text-zinc-800 dark:text-white"
                >
                  <option value="Draft">Draft</option>
                  <option value="Published">Published</option>
                  <option value="Archived">Archived</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] text-zinc-450 font-bold uppercase mb-1">Tags (comma-separated)</label>
                <input
                  type="text"
                  value={blogTags}
                  onChange={(e) => setBlogTags(e.target.value)}
                  placeholder="news, updates, promo"
                  className="w-full px-3 py-2 border dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-xl text-zinc-800 dark:text-white"
                />
              </div>

              <div className="space-y-3 pt-3 border-t dark:border-zinc-800 text-zinc-500">
                <div className="flex justify-between">
                  <span>Created:</span>
                  <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Last Updated:</span>
                  <span>{new Date(blog.updatedAt).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="pt-2 border-t dark:border-zinc-800">
                <button
                  onClick={deleteBlogPost}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-red-650 hover:bg-red-500 text-white font-bold rounded-xl cursor-pointer border-0"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete Post
                </button>
              </div>
            </div>
          </Section>
        </div>
      </div>
    </div>
  );
}
