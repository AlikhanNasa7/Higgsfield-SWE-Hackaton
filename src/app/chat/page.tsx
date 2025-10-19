'use client'

import { TopBar } from '@/components/ui/TopBar'
import { EmptyState } from '@/components/ui/EmptyState'
import { MessageSquare } from 'lucide-react'

export default function ChatListPage() {
  return (
    <div className="flex flex-col h-full w-full">
      <div className="flex-1 flex items-center justify-center">
        <EmptyState
          icon={MessageSquare}
          title="Select a chat to start"
          description="Choose a chat from the sidebar to begin your conversation and generate content."
        />
      </div>
    </div>
  )
}
