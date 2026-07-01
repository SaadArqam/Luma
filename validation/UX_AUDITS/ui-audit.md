# UI Audit

**Date:** 2026-07-01
**Auditor:** Validation Framework
**Scope:** Today, Capture, Timeline, Navigation, Shared Components

---

## Summary

The UI audit reveals that Luma follows the design system well in most areas, with consistent use of design tokens and typography classes. However, there are some inconsistencies in spacing, border radius usage, and component patterns. The overall visual hierarchy is clear, but some components could benefit from better visual consistency.

**Total Issues:** 10
- Critical: 0
- High: 3
- Medium: 5
- Low: 2

---

## High Issues

### UI-001: Inconsistent Border Radius Usage

**Location:** Multiple components

**Description:** Different components use different border radius values without clear rationale. Some use `rounded-xl`, some `rounded-2xl`, some `rounded-3xl`. This creates visual inconsistency.

**Impact:**
- Inconsistent visual language
- Violates design system principles
- Reduces perceived polish
- Confusing visual hierarchy

**Evidence:**
- `CaptureSheet.tsx:82`: `rounded-t-3xl md:rounded-3xl`
- `TimelineItemCard.tsx:97`: `rounded-2xl`
- `DailyBriefCard.tsx`: Uses Card component (default radius)
- Various buttons use different radius values

**Suggested Solution:**
Establish clear border radius usage guidelines:
- Cards: `rounded-xl` (12px)
- Modals/Sheets: `rounded-2xl` (16px)
- Buttons: `rounded-xl` (12px)
- Inputs: `rounded-xl` (12px)

**Severity:** High

**Status:** Open

---

### UI-002: Inconsistent Spacing Patterns

**Location:** Multiple components

**Description:** Spacing is not always consistent with the 8px system. Some components use arbitrary values like `py-16` (64px) while others use `p-6` (24px). The spacing scale is not consistently applied.

**Impact:**
- Inconsistent visual rhythm
- Violates design system principles
- Reduces perceived polish
- Inconsistent padding

**Evidence:**
- `TodayHeader.tsx:33`: `px-4 pt-6 pb-4` (mix of 4, 6, 4)
- `DailyBriefCard.tsx:17`: `mx-4 mb-3` (mix of 4, 3)
- `CaptureSheet.tsx:83`: `p-6` (24px)
- Various components use different padding values

**Suggested Solution:**
Enforce 8px spacing system consistently:
- Section padding: `p-5` (20px) or `p-6` (24px)
- Card padding: `p-5` (20px)
- Gap between items: `space-y-4` (16px) or `space-y-6` (24px)
- Header padding: `px-4 pt-6 pb-4` should be `px-4 pt-5 pb-4` (consistent 4px increments)

**Severity:** High

**Status:** Open

---

### UI-003: Inconsistent Button Styling

**Location:** Multiple components

**Description:** Buttons are styled differently across the app. Some use custom styling, some use the Button component from shadcn/ui. This creates visual inconsistency.

**Impact:**
- Inconsistent visual language
- Confusing interaction patterns
- Violates design system principles
- Reduces perceived polish

**Evidence:**
- `CaptureSheet.tsx:154-166`: Custom button styling with inline styles
- `ExperienceNavigation.tsx`: Uses Link with custom styling
- Other components may use Button component

**Suggested Solution:**
Standardize on a single button component (PrimaryButton from components/ui or Button from shadcn/ui) and use it consistently across all components.

**Severity:** High

**Status:** Open

---

## Medium Issues

### UI-004: Typography Classes Not Always Applied

**Location:** Multiple components

**Description:** Some text elements don't use the defined typography classes (text-display, text-heading, text-title, text-body, text-caption, text-label). This creates inconsistent typography hierarchy.

**Impact:**
- Inconsistent visual hierarchy
- Violates design system principles
- Reduces readability
- Inconsistent font sizes

**Evidence:**
- Some components use `text-sm`, `text-lg` instead of semantic classes
- Not all components reviewed for typography compliance

**Suggested Solution:**
Enforce use of semantic typography classes:
- Page titles: `text-display`
- Section headings: `text-heading`
- Card titles: `text-title`
- Body text: `text-body`
- Captions: `text-caption`
- Labels: `text-label`

**Severity:** Medium

**Status:** Open

---

### UI-005: Color Usage Not Always Semantic

**Location:** Multiple components

**Description:** Some components use hardcoded colors or non-semantic color classes instead of the defined semantic tokens (text-primary, text-secondary, text-muted, accent, etc.).

**Impact:**
- Inconsistent color usage
- Violates design system principles
- Poor dark mode support
- Inconsistent visual language

**Evidence:**
- Some components may use `text-gray-500` instead of `text-text-muted`
- Not all components reviewed for color compliance

**Suggested Solution:**
Enforce use of semantic color tokens:
- Primary text: `text-text-primary`
- Secondary text: `text-text-secondary`
- Muted text: `text-text-muted`
- Accent: `text-accent` or `bg-accent`
- Backgrounds: `bg-background`, `bg-surface`, `bg-card`

**Severity:** Medium

**Status:** Open

---

### UI-006: Motion Classes Not Consistently Applied

**Location:** Multiple components

**Description:** Some interactive elements don't use the defined motion classes (motion-fast, motion-ease-out, motion-safe). This creates inconsistent animation behavior.

**Impact:**
- Inconsistent motion behavior
- Violates design system principles
- Jarring transitions
- Poor perceived polish

**Evidence:**
- `CaptureSheet.tsx:84`: Uses `motion-fast motion-ease-out`
- Other components may not use motion classes
- Not all interactive elements reviewed

