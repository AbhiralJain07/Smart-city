'use client';

import { useEffect, useEffectEvent, useState, startTransition, type FormEvent } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import type { PublicContentPayload } from '@/lib/cms/types';
import { subscribeToCmsUpdates } from '@/lib/cms/realtime';
import { GlowingEffect } from '@/components/ui/glowing-effect';
import { Pricing } from '@/components/ui/single-pricing-card-1';
import Testimonials from '@/components/ui/testimonials-demo';

import HeroSection from '../sections/HeroSection';
import { ContainerScroll } from '../ui/container-scroll-animation';
import Button from '../ui/Button';
import BlogSection from './BlogSection';
import ContactSection from './ContactSection';

function Toast({ message, isVisible }: { message: string; isVisible: boolean }) {
  return (
    <AnimatePresence>
      {isVisible ? (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="bg-neon-blue shadow-neon-blue/50 fixed top-4 right-4 z-50 rounded-lg px-6 py-3 text-black shadow-lg"
        >
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-black border-t-transparent"></div>
            <span className="font-medium">{message}</span>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function Modal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [formData, setFormData] = useState({ name: '', email: '', city: '' });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onClose();
    setFormData({ name: '', email: '', city: '' });
  };

  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.82, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.82, opacity: 0 }}
            className="glass mx-4 w-full max-w-md rounded-2xl border border-white/20 p-8"
            onClick={event => event.stopPropagation()}
          >
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">Schedule Demo</h2>
              <button
                onClick={onClose}
                className="text-gray-400 transition-colors hover:text-white"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={event =>
                    setFormData(current => ({ ...current, name: event.target.value }))
                  }
                  className="focus:ring-neon-blue/50 w-full rounded-lg border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-gray-400 focus:ring-2 focus:outline-none"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">Email</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={event =>
                    setFormData(current => ({ ...current, email: event.target.value }))
                  }
                  className="focus:ring-neon-blue/50 w-full rounded-lg border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-gray-400 focus:ring-2 focus:outline-none"
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">City</label>
                <input
                  type="text"
                  required
                  value={formData.city}
                  onChange={event =>
                    setFormData(current => ({ ...current, city: event.target.value }))
                  }
                  className="focus:ring-neon-blue/50 w-full rounded-lg border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-gray-400 focus:ring-2 focus:outline-none"
                  placeholder="New York, USA"
                />
              </div>

              <Button type="submit" variant="primary" size="lg" className="w-full">
                Schedule Demo
              </Button>
            </form>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function FeaturesSection() {
  const features = [
    {
      icon: 'City',
      title: 'Real-time Monitoring',
      description:
        'Track city metrics and infrastructure performance with live data streams and AI-powered analytics.',
      color: 'text-neon-blue',
    },
    {
      icon: 'AI',
      title: 'AI-Powered Insights',
      description:
        'Leverage machine learning models to forecast demand, predict disruption, and improve city-wide decision making.',
      color: 'text-neon-green',
    },
    {
      icon: 'Data',
      title: 'Predictive Analytics',
      description:
        'Surface early warning signals across traffic, utilities, safety, and sustainability before incidents escalate.',
      color: 'text-neon-purple',
    },
    {
      icon: 'Secure',
      title: 'Smart Integration',
      description:
        'Connect legacy systems, modern APIs, and IoT telemetry into one coordinated operating layer.',
      color: 'text-pink-400',
    },
    {
      icon: 'Shield',
      title: 'Advanced Security',
      description:
        'Protect mission-critical infrastructure with role-based access, audit visibility, and resilient workflows.',
      color: 'text-amber-300',
    },
    {
      icon: 'Scale',
      title: 'Operational Scale',
      description:
        'Handle millions of city events in one place without sacrificing response speed or team clarity.',
      color: 'text-neon-blue',
    },
  ];

  return (
    <section id="features" className="bg-background-primary scroll-mt-20 pt-24 pb-16">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          viewport={{ once: true, amount: 0.2 }}
          className="mb-4 text-center"
        >
          <h2 className="mb-4 text-2xl font-bold text-white sm:text-3xl md:text-4xl">
            Powerful Features
          </h2>
          <p className="mx-auto max-w-3xl px-4 text-base text-gray-300 sm:text-lg md:text-xl">
            Operational intelligence, predictive automation, and infrastructure visibility built for
            modern cities.
          </p>
        </motion.div>

        <ContainerScroll
          titleComponent={
            <>
              <h2 className="mb-4 text-2xl font-semibold text-white sm:text-3xl md:text-4xl">
                Experience Our <br />
                <span className="text-neon-blue">Smart City Platform</span>
              </h2>
              <p className="mx-auto mt-4 max-w-3xl px-4 text-base text-gray-300 sm:text-lg md:text-xl">
                Scroll through the product surface and see how the command center coordinates every
                layer of urban operations.
              </p>
            </>
          }
        >
          <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 sm:gap-6 sm:p-6 lg:grid-cols-3 lg:gap-8 lg:p-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.08 }}
                className="glass group hover:border-neon-blue/30 rounded-2xl border border-white/10 p-5 transition-all duration-300 sm:p-6 lg:p-8"
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <div
                  className={`mb-3 text-sm font-semibold tracking-[0.35em] uppercase ${feature.color}`}
                >
                  {feature.icon}
                </div>
                <h3 className="mb-3 text-lg font-bold text-white sm:text-xl">{feature.title}</h3>
                <p className="text-sm leading-relaxed text-gray-300 sm:text-base">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </ContainerScroll>
      </div>
    </section>
  );
}

