import 'server-only';

import { createHmac, timingSafeEqual } from 'node:crypto';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import type { NextResponse } from 'next/server';

import { DEFAULT_ADMIN_EMAIL, DEFAULT_ADMIN_PASSWORD } from './default-admin-credentials';
import type { AdminSession } from './types';

const SESSION_COOKIE_NAME = 'smartcity_admin_session';
const SESSION_DURATION_MS = 1000 * 60 * 60 * 12;

function getAuthConfig() {
  return {
    email: process.env['ADMIN_EMAIL'] ?? DEFAULT_ADMIN_EMAIL,
    password: process.env['ADMIN_PASSWORD'] ?? DEFAULT_ADMIN_PASSWORD,
    secret: process.env['ADMIN_SESSION_SECRET'] ?? 'smart-city-command-center-admin-secret',
  };
}

function signPayload(payload: string) {
  return createHmac('sha256', getAuthConfig().secret).update(payload).digest('base64url');
}

function serializeSession(session: AdminSession) {
  const payload = Buffer.from(JSON.stringify(session)).toString('base64url');
  const signature = signPayload(payload);
  return `${payload}.${signature}`;
}

function safeCompare(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return timingSafeEqual(leftBuffer, rightBuffer);
}

export function validateAdminCredentials(email: string, password: string) {
  const config = getAuthConfig();
  return email === config.email && password === config.password;
}

export function parseAdminSession(token?: string | null): AdminSession | null {
  if (!token) {
    return null;
  }

  const [payload, signature] = token.split('.');
  if (!payload || !signature) {
    return null;
  }

  const expectedSignature = signPayload(payload);
  if (!safeCompare(signature, expectedSignature)) {
    return null;
  }

  try {
    const session = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as AdminSession;

    if (new Date(session.expiresAt).getTime() <= Date.now()) {
      return null;
    }

    return session;
  } catch {
    return null;
  }
}

export function createAdminSession(email: string): AdminSession {
  return {
    email,
    role: 'admin',
    expiresAt: new Date(Date.now() + SESSION_DURATION_MS).toISOString(),
  };
}

export async function getAdminSession() {
  const cookieStore = await cookies();
  return parseAdminSession(cookieStore.get(SESSION_COOKIE_NAME)?.value);
}

export async function requireAdminSession() {
  const session = await getAdminSession();

  if (!session) {
    redirect('/admin/login');
  }

  return session;
}

export function attachAdminSessionCookie(response: NextResponse, session: AdminSession) {
  response.cookies.set({
    name: SESSION_COOKIE_NAME,
    value: serializeSession(session),
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env['NODE_ENV'] === 'production',
    path: '/',
    expires: new Date(session.expiresAt),
  });
}

export function clearAdminSessionCookie(response: NextResponse) {
  response.cookies.set({
    name: SESSION_COOKIE_NAME,
    value: '',
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env['NODE_ENV'] === 'production',
    path: '/',
    expires: new Date(0),
  });
}
