'use client'

import { signIn } from 'next-auth/react'
import { useEffect, useState } from 'react'

import Fieldset from '../Fieldset'
import Input from '../Input'

import { useSignUp } from '@/hooks/useSignUp'
import { checkPassword } from '@/utils/checkPassword'
import { hasLetter } from '@/utils/hasLetter'

export default function SignUpForm() {
  const [username, setUsername] = useState<string>()
  const [password, setPassword] = useState<string>()

  const { mutate, isSuccess } = useSignUp()

  useEffect(() => {
    if (isSuccess) {
      login()
    }
  }, [isSuccess])

  async function login() {
    await signIn('credentials', {
      ...{ username, password },
      redirect: true
    })
  }

  async function signUp(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    const username = formData.get('username') as string
    const password = formData.get('password') as string
    const confirmPassword = formData.get('confirmPassword') as string

    if (username.length <= 1) {
      console.log('error: username must have at least 2 characters')
      return
    }

    if (!hasLetter(username)) {
      console.log('error: username must contain letters')
      return
    }

    if (password !== confirmPassword) {
      console.log('error: passwords do not match')
      return
    }

    if (!checkPassword(password)) {
      console.log(
        'error: password must have at least 8 characters, one uppercase letter, one lowercase letter, one number, one special character'
      )
      return
    }

    const signUpData = {
      username: username.toLowerCase(),
      password
    }

    mutate(signUpData)

    setUsername(username)
    setPassword(password)
  }

  return (
    <form className="mt-6" onSubmit={signUp}>
      <Fieldset>
        <Input
          id="username"
          type="text"
          name="username"
          required
          label="Username"
          placeholder="Enter Username"
        />
      </Fieldset>
      <Fieldset>
        <Input
          id="password"
          name="password"
          type="password"
          required
          label="Password"
          placeholder="Enter Password"
        />
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          required
          label="Confirm password"
          placeholder="Confirm Password"
        />
      </Fieldset>
      <button
        type="submit"
        className="mt-4 flex w-full items-center justify-center rounded-lg bg-target py-2 font-medium text-primary transition-colors hover:bg-targetInactive"
      >
        Sign up
      </button>
    </form>
  )
}
