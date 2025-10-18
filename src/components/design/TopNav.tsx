'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Container } from './Container'
import { Button } from './Button'

export interface TopNavProps {
  compact?: boolean
  sticky?: boolean
}

export function TopNav({ compact = false, sticky = true }: TopNavProps) {
  const [isScrolled, setIsScrolled] = useState(false)
  const { scrollY } = useScroll()
  const backgroundColor = useTransform(
    scrollY,
    [0, 100],
    ['rgba(11, 11, 15, 0)', 'rgba(11, 11, 15, 0.8)']
  )

  useEffect(() => {
    const unsubscribe = scrollY.on('change', value => {
      setIsScrolled(value > 50)
    })
    return () => unsubscribe()
  }, [scrollY])

  return (
    <motion.nav
      className={`
        ${sticky ? 'fixed' : 'relative'}
        top-0 left-0 right-0 z-50
        transition-all duration-300
        ${isScrolled ? 'backdrop-blur-md border-b border-border/50' : ''}
      `}
      style={{ backgroundColor: sticky ? backgroundColor : undefined }}
    >
      <Container size="xl" pad="md">
        <div className={`flex items-center justify-between ${compact ? 'py-4' : 'py-6'}`}>
          {/* Logo */}
          <a href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-glow-primary group-hover:shadow-lg transition-shadow">
              <svg
                className="w-6 h-6 text-black"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <span className="text-xl font-bold text-text">
              Higgsfield <span className="text-primary">AI</span>
            </span>
          </a>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            <a href="/" className="text-muted hover:text-text transition-colors">
              Home
            </a>
            <a href="/styleguide" className="text-muted hover:text-text transition-colors">
              Styleguide
            </a>
            <a href="/components" className="text-muted hover:text-text transition-colors">
              Components
            </a>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Button variant="primary" size="sm">
              Get Started
            </Button>
          </div>
        </div>
      </Container>
    </motion.nav>
  )
}

function ThemeToggle() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark'
    setTheme(newTheme)
    document.documentElement.setAttribute('data-theme', newTheme)
  }

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg glass hover:bg-white/10 transition-colors ring-focus"
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? (
        <svg className="w-5 h-5 text-text" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      ) : (
        <svg className="w-5 h-5 text-text" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
          />
        </svg>
      )}
    </button>
  )
}