**Suggested Solution:**
Apply motion classes consistently to all interactive elements:
- Hover states: `motion-fast motion-ease-out`
- Modal transitions: `motion-normal motion-ease-out`
- All motion should respect reduced motion with `motion-safe`

**Severity:** Medium

**Status:** Open

---

### UI-007: Shadow/Elevation Not Consistent

**Location:** Multiple components

**Description:** Different components use different shadow values. Some use `shadow-2xl`, some use `elevation-subtle`, some use no shadow. This creates inconsistent elevation.

**Impact:**
- Inconsistent visual hierarchy
- Violates design system principles
- Confusing depth perception
- Inconsistent visual language

**Evidence:**
- `CaptureSheet.tsx:85`: `shadow-2xl`
- `TimelineItemCard.tsx:29`: `elevation-subtle`
- Other components may use different shadows

**Suggested Solution:**
Establish clear elevation guidelines:
- Cards: `elevation-subtle`
- Modals/Sheets: `shadow-2xl`
- Floating elements: `elevation-medium`
- No arbitrary shadow values

**Severity:** Medium

**Status:** Open

---

### UI-008: Focus States Not Consistent

**Location:** Multiple components

**Description:** Focus states are not consistently implemented across interactive elements. Some have focus rings, some don't. This affects accessibility and visual consistency.

**Impact:**
- Poor keyboard navigation
- Inconsistent accessibility
- Violates design system principles
- Poor accessibility compliance

**Evidence:**
- Some buttons have focus states, others don't
- Not all interactive elements reviewed for focus states

**Suggested Solution:**
Ensure all interactive elements have consistent focus states:
- Use `focus:ring` or `focus-visible:ring`
- Consistent focus ring color and width
- Focus states should be visible but not overwhelming

**Severity:** Medium

**Status:** Open

---

## Low Issues

### UI-009: Icon Sizes Not Consistent

**Location:** Multiple components

**Description:** Icons are sized inconsistently across components. Some use `w-5 h-5`, some use `w-4 h-4`, some use `size={20}`. This creates visual inconsistency.

**Impact:**
- Inconsistent visual language
- Minor visual inconsistency
- Cosmetic issue

**Evidence:**
- `TodayHeader.tsx`: No icons
- `DailyBriefCard.tsx:38`: `w-5 h-5`
- `CaptureSheet.tsx:98`: `w-5 h-5`
- `ExperienceNavigation.tsx:43`: `size={20}`

**Suggested Solution:**
Establish icon size guidelines:
- Small icons: `w-4 h-4` (16px)
- Medium icons: `w-5 h-5` (20px)
- Large icons: `w-6 h-6` (24px)

**Severity:** Low

**Status:** Open

---

### UI-010: Border Opacity Not Consistent

**Location:** Multiple components

**Description:** Border opacity is not consistently applied. Some borders use `border-border`, some use `border-border/50`, some use hardcoded colors.

**Impact:**
- Inconsistent visual language
- Minor visual inconsistency
- Cosmetic issue

**Evidence:**
- Some components use `border-border`
- Some use `border-border/50`
- Not all components reviewed

**Suggested Solution:**
Establish border opacity guidelines:
- Primary borders: `border-border`
- Subtle borders: `border-border/50`
- No hardcoded border colors

**Severity:** Low

**Status:** Open

---

## Visual Hierarchy Assessment

### Today Page
**Status:** ✅ Good
- Clear heading hierarchy
- Good use of typography classes
- Appropriate spacing between sections

### Capture Page
**Status:** ⚠️ Fair
- Clear heading
- Empty state could be more visually engaging
- Capture sheet has good visual hierarchy

### Timeline Page
**Status:** ✅ Good
- Clear header
- Timeline items have good visual hierarchy
- Good use of icons and typography

### Navigation
**Status:** ✅ Good
- Clear active states
- Appropriate icon sizes
- Good spacing

---

## Alignment with Design System

### Design Tokens
**Status:** ⚠️ Partially Aligned
- Most components use design tokens
- Some hardcoded values remain
- Inconsistent spacing patterns

### Typography
**Status:** ⚠️ Partially Aligned
- Typography classes defined
- Not consistently applied
- Some components use arbitrary sizes

### Spacing
**Status:** ❌ Not Aligned
- 8px system defined
- Not consistently applied
- Arbitrary spacing values present

### Color
**Status:** ⚠️ Partially Aligned
- Semantic tokens defined
- Not consistently applied
- Some hardcoded colors

### Motion
**Status:** ⚠️ Partially Aligned
- Motion classes defined
- Not consistently applied
- Some animations missing motion classes

### Border Radius
**Status:** ❌ Not Aligned
- Border radius scale defined
- Not consistently applied
- Arbitrary radius values present

---

## Recommendations

### Immediate (Before Launch)
1. **UI-001:** Standardize border radius usage
2. **UI-002:** Enforce 8px spacing system
3. **UI-003:** Standardize button styling

### Short Term (First Post-Launch)
4. **UI-004:** Enforce typography class usage
5. **UI-005:** Enforce semantic color usage
6. **UI-008:** Ensure consistent focus states

### Long Term (Future Iterations)
7. **UI-006:** Apply motion classes consistently
8. **UI-007:** Standardize shadow/elevation
9. **UI-009:** Standardize icon sizes
10. **UI-010:** Standardize border opacity

---

## Conclusion

The UI audit reveals that Luma has a solid design system foundation with well-defined tokens. However, the implementation is not consistently applying these tokens across all components. The most significant issues are inconsistent border radius usage, spacing patterns, and button styling.

Addressing these inconsistencies will significantly improve the visual polish and perceived quality of the application. The design system itself is well-designed, but needs better enforcement and adherence in implementation.
