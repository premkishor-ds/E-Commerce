'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAdmin } from '../../AdminContext';
import { RefreshCw, X } from 'lucide-react';
import {
  Section, SectionHeader, FilterBar, SearchBar, Table, Thead, badge, Loading
} from '../../../components/AdminUI';

export default function CMSPage() {
  const router = useRouter();
  const {
    loading, loadBlogs, blogsFiltered, blogSearch, setBlogSearch, apiAction,
    selectedBlog, setSelectedBlog, blogTitle, setBlogTitle, blogSlug, setBlogSlug,
    blogContent, setBlogContent, blogTags, setBlogTags, blogStatus, setBlogStatus,
    blogFeaturedImage, setBlogFeaturedImage, showBlogModal, setShowBlogModal
  } = useAdmin();

  useEffect(() => {
    loadBlogs();
  }, []);

  const saveBlogPost = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      title: blogTitle,
      slug: blogSlug,
      content: blogContent,
      tags: blogTags.split(',').map(t => t.trim()).filter(Boolean),
      status: blogStatus,
      featuredImage: blogFeaturedImage
    };
    try {
      if (selectedBlog) {
        await apiAction('PUT', `/blog/posts/${selectedBlog._id}`, payload);
        alert('Blog post updated successfully!');
      } else {
        await apiAction('POST', `/blog/posts`, payload);
        alert('Blog post created successfully!');
      }
      setShowBlogModal(false);
      loadBlogs();
    } catch (err: any) {
      alert(err.message || 'Error saving post');
    }
  };

  const deleteBlogPost = async (id: string) => {
    if (!confirm('Are you sure you want to delete this blog post?')) return;
    try {
      await apiAction('DELETE', `/blog/posts/${id}`);
      alert('Blog post deleted successfully!');
      loadBlogs();
    } catch (err: any) {
      alert(err.message || 'Deletion failed');
    }
  };

  return (
    <Section>
      <SectionHeader 
        title="Content Management System (CMS)" 
        desc="Publish and manage SEO-friendly blog posts, updates, and articles."
        right={
          <button 
            onClick={() => {
              setSelectedBlog(null); setBlogTitle(''); setBlogSlug(''); setBlogContent('');
              setBlogTags(''); setBlogStatus('Draft'); setBlogFeaturedImage(''); setShowBlogModal(true);
            }} 
            className="flex items-center gap-1.5 px-4 py-2 bg-indigo-650 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl cursor-pointer border-0 shadow"
          >
            + Create Blog Post
          </button>
        }
      />

      <FilterBar>
        <SearchBar value={blogSearch} onChange={setBlogSearch} placeholder="Search blog title, slug..." />
        <button onClick={loadBlogs} className="p-2 rounded-lg border dark:border-zinc-800 text-zinc-405 hover:bg-zinc-55 dark:hover:bg-zinc-800 bg-white dark:bg-zinc-900 cursor-pointer">
          <RefreshCw className="h-4 w-4" />
        </button>
      </FilterBar>

      {loading ? <Loading /> : (
        <Table>
          <Thead>
            <tr>
              <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-zinc-500">Title / Slug</th>
              <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-zinc-500">Tags</th>
              <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-zinc-500">Status</th>
              <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-zinc-500">Published Date</th>
              <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-zinc-500 text-right">Actions</th>
            </tr>
          </Thead>
          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {blogsFiltered.map((blog: any) => (
              <tr key={blog._id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40 text-xs">
                <td 
                  onClick={() => router.push(`/cms/${blog._id}`)}
                  className="px-4 py-3 text-left cursor-pointer hover:underline text-indigo-600 dark:text-indigo-400"
                >
                  <div className="font-semibold">{blog.title}</div>
                  <div className="text-[10px] text-zinc-400 font-mono">/{blog.slug}</div>
                </td>
                <td className="px-4 py-3 text-left">
                  <div className="flex gap-1 flex-wrap">
                    {blog.tags?.map((t: string) => (
                      <span key={t} className="bg-zinc-100 dark:bg-zinc-800 text-zinc-650 dark:text-zinc-300 px-1.5 py-0.5 rounded text-[10px] font-semibold">{t}</span>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-3 text-left">{badge(blog.status === 'Published' ? 'green' : 'amber', blog.status)}</td>
                <td className="px-4 py-3 text-zinc-455 text-left">{new Date(blog.createdAt || blog.updatedAt).toLocaleDateString()}</td>
                <td className="px-4 py-3 text-right">
                  <div className="flex gap-2 justify-end">
                    <button 
                      onClick={() => {
                        setSelectedBlog(blog); setBlogTitle(blog.title); setBlogSlug(blog.slug);
                        setBlogContent(blog.content); setBlogTags(blog.tags?.join(', ') || '');
                        setBlogStatus(blog.status || 'Draft'); setBlogFeaturedImage(blog.featuredImage || '');
                        setShowBlogModal(true);
                      }} 
                      className="text-indigo-650 hover:underline font-bold bg-transparent border-0 cursor-pointer"
                    >
                      Edit
                    </button>
                    <span className="text-zinc-200">|</span>
                    <button 
                      onClick={() => deleteBlogPost(blog._id)} 
                      className="text-red-500 hover:underline font-semibold bg-transparent border-0 cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {blogsFiltered.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-8 text-zinc-400">No blog posts found.</td>
              </tr>
            )}
          </tbody>
        </Table>
      )}

      {/* Blog Editor Modal */}
      {showBlogModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 backdrop-blur-md p-4 overflow-y-auto">
          <div className="w-full max-w-2xl bg-white/95 dark:bg-zinc-900/95 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-2xl p-6 relative max-h-[90vh] overflow-y-auto space-y-4">
            <button onClick={() => setShowBlogModal(false)} className="absolute top-4 right-4 p-1 rounded-full text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-850 bg-transparent border-0 cursor-pointer">
              <X className="h-5 w-5" />
            </button>
            <div className="text-center border-b pb-3 dark:border-zinc-800">
              <h2 className="text-lg font-black text-zinc-900 dark:text-white">{selectedBlog ? 'Edit Blog Post' : 'Create Blog Post'}</h2>
              <p className="text-xs text-zinc-500">Define title, unique slug, and HTML safe content.</p>
            </div>

            <form onSubmit={saveBlogPost} className="space-y-4 text-xs text-left">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] text-zinc-450 font-bold uppercase mb-1">Title</label>
                  <input type="text" required value={blogTitle} onChange={e => {
                    setBlogTitle(e.target.value);
                    if (!selectedBlog) {
                      setBlogSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
                    }
                  }} className="w-full px-3 py-2 border dark:border-zinc-850 bg-white dark:bg-zinc-950 rounded-lg text-zinc-800 dark:text-white" />
                </div>
                <div>
                  <label className="block text-[10px] text-zinc-450 font-bold uppercase mb-1">Slug (URL Path)</label>
                  <input type="text" required value={blogSlug} onChange={e => setBlogSlug(e.target.value)} className="w-full px-3 py-2 border dark:border-zinc-850 bg-white dark:bg-zinc-955 rounded-lg text-zinc-800 dark:text-white" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] text-zinc-450 font-bold uppercase mb-1">Tags (comma-separated)</label>
                  <input type="text" value={blogTags} onChange={e => setBlogTags(e.target.value)} placeholder="news, updates, promo" className="w-full px-3 py-2 border dark:border-zinc-850 bg-white dark:bg-zinc-955 rounded-lg text-zinc-800 dark:text-white" />
                </div>
                <div>
                  <label className="block text-[10px] text-zinc-450 font-bold uppercase mb-1">Status</label>
                  <select value={blogStatus} onChange={e => setBlogStatus(e.target.value)} className="w-full px-3 py-2 border dark:border-zinc-850 bg-white dark:bg-zinc-955 rounded-lg text-zinc-800 dark:text-white cursor-pointer">
                    <option value="Draft">Draft</option>
                    <option value="Published">Published</option>
                    <option value="Archived">Archived</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] text-zinc-450 font-bold uppercase mb-1">Featured Image URL</label>
                <input type="text" value={blogFeaturedImage} onChange={e => setBlogFeaturedImage(e.target.value)} placeholder="https://..." className="w-full px-3 py-2 border dark:border-zinc-850 bg-white dark:bg-zinc-950 rounded-lg text-zinc-800 dark:text-white" />
              </div>

              <div>
                <label className="block text-[10px] text-zinc-450 font-bold uppercase mb-1">Content (HTML allowed)</label>
                <textarea required rows={8} value={blogContent} onChange={e => setBlogContent(e.target.value)} className="w-full px-3 py-2 border dark:border-zinc-850 bg-white dark:bg-zinc-950 rounded-lg text-zinc-800 dark:text-white font-mono" placeholder="<p>Blog post content...</p>" />
              </div>

              <button type="submit" className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold rounded-xl shadow-lg transition-all text-xs border-0 cursor-pointer">
                {selectedBlog ? 'Save Changes' : 'Create Post'}
              </button>
            </form>
          </div>
        </div>
      )}
    </Section>
  );
}
