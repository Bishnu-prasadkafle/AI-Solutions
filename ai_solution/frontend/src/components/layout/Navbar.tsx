'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';

const navLinks = [
  { href: '/about', label: 'About' },
  { href: '/services', label: 'Services' },
  { href: '/solutions', label: 'Solutions' },
  { href: '/events', label: 'Events' },
  { href: '/blog', label: 'Blog' },
  { href: '/feedback', label: 'Feedback' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'py-4 shadow-lg shadow-black/40'
          : 'py-6'
      }`}
      style={{
        background: scrolled
          ? 'rgba(10, 28, 25, 0.95)'
          : '#0d2320',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: '1px solid rgba(64, 138, 113, 0.25)',
      }}
    >
      <div className="container-custom flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="group flex items-center gap-[2px]" style={{ fontFamily: 'var(--font-display)' }}>
          <span
            className="text-2xl font-extrabold tracking-tight px-2 py-[3px] rounded-md text-white"
            style={{ background: 'linear-gradient(135deg, #285A48, #408A71)' }}
          >
            AI
          </span>
          <span
            className="text-2xl font-extrabold tracking-tight group-hover:opacity-80 transition-opacity"
            style={{ background: 'linear-gradient(135deg, #FFD700, #408A71)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}
          >
            -SOLUTIONS
          </span>
        </Link>

        {/* Desktop nav */}
        <ul className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`px-4 py-2 rounded-lg text-base font-semibold uppercase tracking-wide transition-all duration-200 ${
                  pathname === link.href
                    ? 'text-accent bg-accent/10 border border-accent/20'
                    : 'text-[var(--text-secondary)] hover:text-white hover:bg-white/5'
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link href="/contact" className="btn-primary text-sm py-2 px-5">
            Contact
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden p-2 rounded-lg text-[var(--text-secondary)] hover:text-white hover:bg-white/5"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden glass border-t border-[var(--border)] mt-2">
          <ul className="container-custom py-4 flex flex-col gap-1">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`block px-4 py-3 rounded-lg text-base font-semibold uppercase tracking-wide transition-all ${
                    pathname === link.href
                      ? 'text-accent bg-accent/10'
                      : 'text-[var(--text-secondary)] hover:text-white hover:bg-white/5'
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li className="pt-2">
              <Link href="/contact" className="btn-primary text-sm block text-center" onClick={() => setOpen(false)}>
                Get Started
              </Link>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}
