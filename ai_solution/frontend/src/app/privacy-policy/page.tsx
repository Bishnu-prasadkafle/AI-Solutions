import PublicLayout from '@/components/layout/PublicLayout';
import { ShieldCheck } from 'lucide-react';

const sections = [
  {
    title: 'Information We Collect',
    content: `We collect information you provide directly to us, such as when you create an account, contact us, or use our services. This includes your name, email address, company name, and any messages you send us. We also automatically collect certain technical information when you visit our website, including IP address, browser type, pages visited, and time spent on pages.`,
  },
  {
    title: 'How We Use Your Information',
    content: `We use the information we collect to provide, maintain, and improve our services; respond to your inquiries and support requests; send you technical notices and updates; communicate with you about products, services, and events; monitor and analyse usage patterns; and comply with legal obligations.`,
  },
  {
    title: 'Information Sharing',
    content: `We do not sell, trade, or rent your personal information to third parties. We may share your information with trusted service providers who assist us in operating our website and services, provided they agree to keep this information confidential. We may also disclose information when required by law or to protect our rights.`,
  },
  {
    title: 'Data Security',
    content: `We implement industry-standard security measures to protect your personal information against unauthorised access, alteration, disclosure, or destruction. This includes encryption in transit and at rest, access controls, and regular security assessments. However, no method of transmission over the internet is 100% secure.`,
  },
  {
    title: 'Data Retention',
    content: `We retain your personal information for as long as necessary to fulfil the purposes outlined in this policy, unless a longer retention period is required by law. When your data is no longer needed, we securely delete or anonymise it.`,
  },
  {
    title: 'Your Rights',
    content: `You have the right to access, correct, or delete your personal information at any time. You may also object to or restrict certain processing of your data, and request data portability. To exercise any of these rights, please contact us at privacy@ai-solutions.com.`,
  },
  {
    title: 'Contact Us',
    content: `If you have any questions about this Privacy Policy, please contact us at: AI-Solutions Ltd, Sunderland, United Kingdom. Email: privacy@ai-solutions.com`,
  },
];

export default function PrivacyPolicyPage() {
  return (
    <PublicLayout>
      <section className="relative pt-32 pb-20">
        <div className="container-custom max-w-3xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(64,138,113,0.15)', border: '1px solid rgba(64,138,113,0.3)' }}>
              <ShieldCheck size={20} style={{ color: '#408A71' }} />
            </div>
            <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#408A71' }}>Legal</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white" style={{ fontFamily: 'var(--font-display)' }}>
            Privacy Policy
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
