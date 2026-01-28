'use client';

import { Badge } from '@/components/ui/Badge';

interface StatusBarProps {
  totalSubscriptions: number;
  arrivingSoon: number;
  lastUpdate: Date;
}

export function StatusBar({ totalSubscriptions, arrivingSoon, lastUpdate }: StatusBarProps) {
  return (
    <div className="flex items-center justify-between py-3 px-4 bg-transit-dark border border-border">
      <div className="flex items-center gap-6">
        {/* Active Subscriptions */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-transit-gray-light">
            Active Routes:
          </span>
          <span className="font-[family-name:var(--font-led)] text-transit-yellow">
            {totalSubscriptions}
          </span>
        </div>

        {/* Arriving Soon Alert */}
        {arrivingSoon > 0 && (
          <div className="flex items-center gap-2">
            <Badge variant="arriving" pulse glow>
              {arrivingSoon} ARRIVING SOON
            </Badge>
          </div>
        )}
      </div>

      {/* Last Update Time */}
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 bg-transit-green rounded-full animate-pulse" />
        <span className="text-xs font-bold uppercase tracking-wider text-transit-gray-light">
          Last Update:
        </span>
        <time className="text-xs font-mono text-transit-green">
          {lastUpdate.toLocaleTimeString('ko-KR', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,
          })}
        </time>
      </div>
    </div>
  );
}
