# Deployment Documentation

This document outlines the deployment process, environments, and procedures for Luma.

## Deployment Overview

Luma is deployed as a Progressive Web App (PWA) using Next.js and deployed to Vercel with Supabase as the backend.

## Environments

### Development Environment

**Purpose:** Local development and testing

**Configuration:**
- Local Next.js development server
- Local Supabase project (or development project)
- Environment variables in `.env.local`

**Access:**
- Local machine only
- No public access

### Staging Environment

**Purpose:** Pre-production testing

**Configuration:**
- Vercel preview deployments
- Staging Supabase project
- Environment variables in Vercel

**Access:**
- Team access only
- Protected by authentication

### Production Environment

**Purpose:** Live production application

**Configuration:**
- Vercel production deployment
- Production Supabase project
- Environment variables in Vercel

**Access:**
- Public access
- Protected by authentication

## Deployment Platforms

### Frontend: Vercel

**Platform:** Vercel

**Framework:** Next.js 16 with App Router

**Deployment Method:** Git-based deployment

**Build Command:** `npm run build`

**Output Directory:** `.next`

**Environment Variables:**
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

### Backend: Supabase

**Platform:** Supabase

**Services:**
- PostgreSQL Database
- Authentication
- Real-time
- Storage
- Edge Functions

**Environment Variables:**
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

## Deployment Process

### Initial Deployment

**Prerequisites:**
- Vercel account
- Supabase project
- Domain name (optional)
- Environment variables configured

**Steps:**

1. **Set up Supabase:**
   - Create Supabase project
   - Configure database schema
   - Set up authentication
   - Configure RLS policies
   - Get environment variables

2. **Set up Vercel:**
   - Connect GitHub repository
   - Configure build settings
   - Add environment variables
   - Configure custom domain (optional)

3. **Deploy:**
   - Push to main branch
   - Vercel automatically deploys
   - Verify deployment
   - Test critical flows

### Continuous Deployment

**Trigger:** Push to main branch

**Process:**
1. Vercel detects push
2. Runs build process
3. Runs tests (if configured)
4. Deploys to production
5. Updates DNS (if custom domain)
6. Sends deployment notification

**Rollback:**
- Access previous deployments in Vercel
- Rollback to previous version if needed
- Investigate issues
- Fix and redeploy

### Preview Deployments

**Trigger:** Pull request

**Process:**
1. Vercel detects pull request
2. Creates preview deployment
3. Runs tests (if configured)
4. Generates preview URL
5. Comments preview URL on pull request

**Cleanup:**
- Preview deployments expire after 7 days
- Manual cleanup available
- Automatic cleanup on merge

## Environment Variables

### Required Environment Variables

**Frontend (Public):**
- `NEXT_PUBLIC_SUPABASE_URL`: Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase anonymous key

**Backend (Private):**
- `SUPABASE_SERVICE_ROLE_KEY`: Supabase service role key

### Optional Environment Variables

- `NEXT_PUBLIC_APP_URL`: Application URL
- `NEXT_PUBLIC_ANALYTICS_ID`: Analytics ID
- `GROQ_API_KEY`: Groq API key for AI features

### Environment Variable Management

**Development:**
- Store in `.env.local`
- Never commit to git
- Use `.env.example` as template

**Staging:**
- Configure in Vercel project settings
- Use staging Supabase project
- Separate from production

**Production:**
- Configure in Vercel project settings
- Use production Supabase project
- Restrict access to team

## Build Process

### Build Configuration

**Next.js Config:** `next.config.ts`

**Build Command:** `npm run build`

**Build Output:** `.next` directory

**Optimization:**
- Automatic code splitting
- Image optimization
- Font optimization
- Bundle optimization

### Build Steps

1. **Install Dependencies:** `npm ci`
2. **Type Check:** TypeScript compilation
3. **Lint:** ESLint check
4. **Build:** Next.js build
5. **Generate:** Static generation
6. **Optimize:** Bundle optimization

### Build Optimization

**Code Splitting:**
- Automatic route-based splitting
- Dynamic imports for heavy components
- Lazy loading

**Asset Optimization:**
- Image optimization with Next.js Image
- Font optimization with next/font
- CSS optimization with Tailwind

**Bundle Analysis:**
- Analyze bundle size
- Identify large dependencies
- Optimize imports

## Database Migrations

### Migration Strategy

**Tool:** Supabase Migrations

**Process:**
1. Create migration file
2. Write SQL migration
3. Test on staging
4. Apply to production
5. Verify results

