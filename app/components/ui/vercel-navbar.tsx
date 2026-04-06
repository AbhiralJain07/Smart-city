'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import { startTransition, useCallback, useEffect, useRef, useState } from 'react';
import { LayoutDashboard, LogOut, Menu, Moon, Newspaper, Shield, Sun, X } from 'lucide-react';

import type { AdminSession } from '@/lib/cms/types';
import { cn } from '@/lib/utils';

import AdminQuickLoginPanel from '../admin/AdminQuickLoginPanel';
import { Avatar, AvatarFallback } from './avatar';
import { Button } from './shadcn-button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './dropdown-menu';

const navItems = [
  { label: 'Features', href: '#features' },
  { label: 'Impact', href: '#impact' },
  { label: 'Technology', href: '#technology' },
  { label: 'Blogs', href: '/blogs' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Testimonials', href: '#testimonials' },
  { label: 'Contact', href: '#contact' },
];

const themes = [
  { key: 'system', icon: LayoutDashboard, label: 'System' },
  { key: 'light', icon: Sun, label: 'Light' },
  { key: 'dark', icon: Moon, label: 'Dark' },
] as const;

function resolveHref(pathname: string, href: string) {
  if (!href.startsWith('#')) {
    return href;
  }

  return pathname === '/' ? href : `/${href}`;
}

export function VercelNavbar({ session }: { session: AdminSession | null }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [adminPanelOpen, setAdminPanelOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const { theme, setTheme } = useTheme();
  const desktopAdminPanelRef = useRef<HTMLDivElement | null>(null);
  const mobileAdminPanelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setAdminPanelOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!adminPanelOpen) {
      return;
    }

    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      const clickedDesktop = desktopAdminPanelRef.current?.contains(target) ?? false;
      const clickedMobile = mobileAdminPanelRef.current?.contains(target) ?? false;

      if (!clickedDesktop && !clickedMobile) {
        setAdminPanelOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setAdminPanelOpen(false);
      }
    };

    window.addEventListener('mousedown', handlePointerDown);
    window.addEventListener('keydown', handleEscape);

    return () => {
      window.removeEventListener('mousedown', handlePointerDown);
      window.removeEventListener('keydown', handleEscape);
    };
  }, [adminPanelOpen]);

  const handleLogout = useCallback(async () => {
    setLoggingOut(true);

    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
      });
    } finally {
      startTransition(() => {
        router.push('/');
        router.refresh();
      });
      setLoggingOut(false);
    }
  }, [router]);

  return (
    <header className="bg-background/90 sticky top-0 z-50 border-b border-white/10 shadow-[0_16px_40px_rgba(0,0,0,0.16)] backdrop-blur-xl">
      <div className="mx-auto flex h-18 w-full max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-3">
          <div className="from-neon-blue h-10 w-10 rounded-2xl bg-gradient-to-br to-cyan-400 shadow-[0_0_24px_rgba(0,217,255,0.35)]"></div>
          <div>
            <div className="text-base font-semibold text-white sm:text-lg">SmartCity AI</div>
            <div className="hidden text-xs tracking-[0.3em] text-white/45 uppercase sm:block">
              Command Center
            </div>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {navItems.map(item => (
            <Link
              key={item.label}
              href={resolveHref(pathname, item.href)}
              className="rounded-full px-3 py-2 text-sm text-white/70 transition hover:bg-white/5 hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Button variant="outline" asChild className="rounded-full px-5">
            <Link href="/blogs">
              <Newspaper className="mr-2 h-4 w-4" />
              Blogs
            </Link>
          </Button>

          {session ? (
            <>
              <Button
                asChild
                className="border-neon-blue/40 bg-neon-blue rounded-full border px-5 text-black shadow-[0_0_28px_rgba(0,217,255,0.28)] hover:bg-cyan-400 hover:shadow-[0_0_34px_rgba(0,217,255,0.36)]"
              >
                <Link href="/admin">
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  Dashboard
                </Link>
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="hover:border-neon-blue/40 rounded-full border border-white/10 transition">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="text-neon-blue bg-black text-sm">
                        AD
                      </AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-64 rounded-2xl border-white/10 bg-black/95 p-3 text-white"
                  align="end"
                >
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-semibold text-white">Admin Session</p>
                    <p className="text-xs text-white/60">{session.email}</p>
                  </div>
                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuGroup>
                    <DropdownMenuItem
                      asChild
                      className="cursor-pointer py-2.5 focus:bg-white/10 focus:text-white"
                    >
                      <Link href="/admin">
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuGroup>
                    <div className="px-2 py-2">
                      <p className="mb-2 text-xs tracking-[0.25em] text-white/45 uppercase">
                        Theme
                      </p>
                      <div className="flex rounded-full border border-white/10 bg-white/5 p-1">
                        {mounted
                          ? themes.map(({ key, icon: Icon, label }) => {
                              const active = theme === key;

                              return (
                                <button
                                  key={key}
                                  type="button"
                                  aria-label={label}
                                  onClick={() => setTheme(key)}
                                  className={cn(
                                    'flex flex-1 items-center justify-center rounded-full px-3 py-1.5 text-xs transition',
                                    active
                                      ? 'bg-white text-black'
                                      : 'text-white/65 hover:text-white'
                                  )}
                                >
                                  <Icon className="h-3.5 w-3.5" />
                                </button>
                              );
                            })
                          : null}
                      </div>
                    </div>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuItem
                    className="cursor-pointer justify-between py-2.5 text-red-300 focus:bg-red-500/10 focus:text-red-200"
                    onClick={handleLogout}
                    disabled={loggingOut}
                  >
                    {loggingOut ? 'Signing out...' : 'Logout'}
                    <LogOut className="ml-2 h-4 w-4" />
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="relative" ref={desktopAdminPanelRef}>
              <Button
                className="border-neon-blue/60 ring-neon-blue/30 rounded-full border bg-[linear-gradient(135deg,#00d9ff,#7df9ff)] px-5 py-2.5 text-black shadow-[0_0_34px_rgba(0,217,255,0.34)] ring-1 hover:shadow-[0_0_44px_rgba(0,217,255,0.42)] hover:brightness-[1.03]"
                onClick={() => setAdminPanelOpen(current => !current)}
              >
                <span className="inline-flex h-2.5 w-2.5 rounded-full bg-black/70" />
                <Shield className="h-4 w-4" />
                <span>Admin Login</span>
                <span className="rounded-full bg-black/10 px-2 py-1 text-[10px] font-bold tracking-[0.24em] uppercase">
                  CMS
                </span>
              </Button>

              {adminPanelOpen ? (
                <div className="absolute top-[calc(100%+0.75rem)] right-0 z-50">
                  <AdminQuickLoginPanel onClose={() => setAdminPanelOpen(false)} />
                </div>
              ) : null}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          {session ? (
            <Link
              href="/admin"
              className="bg-neon-blue inline-flex items-center rounded-xl px-3 py-2 text-xs font-semibold tracking-[0.2em] text-black uppercase shadow-[0_0_22px_rgba(0,217,255,0.24)]"
            >
              Dashboard
            </Link>
          ) : (
            <button
              type="button"
              onClick={() => setAdminPanelOpen(current => !current)}
              className="border-neon-blue/50 ring-neon-blue/20 inline-flex items-center gap-2 rounded-xl border bg-[linear-gradient(135deg,#00d9ff,#7df9ff)] px-3.5 py-2.5 text-[11px] font-bold tracking-[0.24em] text-black uppercase shadow-[0_0_26px_rgba(0,217,255,0.28)] ring-1"
            >
              <span className="h-2 w-2 rounded-full bg-black/70" />
              <Shield className="h-3.5 w-3.5" />
              Admin Login
            </button>
          )}

          <button
            type="button"
            className="inline-flex items-center justify-center rounded-xl border border-white/10 p-2 text-white"
            onClick={() => setMobileOpen(current => !current)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {!session && adminPanelOpen ? (
        <div className="border-t border-white/10 bg-black/40 px-4 py-4 lg:hidden">
          <div className="mx-auto flex max-w-7xl justify-end" ref={mobileAdminPanelRef}>
            <AdminQuickLoginPanel onClose={() => setAdminPanelOpen(false)} />
          </div>
        </div>
      ) : null}

      {mobileOpen ? (
        <div className="border-t border-white/10 bg-black/95 px-4 py-4 lg:hidden">
          <div className="flex flex-col gap-2">
            {navItems.map(item => (
              <Link
                key={item.label}
                href={resolveHref(pathname, item.href)}
                className="rounded-xl px-3 py-3 text-sm text-white/75 transition hover:bg-white/5 hover:text-white"
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            {session ? (
              <>
                <Link
                  href="/admin"
                  className="bg-neon-blue mt-2 rounded-xl px-3 py-3 text-sm font-semibold tracking-[0.2em] text-black uppercase"
                  onClick={() => setMobileOpen(false)}
                >
                  Dashboard
                </Link>
                <button
                  type="button"
                  className="rounded-xl border border-red-500/30 px-3 py-3 text-left text-sm text-red-200"
                  onClick={() => {
                    setMobileOpen(false);
                    void handleLogout();
                  }}
                >
                  {loggingOut ? 'Signing out...' : 'Logout'}
                </button>
              </>
            ) : (
              <button
                type="button"
                className="bg-neon-blue mt-2 rounded-xl px-3 py-3 text-left text-sm font-semibold tracking-[0.2em] text-black uppercase"
                onClick={() => {
                  setMobileOpen(false);
                  setAdminPanelOpen(true);
                }}
              >
                Admin Login
              </button>
            )}
          </div>
        </div>
      ) : null}
    </header>
  );
}
