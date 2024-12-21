'use client'

import { useSession } from 'next-auth/react'
import Image from 'next/image'
import { useRef, useState, useEffect } from 'react'

import LogoutBtn from '../LogoutBtn'

import { ChevronDown } from 'lucide-react'

export default function Logged() {
  const [showLogoutBtn, setShowLogoutBtn] = useState(false)
  const { data: session } = useSession()
  const dropdownRef = useRef<HTMLDivElement>(null)

  const handleOutsideClick = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setShowLogoutBtn(false)
    }
  }

  useEffect(() => {
    if (showLogoutBtn) {
      document.addEventListener('mousedown', handleOutsideClick)
    } else {
      document.removeEventListener('mousedown', handleOutsideClick)
    }
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [showLogoutBtn])

  return (
    <div className="relative flex items-center gap-x-2" ref={dropdownRef}>
      <button
        onClick={() => setShowLogoutBtn((prev) => !prev)}
        className="ml-4 flex items-center gap-x-1 text-target transition-all"
      >
        <div>
          {session?.user.avatar ? (
            <Image
              className="rounded-full"
              width={32}
              height={32}
              src={`http://res.cloudinary.com/dfmx2uzdr/image/upload/v1718304142/comment-app-avatars/${session.user.avatar}`}
              alt="profile avatar"
            />
          ) : (
            <div className="h-8 w-8 rounded-full bg-secondary"></div>
          )}
        </div>
        <span
          className={`${showLogoutBtn && 'rotate-180'} transition-transform`}
        >
          <ChevronDown />
        </span>
      </button>
      {showLogoutBtn && (
        <div className="absolute z-50 -translate-x-1/2 translate-y-full rounded-xl bg-primary p-4 shadow-lg">
          <LogoutBtn />
        </div>
      )}
    </div>
  )
}
