# Luma - AI-Powered Personal Operating System

## Project Vision

Luma is an AI-powered Personal Operating System designed to help users understand their life through calm, intelligent interfaces. It combines expense tracking, goal management, task organization, and AI-powered insights into a unified experience.

**Core Philosophy:** Understanding over tracking. Calm over complexity. Life is connected.

**Primary Experiences:** Capture → Today → Timeline

## Current Architecture

### Tech Stack

**Frontend:**
- Next.js 16 with App Router (Server Components by default)
- React 19
- TypeScript (strict mode)
- Tailwind CSS v4 with custom design tokens
- Zustand for client state
- Serwist for PWA

**Backend:**
- Supabase (PostgreSQL, Auth, Realtime, Storage)
- Groq SDK for AI features

**Design System:**
- OKLCH color space with semantic tokens
- Geist Sans and Geist Mono fonts
- 8px spacing system
- Motion system with reduced motion support
- Glass effects for navigation

### Module Architecture

Luma uses a modular architecture with feature-based organization:

```
modules/
├── accounts/              # Financial accounts
├── capture/               # Universal data capture
├── context/               # Context engine for relevance
├── daily-brief/           # Daily brief experience
├── finance/               # Financial tracking
├── goals/                 # Goal management
├── intelligence/          # AI-powered insights
├── life-graph/            # Life graph visualization
├── recurring-transactions/ # Recurring payments
├── rules/                 # Rules engine
├── search/                # Unified search
├── shared/                # Shared components
├── timeline/              # Activity timeline
└── today/                 # Today experience
```

### Core Experiences

**Today** (`app/today/`)
- Primary landing experience
- Context-driven content prioritization
- Time-aware greetings and recommendations
- Celebration moments for achievements
- Dynamic section composition

**Capture** (`app/capture/`)
- Universal data entry point
- Multi-stage pipeline (Capture → Normalize → Analyze → Extract → Route → Create)
- Pattern-based entity extraction
- Review-first workflow
- Modular handler registration

**Timeline** (`app/timeline/`)
- Universal activity history
- Events from all connected modules
- Deep linking to source entities
- Chronological grouping

### Intelligence Layer

**Context Engine** (`modules/context/`)
- Central decision-making layer
- Relevance scoring with configurable weights
- Modular provider registration
- Time-based decay for temporal signals
- Context API for different scopes

**Intelligence Module** (`modules/intelligence/`)
- Provider layer (Groq integration)
- Agent architecture (Finance, Goals, Timeline, Insight agents)
- Centralized prompt management
- Structured response schemas with Zod validation
- Insight service with caching and fallbacks

### Navigation Architecture

**Experience-First Navigation:**
- Desktop sidebar (`ExperienceNavigation`)
- Mobile floating dock (`ExperienceFloatingDock`)
- Mobile bottom navigation (`ExperienceBottomNav`)
- Deep linking support

**Primary Navigation:**
- Today (primary workspace)
- Capture (universal creation)
- Timeline (activity history)
- Search (unified search)
- Profile (settings)

### Design System

**Color Philosophy:**
- OKLCH color space for perceptual uniformity
- Semantic tokens (background, surface, card, border)
- No pure black/white
- Warm neutral palette

**Typography:**
- Geist Sans for display and body
- Geist Mono for financial values
- Scale: Display, Heading, Title, Body, Caption, Label
- Financial values as visual focal points

**Spacing:**
- 8px base unit
- Consistent scale: 0, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96px

**Motion:**
- Durations: instant (100ms), fast (150ms), normal (200ms), slow (300ms), slower (400ms)
- Easing: default, ease-in, ease-out, bounce
- Reduced motion support

## Development Conventions

### Component Architecture

**Server Components (Default):**
- Used for data fetching and rendering
- No client-side JavaScript
- Direct Supabase SSR access
- Better performance

**Client Components (When Needed):**
- Marked with `'use client'` directive
- Used for interactivity (forms, animations, state)
- Use Zustand for local state
- Use Supabase client for auth

