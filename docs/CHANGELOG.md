# Changelog

All notable changes to Luma will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Comprehensive documentation system
- Design system with OKLCH color space
- Context engine for AI-powered insights
- Enhanced accessibility features
- PWA support with Serwist
- Extended design token system with z-index, opacity, border width/style scales
- Material-based color naming (paper, linen, mist, fog, ink, pencil, graphite)
- Premium floating bottom navigation for mobile with glass effects and smooth animations
- Card hover effects with subtle elevation transitions
- Today Experience v2 with calm, warm, intentional design
- TodayHeader component with time-based greetings and contextual subtitles
- DailyBriefCard component with loading, empty, and AI streaming states
- FocusSection component for prioritized items (bills, goals, events)
- InsightSection and InsightCard components for AI-powered insights
- UpcomingSection component for unified chronological upcoming items
- ContinueSection component for resuming unfinished activities
- RecentTimelinePreview component for unified activity timeline
- FloatingCaptureButton component for quick data capture
- TodayPageSkeleton component for loading states
- Skeleton UI component for reusable loading states
- Universal Capture Experience v2 with effortless, calm design
- CaptureSheet component with bottom sheet/modal responsive design
- CaptureInput component with auto-growing textarea and character count
- CaptureTypeSelector component for text/voice mode switching
- VoiceCapture component with recording, pause, resume, and timer
- AISuggestionList component for AI-powered capture suggestions
- MetadataSection component for tags, location, reminders, and attachments
- ProcessingIndicator component for subtle capture completion feedback
- Draft management with localStorage persistence
- Timeline Experience v2 (Epic 13) with comprehensive item types and calm design
- TimelineItem types supporting all modules (Transaction, Capture, Journal Entry, Goal Progress, Habit Completion, Planner Event, Health Record, AI Insight, Reminder, Milestone, Achievement)
- TimelineItemRegistry for extensible item type registration with icon and color mapping
- Enhanced chronological grouping (Today, Yesterday, This Week, Last Week, Months, Earlier)
- DailySummaryCard component for AI-generated day summaries
- ReflectionCard component for future AI-powered insights
- TimelineItemCard component with full card layout (icon, title, context, timestamp, preview, actions)
- TimelineEmptyState component with calming guidance
- TimelineSkeletonState component with loading states matching final UI
- TimelineHeader component with search and filter buttons
- Modular, reusable timeline component architecture

### Changed
- Redesigned navigation with glass effects
- Updated component library to use enhanced design tokens
- Improved responsive design
- Enhanced mobile experience with floating dock navigation
- Refactored Card, MetricCard, and EmptyState components for consistency
- Standardized touch targets (48px minimum) for mobile navigation
- Rebuilt Today page with modular, reusable components
- Replaced dashboard-style layout with calm, content-first design
- Unified timeline display across all activity types
- Separated concerns between layout and business logic
- Rebuilt Capture page with new Universal Capture components
- Redesigned capture flow with draft management and AI suggestions

### Fixed
- Session expiration handling
- Database query optimization
- Performance improvements

## [1.0.0] - 2026-06-15

### Added
- Initial release of Luma
- Capture experience for quick data entry
- Today experience for daily overview
- Timeline experience for historical view
- Expense tracking with categories
- Goal management with milestones
- Task management with priorities
- Recurring transaction support
- Budget overview with charts
- Authentication with Supabase
- Real-time updates with Supabase Realtime
- PWA support

### Changed
- N/A (initial release)

### Deprecated
- N/A (initial release)

### Removed
- N/A (initial release)

### Fixed
- N/A (initial release)

### Security
- Implemented row-level security (RLS)
- HTTPS for all connections
- Secure session management

## [0.9.0] - 2026-05-01

### Added
- Beta release
- Core feature implementation
- Basic authentication
- Expense tracking
- Goal tracking
- Task management

### Changed
- N/A

### Fixed
- N/A

## [0.1.0] - 2026-01-15

### Added
- Alpha release
- Initial project setup
- Basic UI components
- Database schema
- Authentication foundation

## Versioning Guidelines

### Version Format

Luma follows Semantic Versioning: `MAJOR.MINOR.PATCH`

- **MAJOR:** Incompatible API changes
- **MINOR:** Backwards-compatible functionality additions
- **PATCH:** Backwards-compatible bug fixes

### Release Types

**Major Release:**
- Breaking changes
- Significant new features
- Architecture changes

**Minor Release:**
- New features
- Enhancements
- Non-breaking changes

**Patch Release:**
- Bug fixes
- Security fixes
- Performance improvements

### Pre-Release Versions

Pre-release versions use the format: `VERSION-prerelease.IDENTIFIER`

Examples:
- `1.0.0-alpha.1`
- `1.0.0-beta.1`
- `1.0.0-rc.1`

## Change Categories

### Added
- New features
- New components
- New APIs
- New documentation

### Changed
- Changes to existing functionality
- Feature enhancements
- API changes (non-breaking)
- Configuration changes

### Deprecated
- Features marked for removal
- APIs marked for removal
- Components marked for removal

### Removed
- Removed features
- Removed APIs
- Removed components

### Fixed
- Bug fixes
- Performance improvements
- Security fixes

### Security
- Security vulnerabilities
- Security enhancements
- Security policy changes

## Changelog Maintenance

### Adding Entries

When making changes:

1. Add entry to `[Unreleased]` section
2. Use appropriate category (Added, Changed, etc.)
3. Describe the change clearly
4. Reference related issues or PRs

### Releasing

When releasing:

1. Create new version section
2. Move entries from `[Unreleased]` to new version
3. Add release date
4. Update version in package.json
5. Create git tag

### Example Entry

```markdown
## [1.1.0] - 2026-07-01

### Added
- Bank account integration with Plaid (#123)
- Receipt scanning with OCR (#124)
- Multi-currency support (#125)

### Changed
- Updated expense form to support receipts (#126)
- Improved category suggestions (#127)

### Fixed
- Fixed session expiration on mobile (#128)
- Fixed chart rendering on Safari (#129)
```

## Related Documentation

- **Releases**: `docs/RELEASES.md` - Release notes and announcements
- **Roadmap**: `docs/ROADMAP.md` - Planned features and improvements
- **Contributing**: `docs/CONTRIBUTING.md` - Contribution guidelines

---

**Note:** This changelog is updated regularly. Check the [Unreleased] section for upcoming changes.
