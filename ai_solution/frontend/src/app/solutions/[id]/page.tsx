'use client';
import { use } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Building2, CheckCircle, Clock, Rocket } from 'lucide-react';
import PublicLayout from '@/components/layout/PublicLayout';
import { useFetch } from '@/hooks/useFetch';
import { solutionsAPI } from '@/lib/api';
import { LoadingSpinner } from '@/components/ui/StateUI';

const MEDIA_URL = process.env.NEXT_PUBLIC_MEDIA_URL || 'http://localhost:8000';

function imgSrc(path?: string) {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  if (path.startsWith('/media/')) return `${MEDIA_URL}${path}`;
  return `${MEDIA_URL}/media/${path}`;
}

const STATUS_META: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  deployed: { label: 'Deployed', color: '#22c55e', icon: <CheckCircle size={13} /> },
  in_development: { label: 'In Development', color: '#f59e0b', icon: <Clock size={13} /> },
  ready_to_launch: { label: 'Ready to Launch', color: '#3b82f6', icon: <Rocket size={13} /> },
};

export default function SolutionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: solution, loading } = useFetch<any>(() => solutionsAPI.get(Number(id)));

  return (
    <PublicLayout>
      <section className="section-pad pt-32">
        <div className="container-custom max-w-4xl">
          <Link href="/solutions" className="inline-flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-[var(--accent-light)] transition-colors mb-10">
            <ArrowLeft size={15} /> Back to Solutions
          </Link>

          {loading && <LoadingSpinner />}

          {!loading && solution && (() => {
            const meta = STATUS_META[solution.status] || STATUS_META.deployed;
            const banner = imgSrc(solution.image_url || solution.image);
            return (
              <div className="glass rounded-3xl overflow-hidden">
                {banner && (
                  <div className="overflow-hidden" style={{ borderBottom: '1px solid rgba(64,138,113,0.15)' }}>
                    <img src={banner} alt={solution.title} className="w-full h-80 object-cover" />
                  </div>
                )}
                <div className="p-10">
                  <div className="flex flex-wrap items-center gap-3 mb-4">
                    <span
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
                      style={{ background: `${meta.color}22`, color: meta.color, border: `1px solid ${meta.color}44` }}
                    >
                      {meta.icon} {meta.label}
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
                      <Building2 size={12} style={{ color: '#408A71' }} /> {solution.industry}
                    </span>
                    {solution.year && <span className="text-xs text-[var(--text-muted)]">{solution.year}</span>}
                  </div>

                  <h1 className="text-3xl md:text-4xl font-bold text-white mb-4" style={{ fontFamily: 'var(--font-display)' }}>
                    {solution.title}
                  </h1>

                  {solution.short_description && (
                    <p className="text-lg text-[var(--accent-light)] leading-relaxed mb-6 font-medium">
                      {solution.short_description}
                    </p>
                  )}

                  <p className="text-[var(--text-secondary)] leading-relaxed text-base mb-8">
                    {solution.description}
                  </p>

                  {solution.technologies?.length > 0 && (
                    <div className="mb-8">
                      <h2 className="text-sm font-semibold uppercase tracking-widest text-[#408A71] mb-3">Technologies Used</h2>
                      <div className="flex flex-wrap gap-2">
                        {solution.technologies.map((t: string, i: number) => (
                          <span key={i} className="px-3 py-1 rounded-lg text-xs font-medium bg-[var(--accent-dim)] text-[var(--accent-light)] border border-[var(--accent)]/20">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="pt-6 border-t border-[var(--border)] flex flex-wrap gap-4">
                    <Link href="/contact" className="btn-primary inline-flex items-center gap-2">
                      Get a Similar Solution <ArrowRight size={15} />
                    </Link>
                    <Link href="/solutions" className="btn-ghost inline-flex items-center gap-2">
                      <ArrowLeft size={15} /> All Solutions
                    </Link>
                  </div>
                </div>
              </div>
            );
          })()}

          {!loading && !solution && (
            <div className="text-center py-20 text-[var(--text-muted)]">
              <p className="text-lg mb-4">Solution not found.</p>
              <Link href="/solutions" className="btn-ghost inline-flex items-center gap-2">
                <ArrowLeft size={14} /> Back to Solutions
              </Link>
            </div>
          )}
        </div>
      </section>
    </PublicLayout>
  );
}
