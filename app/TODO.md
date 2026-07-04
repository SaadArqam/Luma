# Project TODO

This document tracks pending tasks, improvements, and future work for Luma.

## High Priority

### Critical Issues (From M1.2 Audit)
- [ ] PROD-001: Convert Today and Timeline to Server Components (data fetching pattern violation)
- [ ] PROD-002: Fix hardcoded user name in greeting (fetch from Supabase auth)
- [ ] UX-001: Add error recovery path to Today page
- [ ] FTU-001: Implement onboarding flow for first-time users
- [ ] FTU-002: Add clear call-to-action for first-time users
- [ ] COMP-007: Focus on excelling at one core experience first (strategic decision)

### Design System (From M1.2 Audit)
- [ ] DESIGN-001: Enforce 8px spacing system across all components
- [ ] DESIGN-002: Standardize border radius usage (cards: rounded-xl, modals: rounded-2xl)
- [ ] DESIGN-003: Standardize button styling to use single component
- [ ] DESIGN-004: Enforce typography class usage (text-display, text-heading, etc.)
- [ ] DESIGN-005: Replace hardcoded colors with semantic tokens
- [ ] DESIGN-006: Apply motion classes consistently to interactive elements
- [ ] DESIGN-007: Standardize card padding to p-5 (20px)
- [ ] DESIGN-008: Standardize input height to h-9 (36px)

### Missing States (From M1.2 Audit)
- [ ] PROD-005: Add empty state to Timeline page
- [ ] PROD-003: Add error states to Today page
- [ ] UX-004: Add empty state to Timeline (duplicate issue)
- [ ] UX-008: Add empty state to Focus section
- [ ] UX-009: Add empty state to Continue section

### Product Issues (From M1.2 Audit)
- [ ] PROD-006: Remove hardcoded Daily Brief content (show only real AI content)
- [ ] PROD-004: Improve Capture page value proposition and workflow explanation
- [ ] PROD-008: Integrate AI suggestions in Capture Sheet
- [ ] PROD-009: Implement or remove voice capture functionality
- [ ] PROD-010: Implement profile page and user settings
- [ ] PROD-012: Implement search functionality

### UX Issues (From M1.2 Audit)
- [ ] UX-002: Add clear next steps explanation to Capture page
- [ ] UX-003: Implement progressive disclosure on Today page (hide empty sections)
- [ ] UX-005: Fix navigation active state logic
- [ ] UX-006: Ensure floating capture button visible on desktop
- [ ] UX-007: Enhance Daily Brief empty state with action encouragement
- [ ] UX-010: Improve metadata discoverability in Capture Sheet
- [ ] UX-011: Implement progressive disclosure in Timeline item cards
- [ ] UX-012: Improve capture submission feedback with progress indicator

### Consistency Issues (From M1.2 Audit)
- [ ] CONS-001: Standardize button styling across app
- [ ] CONS-002: Standardize button sizes (primary: h-11, secondary: h-10, small: h-9)
- [ ] CONS-005: Fix navigation active state logic (duplicate issue)
- [ ] CONS-006: Standardize card padding (duplicate issue)
- [ ] CONS-007: Standardize card border radius (duplicate issue)
- [ ] CONS-008: Enforce typography class usage (duplicate issue)
- [ ] CONS-009: Standardize input heights (duplicate issue)
- [ ] CONS-010: Standardize empty state styling
- [ ] CONS-011: Standardize loading states (skeleton screens)
- [ ] CONS-012: Apply motion classes consistently (duplicate issue)
- [ ] CONS-013: Enforce 8px spacing system (duplicate issue)
- [ ] CONS-014: Enforce color token usage

### Design System (Pre-Existing)
- [ ] Migrate remaining legacy components to new design system
- [ ] Add missing component variants (sheets, dialogs, badges, widgets)
- [ ] Implement responsive layout improvements for desktop
- [ ] Add more typography variants for different use cases
- [ ] Enhance icon system with consistent sizing

### Features
- [ ] Implement data export functionality for user data portability
- [ ] Add advanced analytics and insights
- [ ] Implement sharing/collaboration features
- [ ] Add more sophisticated AI-powered recommendations
- [ ] Implement recurring transaction improvements

## Medium Priority

### Performance
- [ ] Optimize image loading and asset optimization
- [ ] Implement code splitting for better initial load
- [ ] Add loading skeletons for all async operations
- [ ] Optimize database queries for better performance
- [ ] Implement caching strategies for frequently accessed data

