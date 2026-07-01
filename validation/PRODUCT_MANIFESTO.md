# Product Manifesto

This document defines the core beliefs and principles that guide every product decision at Luma. It serves as the philosophical filter for all features, designs, and implementations.

---

## Core Beliefs

### 1. Capture First. Organize Later.

The primary action in Luma is capture. Users should never hesitate to record something because they're worried about where it goes or how to organize it.

**Implications:**
- Quick add is always one tap away
- Smart defaults minimize cognitive load
- Organization happens automatically in the background
- Users can capture without thinking about categories, tags, or structure

**Anti-Pattern:**
- Requiring users to select categories before capturing
- Complex organization flows that interrupt capture
- Making users think about where something belongs

---

### 2. Reduce Cognitive Load.

Every interaction should require minimal mental effort. The interface should feel effortless, not demanding.

**Implications:**
- Progressive disclosure of information
- Smart defaults based on context
- Clear visual hierarchy
- Minimal required fields
- Predictable interactions

**Anti-Pattern:**
- Dense information displays
- Complex decision trees
- Multiple simultaneous actions
- Overwhelming options

---

### 3. AI is Invisible.

AI should enhance the experience without calling attention to itself. Users should benefit from intelligence without feeling like they're using an "AI product."

**Implications:**
- AI operates in the background
- Insights surface naturally
- Suggestions feel like smart defaults, not "AI features"
- No AI branding or terminology in the UI
- Intelligence feels like a natural extension of the product

**Anti-Pattern:**
- "AI-powered" labels
- Chat interfaces for simple tasks
- Explicit AI toggles
- Anthropomorphizing AI
- Making AI the hero of the experience

---

### 4. Time is the Primary Organizing Principle.

Life happens chronologically. The timeline is the natural structure for understanding one's life.

**Implications:**
- Timeline is the primary view of history
- Events are grouped by time, not by module
- Today, Yesterday, This Week, Last Week, Months, Earlier
- Time-based context drives relevance
- Historical patterns emerge through chronological organization

**Anti-Pattern:**
- Organizing by feature or module
- Complex folder hierarchies
- Manual tagging as the primary organization
- Forcing users to create their own structure

---

### 5. Remove Before Adding.

Every feature should justify its existence. If something doesn't serve a clear purpose, remove it.

**Implications:**
- Regular feature audits
- Question every UI element
- Simplify before expanding
- Default to "no" for new features
- Measure impact before keeping

**Anti-Pattern:**
- Feature creep
- Adding options "just in case"
- Keeping unused features for completeness
- Building for edge cases

---

### 6. Calm Over Clever.

The interface should feel calm and composed, not clever or flashy. Subtlety is a feature.

**Implications:**
- Generous whitespace
- Subtle animations
- Quiet visual language
- No flashy transitions
- Consistent, predictable behavior

**Anti-Pattern:**
- Attention-grabbing animations
- Novel interactions for novelty's sake
- Over-designed components
- Constant motion
- Surprising behavior

---

### 7. Trust is Earned.

Users trust Luma with their most personal data. This trust must be earned through transparency, security, and respect.

**Implications:**
- Transparent data usage
- Clear privacy controls
- Secure by default
- No hidden data collection
- User owns their data

**Anti-Pattern:**
- Vague privacy policies
- Hidden data collection
- Locking data in
- Selling user data
- Security as an afterthought

---

### 8. Every Interaction Should Feel Intentional.

Nothing should feel accidental or arbitrary. Every element should have a clear purpose.

**Implications:**
- Clear affordances
- Predictable outcomes
- Consistent patterns
- No mystery interactions
- Every tap has a clear result

**Anti-Pattern:**
- Hidden gestures
- Unclear icons
- Ambiguous buttons
- Surprising behaviors
- Inconsistent patterns

---

### 9. Consistency Over Novelty.

Familiar patterns are better than novel ones. Users should feel like they already know how to use Luma.

**Implications:**
- Follow platform conventions
- Reuse patterns across the app
- Standard icons and terminology
- Predictable layouts
- No one-off designs

**Anti-Pattern:**
- Custom navigation patterns
- Novel interactions for common tasks
- Inconsistent component styles
- Unique terminology
- Breaking platform conventions

---

### 10. Simplicity Scales.

Complexity doesn't scale. Simple solutions work for small and large use cases alike.

**Implications:**
- Simple data models
- Straightforward user flows
- Minimal configuration
- Clear mental models
- Easy to explain

**Anti-Pattern:**
- Complex configuration options
- Nested settings
- Multiple ways to do the same thing
- Power user features that complicate the base experience
- Over-engineering

---

## Decision Framework

When making any product decision, ask:

1. **Does this align with the Product Manifesto?**
   - If no, don't do it.

2. **Does this reduce cognitive load?**
   - If it adds complexity, reconsider.

3. **Is this necessary for the core experience?**
   - If it's nice-to-have, defer.

4. **Can we achieve the same outcome more simply?**
   - If yes, choose the simpler path.

5. **Will this still be valuable in a year?**
   - If it's a short-term fix, reconsider.

6. **Does this respect the user's trust?**
   - If it compromises privacy or security, don't do it.

7. **Is this consistent with existing patterns?**
   - If it breaks patterns, have a strong reason.

---

## Anti-Patterns

### Never Do These

- Add features because competitors have them
- Build for hypothetical users
- Optimize for power users at the expense of beginners
- Add complexity for flexibility
- Make users think about the interface
- Hide important features
- Use confusing terminology
- Break established patterns
- Surprise users with changes
- Prioritize features over users

---

## Related Documentation

- **UX Principles**: `docs/UX_PRINCIPLES.md` - Detailed UX guidelines
- **Design System**: `.claude/DESIGN-luma.md` - Visual design standards
- **Product Overview**: `docs/PRODUCT.md` - Product vision and features
- **Architecture**: `docs/ARCHITECTURE.md` - Technical architecture

---

**Note:** This Product Manifesto is a living document. It will evolve as we learn more about user needs and the product vision matures. However, the core beliefs should remain stable and serve as the foundation for all product decisions.
