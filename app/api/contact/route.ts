import { NextResponse } from "next/server";

import { createRecordId } from "@/lib/cms/content";
import { mutateCmsStore } from "@/lib/cms/storage";
import { handleRouteError } from "@/lib/cms/api";
import { optionalString, requiredString } from "@/lib/cms/validators";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const now = new Date().toISOString();

    const submission = await mutateCmsStore((store) => {
      const nextSubmission = {
        id: createRecordId("contact"),
        name: requiredString(body["name"], "Name", 2),
        email: requiredString(body["email"], "Email", 5),
        organization: optionalString(body["organization"]),
        message: requiredString(body["message"], "Message", 10),
        status: "new" as const,
        createdAt: now,
        updatedAt: now,
      };

      store.contactSubmissions.unshift(nextSubmission);
      return nextSubmission;
    });

    return NextResponse.json({ success: true, submission }, { status: 201 });
  } catch (error) {
    return handleRouteError(error);
  }
}

