'use client';

import { HTMLAttributes, forwardRef } from 'react';

type BadgeVariant = 'default' | 'arriving' | 'soon' | 'normal' | 'info';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  pulse?: boolean;
  glow?: boolean;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-transit-gray text-transit-yellow',
  arriving: 'bg-transit-red text-white',
  soon: 'bg-transit-yellow text-transit-black',
  normal: 'bg-transit-green text-transit-black',
  info: 'bg-transit-blue text-white',
};

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      variant = 'default',
      pulse = false,
      glow = false,
      className = '',
      children,
      ...props
    },
    ref
  ) => {
    return (
      <span
        ref={ref}
        className={`
          inline-flex items-center
          px-2.5 py-1
          text-xs font-bold uppercase tracking-wider
          ${variantStyles[variant]}
          ${pulse ? 'animate-pulse' : ''}
          ${glow && variant === 'arriving' ? 'animate-glow' : ''}
          ${className}
        `}
        {...props}
      >
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';
