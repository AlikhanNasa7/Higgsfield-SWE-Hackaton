import { useQuery } from '@tanstack/react-query'
import { getAttachmentsByChat, type AttachmentItem } from '@/lib/api'

export function useAttachments(chatId: string | null) {
  return useQuery<AttachmentItem[]>({
    queryKey: ['attachments', chatId],
    queryFn: async () => {
      if (!chatId) return []
      const response = await getAttachmentsByChat(chatId)
      return response.items
    },
    enabled: !!chatId,
    staleTime: 30 * 1000, // 30 seconds
    refetchOnWindowFocus: false,
  })
}
