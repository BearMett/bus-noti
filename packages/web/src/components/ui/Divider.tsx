'use client';

import { HTMLAttributes, forwardRef } from 'react';

interface DividerProps extends HTMLAttributes<HTMLDivElement> {
  label?: string;
  variant?: 'solid' | 'dashed' | 'warning';
}

export const Divider = forwardRef<HTMLDivElement, DividerProps>(
  ({ label, variant = 'solid', className = '', ...props }, ref) => {
    if (variant === 'warning') {
      return (
        <div
          ref={ref}
          className={`h-2 warning-stripes ${className}`}
          {...props}
        />
      );
    }

    if (label) {
      return (
        <div
          ref={ref}
          className={`relative flex items-center ${className}`}
          {...props}
        >
          <div
            className={`flex-1 border-t ${
              variant === 'dashed' ? 'border-dashed' : ''
            } border-transit-gray`}
          />
          <span className="px-4 text-xs font-bold uppercase tracking-[0.2em] text-transit-gray-light bg-transit-black">
            {label}
          </span>
          <div
            className={`flex-1 border-t ${
              variant === 'dashed' ? 'border-dashed' : ''
            } border-transit-gray`}
          />
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className={`
          border-t
          ${variant === 'dashed' ? 'border-dashed' : ''}
          border-transit-gray
          ${className}
        `}
        {...props}
      />
    );
  }
);

Divider.displayName = 'Divider';
