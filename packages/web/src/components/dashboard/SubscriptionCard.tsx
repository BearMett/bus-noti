'use client';

import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { LEDCountdown } from '@/components/ui/LEDDisplay';

export interface SubscriptionData {
  id: number;
  routeNo: string;
  stationName: string;
  arrivalMinutes: number;
  plateNo: string;
}

interface SubscriptionCardProps {
  subscription: SubscriptionData;
  onDelete?: (id: number) => void;
}

function getStatusVariant(minutes: number): 'arriving' | 'soon' | 'normal' {
  if (minutes <= 3) return 'arriving';
  if (minutes <= 7) return 'soon';
  return 'normal';
}

function getStatusText(minutes: number): string {
  if (minutes <= 1) return 'NOW';
  if (minutes <= 3) return 'ARRIVING';
  if (minutes <= 7) return 'SOON';
  return 'ON TIME';
}

export function SubscriptionCard({ subscription, onDelete }: SubscriptionCardProps) {
  const { id, routeNo, stationName, arrivalMinutes, plateNo } = subscription;
  const statusVariant = getStatusVariant(arrivalMinutes);

  return (
    <Card
      variant="elevated"
      withScanlines
      className="group hover:border-transit-yellow transition-all duration-300"
    >
      <CardContent className="p-0">
        <div className="flex items-stretch">
          {/* Route Number Section */}
          <div className="flex-shrink-0 w-28 bg-transit-gray flex flex-col items-center justify-center p-4 border-r border-border">
            <span className="text-xs font-bold uppercase tracking-wider text-transit-gray-light mb-1">
              Route
            </span>
            <span className="text-2xl font-bold text-transit-yellow tracking-wide">
              {routeNo}
            </span>
          </div>

          {/* Main Info Section */}
          <div className="flex-1 p-4 flex flex-col justify-between min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h3 className="text-lg font-bold text-transit-yellow truncate">
                  {stationName}
                </h3>
                <p className="text-sm text-transit-gray-light font-mono mt-1">
                  {plateNo}
                </p>
              </div>
              <Badge
                variant={statusVariant}
                pulse={arrivalMinutes <= 3}
                glow={arrivalMinutes <= 3}
              >
                {getStatusText(arrivalMinutes)}
              </Badge>
            </div>

            <div className="flex items-end justify-between mt-4">
              <div className="text-xs text-transit-gray-light uppercase tracking-wider">
                Arrives in
              </div>
              {onDelete && (
                <button
                  onClick={() => onDelete(id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-xs text-transit-red hover:text-transit-red-dim uppercase tracking-wider font-bold"
                >
                  Remove
                </button>
              )}
            </div>
          </div>

          {/* LED Countdown Section */}
          <div className="flex-shrink-0 w-32 bg-transit-black flex flex-col items-center justify-center p-4 border-l border-border">
            <LEDCountdown
              minutes={arrivalMinutes}
              label="MIN"
              size="lg"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
