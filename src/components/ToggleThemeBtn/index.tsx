'use client'

import { useEffect, useState } from 'react'

import { Moon, Sun } from 'lucide-react'

export default function ThemeToggleButton() {
  const [theme, setTheme] = useState<'light' | 'dark' | null>(null)

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme') || 'light'
    const validatedTheme = storedTheme === 'dark' ? 'dark' : 'light'
    setTheme(validatedTheme)

    if (storedTheme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark'
    setTheme(newTheme)
    document.documentElement.classList.toggle('dark', newTheme === 'dark')
    localStorage.setItem('theme', newTheme)
  }

  if (theme === null) {
    return null
  }

  return (
    <button
      onClick={toggleTheme}
      aria-label={
        theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'
      }
      className="rounded-full bg-primary p-3 text-textTitle shadow-lg transition-all hover:scale-105 hover:text-target"
    >
      {theme === 'dark' ? (
        <Sun aria-hidden="true" />
      ) : (
        <Moon aria-hidden="true" />
      )}
    </button>
  )
}
