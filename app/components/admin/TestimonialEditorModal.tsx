"use client";

import type { FormEvent } from "react";
import type { ContentStatus } from "@/lib/cms/types";

import Button from "../ui/Button";
import { SectionModal, TestimonialFormState } from "./admin-helpers";

interface TestimonialEditorModalProps {
  form: TestimonialFormState;
  formError: string;
  isOpen: boolean;
  isSaving: boolean;
  onClose: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onChange: (form: TestimonialFormState) => void;
}

export default function TestimonialEditorModal({ form, formError, isOpen, isSaving, onClose, onSubmit, onChange }: TestimonialEditorModalProps) {
  return (
    <SectionModal isOpen={isOpen} title={form.id ? "Edit testimonial" : "Create testimonial"} description="Control public proof points, reviewer details, status, and featured visibility." onClose={onClose}>
      <form className="space-y-5" onSubmit={onSubmit}>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <label className="space-y-2 text-sm text-white/70"><span>Name</span><input value={form.name} onChange={(event) => onChange({ ...form, name: event.target.value })} className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none" placeholder="Jane Doe" /></label>
          <label className="space-y-2 text-sm text-white/70"><span>Role</span><input value={form.role} onChange={(event) => onChange({ ...form, role: event.target.value })} className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none" placeholder="Operations Director" /></label>
        </div>
        <label className="space-y-2 text-sm text-white/70"><span>Image URL</span><input value={form.image} onChange={(event) => onChange({ ...form, image: event.target.value })} className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none" placeholder="https://images.unsplash.com/..." /></label>
        <label className="space-y-2 text-sm text-white/70"><span>Content</span><textarea value={form.content} onChange={(event) => onChange({ ...form, content: event.target.value })} rows={6} className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none" placeholder="Describe the customer experience..." /></label>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <label className="space-y-2 text-sm text-white/70"><span>Rating</span><input type="number" min="1" max="5" step="0.1" value={form.rating} onChange={(event) => onChange({ ...form, rating: Number(event.target.value) })} className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none" /></label>
          <label className="space-y-2 text-sm text-white/70"><span>Status</span><select value={form.status} onChange={(event) => onChange({ ...form, status: event.target.value as ContentStatus })} className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none"><option value="draft">Draft</option><option value="published">Published</option><option value="archived">Archived</option></select></label>
          <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white/70 md:mt-7"><input type="checkbox" checked={form.featured} onChange={(event) => onChange({ ...form, featured: event.target.checked })} />Featured testimonial</label>
        </div>
        {formError ? <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">{formError}</div> : null}
        <div className="flex justify-end gap-3"><Button variant="outline" onClick={onClose} type="button">Cancel</Button><Button type="submit" disabled={isSaving}>{isSaving ? "Saving..." : form.id ? "Update testimonial" : "Create testimonial"}</Button></div>
      </form>
    </SectionModal>
  );
}
