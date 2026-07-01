# Architecture Documentation

This document describes the technical architecture of Luma, including the technology stack, system design, and key architectural decisions.

## Technology Stack

### Frontend

**Framework:** Next.js 16 with App Router
- Modern React framework with server components
- File-based routing
- Built-in optimization and performance features
- Server and client component architecture

**UI Library:** React 19
- Latest React features
- Concurrent rendering
- Server components support

**Styling:** Tailwind CSS v4
- Utility-first CSS framework
- Custom design tokens
- Responsive design utilities
- Dark mode support

**State Management:** Zustand
- Lightweight state management
- Excellent TypeScript support
- Simple API for client-side state
- Used for quick add functionality and temporary state

**Icons:** Lucide React
- Consistent icon set
- Tree-shakeable
- Customizable styling

**Charts:** Recharts
- Data visualization
- Responsive charts
- Custom styling support

### Backend

**Backend-as-a-Service:** Supabase
- PostgreSQL database
- Authentication (Supabase Auth)
- Real-time subscriptions (Supabase Realtime)
- Storage (Supabase Storage)
- Edge functions (Supabase Edge Functions)

**AI:** Groq SDK
- AI-powered features
- Context engine
- Pattern recognition
- Smart recommendations

### Development Tools

**Language:** TypeScript
- Strict mode enabled
- Type safety across the codebase
- Path aliases (@/*)

**Package Manager:** npm
- Standard npm scripts
- Lockfile for dependency management

**Linting:** ESLint
- Next.js ESLint config
- Custom rules for code quality

**PWA:** Serwist
- Service worker generation
- Offline support
- Caching strategies
- Push notifications (future)

## System Architecture

### Application Structure

```
Luma (PWA)
├── Frontend (Next.js 16)
│   ├── Server Components (data fetching, auth)
│   ├── Client Components (interactivity, state)
│   └── API Routes (server-side logic)
├── Backend (Supabase)
│   ├── PostgreSQL (data storage)
│   ├── Auth (authentication)
│   ├── Realtime (live updates)
│   └── Storage (file storage)
└── AI (Groq)
    └── Context Engine (intelligent features)
```

### Component Architecture

**Server Components (Default)**
- Used for data fetching and rendering
- No client-side JavaScript
- Better performance and SEO
- Direct database access via Supabase SSR

**Client Components (When Needed)**
- Used for interactivity (forms, animations, state)
- Marked with `'use client'` directive
- Use Zustand for local state
- Use Supabase client for auth

**Shared Components**
- Reusable UI components in `components/ui/`
- Feature components in `components/`
- Module-specific components in `modules/*/components/`

### Data Flow

**Server-Side Data Fetching**
```
User Request → Middleware (Auth Check) → Server Component → Supabase SSR → Database → Response
```

**Client-Side State**
```
User Interaction → Client Component → Zustand Store → UI Update
```

**Real-Time Updates**
```
Database Change → Supabase Realtime → Client Subscription → UI Update
```

### Authentication Flow

**Login Flow**
```
User enters credentials → Supabase Auth → Session created → Cookie set → Redirect to Today
```

**Protected Route Flow**
```
User requests protected route → Middleware checks auth → If authenticated → Serve page
                                                                            → If not → Redirect to login
```

**Session Management**
- Session stored in HTTP-only cookies
- Supabase SSR handles session validation
- Automatic token refresh
- Secure session management

## Directory Structure

```
Luma/
├── app/                          # Next.js app directory
│   ├── accounts/                # Accounts pages
│   ├── ai/                      # AI features pages
│   ├── api/                     # API routes
│   │   ├── accounts/           # Accounts API
│   │   ├── balance/            # Balance API
│   │   ├── budget/             # Budget API
│   │   ├── categories/         # Categories API
│   │   ├── expenses/           # Expenses API
│   │   ├── goals/              # Goals API
│   │   ├── recurring/          # Recurring transactions API
│   │   └── tasks/              # Tasks API
│   ├── auth/                   # Auth callback routes
│   ├── capture/                # Capture experience
│   ├── context/                # Context engine pages
│   ├── daily-brief/            # Daily brief pages
│   ├── favicon.ico             # Favicon
│   ├── globals.css             # Global styles and design tokens
│   ├── layout.tsx              # Root layout
│   ├── manifest.ts             # PWA manifest
│   ├── page.tsx                # Home page (redirects to /today)
│   ├── sw.ts                   # Service worker
│   └── today/                  # Today experience
├── components/                  # Shared components
│   ├── ui/                     # Base UI components
│   │   ├── DarkInput.tsx
│   │   ├── LogoutButton.tsx
│   │   ├── PrimaryButton.tsx
│   │   └── ... (20+ components)
│   ├── AddBalanceForm.tsx
│   ├── AddCategoryForm.tsx
│   ├── AddExpenseButton.tsx
│   ├── BudgetOverview.tsx
│   ├── CategoryList.tsx
│   ├── DashboardChart.tsx
│   ├── ExpenseManager.tsx
│   ├── QuickAddSheet.tsx
│   └── ... (15+ components)
├── lib/                         # Utility functions
│   ├── quickAddStore.ts        # Zustand store for quick add
│   ├── recurring-utils.ts      # Recurring transaction utilities
│   ├── supabase-server.ts      # Supabase SSR client
│   ├── supabase.ts             # Supabase client
│   ├── timeline-helpers.ts     # Timeline utilities
│   └── utils.ts                # General utilities
├── modules/                     # Feature modules
│   ├── accounts/              # Accounts module
│   │   ├── components/
│   │   ├── services/
│   │   └── types/
│   ├── capture/               # Capture module
│   │   ├── components/
│   │   ├── services/
│   │   └── types/
│   ├── context/               # Context engine module
│   │   ├── components/
│   │   ├── providers/
│   │   ├── services/
│   │   └── types/
│   ├── daily-brief/           # Daily brief module
│   │   ├── components/
│   │   ├── services/
│   │   └── types/
│   ├── finance/               # Finance module
│   │   ├── components/
│   │   ├── services/
│   │   └── types/
│   ├── goals/                 # Goals module
│   │   ├── components/
│   │   ├── services/
│   │   └── types/
│   └── today/                 # Today experience module
│       ├── components/        # Today-specific components
│       │   ├── TodayHeader.tsx
│       │   ├── DailyBriefCard.tsx
│       │   ├── FocusSection.tsx
│       │   ├── InsightCard.tsx
│       │   ├── InsightSection.tsx
│       │   ├── UpcomingSection.tsx
│       │   ├── ContinueSection.tsx
│       │   ├── RecentTimelinePreview.tsx
│       │   ├── FloatingCaptureButton.tsx
│       │   ├── TodayPageSkeleton.tsx
│       │   └── index.ts
│       ├── services/
│       ├── types/
│       └── utils/
├── capture/               # Universal capture experience module
│   ├── components/        # Capture-specific components
│   │   ├── CaptureSheet.tsx
│   │   ├── CaptureInput.tsx
│   │   ├── CaptureTypeSelector.tsx
│   │   ├── VoiceCapture.tsx
│   │   ├── AISuggestionList.tsx
│   │   ├── MetadataSection.tsx
│   │   ├── ProcessingIndicator.tsx
│   │   ├── EntityCard.tsx
│   │   ├── CaptureReview.tsx
│   │   └── index.ts
│   ├── services/
│   ├── types/
│   └── utils/
├── public/                     # Static assets
│   ├── apple-icon.png
│   ├── apple-touch-icon.png
│   ├── icon-192x192.png
│   ├── icon-512x512.png
│   └── manifest.json
├── types/                      # TypeScript types
│   └── index.ts               # Type exports
├── .claude/                   # Claude-specific documentation
├── docs/                      # Project documentation
├── .gitignore
├── components.json            # shadcn/ui config
├── eslint.config.mjs          # ESLint config
├── middleware.ts              # Next.js middleware
├── next.config.ts             # Next.js config
├── package.json               # Dependencies
├── postcss.config.mjs         # PostCSS config
├── tsconfig.json              # TypeScript config
└── README.md                  # Project README
```

## Key Architectural Decisions

### Next.js App Router

**Decision:** Use Next.js 16 with App Router instead of Pages Router

**Rationale:**
- Server components for better performance
- Simpler data fetching patterns
- Better TypeScript support
- Built-in layouts and error boundaries
- Modern React patterns

**Impact:**
- Most pages use server components by default
- Client components only for interactivity
- Improved performance and SEO
- Simplified data fetching

### Supabase as Backend

**Decision:** Use Supabase instead of custom backend

**Rationale:**
- Complete backend solution out of the box
- Authentication, database, real-time, storage in one platform
- Rapid development
- Scalable infrastructure
- Cost-effective for early-stage product

**Impact:**
- No need to build custom backend
- Fast development iteration
- Built-in authentication and real-time
- PostgreSQL database with full SQL capabilities

### Server Components by Default

**Decision:** Use server components by default, client components only when needed

**Rationale:**
- Better performance (no client-side JavaScript)
- Improved SEO
- Simplified data fetching
- Reduced bundle size

**Impact:**
- Most pages are server components
- Client components only for interactivity
- Better initial load performance
- Cleaner separation of concerns

### Zustand for State Management

**Decision:** Use Zustand instead of Redux or Context API

**Rationale:**
- Lightweight and simple
- Excellent TypeScript support
- No boilerplate
- Easy to use
- Good performance

**Impact:**
- Simple state management for client components
- Used primarily for quick add functionality
- Minimal boilerplate code

### Tailwind CSS v4

**Decision:** Use Tailwind CSS v4 instead of v3 or custom CSS

**Rationale:**
- Latest features and improvements
- Better performance
- Simplified configuration
- Future-proof

**Impact:**
- Utility-first styling
- Custom design tokens
- Consistent design system
- Rapid UI development

### PWA with Serwist

**Decision:** Use Serwist for PWA functionality instead of Workbox

**Rationale:**
- Modern service worker library
- Better TypeScript support
- Simpler configuration
- Active development

**Impact:**
- Offline support
- Improved performance
- Installable as app
- Push notifications (future)

## Design System Architecture

### Design Tokens

Design tokens are defined in `app/globals.css` using CSS custom properties:

```css
:root {
  /* Colors */
  --color-background: ...;
  --color-surface: ...;
  --color-card: ...;
  
  /* Typography */
  --font-display: ...;
  --font-body: ...;
  
  /* Spacing */
  --space-1: 4px;
  --space-2: 8px;
  /* ... */
  
  /* Motion */
  --motion-fast: 150ms;
  --motion-normal: 200ms;
  /* ... */
  
  /* Border Radius */
  --radius-sm: 8px;
  --radius-md: 12px;
  /* ... */
}
```

### Component Architecture

**Base UI Components** (`components/ui/`)
- Reusable, design system components
- No business logic
- Highly composable
- Consistent styling

**Feature Components** (`components/`)
- Business logic components
- Combine base UI components
- Feature-specific functionality
- Reusable across the app

**Module Components** (`modules/*/components/`)
- Module-specific components
- Encapsulated within feature modules
- May not be reused outside module

## Data Model

### Database Schema (Supabase/PostgreSQL)

**Tables:**
- `profiles` - User profiles
- `accounts` - Financial accounts
- `categories` - Expense/income categories
- `transactions` - Financial transactions
- `goals` - User goals
- `tasks` - User tasks
- `recurring_transactions` - Recurring transaction rules

**Relationships:**
- One-to-many: User → Accounts, Categories, Transactions, Goals, Tasks
- Many-to-one: Transactions → Accounts, Categories
- One-to-one: User → Profile

### Type System

TypeScript types are defined in module-specific type files:
- `modules/finance/types/` - Finance-related types
- `modules/goals/types/` - Goal-related types
- Central exports in `types/index.ts`

## Performance Optimization

### Code Splitting

- Automatic code splitting with Next.js
- Dynamic imports for heavy components
- Route-based splitting

### Image Optimization

- Next.js Image component for automatic optimization
- Responsive images
- Lazy loading

### Caching

- Service worker caching with Serwist
- HTTP caching headers
- Database query caching (future)

### Bundle Optimization

- Tree-shaking with webpack
- Minification
- Dependency analysis

## Security Architecture

### Authentication

- Supabase Auth for authentication
- HTTP-only cookies for session storage
- Secure token management
- Automatic token refresh

### Authorization

- Row-level security (RLS) in PostgreSQL
- User-based access control
- API route protection with middleware

### Data Security

- Encrypted connections (HTTPS)
- Data encryption at rest (Supabase)
- Secure API endpoints
- Input validation with Zod

### Privacy

- Minimal data collection
- User control over data
- Clear data policies
- GDPR compliance (future)

## Scalability Considerations

### Database Scalability

- Supabase/PostgreSQL scales vertically
- Connection pooling
- Read replicas (future)
- Database indexing

### API Scalability

- Serverless functions with Supabase Edge Functions
- CDN for static assets
- Caching strategies
- Rate limiting (future)

### Frontend Scalability

- Server components reduce client load
- Code splitting
- Lazy loading
- Optimistic UI updates

## Monitoring and Observability

### Logging

- Server-side logging (future)
- Client-side error tracking (future)
- Performance monitoring (future)

### Analytics

- User analytics (future)
- Feature usage tracking (future)
- Error tracking (future)

### Health Checks

- API health endpoints (future)
- Database health checks (future)
- Uptime monitoring (future)

## Deployment Architecture

### Current Deployment

- Vercel for frontend (Next.js)
- Supabase for backend
- Automatic deployments on git push

### Future Considerations

- Multi-region deployment
- CDN optimization
- Edge functions
- Database sharding (if needed)

## Development Workflow

### Local Development

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Code Quality

- TypeScript strict mode
- ESLint for code quality
- Prettier for formatting (future)
- Pre-commit hooks for quality (future)

### Testing Strategy

- Unit tests for utilities (future)
- Integration tests for API routes (future)
- E2E tests for critical flows (future)
- Visual regression tests (future)

## Future Architecture Improvements

### Short Term

- Add comprehensive error boundaries
- Implement loading states for all async operations
- Add skeleton screens
- Improve error handling

### Medium Term

- Implement caching layer
- Add database query optimization
- Implement rate limiting
- Add API versioning

### Long Term

- Consider microservices for specific features
- Implement event-driven architecture
- Add message queue for background jobs
- Consider database sharding for scale

## Documentation

### Code Documentation

- JSDoc comments for functions
- TypeScript types for self-documentation
- README files for modules (future)

### Architecture Documentation

- This document (ARCHITECTURE.md)
- Design system documentation (.claude/DESIGN-luma.md)
- API documentation (docs/API.md - future)
- Component documentation (future)

---

**Note:** This architecture document is a living document. It will be updated as the system evolves and new architectural decisions are made.
