import { NextResponse } from "next/server";

import { handleRouteError, jsonError, requireAdminApiSession } from "@/lib/cms/api";
import { mutateCmsStore } from "@/lib/cms/storage";
import {
  NotFoundError,
  booleanValue,
  enumValue,
  requiredNumber,
  requiredString,
} from "@/lib/cms/validators";

const TESTIMONIAL_STATUSES = ["draft", "published", "archived"] as const;

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

    const testimonial = await mutateCmsStore((store) => {
      const existingTestimonial = store.testimonials.find((item) => item.id === id);
      if (!existingTestimonial) {
        throw new NotFoundError("Testimonial not found.");
      }

      existingTestimonial.name = requiredString(body["name"], "Name", 2);
      existingTestimonial.role = requiredString(body["role"], "Role", 2);
      existingTestimonial.image = requiredString(body["image"], "Image", 5);
      existingTestimonial.content = requiredString(body["content"], "Content", 20);
      existingTestimonial.rating = requiredNumber(body["rating"], "Rating", 1, 5);
      existingTestimonial.status = enumValue(
        body["status"],
        "Status",
        TESTIMONIAL_STATUSES,
      );
      existingTestimonial.featured = booleanValue(body["featured"]);
      existingTestimonial.updatedAt = now;

      return existingTestimonial;
    });

    return NextResponse.json({ success: true, testimonial });
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
      const index = store.testimonials.findIndex((item) => item.id === id);
      if (index === -1) {
        throw new NotFoundError("Testimonial not found.");
      }

      store.testimonials.splice(index, 1);
      return true;
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return handleRouteError(error);
  }
}

