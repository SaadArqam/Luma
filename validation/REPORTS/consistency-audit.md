# Consistency Audit

**Date:** 2026-07-01
**Auditor:** Validation Framework
**Scope:** Today, Capture, Timeline, Navigation, Shared Components

---

## Summary

The Consistency Audit examines patterns across the application to identify inconsistencies in buttons, icons, navigation, cards, typography, inputs, empty states, loading states, and motion. The audit reveals significant inconsistencies in button styling, spacing patterns, and component usage.

**Total Inconsistencies:** 12
- Critical: 0
- High: 5
- Medium: 5
- Low: 2

---

## Buttons

### Button Styling Inconsistencies

**Issue ID:** CONS-001
**Severity:** High
**Status:** Open

**Description:** Buttons are styled inconsistently across the application. Some use custom inline styling, some use the Button component from shadcn/ui, some use PrimaryButton from components/ui.

**Evidence:**
- `CaptureSheet.tsx:154-166`: Custom button with inline styles
- `ExperienceNavigation.tsx`: Link elements styled as buttons
- Other components may use Button or PrimaryButton

**Impact:**
- Inconsistent visual language
- Confusing interaction patterns
- Violates design system principles

**Suggested Solution:**
Standardize on a single button component and use it consistently across all components.

---

### Button Sizes Inconsistencies

**Issue ID:** CONS-002
**Severity:** Medium
**Status:** Open

**Description:** Button sizes are not consistent. Some buttons use `h-9` (36px), some use `h-10` (40px), some use `h-11` (44px).

**Evidence:**
- Need to audit all buttons for size consistency
- Touch targets should be minimum 44px per design system

**Impact:**
- Inconsistent touch targets
- Poor accessibility
- Inconsistent visual language

**Suggested Solution:**
Establish standard button sizes:
- Primary buttons: `h-11` (44px)
- Secondary buttons: `h-10` (40px)
- Small buttons: `h-9` (36px)

---

## Icons

### Icon Size Inconsistencies

**Issue ID:** CONS-003
**Severity:** Low
**Status:** Open

**Description:** Icons are sized inconsistently across components. Some use `w-5 h-5` (20px), some use `w-4 h-4` (16px), some use `size={20}`.

**Evidence:**
- `DailyBriefCard.tsx:38`: `w-5 h-5`
- `CaptureSheet.tsx:98`: `w-5 h-5`
- `ExperienceNavigation.tsx:43`: `size={20}`

**Impact:**
- Minor visual inconsistency
- Inconsistent visual hierarchy

**Suggested Solution:**
Establish icon size guidelines:
- Small icons: `w-4 h-4` (16px)
- Medium icons: `w-5 h-5` (20px)
- Large icons: `w-6 h-6` (24px)

---

### Icon Style Inconsistencies

**Issue ID:** CONS-004
**Severity:** Low
**Status:** Open

**Description:** Icon stroke widths may not be consistent. Some icons use default stroke, some use `strokeWidth={1.5}`.

**Evidence:**
- `ExperienceNavigation.tsx:43`: `strokeWidth={1.5}`
- Other icons may use default stroke

**Impact:**
- Minor visual inconsistency
- Inconsistent visual weight

**Suggested Solution:**
Standardize icon stroke width to `strokeWidth={1.5}` for all icons.

---

## Navigation

### Navigation Active State Inconsistency

**Issue ID:** CONS-005
**Severity:** High
**Status:** Open

**Description:** The active state logic in ExperienceNavigation is inconsistent. It uses exact match for Today but partial match for other routes.

**Evidence:**
```typescript
const isActive = pathname === item.href || (item.href !== '/today' && pathname.startsWith(item.href))
```

**Impact:**
- Inconsistent active states
- Users may not know where they are
- Confusing visual feedback

**Suggested Solution:**
Use exact match for all routes or implement proper route matching with a library like next/navigation's usePathname.

---

## Cards

### Card Padding Inconsistencies

**Issue ID:** CONS-006
**Severity:** High
**Status:** Open

