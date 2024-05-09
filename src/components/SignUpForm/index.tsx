'use client'

import { signIn } from 'next-auth/react'
import { useEffect, useState } from 'react'

import Fieldset from '../Fieldset'
import Input from '../Input'

import { useSignUp } from '@/hooks/useSignUp'
import { checkPassword } from '@/utils/checkPassword'
import { hasLetter } from '@/utils/hasLetter'
import { Check, X } from 'lucide-react'

type PasswordErrorType = {
  message: string
  isError: boolean
  isSuccess: boolean
}

export default function SignUpForm() {
  const { mutate, isSuccess, error } = useSignUp()

  // username states
  const [username, setUsername] = useState<string>('')
  const [usernameErrors, setUsernameErrors] = useState<string[]>([])
  const [showUsernameErrors, setShowUsernameErrors] = useState(false)

  // password states
  const [password, setPassword] = useState<string>('')
  const [passwordErrors, setPasswordErrors] = useState<PasswordErrorType[]>([])
  const [isPasswordError, setIsPasswordError] = useState(false)
  const [showPasswordErrors, setShowPasswordErrors] = useState(false)
  const [showPasswordRequirementList, setShowPasswordRequirementList] =
    useState(false)

  // confirm password states
  const [confirmPassword, setConfirmPassword] = useState<string>('')
  const [confirmPasswordErrors, setConfirmPasswordErrors] = useState<string[]>(
    []
  )
  const [showConfirmPasswordErrors, setShowConfirmPasswordErrors] =
    useState(false)

  // sign up states
  const [signUpErrors, setSignUpErrors] = useState<string[]>([])
  const [showSignUpErrors, setShowSignUpErrors] = useState(false)
  const [isSignUpButtonEnabled, setIsSignUpButtonEnabled] = useState(false)

  useEffect(() => {
    const passwordErrorList = [
      {
        message: 'Use pelo menos 8 caracteres',
        isError: false,
        isSuccess: false
      },
      {
        message: 'Uma letra minúscula',
        isError: false,
        isSuccess: false
      },
      {
        message: 'Uma letra maiúscula',
        isError: false,
        isSuccess: false
      },
      {
        message: 'Um número',
        isError: false,
        isSuccess: false
      },
      {
        message: 'Um caractere especial',
        isError: false,
        isSuccess: false
      }
    ]

    setPasswordErrors(passwordErrorList)
  }, [])

  useEffect(() => {
    if (isSuccess) {
      login()
    }
  }, [isSuccess])

  useEffect(() => {
    setConfirmPasswordErrors(checkConfirmPasswordErrors())
  }, [password, confirmPassword])

  useEffect(
    () => checkSignUpButtonState(),
    [usernameErrors, isPasswordError, confirmPasswordErrors]
  )

  useEffect(() => {
    if (error) {
      setSignUpErrors([`${error?.response.data.error}`])
    } else {
      setSignUpErrors([])
    }
  }, [error])

  // auth functions
  async function login() {
    await signIn('credentials', {
      ...{ username, password },
      redirect: true
    })
  }

  async function signUp(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    if (confirmPassword !== password) {
      return
    }

    if (username.length <= 1) {
      return
    }

    if (!hasLetter(username)) {
      return
    }

    if (password !== confirmPassword) {
      return
    }

    if (!checkPassword(password)) {
      return
    }

    const signUpData = {
      username: username.toLowerCase(),
      password
    }

    mutate(signUpData)

    setUsername(username)
    setPassword(password)
    setShowSignUpErrors(true)
  }

  // username functions
  function handleChangeUsername(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value
    setUsername(value)

    const newErrors: string[] = []

    if (value.length < 2) {
      newErrors.push('Use pelo menos 2 caracteres')
    }
    if (/^[^A-Za-z]*$/.test(value)) {
      newErrors.push('Use pelo menos 1 letra')
    }

    if (signUpErrors.length > 0) setSignUpErrors([])

    setUsernameErrors(newErrors)
  }

  function handleFocusUsername() {
    setShowSignUpErrors(false)
  }

  function handleOnBlurUsername() {
    setShowUsernameErrors(true)
  }

  // password functions
  function handleChangePassword(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value
    setPassword(value)

    const newErrors = checkPasswordErrors(value)

    setPasswordErrors(newErrors)
  }

  function handleFocusPassword() {
    setShowPasswordRequirementList(true)
    setShowSignUpErrors(false)
  }

  function handleOnBlurPassword() {
    checkPasswordErrors(password)
    setShowPasswordErrors(true)
  }

  function checkPasswordErrors(value: string) {
    const newErrors: PasswordErrorType[] = passwordErrors
    let hasError = false

    const tests = [
      value.length < 8,
      value === value.toUpperCase(),
      value === value.toLowerCase(),
      !/\d/.test(value),
      !/[^\w\s]/.test(value)
    ]

    tests.forEach((test, index) => {
      newErrors[index].isError = test
      newErrors[index].isSuccess = !test
      hasError = hasError || test
    })

    setIsPasswordError(hasError)
    return newErrors
    // if (value.length < 8) {
    //   newErrors[0].isError = true
    //   newErrors[0].isSuccess = false
    //   setIsPasswordError(true)
    // } else {
    //   newErrors[0].isSuccess = true
    //   newErrors[0].isError = false
    //   setIsPasswordError(false)
    // }

    // if (value === value.toUpperCase()) {
    //   newErrors[1].isError = true
    //   newErrors[1].isSuccess = false
    //   setIsPasswordError(true)
    // } else {
    //   newErrors[1].isSuccess = true
    //   newErrors[1].isError = false
    //   setIsPasswordError(false)
    // }

    // if (value === value.toLowerCase()) {
    //   newErrors[2].isError = true
    //   newErrors[2].isSuccess = false
    //   setIsPasswordError(true)
    // } else {
    //   newErrors[2].isSuccess = true
    //   newErrors[2].isError = false
    //   setIsPasswordError(false)
    // }

    // if (!/\d/.test(value)) {
    //   newErrors[3].isError = true
    //   newErrors[3].isSuccess = false
    //   setIsPasswordError(true)
    // } else {
    //   newErrors[3].isSuccess = true
    //   newErrors[3].isError = false
    //   setIsPasswordError(false)
    // }

    // if (!/[^\w\s]/.test(value)) {
    //   newErrors[4].isError = true
    //   newErrors[4].isSuccess = false
    //   setIsPasswordError(true)
    // } else {
    //   newErrors[4].isSuccess = true
    //   newErrors[4].isError = false
    //   setIsPasswordError(false)
    // }

    // return newErrors
  }

  // confirm password functions
  function handleChangeConfirmPassword(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value
    setConfirmPassword(value)
  }

  function handleFocusConfirmPassword() {
    setShowPasswordRequirementList(true)
    setShowSignUpErrors(false)
  }

  function handleOnBlurConfirmPassword() {
    setShowConfirmPasswordErrors(true)
  }

  function checkConfirmPasswordErrors() {
    const newErrors: string[] = []

    setSignUpErrors([])

    if (confirmPassword.length > 0 && password !== confirmPassword) {
      newErrors.push('Senhas não são iguais')
    }

    return newErrors
  }

  // sign up button functions
  function checkSignUpButtonState() {
    if (
      !isPasswordError &&
      username.length > 1 &&
      password.length > 7 &&
      usernameErrors.length < 1 &&
      confirmPassword.length > 1 &&
      confirmPasswordErrors.length < 1
    ) {
      setIsSignUpButtonEnabled(true)
      return
    }
    setIsSignUpButtonEnabled(false)
  }

  return (
    <form className="mt-6" onSubmit={signUp}>
      <Fieldset>
        <div className="mb-4">
          <Input
            id="username"
            type="text"
            name="username"
            required
            label="Username"
            value={username}
            isError={usernameErrors.length > 0}
            onChange={handleChangeUsername}
            onFocus={handleFocusUsername}
            placeholder="Enter Username"
            onBlur={handleOnBlurUsername}
          />
          {usernameErrors.length > 0 && (
            <>
              {showUsernameErrors && (
                <p className="text-sm text-deleteColor">{usernameErrors[0]}</p>
              )}
            </>
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
            value={password}
            onChange={handleChangePassword}
            isError={isPasswordError}
            label="Password"
            placeholder="Enter Password"
            onFocus={handleFocusPassword}
            onBlur={handleOnBlurPassword}
          />
          {showPasswordRequirementList && (
            <ul className="flex flex-col gap-1 text-textBody">
              {passwordErrors.map((error, index) => (
                <li key={index} className={`flex items-center gap-x-1 text-sm`}>
                  {!error.isSuccess && (
                    <>
                      {!showPasswordErrors && (
                        <div className="flex h-6 w-6 items-center justify-center">
                          <div className="h-3 w-3 rounded-full bg-textBody"></div>
                        </div>
                      )}
                    </>
                  )}
                  {error.isSuccess && <Check className="text-green-400" />}
                  {showPasswordErrors && (
                    <>{error.isError && <X className="text-deleteColor" />}</>
                  )}
                  {error.message}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="mb-4">
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            required
            value={confirmPassword}
            onChange={handleChangeConfirmPassword}
            isError={confirmPasswordErrors.length > 0}
            label="Confirm password"
            placeholder="Confirm Password"
            onFocus={handleFocusConfirmPassword}
            onBlur={handleOnBlurConfirmPassword}
          />
          {confirmPasswordErrors.length > 0 && (
            <>
              {showConfirmPasswordErrors && (
                <p className="text-sm text-deleteColor">
                  {confirmPasswordErrors[0]}
                </p>
              )}
            </>
          )}
          {signUpErrors.length > 0 && (
            <>
              {showSignUpErrors && (
                <p className="text-sm text-deleteColor">{signUpErrors[0]}</p>
              )}
            </>
          )}
        </div>
      </Fieldset>
      <button
        type="submit"
        className={`mt-4 flex ${isSignUpButtonEnabled ? '' : 'bg-targetInactive'} w-full items-center justify-center rounded-lg bg-target py-2 font-medium text-primary transition-colors hover:bg-targetInactive`}
        disabled={!isSignUpButtonEnabled}
      >
        Sign up
      </button>
    </form>
  )
}
