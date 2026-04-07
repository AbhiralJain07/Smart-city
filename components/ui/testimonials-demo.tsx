'use client';

import { motion } from 'motion/react';

import { TestimonialsColumn, type Testimonial } from '@/components/ui/testimonials-columns-1';

function chunkTestimonials(
  testimonials: Testimonial[]
): [Testimonial[], Testimonial[], Testimonial[]] {
  const chunkSize = Math.max(1, Math.ceil(testimonials.length / 3));
  const firstColumn = testimonials.slice(0, chunkSize);
  const secondColumn = testimonials.slice(chunkSize, chunkSize * 2);
  const thirdColumn = testimonials.slice(chunkSize * 2);

  return [
    firstColumn.length > 0 ? firstColumn : testimonials,
    secondColumn.length > 0 ? secondColumn : testimonials,
    thirdColumn.length > 0 ? thirdColumn : testimonials,
  ];
}

interface TestimonialsProps {
  testimonials?: Testimonial[];
}

const Testimonials = ({ testimonials = [] }: TestimonialsProps) => {
  if (testimonials.length === 0) {
    return null;
  }

  const [firstColumn, secondColumn, thirdColumn] = chunkTestimonials(testimonials);

  return (
    <section className="bg-background relative">
      <div className="z-10 container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="mx-auto flex max-w-[540px] flex-col items-center justify-center"
        >
          <h2 className="mt-5 text-lg font-bold tracking-tighter sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl">
            What our users say
          </h2>
          <p className="mt-5 text-center opacity-75">
            Real feedback from the teams operating smarter, faster cities.
          </p>
        </motion.div>

        <div className="mt-10 flex max-h-[600px] justify-center gap-4 overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_25%,black_75%,transparent)] sm:max-h-[740px] sm:gap-6">
          <TestimonialsColumn testimonials={firstColumn} duration={15} />
          <TestimonialsColumn
            testimonials={secondColumn}
            className="hidden md:block"
            duration={19}
          />
          <TestimonialsColumn
            testimonials={thirdColumn}
            className="hidden lg:block"
            duration={17}
          />
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