**Component Organization:**
- `components/ui/` - Base UI components (shadcn/ui)
- `components/` - Shared feature components
- `modules/*/components/` - Module-specific components

### Coding Patterns

**Naming Conventions:**
- Components: PascalCase (e.g., ExpenseManager)
- Functions/Variables: camelCase (e.g., fetchStats)
- API routes: lowercase with hyphens (e.g., /api/budget/stats)

**File Organization:**
- `app/` - Next.js pages and API routes
- `lib/` - Utility functions and configurations
- `types/` - TypeScript type definitions
- `modules/` - Feature modules

**Reusable Patterns:**
- API route: GET/POST/PATCH/DELETE in route.ts
- Server Component: Fetch data, pass to client components
- Client Component: 'use client' directive, useState for state
- Supabase query: `await supabase.from('table').select().eq('user_id', user.id)`
- Error handling: try-catch with NextResponse.json error

### Important Files

**Critical Files:**
- `middleware.ts` - Authentication enforcement
- `lib/supabase-server.ts` - Server-side Supabase client
- `lib/supabase.ts` - Client-side Supabase client
- `app/layout.tsx` - Root layout with navigation
- `app/globals.css` - Design tokens and global styles

**Module Entry Points:**
- `modules/*/index.ts` - Module barrel files
- `modules/*/types/index.ts` - Module types
- `modules/*/components/index.ts` - Component exports

### Environment Variables

**Required:**
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key

**Note:** Never expose service_role key in client-side code.

## AI Development Guidelines

### Architecture Rules

1. **Server Components by Default** - Only use Client Components when interactivity is needed
2. **Authentication Required** - All API routes must check user authentication
3. **User Isolation** - All database queries must filter by user_id
4. **Design System** - Follow DESIGN-luma.md for all visual implementations
5. **Module Independence** - Modules register providers/handlers independently

### How to Add Features

**New Module:**
1. Create module directory in `modules/[module-name]/`
2. Add types in `types/index.ts`
3. Add components in `components/`
4. Add services in `services/`
5. Create barrel file `index.ts`
6. Register context providers if needed

**New Experience Page:**
1. Create page in `app/[experience]/page.tsx`
2. Use Server Components for data fetching
3. Use Client Components for interactivity
4. Add navigation link in ExperienceNavigation
5. Test responsive design

**New API Endpoint:**
1. Create directory in `app/api/[feature]/`
2. Create `route.ts` file
3. Export GET, POST, PATCH, DELETE functions
4. Check authentication at start
5. Use Supabase client for operations
6. Return NextResponse.json with data/error
7. Handle errors with try-catch

### Common Pitfalls

- Forgetting authentication checks in API routes
- Not filtering by user_id in database queries
- Using Client Components when Server Component would suffice
- Forgetting 'use client' directive on interactive components
- Not handling errors in async functions
- Breaking design system patterns
- Creating module-to-module dependencies

## Current Status

**Implemented:**
- Experience-first navigation (Today, Capture, Timeline)
- Context engine with relevance scoring
- Intelligence layer with AI agents
- Universal capture system
- Timeline with deep linking
- Design system v2 (premium aesthetics)
- Module architecture
- PWA support

**In Progress:**
- Enhanced search functionality
- Rules engine integration
- Additional capture types (images, receipts)

**Known Limitations:**
- No comprehensive test suite
- Limited offline support
- No rate limiting on API routes
- RLS policies need production review

## Documentation

**Design Documentation (.claude/):**
- `DESIGN-luma.md` - Complete design system
- `DECISIONS.md` - Architectural decisions
- `TASTE.md` - Design taste and aesthetics
- `TODO.md` - Project TODO list

**Product Documentation (docs/):**
- `PHILOSOPHY.md` - Product philosophy
- `PRODUCT.md` - Product overview
- `ARCHITECTURE.md` - System architecture
- `ROADMAP.md` - Development roadmap
- Plus comprehensive docs for brand, UX, data model, API, security, testing, deployment, contributing, changelog, releases, and onboarding

**This BRAIN.md** is optimized for AI context. For detailed product documentation, refer to the docs/ directory.
