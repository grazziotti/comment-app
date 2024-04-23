'use client'

import { signIn } from 'next-auth/react'

import Fieldset from '../Fieldset'
import Input from '../Input'

import { checkPassword } from '@/utils/checkPassword'
import { hasLetter } from '@/utils/hasLetter'

export default function LoginForm() {
  async function login(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    const username = formData.get('username') as string
    const password = formData.get('password') as string

    if (username.length <= 1) {
      console.log('error: username must have at least 2 characters')
      return
    }

    if (!hasLetter(username)) {
      console.log('error: username must contain letters')
      return
    }

    const data = {
      username: username.toLowerCase(),
      password
    }

    if (!checkPassword(password)) {
      console.log(
        'error: password must have at least 8 characters, one uppercase letter, one lowercase letter, one number, one special character'
      )
      return
    }

    console.log('success!')

    await signIn('credentials', {
      ...data,
      redirect: true
    })
  }

  return (
    <form className="mt-6" onSubmit={login}>
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
      </Fieldset>
      <button
        type="submit"
        className="mt-4 w-full rounded-lg bg-target py-2 font-medium text-primary transition-colors hover:bg-targetInactive"
      >
        Login
      </button>
    </form>
  )
}
