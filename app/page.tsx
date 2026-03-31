'use client'

import { useState, useCallback, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'

const THEMES = [
  { id: 'business', label: 'Business', icon: '💼', description: 'Boardroom ready?' },
  { id: 'casual', label: 'Casual', icon: '☕', description: 'Effortlessly chic?' },
  { id: 'date', label: 'Date Night', icon: '🥂', description: 'Turn heads tonight?' },
  { id: 'party', label: 'Party', icon: '✨', description: 'Life of the party?' },
  { id: 'wedding', label: 'Wedding', icon: '💍', description: 'Celebrate in style?' },
  { id: 'funeral', label: 'Funeral', icon: '🖤', description: 'Dignified and respectful?' },
  { id: 'street', label: 'Street Style', icon: '👟', description: 'Own the sidewalk?' },
]

const STARS = [1, 2, 3, 4, 5]

const VIVIENNE_RULES = [
  "Fashion is not about comfort. It is about power.",
  "Mediocrity is the only thing I cannot forgive.",
  "A great outfit is armor. Wear it accordingly.",
]

function ViviennePortrait({ size = 120 }: { size?: number }) {
  return (
    <svg viewBox="0 0 120 160" width={size} height={size * 1.33}>
      <rect width="120" height="160" fill="#0a0a0a"/>
      <ellipse cx="60" cy="42" rx="30" ry="26" fill="#111"/>
      <rect x="30" y="42" width="60" height="22" fill="#111"/>
      <rect x="30" y="60" width="8" height="16" fill="#111"/>
      <rect x="82" y="60" width="8" height="16" fill="#111"/>
      <rect x="52" y="100" width="16" height="20" fill="#c8a882"/>
      <ellipse cx="60" cy="78" rx="22" ry="26" fill="#c8a882"/>
      <line x1="40" y1="65" x2="54" y2="62" stroke="#2a1a0a" strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="66" y1="62" x2="80" y2="65" stroke="#2a1a0a" strokeWidth="2.5" strokeLinecap="round"/>
      <rect x="36" y="68" width="20" height="12" rx="2" fill="#050505" stroke="#d4a017" strokeWidth="1.2"/>
      <rect x="64" y="68" width="20" height="12" rx="2" fill="#050505" stroke="#d4a017" strokeWidth="1.2"/>
      <line x1="56" y1="74" x2="64" y2="74" stroke="#d4a017" strokeWidth="1.2"/>
      <line x1="36" y1="74" x2="30" y2="72" stroke="#d4a017" strokeWidth="1"/>
      <line x1="84" y1="74" x2="90" y2="72" stroke="#d4a017" strokeWidth="1"/>
      <path d="M52 94 Q60 91 68 94" stroke="#8b4040" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      <path d="M52 94 Q60 97 68 94" stroke="#8b4040" strokeWidth="1" fill="#9a4545" opacity="0.7"/>
      <path d="M28 120 Q60 112 92 120 L98 160 H22 Z" fill="#080808"/>
      <path d="M46 100 Q60 96 74 100 L76 116 Q60 112 44 116 Z" fill="#0f0f0f"/>
      <circle cx="50" cy="118" r="2" fill="#e8e0d0" opacity="0.8"/>
      <circle cx="56" cy="115" r="2" fill="#e8e0d0" opacity="0.8"/>
      <circle cx="62" cy="114" r="2" fill="#e8e0d0" opacity="0.8"/>
      <circle cx="68" cy="115" r="2" fill="#e8e0d0" opacity="0.8"/>
      <circle cx="74" cy="118" r="2" fill="#e8e0d0" opacity="0.8"/>
      <circle cx="38" cy="82" r="3" fill="#d4a017" opacity="0.9"/>
      <circle cx="82" cy="82" r="3" fill="#d4a017" opacity="0.9"/>
    </svg>
  )
}

export default function Home() {
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null)
  const [image, setImage] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{
    stars: number
    comment: string
    advice?: string
  } | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [ruleIndex, setRuleIndex] = useState(0)

  useEffect(() => {
    setRuleIndex(Math.floor(Math.random() * VIVIENNE_RULES.length))
  }, [])

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (!file) return
    setImageFile(file)
    const url = URL.createObjectURL(file)
    setImage(url)
    setResult(null)
    setError(null)
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.webp'] },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024,
  })

  const handleSubmit = async () => {
    if (!image || !imageFile || !selectedTheme) return
    setLoading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('image', imageFile)
      formData.append('theme', selectedTheme)

      const res = await fetch('/api/evaluate', {
        method: 'POST',
        body: formData,
      })

      if (!res.ok) throw new Error('Evaluation failed')
      const data = await res.json()
      setResult(data)
    } catch (err) {
      setError('Something went wrong. Even Vivienne has bad days.')
    } finally {
      setLoading(false)
    }
  }

  const reset = () => {
    setImage(null)
    setImageFile(null)
    setResult(null)
    setSelectedTheme(null)
    setError(null)
  }

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
              Fashion, Rated
            </p>
          </div>
          <div className="text-right">
            <p className="text-zinc-500 text-xs tracking-widest uppercase">By</p>
            <p className="font-serif text-zinc-300 text-sm tracking-widest uppercase">Vivienne</p>
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-6 py-10">

        {/* ===== RESULT VIEW ===== */}
        {result && (
          <div>
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <div className="w-28 h-28 rounded-full overflow-hidden border border-gold-600 flex items-center justify-center bg-zinc-950">
                  <ViviennePortrait size={112} />
                </div>
              </div>
              <p className="font-serif text-zinc-500 text-xs tracking-[0.3em] uppercase">The Verdict</p>
            </div>

            <div className="vivienne-card rounded-none p-8 mb-8">
              <div className="flex justify-center gap-2 mb-3">
                {STARS.map(s => (
                  <span key={s} className={`text-4xl ${s <= result.stars ? 'star-filled' : 'star-empty'}`}>★</span>
                ))}
              </div>
              <div className="text-center mb-8">
                <span className="font-serif text-white text-4xl block leading-none mb-1">{result.stars} <span className="text-zinc-600 text-2xl">/ 5</span></span>
                <span className="font-serif text-zinc-500 text-xs tracking-[0.25em] uppercase">Vivienne's Verdict</span>
              </div>

              <hr className="gold-divider" />

              <blockquote className="font-serif text-xl text-zinc-100 italic leading-relaxed my-8 text-center">
                "{result.comment}"
              </blockquote>
              <p className="text-center text-zinc-600 text-xs tracking-[0.3em] uppercase">— Vivienne</p>

              {result.advice && (
                <div className="mt-8 px-6 py-5 bg-zinc-950 border-l-2 border-gold-600 text-left">
                  <p className="text-gold-500 text-xs tracking-[0.3em] uppercase mb-3">Vivienne's Advice</p>
                  <p className="text-zinc-300 text-sm leading-relaxed">{result.advice}</p>
                </div>
              )}

              <hr className="gold-divider mt-8" />

              {image && (
                <div className="mt-8">
                  <img src={image} alt="Your outfit" className="w-full max-h-72 object-cover opacity-60" />
                </div>
              )}
            </div>

            <div className="p-6 border border-gold-600 border-opacity-20 bg-zinc-950 mb-6 text-center">
              <p className="text-xs tracking-[0.3em] uppercase text-gold-500 mb-2">Premium Access</p>
              <p className="text-zinc-400 text-sm mb-5 leading-relaxed">
                Vivienne has more to say. Unlock detailed scores for outfit, accessories, bag & makeup — plus her personal improvement advice.
              </p>
              <button className="btn-gold w-full py-4 text-sm tracking-widest">
                Unlock Full Verdict — $4.99/mo
              </button>
            </div>

            <div className="text-center">
              <button onClick={reset} className="text-zinc-600 text-xs tracking-[0.3em] uppercase hover:text-zinc-400 transition-colors border-b border-zinc-800 pb-1">
                Submit Another Look
              </button>
            </div>
          </div>
        )}

        {/* ===== MAIN VIEW ===== */}
        {!result && (
          <>
            {/* Vivienne Hero */}
            <div className="text-center mb-12">

              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className="absolute inset-0 rounded-full border border-gold-600 opacity-40 scale-110"></div>
                  <div className="w-36 h-36 rounded-full overflow-hidden border border-zinc-700 flex items-center justify-center bg-zinc-950">
                    <ViviennePortrait size={144} />
                  </div>
                </div>
              </div>

              <h2 className="font-serif text-4xl text-white tracking-wide mb-2">Vivienne</h2>
              <p className="text-zinc-600 text-xs tracking-[0.35em] uppercase mb-1">Editor-in-Chief</p>
              <p className="text-zinc-700 text-xs tracking-[0.2em] uppercase mb-8">30 Years in Fashion · Zero Tolerance for Mediocrity</p>

              <hr className="gold-divider" />

              <blockquote className="font-serif text-2xl text-zinc-100 italic leading-relaxed my-8 px-4">
                "Impress me. I've been waiting."
              </blockquote>

              <p className="text-zinc-500 text-sm leading-relaxed mb-8 max-w-md mx-auto">
                Submit your outfit. Vivienne will rate your entire look — outfit, accessories, bag, makeup, and hairstyle —
                with the brutal honesty only 30 years in fashion can provide.
              </p>

            </div>

            {/* Theme Selection */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-5">
                <div className="flex-1 h-px bg-zinc-800"></div>
                <h3 className="font-serif text-lg text-white tracking-[0.2em] uppercase">1. Select Your Theme</h3>
                <div className="flex-1 h-px bg-zinc-800"></div>
              </div>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
                {THEMES.map(theme => (
                  <button
                    key={theme.id}
                    onClick={() => setSelectedTheme(theme.id)}
                    className={`p-4 text-left border transition-all duration-200 ${
                      selectedTheme === theme.id
                        ? 'border-gold-500 bg-zinc-900'
                        : 'border-zinc-800 hover:border-zinc-600'
                    }`}
                  >
                    <span className="text-xl block mb-1">{theme.icon}</span>
                    <span className="text-sm font-serif text-white block">{theme.label}</span>
                    <span className="text-xs text-zinc-600">{theme.description}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Upload */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-5">
                <div className="flex-1 h-px bg-zinc-800"></div>
                <h3 className="font-serif text-lg text-white tracking-[0.2em] uppercase">2. Submit Your Look</h3>
                <div className="flex-1 h-px bg-zinc-800"></div>
              </div>
              <div
                {...getRootProps()}
                className={`upload-zone p-10 text-center cursor-pointer transition-all ${isDragActive ? 'bg-zinc-900' : ''}`}
              >
                <input {...getInputProps()} />
                {image ? (
                  <div>
                    <img src={image} alt="Your outfit" className="max-h-64 mx-auto object-contain mb-3" />
                    <p className="text-zinc-600 text-xs tracking-widest uppercase">Click to change photo</p>
                  </div>
                ) : (
                  <div>
                    <div className="text-5xl mb-5">📸</div>
                    <p className="font-serif text-zinc-400 text-lg mb-2">
                      {isDragActive ? 'Drop it. Now.' : 'Drop your photo here'}
                    </p>
                    <p className="text-zinc-700 text-xs tracking-widest mb-4">or click to select · JPG, PNG, WEBP · Max 10MB</p>
                    <div className="border border-zinc-800 bg-zinc-950 px-4 py-3 text-left">
                      <p className="text-gold-600 text-xs tracking-wider uppercase mb-1">⚠ For Best Results</p>
                      <p className="text-zinc-600 text-xs leading-relaxed">Full-body photos are required for an accurate evaluation. Close-up or partial photos may result in an incomplete verdict.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={!image || !selectedTheme || loading}
              className={`w-full py-5 text-sm tracking-[0.3em] uppercase font-bold transition-all ${
                image && selectedTheme && !loading
                  ? 'btn-gold'
                  : 'bg-zinc-900 text-zinc-700 cursor-not-allowed'
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-3">
                  <span className="animate-spin text-lg">◐</span>
                  <span className="font-serif italic">Vivienne is deliberating...</span>
                </span>
              ) : (
                'Submit to Vivienne'
              )}
            </button>

            {error && (
              <p className="mt-4 text-center text-red-500 text-sm font-serif italic">{error}</p>
            )}
          </>
        )}

        {/* Footer */}
        <footer className="mt-16 text-center">
          <hr className="gold-divider" />
          <p className="text-zinc-800 text-xs tracking-[0.3em] uppercase mt-4">
            The Editor · Fashion, Rated · By Vivienne
          </p>
        </footer>
      </div>
    </main>
  )
}
