'use client';
import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import SectionHeader from '@/components/ui/SectionHeader';
import ServiceCard from '@/components/ui/ServiceCard';
import SkeletonCard from '@/components/ui/SkeletonCard';

interface Service {
  id: number;
  image?: string;
  image_url?: string;
  title: string;
  short_description?: string;
  description?: string;
  features?: string[];
}

const PER_PAGE = 3;

export default function ServicesPreview({ services, loading }: { services: Service[]; loading?: boolean }) {
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(services.length / PER_PAGE);
  const paginated = services.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const showSkeleton = loading;

  return (
    <section className="section-pad bg-[var(--bg-card)]">
      <div className="container-custom">

        <SectionHeader
          badge="What We Offer"
          title={
            <span className="gradient-text">Featured Services</span>
          }
          gradient={false}
          subtitle="End-to-end AI services designed to accelerate your digital transformation journey."
          action={
            <Link href="/services" className="btn-ghost inline-flex items-center gap-2 text-sm">
              Explore All Services <ArrowRight size={14} />
            </Link>
          }
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {showSkeleton
            ? Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} variant="service" />)
            : paginated.map((s, i) => (
                <ServiceCard key={s.id} {...s} index={(page - 1) * PER_PAGE + i} />
              ))
          }
        </div>

        {!showSkeleton && totalPages > 1 && (
          <div className="flex items-center justify-center gap-4 mt-10">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="w-9 h-9 flex items-center justify-center rounded-xl border border-[var(--border)] text-[var(--text-secondary)] hover:text-white hover:border-[var(--accent)] hover:bg-[var(--accent-dim)] disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
            >
              <ChevronLeft size={18} />
            </button>
            <span className="text-sm text-[var(--text-muted)]">{page} / {totalPages}</span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="w-9 h-9 flex items-center justify-center rounded-xl border border-[var(--border)] text-[var(--text-secondary)] hover:text-white hover:border-[var(--accent)] hover:bg-[var(--accent-dim)] disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}

      </div>
    </section>
  );
}