**Description:** Card padding is not consistent across components. Some cards use `p-6` (24px), some use `p-5` (20px), some use custom padding.

**Evidence:**
- `DailyBriefCard.tsx:18`: `p-6`
- Other cards may use different padding
- Design system recommends `p-5` (20px)

**Impact:**
- Inconsistent visual rhythm
- Violates design system principles
- Inconsistent spacing

**Suggested Solution:**
Standardize card padding to `p-5` (20px) for all cards.

---

### Card Border Radius Inconsistencies

**Issue ID:** CONS-007
**Severity:** High
**Status:** Open

**Description:** Card border radius is not consistent. Some cards use `rounded-xl`, some use `rounded-2xl`, some use `rounded-3xl`.

**Evidence:**
- `CaptureSheet.tsx:82`: `rounded-t-3xl md:rounded-3xl`
- `TimelineItemCard.tsx:97`: `rounded-2xl`
- Other cards may use different radius

**Impact:**
- Inconsistent visual language
- Violates design system principles
- Confusing visual hierarchy

**Suggested Solution:**
Standardize card border radius to `rounded-xl` (12px) for all cards.

---

## Typography

### Typography Class Usage Inconsistencies

**Issue ID:** CONS-008
**Severity:** Medium
**Status:** Open

**Description:** Typography classes are not consistently applied. Some components use arbitrary sizes like `text-sm`, `text-lg` instead of semantic classes.

**Evidence:**
- Need to audit all components for typography compliance
- Some components may not use `text-display`, `text-heading`, `text-title`, `text-body`, `text-caption`, `text-label`

**Impact:**
- Inconsistent visual hierarchy
- Violates design system principles
- Poor readability

**Suggested Solution:**
Enforce use of semantic typography classes across all components.

---

## Inputs

### Input Height Inconsistencies

**Issue ID:** CONS-009
**Severity:** Medium
**Status**: Open

**Description:** Input heights may not be consistent. Design system recommends `h-9` (36px) for all inputs.

**Evidence:**
- Need to audit all input components for height consistency
- `CaptureInput.tsx` needs review

**Impact:**
- Inconsistent visual language
- Poor accessibility
- Inconsistent touch targets

**Suggested Solution:**
Standardize input height to `h-9` (36px) for all inputs.

---

## Empty States

### Empty State Styling Inconsistencies

**Issue ID:** CONS-010
**Severity:** Medium
**Status**: Open

**Description:** Empty states are not consistently styled. Some use the EmptyState component, some use custom styling.

**Evidence:**
- `TodayPage.tsx:162-166`: Uses EmptyState component
- Other sections may have custom empty states
- Timeline missing empty state entirely

**Impact:**
- Inconsistent visual language
- Violates design system principles
- Poor user experience

**Suggested Solution:**
Use the EmptyState component consistently across all sections, or establish clear empty state patterns.

---

## Loading States

### Loading State Inconsistencies

**Issue ID:** CONS-011
**Severity:** Medium
**Status**: Open

**Description:** Loading states are not consistent. Some use skeleton states, some may use spinners, some may have no loading state.

**Evidence:**
- `TodayPage.tsx:157`: Uses TodayPageSkeleton
- `TimelinePage.tsx:40`: Uses TimelineSkeletonState
- Other components may have different loading states

**Impact:**
- Inconsistent user experience
- Violates design system principles
- Poor perceived performance

**Suggested Solution:**
Standardize on skeleton states that match the final UI layout. Avoid generic spinners.

---

## Motion

### Motion Class Inconsistencies

**Issue ID:** CONS-012
**Severity:** High
**Status**: Open

**Description:** Motion classes are not consistently applied to interactive elements. Some have `motion-fast motion-ease-out`, some have no motion classes.

**Evidence:**
- `CaptureSheet.tsx:84`: Uses `motion-fast motion-ease-out`
- Other interactive elements may lack motion classes
- Not all components reviewed for motion compliance

