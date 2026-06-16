'use client';
import Link from "next/link";
import { Twitter, Linkedin, Github, Mail, MapPin } from "lucide-react";

const companyLinks = ["Home", "About", "Services", "Solutions", "Gallery", "Events", "Blog", "Contact"];
const socials = [
  { Icon: Twitter, href: "#" },
  { Icon: Linkedin, href: "#" },
  { Icon: Github, href: "#" },
  { Icon: Mail, href: "#" },
];

export default function Footer() {
  return (
    <footer
      style={{
        background: "#0d2320",
        borderTop: "1px solid rgba(64,138,113,0.25)",
      }}>
      <div className='container-custom py-16'>
        <div className='grid grid-cols-1 md:grid-cols-12 gap-10'>
          {/* Brand */}
          <div className='md:col-span-4'>
            {/* Same logo as Navbar */}
            <Link
              href='/'
              className='group flex items-center gap-[2px] mb-5 mt-5'
              style={{ fontFamily: "var(--font-display)" }}>
              <span
                className='text-2xl font-extrabold tracking-tight px-2 py-[3px] rounded-md text-white'
                style={{
                  background: "linear-gradient(135deg, #285A48, #408A71)",
                }}>
                AI
              </span>
              <span
                className='text-2xl font-extrabold tracking-tight group-hover:opacity-80 transition-opacity'
                style={{
                  background: "linear-gradient(135deg, #FFD700, #408A71)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}>
                -SOLUTIONS
              </span>
            </Link>

            <p
              className='text-sm leading-relaxed max-w-xs mb-6'
              style={{ color: "var(--text-secondary)" }}>
              Innovating the digital employee experience through intelligent
              AI-powered software solutions for industries worldwide.
            </p>


          </div>

          {/* Company */}
          <div className='md:col-span-3 md:col-start-6 mt-5'>
            <h3
              className='text-xs font-semibold uppercase tracking-widest mb-5'
              style={{ color: "#408A71" }}>
              Company
            </h3>
            <ul className='space-y-3'>
              {companyLinks.map((item) => (
                <li key={item}>
                  <Link
                    href={`/${item.toLowerCase() === "home" ? "" : item.toLowerCase()}`}
                    className='text-sm transition-colors hover:text-white'
                    style={{ color: "var(--text-secondary)" }}>
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div className='md:col-span-2 mt-5'>
            <h3
              className='text-xs font-semibold uppercase tracking-widest mb-5'
              style={{ color: "#408A71" }}>
              Legal
            </h3>
            <ul className='space-y-3'>
              {[
                { label: 'Privacy Policy', href: '/privacy-policy' },
                { label: 'Terms of Service', href: '/terms-of-service' },
                { label: 'Cookie Policy', href: '/cookie-policy' },
              ].map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    className='text-sm transition-colors hover:text-white'
                    style={{ color: "var(--text-secondary)" }}>
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className='md:col-span-2 mt-5'>
            <h3
              className='text-xs font-semibold uppercase tracking-widest mb-5'
              style={{ color: "#408A71" }}>
              Contact
            </h3>
            <div className='flex flex-col gap-3'>
              <a href="https://maps.google.com/?q=Sunderland,United+Kingdom" target="_blank" rel="noopener noreferrer" className='flex items-center gap-2 text-sm transition-colors hover:text-[#6ecfaa]' style={{ color: "var(--text-secondary)" }}>
                <MapPin size={14} style={{ color: "#408A71" }} />
                Sunderland, United Kingdom
              </a>
              <a href="mailto:contact@ai-solutions.com" className='flex items-center gap-2 text-sm transition-colors hover:text-[#6ecfaa]' style={{ color: "var(--text-secondary)" }}>
                <Mail size={14} style={{ color: "#408A71" }} />
                contact@ai-solutions.com
              </a>
              <div className='flex gap-3 mt-2'>
                {socials.map(({ Icon, href }, i) => (
                  <a
                    key={i}
                    href={href}
                    className='w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:scale-110'
                    style={{ border: "1px solid rgba(64,138,113,0.3)", color: "var(--text-muted)" }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLAnchorElement).style.borderColor = "#408A71";
                      (e.currentTarget as HTMLAnchorElement).style.color = "#408A71";
                      (e.currentTarget as HTMLAnchorElement).style.background = "rgba(64,138,113,0.1)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(64,138,113,0.3)";
                      (e.currentTarget as HTMLAnchorElement).style.color = "var(--text-muted)";
                      (e.currentTarget as HTMLAnchorElement).style.background = "transparent";
                    }}>
                    <Icon size={15} />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className='mt-14 pt-8 flex justify-center'
          style={{ borderTop: "1px solid rgba(64,138,113,0.2)" }}>
          <p className='text-xs mb-3' style={{ color: "var(--text-muted)" }}>
            © {new Date().getFullYear()} AI-Solutions Ltd. All rights reserved.
            Based in Sunderland, UK.
          </p>
        </div>
      </div>
    </footer>
  );
}
