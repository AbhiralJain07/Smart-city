import { NextResponse } from "next/server";

import { getPublicContent } from "@/lib/cms/content";

export const runtime = "nodejs";

export async function GET() {
  const content = await getPublicContent();

  return NextResponse.json(content, {
    headers: {
      "Cache-Control": "no-store, max-age=0",
    },
  });
}

