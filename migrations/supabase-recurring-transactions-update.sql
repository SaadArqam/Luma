-- Recurring Transactions Update for Epic 5
-- Run this in your Supabase SQL Editor

-- 1. Rename recurring_expenses to recurring_transactions
ALTER TABLE recurring_expenses RENAME TO recurring_transactions;

-- 2. Add new columns to support all required fields
ALTER TABLE recurring_transactions 
ADD COLUMN IF NOT EXISTS type TEXT NOT NULL DEFAULT 'expense' CHECK (type IN ('income', 'expense')),
ADD COLUMN IF NOT EXISTS start_date DATE NOT NULL DEFAULT CURRENT_DATE,
ADD COLUMN IF NOT EXISTS end_date DATE,
ADD COLUMN IF NOT EXISTS notes TEXT;

-- 3. Update frequency check to include daily and yearly
ALTER TABLE recurring_transactions 
DROP CONSTRAINT IF EXISTS recurring_transactions_frequency_check;

ALTER TABLE recurring_transactions 
ADD CONSTRAINT recurring_transactions_frequency_check 
CHECK (frequency IN ('daily', 'weekly', 'monthly', 'yearly', 'custom'));

-- 4. Add index on next_due_date for better query performance
CREATE INDEX IF NOT EXISTS idx_recurring_transactions_next_due_date ON recurring_transactions(next_due_date);

-- 5. Add index on type and is_active
CREATE INDEX IF NOT EXISTS idx_recurring_transactions_type ON recurring_transactions(type);
CREATE INDEX IF NOT EXISTS idx_recurring_transactions_is_active ON recurring_transactions(is_active);

-- 6. Update the trigger (just in case)
DROP TRIGGER IF EXISTS update_recurring_expenses_updated_at ON recurring_transactions;
DROP TRIGGER IF EXISTS update_recurring_transactions_updated_at ON recurring_transactions;
CREATE TRIGGER update_recurring_transactions_updated_at BEFORE UPDATE ON recurring_transactions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
