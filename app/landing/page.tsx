'use client'

import Link from 'next/link'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black text-white font-serif overflow-x-hidden">
      {/* Subtle grain overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '128px 128px',
        }}
      />

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-8 py-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <span
            className="text-2xl tracking-[0.25em] uppercase font-light"
            style={{ color: '#C9A84C', letterSpacing: '0.3em' }}
          >
            The Editor
          </span>
        </div>
        <nav className="flex items-center gap-6">
          <Link
            href="/auth"
            className="text-sm tracking-widest uppercase text-white/60 hover:text-white transition-colors duration-300"
          >
            Sign In
          </Link>
          <Link
            href="/auth?mode=signup"
            className="text-sm tracking-widest uppercase px-5 py-2 border transition-all duration-300"
            style={{
              borderColor: '#C9A84C',
              color: '#C9A84C',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#C9A84C'
              e.currentTarget.style.color = '#000'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent'
              e.currentTarget.style.color = '#C9A84C'
            }}
          >
            Get Started
          </Link>
        </nav>
      </header>

      {/* Hero */}
      <section className="relative z-10 flex flex-col items-center justify-center text-center px-8 py-32 md:py-48">
        {/* Decorative line above */}
        <div className="flex items-center gap-4 mb-10">
          <div className="h-px w-16" style={{ backgroundColor: '#C9A84C' }} />
          <span
            className="text-xs tracking-[0.4em] uppercase"
            style={{ color: '#C9A84C' }}
          >
            AI Fashion Intelligence
          </span>
          <div className="h-px w-16" style={{ backgroundColor: '#C9A84C' }} />
        </div>

        <h1
          className="text-5xl md:text-7xl lg:text-8xl font-light mb-8 leading-none tracking-tight"
          style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
        >
          Your Personal
          <br />
          <span style={{ color: '#C9A84C', fontStyle: 'italic' }}>Fashion Editor</span>
        </h1>

        <p className="text-white/50 text-lg md:text-xl max-w-xl mx-auto mb-14 leading-relaxed font-light tracking-wide">
          Upload your outfit. Receive honest, editorial-grade feedback.
          Elevate your style with the precision of a professional eye.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Link
            href="/auth?mode=signup"
            className="px-10 py-4 text-sm tracking-[0.2em] uppercase font-light transition-all duration-300"
            style={{ backgroundColor: '#C9A84C', color: '#000' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#e0bc6a'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#C9A84C'
            }}
          >
            Start for Free
          </Link>
          <Link
            href="/auth"
            className="px-10 py-4 text-sm tracking-[0.2em] uppercase font-light border border-white/20 text-white/60 hover:text-white hover:border-white/50 transition-all duration-300"
          >
            Sign In
          </Link>
        </div>
      </section>

      {/* Divider */}
      <div className="relative z-10 flex items-center px-8 md:px-24 mb-24">
        <div className="flex-1 h-px bg-white/10" />
        <div className="mx-6 text-white/20 text-xs tracking-widest uppercase">How It Works</div>
        <div className="flex-1 h-px bg-white/10" />
      </div>

      {/* 3 Steps */}
      <section className="relative z-10 px-8 md:px-24 pb-32">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto">
          {[
            {
              num: '01',
              title: 'Upload Your Look',
              desc: 'Photograph your outfit against any background. Full body or close-up — the AI handles both.',
            },
            {
              num: '02',
              title: 'AI Analysis',
              desc: 'The Editor evaluates silhouette, proportion, color harmony, and overall cohesion with editorial precision.',
            },
            {
              num: '03',
              title: 'Receive Feedback',
              desc: 'Get honest, actionable critique — what works, what to refine, and how to take the look further.',
            },
          ].map(({ num, title, desc }) => (
            <div key={num} className="border-t pt-8" style={{ borderColor: '#C9A84C33' }}>
              <div
                className="text-xs tracking-[0.4em] mb-4 font-light"
                style={{ color: '#C9A84C' }}
              >
                {num}
              </div>
              <h3 className="text-xl font-light tracking-wide mb-4 text-white/90">{title}</h3>
              <p className="text-white/40 leading-relaxed text-sm font-light">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section
        className="relative z-10 mx-8 md:mx-24 mb-24 border px-12 py-16 text-center"
        style={{ borderColor: '#C9A84C33' }}
      >
        <p
          className="text-xs tracking-[0.4em] uppercase mb-6"
          style={{ color: '#C9A84C' }}
        >
          Ready to Elevate Your Style?
        </p>
        <h2
          className="text-3xl md:text-4xl font-light mb-10 text-white/90"
          style={{ fontStyle: 'italic' }}
        >
          Dress with intention.
        </h2>
        <Link
          href="/auth?mode=signup"
          className="inline-block px-12 py-4 text-sm tracking-[0.2em] uppercase font-light transition-all duration-300"
          style={{ backgroundColor: '#C9A84C', color: '#000' }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#e0bc6a'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#C9A84C'
          }}
        >
          Create Free Account
        </Link>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 px-8 py-8 flex items-center justify-between">
        <span
          className="text-sm tracking-widest uppercase font-light"
          style={{ color: '#C9A84C', opacity: 0.6 }}
        >
          The Editor
        </span>
        <span className="text-white/20 text-xs tracking-widest">
          AI-Powered Fashion Critique
        </span>
      </footer>
    </div>
  )
}
