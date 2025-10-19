'use client'

import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Send, Loader2, Image, Video, Upload, Paperclip } from 'lucide-react'
import NextImage from 'next/image'
import { useUIStore } from '@/lib/store'
import { usePostMessage } from '@/lib/hooks/useMessages'
import { useS3Upload } from '@/lib/hooks/useS3Upload'

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
  // {
  //   value: 'speak',
  //   label: 'Speak',
  //   icon: <Video className="w-4 h-4" aria-label="Speak generation" />,
  // },
]

const MODELS = [
  // Text to Image models
  { value: 'nano-banana', label: 'Nano Banana', generationMode: 'text-to-image' },
  { value: 'seedream', label: 'Seedream 4.0', generationMode: 'text-to-image' },

  // Text to Video models
  { value: 'minimax-t2v', label: 'Minimax Hailuo 02', generationMode: 'text-to-video' },
  { value: 'seedance-v1-lite-t2v', label: 'Seedance 1.0 Lite', generationMode: 'text-to-video' },

  // Image to Video models
  { value: 'kling-2-5', label: 'Kling 2.5 Turbo', generationMode: 'image-to-video' },
  { value: 'seedance', label: 'Seedance 1.0', generationMode: 'image-to-video' },
  { value: 'wan-25-fast', label: 'Wan 2.5 Fast', generationMode: 'image-to-video' },
  { value: 'minimax', label: 'Minimax', generationMode: 'image-to-video' },
  // Special models
  // { value: 'veo-3-speak', label: 'Veo 3 Speak', generationMode: 'speak' },
]

export function Composer() {
  const { selectedChat, currentMode, currentModel, setMode, setModel } = useUIStore()
  const [message, setMessage] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const postMessageMutation = usePostMessage()
  const { uploads, isUploading, uploadFile, clearUploads, removeUpload } = useS3Upload()

  // Filter models based on selected generation mode
  const availableModels = MODELS.filter(model => model.generationMode === currentMode)

  // Update selected model when generation mode changes
  const handleGenerationModeChange = (mode: string) => {
    setMode(mode as any) // Cast to Mode type
    const firstAvailableModel = MODELS.find(model => model.generationMode === mode)
    if (firstAvailableModel) {
      setModel(firstAvailableModel.value)
    }
  }

  // Handle image upload
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files && files.length > 0) {
      const file = files[0]
      if (file && file.type.startsWith('image/')) {
        try {
          // Start S3 upload - image will be shown in composer attachments
          await uploadFile(file)
        } catch (error) {
          console.error('Failed to upload image:', error)
        }
      }
    }
  }

  // Remove uploaded image
  const removeImage = (file: File) => {
    removeUpload(file)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (
      !selectedChat ||
      (!message.trim() && uploads.length === 0) ||
      postMessageMutation.isPending ||
      isUploading
    )
      return

    // Create a formatted message with mode and model info
    const formattedMessage = `${message.trim()}`

    // Get completed upload URLs
    const attachmentUrls = uploads
      .filter(upload => upload.status === 'completed' && upload.downloadUrl)
      .map(upload => upload.downloadUrl!)

    // Clear composer immediately when message is sent
    setMessage('')
    clearUploads()

    // Emit event to show loading state
    window.dispatchEvent(
      new CustomEvent('messageSent', {
        detail: {
          chatId: selectedChat.id,
          message: formattedMessage,
          images: attachmentUrls,
          isLoading: true,
        },
      })
    )

    postMessageMutation.mutate(
      {
        chatId: selectedChat.id,
        text: formattedMessage,
        ...(attachmentUrls.length > 0 && { attachmentUrls }),
      },
      {
        onSuccess: () => {
          console.log('Message posted successfully')
          textareaRef.current?.focus()

          // Emit event to hide loading state
          window.dispatchEvent(
            new CustomEvent('messageSent', {
              detail: {
                chatId: selectedChat.id,
                message: null,
                images: [],
                isLoading: false,
              },
            })
          )
        },
        onError: error => {
          console.error('Error posting message:', error)

          // Emit event to hide loading state on error
          window.dispatchEvent(
            new CustomEvent('messageSent', {
              detail: {
                chatId: selectedChat.id,
                message: null,
                images: [],
                isLoading: false,
              },
            })
          )
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
                currentMode === mode.value
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
              onClick={() => setModel(model.value)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ring-focus ${
                currentModel === model.value
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

      {/* Upload Progress */}
      {uploads.length > 0 && (
        <div className="space-y-2">
          <div className="flex flex-wrap gap-2">
            {uploads.map((upload, index) => (
              <div key={index} className="relative group">
                <div className="w-20 h-20 rounded-lg border border-border overflow-hidden bg-surface/50 flex items-center justify-center">
                  {upload.status === 'completed' && upload.downloadUrl ? (
                    <NextImage
                      src={upload.downloadUrl}
                      alt={`Uploaded image ${index + 1}`}
                      width={80}
                      height={80}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-center p-2">
                      {upload.status === 'uploading' ? (
                        <>
                          <Loader2 className="w-4 h-4 text-primary animate-spin mb-1" />
                          <span className="text-xs text-muted">Uploading...</span>
                        </>
                      ) : upload.status === 'error' ? (
                        <>
                          <div className="w-4 h-4 text-error mb-1">⚠</div>
                          <span className="text-xs text-error">Failed</span>
                        </>
                      ) : (
                        <>
                          <div className="w-4 h-4 text-muted mb-1">📁</div>
                          <span className="text-xs text-muted">Pending...</span>
                        </>
                      )}
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => removeImage(upload.file)}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-error text-white rounded-full flex items-center justify-center text-xs hover:bg-error/80 transition-colors"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

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
            placeholder={`Describe what you want to generate with ${currentModel}...`}
            className="w-full px-4 py-3 text-sm glass border border-border rounded-xl resize-none text-text placeholder-muted ring-focus transition-all focus:border-primary/50"
            rows={1}
            disabled={postMessageMutation.isPending}
          />
        </div>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />

        {/* Upload button */}
        <motion.button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="flex-shrink-0 px-4 py-3 rounded-xl glass border border-border text-text hover:bg-white/10 transition-all ring-focus"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Paperclip className="w-5 h-5" />
        </motion.button>

        <motion.button
          type="submit"
          disabled={
            (!message.trim() && uploads.length === 0) ||
            postMessageMutation.isPending ||
            isUploading
          }
          className="flex-shrink-0 px-6 py-3 rounded-xl bg-primary text-black font-semibold shadow-glow-primary hover:bg-white hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all ring-focus"
          whileHover={{ scale: postMessageMutation.isPending ? 1 : 1.02 }}
          whileTap={{ scale: postMessageMutation.isPending ? 1 : 0.98 }}
        >
          {postMessageMutation.isPending ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Send className="w-5 h-5" />
          )}
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
