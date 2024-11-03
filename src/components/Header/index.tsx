import { getServerSession } from 'next-auth'

import Container from '../Container'
import ThemeToggleButton from '../ToggleThemeBtn'
import Logged from './Logged'
import NavLinks from './NavLinks'

export default async function Header() {
  const session = await getServerSession()

  return (
    <header className="pt-6">
      <Container>
        <div>
          <div className="fixed right-6 top-6 lg:relative lg:right-0 lg:top-0 lg:mb-4 lg:flex lg:justify-end">
            <ThemeToggleButton />
          </div>
          <div className="relative flex items-center justify-end rounded-xl bg-primary p-6 shadow-sm">
            {!session && <NavLinks />}
            {session && (
              <>
                <div className="text-textTitle">{session?.user.name}</div>
                <Logged />
              </>
            )}
          </div>
        </div>
      </Container>
    </header>
  )
}
