# Luma Design Language v2.0

> This document is the single source of truth for the visual and interaction design of Luma.
>
> Every UI implementation must follow this document before referencing any external inspiration.
>
> The design analyses inside `.claude/` are references.
> This document is the product standard.

---

# Vision

Luma is an AI-powered Personal Operating System.

It should never feel like:

* a finance app
* an admin dashboard
* an enterprise SaaS product
* a chatbot

It should feel like a quiet place where users can understand their life.

The interface should reduce stress instead of creating it.

---

# Core Philosophy

Luma is designed around three experiences.

Capture

↓

Today

↓

Timeline

Everything else exists to support these experiences.

Users should think about their life.

Never about modules.

---

# Design System Implementation

Luma uses a comprehensive design token system implemented in `app/globals.css` with semantic naming for colors, typography, spacing, and motion.

## Color System

### Semantic Color Tokens

**Surface Colors:**
- `--color-background`: Base page background
- `--color-surface`: Elevated surfaces
- `--color-card`: Card backgrounds
- `--color-muted-surface`: Secondary surfaces
- `--color-border`: Border colors

**Typography Colors:**
- `--color-text-primary`: Primary text
- `--color-text-secondary`: Secondary text
- `--color-text-muted`: Muted/disabled text

**Semantic Colors:**
- `--color-accent`: Primary action color
- `--color-accent-foreground`: Text on accent
- `--color-success`: Success states
- `--color-warning`: Warning states
- `--color-danger`: Error states

