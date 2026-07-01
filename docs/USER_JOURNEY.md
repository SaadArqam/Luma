# User Journey

This document describes the user journeys through Luma, from onboarding to daily use.

## Primary User Personas

### Persona 1: The Busy Professional

**Profile:**
- Age: 28-35
- Occupation: Knowledge worker
- Tech-savvy but not technical
- Values efficiency and clarity
- Stressed about finances and time management

**Goals:**
- Understand spending patterns
- Track progress toward financial goals
- Manage tasks efficiently
- Reduce stress about money and time

**Pain Points:**
- Too many apps for different needs
- Overwhelmed by complex dashboards
- Doesn't understand spending patterns
- Forgets tasks and deadlines

### Persona 2: The Life Optimizer

**Profile:**
- Age: 25-40
- Occupation: Various
- Interested in self-improvement
- Values holistic understanding
- Wants to see connections between life areas

**Goals:**
- See how different life areas connect
- Understand patterns in behavior
- Make data-driven decisions
- Achieve personal growth

**Pain Points:**
- Fragmented tools don't show connections
- Hard to see the big picture
- Lack of insights from data
- Tools feel transactional, not insightful

## Onboarding Journey

### Step 1: Sign Up

**User Action:** User signs up with email or social login

**System Response:**
- Create account with Supabase Auth
- Redirect to onboarding flow
- Set session cookie

**User Experience:**
- Simple, clean sign-up form
- Social login options (Google, Apple)
- Clear value proposition
- Minimal friction

### Step 2: Quick Setup

**User Action:** User completes minimal setup

**System Response:**
- Collect essential information (currency, timezone)
- Create default categories
- Set initial balance (optional)
- Navigate to Today page

**User Experience:**
- 3-4 quick questions
- Smart defaults where possible
- Skip option for non-essential setup
- Clear progress indicator

### Step 3: Guided Introduction

**User Action:** User takes optional tour of key features

**System Response:**
- Show key features (Capture, Today, Timeline)
- Explain how to use quick add
- Highlight AI insights
- Allow skip at any point

**User Experience:**
- Contextual tips
- Interactive walkthrough
- Option to skip
- Help always available

## Daily Use Journey

### Morning Routine

**User Action:** User opens Luma in the morning

**System Response:**
- Show Today page with morning greeting and contextual subtitle
- Display Daily Brief with AI-generated summary
- Show Focus section with 2-3 most important items
- Display Insights section with relevant observations
- Show Upcoming section with chronological items
- Display Continue section for unfinished activities
- Show Recent Timeline Preview with recent activity
- Display Floating Capture Button for quick entry

**User Experience:**
- Calm, warm morning view with time-aware greeting
- Clear priorities in Focus section
- Conversational Daily Brief (not chatbot-style)
- Relevant information only, no overwhelm
- Single primary action (Floating Capture Button)
- Warm empty states if no data

### Capture Throughout Day

**User Action:** User captures expense, task, or note

**System Response:**
- Open universal capture sheet
- Text or voice mode selection
- Auto-save draft as user types
- AI suggestions appear as content is entered
- Optional metadata available behind "Add details"
- Subtle processing indicator on save
- Navigate to review or timeline

**User Experience:**
- Effortless capture from anywhere
- No module selection required
- Draft persistence survives accidental closes
- Warm, encouraging empty states
- Passive AI suggestions (no confirmation required)
- Minimal friction
- Clear feedback without interruption

### Evening Review

**User Action:** User reviews day in the evening

**System Response:**
- Show Today page with evening greeting and contextual subtitle
- Display Daily Brief with day's summary
- Show Focus section with any remaining priorities
- Display Insights section with day's observations
- Show Recent Timeline Preview with day's activity
- Display Floating Capture Button for quick entry

**User Experience:**
- Calm, warm evening view with time-aware greeting
- Conversational Daily Brief summarizing the day
- Summary of accomplishments in timeline
- Insights from today's data
- Preparation for tomorrow
- Warm, reassuring empty states if quiet day

## Key User Flows

### Flow 1: Add Expense

**Steps:**
1. User taps quick add button
2. Selects "Expense" type
3. Enters amount
4. Selects category (smart suggestion)
5. Adds note (optional)
6. Taps save

