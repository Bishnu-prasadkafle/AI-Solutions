import { X } from 'lucide-react';

interface AdminModalProps {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  wide?: boolean;
}

export default function AdminModal({ title, onClose, children, wide = false }: AdminModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      <div className={`glass rounded-2xl p-8 w-full ${wide ? 'max-w-3xl' : 'max-w-2xl'} relative z-10 max-h-[90vh] overflow-y-auto`}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>{title}</h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/10 text-[var(--text-muted)]">
            <X size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
