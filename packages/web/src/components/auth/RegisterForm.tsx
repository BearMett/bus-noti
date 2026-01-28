'use client';

import { useState, useMemo } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

// Password strength calculation
function calculatePasswordStrength(password: string): {
  score: number;
  label: string;
  color: string;
} {
  let score = 0;

  if (password.length === 0) {
    return { score: 0, label: 'EMPTY', color: 'transit-gray' };
  }

  // Length checks
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (password.length >= 16) score += 1;

  // Character type checks
  if (/[a-z]/.test(password)) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^a-zA-Z0-9]/.test(password)) score += 1;

  // Normalize to 0-4 scale
  const normalizedScore = Math.min(4, Math.floor(score / 1.75));

  const strengthMap: Record<number, { label: string; color: string }> = {
    0: { label: 'WEAK', color: 'transit-red' },
    1: { label: 'FAIR', color: 'transit-red' },
    2: { label: 'GOOD', color: 'transit-yellow' },
    3: { label: 'STRONG', color: 'transit-green' },
    4: { label: 'SECURE', color: 'transit-green' },
  };

  return {
    score: normalizedScore,
    ...strengthMap[normalizedScore],
  };
}

// LED Password Strength Indicator
function PasswordStrengthIndicator({ password }: { password: string }) {
  const strength = useMemo(() => calculatePasswordStrength(password), [password]);

  return (
    <div className="mt-3 space-y-2">
      {/* LED Bar */}
      <div className="flex items-center gap-1">
        {[0, 1, 2, 3, 4].map((index) => {
          const isActive = index <= strength.score && password.length > 0;
          let ledColor = 'bg-transit-gray';

          if (isActive) {
            if (index <= 1) ledColor = 'bg-transit-red';
            else if (index <= 2) ledColor = 'bg-transit-yellow';
            else ledColor = 'bg-transit-green';
          }

          return (
            <div
              key={index}
              className={`
                h-2 flex-1 transition-all duration-300
                ${ledColor}
                ${isActive ? `shadow-[0_0_8px_var(--${ledColor.replace('bg-', '')})]` : 'opacity-30'}
              `}
              style={{
                boxShadow: isActive
                  ? index <= 1
                    ? '0 0 8px var(--transit-red)'
                    : index <= 2
                      ? '0 0 8px var(--transit-yellow)'
                      : '0 0 8px var(--transit-green)'
                  : 'none',
              }}
            />
          );
        })}
      </div>

      {/* Status Text */}
      {password.length > 0 && (
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono tracking-wider text-transit-gray-light uppercase">
            Password Strength
          </span>
          <span
            className={`text-xs font-bold tracking-wider text-${strength.color}`}
            style={{
              color:
                strength.color === 'transit-red'
                  ? 'var(--transit-red)'
                  : strength.color === 'transit-yellow'
                    ? 'var(--transit-yellow)'
                    : strength.color === 'transit-green'
                      ? 'var(--transit-green)'
                      : 'var(--transit-gray)',
              textShadow:
                strength.score >= 3
                  ? '0 0 8px var(--transit-green)'
                  : undefined,
            }}
          >
            [{strength.label}]
          </span>
        </div>
      )}
    </div>
  );
}

export function RegisterForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();

  const passwordMismatch =
    confirmPassword.length > 0 && password !== confirmPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setIsLoading(true);

    try {
      await register({ email, password, name: name || undefined });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Name Field */}
      <Input
        id="name"
        type="text"
        label={
          <>
            Name{' '}
            <span className="text-transit-gray-light font-normal text-[10px]">
              (Optional)
            </span>
          </>
        }
        value={name}
        onChange={(e) => setName(e.target.value)}
        autoComplete="name"
        placeholder="Your display name"
        hint="This will be shown on your profile"
      />

      {/* Email Field */}
      <Input
        id="email"
        type="email"
        label="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        autoComplete="email"
        placeholder="user@example.com"
      />

      {/* Password Field */}
      <div>
        <Input
          id="password"
          type="password"
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="new-password"
          placeholder="Min. 8 characters"
          minLength={8}
        />
        <PasswordStrengthIndicator password={password} />
      </div>

      {/* Confirm Password Field */}
      <Input
        id="confirmPassword"
        type="password"
        label="Confirm Password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        required
        autoComplete="new-password"
        placeholder="Re-enter your password"
        error={passwordMismatch ? 'Passwords do not match' : undefined}
      />

      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-3 text-transit-red text-sm font-medium bg-transit-red/10 px-4 py-3 border-l-4 border-transit-red">
          <svg
            className="w-5 h-5 flex-shrink-0 animate-blink"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <span className="font-mono tracking-wide">{error}</span>
        </div>
      )}

      {/* Submit Button */}
      <Button
        type="submit"
        fullWidth
        size="lg"
        loading={isLoading}
        disabled={isLoading || passwordMismatch}
        className="group"
      >
        {!isLoading && (
          <span className="inline-flex items-center gap-2">
            Create Account
            <svg
              className="w-4 h-4 transition-transform group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </span>
        )}
      </Button>

      {/* Terms Notice */}
      <p className="text-[10px] text-transit-gray-light text-center leading-relaxed">
        By creating an account, you agree to our{' '}
        <a
          href="/terms"
          className="text-transit-yellow hover:underline underline-offset-2"
        >
          Terms of Service
        </a>{' '}
        and{' '}
        <a
          href="/privacy"
          className="text-transit-yellow hover:underline underline-offset-2"
        >
          Privacy Policy
        </a>
      </p>
    </form>
  );
}
