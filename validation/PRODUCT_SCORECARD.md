# Product Scorecard

This document defines measurable quality metrics for Luma. Each metric includes a target, current value, pass/fail status, and notes.

---

## Product Metrics

### First Meaningful Paint

**Definition:** Time from navigation start to when the primary content is rendered.

**Target:** < 1.5s

**Current Value:** TBD

**Status:** ⏳ Pending

**Notes:**
- Measured on 3G connection
- Critical for perceived performance
- Impacts user engagement

---

### Time to First Capture

**Definition:** Time from page load to when user can successfully capture an item.

**Target:** < 2s

**Current Value:** TBD

**Status:** ⏳ Pending

**Notes:**
- Critical path for primary action
- Includes authentication check
- Measured from cold start

---

### Time to Understand Today

**Definition:** Time from page load to when user can comprehend the Today page content.

**Target:** < 3s

**Current Value:** TBD

**Status:** ⏳ Pending

**Notes:**
- Includes data loading and rendering
- Critical for daily engagement
- Measured on typical connection

---

### Navigation Clarity

**Definition:** Percentage of users who can navigate to any primary section within 3 seconds.

**Target:** > 95%

**Current Value:** TBD

**Status:** ⏳ Pending

**Notes:**
- Measured via user testing
- Critical for discoverability
- Should be intuitive without training

---

### User Confusion Count

**Definition:** Number of support tickets related to "how do I" questions per 1000 active users.

**Target:** < 5

**Current Value:** TBD

**Status:** ⏳ Pending

**Notes:**
- Indicates UX clarity
- Lower is better
- Track over time

---

## Engineering Metrics

### TypeScript Errors

**Definition:** Number of TypeScript errors in the codebase.

**Target:** 0

**Current Value:** TBD

**Status:** ⏳ Pending

**Notes:**
- Strict mode enabled
- No `any` types allowed
- All errors must be resolved

---

### ESLint Errors

**Definition:** Number of ESLint errors in the codebase.

**Target:** 0

**Current Value:** TBD

**Status:** ⏳ Pending

**Notes:**
- All errors must be resolved
- Warnings should be minimized
- Consistent code style

---

### Console Warnings

**Definition:** Number of console warnings in production build.

**Target:** 0

**Current Value:** TBD

**Status:** ⏳ Pending

**Notes:**
- Indicates potential issues
- All warnings should be addressed
- Monitor in production

---

### Bundle Size

**Definition:** Total JavaScript bundle size (gzipped).

**Target:** < 500KB

**Current Value:** TBD

**Status:** ⏳ Pending

**Notes:**
- Includes all dependencies
- Measured after minification
- Critical for load time

---

### Lighthouse Performance Score

**Definition:** Google Lighthouse performance score (0-100).

**Target:** > 90

**Current Value:** TBD

**Status:** ⏳ Pending

**Notes:**
- Measured on mobile
- Includes all performance factors
- Industry standard benchmark

---

### Lighthouse Accessibility Score

**Definition:** Google Lighthouse accessibility score (0-100).

**Target:** > 95

**Current Value:** TBD

**Status:** ⏳ Pending

**Notes:**
- WCAG AA compliance
- Critical for inclusive design
- Screen reader support

---

### Lighthouse Best Practices Score

**Definition:** Google Lighthouse best practices score (0-100).

**Target:** > 90

**Current Value:** TBD

**Status:** ⏳ Pending

**Notes:**
- Security best practices
- Modern web standards
- HTTPS, headers, etc.

---

### Lighthouse SEO Score

**Definition:** Google Lighthouse SEO score (0-100).

**Target:** > 80

**Current Value:** TBD

**Status:** ⏳ Pending

**Notes:**
- Meta tags, structured data
- Less critical for app
- Still important for discovery

---

## UX Metrics

### Empty States

**Definition:** Percentage of screens with proper empty states.

**Target:** 100%

**Current Value:** TBD

**Status:** ⏳ Pending

**Notes:**
- Every list should have empty state
- Should provide guidance
- Should encourage action

---

### Error Handling

**Definition:** Percentage of error scenarios with proper handling.

**Target:** 100%

**Current Value:** TBD

**Status:** ⏳ Pending

**Notes:**
- Network errors
- Validation errors
- Authentication errors
- All should be handled gracefully

---

### Loading States

**Definition:** Percentage of async operations with loading states.

**Target:** 100%

**Current Value:** TBD

**Status:** ⏳ Pending

**Notes:**
- Skeleton screens preferred
- No generic spinners
- Should match final UI

---

### Motion Consistency

**Definition:** Percentage of animations following design system motion tokens.

**Target:** 100%

**Current Value:** TBD

**Status:** ⏳ Pending

