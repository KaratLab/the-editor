'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

const THEME_LABELS: Record<string, string> = {
  business: 'Business 💼',
  casual: 'Casual ☕',
  date: 'Date Night 🥂',
  party: 'Party ✨',
  wedding: 'Wedding 💍',
  funeral: 'Funeral 🖤',
  street: 'Street Style 👟',
}

type Evaluation = {
  id: string
  theme: string
  stars: number
  comment: string | null
  advice: string | null
  image_url: string | null
  created_at: string
}

export default function WardrobePage() {
  const router = useRouter()
  const [evaluations, setEvaluations] = useState<Evaluation[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<Evaluation | null>(null)

  useEffect(() => {
    const load = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/auth')
        return
      }

      const { data, error } = await supabase
        .from('evaluations')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })

      if (!error && data) {
        setEvaluations(data)
      }
      setLoading(false)
    }
    load()
  }, [router])

  return (
    <main className="min-h-screen bg-black">
      {/* Header */}
      <header className="border-b border-zinc-900 px-6 py-5">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-serif tracking-[0.4em] uppercase gold-text">
              The Editor
            </h1>
            <p className="text-xs text-zinc-600 tracking-[0.3em] uppercase mt-1">
              My Wardrobe
            </p>
          </div>
          <Link
            href="/"
            className="text-zinc-500 text-xs tracking-widest uppercase hover:text-zinc-300 transition-colors"
          >
            ← Back
          </Link>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-6 py-10">
        {loading ? (
          <p className="text-zinc-600 font-serif italic text-center">Vivienne is reviewing your history...</p>
        ) : evaluations.length === 0 ? (
          <div className="text-center py-20">
            <p className="font-serif text-zinc-500 italic text-lg mb-4">No evaluations yet.</p>
            <Link href="/" className="text-gold-500 text-xs tracking-widest uppercase hover:text-gold-400">
              Submit your first look →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {evaluations.map((ev) => (
              <button
                key={ev.id}
                onClick={() => setSelected(ev)}
                className="group relative aspect-square bg-zinc-950 border border-zinc-800 overflow-hidden hover:border-gold-600 transition-colors"
              >
                {ev.image_url ? (
                  <img
                    src={ev.image_url}
                    alt={ev.theme}
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-3xl">{THEME_LABELS[ev.theme]?.split(' ')[1] || '👗'}</span>
                  </div>
                )}
                <div className="absolute bottom-0 left-0 right-0 bg-black/70 px-2 py-1.5">
                  <p className="text-gold-500 text-xs tracking-wider">{'★'.repeat(ev.stars)}{'☆'.repeat(5 - ev.stars)}</p>
                  <p className="text-zinc-400 text-xs truncate">{THEME_LABELS[ev.theme] || ev.theme}</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selected && (
        <div
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 px-4 py-8"
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-zinc-950 border border-zinc-800 max-w-lg w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {selected.image_url && (
              <img
                src={selected.image_url}
                alt={selected.theme}
                className="w-full aspect-square object-cover"
              />
            )}
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <p className="text-gold-500 text-lg tracking-wider">{'★'.repeat(selected.stars)}{'☆'.repeat(5 - selected.stars)}</p>
                <p className="text-zinc-500 text-xs">{THEME_LABELS[selected.theme] || selected.theme}</p>
              </div>
              {selected.comment && (
                <div className="mb-4">
                  <p className="text-zinc-500 text-xs tracking-widest uppercase mb-2">Vivienne's Verdict</p>
                  <p className="font-serif text-zinc-300 text-sm leading-relaxed italic">"{selected.comment}"</p>
                </div>
              )}
              {selected.advice && (
                <div className="mb-4">
                  <p className="text-zinc-500 text-xs tracking-widest uppercase mb-2">Styling Advice</p>
                  <p className="text-zinc-400 text-sm leading-relaxed">{selected.advice}</p>
                </div>
              )}
              <p className="text-zinc-700 text-xs mt-4">
                {new Date(selected.created_at).toLocaleDateString('ja-JP')}
              </p>
              <button
                onClick={() => setSelected(null)}
                className="mt-4 w-full py-2 border border-zinc-700 text-zinc-500 text-xs tracking-widest uppercase hover:border-zinc-500 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
