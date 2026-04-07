import { NextResponse } from "next/server";

import { handleRouteError, jsonError, requireAdminApiSession } from "@/lib/cms/api";
import { ensureUniqueSlug } from "@/lib/cms/content";
import { mutateCmsStore } from "@/lib/cms/storage";
import {
  NotFoundError,
  enumValue,
  optionalString,
  requiredString,
  requiredStringArray,
} from "@/lib/cms/validators";

const BLOG_STATUSES = ["draft", "published", "archived"] as const;

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

    const blog = await mutateCmsStore((store) => {
      const existingBlog = store.blogs.find((item) => item.id === id);
      if (!existingBlog) {
        throw new NotFoundError("Blog post not found.");
      }

      const title = requiredString(body["title"], "Title", 3);
      const status = enumValue(body["status"], "Status", BLOG_STATUSES);

      existingBlog.title = title;
      existingBlog.slug = ensureUniqueSlug(
        optionalString(body["slug"]) || title,
        store.blogs,
        existingBlog.id,
      );
      existingBlog.content = requiredString(body["content"], "Content", 40);
      existingBlog.tags = requiredStringArray(body["tags"], "Tags");
      existingBlog.coverImage = requiredString(body["coverImage"], "Cover image", 5);
      existingBlog.status = status;
      existingBlog.publishedAt =
        status === "published"
          ? existingBlog.publishedAt ?? now
          : existingBlog.publishedAt;
      existingBlog.updatedAt = now;

      return existingBlog;
    });

    return NextResponse.json({ success: true, blog });
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
      const index = store.blogs.findIndex((item) => item.id === id);
      if (index === -1) {
        throw new NotFoundError("Blog post not found.");
      }

      store.blogs.splice(index, 1);
      return true;
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return handleRouteError(error);
  }
}

