import { create } from 'zustand'
import { type Mode, type Chat, type ContentItem } from '@/types/schemas'

interface SelectedChat {
  id: string
  title: string
  created_at: string
  user_id: string
  message_count: number
  last_message_at: string | null
}

interface SelectedContent {
  id: string
  kind: 'image' | 'video'
  title?: string | undefined
  url: string
  thumbUrl?: string | undefined
  createdAt: string
}

interface UIState {
  // Selection state
  selectedChat: SelectedChat | null
  selectedContent: SelectedContent | null

  // Generated content storage
  generatedContent: Record<string, ContentItem[]> // chatId -> content items

  // Content filters
  filters: 'all' | 'images' | 'videos'
  searchQuery: string

  // Panel sizes (percentage)
  panelSizes: {
    transcript: number
    viewer: number
    contents: number
  }

  // Actions
  selectChat: (chat: Chat | null) => void
  selectContent: (content: ContentItem | null) => void
  addGeneratedContent: (chatId: string, content: ContentItem) => void
  setFilter: (filter: 'all' | 'images' | 'videos') => void
  setSearch: (query: string) => void
  setPanelSize: (panel: 'transcript' | 'viewer' | 'contents', size: number) => void

  // Composer state
  currentMode: Mode
  setMode: (mode: Mode) => void
  currentModel: string
  setModel: (model: string) => void

  // Upload state
  uploadProgress: number | null
  setUploadProgress: (progress: number | null) => void
}

const defaultPanelSizes = {
  transcript: 40,
  viewer: 35,
  contents: 25,
}

export const useUIStore = create<UIState>((set, get) => ({
  // Initial state
  selectedChat: null,
  selectedContent: null,
  generatedContent: {},
  filters: 'all',
  searchQuery: '',
  panelSizes: defaultPanelSizes,
  currentMode: 'text-to-image',
  currentModel: 'nano-banana',
  uploadProgress: null,

  // Actions
  selectChat: chat => {
    set({
      selectedChat: chat
        ? {
            id: chat.id,
            title: chat.title,
            created_at: chat.created_at,
            user_id: chat.user_id,
            message_count: chat.message_count,
            last_message_at: chat.last_message_at,
          }
        : null,
      selectedContent: null, // Clear selected content when changing chats
    })
  },

  selectContent: content => {
    set({
      selectedContent: content
        ? {
            id: content.id,
            kind: content.kind,
            title: content.title,
            url: content.url,
            thumbUrl: content.thumbUrl,
            createdAt: content.createdAt,
          }
        : null,
    })
  },

  addGeneratedContent: (chatId, content) => {
    const currentGeneratedContent = get().generatedContent
    const chatContent = currentGeneratedContent[chatId] || []

    set({
      generatedContent: {
        ...currentGeneratedContent,
        [chatId]: [content, ...chatContent], // Add new content at the beginning
      },
    })
  },

  setFilter: filter => {
    set({ filters: filter })
  },

  setSearch: query => {
    set({ searchQuery: query })
  },

  setPanelSize: (panel, size) => {
    const currentSizes = get().panelSizes
    set({
      panelSizes: {
        ...currentSizes,
        [panel]: size,
      },
    })
  },

  setMode: mode => {
    set({ currentMode: mode })
  },

  setModel: model => {
    set({ currentModel: model })
  },

  setUploadProgress: progress => {
    set({ uploadProgress: progress })
  },
}))
