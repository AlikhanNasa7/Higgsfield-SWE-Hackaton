'use client'

import { motion } from 'framer-motion'
import { Container } from '../design/Container'
import { Button } from '../design/Button'
import { fadeUp, stagger } from '@/lib/motion'

export function CTASection() {
  return (
    <section className="py-24 md:py-32 relative overflow-hidden">
      {/* Gradient backdrop */}
      <div className="absolute inset-0 gradient-radial-primary opacity-50" />

      <Container size="lg" pad="md">
        <motion.div
          className="relative glass rounded-3xl p-12 md:p-16 text-center space-y-8 overflow-hidden"
          variants={stagger(0.2, 0.15)}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          {/* Background glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/20 rounded-full blur-3xl pointer-events-none" />

          <motion.div variants={fadeUp} className="eyebrow">
            Ready to get started?
          </motion.div>

          <motion.h2 variants={fadeUp} className="display-md title-gradient max-w-3xl mx-auto">
            Build something extraordinary today
          </motion.h2>

          <motion.p variants={fadeUp} className="body-lg text-muted max-w-2xl mx-auto">
            Join thousands of developers creating beautiful, accessible interfaces with our
            cinematic design system.
          </motion.p>

          <motion.div
            variants={fadeUp}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button variant="primary" size="lg">
              Start Building
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </Button>
            <Button variant="ghost" size="lg">
              View on GitHub
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path
                  fillRule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                  clipRule="evenodd"
                />
              </svg>
            </Button>
          </motion.div>
        </motion.div>
      </Container>
    </section>
  )
}
