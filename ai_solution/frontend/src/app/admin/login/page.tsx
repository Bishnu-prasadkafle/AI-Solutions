'use client';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import toast from 'react-hot-toast';
import { Zap, Lock, User, Loader2 } from 'lucide-react';

type LoginForm = { username: string; password: string };

export default function AdminLoginPage() {
  const { login, isAuthenticated, isLoading, checkAuth } = useAuthStore();
  const router = useRouter();
  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>();

  useEffect(() => { checkAuth(); }, [checkAuth]);
  useEffect(() => {
    if (isAuthenticated) router.replace('/admin');
  }, [isAuthenticated, router]);

  const onSubmit = async (data: LoginForm) => {
    try {
      await login(data.username, data.password);
      router.push('/admin');
    } catch {
      toast.error('Invalid credentials. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden" style={{ background: 'var(--bg)' }}>
      <div className="blob w-96 h-96 bg-brand-600/20 -top-20 -left-20" />
      <div className="blob w-96 h-96 bg-accent/10 bottom-0 right-0" />
      <div className="absolute inset-0 bg-grid-pattern opacity-30" />

      <div className="glass rounded-2xl p-10 w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-500 to-accent flex items-center justify-center mx-auto mb-4 shadow-lg shadow-accent/20">
            <Zap size={24} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>Admin Portal</h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">AI-Solution Dashboard</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-2">Username</label>
            <div className="relative">
              <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
              <input
                {...register('username', { required: 'Username is required' })}
                className="input-field pl-9"
                placeholder="admin"
                autoComplete="username"
              />
            </div>
            {errors.username && <p className="text-red-400 text-xs mt-1">{errors.username.message}</p>}
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-2">Password</label>
            <div className="relative">
              <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
              <input
                {...register('password', { required: 'Password is required' })}
                type="password"
                className="input-field pl-9"
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
