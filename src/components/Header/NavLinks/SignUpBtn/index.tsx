'use client'

import Link from 'next/link'

export default function SignUpBtn() {
  return (
    <Link
      href={'/signup'}
      onClick={() => document.body.classList.add('overflow-y-hidden')}
      className="rounded-lg bg-target px-4 py-2 font-medium text-primary transition-colors hover:bg-targetInactive"
    >
      Sign Up
    </Link>
  )
}
