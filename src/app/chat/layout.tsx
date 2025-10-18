'use client'

import { SidebarChats } from '@/components/layout/SidebarChats'

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-bg grain">
      {/* Gradient backdrop */}
      <div className="absolute inset-0 gradient-radial-dual opacity-30 pointer-events-none" />

      {/* Sidebar - hidden on small screens, visible on desktop */}
      <div className="w-80 h-full flex-shrink-0 relative z-10 hidden lg:block">
        <SidebarChats />
      </div>

      {/* Main content */}
      <div className="flex-1 h-full flex flex-col min-w-0 relative z-10">{children}</div>
    </div>
  )
}
