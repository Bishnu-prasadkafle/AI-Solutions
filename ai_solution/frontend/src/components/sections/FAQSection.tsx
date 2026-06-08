'use client';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    q: 'What types of AI solutions does AI-Solution provide?',
    a: 'We provide a full spectrum of AI services including intelligent chatbots, workflow automation, predictive analytics, document processing, lead generation systems, and custom AI model development — all tailored to your specific business needs.',
  },
  {
    q: 'How long does it take to build and deploy an AI solution?',
    a: 'Most projects go from concept to working prototype within 7 days. Full production deployment typically takes 2–6 weeks depending on complexity, integrations required, and the scale of your infrastructure.',
  },
  {
    q: 'Do I need technical expertise to use your AI products?',
    a: 'No. Our solutions are designed for business users with intuitive dashboards and interfaces. We handle all the technical complexity and provide full onboarding, training, and documentation for your team.',
  },
  {
    q: 'Can your solutions integrate with our existing tools and platforms?',
    a: 'Yes. Our systems are built to integrate seamlessly with popular platforms including CRMs, ERPs, helpdesk tools, e-commerce systems, and custom APIs — ensuring minimal disruption to your existing workflows.',
  },
  {
    q: 'How do you ensure the security of our data?',
    a: 'We implement bank-grade encryption, role-based access control, and compliance-ready infrastructure. All data is processed securely, and we adhere to international standards including GDPR and ISO 27001 guidelines.',
  },
  {
    q: 'What industries do you serve?',
    a: 'We serve a wide range of industries including retail, healthcare, finance, logistics, education, real estate, and more. Our AI solutions are adaptable and have been deployed across 30+ countries worldwide.',
  },
  {
    q: 'Do you offer post-deployment support and maintenance?',
    a: 'Absolutely. Every engagement includes post-launch monitoring, performance optimization, and dedicated support. We offer flexible maintenance plans to ensure your solution continues to deliver results as your business grows.',
  },
  {
    q: 'How do I get started with AI-Solution?',
    a: 'Simply reach out through our Contact page or request a free consultation. Our team will schedule a discovery call, assess your needs, and propose a tailored solution with a clear timeline and investment breakdown.',
  },
];

export default function FAQSection() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="section-pad">
      <div className="container-custom">

        <div className="text-center mb-14">
          <div className="badge badge-cyan mb-4 mx-auto">FAQ</div>
          <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-4" style={{ fontFamily: 'var(--font-display)' }}>
            Frequently Asked Questions
          </h2>
          <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
            Everything you need to know before getting started with AI-Solution.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[0, 1].map((col) => (
            <div key={col} className="flex flex-col gap-3">
              {faqs.slice(col * 4, col * 4 + 4).map((faq, i) => {
                const idx = col * 4 + i;
                return (
                  <div
                    key={idx}
                    className={`glass rounded-2xl overflow-hidden transition-all duration-300 ${open === idx ? 'border border-[var(--accent)]/30' : 'border border-transparent'}`}
                  >
                    <button
                      onClick={() => setOpen(open === idx ? null : idx)}
                      className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
                    >
                      <span className="text-sm font-semibold text-white">{faq.q}</span>
                      <ChevronDown
                        size={18}
                        className={`text-[var(--accent)] shrink-0 transition-transform duration-300 ${open === idx ? 'rotate-180' : ''}`}
                      />
                    </button>
                    {open === idx && (
                      <div className="px-6 pb-5">
                        <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{faq.a}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
