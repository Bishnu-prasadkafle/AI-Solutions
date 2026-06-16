'use client';
import { useEffect } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

interface StatusModalProps {
  type: 'success' | 'error';
  message: string;
  onClose: () => void;
}

export default function StatusModal({ type, message, onClose }: StatusModalProps) {
  useEffect(() => {
    if (type === 'success') {
      const t = setTimeout(onClose, 2500);
      return () => clearTimeout(t);
    }
  }, [type, onClose]);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/70"
        onClick={type === 'error' ? onClose : undefined}
      />
      <div className="glass rounded-2xl p-8 w-full max-w-sm relative z-10">
        <div className="flex flex-col items-center text-center gap-5">
          {type === 'success' ? (
            <>
              <div className="w-16 h-16 rounded-full bg-green-500/15 border border-green-500/20 flex items-center justify-center">
                <CheckCircle size={32} className="text-green-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>
                  {message}
                </h3>
                <p className="text-xs mt-2 opacity-60" style={{ color: 'var(--text-muted)' }}>
                  Closing automatically...
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="w-16 h-16 rounded-full bg-red-500/15 border border-red-500/20 flex items-center justify-center">
                <XCircle size={32} className="text-red-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>
                  Something went wrong
                </h3>
                <p className="text-sm mt-2" style={{ color: 'var(--text-muted)' }}>{message}</p>
              </div>
              <button onClick={onClose} className="btn-ghost w-full">Close</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
