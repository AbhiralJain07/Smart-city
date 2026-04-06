'use client';

import { useDeferredValue, useEffect, useState, type FormEvent } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { FileText, Mail, MessageSquare, Pencil, Plus, Search, Trash2 } from 'lucide-react';

import { broadcastCmsUpdate } from '@/lib/cms/realtime';
import type {
  BlogPostRecord,
  CmsStore,
  ContactSubmissionRecord,
  PricingPlanRecord,
  TestimonialRecord,
} from '@/lib/cms/types';

import Badge from '../ui/Badge';
import Button from '../ui/Button';
import Card from '../ui/Card';
import BlogEditorModal from './BlogEditorModal';
import PricingEditorModal from './PricingEditorModal';
import TestimonialEditorModal from './TestimonialEditorModal';
import {
  BLOG_STATUS_OPTIONS,
  CONTACT_STATUS_OPTIONS,
  DashboardTab,
  EMPTY_BLOG_FORM,
  EMPTY_PRICING_FORM,
  EMPTY_TESTIMONIAL_FORM,
  PAGE_SIZE,
  PRICING_STATUS_OPTIONS,
  TESTIMONIAL_STATUS_OPTIONS,
  BlogFormState,
  PricingFormState,
  TestimonialFormState,
  buildStats,
  formatDate,
  getStatusVariant,
  parseResponse,
  sortBlogs,
  sortContacts,
  sortPricing,
  sortTestimonials,
} from './admin-helpers';

interface AdminDashboardProps {
  adminEmail: string;
  initialStore: CmsStore;
}

function ActionChip({
  label,
  onClick,
  disabled = false,
  tone = 'neutral',
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  tone?: 'neutral' | 'accent';
}) {
  const toneClasses =
    tone === 'accent'
      ? 'border-neon-blue/30 bg-neon-blue/10 text-neon-blue hover:border-neon-blue/50 hover:bg-neon-blue/15 hover:text-white active:bg-neon-blue/20'
      : 'border-white/10 bg-white/5 text-white/70 hover:border-white/20 hover:bg-white/10 hover:text-white active:bg-white/15';

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`focus-visible:ring-neon-blue/50 rounded-full border px-3 py-1.5 text-xs font-semibold tracking-[0.2em] uppercase transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-45 ${toneClasses}`}
    >
      {label}
    </button>
  );
}

