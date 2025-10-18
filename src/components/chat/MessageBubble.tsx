'use client'

import { useUIStore } from '@/lib/store'
import { type Message, type Part } from '@/types/schemas'
import { mockContents } from '@/mockData'

interface MessageBubbleProps {
  message: Message
}

function PartRenderer({ part }: { part: Part }) {
  const { selectContent, selectedChat } = useUIStore()

  if (part.type === 'text') {
    return <p className="text-gray-900 dark:text-gray-100">{part.text}</p>
  }

  if (part.type === 'Button') {
    const handleClick = () => {
      // Find the content from mock data
      if (selectedChat) {
        const chatContents = mockContents[selectedChat.id] || []
        const content = chatContents.find(c => c.id === part.targetContentId)
        if (content) {
          selectContent(content)
        }
      }
    }

    return (
      <button
        onClick={handleClick}
        className="inline-flex items-center px-3 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md hover:bg-blue-100 dark:hover:bg-blue-900/30 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 transition-colors"
      >
        {part.label}
      </button>
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
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
      {/* Avatar */}
      <div className="flex-shrink-0">
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
            isUser
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
          }`}
        >
          {isUser ? 'U' : 'AI'}
        </div>
      </div>

      {/* Message content */}
      <div className={`flex-1 min-w-0 ${isUser ? 'text-right' : ''}`}>
        <div
          className={`inline-block max-w-[80%] p-3 rounded-lg ${
            isUser
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
          }`}
        >
          <div className="space-y-2">
            {message.parts.map((part, index) => (
              <PartRenderer key={index} part={part} />
            ))}
          </div>
        </div>
        <div
          className={`text-xs text-gray-500 dark:text-gray-400 mt-1 ${isUser ? 'text-right' : ''}`}
        >
          {createdAt}
        </div>
      </div>
    </div>
  )
}
