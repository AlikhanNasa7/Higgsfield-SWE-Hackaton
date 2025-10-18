# Cinematic Design System

A modern, high-contrast design system for Next.js applications, inspired by cinematic aesthetics and cutting-edge UI design.

## 🎨 Overview

This design system provides a comprehensive set of visual components, tokens, and patterns for building beautiful, accessible, and performant web interfaces. Built with Next.js 15, React 18, TypeScript, Tailwind CSS v4, and Framer Motion.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# View the design system
open http://localhost:3000
```

## 📁 Structure

```
src/
├── components/
│   ├── design/           # Core design components
│   │   ├── Button.tsx
│   │   ├── Badge.tsx
│   │   ├── GlowCard.tsx
│   │   ├── MediaFrame.tsx
│   │   ├── Container.tsx
│   │   ├── SectionHeader.tsx
│   │   ├── TopNav.tsx
│   │   └── Footer.tsx
│   └── sections/         # Page sections
│       ├── HeroCinematic.tsx
│       ├── CapabilitiesGrid.tsx
│       ├── Steps.tsx
│       ├── GalleryGrid.tsx
│       └── CTASection.tsx
├── lib/
│   └── motion.ts         # Framer Motion utilities
├── app/
│   └── (design)/         # Design system routes
│       ├── page.tsx      # Landing page
│       ├── styleguide/   # Design tokens
│       └── components/   # Component showcase
└── globals.css           # Design tokens & utilities
```

## 🎯 Design Tokens

### Colors

```css
--bg: #0b0b0f /* Page background */ --surface: #111319 /* Cards/sections */ --border: #262938
  /* Borders */ --muted: #9aa3af /* Secondary text */ --text: #e6e8ee /* Primary text */
  --primary: #8b5cf6 /* Violet */ --accent: #22d3ee /* Cyan */;
```

### Typography Scale

| Size        | CSS Class      | Font Size | Usage            |
| ----------- | -------------- | --------- | ---------------- |
| Display LG  | `.display-lg`  | 72px      | Hero headlines   |
| Display MD  | `.display-md`  | 64px      | Major sections   |
| Display SM  | `.display-sm`  | 48px      | Section titles   |
| Headline LG | `.headline-lg` | 36px      | Card titles      |
| Headline MD | `.headline-md` | 30px      | Subsections      |
| Body LG     | `.body-lg`     | 18px      | Intro paragraphs |
| Body        | -              | 16px      | Regular text     |
| Caption     | -              | 12px      | Labels, metadata |

### Spacing

```
Section: 80px / 64px (mobile)
Container: 40px / 24px (mobile)
Card padding: 24px
Button padding: 16px 24px (md)
```

### Border Radius

```
sm: 6px
md: 8px
lg: 12px
xl: 16px
2xl: 24px
full: 9999px
```

### Shadows

```css
--shadow-soft: subtle ambient shadow --shadow-elevated: soft elevation --shadow-glow-primary: violet
  glow --shadow-glow-accent: cyan glow;
```

## 🧩 Components

### Button

Flexible button component with multiple variants.

```tsx
import { Button } from '@/components/design'

<Button variant="primary" size="lg">
  Get Started
</Button>

<Button variant="secondary">Learn More</Button>
<Button variant="glass">Glass Effect</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link Style</Button>
```

**Props:**

- `variant`: `'primary' | 'secondary' | 'glass' | 'ghost' | 'link'`
- `size`: `'sm' | 'md' | 'lg'`
- `fullWidth`: `boolean`

### Badge

Small labels for tags and status indicators.

```tsx
import { Badge } from '@/components/design'

<Badge tone="primary">New</Badge>
<Badge tone="accent" variant="outline">Beta</Badge>
<Badge tone="success">Active</Badge>
```

**Props:**

- `tone`: `'primary' | 'accent' | 'neutral' | 'success' | 'warning' | 'error'`
- `variant`: `'solid' | 'outline'`

### GlowCard

Elevated cards with glass morphism and hover effects.

```tsx
import { GlowCard } from '@/components/design'

;<GlowCard
  title="Card Title"
  subtitle="Description text"
  hoverGlow
  cta={<Button size="sm">Learn More</Button>}
/>
```

**Props:**

- `title`: `string`
- `subtitle`: `string`
- `media`: `ReactNode` - Optional media content
- `cta`: `ReactNode` - Call to action
- `hoverGlow`: `boolean` - Enable glow effect on hover
- `as`: `'div' | 'a' | 'article'`

### MediaFrame

Responsive containers for images and videos.

```tsx
import { MediaFrame } from '@/components/design'

;<MediaFrame ratio="16:9" imageSrc="/image.jpg" glow parallax parallaxStrength={12} />
```

**Props:**

- `ratio`: `'16:9' | '1:1' | '9:16' | '4:3' | '21:9'`
- `glow`: `boolean` - Add glow effect
- `parallax`: `boolean` - Enable parallax scroll
- `parallaxStrength`: `8 | 12 | 16`

### Container

Responsive content containers.

```tsx
import { Container } from '@/components/design'

