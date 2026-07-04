# Design Taste and Aesthetic Preferences

This document captures Luma's design taste, aesthetic preferences, and what makes the product feel like Luma.

## Core Aesthetic

Luma's aesthetic is defined by **calm premium minimalism**. The interface should feel like a quiet, thoughtful space where users can understand their life without feeling overwhelmed.

### Primary Adjectives

- **Calm**: Soft colors, generous whitespace, minimal visual noise
- **Warm**: Friendly, approachable, never cold or clinical
- **Safe**: Trustworthy, reliable, never experimental or risky
- **Focused**: Clear hierarchy, intentional design choices
- **Premium**: Refined details, subtle elevation, polished interactions
- **Intelligent**: Smart defaults, contextual relevance, AI-powered insights

### Anti-Patterns

Luma should never feel:
- **Futuristic**: Avoid sci-fi aesthetics, neon colors, or tech-forward visuals
- **Flashy**: No attention-grabbing animations, gradients, or decorative elements
- **Corporate**: Avoid enterprise SaaS patterns, dense dashboards, or complex UI
- **Technical**: No developer-focused aesthetics, code-heavy interfaces, or system metaphors
- **AI-looking**: Don't make AI the hero; keep it invisible and helpful

## Visual Hierarchy

### Information Density

**Prefer:**
- Generous whitespace between elements
- Single primary action per screen
- Clear visual hierarchy with size and color
- Progressive disclosure of complexity

**Avoid:**
- Dense information displays
- Multiple competing CTAs
- Flat hierarchies where everything looks equally important
- Overwhelming users with options

### Typography

**Prefer:**
- Large, confident headlines with tight tracking
- Readable body text with comfortable line height
- Monospace for financial values (creates visual focal points)
- Limited font weights (400, 500, 600 - avoid extremes)

**Avoid:**
- Excessive font weights (no 700+ for display)
- Wide letter-spacing on body text
- Multiple font families
- Decorative fonts or display faces for body text

## Color Philosophy

### Color Usage

**Prefer:**
- Warm, neutral palette with subtle tints
- Semantic colors for states (success, warning, danger)
- Single accent color for primary actions
- Material-inspired naming (Paper, Linen, Mist, Fog)

**Avoid:**
- Pure black (#000000) or pure white (#ffffff)
- Saturated or neon colors
- Multiple accent colors competing for attention
- Cool blues or clinical grays

### Dark Mode

**Prefer:**
- Soft charcoal instead of pure black
- Warm undertones in dark surfaces
- Maintained contrast ratios
- Consistent with light mode aesthetic

**Avoid:**
- Pure black backgrounds
- High-contrast dark mode
- Different aesthetic between light and dark
- Eye-straining dark surfaces

## Spacing and Layout

### Spacing Philosophy

**Prefer:**
- 8px base unit with consistent scale
- Generous padding and margins
- Vertical rhythm with consistent gaps
- Breathing room around content

**Avoid:**
- Arbitrary spacing values
- Tight, cramped layouts
- Inconsistent gaps between elements
- Filling space just because it exists

### Layout Patterns

**Prefer:**
- Single-column layouts on mobile
- Progressive disclosure of information
- Cards for grouping related content
- Clear visual separation between sections

**Avoid:**
- Multi-column layouts on small screens
- Information overload on single screens
- Nested containers without clear purpose
- Complex grid systems

## Motion and Interaction

### Animation Philosophy

**Prefer:**
- Subtle, purposeful animations
- Natural easing curves
- Fast transitions (150-200ms)
- Motion that explains state changes

**Avoid:**
- Decorative animations
- Slow or sluggish transitions
- Bouncy or cartoonish effects
- Motion that draws attention away from content

### Interaction Design

**Prefer:**
- Large touch targets (44px minimum)
- Clear feedback on interactions
- Smooth state transitions
- Keyboard-accessible interactions

**Avoid:**
- Small tap targets
- Unclear interaction states
- Jarring state changes
- Mouse-only interactions

## Component Design

### Cards

**Prefer:**
- Subtle elevation with soft shadows
- Reduced border opacity
- Generous internal padding
- Typography-based hierarchy

**Avoid:**
- Heavy shadows or dramatic elevation
- Strong borders
- Tight internal spacing
- Decoration without purpose

### Buttons

**Prefer:**
- Clear primary action with accent color
- Secondary actions with subtle styling
- Large touch targets
- Motion on interaction

**Avoid:**
- Multiple competing primary buttons
- Overly decorative button styles
- Small tap targets
- No interaction feedback

### Navigation

**Prefer:**
- Subtle, non-intrusive navigation
- Glass effects for floating elements
- Clear active states
- Smooth transitions

**Avoid:**
- Dominant navigation chrome
- Heavy navigation bars
- Unclear active states
- Jarring navigation transitions

## Content Presentation

### Data Display

**Prefer:**
- Financial values as visual focal points
- Progressive disclosure of details
- Contextual information based on relevance
- Clean, readable data presentation

**Avoid:**
- Dense data tables
- Overwhelming data displays
- All data shown at once
- Complex data visualizations

### Empty States

**Prefer:**
- Intentional guidance messaging
- Clear next steps
- Encouraging tone
- Centered, calm layout

**Avoid:**
- Dead space with no guidance
- Technical error messages
- Confusing next steps
- Overly dramatic empty states

## Accessibility

**Prefer:**
- High contrast ratios for text
- Clear focus indicators
- Keyboard navigation support
- Screen reader compatibility

**Avoid:**
- Low contrast text
- Invisible focus states
- Mouse-only interactions
- Unlabeled interactive elements

## Inspiration Sources

Luma draws inspiration from:

- **Apple**: Hierarchy, typography, whitespace, motion
- **Linear**: Productivity focus, information hierarchy, cards
- **Raycast**: Capture experience, keyboard workflows, overlays
- **Claude**: Warmth, conversational UI, editorial spacing
- **Notion**: Calmness, readability, content-first layouts
- **Airtable**: Organization, structured information, data presentation

**Important:** Luma synthesizes these influences into its own unique design language. It does not copy any single product.

## Quality Standards

### Code Quality

- Clean, maintainable code
- Consistent naming conventions
- Proper TypeScript types
- Component reusability

### Design Quality

- Pixel-perfect implementation
- Consistent spacing and typography
- Smooth animations
- Accessible interactions

### Performance

- Fast load times
- Smooth animations at 60fps
- Optimized images and assets
- Efficient rendering

## When in Doubt

When making design decisions, ask:

1. **Does this make the user feel calmer?** If no, it doesn't belong in Luma
2. **Is this the simplest solution?** Prefer simplicity over complexity
3. **Does this serve a clear purpose?** Every element should have a reason to exist
4. **Is this consistent with the design system?** Follow established patterns
5. **Will this age well?** Avoid trends and fads

## Red Flags

Watch out for these anti-patterns:

- Adding "just one more" feature or element
- Making things more complex than necessary
- Following trends instead of principles
- Copying other products without adaptation
- Prioritizing aesthetics over usability
- Ignoring accessibility considerations
- Breaking established patterns without good reason
