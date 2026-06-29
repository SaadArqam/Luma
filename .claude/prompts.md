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









# Update `.claude/BRAIN.md`

Read the entire codebase and every document inside:

* `.claude/`
* `docs/`

Then completely review `.claude/BRAIN.md`.

## Objective

The current `BRAIN.md` still contains outdated context from the old PaisaTrack expense manager.

Refactor it so it accurately represents the current state of **Luma**.

Do not simply append new information.

Rewrite and reorganize the document where necessary.

## Remove

Delete all outdated or obsolete information, including:

* PaisaTrack branding
* Old navigation
* Old architecture
* Deprecated features
* Replaced design decisions
* Superseded implementation details
* Any duplicated information

Keep the document focused on the current product only.

## Update

Ensure the Brain reflects:

* Luma vision
* Current architecture
* Current folder structure
* Design language
* Product philosophy
* Core experiences (Today, Capture, Timeline)
* Intelligence layer
* Context Engine
* Life Graph
* Rules Engine
* Current modules
* Design system
* Important conventions
* Active roadmap
* Coding conventions
* UI conventions
* AI conventions
* Current tech stack
* Important dependencies
* Current implementation status

## Structure

Reorganize the document into clear sections.

Example:

* Project Overview
* Vision
* Product Philosophy
* Architecture
* Folder Structure
* Design Language
* Tech Stack
* Core Experiences
* Modules
* Intelligence
* Current Progress
* Active Roadmap
* Development Conventions
* Important Decisions
* Known Limitations
* Next Priorities

Improve the structure if necessary.

## Constraints

* Keep the Brain concise.
* Remove historical clutter.
* Do not document implementation details that are obvious from the code.
* Prefer architectural context over low-level code explanations.
* Avoid duplicate information already covered by files in `docs/`.
* The Brain should optimize future AI context, not serve as product documentation.

## Final Goal

The updated `BRAIN.md` should allow a new AI model to understand the entire Luma project within a few minutes without being distracted by outdated PaisaTrack information.

Provide a summary of everything that was removed, updated and reorganized.
