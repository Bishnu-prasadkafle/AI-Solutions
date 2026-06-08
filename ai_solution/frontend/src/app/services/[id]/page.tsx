'use client';
import { use } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, ArrowRight } from 'lucide-react';
import PublicLayout from '@/components/layout/PublicLayout';
import { useFetch } from '@/hooks/useFetch';
import { servicesAPI } from '@/lib/api';
import { LoadingSpinner } from '@/components/ui/StateUI';

const MEDIA_URL = process.env.NEXT_PUBLIC_MEDIA_URL || 'http://localhost:8000';

function imgSrc(path?: string) {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  if (path.startsWith('/media/')) return `${MEDIA_URL}${path}`;
  return `${MEDIA_URL}/media/${path}`;
}

export default function ServiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: service, loading } = useFetch<any>(() => servicesAPI.get(Number(id)));

  return (
    <PublicLayout>
      <section className="section-pad pt-32">
        <div className="container-custom max-w-4xl">

          <Link href="/services" className="inline-flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-[var(--accent-light)] transition-colors mb-10">
            <ArrowLeft size={15} /> Back to Services
          </Link>

          {loading && <LoadingSpinner />}

          {!loading && service && (
            <div className="glass rounded-3xl overflow-hidden">

              {/* Cover image */}
              {imgSrc(service.image_url || service.image) && (
                <div className="overflow-hidden" style={{ borderBottom: '1px solid rgba(64,138,113,0.15)' }}>
                  <img
                    src={imgSrc(service.image_url || service.image)!}
                    alt={service.title}
                    className="w-full h-80 object-cover"
                  />
                </div>
              )}

              <div className="p-10">
                <div className="badge badge-cyan mb-3">Service</div>
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-4" style={{ fontFamily: 'var(--font-display)' }}>
                  {service.title}
                </h1>

                {service.short_description && (
                  <p className="text-lg text-[var(--accent-light)] leading-relaxed mb-6 font-medium">
                    {service.short_description}
                  </p>
                )}

                <p className="text-[var(--text-secondary)] leading-relaxed text-base mb-8">
                  {service.description}
                </p>

                {service.features?.length > 0 && (
                  <div className="mb-10">
                    <h2 className="text-lg font-bold text-white mb-4" style={{ fontFamily: 'var(--font-display)' }}>
                      What's Included
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {service.features.map((f: string, i: number) => (
                        <div key={i} className="flex items-start gap-3 glass rounded-xl p-4">
                          <CheckCircle size={16} className="text-[var(--accent)] shrink-0 mt-0.5" />
                          <span className="text-sm text-[var(--text-secondary)]">{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="pt-6 border-t border-[var(--border)] flex flex-wrap gap-4">
                  <Link href="/contact" className="btn-primary inline-flex items-center gap-2">
                    Get Started <ArrowRight size={15} />
                  </Link>
                  <Link href="/services" className="btn-ghost inline-flex items-center gap-2">
                    <ArrowLeft size={15} /> All Services
                  </Link>
                </div>
              </div>
            </div>
          )}

          {!loading && !service && (
            <div className="text-center py-20 text-[var(--text-muted)]">
              <p className="text-lg mb-4">Service not found.</p>
              <Link href="/services" className="btn-ghost inline-flex items-center gap-2">
                <ArrowLeft size={14} /> Back to Services
              </Link>
            </div>
          )}

        </div>
      </section>
    </PublicLayout>
  );
}
