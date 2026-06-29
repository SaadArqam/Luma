# UX Principles

This document outlines the user experience principles that guide Luma's design and development decisions.

## Core Principles

### 1. Calm First

Luma's primary UX principle is calm. The interface should reduce stress, not add to it.

**Guidelines:**
- Use generous whitespace to create breathing room
- Avoid overwhelming users with information
- Present information progressively, not all at once
- Use subtle animations, not flashy ones
- Maintain a quiet, composed visual language

**Examples:**
- Today page shows only what matters now, not everything
- Quick add sheet focuses on one action at a time
- Empty states provide calm guidance, not dead space
- Loading states are subtle and reassuring

### 2. Understanding Over Tracking

Luma helps users understand their life, not just track data.

**Guidelines:**
- Show patterns and insights, not just raw data
- Provide context for information
- Help users see connections between different aspects of their life
- Surface relevant information based on context
- Make data meaningful through visualization

**Examples:**
- Spending insights show patterns over time
- Goals connect to spending habits
- Tasks relate to broader life objectives
- Timeline shows progress and reflection points

### 3. Single Primary Action

Every screen should have one clear primary action.

**Guidelines:**
- Identify the most important action on each screen
- Make the primary action visually distinct
- Secondary actions should be subtle
- Avoid competing CTAs
- Guide users to what matters most

**Examples:**
- Today page: Quick add is the primary action
- Expense detail: Edit or delete are clear options
- Goal page: Update progress is the primary action
- Task list: Add task is the primary action

### 4. Progressive Disclosure

Show information progressively based on user needs and context.

**Guidelines:**
- Start with the most important information
- Reveal details on demand
- Use expand/collapse for complex information
- Provide clear affordances for revealing more
- Maintain context when drilling down

**Examples:**
- Transaction details expand on tap
- Goal milestones show summary, expand for details
- Task details reveal on interaction
- Charts show summary, expand for detailed views

### 5. Contextual Relevance

Show users what's relevant to them right now.

**Guidelines:**
- Use time-based context (morning vs evening)
- Consider user behavior patterns
- Prioritize information based on relevance
- Adapt content based on user goals
- Make smart defaults

**Examples:**
- Today page shows morning tasks in the morning
- Spending insights highlight recent patterns
- Goal progress emphasizes near-term milestones
- Task list prioritizes urgent items

### 6. Fast Capture

Make it easy to capture information quickly.

**Guidelines:**
- Provide quick add from anywhere
- Use smart defaults
- Minimize required fields
- Support keyboard shortcuts
- Make capture frictionless

**Examples:**
- Quick add sheet accessible from any screen
- Smart category suggestions based on history
- Keyboard shortcuts for power users
- Voice input support (future)
- Gesture-based capture (future)

## Navigation Principles

### Clear Navigation Structure

Users should always know where they are and how to get back.

**Guidelines:**
- Maintain consistent navigation patterns
- Show current location clearly
- Provide clear back navigation
- Use familiar icons and labels
- Keep navigation shallow

**Examples:**
- Floating dock on mobile shows current section
- Sidebar on desktop shows navigation hierarchy
- Breadcrumbs for deep navigation
- Clear active states

### Efficient Navigation

Users should be able to navigate quickly to what they need.

**Guidelines:**
- Keep navigation accessible
- Use gestures for common actions
- Provide search functionality
- Support keyboard navigation
- Minimize navigation depth

**Examples:**
- Swipe gestures for common actions
- Search for transactions, goals, tasks
- Keyboard shortcuts for power users
- Tab-based navigation for main sections

## Input Principles

### Minimal Friction

Make data entry as easy as possible.

**Guidelines:**
- Minimize required fields
- Use smart defaults
- Provide autocomplete
- Support multiple input methods
- Validate inline

**Examples:**
- Quick add requires minimal information
- Category suggestions based on history
- Date defaults to today
- Amount keyboard for financial inputs

### Clear Feedback

Provide immediate feedback on user actions.

**Guidelines:**
- Show success states clearly
- Provide error messages inline
- Use loading states for async actions
- Confirm destructive actions
- Animate state changes

**Examples:**
- Success toast after adding expense
- Inline validation for form fields
- Loading spinner during save
- Confirmation dialog for deletion
- Smooth transitions between states

## Error Handling

### Helpful Error Messages

Errors should be helpful and actionable.

**Guidelines:**
- Explain what went wrong
- Suggest how to fix it
- Use clear, non-technical language
- Provide recovery options
- Maintain calm tone

**Examples:**
- "Unable to save expense. Please check your connection."
- "This category doesn't exist. Would you like to create it?"
- "Session expired. Please sign in again."

### Graceful Degradation

Handle errors gracefully without breaking the experience.

**Guidelines:**
- Show cached data when offline
- Provide retry options
- Maintain partial functionality
- Communicate limitations clearly
- Preserve user input

**Examples:**
- Show last known balance when offline
- Retry button for failed requests
- Read-only mode during maintenance
- Clear message about limited functionality

## Accessibility

### Inclusive Design

Luma should be usable by everyone.

**Guidelines:**
- Support keyboard navigation
- Provide screen reader support
- Ensure sufficient color contrast
- Respect reduced motion preferences
- Support text resizing

