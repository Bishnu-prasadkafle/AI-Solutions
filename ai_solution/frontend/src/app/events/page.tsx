'use client';
import { useState, useMemo, useEffect, useCallback } from 'react';
import PublicLayout from '@/components/layout/PublicLayout';
import PageHero from '@/components/ui/PageHero';
import { LoadingSpinner, EmptyState } from '@/components/ui/StateUI';
import { useFetch } from '@/hooks/useFetch';
import { galleryAPI } from '@/lib/api';
import {
  Calendar, MapPin, ChevronLeft, ChevronRight, X,
  Clock, CheckCircle, Star, ArrowRight, Images,
  Mic, Users, UserCheck, Link2, Building2, ListOrdered,
} from 'lucide-react';

const MEDIA_URL = process.env.NEXT_PUBLIC_MEDIA_URL || 'http://localhost:8000';

function imgSrc(path?: string) {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  if (path.startsWith('/media/')) return `${MEDIA_URL}${path}`;
  return `${MEDIA_URL}/media/${path}`;
}

function fmtShort(d?: string) {
  if (!d) return '';
  return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}
function fmtLong(d?: string) {
  if (!d) return '';
  return new Date(d).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
}
function fmtTime(t?: string) {
  if (!t) return '';
  const [h, m] = t.split(':');
  const hour = parseInt(h);
  return `${hour % 12 || 12}:${m} ${hour >= 12 ? 'PM' : 'AM'}`;
}
function parseLines(text?: string): string[] {
  if (!text) return [];
  return text.split('\n').map(l => l.trim()).filter(Boolean);
}

