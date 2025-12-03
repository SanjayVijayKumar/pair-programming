import type { Metadata } from 'next'
import { Providers } from '@/app/providers'
import '@/app/globals.css'

export const metadata: Metadata = {
  title: 'Pair Programming - Real-time Code Editor',
  description:
    'Real-time collaborative code editing with live cursors, typing indicators, and AI-powered autocomplete.',
  viewport: 'width=device-width, initial-scale=1',
  keywords: [
    'pair programming',
    'code editor',
    'real-time collaboration',
    'Monaco Editor',
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-gray-900">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
