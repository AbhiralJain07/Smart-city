import { NextResponse } from "next/server";

import { getAdminSession } from "@/lib/cms/auth";

export const runtime = "nodejs";

export async function GET() {
  const session = await getAdminSession();
  return NextResponse.json({ authenticated: Boolean(session), session });
}

