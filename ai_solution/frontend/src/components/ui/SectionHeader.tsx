interface SectionHeaderProps {
  badge: string;
  title: React.ReactNode;
  subtitle?: string;
  center?: boolean;
  gradient?: boolean;
  action?: React.ReactNode;
}

export default function SectionHeader({ badge, title, subtitle, center = true, gradient = false, action }: SectionHeaderProps) {
  return (
    <div className={`mb-14 ${center ? 'text-center' : ''}`}>
      <div className={`flex items-center gap-3 mb-4 ${center ? 'justify-center' : ''}`}>
        <div className="badge badge-cyan">{badge}</div>
      </div>
      <h2 className={`text-4xl md:text-5xl font-bold mb-4 ${gradient ? 'gradient-text' : ''}`} style={{ fontFamily: 'var(--font-display)' }}>
        {title}
      </h2>
      {subtitle && (
        <p className={`text-[var(--text-secondary)] text-sm leading-relaxed ${center ? 'max-w-xl mx-auto' : 'max-w-xl'}`}>{subtitle}</p>
      )}
      {action && <div className={`mt-6 ${center ? 'flex justify-center' : ''}`}>{action}</div>}
    </div>
  );
}
