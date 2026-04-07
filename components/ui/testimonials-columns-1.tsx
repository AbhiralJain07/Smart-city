"use client";
import React from "react";
import { motion } from "motion/react";
import { Star } from "lucide-react";

export type Testimonial = {
  text: string;
  image: string;
  name: string;
  role: string;
  rating?: number;
};

export const TestimonialsColumn = (props: {
  className?: string;
  testimonials: Testimonial[];
  duration?: number;
}) => {
  return (
    <div className={props.className}>
      <motion.div
        animate={{
          translateY: "-50%",
        }}
        transition={{
          duration: props.duration || 10,
          repeat: Infinity,
          ease: "linear",
          repeatType: "loop",
        }}
        className="flex flex-col gap-6 bg-background pb-6"
      >
        {[
          ...new Array(2).fill(0).map((_, index) => (
            <React.Fragment key={index}>
              {props.testimonials.map(({ text, image, name, role, rating }, itemIndex) => (
                <div
                  className="w-full max-w-xs rounded-3xl border border-white/10 bg-black/30 p-10 shadow-lg shadow-primary/10 backdrop-blur-sm"
                  key={`${name}-${itemIndex}`}
                >
                  {typeof rating === "number" ? (
                    <div className="mb-4 flex items-center gap-1 text-amber-300">
                      {Array.from({ length: Math.round(rating) }).map((_, ratingIndex) => (
                        <Star key={`${name}-star-${ratingIndex}`} className="h-4 w-4 fill-current" />
                      ))}
                    </div>
                  ) : null}
                  <div className="text-sm leading-6 text-slate-200">{text}</div>
                  <div className="mt-5 flex items-center gap-3">
                    <img
                      width={40}
                      height={40}
                      src={image}
                      alt={name}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                    <div className="flex flex-col">
                      <div className="leading-5 font-medium tracking-tight text-white">{name}</div>
                      <div className="leading-5 tracking-tight text-white/60">{role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </React.Fragment>
          )),
        ]}
      </motion.div>
    </div>
  );
};
