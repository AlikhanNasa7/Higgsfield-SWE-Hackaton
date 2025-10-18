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
  createdAt: z.string(),
  updatedAt: z.string(),
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
