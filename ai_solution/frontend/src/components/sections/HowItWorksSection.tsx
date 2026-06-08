import { MessageSquare, Lightbulb, Rocket, BarChart3 } from 'lucide-react';

const steps = [
  {
    icon: MessageSquare,
    step: '01',
    title: 'Discovery & Consultation',
    color: 'from-blue-500/20 to-blue-600/10 border-blue-500/30',
    iconColor: 'text-blue-400',
    desc: 'We start by understanding your business challenges, goals, and existing infrastructure through in-depth consultation sessions with your key stakeholders.',
  },
  {
    icon: Lightbulb,
    step: '02',
    title: 'Strategy & Solution Design',
    color: 'from-amber-500/20 to-amber-600/10 border-amber-500/30',
    iconColor: 'text-amber-400',
    desc: 'Our experts craft a tailored AI roadmap — selecting the right models, tools, and architecture that align with your budget, timeline, and long-term vision.',
  },
  {
    icon: Rocket,
    step: '03',
    title: 'Development & Integration',
    color: 'from-purple-500/20 to-purple-600/10 border-purple-500/30',
    iconColor: 'text-purple-400',
    desc: 'We build, test, and deploy your solution with precision — seamlessly integrating into your existing workflows with minimal disruption to operations.',
  },
  {
    icon: BarChart3,
    step: '04',
    title: 'Optimization & Growth',
    color: 'from-emerald-500/20 to-emerald-600/10 border-emerald-500/30',
    iconColor: 'text-emerald-400',
    desc: 'Post-launch, we continuously monitor performance, refine models, and scale capabilities as your business evolves — ensuring long-term measurable ROI.',
  },
];

export default function HowItWorksSection() {
  return (
    <section className="section-pad bg-[var(--bg-card)]">
      <div className="container-custom">

        <div className="text-center mb-14">
          <div className="badge badge-cyan mb-4 mx-auto">Our Process</div>
          <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-4" style={{ fontFamily: 'var(--font-display)' }}>
            How We Work
          </h2>
          <p className="text-[var(--text-secondary)] max-w-xl mx-auto text-sm leading-relaxed">
            A proven four-step process designed to take your idea from concept to
            a fully operational AI solution — on time and on budget.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">

          {/* Connector line — desktop only */}
          <div className="hidden lg:block absolute top-10 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-transparent via-[var(--accent)]/30 to-transparent z-0" />

          {steps.map((s, i) => (
            <div key={i} className="glass glass-hover rounded-2xl p-7 flex flex-col items-center text-center group transition-all duration-300 hover:-translate-y-2 relative z-10">

              {/* Step number */}
              <div className="text-xs font-bold text-[var(--accent)] tracking-widest mb-3 opacity-60">
                STEP {s.step}
              </div>

              {/* Icon circle */}
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${s.color} border flex items-center justify-center mb-5 transition-all duration-300`}>
                <s.icon size={26} className={s.iconColor} />
              </div>

              <h3 className="text-base font-bold text-white mb-3 group-hover:text-[var(--accent-light)] transition-colors" style={{ fontFamily: 'var(--font-display)' }}>
                {s.title}
              </h3>

              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                {s.desc}
              </p>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
