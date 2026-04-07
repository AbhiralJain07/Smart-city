import { NextResponse } from "next/server";

import { handleRouteError, jsonError, requireAdminApiSession } from "@/lib/cms/api";
import { createRecordId, ensureUniqueSlug, sortBlogs } from "@/lib/cms/content";
import { readCmsStore, mutateCmsStore } from "@/lib/cms/storage";
import {
  enumValue,
  optionalString,
  requiredString,
  requiredStringArray,
} from "@/lib/cms/validators";

const BLOG_STATUSES = ["draft", "published", "archived"] as const;

export const runtime = "nodejs";

export async function GET() {
  const session = await requireAdminApiSession();
  if (!session) {
    return jsonError("Unauthorized.", 401);
  }

  const store = await readCmsStore();
  return NextResponse.json({ blogs: sortBlogs(store.blogs) });
}

export async function POST(request: Request) {
  const session = await requireAdminApiSession();
  if (!session) {
    return jsonError("Unauthorized.", 401);
  }

  try {
    const body = (await request.json()) as Record<string, unknown>;
    const now = new Date().toISOString();

    const blog = await mutateCmsStore((store) => {
      const title = requiredString(body["title"], "Title", 3);
      const status = enumValue(body["status"], "Status", BLOG_STATUSES);
      const nextBlog = {
        id: createRecordId("blog"),
        title,
        slug: ensureUniqueSlug(optionalString(body["slug"]) || title, store.blogs),
        content: requiredString(body["content"], "Content", 40),
        tags: requiredStringArray(body["tags"], "Tags"),
        coverImage: requiredString(body["coverImage"], "Cover image", 5),
        status,
        publishedAt: status === "published" ? now : null,
        createdAt: now,
        updatedAt: now,
      };

      store.blogs.unshift(nextBlog);
      return nextBlog;
    });

    return NextResponse.json({ success: true, blog }, { status: 201 });
  } catch (error) {
    return handleRouteError(error);
  }
}

