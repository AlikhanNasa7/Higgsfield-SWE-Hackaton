'use client'

import { SidebarChats } from './SidebarChats'
import { useUIStore } from '@/lib/store'

interface LayoutShellProps {
  children: React.ReactNode
}

export function LayoutShell({ children }: LayoutShellProps) {
  const { sidebarOpen } = useUIStore()

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-950">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? 'w-80' : 'w-0'
        } transition-all duration-300 ease-in-out overflow-hidden flex-shrink-0`}
      >
        {sidebarOpen && <SidebarChats />}
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">{children}</div>
    </div>
  )
}
