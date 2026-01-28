import Link from 'next/link';
import { LoginForm } from '@/components/auth/LoginForm';
import { SocialLoginButtons } from '@/components/auth/SocialLoginButtons';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col">
      {/* Decorative header bar */}
      <div className="h-2 bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500" />

      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-md">
          {/* Logo & Header */}
          <div className="text-center mb-10">
            {/* Transit-inspired logo */}
            <div className="inline-flex items-center justify-center mb-6">
              <div className="relative">
                <div className="w-16 h-16 bg-amber-400 dark:bg-amber-500 flex items-center justify-center">
                  <svg
                    className="w-9 h-9 text-zinc-900"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"
                    />
                  </svg>
                </div>
                {/* Animated ping effect */}
                <div className="absolute -top-1 -right-1 w-4 h-4">
                  <span className="absolute inline-flex h-full w-full animate-ping bg-green-400 opacity-75 rounded-full" />
                  <span className="relative inline-flex h-4 w-4 bg-green-500 rounded-full" />
                </div>
              </div>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-zinc-900 dark:text-white tracking-tight">
              BusNoti
            </h1>
            <p className="mt-2 text-zinc-500 dark:text-zinc-400 text-sm tracking-wide">
              Real-time bus arrival notifications
            </p>
          </div>

          {/* Main card */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xl shadow-zinc-200/50 dark:shadow-zinc-950/50">
            {/* Card header */}
            <div className="border-b border-zinc-100 dark:border-zinc-800 px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                  <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" style={{ animationDelay: '0.2s' }} />
                  <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" style={{ animationDelay: '0.4s' }} />
                </div>
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500">
                  Sign In
                </span>
              </div>
            </div>

            {/* Card content */}
            <div className="p-6 sm:p-8 space-y-6">
              <LoginForm />

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-zinc-200 dark:border-zinc-700" />
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-white dark:bg-zinc-900 px-4 text-xs font-medium uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
                    or
                  </span>
                </div>
              </div>

              <SocialLoginButtons />
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              New to BusNoti?{' '}
              <Link
                href="/register"
                className="font-semibold text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 underline underline-offset-4 decoration-amber-600/30 dark:decoration-amber-400/30 hover:decoration-amber-600 dark:hover:decoration-amber-400 transition-colors"
              >
                Create an account
              </Link>
            </p>
          </div>

          {/* Transit-style info bar */}
          <div className="mt-8 flex items-center justify-center gap-2 text-xs text-zinc-400 dark:text-zinc-600">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span className="tracking-wide">Secure authentication</span>
          </div>
        </div>
      </div>
    </div>
  );
}
