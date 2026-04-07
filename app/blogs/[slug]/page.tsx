import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getPublishedBlogBySlug } from "@/lib/cms/content";

export const dynamic = "force-dynamic";

function formatDate(value: string | null) {
  if (!value) {
    return "Draft";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

export async function generateMetadata(
  props: { params: Promise<{ slug: string }> },
): Promise<Metadata> {
  const { slug } = await props.params;
  const blog = await getPublishedBlogBySlug(slug);

  if (!blog) {
    return {
      title: "Blog Post Not Found | SmartCity AI",
    };
  }

  return {
    title: `${blog.title} | SmartCity AI`,
    description: blog.content.slice(0, 155),
  };
}

export default async function BlogDetailPage(
  props: { params: Promise<{ slug: string }> },
) {
  const { slug } = await props.params;
  const blog = await getPublishedBlogBySlug(slug);

  if (!blog) {
    notFound();
  }

  return (
    <article className="min-h-screen bg-background-primary px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/blogs"
          className="inline-flex items-center text-sm font-semibold uppercase tracking-[0.25em] text-neon-blue transition hover:text-white"
        >
          &lt; Back to blogs
        </Link>

        <div className="mt-8 overflow-hidden rounded-[2rem] border border-white/10 bg-black/30 backdrop-blur-sm">
          <div className="aspect-[16/8] overflow-hidden">
            <img
              src={blog.coverImage}
              alt={blog.title}
              className="h-full w-full object-cover"
            />
          </div>

          <div className="space-y-8 p-8 sm:p-10">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.25em] text-neon-blue">
                <span>{formatDate(blog.publishedAt)}</span>
                <span className="text-white/25">/</span>
                <span>{blog.tags.join(" / ")}</span>
              </div>
              <h1 className="font-heading text-4xl font-bold text-white sm:text-5xl">
                {blog.title}
              </h1>
            </div>

            <div className="space-y-6 text-lg leading-8 text-slate-300">
              {blog.content.split("\n\n").map((paragraph, index) => (
                <p key={`${blog.id}-${index}`}>{paragraph}</p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
