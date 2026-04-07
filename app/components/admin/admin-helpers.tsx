"use client";

import type { ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";

import type {
  BlogPostRecord,
  CmsStore,
  ContactSubmissionRecord,
  ContentStatus,
  PricingPlanRecord,
  PricingStatus,
  TestimonialRecord,
} from "@/lib/cms/types";

export type DashboardTab = "overview" | "blogs" | "testimonials" | "pricing" | "contacts";

export interface BlogFormState {
  id: string | null;
  title: string;
  slug: string;
  content: string;
  tags: string;
  coverImage: string;
  status: ContentStatus;
}

export interface TestimonialFormState {
  id: string | null;
  name: string;
  role: string;
  image: string;
  content: string;
  rating: number;
  status: ContentStatus;
  featured: boolean;
}

export interface PricingFormState {
  id: string | null;
  name: string;
  price: string;
  billingCycle: string;
  description: string;
  features: string[];
  highlight: boolean;
  status: PricingStatus;
  ctaLabel: string;
  position: string;
}

export const PAGE_SIZE = 5;
export const BLOG_STATUS_OPTIONS = ["all", "draft", "published", "archived"] as const;
export const TESTIMONIAL_STATUS_OPTIONS = ["all", "draft", "published", "archived"] as const;
export const PRICING_STATUS_OPTIONS = ["all", "active", "draft", "archived"] as const;
export const CONTACT_STATUS_OPTIONS = ["all", "new", "resolved"] as const;

export const EMPTY_BLOG_FORM: BlogFormState = {
  id: null,
  title: "",
  slug: "",
  content: "",
  tags: "",
  coverImage: "",
  status: "draft",
};

export const EMPTY_TESTIMONIAL_FORM: TestimonialFormState = {
  id: null,
  name: "",
  role: "",
  image: "",
  content: "",
  rating: 5,
  status: "draft",
  featured: false,
};

export const EMPTY_PRICING_FORM: PricingFormState = {
  id: null,
  name: "",
  price: "499",
  billingCycle: "month",
  description: "",
  features: [""],
  highlight: false,
  status: "active",
  ctaLabel: "Get Started",
  position: "1",
};

export function slugifyInput(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

export function buildStats(store: CmsStore) {
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

    return new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime();
  });
}

export function sortPricing(pricingPlans: PricingPlanRecord[]) {
  return [...pricingPlans].sort((left, right) => left.position - right.position);
}

export function sortContacts(contactSubmissions: ContactSubmissionRecord[]) {
  return [...contactSubmissions].sort(
    (left, right) =>
      new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime(),
  );
}

export function getStatusVariant(status: string) {
  if (status === "published" || status === "active" || status === "resolved") {
    return "success" as const;
  }

  if (status === "draft" || status === "new") {
    return "warning" as const;
  }

  return "secondary" as const;
}

export function SectionModal({
  isOpen,
  title,
  description,
  onClose,
  children,
}: {
  isOpen: boolean;
  title: string;
  description: string;
  onClose: () => void;
  children: ReactNode;
}) {
  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 px-4 backdrop-blur-md"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            className="max-h-[85vh] w-full max-w-3xl overflow-y-auto rounded-3xl border border-white/10 bg-background-secondary p-6"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <h3 className="text-2xl font-semibold text-white">{title}</h3>
                <p className="mt-2 text-sm text-white/60">{description}</p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-full border border-white/10 px-3 py-1 text-sm text-white/65 transition hover:border-white/20 hover:text-white"
              >
                Close
              </button>
            </div>
            {children}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

export async function parseResponse<T>(response: Response): Promise<T> {
  const payload = (await response.json()) as T & { error?: string };

  if (!response.ok) {
    throw new Error(payload.error ?? "Request failed.");
  }

  return payload;
}
