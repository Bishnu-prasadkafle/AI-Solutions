'use client';
import { useState, useEffect } from 'react';
import { Trash2, CheckCircle, XCircle, Loader2 } from 'lucide-react';

interface ConfirmModalProps {
  message: string;
  successMessage: string;
  onConfirm: () => Promise<void>;
  onClose: () => void;
}

export default function ConfirmModal({ message, successMessage, onConfirm, onClose }: ConfirmModalProps) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  useEffect(() => {
    if (status === 'success') {
      const t = setTimeout(onClose, 2500);
      return () => clearTimeout(t);
    }
  }, [status, onClose]);

  const handleConfirm = async () => {
    setStatus('loading');
    try {
      await onConfirm();
      setStatus('success');
    } catch {
      setStatus('error');
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/70"
        onClick={status === 'idle' ? onClose : undefined}
      />
      <div className="glass rounded-2xl p-8 w-full max-w-sm relative z-10">
        <div className="flex flex-col items-center text-center gap-5">

          {status === 'idle' && (
            <>
              <div className="w-16 h-16 rounded-full bg-red-500/15 border border-red-500/20 flex items-center justify-center">
                <Trash2 size={26} className="text-red-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>
                  Are you sure?
                </h3>
                <p className="text-sm mt-2" style={{ color: 'var(--text-muted)' }}>{message}</p>
                <p className="text-xs mt-1 opacity-60" style={{ color: 'var(--text-muted)' }}>
                  This action cannot be undone.
                </p>
              </div>
              <div className="flex gap-3 w-full">
                <button onClick={onClose} className="btn-ghost flex-1">Cancel</button>
                <button
                  onClick={handleConfirm}
                  className="flex-1 px-4 py-2.5 rounded-xl font-semibold text-sm text-red-400 border transition-all"
                  style={{ background: 'rgba(239,68,68,0.12)', borderColor: 'rgba(239,68,68,0.25)' }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(239,68,68,0.22)'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'rgba(239,68,68,0.12)'}
                >
                  Delete
                </button>
              </div>
            </>
          )}

          {status === 'loading' && (
            <>
              <Loader2 size={40} className="text-accent animate-spin" />
              <p className="text-white font-semibold" style={{ fontFamily: 'var(--font-display)' }}>
                Deleting...
              </p>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="w-16 h-16 rounded-full bg-green-500/15 border border-green-500/20 flex items-center justify-center">
                <CheckCircle size={32} className="text-green-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>
                  {successMessage}
                </h3>
                <p className="text-xs mt-2 opacity-60" style={{ color: 'var(--text-muted)' }}>
                  Closing automatically...
                </p>
              </div>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="w-16 h-16 rounded-full bg-red-500/15 border border-red-500/20 flex items-center justify-center">
                <XCircle size={32} className="text-red-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>
                  Failed to Delete
                </h3>
                <p className="text-sm mt-2" style={{ color: 'var(--text-muted)' }}>
                  Something went wrong. Please try again.
                </p>
              </div>
              <button onClick={onClose} className="btn-ghost w-full">Close</button>
            </>
          )}

        </div>
      </div>
    </div>
  );
}
