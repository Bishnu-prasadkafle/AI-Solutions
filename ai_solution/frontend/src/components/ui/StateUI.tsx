import { Loader2 } from 'lucide-react';

export function LoadingSpinner() {
  return (
    <div className="flex justify-center py-20">
      <Loader2 size={32} className="animate-spin text-accent" />
    </div>
  );
}

interface EmptyStateProps {
  message: string;
}

export function EmptyState({ message }: EmptyStateProps) {
  return (
    <div className="text-center py-20 text-[var(--text-muted)]">
      <p>{message}</p>
    </div>
  );
}
