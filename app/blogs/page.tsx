import Link from "next/link";

import { getPublicContent } from "@/lib/cms/content";

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

export default async function BlogsPage() {
  const { blogs } = await getPublicContent();

  return (
    <div className="min-h-screen bg-background-primary px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.4em] text-neon-blue">
            Smart City Blog
          </p>
          <h1 className="mt-4 font-heading text-4xl font-bold text-white sm:text-5xl">
            Ideas, deployment notes, and AI operations playbooks
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-lg text-slate-400">
            Read published updates from the SmartCity AI team on operations, infrastructure, mobility, and public-sector AI delivery.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {blogs.map((blog) => (
            <article
              key={blog.id}
              className="overflow-hidden rounded-3xl border border-white/10 bg-black/30 backdrop-blur-sm"
            >
              <div className="aspect-[16/10] overflow-hidden">
                <img
                  src={blog.coverImage}
                  alt={blog.title}
                  className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
              <div className="space-y-4 p-6">
                <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.25em] text-neon-blue">
                  <span>{formatDate(blog.publishedAt)}</span>
                  <span className="text-white/25">/</span>
                  <span>{blog.tags.join(" / ")}</span>
                </div>

                <h2 className="text-2xl font-semibold text-white">{blog.title}</h2>
                <p className="text-base leading-7 text-slate-300">{blog.excerpt}</p>

                <Link
                  href={`/blogs/${blog.slug}`}
                  className="inline-flex items-center rounded-full border border-neon-blue/40 px-5 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-neon-blue transition hover:bg-neon-blue hover:text-black"
                >
                  Read article
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
