export type NodeType =
  | 'goal'
  | 'transaction'
  | 'account'
  | 'timeline_event'
  | 'insight'
  | 'task'
  | 'journal_entry'
  | 'habit'
  | string;

export interface Node {
  id: string;
  user_id: string;
  type: NodeType;
  external_id: string;
  metadata: Record<string, any>;
  created_at: Date;
  updated_at: Date;
}

export type EdgeType =
  | 'contributes_to'
  | 'created_from'
  | 'relates_to'
  | 'references'
  | 'generated_by'
  | 'affects'
  | string;

export interface Edge {
  id: string;
  user_id: string;
  from_node_id: string;
  to_node_id: string;
  type: EdgeType;
  metadata: Record<string, any>;
  created_at: Date;
}
