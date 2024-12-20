import Link from 'next/link'

import LoginForm from '../LoginForm'
import SignUpForm from '../SignUpForm'
import CloseAuthModalBtn from './CloseAuthModalBtn'

import { MoveLeft, X } from 'lucide-react'

type Props = {
  type: 'login' | 'signup'
  useAnchorTag?: boolean
}

export default function AuthModal({ type, useAnchorTag }: Props) {
  return (
    <div className="fixed left-1/2 top-1/2 z-20 flex -translate-x-1/2 -translate-y-1/2 flex-col rounded-xl bg-primary p-12 pt-6 sm:relative sm:left-0 sm:top-0 sm:min-h-full sm:w-full sm:translate-x-0 sm:translate-y-0 sm:items-center sm:justify-center sm:rounded-none sm:pt-24">
      <div className="w-full">
        {useAnchorTag ? (
          <div className="flex pb-12 sm:absolute sm:left-12 sm:top-6">
            <CloseAuthModalBtn>
              <MoveLeft width={32} height={32} className="-translate-x-1/2" />
            </CloseAuthModalBtn>
          </div>
        ) : (
          <div className="flex justify-end pb-12 sm:absolute sm:right-12 sm:top-6">
            <CloseAuthModalBtn>
              <X width={32} height={32} className="translate-x-1/2" />
            </CloseAuthModalBtn>
          </div>
        )}
      </div>
      <h2 className="text-center text-3xl font-bold text-textTitle">
        {type === 'login' ? 'Login' : 'Sign Up'}
      </h2>
      {type === 'login' ? <LoginForm /> : <SignUpForm />}
      <div className="mt-10 flex items-center justify-center">
        <span className="text-textTitle">
          {type === 'login'
            ? 'Don’t have an account?'
            : 'Already have an account?'}
        </span>
        {!useAnchorTag ? (
          <Link
            href={`/${type === 'login' ? 'signup' : 'login'}`}
            className="ml-1 font-medium text-target transition-colors hover:text-targetInactive"
          >
            {type === 'login' ? 'Sign up' : 'Login'}
          </Link>
        ) : (
          <a
            href={`/${type === 'login' ? 'signup' : 'login'}`}
            className="ml-1 font-medium text-target transition-colors hover:text-targetInactive"
          >
            {type === 'login' ? 'Sign up' : 'Login'}
          </a>
        )}
      </div>
    </div>
  )
}
