-- Life Graph Schema for Luma
-- Create this in your Supabase SQL Editor

-- Table: graph_nodes
CREATE TABLE IF NOT EXISTS graph_nodes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    type TEXT NOT NULL,
    external_id TEXT NOT NULL,
    metadata JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table: graph_edges
CREATE TABLE IF NOT EXISTS graph_edges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    from_node_id UUID REFERENCES graph_nodes(id) ON DELETE CASCADE NOT NULL,
    to_node_id UUID REFERENCES graph_nodes(id) ON DELETE CASCADE NOT NULL,
    type TEXT NOT NULL,
    metadata JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_graph_nodes_user_id ON graph_nodes(user_id);
CREATE INDEX IF NOT EXISTS idx_graph_nodes_type ON graph_nodes(type);
CREATE INDEX IF NOT EXISTS idx_graph_nodes_external_id ON graph_nodes(external_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_graph_nodes_user_type_external ON graph_nodes(user_id, type, external_id);

CREATE INDEX IF NOT EXISTS idx_graph_edges_user_id ON graph_edges(user_id);
CREATE INDEX IF NOT EXISTS idx_graph_edges_type ON graph_edges(type);
CREATE INDEX IF NOT EXISTS idx_graph_edges_from_node_id ON graph_edges(from_node_id);
CREATE INDEX IF NOT EXISTS idx_graph_edges_to_node_id ON graph_edges(to_node_id);

-- Row Level Security Policies
ALTER TABLE graph_nodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE graph_edges ENABLE ROW LEVEL SECURITY;

-- Policies for graph_nodes
CREATE POLICY "Users can view their own graph nodes"
    ON graph_nodes FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own graph nodes"
    ON graph_nodes FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own graph nodes"
    ON graph_nodes FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own graph nodes"
    ON graph_nodes FOR DELETE
    USING (auth.uid() = user_id);

-- Policies for graph_edges
CREATE POLICY "Users can view their own graph edges"
    ON graph_edges FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own graph edges"
    ON graph_edges FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own graph edges"
    ON graph_edges FOR DELETE
    USING (auth.uid() = user_id);

-- Function to update updated_at automatically for graph_nodes
CREATE OR REPLACE FUNCTION update_graph_nodes_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for graph_nodes table
CREATE TRIGGER update_graph_nodes_updated_at
    BEFORE UPDATE ON graph_nodes
    FOR EACH ROW
    EXECUTE FUNCTION update_graph_nodes_updated_at_column();
