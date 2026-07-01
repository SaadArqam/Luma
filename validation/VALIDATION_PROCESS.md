# Validation Process

This document documents the recursive validation workflow.

---

## Validation Loop

```
Review
    ↓
Find Issues
    ↓
Prioritize
    ↓
Fix
    ↓
Retest
    ↓
Compare
    ↓
Repeat
```

Continue looping until all acceptance criteria are satisfied and no high- or medium-severity issues remain.

---

## Step 1: Review

### What to Review

- Product philosophy alignment
- Design language adherence
- UX principles compliance
- Architecture quality
- Component quality
- Code quality
- Performance
- Accessibility
- Testing coverage
- Documentation accuracy

### How to Review

Use the Review Guidelines (`validation/REVIEW_GUIDELINES.md`) to inspect from multiple perspectives:
- Product Manager
- UX Designer
- UI Designer
- Frontend Engineer
- QA Engineer
- Accessibility Engineer
- Performance Engineer
- AI Engineer
- First-Time User
- Skeptic

### Review Artifacts

Document findings in:
- `validation/REPORTS/` - Review reports
- `validation/CHECKLISTS/` - Completed checklists

---

## Step 2: Find Issues

### Issue Categories

**Product Issues:**
- Violates Product Manifesto
- Doesn't solve real problem
- Adds cognitive load
- Feels overwhelming
- Unclear value

**UX Issues:**
- Confusing navigation
- Missing states (empty, error, loading)
- Poor information hierarchy
- Inconsistent patterns
- Unclear primary action

**UI Issues:**
- Design system violations
- Hardcoded values
- Inconsistent styling
- Poor contrast
- Visual clutter

**Engineering Issues:**
- TypeScript errors
- ESLint errors
- Console warnings
- Performance bottlenecks
- Security vulnerabilities
- Code quality issues

**Accessibility Issues:**
- Keyboard traps
- Missing ARIA labels
- Poor contrast
- No reduced motion support
- Poor focus management

### Issue Documentation

For each issue, document:
- **Title:** Clear, concise description
- **Severity:** Critical, High, Medium, Low
- **Location:** File/component/screen
- **Description:** What is wrong
- **Impact:** Why it matters
- **Evidence:** Screenshots, metrics, examples
- **Suggestion:** How to fix

---

## Step 3: Prioritize

### Severity Levels

**Critical**
- Must be fixed before continuing
- Blocks release
- Examples: Security vulnerability, data loss, broken authentication

**High**
- Should be fixed before release
- Blocks production readiness
- Examples: UX confusion, performance degradation, accessibility failure

**Medium**
- Should be addressed before new features
- Can be deferred if documented
- Examples: Minor UX friction, code smell, missing documentation

**Low**
- Can be deferred if documented
- Nice to have improvements
- Examples: Edge case, optimization opportunity

### Prioritization Matrix

| Severity | Impact | Effort | Priority |
|----------|--------|--------|----------|
| Critical | High | Any | P0 |
| Critical | Low | Low | P0 |
| High | High | Low | P0 |
| High | High | High | P1 |
| High | Low | Low | P1 |
| Medium | High | Low | P1 |
| Medium | High | High | P2 |
| Medium | Low | Any | P3 |
| Low | Any | Any | P3 |

---

## Step 4: Fix

### Fix Order

1. **P0 Issues:** Critical and high-impact, low-effort
2. **P1 Issues:** High-priority items
3. **P2 Issues:** Medium-priority items
4. **P3 Issues:** Low-priority items (defer if needed)

### Fix Guidelines

- **Minimal changes:** Fix only what's broken
- **No scope creep:** Don't add features while fixing
- **Test fixes:** Verify fix resolves issue
- **No regressions:** Don't break other things
- **Document changes:** Update relevant documentation

### Fix Validation

Before marking as fixed:
- [ ] Issue is resolved
- [ ] No regressions introduced
- [ ] Tests pass
- [ ] Review guidelines pass
- [ ] Documentation updated

---

## Step 5: Retest

### What to Retest

