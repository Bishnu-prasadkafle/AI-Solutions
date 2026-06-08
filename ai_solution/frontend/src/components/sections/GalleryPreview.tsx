'use client';
import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Camera, MapPin, Calendar, Clock, CheckCircle, Images, Star, ChevronLeft, ChevronRight } from 'lucide-react';

interface GalleryItem {
  id: number;
  image?: string;
  image_url?: string;
  title?: string;
  type?: string;
  location?: string;
  event_date?: string;
  is_upcoming?: boolean;
  is_featured?: boolean;
}

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

const PER_PAGE = 3;

export default function GalleryPreview({ items, loading }: { items: GalleryItem[]; loading?: boolean }) {
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(items.length / PER_PAGE);
  const displayed = items.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <section className="section-pad" style={{ background: 'var(--bg-card)' }}>
      <div className="container-custom">

        {/* Header */}
        <div className="text-center mb-12">
          <div className="badge badge-cyan mb-4 mx-auto">Our Events</div>
          <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-4" style={{ fontFamily: 'var(--font-display)' }}>
            Events &amp; Moments
          </h2>
          <p className="text-[var(--text-secondary)] max-w-xl mx-auto text-sm leading-relaxed">
            A glimpse into our conferences, workshops, and team milestones.
          </p>
        </div>

        {/* Skeleton */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 animate-pulse">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="rounded-2xl overflow-hidden" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                <div className="h-48" style={{ background: 'var(--accent-dim)' }} />
                <div className="p-4 space-y-2">
                  <div className="h-3 rounded-full w-3/4" style={{ background: 'var(--accent-dim)' }} />
                  <div className="h-2.5 rounded-full w-1/2" style={{ background: 'var(--accent-dim)' }} />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty */}
        {!loading && items.length === 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="rounded-2xl border-2 border-dashed flex items-center justify-center"
                style={{ borderColor: 'var(--border)', height: 240 }}>
                <Camera size={24} className="opacity-20" style={{ color: 'var(--text-muted)' }} />
              </div>
            ))}
          </div>
        )}

        {/* Grid row */}
        {!loading && displayed.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {displayed.map((item) => (
              <Link key={item.id} href="/events"
                className="group relative rounded-2xl overflow-hidden block transition-all duration-300"
                style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'rgba(176,228,204,0.4)'; el.style.transform = 'translateY(-3px)'; el.style.boxShadow = '0 16px 40px rgba(64,138,113,0.15)'; }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'var(--border)'; el.style.transform = ''; el.style.boxShadow = ''; }}
              >
                <div className="relative h-48 overflow-hidden bg-[#091413]">
                  {item.image || item.image_url ? (
                    <img src={imgSrc(item.image_url || item.image)} alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center"
                      style={{ background: 'linear-gradient(135deg,#0d1f1d,#122b27)' }}>
                      <Images size={28} style={{ color: 'var(--accent)', opacity: 0.35 }} />
                    </div>
                  )}
                  <div className="absolute top-2 left-2 flex gap-1.5">
                    {item.type === 'event' ? (
                      <span className={`badge text-[10px] ${item.is_upcoming ? 'badge-orange' : 'badge-green'}`}>
                        {item.is_upcoming ? <><Clock size={8} className="mr-0.5" />Upcoming</> : <><CheckCircle size={8} className="mr-0.5" />Past</>}
                      </span>
                    ) : (
                      <span className="badge badge-cyan text-[10px]">Gallery</span>
                    )}
                  </div>
                  {item.is_featured && (
                    <div className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center"
                      style={{ background: 'rgba(255,167,38,0.2)', border: '1px solid rgba(255,167,38,0.35)' }}>
                      <Star size={10} style={{ color: '#ffa726' }} />
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <p className="text-sm font-semibold leading-snug line-clamp-1 transition-colors group-hover:text-[var(--accent-light)]"
                    style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
                    {item.title}
                  </p>
                  <div className="flex flex-wrap gap-3 mt-1.5">
                    {item.event_date && (
                      <span className="flex items-center gap-1 text-[11px]" style={{ color: 'var(--text-muted)' }}>
                        <Calendar size={10} style={{ color: 'var(--accent)' }} />{fmtShort(item.event_date)}
                      </span>
                    )}
                    {item.location && (
                      <span className="flex items-center gap-1 text-[11px]" style={{ color: 'var(--text-muted)' }}>
                        <MapPin size={10} style={{ color: 'var(--accent)' }} />{item.location}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Prev / Next */}
        {!loading && totalPages > 1 && (
          <div className="flex items-center justify-center gap-4 mt-8">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
              className="w-9 h-9 flex items-center justify-center rounded-xl transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
              style={{ border: '1px solid var(--border)', color: 'var(--text-secondary)' }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'var(--accent)'; el.style.background = 'var(--accent-dim)'; el.style.color = '#fff'; }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'var(--border)'; el.style.background = 'transparent'; el.style.color = 'var(--text-secondary)'; }}>
              <ChevronLeft size={18} />
            </button>
            <span className="text-sm" style={{ color: 'var(--text-muted)' }}>{page} / {totalPages}</span>
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
              className="w-9 h-9 flex items-center justify-center rounded-xl transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
              style={{ border: '1px solid var(--border)', color: 'var(--text-secondary)' }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'var(--accent)'; el.style.background = 'var(--accent-dim)'; el.style.color = '#fff'; }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'var(--border)'; el.style.background = 'transparent'; el.style.color = 'var(--text-secondary)'; }}>
              <ChevronRight size={18} />
            </button>
          </div>
        )}

        <div className="text-center mt-8">
          <Link href="/events" className="btn-ghost inline-flex items-center gap-2 text-sm">
            View All Events & Gallery <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}
