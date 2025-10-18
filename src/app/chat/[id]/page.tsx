'use client'

import { useEffect } from 'react'
import { useParams } from 'next/navigation'
import { ThreePanelLayoutMock } from '@/components/layout/ThreePanelLayoutMock'
import { TopBar } from '@/components/ui/TopBar'
import { useUIStore } from '@/lib/store'
import { useChats } from '@/lib/hooks/useChats'

export default function ChatPage() {
  const params = useParams()
  const chatId = params.id as string
  const { selectChat, selectedChat } = useUIStore()
  const { data: chats } = useChats()

  useEffect(() => {
    // Set the selected chat when the page loads
    if (chatId && chats) {
      const chat = chats.find(c => c.id === chatId)
      if (chat) {
        selectChat(chat)
      }
    }
  }, [chatId, chats, selectChat])

  return (
    <div className="flex flex-col h-full w-full">
      <TopBar title={selectedChat?.title || 'AI Content Chat'} />
      <div className="flex-1 min-h-0">
        <ThreePanelLayoutMock />
      </div>
    </div>
  )
}
