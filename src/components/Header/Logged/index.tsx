'use client'

import { useState } from 'react'

import LogoutBtn from '../LogoutBtn'

export default function Logged() {
  const [showLogoutBtn, setShowLogoutBtn] = useState(false)

  return (
    <div className="flex items-center gap-x-2">
      <button
        onClick={() => setShowLogoutBtn(!showLogoutBtn)}
        className="ml-4 flex items-center gap-x-1 text-target transition-all"
      >
        <div className="h-8 w-8 rounded-full bg-secondary"></div>
        <span
          className={`${showLogoutBtn ? 'rotate-90' : '-rotate-90'} transition-all`}
        >
          {'<'}
        </span>
      </button>
      {showLogoutBtn && (
        <div className=" rouded-xl absolute z-50 -translate-x-1/2 translate-y-full bg-primary p-4 shadow-lg">
          <LogoutBtn />
        </div>
      )}
    </div>
  )
}
