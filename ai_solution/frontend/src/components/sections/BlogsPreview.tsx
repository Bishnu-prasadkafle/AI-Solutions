'use client';
import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import SectionHeader from '@/components/ui/SectionHeader';
import BlogCard from '@/components/ui/BlogCard';
import SkeletonCard from '@/components/ui/SkeletonCard';

interface Blog {
  id: number;
  title: string;
  excerpt?: string;
  content?: string;
  cover_image?: string;
  cover_image_url?: string;
  category?: string;
  created_at?: string;
  read_time?: number;
  author_name?: string;
}

const PER_PAGE = 3;

export default function BlogsPreview({ blogs, loading }: { blogs: Blog[]; loading?: boolean }) {
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(blogs.length / PER_PAGE);
  const paginated = blogs.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const showSkeleton = loading;

  return (
    <section className="section-pad">
      <div className="container-custom">

        <SectionHeader
          badge="Recent Insights"
          title={<span className="gradient-text">Latest Articles</span>}
          gradient={false}
          subtitle="Stay ahead with our latest thinking on AI, automation, and digital transformation."
          action={
            <Link href="/blog" className="btn-ghost inline-flex items-center gap-2 text-sm">
              View All Posts <ArrowRight size={14} />
            </Link>
          }
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {showSkeleton
            ? Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} variant="blog-featured" />)
            : paginated.map((b) => (
                <BlogCard key={b.id} {...b} variant="featured" />
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
