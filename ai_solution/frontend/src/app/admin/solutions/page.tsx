'use client';
import { useEffect, useState } from 'react';
import { solutionsAPI } from '@/lib/api';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import AdminModal from '@/components/admin/AdminModal';
import ConfirmModal from '@/components/admin/ConfirmModal';
import StatusModal from '@/components/admin/StatusModal';
import { LoadingSpinner } from '@/components/ui/StateUI';
import { Plus, Pencil, Trash2, X, Loader2, CheckCircle, Clock, Rocket } from 'lucide-react';

type SolutionForm = {
  title: string; industry: string; description: string;
  short_description: string; status: string; year: string;
  is_active: boolean; order: number;
};

const STATUS_META: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  deployed: { label: 'Deployed', color: 'text-green-400', icon: <CheckCircle size={11} /> },
  in_development: { label: 'In Development', color: 'text-yellow-400', icon: <Clock size={11} /> },
  ready_to_launch: { label: 'Ready to Launch', color: 'text-blue-400', icon: <Rocket size={11} /> },
};

export default function AdminSolutionsPage() {
  const [solutions, setSolutions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState('');
  const [technologies, setTechnologies] = useState<string[]>(['']);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const { register, handleSubmit, reset, setValue } = useForm<SolutionForm>();

  const fetchSolutions = () => {
    setLoading(true);
    solutionsAPI.list().then((r) => setSolutions(r.data.results || r.data)).finally(() => setLoading(false));
  };

  useEffect(() => { fetchSolutions(); }, []);

  const openNew = () => {
    setEditItem(null);
    reset({ status: 'deployed', is_active: true, order: 0 });
    setTechnologies(['']);
    setImageFile(null);
    setImagePreview('');
    setShowForm(true);
  };

  const openEdit = (item: any) => {
    setEditItem(item);
    setValue('title', item.title);
    setValue('industry', item.industry);
    setValue('description', item.description);
    setValue('short_description', item.short_description || '');
    setValue('status', item.status);
    setValue('year', item.year || '');
    setValue('is_active', item.is_active);
    setValue('order', item.order);
    setTechnologies(item.technologies?.length ? item.technologies : ['']);
    setImageFile(null);
    setImagePreview(item.image_url || item.image || '');
    setShowForm(true);
  };

  const onSubmit = async (data: SolutionForm) => {
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(data).forEach(([k, v]) => {
        if (!['image', 'image_url', 'created_at', 'updated_at'].includes(k) && v !== undefined && v !== null)
          fd.append(k, String(v));
      });
      fd.append('technologies', JSON.stringify(technologies.filter(Boolean)));
      if (imageFile) fd.append('image', imageFile);
      if (editItem) {
        await solutionsAPI.patch(editItem.id, fd);
      } else {
        await solutionsAPI.create(fd);
      }
      setShowForm(false);
      fetchSolutions();
      setStatusMsg({ type: 'success', message: editItem ? 'Solution updated successfully!' : 'Solution created successfully!' });
    } catch {
      setStatusMsg({ type: 'error', message: 'Failed to save solution. Please try again.' });
    }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: number) => {
    await solutionsAPI.delete(id);
    fetchSolutions();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>Solutions</h1>
          <p className="text-[var(--text-secondary)] mt-1">Manage past and upcoming industry solutions</p>
        </div>
        <button onClick={openNew} className="btn-primary flex items-center gap-2">
          <Plus size={16} /> Add Solution
        </button>
      </div>

      <div className="glass rounded-xl overflow-hidden">
        {loading ? <LoadingSpinner /> : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Solution</th><th>Industry</th><th>Status</th><th>Year</th><th>Active</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {solutions.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-10 text-[var(--text-muted)]">No solutions yet</td></tr>
              ) : solutions.map((s: any) => {
                const meta = STATUS_META[s.status];
                return (
                  <tr key={s.id}>
                    <td>
                      <div className="flex items-center gap-3">
                        {(s.image_url || s.image) && (
                          <img src={s.image_url || s.image} alt={s.title} className="w-10 h-10 rounded-lg object-cover" />
                        )}
                        <div>
                          <p className="text-white font-medium">{s.title}</p>
                          <p className="text-xs text-[var(--text-muted)]">{s.short_description?.slice(0, 55) || '—'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="text-[var(--text-secondary)]">{s.industry}</td>
                    <td>
                      {meta && <span className={`flex items-center gap-1 text-xs font-medium ${meta.color}`}>{meta.icon} {meta.label}</span>}
                    </td>
                    <td className="text-[var(--text-secondary)]">{s.year || '—'}</td>
                    <td>{s.is_active ? <span className="badge badge-green">Active</span> : <span className="badge badge-red">Inactive</span>}</td>
                    <td>
                      <div className="flex gap-2">
                        <button onClick={() => openEdit(s)} className="p-2 rounded-lg text-[var(--text-muted)] hover:text-accent hover:bg-accent/10 transition-all"><Pencil size={15} /></button>
                        <button onClick={() => setDeleteId(s.id)} className="p-2 rounded-lg text-[var(--text-muted)] hover:text-red-400 hover:bg-red-400/10 transition-all"><Trash2 size={15} /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {statusMsg && (
        <StatusModal type={statusMsg.type} message={statusMsg.message} onClose={() => setStatusMsg(null)} />
      )}

      {deleteId !== null && (
        <ConfirmModal
          message="This solution will be permanently deleted."
          successMessage="Solution deleted successfully!"
          onConfirm={() => handleDelete(deleteId)}
          onClose={() => setDeleteId(null)}
        />
      )}

      {showForm && (
        <AdminModal title={editItem ? 'Edit Solution' : 'New Solution'} onClose={() => setShowForm(false)} wide>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-[var(--text-muted)] mb-2">Title *</label>
                <input {...register('title', { required: true })} className="input-field" placeholder="Solution Title" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-[var(--text-muted)] mb-2">Industry *</label>
                <input {...register('industry', { required: true })} className="input-field" placeholder="e.g. Healthcare, Finance" />
              </div>
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-[var(--text-muted)] mb-2">Short Description</label>
              <input {...register('short_description')} className="input-field" placeholder="Brief summary (max 300 chars)" />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-[var(--text-muted)] mb-2">Full Description *</label>
              <textarea {...register('description', { required: true })} rows={4} className="input-field resize-none" />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-[var(--text-muted)] mb-2">Status *</label>
                <select {...register('status', { required: true })} className="input-field">
                  <option value="deployed">Deployed</option>
                  <option value="in_development">In Development</option>
                  <option value="ready_to_launch">Ready to Launch</option>
                </select>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-[var(--text-muted)] mb-2">Year</label>
                <input {...register('year')} type="number" className="input-field" placeholder="2024" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-[var(--text-muted)] mb-2">Order</label>
                <input {...register('order')} type="number" className="input-field" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input {...register('is_active')} type="checkbox" className="w-4 h-4 accent-[var(--accent)]" />
              <span className="text-sm text-[var(--text-secondary)]">Active (visible on website)</span>
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-[var(--text-muted)] mb-2">Technologies / Stack</label>
              {technologies.map((t, i) => (
                <div key={i} className="flex gap-2 mb-2">
                  <input
                    value={t}
                    onChange={(e) => { const arr = [...technologies]; arr[i] = e.target.value; setTechnologies(arr); }}
                    className="input-field text-sm" placeholder="e.g. Python, React, AWS"
                  />
                  <button type="button" onClick={() => setTechnologies(technologies.filter((_, j) => j !== i))}
                    className="p-2 rounded-lg text-[var(--text-muted)] hover:text-red-400 transition-colors">
                    <X size={14} />
                  </button>
                </div>
              ))}
              <button type="button" onClick={() => setTechnologies([...technologies, ''])} className="text-xs text-accent hover:text-accent/80">
                + Add Technology
              </button>
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-[var(--text-muted)] mb-2">Image</label>
              {imagePreview && (
                <div className="relative h-32 rounded-xl overflow-hidden mb-2 border border-[var(--border)]">
                  <img src={imagePreview} alt="preview" className="w-full h-full object-cover" />
                  <span className="absolute bottom-2 left-2 text-xs text-white bg-black/50 px-2 py-0.5 rounded">
                    {imageFile ? 'New image selected' : 'Current image'}
                  </span>
                </div>
              )}
              <input type="file" accept="image/*"
                onChange={(e) => { const f = e.target.files?.[0] || null; setImageFile(f); if (f) setImagePreview(URL.createObjectURL(f)); }}
                className="input-field text-sm file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:bg-accent/20 file:text-accent"
              />
            </div>
            <div className="flex gap-3 pt-2">
              <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2">
                {saving && <Loader2 size={15} className="animate-spin" />}
                {saving ? 'Saving...' : editItem ? 'Update Solution' : 'Create Solution'}
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="btn-ghost">Cancel</button>
            </div>
          </form>
        </AdminModal>
      )}
    </div>
  );
}
