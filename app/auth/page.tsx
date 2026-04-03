'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')

    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        setError('メールアドレスまたはパスワードが正しくありません。')
      } else {
        router.push('/')
        router.refresh()
      }
    } else {
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) {
        setError(error.message)
      } else {
        setMessage('確認メールを送信しました。メールのリンクをクリックしてアカウントを有効化してください。')
      }
    }
    setLoading(false)
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
        <div className="border border-zinc-800 p-8">
          <h2 className="font-serif text-white text-lg tracking-[0.2em] uppercase text-center mb-8">
            {isLogin ? 'Welcome Back' : 'Join The Editor'}
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
                autoComplete={isLogin ? 'current-password' : 'new-password'}
                required
                minLength={6}
              />
            </div>

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
              {loading ? '...' : isLogin ? 'Enter' : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsLogin(!isLogin)
                setError('')
                setMessage('')
              }}
              className="text-zinc-500 text-xs tracking-[0.15em] uppercase hover:text-zinc-300 transition-colors"
            >
              {isLogin ? 'New here? Create an account →' : '← Already have an account? Sign in'}
            </button>
          </div>
        </div>

        {/* Free tier info */}
        {!isLogin && (
          <p className="text-center text-zinc-600 text-xs mt-6 tracking-wide">
            Free account includes 3 evaluations per month.
          </p>
        )}
      </div>
    </main>
  )
}
