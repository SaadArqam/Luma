# Review Guidelines

This document documents the review process. Every review should inspect the product from multiple perspectives.

---

## Review Perspectives

Every feature, change, or release should be reviewed from the following perspectives:

---

## Product Manager Perspective

### Core Questions

- What user problem does this solve?
- Is this required for MVP?
- Does this align with the Product Manifesto?
- Will users understand this without training?
- Is this the simplest possible solution?
- What is the opportunity cost of building this?
- How will we measure success?

### Review Checklist

- [ ] User problem is clearly defined
- [ ] Solution addresses the problem directly
- [ ] Aligns with Product Manifesto principles
- [ ] Reduces cognitive load
- [ ] Feels calm and intentional
- [ ] Success metrics are defined
- [ ] Trade-offs are documented
- [ ] Alternative approaches were considered

### Red Flags

- Solves a problem users don't have
- Adds complexity without clear benefit
- Violates Product Manifesto
- No clear success metrics
- "Nice to have" without justification

---

## UX Designer Perspective

### Core Questions

- Is this the simplest possible experience?
- Does it feel calm?
- Does it feel personal?
- Would a first-time user understand it?
- Is there anything unnecessary?
- Is there anything missing?
- Does it follow established patterns?

### Review Checklist

- [ ] Navigation is clear and intuitive
- [ ] Information hierarchy is logical
- [ ] Empty states provide guidance
- [ ] Error states are helpful
- [ ] Loading states are reassuring
- [ ] Touch targets are appropriate
- [ ] Motion is subtle and purposeful
- [ ] Progressive disclosure is used
- [ ] Context is considered
- [ ] Reduces cognitive load

### Red Flags

- Overwhelming information density
- Confusing terminology
- Hidden features
- Inconsistent patterns
- Unnecessary steps
- Missing states (empty, error, loading)

---

## UI Designer Perspective

### Core Questions

- Does this follow the design system?
- Are design tokens used correctly?
- Is visual hierarchy clear?
- Is spacing consistent?
- Is color usage appropriate?
- Does it feel like Luma?

### Review Checklist

- [ ] Design tokens are used (no hardcoded values)
- [ ] Typography follows hierarchy
- [ ] Color usage is consistent
- [ ] Spacing follows 8px system
- [ ] Border radius is consistent
- [ ] Shadows/elevation is appropriate
- [ ] Motion follows design system
- [ ] Components are reused
- [ ] No duplicate components
- [ ] Responsive behavior is correct

### Red Flags

- Hardcoded colors, spacing, or typography
- Inconsistent component styles
- One-off designs
- Breaking design system patterns
- Visual clutter
- Poor contrast

---

## Frontend Engineer Perspective

### Core Questions

- Is the code maintainable?
- Is it performant?
- Is it accessible?
- Is it secure?
- Does it follow best practices?
- Is it testable?

### Review Checklist

- [ ] TypeScript strict mode compliance
- [ ] No `any` types
- [ ] Proper error handling
- [ ] No memory leaks
- [ ] Optimized re-renders
- [ ] Proper state management
- [ ] Separation of concerns
- [ ] Reusable components
- [ ] No circular dependencies
- [ ] Code is well-commented

### Red Flags

- TypeScript errors
- ESLint errors
- Console warnings
- Performance bottlenecks
- Accessibility failures
- Security vulnerabilities
- Spaghetti code

---

## QA Engineer Perspective

### Core Questions

- Are there edge cases?
- What happens when things fail?
- Is this testable?
- Are there race conditions?
- Is this robust?

### Review Checklist

- [ ] All user paths tested
- [ ] Error scenarios tested
- [ ] Edge cases tested
- [ ] Network failure tested
- [ ] Offline behavior tested
- [ ] Cross-browser tested
- [ ] Mobile tested
- [ ] Desktop tested
- [ ] Accessibility tested
- [ ] Performance tested

### Red Flags

- Untested code paths
- Missing error handling
- Race conditions
- Memory leaks
- Performance issues
- Accessibility failures

---

## Accessibility Engineer Perspective

### Core Questions

- Is this keyboard accessible?
- Does it work with screen readers?
- Is color contrast sufficient?
- Does it respect reduced motion?
- Is focus managed correctly?

### Review Checklist

- [ ] All interactive elements keyboard accessible
- [ ] Tab order is logical
- [ ] Focus is visible
- [ ] ARIA labels are present
- [ ] Screen reader testing completed
- [ ] Color contrast meets WCAG AA
- [ ] Reduced motion is respected
- [ ] Focus management works in modals
- [ ] Forms are properly labeled
- [ ] Dynamic content is announced

### Red Flags

- Keyboard traps
- Missing ARIA labels
- Poor contrast
- No reduced motion support
- Poor focus management
- Unlabeled form fields

---

## Performance Engineer Perspective

### Core Questions

- Is this performant?
- Will it scale?
- Are there bottlenecks?
- Is bundle size optimized?
- Are animations smooth?

