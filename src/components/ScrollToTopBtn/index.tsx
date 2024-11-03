'use client'

import { useEffect, useState } from 'react'

import { ArrowUp } from 'lucide-react'

export default function ScrollToTopBtn() {
  const [isVisible, setIsVisible] = useState(false)

  const toggleVisibility = () => {
    if (window.scrollY > 300) {
      setIsVisible(true)
    } else {
      setIsVisible(false)
    }
  }

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility)
    return () => window.removeEventListener('scroll', toggleVisibility)
  }, [])

  return (
    isVisible && (
      <button
        onClick={scrollToTop}
        className="color fixed bottom-6 right-6 rounded-full bg-primary p-3 text-textTitle shadow-lg transition-all hover:scale-105 hover:text-target sm:bottom-4 sm:right-4 sm:p-3"
        aria-label="Scroll to top"
      >
        <ArrowUp />
      </button>
    )
  )
}
