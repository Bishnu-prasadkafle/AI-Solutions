'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import {
  Zap, LayoutDashboard, Briefcase, BookOpen,
  Image, MessageSquare, Star, LogOut, Menu, X, ChevronRight, Users, BarChart2, Lightbulb
} from 'lucide-react';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/analytics', label: 'Analytics', icon: BarChart2 },
  { href: '/admin/services', label: 'Services', icon: Briefcase },
  { href: '/admin/solutions', label: 'Solutions', icon: Lightbulb },
  { href: '/admin/blogs', label: 'Blog Posts', icon: BookOpen },
  { href: '/admin/gallery', label: 'Gallery / Events', icon: Image },
  { href: '/admin/team', label: 'Team', icon: Users },
  { href: '/admin/contacts', label: 'Enquiries', icon: MessageSquare },
  { href: '/admin/feedback', label: 'Feedback', icon: Star },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user, logout, checkAuth } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (!isAuthenticated && pathname !== '/admin/login') {
      router.replace('/admin/login');
    }
  }, [isAuthenticated, pathname, router]);

  if (pathname === '/admin/login') return <>{children}</>;
  if (!isAuthenticated) return null;

  const handleLogout = async () => {
    await logout();
    router.push('/admin/login');
  };

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  const Sidebar = () => (
    <aside className="admin-sidebar flex flex-col h-full fixed left-0 top-0">
      {/* Logo */}
      <div className="p-6 border-b border-[var(--border)]">
        <Link href="/admin" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-accent flex items-center justify-center">
            <Zap size={16} className="text-white" />
          </div>
          <span className="font-bold text-sm" style={{ fontFamily: 'var(--font-display)' }}>
            AI-Solution <span className="text-accent">Admin</span>
          </span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <p className="text-xs font-semibold uppercase tracking-widest text-[var(--text-muted)] px-3 mb-3">Management</p>
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group ${
                  isActive(item.href, item.exact)
                    ? 'bg-accent/15 text-accent border border-accent/20'
                    : 'text-[var(--text-secondary)] hover:bg-white/5 hover:text-white'
                }`}
              >
                <item.icon size={16} />
                {item.label}
                {isActive(item.href, item.exact) && <ChevronRight size={12} className="ml-auto" />}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* User */}
      <div className="p-4 border-t border-[var(--border)]">
        <div className="flex items-center gap-3 mb-3 px-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-500 to-accent flex items-center justify-center text-xs font-bold text-white">
            {user?.username?.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-medium text-white">{user?.username}</p>
            <p className="text-xs text-[var(--text-muted)]">Administrator</p>
          </div>
        </div>
        <button onClick={handleLogout} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-[var(--text-secondary)] hover:text-red-400 hover:bg-red-400/5 transition-all">
          <LogOut size={15} /> Sign Out
        </button>
        <div className="mt-3 px-3">
          <Link href="/" className="text-xs text-[var(--text-muted)] hover:text-accent transition-colors">
            ← View Website
          </Link>
        </div>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--bg)' }}>
      {/* Desktop sidebar */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* Mobile sidebar */}
      {sidebarOpen && (
        <>
          <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
          <div className="fixed left-0 top-0 h-full z-50 lg:hidden w-64">
            <Sidebar />
          </div>
        </>
      )}

      {/* Main content */}
      <div className="flex-1 lg:ml-[260px] flex flex-col min-h-screen">
        {/* Top bar (mobile) */}
        <div className="lg:hidden flex items-center justify-between px-4 py-3 border-b border-[var(--border)] glass sticky top-0 z-30">
          <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-lg text-[var(--text-secondary)] hover:text-white">
            <Menu size={20} />
          </button>
          <span className="text-sm font-semibold" style={{ fontFamily: 'var(--font-display)' }}>Admin Panel</span>
          <div className="w-8" />
        </div>

        <main className="flex-1 p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
