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
