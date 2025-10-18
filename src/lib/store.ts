import { create } from 'zustand'
import { type Mode, type Chat, type ContentItem } from '@/types/schemas'

interface SelectedChat {
  id: string
  title: string
  createdAt: string
  updatedAt: string
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

  // Sidebar state
  sidebarOpen: boolean

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
  setFilter: (filter: 'all' | 'images' | 'videos') => void
  setSearch: (query: string) => void
  setPanelSize: (panel: 'transcript' | 'viewer' | 'contents', size: number) => void
  toggleSidebar: () => void

  // Composer state
  currentMode: Mode
  setMode: (mode: Mode) => void

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
  sidebarOpen: true,
  filters: 'all',
  searchQuery: '',
  panelSizes: defaultPanelSizes,
  currentMode: 'text-to-image',
  uploadProgress: null,

  // Actions
  selectChat: chat => {
    set({
      selectedChat: chat
        ? {
            id: chat.id,
            title: chat.title,
            createdAt: chat.createdAt,
            updatedAt: chat.updatedAt,
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

  toggleSidebar: () => {
    set(state => ({ sidebarOpen: !state.sidebarOpen }))
  },

  setMode: mode => {
    set({ currentMode: mode })
  },

  setUploadProgress: progress => {
    set({ uploadProgress: progress })
  },
}))
