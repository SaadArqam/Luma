# Testing Documentation

This document outlines the testing strategy, practices, and procedures for Luma.

## Testing Philosophy

Luma follows a comprehensive testing approach to ensure quality, reliability, and user satisfaction.

### Core Testing Principles

- **Test Early:** Write tests alongside code
- **Test Often:** Run tests frequently during development
- **Test Automatically:** Automate test execution
- **Test Everything:** Test all critical paths
- **Test Realistically:** Test realistic user scenarios

## Testing Strategy

### Testing Pyramid

Luma follows a testing pyramid with emphasis on different test types:

```
        E2E Tests (10%)
       /            \
      /              \
   Integration Tests (30%)
  /                    \
 /                      \
Unit Tests (60%)
```

**Unit Tests (60%):**
- Test individual functions and components
- Fast execution
- Isolated from dependencies
- High coverage of business logic

**Integration Tests (30%):**
- Test component interactions
- Test API endpoints
- Test database operations
- Moderate execution time

**E2E Tests (10%):**
- Test critical user flows
- Test complete user journeys
- Slower execution
- High value for critical paths

## Unit Testing

### Framework

**Testing Framework:** Jest (or Vitest)

**Test Runner:** Jest

**Assertion Library:** Jest built-in assertions

**Mocking Library:** Jest built-in mocking

### Unit Test Guidelines

**What to Test:**
- Pure functions
- Utility functions
- Component logic
- Data transformations
- Validation functions

**What Not to Test:**
- Third-party libraries
- External APIs
- Database operations (use integration tests)
- UI rendering (use component tests)

### Example Unit Test

```typescript
// utils/currency.test.ts
import { formatCurrency } from './currency';

describe('formatCurrency', () => {
  it('formats USD correctly', () => {
    expect(formatCurrency(1000, 'USD')).toBe('$1,000.00');
  });

  it('formats EUR correctly', () => {
    expect(formatCurrency(1000, 'EUR')).toBe('€1,000.00');
  });

  it('handles zero', () => {
    expect(formatCurrency(0, 'USD')).toBe('$0.00');
  });

  it('handles negative values', () => {
    expect(formatCurrency(-100, 'USD')).toBe('-$100.00');
  });
});
```

### Coverage Goals

- **Statement Coverage:** 80% minimum
- **Branch Coverage:** 75% minimum
- **Function Coverage:** 90% minimum
- **Line Coverage:** 80% minimum

## Component Testing

### Framework

**Testing Framework:** React Testing Library

**Test Runner:** Jest

**Assertion Library:** Jest built-in assertions

### Component Test Guidelines

**What to Test:**
- User interactions
- Component rendering
- State changes
- Props handling
- Event handlers

**What Not to Test:**
- Implementation details
- Internal state
- Third-party component internals
- CSS/styling

### Example Component Test

```typescript
// components/PrimaryButton.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { PrimaryButton } from './PrimaryButton';

describe('PrimaryButton', () => {
  it('renders correctly', () => {
    render(<PrimaryButton>Click me</PrimaryButton>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<PrimaryButton onClick={handleClick}>Click me</PrimaryButton>);
    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled when disabled prop is true', () => {
    render(<PrimaryButton disabled>Click me</PrimaryButton>);
    expect(screen.getByText('Click me')).toBeDisabled();
  });
});
```

## Integration Testing

### Framework

**Testing Framework:** Jest

**Test Runner:** Jest

**Database:** Test database (Supabase test project)

### Integration Test Guidelines

**What to Test:**
- API routes
- Database operations
- Component integration
- State management
- Authentication flows

### Example Integration Test

```typescript
// app/api/accounts/route.test.ts
import { POST } from './route';
import { createClient } from '@supabase/supabase-js';

describe('Accounts API', () => {
  let supabase: any;

  beforeAll(() => {
    supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
  });

  it('creates an account', async () => {
    const request = new Request('http://localhost/api/accounts', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Test Account',
        type: 'checking',
        balance: 1000,
        currency: 'USD'
      })
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.account).toHaveProperty('id');
    expect(data.account.name).toBe('Test Account');
  });
});
```

## End-to-End Testing

### Framework

**Testing Framework:** Playwright

**Test Runner:** Playwright

**Browser Support:** Chromium, Firefox, WebKit

### E2E Test Guidelines

**What to Test:**
- Critical user flows
- Authentication flow
- Key feature workflows
- Cross-browser compatibility
- Mobile responsiveness

**Critical Flows:**
- Sign up / Sign in
- Add expense
- Create goal
- Add task
- View timeline

### Example E2E Test

```typescript
// e2e/expense-flow.spec.ts
import { test, expect } from '@playwright/test';

test('add expense flow', async ({ page }) => {
  // Sign in
  await page.goto('/auth/signin');
  await page.fill('input[name="email"]', 'test@example.com');
  await page.fill('input[name="password"]', 'password123');
  await page.click('button[type="submit"]');

  // Navigate to Today
  await page.goto('/today');

  // Open quick add
  await page.click('[data-testid="quick-add-button"]');

  // Add expense
  await page.fill('input[name="amount"]', '50');
  await page.selectOption('select[name="category"]', 'food');
  await page.click('button[type="submit"]');

  // Verify expense added
  await expect(page.locator('text=$50.00')).toBeVisible();
});
```

## API Testing

### Framework

**Testing Framework:** Jest

**Test Runner:** Jest

**HTTP Client:** Supertest or fetch

### API Test Guidelines

