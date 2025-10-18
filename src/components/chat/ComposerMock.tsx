'use client'

import { useState, useRef, useCallback } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useDropzone } from 'react-dropzone'
import { Send, Image, Video, Upload, X } from 'lucide-react'
import { useUIStore } from '@/lib/store'
import { mockMessages, mockContents } from '@/mockData'
import { type Mode, type Message, type ContentItem } from '@/types/schemas'

const MODES: { value: Mode; label: string; icon: React.ReactNode }[] = [
  {
    value: 'text-to-image',
    label: 'Text → Image',
    icon: <Image className="w-4 h-4" />,
  },
  {
    value: 'text-to-video',
    label: 'Text → Video',
    icon: <Video className="w-4 h-4" />,
  },
  {
    value: 'image-to-video',
    label: 'Image → Video',
    icon: <Upload className="w-4 h-4" />,
  },
]

export function ComposerMock() {
  const { selectedChat, currentMode, setMode } = useUIStore()
  const [prompt, setPrompt] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [, forceUpdate] = useState({})
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const sendMutation = useMutation({
    mutationFn: async (payload: { mode: Mode; prompt: string; imageFile?: File }) => {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 2000))

      if (!selectedChat) return

      // Create user message
      const userMessage: Message = {
        id: `msg-${Date.now()}`,
        role: 'user',
        createdAt: new Date().toISOString(),
        parts: [{ type: 'text', text: payload.prompt }],
      }

      // Create assistant message
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

      // Create content based on mode
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

      // Add messages to mock data
      const chatId = selectedChat.id
      if (!mockMessages[chatId]) {
        mockMessages[chatId] = []
      }
      mockMessages[chatId].push(userMessage, assistantMessage)

      // Add content to mock data
      if (newContent) {
        if (!mockContents[chatId]) {
          mockContents[chatId] = []
        }
        mockContents[chatId].push(newContent)
      }

      return { message: assistantMessage, newContent }
    },
    onSuccess: () => {
      setPrompt('')
      setSelectedFile(null)
      setImagePreview(null)
      textareaRef.current?.focus()
      forceUpdate({}) // Force re-render
    },
  })

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file)
      const reader = new FileReader()
      reader.onload = () => setImagePreview(reader.result as string)
      reader.readAsDataURL(file)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
    },
    maxFiles: 1,
    disabled: currentMode !== 'image-to-video',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedChat || !prompt.trim() || sendMutation.isPending) return

    sendMutation.mutate({
      mode: currentMode,
      prompt: prompt.trim(),
      ...(currentMode === 'image-to-video' && selectedFile && { imageFile: selectedFile }),
    })
  }

  const removeImage = () => {
    setSelectedFile(null)
    setImagePreview(null)
  }

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = 'auto'
      textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`
    }
  }

  if (!selectedChat) {
    return (
      <div className="p-4 text-center text-gray-500 dark:text-gray-400">
        Select a chat to start messaging
      </div>
    )
  }

  return (
    <div className="p-4 bg-white dark:bg-gray-900">
      {/* Mode selector */}
      <div className="flex gap-1 mb-3">
        {MODES.map(mode => (
          <button
            key={mode.value}
            onClick={() => {
              setMode(mode.value)
              if (mode.value !== 'image-to-video') {
                removeImage()
              }
            }}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              currentMode === mode.value
                ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            {mode.icon}
            {mode.label}
          </button>
        ))}
      </div>

      {/* Image upload area for image-to-video mode */}
      {currentMode === 'image-to-video' && (
        <div
          {...getRootProps()}
          className={`mb-3 p-4 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
            isDragActive
              ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/10'
              : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
          }`}
        >
          <input {...getInputProps()} />
          {imagePreview ? (
            <div className="relative">
              <img src={imagePreview} alt="Preview" className="max-h-32 w-auto mx-auto rounded" />
              <button
                onClick={e => {
                  e.stopPropagation()
                  removeImage()
                }}
                className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <div className="text-center">
              <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {isDragActive
                  ? 'Drop the image here...'
                  : 'Drag & drop an image, or click to select'}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Upload progress */}
      {sendMutation.isPending && (
        <div className="mb-3">
          <div className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400">
            <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
            Generating {currentMode.replace('-', ' ')}...
          </div>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="flex-1">
          <textarea
            ref={textareaRef}
            value={prompt}
            onChange={e => {
              setPrompt(e.target.value)
              adjustTextareaHeight()
            }}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSubmit(e)
              }
            }}
            placeholder={`Describe what you want to generate...`}
            className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md resize-none bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={1}
            disabled={sendMutation.isPending}
          />
        </div>
        <button
          type="submit"
          disabled={
            !prompt.trim() ||
            sendMutation.isPending ||
            (currentMode === 'image-to-video' && !selectedFile)
          }
          className="flex-shrink-0 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>

      {/* Error message */}
      {sendMutation.error && (
        <div className="mt-2 text-sm text-red-600 dark:text-red-400">
          Failed to send message. Please try again.
        </div>
      )}
    </div>
  )
}
