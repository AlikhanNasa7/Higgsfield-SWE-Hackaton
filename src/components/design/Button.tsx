'use client'

import { motion } from 'framer-motion'
import { forwardRef, ButtonHTMLAttributes } from 'react'
import { press } from '@/lib/motion'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'glass' | 'ghost' | 'link'
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
  children: React.ReactNode
}

const variantStyles = {
  primary: `
    bg-primary text-black font-semibold
    shadow-glow-primary
    hover:bg-white hover:shadow-lg
    active:bg-primary/90
  `,
  secondary: `
    bg-surface border border-border
    text-text font-medium
    hover:bg-white/5 hover:border-primary/30
  `,
  glass: `
    glass text-text font-medium
    hover:bg-white/10 hover:border-white/20
  `,
  ghost: `
    bg-transparent text-text font-medium
    hover:bg-white/5
  `,
  link: `
    bg-transparent text-primary font-medium
    hover:text-white hover:underline underline-offset-4
    p-0 h-auto
  `,
}

const sizeStyles = {
  sm: 'px-4 py-2 text-sm rounded-lg',
  md: 'px-6 py-3 text-base rounded-xl',
  lg: 'px-8 py-4 text-lg rounded-2xl',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      fullWidth = false,
      className = '',
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles = `
      inline-flex items-center justify-center gap-2
      transition-all duration-300 ease-out
      ring-focus
      disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none
      ${fullWidth ? 'w-full' : ''}
    `

    const styles = `
      ${baseStyles}
      ${variantStyles[variant]}
      ${variant !== 'link' ? sizeStyles[size] : ''}
      ${className}
    `
      .trim()
      .replace(/\s+/g, ' ')

    return (
      <motion.button
        ref={ref}
        className={styles}
        whileTap={!disabled ? press : undefined}
        disabled={disabled}
        {...props}
      >
        {children}
      </motion.button>
    )
  }
)

Button.displayName = 'Button'
