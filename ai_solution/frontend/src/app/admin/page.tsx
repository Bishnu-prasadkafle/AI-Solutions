'use client';
import { useEffect, useState } from 'react';
import { statsAPI } from '@/lib/api';
import { Briefcase, BookOpen, Image, MessageSquare, Star, TrendingUp, Loader2, BarChart2, Users, Lightbulb } from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    statsAPI.get().then((r) => setStats(r.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex justify-center py-20">
      <Loader2 size={32} className="animate-spin text-accent" />
    </div>
  );

  const cards = [
    { label: 'Services', value: stats?.services?.total, sub: `${stats?.services?.active} active`, icon: Briefcase, href: '/admin/services', color: 'text-blue-400' },
    { label: 'Solutions', value: stats?.solutions?.total ?? '—', sub: `${stats?.solutions?.active ?? 0} active`, icon: Lightbulb, href: '/admin/solutions', color: 'text-emerald-400' },
    { label: 'Blog Posts', value: stats?.blogs?.total, sub: `${stats?.blogs?.published} published`, icon: BookOpen, href: '/admin/blogs', color: 'text-purple-400' },
    { label: 'Gallery / Events', value: stats?.gallery?.total, sub: `${stats?.gallery?.events} events`, icon: Image, href: '/admin/gallery', color: 'text-green-400' },
    { label: 'Team Members', value: stats?.team?.total ?? '—', sub: `${stats?.team?.active ?? 0} active`, icon: Users, href: '/admin/team', color: 'text-cyan-400' },
    { label: 'Enquiries', value: stats?.contacts?.total, sub: `${stats?.contacts?.unread} unread`, icon: MessageSquare, href: '/admin/contacts', color: 'text-accent', urgent: stats?.contacts?.unread > 0 },
    { label: 'Feedback', value: stats?.feedback?.total, sub: `${stats?.feedback?.pending} pending`, icon: Star, href: '/admin/feedback', color: 'text-yellow-400' },
    { label: 'Avg. Rating', value: `${stats?.feedback?.average_rating}★`, sub: 'from approved reviews', icon: TrendingUp, href: '/admin/feedback', color: 'text-orange-400' },
    { label: 'Analytics', value: '→', sub: 'Charts & reports', icon: BarChart2, href: '/admin/analytics', color: 'text-pink-400' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>Dashboard</h1>
        <p className="text-[var(--text-secondary)] mt-1">Overview of your AI-Solution platform</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        {cards.map((card, i) => (
          <Link key={i} href={card.href}
            className={`glass glass-hover rounded-xl p-6 flex gap-4 items-start transition-all hover:-translate-y-0.5 ${card.urgent ? 'border-accent/40' : ''}`}>
            <div className={`w-11 h-11 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0 ${card.color}`}>
              <card.icon size={20} />
            </div>
            <div>
              <p className="text-2xl font-bold text-white mb-0.5" style={{ fontFamily: 'var(--font-display)' }}>{card.value ?? '—'}</p>
              <p className="text-sm font-medium text-white">{card.label}</p>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">{card.sub}</p>
            </div>
            {card.urgent && (
              <div className="ml-auto">
                <span className="badge badge-red">{stats?.contacts?.unread} new</span>
              </div>
            )}
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <div className="glass rounded-xl p-6">
        <h2 className="text-lg font-semibold text-white mb-4" style={{ fontFamily: 'var(--font-display)' }}>Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Add Service', href: '/admin/services', icon: Briefcase },
            { label: 'Write Blog Post', href: '/admin/blogs', icon: BookOpen },
            { label: 'Upload to Gallery', href: '/admin/gallery', icon: Image },
            { label: 'View Inquiries', href: '/admin/contacts', icon: MessageSquare },
          ].map((a, i) => (
            <Link key={i} href={a.href}
              className="flex flex-col items-center gap-2 p-4 rounded-lg border border-[var(--border)] hover:border-accent/30 hover:bg-accent/5 text-center transition-all group">
              <a.icon size={20} className="text-[var(--text-muted)] group-hover:text-accent transition-colors" />
              <span className="text-xs text-[var(--text-secondary)] group-hover:text-white transition-colors">{a.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
