"use client";

import Link from "next/link";
import { motion } from "framer-motion";

import type { PublicBlogSummary } from "@/lib/cms/types";
import Badge from "../ui/Badge";

interface BlogSectionProps {
  blogs: PublicBlogSummary[];
}

function formatDate(value: string | null) {
  if (!value) {
    return "Draft";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

export default function BlogSection({ blogs }: BlogSectionProps) {
  if (blogs.length === 0) {
    return null;
  }

  return (
    <section id="blogs" className="scroll-mt-20 py-24 bg-background-secondary">
      <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.2 }}
          className="mb-12 flex flex-col gap-4 text-center"
        >
          <div className="flex justify-center">
            <Badge variant="secondary">Latest Insights</Badge>
          </div>
          <h2 className="font-heading text-3xl font-bold text-white sm:text-4xl">
            Stories from the Smart City Control Layer
          </h2>
          <p className="mx-auto max-w-3xl text-base text-gray-300 sm:text-lg">
            Fresh operational notes, deployment lessons, and city-scale AI playbooks published directly from the command center.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {blogs.slice(0, 3).map((blog, index) => (
            <motion.article
              key={blog.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
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
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="primary" size="sm">
                    {formatDate(blog.publishedAt)}
                  </Badge>
                  {blog.tags.slice(0, 2).map((tag) => (
                    <Badge key={tag} variant="secondary" size="sm">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div className="space-y-3">
                  <h3 className="text-xl font-semibold text-white">{blog.title}</h3>
                  <p className="text-sm leading-6 text-gray-300">{blog.excerpt}</p>
                </div>

                <Link
                  href={`/blogs/${blog.slug}`}
                  className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-neon-blue transition-colors hover:text-white"
                >
                  Read article
                  <span aria-hidden="true">-&gt;</span>
                </Link>
              </div>
            </motion.article>
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <Link
            href="/blogs"
            className="inline-flex items-center rounded-full border border-neon-blue/40 px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-neon-blue transition hover:bg-neon-blue hover:text-black"
          >
            Explore all articles
          </Link>
        </div>
      </div>
    </section>
  );
}
