# Onboarding Guide

This document provides guidance for onboarding new team members to the Luma project.

## Welcome to Luma

Luma is a calm, intelligent personal OS for understanding your life. We're building a product that helps people understand their finances, goals, and tasks through a calm, thoughtful interface.

## Project Overview

### What is Luma?

Luma is a Progressive Web App (PWA) built with Next.js 16, React 19, TypeScript, and Supabase. It provides three core experiences:

- **Capture:** Quick data entry for expenses, tasks, and notes
- **Today:** Daily overview with contextual relevance
- **Timeline:** Historical view with pattern insights

### Tech Stack

**Frontend:**
- Next.js 16 with App Router
- React 19
- TypeScript
- Tailwind CSS v4
- Zustand for state management

**Backend:**
- Supabase (PostgreSQL)
- Supabase Auth
- Supabase Realtime
- Supabase Storage

**Development Tools:**
- ESLint
- Prettier
- TypeScript Compiler
- Git

## Getting Started

### Prerequisites

Before starting, ensure you have:

- Node.js 18+ installed
- npm or yarn package manager
- Git installed
- GitHub account
- VS Code (recommended)
- Supabase account (for backend access)

### Environment Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-org/Luma.git
   cd Luma
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your credentials
   ```

4. **Start development server:**
   ```bash
   npm run dev
   ```

5. **Open in browser:**
   Navigate to `http://localhost:3000`

## Project Structure

### Directory Overview

```
Luma/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── finance/           # Finance features
│   ├── goals/             # Goal features
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # Reusable components
├── lib/                   # Utility functions
├── types/                 # TypeScript types
├── .claude/              # Design and decisions
├── docs/                 # Documentation
└── public/               # Static assets
```

### Key Files

- `app/layout.tsx` - Root layout with fonts and providers
- `middleware.ts` - Authentication middleware
- `lib/supabase.ts` - Supabase client configuration
- `lib/supabase-server.ts` - Server-side Supabase client
- `next.config.ts` - Next.js configuration

## Documentation

### Essential Documentation

Read these documents first:

1. **Product Philosophy** (`docs/PHILOSOPHY.md`) - Understand our core beliefs
2. **Product Overview** (`docs/PRODUCT.md`) - Learn about the product
3. **Design System** (`.claude/DESIGN-luma.md`) - Design tokens and principles
4. **Architecture** (`docs/ARCHITECTURE.md`) - System architecture
5. **UX Principles** (`docs/UX_PRINCIPLES.md`) - User experience guidelines

### Additional Documentation

- **Brand Guidelines** (`docs/BRAND.md`) - Brand identity
- **Design Taste** (`docs/TASTE.md`) - Aesthetic preferences
- **Data Model** (`docs/DATA_MODEL.md`) - Database schema
- **API Documentation** (`docs/API.md`) - API endpoints
- **Security** (`docs/SECURITY.md`) - Security practices
- **Testing** (`docs/TESTING.md`) - Testing procedures
- **Deployment** (`docs/DEPLOYMENT.md`) - Deployment process
- **Contributing** (`docs/CONTRIBUTING.md`) - Contribution guidelines

## Development Workflow

### Branch Strategy

- `main` - Production-ready code
- `develop` - Integration branch
- `feature/*` - New features
- `fix/*` - Bug fixes
- `hotfix/*` - Urgent production fixes

### Creating a Feature

1. Create a feature branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes following coding standards

3. Write tests for your changes

4. Commit with conventional commit format:
   ```bash
   git commit -m "feat(feature-name): description"
   ```

5. Push and create pull request

### Code Review Process

1. Create pull request
2. Request review from team members
3. Address feedback
4. Update PR as needed
5. Get approval
6. Merge to develop or main

## Coding Standards

### TypeScript

- Use TypeScript strict mode
- Define types for all functions
- Avoid `any` type
- Use interfaces for object shapes
- Use type aliases for unions

### React

- Use functional components
- Use hooks for state and effects
- Use server components by default
- Mark client components with `'use client'`
- Follow React best practices

### Styling

