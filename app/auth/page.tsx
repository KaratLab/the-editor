'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

type Mode = 'login' | 'signup' | 'forgot'

export default function AuthPage() {
  const [mode, setMode] = useState<Mode>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const router = useRouter()

  const switchMode = (next: Mode) => {
    setMode(next)
    setError('')
    setMessage('')
    setPassword('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')

    if (mode === 'login') {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        setError('Incorrect email or password.')
      } else {
        router.push('/')
        router.refresh()
      }

    } else if (mode === 'signup') {
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) {
        setError(error.message)
      } else {
        setMessage('Check your inbox — a confirmation link is on its way.')
      }

    } else if (mode === 'forgot') {
      const redirectTo = `${window.location.origin}/auth/reset-password`
      const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo })
      if (error) {
        setError(error.message)
      } else {
        setMessage('If that email exists in our system, a reset link has been sent.')
      }
    }

    setLoading(false)
  }

  const titles: Record<Mode, string> = {
    login: 'Welcome Back',
    signup: 'Join The Editor',
    forgot: 'Reset Password',
  }

  const buttonLabels: Record<Mode, string> = {
    login: 'Enter',
    signup: 'Create Account',
    forgot: 'Send Reset Link',
  }

  return (
    <main className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-zinc-600 text-xs tracking-[0.3em] uppercase mb-2">By Vivienne</p>
          <h1 className="font-serif text-4xl tracking-[0.3em] text-white mb-1">THE EDITOR</h1>
          <p className="text-zinc-500 text-xs tracking-[0.2em] uppercase">Fashion, Rated</p>
          <div className="h-px bg-gradient-to-r from-transparent via-yellow-700 to-transparent mt-6 mb-6"></div>
          <p className="font-serif text-zinc-400 italic text-sm">&ldquo;Impress me. I&apos;ve been waiting.&rdquo;</p>
        </div>

        {/* Form */}
        <div className="border border-zinc-800 p-6 sm:p-8">
          <h2 className="font-serif text-white text-lg tracking-[0.2em] uppercase text-center mb-8">
            {titles[mode]}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-zinc-500 text-xs tracking-[0.15em] uppercase block mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-700 text-white px-4 py-3 text-sm focus:outline-none focus:border-yellow-700 transition-colors"
                placeholder="your@email.com"
                required
              />
            </div>

            {mode !== 'forgot' && (
              <div>
                <label className="text-zinc-500 text-xs tracking-[0.15em] uppercase block mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-700 text-white px-4 py-3 text-sm focus:outline-none focus:border-yellow-700 transition-colors"
                  placeholder=""
                  autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                  required
                  minLength={6}
                />
              </div>
            )}

            {mode === 'login' && (
              <div className="text-right -mt-2">
                <button
                  type="button"
                  onClick={() => switchMode('forgot')}
                  className="text-zinc-600 text-xs tracking-[0.1em] hover:text-zinc-400 transition-colors"
                >
                  Forgot password?
                </button>
              </div>
            )}

            {error && (
              <p className="text-red-400 text-sm text-center font-serif italic">{error}</p>
            )}
            {message && (
              <p className="text-green-400 text-sm text-center font-serif italic">{message}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-yellow-800 to-yellow-600 text-black font-bold tracking-[0.2em] uppercase py-4 text-sm hover:from-yellow-700 hover:to-yellow-500 transition-all disabled:opacity-50 mt-2"
            >
              {loading ? (
                <span className="loading-dots flex justify-center gap-1.5">
                  <span></span><span></span><span></span>
                </span>
              ) : buttonLabels[mode]}
            </button>
          </form>

          <div className="mt-6 text-center space-y-3">
            {mode === 'login' && (
              <button
                onClick={() => switchMode('signup')}
                className="block w-full text-zinc-500 text-xs tracking-[0.15em] uppercase hover:text-zinc-300 transition-colors"
              >
                New here? Create an account →
              </button>
            )}
            {mode === 'signup' && (
              <button
                onClick={() => switchMode('login')}
                className="block w-full text-zinc-500 text-xs tracking-[0.15em] uppercase hover:text-zinc-300 transition-colors"
              >
                ← Already have an account? Sign in
              </button>
            )}
            {mode === 'forgot' && (
              <button
                onClick={() => switchMode('login')}
                className="block w-full text-zinc-500 text-xs tracking-[0.15em] uppercase hover:text-zinc-300 transition-colors"
              >
                ← Back to sign in
              </button>
            )}
          </div>
        </div>

        {/* Free tier info */}
        {mode === 'signup' && (
          <p className="text-center text-zinc-600 text-xs mt-6 tracking-wide">
            Free account includes 3 evaluations per month.
          </p>
        )}
      </div>
    </main>
  )
}
