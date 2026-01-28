'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login({ email, password });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Email Field */}
      <div className="space-y-1">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-transit-yellow text-xs font-mono">&gt;</span>
          <label
            htmlFor="email"
            className="text-xs font-bold uppercase tracking-[0.2em] text-transit-yellow font-mono"
          >
            Operator ID
          </label>
        </div>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
          placeholder="operator@transit.go.kr"
          className="font-mono"
        />
      </div>

      {/* Password Field */}
      <div className="space-y-1">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-transit-yellow text-xs font-mono">&gt;</span>
          <label
            htmlFor="password"
            className="text-xs font-bold uppercase tracking-[0.2em] text-transit-yellow font-mono"
          >
            Access Code
          </label>
        </div>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
          placeholder="**********************"
          className="font-mono"
        />
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-3 text-transit-red text-sm font-medium bg-transit-red/10 px-4 py-3 border-l-4 border-transit-red animate-flicker">
          <div className="flex items-center gap-2">
            <span className="animate-blink font-mono text-lg">!</span>
            <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <span className="font-mono uppercase tracking-wider text-xs">
            ERROR: {error}
          </span>
        </div>
      )}

      {/* Submit Button */}
      <Button
        type="submit"
        loading={isLoading}
        fullWidth
        size="lg"
        className="mt-6 group"
      >
        <span className="flex items-center justify-center gap-3">
          {!isLoading && (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
              <span>Initialize Session</span>
              <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </>
          )}
        </span>
      </Button>

      {/* Forgot Password Link */}
      <div className="text-center pt-2">
        <a
          href="/forgot-password"
          className="text-xs font-mono uppercase tracking-wider text-transit-gray-light hover:text-transit-yellow transition-colors"
        >
          [ Reset Access Code ]
        </a>
      </div>
    </form>
  );
}