// ── Small horizontal card ─────────────────────────────────────────
function RowCard({ item, onClick, active }: { item: any; onClick: () => void; active: boolean }) {
  return (
    <div
      onClick={onClick}
      className="group flex-shrink-0 w-60 rounded-2xl overflow-hidden cursor-pointer transition-all duration-300"
      style={{
        background: 'var(--bg-card)',
        border: `1px solid ${active ? 'rgba(176,228,204,0.5)' : 'var(--border)'}`,
        boxShadow: active ? '0 0 0 2px rgba(64,138,113,0.2)' : 'none',
        transform: active ? 'translateY(-3px)' : '',
      }}
    >
      <div className="relative h-36 overflow-hidden bg-[#091413]">
        {item.image || item.image_url ? (
          <img
            src={imgSrc(item.image_url || item.image)}
            alt={item.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg,#0d1f1d,#122b27)' }}>
            <Images size={28} style={{ color: 'var(--accent)', opacity: 0.35 }} />
          </div>
        )}
        {item.is_featured && (
          <div className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center"
            style={{ background: 'rgba(255,167,38,0.2)', border: '1px solid rgba(255,167,38,0.35)' }}>
            <Star size={10} style={{ color: '#ffa726' }} />
          </div>
        )}
        {item.event_date && (
          <div className="absolute bottom-2 left-2 flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px]"
            style={{ background: 'rgba(9,20,19,0.82)', color: '#B0E4CC', border: '1px solid rgba(176,228,204,0.15)' }}>
            <Calendar size={9} />{fmtShort(item.event_date)}
          </div>
        )}
      </div>
      <div className="p-3.5">
        <p className="text-sm font-semibold leading-snug line-clamp-1 transition-colors group-hover:text-[var(--accent-light)]"
          style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
          {item.title}
        </p>
        {item.location && (
          <p className="flex items-center gap-1 text-[11px] mt-1.5" style={{ color: 'var(--text-muted)' }}>
            <MapPin size={10} style={{ color: 'var(--accent)' }} />{item.location}
          </p>
        )}
        {(item.start_time || item.end_time) && (
          <p className="flex items-center gap-1 text-[11px] mt-1" style={{ color: 'var(--text-muted)' }}>
            <Clock size={10} style={{ color: 'var(--accent)' }} />
            {item.start_time && fmtTime(item.start_time)}{item.start_time && item.end_time && ' – '}{item.end_time && fmtTime(item.end_time)}
          </p>
        )}
      </div>
    </div>
  );
}

// ── Detail panel ──────────────────────────────────────────────────
function DetailPanel({ item }: { item: any }) {
  const speakers = parseLines(item.speakers);
  const guests = parseLines(item.guests);
  const agenda = parseLines(item.agenda);

  const MetaCard = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
    <div className="flex items-center gap-3 p-3 rounded-xl"
      style={{ background: 'rgba(64,138,113,0.06)', border: '1px solid rgba(64,138,113,0.14)' }}>
      <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
        style={{ background: 'var(--accent-dim)', border: '1px solid var(--border)' }}>
        {icon}
      </div>
      <div>
        <p className="text-[10px] uppercase tracking-widest mb-0.5" style={{ color: 'var(--text-muted)' }}>{label}</p>
        <p className="text-sm font-semibold text-white">{value}</p>
      </div>
    </div>
  );

  const Section = ({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) => (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <span style={{ color: 'var(--accent)' }}>{icon}</span>
        <h4 className="text-sm font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>{title}</h4>
      </div>
      {children}
    </div>
  );

  return (
    <div className="h-full overflow-y-auto">
      {/* Image — no fade/overlay */}
      {(item.image || item.image_url) && (
        <div className="w-full overflow-hidden" style={{ height: 220 }}>
          <img
            src={imgSrc(item.image_url || item.image)}
            alt={item.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="p-6 space-y-6">
        {/* Badges */}
        <div className="flex flex-wrap gap-2">
          <span className={`badge ${item.type === 'event' ? 'badge-cyan' : 'badge-green'}`}>{item.type}</span>
          {item.type === 'event' && (
            <span className={`badge ${item.is_upcoming ? 'badge-orange' : 'badge-green'}`}>
              {item.is_upcoming ? <><Clock size={9} className="mr-1" />Upcoming</> : <><CheckCircle size={9} className="mr-1" />Past</>}
            </span>
          )}
          {item.is_featured && <span className="badge badge-orange"><Star size={9} className="mr-1" />Featured</span>}
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-white leading-tight" style={{ fontFamily: 'var(--font-display)' }}>
          {item.title}
        </h3>

        {/* Description */}
        {item.description && (
          <p className="text-sm leading-relaxed"
            style={{ color: 'var(--text-secondary)', borderLeft: '2px solid var(--accent)', paddingLeft: '0.875rem' }}>
            {item.description}
          </p>
        )}

        {/* Core meta */}
        {(item.event_date || item.start_time || item.end_time || item.location || item.organizer || item.participants_count || item.website_url) && (
          <div className="grid grid-cols-1 gap-2.5">
            {item.event_date && (
              <MetaCard icon={<Calendar size={14} style={{ color: 'var(--accent-light)' }} />} label="Date" value={fmtLong(item.event_date)} />
            )}
            {(item.start_time || item.end_time) && (
              <MetaCard
                icon={<Clock size={14} style={{ color: 'var(--accent-light)' }} />}
                label="Time"
                value={[item.start_time && fmtTime(item.start_time), item.end_time && fmtTime(item.end_time)].filter(Boolean).join(' – ')}
              />
            )}
            {item.location && (
              <MetaCard icon={<MapPin size={14} style={{ color: 'var(--accent-light)' }} />} label="Location" value={item.location} />
            )}
            {item.organizer && (
              <MetaCard icon={<Building2 size={14} style={{ color: 'var(--accent-light)' }} />} label="Organizer" value={item.organizer} />
            )}
            {item.participants_count && (
              <MetaCard icon={<Users size={14} style={{ color: 'var(--accent-light)' }} />} label="Participants" value={`${item.participants_count.toLocaleString()} expected`} />
            )}
            {item.website_url && (
              <div className="flex items-center gap-3 p-3 rounded-xl"
                style={{ background: 'rgba(64,138,113,0.06)', border: '1px solid rgba(64,138,113,0.14)' }}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                  style={{ background: 'var(--accent-dim)', border: '1px solid var(--border)' }}>
                  <Link2 size={14} style={{ color: 'var(--accent-light)' }} />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest mb-0.5" style={{ color: 'var(--text-muted)' }}>Website</p>
                  <a href={item.website_url} target="_blank" rel="noopener noreferrer"
                    className="text-sm font-semibold hover:underline" style={{ color: 'var(--accent-light)' }}>
                    {item.website_url.replace(/^https?:\/\//, '')}
                  </a>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Agenda */}
        {agenda.length > 0 && (
          <Section icon={<ListOrdered size={15} />} title="Agenda">
            <div className="space-y-2">
              {agenda.map((line, i) => {
                const [time, ...rest] = line.split(' - ');
                const desc = rest.join(' - ');
                return (
                  <div key={i} className="flex gap-3 items-start">
                    <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-md shrink-0 mt-0.5"
                      style={{ background: 'var(--accent-dim)', color: 'var(--accent-light)', border: '1px solid var(--border)' }}>
                      {desc ? time : `${i + 1}`}
                    </span>
                    <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                      {desc || time}
                    </p>
                  </div>
                );
              })}
            </div>
          </Section>
        )}

        {/* Speakers */}
        {speakers.length > 0 && (
          <Section icon={<Mic size={15} />} title="Speakers">
            <div className="space-y-2">
              {speakers.map((s, i) => {
                const [name, ...rest] = s.split(',');
                return (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-xl"
                    style={{ background: 'rgba(64,138,113,0.05)', border: '1px solid rgba(64,138,113,0.12)' }}>
                    <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold"
                      style={{ background: 'var(--accent-dim)', color: 'var(--accent-light)', border: '1px solid var(--border)' }}>
                      {name.trim()[0]}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">{name.trim()}</p>
                      {rest.length > 0 && <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>{rest.join(',').trim()}</p>}
                    </div>
                  </div>
                );
              })}
            </div>
          </Section>
        )}

        {/* Guests */}
        {guests.length > 0 && (
          <Section icon={<UserCheck size={15} />} title="Guests">
            <div className="space-y-2">
              {guests.map((g, i) => {
                const [name, ...rest] = g.split(',');
                return (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-xl"
                    style={{ background: 'rgba(64,138,113,0.05)', border: '1px solid rgba(64,138,113,0.12)' }}>
                    <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold"
                      style={{ background: 'rgba(176,228,204,0.08)', color: '#B0E4CC', border: '1px solid rgba(176,228,204,0.2)' }}>
                      {name.trim()[0]}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">{name.trim()}</p>
                      {rest.length > 0 && <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>{rest.join(',').trim()}</p>}
                    </div>
                  </div>
                );
              })}
            </div>
          </Section>
        )}
      </div>
    </div>
  );
}

// ── Section Modal ─────────────────────────────────────────────────
function SectionModal({ title, icon, items, initialIndex, onClose }: {
  title: string; icon: React.ReactNode; items: any[]; initialIndex: number; onClose: () => void;
}) {
  const [selected, setSelected] = useState(initialIndex);

  const goPrev = useCallback(() => setSelected(i => (i - 1 + items.length) % items.length), [items.length]);
  const goNext = useCallback(() => setSelected(i => (i + 1) % items.length), [items.length]);

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') goPrev();
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [goPrev, goNext, onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(5,12,11,0.88)', backdropFilter: 'blur(14px)' }}
      onClick={onClose}>
      <div
        className="relative w-full flex flex-col overflow-hidden rounded-2xl"
        style={{
          maxWidth: 1060, maxHeight: '90vh',
          background: 'var(--bg-card)',
          border: '1px solid rgba(64,138,113,0.25)',
          animation: 'popIn 0.22s cubic-bezier(0.16,1,0.3,1)',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 shrink-0"
          style={{ borderBottom: '1px solid var(--border)' }}>
          <div className="flex items-center gap-3">
            <span style={{ color: 'var(--accent)' }}>{icon}</span>
            <span className="font-bold text-white text-base" style={{ fontFamily: 'var(--font-display)' }}>{title}</span>
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold"
              style={{ background: 'var(--accent-dim)', color: 'var(--accent-light)', border: '1px solid var(--border)' }}>
              {items.length}
            </span>
          </div>
          <button onClick={onClose} className="w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:bg-white/10"
            style={{ border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}>
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="flex flex-1 overflow-hidden">
          {/* List */}
          <div className="w-64 shrink-0 overflow-y-auto p-3 space-y-1.5"
            style={{ borderRight: '1px solid var(--border)' }}>
            {items.map((item: any, idx: number) => (
              <div key={item.id} onClick={() => setSelected(idx)}
                className="flex items-center gap-3 p-2.5 rounded-xl cursor-pointer transition-all duration-200"
                style={{
                  background: selected === idx ? 'var(--accent-dim)' : 'transparent',
                  border: `1px solid ${selected === idx ? 'rgba(64,138,113,0.3)' : 'transparent'}`,
                }}>
                <div className="w-11 h-11 rounded-lg overflow-hidden shrink-0 bg-[#091413]">
                  {item.image || item.image_url
                    ? <img src={imgSrc(item.image_url || item.image)} alt="" className="w-full h-full object-cover" />
                    : <div className="w-full h-full flex items-center justify-center"><Images size={14} style={{ color: 'var(--accent)', opacity: 0.4 }} /></div>}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold truncate leading-snug"
                    style={{ color: selected === idx ? 'var(--accent-light)' : 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
                    {item.title}
                  </p>
                  {item.event_date && (
                    <p className="text-[10px] mt-0.5 flex items-center gap-1" style={{ color: 'var(--text-muted)' }}>
                      <Calendar size={8} />{fmtShort(item.event_date)}
                    </p>
                  )}
                </div>
                {selected === idx && <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: 'var(--accent)' }} />}
              </div>
            ))}
          </div>

          {/* Detail */}
          <div className="flex-1 overflow-hidden">
            {items[selected] && <DetailPanel item={items[selected]} />}
          </div>
        </div>

        {/* Footer */}
        <div className="shrink-0 flex items-center justify-between px-6 py-3"
          style={{ borderTop: '1px solid var(--border)' }}>
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{selected + 1} of {items.length}</span>
          <div className="flex gap-2">
            <button onClick={goPrev}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-all"
              style={{ border: '1px solid var(--border)', color: 'var(--text-secondary)' }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'var(--accent)'; el.style.background = 'var(--accent-dim)'; el.style.color = '#fff'; }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'var(--border)'; el.style.background = 'transparent'; el.style.color = 'var(--text-secondary)'; }}>
              <ChevronLeft size={14} /> Prev
            </button>
            <button onClick={goNext}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-all"
              style={{ border: '1px solid var(--border)', color: 'var(--text-secondary)' }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'var(--accent)'; el.style.background = 'var(--accent-dim)'; el.style.color = '#fff'; }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'var(--border)'; el.style.background = 'transparent'; el.style.color = 'var(--text-secondary)'; }}>
              Next <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes popIn {
          from { opacity:0; transform:scale(0.96) translateY(10px); }
          to   { opacity:1; transform:scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
}

// ── Horizontal row ─────────────────────────────────────────────────
function EventRow({ title, icon, items, accentColor = 'var(--accent)', onOpen }: {
  title: string; icon: React.ReactNode; items: any[]; accentColor?: string; onOpen: (idx: number) => void;
}) {
  if (!items.length) return null;
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-1 h-7 rounded-full shrink-0"
            style={{ background: `linear-gradient(to bottom, ${accentColor}, transparent)` }} />
          <span style={{ color: accentColor }}>{icon}</span>
          <h2 className="text-lg font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>{title}</h2>
          <span className="px-2 py-0.5 rounded-full text-xs font-semibold"
            style={{ background: 'var(--accent-dim)', color: 'var(--accent-light)', border: '1px solid var(--border)' }}>
            {items.length}
          </span>
        </div>
        <button onClick={() => onOpen(0)}
          className="flex items-center gap-1.5 text-xs font-medium transition-all hover:gap-2.5"
          style={{ color: 'var(--accent-light)' }}>
          View all <ArrowRight size={13} />
        </button>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
        {items.map((item: any, idx: number) => (
          <RowCard key={item.id} item={item} active={false} onClick={() => onOpen(idx)} />
        ))}
      </div>
    </div>
  );
}

// ── Gallery row ────────────────────────────────────────────────────
function GalleryRow({ items, onOpen }: { items: any[]; onOpen: (idx: number) => void }) {
  if (!items.length) return null;
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-1 h-7 rounded-full shrink-0"
            style={{ background: 'linear-gradient(to bottom, var(--accent), transparent)' }} />
          <span style={{ color: 'var(--accent)' }}><Images size={16} /></span>
          <h2 className="text-lg font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>Gallery</h2>
          <span className="px-2 py-0.5 rounded-full text-xs font-semibold"
            style={{ background: 'var(--accent-dim)', color: 'var(--accent-light)', border: '1px solid var(--border)' }}>
            {items.length}
          </span>
        </div>
        <button onClick={() => onOpen(0)}
          className="flex items-center gap-1.5 text-xs font-medium transition-all hover:gap-2.5"
          style={{ color: 'var(--accent-light)' }}>
          View all <ArrowRight size={13} />
        </button>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
        {items.map((item: any, idx: number) => (
          <div key={item.id} onClick={() => onOpen(idx)}
            className="group relative flex-shrink-0 w-44 h-44 rounded-xl overflow-hidden cursor-pointer transition-all duration-300"
            style={{ border: '1px solid var(--border)' }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = 'rgba(176,228,204,0.35)'}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'}>
            <img src={imgSrc(item.image_url || item.image)} alt={item.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
            <div className="absolute bottom-0 left-0 right-0 p-2.5 translate-y-full group-hover:translate-y-0 transition-transform duration-300"
              style={{ background: 'rgba(9,20,19,0.9)' }}>
              <p className="text-white text-xs font-medium truncate">{item.title}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────
type ModalState = { section: 'upcoming' | 'past' | 'gallery'; index: number } | null;

export default function EventsPage() {
  const [modal, setModal] = useState<ModalState>(null);
  const { data: items, loading } = useFetch<any[]>(() => galleryAPI.list({}), []);

  const allItems = items ?? [];
  const upcomingEvents = useMemo(() => allItems.filter((i: any) => i.type === 'event' && i.is_upcoming), [items]);
  const pastEvents = useMemo(() => allItems.filter((i: any) => i.type === 'event' && !i.is_upcoming), [items]);
  const galleryItems = useMemo(() => allItems.filter((i: any) => i.type === 'general'), [items]);

  useEffect(() => {
    document.body.style.overflow = modal ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [modal]);

  const modalItems =
    modal?.section === 'upcoming' ? upcomingEvents :
    modal?.section === 'past' ? pastEvents :
    galleryItems;

  return (
    <PublicLayout>
      <PageHero
        badge="Gallery & Events"
        title={<>Our <span className="gradient-text">Events & Gallery</span></>}
        subtitle="Photos and highlights from our promotional events, tech showcases, and industry conferences."
        blobClass="bg-accent/10 top-0 right-0"
        centered
      />
      <section className="section-pad">
        <div className="container-custom space-y-14">
          {loading ? <LoadingSpinner /> : !(upcomingEvents.length || pastEvents.length || galleryItems.length) ? <EmptyState message="No items found." /> : (
            <>
              <EventRow title="Upcoming Events" icon={<Clock size={16} />} items={upcomingEvents} accentColor="#ffa726"
                onOpen={idx => setModal({ section: 'upcoming', index: idx })} />
              <EventRow title="Past Events" icon={<CheckCircle size={16} />} items={pastEvents}
                onOpen={idx => setModal({ section: 'past', index: idx })} />
              <GalleryRow items={galleryItems} onOpen={idx => setModal({ section: 'gallery', index: idx })} />
            </>
          )}
        </div>
      </section>

      {modal && (
        <SectionModal
          title={modal.section === 'upcoming' ? 'Upcoming Events' : modal.section === 'past' ? 'Past Events' : 'Gallery'}
          icon={modal.section === 'upcoming' ? <Clock size={16} /> : modal.section === 'past' ? <CheckCircle size={16} /> : <Images size={16} />}
          items={modalItems}
          initialIndex={modal.index}
          onClose={() => setModal(null)}
        />
      )}
    </PublicLayout>
  );
}
