'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

interface CreateChatModalProps {
  isOpen: boolean
  onClose: () => void
  onCreate: (title: string) => void
  isLoading?: boolean
}

export function CreateChatModal({ isOpen, onClose, onCreate, isLoading }: CreateChatModalProps) {
  const [title, setTitle] = useState('')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (title.trim()) {
      onCreate(title.trim())
      setTitle('')
    }
  }

  const handleClose = () => {
    if (!isLoading) {
      setTitle('')
      onClose()
    }
  }

  if (!mounted || !isOpen) return null

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 flex items-center justify-center z-50 p-4 pointer-events-none"
          >
            <div
              className="glass border border-border rounded-2xl p-6 w-full max-w-md shadow-elevated pointer-events-auto"
              onClick={e => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-text">Create New Chat</h2>
                <button
                  onClick={handleClose}
                  disabled={isLoading}
                  className="p-1.5 rounded-lg hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ring-focus"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5 text-muted" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit}>
                <div className="mb-6">
                  <label htmlFor="chat-title" className="block text-sm font-medium text-text mb-2">
                    Chat Title
                  </label>
                  <input
                    id="chat-title"
                    type="text"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder="Enter chat title..."
                    disabled={isLoading}
                    className="w-full px-4 py-3 rounded-xl glass border border-border text-text placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    autoFocus
                    maxLength={100}
                  />
                  <p className="mt-2 text-xs text-muted">{title.length}/100 characters</p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleClose}
                    disabled={isLoading}
                    className="flex-1 px-4 py-3 rounded-xl glass border border-border text-text font-medium hover:bg-white/5 transition-all disabled:opacity-50 disabled:cursor-not-allowed ring-focus"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!title.trim() || isLoading}
                    className="flex-1 px-4 py-3 rounded-xl bg-primary text-black font-semibold shadow-glow-primary hover:bg-white hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed ring-focus"
                  >
                    {isLoading ? 'Creating...' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  )
}
