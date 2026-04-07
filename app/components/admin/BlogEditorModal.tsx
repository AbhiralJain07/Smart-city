"use client";

import type { FormEvent } from "react";
import type { ContentStatus } from "@/lib/cms/types";

import Button from "../ui/Button";
import { BlogFormState, SectionModal, slugifyInput } from "./admin-helpers";

interface BlogEditorModalProps {
  form: BlogFormState;
  formError: string;
  isOpen: boolean;
  isSaving: boolean;
  slugDirty: boolean;
  onClose: () => void;
  onSetSlugDirty: (value: boolean) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onChange: (form: BlogFormState) => void;
}

export default function BlogEditorModal({ form, formError, isOpen, isSaving, slugDirty, onClose, onSetSlugDirty, onSubmit, onChange }: BlogEditorModalProps) {
  return (
    <SectionModal isOpen={isOpen} title={form.id ? "Edit blog post" : "Create blog post"} description="Manage the title, slug, cover image, tags, and publication state for public blog content." onClose={onClose}>
      <form className="space-y-5" onSubmit={onSubmit}>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <label className="space-y-2 text-sm text-white/70"><span>Title</span><input value={form.title} onChange={(event) => { const title = event.target.value; onChange({ ...form, title, slug: slugDirty ? form.slug : slugifyInput(title) }); }} className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none" placeholder="Future of Urban Operations" /></label>
          <label className="space-y-2 text-sm text-white/70"><span>Slug</span><input value={form.slug} onChange={(event) => { onSetSlugDirty(true); onChange({ ...form, slug: slugifyInput(event.target.value) }); }} className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none" placeholder="future-of-urban-operations" /></label>
        </div>
        <label className="space-y-2 text-sm text-white/70"><span>Cover image URL</span><input value={form.coverImage} onChange={(event) => onChange({ ...form, coverImage: event.target.value })} className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none" placeholder="https://images.unsplash.com/..." /></label>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-[minmax(0,1fr)_220px]">
          <label className="space-y-2 text-sm text-white/70"><span>Tags</span><input value={form.tags} onChange={(event) => onChange({ ...form, tags: event.target.value })} className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none" placeholder="AI, Operations, Mobility" /></label>
          <label className="space-y-2 text-sm text-white/70"><span>Status</span><select value={form.status} onChange={(event) => onChange({ ...form, status: event.target.value as ContentStatus })} className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none"><option value="draft">Draft</option><option value="published">Published</option><option value="archived">Archived</option></select></label>
        </div>
        <label className="space-y-2 text-sm text-white/70"><span>Content</span><textarea value={form.content} onChange={(event) => onChange({ ...form, content: event.target.value })} rows={10} className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none" placeholder="Write the blog content here..." /></label>
        {formError ? <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">{formError}</div> : null}
        <div className="flex justify-end gap-3"><Button variant="outline" onClick={onClose} type="button">Cancel</Button><Button type="submit" disabled={isSaving}>{isSaving ? "Saving..." : form.id ? "Update blog" : "Create blog"}</Button></div>
      </form>
    </SectionModal>
  );
}
