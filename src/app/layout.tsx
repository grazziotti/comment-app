import type { Metadata } from 'next'
import { Rubik } from 'next/font/google'

import './globals.css'

import Header from '@/components/Header'
import ThemeToggleButton from '@/components/ToggleThemeBtn'

import ReactQueryProvider from '@/providers/ReactQueryProvider'
import NextAuthSessionProvider from '@/providers/sessionProvider'

const rubik = Rubik({
  subsets: ['latin'],
  preload: true,
  weight: ['400', '500', '700']
})

export const metadata: Metadata = {
  title: 'Interactive comments section',
  description: 'Frontend Mentor | Interactive comments section'
}

export default function RootLayout({
  children,
  parallels
}: Readonly<{
  children: React.ReactNode
  parallels: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={rubik.className}>
        <div className="fixed right-6 top-6">
          <ThemeToggleButton />
        </div>
        <NextAuthSessionProvider>
          <ReactQueryProvider>
            <Header />
            <main>
              {parallels}
              {children}
            </main>
          </ReactQueryProvider>
        </NextAuthSessionProvider>
      </body>
    </html>
  )
}
