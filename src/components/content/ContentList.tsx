'use client'

import { useQuery } from '@tanstack/react-query'
import { useUIStore } from '@/lib/store'
import { getContents } from '@/lib/api'
import { EmptyState } from '@/components/ui/EmptyState'
import { ErrorState } from '@/components/ui/ErrorState'
import { ContentItemSkeleton } from '@/components/ui/LoadingSkeleton'
import { Image, Video, Filter } from 'lucide-react'
import { type ContentItem } from '@/types/schemas'

function ContentItemCard({
  content,
  isSelected,
  onSelect,
}: {
  content: ContentItem
  isSelected: boolean
  onSelect: () => void
}) {
  return (
    <div
      onClick={onSelect}
      className={`cursor-pointer rounded-lg overflow-hidden transition-all ${
        isSelected ? 'ring-2 ring-blue-500 shadow-lg' : 'hover:shadow-md'
      }`}
    >
      <div className="aspect-square relative bg-gray-100 dark:bg-gray-800">
        {content.thumbUrl ? (
          <img
            src={content.thumbUrl}
            alt={content.title || `${content.kind} thumbnail`}
            className="w-full h-full object-cover"
          />
        ) : content.kind === 'image' ? (
          <div className="w-full h-full flex items-center justify-center">
            <Image className="w-8 h-8 text-gray-400" />
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Video className="w-8 h-8 text-gray-400" />
          </div>
        )}
        <div className="absolute top-2 right-2">
          <div
            className={`p-1 rounded ${
              content.kind === 'image' ? 'bg-blue-500 text-white' : 'bg-red-500 text-white'
            }`}
          >
            {content.kind === 'image' ? (
              <Image className="w-3 h-3" />
            ) : (
              <Video className="w-3 h-3" />
            )}
          </div>
        </div>
      </div>
      {content.title && (
        <div className="p-2">
          <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
            {content.title}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {new Date(content.createdAt).toLocaleDateString()}
          </p>
        </div>
      )}
    </div>
  )
}

export function ContentList() {
  const {
    selectedChatId,
    selectedContentId,
    filters,
    searchQuery,
    selectContent,
    setFilter,
    setSearch,
  } = useUIStore()

  const {
    data: contents,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['chat', selectedChatId, 'contents'],
    queryFn: () => getContents(selectedChatId!),
    enabled: !!selectedChatId,
  })

  const filteredContents = contents?.filter(content => {
    const matchesFilter = filters === 'all' || content.kind === filters.slice(0, -1) // Remove 's' from 'images'/'videos'
    const matchesSearch =
      !searchQuery || content.title?.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesFilter && matchesSearch
  })

  if (!selectedChatId) {
    return (
      <div className="h-full">
        <EmptyState
          icon={Filter}
          title="Select a chat"
          description="Choose a chat to view its generated content."
        />
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="h-full flex flex-col bg-white dark:bg-gray-900">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex gap-1 mb-3">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-16 animate-pulse"></div>
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-16 animate-pulse"></div>
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-16 animate-pulse"></div>
          </div>
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        </div>
        <div className="flex-1 p-4">
          <div className="grid grid-cols-2 gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <ContentItemSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="h-full">
        <ErrorState
          title="Failed to load content"
          message="Unable to load the chat content. Please try again."
          onRetry={() => window.location.reload()}
        />
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-900">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
          Generated Content
        </h3>

        {/* Filters */}
        <div className="flex gap-1 mb-3">
          {[
            { value: 'all' as const, label: 'All' },
            { value: 'images' as const, label: 'Images' },
            { value: 'videos' as const, label: 'Videos' },
          ].map(filter => (
            <button
              key={filter.value}
              onClick={() => setFilter(filter.value)}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                filters === filter.value
                  ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <input
          type="text"
          placeholder="Search content..."
          value={searchQuery}
          onChange={e => setSearch(e.target.value)}
          className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Content grid */}
      <div className="flex-1 overflow-y-auto p-4">
        {filteredContents && filteredContents.length > 0 ? (
          <div className="grid grid-cols-2 gap-3">
            {filteredContents.map(content => (
              <ContentItemCard
                key={content.id}
                content={content}
                isSelected={selectedContentId === content.id}
                onSelect={() => selectContent(content.id)}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Filter}
            title="No content found"
            description={
              contents?.length === 0
                ? "This chat doesn't have any generated content yet."
                : 'No content matches your current filters.'
            }
          />
        )}
      </div>
    </div>
  )
}
