'use client';
import { useEffect, useState } from 'react';
import { galleryAPI } from '@/lib/api';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import ConfirmModal from '@/components/admin/ConfirmModal';
import StatusModal from '@/components/admin/StatusModal';
import Image from 'next/image';
import AdminModal from '@/components/admin/AdminModal';
import { LoadingSpinner } from '@/components/ui/StateUI';
import { Pencil, Trash2, Loader2, Upload, ImagePlus, CalendarPlus } from 'lucide-react';
import FilterTabs from '@/components/ui/FilterTabs';

const MEDIA_URL = process.env.NEXT_PUBLIC_MEDIA_URL || 'http://localhost:8000';

const ADMIN_FILTER_TABS = [
  { value: 'all',      label: 'All' },
  { value: 'general',  label: 'Gallery Photos' },
  { value: 'upcoming', label: 'Upcoming Events' },
  { value: 'past',     label: 'Past Events' },
];

// ── Gallery photo form (type = general) ───────────────────────────────
type GalleryForm = {
  title: string;
  description: string;
  is_featured: boolean;
  order: number;
};

// ── Event form (type = event) ──────────────────────────────────────────
type EventForm = {
  title: string;
  description: string;
  event_date: string;
  start_time: string;
  end_time: string;
  location: string;
  organizer: string;
  website_url: string;
  participants_count: number;
  speakers: string;
  guests: string;
  agenda: string;
  is_featured: boolean;
  is_upcoming: boolean;
  order: number;
};

// ── Image uploader (shared) ────────────────────────────────────────────
function ImageUploader({ preview, onChange, inputId }: {
  preview: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; inputId: string;
}) {
  return (
    <div
      className="relative border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all"
      style={{ borderColor: 'var(--border)' }}
      onClick={() => document.getElementById(inputId)?.click()}
      onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = 'rgba(64,138,113,0.5)'}
      onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'}
    >
      {preview ? (
        <div className="relative h-36 rounded-lg overflow-hidden">
          <Image src={preview} alt="preview" fill className="object-cover" unoptimized />
        </div>
      ) : (
        <div className="flex flex-col items-center gap-2 py-4" style={{ color: 'var(--text-muted)' }}>
          <Upload size={22} />
          <p className="text-sm">Click to upload image</p>
          <p className="text-xs">PNG, JPG, WebP</p>
        </div>
      )}
      <input id={inputId} type="file" accept="image/*" className="hidden" onChange={onChange} />
    </div>
  );
}

