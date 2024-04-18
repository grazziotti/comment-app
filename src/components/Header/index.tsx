import { getServerSession } from 'next-auth'

import Container from '../Container'
import Logo from './Logo'
import NavLinks from './NavLinks'

export default async function Header() {
  const session = await getServerSession()

  return (
    <header className=" py-6">
      <Container>
        <div className="flex items-center justify-between rounded-xl bg-primary p-6 shadow-sm">
          <Logo />
          {!session && <NavLinks />}
          {session && <div>{session.user.name}</div>}
        </div>
      </Container>
    </header>
  )
}
