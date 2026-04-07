import { NextResponse } from "next/server";

import { handleRouteError, jsonError, requireAdminApiSession } from "@/lib/cms/api";
import { mutateCmsStore } from "@/lib/cms/storage";
import { NotFoundError, enumValue } from "@/lib/cms/validators";

const CONTACT_STATUSES = ["new", "resolved"] as const;

export const runtime = "nodejs";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const session = await requireAdminApiSession();
  if (!session) {
    return jsonError("Unauthorized.", 401);
  }

  try {
    const { id } = await context.params;
    const body = (await request.json()) as Record<string, unknown>;
    const now = new Date().toISOString();

    const contactSubmission = await mutateCmsStore((store) => {
      const submission = store.contactSubmissions.find((item) => item.id === id);
      if (!submission) {
        throw new NotFoundError("Contact submission not found.");
      }

      submission.status = enumValue(body["status"], "Status", CONTACT_STATUSES);
      submission.updatedAt = now;
      return submission;
    });

    return NextResponse.json({ success: true, contactSubmission });
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const session = await requireAdminApiSession();
  if (!session) {
    return jsonError("Unauthorized.", 401);
  }

  try {
    const { id } = await context.params;

    await mutateCmsStore((store) => {
      const index = store.contactSubmissions.findIndex((item) => item.id === id);
      if (index === -1) {
        throw new NotFoundError("Contact submission not found.");
      }

      store.contactSubmissions.splice(index, 1);
      return true;
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return handleRouteError(error);
  }
}

