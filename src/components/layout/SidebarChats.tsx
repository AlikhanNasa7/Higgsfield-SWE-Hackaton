'use client'

import { MessageSquare, Plus, Trash2, Edit3 } from 'lucide-react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUIStore } from '@/lib/store'
import { useChats, useCreateChat, useUpdateChat, useDeleteChat } from '@/lib/hooks/useChats'
import { EmptyState } from '@/components/ui/EmptyState'
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton'
import { ErrorState } from '@/components/ui/ErrorState'
import { type Chat } from '@/types/schemas'

interface EditableChatItemProps {
  chat: Chat
  isSelected: boolean
  onSelect: () => void
  onDelete: () => void
}

function EditableChatItem({ chat, isSelected, onSelect, onDelete }: EditableChatItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(chat.title)
  const updateMutation = useUpdateChat()

  const handleUpdate = (title: string) => {
    updateMutation.mutate(
      { id: chat.id, title },
      {
        onSuccess: () => {
          setIsEditing(false)
        },
      }
    )
  }

  const handleSave = () => {
    if (editTitle.trim() && editTitle !== chat.title) {
      handleUpdate(editTitle.trim())
    } else {
      setIsEditing(false)
      setEditTitle(chat.title)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave()
    } else if (e.key === 'Escape') {
      setIsEditing(false)
      setEditTitle(chat.title)
    }
  }

  return (
    <div
      className={`group flex items-center gap-2 p-3 rounded-lg cursor-pointer transition-colors ${
        isSelected
          ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-900 dark:text-blue-100'
          : 'hover:bg-gray-100 dark:hover:bg-gray-800'
      }`}
      onClick={!isEditing ? onSelect : undefined}
    >
      <MessageSquare className="w-4 h-4 flex-shrink-0" />
      <div className="flex-1 min-w-0">
        {isEditing ? (
          <input
            type="text"
            value={editTitle}
            onChange={e => setEditTitle(e.target.value)}
            onBlur={handleSave}
            onKeyDown={handleKeyDown}
            className="w-full bg-transparent border-none outline-none text-sm"
            autoFocus
          />
        ) : (
          <span className="text-sm truncate">{chat.title}</span>
        )}
      </div>
      {!isEditing && (
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={e => {
              e.stopPropagation()
              setIsEditing(true)
            }}
            className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
            aria-label="Edit chat title"
          >
            <Edit3 className="w-3 h-3" />
          </button>
          <button
            onClick={e => {
              e.stopPropagation()
              onDelete()
            }}
            className="p-1 hover:bg-red-100 dark:hover:bg-red-900/20 rounded text-red-600 dark:text-red-400"
            aria-label="Delete chat"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      )}
    </div>
  )
}

export function SidebarChats() {
  const router = useRouter()
  const { selectedChat, selectChat } = useUIStore()

  // Use hooks with data service layer
  const { data: chats, isLoading, error } = useChats()
  const createMutation = useCreateChat()
  const deleteMutation = useDeleteChat()

  const handleNewChat = () => {
    const title = `New Chat ${new Date().toLocaleTimeString()}`
    createMutation.mutate(title, {
      onSuccess: data => {
        selectChat(data.chat)
        router.push(`/chat/${data.chat.id}`)
      },
    })
  }

  const handleDeleteChat = (chatId: string) => {
    if (confirm('Are you sure you want to delete this chat?')) {
      deleteMutation.mutate(chatId, {
        onSuccess: () => {
          if (selectedChat?.id === chatId) {
            selectChat(null)
            router.push('/chat')
          }
        },
      })
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700">
        <div className="p-4">
          <LoadingSkeleton />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700">
        <div className="p-4">
          <ErrorState
            title="Failed to load chats"
            message="Unable to load your chat history. Please try again."
          />
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={handleNewChat}
          disabled={createMutation.isPending}
          className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus className="w-4 h-4" />
          New Chat
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {chats && chats.length > 0 ? (
          <div className="space-y-1">
            {chats.map(chat => (
              <EditableChatItem
                key={chat.id}
                chat={chat}
                isSelected={selectedChat?.id === chat.id}
                onSelect={() => {
                  selectChat(chat)
                  router.push(`/chat/${chat.id}`)
                }}
                onDelete={() => handleDeleteChat(chat.id)}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={MessageSquare}
            title="No chats yet"
            description="Start a new conversation to begin creating content."
            action={
              <button
                onClick={handleNewChat}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <Plus className="w-4 h-4" />
                Create your first chat
              </button>
            }
          />
        )}
      </div>
    </div>
  )
}
