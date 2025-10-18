'use client'

import { useQuery } from '@tanstack/react-query'
import { useUIStore } from '@/lib/store'
import { getContent } from '@/lib/api'
import { EmptyState } from '@/components/ui/EmptyState'
import { ErrorState } from '@/components/ui/ErrorState'
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton'
import { Image, Video, Monitor } from 'lucide-react'

export function ContentViewer() {
  const { selectedContentId } = useUIStore()

  const {
    data: content,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['content', selectedContentId],
    queryFn: () => getContent(selectedContentId!),
    enabled: !!selectedContentId,
  })

  if (!selectedContentId) {
    return (
      <div className="h-full">
        <EmptyState
          icon={Monitor}
          title="No content selected"
          description="Click on a content item from the list or a button in the chat to view it here."
        />
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="h-full p-4">
        <LoadingSkeleton />
      </div>
    )
  }

  if (error) {
    return (
      <div className="h-full">
        <ErrorState
          title="Failed to load content"
          message="Unable to load the selected content. Please try again."
          onRetry={() => window.location.reload()}
        />
      </div>
    )
  }

  if (!content) {
    return (
      <div className="h-full">
        <EmptyState
          icon={Monitor}
          title="Content not found"
          description="The selected content could not be found."
        />
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-900">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          {content.kind === 'image' ? (
            <Image className="w-5 h-5 text-gray-500" />
          ) : (
            <Video className="w-5 h-5 text-gray-500" />
          )}
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {content.title ||
              `${content.kind.charAt(0).toUpperCase() + content.kind.slice(1)} Content`}
          </h3>
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {new Date(content.createdAt).toLocaleDateString()}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center p-4">
        {content.kind === 'image' ? (
          <img
            src={content.url}
            alt={content.title || 'Generated image'}
            className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
          />
        ) : (
          <video
            src={content.url}
            controls
            className="max-w-full max-h-full rounded-lg shadow-lg"
            preload="metadata"
          >
            Your browser does not support the video tag.
          </video>
        )}
      </div>
    </div>
  )
}
