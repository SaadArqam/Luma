import type { ExtractedEntity, RoutingDecision, EntityHandler } from '../types';
import { contextEngine } from '@/modules/context';

class RoutingEngine {
  private handlers: EntityHandler[] = [];

  registerHandler(handler: EntityHandler): void {
    this.handlers.push(handler);
    // Sort by priority (highest first)
    this.handlers.sort((a, b) => b.priority - a.priority);
  }

  async routeEntities(entities: ExtractedEntity[], userId?: string): Promise<RoutingDecision[]> {
    const decisions: RoutingDecision[] = [];

    // Get capture context if userId is provided
    let captureContext: any = null;
    if (userId) {
      try {
        captureContext = await contextEngine.getCaptureContext(userId);
      } catch (error) {
        console.error('Failed to get capture context:', error);
      }
    }

    for (const entity of entities) {
      // Find the best handler for this entity
      const handler = this.handlers.find(h => h.canHandle(entity));
      
      if (handler) {
        let priority = handler.priority;
        
        // Boost priority based on context
        if (captureContext) {
          // Boost priority if related to active goals
          if (entity.type === 'transaction' && captureContext.relatedGoals?.length > 0) {
            priority += 10;
          }
          // Boost priority for frequently used categories (if entity has category data)
          if ((entity as any).category && captureContext.suggestedCategories?.includes((entity as any).category)) {
            priority += 5;
          }
        }
        
        decisions.push({
          entityId: entity.id,
          destination: handler.module,
          handler: `${handler.module}.${handler.entityType}`,
          priority,
        });
      } else {
        // Use suggested destination as fallback
        decisions.push({
          entityId: entity.id,
          destination: entity.suggestedDestination,
          handler: `${entity.suggestedDestination}.${entity.type}`,
          priority: 50,
        });
      }
    }

    return decisions;
  }

  async executeRouting(
    entities: ExtractedEntity[],
    decisions: RoutingDecision[],
    userId: string
  ): Promise<Array<{ type: string; id: string; destination: string }>> {
    const createdEntities: Array<{ type: string; id: string; destination: string }> = [];

    for (const decision of decisions) {
      const entity = entities.find(e => e.id === decision.entityId);
      if (!entity) continue;

      const handler = this.handlers.find(h => 
        h.module === decision.destination && 
        h.entityType === entity.type
      );

      if (handler) {
        try {
          const result = await handler.handle(entity, userId);
          if (result.success) {
            createdEntities.push({
              type: entity.type,
              id: result.id,
              destination: decision.destination,
            });
          }
        } catch (error) {
          console.error(`Failed to handle entity ${entity.id}:`, error);
        }
      }
    }

    return createdEntities;
  }
}

// Create singleton instance
export const routingEngine = new RoutingEngine();

// Register default handlers for finance module
routingEngine.registerHandler({
  module: 'finance',
  entityType: 'transaction',
  priority: 90,
  canHandle: (entity) => entity.type === 'transaction',
  handle: async (entity, userId) => {
    // This would call the finance module to create the transaction
    // For now, return a mock result
    return {
      id: `mock-transaction-${Date.now()}`,
      success: true,
    };
  },
});

// Register default handlers for goals module
routingEngine.registerHandler({
  module: 'goals',
  entityType: 'goal',
  priority: 90,
  canHandle: (entity) => entity.type === 'goal',
  handle: async (entity, userId) => {
    // This would call the goals module to create the goal
    // For now, return a mock result
    return {
      id: `mock-goal-${Date.now()}`,
      success: true,
    };
  },
});

// Register default handlers for tasks module
routingEngine.registerHandler({
  module: 'tasks',
  entityType: 'task',
  priority: 90,
  canHandle: (entity) => entity.type === 'task',
  handle: async (entity, userId) => {
    // This would call the tasks module to create the task
    // For now, return a mock result
    return {
      id: `mock-task-${Date.now()}`,
      success: true,
    };
  },
});
