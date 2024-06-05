'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

import Fieldset from '../Fieldset'
import Input from '../Input'
import Loader from '../Loader'

import { useSignIn } from '@/hooks/useSignIn'
import { checkPassword } from '@/utils/checkPassword'
import { hasLetter } from '@/utils/hasLetter'
import { Check } from 'lucide-react'

export default function LoginForm() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [usernameError, setUsernameError] = useState<boolean>(false)
  const [passwordError, setPasswordError] = useState<boolean>(false)
  const [loginError, setLoginError] = useState<boolean>(false)
  const [ableLoginButton, setAbleLoginButton] = useState<boolean>(false)

  const router = useRouter()
  const { mutate, isPending, isSuccess, isError } = useSignIn()

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

    if (username.length < 4) {
      setLoginError(true)
      return
    }

    const data = {
      username: username.toLowerCase().trim(),
      password
    }

    if (!checkPassword(password)) {
      setLoginError(true)
      return
    }

    mutate(data)
  }

  useEffect(() => {
    if (isSuccess) {
      setUsernameError(false)
      setPasswordError(false)
      router.push('/')
      location.reload()
      return
    }
  }, [isSuccess])

  useEffect(() => {
    if (isError) setLoginError(true)
  }, [isError])

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
        className={`mt-4 flex w-full items-center justify-center ${!ableLoginButton && 'bg-targetInactive'} rounded-lg bg-target py-2 font-medium text-primary transition-colors hover:bg-targetInactive`}
        disabled={!ableLoginButton}
      >
        {isPending && <Loader />}
        {isSuccess && <Check />}
        {!isPending && <>{!isSuccess && 'Login'}</>}
      </button>
    </form>
  )
}
