'use client'

import { SidebarChats } from '@/components/layout/SidebarChats'

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-gray-50 dark:bg-gray-950">
      {/* Sidebar */}
      <div className="w-80 h-full flex-shrink-0">
        <SidebarChats />
      </div>

      {/* Main content */}
      <div className="flex-1 h-full flex flex-col min-w-0">{children}</div>
    </div>
  )
}
