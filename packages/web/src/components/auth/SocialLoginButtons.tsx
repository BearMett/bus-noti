'use client';

import { Button } from '@/components/ui/Button';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export function SocialLoginButtons() {
  const handleGoogleLogin = () => {
    window.location.href = `${API_URL}/auth/google`;
  };

  const handleGithubLogin = () => {
    window.location.href = `${API_URL}/auth/github`;
  };

  return (
    <div className="space-y-3">
      {/* Section Header */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-transit-gray-light text-xs font-mono">{'//'}</span>
        <span className="text-xs font-mono uppercase tracking-wider text-transit-gray-light">
          External Auth Providers
        </span>
      </div>

      {/* Google Login */}
      <button
        onClick={handleGoogleLogin}
        type="button"
        className="w-full flex items-center justify-center gap-3
                   bg-transit-dark
                   border-2 border-transit-gray
                   hover:border-transit-yellow
                   hover:bg-transit-gray/20
                   text-transit-yellow
                   font-bold uppercase tracking-wider text-sm
                   px-6 py-3.5
                   transition-all duration-150
                   group relative overflow-hidden"
      >
        {/* Hover Effect Line */}
        <span className="absolute left-0 top-0 h-full w-1 bg-transit-yellow transform -translate-x-full group-hover:translate-x-0 transition-transform duration-150" />

        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path
            className="fill-transit-yellow group-hover:fill-white transition-colors"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            className="fill-transit-green group-hover:fill-white transition-colors"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            className="fill-transit-yellow-dim group-hover:fill-white transition-colors"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            className="fill-transit-red group-hover:fill-white transition-colors"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>

        <span className="font-mono">Google Auth</span>

        <svg className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
        </svg>
      </button>

      {/* GitHub Login */}
      <button
        onClick={handleGithubLogin}
        type="button"
        className="w-full flex items-center justify-center gap-3
                   bg-transit-dark
                   border-2 border-transit-gray
                   hover:border-transit-yellow
                   hover:bg-transit-gray/20
                   text-transit-yellow
                   font-bold uppercase tracking-wider text-sm
                   px-6 py-3.5
                   transition-all duration-150
                   group relative overflow-hidden"
      >
        {/* Hover Effect Line */}
        <span className="absolute left-0 top-0 h-full w-1 bg-transit-yellow transform -translate-x-full group-hover:translate-x-0 transition-transform duration-150" />

        <svg className="w-5 h-5 text-transit-yellow group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
          />
        </svg>

        <span className="font-mono">GitHub Auth</span>

        <svg className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
        </svg>
      </button>

      {/* Provider Status */}
      <div className="flex items-center justify-center gap-4 pt-2">
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-transit-green animate-glow" />
          <span className="text-[10px] font-mono uppercase tracking-wider text-transit-gray-light">
            OAuth 2.0
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-transit-green animate-glow" />
          <span className="text-[10px] font-mono uppercase tracking-wider text-transit-gray-light">
            Secure
          </span>
        </div>
      </div>
    </div>
  );
}
