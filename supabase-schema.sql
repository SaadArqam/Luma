-- Supabase Schema for PaisaTrack
-- Run this in your Supabase SQL Editor to set up all necessary tables

-- 0. Accounts Table
CREATE TABLE IF NOT EXISTS accounts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  icon TEXT,
  color TEXT,
  currency TEXT DEFAULT 'INR',
  opening_balance NUMERIC DEFAULT 0,
  archived BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Disable RLS for development
ALTER TABLE accounts DISABLE ROW LEVEL SECURITY;

-- 1. Categories Table
CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  icon TEXT NOT NULL,
  color TEXT,
  type TEXT NOT NULL DEFAULT 'expense' CHECK (type IN ('income', 'expense')),
  daily_budget NUMERIC,
  parent_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  archived BOOLEAN DEFAULT FALSE,
  ordering INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add missing columns to categories (for existing databases)
ALTER TABLE categories ADD COLUMN IF NOT EXISTS color TEXT;
ALTER TABLE categories ADD COLUMN IF NOT EXISTS type TEXT NOT NULL DEFAULT 'expense' CHECK (type IN ('income', 'expense'));
ALTER TABLE categories ADD COLUMN IF NOT EXISTS parent_id UUID REFERENCES categories(id) ON DELETE SET NULL;
ALTER TABLE categories ADD COLUMN IF NOT EXISTS archived BOOLEAN DEFAULT FALSE;
ALTER TABLE categories ADD COLUMN IF NOT EXISTS ordering INTEGER DEFAULT 0;
ALTER TABLE categories ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Add missing user_id column if it doesn't exist
ALTER TABLE categories ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Disable RLS for development (or create policies)
ALTER TABLE categories DISABLE ROW LEVEL SECURITY;

-- 2. Expenses Table
CREATE TABLE IF NOT EXISTS expenses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  account_id UUID REFERENCES accounts(id) ON DELETE SET NULL,
  amount NUMERIC NOT NULL,
  note TEXT,
  merchant TEXT,
  location TEXT,
  tags TEXT[],
  recurring_expense_id UUID REFERENCES recurring_expenses(id) ON DELETE SET NULL,
  date TIMESTAMPTZ NOT NULL,
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add missing columns if they don't exist (for existing databases)
ALTER TABLE expenses ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE expenses ADD COLUMN IF NOT EXISTS account_id UUID REFERENCES accounts(id) ON DELETE SET NULL;
ALTER TABLE expenses ADD COLUMN IF NOT EXISTS merchant TEXT;
ALTER TABLE expenses ADD COLUMN IF NOT EXISTS location TEXT;
ALTER TABLE expenses ADD COLUMN IF NOT EXISTS tags TEXT[];
ALTER TABLE expenses ADD COLUMN IF NOT EXISTS recurring_expense_id UUID REFERENCES recurring_expenses(id) ON DELETE SET NULL;
ALTER TABLE expenses ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Disable RLS for development
ALTER TABLE expenses DISABLE ROW LEVEL SECURITY;

-- 3. Balance Entries Table
CREATE TABLE IF NOT EXISTS balance_entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  account_id UUID REFERENCES accounts(id) ON DELETE SET NULL,
  amount NUMERIC NOT NULL,
  note TEXT,
  merchant TEXT,
  location TEXT,
  tags TEXT[],
  type TEXT NOT NULL CHECK (type IN ('credit', 'debit')),
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  date TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add missing columns if they don't exist (for existing databases)
ALTER TABLE balance_entries ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE balance_entries ADD COLUMN IF NOT EXISTS account_id UUID REFERENCES accounts(id) ON DELETE SET NULL;
ALTER TABLE balance_entries ADD COLUMN IF NOT EXISTS merchant TEXT;
ALTER TABLE balance_entries ADD COLUMN IF NOT EXISTS location TEXT;
ALTER TABLE balance_entries ADD COLUMN IF NOT EXISTS tags TEXT[];
ALTER TABLE balance_entries ADD COLUMN IF NOT EXISTS category_id UUID REFERENCES categories(id) ON DELETE SET NULL;
ALTER TABLE balance_entries ADD COLUMN IF NOT EXISTS date TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE balance_entries ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Disable RLS for development
ALTER TABLE balance_entries DISABLE ROW LEVEL SECURITY;

-- 4. Budgets Table
CREATE TABLE IF NOT EXISTS budgets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  period TEXT NOT NULL CHECK (period IN ('weekly', 'monthly', 'custom')),
  custom_start_date TIMESTAMPTZ,
  custom_end_date TIMESTAMPTZ,
  custom_days INTEGER,
  rollover BOOLEAN DEFAULT FALSE,
  archived BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Disable RLS for development
