'use client';

import { HTMLAttributes, forwardRef } from 'react';

interface LogoProps extends HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  animated?: boolean;
}

const sizeStyles = {
  sm: { icon: 'w-8 h-8', text: 'text-lg', dot: 'w-2 h-2 -top-0.5 -right-0.5' },
  md: { icon: 'w-12 h-12', text: 'text-2xl', dot: 'w-3 h-3 -top-1 -right-1' },
  lg: { icon: 'w-16 h-16', text: 'text-4xl', dot: 'w-4 h-4 -top-1 -right-1' },
};

export const Logo = forwardRef<HTMLDivElement, LogoProps>(
  (
    { size = 'md', showText = true, animated = true, className = '', ...props },
    ref
  ) => {
    const styles = sizeStyles[size];

    return (
      <div
        ref={ref}
        className={`flex items-center gap-3 ${className}`}
        {...props}
      >
        <div className="relative">
          {/* Bus Icon Box */}
          <div
            className={`
              ${styles.icon}
              bg-transit-yellow
              flex items-center justify-center
              relative
            `}
          >
            {/* Bus Icon */}
            <svg
              className="w-2/3 h-2/3 text-transit-black"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M8 6v6" />
              <path d="M16 6v6" />
              <path d="M2 12h20" />
              <path d="M6 18h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v10a2 2 0 002 2z" />
              <circle cx="6" cy="18" r="2" />
              <circle cx="18" cy="18" r="2" />
            </svg>
          </div>

          {/* Notification Dot */}
          <div className={`absolute ${styles.dot}`}>
            {animated && (
              <span className="absolute inline-flex h-full w-full animate-ping bg-transit-green opacity-75 rounded-full" />
            )}
            <span className="relative inline-flex h-full w-full bg-transit-green rounded-full" />
          </div>
        </div>

        {showText && (
          <div className="flex flex-col">
            <span
              className={`
                ${styles.text}
                font-bold
                uppercase
                tracking-tight
                text-transit-yellow
                leading-none
              `}
            >
              BusNoti
            </span>
            <span className="text-xs uppercase tracking-[0.2em] text-transit-gray-light">
              실시간 알림
            </span>
          </div>
        )}
      </div>
    );
  }
);

Logo.displayName = 'Logo';
