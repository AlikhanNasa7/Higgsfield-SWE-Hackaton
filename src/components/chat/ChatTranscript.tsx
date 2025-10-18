'use client'

import { useQuery } from '@tanstack/react-query'
import { useRef, useEffect } from 'react'
import { useUIStore } from '@/lib/store'
import { getMessages } from '@/lib/api'
import { MessageBubble } from './MessageBubble'
import { Composer } from './Composer'
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton'
import { ErrorState } from '@/components/ui/ErrorState'
import { EmptyState } from '@/components/ui/EmptyState'
import { MessageSquare } from 'lucide-react'

export function ChatTranscript() {
  const { selectedChatId } = useUIStore()
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const {
    data: messages,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['chat', selectedChatId, 'messages'],
    queryFn: () => getMessages(selectedChatId!),
    enabled: !!selectedChatId,
  })

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  if (!selectedChatId) {
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

  if (isLoading) {
    return (
      <div className="h-full flex flex-col">
        <div className="flex-1 p-4">
          <LoadingSkeleton />
        </div>
        <div className="border-t border-gray-200 dark:border-gray-700">
          <Composer />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="h-full flex flex-col">
        <div className="flex-1">
          <ErrorState
            title="Failed to load messages"
            message="Unable to load the chat messages. Please try again."
            onRetry={() => window.location.reload()}
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
            {messages.map((message) => (
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
        <Composer />
      </div>
    </div>
  )
}
