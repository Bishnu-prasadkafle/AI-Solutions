import Link from 'next/link';
import { Calendar, Clock, User, ArrowRight } from 'lucide-react';

export interface BlogCardProps {
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
  variant?: 'featured' | 'side';
}

const MEDIA_URL = process.env.NEXT_PUBLIC_MEDIA_URL || 'http://localhost:8000';

export function imgSrc(path?: string) {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  if (path.startsWith('/media/')) return `${MEDIA_URL}${path}`;
  return `${MEDIA_URL}/media/${path}`;
}

export function formatDate(d?: string) {
  if (!d) return '';
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function BlogCard({
  id, title, excerpt, content, cover_image, cover_image_url, category,
  created_at, read_time, author_name, variant = 'featured',
}: BlogCardProps) {
  const src = imgSrc(cover_image_url || cover_image);

  if (variant === 'side') {
    return (
      <Link href={`/blog/${id}`} className="group block">
        <div className="flex overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] hover:border-[var(--accent)]/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_40px_rgba(64,138,113,0.15)]">
          <div className="relative w-32 shrink-0 overflow-hidden bg-[#091413]">
            {src ? (
              <img src={src} alt={title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-[#0d1f1d] to-[#408A71]/10" />
            )}
          </div>
          <div className="p-4 flex flex-col justify-center gap-1.5 flex-1 min-w-0">
            {category && (
              <span className="badge badge-cyan text-[10px] capitalize w-fit">{category.replace('_', ' ')}</span>
            )}
            <h3 className="text-sm font-semibold text-white group-hover:text-[var(--accent-light)] transition-colors line-clamp-2 leading-snug" style={{ fontFamily: 'var(--font-display)' }}>
              {title}
            </h3>
            <div className="flex items-center gap-3 text-xs text-[var(--text-muted)] flex-wrap">
              <span className="flex items-center gap-1"><Calendar size={10} />{formatDate(created_at)}</span>
              {read_time && <span className="flex items-center gap-1"><Clock size={10} />{read_time} min</span>}
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/blog/${id}`} className="group block h-full">
      <div className="relative flex flex-col h-full rounded-2xl overflow-hidden border border-[var(--border)] bg-[var(--bg-card)] hover:border-[var(--accent)]/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_40px_rgba(64,138,113,0.15)]">

        {/* Image */}
        <div className="relative h-52 overflow-hidden shrink-0 bg-[#091413]">
          {src ? (
            <img src={src} alt={title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#0d1f1d] via-[#122b27] to-[#408A71]/10" />
          )}

          {/* Badges */}
          <div className="absolute top-3 left-3 flex gap-2">
            {category && (
              <span className="badge badge-cyan text-[10px] capitalize">{category.replace('_', ' ')}</span>
            )}
          </div>
          {read_time && (
            <span className="absolute top-3 right-3 flex items-center gap-1 text-[10px] text-white/80 bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-full border border-white/10">
              <Clock size={9} />{read_time} min read
            </span>
          )}
        </div>

        {/* Body */}
        <div className="flex flex-col flex-1 p-6">
          <h3
            className="text-base font-bold text-white mb-2 group-hover:text-[var(--accent-light)] transition-colors leading-snug"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {title}
          </h3>

          <p className="text-sm text-[var(--text-secondary)] leading-relaxed line-clamp-2 flex-1 mb-4">
            {excerpt || content?.slice(0, 130)}
          </p>

          {/* Meta + CTA */}
          <div className="pt-4 border-t border-[var(--border)] flex items-center justify-between gap-3 text-xs text-[var(--text-muted)]">
            <div className="flex items-center gap-3">
              {author_name && (
                <span className="flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-[var(--accent-dim)] border border-[var(--border)] flex items-center justify-center">
                    <User size={9} className="text-[var(--accent-light)]" />
                  </span>
                  {author_name}
                </span>
              )}
              <span className="flex items-center gap-1"><Calendar size={10} />{formatDate(created_at)}</span>
            </div>
            <span className="inline-flex items-center gap-1 text-[var(--accent-light)] font-semibold shrink-0 group-hover:gap-2 transition-all duration-200">
              Read more <ArrowRight size={11} className="transition-transform duration-200 group-hover:translate-x-0.5" />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
