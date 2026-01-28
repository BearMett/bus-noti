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
