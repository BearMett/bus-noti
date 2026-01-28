'use client';

import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { CountdownDisplay } from '@/components/ui/LEDDisplay';
import type { DashboardSubscriptionDto } from '@busnoti/shared';

interface SubscriptionCardProps {
  subscription: DashboardSubscriptionDto;
  onDelete?: (id: string) => void;
}

function getStatusVariant(minutes: number): 'arriving' | 'soon' | 'normal' {
  if (minutes <= 3) return 'arriving';
  if (minutes <= 7) return 'soon';
  return 'normal';
}

function getStatusText(minutes: number): string {
  if (minutes <= 1) return '곧 도착';
  if (minutes <= 3) return '도착 임박';
  if (minutes <= 7) return '곧 도착';
  return '여유';
}

export function SubscriptionCard({ subscription, onDelete }: SubscriptionCardProps) {
  const { id, routeName, stationName, arrival } = subscription;
  const arrivalMinutes = arrival?.predictTimeMin ?? null;
  const plateNo = arrival?.plateNo ?? '-';
  const statusVariant = arrivalMinutes !== null ? getStatusVariant(arrivalMinutes) : 'normal';

  return (
    <Card
      variant="elevated"
      className="group hover:shadow-lg transition-shadow duration-200"
    >
      <CardContent className="p-0">
        <div className="flex items-stretch">
          {/* Route Number Section */}
          <div className="flex-shrink-0 w-24 bg-primary flex flex-col items-center justify-center p-4">
            <span className="text-xs font-medium text-text-inverse/70 mb-1">
              노선
            </span>
            <span className="text-xl font-bold text-text-inverse">
              {routeName}
            </span>
          </div>

          {/* Main Info Section */}
          <div className="flex-1 p-4 flex flex-col justify-between min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h3 className="text-base font-semibold text-text-primary truncate">
                  {stationName}
                </h3>
                <p className="text-sm text-text-muted font-mono mt-0.5">
                  {plateNo}
                </p>
              </div>
              {arrivalMinutes !== null ? (
                <Badge variant={statusVariant} pulse={arrivalMinutes <= 3}>
                  {getStatusText(arrivalMinutes)}
                </Badge>
              ) : (
                <Badge variant="normal">정보 없음</Badge>
              )}
            </div>

            <div className="flex items-end justify-between mt-3">
              <span className="text-xs text-text-muted">
                도착까지
              </span>
              {onDelete && (
                <button
                  onClick={() => onDelete(id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-xs text-red-500 hover:text-red-600 font-medium"
                >
                  삭제
                </button>
              )}
            </div>
          </div>

          {/* Countdown Section */}
          <div className="flex-shrink-0 w-24 bg-surface flex flex-col items-center justify-center p-4 border-l border-border">
            {arrivalMinutes !== null ? (
              <CountdownDisplay
                minutes={arrivalMinutes}
                label="분"
                size="lg"
              />
            ) : (
              <span className="text-text-muted text-sm">-</span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
