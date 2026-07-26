-- Daily Brief Schema for Luma
-- Create this in your Supabase SQL Editor

-- Table: daily_briefs
CREATE TABLE IF NOT EXISTS daily_briefs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    date DATE NOT NULL,
    sections JSONB NOT NULL,
    generated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_daily_briefs_user_id ON daily_briefs(user_id);
CREATE INDEX IF NOT EXISTS idx_daily_briefs_date ON daily_briefs(date);
CREATE UNIQUE INDEX IF NOT EXISTS idx_daily_briefs_user_date ON daily_briefs(user_id, date);

-- Row Level Security Policies
ALTER TABLE daily_briefs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own daily briefs"
    ON daily_briefs FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own daily briefs"
    ON daily_briefs FOR INSERT
    WITH CHECK (auth.uid() = user_id);
