'use client';
import PublicLayout from '@/components/layout/PublicLayout';
import PageHero from '@/components/ui/PageHero';
import ServiceCard from '@/components/ui/ServiceCard';
import SkeletonCard from '@/components/ui/SkeletonCard';
import { EmptyState } from '@/components/ui/StateUI';
import { useFetch } from '@/hooks/useFetch';
import { servicesAPI } from '@/lib/api';

export default function ServicesPage() {
  const { data: services, loading } = useFetch<any[]>(() => servicesAPI.list());

  return (
    <PublicLayout>
      <PageHero
        badge="What We Offer"
        title={<>Our <span className="gradient-text">AI Solutions</span></>}
        subtitle="Tailored AI-powered software solutions designed to accelerate your digital transformation."
        blobClass="bg-brand-600/15 -top-20 left-0"
        centered
      />

      <section className="section-pad">
        <div className="container-custom">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} variant="service" />)}
            </div>
          ) : !services?.length ? (
            <EmptyState message="Services coming soon. Check back later!" />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((s: any, i: number) => (
                <ServiceCard key={s.id} {...s} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>
    </PublicLayout>
  );
}
