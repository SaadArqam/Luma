# Context

You are working on Luma.

Before making any changes, you MUST read and use the following files as project constraints.

## Project Memory

- .claude/BRAIN.md

## Design System

- .claude/DESIGN-luma.md

## Design References

- .claude/DESIGN-apple.md
- .claude/DESIGN-linear.app.md
- .claude/DESIGN-raycast.md
- .claude/DESIGN-claude.md
- .claude/DESIGN-notion.md
- .claude/DESIGN-airtable.md

These are references only.

Do not copy any single product.

Synthesize their strengths into Luma's own design language.

## Product Knowledge

- docs/PHILOSOPHY.md
- docs/PRODUCT.md
- docs/ROADMAP.md
- docs/ARCHITECTURE.md
- docs/BRAND.md
- docs/TASTE.md
- docs/UX_PRINCIPLES.md
- docs/USER_JOURNEY.md
- docs/DATA_MODEL.md
- docs/API.md
- docs/SECURITY.md
- docs/TESTING.md
- docs/DEPLOYMENT.md
- docs/CONTRIBUTING.md
- docs/CHANGELOG.md
- docs/RELEASES.md
- docs/ONBOARDING.md
- docs/DECISIONS.md
- docs/TODO.md

## Implementation Rules

- Read all required context before making changes.
- Preserve the existing architecture.
- Preserve the existing design language.
- Reuse existing components whenever possible.
- Do not introduce duplicate patterns.
- Prefer composition over duplication.
- Keep components modular and reusable.
- Maintain accessibility and responsiveness.
- Keep animations subtle and purposeful.
- Follow the Luma Design Language instead of personal preference.
- If an implementation conflicts with the established architecture or design, propose a better solution before implementing it.

## Before Finishing

- Update `.claude/BRAIN.md`.
- Update `docs/CHANGELOG.md`.
- Update `docs/DECISIONS.md` if any architectural or product decision changes.
- Update `docs/ROADMAP.md` if the completed work affects future milestones.
- Keep every document concise.
- Do not duplicate information across files.
- Do not create new markdown files unless explicitly instructed.









# Milestone M1.2 — Comprehensive Product & UX Audit

## Context

Before making any changes, read and treat the following documents as the source of truth.

### Project Brain

- `.claude/BRAIN.md`

### Design Language

- `.claude/DESIGN-luma.md`
- `.claude/DESIGN-apple.md`
- `.claude/DESIGN-linear.app.md`
- `.claude/DESIGN-raycast.md`
- `.claude/DESIGN-claude.md`
- `.claude/DESIGN-notion.md`
- `.claude/DESIGN-airtable.md`

### Product Documentation

Read all documentation inside `docs/`.

### Validation Framework

Read every document inside `validation/`.

The validation framework defines the audit criteria. Do not invent new standards during the audit.

---

# Objective

Perform a complete audit of the current Luma MVP without making implementation changes.

The purpose is to identify every issue, inconsistency, weakness, and improvement opportunity before any fixes begin.

This milestone produces reports—not code.

---

# Audit Scope

Audit every implemented experience:

- Today
- Capture
- Timeline
- Navigation
- Shared Components
- Design System usage

Review the application exactly as a first-time user would experience it.

---

# Audit Perspectives

Every screen must be reviewed independently from the following perspectives.

---

## 1. Product Review

Questions:

- Does this solve a real user problem?
- Is this feature necessary for MVP?
- Does it reduce cognitive load?
- Would users understand its value?
- Is anything unnecessary?

Deliverable:

`validation/REPORTS/product-audit.md`

---

## 2. UX Review

Questions:

- Is navigation obvious?
- Are interactions predictable?
- Is there unnecessary friction?
- Are users forced to think?
- Are labels clear?
- Are empty states helpful?
- Are success/error messages meaningful?

Deliverable:

`validation/UX_AUDITS/ux-audit.md`

---

## 3. UI Review

Evaluate:

- Visual hierarchy
- Typography
- Spacing
- Alignment
- Color usage
- Card consistency
- Shadows
- Borders
- Motion
- Whitespace

Compare against the Luma Design Language.

Deliverable:

`validation/UX_AUDITS/ui-audit.md`

---

## 4. Design Language Compliance

Verify that every component follows:

- Design tokens
- Spacing scale
- Typography scale
- Color philosophy
- Motion principles
- Component conventions

List every violation.

Deliverable:

`validation/REPORTS/design-compliance.md`

---

## 5. First-Time User Review

Pretend you have never seen Luma.

Attempt to answer:

- What is this app?
- What should I do first?
- What happens after Capture?
- What is Timeline?
- Why should I return tomorrow?

Document every point of confusion.

Deliverable:

`validation/USER_TESTS/first-time-user.md`

---

## 6. Skeptic Review

Compare Luma mentally against:

- Apple Notes
- Google Keep
- Notion
- Apple Journal
- Any finance app

Ask:

"Why would I switch?"

If Luma cannot clearly answer this question, document the gap.

Deliverable:

`validation/REPORTS/competitive-review.md`

---

## 7. Consistency Audit

Inspect:

- Buttons
- Icons
- Navigation
- Cards
- Typography
- Inputs
- Empty states
- Loading states
- Motion

Look for inconsistencies.

Deliverable:

`validation/REPORTS/consistency-audit.md`

---

# Issue Logging

Every finding must include:

- Unique ID
- Title
- Description
- Location
- Severity
- Evidence
- Suggested Solution
- Status

Severity:

- Critical
- High
- Medium
- Low

Store all findings in:

`validation/BUG_REPORTS/`

Create one consolidated issue log:

`validation/BUG_REPORTS/master-issue-log.md`

---

# Evidence Collection

For every issue, collect evidence where possible.

Include:

- Screenshots
- Screen recordings
- Notes
- Before state
- Expected behavior

Store assets inside:

- `validation/SCREEN_RECORDINGS/`
- `validation/REPORTS/`

---

# Do Not Fix Anything

During this milestone:

- Do not redesign.
- Do not refactor.
- Do not optimize.
- Do not change code.

Only observe, document, and classify.

The objective is to understand the current state completely before making changes.

---

# Deliverables

Produce at minimum:

- Product Audit
- UX Audit
- UI Audit
- Design Compliance Report
- First-Time User Review
- Competitive Review
- Consistency Audit
- Master Issue Log

All reports should reference issue IDs where applicable.

---

# Documentation Updates

After the audit:

## Update `.claude/BRAIN.md`

Document:

- M1.2 completed.
- Audit scope.
- Number of findings by severity.
- Major themes identified.
- Next milestone.

---

## Update

- `docs/DECISIONS.md` (if audit changes future priorities)
- `docs/TODO.md` (convert findings into actionable work)

No implementation documentation should change during this milestone.

---

# Definition of Done

This milestone is complete only when:

- Every implemented experience has been audited.
- All findings are documented.
- Every issue has a severity level.
- Evidence has been collected.
- A master issue log exists.
- `.claude/BRAIN.md` has been updated.

No fixes should be implemented during this milestone.

---

# Next Milestone

Proceed to:

**M1.3 — Prioritize Findings & Create Validation Backlog**

The goal of M1.3 is to transform the audit results into a prioritized execution plan before writing any code.