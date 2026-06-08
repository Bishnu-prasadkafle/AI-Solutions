'use client';
import { useState, useMemo } from 'react';
import Link from 'next/link';
import { ArrowRight, Building2, CheckCircle, Clock, Rocket, Search, X } from 'lucide-react';
import PublicLayout from '@/components/layout/PublicLayout';
import PageHero from '@/components/ui/PageHero';
import SkeletonCard from '@/components/ui/SkeletonCard';
import { EmptyState } from '@/components/ui/StateUI';
import { useFetch } from '@/hooks/useFetch';
import { solutionsAPI } from '@/lib/api';

const MEDIA_URL = process.env.NEXT_PUBLIC_MEDIA_URL || 'http://localhost:8000';

function imgSrc(path?: string) {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  if (path.startsWith('/media/')) return `${MEDIA_URL}${path}`;
  return `${MEDIA_URL}/media/${path}`;
}

const STATUS_META: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  deployed: { label: 'Deployed', color: '#22c55e', icon: <CheckCircle size={12} /> },
  in_development: { label: 'In Development', color: '#f59e0b', icon: <Clock size={12} /> },
  ready_to_launch: { label: 'Ready to Launch', color: '#3b82f6', icon: <Rocket size={12} /> },
};

const STATUS_FILTERS = [
  { value: 'all', label: 'All' },
  { value: 'deployed', label: 'Deployed' },
  { value: 'in_development', label: 'In Development' },
  { value: 'ready_to_launch', label: 'Ready to Launch' },
];

function SolutionCard({ s }: { s: any }) {
  const meta = STATUS_META[s.status] || STATUS_META.deployed;
  const banner = imgSrc(s.image_url || s.image);
  return (
    <div className="group relative flex flex-col rounded-2xl overflow-hidden border border-[var(--border)] bg-[var(--bg-card)] hover:border-[var(--accent)]/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_40px_rgba(64,138,113,0.15)]">
      <div className="relative h-48 overflow-hidden bg-[#091413]">
        {banner ? (
          <img src={banner} alt={s.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#0d1f1d] via-[#122b27] to-[#408A71]/10 flex items-center justify-center">
            <span className="text-5xl opacity-10">🏭</span>
          </div>
        )}
        <div className="absolute top-3 left-3">
          <span
            className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-semibold"
            style={{ background: `${meta.color}22`, color: meta.color, border: `1px solid ${meta.color}44` }}
          >
            {meta.icon} {meta.label}
          </span>
        </div>
      </div>
      <div className="flex flex-col flex-1 p-6">
        <div className="flex items-center gap-2 mb-3">
          <span
            className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-semibold"
            style={{ background: 'rgba(64,138,113,0.2)', color: '#6ecfaa', border: '1px solid rgba(64,138,113,0.35)' }}
          >
            <Building2 size={10} /> {s.industry}
          </span>
          {s.year && <span className="ml-auto text-xs text-[var(--text-muted)]">{s.year}</span>}
        </div>
        <h3 className="text-base font-bold text-white mb-2 group-hover:text-[var(--accent-light)] transition-colors leading-snug" style={{ fontFamily: 'var(--font-display)' }}>
          {s.title}
        </h3>
        <p className="text-sm text-[var(--text-secondary)] leading-relaxed flex-1 mb-4">
          {s.short_description || s.description?.slice(0, 120)}
        </p>
        {s.technologies?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4 pt-3 border-t border-[var(--border)]">
            {s.technologies.slice(0, 4).map((t: string, i: number) => (
              <span key={i} className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-[var(--accent-dim)] text-[var(--accent-light)] border border-[var(--accent)]/20">{t}</span>
            ))}
          </div>
        )}
        <Link
          href={`/solutions/${s.id}`}
          className="group/btn mt-auto inline-flex items-center justify-between gap-2 w-full px-4 py-2.5 rounded-xl bg-[var(--accent-dim)] border border-[var(--accent)]/20 text-sm font-semibold text-[var(--accent-light)] hover:bg-[var(--accent)]/20 hover:border-[var(--accent)]/50 transition-all duration-200"
        >
          View Details
          <ArrowRight size={14} className="transition-transform duration-200 group-hover/btn:translate-x-1" />
        </Link>
      </div>
    </div>
  );
}

export default function SolutionsPage() {
  const { data: solutions, loading } = useFetch<any[]>(() => solutionsAPI.list());
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filtered = useMemo(() => {
    let list = solutions || [];
    if (statusFilter !== 'all') list = list.filter((s) => s.status === statusFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((s) =>
        s.title?.toLowerCase().includes(q) ||
        s.industry?.toLowerCase().includes(q) ||
        s.short_description?.toLowerCase().includes(q) ||
        s.description?.toLowerCase().includes(q)
      );
    }
    return list;
  }, [solutions, search, statusFilter]);

  const deployed = filtered.filter((s) => s.status === 'deployed');
  const upcoming = filtered.filter((s) => s.status === 'in_development' || s.status === 'ready_to_launch');

  return (
    <PublicLayout>
      <PageHero
        badge="Our Work"
        title={<>AI Solutions Across <span className="gradient-text">Industries</span></>}
        subtitle="Real-world AI solutions delivered to industries worldwide — with more on the way."
        blobClass="bg-brand-600/15 -top-20 left-0"
        centered
      />

      {/* Search & Filter */}
      <section className="pb-4 pt-2">
        <div className="container-custom">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none z-10" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by title, industry, description..."
                className="input-field text-sm w-full"
                style={{ paddingLeft: '2.25rem', paddingRight: search ? '2.25rem' : '1rem' }}
              />
              {search && (
                <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-white">
                  <X size={14} />
                </button>
              )}
            </div>
            {/* Status filter tabs */}
            <div className="flex gap-2 flex-wrap">
              {STATUS_FILTERS.map((f) => (
                <button
                  key={f.value}
                  onClick={() => setStatusFilter(f.value)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    statusFilter === f.value
                      ? 'bg-accent/20 text-accent border border-accent/30'
                      : 'text-[var(--text-secondary)] border border-[var(--border)] hover:border-accent/30'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Past / Deployed Solutions */}
      <section className="section-pad">
        <div className="container-custom">
          <div className="mb-10 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>
              Past <span className="gradient-text">Solutions</span>
            </h2>
            <p className="text-[var(--text-secondary)] mt-2">
              Successfully deployed solutions that are live and delivering value.
            </p>
          </div>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} variant="service" />)}
            </div>
          ) : !deployed.length ? (
            <EmptyState message="No deployed solutions found." />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {deployed.map((s) => <SolutionCard key={s.id} s={s} />)}
            </div>
          )}
        </div>
      </section>

      {/* Upcoming Solutions */}
      <section className="section-pad bg-[var(--bg-card)]">
        <div className="container-custom">
          <div className="mb-10 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>
              Upcoming <span className="gradient-text">Solutions</span>
            </h2>
            <p className="text-[var(--text-secondary)] mt-2">
              Solutions currently in development or ready to launch — watch this space.
            </p>
          </div>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} variant="service" />)}
            </div>
          ) : !upcoming.length ? (
            <EmptyState message="No upcoming solutions found." />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {upcoming.map((s) => <SolutionCard key={s.id} s={s} />)}
            </div>
          )}
        </div>
      </section>
    </PublicLayout>
  );
}
