import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'

import AuthModal from '@/components/AuthModal'
import Modal from '@/components/Modal'

export default async function Page() {
  const session = await getServerSession()

  if (session) {
    redirect('/')
  }

  return (
    <Modal>
      <AuthModal type="login" />
    </Modal>
  )
}
