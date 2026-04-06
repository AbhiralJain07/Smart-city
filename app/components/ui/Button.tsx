import { motion, type MotionProps, type MotionStyle } from 'framer-motion';
import { type KeyboardEvent, type ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  onClick?: () => void;
  onKeyDown?: (event: KeyboardEvent) => void;
  'aria-label'?: string;
  type?: 'button' | 'submit' | 'reset';
}

const variants = {
  primary:
    'border border-cyan-200/40 text-slate-950 shadow-[0_0_28px_rgba(0,217,255,0.26)] hover:brightness-[1.04] hover:saturate-110 hover:shadow-[0_0_38px_rgba(0,217,255,0.34)] active:brightness-[0.96]',
  secondary:
    'border border-fuchsia-200/25 text-white shadow-[0_0_24px_rgba(157,78,221,0.28)] hover:brightness-[1.05] hover:saturate-110 hover:shadow-[0_0_32px_rgba(157,78,221,0.34)] active:brightness-[0.96]',
  outline:
    'border border-neon-blue/40 bg-neon-blue/10 text-neon-blue hover:bg-neon-blue/18 hover:text-white active:bg-neon-blue/24',
  ghost: 'text-neon-blue hover:bg-neon-blue/10 active:bg-neon-blue/16 hover:text-white',
};

const variantStyles: Partial<Record<NonNullable<ButtonProps['variant']>, MotionStyle>> = {
  primary: {
    backgroundImage: 'linear-gradient(135deg, #00d9ff 0%, #72f4ff 100%)',
  },
  secondary: {
    backgroundImage: 'linear-gradient(135deg, #9d4edd 0%, #c770ff 100%)',
  },
};

const sizes = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg',
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  className = '',
  onClick,
  onKeyDown,
  'aria-label': ariaLabel,
  type = 'button',
}: ButtonProps) {
  const baseClasses =
    'inline-flex select-none items-center justify-center gap-2 rounded-xl font-medium uppercase tracking-[0.22em] transition-all duration-300 [webkit-tap-highlight-color:transparent] focus:outline-none focus-visible:ring-2 focus-visible:ring-neon-blue/60 focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50';
  const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`;
  const buttonStyle = variantStyles[variant];
  const styleProps = buttonStyle ? { style: buttonStyle } : {};
  const interactiveMotion: MotionProps =
    disabled || loading ? {} : { whileHover: { scale: 1.03 }, whileTap: { scale: 0.98 } };

  return (
    <motion.button
      type={type}
      className={classes}
      disabled={disabled || loading}
      onClick={onClick}
      onKeyDown={onKeyDown}
      aria-label={ariaLabel}
      transition={{ type: 'spring', stiffness: 360, damping: 22 }}
      {...styleProps}
      {...interactiveMotion}
    >
      {loading ? (
        <div className="flex items-center justify-center">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          <span className="ml-2 tracking-widest uppercase">Loading...</span>
        </div>
      ) : (
        <span className="tracking-widest uppercase">{children}</span>
      )}
    </motion.button>
  );
}
