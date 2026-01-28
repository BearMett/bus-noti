'use client';

import { useState, useEffect } from 'react';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { SubscriptionCard, SubscriptionData } from '@/components/dashboard/SubscriptionCard';
import { EmptyState } from '@/components/dashboard/EmptyState';
import { StatusBar } from '@/components/dashboard/StatusBar';
import { Button } from '@/components/ui/Button';
import { Divider } from '@/components/ui/Divider';

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
  name: 'Kim Gildong',
};

export default function Dashboard() {
  const [subscriptions, setSubscriptions] = useState<SubscriptionData[]>(initialMockSubscriptions);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [currentDate, setCurrentDate] = useState<string>('');
  const [mounted, setMounted] = useState(false);

  // Initialize client-side state
  useEffect(() => {
    setMounted(true);
    setLastUpdate(new Date());
    setCurrentDate(
      new Date().toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      })
    );
  }, []);

  // Update current date every second
  useEffect(() => {
    if (!mounted) return;
    const timer = setInterval(() => {
      setCurrentDate(
        new Date().toLocaleDateString('ko-KR', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
        })
      );
    }, 1000);
    return () => clearInterval(timer);
  }, [mounted]);

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
    // Mock logout action
    console.log('Logout clicked');
  };

  const handleAddRoute = () => {
    // Mock add route action
    console.log('Add route clicked');
  };

  const handleDeleteSubscription = (id: number) => {
    setSubscriptions((prev) => prev.filter((sub) => sub.id !== id));
  };

  const arrivingSoonCount = subscriptions.filter(
    (sub) => sub.arrivalMinutes <= 3
  ).length;

  // Sort subscriptions by arrival time (soonest first)
  const sortedSubscriptions = [...subscriptions].sort(
    (a, b) => a.arrivalMinutes - b.arrivalMinutes
  );

  return (
    <div className="min-h-screen bg-transit-black noise-bg">
      {/* Background Grid Pattern */}
      <div className="fixed inset-0 grid-pattern opacity-30 pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <DashboardHeader userName={mockUser.name} onLogout={handleLogout} />

        {/* Main Content */}
        <main className="py-8">
          {/* Page Title Section */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold uppercase tracking-wider text-transit-yellow">
                Dashboard
              </h1>
              <p className="text-sm text-transit-gray-light mt-1">
                Real-time bus arrival monitoring
              </p>
            </div>

            {subscriptions.length > 0 && (
              <Button onClick={handleAddRoute}>
                + Add Route
              </Button>
            )}
          </div>

          {/* Status Bar */}
          {subscriptions.length > 0 && mounted && lastUpdate && (
            <StatusBar
              totalSubscriptions={subscriptions.length}
              arrivingSoon={arrivingSoonCount}
              lastUpdate={lastUpdate}
            />
          )}

          {/* Section Divider */}
          <Divider label="Subscribed Routes" className="my-6" />

          {/* Subscription List or Empty State */}
          {subscriptions.length === 0 ? (
            <EmptyState onAddRoute={handleAddRoute} />
          ) : (
            <div className="space-y-4">
              {sortedSubscriptions.map((subscription, index) => (
                <div
                  key={subscription.id}
                  className="animate-slide-up"
                  style={{ animationDelay: `${index * 100}ms` }}
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
          <div className="mt-8 py-4 border-t border-border">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-transit-gray-light uppercase tracking-wider">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-transit-red rounded-full" />
                  3 min or less
                </span>
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-transit-yellow rounded-full" />
                  4-7 min
                </span>
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-transit-green rounded-full" />
                  8+ min
                </span>
              </div>
              <div>
                Data refreshes every 30 seconds
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="py-6 border-t border-border">
          <div className="flex items-center justify-between">
            <span className="text-xs text-transit-gray-light uppercase tracking-wider">
              BusNoti v1.0.0
            </span>
            <span
              className="text-xs text-transit-gray-light font-mono"
              suppressHydrationWarning
            >
              {currentDate || '--/--/--'}
            </span>
          </div>
        </footer>
      </div>
    </div>
  );
}
