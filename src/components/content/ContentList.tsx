'use client'

import { motion } from 'framer-motion'
import { useUIStore } from '@/lib/store'
import { useAttachments } from '@/lib/hooks/useAttachments'
import {
  Image,
  Video,
  Filter,
  Search,
  Download,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { type ContentItem } from '@/types/schemas'
import { Badge } from '@/components/design/Badge'
import { fadeUp, stagger } from '@/lib/motion'
import { useState, useRef, useEffect } from 'react'

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
      className={`cursor-pointer rounded-xl overflow-hidden transition-all hover-lift w-32 h-24 flex-shrink-0 ${
        isSelected ? 'ring-2 ring-primary shadow-glow-primary' : 'glass hover:border-primary/30'
      }`}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="w-full h-full relative group">
        {content.kind === 'video' ? (
          // Video thumbnail - Higgsfield.ai style (autoplay)
          <video
            src={content.url}
            loop
            muted
            autoPlay
            playsInline
            disablePictureInPicture
            preload="metadata"
            className="w-full h-full object-cover rounded-xl"
            aria-label={content.title || 'Video content'}
          >
            Your browser does not support the video.
          </video>
        ) : content.thumbUrl ? (
          <img
            src={content.thumbUrl}
            alt={content.title || `${content.kind} thumbnail`}
            className="w-full h-full object-cover rounded-xl"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Image className="w-12 h-12 text-muted" aria-label="Image placeholder" />
          </div>
        )}

        {/* Badge */}
        <div className="absolute top-1 right-1">
          <Badge tone={content.kind === 'image' ? 'primary' : 'accent'} variant="solid">
            {content.kind === 'image' ? (
              <Image className="w-2 h-2" aria-label="Image badge" />
            ) : (
              <Video className="w-2 h-2" aria-label="Video badge" />
            )}
          </Badge>
        </div>

        {/* Download button */}
        <motion.button
          onClick={handleDownload}
          className="absolute top-1 left-1 w-6 h-6 rounded-md bg-primary flex items-center justify-center shadow-glow-primary opacity-0 group-hover:opacity-100 transition-opacity ring-focus z-10"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Download content"
        >
          <Download className="w-3 h-3 text-black" />
        </motion.button>

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2 pointer-events-none">
          {content.title && (
            <p className="text-xs text-text font-medium truncate">{content.title}</p>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export function ContentList() {
  const {
    selectedChat,
    selectedContent,
    filters,
    searchQuery,
    generatedContent,
    selectContent,
    setFilter,
    setSearch,
  } = useUIStore()

  // Slider state
  const [scrollPosition, setScrollPosition] = useState(0)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)
  const sliderRef = useRef<HTMLDivElement>(null)

  // Fetch attachments from API
  const { data: attachments = [], isLoading, error } = useAttachments(selectedChat?.id || null)

  // Convert attachments to ContentItem format
  const apiContents: ContentItem[] = attachments.map(attachment => ({
    id: attachment.id,
    kind: attachment.kind,
    title: attachment.option_id ? `Generated ${attachment.kind}` : `Uploaded ${attachment.kind}`,
    url: attachment.storage_url,
    thumbUrl: attachment.storage_url,
    createdAt: attachment.created_at,
  }))

  // Combine API content and generated content, deduplicating by ID
  const generatedContentsForChat = selectedChat ? generatedContent[selectedChat.id] || [] : []

  // Create a map to deduplicate content by ID, giving priority to generated content
  const contentMap = new Map<string, ContentItem>()

  // Add API content first (lower priority)
  apiContents.forEach(content => {
    contentMap.set(content.id, content)
  })

  // Add generated content (higher priority - will overwrite API content with same ID)
  generatedContentsForChat.forEach(content => {
    contentMap.set(content.id, content)
  })

  const contents = Array.from(contentMap.values())

  const filteredContents = contents.filter(content => {
    const matchesFilter = filters === 'all' || content.kind === filters.slice(0, -1)
    const matchesSearch =
      !searchQuery || content.title?.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesFilter && matchesSearch
  })

  // Improved slider functions
  const scrollSlider = (direction: 'left' | 'right') => {
    if (!sliderRef.current) return

    const scrollAmount = sliderRef.current.clientWidth * 0.6 // Scroll 60% of visible width
    const newPosition =
      direction === 'left' ? scrollPosition - scrollAmount : scrollPosition + scrollAmount

    sliderRef.current.scrollTo({
      left: newPosition,
      behavior: 'smooth',
    })
    setScrollPosition(newPosition)
  }

  const updateScrollButtons = () => {
    if (!sliderRef.current) return

    const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current
    setCanScrollLeft(scrollLeft > 10) // Small threshold for better UX
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10)

    // Calculate scroll progress
    const maxScroll = scrollWidth - clientWidth
    const progress = maxScroll > 0 ? scrollLeft / maxScroll : 0
    setScrollProgress(progress)
  }

  // Update scroll buttons when content changes
  useEffect(() => {
    updateScrollButtons()
  }, [filteredContents])

  // Reset scroll position when chat changes
  useEffect(() => {
    setScrollPosition(0)
    if (sliderRef.current) {
      sliderRef.current.scrollLeft = 0
    }
  }, [selectedChat?.id])

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

        {/* <div className="flex gap-2">
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

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <input
            type="text"
            placeholder="Search content..."
            value={searchQuery}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 text-sm glass border border-border rounded-xl text-text placeholder-muted ring-focus transition-all focus:border-primary/50"
          />
        </div> */}
      </div>

      {/* Content grid */}
      <div className="flex-1 overflow-y-auto p-2 w-full">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <motion.div
              className="text-center space-y-3"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <div className="w-16 h-16 rounded-2xl glass mx-auto flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
              </div>
              <div>
                <p className="text-sm font-medium text-text">Loading content...</p>
                <p className="text-xs text-muted">Fetching attachments from server</p>
              </div>
            </motion.div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-full">
            <motion.div
              className="text-center space-y-3"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <div className="w-16 h-16 rounded-2xl glass mx-auto flex items-center justify-center">
                <Filter className="w-8 h-8 text-error" />
              </div>
              <div>
                <p className="text-sm font-medium text-text">Failed to load content</p>
                <p className="text-xs text-muted">There was an error fetching attachments</p>
              </div>
            </motion.div>
          </div>
        ) : filteredContents && filteredContents.length > 0 ? (
          <div className="relative">
            {/* Enhanced left scroll button */}
            {canScrollLeft && (
              <motion.button
                onClick={() => scrollSlider('left')}
                className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full glass border border-border/50 flex items-center justify-center hover:bg-white/10 hover:border-primary/50 transition-all ring-focus backdrop-blur-md shadow-lg"
                aria-label="Scroll left"
                whileHover={{ scale: 1.1, x: -2 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, type: 'spring', stiffness: 300 }}
              >
                <ChevronLeft className="w-5 h-5 text-text" />
              </motion.button>
            )}

            {/* Enhanced right scroll button */}
            {canScrollRight && (
              <motion.button
                onClick={() => scrollSlider('right')}
                className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full glass border border-border/50 flex items-center justify-center hover:bg-white/10 hover:border-primary/50 transition-all ring-focus backdrop-blur-md shadow-lg"
                aria-label="Scroll right"
                whileHover={{ scale: 1.1, x: 2 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, type: 'spring', stiffness: 300 }}
              >
                <ChevronRight className="w-5 h-5 text-text" />
              </motion.button>
            )}

            {/* Enhanced horizontal slider with gradient fade */}
            <div className="relative">
              {/* Left gradient fade */}
              {canScrollLeft && (
                <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-bg to-transparent z-10 pointer-events-none" />
              )}

              {/* Right gradient fade */}
              {canScrollRight && (
                <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-bg to-transparent z-10 pointer-events-none" />
              )}

              <div
                ref={sliderRef}
                className="flex gap-4 overflow-x-auto scrollbar-hide py-4 px-4"
                onScroll={updateScrollButtons}
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                <motion.div
                  className="flex gap-4"
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
              </div>
            </div>

            {/* Scroll progress indicator */}
            {filteredContents.length > 0 && (canScrollLeft || canScrollRight) && (
              <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-16 h-1 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-primary rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${scrollProgress * 100}%` }}
                  transition={{ duration: 0.2 }}
                />
              </div>
            )}
          </div>
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
