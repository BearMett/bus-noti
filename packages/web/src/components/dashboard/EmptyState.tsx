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
