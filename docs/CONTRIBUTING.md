# Contributing Guidelines

This document outlines the guidelines for contributing to Luma.

## Overview

Luma is an open project that welcomes contributions from the community. Whether you're fixing a bug, adding a feature, or improving documentation, we appreciate your help.

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Git installed
- GitHub account
- Code editor (VS Code recommended)

### Setting Up Development Environment

1. **Fork the repository:**
   ```bash
   # Fork the repository on GitHub
   git clone https://github.com/your-username/Luma.git
   cd Luma
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your Supabase credentials
   ```

4. **Start development server:**
   ```bash
   npm run dev
   ```

5. **Open in browser:**
   Navigate to `http://localhost:3000`

## Development Workflow

### Branch Strategy

**Main Branch:** `main` - Production-ready code

**Development Branch:** `develop` - Integration branch for features

**Feature Branches:** `feature/feature-name` - For new features

**Bugfix Branches:** `fix/bug-description` - For bug fixes

**Hotfix Branches:** `hotfix/bug-description` - For urgent production fixes

### Creating a Branch

```bash
# Create a feature branch
git checkout -b feature/your-feature-name

# Or create a bugfix branch
git checkout -b fix/your-bug-fix
```

### Making Changes

1. **Make your changes** following the coding standards
2. **Write tests** for your changes
3. **Run tests** to ensure they pass
4. **Update documentation** if needed
5. **Commit your changes** with clear messages

### Commit Messages

Follow conventional commits format:

```
type(scope): description

[optional body]

[optional footer]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**
```bash
git commit -m "feat(expenses): add category suggestions"
git commit -m "fix(auth): resolve session expiration issue"
git commit -m "docs(readme): update installation instructions"
```

### Pull Request Process

1. **Update your branch:**
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

2. **Push to your fork:**
   ```bash
   git push origin feature/your-feature-name
   ```

3. **Create pull request:**
   - Go to GitHub
   - Click "New Pull Request"
   - Select your branch
   - Fill in the PR template
   - Submit the PR

### Pull Request Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tests added
- [ ] Tests pass
- [ ] Manual testing completed

## Checklist
- [ ] Code follows project style
- [ ] Self-reviewed the code
- [ ] Commented complex code
- [ ] Updated documentation
- [ ] No merge conflicts
- [ ] Commit messages follow conventions
```

## Coding Standards

### TypeScript

- Use TypeScript strict mode
- Define types for all functions
- Avoid `any` type
- Use interfaces for object shapes
- Use type aliases for unions

### React

- Use functional components
- Use hooks for state and effects
- Follow React best practices
- Use server components by default
- Mark client components with `'use client'`

### Styling

- Use Tailwind CSS for styling
- Follow design system tokens
- Use utility classes
- Avoid inline styles
- Use semantic class names

### File Naming

- Components: PascalCase (`PrimaryButton.tsx`)
- Utilities: camelCase (`formatCurrency.ts`)
- Hooks: camelCase with `use` prefix (`useAuth.ts`)
- Types: PascalCase (`UserTypes.ts`)

### Code Organization

- Group related files
- Use barrel exports for modules
- Keep files focused and small
- Follow existing directory structure

## Testing Guidelines

### Writing Tests

- Write tests for new features
- Write tests for bug fixes
- Maintain test coverage
- Test edge cases
- Use descriptive test names

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage
```

### Test Coverage

- Maintain minimum coverage thresholds
- Focus on critical paths
- Test business logic
- Test component interactions

## Documentation

### Updating Documentation

- Update relevant documentation files
- Update API documentation for API changes
- Update CHANGELOG for user-facing changes
- Update README if needed

### Documentation Style

- Use clear, concise language
- Include examples where helpful
- Use code blocks for code examples
- Follow existing documentation structure

## Design System

### Following Design System

- Use design tokens from `.claude/DESIGN-luma.md`
- Follow design taste guidelines from `.claude/TASTE.md`
- Use existing components when possible
- Create new components following patterns
- Maintain visual consistency

### Component Guidelines

- Reuse existing components
- Follow component patterns
- Use proper TypeScript types
- Include accessibility attributes
- Test component interactions

## Code Review

### Reviewing Pull Requests

- Review code thoroughly
- Check for adherence to standards
- Test the changes if possible
- Provide constructive feedback
- Be respectful and helpful

### Responding to Feedback

- Address all feedback
- Explain decisions when needed
- Update the PR accordingly
- Request re-review when ready
- Be open to suggestions

## Issue Reporting

### Before Creating an Issue

- Check existing issues
- Check if the issue is already fixed
- Search for similar issues
- Gather relevant information

### Creating an Issue

Use the issue template:

```markdown
## Description
Clear description of the issue

## Steps to Reproduce
1. Step one
2. Step two
3. Step three

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Environment
- OS: [e.g., macOS, Windows, Linux]
- Browser: [e.g., Chrome, Firefox, Safari]
- Version: [e.g., 1.0.0]

## Screenshots
If applicable, add screenshots

## Additional Context
Any other relevant information
```

## Feature Requests

### Before Requesting a Feature

- Check existing feature requests
- Check if the feature is already planned
- Consider if the feature aligns with project goals
- Think about implementation complexity

### Requesting a Feature

Use the feature request template:

```markdown
## Feature Description
Clear description of the feature

## Problem Statement
What problem does this solve?

## Proposed Solution
How should this be implemented?

## Alternatives Considered
What alternatives did you consider?

## Additional Context
Any other relevant information
```

## Community Guidelines

### Code of Conduct

- Be respectful and inclusive
- Welcome newcomers
- Focus on what is best for the community
- Show empathy towards other community members

### Communication

- Be clear and concise
- Use appropriate channels
- Be responsive to feedback
- Keep discussions constructive

### Collaboration

- Work together on solutions
- Share knowledge
- Help others learn
- Celebrate successes

## Getting Help

### Resources

- **Documentation:** `docs/` directory
- **Design System:** `.claude/DESIGN-luma.md`
- **Architecture:** `docs/ARCHITECTURE.md`
- **API Documentation:** `docs/API.md`

### Asking Questions

- Search existing documentation first
- Search existing issues and discussions
- Ask questions in GitHub Discussions
- Be specific about your problem
- Provide context and code examples

## Recognition

### Contributors

All contributors are recognized in the CONTRIBUTORS file.

### Attribution

- Your name will be listed in contributors
- Your contributions will be acknowledged
- Your work will be credited appropriately

## License

By contributing to Luma, you agree that your contributions will be licensed under the project's license.

## Additional Resources

- **Next.js Documentation:** https://nextjs.org/docs
- **React Documentation:** https://react.dev
- **TypeScript Documentation:** https://www.typescriptlang.org/docs
- **Tailwind CSS Documentation:** https://tailwindcss.com/docs
- **Supabase Documentation:** https://supabase.com/docs

## Related Documentation

- **Architecture**: `docs/ARCHITECTURE.md` - System architecture
- **Testing**: `docs/TESTING.md` - Testing procedures
- **Deployment**: `docs/DEPLOYMENT.md` - Deployment process

---

**Note:** These contributing guidelines are a living document. They will be updated as the project evolves and community needs change.
