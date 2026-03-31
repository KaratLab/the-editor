import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'The Editor — Fashion Rated by Vivienne',
  description: 'Submit your outfit to Vivienne, the most feared fashion editor in the industry. Rated 1–5 stars. No mercy.',
  openGraph: {
    title: 'The Editor',
    description: 'Get your outfit rated by Vivienne. 1–5 stars. No mercy.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-black text-white min-h-screen">
        {children}
      </body>
    </html>
  )
}
