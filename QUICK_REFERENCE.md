# Quick Reference Card

## 🎨 Import Components

```tsx
import {
  Button,
  Badge,
  GlowCard,
  MediaFrame,
  Container,
  SectionHeader,
  TopNav,
  Footer,
} from '@/components/design'
```

## 🔥 Common Patterns

### Hero Section

```tsx
<section className="min-h-screen flex items-center justify-center grain gradient-radial-dual">
  <Container size="lg">
    <div className="text-center space-y-8">
      <div className="eyebrow">Welcome</div>
      <h1 className="display-lg title-gradient">Your Title</h1>
      <p className="body-lg text-muted">Description</p>
      <Button variant="primary" size="lg">
        Get Started
      </Button>
    </div>
  </Container>
</section>
```

### Card Grid

```tsx
<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
  {items.map(item => (
    <GlowCard key={item.id} title={item.title} subtitle={item.description} hoverGlow />
  ))}
</div>
```

### Animated Section

```tsx
import { motion } from 'framer-motion'
import { fadeUp, stagger } from '@/lib/motion'

;<motion.div
  variants={stagger(0, 0.1)}
  initial="initial"
  whileInView="animate"
  viewport={{ once: true }}
>
  {items.map(item => (
    <motion.div key={item.id} variants={fadeUp}>
      {item.content}
    </motion.div>
  ))}
</motion.div>
```

## 🎯 Utility Classes

| Class                      | Effect                         |
| -------------------------- | ------------------------------ |
| `.glass`                   | Backdrop blur + translucent bg |
| `.title-gradient`          | Violet → cyan gradient text    |
| `.eyebrow`                 | Small uppercase label          |
| `.ring-focus`              | Accessible focus ring          |
| `.glow-primary`            | Violet glow effect             |
| `.grain`                   | Subtle noise texture           |
| `.gradient-radial-primary` | Radial gradient backdrop       |
| `.hover-lift`              | Lift on hover                  |
| `.display-lg`              | 72px hero text                 |
| `.headline-lg`             | 36px section title             |
| `.body-lg`                 | 18px body text                 |

## 🎨 Color Classes

```css
bg-bg          /* #0B0B0F - Background */
bg-surface     /* #111319 - Cards */
bg-primary     /* #8B5CF6 - Violet */
bg-accent      /* #22D3EE - Cyan */
text-text      /* #E6E8EE - Primary text */
text-muted     /* #9AA3AF - Secondary text */
border-border  /* #262938 - Borders */
```

## 📐 Spacing Scale

```
gap-2  = 8px
gap-4  = 16px
gap-6  = 24px
gap-8  = 32px
p-4    = 16px
p-6    = 24px
p-8    = 32px
```

## 🎬 Framer Motion Presets

```tsx
import {
  fadeUp,
  fadeIn,
  scale,
  stagger,
  hoverLift,
  hoverScale,
  press,
} from '@/lib/motion'

// Fade up on enter
<motion.div variants={fadeUp} />

// Stagger children
<motion.div variants={stagger(0, 0.1)} />

// Hover lift
<motion.div variants={hoverLift} whileHover="hover" />

// Press effect
<motion.button whileTap={press} />
```

## 🔧 Component Props Cheatsheet

### Button

```tsx
<Button
  variant="primary | secondary | glass | ghost | link"
  size="sm | md | lg"
  fullWidth={boolean}
/>
```

### Badge

```tsx
<Badge tone="primary | accent | neutral | success | warning | error" variant="solid | outline" />
```

### GlowCard

```tsx
<GlowCard
  title={string}
  subtitle={string}
  media={ReactNode}
  cta={ReactNode}
  hoverGlow={boolean}
  as="div | a | article"
/>
```

### MediaFrame

```tsx
<MediaFrame
  ratio="16:9 | 1:1 | 9:16 | 4:3 | 21:9"
  imageSrc={string}
  videoSrc={string}
  glow={boolean}
  parallax={boolean}
  parallaxStrength={8 | 12 | 16}
/>
```

### Container

```tsx
<Container
  size="lg | xl" // 1280px | 1440px
  pad="none | sm | md | lg"
/>
```

### SectionHeader

```tsx
<SectionHeader
  eyebrow={string}
  title={string}
  subtitle={string}
  gradient={boolean}
  align="left | center"
/>
```

## 🚀 Quick Start New Section

```tsx
import { Container, SectionHeader, GlowCard } from '@/components/design'

export function MySection() {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background effect */}
      <div className="absolute inset-0 gradient-radial-primary opacity-50" />

      <Container size="lg">
        <SectionHeader
          eyebrow="Features"
          title="Section Title"
          subtitle="Description goes here"
          gradient
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">{/* Your content */}</div>
      </Container>
    </section>
  )
}
```

## 📱 Responsive Breakpoints

```
sm:  640px
md:  768px
lg:  1024px
xl:  1280px
2xl: 1536px
```

## ⚡ Performance Tips

1. Use `loading="lazy"` for images below fold
2. Wrap motion components in `viewport={{ once: true }}`
3. Use `useReducedMotion()` for animation-heavy features
4. Optimize images: WebP format, appropriate sizes
5. Use `aspect-ratio` CSS for media containers

## 🎯 Accessibility Checklist

- [ ] All buttons have visible focus rings
- [ ] Images have alt text
- [ ] Headings are in logical order
- [ ] Interactive elements are keyboard accessible
- [ ] Color contrast meets WCAG AA (4.5:1)
- [ ] Animations respect `prefers-reduced-motion`

## 📚 Documentation

- Full docs: `DESIGN_SYSTEM.md`
- Component showcase: `http://localhost:3000/components`
- Styleguide: `http://localhost:3000/styleguide`
