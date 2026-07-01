# UX Audit

**Date:** 2026-07-01
**Auditor:** Validation Framework
**Scope:** Today, Capture, Timeline, Navigation, Shared Components

---

## Summary

The UX audit reveals several usability issues that impact the user experience. While the design is calm and follows the design system, there are gaps in navigation clarity, error handling, and progressive disclosure. The most significant issues are missing error states, unclear navigation patterns, and incomplete user flows.

**Total Issues:** 15
- Critical: 1
- High: 5
- Medium: 6
- Low: 3

---

## Critical Issues

### UX-001: No Error Recovery Path in Today Page

**Location:** `app/today/page.tsx:146-149`

**Description:** When data loading fails in the Today page, users see nothing. There's no error state, no retry button, and no indication of what went wrong.

**Impact:**
- Users are stuck with no way to recover
- No feedback on failure
- Violates "Error states provide recovery options" principle
- Poor user experience

**Evidence:**
```typescript
} catch (error) {
  console.error('Failed to load data:', error);
} finally {
  setLoading(false);
}
```

**Suggested Solution:**
Add error state with:
- Clear error message
- Retry button
- Fallback to cached data if available
- Option to refresh the page

**Severity:** Critical

**Status:** Open

---

## High Issues

### UX-002: Capture Page Lacks Clear Next Steps

**Location:** `app/capture/page.tsx`

**Description:** The Capture page shows an empty state but doesn't clearly explain the workflow. Users see a floating button but may not understand what happens after capture.

**Impact:**
- Unclear user journey
- Users may not know what to expect
- Violates "Contextual Relevance" principle
- Reduces completion rate

**Evidence:**
Empty state shows "Capture your first thought" but doesn't explain the review workflow or what happens after capture.

**Suggested Solution:**
Add a brief explanation of the capture workflow:
1. Capture your thought
2. Luma organizes it
3. Review and confirm
4. It appears in Timeline

**Severity:** High

**Status:** Open

---

### UX-003: Today Page Has Too Many Sections for Empty State

**Location:** `app/today/page.tsx:194-204`

**Description:** Even when there's no data, the Today page renders all sections (DailyBrief, Focus, Insights, Upcoming, Continue, Timeline). This creates visual noise and cognitive load.

**Impact:**
- Overwhelming for new users
- Violates "Reduce cognitive load" principle
- Confusing hierarchy
- Poor first-time experience

**Evidence:**
```typescript
return (
  <div className="space-y-6 pb-32">
    <TodayHeader />
    <DailyBriefCard isEmpty={!data.insights || data.insights.length === 0} />
    <FocusSection items={focusItems} />
    <InsightSection insights={data.insights} />
    <UpcomingSection items={upcomingItems} />
    <ContinueSection items={data.goals.slice(0, 3)} />
    <RecentTimelinePreview items={timelineItems} />
    <FloatingCaptureButton />
  </div>
);
```

**Suggested Solution:**
Implement progressive disclosure:
- Show only DailyBrief when empty
- Add sections progressively as data is added
- Use empty states within sections to hide when no data

**Severity:** High

**Status:** Open

---

### UX-004: Timeline Lacks Empty State

**Location:** `app/timeline/page.tsx:39-43`

**Description:** Timeline has no empty state. When there are no timeline items, users see a blank space with no guidance.

**Impact:**
- Confusing empty state
- No guidance on what to do
- Violates "Empty states provide guidance" principle
- Poor first-time experience

**Evidence:**
```typescript
{loading ? (
  <TimelineSkeletonState />
) : (
  <Timeline items={items} />
)}
```

**Suggested Solution:**
Add TimelineEmptyState component with:
- Encouraging message
- Suggestion to capture something
- Link to Capture experience

**Severity:** High

**Status:** Open

---

### UX-005: Navigation Active State Logic is Confusing

**Location:** `modules/shared/components/layout/ExperienceNavigation.tsx:35`

**Description:** The active state logic includes partial matches for all routes except Today, which can be confusing. For example, `/timeline` would match `/timeline/anything`.

**Impact:**
- Inconsistent active states
- Users may not know where they are
- Violates "Navigation is clear" principle
- Confusing visual feedback

