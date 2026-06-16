'use client';
import { useState, useMemo } from 'react';
import Link from 'next/link';
import PublicLayout from '@/components/layout/PublicLayout';
import PageHero from '@/components/ui/PageHero';
import { LoadingSpinner, EmptyState } from '@/components/ui/StateUI';
import { useFetch } from '@/hooks/useFetch';
import { galleryAPI } from '@/lib/api';
import {
  Calendar, Clock, MapPin, Users, Mic,
  Star, CheckCircle, ArrowRight, Mail, Images,
} from 'lucide-react';

const MEDIA_URL = process.env.NEXT_PUBLIC_MEDIA_URL || 'http://localhost:8000';

function imgSrc(path?: string) {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  if (path.startsWith('/media/')) return `${MEDIA_URL}${path}`;
  return `${MEDIA_URL}/media/${path}`;
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

// ── Stat box ─────────────────────────────────────────────────────────
function StatBox({ value, label, icon }: { value: string | number; label: string; icon: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center p-5 rounded-2xl text-center"
      style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
      <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-3"
        style={{ background: 'var(--accent-dim)', color: 'var(--accent-light)' }}>
        {icon}
      </div>
      <div className="text-3xl font-bold text-white mb-1" style={{ fontFamily: 'var(--font-display)' }}>{value}</div>
      <div className="text-xs uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>{label}</div>
    </div>
  );
}

// ── Event card — links to /events/[id] ───────────────────────────────
function EventCard({ item }: { item: any }) {
  const src = imgSrc(item.image_url || item.image);
  const d = item.event_date ? new Date(item.event_date) : null;

  return (
    <Link
      href={`/events/${item.id}`}
      className="group overflow-hidden rounded-3xl flex flex-col"
      style={{
        background: 'var(--bg-card)',
        border: item.is_featured ? '1px solid rgba(255,167,38,0.4)' : '1px solid var(--border)',
        boxShadow: item.is_featured ? '0 0 30px rgba(255,167,38,0.06)' : 'none',
        transition: 'transform 0.25s, box-shadow 0.25s, border-color 0.25s',
        textDecoration: 'none',
      }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLElement;
        el.style.transform = 'translateY(-4px)';
        el.style.boxShadow = item.is_featured
          ? '0 20px 50px rgba(255,167,38,0.12)'
          : '0 20px 50px rgba(64,138,113,0.15)';
        el.style.borderColor = item.is_featured ? 'rgba(255,167,38,0.6)' : 'rgba(176,228,204,0.4)';
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLElement;
        el.style.transform = '';
        el.style.boxShadow = item.is_featured ? '0 0 30px rgba(255,167,38,0.06)' : 'none';
        el.style.borderColor = item.is_featured ? 'rgba(255,167,38,0.4)' : 'var(--border)';
      }}
    >
      {/* Thumbnail */}
      <div className="relative overflow-hidden" style={{ height: 210 }}>
        {src ? (
          <img src={src} alt={item.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
        ) : (
          <div className="w-full h-full flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #0d1f1d, #122b27)' }}>
            <Images size={36} style={{ color: 'var(--accent)', opacity: 0.25 }} />
          </div>
        )}

        {/* Status badges */}
        <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">
          {item.is_featured && (
            <span className="badge badge-orange text-[10px]">
              <Star size={9} className="mr-0.5" />Featured
            </span>
          )}
          <span className={`badge text-[10px] ${item.is_upcoming ? 'badge-orange' : 'badge-green'}`}>
            {item.is_upcoming
              ? <><Clock size={8} className="mr-0.5" />Upcoming</>
              : <><CheckCircle size={8} className="mr-0.5" />Past</>}
          </span>
        </div>

        {/* Date pill */}
        {d && (
          <div className="absolute bottom-3 right-3 flex flex-col items-center justify-center rounded-xl px-3 py-2"
            style={{
              background: 'rgba(9,20,19,0.88)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(64,138,113,0.3)',
            }}>
            <span className="text-lg font-black text-white leading-none" style={{ fontFamily: 'var(--font-display)' }}>
              {d.getDate()}
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'var(--accent-light)' }}>
              {d.toLocaleDateString('en-GB', { month: 'short' })}
            </span>
            <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{d.getFullYear()}</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-base font-bold text-white leading-snug mb-2 line-clamp-2"
          style={{ fontFamily: 'var(--font-display)' }}>
          {item.title}
        </h3>

        {item.description && (
          <p className="text-sm line-clamp-2 mb-3" style={{ color: 'var(--text-secondary)' }}>
            {item.description}
          </p>
        )}

        <div className="flex flex-col gap-1.5 mt-auto mb-4">
          {item.location && (
            <span className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-muted)' }}>
              <MapPin size={12} style={{ color: 'var(--accent)', flexShrink: 0 }} />
              {item.location}
            </span>
          )}
          {(item.start_time || item.end_time) && (
            <span className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-muted)' }}>
              <Clock size={12} style={{ color: 'var(--accent)', flexShrink: 0 }} />
              {[item.start_time && fmtTime(item.start_time), item.end_time && fmtTime(item.end_time)].filter(Boolean).join(' – ')}
            </span>
          )}
          {item.participants_count && (
            <span className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-muted)' }}>
              <Users size={12} style={{ color: 'var(--accent)', flexShrink: 0 }} />
              {Number(item.participants_count).toLocaleString()} attendees
            </span>
          )}
        </div>

        {/* CTA row */}
        <div className="flex items-center gap-1.5 text-xs font-semibold transition-all duration-200"
          style={{ color: 'var(--accent-light)' }}>
          View Full Details
          <ArrowRight size={13} className="transition-transform duration-200 group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  );
}

