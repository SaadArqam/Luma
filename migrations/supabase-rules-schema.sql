-- Rules Engine Schema for Luma
-- Create this in your Supabase SQL Editor

-- Table: rules
CREATE TABLE IF NOT EXISTS rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    trigger JSONB NOT NULL,
    conditions JSONB NOT NULL DEFAULT '[]',
    actions JSONB NOT NULL DEFAULT '[]',
    enabled BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table: rule_execution_logs
CREATE TABLE IF NOT EXISTS rule_execution_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    rule_id UUID REFERENCES rules(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    event_id TEXT NOT NULL,
    success BOOLEAN NOT NULL,
    error TEXT,
    executed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_rules_user_id ON rules(user_id);
CREATE INDEX IF NOT EXISTS idx_rules_enabled ON rules(enabled);
CREATE INDEX IF NOT EXISTS idx_rule_execution_logs_rule_id ON rule_execution_logs(rule_id);
CREATE INDEX IF NOT EXISTS idx_rule_execution_logs_user_id ON rule_execution_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_rule_execution_logs_executed_at ON rule_execution_logs(executed_at);

-- Row Level Security Policies
ALTER TABLE rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE rule_execution_logs ENABLE ROW LEVEL SECURITY;

-- Policies for rules
CREATE POLICY "Users can view their own rules"
    ON rules FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own rules"
    ON rules FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own rules"
    ON rules FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own rules"
    ON rules FOR DELETE
    USING (auth.uid() = user_id);

-- Policies for rule_execution_logs
CREATE POLICY "Users can view their own execution logs"
    ON rule_execution_logs FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own execution logs"
    ON rule_execution_logs FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Function to update updated_at automatically
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for rules table
CREATE TRIGGER update_rules_updated_at
    BEFORE UPDATE ON rules
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
