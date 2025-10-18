'use client'

import { motion } from 'framer-motion'
import { useUIStore } from '@/lib/store'
import { type Message, type Part } from '@/types/schemas'
import { mockContents } from '@/mockData'
import { User, Sparkles } from 'lucide-react'

interface MessageBubbleProps {
  message: Message
}

function PartRenderer({ part }: { part: Part }) {
  const { selectContent, selectedChat } = useUIStore()

  if (part.type === 'text') {
    return <p className="leading-relaxed">{part.text}</p>
  }

  if (part.type === 'Button') {
    const handleClick = () => {
      if (selectedChat) {
        const chatContents = mockContents[selectedChat.id] || []
        const content = chatContents.find(c => c.id === part.targetContentId)
        if (content) {
          selectContent(content)
        }
      }
    }

    return (
      <motion.button
        onClick={handleClick}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/20 text-primary border border-primary/30 hover:bg-primary/30 hover:border-primary/50 transition-all ring-focus"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <span className="font-medium">{part.label}</span>
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 7l5 5m0 0l-5 5m5-5H6"
          />
        </svg>
      </motion.button>
    )
  }

  return null
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user'
  const createdAt = new Date(message.createdAt).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <div className={`flex gap-4 ${isUser ? 'flex-row-reverse' : ''}`}>
      {/* Avatar */}
      <div className="flex-shrink-0">
        <motion.div
          className={`w-10 h-10 rounded-xl flex items-center justify-center ${
            isUser ? 'bg-primary shadow-glow-primary' : 'glass border border-border'
          }`}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {isUser ? (
            <User className="w-5 h-5 text-black" />
          ) : (
            <Sparkles className="w-5 h-5 text-primary" />
          )}
        </motion.div>
      </div>

      {/* Message content */}
      <div className={`flex-1 min-w-0 ${isUser ? 'flex flex-col items-end' : ''}`}>
        <motion.div
          className={`inline-block max-w-[85%] p-4 rounded-2xl ${
            isUser
              ? 'bg-primary text-black shadow-glow-primary font-medium'
              : 'glass border border-border'
          }`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <div className={`space-y-3 ${isUser ? 'text-black' : 'text-text'}`}>
            {message.parts.map((part, index) => (
              <PartRenderer key={index} part={part} />
            ))}
          </div>
        </motion.div>
        <motion.div
          className={`text-xs text-muted mt-1.5 px-1 ${isUser ? 'text-right' : ''}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          {createdAt}
        </motion.div>
      </div>
    </div>
  )
}
