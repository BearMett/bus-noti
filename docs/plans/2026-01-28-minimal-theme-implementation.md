# Minimal Theme Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 브루탈리스트 다크 테마에서 미니멀 클린 테마로 전환, 5종 프리셋 테마와 라이트/다크 모드 지원

**Architecture:** ThemeProvider Context로 테마 상태 관리, CSS 변수로 색상 시스템 구현, localStorage에 설정 저장

**Tech Stack:** Next.js 16, React 19, Tailwind CSS 4, TypeScript

---

## Task 1: 테마 타입 정의

**Files:**
- Create: `packages/web/src/types/theme.ts`

**Step 1: 테마 타입 파일 생성**

```typescript
export type ThemePreset = 'sky' | 'royal' | 'teal' | 'emerald' | 'violet';
export type ColorMode = 'system' | 'light' | 'dark';

export interface ThemeConfig {
  preset: ThemePreset;
  colorMode: ColorMode;
}

export const THEME_PRESETS: Record<ThemePreset, { name: string; primary: string }> = {
  sky: { name: 'Sky', primary: '#0EA5E9' },
  royal: { name: 'Royal', primary: '#2563EB' },
  teal: { name: 'Teal', primary: '#0891B2' },
  emerald: { name: 'Emerald', primary: '#10B981' },
  violet: { name: 'Violet', primary: '#8B5CF6' },
};

export const DEFAULT_THEME: ThemeConfig = {
  preset: 'sky',
  colorMode: 'system',
};
```

**Step 2: Commit**

```bash
git add packages/web/src/types/theme.ts
git commit -m "feat(web): add theme type definitions"
```

---

## Task 2: globals.css 전면 교체

**Files:**
- Modify: `packages/web/src/app/globals.css`

**Step 1: CSS 변수 및 테마 시스템 전면 교체**

```css
@import "tailwindcss";

/* Minimal Clean Design System */

:root {
  /* Theme Preset Colors - default to Sky */
  --primary: #0EA5E9;
  --primary-hover: #0284C7;
  --primary-light: #E0F2FE;

  /* Light Mode Colors */
  --background: #FFFFFF;
  --surface: #F8FAFC;
  --surface-elevated: #FFFFFF;
  --border: #E2E8F0;
  --border-accent: var(--primary);

  --text-primary: #0F172A;
  --text-secondary: #64748B;
  --text-muted: #94A3B8;
  --text-inverse: #FFFFFF;

  /* Status Colors - Light Mode */
  --status-arriving-bg: #FEE2E2;
  --status-arriving-text: #DC2626;
  --status-soon-bg: #FEF3C7;
  --status-soon-text: #D97706;
  --status-normal-bg: #DCFCE7;
  --status-normal-text: #16A34A;

  /* Shadows */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06);
  --shadow-lg: 0 4px 6px rgba(0, 0, 0, 0.1);

  /* Border Radius */
  --radius-sm: 6px;
  --radius-md: 8px;
  --radius-lg: 12px;

  /* Transitions */
  --transition-fast: 150ms;
  --transition-normal: 200ms;
}

/* Dark Mode */
.dark {
  --background: #0F172A;
  --surface: #1E293B;
  --surface-elevated: #334155;
  --border: #334155;

  --text-primary: #F8FAFC;
  --text-secondary: #94A3B8;
  --text-muted: #64748B;
  --text-inverse: #0F172A;

  /* Status Colors - Dark Mode */
  --status-arriving-bg: #7F1D1D;
  --status-arriving-text: #FCA5A5;
  --status-soon-bg: #78350F;
  --status-soon-text: #FCD34D;
  --status-normal-bg: #14532D;
  --status-normal-text: #86EFAC;

  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.2);
  --shadow-md: 0 1px 3px rgba(0, 0, 0, 0.3), 0 1px 2px rgba(0, 0, 0, 0.2);
  --shadow-lg: 0 4px 6px rgba(0, 0, 0, 0.3);
}

/* Theme Presets */
[data-theme="sky"] {
  --primary: #0EA5E9;
  --primary-hover: #0284C7;
  --primary-light: #E0F2FE;
}

[data-theme="royal"] {
  --primary: #2563EB;
  --primary-hover: #1D4ED8;
  --primary-light: #DBEAFE;
}

[data-theme="teal"] {
  --primary: #0891B2;
  --primary-hover: #0E7490;
  --primary-light: #CFFAFE;
}

[data-theme="emerald"] {
  --primary: #10B981;
  --primary-hover: #059669;
  --primary-light: #D1FAE5;
}

[data-theme="violet"] {
  --primary: #8B5CF6;
  --primary-hover: #7C3AED;
  --primary-light: #EDE9FE;
}

/* Tailwind Theme Integration */
@theme inline {
  --color-background: var(--background);
  --color-surface: var(--surface);
  --color-surface-elevated: var(--surface-elevated);
  --color-border: var(--border);
  --color-border-accent: var(--border-accent);

  --color-primary: var(--primary);
  --color-primary-hover: var(--primary-hover);
  --color-primary-light: var(--primary-light);

  --color-text-primary: var(--text-primary);
  --color-text-secondary: var(--text-secondary);
  --color-text-muted: var(--text-muted);
  --color-text-inverse: var(--text-inverse);

  --color-status-arriving-bg: var(--status-arriving-bg);
  --color-status-arriving-text: var(--status-arriving-text);
  --color-status-soon-bg: var(--status-soon-bg);
  --color-status-soon-text: var(--status-soon-text);
  --color-status-normal-bg: var(--status-normal-bg);
  --color-status-normal-text: var(--status-normal-text);

  --font-sans: var(--font-sans);
  --font-mono: var(--font-mono);
}

/* Base Styles */
body {
  background: var(--background);
  color: var(--text-primary);
  font-family: var(--font-sans), system-ui, sans-serif;
  min-height: 100vh;
  transition: background-color var(--transition-normal), color var(--transition-normal);
}

/* Animations */
@keyframes slide-in-up {
  from {
    transform: translateY(10px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes pulse-subtle {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

.animate-slide-up {
  animation: slide-in-up 0.3s ease-out forwards;
}

.animate-fade-in {
  animation: fade-in 0.2s ease-out forwards;
}

.animate-pulse-subtle {
  animation: pulse-subtle 2s ease-in-out infinite;
}

/* Selection */
::selection {
  background: var(--primary);
  color: var(--text-inverse);
}

/* Scrollbar */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: var(--surface);
}

::-webkit-scrollbar-thumb {
  background: var(--border);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--text-muted);
}

/* Focus Ring */
.focus-ring {
  outline: none;
}

.focus-ring:focus-visible {
  outline: 2px solid var(--primary);
  outline-offset: 2px;
}
```

