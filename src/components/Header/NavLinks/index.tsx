import Link from 'next/link'

export default function NavLinks() {
  return (
    <nav className="flex items-center">
      <ul className="flex items-center gap-x-4">
        <li>
          <Link
            href={'/auth/login'}
            className="font-medium text-target transition-colors hover:text-targetInactive"
          >
            Login
          </Link>
        </li>
        <li>
          <Link
            href={'/auth/signup'}
            className="rounded-lg bg-target px-4 py-2 font-medium text-primary transition-colors hover:bg-targetInactive"
          >
            Sign Up
          </Link>
        </li>
      </ul>
    </nav>
  )
}
