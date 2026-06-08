'use client';
import { useState } from 'react';
import PublicLayout from '@/components/layout/PublicLayout';
import { useFetch } from '@/hooks/useFetch';
import { feedbackAPI } from '@/lib/api';
import { Star, Quote, Loader2, CheckCircle } from 'lucide-react';

const MEDIA_URL = process.env.NEXT_PUBLIC_MEDIA_URL || 'http://localhost:8000';

function avatarSrc(path?: string) {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  return `${MEDIA_URL}${path}`;
}

function formatDate(d?: string) {
  if (!d) return '';
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={14} className={i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-[var(--text-muted)]'} />
      ))}
    </div>
  );
}

function FeedbackSkeleton() {
  return (
    <div className="glass rounded-2xl p-6 flex flex-col gap-3 animate-pulse">
      <div className="flex gap-0.5 mb-1">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="w-3.5 h-3.5 rounded bg-[var(--accent-dim)]" />)}</div>
      <div className="h-3 w-full rounded bg-[var(--accent-dim)]" />
      <div className="h-3 w-5/6 rounded bg-[var(--accent-dim)]" />
      <div className="h-px w-full bg-[var(--accent-dim)] mt-2" />
      <div className="h-4 w-1/3 rounded bg-[var(--accent-dim)]" />
      <div className="h-3 w-1/4 rounded bg-[var(--accent-dim)]" />
    </div>
  );
}

function SubmitFeedbackForm() {
  const [name, setName]       = useState('');
  const [email, setEmail]     = useState('');
  const [company, setCompany] = useState('');
  const [message, setMessage] = useState('');
  const [rating, setRating]   = useState(5);
  const [hover, setHover]     = useState(0);
  const [saving, setSaving]   = useState(false);
  const [done, setDone]       = useState(false);
  const [error, setError]     = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await feedbackAPI.create({ name, email, company, message, rating });
      setDone(true);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (done) {
    return (
      <div className="glass rounded-2xl p-10 flex flex-col items-center gap-4 text-center">
        <CheckCircle size={48} className="text-accent" />
        <h3 className="text-xl font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>Thank you for your feedback!</h3>
        <p className="text-sm text-[var(--text-secondary)]">Your review has been submitted and will be visible after our team approves it.</p>
      </div>
    );
  }

  return (
    <div className="glass rounded-2xl p-8">
      <h2 className="text-2xl font-bold text-white mb-1" style={{ fontFamily: 'var(--font-display)' }}>Share Your Experience</h2>
      <p className="text-sm text-[var(--text-secondary)] mb-6">Your feedback will be reviewed before being published.</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs uppercase tracking-wider text-[var(--text-muted)] mb-2">Name *</label>
            <input
              required value={name} onChange={(e) => setName(e.target.value)}
              className="input-field" placeholder="Jane Doe"
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wider text-[var(--text-muted)] mb-2">Email *</label>
            <input
              required type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              className="input-field" placeholder="jane@company.com"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs uppercase tracking-wider text-[var(--text-muted)] mb-2">Company / Job Title</label>
          <input
            value={company} onChange={(e) => setCompany(e.target.value)}
            className="input-field" placeholder="e.g. CEO at Acme Corp"
          />
        </div>

        <div>
          <label className="block text-xs uppercase tracking-wider text-[var(--text-muted)] mb-2">Rating</label>
          <div className="flex gap-1 items-center">
            {[1, 2, 3, 4, 5].map((s) => (
              <button key={s} type="button" onClick={() => setRating(s)} onMouseEnter={() => setHover(s)} onMouseLeave={() => setHover(0)}>
                <Star size={28} className="transition-colors" fill={(hover || rating) >= s ? '#ffc107' : 'none'} color={(hover || rating) >= s ? '#ffc107' : 'var(--text-muted)'} />
              </button>
            ))}
            <span className="ml-2 text-sm text-[var(--text-muted)]">{rating}/5</span>
          </div>
        </div>

        <div>
          <label className="block text-xs uppercase tracking-wider text-[var(--text-muted)] mb-2">Your Testimonial *</label>
          <textarea
            required value={message} onChange={(e) => setMessage(e.target.value)}
            rows={4} className="input-field resize-none" placeholder="Tell us about your experience..."
          />
        </div>

        {error && <p className="text-sm text-red-400">{error}</p>}

        <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2">
          {saving && <Loader2 size={15} className="animate-spin" />}
          {saving ? 'Submitting...' : 'Submit Feedback'}
        </button>
      </form>
    </div>
  );
}