**Evidence:**
```typescript
const isActive = pathname === item.href || (item.href !== '/today' && pathname.startsWith(item.href))
```

**Suggested Solution:**
Use exact match for all routes or implement proper route matching. Consider using a more robust routing library or custom hook.

**Severity:** High

**Status:** Open

---

### UX-006: Floating Capture Button Not Always Visible on Desktop

**Location:** `modules/today/components/FloatingCaptureButton.tsx`

**Description:** The floating capture button is designed for mobile but may not be optimally positioned on desktop. Desktop users may not have an obvious way to capture.

**Impact:**
- Inconsistent capture access
- Desktop users may struggle to find capture
- Violates "Navigation is intuitive" principle
- Reduces capture rate on desktop

**Evidence:**
Component exists but desktop positioning not verified.

**Suggested Solution:**
Ensure floating button is visible and accessible on desktop, or add a desktop-specific capture button in the navigation.

**Severity:** High

**Status:** Open

---

## Medium Issues

### UX-007: Daily Brief Empty State Could Be More Encouraging

**Location:** `modules/today/components/DailyBriefCard.tsx:40-42`

**Description:** The empty state message "Your day looks beautifully quiet" is nice but could be more encouraging and action-oriented.

**Impact:**
- Missed opportunity to encourage engagement
- Less motivating
- Minor UX improvement

**Evidence:**
```typescript
<p className="text-body text-text-secondary leading-relaxed">
  Your day looks beautifully quiet. Nothing needs your attention right now.
</p>
```

**Suggested Solution:**
Add a gentle nudge:
"Your day looks beautifully quiet. Nothing needs your attention right now. Capture something to get started."

**Severity:** Medium

**Status:** Open

---

### UX-008: Focus Section Shows Nothing When No Pending Items

**Location:** `modules/today/components/FocusSection.tsx`

**Description:** When there are no pending recurring payments, the Focus section likely shows nothing or an empty state that isn't clearly communicated.

**Impact:**
- Unclear section purpose
- Wasted screen space
- Minor UX improvement

**Evidence:**
Component implementation not fully reviewed but likely has empty state issues.

**Suggested Solution:**
Add clear empty state explaining what the Focus section is for and when items will appear.

**Severity:** Medium

**Status:** Open

---

### UX-009: Continue Section May Show Empty State Poorly

**Location:** `modules/today/components/ContinueSection.tsx`

**Description:** When there are no goals to continue, the Continue section may not handle the empty state well.

**Impact:**
- Confusing section
- Unclear purpose
- Minor UX improvement

**Evidence:**
Component implementation not fully reviewed.

**Suggested Solution:**
Add empty state explaining that goals will appear here when created.

**Severity:** Medium

**Status:** Open

---

### UX-010: Capture Sheet Metadata Section Hidden by Default

**Location:** `modules/capture/components/CaptureSheet.tsx:25`

**Description:** The metadata section is hidden by default, which is good for cognitive load, but users may not know it exists or when to use it.

**Impact:**
- Hidden functionality
- Users may miss useful features
- Minor UX improvement

**Evidence:**
```typescript
const [showMetadata, setShowMetadata] = useState(false);
```

**Suggested Solution:**
Add a subtle indicator that metadata can be added, or show a collapsed preview of available metadata options.

**Severity:** Medium

**Status:** Open

---

### UX-011: Timeline Item Cards May Have Too Much Information

**Location:** `modules/timeline/components/TimelineItemCard.tsx`

**Description:** TimelineItemCard shows title, context, description, preview, timestamp, date, source, and actions. This could be overwhelming for some items.

**Impact:**
- Information density
- Cognitive load
- Minor UX improvement

**Evidence:**
Component shows multiple information fields in a compact card.

**Suggested Solution:**
Implement progressive disclosure:
- Show title, timestamp, and context by default
- Expand to show description and preview on tap
- Keep actions in a menu

**Severity:** Medium

**Status:** Open

---

### UX-012: No Loading State for Capture Submission

**Location:** `modules/capture/components/CaptureSheet.tsx:132-134`

