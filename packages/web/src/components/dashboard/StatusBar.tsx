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
