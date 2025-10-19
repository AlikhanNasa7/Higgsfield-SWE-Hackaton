import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
import '@/globals.css'
import { Providers } from './providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Higgsfield AI Chat',
  description: 'Generate images and videos with Higgsfield AI',
  icons: {
    icon: '/higgsfield-icon.webp',
    shortcut: '/higgsfield-icon.webp',
    apple: '/higgsfield-icon.webp',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>{children}</Providers>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: 'var(--surface)',
              color: 'var(--text)',
              border: '1px solid var(--border)',
              borderRadius: '12px',
            },
          }}
        />
      </body>
    </html>
  )
}
