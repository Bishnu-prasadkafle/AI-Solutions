'use client';
import { useEffect, useState } from 'react';
import { feedbackAPI } from '@/lib/api';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import FilterTabs from '@/components/ui/FilterTabs';
import AdminModal from '@/components/admin/AdminModal';
import ConfirmModal from '@/components/admin/ConfirmModal';
import StatusModal from '@/components/admin/StatusModal';
import { LoadingSpinner } from '@/components/ui/StateUI';
import { Star, Trash2, Plus, Loader2, Pencil } from 'lucide-react';

type FeedbackForm = { name: string; email: string; company: string; message: string; is_approved: boolean; };

const MEDIA_URL = process.env.NEXT_PUBLIC_MEDIA_URL || 'http://localhost:8000';
const FILTER_TABS = [{ value: '', label: 'All' }, { value: 'false', label: 'Pending' }, { value: 'true', label: 'Approved' }];

function avatarSrc(path?: string) {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  return `${MEDIA_URL}${path}`;
}

export default function AdminFeedbackPage() {
  const [feedback, setFeedback]       = useState<any[]>([]);
  const [loading, setLoading]         = useState(true);
  const [filter, setFilter]           = useState('');
  const [showForm, setShowForm]       = useState(false);
  const [editItem, setEditItem]       = useState<any>(null);
  const [saving, setSaving]           = useState(false);
  const [rating, setRating]           = useState(5);
  const [hover, setHover]             = useState(0);
  const [avatarFile, setAvatarFile]   = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const { register, handleSubmit, reset, setValue } = useForm<FeedbackForm>();

  const fetchFeedback = () => {
    setLoading(true);
    const params: Record<string, string> = filter !== '' ? { is_approved: filter } : {};
    feedbackAPI.list(params).then((r) => setFeedback(r.data.results || r.data)).finally(() => setLoading(false));
  };

  useEffect(() => { fetchFeedback(); }, [filter]);

  const openNew = () => {
    setEditItem(null);
    reset({ name: '', email: '', company: '', message: '', is_approved: false });
    setRating(5);
    setAvatarFile(null);
    setAvatarPreview(null);
    setShowForm(true);
  };

  const openEdit = (item: any) => {
    setEditItem(item);
    setValue('name', item.name);
    setValue('email', item.email);
    setValue('company', item.company || '');
    setValue('message', item.message);
    setValue('is_approved', item.is_approved);
    setRating(item.rating);
    setAvatarFile(null);
    setAvatarPreview(avatarSrc(item.avatar));
    setShowForm(true);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setAvatarFile(file);
    setAvatarPreview(file ? URL.createObjectURL(file) : avatarSrc(editItem?.avatar));
  };

  const onSubmit = async (data: FeedbackForm) => {
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append('name', data.name);
      fd.append('email', data.email);
      fd.append('company', data.company || '');
      fd.append('rating', String(rating));
      fd.append('message', data.message);
      fd.append('is_approved', String(data.is_approved));
      if (avatarFile) fd.append('avatar', avatarFile);

      if (editItem) {
        await feedbackAPI.update(editItem.id, fd);
      } else {
        await feedbackAPI.create(fd);
      }
      setShowForm(false);
      fetchFeedback();
      setStatusMsg({ type: 'success', message: editItem ? 'Feedback updated successfully!' : 'Feedback posted successfully!' });
    } catch {
      setStatusMsg({ type: 'error', message: 'Failed to save feedback. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  const setApproval = async (id: number, approve: boolean) => {
    try {
      // Only call API if current state differs
      const current = feedback.find((f) => f.id === id);
      if (current?.is_approved === approve) return;
      await feedbackAPI.approve(id);
      toast.success(approve ? 'Approved — now visible publicly' : 'Unapproved — hidden from public');
      fetchFeedback();
    } catch { toast.error('Failed to update status'); }
  };

  const handleDelete = async (id: number) => {
    await feedbackAPI.delete(id);
    fetchFeedback();
  };

  const approved = feedback.filter((f) => f.is_approved);
  const avgRating = approved.length
    ? (approved.reduce((a, f) => a + f.rating, 0) / approved.length).toFixed(1)
    : '—';

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>Feedback</h1>
          <p className="text-[var(--text-secondary)] mt-1">Manage client reviews and testimonials</p>
        </div>
        <div className="flex items-center gap-4">
          {approved.length > 0 && (
            <div className="glass rounded-xl px-5 py-3 flex items-center gap-3">
              <Star size={16} className="text-yellow-400 fill-yellow-400" />
              <div>
                <p className="text-xl font-bold text-white leading-none" style={{ fontFamily: 'var(--font-display)' }}>{avgRating}</p>
                <p className="text-xs text-[var(--text-muted)] mt-0.5">{approved.length} approved</p>
              </div>
            </div>
          )}
          <button onClick={openNew} className="btn-primary flex items-center gap-2">
            <Plus size={16} /> Add Feedback
          </button>
        </div>
      </div>

      <FilterTabs tabs={FILTER_TABS} active={filter} onChange={setFilter} />

      <div className="glass rounded-xl overflow-hidden">
        {loading ? <LoadingSpinner /> : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Reviewer</th>
                <th>Rating</th>
                <th>Message</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {feedback.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-10 text-[var(--text-muted)]">No feedback yet</td></tr>
              ) : feedback.map((f: any) => (
                <tr key={f.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      {/* Avatar */}
                      {avatarSrc(f.avatar) ? (
                        <img src={avatarSrc(f.avatar)!} alt={f.name} className="w-9 h-9 rounded-full object-cover border border-[var(--border)] shrink-0" />
                      ) : (
                        <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0" style={{ background: 'linear-gradient(135deg, #285A48, #408A71)' }}>
                          {f.name?.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <p className="text-white font-medium text-sm">{f.name}</p>
                        <p className="text-xs text-[var(--text-muted)]">{f.email}</p>
                        {f.company && <p className="text-xs text-[var(--accent-light)]">{f.company}</p>}
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} size={12} className={i < f.rating ? 'text-yellow-400 fill-yellow-400' : 'text-[var(--text-muted)]'} />
                      ))}
                    </div>
                  </td>
                  <td><p className="text-sm text-[var(--text-secondary)] max-w-xs truncate">"{f.message}"</p></td>
                  <td className="text-xs text-[var(--text-muted)]">{new Date(f.created_at).toLocaleDateString('en-GB')}</td>
                  <td>
                    <select
                      value={f.is_approved ? 'true' : 'false'}
                      onChange={(e) => setApproval(f.id, e.target.value === 'true')}
                      className={`text-xs rounded-lg px-3 py-1.5 border outline-none cursor-pointer transition-colors ${
                        f.is_approved
                          ? 'bg-green-500/10 border-green-500/30 text-green-400'
                          : 'bg-orange-500/10 border-orange-500/30 text-orange-400'
                      }`}
                    >
                      <option value="false">⏳ Pending</option>
                      <option value="true">✅ Approved</option>
                    </select>
                  </td>
                  <td>
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(f)} className="p-2 rounded-lg text-[var(--text-muted)] hover:text-accent hover:bg-accent/10 transition-all" title="Edit">
                        <Pencil size={14} />
                      </button>
                      <button onClick={() => setDeleteId(f.id)} className="p-2 rounded-lg text-[var(--text-muted)] hover:text-red-400 hover:bg-red-400/10 transition-all" title="Delete">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {statusMsg && (
        <StatusModal type={statusMsg.type} message={statusMsg.message} onClose={() => setStatusMsg(null)} />
      )}

      {deleteId !== null && (
        <ConfirmModal
          message="This feedback will be permanently deleted."
          successMessage="Feedback deleted successfully!"
          onConfirm={() => handleDelete(deleteId)}
          onClose={() => setDeleteId(null)}
        />
      )}

      {/* Add / Edit Modal */}
      {showForm && (
        <AdminModal title={editItem ? 'Edit Feedback' : 'Add Feedback'} onClose={() => setShowForm(false)}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

            {/* Avatar preview + upload */}
            <div className="flex items-center gap-5 p-4 glass rounded-xl">
              <div className="shrink-0">
                {avatarPreview ? (
                  <img src={avatarPreview} alt="avatar" className="w-16 h-16 rounded-full object-cover border-2" style={{ borderColor: 'rgba(64,138,113,0.5)' }} />
                ) : (
                  <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold text-white" style={{ background: 'linear-gradient(135deg, #285A48, #408A71)' }}>
                    ?
                  </div>
                )}
              </div>
              <div className="flex-1">
                <label className="block text-xs uppercase tracking-wider text-[var(--text-muted)] mb-2">Profile Photo</label>
                <input
                  type="file" accept="image/*"
                  onChange={handleAvatarChange}
                  className="input-field text-sm file:mr-3 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:bg-accent/20 file:text-accent"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-[var(--text-muted)] mb-2">Name *</label>
                <input {...register('name', { required: true })} className="input-field" placeholder="Jane Doe" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-[var(--text-muted)] mb-2">Email *</label>
                <input {...register('email', { required: true })} type="email" className="input-field" placeholder="jane@company.com" />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-[var(--text-muted)] mb-2">Company / Job Title</label>
              <input {...register('company')} className="input-field" placeholder="e.g. CEO at Acme Corp" />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-[var(--text-muted)] mb-2">Rating</label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button key={s} type="button" onClick={() => setRating(s)} onMouseEnter={() => setHover(s)} onMouseLeave={() => setHover(0)}>
                    <Star size={28} className="transition-colors" fill={(hover || rating) >= s ? '#ffc107' : 'none'} color={(hover || rating) >= s ? '#ffc107' : 'var(--text-muted)'} />
                  </button>
                ))}
                <span className="ml-3 text-sm text-[var(--text-muted)] self-center">{rating}/5</span>
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-[var(--text-muted)] mb-2">Testimonial *</label>
              <textarea {...register('message', { required: true })} rows={4} className="input-field resize-none" placeholder="Write the client's testimonial here..." />
            </div>

            <label className="flex items-center gap-3 cursor-pointer select-none">
              <input type="checkbox" {...register('is_approved')} className="w-4 h-4 accent-[var(--accent)] rounded" />
              <span className="text-sm text-[var(--text-secondary)]">Approve immediately (show on public site)</span>
            </label>

            <div className="flex gap-3 pt-2">
              <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2">
                {saving && <Loader2 size={15} className="animate-spin" />}
                {saving ? 'Saving...' : editItem ? 'Update Feedback' : 'Post Feedback'}
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="btn-ghost">Cancel</button>
            </div>
          </form>
        </AdminModal>
      )}
    </div>
  );
}
