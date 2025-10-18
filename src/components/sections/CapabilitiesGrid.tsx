'use client'

import { motion } from 'framer-motion'
import { Container } from '../design/Container'
import { SectionHeader } from '../design/SectionHeader'
import { GlowCard } from '../design/GlowCard'
import { fadeUp, stagger } from '@/lib/motion'

const capabilities = [
  {
    icon: '⚡',
    title: 'Lightning Fast',
    description: 'Optimized for performance with minimal bundle size and maximum efficiency.',
  },
  {
    icon: '🎨',
    title: 'Fully Customizable',
    description: 'Every component adapts to your brand with flexible theming options.',
  },
  {
    icon: '♿',
    title: 'Accessible',
    description: 'WCAG 2.1 compliant with keyboard navigation and screen reader support.',
  },
  {
    icon: '📱',
    title: 'Responsive',
    description: 'Mobile-first design that looks perfect on any device or screen size.',
  },
  {
    icon: '🌙',
    title: 'Dark Mode',
    description: 'Beautiful dark and light themes with automatic system preference detection.',
  },
  {
    icon: '🎭',
    title: 'Animations',
    description: 'Smooth micro-interactions powered by Framer Motion with reduced motion support.',
  },
]

export function CapabilitiesGrid() {
  return (
    <section className="py-24 md:py-32 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />

      <Container size="lg" pad="md">
        <SectionHeader
          eyebrow="Capabilities"
          title="Everything you need to build amazing interfaces"
          subtitle="A comprehensive design system with all the components and patterns you need."
          gradient
        />

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-16"
          variants={stagger(0.3, 0.1)}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: '-100px' }}
        >
          {capabilities.map((capability, index) => (
            <motion.div key={index} variants={fadeUp}>
              <GlowCard title={capability.title} subtitle={capability.description} hoverGlow>
                <div className="text-5xl mb-4">{capability.icon}</div>
              </GlowCard>
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </section>
  )
}
