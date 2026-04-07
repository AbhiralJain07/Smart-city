import { NextResponse } from "next/server";

import { handleRouteError, jsonError, requireAdminApiSession } from "@/lib/cms/api";
import { createRecordId, sortTestimonials } from "@/lib/cms/content";
import { readCmsStore, mutateCmsStore } from "@/lib/cms/storage";
import {
  booleanValue,
  enumValue,
  requiredNumber,
  requiredString,
} from "@/lib/cms/validators";

const TESTIMONIAL_STATUSES = ["draft", "published", "archived"] as const;

export const runtime = "nodejs";

export async function GET() {
  const session = await requireAdminApiSession();
  if (!session) {
    return jsonError("Unauthorized.", 401);
  }

  const store = await readCmsStore();
  return NextResponse.json({ testimonials: sortTestimonials(store.testimonials) });
}

export async function POST(request: Request) {
  const session = await requireAdminApiSession();
  if (!session) {
    return jsonError("Unauthorized.", 401);
  }

  try {
    const body = (await request.json()) as Record<string, unknown>;
    const now = new Date().toISOString();

    const testimonial = await mutateCmsStore((store) => {
      const nextTestimonial = {
        id: createRecordId("testimonial"),
        name: requiredString(body["name"], "Name", 2),
        role: requiredString(body["role"], "Role", 2),
        image: requiredString(body["image"], "Image", 5),
        content: requiredString(body["content"], "Content", 20),
        rating: requiredNumber(body["rating"], "Rating", 1, 5),
        status: enumValue(body["status"], "Status", TESTIMONIAL_STATUSES),
        featured: booleanValue(body["featured"]),
        createdAt: now,
        updatedAt: now,
      };

      store.testimonials.unshift(nextTestimonial);
      return nextTestimonial;
    });

    return NextResponse.json({ success: true, testimonial }, { status: 201 });
  } catch (error) {
    return handleRouteError(error);
  }
}

