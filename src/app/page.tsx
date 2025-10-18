'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function HomePage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to chat list page
    router.push('/chat')
  }, [router])

  return (
    <div className="h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
      <div className="text-center">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
          Higgsfield Chat
        </h1>
        <p className="text-gray-600 dark:text-gray-400">Redirecting to chat...</p>
      </div>
    </div>
  )
}
