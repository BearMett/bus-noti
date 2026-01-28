'use client';

import { HTMLAttributes, forwardRef } from 'react';

type BadgeVariant = 'default' | 'arriving' | 'soon' | 'normal' | 'info';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  pulse?: boolean;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-surface border border-border text-text-primary',
  arriving: 'bg-status-arriving-bg text-status-arriving-text',
  soon: 'bg-status-soon-bg text-status-soon-text',
  normal: 'bg-status-normal-bg text-status-normal-text',
  info: 'bg-primary-light text-primary',
};

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      variant = 'default',
      pulse = false,
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
          text-xs font-medium
          rounded-full
          ${variantStyles[variant]}
          ${pulse ? 'animate-pulse-subtle' : ''}
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