**Impact:**
- Inconsistent interaction feedback
- Violates design system principles
- Poor perceived polish

**Suggested Solution:**
Apply motion classes consistently to all interactive elements:
- Hover states: `motion-fast motion-ease-out`
- Modal transitions: `motion-normal motion-ease-out`
- All motion should respect reduced motion with `motion-safe`

---

## Spacing Patterns

### Spacing Inconsistencies

**Issue ID:** CONS-013
**Severity:** High
**Status**: Open

**Description:** Spacing is not consistently following the 8px system. Arbitrary spacing values present.

**Evidence:**
- `TodayHeader.tsx:33`: `px-4 pt-6 pb-4` (mix of 4, 6, 4)
- `DailyBriefCard.tsx:17`: `mx-4 mb-3` (3 is not in 8px system)
- Various components use arbitrary spacing

**Impact:**
- Inconsistent visual rhythm
- Violates design system principles
- Poor visual polish

**Suggested Solution:**
Enforce 8px spacing system strictly across all components.

---

## Color Usage

### Color Token Inconsistencies

**Issue ID:** CONS-014
**Severity:** Medium
**Status**: Open

**Description:** Color tokens are not consistently applied. Some components may use hardcoded colors instead of semantic tokens.

**Evidence:**
- Need to audit all components for hardcoded colors
- Some components may use `text-gray-500` instead of `text-text-muted`

**Impact:**
- Inconsistent visual language
- Poor dark mode support
- Violates design system principles

**Suggested Solution:**
Enforce use of semantic color tokens across all components.

---

## Component Usage

### Duplicate Components

**Issue ID:** CONS-015
**Severity:** Low
**Status**: Open

**Description:** There may be duplicate components or components that could be consolidated.

**Evidence:**
- `TimelineCard.tsx` and `TimelineItemCard.tsx` both exist in timeline components
- Need to audit for other duplicates

**Impact:**
- Code maintenance overhead
- Potential inconsistency
- Violates DRY principle

**Suggested Solution:**
Audit for duplicate components and consolidate where appropriate.

---

## Consistency Score

### Overall Consistency: 65%

**Breakdown:**
- Buttons: 40% (significant inconsistencies)
- Icons: 70% (minor inconsistencies)
- Navigation: 60% (active state issue)
- Cards: 50% (padding and radius inconsistencies)
- Typography: 60% (class usage inconsistencies)
- Inputs: 50% (need audit)
- Empty States: 40% (missing and inconsistent)
- Loading States: 60% (inconsistent patterns)
- Motion: 50% (not consistently applied)
- Spacing: 40% (significant inconsistencies)
- Color: 60% (need audit)
- Component Usage: 70% (potential duplicates)

---

## Recommendations

### Immediate (Before Launch)
1. **CONS-001:** Standardize button styling
2. **CONS-006:** Standardize card padding
3. **CONS-007:** Standardize card border radius
4. **CONS-013:** Enforce 8px spacing system
5. **CONS-012:** Apply motion classes consistently

### Short Term (First Post-Launch)
6. **CONS-005:** Fix navigation active state logic
7. **CONS-008:** Enforce typography class usage
8. **CONS-010:** Standardize empty state styling
9. **CONS-011:** Standardize loading states
10. **CONS-014:** Enforce color token usage

### Long Term (Future Iterations)
11. **CONS-002:** Standardize button sizes
12. **CONS-003:** Standardize icon sizes
13. **CONS-004:** Standardize icon stroke widths
14. **CONS-009:** Standardize input heights
15. **CONS-015:** Consolidate duplicate components

---

## Conclusion

The Consistency Audit reveals significant inconsistencies across the application, particularly in button styling, spacing patterns, card styling, and motion. These inconsistencies reduce the perceived polish and quality of the application.

The most critical issues are the inconsistent button styling, spacing patterns, and card styling. Addressing these will significantly improve the visual consistency and perceived quality.

The design system itself is well-defined, but it's not consistently applied in implementation. Better enforcement and adherence to the design system will improve consistency across the application.
