'use client';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import { Zap, Lock, User, Loader2, AlertCircle } from 'lucide-react';

type LoginForm = { username: string; password: string };

export default function AdminLoginPage() {
  const { login, isAuthenticated, isLoading, checkAuth } = useAuthStore();
  const router = useRouter();
  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>();
  const [authError, setAuthError] = useState('');

  useEffect(() => { checkAuth(); }, [checkAuth]);
  useEffect(() => {
    if (isAuthenticated) router.replace('/admin');
  }, [isAuthenticated, router]);

  const onSubmit = async (data: LoginForm) => {
    setAuthError('');
    try {
      await login(data.username, data.password);
      router.push('/admin');
    } catch {
      setAuthError('Invalid username or password. Please check your credentials and try again.');
      setTimeout(() => setAuthError(''), 10000);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden" style={{ background: 'var(--bg)' }}>
      <div className="blob w-96 h-96 bg-brand-600/20 -top-20 -left-20" />
      <div className="blob w-96 h-96 bg-accent/10 bottom-0 right-0" />
      <div className="absolute inset-0 bg-grid-pattern opacity-30" />

      <div className="glass rounded-2xl p-10 w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-500 to-accent flex items-center justify-center mx-auto mb-4 shadow-lg shadow-accent/20">
            <Zap size={24} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>Admin Portal</h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">AI-Solution Dashboard</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {authError && (
            <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-lg animate-[fadeIn_0.3s_ease]">
              <AlertCircle size={15} className="shrink-0" />
              {authError}
            </div>
          )}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-2">Username</label>
            <div className="relative flex items-center">
              <User size={15} className="absolute left-3 text-[var(--text-muted)] pointer-events-none" />
              <input
                {...register('username', { required: 'Username is required' })}
                className="input-field"
                placeholder="admin"
                autoComplete="username"
              />
            </div>
            {errors.username && <p className="text-red-400 text-xs mt-1">{errors.username.message}</p>}
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-2">Password</label>
            <div className="relative flex items-center">
              <Lock size={15} className="absolute left-3 text-[var(--text-muted)] pointer-events-none" />
              <input
                {...register('password', { required: 'Password is required' })}
                type="password"
                className="input-field"
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </div>
            {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
          </div>
          <button type="submit" disabled={isLoading} className="btn-primary w-full flex items-center justify-center gap-2 mt-2">
            {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Lock size={16} />}
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-xs text-[var(--text-muted)] mt-6">
          <a href="/" className="hover:text-accent transition-colors">← Back to website</a>
        </p>
      </div>
    </div>
  );
}
