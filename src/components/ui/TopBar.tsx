'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { useUIStore } from '@/lib/store'
import { SidebarChats } from '@/components/layout/SidebarChats'

interface TopBarProps {
  title?: string
}

export function TopBar({ title }: TopBarProps) {
  const { selectedChat } = useUIStore()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const displayTitle = title || selectedChat?.title || 'AI Content Chat'

  return (
    <>
      <motion.div
        className="glass border-b border-border px-6 py-4 backdrop-blur-md"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Hamburger menu for small screens */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden w-8 h-8 rounded-lg glass border border-border flex items-center justify-center text-text hover:bg-white/10 transition-all ring-focus"
              aria-label="Toggle sidebar"
            >
              {sidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>

            <div className="flex flex-col gap-1">
              <h1 className="text-xl font-semibold text-text">{displayTitle}</h1>
              {selectedChat && (
                <div className="flex items-center gap-3 text-xs text-muted">
                  <span>{selectedChat.message_count} messages</span>
                  <span>•</span>
                  <span>
                    {selectedChat.last_message_at ? (
                      <>
                        Last active:{' '}
                        {new Date(selectedChat.last_message_at).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </>
                    ) : (
                      <>
                        Created:{' '}
                        {new Date(selectedChat.created_at).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </>
                    )}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Optional actions */}
          <div className="flex items-center gap-2">{/* Add any additional controls here */}</div>
        </div>
      </motion.div>

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            {/* Overlay */}
            <motion.div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-20 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
            />

            {/* Sidebar */}
            <motion.div
              className="fixed left-0 top-0 w-64 sm:w-80 h-full z-30 lg:hidden"
              initial={{ x: -256 }}
              animate={{ x: 0 }}
              exit={{ x: -256 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            >
              <SidebarChats />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