- The specific issue that was fixed
- Related functionality
- The entire user flow
- Cross-browser compatibility
- Mobile responsiveness
- Accessibility

### Retest Artifacts

Document retest results:
- [ ] Issue resolved
- [ ] No regressions
- [ ] Screenshots (before/after)
- [ ] Metrics (before/after)
- [ ] Test results

---

## Step 6: Compare

### Compare Against Standards

Compare the fixed implementation against:
- Product Manifesto
- UX Principles
- Design System
- Product Scorecard
- MVP Checklist
- Release Criteria

### Compare Against Philosophy

Ask:
- Does this reduce cognitive load?
- Does this feel calm?
- Does this feel personal?
- Is this the simplest possible solution?
- Does this align with Product Manifesto?

### Compare Against Original

Compare:
- Before fix vs after fix
- Expected vs actual
- Planned vs implemented

---

## Step 7: Repeat

### When to Repeat

Repeat the validation loop if:
- New issues discovered
- Fix introduced regressions
- Fix doesn't fully resolve issue
- Standards not met
- Philosophy not aligned

### When to Stop

Stop validation when:
- No Critical issues remain
- No High issues remain
- All Medium issues are resolved or documented
- All Product Scorecard metrics pass
- All MVP Checklist items pass
- All Release Criteria met
- Implementation aligns with Product Manifesto
- Implementation aligns with UX Principles
- Implementation aligns with Design System

---

## Exit Criteria

Validation cycle is complete only when:

- **No Critical issues remain**
- **No High issues remain**
- **All Medium issues are resolved or documented**
- **All Low issues are documented**
- **Product Scorecard metrics pass**
- **MVP Checklist items pass**
- **Release Criteria met**
- **Product Manifesto alignment verified**
- **UX Principles alignment verified**
- **Design System alignment verified**
- **Documentation synchronized**

---

## Validation Artifacts

### Report Structure

Each validation cycle produces a report in `validation/REPORTS/`:

```
validation/REPORTS/
├── 2026-07-01-today-experience-audit.md
├── 2026-07-02-capture-experience-audit.md
├── 2026-07-03-timeline-experience-audit.md
└── 2026-07-10-full-product-audit.md
```

### Report Template

```markdown
# Validation Report: [Feature/Experience]

**Date:** YYYY-MM-DD
**Reviewer:** [Name]
**Scope:** [What was reviewed]

## Summary
[Brief overview of findings]

## Issues Found
[List of issues with severity]

### Critical Issues
- [Issue 1]
- [Issue 2]

### High Issues
- [Issue 1]
- [Issue 2]

### Medium Issues
- [Issue 1]
- [Issue 2]

### Low Issues
- [Issue 1]
- [Issue 2]

## Metrics
[Product Scorecard metrics]

## Recommendations
[Prioritized action items]

## Sign-off
[Reviewer approval]
```

### Checklist Structure

Completed checklists stored in `validation/CHECKLISTS/`:

```
validation/CHECKLISTS/
├── 2026-07-01-today-experience-checklist.md
├── 2026-07-02-capture-experience-checklist.md
├── 2026-07-03-timeline-experience-checklist.md
└── 2026-07-10-full-product-checklist.md
```

---

## Validation Frequency

### Continuous Validation

- Before each feature merge
- Before each release
- After major changes

### Comprehensive Validation

- Quarterly full product audit
- After major feature releases
- When quality metrics degrade

---

## Related Documentation

- **Product Manifesto**: `validation/PRODUCT_MANIFESTO.md` - Core beliefs
- **Product Scorecard**: `validation/PRODUCT_SCORECARD.md` - Quality metrics
- **MVP Checklist**: `validation/MVP_CHECKLIST.md` - Launch requirements
- **Review Guidelines**: `validation/REVIEW_GUIDELINES.md` - Review process
- **Release Criteria**: `validation/RELEASE_CRITERIA.md` - Release blockers

---

**Note:** This validation process ensures continuous quality improvement through recursive review, fix, and retest cycles. The process continues until all acceptance criteria are met.
