export type Part =
  | { type: 'text'; text: string }
  | { type: 'Button'; label: string; targetContentId: string }

export type Message = {
  id: string
  role: 'user' | 'assistant'
  createdAt: string // ISO
  parts: Part[] // assistant uses parts; user may be plain text elsewhere
  producedContentIds?: string[]
}

export type Chat = {
  id: string
  title: string
  createdAt: string
  updatedAt: string
}

export type ContentItem = {
  id: string
  kind: 'image' | 'video'
  title?: string
  url: string // backend-provided absolute URL
  thumbUrl?: string
  createdAt: string
}

export type Mode = 'text-to-image' | 'text-to-video' | 'image-to-video'

export type SendPayload =
  | { mode: 'text-to-image' | 'text-to-video'; prompt: string }
  | {
      mode: 'image-to-video'
      prompt: string
      imageFile?: File
      imageUrl?: string
    }

export type SendResponse = {
  message: Message // assistant reply including parts[]
  newContent?: ContentItem[] // any generated content
}
