# Data Model

This document describes the data model for Luma, including database schema, relationships, and data flow.

## Database Overview

Luma uses Supabase (PostgreSQL) as its database. The data model is designed to support the three core experiences: Capture, Today, and Timeline.

## Core Tables

### profiles

User profile information.

**Columns:**
- `id` (uuid, primary key) - References auth.users
- `email` (text) - User email
- `full_name` (text) - User's full name
- `avatar_url` (text) - Avatar image URL
- `currency` (text) - Default currency (e.g., "USD")
- `timezone` (text) - User timezone
- ` created_at` (timestamp) - Creation timestamp
- `updated_at` (timestamp) - Last update timestamp

**Relationships:**
- One-to-one with auth.users
- One-to-many with accounts, categories, transactions, goals, tasks

**Indexes:**
- Primary key on id
- Unique index on email

### accounts

Financial accounts for tracking balances.

**Columns:**
- `id` (uuid, primary key)
- `user_id` (uuid, foreign key → profiles.id)
- `name` (text) - Account name
- `type` (text) - Account type (checking, savings, credit, etc.)
- `balance` (numeric) - Current balance
- `currency` (text) - Account currency
- `created_at` (timestamp)
- `updated_at` (timestamp)

**Relationships:**
- Many-to-one with profiles
- One-to-many with transactions

**Indexes:**
- Primary key on id
- Index on user_id

### categories

Expense and income categories.

**Columns:**
- `id` (uuid, primary key)
- `user_id` (uuid, foreign key → profiles.id)
- `name` (text) - Category name
- `type` (text) - Category type (expense, income)
- `color` (text) - Category color for UI
- `icon` (text) - Category icon
- `created_at` (timestamp)
- `updated_at` (timestamp)

**Relationships:**
- Many-to-one with profiles
- One-to-many with transactions

**Indexes:**
- Primary key on id
- Index on user_id
- Index on type

### transactions

Financial transactions (expenses and income).

**Columns:**
- `id` (uuid, primary key)
- `user_id` (uuid, foreign key → profiles.id)
- `account_id` (uuid, foreign key → accounts.id)
- `category_id` (uuid, foreign key → categories.id)
- `amount` (numeric) - Transaction amount
- `type` (text) - Transaction type (expense, income)
- `description` (text) - Transaction description
- `date` (date) - Transaction date
- `created_at` (timestamp)
- `updated_at` (timestamp)

**Relationships:**
- Many-to-one with profiles
- Many-to-one with accounts
- Many-to-one with categories

**Indexes:**
- Primary key on id
- Index on user_id
- Index on account_id
- Index on category_id
- Index on date
- Composite index on (user_id, date)

### goals

User goals (financial, personal, professional).

**Columns:**
- `id` (uuid, primary key)
- `user_id` (uuid, foreign key → profiles.id)
- `name` (text) - Goal name
- `description` (text) - Goal description
- `target_amount` (numeric) - Target amount (for financial goals)
- `current_amount` (numeric) - Current progress
- `currency` (text) - Goal currency
- `deadline` (date) - Goal deadline
- `status` (text) - Goal status (active, completed, paused)
- `created_at` (timestamp)
- `updated_at` (timestamp)

**Relationships:**
- Many-to-one with profiles

**Indexes:**
- Primary key on id
- Index on user_id
- Index on status
- Index on deadline

### tasks

User tasks and to-dos.

**Columns:**
- `id` (uuid, primary key)
- `user_id` (uuid, foreign key → profiles.id)
- `goal_id` (uuid, foreign key → goals.id, nullable)
- `title` (text) - Task title
- `description` (text) - Task description
- `priority` (text) - Task priority (low, medium, high)
- `status` (text) - Task status (pending, in_progress, completed)
- `due_date` (date) - Task due date
- `completed_at` (timestamp) - Completion timestamp
- `created_at` (timestamp)
- `updated_at` (timestamp)

**Relationships:**
- Many-to-one with profiles
- Many-to-one with goals (optional)

**Indexes:**
- Primary key on id
- Index on user_id
- Index on goal_id
- Index on status
- Index on due_date
- Index on priority

### recurring_transactions

Recurring transaction rules.

**Columns:**
- `id` (uuid, primary key)
- `user_id` (uuid, foreign key → profiles.id)
- `account_id` (uuid, foreign key → accounts.id)
- `category_id` (uuid, foreign key → categories.id)
- `amount` (numeric) - Recurring amount
- `type` (text) - Transaction type (expense, income)
- `description` (text) - Transaction description
- `frequency` (text) - Recurrence frequency (daily, weekly, monthly, yearly)
- `interval` (integer) - Interval between occurrences
- `next_date` (date) - Next occurrence date
- `active` (boolean) - Whether rule is active
- `created_at` (timestamp)
- `updated_at` (timestamp)

