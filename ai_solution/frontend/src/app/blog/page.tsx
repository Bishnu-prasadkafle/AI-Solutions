'use client';
import { useState } from 'react';
import PublicLayout from '@/components/layout/PublicLayout';
import PageHero from '@/components/ui/PageHero';
import FilterTabs from '@/components/ui/FilterTabs';
import BlogCard from '@/components/ui/BlogCard';
import SkeletonCard from '@/components/ui/SkeletonCard';
import { EmptyState } from '@/components/ui/StateUI';
import { useFetch } from '@/hooks/useFetch';
import { blogsAPI } from '@/lib/api';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const PER_PAGE = 9;

const CATEGORY_TABS = [
  { value: '', label: 'All' },
  { value: 'ai', label: 'AI' },
  { value: 'tech', label: 'Technology' },
  { value: 'news', label: 'News' },
  { value: 'tutorial', label: 'Tutorials' },
  { value: 'case_study', label: 'Case Studies' },
];

export default function BlogPage() {
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);

  const { data: posts, loading } = useFetch<any[]>(
    () => blogsAPI.list(category ? { category } : {}),
    [category]
  );

  const allPosts = posts ?? [];
  const totalPages = Math.ceil(allPosts.length / PER_PAGE);
  const paginated = allPosts.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  function handleFilter(val: string) {
    setCategory(val);
    setPage(1);
  }

  return (
    <PublicLayout>
      <PageHero
        badge="Insights & Articles"
        title={<>The AI-Solution <span className="gradient-text">Blog</span></>}
        subtitle="Expert insights on AI, digital transformation, and the future of work."
        blobClass="bg-brand-600/15 top-0 left-1/3"
        centered
      />

      <section className="section-pad">
        <div className="container-custom">
          <FilterTabs tabs={CATEGORY_TABS} active={category} onChange={handleFilter} />

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} variant="blog-featured" />)}
            </div>
          ) : !allPosts.length ? (
            <EmptyState message="No posts yet. Check back soon!" />
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {paginated.map((post: any) => (
                  <BlogCard key={post.id} {...post} variant="featured" />
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-3 mt-12">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-[var(--border)] text-sm text-[var(--text-secondary)] hover:text-white hover:border-[var(--accent)] hover:bg-[var(--accent-dim)] disabled:opacity-30 disabled:cursor-not-allowed transition-all">
                    <ChevronLeft size={16} /> Previous
                  </button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }).map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setPage(i + 1)}
                        className={`w-8 h-8 rounded-lg text-sm font-medium transition-all ${
                          page === i + 1
                            ? 'bg-[var(--accent)] text-white'
                            : 'text-[var(--text-secondary)] hover:text-white hover:bg-[var(--accent-dim)] border border-[var(--border)]'
                        }`}>
                        {i + 1}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-[var(--border)] text-sm text-[var(--text-secondary)] hover:text-white hover:border-[var(--accent)] hover:bg-[var(--accent-dim)] disabled:opacity-30 disabled:cursor-not-allowed transition-all">
                    Next <ChevronRight size={16} />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </PublicLayout>
  );
}
