import Link from 'next/link';
import { LoginForm } from '@/components/auth/LoginForm';
import { SocialLoginButtons } from '@/components/auth/SocialLoginButtons';
import { Logo } from '@/components/ui/Logo';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Divider } from '@/components/ui/Divider';
import { LEDDisplay } from '@/components/ui/LEDDisplay';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-transit-black relative overflow-hidden">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 grid-pattern opacity-30" />

      {/* Scanline Effect */}
      <div className="absolute inset-0 scanline-overlay pointer-events-none" />

      {/* Noise Texture */}
      <div className="absolute inset-0 noise-bg pointer-events-none" />

      {/* Warning Stripes Header */}
      <Divider variant="warning" className="h-3" />

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-12px)] p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-md">
          {/* Logo & Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <Logo size="lg" animated={true} showText={false} />
            </div>

            {/* LED Style Title */}
            <div className="mb-2">
              <LEDDisplay
                value="BUSNOTI"
                size="lg"
                color="yellow"
                glow={true}
                className="tracking-wider"
              />
            </div>

            {/* Subtitle with blinking cursor */}
            <p className="text-transit-gray-light text-sm uppercase tracking-[0.3em] font-mono">
              System Access Terminal
              <span className="animate-blink ml-1">_</span>
            </p>
          </div>

          {/* System Status Bar */}
          <div className="flex items-center justify-between px-4 py-2 bg-transit-dark border border-transit-gray mb-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-transit-green animate-glow" />
              <span className="text-xs font-mono uppercase tracking-wider text-transit-green">
                System Online
              </span>
            </div>
            <div className="text-xs font-mono text-transit-gray-light">
              AUTH_MODULE v2.1
            </div>
          </div>

          {/* Main Login Card */}
          <Card variant="bordered" withScanlines withNoise>
            <CardHeader className="border-b-2 border-transit-yellow bg-transit-dark/50">
              <div className="flex items-center gap-3 w-full">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 bg-transit-red animate-glow" />
                  <div className="w-2.5 h-2.5 bg-transit-yellow animate-glow" style={{ animationDelay: '0.3s' }} />
                  <div className="w-2.5 h-2.5 bg-transit-green animate-glow" style={{ animationDelay: '0.6s' }} />
                </div>
                <span className="text-xs font-bold uppercase tracking-[0.25em] text-transit-yellow">
                  {/* // */}Authentication Required
                </span>
              </div>
            </CardHeader>

            <CardContent className="space-y-6 p-6 sm:p-8">
              {/* Login Form */}
              <LoginForm />

              {/* Divider with label */}
              <Divider label="OR" variant="dashed" />

              {/* Social Login Buttons */}
              <SocialLoginButtons />
            </CardContent>
          </Card>

          {/* Register Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-transit-gray-light font-mono">
              <span className="text-transit-yellow">&gt;</span> New operator?{' '}
              <Link
                href="/register"
                className="text-transit-yellow hover:text-transit-green transition-colors underline underline-offset-4 decoration-transit-yellow/50 hover:decoration-transit-green font-bold uppercase tracking-wider"
              >
                Register Access
              </Link>
            </p>
          </div>

          {/* Security Notice */}
          <div className="mt-8 flex items-center justify-center gap-3 py-3 px-4 border border-transit-gray bg-transit-dark/30">
            <svg className="w-4 h-4 text-transit-yellow animate-flicker" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span className="text-xs font-mono uppercase tracking-wider text-transit-gray-light">
              256-Bit Encrypted Connection
            </span>
            <div className="w-1.5 h-1.5 rounded-full bg-transit-green animate-glow" />
          </div>

          {/* Footer Info */}
          <div className="mt-4 text-center">
            <p className="text-[10px] font-mono text-transit-gray uppercase tracking-widest">
              Transit Authority Network // Seoul-Gyeonggi Region
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Warning Stripes */}
      <div className="fixed bottom-0 left-0 right-0">
        <Divider variant="warning" className="h-2" />
      </div>
    </div>
  );
}
