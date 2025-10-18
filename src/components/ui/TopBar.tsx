'use client'

import { motion } from 'framer-motion'
import { useUIStore } from '@/lib/store'

interface TopBarProps {
  title?: string
}

export function TopBar({ title }: TopBarProps) {
  const { selectedChat } = useUIStore()
  const displayTitle = title || selectedChat?.title || 'AI Content Chat'

  return (
    <motion.div
      className="glass border-b border-border px-6 py-4 backdrop-blur-md"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-semibold text-text">{displayTitle}</h1>
          {selectedChat && (
            <span className="text-xs text-muted">
              {new Date(selectedChat.updatedAt).toLocaleDateString()}
            </span>
          )}
        </div>

        {/* Optional actions */}
        <div className="flex items-center gap-2">{/* Add any additional controls here */}</div>
      </div>
    </motion.div>
  )
}
