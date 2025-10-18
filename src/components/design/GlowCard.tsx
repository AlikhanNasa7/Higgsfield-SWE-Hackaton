'use client'

import { motion } from 'framer-motion'
import { HTMLAttributes, ReactNode } from 'react'
import { hoverLift } from '@/lib/motion'

export interface GlowCardProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  as?: 'div' | 'a' | 'article'
  hoverGlow?: boolean
  media?: ReactNode
  title?: string
  subtitle?: string
  cta?: ReactNode
  href?: string
  children?: ReactNode
}

export function GlowCard({
  as = 'div',
  hoverGlow = true,
  media,
  title,
  subtitle,
  cta,
  href,
  className = '',
  children,
  ...props
}: GlowCardProps) {
  const Component = motion[as] as any

  const baseStyles = `
    glass rounded-2xl overflow-hidden
    transition-all duration-300 ease-out
    ${hoverGlow ? 'hover:shadow-glow-primary hover:border-primary/30' : ''}
    ${className}
  `
    .trim()
    .replace(/\s+/g, ' ')

  const cardProps = {
    className: baseStyles,
    variants: hoverGlow ? hoverLift : undefined,
    initial: 'initial',
    whileHover: hoverGlow ? 'hover' : undefined,
    ...(href && as === 'a' ? { href } : {}),
    ...props,
  }

  return (
    <Component {...cardProps}>
      {media && <div className="relative w-full overflow-hidden bg-surface/50">{media}</div>}

      {(title || subtitle || cta || children) && (
        <div className="p-6 space-y-3">
          {title && <h3 className="text-xl font-semibold text-text">{title}</h3>}

          {subtitle && <p className="text-muted leading-relaxed">{subtitle}</p>}

          {children}

          {cta && <div className="pt-2">{cta}</div>}
        </div>
      )}
    </Component>
  )
}
