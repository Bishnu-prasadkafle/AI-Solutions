'use client';
import { useState, useMemo, useEffect, useCallback } from 'react';
import PublicLayout from '@/components/layout/PublicLayout';
import PageHero from '@/components/ui/PageHero';
import { LoadingSpinner, EmptyState } from '@/components/ui/StateUI';
import { useFetch } from '@/hooks/useFetch';
import { galleryAPI } from '@/lib/api';
import { ZoomIn, X, ChevronLeft, ChevronRight, Images } from 'lucide-react';

const MEDIA_URL = process.env.NEXT_PUBLIC_MEDIA_URL || 'http://localhost:8000';

function imgSrc(path?: string) {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  if (path.startsWith('/media/')) return `${MEDIA_URL}${path}`;
  return `${MEDIA_URL}/media/${path}`;
}

const FILTERS = [
  { key: 'all', label: 'All Photos' },
  { key: 'general', label: 'Our Offices' },
  { key: 'event', label: 'Events' },
];

function PhotoCard({ item, onClick }: { item: any; onClick: () => void }) {
  const src = imgSrc(item.image_url || item.image);
  return (
    <div
      onClick={onClick}
      className="group relative overflow-hidden rounded-2xl cursor-pointer"
      style={{
        height: 260,
        border: '1px solid var(--border)',
        transition: 'border-color 0.25s, transform 0.25s, box-shadow 0.25s',
      }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLElement;
        el.style.borderColor = 'rgba(176,228,204,0.45)';
        el.style.transform = 'translateY(-3px)';
        el.style.boxShadow = '0 12px 40px rgba(64,138,113,0.18)';
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLElement;
        el.style.borderColor = 'var(--border)';
        el.style.transform = '';
        el.style.boxShadow = 'none';
      }}
    >
      {src ? (
        <img
          src={src}
          alt={item.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center" style={{ background: 'var(--bg-card)' }}>
          <Images size={40} style={{ color: 'var(--accent)', opacity: 0.25 }} />
        </div>
      )}

      {/* Hover overlay */}
      <div
        className="absolute inset-0 flex flex-col justify-between p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: 'linear-gradient(to bottom, rgba(9,20,19,0.05) 0%, rgba(9,20,19,0.85) 100%)' }}
      >
        <div className="flex justify-end">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center"
            style={{ background: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(8px)' }}
          >
            <ZoomIn size={16} className="text-white" />
          </div>
        </div>
        <div>
          <span className={`badge mb-2 ${item.type === 'event' ? 'badge-orange' : 'badge-cyan'}`}>
            {item.type === 'event' ? 'Event' : 'Office'}
          </span>
          <p className="text-white font-semibold text-sm leading-snug line-clamp-2" style={{ fontFamily: 'var(--font-display)' }}>
            {item.title}
          </p>
        </div>
      </div>
    </div>
  );
}

function Lightbox({ items, index, onClose, onPrev, onNext }: {
  items: any[]; index: number; onClose: () => void; onPrev: () => void; onNext: () => void;
}) {
  const item = items[index];

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') onPrev();
      if (e.key === 'ArrowRight') onNext();
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onPrev, onNext, onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: 'rgba(5,12,11,0.97)', backdropFilter: 'blur(28px)' }}
      onClick={onClose}
    >
      {/* Close */}
      <button
        onClick={onClose}
        className="absolute top-5 right-5 w-11 h-11 rounded-full flex items-center justify-center z-10 transition-all"
        style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)' }}
        onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.22)'}
        onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.1)'}
      >
        <X size={20} className="text-white" />
      </button>

      {/* Prev */}
      <button
        onClick={e => { e.stopPropagation(); onPrev(); }}
        className="absolute left-5 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full flex items-center justify-center z-10 transition-all"
        style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)' }}
        onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(64,138,113,0.35)'}
        onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.08)'}
      >
        <ChevronLeft size={22} className="text-white" />
      </button>

      {/* Image + caption */}
      <div
        className="flex flex-col items-center gap-5 w-full"
        style={{ maxWidth: 860, padding: '0 80px' }}
        onClick={e => e.stopPropagation()}
      >
        <img
          src={imgSrc(item.image_url || item.image)}
          alt={item.title}
          className="w-full rounded-2xl object-contain shadow-2xl"
          style={{ maxHeight: '70vh' }}
        />
        <div className="text-center">
          <span className={`badge mb-2 ${item.type === 'event' ? 'badge-orange' : 'badge-cyan'}`}>
            {item.type === 'event' ? 'Event' : 'Office'}
          </span>
          <h3 className="text-white text-xl font-bold mt-2" style={{ fontFamily: 'var(--font-display)' }}>
            {item.title}
          </h3>
          {item.description && (
            <p className="text-sm mt-1.5 max-w-lg mx-auto" style={{ color: 'var(--text-muted)' }}>{item.description}</p>
          )}
          <p className="text-xs mt-3" style={{ color: 'rgba(90,138,120,0.7)' }}>
            {index + 1} / {items.length} &nbsp;·&nbsp; ← → to navigate · Esc to close
          </p>
        </div>
      </div>

      {/* Next */}
      <button
        onClick={e => { e.stopPropagation(); onNext(); }}
        className="absolute right-5 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full flex items-center justify-center z-10 transition-all"
        style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)' }}
        onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(64,138,113,0.35)'}
        onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.08)'}
      >
        <ChevronRight size={22} className="text-white" />
      </button>
    </div>
  );
}

