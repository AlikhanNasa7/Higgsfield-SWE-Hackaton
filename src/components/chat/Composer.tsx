'use client'

import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Send, Loader2, Image, Video, Upload } from 'lucide-react'
import { useUIStore } from '@/lib/store'
import { usePostMessage } from '@/lib/hooks/useMessages'

const GENERATION_MODES = [
  {
    value: 'text-to-image',
    label: 'Text → Image',
    icon: <Image className="w-4 h-4" aria-label="Image generation" />,
  },
  {
    value: 'text-to-video',
    label: 'Text → Video',
    icon: <Video className="w-4 h-4" aria-label="Video generation" />,
  },
  {
    value: 'image-to-video',
    label: 'Image → Video',
    icon: <Upload className="w-4 h-4" aria-label="Image to video" />,
  },
  {
    value: 'speak',
    label: 'Speak',
    icon: <Video className="w-4 h-4" aria-label="Speak generation" />,
  },
]

const MODELS = [
  // Text to Image models
  { value: 'nano-banana', label: 'Nano Banana', generationMode: 'text-to-image' },
  { value: 'seedream-4', label: 'Seedream 4.0', generationMode: 'text-to-image' },
  { value: 'minimax-hailuo', label: 'Minimax Hailuo 02', generationMode: 'text-to-image' },

  // Text to Video models
  { value: 'sora-2', label: 'Sora 2', generationMode: 'text-to-video' },
  { value: 'minimax-hailuo-video', label: 'Minimax Hailuo 02', generationMode: 'text-to-video' },
  { value: 'seedance-lite', label: 'Seedance 1.0 Lite', generationMode: 'text-to-video' },

  // Image to Video models
  { value: 'kling-2.5', label: 'Kling 2.5 Turbo', generationMode: 'image-to-video' },
  { value: 'minimax-hailuo-img2vid', label: 'Minimax Hailuo 02', generationMode: 'image-to-video' },
  { value: 'seedance-1.0', label: 'Seedance 1.0', generationMode: 'image-to-video' },
  { value: 'veo-3', label: 'Veo 3', generationMode: 'image-to-video' },
  { value: 'wan-2.5', label: 'Wan 2.5 Fast', generationMode: 'image-to-video' },

  // Special models
  { value: 'veo-3-speak', label: 'Veo 3 Speak', generationMode: 'speak' },
]

export function Composer() {
  const { selectedChat } = useUIStore()
  const [message, setMessage] = useState('')
  const [generationMode, setGenerationMode] = useState('text-to-image')
  const [selectedModel, setSelectedModel] = useState('nano-banana')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const postMessageMutation = usePostMessage()

  // Filter models based on selected generation mode
  const availableModels = MODELS.filter(model => model.generationMode === generationMode)

  // Update selected model when generation mode changes
  const handleGenerationModeChange = (mode: string) => {
    setGenerationMode(mode)
    const firstAvailableModel = MODELS.find(model => model.generationMode === mode)
    if (firstAvailableModel) {
      setSelectedModel(firstAvailableModel.value)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedChat || !message.trim() || postMessageMutation.isPending) return

    // Create a formatted message with mode and model info
    const formattedMessage = `[${generationMode.toUpperCase()}] [${selectedModel.toUpperCase()}] ${message.trim()}`

    postMessageMutation.mutate(
      { chatId: selectedChat.id, content: formattedMessage },
      {
        onSuccess: () => {
          console.log('Message posted successfully')
          setMessage('')
          textareaRef.current?.focus()
        },
        onError: error => {
          console.error('Error posting message:', error)
        },
      }
    )
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
      {/* Loading indicator for assistant response */}
      {postMessageMutation.isPending && (
        <motion.div
          className="flex items-center gap-3 px-4 py-3 rounded-xl glass"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Loader2 className="w-5 h-5 text-primary animate-spin" />
          <div className="flex-1">
            <p className="text-sm font-medium text-text">Sending message...</p>
            <p className="text-xs text-muted">Waiting for response</p>
          </div>
        </motion.div>
      )}

      {/* Generation Mode Selection */}
      <div className="space-y-3">
        <div className="flex gap-2 flex-wrap">
          {GENERATION_MODES.map(mode => (
            <motion.button
              key={mode.value}
              type="button"
              onClick={() => handleGenerationModeChange(mode.value)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ring-focus ${
                generationMode === mode.value
                  ? 'bg-primary/20 text-primary border border-primary/30'
                  : 'glass text-muted hover:text-text hover:bg-white/5'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {mode.icon}
              <span className="hidden sm:inline">{mode.label}</span>
            </motion.button>
          ))}
        </div>

        {/* Model Selection */}
        <div className="flex gap-2 flex-wrap">
          {availableModels.map(model => (
            <motion.button
              key={model.value}
              type="button"
              onClick={() => setSelectedModel(model.value)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ring-focus ${
                selectedModel === model.value
                  ? 'bg-accent/20 text-accent border border-accent/30'
                  : 'glass text-muted hover:text-text hover:bg-white/5'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {model.label}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex gap-3">
        <div className="flex-1">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={e => {
              setMessage(e.target.value)
              adjustTextareaHeight()
            }}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSubmit(e)
              }
            }}
            placeholder={`Describe what you want to generate with ${selectedModel}...`}
            className="w-full px-4 py-3 text-sm glass border border-border rounded-xl resize-none text-text placeholder-muted ring-focus transition-all focus:border-primary/50"
            rows={1}
            disabled={postMessageMutation.isPending}
          />
        </div>
        <motion.button
          type="submit"
          disabled={!message.trim() || postMessageMutation.isPending}
          className="flex-shrink-0 px-6 py-3 rounded-xl bg-primary text-black font-semibold shadow-glow-primary hover:bg-white hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all ring-focus"
          whileHover={{ scale: postMessageMutation.isPending ? 1 : 1.02 }}
          whileTap={{ scale: postMessageMutation.isPending ? 1 : 0.98 }}
        >
          <Send className="w-5 h-5" />
        </motion.button>
      </form>

      {/* Error */}
      {postMessageMutation.error && (
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
