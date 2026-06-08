import PublicLayout from '@/components/layout/PublicLayout';
import { Cookie } from 'lucide-react';

const sections = [
  {
    title: 'What Are Cookies',
    content: `Cookies are small text files that are placed on your device when you visit a website. They are widely used to make websites work more efficiently, provide a better user experience, and give website owners useful analytical information about how their site is being used.`,
  },
  {
    title: 'How We Use Cookies',
    content: `AI-Solutions uses cookies to ensure the proper functioning of our website, remember your preferences, analyse how our services are used, and personalise content. We do not use cookies to serve third-party advertising or to track you across other websites.`,
  },
  {
    title: 'Types of Cookies We Use',
    content: `Essential Cookies: Required for the website to function properly — these cannot be disabled. Analytical Cookies: Help us understand how visitors interact with our website by collecting anonymous usage data. Preference Cookies: Remember your settings and preferences to improve your experience on future visits. Session Cookies: Temporary cookies that expire when you close your browser, used to maintain your session while browsing.`,
  },
  {
    title: 'Third-Party Cookies',
    content: `We may use trusted third-party services such as Google Analytics that set their own cookies to help us understand website traffic and usage patterns. These third parties have their own privacy policies governing the use of such cookies. We do not control these cookies.`,
  },
  {
    title: 'Managing Cookies',
    content: `You can control and manage cookies through your browser settings. Most browsers allow you to refuse cookies, delete existing cookies, or be notified when a cookie is set. Please note that disabling certain cookies may affect the functionality of our website and your user experience.`,
  },
  {
    title: 'Cookie Retention',
    content: `Session cookies are deleted automatically when you close your browser. Persistent cookies remain on your device for a set period defined in the cookie — typically between 30 days and 2 years — unless you delete them earlier through your browser settings.`,
  },
  {
    title: 'Updates to This Policy',
    content: `We may update this Cookie Policy from time to time to reflect changes in technology or legislation. Any updates will be posted on this page with a revised date. We encourage you to review this policy periodically.`,
  },
  {
    title: 'Contact Us',
    content: `If you have any questions about our use of cookies, please contact us at: AI-Solutions Ltd, Sunderland, United Kingdom. Email: privacy@ai-solutions.com`,
  },
];

export default function CookiePolicyPage() {
  return (
    <PublicLayout>
      <section className="relative pt-32 pb-20">
        <div className="container-custom max-w-3xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(64,138,113,0.15)', border: '1px solid rgba(64,138,113,0.3)' }}>
              <Cookie size={20} style={{ color: '#408A71' }} />
            </div>
            <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#408A71' }}>Legal</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white" style={{ fontFamily: 'var(--font-display)' }}>
            Cookie Policy
          </h1>
          <p className="text-sm mb-12" style={{ color: 'var(--text-muted)' }}>Last updated: June 2025</p>

          <div className="space-y-10">
            {sections.map((s, i) => (
              <div key={i} className="rounded-2xl p-6" style={{ background: 'rgba(64,138,113,0.05)', border: '1px solid rgba(64,138,113,0.12)' }}>
                <h2 className="text-lg font-semibold text-white mb-3" style={{ fontFamily: 'var(--font-display)' }}>{s.title}</h2>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{s.content}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
