'use client';

import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Divider } from '@/components/ui/Divider';

interface EmptyStateProps {
  onAddRoute: () => void;
}

export function EmptyState({ onAddRoute }: EmptyStateProps) {
  return (
    <Card variant="bordered" withNoise className="max-w-lg mx-auto">
      <CardContent className="py-12 px-8">
        <div className="flex flex-col items-center text-center">
          {/* Icon */}
          <div className="w-20 h-20 bg-transit-gray flex items-center justify-center mb-6">
            <svg
              className="w-10 h-10 text-transit-yellow"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M8 6v6" />
              <path d="M16 6v6" />
              <path d="M2 12h20" />
              <path d="M6 18h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v10a2 2 0 002 2z" />
              <circle cx="6" cy="18" r="2" />
              <circle cx="18" cy="18" r="2" />
            </svg>
          </div>

          {/* Title */}
          <h3 className="text-xl font-bold uppercase tracking-wider text-transit-yellow mb-3">
            No Subscriptions
          </h3>

          {/* Description */}
          <p className="text-transit-gray-light text-sm leading-relaxed mb-6">
            Start tracking your bus routes by adding your first subscription.
            <br />
            You will receive real-time arrival notifications.
          </p>

          <Divider variant="warning" className="w-full mb-6" />

          {/* CTA */}
          <Button onClick={onAddRoute} size="lg">
            + Add Your First Route
          </Button>

          {/* Hint */}
          <p className="text-xs text-transit-gray-light mt-4 uppercase tracking-wider">
            Search by station name or route number
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
