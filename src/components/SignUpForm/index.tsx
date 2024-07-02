'use client'

import { signIn } from 'next-auth/react'
import Image from 'next/image'
import { useEffect, useState } from 'react'

import Fieldset from '../Fieldset'
import Input from '../Input'
import Loader from '../Loader'

import { useSignUp } from '@/hooks/useSignUp'
import { checkPassword } from '@/utils/checkPassword'
import { hasLetter } from '@/utils/hasLetter'
import { Check, Upload, X } from 'lucide-react'

type PasswordErrorType = {
  message: string
  isError: boolean
  isSuccess: boolean
}

export default function SignUpForm() {
  const { mutate, isSuccess, error, isPending } = useSignUp()

  // username states
  const [username, setUsername] = useState<string>('')
  const [usernameErrors, setUsernameErrors] = useState<string[]>([])
  const [showUsernameErrors, setShowUsernameErrors] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

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
  const [imgURL, setImgURL] = useState('')

  useEffect(() => {
    const passwordErrorList = [
      {
        message: 'Use at least 8 characters',
        isError: false,
        isSuccess: false
      },
      {
        message: 'One lowercase letter',
        isError: false,
        isSuccess: false
      },
      {
        message: 'One uppercase letter',
        isError: false,
        isSuccess: false
      },
      {
        message: 'One number',
        isError: false,
        isSuccess: false
      },
      {
        message: 'One special character',
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
    setSignUpErrors([`${error?.response.data.error}`])
  }, [error])

  useEffect(() => {
    if (selectedFile) {
      const newImageURL = URL.createObjectURL(selectedFile)
      setImgURL(newImageURL)
      return () => {
        URL.revokeObjectURL(newImageURL)
      }
    }
  }, [selectedFile])

  // auth functions
  async function login() {
    await signIn('credentials', {
      ...{ username: username.toLowerCase().trim(), password },
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

    const formData = new FormData()
    if (selectedFile) {
      formData.append('avatar', selectedFile)
    }
    formData.append('username', username.toLowerCase().trim())
    formData.append('password', password)

    mutate(formData)

    setUsername(username)
    setPassword(password)
    setShowSignUpErrors(true)
  }

  // username functions
  function handleChangeUsername(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value
    setUsername(value)

    const newErrors: string[] = []

    if (value.length < 4) {
      newErrors.push('Use at least 4 characters')
    }

    if (value.length > 19) {
      newErrors.push('use a maximum of 20 characters')
    }

    if (/^[^A-Za-z]*$/.test(value)) {
      newErrors.push('Use at least 1 letter')
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
      newErrors.push('Passwords do not match')
    }

    return newErrors
  }

  // sign up button functions
  function checkSignUpButtonState() {
    if (
      !isPasswordError &&
      username.length > 3 &&
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

  function handleUploadImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files ? e.target.files[0] : null
    setSelectedFile(file)
  }

  return (
    <form className="mt-6" onSubmit={signUp}>
      <Fieldset>
        <p className="text-textTitle">Avatar</p>
        <div className="mb-4 flex items-center justify-center">
          <label className="flex h-28 w-28 cursor-pointer items-center justify-center overflow-hidden rounded-full bg-target text-primary">
            <Upload />
            <input
              id="avatar"
              name="avatar"
              type="file"
              accept="image/*"
              multiple={false}
              onChange={handleUploadImage}
              className="hidden"
            />
            {imgURL && (
              <Image
                width={28}
                height={28}
                className="h-28 w-28 rounded-full"
                src={imgURL}
                alt="avatar"
              />
            )}
          </label>
        </div>
      </Fieldset>
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
        {!isPending && <>{!isSuccess && 'Sign Up'}</>}
        {isPending && <Loader />}
        {isSuccess && <Check />}
      </button>
    </form>
  )
}
