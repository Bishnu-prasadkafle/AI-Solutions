import Link from 'next/link';
import { ArrowRight, CheckCircle } from 'lucide-react';

export interface ServiceCardProps {
  id: number;
  image?: string;
  image_url?: string;
  title: string;
  short_description?: string;
  description?: string;
  features?: string[];
  index?: number;
}

const MEDIA_URL = process.env.NEXT_PUBLIC_MEDIA_URL || 'http://localhost:8000';

export function imgSrc(path?: string) {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  if (path.startsWith('/media/')) return `${MEDIA_URL}${path}`;
  return `${MEDIA_URL}/media/${path}`;
}

export default function ServiceCard({ id, image, image_url, title, short_description, description, features, index = 0 }: ServiceCardProps) {
  const desc = short_description || description?.slice(0, 120) || '';
  const bannerSrc = image_url || imgSrc(image);

  return (
    <div className="group relative flex flex-col rounded-2xl overflow-hidden border border-[var(--border)] bg-[var(--bg-card)] hover:border-[var(--accent)]/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_40px_rgba(64,138,113,0.15)]">

      {/* Image */}
      <div className="relative h-48 overflow-hidden bg-[#091413]">
        {bannerSrc ? (
          <img
            src={bannerSrc}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#0d1f1d] via-[#122b27] to-[#408A71]/10 flex items-center justify-center">
            <span className="text-5xl opacity-10">⚡</span>
          </div>
        )}
        {/* Index badge */}
        <div className="absolute top-3 left-3">
          <span className="badge badge-cyan text-[10px]">0{index + 1}</span>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 p-6">
        <h3
          className="text-base font-bold text-white mb-2 group-hover:text-[var(--accent-light)] transition-colors duration-200 leading-snug"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          {title}
        </h3>

        <p className="text-sm text-[var(--text-secondary)] leading-relaxed flex-1 mb-4">
          {desc}
        </p>

        {/* Features */}
        {features && features.length > 0 && (
          <ul className="space-y-1.5 mb-5 pt-4 border-t border-[var(--border)]">
            {features.slice(0, 3).map((f, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-[var(--text-secondary)]">
                <CheckCircle size={12} className="text-[var(--accent)] shrink-0 mt-0.5" />
                {f}
              </li>
            ))}
          </ul>
        )}

        {/* CTA */}
        <Link
          href={`/services/${id}`}
          className="group/btn mt-auto inline-flex items-center justify-between gap-2 w-full px-4 py-2.5 rounded-xl bg-[var(--accent-dim)] border border-[var(--accent)]/20 text-sm font-semibold text-[var(--accent-light)] hover:bg-[var(--accent)]/20 hover:border-[var(--accent)]/50 transition-all duration-200"
        >
          View Details
          <ArrowRight size={14} className="transition-transform duration-200 group-hover/btn:translate-x-1" />
        </Link>
      </div>
    </div>
  );
}
