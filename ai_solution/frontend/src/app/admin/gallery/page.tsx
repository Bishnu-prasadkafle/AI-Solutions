'use client';
import { useEffect, useState } from 'react';
import { galleryAPI } from '@/lib/api';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import Image from 'next/image';
import AdminModal from '@/components/admin/AdminModal';
import { LoadingSpinner } from '@/components/ui/StateUI';
import { Plus, Trash2, Loader2, Upload } from 'lucide-react';
import FilterTabs from '@/components/ui/FilterTabs';

const MEDIA_URL = process.env.NEXT_PUBLIC_MEDIA_URL || 'http://localhost:8000';

const ADMIN_FILTER_TABS = [
  { value: 'all', label: 'All' },
  { value: 'upcoming', label: 'Upcoming Events' },
  { value: 'past', label: 'Past Events' },
  { value: 'general', label: 'Gallery' },
];

type GalleryForm = {
  title: string; description: string; type: string;
  event_date: string; start_time: string; end_time: string;
  location: string; organizer: string; website_url: string;
  participants_count: number; speakers: string; guests: string;
  agenda: string; is_featured: boolean; is_upcoming: boolean; order: number;
};

export default function AdminGalleryPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');
  const [saving, setSaving] = useState(false);

  const { register, handleSubmit, reset, setValue, watch } = useForm<GalleryForm>({ defaultValues: { type: 'general', order: 0, is_upcoming: false } });
  const watchType = watch('type');

  const fetchItems = (activeFilter = filter) => {
    setLoading(true);
    const params: Record<string, string> =
      activeFilter === 'upcoming' ? { upcoming: 'true' }
      : activeFilter === 'past' ? { past: 'true' }
      : activeFilter !== 'all' ? { type: activeFilter }
      : {};
    galleryAPI.list(params).then((r) => setItems(r.data.results || r.data)).finally(() => setLoading(false));
  };

  useEffect(() => { fetchItems(filter); }, [filter]);

  const openNew = () => {
    setEditItem(null);
    reset({ type: 'general', order: 0 });
    setImageFile(null);
    setPreview('');
    setShowForm(true);
  };

  const openEdit = (item: any) => {
    setEditItem(item);
    Object.keys(item).forEach((k) => setValue(k as any, item[k]));
    setPreview(item.image_url || (item.image ? (item.image.startsWith('http') ? item.image : `${MEDIA_URL}${item.image}`) : ''));
    setShowForm(true);
  };

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const onSubmit = async (data: GalleryForm) => {
    if (!editItem && !imageFile) { toast.error('Please select an image'); return; }
    setSaving(true);
    try {
      const fd = new FormData();
      const excluded = ['image', 'image_url', 'created_at'];
      Object.entries(data).forEach(([k, v]) => {
        if (!excluded.includes(k)) fd.append(k, String(v));
      });
      if (imageFile) fd.append('image', imageFile);

      if (editItem) {
        await galleryAPI.patch(editItem.id, fd);
        toast.success('Gallery item updated');
      } else {
        await galleryAPI.create(fd);
        toast.success('Gallery item uploaded');
      }
      setShowForm(false);
      fetchItems(filter);
    } catch {
      toast.error('Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this item?')) return;
    try {
      await galleryAPI.delete(id);
      toast.success('Deleted');
      fetchItems(filter);
    } catch { toast.error('Failed'); }
  };

  return (
    <div>
      <FilterTabs tabs={ADMIN_FILTER_TABS} active={filter} onChange={(val) => { setFilter(val); }} />

      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>Gallery</h1>
          <p className="text-[var(--text-secondary)] mt-1">Manage photos and event media</p>
        </div>
        <button onClick={openNew} className="btn-primary flex items-center gap-2">
          <Upload size={16} /> Upload Media
        </button>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.length === 0 ? (
            <div className="col-span-4 text-center py-16 text-[var(--text-muted)]">No gallery items yet</div>
          ) : items.map((item: any) => (
            <div key={item.id} className="glass rounded-xl overflow-hidden group relative">
              <div className="relative h-44 bg-[var(--bg-card)]">
                {(item.image_url || item.image) && (
                  <Image
                    src={item.image_url || (item.image.startsWith('http') ? item.image : `${MEDIA_URL}${item.image}`)}
                    alt={item.title}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="flex gap-2">
                    <button onClick={() => openEdit(item)} className="p-2 rounded-lg bg-white/20 text-white hover:bg-accent/40 transition-all">
                      <Plus size={14} />
                    </button>
                    <button onClick={() => handleDelete(item.id)} className="p-2 rounded-lg bg-white/20 text-white hover:bg-red-400/40 transition-all">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                <div className="absolute top-2 left-2 flex gap-1">
                  <span className={`badge ${item.type === 'event' ? 'badge-cyan' : 'badge-green'} text-[10px]`}>{item.type}</span>
                  {item.type === 'event' && (
                    <span className={`badge text-[10px] ${item.is_upcoming ? 'badge-orange' : 'badge-green'}`}>
                      {item.is_upcoming ? 'Upcoming' : 'Past'}
                    </span>
                  )}
                </div>
              </div>
              <div className="p-3">
                <p className="text-sm text-white font-medium truncate">{item.title}</p>
                {item.event_date && <p className="text-xs text-[var(--text-muted)] mt-0.5">{new Date(item.event_date).toLocaleDateString()}</p>}
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <AdminModal title={editItem ? 'Edit Item' : 'Upload Media'} onClose={() => setShowForm(false)}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Image drop area */}
              <div
                className="relative border-2 border-dashed border-[var(--border)] rounded-xl p-6 text-center cursor-pointer hover:border-accent/40 transition-all"
                onClick={() => document.getElementById('gallery-img')?.click()}
              >
                {preview ? (
                  <div className="relative h-40 rounded-lg overflow-hidden">
                    <Image src={preview} alt="preview" fill className="object-cover" />
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2 text-[var(--text-muted)]">
                    <Upload size={24} />
                    <p className="text-sm">Click to upload image</p>
                    <p className="text-xs">PNG, JPG, WebP supported</p>
                  </div>
                )}
                <input id="gallery-img" type="file" accept="image/*" className="hidden" onChange={handleImage} />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-[var(--text-muted)] mb-2">Title *</label>
                <input {...register('title', { required: true })} className="input-field" placeholder="Event or gallery title" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-[var(--text-muted)] mb-2">Description</label>
                <textarea {...register('description')} rows={2} className="input-field resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[var(--text-muted)] mb-2">Type</label>
                  <select {...register('type')} className="input-field">
                    <option value="general">General</option>
                    <option value="event">Event</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[var(--text-muted)] mb-2">Event Date</label>
                  <input {...register('event_date')} type="date" className="input-field" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[var(--text-muted)] mb-2">Start Time</label>
                  <input {...register('start_time')} type="time" className="input-field" />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[var(--text-muted)] mb-2">End Time</label>
                  <input {...register('end_time')} type="time" className="input-field" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[var(--text-muted)] mb-2">Location</label>
                  <input {...register('location')} className="input-field" placeholder="City, Country" />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[var(--text-muted)] mb-2">Organizer</label>
                  <input {...register('organizer')} className="input-field" placeholder="Company or person" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[var(--text-muted)] mb-2">Website URL</label>
                  <input {...register('website_url')} className="input-field" placeholder="https://" />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[var(--text-muted)] mb-2">Expected Participants</label>
                  <input {...register('participants_count')} type="number" className="input-field" placeholder="e.g. 500" />
                </div>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-[var(--text-muted)] mb-2">Speakers <span className="normal-case text-[var(--text-muted)]">(one per line: Name, Title)</span></label>
                <textarea {...register('speakers')} rows={3} className="input-field resize-none" placeholder="John Doe, CEO\nJane Smith, CTO" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-[var(--text-muted)] mb-2">Guests <span className="normal-case text-[var(--text-muted)]">(one per line: Name, Role)</span></label>
                <textarea {...register('guests')} rows={3} className="input-field resize-none" placeholder="Alice Brown, VIP Guest\nBob Lee, Industry Expert" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-[var(--text-muted)] mb-2">Agenda <span className="normal-case text-[var(--text-muted)]">(one per line: HH:MM - Description)</span></label>
                <textarea {...register('agenda')} rows={4} className="input-field resize-none" placeholder="09:00 - Registration\n10:00 - Opening Keynote\n11:00 - Panel Discussion" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-[var(--text-muted)] mb-2">Order</label>
                <input {...register('order')} type="number" className="input-field" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input {...register('is_featured')} type="checkbox" className="w-4 h-4 accent-[var(--accent)]" />
                  <span className="text-sm text-[var(--text-secondary)]">Mark as Featured</span>
                </label>
                {watchType === 'event' && (
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input {...register('is_upcoming')} type="checkbox" className="w-4 h-4 accent-orange-400" />
                    <span className="text-sm text-[var(--text-secondary)]">Mark as Upcoming Event</span>
                  </label>
                )}
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2">
                  {saving ? <Loader2 size={15} className="animate-spin" /> : <Upload size={15} />}
                  {saving ? 'Saving...' : editItem ? 'Update' : 'Upload'}
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="btn-ghost">Cancel</button>
              </div>
            </form>
        </AdminModal>
      )}
    </div>
  );
}
