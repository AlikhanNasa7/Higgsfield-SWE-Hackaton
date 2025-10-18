'use client'

import { useRef, useEffect } from 'react'
import { useUIStore } from '@/lib/store'
import { mockMessages } from '@/mockData'
import { MessageBubble } from './MessageBubble'
import { ComposerMock } from './ComposerMock'
import { EmptyState } from '@/components/ui/EmptyState'
import { MessageSquare } from 'lucide-react'

export function ChatTranscriptMock() {
  const { selectedChat } = useUIStore()
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Get messages from mock data
  const messages = selectedChat ? mockMessages[selectedChat.id] || [] : []

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  if (!selectedChat) {
    return (
      <div className="h-full flex flex-col">
        <div className="flex-1">
          <EmptyState
            icon={MessageSquare}
            title="Select a chat"
            description="Choose a chat from the sidebar to start the conversation."
          />
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-900">
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages && messages.length > 0 ? (
          <>
            {messages.map(message => (
              <MessageBubble key={message.id} message={message} />
            ))}
            <div ref={messagesEndRef} />
          </>
        ) : (
          <EmptyState
            icon={MessageSquare}
            title="No messages yet"
            description="Start the conversation by typing a message below."
          />
        )}
      </div>

      {/* Composer */}
      <div className="border-t border-gray-200 dark:border-gray-700">
        <ComposerMock />
      </div>
    </div>
  )
}
