'use client';

import { useState } from 'react';
import { ExtractedEntity, RoutingDecision } from '../types';
import { EntityCard } from './EntityCard';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowRight, Check } from 'lucide-react';

interface CaptureReviewProps {
  entities: ExtractedEntity[];
  routing: RoutingDecision[];
  onConfirm: () => Promise<void>;
  onCancel: () => void;
  onEditEntity: (entity: ExtractedEntity) => void;
  onRemoveEntity: (entityId: string) => void;
}

export function CaptureReview({
  entities,
  routing,
  onConfirm,
  onCancel,
  onEditEntity,
  onRemoveEntity,
}: CaptureReviewProps) {
  const [isConfirming, setIsConfirming] = useState(false);
  const [editedEntities, setEditedEntities] = useState<ExtractedEntity[]>(entities);

  const handleConfirm = async () => {
    setIsConfirming(true);
    try {
      await onConfirm();
    } finally {
      setIsConfirming(false);
    }
  };

  const handleRemove = (entityId: string) => {
    setEditedEntities(editedEntities.filter(e => e.id !== entityId));
    onRemoveEntity(entityId);
  };

  if (editedEntities.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground mb-4">No entities to create</p>
        <Button onClick={onCancel}>Cancel</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-text mb-2">Review & Confirm</h2>
        <p className="text-sm text-muted-foreground">
          We found {editedEntities.length} item{editedEntities.length !== 1 ? 's' : ''} in your input.
          Review and edit before creating.
        </p>
      </div>

      <div className="space-y-3">
        {editedEntities.map((entity) => (
          <EntityCard
            key={entity.id}
            entity={entity}
            onEdit={onEditEntity}
            onRemove={handleRemove}
          />
        ))}
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-border">
        <Button variant="outline" onClick={onCancel} disabled={isConfirming}>
          Cancel
        </Button>
        <Button onClick={handleConfirm} disabled={isConfirming}>
          {isConfirming ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Creating...
            </>
          ) : (
            <>
              Create {editedEntities.length} Item{editedEntities.length !== 1 ? 's' : ''}
              <ArrowRight className="w-4 h-4 ml-2" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
