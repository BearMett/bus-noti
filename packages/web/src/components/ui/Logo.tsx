'use client';

import { HTMLAttributes, forwardRef } from 'react';

interface LogoProps extends HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

const sizeStyles = {
  sm: { icon: 'w-8 h-8', text: 'text-lg' },
  md: { icon: 'w-10 h-10', text: 'text-xl' },
  lg: { icon: 'w-14 h-14', text: 'text-2xl' },
};

export const Logo = forwardRef<HTMLDivElement, LogoProps>(
  (
    { size = 'md', showText = true, className = '', ...props },
    ref
  ) => {
    const styles = sizeStyles[size];

    return (
      <div
        ref={ref}
        className={`flex items-center gap-2.5 ${className}`}
        {...props}
      >
        {/* Bus Icon */}
        <div
          className={`
            ${styles.icon}
            bg-primary
            rounded-xl
            flex items-center justify-center
          `}
        >
          <svg
            className="w-2/3 h-2/3 text-text-inverse"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
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

        {showText && (
          <span className={`${styles.text} font-bold text-text-primary`}>
            BusNoti
          </span>
        )}
      </div>
    );
  }
);

Logo.displayName = 'Logo';
