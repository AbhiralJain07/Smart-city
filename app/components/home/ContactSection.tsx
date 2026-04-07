"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { motion } from "framer-motion";

import { broadcastCmsUpdate } from "@/lib/cms/realtime";

interface ContactSectionProps {
  onSuccess?: () => void;
}

const INITIAL_FORM = {
  name: "",
  email: "",
  organization: "",
  message: "",
};

export default function ContactSection({ onSuccess }: ContactSectionProps) {
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const payload = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(payload.error ?? "Unable to send your message.");
      }

      setFormData(INITIAL_FORM);
      setIsSubmitted(true);
      broadcastCmsUpdate();
      onSuccess?.();

      window.setTimeout(() => {
        setIsSubmitted(false);
      }, 3200);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Unable to send your message.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="scroll-mt-20 py-24 bg-background-primary relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-transparent to-black/20 pointer-events-none"></div>
      <div className="absolute top-0 right-0 h-96 w-96 bg-gradient-to-bl from-neon-blue/10 to-transparent pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 h-96 w-96 bg-gradient-to-tr from-neon-green/10 to-transparent pointer-events-none"></div>

      <div className="container relative z-10 mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.2 }}
          className="mb-10 text-center"
        >
          <h2 className="font-heading text-4xl font-semibold uppercase tracking-[0.35em] md:text-5xl">
            <span className="text-neon-blue">Get In</span> Touch
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-400">
            Ready to modernize how your city operates? Send us a signal and our team will follow up shortly.
          </p>
        </motion.div>

        {!isSubmitted ? (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="glass rounded-3xl border border-white/10 p-8 backdrop-blur-md"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label htmlFor="name" className="mb-2 block text-sm font-medium text-gray-300">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border border-white/10 bg-black/50 px-4 py-3 text-white placeholder-gray-500 transition-all focus:border-neon-blue focus:outline-none focus:shadow-[0_0_10px_rgba(0,217,255,0.3)]"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-300">
                    Work Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border border-white/10 bg-black/50 px-4 py-3 text-white placeholder-gray-500 transition-all focus:border-neon-blue focus:outline-none focus:shadow-[0_0_10px_rgba(0,217,255,0.3)]"
                    placeholder="john@city.gov"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="organization" className="mb-2 block text-sm font-medium text-gray-300">
                  City or Organization
                </label>
                <input
                  type="text"
                  id="organization"
                  name="organization"
                  value={formData.organization}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-white/10 bg-black/50 px-4 py-3 text-white placeholder-gray-500 transition-all focus:border-neon-blue focus:outline-none focus:shadow-[0_0_10px_rgba(0,217,255,0.3)]"
                  placeholder="Smart City Department"
                />
              </div>

              <div>
                <label htmlFor="message" className="mb-2 block text-sm font-medium text-gray-300">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full resize-none rounded-lg border border-white/10 bg-black/50 px-4 py-3 text-white placeholder-gray-500 transition-all focus:border-neon-blue focus:outline-none focus:shadow-[0_0_10px_rgba(0,217,255,0.3)]"
                  placeholder="Tell us about your smart city priorities..."
                />
              </div>

              {errorMessage ? (
                <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                  {errorMessage}
                </div>
              ) : null}

              <motion.button
                type="submit"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                disabled={isSubmitting}
                className="w-full rounded-lg border-2 border-white/20 bg-gradient-to-r from-neon-blue to-cyan-400 px-6 py-4 font-semibold uppercase tracking-[0.3em] text-black transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,217,255,0.45)] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting ? "Transmitting..." : "Send Message"}
              </motion.button>
            </form>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.45 }}
            className="glass rounded-3xl border border-neon-green/50 p-12 text-center backdrop-blur-md"
          >
            <div className="mb-4 text-5xl text-neon-green">Signal Received</div>
            <p className="mx-auto max-w-xl text-lg text-gray-300">
              Thanks for reaching out. A SmartCity AI specialist will get back to you shortly.
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
}

