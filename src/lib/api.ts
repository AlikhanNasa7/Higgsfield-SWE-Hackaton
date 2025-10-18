import { z } from 'zod'
import {
  ChatSchema,
  ContentItemSchema,
  MessageSchema,
  SendResponseSchema,
  type Chat,
  type ContentItem,
  type Message,
  type SendPayload,
  type SendResponse,
} from '@/types/schemas'
import { mockChats, mockMessages, mockContents } from '@/mockData'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001'
const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === '1'

// Debug logging
if (typeof window !== 'undefined') {
  console.log('USE_MOCK:', USE_MOCK, 'NEXT_PUBLIC_USE_MOCK:', process.env.NEXT_PUBLIC_USE_MOCK)
}

async function fetchJson<T>(path: string, init?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${path}`
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...init?.headers,
    },
    ...init,
  })

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  return response.json()
}

// API functions
export async function getChats(): Promise<Chat[]> {
  if (USE_MOCK) {
    await new Promise(resolve => setTimeout(resolve, 500)) // Simulate network delay
    return ChatSchema.array().parse(mockChats)
  }

  const data = await fetchJson<Chat[]>('/chats')
  return ChatSchema.array().parse(data)
}

export async function createChat(title: string): Promise<{ chat: Chat }> {
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

  const data = await fetchJson<{ chat: Chat }>('/chats', {
    method: 'POST',
    body: JSON.stringify({ title }),
  })
  return z.object({ chat: ChatSchema }).parse(data)
}

export async function updateChat(id: string, title: string): Promise<{ chat: Chat }> {
  if (USE_MOCK) {
    await new Promise(resolve => setTimeout(resolve, 300))
    const chat = mockChats.find(c => c.id === id)
    if (!chat) throw new Error('Chat not found')
    chat.title = title
    chat.updatedAt = new Date().toISOString()
    return { chat }
  }

  const data = await fetchJson<{ chat: Chat }>(`/chats/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ title }),
  })
  return z.object({ chat: ChatSchema }).parse(data)
}

export async function deleteChat(id: string): Promise<{ ok: boolean }> {
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

  const data = await fetchJson<{ ok: boolean }>(`/chats/${id}`, {
    method: 'DELETE',
  })
  return z.object({ ok: z.boolean() }).parse(data)
}

export async function getMessages(chatId: string): Promise<Message[]> {
  if (USE_MOCK) {
    await new Promise(resolve => setTimeout(resolve, 300))
    return MessageSchema.array().parse(mockMessages[chatId] || [])
  }

  const data = await fetchJson<Message[]>(`/chats/${chatId}/messages`)
  return MessageSchema.array().parse(data)
}

export async function sendMessage(chatId: string, payload: SendPayload): Promise<SendResponse> {
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

    let newContent: ContentItem[] = []

    if (payload.mode === 'text-to-image') {
      const content: ContentItem = {
        id: `content-${Date.now()}`,
        kind: 'image',
        title: 'Generated Image',
        url: `https://picsum.photos/800/600?random=${Date.now()}`,
        thumbUrl: `https://picsum.photos/200/150?random=${Date.now()}`,
        createdAt: new Date().toISOString(),
      }
      newContent = [content]
      assistantMessage.parts.push({
        type: 'Button',
        label: 'View Image',
        targetContentId: content.id,
      })
      assistantMessage.producedContentIds = [content.id]
    } else if (payload.mode === 'text-to-video') {
      const content: ContentItem = {
        id: `content-${Date.now()}`,
        kind: 'video',
        title: 'Generated Video',
        url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        thumbUrl: `https://picsum.photos/200/150?random=${Date.now()}`,
        createdAt: new Date().toISOString(),
      }
      newContent = [content]
      assistantMessage.parts.push({
        type: 'Button',
        label: 'Watch Video',
        targetContentId: content.id,
      })
      assistantMessage.producedContentIds = [content.id]
    }

    if (!mockMessages[chatId]) {
      mockMessages[chatId] = []
    }
    mockMessages[chatId].push(userMessage, assistantMessage)

    if (newContent.length > 0) {
      if (!mockContents[chatId]) {
        mockContents[chatId] = []
      }
      mockContents[chatId].push(...newContent)
    }

    return SendResponseSchema.parse({
      message: assistantMessage,
      newContent: newContent.length > 0 ? newContent : undefined,
    })
  }

  const data = await fetchJson<SendResponse>(`/chats/${chatId}/send`, {
    method: 'POST',
    body: JSON.stringify(payload),
  })
  return SendResponseSchema.parse(data)
}

export async function getContents(chatId: string): Promise<ContentItem[]> {
  if (USE_MOCK) {
    await new Promise(resolve => setTimeout(resolve, 300))
    return ContentItemSchema.array().parse(mockContents[chatId] || [])
  }

  const data = await fetchJson<ContentItem[]>(`/chats/${chatId}/contents`)
  return ContentItemSchema.array().parse(data)
}

export async function getContent(contentId: string): Promise<ContentItem> {
  if (USE_MOCK) {
    await new Promise(resolve => setTimeout(resolve, 300))
    for (const contents of Object.values(mockContents)) {
      const content = contents.find(c => c.id === contentId)
      if (content) return ContentItemSchema.parse(content)
    }
    throw new Error('Content not found')
  }

  const data = await fetchJson<ContentItem>(`/contents/${contentId}`)
  return ContentItemSchema.parse(data)
}
