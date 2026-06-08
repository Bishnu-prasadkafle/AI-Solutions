interface PageHeroProps {
  badge: string;
  title: React.ReactNode;
  subtitle?: string;
  blobClass?: string;
  centered?: boolean;
}

export default function PageHero({ badge, title, subtitle, blobClass, centered }: PageHeroProps) {
  return (
    <section className="relative pt-32 pb-20 overflow-hidden">
      <div className={`blob w-96 h-96 ${blobClass ?? 'bg-brand-600/20 -top-20 right-0'}`} />
      <div className="container-custom relative z-10">
        <div className={`${centered ? 'flex flex-col items-center text-center' : ''}`}>
          <div className="badge badge-cyan mb-6">{badge}</div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 max-w-3xl" style={{ fontFamily: 'var(--font-display)' }}>
            {title}
          </h1>
          {subtitle && (
            <p className="text-xl text-[var(--text-secondary)] max-w-2xl leading-relaxed">{subtitle}</p>
          )}
        </div>
      </div>
    </section>
  );
}
