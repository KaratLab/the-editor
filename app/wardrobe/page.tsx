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

const THEME_ICONS: Record<string, string> = {
  business: '💼',
  casual: '☕',
  date: '🥂',
  party: '✨',
  wedding: '💍',
  funeral: '🖤',
  street: '👟',
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
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [deleting, setDeleting] = useState(false)

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
        .not('image_url', 'is', null)
        .order('created_at', { ascending: false })

      if (!error && data) {
        setEvaluations(data)
      }
      setLoading(false)
    }
    load()
  }, [router])

  const handleDelete = async () => {
    if (!selected) return
    setDeleting(true)

    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/auth')
        return
      }

      const res = await fetch('/api/delete-evaluation', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          evaluationId: selected.id,
          imageUrl: selected.image_url,
        }),
      })

      if (res.ok) {
        setEvaluations((prev) => prev.filter((ev) => ev.id !== selected.id))
        setSelected(null)
        setConfirmDelete(false)
      } else {
        alert('Failed to delete. Please try again.')
      }
    } catch {
      alert('Failed to delete. Please try again.')
    } finally {
      setDeleting(false)
    }
  }

  const closeModal = () => {
    setSelected(null)
    setConfirmDelete(false)
  }

  return (
    <main className="min-h-screen bg-black">
      {/* Header */}
      <header className="border-b border-zinc-900 px-4 sm:px-6 py-4 sm:py-5">
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

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        {loading ? (
          <div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="aspect-square skeleton rounded-none" />
              ))}
            </div>
            <div className="flex justify-center gap-1.5 mt-8 loading-dots">
              <span></span><span></span><span></span>
            </div>
          </div>
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
                onClick={() => { setSelected(ev); setConfirmDelete(false) }}
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
                    <span className="text-3xl">{THEME_ICONS[ev.theme] || '👗'}</span>
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
          onClick={closeModal}
        >
          <div
            className="bg-zinc-950 border border-zinc-800 max-w-lg w-full max-h-[92vh] overflow-y-auto mx-2"
            onClick={(e) => e.stopPropagation()}
          >
            {selected.image_url && (
              <img
                src={selected.image_url}
                alt={selected.theme}
                className="w-full aspect-square object-cover"
              />
            )}
            <div className="p-4 sm:p-6">
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
                {new Date(selected.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>

              {/* Delete confirmation */}
              {confirmDelete ? (
                <div className="mt-6 border border-zinc-700 p-4">
                  <p className="text-zinc-400 text-xs tracking-wider text-center mb-4">
                    Remove this look permanently?
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setConfirmDelete(false)}
                      className="flex-1 py-2 border border-zinc-700 text-zinc-500 text-xs tracking-widest uppercase hover:border-zinc-500 transition-colors"
                      disabled={deleting}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleDelete}
                      className="flex-1 py-2 border border-red-900 text-red-600 text-xs tracking-widest uppercase hover:border-red-700 hover:text-red-500 transition-colors disabled:opacity-50"
                      disabled={deleting}
                    >
                      {deleting ? 'Removing...' : 'Remove'}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="mt-4 flex gap-3">
                  <button
                    onClick={closeModal}
                    className="flex-1 py-2 border border-zinc-700 text-zinc-500 text-xs tracking-widest uppercase hover:border-zinc-500 transition-colors"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => setConfirmDelete(true)}
                    className="py-2 px-4 border border-zinc-800 text-zinc-600 text-xs tracking-widest uppercase hover:border-red-900 hover:text-red-700 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
