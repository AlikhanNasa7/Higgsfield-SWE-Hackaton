'use client'

import { motion } from 'framer-motion'
import NextImage from 'next/image'
import { useUIStore } from '@/lib/store'
import { Image, Video, Monitor, Calendar } from 'lucide-react'
import { fadeUp } from '@/lib/motion'

export function ContentViewer() {
  const { selectedContent } = useUIStore()

  if (!selectedContent) {
    return null
  }

  return (
    <motion.div
      className="h-full flex flex-col bg-surface/50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <div className="glass border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {selectedContent.kind === 'image' ? (
              <div className="w-10 h-10 rounded-xl glass flex items-center justify-center">
                <Image className="w-5 h-5 text-primary" />
              </div>
            ) : (
              <div className="w-10 h-10 rounded-xl glass flex items-center justify-center">
                <Video className="w-5 h-5 text-accent" />
              </div>
            )}
            <div>
              <h3 className="text-lg font-semibold text-text">
                {selectedContent.title ||
                  `${selectedContent.kind.charAt(0).toUpperCase() + selectedContent.kind.slice(1)} Content`}
              </h3>
              <div className="flex items-center gap-2 text-xs text-muted">
                <Calendar className="w-3 h-3" />
                {new Date(selectedContent.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center p-4 overflow-hidden">
        <motion.div
          className="w-full h-full flex items-center justify-center relative"
          variants={fadeUp}
          initial="initial"
          animate="animate"
        >
          {selectedContent.kind === 'image' ? (
            <NextImage
              src={selectedContent.url}
              alt={selectedContent.title || 'Generated image'}
              width={800}
              height={600}
              className="w-full h-full object-contain rounded-xl shadow-elevated"
              style={{
                maxWidth: '100%',
                maxHeight: '100%',
                width: 'auto',
                height: 'auto',
              }}
            />
          ) : (
            <video
              src={selectedContent.url}
              controls
              loop
              autoPlay
              playsInline
              disablePictureInPicture
              preload="metadata"
              className="w-full h-full object-contain rounded-xl shadow-elevated"
              style={{
                backgroundColor: '#000',
                maxWidth: '100%',
                maxHeight: '100%',
                width: 'auto',
                height: 'auto',
              }}
              aria-label={selectedContent.title || 'Video content'}
            >
              Your browser does not support the video tag.
            </video>
          )}
        </motion.div>
      </div>
    </motion.div>
  )
}