export default function GalleryPage() {
  const [filter, setFilter] = useState('all');
  const [lightbox, setLightbox] = useState<number | null>(null);
  const { data: items, loading } = useFetch<any[]>(() => galleryAPI.list({}), []);

  const allItems = items ?? [];
  const filtered = useMemo(
    () => filter === 'all' ? allItems : allItems.filter((i: any) => i.type === filter),
    [allItems, filter]
  );

  const handlePrev = useCallback(
    () => setLightbox(i => i !== null ? (i - 1 + filtered.length) % filtered.length : null),
    [filtered.length]
  );
  const handleNext = useCallback(
    () => setLightbox(i => i !== null ? (i + 1) % filtered.length : null),
    [filtered.length]
  );

  useEffect(() => {
    document.body.style.overflow = lightbox !== null ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [lightbox]);

  return (
    <PublicLayout>
      <PageHero
        badge="Photo Gallery"
        title={<>Our <span className="gradient-text">Gallery</span></>}
        subtitle="A visual journey through our offices, workspaces, and the moments that define who we are."
        blobClass="bg-accent/10 top-0 right-0"
        centered
      />

      <section className="section-pad" style={{ paddingTop: '2rem' }}>
        <div className="container-custom">

          {/* Filter tabs */}
          <div className="flex flex-wrap gap-2 mb-10 justify-center">
            {FILTERS.map(f => {
              const count = f.key === 'all'
                ? allItems.length
                : allItems.filter((i: any) => i.type === f.key).length;
              return (
                <button
                  key={f.key}
                  onClick={() => setFilter(f.key)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200"
                  style={filter === f.key
                    ? { background: 'var(--accent)', color: '#fff', border: '1px solid var(--accent)', boxShadow: '0 4px 20px rgba(64,138,113,0.3)' }
                    : { background: 'transparent', color: 'var(--text-secondary)', border: '1px solid var(--border)' }
                  }
                >
                  {f.label}
                  <span
                    className="text-xs px-1.5 py-0.5 rounded-full font-semibold"
                    style={filter === f.key
                      ? { background: 'rgba(255,255,255,0.2)' }
                      : { background: 'var(--accent-dim)', color: 'var(--accent-light)' }}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {loading ? (
            <LoadingSpinner />
          ) : filtered.length === 0 ? (
            <EmptyState message="No photos found in this category." />
          ) : (
            /* Uniform grid — all images same height */
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filtered.map((item: any, idx: number) => (
                <PhotoCard key={item.id} item={item} onClick={() => setLightbox(idx)} />
              ))}
            </div>
          )}

          {!loading && filtered.length > 0 && (
            <p className="text-center text-sm mt-10" style={{ color: 'var(--text-muted)' }}>
              {filtered.length} photo{filtered.length !== 1 ? 's' : ''} · click any image to enlarge
            </p>
          )}
        </div>
      </section>

      {lightbox !== null && filtered[lightbox] && (
        <Lightbox
          items={filtered}
          index={lightbox}
          onClose={() => setLightbox(null)}
          onPrev={handlePrev}
          onNext={handleNext}
        />
      )}
    </PublicLayout>
  );
}
