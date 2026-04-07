import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex select-none items-center justify-center whitespace-nowrap rounded-xl text-sm font-medium transition-all duration-200 [webkit-tap-highlight-color:transparent] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-blue/60 focus-visible:ring-offset-0 active:scale-[0.99] disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'border border-white/10 bg-white/6 text-white hover:border-white/20 hover:bg-white/10 active:bg-white/15',
        destructive:
          'border border-red-500/25 bg-red-500/15 text-red-100 hover:bg-red-500/20 active:bg-red-500/25',
        outline:
          'border border-white/15 bg-black/20 text-white hover:border-neon-blue/35 hover:bg-white/8 active:bg-white/12',
        secondary:
          'border border-neon-blue/20 bg-neon-blue/12 text-neon-blue hover:bg-neon-blue/18 active:bg-neon-blue/22',
        ghost: 'text-white/75 hover:bg-white/8 hover:text-white active:bg-white/12',
        link: 'text-neon-blue underline-offset-4 hover:text-cyan-400 hover:underline',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-lg px-3',
        lg: 'h-11 rounded-xl px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
