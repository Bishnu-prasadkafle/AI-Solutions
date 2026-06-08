import PublicLayout from '@/components/layout/PublicLayout';
import SectionHeader from '@/components/ui/SectionHeader';
import Link from 'next/link';
import Image from 'next/image';
import { Target, Eye, Users, Award, MapPin, Calendar, ArrowRight, Linkedin, Rocket, Lightbulb, CheckCircle2 } from 'lucide-react';

const values = [
  { icon: Target, title: 'Mission-Driven', desc: 'We exist to accelerate digital transformation for industries worldwide through accessible, intelligent AI.' },
  { icon: Eye, title: 'Vision-Forward', desc: 'We envision a world where AI amplifies human potential rather than replacing it — augmentation, not automation.' },
  { icon: Users, title: 'People-First', desc: 'Every solution we build centers on improving the day-to-day experience of real people at work.' },
  { icon: Award, title: 'Excellence Always', desc: 'We hold ourselves to the highest standards of engineering, design, and delivery.' },
];

async function getTeam() {
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
    const res = await fetch(`${API_URL}/team/`, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    const data = await res.json();
    return data.results || data;
  } catch {
    return [];
  }
}

const stats = [
  { number: '2021', label: 'Founded' },
  { number: '150+', label: 'Enterprise Clients' },
  { number: '45', label: 'Team Members' },
  { number: '12', label: 'Countries' },
];

const milestones = [
  { year: '2021', event: 'Founded in Sunderland by ex-Google & DeepMind engineers with a seed round of £2M.' },
  { year: '2022', event: 'Launched our flagship Virtual Assistant platform. Onboarded first 20 enterprise clients.' },
  { year: '2023', event: 'Expanded to 8 countries. Raised Series A of £12M to scale engineering and product teams.' },
  { year: '2024', event: 'Crossed 150 enterprise clients across 12 countries. Launched AI Analytics suite.' },
  { year: '2025', event: 'Introduced multi-modal AI capabilities and opened new offices in London and Dubai.' },
  { year: 'Jun 2026', event: 'Reached 300+ enterprise clients. Launched next-generation autonomous workflow engine.' },
];

const differentiators = [
  { icon: Lightbulb, title: 'Insight-Led', body: 'Every product decision is grounded in deep research and real customer feedback loops.' },
  { icon: Rocket, title: 'Speed to Value', body: 'Our platform is designed for rapid deployment — most clients are live within 4 weeks.' },
  { icon: Target, title: 'Outcome-Focused', body: 'We measure success by your KPIs, not ours. No vanity metrics, no fluff.' },
];

function initials(name: string) {
  return name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase();
}

