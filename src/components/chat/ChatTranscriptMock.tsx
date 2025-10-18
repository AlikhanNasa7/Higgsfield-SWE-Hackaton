'use client'

import { useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useUIStore } from '@/lib/store'
import { mockMessages } from '@/mockData'
import { MessageBubble } from './MessageBubble'
import { ComposerMock } from './ComposerMock'
import { MessageSquare } from 'lucide-react'
import { fadeUp, stagger } from '@/lib/motion'

export function ChatTranscriptMock() {
  const { selectedChat } = useUIStore()
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const messages = selectedChat ? mockMessages[selectedChat.id] || [] : []

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  if (!selectedChat) {
    return (
      <div className="h-full flex flex-col items-center justify-center">
        <motion.div
          className="text-center space-y-4 max-w-md"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          <div className="w-20 h-20 rounded-2xl glass mx-auto flex items-center justify-center">
            <MessageSquare className="w-10 h-10 text-primary" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-text mb-2">Select a chat</h3>
            <p className="text-muted">Choose a chat from the sidebar to start the conversation.</p>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col bg-surface/50">
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages && messages.length > 0 ? (
          <motion.div
            className="space-y-6"
            variants={stagger(0, 0.05)}
            initial="initial"
            animate="animate"
          >
            {messages.map(message => (
              <motion.div key={message.id} variants={fadeUp}>
                <MessageBubble message={message} />
              </motion.div>
            ))}
            <div ref={messagesEndRef} />
          </motion.div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <motion.div
              className="text-center space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="w-16 h-16 rounded-2xl glass mx-auto flex items-center justify-center">
                <MessageSquare className="w-8 h-8 text-muted" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-text mb-1">No messages yet</h3>
                <p className="text-sm text-muted">
                  Start the conversation by typing a message below.
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </div>

      {/* Composer */}
      <div className="border-t border-border glass">
        <ComposerMock />
      </div>
    </div>
  )
}
