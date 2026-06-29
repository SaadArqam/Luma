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

### Changed
- Redesigned navigation with glass effects
- Updated component library
- Improved responsive design
- Enhanced mobile experience

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
