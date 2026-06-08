import PublicLayout from '@/components/layout/PublicLayout';
import { FileText } from 'lucide-react';

const sections = [
  {
    title: 'Acceptance of Terms',
    content: `By accessing or using AI-Solutions services, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing our services. These terms apply to all users, including browsers, vendors, customers, and contributors of content.`,
  },
  {
    title: 'Use of Services',
    content: `You may use our services only for lawful purposes and in accordance with these Terms. You agree not to use our services in any way that violates applicable law, transmits harmful or malicious code, attempts to gain unauthorised access to our systems, interferes with the proper working of our services, or infringes on the intellectual property rights of others.`,
  },
  {
    title: 'Intellectual Property',
    content: `All content, features, and functionality on our platform — including but not limited to text, graphics, logos, icons, images, and software — are the exclusive property of AI-Solutions Ltd and are protected by UK and international copyright, trademark, and other intellectual property laws.`,
  },
  {
    title: 'User Accounts',
    content: `When you create an account with us, you must provide accurate and complete information. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must notify us immediately of any unauthorised use of your account.`,
  },
  {
    title: 'Limitation of Liability',
    content: `To the maximum extent permitted by law, AI-Solutions Ltd shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, or goodwill, arising from your use of or inability to use our services. Our total liability shall not exceed the amount you paid us in the twelve months preceding the claim.`,
  },
  {
    title: 'Termination',
    content: `We reserve the right to terminate or suspend your account and access to our services at our sole discretion, without notice, for conduct that we believe violates these Terms of Service or is harmful to other users, us, third parties, or for any other reason.`,
  },
  {
    title: 'Governing Law',
    content: `These Terms shall be governed by and construed in accordance with the laws of England and Wales. Any disputes arising under these terms shall be subject to the exclusive jurisdiction of the courts of England and Wales.`,
  },
  {
    title: 'Contact Us',
    content: `If you have any questions about these Terms of Service, please contact us at: AI-Solutions Ltd, Sunderland, United Kingdom. Email: legal@ai-solutions.com`,
  },
];

export default function TermsOfServicePage() {
  return (
    <PublicLayout>
      <section className="relative pt-32 pb-20">
        <div className="container-custom max-w-3xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(64,138,113,0.15)', border: '1px solid rgba(64,138,113,0.3)' }}>
              <FileText size={20} style={{ color: '#408A71' }} />
            </div>
            <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#408A71' }}>Legal</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white" style={{ fontFamily: 'var(--font-display)' }}>
            Terms of Service
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
