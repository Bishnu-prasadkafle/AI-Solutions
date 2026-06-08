import { Bot, Zap, Cpu, BarChart3, Shield, Globe } from 'lucide-react';

const features = [
  { icon: Bot,       title: 'AI Assistants',    stat: '500+',   desc: 'Intelligent bots deployed across industries'     },
  { icon: Zap,       title: 'Rapid Delivery',   stat: '7 Days', desc: 'From concept to working prototype'               },
  { icon: Cpu,       title: 'Automation',       stat: '80%',    desc: 'Reduction in manual operational tasks'           },
  { icon: BarChart3, title: 'Predictive AI',    stat: '99.9%',  desc: 'Platform uptime guaranteed by SLA'               },
  { icon: Shield,    title: 'Enterprise Grade', stat: 'A+',     desc: 'Security rating with bank-level encryption'      },
  { icon: Globe,     title: 'Global Reach',     stat: '30+',    desc: 'Countries actively served worldwide'             },
];

export default function FeaturesSection() {
  return (
    <section className="section-pad">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Left: Image */}
          <div className="relative rounded-3xl overflow-hidden h-[520px]">
            <img
              src="https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&auto=format&fit=crop"
              alt="AI Technology"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-[#091413]/80 via-transparent to-[#408A71]/20" />
          </div>

          {/* Right: Content */}
          <div>
            <div className="badge badge-cyan mb-5">Our Capabilities</div>
            <h2 className="text-4xl md:text-5xl font-bold mb-5 gradient-text" style={{ fontFamily: 'var(--font-display)' }}>
              Everything You Need to Scale with AI
            </h2>
            <p className="text-[var(--text-secondary)] leading-relaxed mb-4 max-w-lg">
              We design and deploy end-to-end AI systems that integrate seamlessly into your
              existing infrastructure — automating workflows, engaging customers through intelligent
              assistants, and unlocking predictive insights from your data.
            </p>
            <p className="text-[var(--text-secondary)] leading-relaxed mb-10 max-w-lg">
              Trusted by enterprises across 30+ countries, our platform delivers measurable ROI
              within weeks. Every solution is tailored to your industry, your goals, and your
              long-term growth trajectory.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {features.map((f, i) => (
                <div key={i} className="glass glass-hover rounded-2xl p-5 group transition-all duration-300 hover:-translate-y-1 flex flex-col items-center text-center">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center mb-3 group-hover:bg-accent/20 transition-all">
                    <f.icon size={18} className="text-[var(--accent)]" />
                  </div>
                  <div className="text-xl font-bold text-white mb-0.5" style={{ fontFamily: 'var(--font-display)' }}>
                    {f.stat}
                  </div>
                  <div className="text-[10px] text-[var(--text-muted)] mb-1 leading-snug">{f.desc}</div>
                  <div className="text-xs font-semibold text-[var(--accent-light)]">{f.title}</div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
