import Link from 'next/link';
import { RegisterForm } from '@/components/auth/RegisterForm';
import { SocialLoginButtons } from '@/components/auth/SocialLoginButtons';
import { Logo } from '@/components/ui/Logo';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Divider } from '@/components/ui/Divider';

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-transit-black flex flex-col relative overflow-hidden">
      {/* Background Grid Pattern */}
      <div
        className="absolute inset-0 grid-pattern opacity-30"
        aria-hidden="true"
      />

      {/* Scanline Effect Overlay */}
      <div className="absolute inset-0 scanline-overlay pointer-events-none" />

      {/* Noise Texture */}
      <div className="absolute inset-0 noise-bg pointer-events-none" />

      {/* Warning Stripe Header */}
      <Divider variant="warning" className="h-3 relative z-10" />

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8 relative z-10">
        <div className="w-full max-w-md animate-slide-up">
          {/* Logo & Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-6">
              <Logo size="lg" showText={false} animated />
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold uppercase tracking-tight text-transit-yellow led-glow">
              Join BusNoti
            </h1>
            <p className="mt-2 text-transit-gray-light text-sm tracking-[0.15em] uppercase">
              <span className="animate-blink mr-1">&#9654;</span>
              Create your account
            </p>
          </div>

          {/* Main Card */}
          <Card variant="bordered" withScanlines withNoise>
            <CardHeader>
              <div className="flex items-center gap-3 w-full">
                {/* Status LEDs */}
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 bg-transit-green rounded-full animate-pulse shadow-[0_0_8px_var(--transit-green)]" />
                  <div
                    className="w-2.5 h-2.5 bg-transit-green rounded-full animate-pulse shadow-[0_0_8px_var(--transit-green)]"
                    style={{ animationDelay: '0.2s' }}
                  />
                  <div
                    className="w-2.5 h-2.5 bg-transit-green rounded-full animate-pulse shadow-[0_0_8px_var(--transit-green)]"
                    style={{ animationDelay: '0.4s' }}
                  />
                </div>
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-transit-yellow">
                  New Registration
                </span>
                {/* System Status */}
                <div className="ml-auto flex items-center gap-2">
                  <span className="text-[10px] font-mono text-transit-gray-light tracking-wider">
                    SYS:READY
                  </span>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              <RegisterForm />

              <Divider label="or continue with" />

              <SocialLoginButtons />
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-sm text-transit-gray-light">
              Already have an account?{' '}
              <Link
                href="/login"
                className="font-bold text-transit-yellow hover:text-transit-yellow-dim underline underline-offset-4 decoration-transit-yellow/30 hover:decoration-transit-yellow transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>

          {/* Transit-style Info Bar */}
          <div className="mt-6 flex items-center justify-center gap-2 text-xs text-transit-gray-light">
            <svg
              className="w-4 h-4 text-transit-green"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
            <span className="tracking-[0.1em] uppercase">
              Secure Data Protection
            </span>
          </div>

          {/* System Info */}
          <div className="mt-4 text-center">
            <span className="text-[10px] font-mono text-transit-gray tracking-widest">
              BUSNOTI // REG-TERMINAL // v1.0
            </span>
          </div>
        </div>
      </div>

      {/* Warning Stripe Footer */}
      <Divider variant="warning" className="h-2 relative z-10" />
    </div>
  );
}
