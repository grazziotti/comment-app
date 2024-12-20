import LoginBtn from './LoginBtn'
import SignUpBtn from './SignUpBtn'

export default function NavLinks() {
  return (
    <nav className="flex items-center">
      <ul className="flex items-center gap-x-4">
        <li>
          <LoginBtn />
        </li>
        <li>
          <SignUpBtn />
        </li>
      </ul>
    </nav>
  )
}
