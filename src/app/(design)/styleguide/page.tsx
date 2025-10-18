'use client'

import { Container } from '@/components/design/Container'
import { SectionHeader } from '@/components/design/SectionHeader'
import { Button } from '@/components/design/Button'
import { Badge } from '@/components/design/Badge'
import { GlowCard } from '@/components/design/GlowCard'
import { MediaFrame } from '@/components/design/MediaFrame'

export default function StyleguidePage() {
  return (
    <div className="py-24 space-y-32">
      <Container size="xl" pad="md">
        <SectionHeader
          eyebrow="Design System"
          title="Styleguide"
          subtitle="A comprehensive overview of all design tokens, components, and patterns."
          gradient
        />

        {/* Colors */}
        <section className="space-y-8 mt-24">
          <h2 className="headline-lg text-text">Colors</h2>

          <div>
            <h3 className="text-xl font-semibold text-text mb-4">Brand Colors</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <ColorSwatch color="bg" label="Background" value="#0B0B0F" />
              <ColorSwatch color="surface" label="Surface" value="#111319" />
              <ColorSwatch color="primary" label="Primary" value="#8B5CF6" />
              <ColorSwatch color="accent" label="Accent" value="#22D3EE" />
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-text mb-4">Semantic Colors</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <ColorSwatch color="text" label="Text" value="#E6E8EE" />
              <ColorSwatch color="muted" label="Muted" value="#9AA3AF" />
              <ColorSwatch color="border" label="Border" value="#262938" />
              <ColorSwatch color="success" label="Success" value="#10B981" />
            </div>
          </div>
        </section>

        {/* Typography */}
        <section className="space-y-8">
          <h2 className="headline-lg text-text">Typography</h2>

          <div className="space-y-6">
            <div>
              <p className="text-sm text-muted mb-2">Display Large (72px)</p>
              <p className="display-lg">The quick brown fox</p>
            </div>
            <div>
              <p className="text-sm text-muted mb-2">Display Medium (64px)</p>
              <p className="display-md">The quick brown fox</p>
            </div>
            <div>
              <p className="text-sm text-muted mb-2">Display Small (48px)</p>
              <p className="display-sm">The quick brown fox</p>
            </div>
            <div>
              <p className="text-sm text-muted mb-2">Headline Large (36px)</p>
              <p className="headline-lg">The quick brown fox jumps over the lazy dog</p>
            </div>
            <div>
              <p className="text-sm text-muted mb-2">Headline Medium (30px)</p>
              <p className="headline-md">The quick brown fox jumps over the lazy dog</p>
            </div>
            <div>
              <p className="text-sm text-muted mb-2">Body Large (18px)</p>
              <p className="body-lg">
                The quick brown fox jumps over the lazy dog. Pack my box with five dozen liquor
                jugs.
              </p>
            </div>
            <div>
              <p className="text-sm text-muted mb-2">Body (16px)</p>
              <p className="text-base">
                The quick brown fox jumps over the lazy dog. Pack my box with five dozen liquor
                jugs.
              </p>
            </div>
            <div>
              <p className="text-sm text-muted mb-2">Eyebrow</p>
              <p className="eyebrow">The quick brown fox</p>
            </div>
          </div>
        </section>

        {/* Buttons */}
        <section className="space-y-8">
          <h2 className="headline-lg text-text">Buttons</h2>

          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-semibold text-text mb-4">Variants</h3>
              <div className="flex flex-wrap gap-4">
                <Button variant="primary">Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="glass">Glass</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="link">Link</Button>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-text mb-4">Sizes</h3>
              <div className="flex flex-wrap items-center gap-4">
                <Button size="sm">Small</Button>
                <Button size="md">Medium</Button>
                <Button size="lg">Large</Button>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-text mb-4">States</h3>
              <div className="flex flex-wrap gap-4">
                <Button>Normal</Button>
                <Button disabled>Disabled</Button>
              </div>
            </div>
          </div>
        </section>

        {/* Badges */}
        <section className="space-y-8">
          <h2 className="headline-lg text-text">Badges</h2>

          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-semibold text-text mb-4">Solid</h3>
              <div className="flex flex-wrap gap-3">
                <Badge tone="primary" variant="solid">
                  Primary
                </Badge>
                <Badge tone="accent" variant="solid">
                  Accent
                </Badge>
                <Badge tone="neutral" variant="solid">
                  Neutral
                </Badge>
                <Badge tone="success" variant="solid">
                  Success
                </Badge>
                <Badge tone="warning" variant="solid">
                  Warning
                </Badge>
                <Badge tone="error" variant="solid">
                  Error
                </Badge>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-text mb-4">Outline</h3>
              <div className="flex flex-wrap gap-3">
                <Badge tone="primary" variant="outline">
                  Primary
                </Badge>
                <Badge tone="accent" variant="outline">
                  Accent
                </Badge>
                <Badge tone="neutral" variant="outline">
                  Neutral
                </Badge>
                <Badge tone="success" variant="outline">
                  Success
                </Badge>
                <Badge tone="warning" variant="outline">
                  Warning
                </Badge>
                <Badge tone="error" variant="outline">
                  Error
                </Badge>
              </div>
            </div>
          </div>
        </section>

        {/* Cards */}
        <section className="space-y-8">
          <h2 className="headline-lg text-text">Cards</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <GlowCard
              title="Basic Card"
              subtitle="A simple card with title and subtitle"
              hoverGlow
            />
            <GlowCard
              title="Card with CTA"
              subtitle="This card includes a call-to-action button"
              cta={
                <Button variant="secondary" size="sm">
                  Learn More
                </Button>
              }
              hoverGlow
            />
            <GlowCard
              title="Card with Media"
              subtitle="This card includes a media element"
              media={<div className="aspect-video bg-gradient-to-br from-primary to-accent" />}
              hoverGlow
            />
          </div>
        </section>

        {/* Media Frames */}
        <section className="space-y-8">
          <h2 className="headline-lg text-text">Media Frames</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-muted mb-3">16:9 Ratio</p>
              <MediaFrame
                ratio="16:9"
                imageSrc="https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=800&q=80"
                glow
              />
            </div>
            <div>
              <p className="text-sm text-muted mb-3">1:1 Ratio</p>
              <MediaFrame
                ratio="1:1"
                imageSrc="https://images.unsplash.com/photo-1514565131-fce0801e5785?w=800&q=80"
                glow
              />
            </div>
          </div>
        </section>

        {/* Spacing */}
        <section className="space-y-8">
          <h2 className="headline-lg text-text">Spacing</h2>

          <div className="space-y-4">
            {[8, 16, 24, 32, 48, 64, 80].map(space => (
              <div key={space} className="flex items-center gap-4">
                <div className="w-16 text-sm text-muted">{space}px</div>
                <div className="bg-primary h-8" style={{ width: `${space}px` }} />
              </div>
            ))}
          </div>
        </section>

        {/* Border Radius */}
        <section className="space-y-8">
          <h2 className="headline-lg text-text">Border Radius</h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <RadiusSwatch radius="sm" label="Small (6px)" />
            <RadiusSwatch radius="md" label="Medium (8px)" />
            <RadiusSwatch radius="lg" label="Large (12px)" />
            <RadiusSwatch radius="xl" label="XL (16px)" />
            <RadiusSwatch radius="2xl" label="2XL (24px)" />
            <RadiusSwatch radius="full" label="Full (9999px)" />
          </div>
        </section>
      </Container>
    </div>
  )
}

function ColorSwatch({ color, label, value }: { color: string; label: string; value: string }) {
  return (
    <div className="space-y-2">
      <div className={`h-24 rounded-xl bg-${color} shadow-soft border border-border`} />
      <div className="text-sm">
        <p className="font-medium text-text">{label}</p>
        <p className="text-muted font-mono text-xs">{value}</p>
      </div>
    </div>
  )
}

function RadiusSwatch({ radius, label }: { radius: string; label: string }) {
  return (
    <div className="space-y-2">
      <div className={`h-24 rounded-${radius} bg-primary shadow-soft`} />
      <p className="text-sm text-text">{label}</p>
    </div>
  )
}
