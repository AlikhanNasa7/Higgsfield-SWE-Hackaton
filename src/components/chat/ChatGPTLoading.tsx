'use client'

import { motion } from 'framer-motion'

export function ChatGPTLoading() {
  return (
    <motion.div
      className="flex items-center gap-2 px-4 py-3 rounded-xl glass"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center gap-1">
        <motion.div
          className="w-2 h-2 bg-primary rounded-full"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 1.4,
            repeat: Infinity,
            delay: 0,
          }}
        />
        <motion.div
          className="w-2 h-2 bg-primary rounded-full"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 1.4,
            repeat: Infinity,
            delay: 0.2,
          }}
        />
        <motion.div
          className="w-2 h-2 bg-primary rounded-full"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 1.4,
            repeat: Infinity,
            delay: 0.4,
          }}
        />
      </div>
      <span className="text-sm text-muted">AI is thinking...</span>
    </motion.div>
  )
}
