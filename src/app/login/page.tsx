import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'

import AuthModal from '@/components/AuthModal'
import Modal from '@/components/Modal'
import ThemeToggleButton from '@/components/ToggleThemeBtn'

export default async function Page() {
  const session = await getServerSession()

  if (session) {
    redirect('/')
  }

  return (
    <Modal light>
      <div className="fixed right-6 top-6 z-50 flex sm:hidden">
        <ThemeToggleButton />
      </div>
      <AuthModal type="login" useAnchorTag />
    </Modal>
  )
}
