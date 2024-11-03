import type { Metadata } from 'next'
import { Rubik } from 'next/font/google'

import './globals.css'

import Header from '@/components/Header'
import ScrollToTopBtn from '@/components/ScrollToTopBtn'

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
        <NextAuthSessionProvider>
          <ReactQueryProvider>
            <Header />
            <main>
              {parallels}
              {children}
            </main>
          </ReactQueryProvider>
        </NextAuthSessionProvider>
        <div className="fixed bottom-6 right-6">
          <ScrollToTopBtn />
        </div>
      </body>
    </html>
  )
}
