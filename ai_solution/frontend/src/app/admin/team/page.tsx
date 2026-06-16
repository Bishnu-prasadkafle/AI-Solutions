'use client';
import { useEffect, useState } from 'react';
import { teamAPI } from '@/lib/api';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import AdminModal from '@/components/admin/AdminModal';
import ConfirmModal from '@/components/admin/ConfirmModal';
import StatusModal from '@/components/admin/StatusModal';
import { LoadingSpinner } from '@/components/ui/StateUI';
import { Plus, Pencil, Trash2, Loader2, Users, GripVertical, Linkedin } from 'lucide-react';
import Image from 'next/image';

type TeamForm = {
  name: string;
  role: string;
  bio: string;
  linkedin_url: string;
  order: number;
  is_active: boolean;
};

export default function AdminTeamPage() {
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const { register, handleSubmit, reset, setValue } = useForm<TeamForm>();

  const fetchMembers = () => {
    setLoading(true);
    teamAPI.list().then((r) => setMembers(r.data.results || r.data)).finally(() => setLoading(false));
  };

  useEffect(() => { fetchMembers(); }, []);

  const openNew = () => {
    setEditItem(null);
    reset({ is_active: true, order: members.length + 1, linkedin_url: '' });
    setImageFile(null);
    setImagePreview('');
    setShowForm(true);
  };

  const openEdit = (item: any) => {
    setEditItem(item);
    setValue('name', item.name);
    setValue('role', item.role);
    setValue('bio', item.bio || '');
    setValue('linkedin_url', item.linkedin_url || '');
    setValue('order', item.order ?? 0);
    setValue('is_active', item.is_active ?? true);
    setImageFile(null);
    setImagePreview(item.image_url || '');
    setShowForm(true);
  };

  const onSubmit = async (data: TeamForm) => {
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append('name', data.name);
      fd.append('role', data.role);
      fd.append('bio', data.bio);
      fd.append('linkedin_url', data.linkedin_url || '');
      fd.append('order', String(data.order));
      fd.append('is_active', String(data.is_active));
      if (imageFile) fd.append('image', imageFile);

      if (editItem) {
        await teamAPI.patch(editItem.id, fd);
      } else {
        await teamAPI.create(fd);
      }
      setShowForm(false);
      fetchMembers();
      setStatusMsg({ type: 'success', message: editItem ? 'Team member updated successfully!' : 'Team member added successfully!' });
    } catch {
      setStatusMsg({ type: 'error', message: 'Failed to save team member. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    await teamAPI.delete(id);
    fetchMembers();
  };

  const initials = (name: string) =>
    name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase();

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>
            Team
          </h1>
          <p className="text-[var(--text-secondary)] mt-1">
            Manage leadership profiles shown on the About page
          </p>
        </div>
        <button onClick={openNew} className="btn-primary flex items-center gap-2">
          <Plus size={16} /> Add Member
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <LoadingSpinner />
      ) : members.length === 0 ? (
        <div className="glass rounded-2xl p-20 text-center">
          <div className="w-16 h-16 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center mx-auto mb-4">
            <Users size={28} className="text-accent" />
          </div>
          <p className="text-white font-semibold mb-1" style={{ fontFamily: 'var(--font-display)' }}>No team members yet</p>
          <p className="text-sm text-[var(--text-muted)] mb-5">Add your first leadership profile to display on the About page.</p>
          <button onClick={openNew} className="btn-primary inline-flex items-center gap-2">
            <Plus size={15} /> Add First Member
          </button>
        </div>
      ) : (
        <div className="glass rounded-2xl overflow-hidden">
          {/* Table header */}
          <div
            className="grid items-center px-6 py-3 text-xs font-semibold uppercase tracking-widest"
            style={{
              gridTemplateColumns: '2.5rem 1fr 1fr auto',
              color: 'var(--text-muted)',
              borderBottom: '1px solid var(--border)',
            }}>
            <span></span>
            <span>Member</span>
            <span>Details</span>
            <span>Actions</span>
          </div>

          {/* Rows */}
          <div className="divide-y" style={{ borderColor: 'rgba(64,138,113,0.1)' }}>
            {members.map((m: any) => (
              <div
                key={m.id}
                className="grid items-center px-6 py-4 hover:bg-accent/5 transition-colors group"
                style={{ gridTemplateColumns: '2.5rem 1fr 1fr auto' }}>

                {/* Drag handle / order */}
                <div className="flex items-center justify-center">
                  <span className="text-xs font-mono text-[var(--text-muted)]">{m.order}</span>
                </div>

                {/* Member — photo + name + role */}
                <div className="flex items-center gap-4 min-w-0">
                  {/* Photo */}
                  <div
                    className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0"
                    style={{ border: '2px solid rgba(64,138,113,0.25)' }}>
                    {m.image_url ? (
                      <Image
                        src={m.image_url}
                        alt={m.name}
                        fill
                        className="object-cover object-top"
                        unoptimized
                      />
                    ) : (
                      <div
                        className="w-full h-full flex items-center justify-center text-sm font-bold text-white"
                        style={{ background: 'linear-gradient(135deg,#285A48,#408A71)', fontFamily: 'var(--font-display)' }}>
                        {initials(m.name)}
                      </div>
                    )}
                  </div>

                  {/* Name + role */}
                  <div className="min-w-0">
                    <p className="font-semibold text-white text-sm truncate" style={{ fontFamily: 'var(--font-display)' }}>
                      {m.name}
                    </p>
                    <p className="text-xs font-medium mt-0.5" style={{ color: '#408A71' }}>
                      {m.role}
                    </p>
                    <div className="mt-1">
                      {m.is_active
                        ? <span className="badge badge-green text-[10px] py-0">Active</span>
                        : <span className="badge badge-red text-[10px] py-0">Hidden</span>}
                    </div>
                  </div>
                </div>

                {/* Details — bio + linkedin */}
                <div className="min-w-0 pr-6">
                  <p
                    className="text-sm leading-relaxed line-clamp-2"
                    style={{ color: 'var(--text-secondary)' }}>
                    {m.bio || <span className="italic text-[var(--text-muted)]">No bio added</span>}
                  </p>
                  {m.linkedin_url && (
                    <a
                      href={m.linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 mt-1.5 text-xs transition-colors hover:text-accent"
                      style={{ color: 'var(--text-muted)' }}>
                      <Linkedin size={11} /> LinkedIn profile
                    </a>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => openEdit(m)}
                    className="p-2 rounded-lg text-[var(--text-muted)] hover:text-accent hover:bg-accent/10 transition-all"
                    title="Edit">
                    <Pencil size={15} />
                  </button>
                  <button
                    onClick={() => setDeleteId(m.id)}
                    className="p-2 rounded-lg text-[var(--text-muted)] hover:text-red-400 hover:bg-red-400/10 transition-all"
                    title="Delete">
                    <Trash2 size={15} />
                  </button>
                </div>

              </div>
            ))}
          </div>

          {/* Footer count */}
          <div
            className="px-6 py-3 text-xs"
            style={{ borderTop: '1px solid var(--border)', color: 'var(--text-muted)' }}>
            {members.length} member{members.length !== 1 ? 's' : ''} total
          </div>
        </div>
      )}

      {statusMsg && (
        <StatusModal type={statusMsg.type} message={statusMsg.message} onClose={() => setStatusMsg(null)} />
      )}

      {deleteId !== null && (
        <ConfirmModal
          message="This team member will be permanently deleted."
          successMessage="Team member deleted successfully!"
          onConfirm={() => handleDelete(deleteId)}
          onClose={() => setDeleteId(null)}
        />
      )}

      {/* Modal */}
      {showForm && (
        <AdminModal
          title={editItem ? 'Edit Team Member' : 'Add Team Member'}
          onClose={() => setShowForm(false)}
          wide>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

            {/* Photo upload */}
            <div>
              <label className="block text-xs uppercase tracking-wider text-[var(--text-muted)] mb-3">
                Profile Photo
              </label>
              <div className="flex items-center gap-5">
                {/* Large preview */}
                <div
                  className="relative w-24 h-24 rounded-2xl overflow-hidden shrink-0"
                  style={{ border: '2px solid rgba(64,138,113,0.3)' }}>
                  {imagePreview ? (
                    <Image src={imagePreview} alt="preview" fill className="object-cover object-top" unoptimized />
                  ) : (
                    <div
                      className="w-full h-full flex flex-col items-center justify-center gap-1"
                      style={{ background: 'rgba(64,138,113,0.06)' }}>
                      <Users size={22} className="text-[var(--text-muted)]" />
                      <span className="text-[10px] text-[var(--text-muted)]">No photo</span>
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null;
                      setImageFile(file);
                      if (file) setImagePreview(URL.createObjectURL(file));
                    }}
                    className="input-field text-sm file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:bg-accent/20 file:text-accent file:cursor-pointer"
                  />
                  <p className="text-xs mt-2" style={{ color: 'var(--text-muted)' }}>
                    Recommended: square image, min 400×400px. JPG or PNG.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-[var(--text-muted)] mb-2">Full Name *</label>
                <input {...register('name', { required: true })} className="input-field" placeholder="Dr. Sarah Chen" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-[var(--text-muted)] mb-2">Role / Title *</label>
                <input {...register('role', { required: true })} className="input-field" placeholder="CEO & Co-Founder" />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-[var(--text-muted)] mb-2">Bio</label>
              <textarea
                {...register('bio')}
                rows={3}
                className="input-field resize-none"
                placeholder="Short professional biography shown on the About page..."
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-[var(--text-muted)] mb-2">LinkedIn URL</label>
              <input {...register('linkedin_url')} className="input-field" placeholder="https://linkedin.com/in/username" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-[var(--text-muted)] mb-2">Display Order</label>
                <input {...register('order')} type="number" min={0} className="input-field" />
              </div>
              <div className="flex items-end pb-1">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input {...register('is_active')} type="checkbox" className="w-4 h-4 accent-[var(--accent)]" />
                  <span className="text-sm text-[var(--text-secondary)]">Show on website</span>
                </label>
              </div>
            </div>

            <div className="flex gap-3 pt-2" style={{ borderTop: '1px solid var(--border)' }}>
              <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2">
                {saving && <Loader2 size={15} className="animate-spin" />}
                {saving ? 'Saving...' : editItem ? 'Update Member' : 'Add Member'}
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="btn-ghost">
                Cancel
              </button>
            </div>

          </form>
        </AdminModal>
      )}
    </div>
  );
}
