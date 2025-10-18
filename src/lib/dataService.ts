/**
 * Data Service Layer - Facade Pattern
 *
 * This service abstracts data fetching, allowing easy switching between:
 * - Mock data (development)
 * - Real API (production)
 *
 * To switch: Set NEXT_PUBLIC_USE_MOCK environment variable
 */

import {
  type Chat,
  type Message,
  type ContentItem,
  type SendPayload,
  type SendResponse,
} from '@/types/schemas'
import { mockChats, mockMessages, mockContents } from '@/mockData'
import * as api from './api'

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === '1'

// ============================================================================
// CHATS SERVICE
// ============================================================================

export const chatsService = {
  /**
   * Get all chats
   */
  async getAll(): Promise<Chat[]> {
    if (USE_MOCK) {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 300))
      return [...mockChats] // Return copy to prevent external mutations
    }
    return api.getChats()
  },

  /**
   * Create a new chat
   */
  async create(title: string): Promise<{ chat: Chat }> {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 300))
      const newChat: Chat = {
        id: `mock-${Date.now()}`,
        title,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      mockChats.unshift(newChat)
      return { chat: newChat }
    }
    return api.createChat(title)
  },

  /**
   * Update a chat
   */
  async update(id: string, title: string): Promise<{ chat: Chat }> {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 300))
      const chat = mockChats.find(c => c.id === id)
      if (!chat) throw new Error('Chat not found')
      chat.title = title
      chat.updatedAt = new Date().toISOString()
      return { chat }
    }
    return api.updateChat(id, title)
  },

  /**
   * Delete a chat
   */
  async delete(id: string): Promise<{ ok: boolean }> {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 300))
      const index = mockChats.findIndex(c => c.id === id)
      if (index !== -1) {
        mockChats.splice(index, 1)
        delete mockMessages[id]
        delete mockContents[id]
      }
      return { ok: true }
    }
    return api.deleteChat(id)
  },
}

// ============================================================================
// MESSAGES SERVICE
// ============================================================================

export const messagesService = {
  /**
   * Get all messages for a chat
   */
  async getAll(chatId: string): Promise<Message[]> {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 300))
      return mockMessages[chatId] ? [...mockMessages[chatId]] : []
    }
    return api.getMessages(chatId)
  },

  /**
   * Send a message
   */
  async send(chatId: string, payload: SendPayload): Promise<SendResponse> {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 2000)) // Simulate generation time

      const userMessage: Message = {
        id: `msg-${Date.now()}`,
        role: 'user',
        createdAt: new Date().toISOString(),
        parts: [{ type: 'text', text: payload.prompt }],
      }

      const assistantMessage: Message = {
        id: `msg-${Date.now() + 1}`,
        role: 'assistant',
        createdAt: new Date().toISOString(),
        parts: [
          {
            type: 'text',
            text: `Generated ${payload.mode.replace('-', ' ')} content!`,
          },
        ],
      }

      let newContent: ContentItem | undefined

      if (payload.mode === 'text-to-image') {
        newContent = {
          id: `content-${Date.now()}`,
          kind: 'image',
          title: 'Generated Image',
          url: `https://picsum.photos/800/600?random=${Date.now()}`,
          thumbUrl: `https://picsum.photos/200/150?random=${Date.now()}`,
          createdAt: new Date().toISOString(),
        }
        assistantMessage.parts.push({
          type: 'Button',
          label: 'View Image',
          targetContentId: newContent.id,
        })
        assistantMessage.producedContentIds = [newContent.id]
      } else if (payload.mode === 'text-to-video' || payload.mode === 'image-to-video') {
        newContent = {
          id: `content-${Date.now()}`,
          kind: 'video',
          title: 'Generated Video',
          url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
          thumbUrl: `https://picsum.photos/200/150?random=${Date.now()}`,
          createdAt: new Date().toISOString(),
        }
        assistantMessage.parts.push({
          type: 'Button',
          label: 'Watch Video',
          targetContentId: newContent.id,
        })
        assistantMessage.producedContentIds = [newContent.id]
      }

      if (!mockMessages[chatId]) {
        mockMessages[chatId] = []
      }
      mockMessages[chatId].push(userMessage, assistantMessage)

      if (newContent) {
        if (!mockContents[chatId]) {
          mockContents[chatId] = []
        }
        mockContents[chatId].push(newContent)
      }

      return {
        message: assistantMessage,
        newContent: newContent ? [newContent] : undefined,
      }
    }
    return api.sendMessage(chatId, payload)
  },
}

// ============================================================================
// CONTENTS SERVICE
// ============================================================================

export const contentsService = {
  /**
   * Get all contents for a chat
   */
  async getAll(chatId: string): Promise<ContentItem[]> {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 300))
      return mockContents[chatId] ? [...mockContents[chatId]] : []
    }
    return api.getContents(chatId)
  },

  /**
   * Get a single content item
   */
  async getOne(contentId: string): Promise<ContentItem | null> {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 300))
      for (const contents of Object.values(mockContents)) {
        const content = contents.find(c => c.id === contentId)
        if (content) return content
      }
      return null
    }
    try {
      return await api.getContent(contentId)
    } catch {
      return null
    }
  },
}
