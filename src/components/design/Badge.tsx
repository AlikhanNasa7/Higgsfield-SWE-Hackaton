'use client'

import { HTMLAttributes } from 'react'

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: 'primary' | 'accent' | 'neutral' | 'success' | 'warning' | 'error'
  variant?: 'solid' | 'outline'
  children: React.ReactNode
}

const toneStyles = {
  primary: {
    solid: 'bg-primary/20 text-primary border-primary/30',
    outline: 'bg-transparent text-primary border-primary/50',
  },
  accent: {
    solid: 'bg-info/20 text-info border-info/30',
    outline: 'bg-transparent text-info border-info/50',
  },
  neutral: {
    solid: 'bg-white/10 text-white/90 border-white/20',
    outline: 'bg-transparent text-muted border-muted/50',
  },
  success: {
    solid: 'bg-success/20 text-success border-success/30',
    outline: 'bg-transparent text-success border-success/50',
  },
  warning: {
    solid: 'bg-warning/20 text-warning border-warning/30',
    outline: 'bg-transparent text-warning border-warning/50',
  },
  error: {
    solid: 'bg-danger/20 text-danger border-danger/30',
    outline: 'bg-transparent text-danger border-danger/50',
  },
}

export function Badge({
  tone = 'primary',
  variant = 'solid',
  className = '',
  children,
  ...props
}: BadgeProps) {
  const styles = `
    inline-flex items-center justify-center
    px-3 py-1 rounded-full
    text-xs font-semibold uppercase tracking-wide
    border
    ${toneStyles[tone][variant]}
    ${className}
  `
    .trim()
    .replace(/\s+/g, ' ')

  return (
    <span className={styles} {...props}>
      {children}
    </span>
  )
}
