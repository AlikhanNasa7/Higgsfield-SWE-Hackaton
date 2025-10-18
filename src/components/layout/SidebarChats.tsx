'use client'

import { MessageSquare, Plus, Trash2, Edit3, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useUIStore } from '@/lib/store'
import { useChats, useCreateChat, useUpdateChat, useDeleteChat } from '@/lib/hooks/useChats'
import { type Chat } from '@/types/schemas'
import { fadeUp } from '@/lib/motion'
import { CreateChatModal } from '@/components/ui/CreateChatModal'

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
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      className={`group flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${
        isSelected
          ? 'glass border-primary/30 shadow-glow-primary bg-primary/5'
          : 'glass hover:bg-white/5 hover:border-white/20'
      }`}
      onClick={!isEditing ? onSelect : undefined}
    >
      <MessageSquare
        className={`w-4 h-4 flex-shrink-0 ${isSelected ? 'text-primary' : 'text-muted'}`}
      />
      <div className="flex-1 min-w-0">
        {isEditing ? (
          <input
            type="text"
            value={editTitle}
            onChange={e => setEditTitle(e.target.value)}
            onBlur={handleSave}
            onKeyDown={handleKeyDown}
            className="w-full bg-transparent border-none outline-none text-sm text-text ring-focus"
            autoFocus
          />
        ) : (
          <div className="flex flex-col gap-1">
            <span
              className={`text-sm truncate block ${isSelected ? 'text-text font-medium' : 'text-muted'}`}
            >
              {chat.title}
            </span>
            <div className="flex items-center gap-2 text-xs text-muted/70">
              <span>{chat.message_count} messages</span>
              <span>•</span>
              <span>
                {chat.last_message_at
                  ? new Date(chat.last_message_at).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                    })
                  : new Date(chat.created_at).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                    })}
              </span>
            </div>
          </div>
        )}
      </div>
      {!isEditing && (
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={e => {
              e.stopPropagation()
              setIsEditing(true)
            }}
            className="p-1.5 rounded-lg hover:bg-white/10 transition-colors ring-focus"
            aria-label="Edit chat"
          >
            <Edit3 className="w-3.5 h-3.5 text-muted" />
          </button>
          <button
            onClick={e => {
              e.stopPropagation()
              onDelete()
            }}
            className="p-1.5 rounded-lg hover:bg-error/20 transition-colors ring-focus"
            aria-label="Delete chat"
          >
            <Trash2 className="w-3.5 h-3.5 text-error" />
          </button>
        </div>
      )}
    </motion.div>
  )
}

export function SidebarChats() {
  const router = useRouter()
  const { selectedChat, selectChat } = useUIStore()
  const [isModalOpen, setIsModalOpen] = useState(false)

  const { data: chats, isLoading, error, refetch } = useChats()
  const createMutation = useCreateChat()
  const deleteMutation = useDeleteChat()

  const handleCreateChat = (title: string) => {
    createMutation.mutate(title, {
      onSuccess: data => {
        selectChat(data.chat)
        router.push(`/chat/${data.chat.id}`)
        setIsModalOpen(false)
        refetch()
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
      <div className="flex flex-col h-full glass border-r border-border">
        <div className="p-4 space-y-3">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="h-12 rounded-xl glass animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col h-full glass border-r border-border p-4">
        <div className="flex items-center justify-center h-full">
          <div className="text-center space-y-2">
            <p className="text-error text-sm">Failed to load chats</p>
            <button
              onClick={() => window.location.reload()}
              className="text-xs text-primary hover:text-primary-light transition-colors"
            >
              Try again
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full glass border-r border-border">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center shadow-glow-primary overflow-hidden">
            <Image src="/higgsfield-icon.webp" alt="Higgsfield Chat" width={32} height={32} />
          </div>
          <h2 className="text-lg font-semibold text-text">Higgsfield Chat</h2>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          disabled={createMutation.isPending}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-primary text-black font-semibold shadow-glow-primary hover:bg-white hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed ring-focus"
        >
          <Plus className="w-4 h-4" />
          <span>New Chat</span>
        </button>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto p-4">
        {chats && chats.length > 0 ? (
          <motion.div className="space-y-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
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
          </motion.div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center space-y-3">
              <div className="w-16 h-16 rounded-2xl glass mx-auto flex items-center justify-center">
                <MessageSquare className="w-8 h-8 text-muted" />
              </div>
              <div>
                <p className="text-sm font-medium text-text">No chats yet</p>
                <p className="text-xs text-muted">Create one to get started</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Create Chat Modal */}
      <CreateChatModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreateChat}
        isLoading={createMutation.isPending}
      />
    </div>
  )
}
