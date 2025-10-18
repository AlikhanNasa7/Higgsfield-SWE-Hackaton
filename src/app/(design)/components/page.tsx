'use client'

import { useState } from 'react'
import { Container } from '@/components/design/Container'
import { SectionHeader } from '@/components/design/SectionHeader'
import { Button } from '@/components/design/Button'
import { Badge } from '@/components/design/Badge'
import { GlowCard } from '@/components/design/GlowCard'
import { MediaFrame } from '@/components/design/MediaFrame'

export default function ComponentsPage() {
  return (
    <div className="py-24 space-y-24">
      <Container size="xl" pad="md">
        <SectionHeader
          eyebrow="Component Library"
          title="Interactive Components"
          subtitle="Explore and interact with all available components in the design system."
          gradient
        />

        {/* Button Component */}
        <ComponentShowcase
          title="Button"
          description="Flexible button component with multiple variants and sizes"
        >
          <ButtonDemo />
        </ComponentShowcase>

        {/* Badge Component */}
        <ComponentShowcase
          title="Badge"
          description="Small labels for tags, status indicators, and categories"
        >
          <BadgeDemo />
        </ComponentShowcase>

        {/* Card Component */}
        <ComponentShowcase
          title="Glow Card"
          description="Elevated cards with glass morphism and hover effects"
        >
          <CardDemo />
        </ComponentShowcase>

        {/* Media Frame Component */}
        <ComponentShowcase
          title="Media Frame"
          description="Responsive containers for images and videos with parallax support"
        >
          <MediaFrameDemo />
        </ComponentShowcase>

        {/* Container Component */}
        <ComponentShowcase
          title="Container"
          description="Responsive content containers with configurable max-width and padding"
        >
          <ContainerDemo />
        </ComponentShowcase>

        {/* Section Header Component */}
        <ComponentShowcase
          title="Section Header"
          description="Pre-styled headers with eyebrow, title, and subtitle"
        >
          <SectionHeaderDemo />
        </ComponentShowcase>
      </Container>
    </div>
  )
}

function ComponentShowcase({
  title,
  description,
  children,
}: {
  title: string
  description: string
  children: React.ReactNode
}) {
  return (
    <section className="space-y-6">
      <div>
        <h2 className="headline-md text-text mb-2">{title}</h2>
        <p className="text-muted">{description}</p>
      </div>
      <div className="glass rounded-2xl p-8">{children}</div>
    </section>
  )
}

function ButtonDemo() {
  const [variant, setVariant] = useState<'primary' | 'secondary' | 'glass' | 'ghost' | 'link'>(
    'primary'
  )
  const [size, setSize] = useState<'sm' | 'md' | 'lg'>('md')

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="space-y-4">
        <div>
          <p className="text-sm text-muted mb-2">Variant</p>
          <div className="flex flex-wrap gap-2">
            {(['primary', 'secondary', 'glass', 'ghost', 'link'] as const).map(v => (
              <Badge
                key={v}
                tone={variant === v ? 'primary' : 'neutral'}
                variant={variant === v ? 'solid' : 'outline'}
                onClick={() => setVariant(v)}
                className="cursor-pointer"
              >
                {v}
              </Badge>
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm text-muted mb-2">Size</p>
          <div className="flex gap-2">
            {(['sm', 'md', 'lg'] as const).map(s => (
              <Badge
                key={s}
                tone={size === s ? 'primary' : 'neutral'}
                variant={size === s ? 'solid' : 'outline'}
                onClick={() => setSize(s)}
                className="cursor-pointer"
              >
                {s}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* Preview */}
      <div className="flex items-center justify-center p-12 bg-surface rounded-xl">
        <Button variant={variant} size={size}>
          {variant === 'link' ? 'Link Button' : 'Click Me'}
        </Button>
      </div>
    </div>
  )
}

function BadgeDemo() {
  const [tone, setTone] = useState<
    'primary' | 'accent' | 'neutral' | 'success' | 'warning' | 'error'
  >('primary')
  const [variant, setVariant] = useState<'solid' | 'outline'>('solid')

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="space-y-4">
        <div>
          <p className="text-sm text-muted mb-2">Tone</p>
          <div className="flex flex-wrap gap-2">
            {(['primary', 'accent', 'neutral', 'success', 'warning', 'error'] as const).map(t => (
              <Badge
                key={t}
                tone={tone === t ? 'primary' : 'neutral'}
                variant={tone === t ? 'solid' : 'outline'}
                onClick={() => setTone(t)}
                className="cursor-pointer"
              >
                {t}
              </Badge>
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm text-muted mb-2">Variant</p>
          <div className="flex gap-2">
            {(['solid', 'outline'] as const).map(v => (
              <Badge
                key={v}
                tone={variant === v ? 'primary' : 'neutral'}
                variant={variant === v ? 'solid' : 'outline'}
                onClick={() => setVariant(v)}
                className="cursor-pointer"
              >
                {v}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* Preview */}
      <div className="flex items-center justify-center p-12 bg-surface rounded-xl">
        <Badge tone={tone} variant={variant}>
          Badge Text
        </Badge>
      </div>
    </div>
  )
}

function CardDemo() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <GlowCard title="Simple Card" subtitle="A basic card with title and description" hoverGlow />
      <GlowCard
        title="Card with Button"
        subtitle="This card includes a call-to-action"
        cta={
          <Button variant="secondary" size="sm">
            Learn More
          </Button>
        }
        hoverGlow
      />
      <GlowCard
        media={
          <div className="aspect-video bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-semibold">
            Media
          </div>
        }
        title="Media Card"
        subtitle="Card with image or video content"
        hoverGlow
      />
    </div>
  )
}

function MediaFrameDemo() {
  const [ratio, setRatio] = useState<'16:9' | '1:1' | '9:16' | '4:3' | '21:9'>('16:9')

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div>
        <p className="text-sm text-muted mb-2">Aspect Ratio</p>
        <div className="flex flex-wrap gap-2">
          {(['16:9', '1:1', '9:16', '4:3', '21:9'] as const).map(r => (
            <Badge
              key={r}
              tone={ratio === r ? 'primary' : 'neutral'}
              variant={ratio === r ? 'solid' : 'outline'}
              onClick={() => setRatio(r)}
              className="cursor-pointer"
            >
              {r}
            </Badge>
          ))}
        </div>
      </div>

      {/* Preview */}
      <div className="max-w-2xl mx-auto">
        <MediaFrame
          ratio={ratio}
          imageSrc="https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=800&q=80"
          glow
        />
      </div>
    </div>
  )
}

function ContainerDemo() {
  return (
    <div className="space-y-4">
      <Container size="lg" pad="md" className="bg-surface rounded-xl p-6">
        <p className="text-text text-center">Large Container (max-width: 1280px)</p>
      </Container>
      <Container size="xl" pad="md" className="bg-surface rounded-xl p-6">
        <p className="text-text text-center">XL Container (max-width: 1440px)</p>
      </Container>
    </div>
  )
}

function SectionHeaderDemo() {
  return (
    <div className="space-y-12">
      <SectionHeader
        eyebrow="Eyebrow Text"
        title="Section Title"
        subtitle="This is a subtitle that provides more context about the section."
        align="center"
      />
      <SectionHeader
        eyebrow="With Gradient"
        title="Gradient Title"
        subtitle="This title uses the gradient effect for extra emphasis."
        align="center"
        gradient
      />
      <SectionHeader
        eyebrow="Left Aligned"
        title="Left Aligned Header"
        subtitle="Headers can also be left-aligned for different layouts."
        align="left"
      />
    </div>
  )
}