// ── Gallery photo modal ────────────────────────────────────────────────
function GalleryModal({ editItem, onClose, onSaved, onStatus }: {
  editItem: any | null; onClose: () => void; onSaved: () => void;
  onStatus: (s: { type: 'success' | 'error'; message: string }) => void;
}) {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState(
    editItem?.image_url || (editItem?.image
      ? (editItem.image.startsWith('http') ? editItem.image : `${MEDIA_URL}${editItem.image}`)
      : '')
  );
  const [saving, setSaving] = useState(false);
  const { register, handleSubmit } = useForm<GalleryForm>({
    defaultValues: {
      title: editItem?.title || '',
      description: editItem?.description || '',
      is_featured: editItem?.is_featured || false,
      order: editItem?.order || 0,
    },
  });

  const handleImg = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setImageFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const onSubmit = async (data: GalleryForm) => {
    if (!editItem && !imageFile) { toast.error('Please select an image'); return; }
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append('type', 'general');
      fd.append('title', data.title);
      fd.append('description', data.description || '');
      fd.append('is_featured', String(data.is_featured));
      fd.append('order', String(data.order || 0));
      if (imageFile) fd.append('image', imageFile);

      if (editItem) {
        await galleryAPI.patch(editItem.id, fd);
      } else {
        await galleryAPI.create(fd);
      }
      onSaved();
      onClose();
      onStatus({ type: 'success', message: editItem ? 'Photo updated successfully!' : 'Photo uploaded successfully!' });
    } catch {
      onStatus({ type: 'error', message: 'Failed to save photo. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminModal title={editItem ? 'Edit Gallery Photo' : 'Add Gallery Photo'} onClose={onClose}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <ImageUploader preview={preview} onChange={handleImg} inputId="gallery-photo-img" />

        <div>
          <label className="block text-xs uppercase tracking-wider text-[var(--text-muted)] mb-2">Title *</label>
          <input {...register('title', { required: true })} className="input-field" placeholder="e.g. Head Office Reception" />
        </div>

        <div>
          <label className="block text-xs uppercase tracking-wider text-[var(--text-muted)] mb-2">Description</label>
          <textarea {...register('description')} rows={2} className="input-field resize-none" placeholder="Brief caption..." />
        </div>

        <div className="grid grid-cols-2 gap-4 items-end">
          <div>
            <label className="block text-xs uppercase tracking-wider text-[var(--text-muted)] mb-2">Display Order</label>
            <input {...register('order')} type="number" className="input-field" />
          </div>
          <label className="flex items-center gap-2 cursor-pointer pb-1">
            <input {...register('is_featured')} type="checkbox" className="w-4 h-4 accent-[var(--accent)]" />
            <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Mark as Featured</span>
          </label>
        </div>

        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2">
            {saving ? <Loader2 size={15} className="animate-spin" /> : <Upload size={15} />}
            {saving ? 'Saving...' : editItem ? 'Update Photo' : 'Upload Photo'}
          </button>
          <button type="button" onClick={onClose} className="btn-ghost">Cancel</button>
        </div>
      </form>
    </AdminModal>
  );
}

// ── Event modal ────────────────────────────────────────────────────────
function EventModal({ editItem, onClose, onSaved, onStatus }: {
  editItem: any | null; onClose: () => void; onSaved: () => void;
  onStatus: (s: { type: 'success' | 'error'; message: string }) => void;
}) {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState(
    editItem?.image_url || (editItem?.image
      ? (editItem.image.startsWith('http') ? editItem.image : `${MEDIA_URL}${editItem.image}`)
      : '')
  );
  const [saving, setSaving] = useState(false);
  const { register, handleSubmit } = useForm<EventForm>({
    defaultValues: {
      title:              editItem?.title || '',
      description:        editItem?.description || '',
      event_date:         editItem?.event_date || '',
      start_time:         editItem?.start_time || '',
      end_time:           editItem?.end_time || '',
      location:           editItem?.location || '',
      organizer:          editItem?.organizer || '',
      website_url:        editItem?.website_url || '',
      participants_count: editItem?.participants_count || 0,
      speakers:           editItem?.speakers || '',
      guests:             editItem?.guests || '',
      agenda:             editItem?.agenda || '',
      is_featured:        editItem?.is_featured || false,
      is_upcoming:        editItem?.is_upcoming || false,
      order:              editItem?.order || 0,
    },
  });

  const handleImg = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setImageFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const onSubmit = async (data: EventForm) => {
    if (!editItem && !imageFile) { toast.error('Please select an image'); return; }
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append('type', 'event');
      const fields: (keyof EventForm)[] = [
        'title', 'description', 'event_date', 'start_time', 'end_time',
        'location', 'organizer', 'website_url', 'participants_count',
        'speakers', 'guests', 'agenda', 'is_featured', 'is_upcoming', 'order',
      ];
      fields.forEach(k => fd.append(k, String(data[k] ?? '')));
      if (imageFile) fd.append('image', imageFile);

      if (editItem) {
        await galleryAPI.patch(editItem.id, fd);
      } else {
        await galleryAPI.create(fd);
      }
      onSaved();
      onClose();
      onStatus({ type: 'success', message: editItem ? 'Event updated successfully!' : 'Event created successfully!' });
    } catch {
      onStatus({ type: 'error', message: 'Failed to save event. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminModal title={editItem ? 'Edit Event' : 'Add Event'} onClose={onClose} wide>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

        {/* Image */}
        <ImageUploader preview={preview} onChange={handleImg} inputId="event-img" />

        {/* Title + Description */}
        <div>
          <label className="block text-xs uppercase tracking-wider text-[var(--text-muted)] mb-2">Event Title *</label>
          <input {...register('title', { required: true })} className="input-field" placeholder="e.g. AI Summit 2025" />
        </div>
        <div>
          <label className="block text-xs uppercase tracking-wider text-[var(--text-muted)] mb-2">Description</label>
          <textarea {...register('description')} rows={2} className="input-field resize-none" placeholder="Brief overview of the event..." />
        </div>

        {/* Date & Time */}
        <div>
          <p className="text-xs uppercase tracking-widest font-semibold mb-3" style={{ color: 'var(--accent)' }}>Date & Time</p>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-[var(--text-muted)] mb-2">Event Date</label>
              <input {...register('event_date')} type="date" className="input-field" />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-[var(--text-muted)] mb-2">Start Time</label>
              <input {...register('start_time')} type="time" className="input-field" />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-[var(--text-muted)] mb-2">End Time</label>
              <input {...register('end_time')} type="time" className="input-field" />
            </div>
          </div>
        </div>

        {/* Location & Organizer */}
        <div>
          <p className="text-xs uppercase tracking-widest font-semibold mb-3" style={{ color: 'var(--accent)' }}>Venue & Organizer</p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-[var(--text-muted)] mb-2">Location</label>
              <input {...register('location')} className="input-field" placeholder="City, Country or Venue name" />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-[var(--text-muted)] mb-2">Organizer</label>
              <input {...register('organizer')} className="input-field" placeholder="Company or person name" />
            </div>
          </div>
        </div>

        {/* Website & Participants */}
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

        {/* Speakers / Guests / Agenda */}
        <div>
          <p className="text-xs uppercase tracking-widest font-semibold mb-4" style={{ color: 'var(--accent)' }}>
            People &amp; Schedule
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            {/* Speakers */}
            <div className="overflow-hidden rounded-xl" style={{ border: '1px solid var(--border)' }}>
              <div className="flex items-center justify-between px-4 py-2.5" style={{ background: 'rgba(64,138,113,0.08)', borderBottom: '1px solid var(--border)' }}>
                <span className="text-xs font-bold uppercase tracking-widest text-white">Speakers</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: 'var(--accent-dim)', color: 'var(--accent-light)', border: '1px solid rgba(64,138,113,0.25)' }}>
                  Full Name, Job Title
                </span>
              </div>
              <textarea
                {...register('speakers')}
                rows={6}
                className="w-full bg-transparent px-4 py-3 text-sm outline-none resize-none placeholder:opacity-25"
                style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', lineHeight: 1.7, caretColor: 'var(--accent-light)' }}
                placeholder={"Full Name, Job Title\nFull Name, Job Title\nFull Name, Job Title"}
              />
            </div>

            {/* Guests */}
            <div className="overflow-hidden rounded-xl" style={{ border: '1px solid var(--border)' }}>
              <div className="flex items-center justify-between px-4 py-2.5" style={{ background: 'rgba(64,138,113,0.08)', borderBottom: '1px solid var(--border)' }}>
                <span className="text-xs font-bold uppercase tracking-widest text-white">Guests</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: 'var(--accent-dim)', color: 'var(--accent-light)', border: '1px solid rgba(64,138,113,0.25)' }}>
                  Full Name, Role
                </span>
              </div>
              <textarea
                {...register('guests')}
                rows={6}
                className="w-full bg-transparent px-4 py-3 text-sm outline-none resize-none placeholder:opacity-25"
                style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', lineHeight: 1.7, caretColor: 'var(--accent-light)' }}
                placeholder={"Full Name, Organisation\nFull Name, Organisation\nFull Name, Organisation"}
              />
            </div>

            {/* Agenda */}
            <div className="overflow-hidden rounded-xl" style={{ border: '1px solid var(--border)' }}>
              <div className="flex items-center justify-between px-4 py-2.5" style={{ background: 'rgba(64,138,113,0.08)', borderBottom: '1px solid var(--border)' }}>
                <span className="text-xs font-bold uppercase tracking-widest text-white">Agenda</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: 'var(--accent-dim)', color: 'var(--accent-light)', border: '1px solid rgba(64,138,113,0.25)' }}>
                  HH:MM - Session
                </span>
              </div>
              <textarea
                {...register('agenda')}
                rows={6}
                className="w-full bg-transparent px-4 py-3 text-sm outline-none resize-none placeholder:opacity-25"
                style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', lineHeight: 1.7, caretColor: 'var(--accent-light)' }}
                placeholder={"HH:MM — Session\nHH:MM — Session\nHH:MM — Session"}
              />
            </div>

          </div>
        </div>

        {/* Order + flags */}
        <div className="grid grid-cols-2 gap-4 items-end pt-1">
          <div>
            <label className="block text-xs uppercase tracking-wider text-[var(--text-muted)] mb-2">Display Order</label>
            <input {...register('order')} type="number" className="input-field" />
          </div>
          <div className="flex flex-col gap-2 pb-1">
            <label className="flex items-center gap-2 cursor-pointer">
              <input {...register('is_upcoming')} type="checkbox" className="w-4 h-4 accent-orange-400" />
              <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Upcoming Event</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input {...register('is_featured')} type="checkbox" className="w-4 h-4 accent-[var(--accent)]" />
              <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Mark as Featured</span>
            </label>
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2">
            {saving ? <Loader2 size={15} className="animate-spin" /> : <CalendarPlus size={15} />}
            {saving ? 'Saving...' : editItem ? 'Update Event' : 'Create Event'}
          </button>
          <button type="button" onClick={onClose} className="btn-ghost">Cancel</button>
        </div>
      </form>
    </AdminModal>
  );
}

