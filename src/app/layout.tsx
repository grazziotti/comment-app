import type { Metadata } from 'next'
import { Rubik } from 'next/font/google'

import './globals.css'
import ReactQueryProvider from '@/providers/ReactQueryProvider'

const rubik = Rubik({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Interactive comments section',
  description: 'Frontend Mentor | Interactive comments section'
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={rubik.className}>
        <ReactQueryProvider>
          <main>{children}</main>
        </ReactQueryProvider>
      </body>
    </html>
  )
}
