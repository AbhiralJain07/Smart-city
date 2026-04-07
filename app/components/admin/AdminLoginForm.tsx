'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';

import { DEFAULT_ADMIN_EMAIL, DEFAULT_ADMIN_PASSWORD } from '@/lib/cms/default-admin-credentials';

import Button from '../ui/Button';

export default function AdminLoginForm() {
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

      router.push('/admin');
      router.refresh();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Unable to sign in.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 rounded-3xl border border-white/10 bg-black/30 p-8 backdrop-blur-sm"
    >
      <div className="border-neon-blue/20 bg-neon-blue/5 rounded-2xl border px-4 py-3 text-sm text-white/75">
        The provided admin credentials are already filled in for quick access.
      </div>

      <div>
        <label htmlFor="admin-email" className="mb-2 block text-sm font-medium text-white/70">
          Admin Email
        </label>
        <input
          id="admin-email"
          type="email"
          value={email}
          onChange={event => setEmail(event.target.value)}
          className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none"
          placeholder="admin@example.com"
          required
        />
      </div>

      <div>
        <label htmlFor="admin-password" className="mb-2 block text-sm font-medium text-white/70">
          Password
        </label>
        <input
          id="admin-password"
          type="password"
          value={password}
          onChange={event => setPassword(event.target.value)}
          className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none"
          placeholder="Enter admin password"
          required
        />
      </div>

      <button
        type="button"
        onClick={() => {
          setEmail(DEFAULT_ADMIN_EMAIL);
          setPassword(DEFAULT_ADMIN_PASSWORD);
          setErrorMessage('');
        }}
        className="text-neon-blue text-sm font-medium transition hover:text-cyan-400"
      >
        Refill provided credentials
      </button>

      {errorMessage ? (
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {errorMessage}
        </div>
      ) : null}

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? 'Signing in...' : 'Sign in to dashboard'}
      </Button>
    </form>
  );
}
