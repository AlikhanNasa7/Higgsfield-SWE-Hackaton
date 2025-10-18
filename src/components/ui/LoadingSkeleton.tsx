export function LoadingSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="space-y-4">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
      </div>
    </div>
  )
}

export function MessageSkeleton() {
  return (
    <div className="animate-pulse space-y-3">
      <div className="flex gap-3">
        <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full flex-shrink-0"></div>
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
        </div>
      </div>
    </div>
  )
}

export function ContentItemSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="aspect-square bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
      <div className="mt-2 h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
    </div>
  )
}
