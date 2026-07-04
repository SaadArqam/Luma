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









# Luma MVP Skeleton Sprint

## Context

You are the Lead Product Engineer, Product Designer, Software Architect, QA Engineer, and UX Designer for **Luma**.

Luma is an AI-powered Personal Operating System.

Finance is only one module.

The project is currently under a **Feature Freeze**.

The objective is NOT to add more features.

The objective is to transform the existing implementation into a coherent, complete MVP that demonstrates the core product vision.

---

# Mandatory Reading

Before making any changes, read and understand the following documentation.

## Project Brain

- `.claude/BRAIN.md`

This is the primary source of truth.

---

## Design Language

Read every design reference.

- `.claude/DESIGN-luma.md`
- `.claude/DESIGN-apple.md`
- `.claude/DESIGN-linear.app.md`
- `.claude/DESIGN-raycast.md`
- `.claude/DESIGN-claude.md`
- `.claude/DESIGN-notion.md`
- `.claude/DESIGN-airtable.md`

---

## Product Documentation

Read every document inside:

```
docs/
```

---

## Validation Framework

Read every document inside:

```
validation/
```

These define the launch standards.

---

# Mission

Create the **best possible first-launch skeleton** of Luma.

The result should feel like a complete product rather than a collection of screens.

When a user opens the app, they should understand:

- what Luma is
- why it exists
- what to do next
- why they should return tomorrow

The product should feel coherent even if some advanced functionality is mocked or simplified.

---

# Scope

You may improve any existing implementation.

You may refactor.

You may simplify.

You may remove unnecessary UI.

You may improve UX.

You may improve architecture.

You may improve copywriting.

You may improve navigation.

You may improve responsiveness.

You may improve accessibility.

You may improve performance.

You may introduce placeholders where advanced systems are not yet implemented, provided they fit naturally into the product.

Do **not** introduce new modules or expand the product scope.

---

# Core Experiences

Ensure these experiences work together as one product:

- Today
- Capture
- Timeline
- Navigation
- Profile (basic if present)

Every experience should feel connected.

Avoid isolated screens.

---

# Skeleton Requirements

The MVP should include:

## Today

- Calm welcome
- Daily Brief (placeholder if needed)
- Focus section
- Insights section
- Recent activity
- Smooth transitions
- Empty/loading/error states

---

## Capture

- Universal capture
- Draft support
- Text capture
- Voice placeholder
- Save flow
- Success feedback

---

## Timeline

- Chronological view
- Daily grouping
- Multiple item types
- Empty state
- Placeholder AI summaries

---

## Navigation

- Cohesive navigation
- Consistent transitions
- Responsive layout
- Clear information hierarchy

---

## Design System

Every screen must use the existing Luma Design System.

Remove inconsistent styling.

Remove duplicated patterns.

Use design tokens everywhere.

---

# MVP Quality Goals

Optimize for:

- Clarity
- Simplicity
- Consistency
- Performance
- Accessibility
- Calmness

Not feature count.

---

# Continuous Self Review

While implementing, repeatedly ask:

- Can this be simpler?
- Does this reduce cognitive load?
- Is this necessary?
- Does it feel like Luma?
- Would a first-time user understand it?

If not, improve it before continuing.

---

# Engineering Requirements

Maintain:

- Modular architecture
- Reusable components
- Clean folder structure
- Type safety
- Responsive layouts
- Accessible components
- Separation of concerns

---

# Validation During Implementation

Continuously:

- Run linting
- Run type checking
- Fix build errors
- Resolve console warnings
- Remove dead code
- Remove unused imports
- Remove duplicate logic

The project should always remain in a working state.

---

# Documentation

Whenever implementation changes:

Update:

- `.claude/BRAIN.md`
- `docs/CHANGELOG.md`

Update any additional documentation affected by architectural or UX changes.

Documentation should remain synchronized with the implementation.

---

# Deliverables

By the end of this sprint:

- A coherent MVP skeleton.
- Connected user flows.
- Consistent design language.
- Responsive layouts.
- Clean architecture.
- Working navigation.
- Placeholder AI experiences where appropriate.
- No obvious unfinished screens.
- Updated documentation.

The objective is not perfection.

The objective is a product that feels complete enough to begin real user validation.

Future milestones will focus on refinement, testing, and iteration based on feedback rather than expanding the feature set.