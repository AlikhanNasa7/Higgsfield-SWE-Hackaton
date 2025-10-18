'use client'

import { HTMLAttributes } from 'react'

export interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  size?: 'lg' | 'xl'
  pad?: 'none' | 'sm' | 'md' | 'lg'
  children: React.ReactNode
}

const sizeStyles = {
  lg: 'max-w-[1280px]',
  xl: 'max-w-[1440px]',
}

const padStyles = {
  none: '',
  sm: 'px-4 md:px-6',
  md: 'px-6 md:px-10',
  lg: 'px-8 md:px-12',
}

export function Container({
  size = 'lg',
  pad = 'md',
  className = '',
  children,
  ...props
}: ContainerProps) {
  const styles = `
    w-full mx-auto
    ${sizeStyles[size]}
    ${padStyles[pad]}
    ${className}
  `
    .trim()
    .replace(/\s+/g, ' ')

  return (
    <div className={styles} {...props}>
      {children}
    </div>
  )
}