**What to Test:**
- All endpoints
- Request validation
- Response format
- Error handling
- Authentication
- Authorization

### Example API Test

```typescript
// __tests__/api/expenses.test.ts
import { createClient } from '@supabase/supabase-js';

describe('Expenses API', () => {
  let authToken: string;

  beforeAll(async () => {
    // Authenticate and get token
    const response = await fetch('/api/auth/signin', {
      method: 'POST',
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'password123'
      })
    });
    const data = await response.json();
    authToken = data.token;
  });

  it('GET /api/expenses returns expenses', async () => {
    const response = await fetch('/api/expenses', {
      headers: {
        Authorization: `Bearer ${authToken}`
      }
    });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toHaveProperty('expenses');
    expect(Array.isArray(data.expenses)).toBe(true);
  });
});
```

## Performance Testing

### Tools

**Load Testing:** k6 or Artillery

**Performance Monitoring:** Lighthouse

**Bundle Analysis:** webpack-bundle-analyzer

### Performance Test Guidelines

**What to Test:**
- Page load time
- API response time
- Bundle size
- Memory usage
- Rendering performance

### Performance Targets

- **First Contentful Paint:** < 1.5s
- **Time to Interactive:** < 3.5s
- **API Response Time:** < 200ms (p95)
- **Bundle Size:** < 500KB (gzipped)
- **Lighthouse Score:** > 90

## Accessibility Testing

### Tools

**Automated Testing:** axe-core

**Manual Testing:** Keyboard navigation, screen reader

**Lighthouse:** Accessibility audit

### Accessibility Test Guidelines

**What to Test:**
- Keyboard navigation
- Screen reader compatibility
- Color contrast
- Focus indicators
- ARIA labels
- Alt text

### Example Accessibility Test

```typescript
// components/PrimaryButton.a11y.test.tsx
import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { PrimaryButton } from './PrimaryButton';

describe('PrimaryButton Accessibility', () => {
  it('has no accessibility violations', async () => {
    const { container } = render(<PrimaryButton>Click me</PrimaryButton>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('is keyboard accessible', () => {
    render(<PrimaryButton>Click me</PrimaryButton>);
    const button = screen.getByText('Click me');
    expect(button).toHaveAttribute('type', 'button');
  });
});
```

## Test Organization

### Directory Structure

```
Luma/
├── __tests__/
│   ├── unit/
│   │   ├── utils/
│   │   └── lib/
│   ├── integration/
│   │   ├── api/
│   │   └── database/
│   └── e2e/
│       ├── auth/
│       ├── expenses/
│       └── goals/
├── components/
│   └── *.test.tsx
├── lib/
│   └── *.test.ts
└── app/
    └── api/
        └── */route.test.ts
```

### Naming Conventions

- Unit tests: `*.test.ts` or `*.test.tsx`
- E2E tests: `*.spec.ts`
- Test files co-located with source files
- Descriptive test names

## Continuous Integration

### CI Pipeline

**GitHub Actions** (or similar CI/CD):

1. **Lint:** Run ESLint
2. **Type Check:** Run TypeScript compiler
3. **Unit Tests:** Run unit tests
4. **Integration Tests:** Run integration tests
5. **E2E Tests:** Run E2E tests on critical paths
6. **Build:** Build production bundle
7. **Deploy:** Deploy on success

### Test Execution

**On Pull Request:**
- Run all tests
- Block merge if tests fail
- Report test results

**On Main Branch:**
- Run all tests
- Deploy on success
- Monitor test results

## Test Data Management

### Test Database

**Separate Test Database:** Dedicated Supabase test project

**Data Seeding:** Seed test data before tests

**Data Cleanup:** Clean up after tests

**Isolation:** Each test isolated from others

### Mock Data

**Fixtures:** Reusable test data fixtures

**Factories:** Generate test data programmatically

**Mock Services:** Mock external services

## Test Reporting

### Coverage Reports

**Tool:** Jest coverage reports

**Thresholds:** Minimum coverage thresholds

**Reporting:** Coverage reports in CI

**Trending:** Track coverage over time

### Test Results

**Test Summary:** Pass/fail summary

**Failed Tests:** Detailed failure information

**Performance Metrics:** Test execution time

**Trending:** Track test results over time

## Best Practices

### Writing Tests

- **Arrange-Act-Assert:** Structure tests clearly
- **Descriptive Names:** Use descriptive test names
- **One Assertion:** One assertion per test (when possible)
- **Independent Tests:** Tests should be independent
- **Fast Tests:** Keep tests fast
- **Maintainable:** Keep tests maintainable

### Common Pitfalls

- **Testing Implementation:** Test behavior, not implementation
- **Brittle Tests:** Avoid brittle selectors
- **Over-Mocking:** Don't over-mock dependencies
- **Slow Tests:** Keep tests fast
- **Flaky Tests:** Eliminate flaky tests
- **Test Duplication:** Avoid test duplication

## Testing Checklist

### Before Committing

- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] New code is tested
- [ ] Coverage maintained
- [ ] No flaky tests

### Before Merging

- [ ] All tests pass
- [ ] E2E tests pass
- [ ] Accessibility tests pass
- [ ] Performance tests pass
- [ ] Code review complete

## Related Documentation

- **Architecture**: `docs/ARCHITECTURE.md` - System architecture
- **API Documentation**: `docs/API.md` - API endpoints
- **Development**: `docs/CONTRIBUTING.md` - Development practices

---

**Note:** This testing documentation is a living document. It will be updated as testing practices evolve and new testing needs arise.
