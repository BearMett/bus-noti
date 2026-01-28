'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';

export function RegisterForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
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
      <div className="space-y-2">
        <label
          htmlFor="name"
          className="block text-xs font-bold uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400"
        >
          Name <span className="text-zinc-400 dark:text-zinc-600 font-normal">(optional)</span>
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoComplete="name"
          placeholder="Your name"
          className="w-full bg-zinc-100 dark:bg-zinc-800/50 border-2 border-transparent
                     focus:border-amber-400 dark:focus:border-amber-500
                     rounded-none px-4 py-3.5 text-zinc-900 dark:text-white
                     placeholder:text-zinc-400 dark:placeholder:text-zinc-600
                     outline-none transition-all duration-200
                     font-mono text-sm tracking-wide"
        />
      </div>

      <div className="space-y-2">
        <label
          htmlFor="email"
          className="block text-xs font-bold uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400"
        >
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
          placeholder="you@example.com"
          className="w-full bg-zinc-100 dark:bg-zinc-800/50 border-2 border-transparent
                     focus:border-amber-400 dark:focus:border-amber-500
                     rounded-none px-4 py-3.5 text-zinc-900 dark:text-white
                     placeholder:text-zinc-400 dark:placeholder:text-zinc-600
                     outline-none transition-all duration-200
                     font-mono text-sm tracking-wide"
        />
      </div>

      <div className="space-y-2">
        <label
          htmlFor="password"
          className="block text-xs font-bold uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400"
        >
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="new-password"
          placeholder="Min. 8 characters"
          minLength={8}
          className="w-full bg-zinc-100 dark:bg-zinc-800/50 border-2 border-transparent
                     focus:border-amber-400 dark:focus:border-amber-500
                     rounded-none px-4 py-3.5 text-zinc-900 dark:text-white
                     placeholder:text-zinc-400 dark:placeholder:text-zinc-600
                     outline-none transition-all duration-200
                     font-mono text-sm tracking-wide"
        />
        <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1">
          Must be at least 8 characters
        </p>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-red-500 dark:text-red-400 text-sm font-medium bg-red-50 dark:bg-red-950/30 px-4 py-3 border-l-4 border-red-500">
          <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-amber-400 hover:bg-amber-300 dark:bg-amber-500 dark:hover:bg-amber-400
                   text-zinc-900 font-bold uppercase tracking-[0.15em] text-sm
                   px-6 py-4 transition-all duration-200
                   disabled:opacity-50 disabled:cursor-not-allowed
                   relative overflow-hidden group"
      >
        <span className={`inline-flex items-center gap-2 transition-transform duration-200 ${isLoading ? 'translate-y-8' : ''}`}>
          Create Account
          <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </span>
        {isLoading && (
          <span className="absolute inset-0 flex items-center justify-center">
            <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          </span>
        )}
      </button>
    </form>
  );
}