ALTER TABLE budgets DISABLE ROW LEVEL SECURITY;

-- 5. Budget Categories (join table)
CREATE TABLE IF NOT EXISTS budget_categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  budget_id UUID REFERENCES budgets(id) ON DELETE CASCADE,
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Disable RLS for development
ALTER TABLE budget_categories DISABLE ROW LEVEL SECURITY;

-- 6. Stipend Config Table (singleton)
CREATE TABLE IF NOT EXISTS stipend_config (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  amount NUMERIC NOT NULL,
  credit_day INTEGER NOT NULL CHECK (credit_day >= 1 AND credit_day <= 31),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add missing user_id column if it doesn't exist
ALTER TABLE stipend_config ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Disable RLS for development
ALTER TABLE stipend_config DISABLE ROW LEVEL SECURITY;

-- 7. Recurring Expenses Table
CREATE TABLE IF NOT EXISTS recurring_expenses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  account_id UUID REFERENCES accounts(id) ON DELETE SET NULL,
  frequency TEXT NOT NULL CHECK (frequency IN ('weekly', 'monthly', 'custom')),
  custom_days INTEGER,
  next_due_date DATE NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add missing columns if they don't exist (for existing databases)
ALTER TABLE recurring_expenses ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE recurring_expenses ADD COLUMN IF NOT EXISTS account_id UUID REFERENCES accounts(id) ON DELETE SET NULL;
ALTER TABLE recurring_expenses ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Disable RLS for development
ALTER TABLE recurring_expenses DISABLE ROW LEVEL SECURITY;

-- 8. Merchants Table (preparation)
CREATE TABLE IF NOT EXISTS merchants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  icon TEXT,
  color TEXT,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Disable RLS for development
ALTER TABLE merchants DISABLE ROW LEVEL SECURITY;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_accounts_user_id ON accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_expenses_date ON expenses(date);
CREATE INDEX IF NOT EXISTS idx_expenses_category_id ON expenses(category_id);
CREATE INDEX IF NOT EXISTS idx_expenses_account_id ON expenses(account_id);
CREATE INDEX IF NOT EXISTS idx_expenses_user_id ON expenses(user_id);
CREATE INDEX IF NOT EXISTS idx_expenses_merchant ON expenses(merchant);
CREATE INDEX IF NOT EXISTS idx_balance_entries_type ON balance_entries(type);
CREATE INDEX IF NOT EXISTS idx_balance_entries_account_id ON balance_entries(account_id);
CREATE INDEX IF NOT EXISTS idx_balance_entries_user_id ON balance_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_balance_entries_date ON balance_entries(date);
CREATE INDEX IF NOT EXISTS idx_categories_user_id ON categories(user_id);
CREATE INDEX IF NOT EXISTS idx_categories_type ON categories(type);
CREATE INDEX IF NOT EXISTS idx_categories_parent_id ON categories(parent_id);
CREATE INDEX IF NOT EXISTS idx_stipend_config_user_id ON stipend_config(user_id);
CREATE INDEX IF NOT EXISTS idx_recurring_expenses_user_id ON recurring_expenses(user_id);
CREATE INDEX IF NOT EXISTS idx_budgets_user_id ON budgets(user_id);
CREATE INDEX IF NOT EXISTS idx_budgets_period ON budgets(period);
CREATE INDEX IF NOT EXISTS idx_budget_categories_budget_id ON budget_categories(budget_id);
CREATE INDEX IF NOT EXISTS idx_budget_categories_category_id ON budget_categories(category_id);
CREATE INDEX IF NOT EXISTS idx_merchants_user_id ON merchants(user_id);

-- Create trigger for updated_at on tables
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Drop existing triggers if they exist before recreating
DROP TRIGGER IF EXISTS update_accounts_updated_at ON accounts;
CREATE TRIGGER update_accounts_updated_at BEFORE UPDATE ON accounts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_categories_updated_at ON categories;
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_expenses_updated_at ON expenses;
CREATE TRIGGER update_expenses_updated_at BEFORE UPDATE ON expenses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_balance_entries_updated_at ON balance_entries;
CREATE TRIGGER update_balance_entries_updated_at BEFORE UPDATE ON balance_entries
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_budgets_updated_at ON budgets;
CREATE TRIGGER update_budgets_updated_at BEFORE UPDATE ON budgets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_stipend_config_updated_at ON stipend_config;
CREATE TRIGGER update_stipend_config_updated_at BEFORE UPDATE ON stipend_config
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_recurring_expenses_updated_at ON recurring_expenses;
CREATE TRIGGER update_recurring_expenses_updated_at BEFORE UPDATE ON recurring_expenses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_merchants_updated_at ON merchants;
CREATE TRIGGER update_merchants_updated_at BEFORE UPDATE ON merchants
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
