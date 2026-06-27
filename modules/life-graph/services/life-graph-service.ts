import { createClient } from '@/lib/supabase-server';
import { Node, Edge, NodeType, EdgeType } from '../types';
import { v4 as uuidv4 } from 'uuid';

export class LifeGraphService {
  private static instance: LifeGraphService;

  public static getInstance(): LifeGraphService {
    if (!LifeGraphService.instance) {
      LifeGraphService.instance = new LifeGraphService();
    }
    return LifeGraphService.instance;
  }

  public async createNode(
    userId: string,
    type: NodeType,
    externalId: string,
    metadata: Record<string, any> = {}
  ): Promise<Node> {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('graph_nodes')
      .insert({
        id: uuidv4(),
        user_id: userId,
        type,
        external_id: externalId,
        metadata,
      })
      .select()
      .single();

    if (error) throw error;

    return this.transformNode(data);
  }

  public async getNode(
    userId: string,
    type: NodeType,
    externalId: string
  ): Promise<Node | null> {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('graph_nodes')
      .select()
      .eq('user_id', userId)
      .eq('type', type)
      .eq('external_id', externalId)
      .single();

    if (error) return null;

    return this.transformNode(data);
  }

  public async getNodeById(userId: string, nodeId: string): Promise<Node | null> {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('graph_nodes')
      .select()
      .eq('user_id', userId)
      .eq('id', nodeId)
      .single();

    if (error) return null;

    return this.transformNode(data);
  }

  public async createEdge(
    userId: string,
    fromNodeId: string,
    toNodeId: string,
    type: EdgeType,
    metadata: Record<string, any> = {}
  ): Promise<Edge> {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('graph_edges')
      .insert({
        id: uuidv4(),
        user_id: userId,
        from_node_id: fromNodeId,
        to_node_id: toNodeId,
        type,
        metadata,
      })
      .select()
      .single();

    if (error) throw error;

    return this.transformEdge(data);
  }

  public async getRelatedNodes(
    userId: string,
    nodeId: string,
    edgeType?: EdgeType
  ): Promise<Node[]> {
    const supabase = await createClient();

    const query = supabase
      .from('graph_edges')
      .select(
        `
        id,
        from_node_id,
        to_node_id,
        type,
        fromNode:graph_nodes!graph_edges_from_node_id_fkey!inner(*),
        toNode:graph_nodes!graph_edges_to_node_id_fkey!inner(*)
      `
      )
      .eq('user_id', userId);

    if (edgeType) {
      query.eq('type', edgeType);
    }

    const { data: edges } = await query.or(
      `from_node_id.eq.${nodeId},to_node_id.eq.${nodeId}`
    );

    if (!edges) return [];

    const nodes = new Map<string, Node>();

    edges.forEach((edge: any) => {
      if (edge.fromNode.id !== nodeId) {
        nodes.set(edge.fromNode.id, this.transformNode(edge.fromNode));
      }
      if (edge.toNode.id !== nodeId) {
        nodes.set(edge.toNode.id, this.transformNode(edge.toNode));
      }
    });

    return Array.from(nodes.values());
  }

  public async getConnectedTimelineEvents(
    userId: string,
    nodeId: string
  ): Promise<Node[]> {
    const nodes = await this.getRelatedNodes(userId, nodeId);
    return nodes.filter((node) => node.type === 'timeline_event');
  }

  public async getGraphContextForIntelligence(
    userId: string
  ): Promise<{ nodes: Node[]; edges: Edge[] }> {
    const supabase = await createClient();

    const { data: nodesData } = await supabase
      .from('graph_nodes')
      .select('*')
      .eq('user_id', userId)
      .limit(100);

    const { data: edgesData } = await supabase
      .from('graph_edges')
      .select('*')
      .eq('user_id', userId)
      .limit(100);

    return {
      nodes: (nodesData || []).map(this.transformNode),
      edges: (edgesData || []).map(this.transformEdge),
    };
  }

  private transformNode(dbNode: any): Node {
    return {
      id: dbNode.id,
      user_id: dbNode.user_id,
      type: dbNode.type,
      external_id: dbNode.external_id,
      metadata: dbNode.metadata,
      created_at: new Date(dbNode.created_at),
      updated_at: new Date(dbNode.updated_at),
    };
  }

  private transformEdge(dbEdge: any): Edge {
    return {
      id: dbEdge.id,
      user_id: dbEdge.user_id,
      from_node_id: dbEdge.from_node_id,
      to_node_id: dbEdge.to_node_id,
      type: dbEdge.type,
      metadata: dbEdge.metadata,
      created_at: new Date(dbEdge.created_at),
    };
  }
}

export const lifeGraphService = LifeGraphService.getInstance();
