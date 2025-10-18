import { z } from 'zod'

export const PartSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('text'),
    text: z.string(),
  }),
  z.object({
    type: z.literal('Button'),
    label: z.string(),
    targetContentId: z.string(),
  }),
])

export const MessageSchema = z.object({
  id: z.string(),
  role: z.enum(['user', 'assistant']),
  createdAt: z.string(),
  parts: z.array(PartSchema),
  producedContentIds: z.array(z.string()).optional(),
})

export const ChatSchema = z.object({
  id: z.string(),
  title: z.string(),
  created_at: z.string(),
  user_id: z.string(),
  message_count: z.number(),
  last_message_at: z.string().nullable(),
})

export const Content = z.enum(['image', 'video'])
export const ContentItemSchema = z.object({
  id: z.string(),
  kind: Content,
  title: z.string().optional(),
  url: z.string(),
  thumbUrl: z.string().optional(),
  createdAt: z.string(),
})

export const ModeSchema = z.enum(['text-to-image', 'text-to-video', 'image-to-video'])

// Backend API Message Schemas
export const BackendMessageSchema = z.object({
  id: z.string(),
  chat_id: z.string(),
  author_type: z.enum(['user', 'assistant']),
  content_text: z.string().nullable(),
  render_payload: z.array(z.any()).nullable(),
  created_at: z.string(),
})

export const BackendRenderChunkSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('text'),
    text: z.string(),
  }),
  z.object({
    type: z.literal('button'),
    text: z.string().optional(),
    label: z.string(),
    option_id: z.string(),
  }),
])

export const BackendMessagesResponseSchema = z.object({
  items: z.array(BackendMessageSchema),
  next_cursor: z.string().nullable(),
  has_more: z.boolean(),
})

export const BackendPostMessageResponseSchema = z.object({
  message: BackendMessageSchema,
  render_chunks: z.array(BackendRenderChunkSchema),
})

export const SendPayloadSchema = z.discriminatedUnion('mode', [
  z.object({
    mode: z.enum(['text-to-image', 'text-to-video']),
    prompt: z.string(),
  }),
  z.object({
    mode: z.literal('image-to-video'),
    prompt: z.string(),
    imageFile: z.instanceof(File).optional(),
    imageUrl: z.string().optional(),
  }),
])

export const SendResponseSchema = z.object({
  message: MessageSchema,
  newContent: z.array(ContentItemSchema).optional(),
})

export type SendPayload = z.infer<typeof SendPayloadSchema>
export type SendResponse = z.infer<typeof SendResponseSchema>
export type Part = z.infer<typeof PartSchema>
export type Message = z.infer<typeof MessageSchema>
export type Chat = z.infer<typeof ChatSchema>
export type ContentItem = z.infer<typeof ContentItemSchema>
export type Mode = z.infer<typeof ModeSchema>

// Backend API Types
export type BackendMessage = z.infer<typeof BackendMessageSchema>
export type BackendRenderChunk = z.infer<typeof BackendRenderChunkSchema>
export type BackendMessagesResponse = z.infer<typeof BackendMessagesResponseSchema>
export type BackendPostMessageResponse = z.infer<typeof BackendPostMessageResponseSchema>
