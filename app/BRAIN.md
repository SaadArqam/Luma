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
- Material-based color naming (paper, linen, mist, fog, ink, pencil, graphite)
- Geist Sans and Geist Mono fonts
- 8px spacing system
- Motion system with reduced motion support
- Glass effects for navigation
- Extended token system: z-index, opacity, border width/style scales
- Premium floating bottom navigation for mobile
- Card hover effects with subtle elevation

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
- Primary landing experience with calm, warm design
- Context-driven content prioritization
- Time-aware greetings and contextual subtitles
- Daily Brief as visual centerpiece with AI streaming support
- Focus section for prioritized items (bills, goals, events)
- Insights section for AI-powered observations
- Upcoming section for unified chronological items
- Continue section for resuming unfinished activities
- Recent Timeline Preview for unified activity display
- Floating Capture Button for quick data entry
- Modular component architecture for reusability
- Loading and empty states with skeleton UI

**Capture** (`app/capture/`)
- Universal data entry point with effortless, calm design
- Multi-stage pipeline (Capture → Normalize → Analyze → Extract → Route → Create)
- Pattern-based entity extraction
- Review-first workflow
- Modular handler registration
- CaptureSheet with bottom sheet/modal responsive design
- Text and voice capture modes with full UI
- Auto-growing textarea with character count
- Draft management with localStorage persistence
- AI suggestion area for future integration
- Metadata section for tags, location, reminders, attachments
- Subtle processing indicator for capture completion
- Floating Capture Button for quick access

**Timeline** (`app/timeline/`)
- Universal activity history - the memory of the user's life
- Events from all connected modules (Finance, Goals, Habits, Journal, Health, AI, Capture)
- Deep linking to source entities
- Chronological grouping (Today, Yesterday, This Week, Last Week, Months, Earlier)
- Reusable TimelineItem types (Transaction, Capture, Journal Entry, Goal Progress, Habit Completion, Planner Event, Health Record, AI Insight, Reminder, Milestone, Achievement)
- TimelineItemRegistry for extensible item type registration
- Daily Summary cards for AI-generated day summaries
- Reflection cards for future AI-powered insights
- TimelineItemCard with icon, title, context, timestamp, preview, and actions
- Empty states with calming guidance
- Skeleton loading states matching final UI
- Calm, reflective design following Luma philosophy

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
- Today Experience v2 (calm, warm, intentional design)
- Modular Today components (Header, DailyBrief, Focus, Insights, Upcoming, Continue, Timeline)
- Floating Capture Button
- Skeleton loading states
- Enhanced design tokens (z-index, opacity, border styles)
- Timeline Experience v2 (Epic 13 complete)
  - Comprehensive TimelineItem types supporting all modules
  - TimelineItemRegistry for extensible item registration
  - Enhanced chronological grouping (Today, Yesterday, This Week, Last Week, Months, Earlier)
  - Daily Summary cards for AI-generated day summaries
  - Reflection cards for future AI-powered insights
  - TimelineItemCard with full card layout (icon, title, context, timestamp, preview, actions)
  - Calm empty states with encouraging guidance
  - Skeleton loading states matching final UI
  - TimelineHeader with search and filter buttons
  - Modular, reusable component architecture
  - Future-ready architecture for AI integration
- Validation Framework (Milestone M1.1 complete)
  - Product Manifesto defining core beliefs
  - Product Scorecard with measurable quality metrics
  - MVP Checklist for launch requirements
  - Review Guidelines with multiple perspectives
  - Release Criteria defining release blockers
  - Decision Framework for feature evaluation
  - Validation Process for recursive quality improvement
  - Validation README as system overview

**In Progress:**
- Enhanced search functionality
- Rules engine integration
- Additional capture types (images, receipts)
- AI-powered Daily Brief generation
- Context Engine integration with Today Experience
- Voice transcription backend integration
- AI classification pipeline for capture

**Known Limitations:**
- No comprehensive test suite
- Limited offline support
- No rate limiting on API routes
- RLS policies need production review

## Validation Audit Results (Milestone M1.2)

**Audit Date:** 2026-07-01
**Audit Scope:** Today, Capture, Timeline, Navigation, Shared Components
**Audit Status:** Complete

**Summary:**
Comprehensive Product & UX Audit completed covering 7 perspectives: Product, UX, UI, Design Language Compliance, First-Time User, Competitive, and Consistency.

**Total Issues Identified:** 64
- Critical: 5 (must fix before launch)
- High: 21 (should fix before launch)
- Medium: 30 (should address soon)
- Low: 8 (can defer if documented)

**Critical Issues:**
1. PROD-001: Data fetching pattern violates Server Component principles (Today/Timeline using client-side fetching)
2. PROD-002: Hardcoded user name in greeting ("Saad" instead of actual user)
3. UX-001: No error recovery path in Today page
4. FTU-001: No onboarding flow for first-time users
5. FTU-002: No clear call-to-action for first-time users
6. COMP-007: Luma tries to do too much without excelling at any one domain

**High-Priority Issues:**
- Missing error states and empty states (Timeline, Today sections)
- Inconsistent design system application (spacing, border radius, button styling)
- Daily Brief shows hardcoded content instead of AI-generated content
- Capture page lacks clear value proposition and workflow explanation
- Navigation active state logic inconsistent
- AI features not functional (suggestions, voice capture)

**Key Findings:**
- **Product:** Solid foundation with three core experiences, but AI features not yet functional
- **UX:** Calm design well-executed, but gaps in error handling and progressive disclosure
- **UI:** Design system well-defined but inconsistently applied
- **Design Compliance:** Emotional design excellent, but spacing and border radius not consistent
- **First-Time User:** Significant gaps in onboarding and value proposition communication
- **Competitive:** Difficult to justify switching from established competitors without unique features
- **Consistency:** 65% consistency score, significant issues in buttons, spacing, and cards

**Audit Reports Location:**
- Product Audit: `validation/REPORTS/product-audit.md`
- UX Audit: `validation/UX_AUDITS/ux-audit.md`
- UI Audit: `validation/UX_AUDITS/ui-audit.md`
- Design Compliance: `validation/REPORTS/design-compliance.md`
- First-Time User: `validation/USER_TESTS/first-time-user.md`
- Competitive Review: `validation/REPORTS/competitive-review.md`
- Consistency Audit: `validation/REPORTS/consistency-audit.md`
- Master Issue Log: `validation/BUG_REPORTS/master-issue-log.md`

**Next Steps:**
- M1.3: Prioritize findings and create validation backlog
- Begin fixing critical issues (PROD-001, PROD-002, UX-001)
- Address high-priority design consistency issues

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
