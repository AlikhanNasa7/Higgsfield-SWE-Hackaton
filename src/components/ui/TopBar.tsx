'use client'

import { Menu, Plus } from 'lucide-react'
import { useUIStore } from '@/lib/store'

interface TopBarProps {
  title?: string
  onNewChat?: () => void
}

export function TopBar({ title = 'AI Content Chat', onNewChat }: TopBarProps) {
  const uiData = useUIStore();
  const { sidebarOpen, toggleSidebar } = uiData;
  console.log('uiData', uiData);

  return (
    <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
      <div className="flex items-center gap-3">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
          aria-label={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
        >
          <Menu className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{title}</h1>
      </div>

      {onNewChat && (
        <button
          onClick={onNewChat}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
        >
          <Plus className="w-4 h-4" />
          New Chat
        </button>
      )}
    </div>
  )
}
