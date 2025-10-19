'use client'

import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { useUIStore } from '@/lib/store'
import { useGenerateContent } from '@/lib/hooks/useGenerateContent'
import { type BackendMessage, type BackendRenderChunk } from '@/types/schemas'
import { mockContents } from '@/mockData'
import { User, Sparkles } from 'lucide-react'
import NextImage from 'next/image'

interface MessageBubbleBackendProps {
  message: BackendMessage
  messages?: BackendMessage[]
}

function RenderChunkRenderer({
  chunk,
  generateContentMutation,
  messages,
}: {
  chunk: BackendRenderChunk
  generateContentMutation: ReturnType<typeof useGenerateContent>
  messages?: BackendMessage[]
}) {
  const { selectContent, selectedChat, currentMode, currentModel, addGeneratedContent } =
    useUIStore()

  if (chunk.type === 'text') {
    return <p className="leading-relaxed">{chunk.text}</p>
  }

  if (chunk.type === 'image') {
    // Check if this is a user attachment (smaller) or generated image (larger)
    const isUserAttachment = chunk.alt === 'User attachment'

    return (
      <div className={isUserAttachment ? 'mt-2' : 'my-2'}>
        <NextImage
          src={chunk.imageUrl}
          alt={chunk.alt || 'Generated image'}
          width={isUserAttachment ? 120 : 400}
          height={isUserAttachment ? 90 : 300}
          className={`${
            isUserAttachment
              ? 'w-20 h-15 object-cover rounded-lg border border-border/50'
              : 'max-w-full h-auto rounded-lg border border-border'
          }`}
        />
      </div>
    )
  }

  if (chunk.type === 'button') {
    const handleClick = async () => {
      if (selectedChat) {
        // Show generating toast
        toast.loading('Generating...', {
          id: 'generating',
          duration: Infinity, // Keep loading until replaced
        })

        try {
          // Prepare generation request with quality settings for Seedream
          const generationRequest: any = {
            option_id: chunk.option_id,
            mode: currentMode,
            model_name: currentModel,
          }

          // For image-to-video mode, find the last user message with attachments
          if (currentMode === 'image-to-video' && messages) {
            const lastUserMessage = messages
              .filter(msg => msg.author_type === 'user')
              .reverse()
              .find(msg => msg.attachments && msg.attachments.length > 0)

            if (lastUserMessage && lastUserMessage.attachments) {
              // Get the first attachment URL (image)
              const attachmentUrl = lastUserMessage.attachments
                .map(attachment => {
                  if (typeof attachment === 'string') {
                    return attachment
                  }
                  const attachmentObj = attachment as any
                  return attachmentObj?.storage_url || attachmentObj?.url
                })
                .find(url => url && url.trim() !== '')

              if (attachmentUrl) {
                generationRequest.image_url = attachmentUrl
              }
            }
          }

          // Add high quality settings specifically for Seedream text-to-image
          if (currentMode === 'text-to-image' && currentModel === 'seedream') {
            generationRequest.quality = 'basic'
          }

          // Generate content using the API
          const response = await generateContentMutation.mutateAsync(generationRequest)

          // Create content object from the response
          const generatedContent = {
            id: chunk.option_id,
            kind:
              currentMode === 'text-to-video' ||
              currentMode === 'image-to-video' ||
              currentMode === 'text-to-audio'
                ? ('video' as const)
                : ('image' as const),
            title: chunk.label,
            url: response.url,
            thumbUrl: response.url,
            createdAt: new Date().toISOString(),
          }

          // Add to generated content list
          addGeneratedContent(selectedChat.id, generatedContent)

          // Set as current content
          selectContent(generatedContent)

          // Show success toast
          toast.success('Content generated successfully!', {
            id: 'generating',
            duration: 3000, // Show success for 3 seconds
          })
        } catch (error) {
          console.error('Failed to generate content:', error)
          toast.error('Failed to generate content', {
            id: 'generating',
            duration: 4000, // Show error for 4 seconds
          })
        }
      }
    }

    return (
      <motion.button
        onClick={handleClick}
        disabled={generateContentMutation.isPending}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/20 text-primary border border-primary/30 hover:bg-primary/30 hover:border-primary/50 transition-all ring-focus disabled:opacity-50 disabled:cursor-not-allowed"
        whileHover={{ scale: generateContentMutation.isPending ? 1 : 1.02 }}
        whileTap={{ scale: generateContentMutation.isPending ? 1 : 0.98 }}
      >
        <span className="font-medium">{chunk.label}</span>
        {generateContentMutation.isPending ? (
          <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        ) : (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 7l5 5m0 0l-5 5m5-5H6"
            />
          </svg>
        )}
      </motion.button>
    )
  }

  return null
}

