'use client';

import { useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { SubscriptionCard } from '@/components/dashboard/SubscriptionCard';
import { EmptyState } from '@/components/dashboard/EmptyState';
import { StatusBar } from '@/components/dashboard/StatusBar';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';
import { useDashboard } from '@/hooks/useDashboard';
import { useDeleteSubscription } from '@/hooks/useSubscriptions';

export default function Dashboard() {
  const router = useRouter();
  const { user, isLoading, isAuthenticated, logout, isLoggingOut } = useAuth();
  const {
    data: dashboardData,
    isLoading: isDashboardLoading,
    dataUpdatedAt,
  } = useDashboard({ enabled: isAuthenticated });
  const deleteSubscription = useDeleteSubscription();

  const subscriptions = dashboardData?.subscriptions ?? [];
  const lastUpdate = dataUpdatedAt ? new Date(dataUpdatedAt) : null;

  // 인증 확인 후 리다이렉트
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  const handleLogout = async () => {
    await logout();
  };

  const handleAddRoute = () => {
    console.log('Add route clicked');
    // TODO: 노선 추가 모달/페이지로 이동
  };

  const handleDeleteSubscription = (id: string) => {
    deleteSubscription.mutate(id);
  };

  // 로딩 중일 때
  if (isLoading || (isAuthenticated && isDashboardLoading)) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-text-secondary">로딩 중...</div>
      </div>
    );
  }

  // 인증되지 않은 경우 (리다이렉트 전)
  if (!isAuthenticated) {
    return null;
  }

  const arrivingSoonCount = subscriptions.filter(
    (sub) => sub.arrival && sub.arrival.predictTimeMin <= 3,
  ).length;

  const sortedSubscriptions = useMemo(
    () =>
      [...subscriptions].sort((a, b) => {
        const aMin = a.arrival?.predictTimeMin ?? Infinity;
        const bMin = b.arrival?.predictTimeMin ?? Infinity;
        return aMin - bMin;
      }),
    [subscriptions],
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <DashboardHeader
        userName={user?.name ?? user?.email ?? '사용자'}
        onLogout={handleLogout}
        isLoggingOut={isLoggingOut}
      />

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 py-6">
        {/* Page Title */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold text-text-primary">대시보드</h1>
            <p className="text-sm text-text-secondary mt-0.5">
              실시간 버스 도착 정보
            </p>
          </div>

          {subscriptions.length > 0 && (
            <Button onClick={handleAddRoute}>+ 노선 추가</Button>
          )}
        </div>

        {/* Status Bar */}
        {subscriptions.length > 0 && lastUpdate && (
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
              <div>30초마다 자동 갱신</div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-auto">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between text-xs text-text-muted">
            <span>BusNoti v1.0.0</span>
            <span>{new Date().toLocaleDateString('ko-KR')}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
