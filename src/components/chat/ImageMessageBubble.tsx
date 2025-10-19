'use client'

import { motion } from 'framer-motion'
import { User, Bot } from 'lucide-react'
import Image from 'next/image'

interface ImageMessageBubbleProps {
  imageUrl: string
  alt?: string
  isUser: boolean
}

export function ImageMessageBubble({ imageUrl, alt, isUser }: ImageMessageBubbleProps) {
  return (
    <motion.div
      className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Avatar */}
      <div
        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          isUser ? 'bg-primary' : 'bg-accent'
        }`}
      >
        {isUser ? <User className="w-4 h-4 text-black" /> : <Bot className="w-4 h-4 text-black" />}
      </div>

      {/* Image */}
      <div className={`max-w-xs ${isUser ? 'order-1' : 'order-2'}`}>
        <div className="glass rounded-xl p-2">
          <Image
            src={imageUrl}
            alt={alt || 'Uploaded image'}
            width={300}
            height={200}
            className="w-full h-auto rounded-lg object-cover"
          />
        </div>
      </div>
    </motion.div>
  )
}