### Review Checklist

- [ ] Bundle size impact measured
- [ ] Initial load time measured
- [ ] Runtime performance measured
- [ ] Memory usage measured
- [ ] Animation smoothness verified
- [ ] No layout thrashing
- [ ] Images optimized
- [ ] Code splitting appropriate
- [ ] Caching strategy defined
- [ ] Database queries optimized

### Red Flags

- Large bundle size
- Slow load times
- Memory leaks
- Layout thrashing
- Unoptimized images
- Slow database queries

---

## AI Engineer Perspective

### Core Questions

- Is AI invisible?
- Does this enhance without overwhelming?
- Are AI failures handled gracefully?
- Is this the right use of AI?
- Can we achieve the same without AI?

### Review Checklist

- [ ] AI is invisible to user
- [ ] AI failures handled gracefully
- [ ] Fallbacks exist
- [ ] AI is not the hero
- [ ] No "AI-powered" branding
- [ ] Smart defaults feel natural
- [ ] Insights are actionable
- [ ] Privacy is respected
- [ ] Data usage is transparent
- [ ] AI is used appropriately

### Red Flags

- AI branding in UI
- AI as primary feature
- No fallbacks
- Privacy concerns
- Over-engineering
- AI for AI's sake

---

## First-Time User Perspective

### Core Questions

- Do I understand what this is?
- Do I know what to do?
- Do I feel welcome?
- Is this intimidating?
- Would I come back?

### Review Checklist

- [ ] Purpose is clear
- [ ] Next steps are obvious
- [ ] Language is simple
- [ ] No jargon
- [ ] Feels welcoming
- [ ] Not overwhelming
- [ ] Guidance is available
- [ ] Mistakes are forgivable
- [ ] Progress is visible
- [ ] Value is immediate

### Red Flags

- Confusing terminology
- Overwhelming options
- No guidance
- Intimidating interface
- No clear value
- Punishing errors

---

## Skeptic Perspective

### Core Questions

- Why do we need this?
- What's wrong with the current approach?
- Is this worth the complexity?
- Will this actually get used?
- What are we giving up?

### Review Checklist

- [ ] Problem is real
- [ ] Solution is necessary
- [ ] Complexity is justified
- [ ] Adoption is likely
- [ ] Trade-offs are acceptable
- [ ] Maintenance cost is acceptable
- [ ] Opportunity cost is acceptable
- [ ] Alternative approaches were considered
- [ ] Evidence supports the decision
- [ ] This isn't scope creep

### Red Flags

- Solving non-existent problem
- Unnecessary complexity
- Low adoption likelihood
- High maintenance cost
- No evidence
- Scope creep

---

## Review Process

### Before Review

1. **Prepare**
   - Read the Product Manifesto
   - Understand the context
   - Review related documentation
   - Check previous reviews

2. **Set Context**
   - What is being reviewed?
   - Why is it being reviewed?
   - What are the success criteria?
   - What are the constraints?

### During Review

1. **Examine**
   - Review from your perspective
   - Ask your core questions
   - Go through your checklist
   - Identify red flags

2. **Document**
   - Note issues found
   - Note questions raised
   - Note suggestions
   - Note approvals

### After Review

1. **Communicate**
   - Share findings clearly
   - Prioritize issues
   - Suggest solutions
   - Block if necessary

2. **Follow Up**
   - Verify fixes
   - Re-review if needed
   - Document resolution
   - Update checklist

---

## Severity Levels

### Critical

Must be fixed before proceeding.

Examples:
- Security vulnerability
- Broken user flow
- Accessibility failure
- Performance blocker

### High

Should be fixed before release.

Examples:
- UX confusion
- Design system violation
- Code quality issue
- Performance degradation

### Medium

Should be addressed soon.

Examples:
- Minor UX friction
- Inconsistent styling
- Code smell
- Missing documentation

### Low

Can be deferred if documented.

Examples:
- Nice-to-have improvement
- Edge case
- Optimization opportunity
- Documentation enhancement

---

## Review Artifacts

### Review Report

Each review should produce:

- **Summary**: What was reviewed
- **Findings**: Issues discovered
- **Recommendations**: Suggested actions
- **Blockers**: Critical issues
- **Approvals**: What passed

### Location

Store review reports in:
- `validation/REPORTS/` - Review reports
- `validation/CHECKLISTS/` - Completed checklists

---

## Related Documentation

- **Product Manifesto**: `validation/PRODUCT_MANIFESTO.md` - Core beliefs
- **Product Scorecard**: `validation/PRODUCT_SCORECARD.md` - Quality metrics
- **MVP Checklist**: `validation/MVP_CHECKLIST.md` - Launch requirements
- **Release Criteria**: `validation/RELEASE_CRITERIA.md` - Release blockers

---

**Note:** These review guidelines ensure that every aspect of the product is examined from multiple perspectives before release. This comprehensive approach catches issues early and ensures quality.
