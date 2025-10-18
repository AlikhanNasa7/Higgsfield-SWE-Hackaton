'use client'

import { motion } from 'framer-motion'
import { Container } from '../design/Container'
import { SectionHeader } from '../design/SectionHeader'
import { fadeUp, stagger } from '@/lib/motion'

const steps = [
  {
    number: '01',
    title: 'Install',
    description: 'Add the design system to your project with a single command.',
    code: 'npm install @cinematic/ui',
  },
  {
    number: '02',
    title: 'Configure',
    description: 'Customize the theme tokens to match your brand identity.',
    code: 'import { theme } from "@cinematic/ui"',
  },
  {
    number: '03',
    title: 'Build',
    description: 'Start creating beautiful interfaces with our components.',
    code: '<Button variant="primary">Ship it</Button>',
  },
]

export function Steps() {
  return (
    <section className="py-24 md:py-32 relative">
      <Container size="lg" pad="md">
        <SectionHeader
          eyebrow="Getting Started"
          title="Three steps to brilliance"
          subtitle="Get up and running in minutes, not hours."
        />

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16"
          variants={stagger(0.3, 0.15)}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: '-100px' }}
        >
          {steps.map((step, index) => (
            <motion.div key={index} variants={fadeUp} className="relative">
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-16 left-full w-full h-px bg-gradient-to-r from-border via-primary/30 to-border -translate-y-1/2 z-0" />
              )}

              <div className="relative z-10 space-y-4">
                {/* Number */}
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl glass text-2xl font-bold title-gradient">
                  {step.number}
                </div>

                {/* Content */}
                <div className="space-y-2">
                  <h3 className="text-2xl font-semibold text-text">{step.title}</h3>
                  <p className="text-muted leading-relaxed">{step.description}</p>
                </div>

                {/* Code snippet */}
                <div className="glass rounded-xl p-4 overflow-x-auto">
                  <code className="text-sm text-primary font-mono">{step.code}</code>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </section>
  )
}