**Examples:**
- All interactive elements keyboard accessible
- ARIA labels for screen readers
- WCAG AA contrast ratios
- Reduced motion option
- Scalable text

### Clear Visual Hierarchy

Make information scannable and understandable.

**Guidelines:**
- Use size and weight for hierarchy
- Use color for emphasis, not decoration
- Maintain consistent spacing
- Group related information
- Use clear labels

**Examples:**
- Large headings for sections
- Accent color for primary actions
- Consistent spacing between elements
- Cards for grouping related content
- Clear labels for all inputs

## Performance

### Fast Interactions

The interface should feel fast and responsive.

**Guidelines:**
- Optimize for perceived performance
- Use loading states for async operations
- Provide optimistic updates
- Minimize perceived latency
- Smooth animations

**Examples:**
- Optimistic UI updates for quick actions
- Skeleton screens for loading content
- Smooth transitions between states
- Fast page transitions
- Responsive interactions

### Efficient Data Loading

Load data efficiently without overwhelming the user.

**Guidelines:**
- Load data progressively
- Use pagination for large datasets
- Cache frequently accessed data
- Lazy load heavy content
- Prioritize critical data

**Examples:**
- Infinite scroll for transactions
- Lazy load chart data
- Cache user preferences
- Load images on demand
- Prioritize current data over historical

## Mobile-First Design

### Touch-Friendly Interactions

Design for touch first, keyboard second.

**Guidelines:**
- Large touch targets (44px minimum)
- Support gestures
- Optimize for one-handed use
- Consider thumb reach zones
- Provide haptic feedback (future)

**Examples:**
- 48px minimum touch targets
- Swipe actions for cards
- Bottom navigation for easy reach
- Pull-to-refresh
- Haptic feedback on actions

### Responsive Layouts

Adapt to different screen sizes gracefully.

**Guidelines:**
- Single column on mobile
- Multi-column on larger screens
- Adapt navigation to screen size
- Scale typography appropriately
- Maintain functionality across sizes

**Examples:**
- Single column on mobile, multi-column on desktop
- Floating dock on mobile, sidebar on desktop
- Scaled typography for different screens
- Consistent functionality across devices

## Privacy and Trust

### Transparent Data Usage

Be clear about how user data is used.

**Guidelines:**
- Explain data collection
- Provide privacy settings
- Show data usage clearly
- Allow data export
- Support data deletion

**Examples:**
- Clear privacy policy
- Settings for data sharing
- Data export functionality
- Account deletion option
- Clear data retention policy

### Secure by Default

Security should be built in, not added on.

**Guidelines:**
- Secure authentication
- Encrypted data storage
- Secure API endpoints
- Regular security updates
- Clear security communication

**Examples:**
- Secure authentication with Supabase
- Encrypted data at rest
- HTTPS for all connections
- Regular security audits
- Clear communication about security

## Onboarding

### Guided Introduction

Help users get started quickly.

**Guidelines:**
- Minimal setup required
- Clear next steps
- Progressive feature introduction
- Contextual help
- Skip when possible

**Examples:**
- Quick account setup
- Guided tour of key features
- Contextual tips
- Option to skip onboarding
- Help always available

### Continuous Learning

Help users learn features over time.

**Guidelines:**
- Contextual tips
- Progressive feature discovery
- Help documentation
- In-app guidance
- Feature highlights

**Examples:**
- Tips for new features
- Progressive feature introduction
- Accessible help documentation
- In-app guidance
- Feature announcements

## Feedback Loops

### User Feedback

Collect and act on user feedback.

**Guidelines:**
- Provide easy feedback channels
- Acknowledge feedback
- Act on feedback
- Communicate changes
- Close the loop

**Examples:**
- In-app feedback form
- Response to feedback
- Feature updates based on feedback
- Communication about changes
- Thank users for feedback

### Continuous Improvement

Iterate based on user behavior and feedback.

**Guidelines:**
- Monitor usage patterns
- Identify pain points
- Test improvements
- Roll out changes gradually
- Measure impact

**Examples:**
- Analytics for usage patterns
- User interviews
- A/B testing
- Feature flags
- Success metrics

## Anti-Patterns

### Avoid These UX Mistakes

**Don't:**
- Overwhelm users with information
- Hide important features
- Use confusing terminology
- Make users think about the interface
- Add friction unnecessarily
- Ignore accessibility
- Break established patterns
- Surprise users with changes
- Make users feel stupid
- Prioritize features over users

**Do:**
- Keep interfaces simple and calm
- Make features discoverable
- Use clear, simple language
- Let users focus on their life
- Remove friction where possible
- Design for everyone
- Follow established patterns
- Communicate changes clearly
- Respect user intelligence
- Prioritize user needs

## Related Documentation

- **Design System**: `.claude/DESIGN-luma.md` - Design tokens and component specifications
- **Design Taste**: `docs/TASTE.md` - Aesthetic preferences and design philosophy
- **Product Philosophy**: `docs/PHILOSOPHY.md` - Core beliefs and principles
- **Brand Guidelines**: `docs/BRAND.md` - Brand identity and voice

---

**Note:** These UX principles are a living document. They will be updated as we learn more about user needs and behaviors.