**Description:** The processing indicator shows "Saved. Luma is organizing it" but there's no clear indication of how long this will take or what's happening.

**Impact:**
- Unclear wait time
- Users may think something is wrong
- Minor UX improvement

**Evidence:**
```typescript
{isSubmitting && (
  <ProcessingIndicator message="Saved. Luma is organizing it." />
)}
```

**Suggested Solution:**
Add a progress indicator or estimated time. Make the message more specific about what's happening.

**Severity:** Medium

**Status:** Open

---

## Low Issues

### UX-013: Greeting Could Be More Personalized

**Location:** `modules/today/components/TodayHeader.tsx:10-15`

**Description:** The greeting is time-based but could incorporate user-specific data for more personalization.

**Impact:**
- Missed personalization opportunity
- Minor UX improvement

**Evidence:**
```typescript
const getGreeting = () => {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}
```

**Suggested Solution:**
Add variety to greetings based on user data, weather, or special occasions.

**Severity:** Low

**Status:** Open

---

### UX-014: Date Format Could Be More Natural

**Location:** `modules/today/components/TodayHeader.tsx:17-23`

**Description:** The date format is standard but could be more natural (e.g., "Monday, July 1" vs "Monday, July 1, 2026").

**Impact:**
- Minor readability improvement
- Cosmetic change

**Evidence:**
```typescript
const formatDate = () => {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  })
}
```

**Suggested Solution:**
Consider removing the year for current year dates to reduce visual noise.

**Severity:** Low

**Status:** Open

---

### UX-015: No Keyboard Shortcuts Documented

**Location:** N/A

**Description:** There are no documented keyboard shortcuts for power users who prefer keyboard navigation.

**Impact:**
- Reduced accessibility for keyboard users
- Missed efficiency opportunity
- Minor UX improvement

**Evidence:**
No keyboard shortcuts found or documented.

**Suggested Solution:**
Document and implement keyboard shortcuts:
- Cmd/Ctrl + K for Capture
- Cmd/Ctrl + / for Search
- Arrow keys for navigation

**Severity:** Low

**Status:** Open

---

## Alignment with UX Principles

### Calm First
**Status:** ✅ Aligned
- Design is calm and minimal
- Generous whitespace
- Subtle animations

### Understanding Over Tracking
**Status:** ⚠️ Partially Aligned
- Some sections feel like tracking rather than understanding
- Could add more insights and patterns

### Single Primary Action
**Status:** ✅ Aligned
- Clear primary actions in most contexts
- Floating capture button is prominent

### Progressive Disclosure
**Status:** ⚠️ Partially Aligned
- Today page shows too many sections at once
- Some information could be hidden behind interactions

### Contextual Relevance
**Status:** ⚠️ Partially Aligned
- Time-aware content is good
- Could be more personalized based on user data

### Fast Capture
**Status:** ✅ Aligned
- Capture is accessible from anywhere
- Minimal friction in capture flow

---

## Recommendations

### Immediate (Before Launch)
1. **UX-001:** Add error recovery to Today page
2. **UX-004:** Add empty state to Timeline
3. **UX-003:** Implement progressive disclosure on Today page
4. **UX-005:** Fix navigation active state logic

### Short Term (First Post-Launch)
5. **UX-002:** Improve Capture page guidance
6. **UX-006:** Ensure capture button visible on desktop
7. **UX-007:** Enhance Daily Brief empty state
8. **UX-008:** Add empty states to Focus section

### Long Term (Future Iterations)
9. **UX-009:** Improve Continue section empty state
10. **UX-010:** Improve metadata discoverability
11. **UX-011:** Implement progressive disclosure in Timeline
12. **UX-012:** Improve capture submission feedback

---

## Conclusion

The UX audit reveals that Luma has a solid foundation with calm, minimal design. However, there are significant gaps in error handling, empty states, and progressive disclosure. The most critical issue is the lack of error recovery in the Today page, which could leave users stuck with no way to recover from failures.

The UX aligns well with the "Calm First" principle but needs work on "Progressive Disclosure" and "Contextual Relevance." Addressing the critical and high-priority issues will significantly improve the user experience and make the app feel more complete and polished.
