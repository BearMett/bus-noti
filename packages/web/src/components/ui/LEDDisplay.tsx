'use client';

import { HTMLAttributes, forwardRef } from 'react';

interface LEDDisplayProps extends HTMLAttributes<HTMLDivElement> {
  value: string | number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: 'yellow' | 'red' | 'green' | 'blue';
  glow?: boolean;
  blink?: boolean;
}

const sizeStyles = {
  sm: 'text-xl',
  md: 'text-3xl',
  lg: 'text-5xl',
  xl: 'text-7xl',
};

const colorStyles = {
  yellow: 'text-transit-yellow',
  red: 'text-transit-red',
  green: 'text-transit-green',
  blue: 'text-transit-blue',
};

export const LEDDisplay = forwardRef<HTMLDivElement, LEDDisplayProps>(
  (
    {
      value,
      size = 'md',
      color = 'yellow',
      glow = true,
      blink = false,
      className = '',
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={`
          font-[family-name:var(--font-led)]
          font-bold
          tabular-nums
          ${sizeStyles[size]}
          ${colorStyles[color]}
          ${glow ? 'led-glow' : ''}
          ${blink ? 'animate-blink' : ''}
          ${className}
        `}
        {...props}
      >
        {value}
      </div>
    );
  }
);

LEDDisplay.displayName = 'LEDDisplay';

interface LEDCountdownProps extends HTMLAttributes<HTMLDivElement> {
  minutes: number;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const LEDCountdown = forwardRef<HTMLDivElement, LEDCountdownProps>(
  ({ minutes, label, size = 'md', className = '', ...props }, ref) => {
    const getColor = () => {
      if (minutes <= 3) return 'red';
      if (minutes <= 7) return 'yellow';
      return 'green';
    };

    const getBlink = () => minutes <= 2;

    return (
      <div
        ref={ref}
        className={`flex flex-col items-center ${className}`}
        {...props}
      >
        <LEDDisplay
          value={minutes}
          size={size}
          color={getColor()}
          blink={getBlink()}
        />
        {label && (
          <span className="text-xs font-bold uppercase tracking-wider text-transit-gray-light mt-1">
            {label}
          </span>
        )}
      </div>
    );
  }
);

LEDCountdown.displayName = 'LEDCountdown';