export default function AdminDashboard({ adminEmail, initialStore }: AdminDashboardProps) {
  const router = useRouter();
  const [store, setStore] = useState(initialStore);
  const [activeTab, setActiveTab] = useState<DashboardTab>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [blogForm, setBlogForm] = useState<BlogFormState>(EMPTY_BLOG_FORM);
  const [testimonialForm, setTestimonialForm] =
    useState<TestimonialFormState>(EMPTY_TESTIMONIAL_FORM);
  const [pricingForm, setPricingForm] = useState<PricingFormState>(EMPTY_PRICING_FORM);
  const [isBlogModalOpen, setIsBlogModalOpen] = useState(false);
  const [isTestimonialModalOpen, setIsTestimonialModalOpen] = useState(false);
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);
  const [formError, setFormError] = useState('');
  const [notice, setNotice] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [pendingActionKey, setPendingActionKey] = useState<string | null>(null);
  const [blogSlugDirty, setBlogSlugDirty] = useState(false);
  const deferredSearchQuery = useDeferredValue(searchQuery.trim().toLowerCase());

  const stats = buildStats(store);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchQuery, statusFilter]);

  useEffect(() => {
    if (!notice) return;
    const timeout = window.setTimeout(() => setNotice(''), 2500);
    return () => window.clearTimeout(timeout);
  }, [notice]);

  const blogRows = sortBlogs(store.blogs).filter(blog => {
    const matchesSearch =
      blog.title.toLowerCase().includes(deferredSearchQuery) ||
      blog.slug.toLowerCase().includes(deferredSearchQuery) ||
      blog.tags.some(tag => tag.toLowerCase().includes(deferredSearchQuery));
    const matchesStatus = statusFilter === 'all' || blog.status === statusFilter;
    return matchesSearch && matchesStatus;
  });
  const testimonialRows = sortTestimonials(store.testimonials).filter(testimonial => {
    const matchesSearch =
      testimonial.name.toLowerCase().includes(deferredSearchQuery) ||
      testimonial.role.toLowerCase().includes(deferredSearchQuery) ||
      testimonial.content.toLowerCase().includes(deferredSearchQuery);
    const matchesStatus = statusFilter === 'all' || testimonial.status === statusFilter;
    return matchesSearch && matchesStatus;
  });
  const pricingRows = sortPricing(store.pricingPlans).filter(plan => {
    const matchesSearch =
      plan.name.toLowerCase().includes(deferredSearchQuery) ||
      plan.description.toLowerCase().includes(deferredSearchQuery) ||
      plan.features.some(feature => feature.toLowerCase().includes(deferredSearchQuery));
    const matchesStatus = statusFilter === 'all' || plan.status === statusFilter;
    return matchesSearch && matchesStatus;
  });
  const contactRows = sortContacts(store.contactSubmissions).filter(submission => {
    const matchesSearch =
      submission.name.toLowerCase().includes(deferredSearchQuery) ||
      submission.email.toLowerCase().includes(deferredSearchQuery) ||
      submission.organization.toLowerCase().includes(deferredSearchQuery) ||
      submission.message.toLowerCase().includes(deferredSearchQuery);
    const matchesStatus = statusFilter === 'all' || submission.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const currentRows =
    activeTab === 'blogs'
      ? blogRows
      : activeTab === 'testimonials'
        ? testimonialRows
        : activeTab === 'pricing'
          ? pricingRows
          : activeTab === 'contacts'
            ? contactRows
            : [];
  const totalPages = Math.max(1, Math.ceil(currentRows.length / PAGE_SIZE));
  const paginatedRows = currentRows.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const statusOptions =
    activeTab === 'blogs'
      ? BLOG_STATUS_OPTIONS
      : activeTab === 'testimonials'
        ? TESTIMONIAL_STATUS_OPTIONS
        : activeTab === 'pricing'
          ? PRICING_STATUS_OPTIONS
          : CONTACT_STATUS_OPTIONS;
  const showManagementControls = activeTab !== 'overview';
  const showCreateButton =
    activeTab === 'blogs' || activeTab === 'testimonials' || activeTab === 'pricing';

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [currentPage, totalPages]);

  const openBlogModal = (blog?: BlogPostRecord) => {
    setFormError('');
    if (blog) {
      setBlogForm({
        id: blog.id,
        title: blog.title,
        slug: blog.slug,
        content: blog.content,
        tags: blog.tags.join(', '),
        coverImage: blog.coverImage,
        status: blog.status,
      });
      setBlogSlugDirty(true);
    } else {
      setBlogForm(EMPTY_BLOG_FORM);
      setBlogSlugDirty(false);
    }
    setIsBlogModalOpen(true);
  };
  const openTestimonialModal = (testimonial?: TestimonialRecord) => {
    setFormError('');
    setTestimonialForm(
      testimonial
        ? {
            id: testimonial.id,
            name: testimonial.name,
            role: testimonial.role,
            image: testimonial.image,
            content: testimonial.content,
            rating: testimonial.rating,
            status: testimonial.status,
            featured: testimonial.featured,
          }
        : EMPTY_TESTIMONIAL_FORM
    );
    setIsTestimonialModalOpen(true);
  };
  const openPricingModal = (plan?: PricingPlanRecord) => {
    setFormError('');
    setPricingForm(
      plan
        ? {
            id: plan.id,
            name: plan.name,
            price: String(plan.price),
            billingCycle: plan.billingCycle,
            description: plan.description,
            features: plan.features.length > 0 ? plan.features : [''],
            highlight: plan.highlight,
            status: plan.status,
            ctaLabel: plan.ctaLabel,
            position: String(plan.position),
          }
        : EMPTY_PRICING_FORM
    );
    setIsPricingModalOpen(true);
  };
  const handleUnauthorized = (message: string) => {
    if (message.toLowerCase().includes('unauthorized')) {
      router.push('/admin/login');
      router.refresh();
    }
  };
  const syncNotice = (message: string) => {
    setNotice(message);
    broadcastCmsUpdate();
  };
  const isActionPending = (actionKey: string) => pendingActionKey === actionKey || isSaving;
  const runInlineAction = async <T,>(
    actionKey: string,
    request: () => Promise<Response>,
    onSuccess: (payload: T) => void,
    successMessage: string,
    fallbackMessage: string
  ) => {
    setPendingActionKey(actionKey);
    try {
      const response = await request();
      const payload = await parseResponse<T>(response);
      onSuccess(payload);
      syncNotice(successMessage);
    } catch (error) {
      const message = error instanceof Error ? error.message : fallbackMessage;
      handleUnauthorized(message);
      setNotice(message);
    } finally {
      setPendingActionKey(null);
    }
  };
  const saveBlog = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaving(true);
    setFormError('');
    try {
      const response = await fetch(
        blogForm.id ? `/api/admin/blogs/${blogForm.id}` : '/api/admin/blogs',
        {
          method: blogForm.id ? 'PATCH' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: blogForm.title,
            slug: blogForm.slug,
            content: blogForm.content,
            tags: blogForm.tags
              .split(',')
              .map(tag => tag.trim())
              .filter(Boolean),
            coverImage: blogForm.coverImage,
            status: blogForm.status,
          }),
        }
      );
      const payload = await parseResponse<{ blog: BlogPostRecord }>(response);
      setStore(currentStore => ({
        ...currentStore,
        blogs: blogForm.id
          ? currentStore.blogs.map(blog => (blog.id === payload.blog.id ? payload.blog : blog))
          : [payload.blog, ...currentStore.blogs],
      }));
      setIsBlogModalOpen(false);
      setBlogForm(EMPTY_BLOG_FORM);
      setBlogSlugDirty(false);
      syncNotice(blogForm.id ? 'Blog updated.' : 'Blog created.');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to save blog.';
      handleUnauthorized(message);
      setFormError(message);
    } finally {
      setIsSaving(false);
    }
  };
  const saveTestimonial = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaving(true);
    setFormError('');
    try {
      const response = await fetch(
        testimonialForm.id
          ? `/api/admin/testimonials/${testimonialForm.id}`
          : '/api/admin/testimonials',
        {
          method: testimonialForm.id ? 'PATCH' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(testimonialForm),
        }
      );
      const payload = await parseResponse<{ testimonial: TestimonialRecord }>(response);
      setStore(currentStore => ({
        ...currentStore,
        testimonials: testimonialForm.id
          ? currentStore.testimonials.map(item =>
              item.id === payload.testimonial.id ? payload.testimonial : item
            )
          : [payload.testimonial, ...currentStore.testimonials],
      }));
      setIsTestimonialModalOpen(false);
      setTestimonialForm(EMPTY_TESTIMONIAL_FORM);
      syncNotice(testimonialForm.id ? 'Testimonial updated.' : 'Testimonial created.');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to save testimonial.';
      handleUnauthorized(message);
      setFormError(message);
    } finally {
      setIsSaving(false);
    }
  };
  const savePricingPlan = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaving(true);
    setFormError('');
    try {
      const response = await fetch(
        pricingForm.id ? `/api/admin/pricing/${pricingForm.id}` : '/api/admin/pricing',
        {
          method: pricingForm.id ? 'PATCH' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...pricingForm,
            price: Number(pricingForm.price),
            position: Number(pricingForm.position),
            features: pricingForm.features.map(feature => feature.trim()).filter(Boolean),
          }),
        }
      );
      const payload = await parseResponse<{ pricingPlan: PricingPlanRecord }>(response);
      setStore(currentStore => ({
        ...currentStore,
        pricingPlans: pricingForm.id
          ? currentStore.pricingPlans.map(item =>
              item.id === payload.pricingPlan.id ? payload.pricingPlan : item
            )
          : [...currentStore.pricingPlans, payload.pricingPlan],
      }));
      setIsPricingModalOpen(false);
      setPricingForm(EMPTY_PRICING_FORM);
      syncNotice(pricingForm.id ? 'Pricing plan updated.' : 'Pricing plan created.');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to save pricing plan.';
      handleUnauthorized(message);
      setFormError(message);
    } finally {
      setIsSaving(false);
    }
  };
  const deleteItem = async (
    actionKey: string,
    url: string,
    onSuccess: () => void,
    noticeMessage: string
  ) => {
    if (!window.confirm('This action cannot be undone. Continue?')) return;
    setPendingActionKey(actionKey);
    try {
      const response = await fetch(url, { method: 'DELETE' });
      await parseResponse<{ success: boolean }>(response);
      onSuccess();
      syncNotice(noticeMessage);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to delete record.';
      handleUnauthorized(message);
      setNotice(message);
    } finally {
      setPendingActionKey(null);
    }
  };
  const toggleBlogStatus = async (blog: BlogPostRecord) => {
    const nextStatus = blog.status === 'published' ? 'draft' : 'published';
    await runInlineAction<{ blog: BlogPostRecord }>(
      `blog-status-${blog.id}`,
      () =>
        fetch(`/api/admin/blogs/${blog.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: blog.title,
            slug: blog.slug,
            content: blog.content,
            tags: blog.tags,
            coverImage: blog.coverImage,
            status: nextStatus,
          }),
        }),
      payload =>
        setStore(currentStore => ({
          ...currentStore,
          blogs: currentStore.blogs.map(item =>
            item.id === payload.blog.id ? payload.blog : item
          ),
        })),
      nextStatus === 'published' ? 'Blog published.' : 'Blog moved to draft.',
      'Unable to update blog status.'
    );
  };
  const toggleTestimonialStatus = async (testimonial: TestimonialRecord) => {
    const nextStatus = testimonial.status === 'published' ? 'draft' : 'published';
    await runInlineAction<{ testimonial: TestimonialRecord }>(
      `testimonial-status-${testimonial.id}`,
      () =>
        fetch(`/api/admin/testimonials/${testimonial.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: testimonial.name,
            role: testimonial.role,
            image: testimonial.image,
            content: testimonial.content,
            rating: testimonial.rating,
            status: nextStatus,
            featured: testimonial.featured,
          }),
        }),
      payload =>
        setStore(currentStore => ({
          ...currentStore,
          testimonials: currentStore.testimonials.map(item =>
            item.id === payload.testimonial.id ? payload.testimonial : item
          ),
        })),
      nextStatus === 'published' ? 'Testimonial published.' : 'Testimonial moved to draft.',
      'Unable to update testimonial status.'
    );
  };
  const toggleTestimonialFeatured = async (testimonial: TestimonialRecord) => {
    const nextFeatured = !testimonial.featured;
    await runInlineAction<{ testimonial: TestimonialRecord }>(
      `testimonial-feature-${testimonial.id}`,
      () =>
        fetch(`/api/admin/testimonials/${testimonial.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: testimonial.name,
            role: testimonial.role,
            image: testimonial.image,
            content: testimonial.content,
            rating: testimonial.rating,
            status: testimonial.status,
            featured: nextFeatured,
          }),
        }),
      payload =>
        setStore(currentStore => ({
          ...currentStore,
          testimonials: currentStore.testimonials.map(item =>
            item.id === payload.testimonial.id ? payload.testimonial : item
          ),
        })),
      nextFeatured ? 'Testimonial marked as featured.' : 'Testimonial removed from featured.',
      'Unable to update testimonial visibility.'
    );
  };
  const togglePricingStatus = async (plan: PricingPlanRecord) => {
    const nextStatus = plan.status === 'active' ? 'draft' : 'active';
    await runInlineAction<{ pricingPlan: PricingPlanRecord }>(
      `plan-status-${plan.id}`,
      () =>
        fetch(`/api/admin/pricing/${plan.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: plan.name,
            price: plan.price,
            billingCycle: plan.billingCycle,
            description: plan.description,
            features: plan.features,
            highlight: plan.highlight,
            status: nextStatus,
            ctaLabel: plan.ctaLabel,
            position: plan.position,
          }),
        }),
      payload =>
        setStore(currentStore => ({
          ...currentStore,
          pricingPlans: currentStore.pricingPlans.map(item =>
            item.id === payload.pricingPlan.id ? payload.pricingPlan : item
          ),
        })),
      nextStatus === 'active' ? 'Pricing plan activated.' : 'Pricing plan moved to draft.',
      'Unable to update pricing plan status.'
    );
  };
  const togglePricingHighlight = async (plan: PricingPlanRecord) => {
    const nextHighlight = !plan.highlight;
    await runInlineAction<{ pricingPlan: PricingPlanRecord }>(
      `plan-highlight-${plan.id}`,
      () =>
        fetch(`/api/admin/pricing/${plan.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: plan.name,
            price: plan.price,
            billingCycle: plan.billingCycle,
            description: plan.description,
            features: plan.features,
            highlight: nextHighlight,
            status: plan.status,
            ctaLabel: plan.ctaLabel,
            position: plan.position,
          }),
        }),
      payload =>
        setStore(currentStore => ({
          ...currentStore,
          pricingPlans: currentStore.pricingPlans.map(item =>
            item.id === payload.pricingPlan.id ? payload.pricingPlan : item
          ),
        })),
      nextHighlight ? 'Pricing plan highlighted.' : 'Pricing plan highlight removed.',
      'Unable to update pricing highlight.'
    );
  };
  const updateContactStatus = async (id: string, status: 'new' | 'resolved') => {
    await runInlineAction<{ contactSubmission: ContactSubmissionRecord }>(
      `contact-status-${id}`,
      () =>
        fetch(`/api/admin/contacts/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status }),
        }),
      payload =>
        setStore(currentStore => ({
          ...currentStore,
          contactSubmissions: currentStore.contactSubmissions.map(submission =>
            submission.id === payload.contactSubmission.id ? payload.contactSubmission : submission
          ),
        })),
      status === 'resolved' ? 'Query resolved.' : 'Query reopened.',
      'Unable to update query.'
    );
  };

  const overviewCards = [
    {
      label: 'Published blogs',
      value: stats.publishedBlogs,
      note: `${stats.totalBlogs} total entries`,
      accent: 'text-neon-blue',
    },
    {
      label: 'Live testimonials',
      value: stats.publishedTestimonials,
      note: `${store.testimonials.filter(item => item.featured).length} featured`,
      accent: 'text-neon-green',
    },
    {
      label: 'Active pricing plans',
      value: stats.activePricingPlans,
      note: `${store.pricingPlans.filter(item => item.highlight).length} highlighted`,
      accent: 'text-neon-purple',
    },
    {
      label: 'Open contact queries',
      value: stats.openQueries,
      note: `${stats.totalQueries - stats.openQueries} resolved`,
      accent: 'text-pink-400',
    },
  ];
  const tabs: Array<{ id: DashboardTab; label: string; count: number }> = [
    {
      id: 'overview',
      label: 'Overview',
      count:
        stats.totalBlogs + stats.totalTestimonials + stats.totalPricingPlans + stats.totalQueries,
    },
    { id: 'blogs', label: 'Blogs', count: stats.totalBlogs },
    { id: 'testimonials', label: 'Testimonials', count: stats.totalTestimonials },
    { id: 'pricing', label: 'Pricing', count: stats.totalPricingPlans },
    { id: 'contacts', label: 'Contact Queries', count: stats.totalQueries },
  ];
  const activeSummaryCards =
    activeTab === 'overview'
      ? [
          {
            label: 'Store version',
            value: `v${store.version}`,
            note: 'Current CMS snapshot served across the admin panel.',
          },
          {
            label: 'Last sync',
            value: formatDate(store.updatedAt),
            note: 'Most recent content update saved from the dashboard.',
          },
          {
            label: 'Needs attention',
            value: String(
              store.blogs.filter(blog => blog.status !== 'published').length +
                store.testimonials.filter(item => item.status !== 'published').length +
                store.pricingPlans.filter(plan => plan.status !== 'active').length +
                stats.openQueries
            ),
            note: 'Draft items and open contact requests waiting on review.',
          },
        ]
      : activeTab === 'blogs'
        ? [
            {
              label: 'Total blogs',
              value: String(stats.totalBlogs),
              note: `${stats.publishedBlogs} published and live on the site.`,
            },
            {
              label: 'Draft queue',
              value: String(store.blogs.filter(blog => blog.status === 'draft').length),
              note: 'Articles ready for editing before publishing.',
            },
            {
              label: 'Archived posts',
              value: String(store.blogs.filter(blog => blog.status === 'archived').length),
              note: 'Older entries kept off the public feed.',
            },
          ]
        : activeTab === 'testimonials'
          ? [
              {
                label: 'Total testimonials',
                value: String(stats.totalTestimonials),
                note: `${stats.publishedTestimonials} currently visible on the site.`,
              },
              {
                label: 'Featured proof',
                value: String(store.testimonials.filter(item => item.featured).length),
                note: 'Testimonials highlighted in the landing page section.',
              },
              {
                label: 'Draft queue',
                value: String(store.testimonials.filter(item => item.status === 'draft').length),
                note: 'Entries waiting for review or content polish.',
              },
            ]
          : activeTab === 'pricing'
            ? [
                {
                  label: 'Pricing plans',
                  value: String(stats.totalPricingPlans),
                  note: `${stats.activePricingPlans} active for visitors right now.`,
                },
                {
                  label: 'Highlighted plans',
                  value: String(store.pricingPlans.filter(plan => plan.highlight).length),
                  note: 'Plans receiving extra visual emphasis.',
                },
                {
                  label: 'Draft plans',
                  value: String(store.pricingPlans.filter(plan => plan.status === 'draft').length),
                  note: 'Offers still being prepared before launch.',
                },
              ]
            : [
                {
                  label: 'Total messages',
                  value: String(stats.totalQueries),
                  note: 'All contact form submissions stored in the CMS.',
                },
                {
                  label: 'Open inbox',
                  value: String(stats.openQueries),
                  note: 'New queries that still need a follow-up.',
                },
                {
                  label: 'Resolved',
                  value: String(
                    store.contactSubmissions.filter(item => item.status === 'resolved').length
                  ),
                  note: 'Conversations already reviewed and processed.',
                },
              ];
  const pageTitle =
    activeTab === 'overview'
      ? 'Dashboard Overview'
      : activeTab === 'blogs'
        ? 'Blog Management'
        : activeTab === 'testimonials'
          ? 'Testimonial Management'
          : activeTab === 'pricing'
            ? 'Pricing Management'
            : 'Contact Form Management';
  const pageDescription =
    activeTab === 'overview'
      ? 'Track content health, recent activity, and open customer conversations from one place.'
      : activeTab === 'blogs'
        ? 'Create, publish, and maintain SEO-friendly articles without leaving the dashboard.'
        : activeTab === 'testimonials'
          ? 'Manage customer proof, ratings, featured placement, and visibility on the landing page.'
          : activeTab === 'pricing'
            ? 'Edit plan names, prices, billing cycles, highlights, and feature lists in real time.'
            : 'Review incoming landing-page submissions, mark them resolved, or remove them.';

  return (
    <div className="bg-background-primary min-h-screen px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-black/30 p-6 backdrop-blur-sm lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3">
            <p className="text-neon-blue text-sm font-semibold tracking-[0.35em] uppercase">
              Admin Panel
            </p>
            <h1 className="font-heading text-4xl font-bold text-white sm:text-5xl">
              Control landing page content in real time
            </h1>
            <p className="max-w-3xl text-base text-white/65 sm:text-lg">
              Signed in as {adminEmail}. Manage blogs, testimonials, pricing, and contact
              submissions without leaving the existing SmartCity AI workflow.
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium tracking-[0.22em] text-white/55 uppercase">
                Store v{store.version}
              </span>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium tracking-[0.22em] text-white/55 uppercase">
                Updated {formatDate(store.updatedAt)}
              </span>
              <span className="border-neon-blue/20 bg-neon-blue/10 text-neon-blue rounded-full border px-3 py-1 text-xs font-medium tracking-[0.22em] uppercase">
                Auto-sync enabled
              </span>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" onClick={() => router.push('/')}>
              Visit landing page
            </Button>
            <Button variant="primary" onClick={() => router.push('/blogs')}>
              View public blogs
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {overviewCards.map(card => (
            <Card
              key={card.label}
              variant="glass"
              padding="md"
              className="border border-white/10"
              hover={false}
            >
              <p className="text-sm tracking-[0.25em] text-white/45 uppercase">{card.label}</p>
              <p className={`mt-3 text-4xl font-bold ${card.accent}`}>{card.value}</p>
              <p className="mt-2 text-sm text-white/45">{card.note}</p>
            </Card>
          ))}
        </div>

        <div className="flex flex-wrap gap-3 rounded-2xl border border-white/10 bg-black/20 p-3">
          {tabs.map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                setActiveTab(tab.id);
                setStatusFilter('all');
              }}
              className={`inline-flex items-center rounded-full border px-4 py-2 text-sm font-semibold transition ${
                activeTab === tab.id
                  ? 'border-cyan-200/40 bg-[linear-gradient(135deg,#00d9ff,#72f4ff)] text-slate-950 shadow-[0_0_24px_rgba(0,217,255,0.22)] hover:brightness-[1.04]'
                  : 'border-transparent bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`ml-2 inline-flex min-w-[1.75rem] items-center justify-center rounded-full px-2 py-0.5 text-[11px] ${
                  activeTab === tab.id
                    ? 'bg-black/12 text-slate-900/70'
                    : 'bg-white/10 text-white/55'
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        <div className="space-y-4 rounded-3xl border border-white/10 bg-black/30 p-6 backdrop-blur-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-white">{pageTitle}</h2>
              <p className="mt-2 text-sm text-white/60">{pageDescription}</p>
            </div>
            {showCreateButton ? (
              <Button
                variant="primary"
                onClick={() => {
                  if (activeTab === 'blogs') openBlogModal();
                  if (activeTab === 'testimonials') openTestimonialModal();
                  if (activeTab === 'pricing') openPricingModal();
                }}
              >
                <Plus />
                Add{' '}
                {activeTab === 'blogs'
                  ? 'Blog'
                  : activeTab === 'testimonials'
                    ? 'Testimonial'
                    : 'Plan'}
              </Button>
            ) : null}
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            {activeSummaryCards.map(card => (
              <div key={card.label} className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <p className="text-xs tracking-[0.24em] text-white/40 uppercase">{card.label}</p>
                <p className="mt-3 text-xl leading-snug font-semibold text-white sm:text-2xl">
                  {card.value}
                </p>
                <p className="mt-2 text-sm text-white/50">{card.note}</p>
              </div>
            ))}
          </div>

          {showManagementControls ? (
            <div className="grid grid-cols-1 gap-3 md:grid-cols-[minmax(0,1fr)_220px]">
              <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/30 px-4 py-3">
                <Search className="h-4 w-4 text-white/50" />
                <input
                  value={searchQuery}
                  onChange={event => setSearchQuery(event.target.value)}
                  placeholder={`Search ${activeTab}...`}
                  className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/35"
                />
              </label>
              <select
                value={statusFilter}
                onChange={event => setStatusFilter(event.target.value)}
                className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none"
              >
                {statusOptions.map(option => (
                  <option
                    key={option}
                    value={option}
                    className="bg-background-secondary text-white"
                  >
                    {option === 'all' ? 'All statuses' : option}
                  </option>
                ))}
              </select>
            </div>
          ) : null}

          {activeTab === 'overview' ? (
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-4">
              <Card variant="glass" className="border border-white/10" hover={false}>
                <div className="mb-4 flex items-center gap-3">
                  <FileText className="text-neon-blue h-5 w-5" />
                  <h3 className="text-lg font-semibold text-white">Recent blogs</h3>
                </div>
                <div className="space-y-4">
                  {sortBlogs(store.blogs)
                    .slice(0, 3)
                    .map(blog => (
                      <div
                        key={blog.id}
                        className="rounded-2xl border border-white/10 bg-black/20 p-4"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <p className="font-medium text-white">{blog.title}</p>
                          <Badge variant={getStatusVariant(blog.status)} size="sm">
                            {blog.status}
                          </Badge>
                        </div>
                        <p className="mt-2 text-sm text-white/50">
                          Updated {formatDate(blog.updatedAt)}
                        </p>
                      </div>
                    ))}
                </div>
              </Card>
              <Card variant="glass" className="border border-white/10" hover={false}>
                <div className="mb-4 flex items-center gap-3">
                  <MessageSquare className="text-neon-green h-5 w-5" />
                  <h3 className="text-lg font-semibold text-white">Featured testimonials</h3>
                </div>
                <div className="space-y-4">
                  {sortTestimonials(store.testimonials)
                    .filter(item => item.featured)
                    .slice(0, 3)
                    .map(testimonial => (
                      <div
                        key={testimonial.id}
                        className="rounded-2xl border border-white/10 bg-black/20 p-4"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <p className="font-medium text-white">{testimonial.name}</p>
                          <span className="text-sm text-amber-300">
                            {testimonial.rating.toFixed(1)}/5
                          </span>
                        </div>
                        <p className="mt-2 text-sm text-white/60">{testimonial.role}</p>
                      </div>
                    ))}
                </div>
              </Card>
              <Card variant="glass" className="border border-white/10" hover={false}>
                <div className="mb-4 flex items-center gap-3">
                  <Mail className="text-neon-purple h-5 w-5" />
                  <h3 className="text-lg font-semibold text-white">Open queries</h3>
                </div>
                <div className="space-y-4">
                  {sortContacts(store.contactSubmissions)
                    .filter(item => item.status === 'new')
                    .slice(0, 3)
                    .map(submission => (
                      <div
                        key={submission.id}
                        className="rounded-2xl border border-white/10 bg-black/20 p-4"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <p className="font-medium text-white">{submission.name}</p>
                          <Badge variant="warning" size="sm">
                            new
                          </Badge>
                        </div>
                        <p className="mt-2 text-sm text-white/60">
                          {submission.organization || submission.email}
                        </p>
                        <p className="mt-2 line-clamp-2 text-sm text-white/45">
                          {submission.message}
                        </p>
                      </div>
                    ))}
                </div>
              </Card>
              <Card variant="glass" className="border border-white/10" hover={false}>
                <div className="mb-4 flex items-center gap-3">
                  <Plus className="h-5 w-5 text-pink-400" />
                  <h3 className="text-lg font-semibold text-white">Quick actions</h3>
                </div>
                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={() => openBlogModal()}
                    className="hover:border-neon-blue/30 flex w-full items-center justify-between rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-left text-sm text-white/75 transition hover:bg-white/10 hover:text-white active:bg-white/15"
                  >
                    <span>Create blog post</span>
                    <span className="text-[11px] tracking-[0.22em] text-white/35 uppercase">
                      Write
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => openTestimonialModal()}
                    className="hover:border-neon-blue/30 flex w-full items-center justify-between rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-left text-sm text-white/75 transition hover:bg-white/10 hover:text-white active:bg-white/15"
                  >
                    <span>Add testimonial</span>
                    <span className="text-[11px] tracking-[0.22em] text-white/35 uppercase">
                      Social proof
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => openPricingModal()}
                    className="hover:border-neon-blue/30 flex w-full items-center justify-between rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-left text-sm text-white/75 transition hover:bg-white/10 hover:text-white active:bg-white/15"
                  >
                    <span>Update pricing</span>
                    <span className="text-[11px] tracking-[0.22em] text-white/35 uppercase">
                      Revenue
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('contacts');
                      setStatusFilter('all');
                    }}
                    className="hover:border-neon-blue/30 flex w-full items-center justify-between rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-left text-sm text-white/75 transition hover:bg-white/10 hover:text-white active:bg-white/15"
                  >
                    <span>Review inbox</span>
                    <span className="text-[11px] tracking-[0.22em] text-white/35 uppercase">
                      Support
                    </span>
                  </button>
                </div>
              </Card>
            </div>
          ) : null}

          {activeTab === 'blogs' ? (
            <div className="overflow-x-auto rounded-2xl border border-white/10">
              <table className="min-w-full divide-y divide-white/10">
                <thead className="bg-black/30 text-left text-xs tracking-[0.25em] text-white/45 uppercase">
                  <tr>
                    <th className="px-4 py-3">Title</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Tags</th>
                    <th className="px-4 py-3">Updated</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-sm text-white/80">
                  {paginatedRows.map(row => {
                    const blog = row as BlogPostRecord;
                    const statusActionKey = `blog-status-${blog.id}`;
                    const deleteActionKey = `blog-delete-${blog.id}`;
                    return (
                      <tr key={blog.id}>
                        <td className="px-4 py-4 align-top">
                          <p className="font-medium text-white">{blog.title}</p>
                          <p className="mt-1 text-xs text-white/45">/{blog.slug}</p>
                        </td>
                        <td className="px-4 py-4 align-top">
                          <Badge variant={getStatusVariant(blog.status)} size="sm">
                            {blog.status}
                          </Badge>
                        </td>
                        <td className="px-4 py-4 align-top text-white/55">
                          {blog.tags.join(', ')}
                        </td>
                        <td className="px-4 py-4 align-top text-white/55">
                          {formatDate(blog.updatedAt)}
                        </td>
                        <td className="px-4 py-4 align-top">
                          <div className="flex flex-wrap justify-end gap-2">
                            <ActionChip
                              label={blog.status === 'published' ? 'Unpublish' : 'Publish'}
                              onClick={() => void toggleBlogStatus(blog)}
                              disabled={isActionPending(statusActionKey)}
                              tone="accent"
                            />
                            <button
                              type="button"
                              className="hover:border-neon-blue/40 hover:text-neon-blue rounded-full border border-white/10 bg-white/5 p-2 text-white/70 transition hover:bg-white/10 active:bg-white/15 disabled:cursor-not-allowed disabled:opacity-40"
                              onClick={() => openBlogModal(blog)}
                              disabled={
                                isActionPending(statusActionKey) || isActionPending(deleteActionKey)
                              }
                            >
                              <Pencil className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              className="rounded-full border border-red-500/20 bg-red-500/10 p-2 text-red-300 transition hover:border-red-500/40 hover:bg-red-500/15 hover:text-red-200 active:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-40"
                              onClick={() =>
                                void deleteItem(
                                  deleteActionKey,
                                  `/api/admin/blogs/${blog.id}`,
                                  () =>
                                    setStore(currentStore => ({
                                      ...currentStore,
                                      blogs: currentStore.blogs.filter(item => item.id !== blog.id),
                                    })),
                                  'Blog deleted.'
                                )
                              }
                              disabled={isActionPending(deleteActionKey)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : null}
          {activeTab === 'testimonials' ? (
            <div className="overflow-x-auto rounded-2xl border border-white/10">
              <table className="min-w-full divide-y divide-white/10">
                <thead className="bg-black/30 text-left text-xs tracking-[0.25em] text-white/45 uppercase">
                  <tr>
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Role</th>
                    <th className="px-4 py-3">Rating</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-sm text-white/80">
                  {paginatedRows.map(row => {
                    const testimonial = row as TestimonialRecord;
                    const featureActionKey = `testimonial-feature-${testimonial.id}`;
                    const statusActionKey = `testimonial-status-${testimonial.id}`;
                    const deleteActionKey = `testimonial-delete-${testimonial.id}`;
                    return (
                      <tr key={testimonial.id}>
                        <td className="px-4 py-4 align-top">
                          <div className="flex items-center gap-3">
                            <img
                              src={testimonial.image}
                              alt={testimonial.name}
                              className="h-10 w-10 rounded-full object-cover"
                            />
                            <div>
                              <p className="font-medium text-white">{testimonial.name}</p>
                              {testimonial.featured ? (
                                <p className="text-neon-blue text-xs tracking-[0.2em] uppercase">
                                  Featured
                                </p>
                              ) : null}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 align-top text-white/55">{testimonial.role}</td>
                        <td className="px-4 py-4 align-top text-amber-300">
                          {testimonial.rating.toFixed(1)}/5
                        </td>
                        <td className="px-4 py-4 align-top">
                          <Badge variant={getStatusVariant(testimonial.status)} size="sm">
                            {testimonial.status}
                          </Badge>
                        </td>
                        <td className="px-4 py-4 align-top">
                          <div className="flex flex-wrap justify-end gap-2">
                            <ActionChip
                              label={testimonial.featured ? 'Unfeature' : 'Feature'}
                              onClick={() => void toggleTestimonialFeatured(testimonial)}
                              disabled={isActionPending(featureActionKey)}
                            />
                            <ActionChip
                              label={testimonial.status === 'published' ? 'Unpublish' : 'Publish'}
                              onClick={() => void toggleTestimonialStatus(testimonial)}
                              disabled={isActionPending(statusActionKey)}
                              tone="accent"
                            />
                            <button
                              type="button"
                              className="hover:border-neon-blue/40 hover:text-neon-blue rounded-full border border-white/10 bg-white/5 p-2 text-white/70 transition hover:bg-white/10 active:bg-white/15 disabled:cursor-not-allowed disabled:opacity-40"
                              onClick={() => openTestimonialModal(testimonial)}
                              disabled={
                                isActionPending(featureActionKey) ||
                                isActionPending(statusActionKey) ||
                                isActionPending(deleteActionKey)
                              }
                            >
                              <Pencil className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              className="rounded-full border border-red-500/20 bg-red-500/10 p-2 text-red-300 transition hover:border-red-500/40 hover:bg-red-500/15 hover:text-red-200 active:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-40"
                              onClick={() =>
                                void deleteItem(
                                  deleteActionKey,
                                  `/api/admin/testimonials/${testimonial.id}`,
                                  () =>
                                    setStore(currentStore => ({
                                      ...currentStore,
                                      testimonials: currentStore.testimonials.filter(
                                        item => item.id !== testimonial.id
                                      ),
                                    })),
                                  'Testimonial deleted.'
                                )
                              }
                              disabled={isActionPending(deleteActionKey)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : null}

          {activeTab === 'pricing' ? (
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              {paginatedRows.map(row => {
                const plan = row as PricingPlanRecord;
                const statusActionKey = `plan-status-${plan.id}`;
                const highlightActionKey = `plan-highlight-${plan.id}`;
                const deleteActionKey = `plan-delete-${plan.id}`;
                return (
                  <Card
                    key={plan.id}
                    variant="glass"
                    className="border border-white/10"
                    hover={false}
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <div className="flex items-center gap-3">
                          <h3 className="text-xl font-semibold text-white">{plan.name}</h3>
                          <Badge variant={getStatusVariant(plan.status)} size="sm">
                            {plan.status}
                          </Badge>
                        </div>
                        <p className="mt-2 text-sm text-white/60">{plan.description}</p>
                        <p className="text-neon-blue mt-3 text-2xl font-bold">
                          ${plan.price}/{plan.billingCycle}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          className="hover:border-neon-blue/40 hover:text-neon-blue rounded-full border border-white/10 bg-white/5 p-2 text-white/70 transition hover:bg-white/10 active:bg-white/15 disabled:cursor-not-allowed disabled:opacity-40"
                          onClick={() => openPricingModal(plan)}
                          disabled={
                            isActionPending(statusActionKey) ||
                            isActionPending(highlightActionKey) ||
                            isActionPending(deleteActionKey)
                          }
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          className="rounded-full border border-red-500/20 bg-red-500/10 p-2 text-red-300 transition hover:border-red-500/40 hover:bg-red-500/15 hover:text-red-200 active:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-40"
                          onClick={() =>
                            void deleteItem(
                              deleteActionKey,
                              `/api/admin/pricing/${plan.id}`,
                              () =>
                                setStore(currentStore => ({
                                  ...currentStore,
                                  pricingPlans: currentStore.pricingPlans.filter(
                                    item => item.id !== plan.id
                                  ),
                                })),
                              'Pricing plan deleted.'
                            )
                          }
                          disabled={isActionPending(deleteActionKey)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    <div className="mt-5 flex flex-wrap gap-2">
                      <ActionChip
                        label={plan.status === 'active' ? 'Move to draft' : 'Activate'}
                        onClick={() => void togglePricingStatus(plan)}
                        disabled={isActionPending(statusActionKey)}
                        tone="accent"
                      />
                      <ActionChip
                        label={plan.highlight ? 'Remove highlight' : 'Highlight plan'}
                        onClick={() => void togglePricingHighlight(plan)}
                        disabled={isActionPending(highlightActionKey)}
                      />
                    </div>
                    <ul className="mt-5 space-y-2 text-sm text-white/70">
                      {plan.features.map(feature => (
                        <li key={`${plan.id}-${feature}`} className="flex items-start gap-3">
                          <span className="bg-neon-blue mt-2 h-1.5 w-1.5 rounded-full" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </Card>
                );
              })}
            </div>
          ) : null}

          {activeTab === 'contacts' ? (
            <div className="space-y-4">
              {paginatedRows.map(row => {
                const submission = row as ContactSubmissionRecord;
                const statusActionKey = `contact-status-${submission.id}`;
                const deleteActionKey = `contact-delete-${submission.id}`;
                return (
                  <Card
                    key={submission.id}
                    variant="glass"
                    className="border border-white/10"
                    hover={false}
                  >
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div className="space-y-3">
                        <div className="flex flex-wrap items-center gap-3">
                          <h3 className="text-lg font-semibold text-white">{submission.name}</h3>
                          <Badge variant={getStatusVariant(submission.status)} size="sm">
                            {submission.status}
                          </Badge>
                        </div>
                        <div className="text-sm text-white/60">
                          {submission.email}
                          {submission.organization ? ` / ${submission.organization}` : ''}
                        </div>
                        <p className="max-w-3xl text-sm leading-7 text-white/75">
                          {submission.message}
                        </p>
                        <p className="text-xs tracking-[0.2em] text-white/35 uppercase">
                          Received {formatDate(submission.createdAt)}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <ActionChip
                          label={submission.status === 'resolved' ? 'Mark new' : 'Resolve'}
                          onClick={() =>
                            void updateContactStatus(
                              submission.id,
                              submission.status === 'resolved' ? 'new' : 'resolved'
                            )
                          }
                          disabled={isActionPending(statusActionKey)}
                          tone="accent"
                        />
                        <button
                          type="button"
                          className="rounded-full border border-red-500/20 bg-red-500/10 px-4 py-2 text-sm text-red-300 transition hover:border-red-500/40 hover:bg-red-500/15 hover:text-red-200 active:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-40"
                          onClick={() =>
                            void deleteItem(
                              deleteActionKey,
                              `/api/admin/contacts/${submission.id}`,
                              () =>
                                setStore(currentStore => ({
                                  ...currentStore,
                                  contactSubmissions: currentStore.contactSubmissions.filter(
                                    item => item.id !== submission.id
                                  ),
                                })),
                              'Contact query deleted.'
                            )
                          }
                          disabled={isActionPending(deleteActionKey)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          ) : null}

          {showManagementControls && currentRows.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-white/10 px-6 py-14 text-center text-white/45">
              No records match the current search and filter.
            </div>
          ) : null}
          {showManagementControls && currentRows.length > PAGE_SIZE ? (
            <div className="flex items-center justify-between gap-3 border-t border-white/10 pt-4 text-sm text-white/55">
              <span>
                Page {currentPage} of {totalPages}
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(page => Math.max(1, page - 1))}
                  className="rounded-full border border-white/10 bg-white/5 px-4 py-2 transition hover:bg-white/10 active:bg-white/15 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Previous
                </button>
                <button
                  type="button"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(page => Math.min(totalPages, page + 1))}
                  className="rounded-full border border-white/10 bg-white/5 px-4 py-2 transition hover:bg-white/10 active:bg-white/15 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
      <BlogEditorModal
        form={blogForm}
        formError={formError}
        isOpen={isBlogModalOpen}
        isSaving={isSaving}
        slugDirty={blogSlugDirty}
        onClose={() => setIsBlogModalOpen(false)}
        onSetSlugDirty={setBlogSlugDirty}
        onSubmit={saveBlog}
        onChange={setBlogForm}
      />
      <TestimonialEditorModal
        form={testimonialForm}
        formError={formError}
        isOpen={isTestimonialModalOpen}
        isSaving={isSaving}
        onClose={() => setIsTestimonialModalOpen(false)}
        onSubmit={saveTestimonial}
        onChange={setTestimonialForm}
      />
      <PricingEditorModal
        form={pricingForm}
        formError={formError}
        isOpen={isPricingModalOpen}
        isSaving={isSaving}
        onClose={() => setIsPricingModalOpen(false)}
        onSubmit={savePricingPlan}
        onChange={setPricingForm}
      />

      <AnimatePresence>
        {notice ? (
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 18 }}
            className="border-neon-blue/30 fixed right-6 bottom-6 z-50 rounded-2xl border bg-black/85 px-5 py-3 text-sm text-white shadow-[0_0_24px_rgba(0,217,255,0.18)]"
          >
            {notice}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
