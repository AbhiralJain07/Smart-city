import { redirect } from 'next/navigation';

import { getAdminSession } from '@/lib/cms/auth';
import { DEFAULT_ADMIN_EMAIL, DEFAULT_ADMIN_PASSWORD } from '@/lib/cms/default-admin-credentials';

import AdminLoginForm from '../../components/admin/AdminLoginForm';

export const dynamic = 'force-dynamic';

export default async function AdminLoginPage() {
  const session = await getAdminSession();

  if (session) {
    redirect('/admin');
  }

  return (
    <div className="bg-background-primary min-h-screen px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
        <div className="space-y-6">
          <p className="text-neon-blue text-sm font-semibold tracking-[0.35em] uppercase">
            Secure Admin Access
          </p>
          <h1 className="font-heading text-4xl font-bold text-white sm:text-5xl">
            Manage the landing page without leaving the existing project stack
          </h1>
          <p className="max-w-2xl text-lg text-white/65">
            Sign in as an administrator to manage testimonials, blogs, pricing plans, and contact
            submissions. All updates are validated server-side and synced back to the public site
            without a reload.
          </p>
          <div className="max-w-xl rounded-3xl border border-white/10 bg-black/30 p-6 backdrop-blur-sm">
            <p className="text-neon-green text-sm font-semibold tracking-[0.3em] uppercase">
              Login Credentials
            </p>
            <div className="mt-4 space-y-4">
              <div>
                <p className="text-xs tracking-[0.25em] text-white/40 uppercase">Email</p>
                <p className="mt-2 rounded-2xl border border-white/10 bg-black/30 px-4 py-3 font-mono text-sm text-white">
                  {DEFAULT_ADMIN_EMAIL}
                </p>
              </div>
              <div>
                <p className="text-xs tracking-[0.25em] text-white/40 uppercase">Password</p>
                <p className="mt-2 rounded-2xl border border-white/10 bg-black/30 px-4 py-3 font-mono text-sm text-white">
                  {DEFAULT_ADMIN_PASSWORD}
                </p>
              </div>
            </div>
          </div>
        </div>
        <AdminLoginForm />
      </div>
    </div>
  );
}
