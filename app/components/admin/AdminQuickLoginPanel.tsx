'use client';

import Link from 'next/link';
import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, LockKeyhole, Shield, X } from 'lucide-react';

import { DEFAULT_ADMIN_EMAIL, DEFAULT_ADMIN_PASSWORD } from '@/lib/cms/default-admin-credentials';

interface AdminQuickLoginPanelProps {
  onClose: () => void;
}

export default function AdminQuickLoginPanel({ onClose }: AdminQuickLoginPanelProps) {
  const router = useRouter();
  const [email, setEmail] = useState(DEFAULT_ADMIN_EMAIL);
  const [password, setPassword] = useState(DEFAULT_ADMIN_PASSWORD);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const response = await fetch('/api/auth/admin-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const payload = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(payload.error ?? 'Unable to sign in.');
      }

      onClose();
      router.push('/admin');
      router.refresh();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Unable to sign in.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-[min(92vw,24rem)] rounded-3xl border border-white/10 bg-black/95 p-5 text-white shadow-[0_20px_60px_rgba(0,0,0,0.45)] backdrop-blur-xl">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <div className="text-neon-blue mb-2 flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span className="text-xs font-semibold tracking-[0.28em] uppercase">Admin Access</span>
          </div>
          <h3 className="text-lg font-semibold text-white">Sign in from the header</h3>
          <p className="mt-1 text-sm text-white/60">
            Use the admin credentials to open the dashboard.
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-full border border-white/10 p-2 text-white/55 transition hover:border-white/20 hover:text-white"
          aria-label="Close admin login panel"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="border-neon-blue/20 bg-neon-blue/5 mb-4 rounded-2xl border px-3 py-2 text-xs text-white/75">
        Email and password are prefilled for quick login.
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block">
          <span className="mb-2 block text-xs font-medium tracking-[0.2em] text-white/55 uppercase">
            Email
          </span>
          <input
            type="email"
            value={email}
            onChange={event => setEmail(event.target.value)}
            className="focus:border-neon-blue/50 w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white transition outline-none"
            required
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-xs font-medium tracking-[0.2em] text-white/55 uppercase">
            Password
          </span>
          <div className="relative">
            <LockKeyhole className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-white/35" />
            <input
              type="password"
              value={password}
              onChange={event => setPassword(event.target.value)}
              className="focus:border-neon-blue/50 w-full rounded-2xl border border-white/10 bg-black/40 py-3 pr-4 pl-11 text-sm text-white transition outline-none"
              required
            />
          </div>
        </label>

        {errorMessage ? (
          <div className="rounded-2xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {errorMessage}
          </div>
        ) : null}

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-neon-blue inline-flex flex-1 items-center justify-center rounded-2xl px-4 py-3 text-sm font-semibold tracking-[0.2em] text-black uppercase transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? 'Signing in...' : 'Login as Admin'}
          </button>
          <button
            type="button"
            onClick={() => {
              setEmail(DEFAULT_ADMIN_EMAIL);
              setPassword(DEFAULT_ADMIN_PASSWORD);
              setErrorMessage('');
            }}
            className="rounded-2xl border border-white/10 px-4 py-3 text-sm font-medium text-white/75 transition hover:border-white/20 hover:text-white"
          >
            Reset
          </button>
        </div>
      </form>

      <Link
        href="/admin/login"
        onClick={onClose}
        className="text-neon-blue mt-4 inline-flex items-center gap-2 text-sm font-medium transition hover:text-cyan-400"
      >
        Open full login page
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}
