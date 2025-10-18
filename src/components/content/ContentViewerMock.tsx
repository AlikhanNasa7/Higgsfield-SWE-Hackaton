'use client'

import { useUIStore } from '@/lib/store'
import { mockContents } from '@/mockData'
import { EmptyState } from '@/components/ui/EmptyState'
import { Image, Video, Monitor } from 'lucide-react'
import { type ContentItem } from '@/types/schemas'

export function ContentViewerMock() {
  const { selectedContent } = useUIStore()

  // This component should only render when content is selected
  // The parent layout handles conditional rendering
  if (!selectedContent) {
    return null
  }

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-900">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          {selectedContent.kind === 'image' ? (
            <Image className="w-5 h-5 text-gray-500" />
          ) : (
            <Video className="w-5 h-5 text-gray-500" />
          )}
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {selectedContent.title ||
              `${selectedContent.kind.charAt(0).toUpperCase() + selectedContent.kind.slice(1)} Content`}
          </h3>
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {new Date(selectedContent.createdAt).toLocaleDateString()}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center p-4">
        {selectedContent.kind === 'image' ? (
          <img
            src={selectedContent.url}
            alt={selectedContent.title || 'Generated image'}
            className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
          />
        ) : (
          <video
            src={selectedContent.url}
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
