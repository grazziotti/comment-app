'use client'

import { useState } from 'react'

import { Eye, EyeOff } from 'lucide-react'

type InputProps = {
  id: string
  type: 'text' | 'password'
  name: string
  placeholder: string
  required?: boolean
  label?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  value?: string
  onFocus?: () => void
  isError?: boolean
  onBlur?: () => void
}

export default function Input({
  id,
  name,
  placeholder,
  type,
  label,
  required,
  onChange,
  value,
  isError,
  onFocus,
  onBlur
}: InputProps) {
  const [showPassword, setShowPassword] = useState(false)

  function togglePasswordVisibility(e: React.FormEvent<HTMLButtonElement>) {
    e.preventDefault()
    setShowPassword((prevShowPassword) => !prevShowPassword)
  }

  return (
    <>
      {label && (
        <label htmlFor={id} className="text-textTitle">
          {label}
          {required && <span className="text-deleteColor">*</span>}
        </label>
      )}
      <div className="relative flex items-center">
        <input
          className={`mb-1 mt-1 ${isError ? 'border-deleteColor' : ''} flex w-full items-center rounded-xl border-2 px-4 py-2 pr-10 text-textBody outline-none transition-colors hover:border-target focus:border-target`}
          id={id}
          type={type === 'text' ? 'text' : showPassword ? 'text' : 'password'}
          name={name}
          required={required}
          placeholder={placeholder}
          onChange={onChange}
          value={value}
          onFocus={onFocus}
          onBlur={onBlur}
        />
        {type === 'password' && (
          <button
            className="absolute right-[4%] cursor-default text-textTitle"
            type="button"
            onClick={togglePasswordVisibility}
          >
            {showPassword ? <Eye size={22} /> : <EyeOff size={22} />}
          </button>
        )}
      </div>
    </>
  )
}