export default function FeedbackPage() {
  const { data: allFeedback, loading } = useFetch<any[]>(() => feedbackAPI.list());
  const feedback = allFeedback ?? [];

  const total = feedback.length;
  const avg   = total ? (feedback.reduce((a, f) => a + f.rating, 0) / total) : 0;
  const dist  = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: feedback.filter((f) => f.rating === star).length,
    pct: total ? Math.round((feedback.filter((f) => f.rating === star).length / total) * 100) : 0,
  }));

  return (
    <PublicLayout>
      {/* Hero */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="blob w-96 h-96 bg-accent/10 -top-20 left-0" />
        <div className="container-custom relative z-10 text-center">
          <div className="badge badge-cyan mb-6 mx-auto">Client Feedback</div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6" style={{ fontFamily: 'var(--font-display)' }}>
            What Our Clients <span className="gradient-text">Say</span>
          </h1>
          <p className="text-xl text-[var(--text-secondary)] max-w-xl mx-auto">
            Real experiences from businesses we've helped transform with AI.
          </p>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-custom space-y-14">

          {/* Stats bar */}
          {!loading && total > 0 && (
            <div className="glass rounded-2xl p-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <p className="text-7xl font-bold gradient-text leading-none" style={{ fontFamily: 'var(--font-display)' }}>
                    {avg.toFixed(1)}
                  </p>
                  <StarRating rating={Math.round(avg)} />
                  <p className="text-xs text-[var(--text-muted)] mt-2">{total} review{total !== 1 ? 's' : ''}</p>
                </div>
                <div className="flex-1 space-y-2">
                  {dist.map(({ star, count, pct }) => (
                    <div key={star} className="flex items-center gap-3 text-xs text-[var(--text-muted)]">
                      <span className="w-4 text-right">{star}</span>
                      <Star size={10} className="text-yellow-400 fill-yellow-400 shrink-0" />
                      <div className="flex-1 h-1.5 rounded-full bg-[var(--accent-dim)] overflow-hidden">
                        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: 'linear-gradient(90deg, #408A71, #B0E4CC)' }} />
                      </div>
                      <span className="w-6 text-right">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="border-l border-[var(--border)] pl-8 hidden md:block">
                <p className="text-2xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-display)' }}>
                  {avg >= 4.5 ? 'Excellent' : avg >= 4 ? 'Very Good' : avg >= 3 ? 'Good' : 'Average'}
                </p>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                  Based on {total} verified client review{total !== 1 ? 's' : ''}. All feedback is reviewed and approved by our team before being published.
                </p>
              </div>
            </div>
          )}

          {/* Cards grid */}
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {loading
                ? Array.from({ length: 6 }).map((_, i) => <FeedbackSkeleton key={i} />)
                : feedback.length === 0
                ? (
                  <div className="col-span-3 text-center py-20 text-[var(--text-muted)]">
                    <p className="text-lg">No feedback published yet.</p>
                  </div>
                )
                : feedback.map((f) => (
                  <div key={f.id} className="glass glass-hover rounded-2xl p-6 flex flex-col group transition-all duration-300 hover:-translate-y-1 relative overflow-hidden">
                    <Quote size={64} className="absolute -top-2 -right-2 text-[var(--accent)] opacity-5" />
                    <div className="flex items-start justify-between mb-4">
                      <StarRating rating={f.rating} />
                      <span className="text-xs text-[var(--text-muted)]">{formatDate(f.created_at)}</span>
                    </div>
                    <p className="text-sm text-[var(--text-secondary)] leading-relaxed flex-1 italic">"{f.message}"</p>
                    <div className="mt-5 pt-4 border-t border-[var(--border)] flex items-center gap-3">
                      {avatarSrc(f.avatar) ? (
                        <img src={avatarSrc(f.avatar)!} alt={f.name} className="w-10 h-10 rounded-full object-cover border-2 shrink-0" style={{ borderColor: 'rgba(64,138,113,0.4)' }} />
                      ) : (
                        <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0" style={{ background: 'linear-gradient(135deg, #285A48, #408A71)' }}>
                          {f.name?.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-semibold text-white" style={{ fontFamily: 'var(--font-display)' }}>{f.name}</p>
                        {f.company && <p className="text-xs text-[var(--text-muted)]">{f.company}</p>}
                      </div>
                    </div>
                  </div>
                ))
              }
            </div>
          </div>

          {/* Submit form */}
          <SubmitFeedbackForm />

        </div>
      </section>
    </PublicLayout>
  );
}
