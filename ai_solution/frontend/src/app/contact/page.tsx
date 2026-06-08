'use client';
import { useState } from 'react';
import PublicLayout from '@/components/layout/PublicLayout';
import { useForm } from 'react-hook-form';
import { contactsAPI } from '@/lib/api';
import toast from 'react-hot-toast';
import { Send, Loader2, MapPin, Mail, Phone } from 'lucide-react';

type ContactForm = {
  name: string; email: string; phone: string;
  company_name: string; country: string; job_title: string;
  interest: string; message: string;
};

export default function ContactPage() {
  const [submitting, setSubmitting] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ContactForm>();

  const onContact = async (data: ContactForm) => {
    setSubmitting(true);
    try {
      await contactsAPI.create(data);
      toast.success("Message sent! We'll be in touch within 24 hours.");
      reset();
    } catch {
      toast.error('Failed to send. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PublicLayout>
      {/* Hero */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="blob w-96 h-96 bg-accent/10 -top-20 right-0" />
        <div className="container-custom relative z-10 text-center">
          <div className="badge badge-cyan mb-6 inline-block">Get in Touch</div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6" style={{ fontFamily: 'var(--font-display)' }}>
            Let's Build Something <span className="gradient-text">Remarkable</span>
          </h1>
          <p className="text-xl text-[var(--text-secondary)] max-w-xl mx-auto">
            Tell us about your project. Our team will reach out within 24 hours.
          </p>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

            {/* Info sidebar */}
            <div className="space-y-4">
              {[
                { icon: MapPin, title: 'Visit Us', detail: 'AI-Solution HQ\nSunderland, SR1 3SD\nUnited Kingdom' },
                { icon: Mail,   title: 'Email Us', detail: 'hello@ai-solution.co.uk\nsupport@ai-solution.co.uk' },
                { icon: Phone,  title: 'Call Us',  detail: '+44 (0) 191 000 0000\nMon–Fri, 9am–6pm GMT' },
              ].map((c, i) => (
                <div key={i} className="glass rounded-xl p-5 flex gap-4">
                  <div className="w-10 h-10 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center flex-shrink-0">
                    <c.icon size={18} className="text-accent" />
                  </div>
                  <div>
                    <p className="font-semibold text-white text-sm mb-1" style={{ fontFamily: 'var(--font-display)' }}>{c.title}</p>
                    <p className="text-xs text-[var(--text-secondary)] whitespace-pre-line">{c.detail}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Contact form */}
            <div className="lg:col-span-2">
              <div className="glass rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-white mb-6" style={{ fontFamily: 'var(--font-display)' }}>Send us a Message</h2>
                <form onSubmit={handleSubmit(onContact)} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider mb-2">Full Name *</label>
                      <input {...register('name', { required: true })} className="input-field" placeholder="John Smith" />
                      {errors.name && <p className="text-red-400 text-xs mt-1">Required</p>}
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider mb-2">Email Address *</label>
                      <input {...register('email', { required: true })} type="email" className="input-field" placeholder="john@company.com" />
                      {errors.email && <p className="text-red-400 text-xs mt-1">Required</p>}
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider mb-2">Phone Number *</label>
                      <input {...register('phone', { required: true })} className="input-field" placeholder="+44 7700 000000" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider mb-2">Company Name *</label>
                      <input {...register('company_name', { required: true })} className="input-field" placeholder="Acme Corp" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider mb-2">Country *</label>
                      <input {...register('country', { required: true })} className="input-field" placeholder="United Kingdom" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider mb-2">Job Title</label>
                      <input {...register('job_title')} className="input-field" placeholder="CTO / Product Manager..." />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider mb-2">I'm interested in *</label>
                    <select {...register('interest', { required: true })} className="input-field">
                      <option value="">Select an option</option>
                      <option value="virtual_assistant">AI-Powered Virtual Assistant</option>
                      <option value="schedule_demo">Schedule a Personalised Demo</option>
                      <option value="events">Join Promotional Events</option>
                      <option value="sales">Chat with Sales</option>
                      <option value="general">General Inquiry</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider mb-2">Message *</label>
                    <textarea {...register('message', { required: true })} rows={5} className="input-field resize-none" placeholder="Tell us about your project or requirements..." />
                  </div>
                  <button type="submit" disabled={submitting} className="btn-primary flex items-center gap-2">
                    {submitting ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                    {submitting ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              </div>
            </div>

          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
