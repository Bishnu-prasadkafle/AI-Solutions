'use client';
import { useEffect, useState } from 'react';
import { servicesAPI } from '@/lib/api';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import AdminModal from '@/components/admin/AdminModal';
import { LoadingSpinner } from '@/components/ui/StateUI';
import { Plus, Pencil, Trash2, X, Loader2, CheckCircle, XCircle } from 'lucide-react';

type ServiceForm = {
  title: string; slug: string; description: string;
  short_description: string; icon: string;
  is_active: boolean; order: number;
};

export default function AdminServicesPage() {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [features, setFeatures] = useState<string[]>(['']);
  const [saving, setSaving] = useState(false);

  const { register, handleSubmit, reset, setValue } = useForm<ServiceForm>();

  const fetchServices = () => {
    setLoading(true);
    servicesAPI.list().then((r) => setServices(r.data.results || r.data)).finally(() => setLoading(false));
  };

  useEffect(() => { fetchServices(); }, []);

  const openNew = () => {
    setEditItem(null);
    reset({ is_active: true, order: 0 });
    setFeatures(['']);
    setImageFile(null);
    setImagePreview('');
    setShowForm(true);
  };

  const openEdit = (item: any) => {
    setEditItem(item);
    setValue('title', item.title);
    setValue('slug', item.slug);
    setValue('description', item.description);
    setValue('short_description', item.short_description || '');
    setValue('icon', item.icon || '');
    setValue('is_active', item.is_active);
    setValue('order', item.order);
    setFeatures(item.features?.length ? item.features : ['']);
    setImageFile(null);
    setImagePreview(item.image || '');
    setShowForm(true);
  };

  const onSubmit = async (data: ServiceForm) => {
    setSaving(true);
    try {
      const fd = new FormData();
      const excluded = ['image', 'image_url', 'created_at', 'updated_at'];
      Object.entries(data).forEach(([k, v]) => {
        if (!excluded.includes(k)) fd.append(k, String(v));
      });
      fd.append('features', JSON.stringify(features.filter(Boolean)));
      if (imageFile) fd.append('image', imageFile);

      if (editItem) {
        await servicesAPI.patch(editItem.id, fd);
        toast.success('Service updated');
      } else {
        await servicesAPI.create(fd);
        toast.success('Service created');
      }
      setShowForm(false);
      fetchServices();
    } catch {
      toast.error('Failed to save service');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this service?')) return;
    try {
      await servicesAPI.delete(id);
      toast.success('Deleted');
      fetchServices();
    } catch {
      toast.error('Failed to delete');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>Services</h1>
          <p className="text-[var(--text-secondary)] mt-1">Manage your service offerings</p>
        </div>
        <button onClick={openNew} className="btn-primary flex items-center gap-2">
          <Plus size={16} /> Add Service
        </button>
      </div>

      <div className="glass rounded-xl overflow-hidden">
        {loading ? (
          <LoadingSpinner />
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Service</th>
                <th>Status</th>
                <th>Order</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {services.length === 0 ? (
                <tr><td colSpan={4} className="text-center py-10 text-[var(--text-muted)]">No services yet</td></tr>
              ) : services.map((s: any) => (
                <tr key={s.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      {s.icon && <span className="text-2xl">{s.icon}</span>}
                      <div>
                        <p className="text-white font-medium">{s.title}</p>
                        <p className="text-xs text-[var(--text-muted)]">{s.short_description?.slice(0, 60) || s.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    {s.is_active
                      ? <span className="badge badge-green flex items-center gap-1 w-fit"><CheckCircle size={11} /> Active</span>
                      : <span className="badge badge-red flex items-center gap-1 w-fit"><XCircle size={11} /> Inactive</span>}
                  </td>
                  <td>{s.order}</td>
                  <td>
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(s)} className="p-2 rounded-lg text-[var(--text-muted)] hover:text-accent hover:bg-accent/10 transition-all">
                        <Pencil size={15} />
                      </button>
                      <button onClick={() => handleDelete(s.id)} className="p-2 rounded-lg text-[var(--text-muted)] hover:text-red-400 hover:bg-red-400/10 transition-all">
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
        <AdminModal title={editItem ? 'Edit Service' : 'New Service'} onClose={() => setShowForm(false)}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[var(--text-muted)] mb-2">Title *</label>
                  <input {...register('title', { required: true })} className="input-field" placeholder="Service Title" />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[var(--text-muted)] mb-2">Slug *</label>
                  <input {...register('slug', { required: true })} className="input-field" placeholder="service-slug" />
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
                  <label className="block text-xs uppercase tracking-wider text-[var(--text-muted)] mb-2">Icon (emoji)</label>
                  <input {...register('icon')} className="input-field" placeholder="🤖" />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[var(--text-muted)] mb-2">Order</label>
                  <input {...register('order')} type="number" className="input-field" />
                </div>
                <div className="flex items-end pb-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input {...register('is_active')} type="checkbox" className="w-4 h-4 accent-[var(--accent)]" />
                    <span className="text-sm text-[var(--text-secondary)]">Active</span>
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-[var(--text-muted)] mb-2">Features</label>
                {features.map((f, i) => (
                  <div key={i} className="flex gap-2 mb-2">
                    <input
                      value={f}
                      onChange={(e) => { const arr = [...features]; arr[i] = e.target.value; setFeatures(arr); }}
                      className="input-field text-sm"
                      placeholder={`Feature ${i + 1}`}
                    />
                    <button type="button" onClick={() => setFeatures(features.filter((_, j) => j !== i))}
                      className="p-2 rounded-lg text-[var(--text-muted)] hover:text-red-400 transition-colors">
                      <X size={14} />
                    </button>
                  </div>
                ))}
                <button type="button" onClick={() => setFeatures([...features, ''])} className="text-xs text-accent hover:text-accent/80 transition-colors">
                  + Add Feature
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
                <input
                  type="file" accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    setImageFile(file);
                    if (file) setImagePreview(URL.createObjectURL(file));
                  }}
                  className="input-field text-sm file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:bg-accent/20 file:text-accent"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2">
                  {saving ? <Loader2 size={15} className="animate-spin" /> : null}
                  {saving ? 'Saving...' : editItem ? 'Update Service' : 'Create Service'}
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="btn-ghost">Cancel</button>
              </div>
            </form>
        </AdminModal>
      )}
    </div>
  );
}
