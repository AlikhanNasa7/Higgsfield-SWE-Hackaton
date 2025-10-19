import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getMessages, postMessage } from '@/lib/api'
import { useUIStore } from '@/lib/store'
import type {
  BackendMessagesResponse,
  BackendPostMessageResponse,
  BackendMessage,
} from '@/types/schemas'

/**
 * Hook to fetch messages for a specific chat
 */
export function useMessages(chatId: string | null, messageCount?: number) {
  return useQuery({
    queryKey: ['messages', chatId],
    queryFn: async () => {
      const response = await getMessages(chatId!)
      return response
    },
    enabled: !!chatId && (messageCount === undefined || messageCount > 0),
    staleTime: 2 * 60 * 1000, // 2 minutes - messages don't change often
    gcTime: 5 * 60 * 1000, // 5 minutes (garbage collection time)
    refetchOnWindowFocus: false, // Don't refetch when window gains focus
    refetchOnMount: false, // Don't refetch if data is already cached
  })
}

/**
 * Hook to post a new message to a chat
 */
export function usePostMessage() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      chatId,
      text,
      attachmentUrls,
    }: {
      chatId: string
      text: string
      attachmentUrls?: string[]
    }) => postMessage(chatId, text, attachmentUrls),
    onSuccess: (data, variables) => {
      const { chatId } = variables

      // Only refetch messages from backend - no optimistic updates
      queryClient.invalidateQueries({ queryKey: ['messages', chatId] })

      // Also invalidate chats to update message count and last_message_at
      queryClient.invalidateQueries({ queryKey: ['chats'] })
    },
  })
}
