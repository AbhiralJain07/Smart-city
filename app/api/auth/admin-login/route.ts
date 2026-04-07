import { NextResponse } from "next/server";

import {
  attachAdminSessionCookie,
  createAdminSession,
  validateAdminCredentials,
} from "@/lib/cms/auth";
import { handleRouteError, jsonError } from "@/lib/cms/api";
import { requiredString } from "@/lib/cms/validators";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const email = requiredString(body["email"], "Email");
    const password = requiredString(body["password"], "Password");

    if (!validateAdminCredentials(email, password)) {
      return jsonError("Invalid admin credentials.", 401);
    }

    const session = createAdminSession(email);
    const response = NextResponse.json({ authenticated: true, session });
    attachAdminSessionCookie(response, session);
    return response;
  } catch (error) {
    return handleRouteError(error);
  }
}

