'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

type Status = 'waiting' | 'ready' | 'success' | 'invalid'

export default function ResetPasswordPage() {
  const router = useRouter()
  const [status, setStatus] = useState<Status>('waiting')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Supabase fires PASSWORD_RECOVERY when the user arrives via the reset link
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setStatus('ready')
      }
    })

    // Also check if already in a recovery session (e.g. on refresh)
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setStatus('ready')
    })

    // If no event fires within 5s, mark as invalid link
    const timeout = setTimeout(() => {
      setStatus((prev) => (prev === 'waiting' ? 'invalid' : prev))
    }, 5000)

    return () => {
      subscription.unsubscribe()
      clearTimeout(timeout)
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }
    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)
    const { error } = await supabase.auth.updateUser({ password })
    setLoading(false)

    if (error) {
      setError(error.message)
    } else {
      setStatus('success')
      setTimeout(() => router.push('/'), 2500)
    }
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
        </div>

        <div className="border border-zinc-800 p-8">

          {/* Waiting for Supabase token */}
          {status === 'waiting' && (
            <p className="font-serif text-zinc-500 italic text-center text-sm">
              Verifying your link...
            </p>
          )}

          {/* Invalid / expired link */}
          {status === 'invalid' && (
            <div className="text-center">
              <p className="font-serif text-zinc-300 text-lg mb-3">Link Expired</p>
              <p className="text-zinc-500 text-xs tracking-wide mb-6">
                This reset link is invalid or has expired. Please request a new one.
              </p>
              <button
                onClick={() => router.push('/auth')}
                className="text-zinc-500 text-xs tracking-[0.15em] uppercase hover:text-zinc-300 transition-colors"
              >
                ← Back to sign in
              </button>
            </div>
          )}

          {/* New password form */}
          {status === 'ready' && (
            <>
              <h2 className="font-serif text-white text-lg tracking-[0.2em] uppercase text-center mb-8">
                Set New Password
              </h2>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="text-zinc-500 text-xs tracking-[0.15em] uppercase block mb-2">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-700 text-white px-4 py-3 text-sm focus:outline-none focus:border-yellow-700 transition-colors"
                    autoComplete="new-password"
                    required
                    minLength={6}
                  />
                </div>
                <div>
                  <label className="text-zinc-500 text-xs tracking-[0.15em] uppercase block mb-2">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-700 text-white px-4 py-3 text-sm focus:outline-none focus:border-yellow-700 transition-colors"
                    autoComplete="new-password"
                    required
                    minLength={6}
                  />
                </div>

                {error && (
                  <p className="text-red-400 text-sm text-center font-serif italic">{error}</p>
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
                  ) : 'Update Password'}
                </button>
              </form>
            </>
          )}

          {/* Success */}
          {status === 'success' && (
            <div className="text-center py-4">
              <p className="font-serif text-white text-lg mb-3">Password Updated</p>
              <p className="text-zinc-500 text-xs tracking-wide">
                Redirecting you to The Editor...
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
