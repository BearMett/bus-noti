'use client';

import { InputHTMLAttributes, forwardRef, ReactNode } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: ReactNode;
  error?: string;
  hint?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, className = '', id, ...props }, ref) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className="space-y-2">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-bold uppercase tracking-wider text-transit-yellow"
          >
            {label}
          </label>
        )}
        <div className="relative">
          <input
            ref={ref}
            id={inputId}
            className={`
              w-full
              bg-transit-dark
              border-2 border-transit-gray
              text-transit-yellow
              px-4 py-3
              font-[family-name:var(--font-led)]
              text-base
              placeholder:text-transit-gray-light
              transition-all duration-150
              focus:outline-none
              focus:border-transit-yellow
              focus:shadow-[0_0_0_1px_var(--transit-yellow),0_0_12px_rgba(255,209,0,0.3)]
              disabled:opacity-50 disabled:cursor-not-allowed
              ${error ? 'border-transit-red focus:border-transit-red focus:shadow-[0_0_0_1px_var(--transit-red),0_0_12px_rgba(255,51,51,0.3)]' : ''}
              ${className}
            `}
            {...props}
          />
          {error && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <svg
                className="w-5 h-5 text-transit-red"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          )}
        </div>
        {error && (
          <p className="text-sm text-transit-red font-medium flex items-center gap-1">
            <span className="animate-blink">▶</span>
            {error}
          </p>
        )}
        {hint && !error && (
          <p className="text-sm text-transit-gray-light">{hint}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
