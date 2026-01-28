'use client';

import { ButtonHTMLAttributes, forwardRef } from 'react';

type ButtonVariant = 'primary' | 'outline' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-transit-yellow text-transit-black hover:bg-[#FFE033] hover:shadow-[0_4px_12px_rgba(255,209,0,0.4)]',
  outline:
    'bg-transparent text-transit-yellow border-2 border-transit-yellow hover:bg-transit-yellow hover:text-transit-black',
  ghost:
    'bg-transparent text-transit-yellow hover:bg-transit-gray/30',
  danger:
    'bg-transit-red text-white hover:bg-transit-red-dim',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-5 py-2.5 text-base',
  lg: 'px-6 py-3 text-lg',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      fullWidth = false,
      disabled,
      className = '',
      children,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading;

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={`
          font-bold uppercase tracking-wider
          transition-all duration-150
          relative overflow-hidden
          focus:outline-none focus:ring-2 focus:ring-transit-yellow focus:ring-offset-2 focus:ring-offset-transit-black
          disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none
          ${variantStyles[variant]}
          ${sizeStyles[size]}
          ${fullWidth ? 'w-full' : ''}
          ${!isDisabled ? 'hover:-translate-y-0.5 active:translate-y-0' : ''}
          ${className}
        `}
        {...props}
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg
              className="animate-spin h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span>Processing...</span>
          </span>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
