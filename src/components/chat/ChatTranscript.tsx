'use client'

import { useRef, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { useUIStore } from '@/lib/store'
import { useMessages } from '@/lib/hooks/useMessages'
import { MessageBubbleBackend } from './MessageBubbleBackend'
import { Composer } from './Composer'
import { MessageSquare, Loader2 } from 'lucide-react'
import { fadeUp, stagger } from '@/lib/motion'
import type { BackendMessage } from '@/types/schemas'

export function ChatTranscript() {
  const { selectedChat } = useUIStore()
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const {
    data: messagesResponse,
    isLoading,
    error,
  } = useMessages(selectedChat?.id || null, selectedChat?.message_count)
  const chatMessages = useMemo(() => {
    return messagesResponse?.items || []
  }, [messagesResponse])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatMessages])

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

  // If chat has 0 messages, don't fetch and show empty state
  if (selectedChat.message_count === 0) {
    return (
      <div className="h-full flex flex-col bg-surface/50">
        {/* Messages area - empty state */}
        <div className="flex-1 overflow-y-auto p-6">
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
        </div>

        {/* Composer */}
        <div className="border-t border-border glass">
          <Composer />
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="h-full flex flex-col items-center justify-center">
        <motion.div
          className="text-center space-y-4"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          <div className="w-16 h-16 rounded-2xl glass mx-auto flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-text mb-1">Loading messages...</h3>
            <p className="text-sm text-muted">Fetching your conversation history.</p>
          </div>
        </motion.div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="h-full flex flex-col items-center justify-center">
        <motion.div
          className="text-center space-y-4 max-w-md"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          <div className="w-16 h-16 rounded-2xl glass mx-auto flex items-center justify-center">
            <MessageSquare className="w-8 h-8 text-error" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-text mb-1">Failed to load messages</h3>
            <p className="text-sm text-muted">
              There was an error loading your conversation. Please try again.
            </p>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col bg-surface/50">
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {chatMessages && chatMessages.length > 0 ? (
          <motion.div
            className="space-y-6"
            variants={stagger(0, 0.05)}
            initial="initial"
            animate="animate"
          >
            {chatMessages.map((message: BackendMessage) => (
              <motion.div key={message.id} variants={fadeUp}>
                <MessageBubbleBackend message={message} />
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
        <Composer />
      </div>
    </div>
  )
}