**Step 2: Commit**

```bash
git add packages/web/src/app/globals.css
git commit -m "feat(web): replace brutalist CSS with minimal design system"
```

---

## Task 3: ThemeProvider 구현

**Files:**
- Create: `packages/web/src/components/providers/ThemeProvider.tsx`

**Step 1: ThemeProvider 컴포넌트 생성**

```tsx
'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { ThemeConfig, ThemePreset, ColorMode, DEFAULT_THEME } from '@/types/theme';

interface ThemeContextValue {
  theme: ThemeConfig;
  setPreset: (preset: ThemePreset) => void;
  setColorMode: (mode: ColorMode) => void;
  resolvedColorMode: 'light' | 'dark';
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

const STORAGE_KEY = 'busnoti-theme';

function getStoredTheme(): ThemeConfig {
  if (typeof window === 'undefined') return DEFAULT_THEME;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return { ...DEFAULT_THEME, ...JSON.parse(stored) };
    }
  } catch {}
  return DEFAULT_THEME;
}

function getSystemColorMode(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setTheme] = useState<ThemeConfig>(DEFAULT_THEME);
  const [resolvedColorMode, setResolvedColorMode] = useState<'light' | 'dark'>('light');
  const [mounted, setMounted] = useState(false);

  // Initialize theme from localStorage
  useEffect(() => {
    setTheme(getStoredTheme());
    setMounted(true);
  }, []);

  // Update resolved color mode
  useEffect(() => {
    if (!mounted) return;

    const updateResolvedMode = () => {
      const resolved = theme.colorMode === 'system'
        ? getSystemColorMode()
        : theme.colorMode;
      setResolvedColorMode(resolved);
    };

    updateResolvedMode();

    // Listen for system preference changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => {
      if (theme.colorMode === 'system') {
        updateResolvedMode();
      }
    };
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, [theme.colorMode, mounted]);

  // Apply theme to document
  useEffect(() => {
    if (!mounted) return;

    const root = document.documentElement;
    root.setAttribute('data-theme', theme.preset);
    root.classList.toggle('dark', resolvedColorMode === 'dark');
  }, [theme.preset, resolvedColorMode, mounted]);

  // Save theme to localStorage
  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(theme));
  }, [theme, mounted]);

  const setPreset = (preset: ThemePreset) => {
    setTheme(prev => ({ ...prev, preset }));
  };

  const setColorMode = (colorMode: ColorMode) => {
    setTheme(prev => ({ ...prev, colorMode }));
  };

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <div style={{ visibility: 'hidden' }}>
        {children}
      </div>
    );
  }

  return (
    <ThemeContext.Provider value={{ theme, setPreset, setColorMode, resolvedColorMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
```

**Step 2: Commit**

```bash
git add packages/web/src/components/providers/ThemeProvider.tsx
git commit -m "feat(web): add ThemeProvider with preset and color mode support"
```

