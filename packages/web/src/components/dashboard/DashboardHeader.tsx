'use client';

import { useState, useEffect } from 'react';
import { Logo } from '@/components/ui/Logo';
import { Button } from '@/components/ui/Button';
import { Divider } from '@/components/ui/Divider';

interface DashboardHeaderProps {
  userName: string;
  onLogout: () => void;
}

export function DashboardHeader({ userName, onLogout }: DashboardHeaderProps) {
  const [currentTime, setCurrentTime] = useState<string>('--:--');
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
    <header className="w-full">
      <div className="flex items-center justify-between py-4">
        {/* Logo */}
        <Logo size="md" animated />

        {/* User Info & Actions */}
        <div className="flex items-center gap-6">
          {/* Current Time Display */}
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-xs font-bold uppercase tracking-wider text-transit-gray-light">
              SYSTEM TIME
            </span>
            <time
              className="font-[family-name:var(--font-led)] text-lg text-transit-green led-glow"
              suppressHydrationWarning
            >
              {mounted ? currentTime : '--:--'}
            </time>
          </div>

          {/* Vertical Divider */}
          <div className="hidden sm:block w-px h-10 bg-transit-gray" />

          {/* User Info */}
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-end">
              <span className="text-xs font-bold uppercase tracking-wider text-transit-gray-light">
                OPERATOR
              </span>
              <span className="text-sm font-bold text-transit-yellow">
                {userName}
              </span>
            </div>

            <Button variant="outline" size="sm" onClick={onLogout}>
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Warning Stripe Divider */}
      <Divider variant="warning" />
    </header>
  );
}
