import { z } from 'zod'
import {
  ChatSchema,
  ContentItemSchema,
  MessageSchema,
  SendResponseSchema,
  BackendMessagesResponseSchema,
  BackendPostMessageResponseSchema,
  type Chat,
  type ContentItem,
  type Message,
  type SendPayload,
  type SendResponse,
  type BackendMessagesResponse,
  type BackendPostMessageResponse,
  type BackendMessage,
} from '@/types/schemas'
import { mockChats, mockMessages, mockContents } from '@/mockData'

const API_BASE_URL = 'https://zestful-flexibility-production.up.railway.app'
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
  console.log('response', response)

  if (!response.ok) {
    const errorText = await response.text()
    console.error('API Error:', response.status, errorText)
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  return response.json()
}

// API functions
export async function getChats(limit: number = 10): Promise<Chat[]> {
  if (USE_MOCK) {
    await new Promise(resolve => setTimeout(resolve, 500)) // Simulate network delay
    return ChatSchema.array().parse(mockChats.slice(0, limit))
  }

  const data = await fetchJson<Chat[]>(`/chats?limit=${limit}`)
  return data
}

export async function createChat(title: string = 'Chat title'): Promise<{ chat: Chat }> {
  if (USE_MOCK) {
    await new Promise(resolve => setTimeout(resolve, 300))
    const newChat: Chat = {
      id: `mock-${Date.now()}`,
      title,
      created_at: new Date().toISOString(),
      user_id: '00000000-0000-0000-0000-000000000001',
      message_count: 0,
      last_message_at: null,
    }
    mockChats.unshift(newChat)
    return { chat: newChat }
  }

  const data = await fetchJson<Chat>('/chats', {
    method: 'POST',
    body: JSON.stringify({ title }),
  })
  const chat = ChatSchema.parse(data)
  return { chat }
}

export async function updateChat(id: string, title: string): Promise<{ chat: Chat }> {
  if (USE_MOCK) {
    await new Promise(resolve => setTimeout(resolve, 300))
    const chat = mockChats.find(c => c.id === id)
    if (!chat) throw new Error('Chat not found')
    chat.title = title
    chat.last_message_at = new Date().toISOString()
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

// Message API functions
export async function getMessages(chatId: string): Promise<BackendMessagesResponse> {
  if (USE_MOCK) {
    await new Promise(resolve => setTimeout(resolve, 300))
    // Return empty messages for now - we'll populate with mock data later if needed
    return {
      items: [],
      next_cursor: null,
      has_more: false,
    }
  }

  const data = await fetchJson<BackendMessagesResponse>(`/chats/${chatId}/messages`)
  return data
}

export async function postMessage(
  chatId: string,
  text: string,
  attachmentUrls?: string[]
): Promise<BackendPostMessageResponse> {
  if (USE_MOCK) {
    await new Promise(resolve => setTimeout(resolve, 1000))
    // Mock response
    const mockMessage: BackendMessage = {
      id: `mock-msg-${Date.now()}`,
      chat_id: chatId,
      author_type: 'user',
      content_text: text,
      render_payload: null,
      created_at: new Date().toISOString(),
    }

    const mockResponse: BackendPostMessageResponse = {
      message: mockMessage,
      render_chunks: [
        {
          type: 'text',
          text: 'Thank you for your message! This is a mock response.',
        },
      ],
    }

    return BackendPostMessageResponseSchema.parse(mockResponse)
  }

  const data = await fetchJson<BackendPostMessageResponse>(`/chats/${chatId}/messages`, {
    method: 'POST',
    body: JSON.stringify({
      text,
      ...(attachmentUrls && { attachments: attachmentUrls }),
    }),
  })
  return data
}

// S3 Attachment APIs
export interface PresignRequest {
  file_name: string
  content_type: string
  size: number
}

export interface PresignResponse {
  upload_url: string
  download_url: string
  upload_id: string
}

/**
 * Get presigned URL for S3 upload
 */
export async function getPresignedUrl(request: PresignRequest): Promise<PresignResponse> {
  const data = await fetchJson<PresignResponse>('/attachments/presign', {
    method: 'POST',
    body: JSON.stringify(request),
  })
  return data
}

/**
 * Upload file to S3 using presigned URL
 */
export async function uploadToS3(file: File, uploadUrl: string): Promise<void> {
  console.log('uploadUrl', uploadUrl)
  console.log('file', file)

  // Convert file to ArrayBuffer to match Python's binary approach
  const arrayBuffer = await file.arrayBuffer()

  const response = await fetch(uploadUrl, {
    method: 'PUT',
    body: arrayBuffer,
    headers: {
      'Content-Type': file.type,
    },
    mode: 'cors',
  })

  console.log('Response status:', response.status)
  console.log('Response headers:', Object.fromEntries(response.headers.entries()))

  if (!response.ok) {
    const errorText = await response.text()
    console.error('Error response:', errorText)
    throw new Error(`Upload failed: ${response.status} - ${response.statusText}`)
  }

  console.log('S3 upload completed successfully')
}

// Content Generation API
export interface GenerateContentRequest {
  option_id: string
  mode: string
  model_name: string
  image_url?: string
  aspect_ratio?: string
  duration?: number
  resolution?: string
  quality?: string
  style_strength?: number
  enhance_prompt?: boolean
  seed?: number
  motion_strength?: number
}

export interface GenerateContentResponse {
  url: string
}

/**
 * Generate content using the Higgsfield API
 */
export async function generateContent(
  request: GenerateContentRequest
): Promise<GenerateContentResponse> {
  if ((request.model_name === 'wan-25-fast' || request.model_name === 'kling-2-5') && request.mode === 'image-to-video') {
    request.seed = 1
  }
  const data = await fetchJson<GenerateContentResponse>('/higgsfield/generate', {
    method: 'POST',
    body: JSON.stringify(request),
  })
  return data
}

/**
 * Fetch attachments by chat ID
 */
export interface AttachmentItem {
  id: string
  kind: 'image' | 'video'
  storage_url: string
  option_id: string | null
  created_at: string
}

export interface AttachmentsResponse {
  items: AttachmentItem[]
}

export async function getAttachmentsByChat(chatId: string): Promise<AttachmentsResponse> {
  const data = await fetchJson<AttachmentsResponse>(`/attachments/by-chat/${chatId}`)
  return data
}