**System Actions:**
- Open quick add sheet
- Show expense form
- Suggest category based on history
- Validate input
- Save to database
- Show success toast
- Update balance display

**User Experience:**
- < 10 seconds to complete
- Smart category suggestions
- Clear feedback
- Returns to previous screen

### Flow 2: Create Goal

**Steps:**
1. User navigates to Goals
2. Taps "Add Goal"
3. Enters goal name
4. Sets target amount
5. Sets deadline
6. Taps save

**System Actions:**
- Navigate to Goals page
- Open goal creation form
- Validate input
- Save to database
- Show success confirmation
- Update goal list

**User Experience:**
- Clear goal creation flow
- Helpful defaults
- Progress visualization
- Connection to spending

### Flow 3: Add Task

**Steps:**
1. User taps quick add button
2. Selects "Task" type
3. Enters task description
4. Sets priority
5. Sets due date (optional)
6. Taps save

**System Actions:**
- Open quick add sheet
- Show task form
- Validate input
- Save to database
- Show success toast
- Update task list

**User Experience:**
- Fast task capture
- Priority options
- Due date flexibility
- Clear organization

### Flow 4: View Timeline

**Steps:**
1. User navigates to Timeline
2. Views chronological data
3. Filters by type (optional)
4. Expands items for details
5. Reflects on patterns

**System Actions:**
- Navigate to Timeline page
- Load chronological data
- Apply filters
- Show expanded details
- Highlight patterns

**User Experience:**
- Clean timeline view
- Easy filtering
- Progressive disclosure
- Pattern insights

## Edge Cases

### Edge Case 1: Offline Mode

**User Action:** User tries to use Luma offline

**System Response:**
- Show cached data
- Allow read-only access
- Queue actions for sync
- Show offline indicator
- Sync when connection restored

**User Experience:**
- Graceful degradation
- Clear offline status
- Data preserved
- Automatic sync

### Edge Case 2: Session Expired

**User Action:** User session expires during use

**System Response:**
- Detect expired session
- Show session expired message
- Redirect to login
- Preserve unsaved data
- Restore after login

**User Experience:**
- Clear error message
- Easy re-authentication
- Data preservation
- Smooth recovery

### Edge Case 3: Data Sync Error

**User Action:** Sync fails due to error

**System Response:**
- Show sync error message
- Provide retry option
- Queue data for later sync
- Log error for debugging
- Show sync status

**User Experience:**
- Clear error communication
- Retry option
- Data safety
- Status visibility

## User Success Metrics

### Engagement Metrics

- Daily active users
- Session duration
- Feature usage patterns
- Quick add frequency
- Page navigation patterns

### Satisfaction Metrics

- Net Promoter Score (NPS)
- User retention rate
- Churn rate
- User feedback ratings
- Support ticket volume

### Outcome Metrics

- Users report better financial understanding
- Users achieve more goals
- Users complete more tasks
- Users feel less stressed
- Users recommend Luma to others

## User Feedback Loops

### In-App Feedback

**User Action:** User provides feedback

**System Response:**
- Show feedback form
- Collect feedback
- Acknowledge receipt
- Route to appropriate team
- Follow up if needed

**User Experience:**
- Easy feedback access
- Clear feedback form
- Acknowledgment of receipt
- Follow-up communication

### Analytics Feedback

**System Action:** Monitor usage patterns

**System Response:**
- Track user behavior
- Identify pain points
- A/B test improvements
- Roll out changes
- Measure impact

**User Experience:**
- Improved features
- Better UX
- Faster performance
- More relevant content

## Continuous Improvement

### User Research

- Regular user interviews
- Usability testing
- A/B testing
- Survey feedback
- Analytics review

### Iteration Process

1. Identify opportunity
2. Research and ideate
3. Design solution
4. Implement changes
5. Test with users
6. Measure impact
7. Iterate based on feedback

## Related Documentation

- **UX Principles**: `docs/UX_PRINCIPLES.md` - User experience principles
- **Product Overview**: `docs/PRODUCT.md` - Product features and differentiation
- **Design System**: `.claude/DESIGN-luma.md` - Design tokens and components

---

**Note:** This user journey document is a living document. It will be updated as we learn more about user behavior and needs.
