import { getServerSession } from 'next-auth'

import Container from '../Container'
import Logged from './Logged'
import NavLinks from './NavLinks'

export default async function Header() {
  const session = await getServerSession()

  return (
    <header className="pt-6">
      <Container>
        <div className="relative flex items-center justify-end rounded-xl bg-primary p-6 shadow-sm">
          {!session && <NavLinks />}
          {session && (
            <>
              <div className="text-textTitle">{session?.user.name}</div>
              <Logged />
            </>
          )}
        </div>
      </Container>
    </header>
  )
}