- Use Tailwind CSS for styling
- Follow design system tokens
- Use utility classes
- Avoid inline styles
- Use semantic class names

### File Naming

- Components: PascalCase (`PrimaryButton.tsx`)
- Utilities: camelCase (`formatCurrency.ts`)
- Hooks: camelCase with `use` prefix (`useAuth.ts`)
- Types: PascalCase (`UserTypes.ts`)

## Design System

### Design Tokens

Luma uses a comprehensive design system defined in `.claude/DESIGN-luma.md`:

- **Colors:** OKLCH color space with semantic tokens
- **Typography:** Geist Sans and Geist Mono fonts
- **Spacing:** 8px base unit
- **Motion:** Subtle animations
- **Glass Effects:** Translucent surfaces
- **Elevation:** Layered depth

### Component Guidelines

- Reuse existing components when possible
- Follow component patterns
- Use proper TypeScript types
- Include accessibility attributes
- Test component interactions

## Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage
```

### Writing Tests

- Write tests for new features
- Write tests for bug fixes
- Maintain test coverage
- Test edge cases
- Use descriptive test names

## Common Tasks

### Adding a New Component

1. Create component file in `components/`
2. Follow existing component patterns
3. Use TypeScript types
4. Include accessibility attributes
5. Write tests
6. Export from `components/index.ts`

### Adding a New API Route

1. Create route file in `app/api/`
2. Implement route handler
3. Add authentication check
4. Validate input
5. Return appropriate response
6. Write tests

### Adding a New Page

1. Create page file in `app/`
2. Use server components by default
3. Mark client components with `'use client'`
4. Follow design system
5. Test responsive design

## Tools and Resources

### Development Tools

- **VS Code:** Recommended code editor
- **Git:** Version control
- **npm:** Package manager
- **TypeScript:** Type checking
- **ESLint:** Linting
- **Prettier:** Code formatting

### External Resources

- **Next.js Documentation:** https://nextjs.org/docs
- **React Documentation:** https://react.dev
- **TypeScript Documentation:** https://www.typescriptlang.org/docs
- **Tailwind CSS Documentation:** https://tailwindcss.com/docs
- **Supabase Documentation:** https://supabase.com/docs

## Communication

### Channels

- **GitHub:** Issues, pull requests, discussions
- **Slack:** Team communication (if applicable)
- **Email:** For sensitive matters

### Getting Help

1. Search existing documentation
2. Search GitHub issues
3. Ask in GitHub Discussions
4. Contact team members
5. Create an issue if needed

## First Week Checklist

### Day 1-2: Setup and Orientation

- [ ] Set up development environment
- [ ] Read essential documentation
- [ ] Clone and run the project
- [ ] Explore the codebase
- [ ] Meet the team

### Day 3-4: Learning

- [ ] Review design system
- [ ] Understand architecture
- [ ] Review existing components
- [ ] Read API documentation
- [ ] Understand data model

### Day 5: First Contribution

- [ ] Pick a small task
- [] Create a feature branch
- [ ] Implement the change
- [ ] Write tests
- [ ] Create pull request
- [ ] Participate in code review

## Common Questions

### How do I run the project?

```bash
npm install
npm run dev
```

### How do I add a new dependency?

```bash
npm install package-name
```

### How do I run tests?

```bash
npm test
```

### How do I deploy?

Deployments are automatic via Vercel when pushing to main branch.

### Where do I ask questions?

Ask in GitHub Discussions or create an issue.

## Next Steps

After completing onboarding:

1. Start with small, well-defined tasks
2. Participate in code reviews
3. Attend team meetings (if applicable)
4. Contribute to documentation
5. Help improve the project

## Support

If you need help during onboarding:

- Ask your mentor or team lead
- Search documentation
- Ask in GitHub Discussions
- Create an issue for bugs

## Related Documentation

- **Contributing**: `docs/CONTRIBUTING.md` - Contribution guidelines
- **Architecture**: `docs/ARCHITECTURE.md` - System architecture
- **Design System**: `.claude/DESIGN-luma.md` - Design tokens

---

**Note:** This onboarding guide is a living document. It will be updated as the project evolves and new team members join.
