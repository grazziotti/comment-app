'use client'

import Link from 'next/link'
import { ReactNode } from 'react'

type Props = {
  children: ReactNode
}

export default function CloseAuthModalBtn({ children }: Props) {
  return (
    <Link
      href="/"
      className="text-textTitle"
      onClick={() => document.body.classList.remove('overflow-y-hidden')}
    >
      {children}
    </Link>
  )
}