;<Container size="lg" pad="md">
  {children}
</Container>
```

**Props:**

- `size`: `'lg' | 'xl'` - Max width (1280px / 1440px)
- `pad`: `'none' | 'sm' | 'md' | 'lg'` - Horizontal padding

### SectionHeader

Pre-styled section headers with animations.

```tsx
import { SectionHeader } from '@/components/design'

;<SectionHeader
  eyebrow="Welcome"
  title="Section Title"
  subtitle="Description text"
  gradient
  align="center"
/>
```

**Props:**

- `eyebrow`: `string` - Small label above title
- `title`: `string` - Main heading
- `subtitle`: `string` - Description
- `gradient`: `boolean` - Apply gradient to title
- `align`: `'left' | 'center'`

### TopNav

Sticky navigation with glass morphism effect.

```tsx
import { TopNav } from '@/components/design'

;<TopNav sticky compact />
```

### Footer

Minimal or full footer with links.

```tsx
import { Footer } from '@/components/design'

;<Footer minimal />
```

## 🎭 Utility Classes

### Glass Effect

```html
<div class="glass">
  <!-- Translucent with backdrop blur -->
</div>
```

### Gradient Text

```html
<h1 class="title-gradient">Gradient Text</h1>
```

### Focus Ring

```html
<button class="ring-focus">Accessible Focus</button>
```

### Glow Effects

```html
<div class="glow-primary">Primary Glow</div>
<div class="glow-accent">Accent Glow</div>
```

### Gradient Backdrops

```html
<section class="gradient-radial-primary">
  <!-- Radial gradient background -->
</section>

<section class="gradient-radial-dual">
  <!-- Dual gradient (primary + accent) -->
</section>
```

### Grain Texture

```html
<div class="grain">
  <!-- Subtle noise overlay -->
</div>
```

### Hover Effects

```html
<div class="hover-lift">
  <!-- Lifts on hover -->
</div>
```

## 🎬 Animations

All animations use Framer Motion with reduced motion support.

### Fade Up

```tsx
import { motion } from 'framer-motion'
import { fadeUp } from '@/lib/motion'

;<motion.div variants={fadeUp} initial="initial" animate="animate">
  Content
</motion.div>
```

### Stagger Children

```tsx
import { stagger } from '@/lib/motion'

;<motion.div variants={stagger(0, 0.1)}>
  {items.map(item => (
    <motion.div key={item.id} variants={fadeUp}>
      {item.content}
    </motion.div>
  ))}
</motion.div>
```

### Hover & Press

```tsx
import { hoverLift, press } from '@/lib/motion'

;<motion.button variants={hoverLift} whileHover="hover" whileTap={press}>
  Click Me
</motion.button>
```

## ♿ Accessibility

- **WCAG 2.1 AA Compliant**: High contrast ratios
- **Keyboard Navigation**: Full keyboard support
- **Focus Indicators**: Visible focus rings on all interactive elements
- **Screen Readers**: Semantic HTML and ARIA labels
- **Reduced Motion**: Respects `prefers-reduced-motion`

## 🌙 Theming

Toggle between dark and light themes:

```tsx
// Theme toggle is built into TopNav
// Or use programmatically:
document.documentElement.setAttribute('data-theme', 'light')
```

## 📱 Responsive Design

- Mobile-first approach
- Breakpoints: `sm: 640px`, `md: 768px`, `lg: 1024px`, `xl: 1280px`
- Flexible grid system with `grid-auto-fit`

## 🎨 Pages

### Landing Page (`/`)

- Hero section with gradient backdrop
- Capabilities grid (6 cards)
- Three-step process
- Gallery grid with hover overlays
- CTA section

### Styleguide (`/styleguide`)

- All design tokens
- Typography scale
- Color palette
- Component variations
- Spacing and radius swatches

### Components (`/components`)

- Interactive component demos
- Live property controls
- Copy-paste code examples

## 🛠️ Development

```bash
# Run dev server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## 📦 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS v4
- **Animation**: Framer Motion
- **Icons**: Lucide React (optional)

## 🎯 Best Practices

1. **Use Semantic HTML**: Always use appropriate HTML elements
2. **Add Alt Text**: All images must have descriptive alt text
3. **Test Keyboard Nav**: Ensure all interactions work with keyboard
4. **Check Contrast**: Maintain WCAG AA contrast ratios
5. **Optimize Images**: Use WebP format and lazy loading
6. **Test Reduced Motion**: Disable animations for users who prefer it

## 📄 License

MIT License - Use freely in your projects

## 🤝 Contributing

This is a visual design system showcase. No data fetching or business logic included.

---

Built with ❤️ using Next.js, Tailwind CSS, and Framer Motion
