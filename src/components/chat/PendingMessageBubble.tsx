'use client'

import { motion } from 'framer-motion'
import { User } from 'lucide-react'

interface PendingMessageBubbleProps {
  message: string
}

export function PendingMessageBubble({ message }: PendingMessageBubbleProps) {
  return (
    <motion.div
      className="flex gap-3 flex-row-reverse"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Avatar */}
      <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-primary">
        <User className="w-4 h-4 text-black" />
      </div>

      {/* Message */}
      <div className="max-w-xs">
        <div className="bg-primary shadow-glow-primary rounded-2xl px-4 py-3">
          <p className="text-black text-sm leading-relaxed">{message}</p>
        </div>
        <div className="text-xs text-muted/70 mt-1 text-right">Sending...</div>
      </div>
    </motion.div>
  )
}
