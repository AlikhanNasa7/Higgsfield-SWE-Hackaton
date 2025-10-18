# Higgsfield-Inspired Design System

This application uses a design system inspired by [Higgsfield.ai](https://higgsfield.ai/), featuring their signature **lime green (#d1fe17)** accent on a dark, cinematic background.

## 🎨 Design Tokens

### Core Colors

```css
--color-lime: #d1fe17 /* Primary brand color */ --color-black-1: #0b0b0b /* Page background */
  --color-black-2: #131313 /* Elevated surfaces */ --color-white-10: #ffffff1a /* Borders */
  --color-white-90: #ffffffe6 /* Primary text */ --color-gray-8: #717684 /* Muted text */;
```

### Color System

The design uses Higgsfield's precise opacity scale for whites and blacks:

- **White opacity**: 1, 4, 5, 6, 8, 10, 14, 18, 24, 32, 40, 46, 50, 60, 70, 80, 90
- **Black opacity**: 0, 20, 24, 30, 50, 60, 70, 90

### Semantic Colors

```css
--color-success: #26bd6c /* Green */ --color-warning: #f48e2f /* Orange */ --color-danger: #e6483d
  /* Red */ --color-info: #4778f5 /* Blue */;
```

## 🎭 Visual Style

### Key Characteristics

1. **Dark Theme First**: Deep black backgrounds (#0b0b0b)
2. **Lime Accent**: Vibrant lime green (#d1fe17) for CTAs and highlights
3. **Glass Morphism**: Subtle transparency with `backdrop-blur`
4. **Glow Effects**: Lime-colored shadows and glows on interactive elements
5. **High Contrast**: White/lime text on black backgrounds for readability

### Typography

- **Font**: Inter (via Google Fonts)
- **Display sizes**: 72px / 64px / 48px (tight line-height)
- **Headline sizes**: 36px / 30px
- **Body sizes**: 18px / 16px (1.6 line-height)
- **Letter spacing**: Tight for headlines, normal for body

### Effects

- **Glass**: `bg-white/5 backdrop-blur-md border border-white/10`
- **Glow**: `0 0 32px rgba(209, 254, 23, 0.3)` (lime with 30% opacity)
- **Shadows**: Soft ambient shadows for depth
- **Grain**: Subtle noise overlay for texture

### Border Radius

- `md`: 8px
- `lg`: 12px
- `xl`: 16px
- `2xl`: 24px
- `3xl`: 28px

## 🧩 Components

### Button

**Primary**: Lime green background (#d1fe17), black text, lime glow shadow

- Hover: Transitions to white background
- Active: Slightly darker lime

**Secondary**: Surface background with subtle border

- Hover: Border becomes lime-tinted

**Glass**: Translucent with backdrop blur

- Hover: Increased opacity

### Badge

Used for tags, labels, and status indicators with rounded corners and small uppercase text.

**Tones**: primary (lime), accent (blue), neutral, success, warning, error
**Variants**: solid (filled), outline (transparent)

### Cards (GlowCard)

- Glass effect by default
- Hover: Lime glow shadow appears
- Supports media slots, titles, and CTAs
- Rounded corners (xl/2xl)

### Navigation

**TopNav**: Sticky header with glass effect on scroll

- Logo with lime accent
- Translucent background when scrolled
- Lime CTA button

**Footer**: Minimal, centered, muted text

## 🎬 Motion & Interactions

### Transitions

- **Fade up**: `opacity 0→1, y 20→0` over 300-400ms
- **Stagger**: Children animate sequentially with 100ms delay
- **Hover lift**: `translateY(-2px)` with glow increase
- **Button press**: `scale(0.98)` on tap

### Accessibility

- `prefers-reduced-motion` respected throughout
- All animations can be disabled
- High contrast ratios (AAA)
- Visible focus rings (lime colored)

## 🚀 Usage

### Tailwind Classes

```tsx
// Primary button style
className = 'bg-primary text-black hover:bg-white'

// Glass effect
className = 'glass'

// Gradient text (lime to white)
className = 'title-gradient'

// Glow effect
className = 'shadow-glow-primary'

// Focus ring
className = 'ring-focus'
```

### Component Examples

```tsx
// Primary action button
<Button variant="primary" size="lg">
  Get Started
</Button>

// Glass button
<Button variant="glass" size="md">
  Learn More
</Button>

// Badge
<Badge tone="primary" variant="solid">
  New
</Badge>

// Glow card with hover effect
<GlowCard
  hoverGlow
  title="Feature Name"
  subtitle="Description"
/>
```

## 📐 Layout

### Container Widths

- Default: 1280px
- XL: 1440px
- Padding: 1.5rem mobile, 2.5rem desktop

### Vertical Rhythm

- Section spacing: 80px / 64px / 48px
- Consistent padding within components

### Grid System

- 12 columns on desktop
- 6 columns on tablet
- 4 columns on mobile
- Auto-fit utilities for responsive card grids

## 🎯 Key Differences from Generic Dark Theme

1. **Specific lime green** (#d1fe17) instead of purple/blue/cyan
2. **Precise opacity scales** matching Higgsfield's system
3. **Black text on lime buttons** (not white)
4. **Hover transition to white** on primary buttons
5. **Subtle glass effects** everywhere
6. **Lime-colored glow shadows** on interactive elements

## 📦 Files

- `src/globals.css` - All design tokens and utility classes
- `tailwind.config.ts` - Tailwind theme configuration
- `src/components/design/` - Reusable UI components
- `src/lib/motion.ts` - Motion utilities and variants

## 🔗 Reference

Inspired by: [https://higgsfield.ai/](https://higgsfield.ai/)

The design captures Higgsfield's cinematic, high-impact aesthetic with their signature lime green accent creating a bold, modern experience.