---

## Task 4: layout.tsx 수정 (폰트 및 ThemeProvider)

**Files:**
- Modify: `packages/web/src/app/layout.tsx`

**Step 1: 폰트 변경 및 ThemeProvider 추가**

```tsx
import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import "./globals.css";

const sansFont = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const monoFont = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "BusNoti - 버스 도착 알림",
  description: "실시간 버스 도착 정보 알림 서비스",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body
        className={`${sansFont.variable} ${monoFont.variable} antialiased`}
      >
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
```

**Step 2: Commit**

```bash
git add packages/web/src/app/layout.tsx
git commit -m "feat(web): update layout with Inter font and ThemeProvider"
```

---

## Task 5: ThemeSelector 컴포넌트

**Files:**
- Create: `packages/web/src/components/ui/ThemeSelector.tsx`

**Step 1: 테마 선택 UI 컴포넌트 생성**

```tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { useTheme } from '@/components/providers/ThemeProvider';
import { THEME_PRESETS, ThemePreset, ColorMode } from '@/types/theme';

export function ThemeSelector() {
  const { theme, setPreset, setColorMode, resolvedColorMode } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const colorModeOptions: { value: ColorMode; label: string }[] = [
    { value: 'system', label: '시스템 설정' },
    { value: 'light', label: '라이트' },
    { value: 'dark', label: '다크' },
  ];

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border hover:bg-surface transition-colors focus-ring"
        aria-label="테마 설정"
      >
        <span
          className="w-4 h-4 rounded-full"
          style={{ backgroundColor: THEME_PRESETS[theme.preset].primary }}
        />
        <svg
          className="w-4 h-4 text-text-secondary"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-56 bg-surface-elevated border border-border rounded-lg shadow-lg z-50 animate-fade-in">
          <div className="p-3 border-b border-border">
            <p className="text-xs font-medium text-text-secondary mb-2">테마 색상</p>
            <div className="grid grid-cols-5 gap-2">
              {(Object.keys(THEME_PRESETS) as ThemePreset[]).map((preset) => (
                <button
                  key={preset}
                  onClick={() => setPreset(preset)}
                  className={`w-8 h-8 rounded-full transition-transform hover:scale-110 focus-ring ${
                    theme.preset === preset ? 'ring-2 ring-offset-2 ring-primary ring-offset-surface-elevated' : ''
                  }`}
                  style={{ backgroundColor: THEME_PRESETS[preset].primary }}
                  title={THEME_PRESETS[preset].name}
                />
              ))}
            </div>
          </div>

          <div className="p-3">
            <p className="text-xs font-medium text-text-secondary mb-2">다크 모드</p>
            <div className="space-y-1">
              {colorModeOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setColorMode(option.value)}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                    theme.colorMode === option.value
                      ? 'bg-primary text-text-inverse'
                      : 'hover:bg-surface text-text-primary'
                  }`}
                >
                  {option.label}
                  {option.value === 'system' && (
                    <span className="text-xs ml-1 opacity-60">
                      ({resolvedColorMode === 'dark' ? '다크' : '라이트'})
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
```

**Step 2: Commit**

```bash
git add packages/web/src/components/ui/ThemeSelector.tsx
git commit -m "feat(web): add ThemeSelector component"
```

---

## Task 6: Button 컴포넌트 리팩토링

**Files:**
- Modify: `packages/web/src/components/ui/Button.tsx`

**Step 1: 미니멀 스타일로 변경**

```tsx
'use client';

import { ButtonHTMLAttributes, forwardRef } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-primary text-text-inverse hover:bg-primary-hover shadow-sm',
  secondary:
    'bg-surface border border-border text-text-primary hover:bg-background',
  ghost:
    'bg-transparent text-primary hover:bg-primary-light',
  danger:
    'bg-red-500 text-white hover:bg-red-600 shadow-sm',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm rounded-md',
  md: 'px-4 py-2 text-sm rounded-lg',
  lg: 'px-6 py-3 text-base rounded-lg',
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
          font-medium
          transition-all duration-150
          focus-ring
          disabled:opacity-50 disabled:cursor-not-allowed
          ${variantStyles[variant]}
          ${sizeStyles[size]}
          ${fullWidth ? 'w-full' : ''}
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
            <span>처리 중...</span>
          </span>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
```

**Step 2: Commit**

```bash
git add packages/web/src/components/ui/Button.tsx
git commit -m "refactor(web): update Button to minimal style"
```

---

## Task 7: Input 컴포넌트 리팩토링

**Files:**
- Modify: `packages/web/src/components/ui/Input.tsx`

**Step 1: 미니멀 스타일로 변경**

```tsx
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
      <div className="space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-text-primary"
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
              bg-background
              border border-border
              text-text-primary
              px-3 py-2.5
              rounded-lg
              text-sm
              placeholder:text-text-muted
              transition-all duration-150
              focus:outline-none
              focus:border-primary
              focus:ring-2 focus:ring-primary/20
              disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-surface
              ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''}
              ${className}
            `}
            {...props}
          />
          {error && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <svg
                className="w-5 h-5 text-red-500"
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
          <p className="text-sm text-red-500">{error}</p>
        )}
        {hint && !error && (
          <p className="text-sm text-text-muted">{hint}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
```

**Step 2: Commit**

```bash
git add packages/web/src/components/ui/Input.tsx
git commit -m "refactor(web): update Input to minimal style"
```

---

## Task 8: Card 컴포넌트 리팩토링

**Files:**
- Modify: `packages/web/src/components/ui/Card.tsx`

**Step 1: 미니멀 스타일로 변경 (scanline/noise 제거)**

```tsx
'use client';

import { HTMLAttributes, forwardRef } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated';
}

const variantStyles = {
  default: 'bg-surface border border-border',
  elevated: 'bg-surface-elevated border border-border shadow-md',
};

export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      variant = 'default',
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
          rounded-xl overflow-hidden
          ${variantStyles[variant]}
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
                <h3 className="text-base font-semibold text-text-primary">
                  {title}
                </h3>
              )}
              {subtitle && (
                <p className="text-sm text-text-secondary mt-0.5">
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
```

**Step 2: Commit**

```bash
git add packages/web/src/components/ui/Card.tsx
git commit -m "refactor(web): update Card to minimal style, remove brutalist effects"
```

---

## Task 9: Badge 컴포넌트 리팩토링

**Files:**
- Modify: `packages/web/src/components/ui/Badge.tsx`

**Step 1: 미니멀 스타일로 변경**

```tsx
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
```

**Step 2: Commit**

```bash
git add packages/web/src/components/ui/Badge.tsx
git commit -m "refactor(web): update Badge to minimal style with rounded-full"
```

---

## Task 10: Divider 컴포넌트 리팩토링

**Files:**
- Modify: `packages/web/src/components/ui/Divider.tsx`

**Step 1: warning 스타일 제거, 미니멀로 변경**

```tsx
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
```

**Step 2: Commit**

```bash
git add packages/web/src/components/ui/Divider.tsx
git commit -m "refactor(web): simplify Divider, remove warning stripes"
```

---

## Task 11: Logo 컴포넌트 리팩토링

**Files:**
- Modify: `packages/web/src/components/ui/Logo.tsx`

**Step 1: 심플한 디자인으로 변경**

```tsx
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
```

**Step 2: Commit**

```bash
git add packages/web/src/components/ui/Logo.tsx
git commit -m "refactor(web): simplify Logo component"
```

---

## Task 12: CountdownDisplay 컴포넌트 (LEDDisplay 대체)

**Files:**
- Modify: `packages/web/src/components/ui/LEDDisplay.tsx`

**Step 1: 미니멀 스타일로 변경**

```tsx
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
```

**Step 2: Commit**

```bash
git add packages/web/src/components/ui/LEDDisplay.tsx
git commit -m "refactor(web): replace LEDDisplay with CountdownDisplay"
```

---

## Task 13: DashboardHeader 리팩토링

**Files:**
- Modify: `packages/web/src/components/dashboard/DashboardHeader.tsx`

**Step 1: 미니멀 스타일 + 테마 셀렉터 추가**

```tsx
'use client';

import { useState, useEffect } from 'react';
import { Logo } from '@/components/ui/Logo';
import { Button } from '@/components/ui/Button';
import { ThemeSelector } from '@/components/ui/ThemeSelector';

interface DashboardHeaderProps {
  userName: string;
  onLogout: () => void;
}

export function DashboardHeader({ userName, onLogout }: DashboardHeaderProps) {
  const [currentTime, setCurrentTime] = useState<string>('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const updateTime = () => {
      setCurrentTime(
        new Date().toLocaleTimeString('ko-KR', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        })
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="w-full border-b border-border bg-surface">
      <div className="flex items-center justify-between py-3 px-4">
        {/* Logo */}
        <Logo size="md" />

        {/* Actions */}
        <div className="flex items-center gap-3">
          {/* Current Time */}
          <div className="hidden sm:block">
            <time
              className="font-mono text-sm text-text-secondary tabular-nums"
              suppressHydrationWarning
            >
              {mounted ? currentTime : '--:--'}
            </time>
          </div>

          {/* Theme Selector */}
          <ThemeSelector />

          {/* User Menu */}
          <div className="flex items-center gap-3 pl-3 border-l border-border">
            <span className="text-sm text-text-secondary hidden sm:block">
              {userName}
            </span>
            <Button variant="ghost" size="sm" onClick={onLogout}>
              로그아웃
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
```

**Step 2: Commit**

```bash
git add packages/web/src/components/dashboard/DashboardHeader.tsx
git commit -m "refactor(web): update DashboardHeader with minimal style and ThemeSelector"
```

---

## Task 14: SubscriptionCard 리팩토링

**Files:**
- Modify: `packages/web/src/components/dashboard/SubscriptionCard.tsx`

**Step 1: 미니멀 스타일로 변경**

```tsx
'use client';

import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { CountdownDisplay } from '@/components/ui/LEDDisplay';

export interface SubscriptionData {
  id: number;
  routeNo: string;
  stationName: string;
  arrivalMinutes: number;
  plateNo: string;
}

interface SubscriptionCardProps {
  subscription: SubscriptionData;
  onDelete?: (id: number) => void;
}

function getStatusVariant(minutes: number): 'arriving' | 'soon' | 'normal' {
  if (minutes <= 3) return 'arriving';
  if (minutes <= 7) return 'soon';
  return 'normal';
}

function getStatusText(minutes: number): string {
  if (minutes <= 1) return '곧 도착';
  if (minutes <= 3) return '도착 임박';
  if (minutes <= 7) return '곧 도착';
  return '여유';
}

export function SubscriptionCard({ subscription, onDelete }: SubscriptionCardProps) {
  const { id, routeNo, stationName, arrivalMinutes, plateNo } = subscription;
  const statusVariant = getStatusVariant(arrivalMinutes);

  return (
    <Card
      variant="elevated"
      className="group hover:shadow-lg transition-shadow duration-200"
    >
      <CardContent className="p-0">
        <div className="flex items-stretch">
          {/* Route Number Section */}
          <div className="flex-shrink-0 w-24 bg-primary flex flex-col items-center justify-center p-4">
            <span className="text-xs font-medium text-text-inverse/70 mb-1">
              노선
            </span>
            <span className="text-xl font-bold text-text-inverse">
              {routeNo}
            </span>
          </div>

          {/* Main Info Section */}
          <div className="flex-1 p-4 flex flex-col justify-between min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h3 className="text-base font-semibold text-text-primary truncate">
                  {stationName}
                </h3>
                <p className="text-sm text-text-muted font-mono mt-0.5">
                  {plateNo}
                </p>
              </div>
              <Badge variant={statusVariant} pulse={arrivalMinutes <= 3}>
                {getStatusText(arrivalMinutes)}
              </Badge>
            </div>

            <div className="flex items-end justify-between mt-3">
              <span className="text-xs text-text-muted">
                도착까지
              </span>
              {onDelete && (
                <button
                  onClick={() => onDelete(id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-xs text-red-500 hover:text-red-600 font-medium"
                >
                  삭제
                </button>
              )}
            </div>
          </div>

          {/* Countdown Section */}
          <div className="flex-shrink-0 w-24 bg-surface flex flex-col items-center justify-center p-4 border-l border-border">
            <CountdownDisplay
              minutes={arrivalMinutes}
              label="분"
              size="lg"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
```

**Step 2: Commit**

```bash
git add packages/web/src/components/dashboard/SubscriptionCard.tsx
git commit -m "refactor(web): update SubscriptionCard to minimal style"
```

---

## Task 15: StatusBar 리팩토링

**Files:**
- Modify: `packages/web/src/components/dashboard/StatusBar.tsx`

**Step 1: 먼저 현재 파일 읽기 후 미니멀 스타일로 변경**

```tsx
'use client';

interface StatusBarProps {
  totalSubscriptions: number;
  arrivingSoon: number;
  lastUpdate: Date;
}

export function StatusBar({ totalSubscriptions, arrivingSoon, lastUpdate }: StatusBarProps) {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
  };

  return (
    <div className="flex items-center justify-between p-3 bg-surface rounded-lg border border-border">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-text-secondary">구독 노선</span>
          <span className="text-sm font-semibold text-text-primary">{totalSubscriptions}개</span>
        </div>

        {arrivingSoon > 0 && (
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-status-arriving-text rounded-full animate-pulse-subtle" />
            <span className="text-sm text-status-arriving-text font-medium">
              {arrivingSoon}개 곧 도착
            </span>
          </div>
        )}
      </div>

      <div className="text-xs text-text-muted">
        마지막 업데이트: <time className="font-mono">{formatTime(lastUpdate)}</time>
      </div>
    </div>
  );
}
```

**Step 2: Commit**

```bash
git add packages/web/src/components/dashboard/StatusBar.tsx
git commit -m "refactor(web): update StatusBar to minimal style"
```

---

## Task 16: EmptyState 리팩토링

**Files:**
- Modify: `packages/web/src/components/dashboard/EmptyState.tsx`

**Step 1: 먼저 현재 파일 읽기 후 미니멀 스타일로 변경**

```tsx
'use client';

import { Button } from '@/components/ui/Button';

interface EmptyStateProps {
  onAddRoute: () => void;
}

export function EmptyState({ onAddRoute }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      {/* Icon */}
      <div className="w-16 h-16 bg-surface rounded-2xl flex items-center justify-center mb-4">
        <svg
          className="w-8 h-8 text-text-muted"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M8 6v6m8-6v6M2 12h20M6 18h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
          <circle cx="6" cy="18" r="2" strokeWidth={1.5} />
          <circle cx="18" cy="18" r="2" strokeWidth={1.5} />
        </svg>
      </div>

      {/* Text */}
      <h3 className="text-lg font-semibold text-text-primary mb-1">
        구독 중인 노선이 없습니다
      </h3>
      <p className="text-sm text-text-secondary mb-6 text-center">
        자주 이용하는 버스 노선을 추가하고<br />
        실시간 도착 알림을 받아보세요.
      </p>

      {/* Action */}
      <Button onClick={onAddRoute}>
        + 노선 추가하기
      </Button>
    </div>
  );
}
```

**Step 2: Commit**

```bash
git add packages/web/src/components/dashboard/EmptyState.tsx
git commit -m "refactor(web): update EmptyState to minimal style"
```

---

## Task 17: 대시보드 페이지 리팩토링

**Files:**
- Modify: `packages/web/src/app/page.tsx`

**Step 1: 미니멀 스타일로 변경**

```tsx
'use client';

import { useState, useEffect } from 'react';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { SubscriptionCard, SubscriptionData } from '@/components/dashboard/SubscriptionCard';
import { EmptyState } from '@/components/dashboard/EmptyState';
import { StatusBar } from '@/components/dashboard/StatusBar';
import { Button } from '@/components/ui/Button';

// Mock Data
const initialMockSubscriptions: SubscriptionData[] = [
  {
    id: 1,
    routeNo: '9403',
    stationName: '강남역',
    arrivalMinutes: 2,
    plateNo: '서울70사1234',
  },
  {
    id: 2,
    routeNo: '370',
    stationName: '신논현역',
    arrivalMinutes: 8,
    plateNo: '서울74사5678',
  },
  {
    id: 3,
    routeNo: 'M6405',
    stationName: '판교역',
    arrivalMinutes: 15,
    plateNo: '경기70아9012',
  },
];

const mockUser = {
  name: '김길동',
};

export default function Dashboard() {
  const [subscriptions, setSubscriptions] = useState<SubscriptionData[]>(initialMockSubscriptions);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setLastUpdate(new Date());
  }, []);

  // Simulate real-time updates every 30 seconds
  useEffect(() => {
    if (!mounted) return;
    const updateTimer = setInterval(() => {
      setSubscriptions((prev) =>
        prev.map((sub) => ({
          ...sub,
          arrivalMinutes: Math.max(0, sub.arrivalMinutes - 1),
        }))
      );
      setLastUpdate(new Date());
    }, 30000);
    return () => clearInterval(updateTimer);
  }, [mounted]);

  const handleLogout = () => {
    console.log('Logout clicked');
  };

  const handleAddRoute = () => {
    console.log('Add route clicked');
  };

  const handleDeleteSubscription = (id: number) => {
    setSubscriptions((prev) => prev.filter((sub) => sub.id !== id));
  };

  const arrivingSoonCount = subscriptions.filter(
    (sub) => sub.arrivalMinutes <= 3
  ).length;

  const sortedSubscriptions = [...subscriptions].sort(
    (a, b) => a.arrivalMinutes - b.arrivalMinutes
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <DashboardHeader userName={mockUser.name} onLogout={handleLogout} />

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 py-6">
        {/* Page Title */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold text-text-primary">
              대시보드
            </h1>
            <p className="text-sm text-text-secondary mt-0.5">
              실시간 버스 도착 정보
            </p>
          </div>

          {subscriptions.length > 0 && (
            <Button onClick={handleAddRoute}>
              + 노선 추가
            </Button>
          )}
        </div>

        {/* Status Bar */}
        {subscriptions.length > 0 && mounted && lastUpdate && (
          <div className="mb-6">
            <StatusBar
              totalSubscriptions={subscriptions.length}
              arrivingSoon={arrivingSoonCount}
              lastUpdate={lastUpdate}
            />
          </div>
        )}

        {/* Subscription List or Empty State */}
        {subscriptions.length === 0 ? (
          <EmptyState onAddRoute={handleAddRoute} />
        ) : (
          <div className="space-y-3">
            {sortedSubscriptions.map((subscription, index) => (
              <div
                key={subscription.id}
                className="animate-slide-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <SubscriptionCard
                  subscription={subscription}
                  onDelete={handleDeleteSubscription}
                />
              </div>
            ))}
          </div>
        )}

        {/* Info Footer */}
        {subscriptions.length > 0 && (
          <div className="mt-8 py-4 border-t border-border">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-text-muted">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-status-arriving-text rounded-full" />
                  3분 이하
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-status-soon-text rounded-full" />
                  4-7분
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-status-normal-text rounded-full" />
                  8분 이상
                </span>
              </div>
              <div>
                30초마다 자동 갱신
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-auto">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between text-xs text-text-muted">
            <span>BusNoti v1.0.0</span>
            <span>
              {mounted && new Date().toLocaleDateString('ko-KR')}
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
```

**Step 2: Commit**

```bash
git add packages/web/src/app/page.tsx
git commit -m "refactor(web): update dashboard page to minimal style"
```

---

## Task 18: 로그인 페이지 리팩토링

**Files:**
- Modify: `packages/web/src/app/login/page.tsx`

**Step 1: 미니멀 스타일로 변경**

```tsx
import Link from 'next/link';
import { LoginForm } from '@/components/auth/LoginForm';
import { SocialLoginButtons } from '@/components/auth/SocialLoginButtons';
import { Logo } from '@/components/ui/Logo';
import { Card, CardContent } from '@/components/ui/Card';
import { Divider } from '@/components/ui/Divider';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-sm">
          {/* Logo & Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <Logo size="lg" showText={false} />
            </div>
            <h1 className="text-2xl font-bold text-text-primary mb-1">
              BusNoti
            </h1>
            <p className="text-sm text-text-secondary">
              실시간 버스 도착 알림 서비스
            </p>
          </div>

          {/* Login Card */}
          <Card variant="elevated">
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold text-text-primary mb-6">
                로그인
              </h2>

              {/* Login Form */}
              <LoginForm />

              {/* Divider */}
              <Divider label="또는" className="my-6" />

              {/* Social Login */}
              <SocialLoginButtons />
            </CardContent>
          </Card>

          {/* Register Link */}
          <p className="mt-6 text-center text-sm text-text-secondary">
            계정이 없으신가요?{' '}
            <Link
              href="/register"
              className="text-primary hover:underline font-medium"
            >
              회원가입
            </Link>
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-4 text-center text-xs text-text-muted">
        © 2026 BusNoti. All rights reserved.
      </footer>
    </div>
  );
}
```

**Step 2: Commit**

```bash
git add packages/web/src/app/login/page.tsx
git commit -m "refactor(web): update login page to minimal style"
```

---

## Task 19: 회원가입 페이지 리팩토링

**Files:**
- Modify: `packages/web/src/app/register/page.tsx`

**Step 1: 현재 파일 확인 후 미니멀 스타일로 변경**

```tsx
import Link from 'next/link';
import { RegisterForm } from '@/components/auth/RegisterForm';
import { SocialLoginButtons } from '@/components/auth/SocialLoginButtons';
import { Logo } from '@/components/ui/Logo';
import { Card, CardContent } from '@/components/ui/Card';
import { Divider } from '@/components/ui/Divider';

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-sm">
          {/* Logo & Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <Logo size="lg" showText={false} />
            </div>
            <h1 className="text-2xl font-bold text-text-primary mb-1">
              BusNoti
            </h1>
            <p className="text-sm text-text-secondary">
              실시간 버스 도착 알림 서비스
            </p>
          </div>

          {/* Register Card */}
          <Card variant="elevated">
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold text-text-primary mb-6">
                회원가입
              </h2>

              {/* Register Form */}
              <RegisterForm />

              {/* Divider */}
              <Divider label="또는" className="my-6" />

              {/* Social Login */}
              <SocialLoginButtons />
            </CardContent>
          </Card>

          {/* Login Link */}
          <p className="mt-6 text-center text-sm text-text-secondary">
            이미 계정이 있으신가요?{' '}
            <Link
              href="/login"
              className="text-primary hover:underline font-medium"
            >
              로그인
            </Link>
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-4 text-center text-xs text-text-muted">
        © 2026 BusNoti. All rights reserved.
      </footer>
    </div>
  );
}
```

**Step 2: Commit**

```bash
git add packages/web/src/app/register/page.tsx
git commit -m "refactor(web): update register page to minimal style"
```

---

## Task 20: LoginForm 리팩토링

**Files:**
- Modify: `packages/web/src/components/auth/LoginForm.tsx`

**Step 1: 현재 파일 확인 후 미니멀 스타일로 변경**

```tsx
'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Mock login
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (email === 'test@test.com' && password === 'password') {
      console.log('Login successful');
    } else {
      setError('이메일 또는 비밀번호가 올바르지 않습니다.');
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        type="email"
        label="이메일"
        placeholder="name@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <Input
        type="password"
        label="비밀번호"
        placeholder="••••••••"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}

      <Button type="submit" fullWidth loading={loading}>
        로그인
      </Button>
    </form>
  );
}
```

**Step 2: Commit**

```bash
git add packages/web/src/components/auth/LoginForm.tsx
git commit -m "refactor(web): update LoginForm to minimal style"
```

---

## Task 21: RegisterForm 리팩토링

**Files:**
- Modify: `packages/web/src/components/auth/RegisterForm.tsx`

**Step 1: 현재 파일 확인 후 미니멀 스타일로 변경**

```tsx
'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export function RegisterForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }

    if (password.length < 8) {
      setError('비밀번호는 8자 이상이어야 합니다.');
      return;
    }

    setLoading(true);

    // Mock register
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log('Register successful', { name, email });

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        type="text"
        label="이름"
        placeholder="홍길동"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />

      <Input
        type="email"
        label="이메일"
        placeholder="name@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <Input
        type="password"
        label="비밀번호"
        placeholder="8자 이상 입력"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        hint="8자 이상의 비밀번호를 입력하세요."
        required
      />

      <Input
        type="password"
        label="비밀번호 확인"
        placeholder="비밀번호 재입력"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        error={confirmPassword && password !== confirmPassword ? '비밀번호가 일치하지 않습니다.' : undefined}
        required
      />

      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}

      <Button type="submit" fullWidth loading={loading}>
        회원가입
      </Button>
    </form>
  );
}
```

**Step 2: Commit**

```bash
git add packages/web/src/components/auth/RegisterForm.tsx
git commit -m "refactor(web): update RegisterForm to minimal style"
```

---

## Task 22: SocialLoginButtons 리팩토링

**Files:**
- Modify: `packages/web/src/components/auth/SocialLoginButtons.tsx`

**Step 1: 현재 파일 확인 후 미니멀 스타일로 변경**

```tsx
'use client';

import { Button } from '@/components/ui/Button';

export function SocialLoginButtons() {
  const handleGoogleLogin = () => {
    console.log('Google login clicked');
  };

  const handleKakaoLogin = () => {
    console.log('Kakao login clicked');
  };

  return (
    <div className="space-y-3">
      <Button
        type="button"
        variant="secondary"
        fullWidth
        onClick={handleGoogleLogin}
      >
        <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="currentColor"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="currentColor"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="currentColor"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
        Google로 계속하기
      </Button>

      <Button
        type="button"
        variant="secondary"
        fullWidth
        onClick={handleKakaoLogin}
        className="bg-[#FEE500] hover:bg-[#FDD835] text-[#191919] border-[#FEE500]"
      >
        <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M12 3c5.799 0 10.5 3.664 10.5 8.185 0 4.52-4.701 8.184-10.5 8.184a13.5 13.5 0 01-1.727-.11l-4.408 2.883c-.501.265-.678.236-.472-.413l.892-3.678c-2.88-1.46-4.785-3.99-4.785-6.866C1.5 6.665 6.201 3 12 3z"
          />
        </svg>
        카카오로 계속하기
      </Button>
    </div>
  );
}
```

**Step 2: Commit**

```bash
git add packages/web/src/components/auth/SocialLoginButtons.tsx
git commit -m "refactor(web): update SocialLoginButtons to minimal style"
```

---

## Task 23: 빌드 및 검증

**Step 1: 빌드 실행**

```bash
pnpm build
```

Expected: Build successful

**Step 2: 개발 서버 실행 및 수동 검증**

```bash
pnpm dev:web
```

브라우저에서 `http://localhost:3000` 접속하여 확인:
- [ ] 라이트 테마가 기본으로 적용되는지
- [ ] 테마 선택기로 5종 프리셋 전환되는지
- [ ] 다크 모드 전환이 되는지
- [ ] 로그인/회원가입 페이지가 정상 표시되는지
- [ ] 대시보드 카드가 정상 표시되는지

**Step 3: 최종 커밋 (필요시)**

```bash
git add -A
git commit -m "fix(web): address build issues"
```

---

## Summary

| Task | 파일 | 작업 내용 |
|------|------|-----------|
| 1 | types/theme.ts | 테마 타입 정의 |
| 2 | globals.css | CSS 변수 전면 교체 |
| 3 | ThemeProvider.tsx | 테마 Context 구현 |
| 4 | layout.tsx | 폰트 및 Provider 추가 |
| 5 | ThemeSelector.tsx | 테마 선택 UI |
| 6-12 | UI 컴포넌트 | Button, Input, Card, Badge, Divider, Logo, LEDDisplay |
| 13-16 | Dashboard 컴포넌트 | Header, SubscriptionCard, StatusBar, EmptyState |
| 17-22 | 페이지 및 Auth | page.tsx, login, register, forms |
| 23 | - | 빌드 및 검증 |
