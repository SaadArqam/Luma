import { createClient } from '@/lib/supabase-server';
import type { CaptureSession, CaptureInput, CaptureResult, ProcessingStatus } from '../types';
import { normalizeInput } from '../utils/input-normalizer';
import { extractEntities } from '../utils/entity-extractor';
import { routingEngine } from './routing-engine';

export class CaptureService {
  private static instance: CaptureService;

  public static getInstance(): CaptureService {
    if (!CaptureService.instance) {
      CaptureService.instance = new CaptureService();
    }
    return CaptureService.instance;
  }

  private async createSession(input: CaptureInput): Promise<CaptureSession> {
    const supabase = await createClient();
    
    const { data, error } = await supabase
      .from('capture_sessions')
      .insert({
        user_id: input.userId,
        source: input.source,
        raw_content: input.content,
        processing_status: 'pending',
      })
      .select()
      .single();

    if (error) throw error;

    return this.mapDbToSession(data);
  }

  private async updateSession(
    sessionId: string,
    updates: Partial<CaptureSession>
  ): Promise<void> {
    const supabase = await createClient();
    
    const dbUpdates: any = {
      updated_at: new Date().toISOString(),
    };

    if (updates.processingStatus) {
      dbUpdates.processing_status = updates.processingStatus;
      if (updates.processingStatus === 'completed' || updates.processingStatus === 'failed') {
        dbUpdates.completed_at = new Date().toISOString();
      }
    }

    if (updates.normalizedContent) {
      dbUpdates.normalized_content = updates.normalizedContent;
    }

    if (updates.detectedEntities) {
      dbUpdates.detected_entities = JSON.stringify(updates.detectedEntities);
    }

    if (updates.routingDecisions) {
      dbUpdates.routing_decisions = JSON.stringify(updates.routingDecisions);
    }

    if (updates.createdEntities) {
      dbUpdates.created_entities = JSON.stringify(updates.createdEntities);
    }

    if (updates.errorMessage) {
      dbUpdates.error_message = updates.errorMessage;
    }

    const { error } = await supabase
      .from('capture_sessions')
      .update(dbUpdates)
      .eq('id', sessionId);

    if (error) throw error;
  }

  private mapDbToSession(data: any): CaptureSession {
    return {
      id: data.id,
      userId: data.user_id,
      source: data.source,
      rawContent: data.raw_content,
      normalizedContent: data.normalized_content,
      detectedEntities: data.detected_entities ? JSON.parse(data.detected_entities) : [],
      routingDecisions: data.routing_decisions ? JSON.parse(data.routing_decisions) : [],
      processingStatus: data.processing_status,
      createdEntities: data.created_entities ? JSON.parse(data.created_entities) : [],
      errorMessage: data.error_message,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
      completedAt: data.completed_at ? new Date(data.completed_at) : undefined,
    };
  }

  private async updateStatus(
    sessionId: string,
    status: ProcessingStatus
  ): Promise<void> {
    await this.updateSession(sessionId, { processingStatus: status });
  }

  public async processCapture(input: CaptureInput): Promise<CaptureResult> {
    const session = await this.createSession(input);

    try {
      // Stage 1: Normalize Input
      await this.updateStatus(session.id, 'normalizing');
      const normalized = await normalizeInput(input.content, input.source);
      await this.updateSession(session.id, { normalizedContent: normalized });

      // Stage 2: Intelligence Analysis & Entity Extraction
      await this.updateStatus(session.id, 'analyzing');
      const entities = await extractEntities(normalized, input.source);
      await this.updateSession(session.id, { detectedEntities: entities });

      // Stage 3: Routing
      await this.updateStatus(session.id, 'routing');
      const routing = await routingEngine.routeEntities(entities);
      await this.updateSession(session.id, { routingDecisions: routing });

      // Stage 4: Review (pause for user confirmation)
      await this.updateStatus(session.id, 'reviewing');

      return {
        sessionId: session.id,
        entities,
        routing,
        status: 'reviewing',
      };
    } catch (error) {
      await this.updateStatus(session.id, 'failed');
      await this.updateSession(session.id, {
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    }
  }

  public async confirmAndCreate(sessionId: string): Promise<void> {
    const supabase = await createClient();
    
    // Get session
    const { data: sessionData, error: fetchError } = await supabase
      .from('capture_sessions')
      .select('*')
      .eq('id', sessionId)
      .single();

    if (fetchError) throw fetchError;

    const session = this.mapDbToSession(sessionData);

    try {
      // Stage 5: Create Entities
      await this.updateStatus(sessionId, 'creating');
      
      const createdEntities = await routingEngine.executeRouting(
        session.detectedEntities,
        session.routingDecisions,
        session.userId
      );

      await this.updateSession(sessionId, { createdEntities });

      // Stage 6: Create Timeline Event
      await this.createTimelineEvent(session, createdEntities);

      // Stage 7: Complete
      await this.updateStatus(sessionId, 'completed');
    } catch (error) {
      await this.updateStatus(sessionId, 'failed');
      await this.updateSession(sessionId, {
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    }
  }

  private async createTimelineEvent(
    session: CaptureSession,
    createdEntities: any[]
  ): Promise<void> {
    const supabase = await createClient();

    const { error } = await supabase
      .from('timeline_events')
      .insert({
        user_id: session.userId,
        timestamp: new Date(),
        type: 'capture',
        title: `Captured ${session.source}`,
        description: session.normalizedContent || session.rawContent,
        source_module: 'capture',
        icon: 'mic',
        color: 'bg-purple-500',
        metadata: {
          sessionId: session.id,
          entitiesCreated: createdEntities.length,
          entityTypes: createdEntities.map(e => e.type),
          refreshTodayContext: true, // Signal to refresh Today Context
        },
      });

    if (error) throw error;
  }

  public async getSession(sessionId: string): Promise<CaptureSession | null> {
    const supabase = await createClient();
    
    const { data, error } = await supabase
      .from('capture_sessions')
      .select('*')
      .eq('id', sessionId)
      .single();

    if (error) return null;

    return this.mapDbToSession(data);
  }

  public async getUserSessions(userId: string, limit = 10): Promise<CaptureSession[]> {
    const supabase = await createClient();
    
    const { data, error } = await supabase
      .from('capture_sessions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;

    return data.map(d => this.mapDbToSession(d));
  }
}

export const captureService = CaptureService.getInstance();
