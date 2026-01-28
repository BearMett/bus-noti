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

  const value: ThemeContextValue = {
    theme,
    setPreset,
    setColorMode,
    resolvedColorMode,
  };

  return (
    <ThemeContext.Provider value={value}>
      {/* Prevent hydration mismatch by hiding until mounted */}
      <div style={{ visibility: mounted ? 'visible' : 'hidden' }}>
        {children}
      </div>
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
