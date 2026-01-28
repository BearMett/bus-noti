'use client';

import { HTMLAttributes, forwardRef } from 'react';

interface DividerProps extends HTMLAttributes<HTMLDivElement> {
  label?: string;
  variant?: 'solid' | 'dashed';
}

export const Divider = forwardRef<HTMLDivElement, DividerProps>(
  ({ label, variant = 'solid', className = '', ...props }, ref) => {
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
            } border-border`}
          />
          <span className="px-3 text-xs font-medium text-text-muted bg-background">
            {label}
          </span>
          <div
            className={`flex-1 border-t ${
              variant === 'dashed' ? 'border-dashed' : ''
            } border-border`}
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
          border-border
          ${className}
        `}
        {...props}
      />
    );
  }
);

Divider.displayName = 'Divider';
