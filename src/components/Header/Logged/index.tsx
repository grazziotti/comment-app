'use client'

import { useSession } from 'next-auth/react'
import Image from 'next/image'
import { useState } from 'react'

import LogoutBtn from '../LogoutBtn'

import { ChevronDown } from 'lucide-react'

export default function Logged() {
  const [showLogoutBtn, setShowLogoutBtn] = useState(false)

  const { data: session } = useSession()

  return (
    <div className="flex items-center gap-x-2">
      <button
        onClick={() => setShowLogoutBtn(!showLogoutBtn)}
        className="ml-4 flex items-center gap-x-1 text-target transition-all"
      >
        <div>
          {session?.user.avatar ? (
            <Image
              className="rounded-full"
              width={32}
              height={32}
              src={`http://res.cloudinary.com/deqpaljom/image/upload/v1718304142/avatars/${session.user.avatar}`}
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
        <div className="rouded-xl absolute z-50 -translate-x-1/2 translate-y-full bg-primary p-4 shadow-lg">
          <LogoutBtn />
        </div>
      )}
    </div>
  )
}
