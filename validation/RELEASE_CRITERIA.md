# Release Criteria

This document defines what blocks a release. Nothing releases until all release criteria are met.

---

## Release Blockers

### Critical Bugs

Any of these blocks a release:

- [ ] Data loss or corruption
- [ ] Security vulnerability (high/critical)
- [ ] Broken authentication
- [ ] Broken navigation
- [ ] Broken primary actions (capture, today view, timeline view)
- [ ] Data sync failure
- [ ] Payment processing failure
- [ ] Privacy breach

### UX Failures

Any of these blocks a release:

- [ ] Missing loading states
- [ ] Missing empty states
- [ ] Missing error states
- [ ] Confusing navigation
- [ ] Unclear primary action
- [ ] Broken user flow
- [ ] No recovery from errors
- [ ] Punishing error messages

### Technical Failures

Any of these blocks a release:

- [ ] TypeScript errors
- [ ] ESLint errors
- [ ] Console warnings in production
- [ ] Performance regression
- [ ] Bundle size regression
- [ ] Accessibility failure (WCAG AA)
- [ ] Memory leak
- [ ] Crash on any supported platform

### Documentation Failures

Any of these blocks a release:

- [ ] Outdated critical documentation
- [ ] Missing release notes
- [ ] No migration guide if needed
- [ ] No rollback plan
- [ ] No monitoring setup

---

## Release Stages

### Alpha

**Purpose:** Early testing with internal team

**Criteria:**
- [ ] Core functionality works
- [ ] No critical bugs
- [ ] Basic testing completed
- [ ] Known issues documented
- [ ] Feature flags for incomplete features

**Audience:** Internal team only

**Duration:** 1-2 weeks

**Success Metrics:**
- Core flows work end-to-end
- No data loss
- Performance acceptable for testing

---

### Beta

**Purpose:** Testing with trusted users

**Criteria:**
- [ ] All Alpha criteria met
- [ ] No high-severity bugs
- [ ] All critical user flows tested
- [ ] Accessibility audit passed
- [ ] Performance audit passed
- [ ] Security audit passed
- [ ] Monitoring in place
- [ ] Feedback collection ready

**Audience:** Trusted users (10-50)

**Duration:** 2-4 weeks

**Success Metrics:**
- < 5 critical bugs reported
- > 80% of users complete core flows
- Performance targets met
- No data loss

---

### Release Candidate (RC)

**Purpose:** Final testing before public release

**Criteria:**
- [ ] All Beta criteria met
- [ ] No known bugs
- [ ] All MVP checklist items pass
- [ ] All Product Scorecard metrics pass
- [ ] All review perspectives approved
- [ ] Rollback plan tested
- [ ] Support team trained
- [ ] Communication plan ready

**Audience:** Wider beta users (100-500)

**Duration:** 1-2 weeks

**Success Metrics:**
- No critical bugs reported
- All metrics pass
- Ready for public release

---

### Public Release

**Purpose:** General availability

**Criteria:**
- [ ] All RC criteria met
- [ ] All release blockers cleared
- [ ] All MVP checklist items complete
- [ ] All Product Scorecard metrics passing
- [ ] All reviews approved
- [ ] Monitoring active
- [ ] Support ready
- [ ] Documentation complete
- [ ] Marketing ready

**Audience:** General public

**Success Metrics:**
- Successful deployment
- No critical issues in first 24 hours
- Metrics within targets
- Positive user feedback

---

## Pre-Release Checklist

### Code Quality

- [ ] No TypeScript errors
- [ ] No ESLint errors
- [ ] No console warnings
- [ ] No unused code
- [ ] No commented-out code
- [ ] Code reviewed by engineering lead
- [ ] Security audit passed

### Testing

- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] E2E tests pass
- [ ] Manual testing completed
- [ ] Cross-browser testing completed
- [ ] Mobile testing completed
- [ ] Accessibility testing completed

### Performance

- [ ] Lighthouse performance > 90
- [ ] Lighthouse accessibility > 95
- [ ] Lighthouse best practices > 90
- [ ] Bundle size < 500KB
- [ ] API response time < 500ms
- [ ] Database query time < 200ms

### Security

- [ ] No high/critical vulnerabilities
- [ ] All API endpoints authenticated
- [ ] RLS policies in place
- [ ] Data encrypted at rest
- [ ] HTTPS enforced
- [ ] Security audit passed

### Documentation

- [ ] Release notes written
- [ ] Migration guide (if needed)
- [ ] Rollback plan documented
- [ ] Monitoring setup documented
- [ ] Support documentation updated
- [ ] API documentation updated

### Operations

- [ ] Build process tested
- [ ] Deployment process tested
- [ ] Rollback process tested
- [ ] Database migrations tested
- [ ] Environment variables configured
- [ ] Monitoring configured
- [ ] Alerts configured
- [ ] Backup strategy verified

---

## Release Process

### 1. Preparation

- Create release branch
- Update version numbers
- Write release notes
- Run all tests
- Perform security audit
- Perform performance audit
- Perform accessibility audit

### 2. Testing

- Run full test suite
- Manual testing of all flows
- Cross-browser testing
- Mobile testing
- Accessibility testing
- Performance testing

### 3. Review

- Product manager review
- UX designer review
- UI designer review
- Engineering lead review
- QA lead review
- Accessibility review
- Security review

### 4. Approval

- All perspectives approve
- All blockers cleared
- All criteria met
- Sign-off from all leads

### 5. Deployment

- Deploy to staging
- Final testing on staging
- Deploy to production
- Monitor for issues
- Verify deployment

### 6. Post-Release

- Monitor metrics
- Collect feedback
- Address issues
- Document learnings
- Update documentation

---

## Rollback Criteria

Rollback if any of these occur within first 24 hours:

- Data loss or corruption
- Security breach
- Critical bug affecting > 10% of users
- Performance degradation > 50%
- Authentication failure
- Payment processing failure
- Any release blocker

Rollback process:

1. Identify issue
2. Assess severity
3. Decide to rollback
4. Execute rollback plan
5. Verify rollback
6. Communicate with users
7. Investigate root cause
8. Fix and redeploy

---

## Related Documentation

- **Product Manifesto**: `validation/PRODUCT_MANIFESTO.md` - Core beliefs
- **Product Scorecard**: `validation/PRODUCT_SCORECARD.md` - Quality metrics
- **MVP Checklist**: `validation/MVP_CHECKLIST.md` - Launch requirements
- **Review Guidelines**: `validation/REVIEW_GUIDELINES.md` - Review process

---

**Note:** These release criteria ensure that only high-quality, thoroughly-tested releases reach users. Any release that doesn't meet these criteria must be delayed until all blockers are resolved.
