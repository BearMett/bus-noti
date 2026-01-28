'use client';

import { HTMLAttributes, forwardRef } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'bordered';
  withScanlines?: boolean;
  withNoise?: boolean;
}

const variantStyles = {
  default: 'bg-surface border border-border',
  elevated: 'bg-surface-elevated border border-border shadow-[0_4px_24px_rgba(0,0,0,0.5)]',
  bordered: 'bg-surface border-2 border-transit-yellow',
};

export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      variant = 'default',
      withScanlines = false,
      withNoise = false,
      className = '',
      children,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={`
          relative overflow-hidden
          ${variantStyles[variant]}
          ${withScanlines ? 'scanline-overlay' : ''}
          ${withNoise ? 'noise-bg' : ''}
          ${className}
        `}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ title, subtitle, action, className = '', children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`
          px-5 py-4
          border-b border-border
          flex items-center justify-between
          ${className}
        `}
        {...props}
      >
        {children || (
          <>
            <div>
              {title && (
                <h3 className="text-lg font-bold uppercase tracking-wider text-transit-yellow">
                  {title}
                </h3>
              )}
              {subtitle && (
                <p className="text-sm text-transit-gray-light mt-0.5">
                  {subtitle}
                </p>
              )}
            </div>
            {action && <div>{action}</div>}
          </>
        )}
      </div>
    );
  }
);

CardHeader.displayName = 'CardHeader';

interface CardContentProps extends HTMLAttributes<HTMLDivElement> {}

export const CardContent = forwardRef<HTMLDivElement, CardContentProps>(
  ({ className = '', children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`p-5 ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

CardContent.displayName = 'CardContent';