**Notes:**
- Use defined durations
- Use defined easing
- Respect reduced motion

---

### Touch Target Size

**Definition:** Percentage of interactive elements with minimum 44px touch targets.

**Target:** 100%

**Current Value:** TBD

**Status:** ⏳ Pending

**Notes:**
- Critical for mobile
- Measured on mobile view
- 48px preferred

---

## Accessibility Metrics

### Keyboard Navigation

**Definition:** Percentage of interactive elements keyboard accessible.

**Target:** 100%

**Current Value:** TBD

**Status:** ⏳ Pending

**Notes:**
- All buttons, links, inputs
- Tab order logical
- Focus visible

---

### Screen Reader Support

**Definition:** Percentage of UI elements with proper ARIA labels.

**Target:** 100%

**Current Value:** TBD

**Status:** ⏳ Pending

**Notes:**
- All interactive elements
- All icons with meaning
- All form fields labeled

---

### Color Contrast

**Definition:** Percentage of text elements meeting WCAG AA contrast ratios.

**Target:** 100%

**Current Value:** TBD

**Status:** ⏳ Pending

**Notes:**
- 4.5:1 for normal text
- 3:1 for large text
- Measured with design tokens

---

### Reduced Motion

**Definition:** Percentage of animations respecting reduced motion preference.

**Target:** 100%

**Current Value:** TBD

**Status:** ⏳ Pending

**Notes:**
- System preference honored
- All animations conditional
- No motion when disabled

---

### Focus Management

**Definition:** Percentage of modal/dialog interactions with proper focus management.

**Target:** 100%

**Current Value:** TBD

**Status:** ⏳ Pending

**Notes:**
- Focus trapped in modals
- Focus returned on close
- Focus moved to new content

---

## Security Metrics

### Vulnerability Count

**Definition:** Number of high/critical security vulnerabilities in dependencies.

**Target:** 0

**Current Value:** TBD

**Status:** ⏳ Pending

**Notes:**
- Audited via npm audit
- All high/critical must be patched
- Regular dependency updates

---

### API Security

**Definition:** Percentage of API endpoints with authentication checks.

**Target:** 100%

**Current Value:** TBD

**Status:** ⏳ Pending

**Notes:**
- All protected routes
- User isolation
- No public data exposure

---

### Data Encryption

**Definition:** Percentage of sensitive data encrypted at rest.

**Target:** 100%

**Current Value:** TBD

**Status:** ⏳ Pending

**Notes:**
- Supabase RLS
- No plaintext storage
- Encryption in transit (HTTPS)

---

## Testing Metrics

### Test Coverage

**Definition:** Percentage of code covered by automated tests.

**Target:** > 80%

**Current Value:** TBD

**Status:** ⏳ Pending

**Notes:**
- Unit + integration tests
- Critical paths prioritized
- E2E for key flows

---

### Critical Path Coverage

**Definition:** Percentage of critical user flows covered by E2E tests.

**Target:** 100%

**Current Value:** TBD

**Status:** ⏳ Pending

**Notes:**
- Capture flow
- Today view
- Timeline view
- Authentication

---

## Performance Metrics

### API Response Time

**Definition:** 95th percentile API response time.

**Target:** < 500ms

**Current Value:** TBD

**Status:** ⏳ Pending

**Notes:**
- Measured in production
- All endpoints
- Includes database queries

---

### Database Query Time

**Definition:** 95th percentile database query time.

**Target:** < 200ms

**Current Value:** TBD

**Status:** ⏳ Pending

**Notes:**
- All queries optimized
- Indexes where needed
- No N+1 queries

---

### Image Optimization

**Definition:** Percentage of images optimized (WebP, lazy loaded).

**Target:** 100%

**Current Value:** TBD

**Status:** ⏳ Pending

**Notes:**
- Next.js Image component
- Responsive images
- Lazy loading

---

## Scorecard Maintenance

### Update Frequency

- Weekly during active development
- Before each release
- After major changes

### Responsibility

- Engineering lead updates technical metrics
- Product lead updates product metrics
- UX lead updates UX metrics
- QA lead validates all metrics

### Escalation

- Any metric failing target triggers review
- Critical metrics block release
- All metrics tracked over time

---

## Related Documentation

- **Product Manifesto**: `validation/PRODUCT_MANIFESTO.md` - Core beliefs
- **MVP Checklist**: `validation/MVP_CHECKLIST.md` - Launch requirements
- **Release Criteria**: `validation/RELEASE_CRITERIA.md` - Release blockers
- **Validation Process**: `validation/VALIDATION_PROCESS.md` - How to validate

---

**Note:** This scorecard is a living document. Metrics will be refined as we learn more about what matters most for Luma's success. Current values will be populated during the first comprehensive audit.
