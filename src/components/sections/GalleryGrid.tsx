'use client'

import { motion } from 'framer-motion'
import { Container } from '../design/Container'
import { SectionHeader } from '../design/SectionHeader'
import { MediaFrame } from '../design/MediaFrame'
import { Badge } from '../design/Badge'
import { fadeUp, stagger } from '@/lib/motion'

const galleryItems = [
  {
    title: 'Abstract Composition',
    tags: ['Design', 'Art'],
    image: 'https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=800&q=80',
    ratio: '16:9' as const,
  },
  {
    title: 'Neon Nights',
    tags: ['Photography', 'Urban'],
    image: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=800&q=80',
    ratio: '1:1' as const,
  },
  {
    title: 'Digital Dreams',
    tags: ['3D', 'Motion'],
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80',
    ratio: '16:9' as const,
  },
  {
    title: 'Liquid Motion',
    tags: ['Abstract', 'Fluid'],
    image: 'https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?w=800&q=80',
    ratio: '1:1' as const,
  },
  {
    title: 'Cosmic Energy',
    tags: ['Space', 'Nebula'],
    image: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=800&q=80',
    ratio: '16:9' as const,
  },
  {
    title: 'Future Tech',
    tags: ['Technology', 'UI'],
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&q=80',
    ratio: '16:9' as const,
  },
]

export function GalleryGrid() {
  return (
    <section className="py-24 md:py-32 relative">
      <Container size="lg" pad="md">
        <SectionHeader
          eyebrow="Gallery"
          title="Showcase your work in style"
          subtitle="Beautiful, responsive grid layouts with hover effects and smooth transitions."
        />

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-16"
          variants={stagger(0.3, 0.08)}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: '-100px' }}
        >
          {galleryItems.map((item, index) => (
            <motion.div key={index} variants={fadeUp} className="group relative">
              <MediaFrame
                ratio={item.ratio}
                imageSrc={item.image}
                glow
                parallax
                parallaxStrength={8}
              />

              {/* Hover overlay */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-bg via-bg/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-start justify-end p-6">
                <h3 className="text-xl font-semibold text-text mb-2">{item.title}</h3>
                <div className="flex gap-2">
                  {item.tags.map((tag, tagIndex) => (
                    <Badge key={tagIndex} tone="primary" variant="solid">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </section>
  )
}
