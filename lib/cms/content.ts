import "server-only";

import { randomUUID } from "node:crypto";

import { readCmsStore } from "./storage";
import type {
  BlogPostRecord,
  CmsStore,
  DashboardStats,
  PricingPlanRecord,
  PublicBlogSummary,
  PublicContentPayload,
  TestimonialRecord,
} from "./types";

export function createRecordId(prefix: string) {
  return `${prefix}_${randomUUID()}`;
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function ensureUniqueSlug(
  value: string,
  blogs: BlogPostRecord[],
  currentId?: string,
) {
  const baseSlug = slugify(value) || "post";
  let candidate = baseSlug;
  let suffix = 1;

  while (
    blogs.some(
      (blog) => blog.slug === candidate && blog.id !== currentId,
    )
  ) {
    suffix += 1;
    candidate = `${baseSlug}-${suffix}`;
  }

  return candidate;
}

export function createExcerpt(content: string, limit = 168) {
  const plainText = content.replace(/\s+/g, " ").trim();
  if (plainText.length <= limit) {
    return plainText;
  }

  return `${plainText.slice(0, limit).trimEnd()}...`;
}

export function sortBlogs(blogs: BlogPostRecord[]) {
  return [...blogs].sort((left, right) => {
    const leftTimestamp = left.publishedAt ?? left.updatedAt;
    const rightTimestamp = right.publishedAt ?? right.updatedAt;
    return new Date(rightTimestamp).getTime() - new Date(leftTimestamp).getTime();
  });
}

export function sortTestimonials(testimonials: TestimonialRecord[]) {
  return [...testimonials].sort((left, right) => {
    if (left.featured !== right.featured) {
      return Number(right.featured) - Number(left.featured);
    }

    if (left.rating !== right.rating) {
      return right.rating - left.rating;
    }

    return new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime();
  });
}

export function sortPricingPlans(plans: PricingPlanRecord[]) {
  return [...plans].sort((left, right) => left.position - right.position);
}

export function toPublicBlogSummary(blog: BlogPostRecord): PublicBlogSummary {
  return {
    id: blog.id,
    title: blog.title,
    slug: blog.slug,
    excerpt: createExcerpt(blog.content),
    coverImage: blog.coverImage,
    tags: blog.tags,
    publishedAt: blog.publishedAt,
  };
}

export function getPublicContentFromStore(store: CmsStore): PublicContentPayload {
  return {
    updatedAt: store.updatedAt,
    testimonials: sortTestimonials(
      store.testimonials.filter((item) => item.status === "published"),
    ),
    blogs: sortBlogs(store.blogs)
      .filter((item) => item.status === "published")
      .map(toPublicBlogSummary),
    pricingPlans: sortPricingPlans(
      store.pricingPlans.filter((item) => item.status === "active"),
    ),
  };
}

export async function getPublicContent(): Promise<PublicContentPayload> {
  const store = await readCmsStore();
  return getPublicContentFromStore(store);
}

export async function getPublishedBlogBySlug(slug: string) {
  const store = await readCmsStore();
  return store.blogs.find(
    (blog) => blog.slug === slug && blog.status === "published",
  );
}

export function buildDashboardStats(store: CmsStore): DashboardStats {
  return {
    totalBlogs: store.blogs.length,
    publishedBlogs: store.blogs.filter((blog) => blog.status === "published").length,
    totalTestimonials: store.testimonials.length,
    publishedTestimonials: store.testimonials.filter(
      (item) => item.status === "published",
    ).length,
    totalPricingPlans: store.pricingPlans.length,
    activePricingPlans: store.pricingPlans.filter((item) => item.status === "active")
      .length,
    totalQueries: store.contactSubmissions.length,
    openQueries: store.contactSubmissions.filter((item) => item.status === "new")
      .length,
  };
}

export async function getAdminDashboardData() {
  const store = await readCmsStore();

  return {
    store,
    stats: buildDashboardStats(store),
  };
}