**Relationships:**
- Many-to-one with profiles
- Many-to-one with accounts
- Many-to-one with categories

**Indexes:**
- Primary key on id
- Index on user_id
- Index on next_date
- Index on active

## Entity Relationships

### User-Centric Relationships

```
profiles (1) ──────< (N) accounts
profiles (1) ──────< (N) categories
profiles (1) ──────< (N) transactions
profiles (1) ──────< (N) goals
profiles (1) ──────< (N) tasks
profiles (1) ──────< (N) recurring_transactions
```

### Transaction Relationships

```
accounts (1) ──────< (N) transactions
categories (1) ──────< (N) transactions
```

### Goal-Task Relationships

```
goals (1) ──────< (N) tasks (optional)
```

### Recurring Transaction Relationships

```
accounts (1) ──────< (N) recurring_transactions
categories (1) ──────< (N) recurring_transactions
```

## Data Flow

### Expense Creation Flow

1. User creates expense via quick add
2. Data validated (amount, category, account)
3. Transaction record created in database
4. Account balance updated
5. Transaction reflected in Today and Timeline
6. AI context engine analyzes for patterns

### Goal Creation Flow

1. User creates goal
2. Goal record created in database
3. Optional tasks can be linked to goal
4. Goal progress tracked over time
5. Goal reflected in Today and Timeline

### Task Creation Flow

1. User creates task via quick add
2. Task record created in database
3. Optionally linked to goal
4. Task reflected in Today
5. Completion updates goal progress if linked

### Recurring Transaction Flow

1. User creates recurring rule
2. Rule stored in database
3. Scheduled job checks for due transactions
4. Creates transaction records when due
5. Updates next_date for next occurrence

## Row-Level Security (RLS)

### Security Policies

**profiles:**
- Users can read their own profile
- Users can update their own profile
- System creates profiles on signup

**accounts:**
- Users can read their own accounts
- Users can create accounts for themselves
- Users can update their own accounts
- Users can delete their own accounts

**categories:**
- Users can read their own categories
- Users can create categories for themselves
- Users can update their own categories
- Users can delete their own categories

**transactions:**
- Users can read their own transactions
- Users can create transactions for themselves
- Users can update their own transactions
- Users can delete their own transactions

**goals:**
- Users can read their own goals
- Users can create goals for themselves
- Users can update their own goals
- Users can delete their own goals

**tasks:**
- Users can read their own tasks
- Users can create tasks for themselves
- Users can update their own tasks
- Users can delete their own tasks

**recurring_transactions:**
- Users can read their own recurring rules
- Users can create recurring rules for themselves
- Users can update their own recurring rules
- Users can delete their own recurring rules

## Data Integrity

### Constraints

**Foreign Key Constraints:**
- All foreign key relationships enforced
- Cascade delete for dependent records (where appropriate)
- Restrict delete for critical relationships

**Unique Constraints:**
- Email addresses unique per user
- Category names unique per user

**Check Constraints:**
- Amount values must be positive
- Status values must be from allowed set
- Type values must be from allowed set

### Triggers

**Automatic Timestamps:**
- created_at set on record creation
- updated_at updated on record modification

**Balance Updates:**
- Account balance updated when transaction created/deleted
- Goal progress updated when task completed (if linked)

## Data Migration

### Schema Versioning

- Schema changes tracked with migrations
- Backward compatibility maintained where possible
- Data migration scripts for breaking changes

### Migration Strategy

1. Create migration script
2. Test on staging environment
3. Backup production database
4. Apply migration to production
5. Verify data integrity
6. Monitor for issues

## Performance Optimization

### Indexing Strategy

- Indexes on foreign keys
- Indexes on frequently queried columns
- Composite indexes for common query patterns
- Regular index maintenance

### Query Optimization

- Use prepared statements
- Optimize JOIN operations
- Use pagination for large datasets
- Cache frequently accessed data
- Use database views for complex queries

## Data Archival

### Archival Strategy

- Archive old transactions (older than 2 years)
- Archive completed tasks (older than 1 year)
- Archive completed goals (older than 1 year)
- Keep archival data accessible but separate

### Archival Process

1. Identify records for archival
2. Move to archival tables
3. Update indexes
4. Verify data integrity
5. Monitor performance impact

## Data Export

### Export Formats

- CSV for spreadsheet compatibility
- JSON for programmatic access
- PDF for human-readable reports

### Export Scope

- User can export all their data
- User can export specific data types
- Export includes all related records
- Export respects privacy settings

## Related Documentation

- **Architecture**: `docs/ARCHITECTURE.md` - System architecture and technology stack
- **API Documentation**: `docs/API.md` - API endpoints and usage
- **Security**: `docs/SECURITY.md` - Security practices and policies

---

**Note:** This data model document is a living document. It will be updated as the schema evolves and new features are added.
