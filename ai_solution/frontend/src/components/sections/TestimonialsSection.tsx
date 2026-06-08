import { Star } from 'lucide-react';
import SectionHeader from '@/components/ui/SectionHeader';

const MEDIA_URL = process.env.NEXT_PUBLIC_MEDIA_URL || 'http://localhost:8000';

interface Review {
  id: number;
  rating: number;
  message: string;
  name: string;
  company?: string;
  avatar?: string;
}

function avatarSrc(path?: string) {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  return `${MEDIA_URL}${path}`;
}

interface TestimonialsSectionProps {
  reviews: Review[];
}

export default function TestimonialsSection({ reviews }: TestimonialsSectionProps) {
  if (!reviews.length) return null;

  return (
    <section className="section-pad">
      <div className="container-custom">
        <SectionHeader
          badge="Testimonials"
          title={<>Trusted by <span className="gradient-text">Industry Leaders</span></>}
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.slice(0, 3).map((r) => (
            <div key={r.id} className="glass rounded-2xl p-6">
              <div className="flex mb-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={14} className={i < r.rating ? 'text-yellow-400 fill-yellow-400' : 'text-[var(--text-muted)]'} />
                ))}
              </div>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-4">"{r.message}"</p>
              <div className="flex items-center gap-3">
                {avatarSrc(r.avatar) ? (
                  <img
                    src={avatarSrc(r.avatar)!}
                    alt={r.name}
                    className="w-10 h-10 rounded-full object-cover border-2 shrink-0"
                    style={{ borderColor: 'rgba(64,138,113,0.4)' }}
                  />
                ) : (
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0"
                    style={{ background: 'linear-gradient(135deg, #285A48, #408A71)' }}
                  >
                    {r.name?.charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <p className="text-sm font-semibold text-white">{r.name}</p>
                  {r.company && <p className="text-xs text-[var(--text-muted)]">{r.company}</p>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
