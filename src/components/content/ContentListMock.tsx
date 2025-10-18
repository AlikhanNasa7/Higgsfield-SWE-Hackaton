'use client'

import { motion } from 'framer-motion'
import { useUIStore } from '@/lib/store'
import { mockContents } from '@/mockData'
import { Image, Video, Filter, Search, Download } from 'lucide-react'
import { type ContentItem } from '@/types/schemas'
import { Badge } from '@/components/design/Badge'
import { fadeUp, stagger } from '@/lib/motion'

function ContentItemCard({
  content,
  isSelected,
  onSelect,
}: {
  content: ContentItem
  isSelected: boolean
  onSelect: () => void
}) {
  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation() // Prevent triggering onSelect

    try {
      // Fetch the content
      const response = await fetch(content.url)
      const blob = await response.blob()

      // Create download link
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url

      // Determine file extension
      const extension = content.kind === 'image' ? 'png' : 'mp4'
      const filename = content.title
        ? `${content.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.${extension}`
        : `content_${content.id}.${extension}`

      link.download = filename
      document.body.appendChild(link)
      link.click()

      // Cleanup
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Download failed:', error)
    }
  }

  return (
    <motion.div
      variants={fadeUp}
      onClick={onSelect}
      className={`cursor-pointer rounded-xl overflow-hidden transition-all hover-lift ${
        isSelected ? 'ring-2 ring-primary shadow-glow-primary' : 'glass hover:border-primary/30'
      }`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="aspect-square relative bg-surface group">
        {content.thumbUrl ? (
          <img
            src={content.thumbUrl}
            alt={content.title || `${content.kind} thumbnail`}
            className="w-full h-full object-cover"
          />
        ) : content.kind === 'image' ? (
          <div className="w-full h-full flex items-center justify-center">
            <Image className="w-12 h-12 text-muted" aria-label="Image placeholder" />
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Video className="w-12 h-12 text-muted" aria-label="Video placeholder" />
          </div>
        )}

        {/* Badge */}
        <div className="absolute top-2 right-2">
          <Badge tone={content.kind === 'image' ? 'primary' : 'accent'} variant="solid">
            {content.kind === 'image' ? (
              <Image className="w-3 h-3" aria-label="Image badge" />
            ) : (
              <Video className="w-3 h-3" aria-label="Video badge" />
            )}
          </Badge>
        </div>

        {/* Download button */}
        <motion.button
          onClick={handleDownload}
          className="absolute top-2 left-2 w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-glow-primary opacity-0 group-hover:opacity-100 transition-opacity ring-focus z-10"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Download content"
        >
          <Download className="w-4 h-4 text-black" />
        </motion.button>

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3 pointer-events-none">
          {content.title && (
            <p className="text-xs text-text font-medium truncate">{content.title}</p>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export function ContentListMock() {
  const {
    selectedChat,
    selectedContent,
    filters,
    searchQuery,
    selectContent,
    setFilter,
    setSearch,
  } = useUIStore()

  const contents = selectedChat ? mockContents[selectedChat.id] || [] : []

  const filteredContents = contents.filter(content => {
    const matchesFilter = filters === 'all' || content.kind === filters.slice(0, -1)
    const matchesSearch =
      !searchQuery || content.title?.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesFilter && matchesSearch
  })

  return (
    <div className="h-full flex flex-col bg-surface/50">
      {/* Header */}
      <div className="glass border-b border-border p-4 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl glass flex items-center justify-center">
            <Filter className="w-5 h-5 text-primary" />
          </div>
          <h3 className="text-lg font-semibold text-text">Generated Content</h3>
        </div>

        {/* Filters */}
        <div className="flex gap-2">
          {[
            { value: 'all' as const, label: 'All' },
            { value: 'images' as const, label: 'Images' },
            { value: 'videos' as const, label: 'Videos' },
          ].map(filter => (
            <button
              key={filter.value}
              onClick={() => setFilter(filter.value)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ring-focus ${
                filters === filter.value
                  ? 'bg-primary/20 text-primary border border-primary/30'
                  : 'glass text-muted hover:text-text hover:bg-white/5'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <input
            type="text"
            placeholder="Search content..."
            value={searchQuery}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 text-sm glass border border-border rounded-xl text-text placeholder-muted ring-focus transition-all focus:border-primary/50"
          />
        </div>
      </div>

      {/* Content grid */}
      <div className="flex-1 overflow-y-auto p-4">
        {filteredContents && filteredContents.length > 0 ? (
          <motion.div
            className="grid grid-cols-2 gap-3"
            variants={stagger(0, 0.05)}
            initial="initial"
            animate="animate"
          >
            {filteredContents.map(content => (
              <ContentItemCard
                key={content.id}
                content={content}
                isSelected={selectedContent?.id === content.id}
                onSelect={() => selectContent(content)}
              />
            ))}
          </motion.div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <motion.div
              className="text-center space-y-3"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <div className="w-16 h-16 rounded-2xl glass mx-auto flex items-center justify-center">
                <Filter className="w-8 h-8 text-muted" />
              </div>
              <div>
                <p className="text-sm font-medium text-text">No content found</p>
                <p className="text-xs text-muted">
                  {contents.length === 0
                    ? "This chat doesn't have any generated content yet."
                    : 'No content matches your current filters.'}
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  )
}
