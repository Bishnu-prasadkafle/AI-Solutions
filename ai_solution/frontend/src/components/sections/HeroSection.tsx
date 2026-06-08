'use client';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';

const slides = [
  {
    image: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=1600&q=90',
    title: 'AI-Powered Automation',
    sub: 'Our intelligent automation engine deploys self-learning AI models that continuously adapt to your workflows, dramatically reducing manual effort and cutting operational costs at scale across your entire enterprise.',
  },
  {
    image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1600&q=90',
    title: 'Smart Virtual Assistants',
    sub: 'We deploy context-aware AI assistants trained on your business data to handle complex queries, delivering consistent and seamless customer experiences that keep your users satisfied around the clock.',
  },
  {
    image: 'https://images.unsplash.com/photo-1655720828018-edd2daec9349?w=1600&q=90',
    title: 'From Idea to Production',
    sub: 'We rapidly transform your concepts into fully tested, production-ready software products, validating core assumptions early and shipping with complete confidence in a fraction of the time.',
  },
];

export default function HeroSection() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setCurrent((prev) => (prev + 1) % slides.length), 5000);
    return () => clearInterval(timer);
  }, []);

  const prev = () => setCurrent((c) => (c - 1 + slides.length) % slides.length);
  const next = () => setCurrent((c) => (c + 1) % slides.length);

  return (
    <section className="relative min-h-screen overflow-hidden">

      {/* Full-width background carousel */}
      {slides.map((s, i) => (
        <div key={i} className="absolute inset-0 transition-opacity duration-1000" style={{ opacity: i === current ? 1 : 0 }}>
          <img src={s.image} alt={s.title} className="w-full h-full object-cover" />
        </div>
      ))}

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-[#091413]/60" />

      {/* Grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(64,138,113,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(64,138,113,0.08) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#091413] to-transparent" />

      {/* Overlay text — center */}
      <div className="absolute inset-0 z-10 flex items-center justify-center">
        <div className="container-custom text-center">
          <div className="max-w-2xl mx-auto">
            <h1
              className="text-5xl md:text-6xl font-extrabold leading-[1.05] tracking-tight mb-5"
              style={{ fontFamily: 'var(--font-display)', background: 'linear-gradient(135deg, #FFD700, #408A71)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}
            >
              {slides[current].title}
            </h1>
            <p className="text-lg text-[var(--text-secondary)] leading-relaxed mb-8 text-center max-w-2xl mx-auto">
              {slides[current].sub}
            </p>

            {/* Buttons */}
            <div className="flex items-center justify-center gap-4">
              <Link href="/services" className="btn-primary flex items-center gap-2">
                Our Services <ArrowRight size={16} />
              </Link>
              <Link href="/contact" className="btn-ghost flex items-center gap-2">
                Contact Us <ArrowRight size={16} />
              </Link>
            </div>

          </div>
        </div>
      </div>

    </section>
  );
}