### Migration Best Practices

- **Backward Compatible:** Maintain backward compatibility
- **Test First:** Test on staging environment
- **Backup:** Backup before migration
- **Rollback Plan:** Have rollback plan ready
- **Document:** Document migration changes

### Migration Rollback

**Process:**
1. Identify issue
2. Stop application (if necessary)
3. Rollback migration
4. Verify data integrity
5. Restart application
6. Monitor for issues

## Monitoring

### Application Monitoring

**Tools:**
- Vercel Analytics
- Supabase Dashboard
- Custom monitoring (future)

**Metrics:**
- Page load time
- API response time
- Error rate
- User engagement
- Conversion rate

### Error Monitoring

**Tools:**
- Vercel Logs
- Supabase Logs
- Custom error tracking (future)

**Alerts:**
- Error rate threshold
- Response time threshold
- Uptime monitoring
- Custom alerts

### Performance Monitoring

**Tools:**
- Lighthouse CI
- Web Vitals
- Custom performance monitoring (future)

**Metrics:**
- Core Web Vitals
- Bundle size
- API performance
- Database performance

## Backup and Recovery

### Database Backups

**Supabase Backups:**
- Automatic daily backups
- Point-in-time recovery
- 7-day retention (free tier)
- 30-day retention (pro tier)

**Backup Strategy:**
- Daily automatic backups
- Manual backups before major changes
- Backup verification
- Recovery testing

### Disaster Recovery

**Recovery Plan:**
1. Identify issue
2. Assess impact
3. Restore from backup
4. Verify data integrity
5. Restart services
6. Monitor for issues

**Recovery Time Objective (RTO):** 4 hours

**Recovery Point Objective (RPO):** 24 hours

## Security in Deployment

### Deployment Security

**Access Control:**
- Restricted access to production
- Two-factor authentication
- Access logging
- Regular access review

**Secrets Management:**
- Environment variables in Vercel
- Encrypted secrets
- No secrets in code
- Regular secret rotation

### SSL/TLS

**HTTPS:**
- Automatic SSL with Vercel
- TLS 1.2+
- Automatic certificate renewal
- HSTS enabled

**Certificate:**
- Let's Encrypt (default)
- Custom certificate (optional)
- Certificate monitoring

## Scaling

### Horizontal Scaling

**Vercel:**
- Automatic scaling
- Global edge network
- CDN distribution
- Load balancing

**Supabase:**
- Automatic scaling
- Read replicas (pro tier)
- Connection pooling
- Edge functions

### Vertical Scaling

**Vercel:**
- Pro plan for higher limits
- Dedicated resources (enterprise)

**Supabase:**
- Pro plan for higher limits
- Dedicated instances (enterprise)

## Deployment Checklist

### Pre-Deployment

- [ ] All tests pass
- [ ] Code reviewed
- [ ] Documentation updated
- [ ] Environment variables configured
- [ ] Database migrations tested
- [ ] Backup created
- [ ] Rollback plan ready

### During Deployment

- [ ] Monitor build process
- [ ] Check for errors
- [ ] Verify deployment
- [ ] Test critical flows
- [ ] Monitor performance
- [ ] Check error logs

### Post-Deployment

- [ ] Verify all features work
- [ ] Monitor error rates
- [ ] Check performance metrics
- [ ] Monitor user feedback
- [ ] Document any issues
- [ ] Update documentation

## Troubleshooting

### Common Issues

**Build Failures:**
- Check build logs
- Verify dependencies
- Check environment variables
- Verify TypeScript errors

**Deployment Failures:**
- Check Vercel logs
- Verify environment variables
- Check Supabase connection
- Verify DNS configuration

**Runtime Errors:**
- Check error logs
- Verify database connection
- Check API endpoints
- Verify authentication

### Debugging Tools

**Vercel Logs:**
- Real-time logs
- Function logs
- Build logs
- Error logs

**Supabase Logs:**
- Database logs
- Auth logs
- API logs
- Real-time logs

**Browser DevTools:**
- Console errors
- Network requests
- Performance metrics
- Storage inspection

## Related Documentation

- **Architecture**: `docs/ARCHITECTURE.md` - System architecture
- **Security**: `docs/SECURITY.md` - Security practices
- **Testing**: `docs/TESTING.md` - Testing procedures

---

**Note:** This deployment documentation is a living document. It will be updated as deployment processes evolve and new infrastructure is added.
