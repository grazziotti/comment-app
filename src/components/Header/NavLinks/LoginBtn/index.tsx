'use client'

import Link from 'next/link'

export default function LoginBtn() {
  return (
    <Link
      href={'/login'}
      onClick={() => document.body.classList.add('overflow-y-hidden')}
      className="font-medium text-target transition-colors hover:text-targetInactive"
    >
      Login
    </Link>
  )
}
