# Decision Framework

This document creates a decision-making framework. Every future feature request must answer these questions.

---

## Core Questions

Every feature request must answer these questions before implementation begins:

---

### 1. What user problem does this solve?

**Purpose:** Ensure we're solving real problems, not building features for their own sake.

**Guidance:**
- The problem should be clearly articulated
- Evidence should support that this is a real problem
- The problem should affect a meaningful number of users
- The problem should be worth solving

**Red Flags:**
- Problem is hypothetical
- No evidence of user need
- Problem affects edge cases only
- Problem doesn't align with product vision

---

### 2. Is this required for MVP?

**Purpose:** Maintain focus on core value proposition.

**Guidance:**
- MVP includes only what's essential for the core experience
- Features should be deferred if not essential
- Consider if the product can launch without this
- Consider if users would pay for this

**Red Flags:**
- Feature is "nice to have"
- Feature is for future scale
- Feature is for power users
- Feature is for completeness

---

### 3. Can we validate this quickly?

**Purpose:** Avoid over-investing in unvalidated ideas.

**Guidance:**
- Can we test this with a simple prototype?
- Can we validate with user interviews?
- Can we validate with analytics?
- Can we validate with A/B testing?

**Red Flags:**
- Requires full implementation to validate
- Validation will take months
- Validation is expensive
- Validation is unclear

---

### 4. Does this reduce cognitive load?

**Purpose:** Ensure features make life simpler, not more complex.

**Guidance:**
- Does this make the interface simpler?
- Does this reduce decisions?
- Does this reduce steps?
- Does this feel effortless?

**Red Flags:**
- Adds complexity
- Adds decisions
- Adds steps
- Adds cognitive overhead

---

### 5. Does this align with the Product Manifesto?

**Purpose:** Ensure consistency with core beliefs.

**Guidance:**
- Does it support "Capture first, organize later"?
- Does it support "Reduce cognitive load"?
- Does it support "AI is invisible"?
- Does it support "Time is the primary organizing principle"?
- Does it support "Remove before adding"?
- Does it support "Calm over clever"?
- Does it support "Trust is earned"?
- Does it support "Every interaction should feel intentional"?
- Does it support "Consistency over novelty"?
- Does it support "Simplicity scales"?

**Red Flags:**
- Violates any Product Manifesto principle
- Inconsistent with core beliefs
- Requires exception to principles

---

### 6. Can something simpler achieve the same outcome?

**Purpose:** Avoid over-engineering.

**Guidance:**
- Is there a simpler solution?
- Can we achieve 80% of value with 20% effort?
- Can we defer complexity?
- Can we use existing patterns?

**Red Flags:**
- Only complex solution works
- No simpler alternative
- Over-engineered solution
- Novel solution required

---

### 7. What is the cost of maintaining this?

**Purpose:** Consider long-term impact.

**Guidance:**
- What is the maintenance burden?
- What is the technical debt?
- What is the documentation burden?
- What is the support burden?
- What is the opportunity cost?

**Red Flags:**
- High maintenance cost
- High technical debt
- High documentation burden
- High support burden
- High opportunity cost

---

## Decision Matrix

### Score Each Question

For each question, assign a score:

- **3 points:** Strong yes
- **2 points:** Yes
- **1 point:** Maybe
- **0 points:** No

### Minimum Scores

To proceed, a feature must score:

- **Minimum total:** 15 points (out of 21)
- **No question can score 0**
- **Question 1 (User problem) must score at least 2**
- **Question 5 (Product Manifesto) must score at least 2**

### Example Scoring

| Question | Score | Notes |
|----------|-------|-------|
| What user problem does this solve? | 2 | Clear problem, some evidence |
| Is this required for MVP? | 1 | Not required but valuable |
| Can we validate this quickly? | 2 | Can prototype quickly |
| Does this reduce cognitive load? | 2 | Simplifies experience |
| Does this align with Product Manifesto? | 3 | Fully aligned |
| Can something simpler achieve the same outcome? | 2 | Simple solution exists |
| What is the cost of maintaining this? | 2 | Low maintenance cost |
| **Total** | **14** | **Below threshold** |

**Result:** Defer or simplify

---

## Decision Process

### 1. Submit Feature Request

- Write clear problem statement
- Answer all 7 questions
- Provide evidence
- Propose solution

### 2. Review

- Product manager reviews
- Engineering lead reviews
- UX lead reviews
- Score the feature

### 3. Decision

- **Approve:** Feature proceeds to design/implementation
- **Defer:** Feature postponed to future milestone
- **Reject:** Feature not pursued
- **Simplify:** Feature simplified before proceeding

### 4. Document

- Record decision
- Record reasoning
- Record score
- Update roadmap

---

## Special Cases

### Technical Debt

Technical debt features (refactoring, optimization) use a modified framework:

1. What problem does this solve? (Technical problem)
2. Is this blocking other work?
3. Can we defer this?
4. Does this improve maintainability?
5. Does this reduce future complexity?
6. Is the cost of not fixing higher than fixing?
7. What is the risk of this change?

### Security

Security features use a modified framework:

1. What vulnerability does this address?
2. Is this critical for security?
3. Can we defer this?
4. Does this improve security posture?
5. Does this reduce attack surface?
6. Is the cost of not fixing higher than fixing?
7. What is the risk of this change?

### Compliance

Compliance features use a modified framework:

1. What regulation does this address?
2. Is this required for compliance?
3. Can we defer this?
4. Does this improve compliance posture?
5. Does this reduce compliance risk?
6. Is the cost of not complying higher than complying?
7. What is the risk of this change?

---

## Anti-Patterns

### Never Do These

- Build because competitors have it
- Build for hypothetical users
- Build for power users at expense of beginners
- Build for completeness
- Build because "we might need it"
- Build because it's technically interesting
- Build because it's in the roadmap
- Build without evidence
- Build without clear problem
- Build without clear success metrics

---

## Related Documentation

- **Product Manifesto**: `validation/PRODUCT_MANIFESTO.md` - Core beliefs
- **Product Scorecard**: `validation/PRODUCT_SCORECARD.md` - Quality metrics
- **MVP Checklist**: `validation/MVP_CHECKLIST.md` - Launch requirements
- **Review Guidelines**: `validation/REVIEW_GUIDELINES.md` - Review process

---

**Note:** This decision framework ensures that every feature request is rigorously evaluated before implementation. This prevents scope creep, maintains focus, and ensures resources are spent on high-impact features.
