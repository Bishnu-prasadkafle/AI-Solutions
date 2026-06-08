'use client';
import { useEffect, useState } from 'react';
import { blogsAPI } from '@/lib/api';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import AdminModal from '@/components/admin/AdminModal';
import FilterTabs from '@/components/ui/FilterTabs';
import { LoadingSpinner } from '@/components/ui/StateUI';
import { Plus, Pencil, Trash2, Loader2, Eye } from 'lucide-react';

type BlogForm = {
  title: string; slug: string; excerpt: string; content: string;
  category: string; author_name: string; status: string; read_time: number;
};

const CATEGORIES = [
  { value: 'ai', label: 'AI' }, { value: 'tech', label: 'Technology' },
  { value: 'news', label: 'News' }, { value: 'tutorial', label: 'Tutorial' },
  { value: 'case_study', label: 'Case Study' },
];

export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [saving, setSaving] = useState(false);
  const [filterStatus, setFilterStatus] = useState('');

  const { register, handleSubmit, reset, setValue } = useForm<BlogForm>({ defaultValues: { status: 'draft', read_time: 5 } });

  const fetchBlogs = () => {
    setLoading(true);
    blogsAPI.list(filterStatus ? { status: filterStatus } : {})
      .then((r) => setBlogs(r.data.results || r.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchBlogs(); }, [filterStatus]);

  const STATUS_TABS = [{value:'',label:'All'},{value:'published',label:'Published'},{value:'draft',label:'Drafts'}];

  const openNew = () => {
    setEditItem(null);
    reset({ status: 'draft', read_time: 5 });
    setImageFile(null);
    setImagePreview('');
    setShowForm(true);
  };

  const openEdit = (item: any) => {
    setEditItem(item);
    Object.keys(item).forEach((k) => setValue(k as any, item[k]));
    setImageFile(null);
    setImagePreview(item.cover_image_url || item.cover_image || '');
    setShowForm(true);
  };

  const onSubmit = async (data: BlogForm) => {
    setSaving(true);
    try {
      const fd = new FormData();
      const excluded = ['cover_image', 'cover_image_url', 'tags', 'author', 'views', 'created_at', 'updated_at', 'published_at'];
      Object.entries(data).forEach(([k, v]) => {
        if (!excluded.includes(k)) fd.append(k, String(v));
      });
      if (imageFile) fd.append('cover_image', imageFile);

      if (editItem) {
        await blogsAPI.patch(editItem.id, fd);
        toast.success('Blog post updated');
      } else {
        await blogsAPI.create(fd);
        toast.success('Blog post created');
      }
      setShowForm(false);
      fetchBlogs();
    } catch {
      toast.error('Failed to save blog post');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this post?')) return;
    try {
      await blogsAPI.delete(id);
      toast.success('Deleted');
      fetchBlogs();
    } catch { toast.error('Failed to delete'); }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>Blog Posts</h1>
          <p className="text-[var(--text-secondary)] mt-1">Manage articles and publications</p>
        </div>
        <button onClick={openNew} className="btn-primary flex items-center gap-2">
          <Plus size={16} /> New Post
        </button>
      </div>

      {/* Filter */}
      <FilterTabs tabs={STATUS_TABS} active={filterStatus} onChange={setFilterStatus} />

      <div className="glass rounded-xl overflow-hidden">
        {loading ? (
          <LoadingSpinner />
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Author</th>
                <th>Status</th>
                <th>Views</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {blogs.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-10 text-[var(--text-muted)]">No posts yet</td></tr>
              ) : blogs.map((b: any) => (
                <tr key={b.id}>
                  <td>
                    <p className="text-white font-medium text-sm">{b.title}</p>
                    <p className="text-xs text-[var(--text-muted)]">{b.excerpt?.slice(0, 60)}...</p>
                  </td>
                  <td><span className="badge badge-cyan capitalize">{b.category}</span></td>
                  <td className="text-sm">{b.author_name || '—'}</td>
                  <td>
                    <span className={`badge ${b.status === 'published' ? 'badge-green' : 'badge-orange'} capitalize`}>
                      {b.status}
                    </span>
                  </td>
                  <td>
                    <span className="flex items-center gap-1 text-xs"><Eye size={11} /> {b.views}</span>
                  </td>
                  <td>
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(b)} className="p-2 rounded-lg text-[var(--text-muted)] hover:text-accent hover:bg-accent/10 transition-all">
                        <Pencil size={15} />
                      </button>
                      <button onClick={() => handleDelete(b.id)} className="p-2 rounded-lg text-[var(--text-muted)] hover:text-red-400 hover:bg-red-400/10 transition-all">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showForm && (
        <AdminModal title={editItem ? 'Edit Post' : 'New Blog Post'} onClose={() => setShowForm(false)} wide>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-[var(--text-muted)] mb-2">Title *</label>
                <input {...register('title', { required: true })} className="input-field" placeholder="Post title" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[var(--text-muted)] mb-2">Slug *</label>
                  <input {...register('slug', { required: true })} className="input-field" placeholder="post-slug" />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[var(--text-muted)] mb-2">Author Name</label>
                  <input {...register('author_name')} className="input-field" placeholder="John Doe" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[var(--text-muted)] mb-2">Category</label>
                  <select {...register('category')} className="input-field">
                    {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[var(--text-muted)] mb-2">Status</label>
                  <select {...register('status')} className="input-field">
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[var(--text-muted)] mb-2">Read Time (min)</label>
                  <input {...register('read_time')} type="number" className="input-field" />
                </div>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-[var(--text-muted)] mb-2">Excerpt *</label>
                <textarea {...register('excerpt', { required: true })} rows={2} className="input-field resize-none" placeholder="Short summary..." />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-[var(--text-muted)] mb-2">Content *</label>
                <div className="text-xs mb-2 px-3 py-2 rounded-lg" style={{ background: 'rgba(64,138,113,0.08)', border: '1px solid rgba(64,138,113,0.15)', color: 'var(--text-muted)' }}>
                  Markdown supported — <span style={{ color: '#B0E4CC' }}># Heading 1</span> &nbsp;·&nbsp;
                  <span style={{ color: '#B0E4CC' }}>## Heading 2</span> &nbsp;·&nbsp;
                  <span style={{ color: '#B0E4CC' }}>### Heading 3</span> &nbsp;·&nbsp;
                  <span style={{ color: '#B0E4CC' }}>- bullet</span> &nbsp;·&nbsp;
                  <span style={{ color: '#B0E4CC' }}>1. numbered</span> &nbsp;·&nbsp;
                  <span style={{ color: '#B0E4CC' }}>&gt; quote</span> &nbsp;·&nbsp;
                  <span style={{ color: '#B0E4CC' }}>**bold**</span>
                </div>
                <textarea
                  {...register('content', { required: true })}
                  rows={14}
                  className="input-field resize-y font-mono text-sm"
                  placeholder={`# Main Heading\n\nYour introduction paragraph here.\n\n## Section One\n\nWrite your section content here.\n\n- Bullet point one\n- Bullet point two\n\n## Section Two\n\n1. First step\n2. Second step\n\n> This is a pull quote or highlight.`}
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-[var(--text-muted)] mb-2">Cover Image</label>
                {imagePreview && (
                  <div className="relative h-32 rounded-xl overflow-hidden mb-2 border border-[var(--border)]">
                    <img src={imagePreview} alt="preview" className="w-full h-full object-cover" />
                    <span className="absolute bottom-2 left-2 text-xs text-white bg-black/50 px-2 py-0.5 rounded">
                      {imageFile ? 'New image selected' : 'Current image'}
                    </span>
                  </div>
                )}
                <input type="file" accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    setImageFile(file);
                    if (file) setImagePreview(URL.createObjectURL(file));
                  }}
                  className="input-field text-sm file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:bg-accent/20 file:text-accent" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2">
                  {saving ? <Loader2 size={15} className="animate-spin" /> : null}
                  {saving ? 'Saving...' : editItem ? 'Update Post' : 'Publish Post'}
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="btn-ghost">Cancel</button>
              </div>
            </form>
        </AdminModal>
      )}
    </div>
  );
}