// ── Page ──────────────────────────────────────────────────────────────
type ModalMode = { kind: 'gallery'; item: any | null } | { kind: 'event'; item: any | null } | null;

export default function AdminGalleryPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [modal, setModal] = useState<ModalMode>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const fetchItems = (activeFilter = filter) => {
    setLoading(true);
    const params: Record<string, string> =
      activeFilter === 'upcoming' ? { upcoming: 'true' }
      : activeFilter === 'past'     ? { past: 'true' }
      : activeFilter !== 'all'      ? { type: activeFilter }
      : {};
    galleryAPI.list(params)
      .then(r => setItems(r.data.results || r.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchItems(filter); }, [filter]);

  const openEdit = (item: any) =>
    setModal({ kind: item.type === 'event' ? 'event' : 'gallery', item });

  const handleDelete = async (id: number) => {
    await galleryAPI.delete(id);
    fetchItems(filter);
  };

  return (
    <div>
      <FilterTabs tabs={ADMIN_FILTER_TABS} active={filter} onChange={setFilter} />

      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>
            Gallery &amp; Events
          </h1>
          <p className="mt-1" style={{ color: 'var(--text-secondary)' }}>
            Manage office photos and event media separately
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setModal({ kind: 'gallery', item: null })}
            className="btn-ghost flex items-center gap-2 text-sm"
          >
            <ImagePlus size={16} /> Add Photo
          </button>
          <button
            onClick={() => setModal({ kind: 'event', item: null })}
            className="btn-primary flex items-center gap-2 text-sm"
          >
            <CalendarPlus size={16} /> Add Event
          </button>
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.length === 0 ? (
            <div className="col-span-4 text-center py-16" style={{ color: 'var(--text-muted)' }}>
              No items yet — add a photo or event above.
            </div>
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
                {/* Hover actions */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/55 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="flex gap-2">
                    <button
                      onClick={() => openEdit(item)}
                      className="p-2 rounded-lg bg-white/20 text-white hover:bg-accent/40 transition-all"
                      title="Edit"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => setDeleteId(item.id)}
                      className="p-2 rounded-lg bg-white/20 text-white hover:bg-red-400/40 transition-all"
                      title="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                {/* Badges */}
                <div className="absolute top-2 left-2 flex gap-1">
                  <span className={`badge text-[10px] ${item.type === 'event' ? 'badge-cyan' : 'badge-green'}`}>
                    {item.type === 'event' ? 'Event' : 'Gallery'}
                  </span>
                  {item.type === 'event' && (
                    <span className={`badge text-[10px] ${item.is_upcoming ? 'badge-orange' : 'badge-green'}`}>
                      {item.is_upcoming ? 'Upcoming' : 'Past'}
                    </span>
                  )}
                  {item.is_featured && (
                    <span className="badge badge-orange text-[10px]">Featured</span>
                  )}
                </div>
              </div>
              <div className="p-3">
                <p className="text-sm text-white font-medium truncate">{item.title}</p>
                {item.event_date && (
                  <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                    {new Date(item.event_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {statusMsg && (
        <StatusModal type={statusMsg.type} message={statusMsg.message} onClose={() => setStatusMsg(null)} />
      )}

      {deleteId !== null && (
        <ConfirmModal
          message="This item will be permanently deleted."
          successMessage="Item deleted successfully!"
          onConfirm={() => handleDelete(deleteId)}
          onClose={() => setDeleteId(null)}
        />
      )}

      {/* Modals */}
      {modal?.kind === 'gallery' && (
        <GalleryModal
          editItem={modal.item}
          onClose={() => setModal(null)}
          onSaved={() => fetchItems(filter)}
          onStatus={setStatusMsg}
        />
      )}
      {modal?.kind === 'event' && (
        <EventModal
          editItem={modal.item}
          onClose={() => setModal(null)}
          onSaved={() => fetchItems(filter)}
          onStatus={setStatusMsg}
        />
      )}
    </div>
  );
}
