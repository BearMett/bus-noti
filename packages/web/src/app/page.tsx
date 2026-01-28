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
