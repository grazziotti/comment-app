'use client'

import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

import Fieldset from '../Fieldset'
import Input from '../Input'

import { checkPassword } from '@/utils/checkPassword'
import { hasLetter } from '@/utils/hasLetter'

export default function LoginForm() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [usernameError, setUsernameError] = useState<boolean>(false)
  const [passwordError, setPasswordError] = useState<boolean>(false)
  const [loginError, setLoginError] = useState<boolean>(false)
  const [ableLoginButton, setAbleLoginButton] = useState<boolean>(false)
  const router = useRouter()

  useEffect(() => {
    checkLoginButtonState()
  }, [username, password, loginError])

  function checkLoginButtonState() {
    if (username.length < 1 || password.length < 1 || loginError) {
      setAbleLoginButton(false)
      return
    }

    setAbleLoginButton(true)
  }

  function handleChangePassword(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value
    setPassword(value)
    setLoginError(false)

    if (value.length < 1) {
      setPasswordError(true)
      return
    }

    setPasswordError(false)
  }

  function handleChangeUsername(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value
    setUsername(value)
    setLoginError(false)

    if (value.length < 1) {
      setUsernameError(true)
      return
    }

    setUsernameError(false)
  }

  async function login(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    const username = formData.get('username') as string
    const password = formData.get('password') as string

    if (username.length <= 1) {
      setLoginError(true)
      return
    }

    if (!hasLetter(username)) {
      setLoginError(true)
      return
    }

    const data = {
      username: username.toLowerCase(),
      password
    }

    if (!checkPassword(password)) {
      setLoginError(true)
      return
    }

    const loginResult = await signIn('credentials', {
      ...data,
      redirect: false
    })

    if (loginResult?.status === 200) {
      router.push('/')
      router.refresh()
      return
    }

    setUsernameError(false)
    setPasswordError(false)
    setLoginError(true)
  }

  return (
    <form className="mt-6 max-w-72" onSubmit={login}>
      <Fieldset>
        <div className="mb-4">
          <Input
            id="username"
            name="username"
            placeholder="Enter username"
            type="text"
            label="Username"
            onChange={handleChangeUsername}
            required
            value={username}
            isError={usernameError || loginError}
          />
          {usernameError && (
            <p className="break-all text-sm text-red-400">
              This field is required.
            </p>
          )}
        </div>
      </Fieldset>
      <Fieldset>
        <div className="mb-4">
          <Input
            id="password"
            name="password"
            type="password"
            required
            label="Password"
            placeholder="Enter Password"
            isError={passwordError || loginError}
            onChange={handleChangePassword}
            value={password}
          />
          {passwordError && (
            <p className="break-all text-sm text-red-400">
              This field is required.
            </p>
          )}
          {loginError && (
            <p className="break-all text-sm text-red-400">
              Invalid username or password.
            </p>
          )}
        </div>
      </Fieldset>
      <button
        type="submit"
        className={`mt-4 w-full ${!ableLoginButton && 'bg-targetInactive'} rounded-lg bg-target py-2 font-medium text-primary transition-colors hover:bg-targetInactive`}
        disabled={!ableLoginButton}
      >
        Login
      </button>
    </form>
  )
}