// ── Page ─────────────────────────────────────────────────────────────
export default function EventsPage() {
  const [tab, setTab] = useState<'upcoming' | 'past'>('upcoming');
  const { data: items, loading } = useFetch<any[]>(() => galleryAPI.list({ type: 'event' }), []);

  const allEvents = items ?? [];
  const upcomingEvents = useMemo(() => allEvents.filter((i: any) => i.is_upcoming), [items]);
  const pastEvents = useMemo(() => allEvents.filter((i: any) => !i.is_upcoming), [items]);
  const displayEvents = tab === 'upcoming' ? upcomingEvents : pastEvents;

  const totalSpeakers = useMemo(
    () => allEvents.reduce((sum: number, e: any) => sum + parseLines(e.speakers).length, 0),
    [allEvents]
  );
  const totalParticipants = useMemo(
    () => allEvents.reduce((sum: number, e: any) => sum + (e.participants_count || 0), 0),
    [allEvents]
  );

  return (
    <PublicLayout>
      <PageHero
        badge="Events"
        title={<>Our <span className="gradient-text">Events</span></>}
        subtitle="From AI summits to developer workshops — explore the events where we share knowledge, build community, and shape the future of technology."
        blobClass="bg-accent/10 top-0 right-0"
        centered
      />

      <section className="section-pad" style={{ paddingTop: '0' }}>
        <div className="container-custom space-y-10">

          {/* Stats */}
          {!loading && allEvents.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatBox value={allEvents.length} label="Total Events" icon={<Calendar size={20} />} />
              <StatBox value={upcomingEvents.length} label="Upcoming" icon={<Clock size={20} />} />
              <StatBox value={totalSpeakers > 0 ? totalSpeakers : '—'} label="Speakers" icon={<Mic size={20} />} />
              <StatBox
                value={totalParticipants > 0 ? `${(totalParticipants / 1000).toFixed(1)}K+` : '—'}
                label="Participants"
                icon={<Users size={20} />}
              />
            </div>
          )}

          {/* Tabs */}
          <div className="inline-flex gap-1 p-1 rounded-2xl"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            {([
              { key: 'upcoming', label: 'Upcoming Events', count: upcomingEvents.length },
              { key: 'past',     label: 'Past Events',     count: pastEvents.length },
            ] as const).map(t => (
              <button key={t.key} onClick={() => setTab(t.key)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200"
                style={tab === t.key
                  ? { background: 'var(--accent)', color: '#fff', boxShadow: '0 4px 20px rgba(64,138,113,0.25)' }
                  : { color: 'var(--text-secondary)' }
                }>
                {t.label}
                <span className="text-xs px-1.5 py-0.5 rounded-full"
                  style={tab === t.key
                    ? { background: 'rgba(255,255,255,0.2)' }
                    : { background: 'var(--accent-dim)', color: 'var(--accent-light)' }}>
                  {t.count}
                </span>
              </button>
            ))}
          </div>

          {/* Grid */}
          {loading ? (
            <LoadingSpinner />
          ) : displayEvents.length === 0 ? (
            <EmptyState message={`No ${tab} events right now. Check back soon!`} />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayEvents.map((item: any) => (
                <EventCard key={item.id} item={item} />
              ))}
            </div>
          )}

          {/* Contact nudge */}
          {!loading && allEvents.length > 0 && (
            <div
              className="rounded-3xl p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6 mt-4"
              style={{
                background: 'linear-gradient(135deg, rgba(64,138,113,0.1) 0%, rgba(40,90,72,0.15) 100%)',
                border: '1px solid rgba(64,138,113,0.25)',
              }}
            >
              <div className="text-center md:text-left">
                <h3 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-display)' }}>
                  Want to host or sponsor an event?
                </h3>
                <p className="text-base" style={{ color: 'var(--text-secondary)' }}>
                  Partner with us to reach the AI & tech community. We would love to hear from you.
                </p>
              </div>
              <Link href="/contact" className="btn-primary flex items-center gap-2 shrink-0">
                <Mail size={16} /> Contact Us <ArrowRight size={15} />
              </Link>
            </div>
          )}

        </div>
      </section>
    </PublicLayout>
  );
}
