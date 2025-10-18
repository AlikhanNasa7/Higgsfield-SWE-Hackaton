'use client'

import { motion } from 'framer-motion'
import { fadeUp, stagger } from '@/lib/motion'

export interface SectionHeaderProps {
  eyebrow?: string
  title: string
  subtitle?: string
  align?: 'left' | 'center'
  gradient?: boolean
  className?: string
}

export function SectionHeader({
  eyebrow,
  title,
  subtitle,
  align = 'center',
  gradient = false,
  className = '',
}: SectionHeaderProps) {
  const alignStyles = align === 'center' ? 'text-center mx-auto max-w-3xl' : 'text-left'

  return (
    <motion.div
      className={`space-y-4 ${alignStyles} ${className}`}
      variants={stagger(0, 0.1)}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, margin: '-100px' }}
    >
      {eyebrow && (
        <motion.div variants={fadeUp} className="eyebrow">
          {eyebrow}
        </motion.div>
      )}

      <motion.h2
        variants={fadeUp}
        className={`display-sm ${gradient ? 'title-gradient' : 'text-text'}`}
      >
        {title}
      </motion.h2>

      {subtitle && (
        <motion.p variants={fadeUp} className="body-lg text-muted max-w-2xl">
          {subtitle}
        </motion.p>
      )}
    </motion.div>
  )
}
