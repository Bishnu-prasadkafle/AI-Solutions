import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function CTASection() {
  return (
    <section className="section-pad">
      <div className="container-custom">
        <div className="glass rounded-3xl p-12 md:p-16 text-center relative overflow-hidden">
          <div className="blob w-64 h-64 bg-accent/10 -top-10 -right-10" />
          <div className="blob w-48 h-48 bg-brand-600/20 -bottom-10 -left-10" />
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: 'var(--font-display)' }}>
              Ready to Transform Your <span className="gradient-text">Business with AI?</span>
            </h2>
            <p className="text-[var(--text-secondary)] max-w-lg mx-auto mb-8">
              Join 150+ industry leaders who trust AI-Solution to power their digital transformation.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/contact" className="btn-primary flex items-center gap-2">
                Get a Free Demo <ArrowRight size={16} />
              </Link>
              <Link href="/about" className="btn-ghost">Learn More About Us</Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
