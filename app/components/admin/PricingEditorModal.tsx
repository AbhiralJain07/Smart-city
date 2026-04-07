"use client";

import type { FormEvent } from "react";
import type { PricingStatus } from "@/lib/cms/types";

import Button from "../ui/Button";
import { PricingFormState, SectionModal } from "./admin-helpers";

interface PricingEditorModalProps {
  form: PricingFormState;
  formError: string;
  isOpen: boolean;
  isSaving: boolean;
  onClose: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onChange: (form: PricingFormState) => void;
}

export default function PricingEditorModal({ form, formError, isOpen, isSaving, onClose, onSubmit, onChange }: PricingEditorModalProps) {
  return (
    <SectionModal isOpen={isOpen} title={form.id ? "Edit pricing plan" : "Create pricing plan"} description="Update plan structure, billing cadence, highlighted features, and landing-page CTA labels." onClose={onClose}>
      <form className="space-y-5" onSubmit={onSubmit}>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <label className="space-y-2 text-sm text-white/70"><span>Plan name</span><input value={form.name} onChange={(event) => onChange({ ...form, name: event.target.value })} className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none" placeholder="Command Center Pro" /></label>
          <label className="space-y-2 text-sm text-white/70"><span>Billing cycle</span><input value={form.billingCycle} onChange={(event) => onChange({ ...form, billingCycle: event.target.value })} className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none" placeholder="month" /></label>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <label className="space-y-2 text-sm text-white/70"><span>Price</span><input type="number" min="0" value={form.price} onChange={(event) => onChange({ ...form, price: event.target.value })} className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none" /></label>
          <label className="space-y-2 text-sm text-white/70"><span>Position</span><input type="number" min="1" value={form.position} onChange={(event) => onChange({ ...form, position: event.target.value })} className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none" /></label>
          <label className="space-y-2 text-sm text-white/70"><span>Status</span><select value={form.status} onChange={(event) => onChange({ ...form, status: event.target.value as PricingStatus })} className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none"><option value="active">Active</option><option value="draft">Draft</option><option value="archived">Archived</option></select></label>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <label className="space-y-2 text-sm text-white/70"><span>CTA label</span><input value={form.ctaLabel} onChange={(event) => onChange({ ...form, ctaLabel: event.target.value })} className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none" placeholder="Get Started" /></label>
          <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white/70 md:mt-7"><input type="checkbox" checked={form.highlight} onChange={(event) => onChange({ ...form, highlight: event.target.checked })} />Highlight this plan</label>
        </div>
        <label className="space-y-2 text-sm text-white/70"><span>Description</span><textarea value={form.description} onChange={(event) => onChange({ ...form, description: event.target.value })} rows={4} className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none" placeholder="Describe the value proposition for this plan..." /></label>
        <div className="space-y-3"><div className="flex items-center justify-between"><span className="text-sm text-white/70">Features</span><button type="button" onClick={() => onChange({ ...form, features: [...form.features, ""] })} className="rounded-full border border-white/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-white/60 transition hover:border-neon-blue/40 hover:text-neon-blue">Add feature</button></div>{form.features.map((feature, index) => <div key={`feature-${index}`} className="flex gap-3"><input value={feature} onChange={(event) => onChange({ ...form, features: form.features.map((item, itemIndex) => itemIndex === index ? event.target.value : item) })} className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none" placeholder={`Feature ${index + 1}`} />{form.features.length > 1 ? <button type="button" onClick={() => onChange({ ...form, features: form.features.filter((_, itemIndex) => itemIndex !== index) })} className="rounded-full border border-red-500/20 px-4 py-3 text-sm text-red-300 transition hover:border-red-500/40 hover:text-red-200">Remove</button> : null}</div>)}</div>
        {formError ? <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">{formError}</div> : null}
        <div className="flex justify-end gap-3"><Button variant="outline" onClick={onClose} type="button">Cancel</Button><Button type="submit" disabled={isSaving}>{isSaving ? "Saving..." : form.id ? "Update plan" : "Create plan"}</Button></div>
      </form>
    </SectionModal>
  );
}
