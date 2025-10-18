'use client'

import { useState, useRef, useCallback } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useDropzone } from 'react-dropzone'
import { motion } from 'framer-motion'
import { Send, Image, Video, Upload, X, Loader2 } from 'lucide-react'
import { useUIStore } from '@/lib/store'
import { mockMessages, mockContents } from '@/mockData'
import { type Mode, type Message, type ContentItem } from '@/types/schemas'
import { Badge } from '@/components/design/Badge'

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
      await new Promise(resolve => setTimeout(resolve, 2000))

      if (!selectedChat) return

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

      const chatId = selectedChat.id
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

      return { message: assistantMessage, newContent }
    },
    onSuccess: () => {
      setPrompt('')
      setSelectedFile(null)
      setImagePreview(null)
      textareaRef.current?.focus()
      forceUpdate({})
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
    disabled: currentMode !== 'image-to-video' || sendMutation.isPending,
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
    return <div className="p-6 text-center text-muted">Select a chat to start messaging</div>
  }

  return (
    <div className="p-6 space-y-4">
      {/* Mode selector */}
      <div className="flex gap-2">
        {MODES.map(mode => (
          <button
            key={mode.value}
            onClick={() => {
              setMode(mode.value)
              if (mode.value !== 'image-to-video') {
                removeImage()
              }
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ring-focus ${
              currentMode === mode.value
                ? 'bg-primary/20 text-primary border border-primary/30'
                : 'glass text-muted hover:text-text hover:bg-white/5'
            }`}
          >
            {mode.icon}
            {mode.label}
          </button>
        ))}
      </div>

      {/* Image upload area */}
      {currentMode === 'image-to-video' && (
        <motion.div
          {...getRootProps()}
          className={`p-6 border-2 border-dashed rounded-2xl cursor-pointer transition-all ${
            isDragActive
              ? 'border-primary bg-primary/10'
              : 'border-border glass hover:border-primary/50'
          }`}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <input {...getInputProps()} />
          {imagePreview ? (
            <div className="relative">
              <img
                src={imagePreview}
                alt="Preview"
                className="max-h-40 w-auto mx-auto rounded-xl"
              />
              <button
                onClick={e => {
                  e.stopPropagation()
                  removeImage()
                }}
                className="absolute top-2 right-2 p-2 bg-error rounded-full text-white hover:bg-error/80 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="text-center">
              <Upload className="w-10 h-10 mx-auto mb-3 text-muted" />
              <p className="text-sm text-text font-medium mb-1">
                {isDragActive ? 'Drop the image here...' : 'Drag & drop an image'}
              </p>
              <p className="text-xs text-muted">or click to select</p>
            </div>
          )}
        </motion.div>
      )}

      {/* Progress */}
      {sendMutation.isPending && (
        <motion.div
          className="flex items-center gap-3 px-4 py-3 rounded-xl glass"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Loader2 className="w-5 h-5 text-primary animate-spin" />
          <div className="flex-1">
            <p className="text-sm font-medium text-text">
              Generating {currentMode.replace('-', ' ')}...
            </p>
            <p className="text-xs text-muted">This may take a moment</p>
          </div>
        </motion.div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex gap-3">
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
            placeholder="Describe what you want to generate..."
            className="w-full px-4 py-3 text-sm glass border border-border rounded-xl resize-none text-text placeholder-muted ring-focus transition-all focus:border-primary/50"
            rows={1}
            disabled={sendMutation.isPending}
          />
        </div>
        <motion.button
          type="submit"
          disabled={
            !prompt.trim() ||
            sendMutation.isPending ||
            (currentMode === 'image-to-video' && !selectedFile)
          }
          className="flex-shrink-0 px-6 py-3 rounded-xl bg-primary text-black font-semibold shadow-glow-primary hover:bg-white hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all ring-focus"
          whileHover={{ scale: sendMutation.isPending ? 1 : 1.02 }}
          whileTap={{ scale: sendMutation.isPending ? 1 : 0.98 }}
        >
          <Send className="w-5 h-5" />
        </motion.button>
      </form>

      {/* Error */}
      {sendMutation.error && (
        <motion.div
          className="px-4 py-3 rounded-xl bg-error/20 border border-error/30 text-error text-sm"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Failed to send message. Please try again.
        </motion.div>
      )}
    </div>
  )
}
