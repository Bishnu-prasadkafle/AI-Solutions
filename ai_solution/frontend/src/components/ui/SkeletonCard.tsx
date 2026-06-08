type SkeletonVariant = 'service' | 'blog-featured' | 'blog-side';

export default function SkeletonCard({ variant = 'service' }: { variant?: SkeletonVariant }) {
  if (variant === 'blog-featured') {
    return (
      <div className="glass rounded-2xl overflow-hidden animate-pulse">
        <div className="h-60 bg-[var(--accent-dim)]" />
        <div className="p-6 flex flex-col gap-3">
          <div className="h-3 w-1/4 rounded bg-[var(--accent-dim)]" />
          <div className="h-5 w-3/4 rounded bg-[var(--accent-dim)]" />
          <div className="h-3 w-full rounded bg-[var(--accent-dim)]" />
          <div className="h-3 w-5/6 rounded bg-[var(--accent-dim)]" />
          <div className="h-px w-full bg-[var(--accent-dim)] mt-2" />
          <div className="h-3 w-1/2 rounded bg-[var(--accent-dim)]" />
        </div>
      </div>
    );
  }

  if (variant === 'blog-side') {
    return (
      <div className="glass rounded-2xl overflow-hidden flex animate-pulse h-28">
        <div className="w-36 shrink-0 bg-[var(--accent-dim)]" />
        <div className="p-5 flex flex-col justify-center gap-2 flex-1">
          <div className="h-2 w-1/4 rounded bg-[var(--accent-dim)]" />
          <div className="h-4 w-3/4 rounded bg-[var(--accent-dim)]" />
          <div className="h-2 w-1/2 rounded bg-[var(--accent-dim)]" />
        </div>
      </div>
    );
  }

  // service
  return (
    <div className="glass rounded-2xl overflow-hidden flex flex-col animate-pulse">
      <div className="h-28 bg-[var(--accent-dim)]" />
      <div className="p-7 flex flex-col gap-3">
        <div className="w-11 h-11 rounded-xl bg-[var(--accent-dim)]" />
        <div className="h-5 w-3/4 rounded bg-[var(--accent-dim)]" />
        <div className="h-3 w-full rounded bg-[var(--accent-dim)]" />
        <div className="h-3 w-5/6 rounded bg-[var(--accent-dim)]" />
        <div className="h-px w-full bg-[var(--accent-dim)] mt-1" />
        <div className="h-3 w-2/3 rounded bg-[var(--accent-dim)]" />
        <div className="h-3 w-1/2 rounded bg-[var(--accent-dim)]" />
        <div className="h-8 w-28 rounded-lg bg-[var(--accent-dim)] mt-2" />
      </div>
    </div>
  );
}
