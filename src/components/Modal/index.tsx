'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ReactNode } from 'react'

type Props = {
  children: ReactNode
  light?: boolean
}

export default function Modal({ children, light }: Props) {
  const pathname = usePathname()

  if (pathname === '/') return null

  return (
    <div className="sm:fixed sm:top-0 sm:h-full sm:w-full sm:overflow-auto">
      <Link
        href="/"
        className={`opacity-80" fixed bottom-0 left-0 right-0 top-0 z-10 cursor-default ${light ? 'bg-secondary' : 'bg-black'} ${!light && 'opacity-80'}`}
      />
      {children}
    </div>
  )
}
