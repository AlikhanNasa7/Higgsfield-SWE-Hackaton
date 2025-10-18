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
export function useMessages(chatId: string | null) {
  return useQuery({
    queryKey: ['messages', chatId],
    queryFn: async () => {
      const response = await getMessages(chatId!)
      return response
    },
    enabled: !!chatId,
    staleTime: 30 * 1000, // 30 seconds
  })
}

/**
 * Hook to post a new message to a chat
 */
export function usePostMessage() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ chatId, content }: { chatId: string; content: string }) =>
      postMessage(chatId, content),
    onSuccess: (data, variables) => {
      const { chatId } = variables

      // Only refetch messages from backend - no optimistic updates
      queryClient.invalidateQueries({ queryKey: ['messages', chatId] })

      // Also invalidate chats to update message count and last_message_at
      queryClient.invalidateQueries({ queryKey: ['chats'] })
    },
  })
}
