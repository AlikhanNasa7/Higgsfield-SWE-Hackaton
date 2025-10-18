'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { HTMLAttributes, useRef } from 'react'

export interface MediaFrameProps extends HTMLAttributes<HTMLDivElement> {
  ratio?: '16:9' | '1:1' | '9:16' | '4:3' | '21:9'
  glow?: boolean
  poster?: string
  controls?: boolean
  videoSrc?: string
  imageSrc?: string
  parallax?: boolean
  parallaxStrength?: 8 | 12 | 16
  children?: React.ReactNode
}

const ratioStyles = {
  '16:9': 'aspect-[16/9]',
  '1:1': 'aspect-square',
  '9:16': 'aspect-[9/16]',
  '4:3': 'aspect-[4/3]',
  '21:9': 'aspect-[21/9]',
}

export function MediaFrame({
  ratio = '16:9',
  glow = false,
  poster,
  controls = false,
  videoSrc,
  imageSrc,
  parallax = false,
  parallaxStrength = 12,
  className = '',
  children,
  ...props
}: MediaFrameProps) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  const y = useTransform(scrollYProgress, [0, 1], [parallaxStrength, -parallaxStrength])

  const containerStyles = `
    relative rounded-2xl overflow-hidden
    bg-surface border border-border
    ${glow ? 'shadow-glow-primary' : 'shadow-soft'}
    ${ratioStyles[ratio]}
    ${className}
  `
    .trim()
    .replace(/\s+/g, ' ')

  const MediaComponent = parallax ? motion.div : 'div'
  const mediaProps = parallax ? { style: { y } } : {}

  return (
    <div ref={ref} className={containerStyles} {...props}>
      <MediaComponent className="w-full h-full" {...mediaProps}>
        {videoSrc && (
          <video
            src={videoSrc}
            poster={poster}
            controls={controls}
            className="w-full h-full object-cover"
            playsInline
          >
            Your browser does not support the video tag.
          </video>
        )}

        {imageSrc && !videoSrc && (
          <img
            src={imageSrc}
            alt={poster || 'Media content'}
            className="w-full h-full object-cover"
          />
        )}

        {!videoSrc && !imageSrc && children && (
          <div className="w-full h-full flex items-center justify-center">{children}</div>
        )}

        {!videoSrc && !imageSrc && !children && poster && (
          <div
            className="w-full h-full bg-cover bg-center"
            style={{ backgroundImage: `url(${poster})` }}
          />
        )}
      </MediaComponent>

      {/* Gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-t from-bg/20 to-transparent pointer-events-none" />
    </div>
  )
}
