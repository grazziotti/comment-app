'use client'

import { signOut, useSession } from 'next-auth/react'

import { LogOut } from 'lucide-react'

export default function LogoutBtn() {
  const { data: session } = useSession()

  function handleLogoutBtnClick() {
    if (session) {
      signOut()
    }
  }

  return (
    <button
      onClick={handleLogoutBtnClick}
      className="flex items-center gap-x-1 rounded-xl bg-deleteColor p-3 font-bold text-primary transition-colors"
    >
      <LogOut width={18} height={18} className="rotate-180" />
      Logout
    </button>
  )
}
