# Quick Start: Higgsfield Design System

## 🎨 The One Color Rule

**Primary brand color**: `#d1fe17` (lime green)

Use it for:

- Primary action buttons
- Active states
- Brand highlights
- Icons and accents

## 🎯 Quick Component Patterns

### Buttons

```tsx
// Primary action (lime bg, black text)
<button className="bg-primary text-black hover:bg-white px-6 py-3 rounded-xl font-semibold">
  Get Started
</button>

// Secondary (glass effect)
<button className="glass px-6 py-3 rounded-xl">
  Learn More
</button>

// Or use the Button component
import { Button } from '@/components/design/Button'

<Button variant="primary" size="lg">Get Started</Button>
<Button variant="glass" size="md">Learn More</Button>
```

### Cards

```tsx
// Glass card with hover glow
;<div className="glass rounded-2xl p-6 hover:shadow-glow-primary transition-all">
  <h3 className="text-lg font-semibold">Card Title</h3>
  <p className="text-muted">Card content</p>
</div>

// Or use GlowCard component
import { GlowCard } from '@/components/design/GlowCard'

;<GlowCard hoverGlow title="Card Title" subtitle="Card content" />
```

### Badges

```tsx
// Lime badge
;<span className="bg-primary/20 text-primary border border-primary/30 px-3 py-1 rounded-xl text-xs uppercase font-semibold">
  New
</span>

// Or use Badge component
import { Badge } from '@/components/design/Badge'

;<Badge tone="primary">New</Badge>
```

### Text

```tsx
// Gradient headline (lime to white)
<h1 className="title-gradient display-lg">
  Your Headline
</h1>

// Eyebrow text (small lime label)
<div className="eyebrow">Welcome</div>

// Muted text
<p className="text-muted">Secondary text</p>

// Regular text
<p className="text-text">Primary text</p>
```

## 🎨 Essential Tailwind Classes

### Colors

```
bg-primary     → Lime green (#d1fe17)
bg-surface     → Elevated surface (#131313)
bg-bg          → Page background (#0b0b0b)
text-black     → Black text (use on lime backgrounds)
text-text      → White text (90% opacity)
text-muted     → Gray text (#717684)
border-border  → Subtle border (white 10%)
```

### Effects

```
glass                  → Glass morphism effect
shadow-glow-primary    → Lime glow shadow
title-gradient         → Lime to white gradient text
ring-focus             → Lime focus ring
grain                  → Subtle noise texture
```

### Spacing & Layout

```
rounded-xl    → 16px radius
rounded-2xl   → 24px radius
rounded-3xl   → 28px radius
container-custom → Max-width container with padding
```

## 🚦 Common Patterns

### Active/Selected State

```tsx
<button
  className={`
  px-4 py-2 rounded-xl transition-all
  ${
    isActive
      ? 'bg-primary/20 text-primary border border-primary/30'
      : 'glass text-muted hover:text-text'
  }
`}
>
  {label}
</button>
```

### Hover Effect

```tsx
<div className="glass rounded-2xl p-6 transition-all hover:shadow-glow-primary hover:-translate-y-1">
  Content
</div>
```

### Icon with Lime Background

```tsx
<div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
  <Icon className="w-5 h-5 text-black" />
</div>
```

## ⚡ Pro Tips

1. **Always use black text on lime backgrounds**

   ```tsx
   ✅ className="bg-primary text-black"
   ❌ className="bg-primary text-white"
   ```

2. **Lime buttons hover to white**

   ```tsx
   ✅ className="bg-primary hover:bg-white"
   ❌ className="bg-primary hover:bg-primary/80"
   ```

3. **Use glass for secondary surfaces**

   ```tsx
   ✅ className="glass" // Subtle translucency
   ❌ className="bg-white/10" // Too manual
   ```

4. **Glow on hover, not always**

   ```tsx
   ✅ className="hover:shadow-glow-primary"
   ❌ className="shadow-glow-primary" // Can be overwhelming
   ```

5. **Border-less by default, use borders sparingly**
   ```tsx
   ✅ className="glass" // Has subtle border
   ✅ className="border border-border" // Explicit border
   ```

## 🎬 Animation

```tsx
// Framer Motion variants
import { fadeUp } from '@/lib/motion'

<motion.div variants={fadeUp}>
  Animated content
</motion.div>

// Or inline
<motion.button
  whileHover={{ scale: 1.02 }}
  whileTap={{ scale: 0.98 }}
>
  Button
</motion.button>
```

## 🔗 Need More?

- **Full tokens**: See `src/globals.css`
- **Components**: Browse `src/components/design/`
- **Examples**: Check `/styleguide` and `/components` routes
- **Full guide**: Read `HIGGSFIELD_DESIGN.md`

---

**Remember**: When in doubt, make it **dark**, add **lime**, use **glass**. 🟢✨
