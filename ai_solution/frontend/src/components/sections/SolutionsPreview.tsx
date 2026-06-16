'use client';
import Link from 'next/link';
import { ArrowRight, Building2, CheckCircle, Clock, Rocket, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import SkeletonCard from '@/components/ui/SkeletonCard';
import SectionHeader from '@/components/ui/SectionHeader';

const MEDIA_URL = process.env.NEXT_PUBLIC_MEDIA_URL || 'http://localhost:8000';

function imgSrc(path?: string) {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  if (path.startsWith('/media/')) return `${MEDIA_URL}${path}`;
  return `${MEDIA_URL}/media/${path}`;
}

const STATUS_META: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  deployed:        { label: 'Deployed',         color: '#22c55e', icon: <CheckCircle size={11} /> },
  in_development:  { label: 'In Development',   color: '#f59e0b', icon: <Clock size={11} /> },
  ready_to_launch: { label: 'Ready to Launch',  color: '#3b82f6', icon: <Rocket size={11} /> },
};

function SolutionCard({ s }: { s: any }) {
  const meta = STATUS_META[s.status] ?? STATUS_META.deployed;
  const banner = imgSrc(s.image_url || s.image);

  return (
    <div
      className="group relative flex flex-col rounded-2xl overflow-hidden border bg-[var(--bg-card)] transition-all duration-300 hover:-translate-y-1"
      style={{
        borderColor: 'var(--border)',
        boxShadow: 'none',
        transition: 'transform 0.25s, box-shadow 0.25s, border-color 0.25s',
      }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLElement;
        el.style.borderColor = 'rgba(64,138,113,0.5)';
        el.style.boxShadow = '0 8px 40px rgba(64,138,113,0.15)';
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLElement;
        el.style.borderColor = 'var(--border)';
        el.style.boxShadow = 'none';
      }}
    >
      {/* Thumbnail */}
      <div className="relative h-48 overflow-hidden bg-[#091413]">
        {banner ? (
          <img
            src={banner}
            alt={s.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg,#0d1f1d,#122b27,rgba(64,138,113,0.1))' }}>
            <span className="text-5xl opacity-10">🏭</span>
          </div>
        )}

        {/* Status badge */}
        <div className="absolute top-3 left-3">
          <span
            className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-semibold"
            style={{ background: `${meta.color}22`, color: meta.color, border: `1px solid ${meta.color}44` }}
          >
            {meta.icon} {meta.label}
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 p-5">
        {/* Industry + year */}
        <div className="flex items-center gap-2 mb-3">
          <span
            className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-semibold"
            style={{ background: 'rgba(64,138,113,0.15)', color: '#6ecfaa', border: '1px solid rgba(64,138,113,0.3)' }}
          >
            <Building2 size={10} /> {s.industry}
          </span>
          {s.year && <span className="ml-auto text-xs" style={{ color: 'var(--text-muted)' }}>{s.year}</span>}
        </div>

        {/* Title */}
        <h3
          className="text-base font-bold text-white mb-2 leading-snug transition-colors duration-200 group-hover:text-[var(--accent-light)]"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          {s.title}
        </h3>

        {/* Short description */}
        <p className="text-sm leading-relaxed flex-1 mb-4" style={{ color: 'var(--text-secondary)' }}>
          {s.short_description || s.description?.slice(0, 120)}
        </p>

        {/* Tech tags */}
        {s.technologies?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4 pt-3" style={{ borderTop: '1px solid var(--border)' }}>
            {s.technologies.slice(0, 4).map((t: string, i: number) => (
              <span
                key={i}
                className="px-2 py-0.5 rounded-md text-[10px] font-medium"
                style={{ background: 'var(--accent-dim)', color: 'var(--accent-light)', border: '1px solid rgba(64,138,113,0.2)' }}
              >
                {t}
              </span>
            ))}
            {s.technologies.length > 4 && (
              <span className="px-2 py-0.5 rounded-md text-[10px] font-medium" style={{ color: 'var(--text-muted)' }}>
                +{s.technologies.length - 4} more
              </span>
            )}
          </div>
        )}

        {/* CTA */}
        <Link
          href={`/solutions/${s.id}`}
          className="group/btn mt-auto inline-flex items-center justify-between gap-2 w-full px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200"
          style={{
            background: 'var(--accent-dim)',
            border: '1px solid rgba(64,138,113,0.25)',
            color: 'var(--accent-light)',
          }}
          onMouseEnter={e => {
            const el = e.currentTarget as HTMLElement;
            el.style.background = 'rgba(64,138,113,0.25)';
            el.style.borderColor = 'rgba(64,138,113,0.5)';
          }}
          onMouseLeave={e => {
            const el = e.currentTarget as HTMLElement;
            el.style.background = 'var(--accent-dim)';
            el.style.borderColor = 'rgba(64,138,113,0.25)';
          }}
        >
          View Details
          <ArrowRight size={14} className="transition-transform duration-200 group-hover/btn:translate-x-1" />
        </Link>
      </div>
    </div>
  );
}

const PER_PAGE = 3;

export default function SolutionsPreview({ solutions, loading }: { solutions: any[]; loading?: boolean }) {
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(solutions.length / PER_PAGE);
  const paginated = solutions.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <section className="section-pad">
      <div className="container-custom">

        <SectionHeader
          badge="Industry Products"
          title={
            <>
              Our Delivery <span className="gradient-text">Products</span>
            </>
          }
          gradient={false}
          subtitle="Real-world AI products delivered across industries — from healthcare to finance, built and deployed at scale."
          action={
            <Link href="/solutions" className="btn-ghost inline-flex items-center gap-2 text-sm">
              Explore All Products <ArrowRight size={14} />
            </Link>
          }
        />

        {/* Status legend */}
        {!loading && solutions.length > 0 && (
          <div className="flex flex-wrap gap-3 mb-8 -mt-4">
            {Object.values(STATUS_META).map(m => (
              <span
                key={m.label}
                className="inline-flex items-center gap-1.5 text-xs font-medium"
                style={{ color: m.color }}
              >
                {m.icon} {m.label}
              </span>
            ))}
          </div>
        )}

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading
            ? Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} variant="service" />)
            : paginated.length === 0
              ? (
                <div className="col-span-3 text-center py-16" style={{ color: 'var(--text-muted)' }}>
                  No products to display yet.
                </div>
              )
              : paginated.map(s => <SolutionCard key={s.id} s={s} />)
          }
        </div>

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="flex items-center justify-center gap-4 mt-10">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="w-9 h-9 flex items-center justify-center rounded-xl transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
              style={{ border: '1px solid var(--border)', color: 'var(--text-secondary)' }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'var(--accent)'; el.style.background = 'var(--accent-dim)'; el.style.color = '#fff'; }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'var(--border)'; el.style.background = 'transparent'; el.style.color = 'var(--text-secondary)'; }}
            >
              <ChevronLeft size={18} />
            </button>
            <span className="text-sm" style={{ color: 'var(--text-muted)' }}>{page} / {totalPages}</span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="w-9 h-9 flex items-center justify-center rounded-xl transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
              style={{ border: '1px solid var(--border)', color: 'var(--text-secondary)' }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'var(--accent)'; el.style.background = 'var(--accent-dim)'; el.style.color = '#fff'; }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'var(--border)'; el.style.background = 'transparent'; el.style.color = 'var(--text-secondary)'; }}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}

      </div>
    </section>
  );
}
