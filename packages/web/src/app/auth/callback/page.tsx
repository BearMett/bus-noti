'use client';

import { Suspense, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

function AuthCallbackContent() {
  const searchParams = useSearchParams();
  const { handleOAuthCallback } = useAuth();
  const processedRef = useRef(false);

  const accessToken = searchParams.get('accessToken');
  const refreshToken = searchParams.get('refreshToken');
  const error = searchParams.get('error') ||
    (!accessToken || !refreshToken ? 'Invalid callback parameters' : null);

  useEffect(() => {
    if (processedRef.current) return;
    if (accessToken && refreshToken) {
      processedRef.current = true;
      handleOAuthCallback(accessToken, refreshToken);
    }
  }, [accessToken, refreshToken, handleOAuthCallback]);

  if (error) {
    return (
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-6 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
          <svg
            className="w-8 h-8 text-red-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>
        <h1 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">
          Authentication Failed
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 mb-6">{error}</p>
        <a
          href="/login"
          className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 dark:bg-amber-500 dark:hover:bg-amber-400 text-zinc-900 font-bold uppercase tracking-wider text-sm px-6 py-3 transition-colors"
        >
          Back to Login
        </a>
      </div>
    );
  }

  return (
    <div className="text-center">
      <div className="relative w-16 h-16 mx-auto mb-6">
        <div className="absolute inset-0 bg-amber-400/20 dark:bg-amber-500/20 rounded-full animate-ping" />
        <div className="relative w-16 h-16 bg-amber-400 dark:bg-amber-500 rounded-full flex items-center justify-center">
          <svg
            className="w-8 h-8 text-zinc-900 animate-spin"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        </div>
      </div>
      <h1 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">
        Completing Sign In
      </h1>
      <p className="text-zinc-500 dark:text-zinc-400">Please wait...</p>
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="text-center">
      <div className="relative w-16 h-16 mx-auto mb-6">
        <div className="absolute inset-0 bg-amber-400/20 dark:bg-amber-500/20 rounded-full animate-ping" />
        <div className="relative w-16 h-16 bg-amber-400 dark:bg-amber-500 rounded-full flex items-center justify-center">
          <svg
            className="w-8 h-8 text-zinc-900 animate-spin"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        </div>
      </div>
      <h1 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">
        Loading...
      </h1>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col">
      <div className="h-2 bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500" />
      <div className="flex-1 flex items-center justify-center p-4">
        <Suspense fallback={<LoadingFallback />}>
          <AuthCallbackContent />
        </Suspense>
      </div>
    </div>
  );
}
