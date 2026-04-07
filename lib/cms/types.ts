export type UserRole = "admin" | "viewer";

export type ContentStatus = "draft" | "published" | "archived";
export type PricingStatus = "active" | "draft" | "archived";
export type ContactStatus = "new" | "resolved";

export interface TimestampedRecord {
  createdAt: string;
  updatedAt: string;
}

export interface TestimonialRecord extends TimestampedRecord {
  id: string;
  name: string;
  role: string;
  image: string;
  content: string;
  rating: number;
  status: ContentStatus;
  featured: boolean;
}

export interface BlogPostRecord extends TimestampedRecord {
  id: string;
  title: string;
  slug: string;
  content: string;
  tags: string[];
  coverImage: string;
  status: ContentStatus;
  publishedAt: string | null;
}

export interface PricingPlanRecord extends TimestampedRecord {
  id: string;
  name: string;
  price: number;
  billingCycle: string;
  description: string;
  features: string[];
  highlight: boolean;
  status: PricingStatus;
  ctaLabel: string;
  position: number;
}

export interface ContactSubmissionRecord extends TimestampedRecord {
  id: string;
  name: string;
  email: string;
  organization: string;
  message: string;
  status: ContactStatus;
}

export interface CmsStore {
  version: number;
  updatedAt: string;
  testimonials: TestimonialRecord[];
  blogs: BlogPostRecord[];
  pricingPlans: PricingPlanRecord[];
  contactSubmissions: ContactSubmissionRecord[];
}

export interface AdminSession {
  email: string;
  role: "admin";
  expiresAt: string;
}

export interface PublicBlogSummary {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImage: string;
  tags: string[];
  publishedAt: string | null;
}

export interface PublicContentPayload {
  updatedAt: string;
  testimonials: TestimonialRecord[];
  blogs: PublicBlogSummary[];
  pricingPlans: PricingPlanRecord[];
}

export interface DashboardStats {
  totalBlogs: number;
  publishedBlogs: number;
  totalTestimonials: number;
  publishedTestimonials: number;
  totalPricingPlans: number;
  activePricingPlans: number;
  totalQueries: number;
  openQueries: number;
}