### Accessibility
- [ ] Add comprehensive ARIA labels throughout the application
- [ ] Improve keyboard navigation for all interactive elements
- [ ] Add skip navigation links
- [ ] Implement high contrast mode support
- [ ] Add screen reader announcements for dynamic content

### Testing
- [ ] Add unit tests for critical components
- [ ] Add integration tests for key user flows
- [ ] Add E2E tests for critical paths
- [ ] Implement visual regression testing
- [ ] Add performance testing

## Low Priority

### Documentation
- [ ] Improve inline code documentation
- [ ] Add component usage examples
- [ ] Create design system documentation site
- [ ] Add API documentation for internal modules
- [ ] Create contributor guidelines

### Developer Experience
- [ ] Set up pre-commit hooks for code quality
- [ ] Add automated linting and formatting
- [ ] Improve TypeScript type coverage
- [ ] Add storybook for component development
- [ ] Set up automated deployment pipeline

### Polish
- [ ] Add more micro-interactions and animations
- [ ] Implement sound effects for interactions (optional)
- [ ] Add haptic feedback for mobile (optional)
- [ ] Improve error handling and error messages
- [ ] Add more empty state illustrations

## Completed

### Design System (Epic 10 - June 2026)
- [x] Implement comprehensive design token system
- [x] Create semantic color tokens
- [x] Implement typography scale
- [x] Create spacing system
- [x] Implement motion system
- [x] Redesign navigation dock with glass effect
- [x] Redesign card components
- [x] Redesign button components
- [x] Redesign input components
- [x] Redesign empty states
- [x] Improve accessibility (contrast, focus states)
- [x] Update documentation

### Context Engine (Epic 9)
- [x] Implement context engine module
- [x] Add relevance signals
- [x] Implement context API
- [x] Add context caching
- [x] Integrate with Today page

### Core Features
- [x] Implement authentication with Supabase
- [x] Implement expense tracking
- [x] Implement goal tracking
- [x] Implement task management
- [x] Implement quick add functionality
- [x] Implement recurring transactions
- [x] Implement budget overview
- [x] Implement timeline view

## Backlog

### Future Features
- [ ] Multi-currency support
- [ ] Bank account integration
- [ ] Receipt scanning with AI
- [ ] Spending predictions
- [ ] Savings goals with automated transfers
- [ ] Investment tracking
- [ ] Debt tracking and payoff planning
- [ ] Bill tracking and reminders
- [ ] Subscription management
- [ ] Tax reporting features
- [ ] Family/shared accounts
- [ ] Budget categories with custom rules
- [ ] Spending limits and alerts
- [ ] Financial health score
- [ ] Net worth tracking
- [ ] Cash flow visualization
- [ ] Custom reports and exports
- [ ] Apple Watch companion app
- [ ] Widget support
- [ ] Siri shortcuts integration

### Technical Improvements
- [ ] Migration to React Server Components where applicable
- [ ] Implement real-time updates with Supabase Realtime
- [ ] Add offline support with better sync
- [ ] Implement background sync
- [ ] Add push notifications
- [ ] Implement biometric authentication
- [ ] Add data encryption at rest
- [ ] Implement audit logging
- [ ] Add analytics tracking
- [ ] Implement A/B testing framework

## Bug Fixes

### Known Issues
- [ ] Fix any reported bugs from production
- [ ] Address performance issues on low-end devices
- [ ] Fix accessibility issues found in audits
- [ ] Resolve any TypeScript strict mode errors
- [ ] Fix any console warnings

## Research

### Investigations
- [ ] Evaluate alternative charting libraries
- [ ] Research better state management patterns
- [ ] Investigate PWA improvements
- [ ] Research internationalization requirements
- [ ] Evaluate mobile app frameworks (React Native, etc.)

## Dependencies

### Updates
- [ ] Keep Next.js updated to latest stable
- [ ] Keep React updated to latest stable
- [ ] Keep Supabase SDK updated
- [ ] Keep Tailwind CSS updated
- [ ] Keep other dependencies updated regularly

### Security
- [ ] Regular dependency audits
- [ ] Security vulnerability scanning
- [ ] Update dependencies with security patches
- [ ] Implement security headers
- [ ] Add CSP headers

## Note

This TODO is maintained by the development team. Priorities may shift based on business needs and user feedback. Items are added and removed as the project evolves.