export function MessageBubbleBackend({ message, messages }: MessageBubbleBackendProps) {
  const generateContentMutation = useGenerateContent()
  const isUser = message.author_type === 'user'
  const createdAt = new Date(message.created_at).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  })

  // Convert backend message to render chunks
  const renderChunks: BackendRenderChunk[] = []

  // Add text content if it exists
  if (message.content_text) {
    renderChunks.push({
      type: 'text',
      text: message.content_text,
    })
  }

  // Add render payload if it exists
  if (message.render_payload) {
    renderChunks.push(...message.render_payload)
  }

  // Don't add attachments to render chunks - we'll display them separately

  return (
    <div className={`flex gap-4 ${isUser ? 'flex-row-reverse' : ''}`}>
      {/* Avatar */}
      <div className="flex-shrink-0">
        <motion.div
          className={`w-10 h-10 rounded-xl flex items-center justify-center ${
            isUser ? 'bg-primary shadow-glow-primary' : 'glass border border-border'
          }`}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {isUser ? (
            <User className="w-5 h-5 text-black" />
          ) : (
            <Sparkles className="w-5 h-5 text-primary" />
          )}
        </motion.div>
      </div>

      {/* Message content */}
      <div className={`flex-1 min-w-0 ${isUser ? 'flex flex-col items-end' : ''}`}>
        <motion.div
          className={`inline-block max-w-[85%] p-4 rounded-2xl ${
            isUser
              ? 'bg-primary text-black shadow-glow-primary font-medium'
              : 'glass border border-border'
          }`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <div className={`space-y-3 ${isUser ? 'text-black' : 'text-text'}`}>
            {renderChunks.map((chunk, index) => (
              <RenderChunkRenderer
                key={index}
                chunk={chunk}
                generateContentMutation={generateContentMutation}
                messages={messages}
              />
            ))}
            {!message.content_text && (
              <p className="text-sm text-muted">Попробуй перефразировать запрос</p>
            )}

            {/* Display attachments if they exist and have valid URLs */}
            {message.attachments && message.attachments.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {message.attachments
                  .map(attachment => {
                    // Handle multiple formats: string URLs and objects with storage_url or url
                    if (typeof attachment === 'string') {
                      return attachment
                    }
                    const attachmentObj = attachment as any
                    return attachmentObj?.storage_url || attachmentObj?.url
                  })
                  .filter(url => url && url.trim() !== '')
                  .map((url, index) => {
                    // Determine if it's a video or image based on file extension
                    const isVideo = /\.(mp4|webm|ogg|mov|avi|mkv)$/i.test(url)

                    return (
                      <div key={index} className="relative">
                        {isVideo ? (
                          <video
                            src={url}
                            className="w-20 h-15 object-cover rounded-lg border border-border/50"
                            autoPlay
                            muted
                            loop
                            playsInline
                            disablePictureInPicture
                            preload="metadata"
                          >
                            Your browser does not support the video tag.
                          </video>
                        ) : (
                          <NextImage
                            src={url}
                            alt={`Attachment ${index + 1}`}
                            width={120}
                            height={90}
                            className="w-20 h-15 object-cover rounded-lg border border-border/50"
                          />
                        )}
                      </div>
                    )
                  })}
              </div>
            )}
          </div>
        </motion.div>
        <motion.div
          className={`text-xs text-muted mt-1.5 px-1 ${isUser ? 'text-right' : ''}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          {createdAt}
        </motion.div>
      </div>
    </div>
  )
}
