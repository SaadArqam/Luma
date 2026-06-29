export type CaptureSource = 'text' | 'voice' | 'image' | 'receipt' | 'screenshot' | 'pdf' | 'email' | 'sms' | 'calendar';

export type ProcessingStatus = 
  | 'pending'
  | 'normalizing'
  | 'analyzing'
  | 'extracting'
  | 'routing'
  | 'reviewing'
  | 'creating'
  | 'completed'
  | 'failed';

export type EntityType = 
  | 'transaction'
  | 'goal'
  | 'task'
  | 'reminder'
  | 'habit'
  | 'journal_entry'
  | 'contact'
  | 'note';

export type ModuleDestination = 
  | 'finance'
  | 'goals'
  | 'tasks'
  | 'reminders'
  | 'habits'
  | 'journal'
  | 'contacts'
  | 'notes';

export interface ExtractedEntity {
  id: string;
  type: EntityType;
  confidence: number;
  data: Record<string, any>;
  suggestedDestination: ModuleDestination;
  userEdited?: boolean;
}

export interface RoutingDecision {
  entityId: string;
  destination: ModuleDestination;
  handler: string;
  priority: number;
}

export interface CaptureSession {
  id: string;
  userId: string;
  source: CaptureSource;
  rawContent: string;
  normalizedContent?: string;
  detectedEntities: ExtractedEntity[];
  routingDecisions: RoutingDecision[];
  processingStatus: ProcessingStatus;
  createdEntities: Array<{
    type: EntityType;
    id: string;
    destination: ModuleDestination;
  }>;
  errorMessage?: string;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
}

export interface CaptureInput {
  source: CaptureSource;
  content: string;
  userId: string;
}

export interface CaptureResult {
  sessionId: string;
  entities: ExtractedEntity[];
  routing: RoutingDecision[];
  status: ProcessingStatus;
}

export interface EntityHandler {
  module: ModuleDestination;
  entityType: EntityType;
  priority: number;
  canHandle: (entity: ExtractedEntity) => boolean;
  handle: (entity: ExtractedEntity, userId: string) => Promise<{ id: string; success: boolean }>;
}