function ImpactSection() {
  const metrics = [
    { value: '35%', label: 'Traffic Reduction', color: 'text-neon-blue' },
    { value: '25%', label: 'Air Quality Improvement', color: 'text-neon-green' },
    { value: '$2M+', label: 'Annual Savings', color: 'text-neon-purple' },
    { value: '50+', label: 'Cities Served', color: 'text-pink-400' },
  ];

  return (
    <section id="impact" className="bg-background-secondary scroll-mt-20 py-24">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          viewport={{ once: true, amount: 0.2 }}
          className="mb-8 text-center"
        >
          <h2 className="mb-4 text-2xl font-bold text-white sm:text-3xl md:text-4xl">
            Proven Impact
          </h2>
          <p className="mx-auto max-w-3xl px-4 text-base text-gray-300 sm:text-lg md:text-xl">
            Real operational gains from cities already deploying SmartCity AI in live environments.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {metrics.map((metric, index) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="text-center"
            >
              <div className={`mb-2 text-5xl font-bold ${metric.color}`}>{metric.value}</div>
              <div className="text-lg text-gray-300">{metric.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TechnologySection() {
  const technologies = [
    {
      title: 'AI-Powered Analytics',
      description:
        'Machine learning models analyze live city data and surface operator-ready insights.',
      icon: 'Neural',
    },
    {
      title: 'IoT Integration',
      description:
        'Connect thousands of sensors, signals, and public systems without rebuilding your stack.',
      icon: 'Sensors',
    },
    {
      title: 'Cloud Infrastructure',
      description:
        'Scale dashboards, automation, and workflows across departments with resilient performance.',
      icon: 'Cloud',
    },
    {
      title: 'Governed Automation',
      description:
        'Coordinate approvals, escalation paths, and response rules across complex public teams.',
      icon: 'Control',
    },
  ];

  return (
    <section id="technology" className="bg-background-secondary scroll-mt-20 py-24">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          viewport={{ once: true, amount: 0.2 }}
          className="mb-8 text-center"
        >
          <h2 className="mb-4 text-2xl font-bold text-white sm:text-3xl md:text-4xl">
            Cutting-Edge Technology
          </h2>
          <p className="mx-auto max-w-3xl px-4 text-base text-gray-300 sm:text-lg md:text-xl">
            Built with modern infrastructure patterns for reliability, speed, and city-scale
            coordination.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
          {technologies.map((tech, index) => (
            <motion.div
              key={tech.title}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="relative"
            >
              <div className="hover:border-neon-blue/30 relative h-full rounded-2xl border border-white/10 p-4 transition-all duration-300 sm:p-6 md:p-8">
                <GlowingEffect
                  spread={30}
                  glow={true}
                  disabled={false}
                  proximity={60}
                  inactiveZone={0.01}
                  borderWidth={2}
                />
                <div className="relative z-10">
                  <div className="text-neon-blue mb-3 text-sm font-semibold tracking-[0.35em] uppercase sm:mb-4">
                    {tech.icon}
                  </div>
                  <h3 className="mb-2 text-lg font-bold text-white sm:text-xl">{tech.title}</h3>
                  <p className="text-sm leading-relaxed text-gray-300 sm:text-base">
                    {tech.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

interface HomePageClientProps {
  initialContent: PublicContentPayload;
}

export default function HomePageClient({ initialContent }: HomePageClientProps) {
  const [content, setContent] = useState(initialContent);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);

  const syncContent = useEffectEvent(async () => {
    try {
      const response = await fetch('/api/content', {
        cache: 'no-store',
      });

      if (!response.ok) {
        return;
      }

      const nextContent = (await response.json()) as PublicContentPayload;
      startTransition(() => {
        setContent(currentContent =>
          currentContent.updatedAt === nextContent.updatedAt ? currentContent : nextContent
        );
      });
    } catch {
      // Swallow sync errors and retry on the next interval.
    }
  });

  useEffect(() => {
    const handleOpenModal = () => setIsModalOpen(true);
    const handleShowToast = () => setShowToast(true);
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 500);
    };

    const unsubscribe = subscribeToCmsUpdates(() => {
      void syncContent();
    });

    const interval = window.setInterval(() => {
      void syncContent();
    }, 4000);

    window.addEventListener('openDemoModal', handleOpenModal);
    window.addEventListener('showDashboardToast', handleShowToast);
    window.addEventListener('scroll', handleScroll);

    return () => {
      unsubscribe();
      window.clearInterval(interval);
      window.removeEventListener('openDemoModal', handleOpenModal);
      window.removeEventListener('showDashboardToast', handleShowToast);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    if (!showToast) {
      return;
    }

    const timeout = window.setTimeout(() => {
      setShowToast(false);
    }, 2600);

    return () => window.clearTimeout(timeout);
  }, [showToast]);

  const testimonialCards = content.testimonials.map(testimonial => ({
    text: testimonial.content,
    image: testimonial.image,
    name: testimonial.name,
    role: testimonial.role,
    rating: testimonial.rating,
  }));
  const hasTestimonials = testimonialCards.length > 0;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  };

  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <ImpactSection />
      <TechnologySection />
      <BlogSection blogs={content.blogs} />
      <Pricing plans={content.pricingPlans} />

      {hasTestimonials ? (
        <section
          id="testimonials"
          className="bg-background-primary scroll-mt-20 pt-16 pb-24 sm:pt-20"
        >
          <div className="container mx-auto max-w-7xl px-4 sm:px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              viewport={{ once: true, amount: 0.2 }}
              className="mt-4 flex min-h-[600px] items-center justify-center"
            >
              <Testimonials testimonials={testimonialCards} />
            </motion.div>
          </div>
        </section>
      ) : null}
      <ContactSection />

      <motion.button
        onClick={scrollToTop}
        className={`bg-neon-blue fixed right-4 bottom-4 z-50 rounded-full p-3 text-black shadow-lg transition-all duration-300 hover:bg-cyan-400 hover:shadow-[0_0_20px_rgba(0,217,255,0.5)] sm:right-8 sm:bottom-8 sm:p-4 ${
          showBackToTop
            ? 'translate-y-0 opacity-100'
            : 'pointer-events-none translate-y-10 opacity-0'
        }`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        aria-label="Back to top"
      >
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 10l7-7m0 0l7 7m-7-7v18"
          />
        </svg>
      </motion.button>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <Toast message="Connecting to City Neural Network..." isVisible={showToast} />
    </>
  );
}
