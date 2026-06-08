'use client';
import { useEffect, useState } from 'react';
import { statsAPI } from '@/lib/api';
import Link from 'next/link';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import {
  ArrowRight, CheckCircle, Clock, Loader2, TrendingUp,
  MessageSquare, Star, BookOpen, RefreshCw,
} from 'lucide-react';

const ACCENT = '#408A71';
const COLORS = ['#408A71', '#B0E4CC', '#285A48', '#5aab8a', '#1a3d35', '#7dcfad'];

const INTEREST_LABELS: Record<string, string> = {
  virtual_assistant: 'Virtual Assistant',
  schedule_demo: 'Demo Request',
  events: 'Events',
  sales: 'Sales',
  general: 'General',
};

const CATEGORY_LABELS: Record<string, string> = {
  ai: 'AI', tech: 'Technology', news: 'News',
  tutorial: 'Tutorial', case_study: 'Case Study',
};

const tooltipStyle = {
  contentStyle: { background: '#0d1f1d', border: '1px solid rgba(64,138,113,0.3)', borderRadius: 12, fontSize: 12 },
  labelStyle: { color: '#B0E4CC', fontWeight: 600 },
  itemStyle: { color: '#8bbfaa' },
};

function ChartCard({ title, subtitle, children }: any) {
  return (
    <div className="glass rounded-2xl p-6">
      <div className="mb-5">
        <p className="font-semibold text-white" style={{ fontFamily: 'var(--font-display)' }}>{title}</p>
        {subtitle && <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}

function KpiMini({ label, value, sub, color }: any) {
  return (
    <div className="glass rounded-2xl p-5">
      <p className="text-3xl font-bold mb-1" style={{ fontFamily: 'var(--font-display)', color }}>{value ?? '—'}</p>
      <p className="text-sm font-medium text-white">{label}</p>
      <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{sub}</p>
    </div>
  );
}

export default function AdminAnalyticsPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    statsAPI.get().then((r) => setStats(r.data)).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-32 gap-4">
      <Loader2 size={36} className="animate-spin text-accent" />
      <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Loading analytics...</p>
    </div>
  );

  const charts = stats?.charts ?? {};
  const recent = stats?.recent ?? {};
  const s = stats;

  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>Analytics</h1>
          <p className="text-[var(--text-secondary)] mt-1">Charts, trends and performance reports</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs" style={{ background: 'rgba(64,138,113,0.1)', border: '1px solid rgba(64,138,113,0.2)', color: '#B0E4CC' }}>
            <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            Live data
          </div>
          <button
            onClick={load}
            className="w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:bg-accent/10"
            style={{ border: '1px solid var(--border)', color: 'var(--text-muted)' }}>
            <RefreshCw size={15} />
          </button>
        </div>
      </div>

      {/* Top KPI strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KpiMini label="Total Inquiries" value={s?.contacts?.total} sub={`${s?.contacts?.this_week ?? 0} this week`} color="#408A71" />
        <KpiMini label="Unread Inquiries" value={s?.contacts?.unread} sub="Awaiting response" color="#f87171" />
        <KpiMini label="Avg. Rating" value={`${s?.feedback?.average_rating}★`} sub={`${s?.feedback?.approved} approved reviews`} color="#fbbf24" />
        <KpiMini label="Blog Views" value={s?.blogs?.total_views ?? '—'} sub={`${s?.blogs?.published} published posts`} color="#a78bfa" />
      </div>

      {/* Area charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Contact Inquiries Trend" subtitle="Monthly inbound inquiries — last 6 months">
          <ResponsiveContainer width="100%" height={230}>
            <AreaChart data={charts.contacts_trend ?? []} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="cGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={ACCENT} stopOpacity={0.35} />
                  <stop offset="95%" stopColor={ACCENT} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(64,138,113,0.1)" />
              <XAxis dataKey="month" tick={{ fill: '#5a8a78', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#5a8a78', fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip {...tooltipStyle} />
              <Area type="monotone" dataKey="contacts" stroke={ACCENT} strokeWidth={2.5} fill="url(#cGrad)" dot={{ fill: ACCENT, r: 3 }} activeDot={{ r: 5 }} name="Inquiries" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Blog Publishing Trend" subtitle="Monthly posts published — last 6 months">
          <ResponsiveContainer width="100%" height={230}>
            <AreaChart data={charts.blogs_trend ?? []} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="bGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#a78bfa" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#a78bfa" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(64,138,113,0.1)" />
              <XAxis dataKey="month" tick={{ fill: '#5a8a78', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#5a8a78', fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip {...tooltipStyle} />
              <Area type="monotone" dataKey="posts" stroke="#a78bfa" strokeWidth={2.5} fill="url(#bGrad)" dot={{ fill: '#a78bfa', r: 3 }} activeDot={{ r: 5 }} name="Posts" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Breakdown charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Inquiry interest donut */}
        <ChartCard title="Inquiry Breakdown" subtitle="By interest type">
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={(charts.interest_breakdown ?? []).map((d: any) => ({
                  name: INTEREST_LABELS[d.interest] || d.interest,
                  value: d.count,
                }))}
                cx="50%" cy="50%"
                innerRadius={55} outerRadius={82}
                paddingAngle={3} dataKey="value">
                {(charts.interest_breakdown ?? []).map((_: any, i: number) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip {...tooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-3 space-y-2">
            {(charts.interest_breakdown ?? []).map((d: any, i: number) => (
              <div key={i} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full shrink-0" style={{ background: COLORS[i % COLORS.length] }} />
                  <span style={{ color: 'var(--text-secondary)' }}>{INTEREST_LABELS[d.interest] || d.interest}</span>
                </div>
                <span className="font-semibold text-white">{d.count}</span>
              </div>
            ))}
          </div>
        </ChartCard>

        {/* Rating distribution */}
        <ChartCard title="Rating Distribution" subtitle="Feedback scores 1–5 stars">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={charts.rating_distribution ?? []} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(64,138,113,0.1)" />
              <XAxis dataKey="rating" tick={{ fill: '#5a8a78', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#5a8a78', fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip {...tooltipStyle} />
              <Bar dataKey="count" radius={[4, 4, 0, 0]} name="Reviews">
                {(charts.rating_distribution ?? []).map((_: any, i: number) => (
                  <Cell key={i} fill={i >= 3 ? '#4ade80' : i === 2 ? '#fbbf24' : '#f87171'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-3 flex justify-center gap-4 text-xs" style={{ color: 'var(--text-muted)' }}>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-400 inline-block" />Low (1–2)</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-yellow-400 inline-block" />Mid (3)</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-400 inline-block" />High (4–5)</span>
          </div>
        </ChartCard>

        {/* Blog by category */}
        <ChartCard title="Blogs by Category" subtitle="Total posts per category">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart
              data={(charts.blog_by_category ?? []).map((d: any) => ({
                name: CATEGORY_LABELS[d.category] || d.category,
                posts: d.count,
              }))}
              layout="vertical"
              margin={{ top: 0, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(64,138,113,0.1)" horizontal={false} />
              <XAxis type="number" tick={{ fill: '#5a8a78', fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
              <YAxis type="category" dataKey="name" tick={{ fill: '#5a8a78', fontSize: 11 }} axisLine={false} tickLine={false} width={72} />
              <Tooltip {...tooltipStyle} />
              <Bar dataKey="posts" fill="#a78bfa" radius={[0, 4, 4, 0]} name="Posts" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

      </div>

      {/* Recent activity row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Recent inquiries */}
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="font-semibold text-white" style={{ fontFamily: 'var(--font-display)' }}>Recent Inquiries</p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>Latest contact form submissions</p>
            </div>
            <Link href="/admin/contacts" className="text-xs flex items-center gap-1 transition-colors hover:text-accent" style={{ color: 'var(--text-muted)' }}>
              View all <ArrowRight size={11} />
            </Link>
          </div>
          <div className="space-y-2">
            {!(recent.contacts ?? []).length ? (
              <p className="text-sm text-center py-8" style={{ color: 'var(--text-muted)' }}>No inquiries yet</p>
            ) : (recent.contacts ?? []).map((c: any) => (
              <div key={c.id} className="flex items-center gap-3 p-3 rounded-xl transition-colors hover:bg-accent/5" style={{ border: '1px solid rgba(64,138,113,0.08)' }}>
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                  style={{ background: 'linear-gradient(135deg,#285A48,#408A71)' }}>
                  {c.name?.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-white truncate">{c.name}</p>
                    {!c.is_read && <span className="badge badge-red text-[10px] shrink-0">New</span>}
                  </div>
                  <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>
                    {c.company_name} · {INTEREST_LABELS[c.interest] || c.interest}
                  </p>
                </div>
                <p className="text-[10px] shrink-0" style={{ color: 'var(--text-muted)' }}>
                  {new Date(c.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Recent feedback */}
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="font-semibold text-white" style={{ fontFamily: 'var(--font-display)' }}>Recent Feedback</p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>Latest client reviews</p>
            </div>
            <Link href="/admin/feedback" className="text-xs flex items-center gap-1 transition-colors hover:text-accent" style={{ color: 'var(--text-muted)' }}>
              View all <ArrowRight size={11} />
            </Link>
          </div>
          <div className="space-y-2">
            {!(recent.feedback ?? []).length ? (
              <p className="text-sm text-center py-8" style={{ color: 'var(--text-muted)' }}>No feedback yet</p>
            ) : (recent.feedback ?? []).map((f: any) => (
              <div key={f.id} className="flex items-center gap-3 p-3 rounded-xl transition-colors hover:bg-accent/5" style={{ border: '1px solid rgba(64,138,113,0.08)' }}>
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                  style={{ background: 'linear-gradient(135deg,#1a3d35,#285A48)' }}>
                  {f.name?.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-medium text-white truncate">{f.name}</p>
                    <span className="text-xs text-yellow-400 shrink-0">{'★'.repeat(f.rating)}{'☆'.repeat(5 - f.rating)}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>{f.company || 'Individual'}</p>
                    {f.is_approved
                      ? <span className="text-[10px] text-green-400 flex items-center gap-0.5 shrink-0"><CheckCircle size={9} /> Approved</span>
                      : <span className="text-[10px] text-yellow-400 flex items-center gap-0.5 shrink-0"><Clock size={9} /> Pending</span>}
                  </div>
                </div>
                <p className="text-[10px] shrink-0" style={{ color: 'var(--text-muted)' }}>
                  {new Date(f.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
