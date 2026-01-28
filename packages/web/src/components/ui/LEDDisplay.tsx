'use client';

import { HTMLAttributes, forwardRef } from 'react';

interface CountdownDisplayProps extends HTMLAttributes<HTMLDivElement> {
  minutes: number;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizeStyles = {
  sm: 'text-2xl',
  md: 'text-4xl',
  lg: 'text-5xl',
};

function getStatusColor(minutes: number): string {
  if (minutes <= 3) return 'text-status-arriving-text';
  if (minutes <= 7) return 'text-status-soon-text';
  return 'text-status-normal-text';
}

export const CountdownDisplay = forwardRef<HTMLDivElement, CountdownDisplayProps>(
  (
    {
      minutes,
      label,
      size = 'md',
      className = '',
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={`flex flex-col items-center ${className}`}
        {...props}
      >
        <span
          className={`
            font-mono font-bold tabular-nums
            ${sizeStyles[size]}
            ${getStatusColor(minutes)}
            ${minutes <= 2 ? 'animate-pulse-subtle' : ''}
          `}
        >
          {minutes}
        </span>
        {label && (
          <span className="text-xs font-medium text-text-muted mt-1">
            {label}
          </span>
        )}
      </div>
    );
  }
);

CountdownDisplay.displayName = 'CountdownDisplay';

// Legacy exports for backward compatibility
export const LEDDisplay = CountdownDisplay;
export const LEDCountdown = CountdownDisplay;
