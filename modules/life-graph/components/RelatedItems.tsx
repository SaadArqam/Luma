import { useEffect, useState } from 'react';
import { Node, EdgeType } from '../types';

interface RelatedItemsProps {
  nodeId: string;
  edgeType?: EdgeType;
}

export const RelatedItems = ({ nodeId, edgeType }: RelatedItemsProps) => {
  const [relatedNodes, setRelatedNodes] = useState<Node[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRelated = async () => {
      try {
        const params = new URLSearchParams();
        if (edgeType) {
          params.set('edge_type', edgeType);
        }
        const res = await fetch(`/api/life-graph/nodes/${nodeId}/related?${params.toString()}`);
        if (res.ok) {
          const data = await res.json();
          setRelatedNodes(data);
        }
      } catch (error) {
        console.error('Failed to fetch related nodes:', error);
      } finally {
        setLoading(false);
      }
    };

    if (nodeId) {
      fetchRelated();
    }
  }, [nodeId, edgeType]);

  if (loading) {
    return <div className="text-gray-500 text-sm">Loading related items...</div>;
  }

  if (relatedNodes.length === 0) {
    return null;
  }

  return (
    <div className="mt-4">
      <h4 className="text-sm font-medium text-gray-700 mb-2">Related Items</h4>
      <div className="flex flex-wrap gap-2">
        {relatedNodes.map((node) => (
          <div
            key={node.id}
            className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700 capitalize"
          >
            {node.type}: {node.metadata?.title || node.external_id}
          </div>
        ))}
      </div>
    </div>
  );
};