export default async function AboutPage() {
  const team = await getTeam();
  return (
    <PublicLayout>

      {/* ── Hero ── */}
      <section className="relative pt-36 pb-28 overflow-hidden">
        <div className="blob w-[500px] h-[500px] bg-accent/10 -top-32 -right-20 pointer-events-none" />
        <div className="blob w-72 h-72 bg-accent/5 top-40 left-0 pointer-events-none" />

        <div className="container-custom relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="badge badge-cyan mb-6">About AI-Solutions</div>
              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight" style={{ fontFamily: 'var(--font-display)' }}>
                Building the{' '}
                <span className="gradient-text">Intelligent Enterprise</span>{' '}
                of Tomorrow
              </h1>
              <p className="text-xl leading-relaxed mb-8" style={{ color: 'var(--text-secondary)' }}>
                Founded in Sunderland, AI-Solutions is a pioneering AI startup on a mission to make
                cutting-edge artificial intelligence accessible to every industry, everywhere.
              </p>
              <div className="flex flex-wrap items-center gap-6 mb-10">
                <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-muted)' }}>
                  <MapPin size={14} className="text-accent" /> Sunderland, United Kingdom
                </div>
                <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-muted)' }}>
                  <Calendar size={14} className="text-accent" /> Founded 2021
                </div>
              </div>
              <Link href="/contact" className="btn-primary inline-flex items-center gap-2">
                Get in Touch <ArrowRight size={16} />
              </Link>
            </div>

            <div className="relative w-full h-[420px] rounded-3xl overflow-hidden" style={{ border: '1px solid rgba(64,138,113,0.25)' }}>
              <Image src="/about1.png" alt="About AI-Solutions" fill className="object-cover" priority />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(9,20,19,0.35) 0%, rgba(64,138,113,0.1) 100%)' }} />
            </div>
          </div>

          {/* Stats bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16">
            {stats.map((s, i) => (
              <div key={i} className="glass rounded-2xl p-6 text-center" style={{ borderColor: 'rgba(64,138,113,0.25)' }}>
                <div className="text-4xl font-bold gradient-text mb-1" style={{ fontFamily: 'var(--font-display)' }}>{s.number}</div>
                <div className="text-xs uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Our Story ── */}
      <section className="section-pad relative overflow-hidden" style={{ background: 'var(--bg-card)' }}>
        <div className="blob w-80 h-80 bg-accent/5 -top-10 -left-20 pointer-events-none" />
        <div className="container-custom relative z-10">

          <div className="flex items-center gap-3 mb-12 justify-center">
            <div className="badge badge-cyan">Our Story</div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

            {/* Left — narrative */}
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-8 leading-tight" style={{ fontFamily: 'var(--font-display)' }}>
                Born from a <span className="gradient-text">Simple Belief</span>
              </h2>

              {/* Pull quote */}
              <div className="relative pl-5 mb-8" style={{ borderLeft: '3px solid #408A71' }}>
                <p className="text-lg italic leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  "The most powerful AI should not be locked behind expensive contracts or require armies
                  of data scientists — it should work for everyone."
                </p>
                <span className="block mt-3 text-xs font-semibold uppercase tracking-widest" style={{ color: '#408A71' }}>
                  — Co-Founders, AI-Solutions
                </span>
              </div>

              <div className="space-y-5 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                <p>
                  AI-Solutions was founded in Sunderland by a team of researchers and engineers who left
                  prestigious roles at Google, DeepMind, and Palantir with one shared conviction: enterprise
                  AI was broken — expensive, opaque, and built for boardrooms, not for the people actually
                  doing the work.
                </p>
                <p>
                  We set out to change that. Our platform democratises access to production-grade AI —
                  bringing intelligent virtual assistants, predictive analytics, and rapid prototyping tools
                  to organisations of every size and sector.
                </p>
                <p>
                  Today, we serve over 150 enterprise clients across 12 countries, from regional
                  manufacturers to global financial institutions — and we're just getting started.
                </p>
              </div>

              <div className="mt-8 space-y-3">
                {[
                  'Founded by ex-Google, DeepMind & Palantir engineers',
                  'Serving 150+ enterprise clients across 12 countries',
                  'Recognised by Innovate UK & Northern Powerhouse',
                ].map((point, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle2 size={16} className="text-accent mt-[2px] shrink-0" />
                    <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{point}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — timeline */}
            <div className="relative pl-2">
              <div
                className="absolute left-[19px] top-4 bottom-4 w-px"
                style={{ background: 'linear-gradient(to bottom, #408A71, transparent)' }}
              />
              <div className="space-y-0">
                {milestones.map((m, i) => (
                  <div key={i} className="flex gap-6 group relative">
                    <div className="shrink-0 z-10">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold transition-transform group-hover:scale-110"
                        style={{
                          background: 'linear-gradient(135deg,#285A48,#408A71)',
                          color: '#e8f5f0',
                          fontFamily: 'var(--font-display)',
                          boxShadow: '0 0 0 4px rgba(64,138,113,0.12)',
                        }}>
                        {m.year.length > 4 ? m.year.split(' ')[0].slice(0,3) : m.year.slice(2)}
                      </div>
                    </div>
                    <div
                      className="mb-8 flex-1 rounded-2xl p-5 transition-all group-hover:-translate-y-[2px]"
                      style={{
                        background: 'rgba(9,20,19,0.5)',
                        border: '1px solid rgba(64,138,113,0.18)',
                      }}>
                      <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: '#408A71', fontFamily: 'var(--font-display)' }}>
                        {m.year}
                      </p>
                      <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                        {m.event}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── Vision & Mission ── */}
      <section className="section-pad relative overflow-hidden">
        <div className="blob w-96 h-96 bg-accent/10 top-0 right-0 pointer-events-none" />
        <div className="container-custom relative z-10">

          <SectionHeader
            badge="Purpose"
            title={<>Our <span className="gradient-text">Vision & Mission</span></>}
            subtitle="Two complementary forces that shape every decision we make — from product roadmap to company culture."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">

            {/* Vision */}
            <div
              className="relative rounded-3xl p-10 overflow-hidden group"
              style={{
                background: 'linear-gradient(135deg, rgba(40,90,72,0.22) 0%, rgba(13,31,29,0.85) 60%)',
                border: '1px solid rgba(64,138,113,0.3)',
              }}>
              <Eye size={160} className="absolute -bottom-8 -right-8 opacity-[0.05] transition-transform group-hover:scale-110" style={{ color: '#408A71' }} />
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6" style={{ background: 'linear-gradient(135deg,#285A48,#408A71)' }}>
                <Eye size={26} className="text-white" />
              </div>
              <div className="badge badge-cyan mb-4">Vision</div>
              <h3 className="text-3xl font-bold mb-5 leading-snug" style={{ fontFamily: 'var(--font-display)', color: '#e8f5f0' }}>
                A World Where AI <span className="gradient-text">Amplifies</span> Human Potential
              </h3>
              <p className="leading-relaxed mb-6" style={{ color: 'var(--text-secondary)' }}>
                We envision an era in which every organisation — regardless of size, sector, or technical
                maturity — can harness the transformative power of artificial intelligence. Not to replace
                the people inside them, but to elevate what those people can accomplish. Augmentation, not
                automation. Partnership, not displacement.
              </p>
              <div className="pt-6" style={{ borderTop: '1px solid rgba(64,138,113,0.2)' }}>
                <p className="text-sm italic" style={{ color: 'var(--text-muted)' }}>
                  "AI should make your best people even better."
                </p>
              </div>
            </div>

            {/* Mission */}
            <div
              className="relative rounded-3xl p-10 overflow-hidden group"
              style={{
                background: 'linear-gradient(135deg, rgba(40,90,72,0.22) 0%, rgba(13,31,29,0.85) 60%)',
                border: '1px solid rgba(64,138,113,0.3)',
              }}>
              <Rocket size={160} className="absolute -bottom-8 -right-8 opacity-[0.05] transition-transform group-hover:scale-110" style={{ color: '#408A71' }} />
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6" style={{ background: 'linear-gradient(135deg,#285A48,#408A71)' }}>
                <Rocket size={26} className="text-white" />
              </div>
              <div className="badge badge-cyan mb-4">Mission</div>
              <h3 className="text-3xl font-bold mb-5 leading-snug" style={{ fontFamily: 'var(--font-display)', color: '#e8f5f0' }}>
                Making <span className="gradient-text">Enterprise AI</span> Accessible to Every Industry
              </h3>
              <p className="leading-relaxed mb-6" style={{ color: 'var(--text-secondary)' }}>
                Our mission is to dismantle the barriers that have kept production-grade AI locked inside
                a handful of tech giants. We build intuitive, scalable, and genuinely affordable AI
                products that slot into real workflows — delivering measurable ROI from day one, without
                the need for dedicated data science teams or multi-year implementation programmes.
              </p>
              <div className="pt-6" style={{ borderTop: '1px solid rgba(64,138,113,0.2)' }}>
                <p className="text-sm italic" style={{ color: 'var(--text-muted)' }}>
                  "Real impact, from day one."
                </p>
              </div>
            </div>

          </div>

          {/* Differentiator strip */}
          <div
            className="rounded-2xl p-8 grid grid-cols-1 md:grid-cols-3 gap-6"
            style={{ background: 'rgba(13,31,29,0.7)', border: '1px solid rgba(64,138,113,0.15)' }}>
            {differentiators.map(({ icon: Icon, title, body }, i) => (
              <div key={i} className="flex gap-4 items-start">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: 'rgba(64,138,113,0.12)', border: '1px solid rgba(64,138,113,0.22)' }}>
                  <Icon size={18} className="text-accent" />
                </div>
                <div>
                  <p className="font-semibold text-white mb-1" style={{ fontFamily: 'var(--font-display)' }}>{title}</p>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{body}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ── Values ── */}
      <section className="section-pad" style={{ background: 'var(--bg-card)' }}>
        <div className="container-custom">
          <SectionHeader
            badge="Our Values"
            title={<>What <span className="gradient-text">Drives Us</span></>}
            subtitle="These principles aren't words on a wall — they're the criteria we use to make every product, hiring, and strategic decision."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, i) => (
              <div key={i} className="glass glass-hover rounded-2xl p-6 group transition-all hover:-translate-y-1 relative overflow-hidden">
                <span className="absolute top-3 right-4 text-6xl font-black opacity-[0.04] select-none" style={{ fontFamily: 'var(--font-display)', color: '#408A71' }}>
                  {i + 1}
                </span>
                <div className="w-11 h-11 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-all">
                  <v.icon size={20} className="text-accent" />
                </div>
                <h3 className="font-semibold text-white mb-2" style={{ fontFamily: 'var(--font-display)' }}>{v.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Team ── */}
      <section className="section-pad">
        <div className="container-custom">
          <SectionHeader
            badge="Leadership"
            title={<>The <span className="gradient-text">Team</span> Behind the Vision</>}
            subtitle="Seasoned operators and researchers who've shipped AI at global scale — now focused on yours."
          />
          {team.length === 0 ? (
            <p className="text-center" style={{ color: 'var(--text-muted)' }}>Team profiles coming soon.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {team.map((member: any, i: number) => (
                <div key={member.id ?? i} className="glass glass-hover rounded-2xl p-6 flex flex-col items-center text-center group transition-all hover:-translate-y-1">
                  {/* Avatar with gradient ring or real photo */}
                  <div
                    className="w-24 h-24 rounded-full p-[3px] mb-4 transition-transform group-hover:scale-105 shrink-0"
                    style={{ background: 'linear-gradient(135deg,#285A48,#408A71,#B0E4CC)' }}>
                    {member.image_url ? (
                      <div className="w-full h-full rounded-full overflow-hidden">
                        <Image
                          src={member.image_url}
                          alt={member.name}
                          width={96}
                          height={96}
                          className="w-full h-full object-cover object-top rounded-full"
                          unoptimized
                        />
                      </div>
                    ) : (
                      <div
                        className="w-full h-full rounded-full flex items-center justify-center text-2xl font-bold text-white"
                        style={{ background: 'linear-gradient(135deg,#0d2320,#1a3d35)', fontFamily: 'var(--font-display)' }}>
                        {initials(member.name)}
                      </div>
                    )}
                  </div>

                  <h3 className="font-semibold text-white mb-[2px]" style={{ fontFamily: 'var(--font-display)' }}>{member.name}</h3>
                  <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: '#408A71' }}>{member.role}</p>
                  <p className="text-xs leading-relaxed flex-1" style={{ color: 'var(--text-secondary)' }}>{member.bio}</p>
                  {member.linkedin_url && (
                    <a
                      href={member.linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs mt-4 hover:text-accent transition-colors"
                      style={{ color: 'var(--text-muted)' }}>
                      <Linkedin size={12} /> LinkedIn
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="section-pad relative overflow-hidden" style={{ background: 'var(--bg-card)' }}>
        <div className="blob w-96 h-96 bg-accent/10 -bottom-20 left-1/2 -translate-x-1/2 pointer-events-none" />
        <div className="container-custom relative z-10 text-center max-w-2xl mx-auto">
          <div className="badge badge-cyan mb-6">Join Us</div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ fontFamily: 'var(--font-display)' }}>
            Ready to <span className="gradient-text">Work Together?</span>
          </h2>
          <p className="mb-10 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            Whether you're exploring a partnership, looking for a custom AI solution, or just want to
            learn more — we'd love to hear from you.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/contact" className="btn-primary inline-flex items-center gap-2">
              Contact Us <ArrowRight size={16} />
            </Link>
            <Link href="/services" className="btn-ghost inline-flex items-center gap-2">
              Explore Services
            </Link>
          </div>
        </div>
      </section>

    </PublicLayout>
  );
}
