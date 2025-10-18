/**
 * Custom hooks for data fetching
 * These hooks use TanStack Query with the data service layer
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { chatsService, messagesService, contentsService } from '../dataService'
import { type SendPayload, type Chat } from '@/types/schemas'

// ============================================================================
// CHATS HOOKS
// ============================================================================

export function useChats() {
  return useQuery({
    queryKey: ['chats'],
    queryFn: () => chatsService.getAll(),
  })
}

export function useCreateChat() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (title: string) => chatsService.create(title),
    onSuccess: data => {
      // Add the new chat to the cache immediately
      queryClient.setQueryData(['chats'], (old: Chat[] | undefined) => {
        if (!old) return [data.chat]
        return [data.chat, ...old]
      })
      // Also invalidate to ensure fresh data
      queryClient.invalidateQueries({ queryKey: ['chats'] })
    },
  })
}

export function useUpdateChat() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, title }: { id: string; title: string }) => chatsService.update(id, title),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chats'] })
    },
  })
}

export function useDeleteChat() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => chatsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chats'] })
    },
  })
}

// ============================================================================
// MESSAGES HOOKS
// ============================================================================

export function useMessages(chatId: string | null) {
  return useQuery({
    queryKey: ['chat', chatId, 'messages'],
    queryFn: () => messagesService.getAll(chatId!),
    enabled: !!chatId,
  })
}

export function useSendMessage(chatId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: SendPayload) => messagesService.send(chatId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chat', chatId, 'messages'] })
      queryClient.invalidateQueries({ queryKey: ['chat', chatId, 'contents'] })
    },
  })
}

// ============================================================================
// CONTENTS HOOKS
// ============================================================================

export function useContents(chatId: string | null) {
  return useQuery({
    queryKey: ['chat', chatId, 'contents'],
    queryFn: () => contentsService.getAll(chatId!),
    enabled: !!chatId,
  })
}

export function useContent(contentId: string | null) {
  return useQuery({
    queryKey: ['content', contentId],
    queryFn: () => contentsService.getOne(contentId!),
    enabled: !!contentId,
  })
}
