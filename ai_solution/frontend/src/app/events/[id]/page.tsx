'use client';
import { use } from 'react';
import Link from 'next/link';
import {
  ArrowLeft, ArrowRight, Calendar, Clock, MapPin, Users,
  Building2, Globe, Mic, UserCheck, ListOrdered,
  Star, CheckCircle, ExternalLink, Mail,
} from 'lucide-react';
import PublicLayout from '@/components/layout/PublicLayout';
import { useFetch } from '@/hooks/useFetch';
import { galleryAPI } from '@/lib/api';
import { LoadingSpinner } from '@/components/ui/StateUI';

const MEDIA_URL = process.env.NEXT_PUBLIC_MEDIA_URL || 'http://localhost:8000';

function imgSrc(path?: string) {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  if (path.startsWith('/media/')) return `${MEDIA_URL}${path}`;
  return `${MEDIA_URL}/media/${path}`;
}

function fmtDateLong(d?: string) {
  if (!d) return '';
  return new Date(d).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
}

function fmtDateShort(d?: string) {
  if (!d) return '';
  return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
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

// ── Info chip ─────────────────────────────────────────────────────────
function InfoChip({ icon, label, value }: { icon: React.ReactNode; label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 p-4 rounded-2xl"
      style={{ background: 'rgba(64,138,113,0.06)', border: '1px solid rgba(64,138,113,0.15)' }}>
      <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
        style={{ background: 'var(--accent-dim)', color: 'var(--accent-light)' }}>
        {icon}
      </div>
      <div>
        <p className="text-[10px] uppercase tracking-widest mb-0.5" style={{ color: 'var(--text-muted)' }}>{label}</p>
        <div className="text-sm font-semibold text-white">{value}</div>
      </div>
    </div>
  );
}

// ── Avatar initials ───────────────────────────────────────────────────
function Avatar({ name, size = 46, variant = 'primary' }: {
  name: string; size?: number; variant?: 'primary' | 'secondary';
}) {
  const initials = name.trim().split(/\s+/).map(w => w[0]).slice(0, 2).join('').toUpperCase();
  const s = variant === 'primary'
    ? { background: 'rgba(64,138,113,0.2)', border: '1px solid rgba(64,138,113,0.45)', color: '#B0E4CC' }
    : { background: 'rgba(176,228,204,0.1)', border: '1px solid rgba(176,228,204,0.3)', color: '#e8f5f0' };
  return (
    <div className="flex items-center justify-center rounded-full font-bold shrink-0"
      style={{ width: size, height: size, fontSize: size * 0.35, ...s }}>
      {initials}
    </div>
  );
}

// ── People grid ───────────────────────────────────────────────────────
function PeopleGrid({ title, icon, people, variant = 'primary' }: {
  title: string; icon: React.ReactNode; people: string[]; variant?: 'primary' | 'secondary';
}) {
  if (!people.length) return null;
  return (
    <div>
      <div className="flex items-center gap-2 mb-5">
        <span style={{ color: 'var(--accent)' }}>{icon}</span>
        <h2 className="text-lg font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>{title}</h2>
        <span className="px-2 py-0.5 rounded-full text-xs font-semibold"
          style={{ background: 'var(--accent-dim)', color: 'var(--accent-light)', border: '1px solid var(--border)' }}>
          {people.length}
        </span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {people.map((person, i) => {
          const [name, ...rest] = person.split(',');
          return (
            <div key={i} className="flex items-center gap-4 p-4 rounded-2xl glass"
              style={{ border: '1px solid rgba(64,138,113,0.14)' }}>
              <Avatar name={name.trim()} size={46} variant={variant} />
              <div>
                <p className="text-sm font-semibold text-white">{name.trim()}</p>
                {rest.length > 0 && (
                  <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{rest.join(',').trim()}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Agenda timeline ───────────────────────────────────────────────────
function AgendaTimeline({ agenda }: { agenda: string[] }) {
  if (!agenda.length) return null;
  return (
    <div>
      <div className="flex items-center gap-2 mb-5">
        <span style={{ color: 'var(--accent)' }}><ListOrdered size={18} /></span>
        <h2 className="text-lg font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>
          Schedule / Agenda
        </h2>
      </div>
      <div className="space-y-0">
        {agenda.map((line, i) => {
          const dashIdx = line.indexOf(' - ');
          const time = dashIdx !== -1 ? line.slice(0, dashIdx) : null;
          const desc = dashIdx !== -1 ? line.slice(dashIdx + 3) : line;
          return (
            <div key={i} className="flex gap-4 items-start">
              <div className="flex flex-col items-center shrink-0 pt-2">
                <div className="w-3 h-3 rounded-full" style={{ background: 'var(--accent)' }} />
                {i < agenda.length - 1 && (
                  <div className="w-px mt-1" style={{ background: 'var(--border)', minHeight: 36 }} />
                )}
              </div>
              <div className="pb-5">
                {time && (
                  <span className="inline-block text-xs font-mono font-bold px-2 py-0.5 rounded-md mb-2"
                    style={{ background: 'var(--accent-dim)', color: 'var(--accent-light)', border: '1px solid var(--border)' }}>
                    {time}
                  </span>
                )}
                <p className="text-base leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Section divider ───────────────────────────────────────────────────
function Divider() {
  return <div style={{ borderTop: '1px solid var(--border)' }} />;
}

// ── Page ──────────────────────────────────────────────────────────────
export default function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: event, loading } = useFetch<any>(() => galleryAPI.get(Number(id)));

  const speakers = parseLines(event?.speakers);
  const guests = parseLines(event?.guests);
  const agenda = parseLines(event?.agenda);
  const cover = event ? imgSrc(event.image_url || event.image) : null;
  const timeStr = [
    event?.start_time && fmtTime(event.start_time),
    event?.end_time && fmtTime(event.end_time),
  ].filter(Boolean).join(' – ');
  const contactUrl = event
    ? `/contact?event=${encodeURIComponent(event.title)}`
    : '/contact';

  return (
    <PublicLayout>
      <section className="section-pad pt-32">
        <div className="container-custom max-w-4xl">

          {/* Back link */}
          <Link href="/events"
            className="inline-flex items-center gap-2 text-sm transition-colors mb-10"
            style={{ color: 'var(--text-muted)' }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = 'var(--accent-light)'}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)'}>
            <ArrowLeft size={15} /> Back to Events
          </Link>

          {loading && <LoadingSpinner />}

          {!loading && event && (
            <div className="glass rounded-3xl overflow-hidden">

              {/* Full-width cover image */}
              {cover && (
                <div className="overflow-hidden" style={{ borderBottom: '1px solid rgba(64,138,113,0.15)' }}>
                  <img src={cover} alt={event.title} className="w-full object-cover" style={{ height: 360 }} />
                </div>
              )}

              <div className="p-8 md:p-12 space-y-10">

                {/* Badges */}
                <div className="flex flex-wrap gap-2">
                  <span className="badge badge-cyan">Event</span>
                  {event.is_featured && (
                    <span className="badge badge-orange">
                      <Star size={10} className="mr-1" />Featured
                    </span>
                  )}
                  <span className={`badge ${event.is_upcoming ? 'badge-orange' : 'badge-green'}`}>
                    {event.is_upcoming
                      ? <><Clock size={9} className="mr-1" />Upcoming Event</>
                      : <><CheckCircle size={9} className="mr-1" />Past Event</>}
                  </span>
                </div>

                {/* Title */}
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight mb-4"
                    style={{ fontFamily: 'var(--font-display)' }}>
                    {event.title}
                  </h1>
                  {event.event_date && (
                    <p className="text-base font-medium" style={{ color: 'var(--accent-light)' }}>
                      {fmtDateLong(event.event_date)}
                    </p>
                  )}
                </div>

                {/* Description */}
                {event.description && (
                  <p className="text-lg leading-relaxed"
                    style={{ color: 'var(--text-secondary)', borderLeft: '3px solid var(--accent)', paddingLeft: '1.25rem' }}>
                    {event.description}
                  </p>
                )}

                {/* Info chips */}
                {(event.event_date || timeStr || event.location || event.organizer || event.participants_count || event.website_url) && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {event.event_date && (
                      <InfoChip icon={<Calendar size={18} />} label="Date" value={fmtDateShort(event.event_date)} />
                    )}
                    {timeStr && (
                      <InfoChip icon={<Clock size={18} />} label="Time" value={timeStr} />
                    )}
                    {event.location && (
                      <InfoChip icon={<MapPin size={18} />} label="Location" value={event.location} />
                    )}
                    {event.organizer && (
                      <InfoChip icon={<Building2 size={18} />} label="Organizer" value={event.organizer} />
                    )}
                    {event.participants_count && (
                      <InfoChip icon={<Users size={18} />} label="Expected Attendees"
                        value={`${Number(event.participants_count).toLocaleString()}+ people`} />
                    )}
                    {event.website_url && (
                      <InfoChip
                        icon={<Globe size={18} />}
                        label="Event Website"
                        value={
                          <a href={event.website_url} target="_blank" rel="noopener noreferrer"
                            className="hover:underline flex items-center gap-1"
                            style={{ color: 'var(--accent-light)' }}>
                            {event.website_url.replace(/^https?:\/\//, '').split('/')[0]}
                            <ExternalLink size={12} />
                          </a>
                        }
                      />
                    )}
                  </div>
                )}

                {/* Speakers */}
                {speakers.length > 0 && (
                  <>
                    <Divider />
                    <PeopleGrid title="Speakers" icon={<Mic size={18} />} people={speakers} variant="primary" />
                  </>
                )}

                {/* Agenda */}
                {agenda.length > 0 && (
                  <>
                    <Divider />
                    <AgendaTimeline agenda={agenda} />
                  </>
                )}

                {/* Guests */}
                {guests.length > 0 && (
                  <>
                    <Divider />
                    <PeopleGrid title="Special Guests" icon={<UserCheck size={18} />} people={guests} variant="secondary" />
                  </>
                )}

                {/* ── Booking CTA ────────────────────────────────────────── */}
                <Divider />
                <div
                  className="rounded-2xl p-8"
                  style={{
                    background: 'linear-gradient(135deg, rgba(64,138,113,0.12) 0%, rgba(40,90,72,0.18) 100%)',
                    border: '1px solid rgba(64,138,113,0.28)',
                  }}
                >
                  <h2 className="text-xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-display)' }}>
                    {event.is_upcoming ? 'Interested in attending?' : 'Stay in the loop'}
                  </h2>
                  <p className="text-base mb-6" style={{ color: 'var(--text-secondary)' }}>
                    {event.is_upcoming
                      ? 'Contact us to register, ask about sponsorship opportunities, or get more information about this event.'
                      : 'Missed this one? Get in touch and we will notify you about our upcoming events and workshops.'}
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <Link href={contactUrl} className="btn-primary inline-flex items-center gap-2">
                      <Mail size={15} />
                      {event.is_upcoming ? 'Book / Enquire Now' : 'Stay Notified'}
                      <ArrowRight size={15} />
                    </Link>
                    {event.is_upcoming && event.website_url && (
                      <a href={event.website_url} target="_blank" rel="noopener noreferrer"
                        className="btn-ghost inline-flex items-center gap-2">
                        <ExternalLink size={14} /> Official Event Site
                      </a>
                    )}
                  </div>
                </div>

                {/* Bottom nav */}
                <div className="pt-2 flex flex-wrap gap-3">
                  <Link href="/events" className="btn-ghost inline-flex items-center gap-2">
                    <ArrowLeft size={15} /> All Events
                  </Link>
                  <Link href="/contact" className="btn-ghost inline-flex items-center gap-2">
                    Contact Us <ArrowRight size={15} />
                  </Link>
                </div>

              </div>
            </div>
          )}

          {!loading && !event && (
            <div className="text-center py-20" style={{ color: 'var(--text-muted)' }}>
              <p className="text-lg mb-4">Event not found.</p>
              <Link href="/events" className="btn-ghost inline-flex items-center gap-2">
                <ArrowLeft size={14} /> Back to Events
              </Link>
            </div>
          )}

        </div>
      </section>
    </PublicLayout>
  );
}