**Color Philosophy:**
- Uses OKLCH color space for perceptual uniformity
- No pure black (#000000) or pure white (#ffffff)
- Warm neutral palette for light mode
- Soft charcoal for dark mode (not pure black)
- Material-based naming (Paper, Linen, Mist, Fog, Stone, Graphite)

## Typography Scale

### Font Families
- **Display/Body**: Geist Sans (system-ui fallback)
- **Financial Values**: Geist Mono (monospace for numbers)

### Typography Hierarchy

| Class | Size | Weight | Line Height | Letter Spacing | Use |
|-------|------|--------|-------------|----------------|-----|
| `.text-display` | 2.5rem | 600 | - | -0.02em | Page titles, hero text |
| `.text-heading` | 1.5rem | 600 | - | -0.01em | Section headings |
| `.text-title` | 1.125rem | 500 | - | - | Card titles, subheadings |
| `.text-body` | 0.875rem | 400 | 1.6 | - | Body text, paragraphs |
| `.text-caption` | 0.75rem | 400 | 1.4 | - | Captions, metadata |
| `.text-label` | 0.75rem | 500 | - | 0.05em uppercase | Labels, badges |

### Financial Values
- `.text-financial-lg`: 1.75rem, mono, weight 600, tracking -0.02em
- `.text-financial-xl`: 2.25rem, mono, weight 600, tracking -0.02em

## Spacing System

**Base Unit:** 8px

**Scale:**
- 0, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96px

**Utilities:**
- `space-y-1` through `space-y-8` using CSS variables
- Consistent vertical rhythm throughout the interface

## Border Radius Scale

- `--radius-sm`: 8px
- `--radius-md`: 12px
- `--radius-lg`: 16px
- `--radius-xl`: 20px
- `--radius-2xl`: 24px
- `--radius-3xl`: 32px
- `--radius-full`: 9999px

## Motion System

### Durations
- `--motion-instant`: 100ms
- `--motion-fast`: 150ms
- `--motion-normal`: 200ms
- `--motion-slow`: 300ms
- `--motion-slower`: 400ms

### Easing Functions
- `--ease-default`: cubic-bezier(0.4, 0, 0.2, 1)
- `--ease-in`: cubic-bezier(0.4, 0, 1, 1)
- `--ease-out`: cubic-bezier(0, 0, 0.2, 1)
- `--ease-bounce`: custom bounce curve

### Motion Utilities
- `.motion-fast`: 150ms duration, ease-out
- `.motion-ease-out`: ease-out timing function
- `.motion-bounce`: bounce animation
- `.motion-safe`: respects `prefers-reduced-motion`

## Glass Effects

**Glass:**
- 80% background opacity
- 20px backdrop blur

**Glass-Strong:**
- 90% background opacity
- 24px backdrop blur

Used for navigation dock, overlays, and floating elements.

## Elevation System

**Levels:**
- `elevation-subtle`: Minimal shadow for cards
- `elevation-medium`: Moderate shadow for elevated elements
- `elevation-card-hover`: Lift effect on card hover

Shadows are subtle and functional, never decorative.

## Component Design Principles

### Cards
- Subtle elevation with `elevation-subtle`
- Reduced border opacity (border/50)
- Increased padding (p-5 = 20px)
- Typography classes for hierarchy
- Motion utilities for smooth transitions

### Buttons
- Increased touch targets (h-9 default = 36px)
- Accent color for primary actions
- Motion utilities for interactions
- Focus ring indicators for accessibility

### Inputs
- Increased height (h-9 = 36px)
- Reduced border opacity
- Surface background in dark mode
- Focus ring indicators
- Motion utilities for state changes

### Navigation
- Glass effect with backdrop blur
- Subtle elevation
- Smooth animations
- Active indicators with bounce animation
- 48px minimum touch targets

### Empty States
- Increased spacing (py-16 = 64px)
- Typography classes for hierarchy
- Intentional guidance messaging
- Centered layout

---

# Accessibility

Luma is designed to be accessible to all users.

## Visual Accessibility
- Enhanced color contrast ratios for text and interactive elements
- Focus ring indicators on all interactive elements
- Reduced motion support via `.motion-safe` class
- Semantic color distinction for success, warning, danger states

## Keyboard Navigation
- All interactive elements are keyboard accessible
- Clear focus states for keyboard users
- Logical tab order throughout the interface

## Screen Reader Support
- Semantic HTML structure
- Proper ARIA labels where needed
- Descriptive alt text for images

---

# Responsive Design

Luma is designed to work seamlessly across devices.

## Breakpoints
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## Touch Targets
- Minimum 44px for interactive elements
- 48px for primary actions
- Generous spacing for touch interfaces

## Layout Adaptation
- Single column on mobile
- Multi-column grids on tablet and desktop
- Navigation adapts to available space

---

# Implementation Guidelines

## CSS Architecture
- Design tokens defined in `app/globals.css`
- Utility-first approach with Tailwind CSS
- Component-specific styles in component files
- Motion utilities for consistent animations

## Component Structure
- Reusable UI components in `components/ui/`
- Feature-specific components in `components/`
- Module-specific components in `modules/*/components/`

## File Organization
```
app/                    # Next.js app directory
  globals.css          # Design tokens and global styles
  layout.tsx           # Root layout
  page.tsx             # Home page (redirects to /today)
components/            # Shared components
  ui/                  # Base UI components
modules/               # Feature modules
lib/                   # Utility functions
types/                 # TypeScript type definitions
```

---

# Design Principles

## 1. Information First
Every visual element must support understanding. Decoration is secondary.

## 2. Whitespace is a Feature
Never fill space simply because it exists. Generous spacing creates calm.

## 3. Only One Primary Action
Every screen should clearly communicate "What matters most?"

## 4. Content is the Hero
Chrome should disappear. Cards support information, they are not the information.

## 5. Motion Explains
Animation is functional, never decorative. Use it to confirm actions and explain transitions.

## 6. Comfort Over Density
Users should never feel overwhelmed. Generous spacing and readable typography.

---

# Emotional Design

Every screen should evoke these emotions.

Primary

* Calm
* Warm
* Safe
* Focused

Secondary

* Personal
* Cozy
* Trustworthy
* Intentional

Never optimize for:

* futuristic
* flashy
* corporate
* technical
* AI-looking

---

# Design Principles

## 1.

Information first.

Decoration second.

Every visual element must support understanding.

---

## 2.

Whitespace is a feature.

Never fill space simply because it exists.

---

## 3.

Only one primary action.

Every screen should clearly communicate:

"What matters most?"

---

## 4.

Content is the hero.

Chrome should disappear.

Cards support information.

They are not the information.

---

## 5.

Motion explains.

Animation is functional.

Never decorative.

---

## 6.

Comfort over density.

Users should never feel overwhelmed.

---

# Inspiration Mapping

Apple

* hierarchy
* typography
* whitespace
* motion

Linear

* productivity
* information hierarchy
* cards
* responsiveness

Raycast

* capture
* search
* keyboard workflows
* overlays

Claude

* warmth
* conversational UI
* editorial spacing

Notion

* calmness
* readability
* content-first layouts

Airtable

* organization
* structured information
* data presentation

Do not imitate any of these products.

Combine them into one cohesive system.

---

# Color Philosophy

Colors represent materials.

Never generic UI colors.

Preferred naming:

* Paper
* Linen
* Mist
* Fog
* Stone
* Graphite
* Midnight
* Sage
* Clay
* Amber
* Indigo

Avoid:

Gray 100

Gray 200

Blue 500

Green 600

---

# Surface Philosophy

Background

Warm.

Soft.

Invisible.

Cards

Gentle separation.

Not floating aggressively.

Navigation

Subtle.

Present.

Never dominant.

Dialogs

Comfortable.

Not alarming.

---

# Typography

Typography creates hierarchy.

Not size.

Rules:

* Display text is rare.
* Headlines are confident.
* Body text is highly readable.
* Numbers receive visual emphasis.
* Captions remain quiet.

Avoid excessive font weights.

---

# Spacing

Whitespace creates rhythm.

Use an 8px spacing system.

Never use arbitrary values.

Large spacing is encouraged.

Crowded interfaces are prohibited.

---

# Corners

Soft.

Human.

Avoid sharp edges.

Avoid exaggerated rounding.

Everything should feel consistent.

---

# Shadows

Subtle.

Used only to clarify elevation.

Never dramatic.

Never decorative.

---

# Borders

Borders are a last resort.

Prefer:

* spacing
* contrast
* typography

over boxes.

---

# Cards

Cards exist to group information.

Not to decorate the interface.

Every card should answer:

Why does this information belong together?

---

# Navigation

Navigation should disappear.

Users should think about their life.

Not where features are located.

Primary experiences:

* Today
* Capture
* Timeline

Search and Profile remain utilities.

---

# Capture

Capture is sacred.

Users should never think about:

* categories
* destinations
* modules

Capture first.

Organize later.

---

# Today

Today is not a dashboard.

It is a daily briefing.

Every section should answer:

What matters right now?

---

# Timeline

Timeline is memory.

Everything meaningful appears here.

It should read like a story.

Not an activity log.

---

# Search

Search finds everything.

Not just transactions.

Everything becomes searchable.

---

# AI

AI should feel invisible.

Never expose complexity.

Users should receive:

* insights
* recommendations
* summaries

before asking questions.

Chat is secondary.

---

# Empty States

Empty does not mean blank.

Every empty state should:

* educate
* encourage
* guide

Never display dead space.

---

# Motion

Motion communicates.

Use animation to:

* confirm actions
* explain transitions
* preserve context

Never animate for decoration.

---

# Accessibility

Readable.

Comfortable.

Inclusive.

Accessibility is part of the design.

Not an enhancement.

---

# Performance

Perceived speed matters.

Interfaces should feel immediate.

Avoid unnecessary loading states.

Prefer optimistic interactions.

---

# Naming

Avoid generic software terminology.

Prefer language that feels human.

Examples

Dashboard → Today

Widget → Section

Activity Feed → Timeline

Quick Add → Capture

Notification → Nudge

Card → Panel (when appropriate)

---

# Implementation Rules

Every implementation must:

* preserve visual consistency
* reuse components
* respect spacing
* respect typography
* avoid unnecessary complexity

Never introduce one-off visual patterns.

---

# Definition of Done

A feature is complete only when:

* functionality is correct
* interaction feels natural
* visual language remains consistent
* accessibility is maintained
* performance remains smooth
* the implementation feels unmistakably like Luma

---

# Final Principle

When making any design decision ask:

"Does this make the user feel calmer?"

If the answer is no,

it does not belong in Luma.
