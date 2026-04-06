'use client';

import { Check, PlusIcon, ShieldCheckIcon } from 'lucide-react';
import { motion } from 'framer-motion';

import { Badge } from './badge';
import { BorderTrail } from './border-trail';
import { InteractiveHoverButton } from './interactive-hover-button';
import { cn } from '@/lib/utils';
import type { PricingPlanRecord } from '@/lib/cms/types';

interface PricingProps {
  plans?: PricingPlanRecord[];
}

function formatPrice(price: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(price);
}

export function Pricing({ plans = [] }: PricingProps) {
  const visiblePlans = [...plans]
    .filter(plan => plan.status === 'active')
    .sort((left, right) => left.position - right.position);

  if (visiblePlans.length === 0) {
    return null;
  }

  return (
    <section className="relative min-h-screen overflow-hidden py-24 pb-16 sm:py-32 sm:pb-20">
      <div id="pricing" className="mx-auto w-full max-w-6xl space-y-5 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="mx-auto max-w-xl space-y-5"
        >
          <h2 className="mt-5 text-center text-xl font-bold tracking-tighter sm:text-2xl md:text-3xl lg:text-4xl">
            Pricing Based on Your Success
          </h2>
          <p className="text-muted-foreground mt-5 px-4 text-center text-xs sm:text-sm md:text-base">
            Flexible plans you can adjust from the admin panel without touching the landing page
            code.
          </p>
        </motion.div>

        <div className="relative">
          <div
            className={cn(
              'z--10 pointer-events-none absolute inset-0 size-full',
              'bg-[linear-gradient(to_right,--theme(--color-foreground/.2)_1px,transparent_1px),linear-gradient(to_bottom,--theme(--color-foreground/.2)_1px,transparent_1px)]',
              'bg-[size:32px_32px]',
              '[mask-image:radial-gradient(ellipse_at_center,var(--background)_10%,transparent)]'
            )}
          />

          <div
            className={cn(
              'mx-auto grid w-full gap-6',
              visiblePlans.length > 2 ? 'max-w-6xl md:grid-cols-3' : 'max-w-4xl md:grid-cols-2'
            )}
          >
            {visiblePlans.map((plan, index) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 + index * 0.1, ease: [0.16, 1, 0.3, 1] }}
                viewport={{ once: true }}
                className={cn(
                  'bg-background relative overflow-hidden border px-4 pt-5 pb-5 sm:px-6',
                  plan.highlight
                    ? 'border-neon-blue/40 rounded-2xl shadow-[0_0_30px_rgba(0,217,255,0.15)]'
                    : 'rounded-xl border-white/10'
                )}
              >
                {plan.highlight ? (
                  <BorderTrail
                    style={{
                      boxShadow:
                        '0px 0px 60px 30px rgb(255 255 255 / 25%), 0 0 100px 60px rgb(0 0 0 / 40%), 0 0 140px 90px rgb(0 0 0 / 40%)',
                    }}
                    size={100}
                  />
                ) : null}
                <PlusIcon className="absolute -top-3 -left-3 size-5.5" />
                <PlusIcon className="absolute -top-3 -right-3 size-5.5" />
                <PlusIcon className="absolute -bottom-3 -left-3 size-5.5" />
                <PlusIcon className="absolute -right-3 -bottom-3 size-5.5" />

                <div className="space-y-1">
                  <div className="flex items-center justify-between gap-4">
                    <h3 className="text-xl leading-none font-semibold">{plan.name}</h3>
                    {plan.highlight ? (
                      <Badge>Popular</Badge>
                    ) : (
                      <Badge variant="secondary">Flexible</Badge>
                    )}
                  </div>
                  <p className="text-muted-foreground text-sm">{plan.description}</p>
                </div>

                <div className="mt-8 space-y-4">
                  <div className="text-muted-foreground flex items-end gap-1 text-xl">
                    <span className="text-foreground -mb-0.5 text-4xl font-extrabold tracking-tighter md:text-5xl">
                      {formatPrice(plan.price)}
                    </span>
                    <span>/{plan.billingCycle}</span>
                  </div>

                  <ul className="text-muted-foreground space-y-3 text-sm">
                    {plan.features.map(feature => (
                      <li key={`${plan.id}-${feature}`} className="flex items-start gap-3">
                        <Check className="text-neon-blue mt-0.5 size-4" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="flex justify-center pt-2">
                    <InteractiveHoverButton text={plan.ctaLabel} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-muted-foreground mt-6 flex items-center justify-center gap-x-2 text-sm">
            <ShieldCheckIcon className="size-4" />
            <span>Access to all features with no hidden fees</span>
          </div>
        </div>
      </div>
    </section>
  );
}
