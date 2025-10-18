'use client'

import { motion } from 'framer-motion'
import { Container } from '../design/Container'
import { Button } from '../design/Button'
import { fadeUp, stagger } from '@/lib/motion'

export function HeroCinematic() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden grain">
      {/* Gradient Backdrop */}
      <div className="absolute inset-0 gradient-radial-dual pointer-events-none" />

      {/* Animated Grid */}
      <div className="absolute inset-0 opacity-20">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)`,
            backgroundSize: '64px 64px',
          }}
        />
      </div>

      <Container size="lg" pad="md">
        <motion.div
          className="text-center space-y-8 relative z-10"
          variants={stagger(0.2, 0.15)}
          initial="initial"
          animate="animate"
        >
          {/* Eyebrow */}
          <motion.div variants={fadeUp} className="eyebrow">
            Welcome to the Future
          </motion.div>

          {/* Headline */}
          <motion.h1 variants={fadeUp} className="display-lg title-gradient max-w-5xl mx-auto">
            Cinematic Design System for Modern Web
          </motion.h1>

          {/* Subcopy */}
          <motion.p variants={fadeUp} className="body-lg text-muted max-w-2xl mx-auto">
            Experience the next generation of UI design. Built with precision, crafted for impact,
            and optimized for the boldest ideas.
          </motion.p>

          {/* CTA */}
          <motion.div
            variants={fadeUp}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button variant="primary" size="lg">
              Get Started
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </Button>
            <Button variant="glass" size="lg">
              View Documentation
            </Button>
          </motion.div>

          {/* Stats or Social Proof */}
          <motion.div
            variants={fadeUp}
            className="flex flex-wrap items-center justify-center gap-8 pt-8 text-sm"
          >
            <div className="flex items-center gap-2 text-muted">
              <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span>5,000+ components</span>
            </div>
            <div className="flex items-center gap-2 text-muted">
              <svg className="w-5 h-5 text-accent" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Fully accessible</span>
            </div>
            <div className="flex items-center gap-2 text-muted">
              <svg className="w-5 h-5 text-success" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Blazing fast</span>
            </div>
          </motion.div>
        </motion.div>
      </Container>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-bg to-transparent pointer-events-none" />
    </section>
  )
}
